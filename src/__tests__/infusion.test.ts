import { describe, it, expect } from 'vitest';
import { infusionRateMlH, isFlatUnit } from '../utils/infusion';

describe('Laju syringe pump', () => {
  it('HOTFIX fentanyl: 50 mcg/jam flat, 10 mcg/mL → 5 mL/jam (tidak dikali BB)', () => {
    expect(infusionRateMlH('mcg/jam', 50, 70, 10)).toBeCloseTo(5);
    expect(isFlatUnit('mcg/jam')).toBe(true);
    // Bug lama: diperlakukan mcg/kg/jam → 50 × 70 ÷ 10 = 350 mL/jam (≈70× overdosis)
    expect(infusionRateMlH('mcg/kg/jam', 50, 70, 10)).toBeCloseTo(350);
  });
  it('norepinefrin 0,1 mcg/kg/mnt · 70 kg · 80 mcg/mL → 5,25 mL/jam', () => {
    expect(infusionRateMlH('mcg/kg/mnt', 0.1, 70, 80)).toBeCloseTo(5.25);
  });
  it('vasopresin 0,03 U/mnt · 0,2 U/mL → 9 mL/jam', () => {
    expect(infusionRateMlH('units/mnt', 0.03, 70, 0.2)).toBeCloseTo(9);
  });
  it('midazolam 0,05 mg/kg/jam · 70 kg · 1 mg/mL → 3,5 mL/jam', () => {
    expect(infusionRateMlH('mg/kg/jam', 0.05, 70, 1)).toBeCloseTo(3.5);
  });
  it('input tidak valid → NaN', () => {
    expect(infusionRateMlH('mcg/kg/mnt', 0.1, 0, 80)).toBeNaN();
    expect(infusionRateMlH('mg/jam', 0, 70, 1)).toBeNaN();
  });
});
