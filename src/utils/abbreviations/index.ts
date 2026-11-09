import type { AbbrDict, AbbrEntry } from './types';
import { CORE_ABBR } from './core';
import { THEORY_ABBR } from './theory';
import { APP_ABBR } from './app';

export type { AbbrEntry, AbbrDict } from './types';

/** Sumber kamus terpisah (dipakai test untuk memastikan kunci tidak bentrok). */
export const ABBR_SOURCES = { core: CORE_ABBR, theory: THEORY_ABBR, app: APP_ABBR } as const;

export const ABBREVIATIONS = { ...CORE_ABBR, ...THEORY_ABBR, ...APP_ABBR } as const;

/** Kunci singkatan yang valid — salah ketik akan gagal saat typecheck. */
export type AbbrKey = keyof typeof ABBREVIATIONS;

const DICT: AbbrDict = ABBREVIATIONS;

export function getAbbr(key: AbbrKey): AbbrEntry {
  return DICT[key];
}

/** Teks singkatan yang ditampilkan (label bila ada, selain itu kuncinya). */
export function abbrLabel(key: AbbrKey): string {
  return DICT[key].label ?? key;
}

/** "Kepanjangan — arti Indonesia" (arti dihilangkan bila tidak ada). */
export function abbrMeaning(key: AbbrKey): string {
  const e = DICT[key];
  return e.id ? `${e.full} — ${e.id}` : e.full;
}

/** Semua entri terurut menurut label (untuk glosarium). */
export function allAbbreviations(): { key: AbbrKey; label: string; meaning: string }[] {
  return (Object.keys(ABBREVIATIONS) as AbbrKey[])
    .map((key) => ({ key, label: abbrLabel(key), meaning: abbrMeaning(key) }))
    .sort((a, b) => a.label.localeCompare(b.label, 'id', { sensitivity: 'base' }) || a.key.localeCompare(b.key));
}
