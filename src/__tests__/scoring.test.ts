import { describe, it, expect } from 'vitest';
import {
  sofaRespFromPf, sofaRespFromSf, sofaCoag, sofaLiver, sofaCns, sofaRenalCreatinine, sofaRenalUrine,
  normalizeFio2, ferreiraMortality,
} from '../utils/sofa';

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
