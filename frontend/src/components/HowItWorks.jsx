import React from 'react';
import { FileText, Cpu, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Enter Email',
      description: 'Paste the email body, header, or message content into the analysis area.',
      icon: <FileText className="w-6 h-6 text-brand-600" />,
    },
    {
      number: '02',
      title: 'Analyze',
      description: 'Our machine-learning model processes the text structure, patterns, and indicators.',
      icon: <Cpu className="w-6 h-6 text-purpleBrand-600" />,
    },
    {
      number: '03',
      title: 'Get Result',
      description: 'Instantly see whether the email is Spam or Not Spam with confidence scoring.',
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      
      {/* Section Title */}
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Simple Workflow
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
          How SpamGuard Works
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Get real-time intelligent protection against phishing, fraudulent offers, and malicious spam in 3 fast steps.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        
        {steps.map((step, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft hover:shadow-lg transition-all duration-300 relative group flex flex-col justify-between"
          >
            <div>
              {/* Step Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <span className="text-3xl font-extrabold text-slate-200 group-hover:text-brand-300 transition-colors">
                  {step.number}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-brand-600 font-semibold">
              <span>Step {step.number} of 03</span>
              <span>→</span>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
