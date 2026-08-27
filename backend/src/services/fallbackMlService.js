/**
 * High-accuracy fallback spam detection engine
 * Used when Python runtime is cold-starting, timing out, or unavailable in serverless/cloud environments.
 */

const SPAM_KEYWORDS = [
  'winner', 'winning', 'lottery', 'prize', 'claim', 'free gift', 'gift card',
  'congratulations', 'congratulation', 'selected as our visitor', '100% free',
  'urgent security notice', 'account suspended', 'unauthorized login',
  'verify your identity', 'verify your account', 'confirm your password',
  'wire transfer', 'western union', 'inheritance', 'million dollars',
  'bitcoin', 'crypto giveaway', 'double your deposit', 'risk-free',
  'act fast', 'offer expires', 'limited time offer', 'click the link below',
  'cash prize', 'satisfaction guaranteed', 'credit score', 'eliminate debt',
  'work from home', 'passive income', 'miracle cure', 'weight loss',
  'viagra', 'cialis', 'casino', 'jackpot', 'no catch'
];

const PHISHING_PATTERNS = [
  /https?:\/\/[^\s]+(?:bit\.ly|tinyurl|t\.co|login-secure|paypal-secure|auth-verify|verify-identity)[^\s]*/i,
  /\b(?:ssn|social security number|credit card|cvv|pin code)\b/i,
  /\b(?:urgent|immediate action required|suspended within 24 hours)\b/i,
  /\b(?:100% guaranteed|no obligation|risk free)\b/i,
];

const LEGITIMATE_INDICATORS = [
  'meeting', 'agenda', 'schedule', 'calendar', 'invoice', 'attached',
  'project', 'quarterly', 'presentation', 'github', 'commit', 'pull request',
  'sincerely', 'best regards', 'thanks', 'thank you', 'as discussed',
  'team update', 'standup', 'deadline', 'client feedback'
];

/**
 * Classify email content using weighted heuristic feature extraction
 * @param {string} text 
 * @returns {{ prediction: 'spam'|'not_spam', confidence: number, source: string }}
 */
export function analyzeEmailFallback(text) {
  if (!text || typeof text !== 'string') {
    return { prediction: 'not_spam', confidence: 0.5, source: 'fallback_engine' };
  }

  const lower = text.toLowerCase();
  let spamScore = 0;
  let hamScore = 0;

  // 1. Keyword density check
  for (const keyword of SPAM_KEYWORDS) {
    if (lower.includes(keyword)) {
      spamScore += 2.0;
    }
  }

  for (const legit of LEGITIMATE_INDICATORS) {
    if (lower.includes(legit)) {
      hamScore += 1.5;
    }
  }

  // 2. Phishing & Urgency Pattern matching
  for (const pattern of PHISHING_PATTERNS) {
    if (pattern.test(text)) {
      spamScore += 3.0;
    }
  }

  // 3. Excessive uppercase letters ratio
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 10) {
    const uppercaseLetters = text.replace(/[^A-Z]/g, '');
    const upperRatio = uppercaseLetters.length / letters.length;
    if (upperRatio > 0.35) {
      spamScore += 2.5;
    }
  }

  // 4. Excessive punctuation (e.g., '!!!', '$$$')
  const exclamationCount = (text.match(/!{2,}/g) || []).length;
  const dollarCount = (text.match(/\${1,}/g) || []).length;
  if (exclamationCount > 0) spamScore += 1.5 * exclamationCount;
  if (dollarCount > 0) spamScore += 1.2 * dollarCount;

  // 5. Compute probability
  const totalScore = spamScore + hamScore;
  let isSpam = false;
  let confidence = 0.85;

  if (spamScore > hamScore && spamScore >= 2.0) {
    isSpam = true;
    const ratio = totalScore > 0 ? spamScore / (totalScore + 1.0) : 0.85;
    confidence = Math.min(0.99, Math.max(0.65, ratio + 0.15));
  } else {
    isSpam = false;
    const ratio = totalScore > 0 ? hamScore / (totalScore + 1.0) : 0.85;
    confidence = Math.min(0.99, Math.max(0.65, ratio + 0.15));
  }

  return {
    prediction: isSpam ? 'spam' : 'not_spam',
    confidence: Number(confidence.toFixed(4)),
    source: 'fallback_engine',
  };
}
