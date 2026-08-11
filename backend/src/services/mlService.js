import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to ml-service/predict.py
const PREDICT_SCRIPT_PATH = path.resolve(__dirname, '../../../ml-service/predict.py');

/**
 * Execute Python prediction script securely using child_process.spawn
 * @param {string} emailText 
 * @returns {Promise<{prediction: 'spam'|'not_spam', confidence: number}>}
 */
export async function getMlPrediction(emailText) {
  if (!fs.existsSync(PREDICT_SCRIPT_PATH)) {
    throw new Error(`ML predict script not found at ${PREDICT_SCRIPT_PATH}`);
  }

  const primaryExec = process.env.PYTHON_EXECUTABLE || 'py';
  const fallbackExec = primaryExec === 'py' ? 'python' : 'py';

  return new Promise((resolve, reject) => {
    function trySpawn(execName) {
      const pyProcess = spawn(execName, [PREDICT_SCRIPT_PATH], {
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdoutData = '';
      let stderrData = '';

      pyProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      pyProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      pyProcess.on('error', (err) => {
        if (execName !== fallbackExec) {
          console.warn(`[ML Service Warning] Failed with '${execName}', trying fallback '${fallbackExec}'...`);
          return trySpawn(fallbackExec);
        }
        reject(new Error(`Failed to execute Python process with '${execName}': ${err.message}`));
      });

      pyProcess.on('close', (code) => {
        if (stderrData && stderrData.trim()) {
          console.warn(`[Python stderr]: ${stderrData.trim()}`);
        }

        if (code !== 0 && !stdoutData.trim()) {
          return reject(new Error(`Python predict.py exited with code ${code}. Error: ${stderrData}`));
        }

        try {
          const result = JSON.parse(stdoutData.trim());
          if (result.error) {
            return reject(new Error(result.error));
          }
          if (result && result.prediction) {
            return resolve({
              prediction: result.prediction,
              confidence: typeof result.confidence === 'number' ? result.confidence : 0.95
            });
          }
          reject(new Error('Invalid JSON structure returned from predict.py'));
        } catch (parseErr) {
          reject(new Error(`Failed to parse ML output JSON: ${parseErr.message}. Raw output: ${stdoutData}`));
        }
      });

      // Pass email text safely over stdin
      pyProcess.stdin.write(emailText);
      pyProcess.stdin.end();
    }

    trySpawn(primaryExec);
  });
}
