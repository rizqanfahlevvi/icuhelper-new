import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

export interface ReportItem {
  label: string;
  value: string | number;
}

export interface ReportSection {
  title: string;
  items: ReportItem[];
}

export interface ClinicalReportProps {
  title: string;
  patientInfo?: {
    name?: string;
    age?: string | number;
    gender?: string;
    weight?: string | number;
  } | null;
  sections: ReportSection[];
  notes?: string;
  onSave?: () => void;
}

export function ClinicalReport({ title, patientInfo, sections, notes, onSave }: ClinicalReportProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const generatePlainText = () => {
    let text = `======================================\n`;
    text += `  LAPORAN KLINIS: ${title.toUpperCase()}\n`;
    text += `======================================\n\n`;

    if (patientInfo && (patientInfo.name || patientInfo.age || patientInfo.weight)) {
      text += `[ DATA PASIEN ]\n`;
      if (patientInfo.name) text += `- Nama: ${patientInfo.name}\n`;
      if (patientInfo.age) text += `- Usia: ${patientInfo.age} tahun\n`;
      if (patientInfo.gender) text += `- Gender: ${patientInfo.gender.toUpperCase() === 'M' || patientInfo.gender.toUpperCase() === 'L' ? 'Laki-laki' : 'Perempuan'}\n`;
      if (patientInfo.weight) text += `- BB: ${patientInfo.weight} kg\n`;
      text += `\n`;
    }

    sections.forEach(section => {
      text += `[ ${section.title.toUpperCase()} ]\n`;
      section.items.forEach(item => {
        text += `- ${item.label}: ${item.value}\n`;
      });
      text += `\n`;
    });

    if (notes) {
      text += `[ CATATAN KESIMPULAN ]\n`;
      text += `${notes}\n\n`;
    }
    
    text += `Dihasilkan oleh Aplikasi MD Kit\n`;

    return text;
  };

  const handleCopy = async () => {
    const text = generatePlainText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-2xl shadow-sm overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--label-primary)]">
          <FileText className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="font-bold text-sm tracking-wide uppercase">Laporan & Dokumentasi</h3>
        </div>
        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={() => {
                onSave();
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                saved 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white dark:bg-slate-800 text-[var(--label-secondary)] border border-border/80 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[var(--label-primary)]'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              {saved ? 'Tersimpan' : 'Simpan Log'}
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              copied 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white dark:bg-slate-800 text-[var(--label-secondary)] border border-border/80 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[var(--label-primary)]'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : 'Salin Laporan'}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {patientInfo && (patientInfo.name || patientInfo.age || patientInfo.weight) && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--label-tertiary)] border-b border-border/40 pb-1">
              Data Pasien
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {patientInfo.name && <div><span className="text-[var(--label-secondary)]">Nama:</span> <span className="font-medium text-[var(--label-primary)]">{patientInfo.name}</span></div>}
              {patientInfo.age && <div><span className="text-[var(--label-secondary)]">Usia:</span> <span className="font-medium text-[var(--label-primary)]">{patientInfo.age} thn</span></div>}
              {patientInfo.weight && <div><span className="text-[var(--label-secondary)]">Berat:</span> <span className="font-medium text-[var(--label-primary)]">{patientInfo.weight} kg</span></div>}
              {patientInfo.gender && <div><span className="text-[var(--label-secondary)]">Gender:</span> <span className="font-medium text-[var(--label-primary)]">{patientInfo.gender.toUpperCase() === 'M' || patientInfo.gender.toUpperCase() === 'L' ? 'Laki-laki' : 'Perempuan'}</span></div>}
            </div>
          </div>
        )}

        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--label-tertiary)] border-b border-border/40 pb-1">
              {section.title}
            </h4>
            <div className="space-y-1.5 text-sm">
              {section.items.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <span className="text-[var(--label-secondary)]">{item.label}:</span>
                  <span className="font-semibold text-[var(--label-primary)] text-right break-words max-w-[60%]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {notes && (
          <div className="space-y-2 pt-2">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--label-tertiary)] border-b border-border/40 pb-1">
              Catatan Kesimpulan
            </h4>
            <p className="text-sm font-medium text-[var(--label-primary)] bg-[var(--fill-secondary)] p-3 rounded-xl">
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
