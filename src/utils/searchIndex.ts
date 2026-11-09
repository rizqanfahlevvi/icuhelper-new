/**
 * Indeks & mesin pencarian global (ringan — tanpa data obat/referensi besar).
 * Data besar dibangun di `searchIndexHeavy.ts` yang di-import dinamis saat pencarian dibuka.
 */

export type SearchKind = 'halaman' | 'pasien' | 'obat' | 'cairan' | 'singkatan' | 'referensi';

export interface SearchEntry {
  kind: SearchKind;
  /** ID unik dalam jenisnya (path, id obat, id pasien, kunci singkatan, dst.). */
  id: string;
  title: string;
  subtitle?: string;
  /** Label kecil (kategori/kelas). */
  badge?: string;
  /** Tujuan navigasi; untuk 'pasien' aksi khusus ditangani UI. */
  path?: string;
  /** Teks tambahan yang ikut dicari (nama dagang, alias, deskripsi). */
  keywords?: string;
}

export const KIND_LABEL: Record<SearchKind, string> = {
  halaman: 'Halaman & Alat',
  pasien: 'Pasien',
  obat: 'Obat',
  cairan: 'Cairan',
  singkatan: 'Singkatan',
  referensi: 'Referensi & Literatur',
};

export const KIND_ORDER: SearchKind[] = ['pasien', 'halaman', 'obat', 'cairan', 'singkatan', 'referensi'];

const SUBSCRIPT: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁺': '+', '⁻': '-',
};

/**
 * Normalisasi untuk pencocokan: huruf kecil, tanpa aksen/diakritik, subskrip → angka,
 * tanda baca → spasi, dan ejaan Inggris→Indonesia sederhana pada kata ≥5 huruf
 * ("ph"→"f", "th"→"t", "y"→"i" tidak dipakai agar istilah tetap aman).
 */
export function normalizeSearch(s: string): string {
  const base = s
    .replace(/[₀-₉⁰¹²³⁺⁻]/g, (c) => SUBSCRIPT[c] ?? c)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, ' ')
    .trim();
  return base
    .split(' ')
    .map((w) => (w.length >= 5 ? w.replace(/ph/g, 'f').replace(/th/g, 't').replace(/ae/g, 'e') : w))
    .join(' ');
}

/**
 * Grup sinonim/singkatan umum di ICU. Bila kueri cocok dengan salah satu istilah,
 * semua istilah dalam grup ikut dicari. Istilah ditulis dalam bentuk ternormalisasi.
 */
export const SYNONYM_GROUPS: string[][] = [
  ['norepinefrin', 'norepinefrine', 'noradrenalin', 'noradrenaline', 'ne', 'nor', 'vascon'],
  ['epinefrin', 'epinefrine', 'adrenalin', 'adrenaline', 'epi'],
  ['dobutamin', 'dobutamine', 'dobu'],
  ['dopamin', 'dopamine'],
  ['vasopresin', 'vasopressin', 'avp'],
  ['kalium', 'potassium', 'k', 'kcl', 'hipokalemia', 'hiperkalemia'],
  ['natrium', 'sodium', 'na', 'nacl', 'hiponatremia', 'hipernatremia'],
  ['kalsium', 'calcium', 'ca', 'hipokalsemia'],
  ['magnesium', 'mg', 'mgso4', 'hipomagnesemia'],
  ['bikarbonat', 'bicarbonate', 'hco3', 'nahco3', 'meylon'],
  ['kreatinin', 'creatinine', 'cr', 'egfr', 'crcl', 'ginjal', 'renal'],
  ['ards', 'acute respiratory distress syndrome', 'p f', 'pf ratio'],
  ['agd', 'abg', 'gas darah', 'analisa gas darah', 'asam basa'],
  ['peep', 'positive end expiratory pressure'],
  ['sepsis', 'syok septik', 'septic shock', 'sofa', 'qsofa'],
  ['insulin', 'gula darah', 'glukosa', 'gds', 'dka', 'kad', 'hhs'],
  ['transfusi', 'prc', 'darah', 'ffp', 'trombosit', 'kriopresipitat'],
  ['cairan', 'kristaloid', 'ringer laktat', 'rl', 'nacl 0 9', 'resusitasi'],
  ['propofol', 'recofol'],
  ['midazolam', 'dormicum', 'sedasi'],
  ['fentanil', 'fentanyl', 'analgesia', 'opioid'],
  ['ketamin', 'ketamine', 'ketalar'],
  ['rokuronium', 'rocuronium', 'esmeron', 'pelumpuh otot', 'nmba'],
  ['amiodaron', 'amiodarone', 'cordarone'],
  ['heparin', 'unfractionated heparin', 'ufh', 'antikoagulan'],
  ['ventilator', 'ventilasi mekanik', 'vt', 'tidal volume', 'pplat', 'driving pressure'],
  ['weaning', 'penyapihan', 'sbt', 'rsbi', 'ekstubasi'],
  ['delirium', 'cam icu', 'rass', 'padis', 'agitasi'],
  ['nutrisi', 'kalori', 'enteral', 'parenteral', 'refeeding'],
  ['luka bakar', 'burn', 'parkland', 'tbsa'],
];

const SYN_INDEX: Map<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const g of SYNONYM_GROUPS) {
    const terms = g.map(normalizeSearch);
    for (const t of terms) m.set(t, terms);
  }
  return m;
})();

/** Istilah yang dicari untuk satu kueri (kueri itu sendiri + sinonimnya). */
export function expandQuery(q: string): string[] {
  const n = normalizeSearch(q);
  if (!n) return [];
  const out = new Set<string>([n]);
  const syn = SYN_INDEX.get(n);
  if (syn) syn.forEach((t) => out.add(t));
  // Kueri ≥4 huruf yang merupakan awalan istilah sinonim (mis. "norepi") juga diperluas.
  if (n.length >= 4 && !syn) {
    for (const [term, group] of SYN_INDEX) {
      if (term.length >= 4 && term.startsWith(n)) group.forEach((t) => out.add(t));
    }
  }
  return [...out];
}

function hasToken(text: string, token: string): boolean {
  return (' ' + text + ' ').includes(' ' + token + ' ');
}

/** Skor kecocokan satu istilah terhadap judul & kata kunci (0 = tidak cocok). */
function scoreTerm(title: string, keywords: string, term: string, isPrimary: boolean): number {
  const short = term.length <= 2;
  const w = isPrimary ? 1 : 0.8;
  if (short) {
    // Istilah 1–2 huruf ("k", "na", "ne") hanya cocok sebagai kata utuh, agar tidak membanjiri hasil.
    if (hasToken(title, term)) return 6 * w;
    if (hasToken(keywords, term)) return 3 * w;
    return 0;
  }
  if (title === term) return 10 * w;
  if (title.startsWith(term)) return 8 * w;
  if (hasToken(title, term) || (' ' + title).includes(' ' + term)) return 6 * w;
  if (title.includes(term)) return 4 * w;
  if ((' ' + keywords).includes(' ' + term)) return 3 * w;
  if (term.length >= 4 && keywords.includes(term)) return 2 * w;
  return 0;
}

interface Prepared { entry: SearchEntry; t: string; k: string }

export function prepareEntries(entries: SearchEntry[]): Prepared[] {
  return entries.map((entry) => ({
    entry,
    t: normalizeSearch(entry.title),
    k: normalizeSearch([entry.subtitle, entry.badge, entry.keywords].filter(Boolean).join(' ')),
  }));
}

export interface SearchGroup { kind: SearchKind; label: string; total: number; items: SearchEntry[] }

/**
 * Cari & kelompokkan per jenis. Kueri multi-kata: setiap kata harus cocok (AND),
 * kecuali seluruh frasa cocok sebagai satu istilah/sinonim.
 */
export function searchEntries(prepared: Prepared[], query: string, perGroup = 6): SearchGroup[] {
  const q = normalizeSearch(query);
  if (!q) return [];
  const phraseTerms = expandQuery(q);
  const words = q.split(' ').filter(Boolean);
  const wordTerms = words.length > 1 ? words.map((w) => expandQuery(w)) : [];

  const scored: { e: SearchEntry; s: number }[] = [];
  for (const p of prepared) {
    let best = 0;
    phraseTerms.forEach((term, i) => { best = Math.max(best, scoreTerm(p.t, p.k, term, i === 0)); });
    if (best === 0 && wordTerms.length) {
      let sum = 0; let all = true;
      for (const terms of wordTerms) {
        let wb = 0;
        terms.forEach((term, i) => { wb = Math.max(wb, scoreTerm(p.t, p.k, term, i === 0)); });
        if (wb === 0) { all = false; break; }
        sum += wb;
      }
      if (all) best = sum / wordTerms.length;
    }
    if (best > 0) scored.push({ e: p.entry, s: best });
  }

  const groups: SearchGroup[] = [];
  for (const kind of KIND_ORDER) {
    const items = scored
      .filter((x) => x.e.kind === kind)
      .sort((a, b) => b.s - a.s || a.e.title.localeCompare(b.e.title, 'id'))
      .map((x) => x.e);
    if (items.length) groups.push({ kind, label: KIND_LABEL[kind], total: items.length, items: items.slice(0, perGroup) });
  }
  return groups;
}
