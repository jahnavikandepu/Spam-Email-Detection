import React from 'react';

export default function Hero() {
  return (
    <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 text-center max-w-4xl mx-auto px-4">
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
        Spam Email <span className="gradient-text">Detector</span>
      </h1>

      {/* Subheading */}
      <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">
        Analyze emails instantly and identify suspicious messages using machine learning.
      </p>
    </section>
  );
}

