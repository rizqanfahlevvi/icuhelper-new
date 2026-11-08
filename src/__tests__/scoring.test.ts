import { describe, it, expect } from 'vitest';
import {
  sofaRespFromPf, sofaRespFromSf, sofaCoag, sofaLiver, sofaCns, sofaRenalCreatinine, sofaRenalUrine,
  normalizeFio2, ferreiraMortality,
} from '../utils/sofa';
import { computeApache, apacheOxyPao2, apacheAaDo2, apacheMortalityNonop, apacheCr } from '../utils/apache';

describe('SOFA — respirasi P/F (Vincent 1996)', () => {
  it('ambang 400/300/200/100; poin 3–4 hanya dengan dukungan napas', () => {
    expect(sofaRespFromPf(450, false)).toBe(0);
    expect(sofaRespFromPf(399, false)).toBe(1);
    expect(sofaRespFromPf(250, false)).toBe(2);
    expect(sofaRespFromPf(150, false)).toBe(2);
    expect(sofaRespFromPf(150, true)).toBe(3);
    expect(sofaRespFromPf(80, true)).toBe(4);
    expect(sofaRespFromPf(80, false)).toBe(2);
  });
});

describe('SOFA — respirasi S/F (Pandharipande 2009: 512/357/214/89)', () => {
  it('SpO₂ 96% / FiO₂ 0,28 → S/F 343 → 2 poin (dulu 0 poin)', () => {
    const sf = 96 / 0.28;
    expect(Math.round(sf)).toBe(343);
    expect(sofaRespFromSf(sf, false)).toBe(2);
  });
  it('SpO₂ 80% / FiO₂ 1,0 → S/F 80 → 4 poin dengan dukungan napas (dulu maksimal 3)', () => {
    expect(sofaRespFromSf(80, true)).toBe(4);
    expect(sofaRespFromSf(80, false)).toBe(2);
  });
  it('batas tepat', () => {
    expect(sofaRespFromSf(512, false)).toBe(0);
    expect(sofaRespFromSf(511, false)).toBe(1);
    expect(sofaRespFromSf(357, false)).toBe(1);
    expect(sofaRespFromSf(356, false)).toBe(2);
    expect(sofaRespFromSf(214, true)).toBe(2);
    expect(sofaRespFromSf(213, true)).toBe(3);
    expect(sofaRespFromSf(89, true)).toBe(3);
    expect(sofaRespFromSf(88, true)).toBe(4);
  });
  it('udara ruang SpO₂ 100% → S/F 476 → 1 poin (keterbatasan metode)', () => {
    expect(sofaRespFromSf(100 / 0.21, false)).toBe(1);
  });
});

describe('SOFA — organ lain', () => {
  it('trombosit', () => {
    expect(sofaCoag(150)).toBe(0);
    expect(sofaCoag(149)).toBe(1);
    expect(sofaCoag(99)).toBe(2);
    expect(sofaCoag(49)).toBe(3);
    expect(sofaCoag(19)).toBe(4);
  });
  it('bilirubin (nilai antara 1,9 dan 2,0 masuk 1 poin)', () => {
    expect(sofaLiver(1.1)).toBe(0);
    expect(sofaLiver(1.2)).toBe(1);
    expect(sofaLiver(1.95)).toBe(1);
    expect(sofaLiver(2.0)).toBe(2);
    expect(sofaLiver(6.0)).toBe(3);
    expect(sofaLiver(12)).toBe(4);
  });
  it('GCS valid 3–15 bulat; di luar → null', () => {
    expect(sofaCns(15)).toBe(0);
    expect(sofaCns(13)).toBe(1);
    expect(sofaCns(10)).toBe(2);
    expect(sofaCns(6)).toBe(3);
    expect(sofaCns(5)).toBe(4);
    expect(sofaCns(16)).toBeNull();
    expect(sofaCns(2)).toBeNull();
    expect(sofaCns(12.5)).toBeNull();
  });
  it('renal: kreatinin & UO, diambil terberat', () => {
    expect(sofaRenalCreatinine(1.1)).toBe(0);
    expect(sofaRenalCreatinine(1.9)).toBe(1);
    expect(sofaRenalCreatinine(3.4)).toBe(2);
    expect(sofaRenalCreatinine(4.9)).toBe(3);
    expect(sofaRenalCreatinine(5.0)).toBe(4);
    expect(sofaRenalUrine(600)).toBe(0);
    expect(sofaRenalUrine(450)).toBe(3);
    expect(sofaRenalUrine(150)).toBe(4);
    expect(Math.max(sofaRenalCreatinine(1.5), sofaRenalUrine(150))).toBe(4);
  });
  it('FiO₂ dinormalisasi & divalidasi', () => {
    expect(normalizeFio2(40, 'persen')).toBeCloseTo(0.4);
    expect(normalizeFio2(0.5, 'desimal')).toBeCloseTo(0.5);
    expect(normalizeFio2(15, 'persen')).toBeNull();
    expect(normalizeFio2(1.5, 'desimal')).toBeNull();
  });
});

describe('SOFA — mortalitas Ferreira 2001 (SOFA awal)', () => {
  it.each([
    [0, '0%'], [1, '0%'], [3, '6,4%'], [5, '20,2%'], [6, '21,5%'], [9, '33,3%'], [11, '50,0%'], [12, '>90%'], [20, '>90%'],
  ])('SOFA %i → %s', (total, mort) => {
    expect(ferreiraMortality(total).mortality).toBe(mort);
  });
});


describe('APACHE II (Knaus 1985)', () => {
  it('PaO₂ tepat 61 dengan FiO₂ <0,5 → +1 (dulu +3)', () => {
    expect(apacheOxyPao2(61)).toBe(1);
    expect(apacheOxyPao2(70)).toBe(1);
    expect(apacheOxyPao2(71)).toBe(0);
    expect(apacheOxyPao2(60)).toBe(3);
    expect(apacheOxyPao2(54)).toBe(4);
  });

  it('FiO₂ kosong → oksigenasi TIDAK dihitung (tidak diasumsikan 21%)', () => {
    const r = computeApache({ pao2: 50, chronic: 'none' });
    expect(r.breakdown.find((b) => b.label.startsWith('Oksigenasi'))).toBeUndefined();
    expect(r.missing.some((m) => m.includes('FiO₂'))).toBe(true);
  });

  it('FiO₂ ≥0,5 tanpa PaCO₂ → oksigenasi ditandai kosong', () => {
    const r = computeApache({ pao2: 80, fio2: 60, chronic: 'none' });
    expect(r.missing.some((m) => m.includes('PaCO₂'))).toBe(true);
  });

  it('A-aDO₂ manual: FiO₂ 0,6 · PaCO₂ 40 · PaO₂ 80 → 0,6×713 − 50 − 80 = 297,8 → +2', () => {
    expect(apacheAaDo2(0.6, 40, 80)).toBeCloseTo(297.8, 1);
    const r = computeApache({ pao2: 80, paco2: 40, fio2: 0.6, chronic: 'none' });
    expect(r.breakdown.find((b) => b.label.startsWith('Oksigenasi'))?.pts).toBe(2);
  });

  it('kreatinin ganda saat gagal ginjal akut', () => {
    expect(apacheCr(2.5, false)).toBe(3);
    expect(apacheCr(2.5, true)).toBe(6);
    expect(apacheCr(4.0, true)).toBe(8);
  });

  it('contoh lengkap dihitung manual: APS 19 + usia 5 = 24', () => {
    // Suhu 39,2 (+3) · MAP 65 (+2) · HR 125 (+2) · RR 30 (+1) · FiO₂ 0,4 PaO₂ 65 (+1)
    // pH 7,28 (+2) · Na 132 (0) · K 3,2 (+1) · Cr 1,6 (+2) · Ht 28 (+2) · WBC 18 (+1) · GCS 13 (+2)
    // APS = 3+2+2+1+1+2+0+1+2+2+1+2 = 19 · usia 68 (+5) · tanpa kronik (0) → total 24
    const r = computeApache({
      temp: 39.2, map: 65, hr: 125, rr: 30, fio2: 0.4, pao2: 65, ph: 7.28, na: 132, k: 3.2,
      cr: 1.6, hct: 28, wbc: 18, gcs: 13, age: 68, chronic: 'none',
    });
    expect(r.aps).toBe(19);
    expect(r.agePts).toBe(5);
    expect(r.total).toBe(24);
    expect(r.filled).toBe(12);
    expect(apacheMortalityNonop(r.total).mortality).toBe('~40%');
  });

  it('penyakit kronik: non-operatif/darurat 5, elektif 2', () => {
    expect(computeApache({ chronic: 'nonop' }).chronicPts).toBe(5);
    expect(computeApache({ chronic: 'emergency' }).chronicPts).toBe(5);
    expect(computeApache({ chronic: 'elective' }).chronicPts).toBe(2);
    expect(computeApache({ chronic: 'none' }).chronicPts).toBe(0);
  });
});
