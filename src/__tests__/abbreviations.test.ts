import { describe, it, expect } from 'vitest';
import { ABBR_SOURCES, ABBREVIATIONS, abbrLabel, abbrMeaning, allAbbreviations } from '../utils/abbreviations';

describe('kamus singkatan', () => {
  it('kunci tidak bentrok antar berkas (core/theory/app)', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const [src, dict] of Object.entries(ABBR_SOURCES)) {
      for (const k of Object.keys(dict)) {
        if (seen.has(k)) dupes.push(`${k} (${seen.get(k)} & ${src})`);
        seen.set(k, src);
      }
    }
    expect(dupes).toEqual([]);
  });

  it('setiap entri punya kepanjangan yang tidak kosong', () => {
    for (const [k, e] of Object.entries(ABBREVIATIONS)) {
      expect(e.full.trim().length, k).toBeGreaterThan(0);
    }
  });

  it('label homonim & format makna', () => {
    expect(abbrLabel('VT-aritmia')).toBe('VT');
    expect(abbrLabel('FiO2')).toBe('FiO₂');
    expect(abbrLabel('SBT')).toBe('SBT');
    expect(abbrMeaning('SBT')).toBe('Spontaneous Breathing Trial — uji napas spontan');
    expect(abbrMeaning('IGD')).toBe('Instalasi Gawat Darurat');
  });

  it('glosarium terurut dan lengkap', () => {
    const all = allAbbreviations();
    expect(all.length).toBe(Object.keys(ABBREVIATIONS).length);
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1].label.localeCompare(all[i].label, 'id', { sensitivity: 'base' })).toBeLessThanOrEqual(0);
    }
  });
});
