import { describe, it, expect } from 'vitest';
import { stageAki, akiByCreatinine, akiByUrine } from '../utils/aki';

describe('AKI KDIGO 2012 — kreatinin', () => {
  it('PGK: basal 4,2 → 4,3 BUKAN AKI stage 3 (dulu stage 3)', () => {
    const r = akiByCreatinine(4.2, 4.3);
    expect(r.meetsAki).toBe(false);
    expect(r.stage).toBe(0);
  });
  it('basal 3,8 → 4,1 (naik 0,3) memenuhi AKI dan SCr ≥4,0 → stage 3', () => {
    expect(akiByCreatinine(3.8, 4.1).stage).toBe(3);
  });
  it('rasio & kenaikan absolut', () => {
    expect(akiByCreatinine(1.0, 1.3).stage).toBe(1);   // Δ0,3
    expect(akiByCreatinine(1.0, 1.5).stage).toBe(1);   // 1,5×
    expect(akiByCreatinine(1.0, 2.0).stage).toBe(2);   // 2,0×
    expect(akiByCreatinine(1.0, 3.0).stage).toBe(3);   // 3,0×
    expect(akiByCreatinine(1.0, 1.2).stage).toBe(0);
  });
  it('tanpa basal → kriteria SCr tidak dapat dinilai (bukan "tidak AKI")', () => {
    const r = stageAki({ currentScr: 2.5 });
    expect(r.stage).toBeNull();
    expect(r.notes.some((n) => n.includes('tanpa SCr basal'))).toBe(true);
  });
  it('inisiasi RRT → stage 3', () => {
    expect(stageAki({ rrt: true }).stage).toBe(3);
  });
});

describe('AKI KDIGO 2012 — urine output', () => {
  it('70 kg: 180 mL/6 jam = 0,43 mL/kg/jam → stage 1', () => {
    const r = akiByUrine(180, 6, 70);
    expect(r.rate).toBeCloseTo(0.43, 2);
    expect(r.stage).toBe(1);
  });
  it('<0,5 selama ≥12 jam → stage 2; <0,3 ≥24 jam → stage 3; anuria ≥12 jam → stage 3', () => {
    expect(akiByUrine(300, 12, 70).stage).toBe(2);
    expect(akiByUrine(400, 24, 70).stage).toBe(3); // 0,24 mL/kg/jam
    expect(akiByUrine(0, 12, 70).stage).toBe(3);
  });
  it('periode <6 jam → belum dapat dinilai', () => {
    expect(akiByUrine(50, 4, 70).stage).toBeNull();
  });
  it('stage akhir = terberat dari SCr & UO', () => {
    const r = stageAki({ baselineScr: 1.0, currentScr: 1.4, uoMl: 300, uoHours: 12, weightKg: 70 });
    expect(r.byScr).toBe(1);
    expect(r.byUo).toBe(2);
    expect(r.stage).toBe(2);
  });
});
