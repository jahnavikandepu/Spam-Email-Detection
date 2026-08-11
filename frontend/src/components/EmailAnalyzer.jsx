import React, { forwardRef } from 'react';
import { Mail, Trash2, Search, Loader2, AlertCircle, Sparkles } from 'lucide-react';

const EmailAnalyzer = forwardRef(({
  emailText,
  setEmailText,
  onAnalyze,
  isLoading,
  error,
  setError
}, ref) => {

  const handleTextChange = (e) => {
    setEmailText(e.target.value);
    if (error) setError(null);
  };

  const handleClear = () => {
    setEmailText('');
    if (error) setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailText.trim()) {
      setError('Please paste or type email content before running detection.');
      return;
    }
    onAnalyze();
  };

  const charCount = emailText.length;
  const wordCount = emailText.trim() ? emailText.trim().split(/\s+/).length : 0;
  const isEmpty = !emailText.trim();

  return (
    <div 
      ref={ref}
      className="max-w-4xl mx-auto px-4 scroll-mt-24"
      id="email-analyzer-section"
    >
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-6 sm:p-8 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
        
        {/* Header row inside card */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <label htmlFor="email-input" className="block text-base font-bold text-slate-900 cursor-pointer">
                Enter Email Content
              </label>
              <p className="text-xs text-slate-500">Paste body, headers, or suspicious text to analyze</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            <span>{wordCount} words</span>
            <span className="mx-2">•</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        {/* Validation error message */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-700 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Validation Notice: </span>
              {error}
            </div>
          </div>
        )}

        {/* Textarea Input */}
        <form onSubmit={handleSubmit}>
          <div className="relative rounded-xl overflow-hidden group">
            <textarea
              id="email-input"
              rows={8}
              value={emailText}
              onChange={handleTextChange}
              placeholder="Paste your email content here..."
              className={`w-full p-4 text-slate-800 placeholder-slate-400 text-sm sm:text-base leading-relaxed bg-slate-50/60 border rounded-xl focus:outline-none transition-all duration-200 resize-y font-sans ${
                error 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                  : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:bg-white'
              }`}
            />
          </div>

          {/* Bottom Action Controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            
            {/* Mobile counter display */}
            <div className="text-xs text-slate-400 font-medium sm:hidden self-start">
              {wordCount} words • {charCount} chars
            </div>

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              disabled={isEmpty || isLoading}
              className={`inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isEmpty || isLoading
                  ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 active:scale-95'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>

            {/* Detect Spam Primary Submit Button */}
            <button
              type="submit"
              disabled={isEmpty || isLoading}
              className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-md ${
                isEmpty
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : isLoading
                  ? 'bg-brand-600 opacity-90 cursor-wait'
                  : 'bg-gradient-to-r from-brand-600 to-purpleBrand-600 hover:from-brand-700 hover:to-purpleBrand-700 hover:shadow-brand-500/25 active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Detect Spam</span>
                </>
              )}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
});

EmailAnalyzer.displayName = 'EmailAnalyzer';

export default EmailAnalyzer;
