import React from 'react';
import { EXAMPLE_EMAILS } from '../data/examples';
import { Sparkles, AlertOctagon, MailCheck, Megaphone } from 'lucide-react';

export default function ExampleEmails({ onSelectExample }) {
  
  const getIcon = (id) => {
    switch (id) {
      case 'promo':
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'suspicious':
        return <AlertOctagon className="w-4 h-4 text-rose-600" />;
      case 'normal':
        return <MailCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-600" />;
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-4 h-4 text-brand-600" />
        <h3 className="text-sm font-bold text-slate-700 tracking-wide uppercase">
          Try an Example
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {EXAMPLE_EMAILS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectExample(item.content)}
            className="group flex flex-col items-start p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 text-left active:scale-[0.98]"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-brand-50 transition-colors">
                  {getIcon(item.id)}
                </div>
                <span className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.type === 'spam' 
                  ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                {item.badge}
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              "{item.content.replace(/\n+/g, ' ')}"
            </p>

            <span className="mt-3 text-[11px] font-semibold text-brand-600 group-hover:underline inline-flex items-center space-x-1">
              <span>Load Into Textarea</span>
              <span>→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
