/**
 * APACHE II — logika murni (Knaus WA et al. Crit Care Med 1985;13:818).
 *
 * Konvensi:
 * - Nilai terburuk dalam 24 jam pertama ICU.
 * - Parameter yang tidak diukur diberi 0 poin (dianggap normal) → skor bisa UNDERESTIMATE;
 *   kelengkapan (x/12) selalu ditampilkan.
 * - FiO₂ WAJIB untuk komponen oksigenasi (tidak diasumsikan 21%).
 * - Kreatinin poin ganda bila gagal ginjal akut.
 */

export type ApacheChronic = 'none' | 'nonop' | 'emergency' | 'elective';

export interface ApacheInputs {
  temp?: number;   // °C (rektal)
  map?: number;    // mmHg
  hr?: number;     // x/menit
  rr?: number;     // x/menit
  fio2?: number;   // fraksi 0,21–1,0 atau persen 21–100
  pao2?: number;   // mmHg
  paco2?: number;  // mmHg (dibutuhkan bila FiO₂ ≥0,5)
  ph?: number;
  na?: number;     // mEq/L
  k?: number;      // mEq/L
  cr?: number;     // mg/dL
  aki?: boolean;   // gagal ginjal akut → poin kreatinin ×2
  hct?: number;    // %
  wbc?: number;    // ×10³/µL
  gcs?: number;    // 3–15
  age?: number;    // tahun
  chronic: ApacheChronic; // 'none' bila tidak ada insufisiensi organ berat/imunokompromais
}

export interface ApacheItem { label: string; value: string; pts: number }

export interface ApacheResult {
  total: number;
  aps: number;
  agePts: number;
  chronicPts: number;
  breakdown: ApacheItem[];
  /** Variabel APS yang terisi (dari 12). */
  filled: number;
  missing: string[];
  notes: string[];
}

const fin = (v: number | undefined): v is number => typeof v === 'number' && Number.isFinite(v);

export function apacheTemp(t: number): number {
  if (t >= 41) return 4;
  if (t >= 39) return 3;
  if (t >= 38.5) return 1;
  if (t >= 36) return 0;
  if (t >= 34) return 1;
  if (t >= 32) return 2;
  if (t >= 30) return 3;
  return 4;
}

export function apacheMap(m: number): number {
  if (m >= 160) return 4;
  if (m >= 130) return 3;
  if (m >= 110) return 2;
  if (m >= 70) return 0;
  if (m >= 50) return 2;
  return 4;
}

export function apacheHr(h: number): number {
  if (h >= 180) return 4;
  if (h >= 140) return 3;
  if (h >= 110) return 2;
  if (h >= 70) return 0;
  if (h >= 55) return 2;
  if (h >= 40) return 3;
  return 4;
}

export function apacheRr(r: number): number {
  if (r >= 50) return 4;
  if (r >= 35) return 3;
  if (r >= 25) return 1;
  if (r >= 12) return 0;
  if (r >= 10) return 1;
  if (r >= 6) return 2;
  return 4;
}

/** A-aDO₂ (mmHg) dengan PAO₂ = FiO₂·(760−47) − PaCO₂/0,8 (permukaan laut). */
export function apacheAaDo2(fio2: number, paco2: number, pao2: number): number {
  return fio2 * (760 - 47) - paco2 / 0.8 - pao2;
}

export function apacheOxyAa(aa: number): number {
  if (aa >= 500) return 4;
  if (aa >= 350) return 3;
  if (aa >= 200) return 2;
  return 0;
}

/** FiO₂ <0,5: PaO₂ >70 → 0 · 61–70 → 1 · 55–60 → 3 · <55 → 4. */
export function apacheOxyPao2(pao2: number): number {
  if (pao2 > 70) return 0;
  if (pao2 >= 61) return 1;
  if (pao2 >= 55) return 3;
  return 4;
}

export function apachePh(p: number): number {
  if (p >= 7.7) return 4;
  if (p >= 7.6) return 3;
  if (p >= 7.5) return 1;
  if (p >= 7.33) return 0;
  if (p >= 7.25) return 2;
  if (p >= 7.15) return 3;
  return 4;
}

export function apacheNa(n: number): number {
  if (n >= 180) return 4;
  if (n >= 160) return 3;
  if (n >= 155) return 2;
  if (n >= 150) return 1;
  if (n >= 130) return 0;
  if (n >= 120) return 2;
  if (n >= 111) return 3;
  return 4;
}

export function apacheK(k: number): number {
  if (k >= 7) return 4;
  if (k >= 6) return 3;
  if (k >= 5.5) return 1;
  if (k >= 3.5) return 0;
  if (k >= 3) return 1;
  if (k >= 2.5) return 2;
  return 4;
}

export function apacheCr(cr: number, aki: boolean): number {
  let pts: number;
  if (cr >= 3.5) pts = 4;
  else if (cr >= 2) pts = 3;
  else if (cr >= 1.5) pts = 2;
  else if (cr >= 0.6) pts = 0;
  else pts = 2;
  return aki ? pts * 2 : pts;
}

export function apacheHct(h: number): number {
  if (h >= 60) return 4;
  if (h >= 50) return 2;
  if (h >= 46) return 1;
  if (h >= 30) return 0;
  if (h >= 20) return 2;
  return 4;
}

export function apacheWbc(w: number): number {
  if (w >= 40) return 4;
  if (w >= 20) return 2;
  if (w >= 15) return 1;
  if (w >= 3) return 0;
  if (w >= 1) return 2;
  return 4;
}

export function apacheAge(a: number): number {
  if (a < 45) return 0;
  if (a < 55) return 2;
  if (a < 65) return 3;
  if (a < 75) return 5;
  return 6;
}

/** Insufisiensi organ berat/imunokompromais: non-operatif & pasca-bedah darurat 5, pasca-bedah elektif 2. */
export function apacheChronic(c: ApacheChronic): number {
  if (c === 'none') return 0;
  return c === 'elective' ? 2 : 5;
}

/** FiO₂ persen/fraksi → fraksi 0,21–1,0 (di luar → null). */
export function apacheFio2(raw: number | undefined): number | null {
  if (!fin(raw)) return null;
  const f = raw > 1 ? raw / 100 : raw;
  return f >= 0.21 && f <= 1 ? f : null;
}

export function computeApache(i: ApacheInputs): ApacheResult {
  const breakdown: ApacheItem[] = [];
  const missing: string[] = [];
  const notes: string[] = [];
  let aps = 0;
  let filled = 0;
  const add = (label: string, value: string, pts: number) => {
    breakdown.push({ label, value, pts });
    aps += pts;
    filled += 1;
  };

  if (fin(i.temp)) add('Suhu', `${i.temp} °C`, apacheTemp(i.temp)); else missing.push('Suhu');
  if (fin(i.map)) add('MAP', `${i.map} mmHg`, apacheMap(i.map)); else missing.push('MAP');
  if (fin(i.hr)) add('Nadi', `${i.hr} x/menit`, apacheHr(i.hr)); else missing.push('Nadi');
  if (fin(i.rr)) add('Laju napas', `${i.rr} x/menit`, apacheRr(i.rr)); else missing.push('Laju napas');

  // Oksigenasi
  const f = apacheFio2(i.fio2);
  if (fin(i.fio2) && f === null) notes.push(`FiO₂ ${i.fio2} di luar rentang 21–100% / 0,21–1,0.`);
  if (!fin(i.pao2)) {
    missing.push('Oksigenasi (PaO₂)');
  } else if (f === null) {
    missing.push('Oksigenasi (FiO₂ belum diisi)');
    notes.push('Oksigenasi tidak dihitung: FiO₂ wajib diisi (tidak diasumsikan 21%).');
  } else if (f >= 0.5) {
    if (fin(i.paco2)) {
      const aa = apacheAaDo2(f, i.paco2, i.pao2);
      add('Oksigenasi (A-aDO₂, FiO₂ ≥0,5)', `${Math.round(aa)} mmHg`, apacheOxyAa(aa));
    } else {
      missing.push('Oksigenasi (PaCO₂ dibutuhkan saat FiO₂ ≥0,5)');
      notes.push('FiO₂ ≥0,5 memakai A-aDO₂ → PaCO₂ wajib diisi.');
    }
  } else {
    add('Oksigenasi (PaO₂, FiO₂ <0,5)', `${i.pao2} mmHg`, apacheOxyPao2(i.pao2));
  }

  if (fin(i.ph)) add('pH arteri', `${i.ph}`, apachePh(i.ph)); else missing.push('pH');
  if (fin(i.na)) add('Natrium', `${i.na} mEq/L`, apacheNa(i.na)); else missing.push('Natrium');
  if (fin(i.k)) add('Kalium', `${i.k} mEq/L`, apacheK(i.k)); else missing.push('Kalium');
  if (fin(i.cr)) add(`Kreatinin${i.aki ? ' (gagal ginjal akut ×2)' : ''}`, `${i.cr} mg/dL`, apacheCr(i.cr, !!i.aki)); else missing.push('Kreatinin');
  if (fin(i.hct)) add('Hematokrit', `${i.hct} %`, apacheHct(i.hct)); else missing.push('Hematokrit');
  if (fin(i.wbc)) add('Leukosit', `${i.wbc} ×10³/µL`, apacheWbc(i.wbc)); else missing.push('Leukosit');
  if (fin(i.gcs)) {
    if (i.gcs >= 3 && i.gcs <= 15) add('GCS (15 − GCS)', `${i.gcs}`, 15 - Math.round(i.gcs));
    else { missing.push('GCS'); notes.push(`GCS ${i.gcs} di luar rentang 3–15.`); }
  } else missing.push('GCS');

  const agePts = fin(i.age) ? apacheAge(i.age) : 0;
  if (!fin(i.age)) notes.push('Usia belum diisi — poin usia dihitung 0.');
  const chronicPts = apacheChronic(i.chronic);

  return { total: aps + agePts + chronicPts, aps, agePts, chronicPts, breakdown, filled, missing, notes };
}

/**
 * Mortalitas RUMAH SAKIT menurut rentang skor — kolom pasien NON-OPERATIF (Knaus 1985,
 * via sumber sekunder). Perkiraan kasar tanpa bobot kategori diagnosis; pasien pasca-bedah
 * umumnya lebih rendah. Rentang 30–34: sumber sekunder menyebut 73% atau 75%.
 */
export const APACHE_MORTALITY_NONOP: { min: number; range: string; mortality: string }[] = [
  { min: 0, range: '0–4', mortality: '~4%' },
  { min: 5, range: '5–9', mortality: '~8%' },
  { min: 10, range: '10–14', mortality: '~15%' },
  { min: 15, range: '15–19', mortality: '~25%' },
  { min: 20, range: '20–24', mortality: '~40%' },
  { min: 25, range: '25–29', mortality: '~55%' },
  { min: 30, range: '30–34', mortality: '~73–75%' },
  { min: 35, range: '>34', mortality: '~85%' },
];

export function apacheMortalityNonop(total: number) {
  let band = APACHE_MORTALITY_NONOP[0];
  for (const b of APACHE_MORTALITY_NONOP) if (total >= b.min) band = b;
  return band;
}
