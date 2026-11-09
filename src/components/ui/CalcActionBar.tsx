import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Calculator, ChevronDown, AlertCircle } from 'lucide-react';
import { focusInput, scrollToId, type RequiredInput } from '../../hooks/useCalcTrigger';

export type CalcTone = 'neutral' | 'good' | 'warn' | 'bad' | 'info';

const TONE_CLS: Record<CalcTone, string> = {
  neutral: 'text-[var(--label-primary)]',
  good: 'text-[var(--sys-green)]',
  warn: 'text-amber-600 dark:text-amber-400',
  bad: 'text-[var(--sys-red)]',
  info: 'text-[var(--sys-blue)]',
};

interface Props {
  /** 'button' = tombol Hitung lalu ringkasan; 'live' = selalu ringkasan (skoring ketuk-pilih). */
  mode?: 'button' | 'live';
  /** Sudah ditekan sekali (mode button). Abaikan untuk mode live. */
  armed?: boolean;
  onCalculate?: () => void;
  /** Label tombol (default "Hitung"). */
  label?: string;
  /** Ringkasan hasil utama, mis. "P/F 136 · ARDS sedang". null = belum ada hasil. */
  summary?: ReactNode;
  summaryTone?: CalcTone;
  /** Keterangan kecil di bawah ringkasan. */
  caption?: ReactNode;
  /** Input wajib yang masih kosong (dari useCalcTrigger). */
  missing?: RequiredInput[];
  /** id elemen rincian hasil — ringkasan diketuk → gulir ke sana. */
  resultTargetId?: string;
  /** Teks saat aktif/live tetapi hasil belum bisa dihitung. */
  emptyText?: string;
}

/**
 * Bilah aksi kalkulator yang selalu terlihat di bawah layar (di atas nav bawah).
 * Dirender lewat portal ke <body> agar posisi fixed tidak terkurung transform pembungkus halaman.
 * Juga menyisipkan spacer di alur halaman supaya konten terakhir tidak tertutup bilah.
 */
export function CalcActionBar({
  mode = 'button', armed = false, onCalculate, label = 'Hitung', summary, summaryTone = 'neutral', caption,
  missing = [], resultTargetId, emptyText = 'Lengkapi data untuk melihat hasil',
}: Props) {
  const showButton = mode === 'button' && !armed;
  const hasMissing = missing.length > 0;

  let body: ReactNode;
  if (showButton) {
    body = (
      <button
        type="button"
        onClick={onCalculate}
        className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-[var(--accent-fg)] font-bold text-[15px] shadow-sm active:scale-[0.98] transition-transform"
      >
        <Calculator className="w-5 h-5" /> {label}
      </button>
    );
  } else if (hasMissing && !summary) {
    body = (
      <button
        type="button"
        onClick={() => focusInput(missing[0].id)}
        className="w-full min-h-[48px] flex items-center gap-2.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left"
      >
        <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-bold text-amber-700 dark:text-amber-300">Lengkapi: {missing.map(m => m.label).join(' · ')}</span>
          <span className="block text-[11px] text-[var(--label-secondary)]">Ketuk untuk menuju isian · hasil muncul otomatis</span>
        </span>
      </button>
    );
  } else if (summary) {
    body = (
      <button
        type="button"
        onClick={() => resultTargetId && scrollToId(resultTargetId)}
        className="w-full min-h-[48px] flex items-center gap-2.5 px-3 rounded-xl bg-[var(--fill-secondary)] text-left"
        aria-label="Lihat rincian hasil"
      >
        <span className="min-w-0 flex-1" aria-live="polite">
          <span className={`block text-[15px] font-extrabold leading-tight truncate ${TONE_CLS[summaryTone]}`}>{summary}</span>
          <span className="block text-[11px] text-[var(--label-secondary)] truncate">
            {caption ?? (mode === 'button' ? 'Diperbarui otomatis saat input berubah' : 'Ketuk untuk rincian')}
          </span>
        </span>
        {resultTargetId && (
          <span className="shrink-0 flex items-center gap-0.5 text-[12px] font-bold text-[var(--accent)]">
            Rincian <ChevronDown className="w-4 h-4" />
          </span>
        )}
      </button>
    );
  } else {
    body = (
      <div className="w-full min-h-[48px] flex items-center px-3 rounded-xl bg-[var(--fill-secondary)] text-[13px] text-[var(--label-secondary)]">
        {emptyText}
      </div>
    );
  }

  const bar = (
    <div
      className="fixed z-30 inset-x-0 bottom-[var(--bottom-nav-h,74px)] md:bottom-4 md:left-auto md:right-6 md:w-[420px] px-3 py-2 md:p-2 bg-[var(--material-chrome)] border-t md:border border-[var(--separator)] md:rounded-2xl shadow-[var(--shadow-2)]"
      role="region"
      aria-label="Hasil kalkulator"
    >
      {body}
    </div>
  );

  return (
    <>
      <div aria-hidden className="h-16 md:h-20" />
      {typeof document !== 'undefined' ? createPortal(bar, document.body) : null}
    </>
  );
}
