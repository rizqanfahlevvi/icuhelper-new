import { describe, it, expect } from 'vitest';
import { basalBolusPlan, weightBasedTddFactor, glucoseGramsEstimate } from '../utils/insulin';

describe('TDD awal — RABBIT-2 / RABBIT-2 Surgery', () => {
  it('tier GDS: ≤200 → 0,4; >200 → 0,5', () => {
    expect(weightBasedTddFactor(180, 'normal').factor).toBe(0.4);
    expect(weightBasedTddFactor(200, 'normal').factor).toBe(0.4);
    expect(weightBasedTddFactor(201, 'normal').factor).toBe(0.5);
  });
  it('lansia ≥70 / kreatinin ≥2,0 → 0,3; steroid 0,6 (estimasi tak tersumber); kritis → IV', () => {
    expect(weightBasedTddFactor(250, 'lansia').factor).toBe(0.3);
    expect(weightBasedTddFactor(250, 'ginjal').factor).toBe(0.3);
    const s = weightBasedTddFactor(250, 'steroid');
    expect(s.factor).toBe(0.6);
    expect(s.sourced).toBe(false);
    expect(weightBasedTddFactor(250, 'kritis').factor).toBeNull();
  });
});

describe('Rencana basal-bolus (hitung manual)', () => {
  it('70 kg, GDS 180, target 150, makan 3× → TDD 28 (dulu 35), basal 14, bolus 4,7/makan, CF 64, koreksi 0,5, total 5,2', () => {
    const r = basalBolusPlan({ weightKg: 70, gds: 180, target: 150, meals: 'makan', cond: 'normal' });
    expect(r?.kind).toBe('ok');
    if (r?.kind !== 'ok') return;
    expect(r.tdd).toBe(28);
    expect(r.basal).toBe(14);
    expect(r.bolusPerMeal).toBe(4.7);
    expect(r.cf).toBe(64);          // 1800/28 = 64,3
    expect(r.correction).toBe(0.5); // 30/64 = 0,47
    expect(r.totalNow).toBe(5.2);
  });

  it('70 kg, GDS 250 → TDD 35, basal 18, bolus 5,7, CF 51, koreksi 2,0, total 7,7', () => {
    const r = basalBolusPlan({ weightKg: 70, gds: 250, target: 150, meals: 'makan', cond: 'normal' });
    if (r?.kind !== 'ok') throw new Error('expected ok');
    expect(r.tdd).toBe(35);
    expect(r.basal).toBe(18);
    expect(r.bolusPerMeal).toBe(5.7);
    expect(r.cf).toBe(51);
    expect(r.correction).toBe(2);
    expect(r.totalNow).toBe(7.7);
  });

  it('lansia 70 kg → TDD 21', () => {
    const r = basalBolusPlan({ weightKg: 70, gds: 250, target: 150, meals: 'makan', cond: 'lansia' });
    if (r?.kind !== 'ok') throw new Error('expected ok');
    expect(r.tdd).toBe(21);
  });

  it('kritis tanpa TDD sebelumnya → needsIv; dengan TDD dari IV → dihitung', () => {
    expect(basalBolusPlan({ weightKg: 70, gds: 250, target: 150, meals: 'puasa', cond: 'kritis' })?.kind).toBe('needsIv');
    const r = basalBolusPlan({ weightKg: 70, gds: 250, target: 150, meals: 'puasa', cond: 'kritis', prevTdd: 40 });
    if (r?.kind !== 'ok') throw new Error('expected ok');
    expect(r.tdd).toBe(40);
    expect(r.totalNow).toBe(r.correction);
  });

  it('GDS <70 → hipoglikemia; GDS >400 → peringatan IV', () => {
    expect(basalBolusPlan({ weightKg: 70, gds: 60, target: 150, meals: 'makan', cond: 'normal' })?.kind).toBe('hypo');
    const r = basalBolusPlan({ weightKg: 70, gds: 450, target: 150, meals: 'makan', cond: 'normal' });
    if (r?.kind !== 'ok') throw new Error('expected ok');
    expect(r.warnings.some((w) => w.includes('>400'))).toBe(true);
  });
});

describe('Estimasi glukosa hipoglikemia', () => {
  it('Δ 100 mg/dL, 70 kg → 14 g (estimasi praktis)', () => {
    expect(glucoseGramsEstimate(100, 70)).toBe(14);
    expect(glucoseGramsEstimate(0, 70)).toBe(0);
  });
});
