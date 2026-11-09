import { describe, it, expect } from 'vitest';
import { abbrInText, collectText, primaryAbbrKeys } from '../utils/abbrDetect';
import { FLUID_ABBR } from '../pages/cairan/abbr';
import { DRUG_ABBR } from '../pages/drug-reference/abbr';

describe('abbrInText — deteksi singkatan di teks data', () => {
  it('batas kata & peka huruf besar-kecil', () => {
    expect(abbrInText(['ICU', 'MAP', 'NS'], 'icu_primary: target MAP ≥65; NSAID dihindari')).toEqual(['MAP']);
    expect(abbrInText(['NS'], 'dilarutkan dalam NS/D5W')).toEqual(['NS']);
  });

  it('subskrip & angka sesudah label', () => {
    expect(abbrInText(['CO'], 'retensi CO₂')).toEqual([]);
    expect(abbrInText(['CO'], '↓CO, ↑SVR')).toEqual(['CO']);
    expect(abbrInText(['NG-NICE', 'CG'], 'NICE NG29 & CG174')).toEqual(['NG-NICE', 'CG']);
    expect(abbrInText(['D5', 'D50'], 'D50% 50 mL')).toEqual(['D50']);
    expect(abbrInText(['PaO2', 'PO2'], 'PaO₂ 60, SpO₂ 90')).toEqual(['PaO2']);
  });

  it('label dengan karakter khusus', () => {
    expect(abbrInText(['P/F', 'HCO3'], 'P/F 180, HCO₃⁻ 18')).toEqual(['P/F', 'HCO3']);
  });

  it('collectText melewati kunci yang dikecualikan', () => {
    const t = collectText({ a: 'MAP', evidence: [{ t: 'NEJM' }], b: ['ICU', { c: 'RASS' }], n: null }, new Set(['evidence']));
    expect(t.split('\n')).toEqual(['MAP', 'ICU', 'RASS']);
  });

  it('primaryAbbrKeys hanya memakai arti utama homonim', () => {
    const keys = primaryAbbrKeys();
    expect(keys).toContain('RR');
    expect(keys).toContain('TDD');
    expect(keys).not.toContain('RR-risiko');
    expect(keys).not.toContain('TDD-diastolik');
    expect(abbrInText(keys, 'TDD 24u · Basal 12u — GDS 250')).toEqual(expect.arrayContaining(['TDD', 'GDS']));
  });

  it('daftar kandidat halaman data tidak berisi duplikat', () => {
    expect(new Set(FLUID_ABBR).size).toBe(FLUID_ABBR.length);
    expect(new Set(DRUG_ABBR).size).toBe(DRUG_ABBR.length);
  });
});
