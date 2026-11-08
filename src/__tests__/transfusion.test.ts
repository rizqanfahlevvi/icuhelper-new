import { describe, it, expect } from 'vitest';
import { redCellVolumeMl, bagsFromVolume, cryoBags, randomDonorUnits, plateletRiseRange, PRC_BAG_ML } from '../utils/transfusion';

describe('PRC — Davies 2007 (k = 3 / Hct 0,75 = 4)', () => {
  it('ΔHb 2 g/dL, 60 kg → 2 × 60 × 4 = 480 mL → 2 kantong 250 mL', () => {
    const v = redCellVolumeMl(2, 60);
    expect(v).toBe(480);
    expect(bagsFromVolume(v, PRC_BAG_ML)).toBe(2);
  });
  it('setara aturan dewasa: ΔHb 1 g/dL, 70 kg → 280 mL ≈ 1 kantong', () => {
    expect(redCellVolumeMl(1, 70)).toBe(280);
  });
  it('input tidak valid → NaN / 0 kantong', () => {
    expect(redCellVolumeMl(0, 60)).toBeNaN();
    expect(bagsFromVolume(NaN, 250)).toBe(0);
  });
});

describe('Kriopresipitat — rumus defisit dipakai, aturan 1/10 kg hanya pembanding', () => {
  it('fibrinogen 120 → 150 mg/dL, 70 kg: PV 2.800 mL, defisit 840 mg → 5 kantong (dulu 7 karena max dengan aturan)', () => {
    const r = cryoBags(120, 150, 70)!;
    expect(r.plasmaVolMl).toBe(2800);
    expect(r.deficitMg).toBe(840);
    expect(r.bagsByDeficit).toBe(5);
    expect(r.bagsByRule).toBe(7);
    expect(r.volMl).toBe(85);
  });
  it('fibrinogen 80 → 150, 70 kg: defisit 1.960 mg → 10 kantong', () => {
    expect(cryoBags(80, 150, 70)!.bagsByDeficit).toBe(10);
  });
  it('target ≤ aktual atau BB kosong → null', () => {
    expect(cryoBags(160, 150, 70)).toBeNull();
    expect(cryoBags(100, 150, 0)).toBeNull();
  });
});

describe('Trombosit — satuan ×10³/µL', () => {
  it('RD: 60 kg → 6 unit; kenaikan 5×6×70/60 = 35 s/d 70 ×10³/µL', () => {
    expect(randomDonorUnits(60)).toBe(6);
    const r = plateletRiseRange('rd', 6, 60)!;
    expect(r.min).toBeCloseTo(35, 6);
    expect(r.max).toBeCloseTo(70, 6);
  });
  it('RD dibatasi 4–10 unit', () => {
    expect(randomDonorUnits(30)).toBe(4);
    expect(randomDonorUnits(130)).toBe(10);
  });
  it('SDA 1 kantong, 70 kg → 30–60 ×10³/µL', () => {
    expect(plateletRiseRange('sda', 1, 70)).toEqual({ min: 30, max: 60 });
  });
});
