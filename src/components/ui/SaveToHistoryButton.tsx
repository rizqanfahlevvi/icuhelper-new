import React, { useState } from 'react';
import { useHistoryStore } from '../../store/useHistoryStore';
import { FileText, Check } from 'lucide-react';
import { haptic } from '../../utils/haptics';

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
    haptic('success');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <button
      onClick={handleSave}
      className={`min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        saved
          ? 'bg-emerald-500 text-white'
          : 'bg-white dark:bg-[var(--dk-surface-1)] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[var(--dk-surface-2)]'
      } ${className}`}
    >
      {saved ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
      {saved ? 'Tersimpan' : 'Simpan Riwayat'}
    </button>
  );
}
