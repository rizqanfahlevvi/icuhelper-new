import { describe, it, expect } from 'vitest';
import { normalizeSearch, expandQuery, prepareEntries, searchEntries, type SearchEntry } from '../utils/searchIndex';
import { buildPageEntries, buildPatientEntries } from '../utils/searchPages';
import { buildHeavyEntries, referenceKey } from '../utils/searchIndexHeavy';
import type { Patient } from '../store/usePatientStore';

const patient = (id: string, nama: string): Patient => ({
  id, nama, category: 'dewasa', gender: 'L', ageUnit: 'tahun', ageInput: '58', ageYears: '58', ageMonths: '',
  agePrecise: '58 thn', weightKg: '72', heightCm: '168', createdAt: '2026-11-01',
});

const ALL: SearchEntry[] = [
  ...buildPatientEntries([patient('p1', 'Tn. Budi Santoso'), patient('p2', 'Ny. Sari')], 'p1'),
  ...buildPageEntries(),
  ...buildHeavyEntries(),
];
const IDX = prepareEntries(ALL);
const find = (q: string) => searchEntries(IDX, q);
const kinds = (q: string) => find(q).map((g) => g.kind);
const titles = (q: string, kind: string) => find(q).find((g) => g.kind === kind)?.items.map((i) => i.title) ?? [];

describe('normalizeSearch', () => {
  it('huruf kecil, tanpa aksen, subskrip → angka', () => {
    expect(normalizeSearch('PaO₂/FiO₂')).toBe('pao2 fio2');
    expect(normalizeSearch('Café')).toBe('cafe');
  });
  it('ejaan Inggris → Indonesia pada kata panjang (ph→f), tapi "pH" tetap', () => {
    expect(normalizeSearch('Norepinephrine')).toBe('norepinefrine');
    expect(normalizeSearch('pH')).toBe('ph');
  });
});

describe('expandQuery', () => {
  it('sinonim obat & elektrolit', () => {
    expect(expandQuery('NE')).toContain('norepinefrin');
    expect(expandQuery('norepinephrine')).toContain('norepinefrin');
    expect(expandQuery('K')).toContain('kalium');
  });
  it('awalan istilah sinonim ≥4 huruf ikut diperluas', () => {
    expect(expandQuery('norepi')).toContain('ne');
  });
});

describe('searchEntries — kueri uji', () => {
  it('"norepinefrin" → obat Norepinefrin teratas', () => {
    expect(titles('norepinefrin', 'obat')[0]).toBe('Norepinefrin');
    expect(titles('norepinephrine', 'obat')[0]).toBe('Norepinefrin');
    expect(titles('NE', 'obat')).toContain('Norepinefrin');
  });
  it('"kalium" → kalkulator Koreksi Elektrolit + obat KCl/kalium', () => {
    expect(titles('kalium', 'halaman')).toContain('Koreksi Elektrolit');
    expect(kinds('kalium')).toContain('obat');
  });
  it('"ARDS" → P/F Ratio, singkatan ARDS, dan referensi', () => {
    expect(titles('ARDS', 'halaman')).toContain('P/F Ratio');
    expect(titles('ARDS', 'singkatan')[0]).toBe('ARDS');
    expect(kinds('ARDS')).toContain('referensi');
  });
  it('"sepsis" → Teori Sepsis-3', () => {
    expect(titles('sepsis', 'halaman')).toContain('Teori Sepsis-3');
  });
  it('"PEEP" → singkatan PEEP dengan arti', () => {
    const g = find('PEEP').find((x) => x.kind === 'singkatan');
    expect(g?.items[0].title).toBe('PEEP');
    expect(g?.items[0].subtitle).toMatch(/Positive End-Expiratory Pressure/i);
  });
  it('nama pasien → kelompok Pasien paling atas', () => {
    expect(kinds('budi')[0]).toBe('pasien');
    expect(titles('sari', 'pasien')).toEqual(['Ny. Sari']);
  });
  it('kueri 1 huruf tidak membanjiri hasil (hanya kata utuh)', () => {
    const total = find('k').reduce((n, g) => n + g.total, 0);
    expect(total).toBeLessThan(80);
  });
  it('kueri kosong → tanpa hasil', () => {
    expect(find('   ')).toEqual([]);
  });
});

describe('referenceKey', () => {
  it('ambil bagian penulis sebelum titik pertama', () => {
    expect(referenceKey('Grasselli G et al. ESICM ARDS Guidelines. Intensive Care Med 2023')).toBe('Grasselli G et al');
  });
});
