import { ABBREVIATIONS, abbrLabel, type AbbrKey } from './abbreviations';

let primaryCache: AbbrKey[] | null = null;

/**
 * Semua kunci kamus untuk teks bebas yang konteksnya tidak diketahui (mis. ringkasan riwayat):
 * untuk label homonim hanya dipakai arti utamanya (kunci tanpa `label`, mis. `RR` = laju napas,
 * `TDD` = dosis insulin harian), varian berakhiran seperti `RR-risiko` dilewati.
 */
export function primaryAbbrKeys(): readonly AbbrKey[] {
  if (primaryCache) return primaryCache;
  const all = Object.keys(ABBREVIATIONS) as AbbrKey[];
  const byLabel = new Map<string, AbbrKey[]>();
  for (const k of all) byLabel.set(abbrLabel(k), [...(byLabel.get(abbrLabel(k)) ?? []), k]);
  primaryCache = all.filter((k) => {
    const same = byLabel.get(abbrLabel(k)) ?? [];
    if (same.length === 1) return true;
    // homonim: pertahankan hanya kunci yang sama dengan labelnya (arti utama)
    return k === abbrLabel(k);
  });
  return primaryCache;
}

/**
 * Deteksi singkatan untuk halaman berbasis data (referensi obat & cairan):
 * kembalikan kunci dari `candidates` yang LABEL-nya muncul di teks.
 *
 * - Peka huruf besar-kecil ("ICU" ≠ "icu_primary").
 * - Batas kata manual (tanpa lookbehind regex agar aman di Safari lama):
 *   sebelum label tidak boleh huruf/angka; sesudah label tidak boleh huruf atau
 *   subskrip/superskrip ("CO" tidak cocok di "CO₂"). Angka sesudah label boleh
 *   ("NG29", "CYP3A4"), kecuali label berakhiran angka ("D5" tidak cocok di "D50").
 * - Homonim harus dipilih pemanggil lewat daftar kandidat (mis. `VT-aritmia`, bukan `VT`).
 */
export function abbrInText(
  candidates: readonly AbbrKey[],
  ...texts: ReadonlyArray<string | null | undefined>
): AbbrKey[] {
  const hay = texts.filter((t): t is string => !!t).join('\n');
  if (!hay) return [];
  return candidates.filter((k) => labelPattern(abbrLabel(k)).test(hay));
}

const LETTER = 'A-Za-zÀ-ÿ';
const SUBSUP = '₀-₉⁰-⁹¹²³⁺⁻';
const cache = new Map<string, RegExp>();

function labelPattern(label: string): RegExp {
  let re = cache.get(label);
  if (!re) {
    const esc = label.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    const after = /[0-9₀-₉]$/.test(label) ? `[${LETTER}0-9${SUBSUP}]` : `[${LETTER}${SUBSUP}]`;
    re = new RegExp(`(?:^|[^${LETTER}0-9])${esc}(?!${after})`);
    cache.set(label, re);
  }
  return re;
}

/** Gabungkan semua string di dalam nilai bersarang (objek/array), melewati kunci tertentu. */
export function collectText(value: unknown, skipKeys: ReadonlySet<string> = new Set()): string {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') {
      for (const [k, child] of Object.entries(v)) if (!skipKeys.has(k)) walk(child);
    }
  };
  walk(value);
  return out.join('\n');
}
