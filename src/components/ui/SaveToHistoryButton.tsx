import React, { useState } from 'react';
import { useHistoryStore } from '../../store/useHistoryStore';
import { FileText, Check } from 'lucide-react';

interface Props {
  module: string;
  label: string;
  inputs: Record<string, any>;
  summary: string;
  className?: string;
}

export function SaveToHistoryButton({ module, label, inputs, summary, className = '' }: Props) {
  const addHistory = useHistoryStore((state) => state.addEntry);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    addHistory(module, label, inputs, summary);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <button
      onClick={handleSave}
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        saved
          ? 'bg-emerald-500 text-white'
          : 'bg-white dark:bg-[#1C1C1E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#2C2C2E]'
      } ${className}`}
    >
      {saved ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
      {saved ? 'Tersimpan' : 'Simpan Riwayat'}
    </button>
  );
}
