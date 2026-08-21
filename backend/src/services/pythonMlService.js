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
    'python3',
    'python',
    'py'
  ].filter(Boolean);

  const uniqueExecutables = [...new Set(pyExecutables)];

  return new Promise((resolve, reject) => {
    let execIndex = 0;

    function tryNextSpawn() {
      if (execIndex >= uniqueExecutables.length) {
        return reject(new Error('Python runtime not found. Please ensure Python 3 is installed.'));
      }

      const execName = uniqueExecutables[execIndex];
      execIndex++;

      const pyProcess = spawn(execName, [PREDICT_SCRIPT_PATH], {
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdoutData = '';
      let stderrData = '';

      pyProcess.stdout.on('data', (chunk) => {
        stdoutData += chunk.toString('utf-8');
      });

      pyProcess.stderr.on('data', (chunk) => {
        stderrData += chunk.toString('utf-8');
      });

      pyProcess.on('error', (err) => {
        if (err.code === 'ENOENT' && execIndex < uniqueExecutables.length) {
          return tryNextSpawn();
        }
        console.error(`[Python ML Service Error] Child process failed (${execName}):`, err.message);
        reject(new Error('Failed to execute Python prediction engine'));
      });

      pyProcess.on('close', (code) => {
        if (stderrData && stderrData.trim()) {
          console.warn(`[Python ML Service stderr]: ${stderrData.trim()}`);
        }

        if (code !== 0 && !stdoutData.trim()) {
          console.error(`[Python ML Service Error] Process exited with code ${code}`);
          return reject(new Error('Prediction model execution failed'));
        }

        try {
          const cleanOutput = stdoutData.trim();
          if (!cleanOutput) {
            return reject(new Error('Empty response from prediction model'));
          }

          const result = JSON.parse(cleanOutput);

          if (result.error) {
            return reject(new Error(result.error));
          }

          if (result && result.prediction) {
            return resolve({
              prediction: result.prediction === 'spam' ? 'spam' : 'not_spam',
              confidence: typeof result.confidence === 'number' ? result.confidence : 0.95
            });
          }

          reject(new Error('Invalid prediction result payload format'));
        } catch (parseErr) {
          console.error(`[Python ML Service Error] JSON parse failure. Raw output: "${stdoutData}"`);
          reject(new Error('Failed to parse prediction result from ML model'));
        }
      });

      // Write email input safely to Python stdin
      try {
        pyProcess.stdin.write(email, 'utf-8');
        pyProcess.stdin.end();
      } catch (writeErr) {
        console.error('[Python ML Service Error] Failed writing to stdin:', writeErr.message);
        reject(new Error('Failed sending input text to prediction model'));
      }
    }

    tryNextSpawn();
  });
}

export default { getMlPrediction };
