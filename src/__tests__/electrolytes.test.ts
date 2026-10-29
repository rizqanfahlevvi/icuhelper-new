import { describe, it, expect } from 'vitest';
import {
  hypoKSeverity, kDeficitRange, kclEmpiricPlan, kAtNormalPh, hyperKSeverity, kProtocol24h,
  correctedCalcium, caMgdlToMmol, caGluconateInfusion, hyperCaSeverity,
  mgMgdlToMeq, mgso4DoseToTarget, mgMaxDoseGrams, mgInfusionHours,
} from '../utils/electrolytes';
import { hypoNaRiseLimits } from '../utils/sodium';

describe('Kalium — hipokalemia', () => {
  it('klasifikasi keparahan (Kardalas 2018)', () => {
    expect(hypoKSeverity(2.4)).toBe('berat');
    expect(hypoKSeverity(2.5)).toBe('sedang');
    expect(hypoKSeverity(2.9)).toBe('sedang');
    expect(hypoKSeverity(3.0)).toBe('ringan');
  });

  it('defisit 200–400 mEq per 1 mEq/L, skala BB/70', () => {
    // K 3.0 → 4.0, 70 kg: Δ1 → 200–400 mEq
    const a = kDeficitRange(3.0, 4.0, 70);
    expect(a.delta).toBeCloseTo(1);
    expect(a.lo).toBeCloseTo(200);
    expect(a.hi).toBeCloseTo(400);
    // K 2.8 → 4.0, 35 kg: Δ1.2 × 0.5 → 120–240 mEq
    const b = kDeficitRange(2.8, 4.0, 35);
    expect(b.lo).toBeCloseTo(120);
    expect(b.hi).toBeCloseTo(240);
    // target ≤ aktual → 0
    expect(kDeficitRange(4.2, 4.0, 70).hi).toBe(0);
  });

  it('rencana empiris KCl: 20 mEq ≈ +0.25 (Kruse 1990)', () => {
    expect(kclEmpiricPlan(3.0, 4.0)).toEqual({ delta: 1, doses20: 4, totalMeq: 80 });
    expect(kclEmpiricPlan(3.2, 4.0).doses20).toBe(4); // 0.8/0.25 = 3.2 → 4
    expect(kclEmpiricPlan(3.5, 4.0).doses20).toBe(2); // tepat 2, bukan 3 (galat float)
    expect(kclEmpiricPlan(3.7, 4.0).doses20).toBe(2); // 0.3/0.25 = 1.2 → 2
    expect(kclEmpiricPlan(4.1, 4.0).doses20).toBe(0);
  });

  it('protokol 24 jam: faktor × ΔK × BB + rumatan 1 mEq/kg/hari', () => {
    // K 2.8 → 4.0, 70 kg, faktor 0.3: 25.2 + 70 = 95.2 → paket 100 mEq (4.17 mEq/jam)
    const a = kProtocol24h(2.8, 4.0, 70, 0.3, 1);
    expect(a.deficit).toBeCloseTo(25.2);
    expect(a.maint).toBe(70);
    expect(a.raw).toBeCloseTo(95.2);
    expect(a.rounded).toBe(100);
    expect(a.ratePerHr).toBeCloseTo(4.167, 2);
    // faktor 0.4: 33.6 + 70 = 103.6 → 100
    expect(kProtocol24h(2.8, 4.0, 70, 0.4, 1).rounded).toBe(100);
    // 50 kg, K 3.2 → 4.0, 0.4: 16 + 50 = 66 → 50
    expect(kProtocol24h(3.2, 4.0, 50, 0.4, 1).rounded).toBe(50);
    // tanpa rumatan, defisit kecil → minimal satu paket 50
    expect(kProtocol24h(3.2, 4.0, 70, 0.4, 0).raw).toBeCloseTo(22.4);
    expect(kProtocol24h(3.2, 4.0, 70, 0.4, 0).rounded).toBe(50);
    // K ≥ target, tanpa rumatan → 0
    expect(kProtocol24h(4.2, 4.0, 70, 0.4, 0).rounded).toBe(0);
  });

  it('K pada pH dinormalkan (~0.6 per 0.1 pH)', () => {
    expect(kAtNormalPh(6.0, 7.2)).toBeCloseTo(4.8);
    expect(kAtNormalPh(3.0, 7.5)).toBeCloseTo(3.6);
  });
});

describe('Kalium — hiperkalemia', () => {
  it('klasifikasi keparahan', () => {
    expect(hyperKSeverity(5.4)).toBe('batas');
    expect(hyperKSeverity(5.5)).toBe('ringan');
    expect(hyperKSeverity(6.0)).toBe('sedang');
    expect(hyperKSeverity(6.4)).toBe('sedang');
    expect(hyperKSeverity(6.5)).toBe('berat');
  });
});

describe('Kalsium', () => {
  it('Ca terkoreksi albumin & konversi', () => {
    expect(correctedCalcium(7.0, 2.0)).toBeCloseTo(8.6);
    expect(caMgdlToMmol(7.6)).toBeCloseTo(1.896, 2); // ambang berat SfE ≈ 1.9 mmol/L
  });

  it('infus rumatan SfE: 100 mL Ca glukonat 10% / 1100 mL', () => {
    const lo = caGluconateInfusion(50, 70);
    expect(lo.concMgPerMl).toBeCloseTo(0.8455, 3);
    expect(lo.mgPerHr).toBeCloseTo(42.27, 1);
    expect(lo.mgPerKgPerHr).toBeCloseTo(0.604, 2);
    expect(caGluconateInfusion(100, 70).mgPerKgPerHr).toBeCloseTo(1.208, 2);
  });

  it('keparahan hiperkalsemia (SfE 2016)', () => {
    expect(hyperCaSeverity(11.9)).toBe('ringan');
    expect(hyperCaSeverity(12.1)).toBe('sedang');
    expect(hyperCaSeverity(14.1)).toBe('berat');
  });
});

describe('Magnesium', () => {
  it('konversi mg/dL → mEq/L', () => {
    expect(mgMgdlToMeq(1.2)).toBeCloseTo(0.9875, 3);
    expect(mgMgdlToMeq(2.0)).toBeCloseTo(1.6458, 3);
  });

  it('dosis MgSO₄ ke target (1 g ≈ +0.15 mEq/L, Hansen 2018)', () => {
    // Mg 1.2 → 2.0 mg/dL: Δ0.658 mEq/L ÷ 0.15 = 4.39 g → dibulatkan 4.5 g
    const a = mgso4DoseToTarget(1.2, 2.0, 70);
    expect(a.rawGrams).toBeCloseTo(4.389, 2);
    expect(a.grams).toBe(4.5);
    expect(a.capped).toBe(false);
    // Mg 0.5 → 2.2, 40 kg: 9.33 g → 9.5 g > batas 1.5 mEq/kg (7.39 g) → dibatasi 7.0 g
    const b = mgso4DoseToTarget(0.5, 2.2, 40);
    expect(b.capped).toBe(true);
    expect(b.grams).toBe(7);
    expect(mgMaxDoseGrams(70)).toBeCloseTo(12.93, 1);
    expect(mgso4DoseToTarget(2.1, 2.0, 70).grams).toBe(0);
  });

  it('durasi infus', () => {
    expect(mgInfusionHours(4.5)).toEqual({ min: 8, max: 12 });
    expect(mgInfusionHours(6)).toEqual({ min: 25, max: null });
  });
});

describe('Natrium — batas kenaikan hiponatremia', () => {
  it('risiko ODS normal vs tinggi (Verbalis 2013; Spasovski 2014)', () => {
    expect(hypoNaRiseLimits(false)).toEqual({ goalLo: 4, goalHi: 8, limit24: 10, limitNext24: 8 });
    expect(hypoNaRiseLimits(true)).toEqual({ goalLo: 4, goalHi: 6, limit24: 8, limitNext24: 8 });
  });
});
