import React, { type Dispatch, type SetStateAction } from 'react';

type StrSetter = Dispatch<SetStateAction<string>>;

// Blok UI bersama untuk modul Koreksi Elektrolit (Na/K/Ca/Mg).
// Semua ukuran teks memakai kelas text-[Npx] yang sudah punya override --font-scale di index.css.

export const inputCls = 'w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all';
export const selectCls = 'flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all';

export function FieldRow({ label, sub, children }: { label: React.ReactNode; sub?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
        {label}
        {sub && <span className="block font-normal text-slate-500 dark:text-slate-400 text-[11px]">{sub}</span>}
      </span>
      {children}
    </div>
  );
}

export function NumField({ value, onChange, placeholder, unit, step = 'any' }: { value: string; onChange: StrSetter; placeholder?: string; unit?: string; step?: string }) {
  return (
    <div className="flex-1 flex items-center justify-end gap-2">
      <input type="number" step={step} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
      {unit !== undefined && <span className="text-xs font-semibold text-slate-500 w-12 text-left">{unit}</span>}
    </div>
  );
}

export interface ChipOption { value: string; label: string; note?: string }

/** Input target + chip rujukan. Pengguna bisa mengetik bebas atau memilih saran ber-referensi. */
export function TargetField({ label, sub, value, onChange, unit, step, options }: {
  label: React.ReactNode; sub?: React.ReactNode; value: string; onChange: StrSetter; unit: string; step?: string; options: ChipOption[];
}) {
  const active = options.find(o => o.value === value);
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
          {label}
          {sub && <span className="block font-normal text-slate-500 dark:text-slate-400 text-[11px]">{sub}</span>}
        </span>
        <NumField value={value} onChange={onChange} unit={unit} step={step} />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {options.map(o => (
          <button key={o.value + o.label} type="button" onClick={() => onChange(o.value)}
            className={`text-[11px] px-2 py-1 rounded-lg border transition-colors ${value === o.value ? 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300 font-semibold' : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {o.value} · {o.label}
          </button>
        ))}
      </div>
      {active?.note && <p className="mt-1.5 text-[11px] italic text-slate-500 dark:text-slate-400 leading-relaxed">{active.note}</p>}
    </div>
  );
}

/** Daftar toggle (checklist) — dipakai untuk gejala, faktor risiko, temuan EKG. */
export function ToggleList({ title, hint, items, selected, onToggle, tone = 'slate' }: {
  title: React.ReactNode; hint?: React.ReactNode; items: string[]; selected: Set<string>; onToggle: ReturnType<typeof useToggleSet>[1]; tone?: 'slate' | 'red' | 'amber';
}) {
  const on = tone === 'red'
    ? 'bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-300 font-semibold'
    : tone === 'amber'
      ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold'
      : 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300 font-semibold';
  return (
    <div className="px-4 py-3">
      <div className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</div>
      {hint && <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">{hint}</p>}
      <div className="flex flex-wrap gap-1.5">
        {items.map(s => (
          <button key={s} type="button" onClick={() => onToggle(s)}
            className={`text-[12px] px-2.5 py-1.5 rounded-lg border transition-colors ${selected.has(s) ? on : 'bg-slate-100/80 dark:bg-white/5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Helper state untuk Set toggle. */
export function useToggleSet(initial: string[] = []) {
  const [set, setSet] = React.useState<Set<string>>(new Set(initial));
  const toggle = (s: string) => setSet(prev => {
    const next = new Set(prev);
    if (next.has(s)) next.delete(s); else next.add(s);
    return next;
  });
  return [set, toggle, setSet] as const;
}

export type FlowState = 'now' | 'todo' | 'done' | 'skip';
export interface FlowStep { title: string; body: React.ReactNode; state?: FlowState }

/**
 * "Alur Strategi Koreksi" — urutan langkah klinis bernomor. Langkah yang relevan untuk
 * pasien ini ditandai 'now' (aktif), yang tidak relevan 'skip' (dipudarkan).
 */
export function StrategyFlow({ title = '🧭 Alur Strategi Koreksi', steps }: { title?: string; steps: FlowStep[] }) {
  return (
    <div className="w-full bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-left shadow-sm">
      <div className="text-[13px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">{title}</div>
      <ol className="space-y-3">
        {steps.map((s, i) => {
          const st = s.state ?? 'todo';
          const badge = st === 'now'
            ? 'bg-blue-600 text-white'
            : st === 'done'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200';
          return (
            <li key={i} className={`flex gap-3 ${st === 'skip' ? 'opacity-50' : ''}`}>
              <span className={`flex-shrink-0 w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center ${badge}`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-bold ${st === 'now' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {s.title}{st === 'skip' && <span className="ml-1 text-[11px] font-normal italic">(tidak relevan saat ini)</span>}
                </div>
                <div className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">{s.body}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Kotak info kecil berwarna. */
export function InfoBox({ tone = 'slate', title, children }: { tone?: 'slate' | 'red' | 'amber' | 'emerald' | 'blue'; title?: React.ReactNode; children: React.ReactNode }) {
  const cls = {
    slate: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300',
    blue: 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-200',
  }[tone];
  return (
    <div className={`w-full rounded-xl border p-3 text-[12px] leading-relaxed text-left ${cls}`}>
      {title && <div className="font-bold text-[13px] mb-1">{title}</div>}
      {children}
    </div>
  );
}

export function RefLine({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] italic text-slate-500 dark:text-slate-400 w-full text-center border-t border-slate-200 dark:border-slate-700 pt-3">📚 {children}</p>;
}

export function Disclaimer() {
  return <p className="text-[10px] italic text-slate-500 dark:text-slate-400 w-full text-center">Alat bantu edukasi &amp; referensi cepat — bukan pengganti penilaian klinis atau keputusan DPJP.</p>;
}

export const fmt = (n: number, d = 1) => (Number.isFinite(n) ? n.toFixed(d) : '–');
