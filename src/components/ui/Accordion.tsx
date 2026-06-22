import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  key?: string | number;
}

export function Accordion({ title, children, defaultOpen = false, className = '' }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`mt-6 mb-6 ${className}`}>
      <div className={`bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all duration-300 rounded-2xl`}>
        <button 
          className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50/50 dark:bg-[#2C2C2E]/50 text-left min-h-[50px] transition-colors focus:outline-none focus:bg-slate-100 dark:focus:bg-[#3C3C3E]"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span className="flex-1 text-[13px] font-bold text-slate-700 dark:text-slate-200 tracking-wide">{title}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-[#1C1C1E] text-[13px] leading-relaxed text-slate-600 dark:text-slate-400 animate-in fade-in slide-in-from-top-1 duration-300">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
