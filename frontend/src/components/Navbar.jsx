import React, { useState } from 'react';
import { ShieldCheck, History, Info, Home, Search, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onCheckEmailClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckEmail = () => {
    setActivePage('home');
    setMobileMenuOpen(false);
    if (onCheckEmailClick) {
      setTimeout(() => {
        onCheckEmailClick();
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-purpleBrand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-900 font-sans">SpamGuard</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Machine Learning Shield</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activePage === 'home'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick('history')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activePage === 'history'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activePage === 'about'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleCheckEmail}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purpleBrand-600 hover:from-brand-700 hover:to-purpleBrand-700 shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-200 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Check Email</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2 shadow-lg animate-fade-in">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
              activePage === 'home' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleNavClick('history')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
              activePage === 'history' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <History className="w-5 h-5" />
            <span>History</span>
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
              activePage === 'about' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Info className="w-5 h-5" />
            <span>About</span>
          </button>
          <div className="pt-2">
            <button
              onClick={handleCheckEmail}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purpleBrand-600 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Check Email Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
