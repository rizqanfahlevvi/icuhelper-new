import { describe, it, expect } from 'vitest';
import { calcIbw, calcBmi, calcBsa, calcLbw, calcAdjBw } from '../utils/anthropometry';

describe('calcIbw (Devine formula)', () => {
  it('male 170 cm', () => {
    expect(calcIbw(170, false)).toBeCloseTo(50 + 0.91 * (170 - 152.4), 5);
  });
  it('female 165 cm', () => {
    expect(calcIbw(165, true)).toBeCloseTo(45.5 + 0.91 * (165 - 152.4), 5);
  });
  it('clamps to 30 kg for short stature', () => {
    // Very short (100 cm) → formula gives negative, must clamp to 30
    expect(calcIbw(100, false)).toBe(30);
  });
  it('male = female at 152.4 cm (base)', () => {
    // At 152.4 cm: male=50, female=45.5 — no clamp needed
    expect(calcIbw(152.4, false)).toBeCloseTo(50, 5);
    expect(calcIbw(152.4, true)).toBeCloseTo(45.5, 5);
  });
});

describe('calcBmi', () => {
  it('70 kg / 170 cm', () => {
    expect(calcBmi(70, 170)).toBeCloseTo(70 / (1.7 * 1.7), 5);
  });
  it('BMI > 30 for 100 kg / 170 cm', () => {
    expect(calcBmi(100, 170)).toBeGreaterThan(30);
  });
});

describe('calcBsa (Du Bois)', () => {
  it('70 kg / 170 cm', () => {
    expect(calcBsa(70, 170)).toBeCloseTo(Math.sqrt((170 * 70) / 3600), 5);
  });
});

describe('calcLbw (Janmahasatian)', () => {
  it('male 70 kg BMI 24.2', () => {
    const bmi = calcBmi(70, 170);
    const lbw = calcLbw(70, bmi, false);
    expect(lbw).toBeCloseTo((9270 * 70) / (6680 + 216 * bmi), 5);
  });
  it('female 60 kg BMI 22.0', () => {
    const bmi = calcBmi(60, 165);
    const lbw = calcLbw(60, bmi, true);
    expect(lbw).toBeCloseTo((9270 * 60) / (8780 + 244 * bmi), 5);
  });
});

describe('calcAdjBw', () => {
  it('IBW 60 kg, actual 90 kg → 60 + 0.4×30 = 72', () => {
    expect(calcAdjBw(60, 90)).toBeCloseTo(72, 5);
  });
  it('same IBW and actual → returns IBW', () => {
    expect(calcAdjBw(65, 65)).toBe(65);
  });
});
