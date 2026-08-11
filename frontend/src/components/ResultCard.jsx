import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Sparkles, Copy, Check, Info } from 'lucide-react';

export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = React.useState(false);

  if (!result) return null;

  const isSpam = result.prediction === 'spam';
  const confidencePercent = (result.confidence * 100).toFixed(1);

  const handleCopy = () => {
    const textToCopy = `SpamGuard Result: ${isSpam ? 'Spam Detected 🔴' : 'Not Spam 🟢'} (${confidencePercent}% confidence)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-8 animate-slide-up">
      <div 
        className={`rounded-2xl border p-6 sm:p-8 transition-all duration-300 shadow-xl overflow-hidden relative ${
          isSpam 
            ? 'bg-gradient-to-br from-white via-rose-50/40 to-rose-100/30 border-rose-200 shadow-glow-rose' 
            : 'bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/30 border-emerald-200 shadow-glow-emerald'
        }`}
      >
        {/* Top Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
          
          <div className="flex items-center space-x-4">
            {/* Status Icon */}
            <div 
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-105 ${
                isSpam 
                  ? 'bg-gradient-to-tr from-rose-600 to-red-500 shadow-rose-500/30' 
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/30'
              }`}
            >
              {isSpam ? (
                <ShieldAlert className="w-8 h-8 animate-bounce-short" />
              ) : (
                <ShieldCheck className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {isSpam ? 'Spam Detected' : 'Not Spam'}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isSpam ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isSpam ? '🔴 High Risk' : '🟢 Safe Email'}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600 mt-1">
                {isSpam 
                  ? 'This email appears to be suspicious.' 
                  : 'This email appears to be legitimate.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 self-end sm:self-center">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>

        {/* Prediction Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* Prediction Box */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-slate-200/80 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prediction Verdict
            </span>
            <div className="mt-2">
              <span className={`text-xl font-bold ${isSpam ? 'text-rose-700' : 'text-emerald-700'}`}>
                {isSpam ? 'Spam Email' : 'Legitimate (Ham)'}
              </span>
            </div>
          </div>

          {/* Confidence Progress Meter */}
          <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Confidence Score
              </span>
              <span className={`text-lg font-extrabold ${isSpam ? 'text-rose-600' : 'text-emerald-600'}`}>
                {confidencePercent}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isSpam ? 'bg-gradient-to-r from-amber-500 to-rose-600' : 'bg-gradient-to-r from-teal-500 to-emerald-600'
                }`}
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Based on feature extraction algorithms and probability mapping
            </p>
          </div>

        </div>

        {/* Additional Risk / Safe Context Factors */}
        {result.keyFactors && result.keyFactors.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-200/60">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
              <Info className="w-4 h-4 text-brand-600" />
              <span>Detected Feature Indicators:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.keyFactors.map((factor, idx) => (
                <span 
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-md font-medium ${
                    isSpam 
                      ? 'bg-rose-100/70 text-rose-800 border border-rose-200' 
                      : 'bg-emerald-100/70 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
