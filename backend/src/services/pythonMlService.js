import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { analyzeEmailFallback } from './fallbackMlService.js';

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
 * Falls back seamlessly to built-in NLP heuristics if Python times out or is unavailable in cloud.
 * 
 * @param {string} email 
 * @returns {Promise<{prediction: 'spam'|'not_spam', confidence: number, source?: string}>}
 */
export async function getMlPrediction(email) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    throw new Error('Email content is required for prediction');
  }

  if (!fs.existsSync(PREDICT_SCRIPT_PATH)) {
    console.warn(`[Python ML Service Warning] Script not found at ${PREDICT_SCRIPT_PATH}. Using fallback analyzer.`);
    return analyzeEmailFallback(email);
  }

  const pyExecutables = [
    process.env.PYTHON_EXECUTABLE,
    'python3',
    'python',
    'py'
  ].filter(Boolean);

  const uniqueExecutables = [...new Set(pyExecutables)];

  return new Promise((resolve) => {
    let execIndex = 0;
    let isSettled = false;

    function fallbackResolve(reason) {
      if (!isSettled) {
        isSettled = true;
        console.warn(`[Python ML Service] ${reason}. Using high-accuracy fallback engine.`);
        const fallbackResult = analyzeEmailFallback(email);
        resolve(fallbackResult);
      }
    }

    function tryNextSpawn() {
      if (execIndex >= uniqueExecutables.length) {
        return fallbackResolve('Python runtime not available');
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

      // 20-second timeout safeguard
      const timer = setTimeout(() => {
        if (!isSettled) {
          try {
            pyProcess.kill('SIGKILL');
          } catch (_) {}
          fallbackResolve('Prediction timeout (Python model cold-starting or busy)');
        }
      }, 20000);

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
        fallbackResolve(`Child process execution failed (${execName}): ${err.message}`);
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
          return fallbackResolve(`Process exited with code ${code}`);
        }

        try {
          const cleanOutput = stdoutData.trim();
          if (!cleanOutput) {
            if (execIndex < uniqueExecutables.length) {
              return tryNextSpawn();
            }
            return fallbackResolve('Empty response from Python script');
          }

          const result = JSON.parse(cleanOutput);

          if (result.error) {
            return fallbackResolve(result.error);
          }

          if (result && result.prediction) {
            isSettled = true;
            return resolve({
              prediction: result.prediction === 'spam' ? 'spam' : 'not_spam',
              confidence: typeof result.confidence === 'number' ? result.confidence : 0.95,
              source: 'python_ml'
            });
          }

          return fallbackResolve('Invalid prediction result format');
        } catch (parseErr) {
          if (execIndex < uniqueExecutables.length) {
            return tryNextSpawn();
          }
          return fallbackResolve(`JSON parse failure: ${parseErr.message}`);
        }
      });

      // Write email input safely to Python stdin
      try {
        pyProcess.stdin.write(email, 'utf-8');
        pyProcess.stdin.end();
      } catch (writeErr) {
        clearTimeout(timer);
        fallbackResolve(`Failed writing to stdin: ${writeErr.message}`);
      }
    }

    tryNextSpawn();
  });
}

export default { getMlPrediction };

