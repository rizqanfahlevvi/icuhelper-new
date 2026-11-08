import React, { useState } from 'react';
import { Activity, Wind, Droplet, Layers, HeartPulse, FlaskConical, FileText, Clock } from 'lucide-react';
import { useClinicalStore } from '../../store/useClinicalStore';
import {
  CLINICAL_GROUPS,
  CLINICAL_KEYS,
  CLINICAL_VARIABLES,
  type ClinicalGroup,
  type ClinicalKey,
} from '../../utils/clinicalVariables';
import { formatDataAge, formatDataTimestamp } from '../../utils/patientContext';

type FormGroup = (typeof CLINICAL_GROUPS)[number]['id'];

const GROUP_ICON: Record<FormGroup, React.ComponentType<{ className?: string }>> = {
  vital: Activity,
  respirasi: Wind,
  hematologi: Droplet,
  kimia: Layers,
  ginjalHati: HeartPulse,
  elektrolit: FlaskConical,
};

const keysOf = (group: ClinicalGroup): ClinicalKey[] =>
  CLINICAL_KEYS.filter((k) => CLINICAL_VARIABLES[k].group === group && !CLINICAL_VARIABLES[k].demographic);

/** MAP = TDD + (TDS − TDD)/3 (perkiraan klinis standar untuk denyut normal). */
function estimateMap(sys: string, dia: string): string | null {
  const s = parseFloat(sys);
  const d = parseFloat(dia);
  if (!Number.isFinite(s) || !Number.isFinite(d) || s <= 0 || d <= 0 || d > s) return null;
  return String(Math.round(d + (s - d) / 3));
}

/**
 * Form data klinis & lab pasien aktif, dibangun dari registri variabel
 * (utils/clinicalVariables.ts). Setiap perubahan langsung masuk ke data kerja
 * dan tersimpan otomatis ke pasien aktif (store/patientContextSync.ts).
 */
export function ClinicalDataForm() {
  const data = useClinicalStore((s) => s.data);
  const updatedAt = useClinicalStore((s) => s.updatedAt);
  const setField = useClinicalStore((s) => s.setField);
  const setFields = useClinicalStore((s) => s.setFields);
  const [tab, setTab] = useState<FormGroup>('vital');

  const handleChange = (key: ClinicalKey, value: string) => {
    if (key === 'systolic' || key === 'diastolic') {
      const sys = key === 'systolic' ? value : data.systolic || '';
      const dia = key === 'diastolic' ? value : data.diastolic || '';
      const map = estimateMap(sys, dia);
      setFields(map ? { [key]: value, map } : { [key]: value });
      return;
    }
    setField(key, value);
  };

  const filledCount = (group: ClinicalGroup) => keysOf(group).filter((k) => (data[k] || '') !== '').length;

  return (
    <div className="space-y-5">
      {/* Diagnosis */}
      <div className="flex flex-col gap-1.5 p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5">
        <label htmlFor="cdf-diagnosis" className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> Diagnosis Utama
        </label>
        <input
          id="cdf-diagnosis"
          type="text"
          placeholder="Contoh: Syok sepsis ec pneumonia, ARDS sedang…"
          value={data.diagnosis || ''}
          onChange={(e) => setField('diagnosis', e.target.value)}
          className="w-full px-4 py-2 bg-background border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
        />
      </div>

      {/* Tab kelompok */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-[var(--separator)] -mx-1 px-1 no-scrollbar" role="tablist">
        {CLINICAL_GROUPS.map((g) => {
          const Icon = GROUP_ICON[g.id];
          const n = filledCount(g.id);
          const active = tab === g.id;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(g.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-muted hover:bg-muted/70 text-muted-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {g.label}
              {n > 0 && (
                <span className={`ml-0.5 min-w-[18px] px-1 py-0.5 rounded-full text-[10px] leading-none ${active ? 'bg-white/20 dark:bg-black/15' : 'bg-teal-500/15 text-teal-700 dark:text-teal-300'}`}>
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === 'respirasi' && (
        <p className="text-[11px] text-muted-foreground -mt-2">
          Isi dengan hasil <strong>AGD arteri</strong>. Hasil gas vena (VBG) jangan dimasukkan di sini — interpretasikan langsung di modul AGD.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
        {keysOf(tab).map((key) => {
          const meta = CLINICAL_VARIABLES[key];
          const value = data[key] || '';
          const age = formatDataAge(updatedAt[key]);
          const id = `cdf-${key}`;
          return (
            <div key={key} className="flex flex-col gap-1">
              <label htmlFor={id} className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between gap-2">
                <span>{meta.label}</span>
                {key === 'map' && (
                  <span className="text-[9px] bg-teal-500/10 text-teal-700 dark:text-teal-400 px-1 py-0.5 rounded uppercase leading-none font-extrabold">Auto</span>
                )}
              </label>
              <div className="relative">
                <input
                  id={id}
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={meta.example ? `Contoh: ${meta.example}` : ''}
                  className="w-full pl-4 pr-16 py-2 bg-background border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                />
                {meta.unit && (
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">
                    {meta.unit}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-2 min-h-[14px]">
                {meta.hint ? <span className="text-[10px] text-muted-foreground leading-snug">{meta.hint}</span> : <span />}
                {value && age && (
                  <span
                    className="text-[10px] text-muted-foreground whitespace-nowrap inline-flex items-center gap-0.5 shrink-0"
                    title={`Diperbarui ${formatDataTimestamp(updatedAt[key])}`}
                  >
                    <Clock className="w-2.5 h-2.5" /> {age}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
