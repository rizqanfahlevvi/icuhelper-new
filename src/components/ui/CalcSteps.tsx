import React from 'react';

export interface CalcStep {
  /** Judul langkah, mis. "Langkah 1 — Total Body Water (TBW)" */
  label: string;
  /** Baris rumus + substitusi angka (monospace). Gunakan \n untuk baris baru. */
  formula?: React.ReactNode;
  /** Catatan kecil italic di bawah rumus (kenapa faktor ini, batas aman, dll.) */
  note?: React.ReactNode;
}

const TONES = {
  blue:    { border: 'border-blue-200 dark:border-blue-900/50',       accent: 'border-blue-300 dark:border-blue-700',       title: 'text-blue-700 dark:text-blue-400',       divider: 'border-blue-200 dark:border-blue-800/50' },
  red:     { border: 'border-red-200 dark:border-red-900/50',         accent: 'border-red-300 dark:border-red-700',         title: 'text-red-700 dark:text-red-400',         divider: 'border-red-200 dark:border-red-800/50' },
  amber:   { border: 'border-amber-200 dark:border-amber-900/50',     accent: 'border-amber-300 dark:border-amber-700',     title: 'text-amber-700 dark:text-amber-400',     divider: 'border-amber-200 dark:border-amber-800/50' },
  emerald: { border: 'border-emerald-200 dark:border-emerald-900/50', accent: 'border-emerald-300 dark:border-emerald-700', title: 'text-emerald-700 dark:text-emerald-400', divider: 'border-emerald-200 dark:border-emerald-800/50' },
  slate:   { border: 'border-slate-200 dark:border-slate-700',        accent: 'border-slate-300 dark:border-slate-600',     title: 'text-slate-700 dark:text-slate-300',     divider: 'border-slate-200 dark:border-slate-700' },
} as const;

export type CalcStepsTone = keyof typeof TONES;

interface CalcStepsProps {
  steps: CalcStep[];
  title?: string;
  /** Disclaimer penutup, mis. "Rumus ini estimasi awal — nilai ulang dengan lab serial." */
  footer?: React.ReactNode;
  tone?: CalcStepsTone;
}

/**
 * Blok "Rincian Perhitungan (Langkah demi Langkah)" — jembatan teori → praktik.
 * Menampilkan setiap rumus beserta substitusi angka pasien, gaya seragam
 * dengan Kalkulator Elektrolit.
 */
export function CalcSteps({ steps, title = '🧮 Rincian Perhitungan (Langkah demi Langkah)', footer, tone = 'blue' }: CalcStepsProps) {
  const t = TONES[tone];
  return (
    <div>
      <strong className={`text-[14px] ${t.title} block mb-1`}>{title}</strong>
      <div className={`bg-white/60 dark:bg-black/30 rounded-xl p-3 mt-1 border ${t.border} space-y-2.5 text-[12.5px]`}>
        {steps.map((s, i) => (
          <div key={i}>
            <p className="font-bold">{s.label}</p>
            {s.formula && (
              <p className={`font-mono text-[11.5px] mt-0.5 pl-2 border-l-2 ${t.accent} whitespace-pre-line`}>{s.formula}</p>
            )}
            {s.note && (
              <p className="text-[11px] italic opacity-80 mt-0.5">{s.note}</p>
            )}
          </div>
        ))}
        {footer && (
          <p className={`text-[11px] italic opacity-70 border-t ${t.divider} pt-2`}>{footer}</p>
        )}
      </div>
    </div>
  );
}
