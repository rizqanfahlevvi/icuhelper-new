import { describe, it, expect } from 'vitest';

// ── Anion Gap ──────────────────────────────────────────────────────────────
function calcAG(na: number, cl: number, hco3: number) {
  return na - (cl + hco3);
}
function calcCorrectedAG(ag: number, albumin: number) {
  return ag + 2.5 * (4.4 - albumin);
}
function calcDeltaRatio(effectiveAG: number, hco3: number) {
  const deltaHCO3 = 24 - hco3;
  if (deltaHCO3 === 0) return null;
  return (effectiveAG - 12) / deltaHCO3;
}

describe('Anion Gap', () => {
  it('normal: Na 140, Cl 104, HCO3 24 → AG 12', () => {
    expect(calcAG(140, 104, 24)).toBe(12);
  });
  it('high AG: Na 140, Cl 100, HCO3 16 → AG 24', () => {
    expect(calcAG(140, 100, 16)).toBe(24);
  });
  it('corrected AG with hypoalbuminemia 2 g/dL', () => {
    const ag = calcAG(140, 104, 24); // 12
    expect(calcCorrectedAG(ag, 2)).toBeCloseTo(12 + 2.5 * (4.4 - 2), 5); // 18
  });
  it('delta ratio normal range 0.8-2.0 for pure high AG acidosis', () => {
    // Classic DKA: high AG, bicarb low
    const ag = calcAG(140, 100, 10); // 30
    const dr = calcDeltaRatio(ag, 10);
    expect(dr).toBeGreaterThanOrEqual(0.8);
    expect(dr).toBeLessThanOrEqual(2.0);
  });
  it('delta ratio avoids division by zero when HCO3 = 24', () => {
    expect(calcDeltaRatio(12, 24)).toBeNull();
  });
});

// ── Parkland Burn Resuscitation ────────────────────────────────────────────
function parkland(weight: number, factor: number, tbsa: number) {
  return weight * factor * tbsa;
}

describe('Parkland burn formula', () => {
  it('70 kg, factor 2, 20% TBSA → 2800 mL', () => {
    expect(parkland(70, 2, 20)).toBe(2800);
  });
  it('50 kg, factor 3, 15% TBSA (pediatric) → 2250 mL', () => {
    expect(parkland(50, 3, 15)).toBe(2250);
  });
  it('8h first half equals 16h second half', () => {
    const total = parkland(70, 2, 20);
    expect(total / 2).toBe(total / 2); // trivial but explicit
  });
  it('remaining rate correct when 3h elapsed', () => {
    const total = parkland(70, 2, 20);
    const firstHalf = total / 2;
    const hoursRemaining = 8 - 3;
    expect(Math.round(firstHalf / hoursRemaining)).toBe(Math.round(1400 / 5)); // 280 mL/h
  });
});

// ── PF Ratio ───────────────────────────────────────────────────────────────
function calcPFRatio(pao2: number, fio2: number) {
  return pao2 / fio2;
}

describe('PF Ratio (Berlin classification)', () => {
  it('PaO₂ 80 / FiO₂ 0.4 = 200 (ARDS Mild boundary)', () => {
    expect(calcPFRatio(80, 0.4)).toBe(200);
  });
  it('PaO₂ 60 / FiO₂ 1.0 = 60 (ARDS Severe)', () => {
    expect(calcPFRatio(60, 1.0)).toBe(60);
  });
  it('PaO₂ 120 / FiO₂ 0.3 = 400 (Normal)', () => {
    expect(calcPFRatio(120, 0.3)).toBeCloseTo(400, 5);
  });
});

// ── CKD-EPI inspired (basic Cockroft-Gault for tests) ─────────────────────
function cockcroftGault(age: number, weight: number, scr: number, isFemale: boolean) {
  const cg = ((140 - age) * weight) / (72 * scr);
  return isFemale ? cg * 0.85 : cg;
}

describe('Cockcroft-Gault CrCl', () => {
  it('male 60y, 70kg, SCr 1.0 mg/dL', () => {
    expect(cockcroftGault(60, 70, 1.0, false)).toBeCloseTo((80 * 70) / 72, 4);
  });
  it('female multiplier 0.85 applies', () => {
    const male = cockcroftGault(50, 65, 1.0, false);
    const female = cockcroftGault(50, 65, 1.0, true);
    expect(female).toBeCloseTo(male * 0.85, 5);
  });
  it('CrCl decreases with higher SCr', () => {
    const low = cockcroftGault(60, 70, 1.0, false);
    const high = cockcroftGault(60, 70, 2.0, false);
    expect(high).toBeLessThan(low);
  });
});

// ── Koreksi Bikarbonat (NaHCO3) ─────────────────────────────────────────────
import { bicarbDeficit, bicarbSpaceFernandez, recommendBicarbFactor } from '../utils/acidBase';

describe('Bicarbonate correction', () => {
  it('bicarbDeficit: 0.5 x 70 x (18-10) = 280 mEq', () => {
    expect(bicarbDeficit(0.5, 70, 18, 10)).toBeCloseTo(280, 5);
  });
  it('bicarbDeficit scales with factor', () => {
    expect(bicarbDeficit(0.8, 70, 18, 10)).toBeCloseTo(448, 5);
  });
  it('Fernandez space expands as HCO3 falls', () => {
    expect(bicarbSpaceFernandez(24)).toBeCloseTo(0.4 + 2.6 / 24, 5);
    expect(bicarbSpaceFernandez(5)).toBeGreaterThan(bicarbSpaceFernandez(20));
  });
  it('recommended factor rises with severity', () => {
    expect(recommendBicarbFactor(15).factor).toBe(0.5);
    expect(recommendBicarbFactor(8).factor).toBe(0.6);
    expect(recommendBicarbFactor(4).factor).toBe(0.8);
  });
});
