import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { AG_UPPER_NORMAL_DEFAULT, normalizeAgUpper } from '../../utils/acidBase';

/**
 * Input "batas atas AG normal" — tersimpan di pengaturan (persist), berlaku sama di
 * ABG Interpreter, tab AG + Δ/Δ, dan Kalkulator Anion Gap.
 */
export function AgUpperNormalField() {
  const stored = useSettingsStore(s => s.agUpperNormal);
  const setStored = useSettingsStore(s => s.setAgUpperNormal);
  const value = normalizeAgUpper(stored);
  const [draft, setDraft] = useState(String(value));

  useEffect(() => { setDraft(String(value)); }, [value]);

  const onChange = (v: string) => {
    setDraft(v);
    const n = parseFloat(v);
    if (Number.isFinite(n) && n > 0 && n < 40) setStored(n);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="ag-upper-normal" className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
          Batas atas AG normal (lab RS)
        </label>
        <div className="flex items-center gap-2">
          {value !== AG_UPPER_NORMAL_DEFAULT && (
            <button
              type="button"
              onClick={() => onChange(String(AG_UPPER_NORMAL_DEFAULT))}
              className="text-[11px] font-bold text-primary px-2 py-1 rounded-md bg-primary/10"
            >
              Reset {AG_UPPER_NORMAL_DEFAULT}
            </button>
          )}
          <input
            id="ag-upper-normal"
            type="number"
            step="1"
            value={draft}
            onChange={e => onChange(e.target.value)}
            onBlur={() => setDraft(String(value))}
            className="w-20 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-1.5 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[13px]"
          />
          <span className="text-[11px] font-semibold text-slate-500">mEq/L</span>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Default {AG_UPPER_NORMAL_DEFAULT} (rentang klasik 8–12). Analyzer ISE modern sering punya rentang lebih rendah — sesuaikan dengan lab Anda. Dipakai juga sebagai AG acuan pada delta ratio; tersimpan & berlaku di semua kalkulator AG.
      </p>
    </div>
  );
}
