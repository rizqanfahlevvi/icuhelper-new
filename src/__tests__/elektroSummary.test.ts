import { describe, it, expect } from 'vitest';
import { naSummary, kSummary, caSummary, mgSummary } from '../utils/elektroSummary';
import { computeNa } from '../utils/sodium';

const naIn = (na: number, glucose = NaN) => computeNa({
  weightKg: 70, na, glucose, sex: 'm', age: 50, onset: 'kronik', fluidId: 'd5w',
  odsRiskFactors: 0, riseTarget: 6, hyperTargetNa: 140, hyperDropPer24: 10,
  urea: NaN, ureaUnit: 'ureum', measuredOsm: NaN, naDirect: NaN,
});

describe('elektroSummary — ringkasan bilah hasil memakai ambang yang sudah ada', () => {
  it('Na: hipo/hiper/normal mengikuti computeNa', () => {
    expect(naSummary(naIn(128))).toEqual({ text: 'Hiponatremia · Na 128.0', tone: 'bad' });
    expect(naSummary(naIn(152))).toEqual({ text: 'Hipernatremia · Na 152.0', tone: 'bad' });
    expect(naSummary(naIn(140))?.tone).toBe('good');
    expect(naSummary(null)).toBeNull();
  });
  it('Na: koreksi glukosa (Katz 1,6/100 mg/dL) → label "terkoreksi"', () => {
    // 130 + 1.6 × (600−100)/100 = 138 → normal
    expect(naSummary(naIn(130, 600))).toEqual({ text: 'Na terkoreksi 138.0 · rentang normal', tone: 'good' });
  });
  it('K: derajat hipo/hiper sesuai util; batas normal 3,5–5,0', () => {
    expect(kSummary('2.9')).toEqual({ text: 'Hipokalemia sedang · K 2.9', tone: 'bad' });
    expect(kSummary('3.2')).toEqual({ text: 'Hipokalemia ringan · K 3.2', tone: 'warn' });
    expect(kSummary('3.5')?.tone).toBe('good');
    expect(kSummary('5.0')?.tone).toBe('good');
    expect(kSummary('5.2')).toEqual({ text: 'K 5.2 · di atas normal', tone: 'warn' });
    expect(kSummary('6.6')).toEqual({ text: 'Hiperkalemia berat · K 6.6', tone: 'bad' });
    expect(kSummary('')).toBeNull();
  });
  it('Ca: angka terkoreksi Payne bila albumin ada (tanpa interpretasi); albumin >7 diabaikan', () => {
    // 7.6 + 0.8 × (4 − 2) = 9.2
    expect(caSummary('7.6', '2')).toEqual({ text: 'Ca terkoreksi 9.20 mg/dL', tone: 'neutral' });
    expect(caSummary('7.6', '35')).toEqual({ text: 'Ca total 7.6 mg/dL', tone: 'neutral' });
    expect(caSummary('', '3')).toBeNull();
  });
  it('Mg: mg/dL → mEq/L (×10÷24,305×2)', () => {
    // 1.2 × 10 / 24.305 × 2 = 0.987
    expect(mgSummary('1.2')).toEqual({ text: 'Mg 1.2 mg/dL (0.99 mEq/L)', tone: 'neutral' });
  });
});
