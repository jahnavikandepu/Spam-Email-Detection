import React from 'react';
import { ShieldCheck, Heart, Github, ExternalLink } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200/80 pt-12 pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">SpamGuard AI</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed mb-4">
              Real-time machine learning solution for detecting spam emails, phishing alerts, and malicious messages instantly.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>API Gateway Status: Operational</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button 
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-600 transition-colors"
                >
                  Detector Tool
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('history'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-600 transition-colors"
                >
                  Scan History
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-600 transition-colors"
                >
                  Algorithm Documentation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Built With
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500">
              <li>React.js 18 + Vite</li>
              <li>Tailwind CSS</li>
              <li>REST API Architecture</li>
              <li>Machine Learning Classifier</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} SpamGuard AI Engine. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Designed for modern SaaS security workflows</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
