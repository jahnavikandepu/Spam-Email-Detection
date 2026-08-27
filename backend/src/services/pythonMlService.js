import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate backend/predict.py script with candidate fallbacks
const candidateScriptPaths = [
  path.resolve(__dirname, '../../predict.py'),
  path.resolve(process.cwd(), 'backend/predict.py'),
  path.resolve(process.cwd(), 'predict.py'),
  path.resolve(__dirname, '../../../predict.py'),
  path.resolve(__dirname, '../predict.py'),
];

const PREDICT_SCRIPT_PATH = candidateScriptPaths.find(p => fs.existsSync(p)) || candidateScriptPaths[0];

/**
 * Execute Python predict.py script using child_process.spawn
 * Passes email text safely via stdin and receives JSON from stdout.
 * 
 * @param {string} email 
 * @returns {Promise<{prediction: 'spam'|'not_spam', confidence: number}>}
 */
export async function getMlPrediction(email) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    throw new Error('Email content is required for prediction');
  }

  if (!fs.existsSync(PREDICT_SCRIPT_PATH)) {
    console.error(`[Python ML Service Error] Script not found at ${PREDICT_SCRIPT_PATH}`);
    throw new Error('Machine Learning model script unavailable');
  }

  const pyExecutables = [
    process.env.PYTHON_EXECUTABLE,
    'py',
    'python',
    'python3'
  ].filter(Boolean);

  const uniqueExecutables = [...new Set(pyExecutables)];

  return new Promise((resolve, reject) => {
    let execIndex = 0;
    let isSettled = false;

    function tryNextSpawn() {
      if (execIndex >= uniqueExecutables.length) {
        if (!isSettled) {
          isSettled = true;
          return reject(new Error('Python runtime not found. Please ensure Python 3 is installed.'));
        }
        return;
      }

      const execName = uniqueExecutables[execIndex];
      execIndex++;

      let pyProcess;
      try {
        pyProcess = spawn(execName, [PREDICT_SCRIPT_PATH], {
          windowsHide: true,
          stdio: ['pipe', 'pipe', 'pipe']
        });
      } catch (err) {
        return tryNextSpawn();
      }

      // 15-second timeout safeguard
      const timer = setTimeout(() => {
        if (!isSettled) {
          try {
            pyProcess.kill();
          } catch (_) {}
          isSettled = true;
          reject(new Error('Prediction timeout: Python model took too long to respond.'));
        }
      }, 15000);

      let stdoutData = '';
      let stderrData = '';

      pyProcess.stdout.on('data', (chunk) => {
        stdoutData += chunk.toString('utf-8');
      });

      pyProcess.stderr.on('data', (chunk) => {
        stderrData += chunk.toString('utf-8');
      });

      pyProcess.on('error', (err) => {
        clearTimeout(timer);
        if (err.code === 'ENOENT' && execIndex < uniqueExecutables.length && !isSettled) {
          return tryNextSpawn();
        }
        if (!isSettled) {
          isSettled = true;
          console.error(`[Python ML Service Error] Child process failed (${execName}):`, err.message);
          reject(new Error('Failed to execute Python prediction engine'));
        }
      });

      pyProcess.on('close', (code) => {
        clearTimeout(timer);
        if (isSettled) return;

        if (stderrData && stderrData.trim()) {
          console.warn(`[Python ML Service stderr]: ${stderrData.trim()}`);
        }

        if (code !== 0 && !stdoutData.trim()) {
          if (execIndex < uniqueExecutables.length) {
            return tryNextSpawn();
          }
          isSettled = true;
          console.error(`[Python ML Service Error] Process exited with code ${code}`);
          return reject(new Error('Prediction model execution failed'));
        }

        try {
          const cleanOutput = stdoutData.trim();
          if (!cleanOutput) {
            if (execIndex < uniqueExecutables.length) {
              return tryNextSpawn();
            }
            isSettled = true;
            return reject(new Error('Empty response from prediction model'));
          }

          const result = JSON.parse(cleanOutput);

          if (result.error) {
            isSettled = true;
            return reject(new Error(result.error));
          }

          if (result && result.prediction) {
            isSettled = true;
            return resolve({
              prediction: result.prediction === 'spam' ? 'spam' : 'not_spam',
              confidence: typeof result.confidence === 'number' ? result.confidence : 0.95
            });
          }

          isSettled = true;
          reject(new Error('Invalid prediction result payload format'));
        } catch (parseErr) {
          if (execIndex < uniqueExecutables.length) {
            return tryNextSpawn();
          }
          isSettled = true;
          console.error(`[Python ML Service Error] JSON parse failure. Raw output: "${stdoutData}"`);
          reject(new Error('Failed to parse prediction result from ML model'));
        }
      });

      // Write email input safely to Python stdin
      try {
        pyProcess.stdin.write(email, 'utf-8');
        pyProcess.stdin.end();
      } catch (writeErr) {
        clearTimeout(timer);
        if (!isSettled) {
          isSettled = true;
          console.error('[Python ML Service Error] Failed writing to stdin:', writeErr.message);
          reject(new Error('Failed sending input text to prediction model'));
        }
      }
    }

    tryNextSpawn();
  });
}

export default { getMlPrediction };
