import { describe, it, expect } from 'vitest';
import {
  drivingPressure, staticCompliance, mechanicalPower, assumedInspTime, airwayResistance,
  meanAirwayPressureEstimate, alveoliHighPeep, vtTarget, rsbi, interpretRsbi,
} from '../utils/ventilation';
import { ardsnetLowPeep } from '../utils/oxygenation';
import { curb65Group, psiIsClassI, psiClass, smartCopRisk } from '../utils/pneumonia';

describe('Mekanik ventilator (hitung manual)', () => {
  it('Pplat 28, PEEP 10, VT 420, RR 20, Ppeak 35 → ΔP 18, Cstat 23,3, MP 21,4 J/mnt', () => {
    const dp = drivingPressure(28, 10);
    expect(dp).toBe(18);
    expect(staticCompliance(420, dp)).toBeCloseTo(23.33, 2);
    // 0,098 × 20 × 0,42 × (35 − 9) = 21,40
    expect(mechanicalPower(20, 420, 35, dp)).toBeCloseTo(21.4, 1);
  });
  it('resistensi: flow terukur 60 L/mnt = 1 L/dtk → (35 − 28)/1 = 7; Ti asumsi I:E 1:2 pada RR 20 = 1 dtk', () => {
    expect(airwayResistance(35, 28, 1)).toBe(7);
    expect(assumedInspTime(20)).toBe(1);
    expect(airwayResistance(35, 28, 0)).toBeNull();
  });
  it('estimasi mPaw = PEEP + (Ppeak − PEEP)/3 = 10 + 25/3 = 18,3', () => {
    expect(meanAirwayPressureEstimate(35, 10)).toBeCloseTo(18.33, 2);
  });
  it('ΔP ≤0 → compliance null', () => {
    expect(staticCompliance(420, 0)).toBeNull();
  });
});

describe('Tabel PEEP/FiO₂', () => {
  it('PEEP rendah ARDSNet: FiO₂ 0,8 → 14 (dulu 10), 1,0 → 18–24 (dulu 14)', () => {
    expect(ardsnetLowPeep(0.8)).toBe('14');
    expect(ardsnetLowPeep(1.0)).toBe('18–24');
    expect(ardsnetLowPeep(0.5)).toBe('8–10');
  });
  it('PEEP tinggi ALVEOLI: 0,4 → 14–16 (dulu 8), 0,5 → 16–18 (dulu 10), 0,6 → 20, 0,8 → 22, 1,0 → 22–24', () => {
    expect(alveoliHighPeep(0.3)).toBe('5–14');
    expect(alveoliHighPeep(0.35)).toBe('14–16');
    expect(alveoliHighPeep(0.4)).toBe('14–16');
    expect(alveoliHighPeep(0.5)).toBe('16–18');
    expect(alveoliHighPeep(0.6)).toBe('20');
    expect(alveoliHighPeep(0.8)).toBe('22');
    expect(alveoliHighPeep(0.9)).toBe('22');
    expect(alveoliHighPeep(1.0)).toBe('22–24');
    expect(alveoliHighPeep(1.2)).toBeNull();
  });
});

describe('Target VT & RSBI', () => {
  it('ARDS 4–8 mulai 6; neuromuskular 6–8 (dulu 10–12)', () => {
    expect(vtTarget('ards')).toMatchObject({ min: 4, max: 8, start: 6 });
    expect(vtTarget('neuro')).toMatchObject({ min: 6, max: 8 });
  });
  it('RSBI = RR ÷ VT(L): 25/0,25 = 100 (≤105 baik); 30/0,25 = 120 (>105); tepat 105 masih ≤105', () => {
    expect(rsbi(25, 250)).toBe(100);
    expect(interpretRsbi(100).ok).toBe(true);
    expect(interpretRsbi(rsbi(30, 250)!).ok).toBe(false);
    expect(interpretRsbi(105).ok).toBe(true);
    expect(rsbi(0, 250)).toBeNull();
  });
});

describe('Skor pneumonia', () => {
  it('CURB-65 skor 3 → mortalitas derivasi 17% (dulu "22–57%")', () => {
    expect(curb65Group(3).act).toContain('17%');
    expect(curb65Group(5).act).toContain('57%');
    expect(curb65Group(1).tone).toBe('low');
  });
  it('PSI kelas I: usia ≤50 (dulu <50 — usia tepat 50 tidak bisa kelas I)', () => {
    expect(psiIsClassI(50, false, false)).toBe(true);
    expect(psiIsClassI(51, false, false)).toBe(false);
    expect(psiClass(75, false)).toEqual({ cls: 'Class III', mortality: '0,9–2,8%' });
  });
  it('SMART-COP memprediksi kebutuhan IRVS, bukan mortalitas', () => {
    expect(smartCopRisk(3).tone).toBe('mid');
    expect(smartCopRisk(3).desc).toContain('IRVS');
    expect(smartCopRisk(3).desc).not.toContain('Mortalitas');
  });
});
