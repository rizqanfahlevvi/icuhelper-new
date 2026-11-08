/**
 * Logika murni "konteks pasien": pemetaan demografi patient store ↔ clinical store,
 * normalisasi snapshot lama, cap waktu per variabel, dan keputusan rekonsiliasi
 * saat aplikasi dibuka. Tidak menyentuh store secara langsung (lihat
 * store/patientContextSync.ts) sehingga bisa dites unit.
 */
import {
  CLINICAL_KEYS,
  isClinicalKey,
  type ClinicalData,
  type ClinicalKey,
  type ClinicalTimestamps,
} from './clinicalVariables';

/** Penanda clinical store dari versi lama (sebelum ada pemilik data). */
export const LEGACY_OWNER = '__legacy__';

export type PatientGender = '' | 'L' | 'P';
export type ClinicalGender = '' | 'm' | 'f';

export function patientGenderToClinical(g: string | undefined): ClinicalGender {
  const v = (g ?? '').toUpperCase();
  return v === 'L' || v === 'M' ? 'm' : v === 'P' || v === 'F' ? 'f' : '';
}

export function clinicalGenderToPatient(g: string | undefined): PatientGender {
  const v = (g ?? '').toLowerCase();
  return v === 'm' || v === 'l' ? 'L' : v === 'f' || v === 'p' ? 'P' : '';
}

/** Hapus nilai kosong/undefined dan kunci yang tidak dikenal. */
export function cleanClinicalRecord(data: object | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!data) return out;
  for (const [k, v] of Object.entries(data) as [string, unknown][]) {
    if (!isClinicalKey(k)) continue;
    if (typeof v === 'string' && v.trim() !== '') out[k] = v;
  }
  return out;
}

/** Cap waktu hanya untuk kunci yang masih berisi nilai. */
export function cleanTimestamps(stamps: ClinicalTimestamps | Record<string, number> | undefined, data: object): Record<string, number> {
  const out: Record<string, number> = {};
  if (!stamps) return out;
  const values = data as Record<string, unknown>;
  for (const [k, t] of Object.entries(stamps) as [string, unknown][]) {
    if (!isClinicalKey(k)) continue;
    const v = values[k];
    if (typeof t === 'number' && Number.isFinite(t) && typeof v === 'string' && v.trim() !== '') out[k] = t;
  }
  return out;
}

/**
 * Normalisasi snapshot klinis versi lama:
 * - `gds` (dulu terpisah dari `glukosa`) digabung ke `glukosa` bila glukosa kosong.
 * - Kunci yang tidak dikenal dibuang.
 */
export function normalizeLegacyClinicalRecord(rec: Record<string, string> | undefined): Record<string, string> {
  if (!rec) return {};
  const src: Record<string, string> = { ...rec };
  if (src.gds && !src.glukosa) src.glukosa = src.gds;
  delete src.gds;
  return cleanClinicalRecord(src);
}

/** Ubah record bebas → Partial<ClinicalData> bertipe (validasi gender). */
export function toClinicalData(rec: Record<string, string>): Partial<ClinicalData> {
  const out: Partial<Record<ClinicalKey, string>> = {};
  for (const k of CLINICAL_KEYS) {
    const v = rec[k];
    if (typeof v !== 'string' || v === '') continue;
    out[k] = v;
  }
  const result = out as Partial<ClinicalData>;
  if (result.gender !== undefined) {
    const g = patientGenderToClinical(result.gender);
    if (g) result.gender = g; else delete result.gender;
  }
  return result;
}

/**
 * Cap waktu baru setelah perubahan: kunci yang nilainya berubah → `now`
 * (atau dihapus bila menjadi kosong); kunci lain dipertahankan.
 */
export function stampChanges(
  prev: ClinicalData,
  next: Partial<ClinicalData>,
  prevStamps: ClinicalTimestamps,
  now: number,
): ClinicalTimestamps {
  const stamps: ClinicalTimestamps = { ...prevStamps };
  for (const k of Object.keys(next) as ClinicalKey[]) {
    if (!isClinicalKey(k)) continue;
    const before = prev[k] ?? '';
    const after = next[k] ?? '';
    if (before === after) continue;
    if (after === '') delete stamps[k];
    else stamps[k] = now;
  }
  return stamps;
}

// ── Demografi ────────────────────────────────────────────────────────────────

export interface DemographicSource {
  weightKg: string;
  heightCm: string;
  ageYears: string;
  gender: PatientGender;
}

/** Demografi patient store → kunci clinical store (nilai kosong ikut dipetakan). */
export function demographicsToClinical(p: DemographicSource): Pick<ClinicalData, 'weight' | 'height' | 'age' | 'gender'> {
  return {
    weight: p.weightKg ?? '',
    height: p.heightCm ?? '',
    age: p.ageYears ?? '',
    gender: patientGenderToClinical(p.gender),
  };
}

export interface DemographicPatientUpdate {
  weightKg?: string;
  heightCm?: string;
  gender?: PatientGender;
  ageUnit?: 'tahun';
  ageInput?: string;
  ageYears?: string;
  ageMonths?: string;
  agePrecise?: string;
}

/**
 * Nilai demografi yang diisi di kalkulator (clinical store) → pembaruan untuk
 * data pasien. Hanya nilai NON-KOSONG yang berbeda yang diteruskan, sehingga
 * mengosongkan kolom di kalkulator tidak menghapus data pasien.
 */
export function demographicUpdatesFromClinical(data: ClinicalData, current: DemographicSource): DemographicPatientUpdate | null {
  const u: DemographicPatientUpdate = {};
  if (data.weight && data.weight !== current.weightKg) u.weightKg = data.weight;
  if (data.height && data.height !== current.heightCm) u.heightCm = data.height;
  const g = clinicalGenderToPatient(data.gender);
  if (g && g !== current.gender) u.gender = g;
  if (data.age && data.age !== current.ageYears) {
    u.ageUnit = 'tahun';
    u.ageInput = data.age;
    u.ageYears = data.age;
    u.ageMonths = '';
    u.agePrecise = `${data.age} tahun`;
  }
  return Object.keys(u).length > 0 ? u : null;
}

/** Field demografi clinical yang berbeda dari target (untuk mencegah set berulang). */
export function diffClinical(current: ClinicalData, target: Partial<ClinicalData>): Partial<ClinicalData> {
  const out: Partial<Record<ClinicalKey, string>> = {};
  for (const k of Object.keys(target) as ClinicalKey[]) {
    const t = target[k] ?? '';
    if ((current[k] ?? '') !== t) out[k] = t;
  }
  return out as Partial<ClinicalData>;
}

// ── Rekonsiliasi saat aplikasi dibuka ────────────────────────────────────────

export type StartupAction =
  /** Data kerja milik pasien aktif → pertahankan & simpan ke snapshot. */
  | 'keep'
  /** Muat ulang dari snapshot pasien aktif (data kerja milik pihak lain / versi lama). */
  | 'load'
  /** Kosongkan data kerja (pemiliknya sudah tidak aktif). */
  | 'clear'
  /** Tidak ada pasien aktif, data sesi anonim dipertahankan. */
  | 'keepSession';

export function resolveStartupAction(
  ownerId: string | null | undefined,
  activePatientId: string | null,
  activeExists: boolean,
): StartupAction {
  if (activePatientId && activeExists) {
    return ownerId === activePatientId ? 'keep' : 'load';
  }
  if (activePatientId && !activeExists) return 'clear';
  // Tidak ada pasien aktif
  if (ownerId && ownerId !== LEGACY_OWNER) return 'clear';
  return 'keepSession';
}

// ── Waktu data ───────────────────────────────────────────────────────────────

/** "baru saja" · "5 mnt lalu" · "3 jam lalu" · "2 hari lalu" · "3 Nov". Tanpa ambang kedaluwarsa. */
export function formatDataAge(ts: number | undefined, now: number = Date.now()): string {
  if (typeof ts !== 'number' || !Number.isFinite(ts)) return '';
  const diff = now - ts;
  if (diff < 60_000) return 'baru saja';
  const min = Math.floor(diff / 60_000);
  if (min < 60) return `${min} mnt lalu`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} hari lalu`;
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

/** Waktu lengkap untuk tooltip. */
export function formatDataTimestamp(ts: number | undefined): string {
  if (typeof ts !== 'number' || !Number.isFinite(ts)) return '';
  return new Date(ts).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}
