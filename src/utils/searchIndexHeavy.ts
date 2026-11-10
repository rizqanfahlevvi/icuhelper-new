/**
 * Entri pencarian dari data besar (obat, cairan, referensi, singkatan).
 * File ini HANYA di-import dinamis oleh GlobalSearch saat pencarian dibuka,
 * agar database obat/referensi tidak masuk chunk utama.
 */
import { ICU_DRUGS } from '../pages/drug-reference/data';
import { CF_FLUIDS } from '../pages/cairan/data';
import { referenceData } from '../data/referenceData';
import { allAbbreviations } from './abbreviations';
import type { SearchEntry } from './searchIndex';

const stripEmoji = (s: string) => s.replace(/^[^\p{L}\p{N}]+/u, '').trim();
const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

export function buildDrugEntries(): SearchEntry[] {
  return Object.entries(ICU_DRUGS).map(([id, d]) => ({
    kind: 'obat',
    id,
    title: d.name,
    subtitle: [d.class, d.subclass].filter(Boolean).join(' · ') || undefined,
    badge: d.high_alert ? 'High alert' : undefined,
    path: `/pharmacy?tab=obat&obat=${encodeURIComponent(id)}`,
    keywords: [id.replace(/[_-]/g, ' '), ...(d.brand_id ?? []), ...(d.category ?? []), d.class, d.subclass].filter(Boolean).join(' '),
  }));
}

export function buildFluidEntries(): SearchEntry[] {
  return CF_FLUIDS.filter((f) => !f.deprecated).map((f) => ({
    kind: 'cairan',
    id: f.id,
    title: f.name,
    subtitle: [f.alias, f.osm].filter(Boolean).join(' · ') || undefined,
    badge: f.cat || undefined,
    path: `/pharmacy?tab=cairan&cairan=${encodeURIComponent(f.id)}`,
    keywords: [f.alias, f.cat, f.badge].filter(Boolean).join(' '),
  }));
}

/** Kata kunci pembuka baris referensi: bagian penulis/judul sebelum titik pertama. */
export function referenceKey(col1: string): string {
  const head = col1.split(/\.\s/)[0].trim();
  return head.length >= 4 ? head : col1.slice(0, 40);
}

export function buildReferenceEntries(): SearchEntry[] {
  const out: SearchEntry[] = [];
  referenceData.forEach((sec) => {
    sec.items.forEach((it, i) => {
      out.push({
        kind: 'referensi',
        id: `${sec.id}#${i}`,
        title: short(it.col1, 110),
        subtitle: short(it.col2, 80),
        badge: short(stripEmoji(sec.title), 32),
        path: `/reference?q=${encodeURIComponent(referenceKey(it.col1))}`,
        keywords: `${it.col2} ${it.col3}`,
      });
    });
  });
  return out;
}

export function buildAbbrEntries(): SearchEntry[] {
  return allAbbreviations().map((a) => ({
    kind: 'singkatan',
    id: a.key,
    title: a.label,
    subtitle: a.meaning,
    path: `/reference?q=${encodeURIComponent(a.label)}`,
  }));
}

export function buildHeavyEntries(): SearchEntry[] {
  return [...buildDrugEntries(), ...buildFluidEntries(), ...buildAbbrEntries(), ...buildReferenceEntries()];
}
