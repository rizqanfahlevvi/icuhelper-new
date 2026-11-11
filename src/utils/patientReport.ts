import { CLINICAL_GROUPS, CLINICAL_VARIABLES, CLINICAL_KEYS, formatClinicalValue, type ClinicalKey } from './clinicalVariables';
import { formatDataAge } from './patientContext';
import { historyModuleLabel } from '../data/historyModules';

export interface ReportPatient {
  nama?: string;
  gender?: string;
  ageYears?: string;
  agePrecise?: string;
  weightKg?: string;
  heightCm?: string;
  mrsDate?: string;
}

export interface ReportHistoryEntry {
  module: string;
  label: string;
  summary: string;
  timestamp: number;
}

export interface ReportGroup {
  label: string;
  items: { key: ClinicalKey; label: string; value: string; age: string }[];
}

/** Hari rawat ke-n (MRS = hari ke-1). */
export function hospitalDay(mrsDate: string | undefined, now: number = Date.now()): number | null {
  if (!mrsDate) return null;
  const start = new Date(mrsDate); start.setHours(0, 0, 0, 0);
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const d = Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1;
  return Number.isFinite(d) && d >= 1 ? d : null;
}

/** Nilai klinis tersimpan, dikelompokkan seperti form "Lengkapi Data Pasien" (demografi dilewati — sudah di identitas). */
export function groupClinicalValues(
  data: Record<string, string | undefined>,
  updatedAt: Record<string, number | undefined>,
  now: number = Date.now(),
): ReportGroup[] {
  const groups: ReportGroup[] = [];
  for (const g of CLINICAL_GROUPS) {
    const items = CLINICAL_KEYS
      .filter((k) => CLINICAL_VARIABLES[k].group === g.id && (data[k] ?? '').trim() !== '')
      .map((k) => ({
        key: k,
        label: CLINICAL_VARIABLES[k].short,
        value: formatClinicalValue(k, String(data[k]).trim()),
        age: formatDataAge(updatedAt[k], now),
      }));
    if (items.length) groups.push({ label: g.label, items });
  }
  return groups;
}

/** Hasil kalkulasi terbaru per modul (urut terbaru dulu). */
export function latestPerModule<T extends ReportHistoryEntry>(entries: T[], max = 8): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const e of [...entries].sort((a, b) => b.timestamp - a.timestamp)) {
    if (seen.has(e.module)) continue;
    seen.add(e.module);
    out.push(e);
    if (out.length >= max) break;
  }
  return out;
}

/**
 * Teks ringkasan pasien untuk catatan/aplusan (disalin ke clipboard).
 * Hanya menyalin data yang tersimpan — tidak menambah interpretasi baru.
 */
export function buildPatientReport(
  patient: ReportPatient,
  data: Record<string, string | undefined>,
  updatedAt: Record<string, number | undefined>,
  history: ReportHistoryEntry[],
  now: number = Date.now(),
): string {
  const lines: string[] = [];
  const age = patient.agePrecise || (patient.ageYears ? `${patient.ageYears} thn` : '');
  const ident = [patient.nama || 'Pasien tanpa nama', age, patient.gender, patient.weightKg ? `BB ${patient.weightKg} kg` : '', patient.heightCm ? `TB ${patient.heightCm} cm` : '']
    .filter(Boolean).join(' · ');
  lines.push(`RINGKASAN PASIEN — ${ident}`);
  const day = hospitalDay(patient.mrsDate, now);
  if (day) lines.push(`Hari rawat ke-${day} (MRS ${new Date(patient.mrsDate as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})`);
  lines.push(`Dibuat: ${new Date(now).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`);

  const groups = groupClinicalValues(data, updatedAt, now);
  if (groups.length) {
    lines.push('');
    for (const g of groups) {
      lines.push(`${g.label}: ${g.items.map((i) => `${i.label} ${i.value}${i.age ? ` (${i.age})` : ''}`).join('; ')}`);
    }
  }
  const calcs = latestPerModule(history);
  if (calcs.length) {
    lines.push('', 'Hasil kalkulasi terakhir:');
    for (const c of calcs) lines.push(`- ${historyModuleLabel(c.module)}: ${c.summary} (${formatDataAge(c.timestamp, now)})`);
  }
  lines.push('', 'Catatan: dihasilkan ICU Helper — alat bantu, verifikasi dengan data rekam medis.');
  return lines.join('\n');
}

/** Salin teks ke clipboard dengan fallback untuk browser/PWA lama. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* lanjut ke fallback */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch { return false; }
}
