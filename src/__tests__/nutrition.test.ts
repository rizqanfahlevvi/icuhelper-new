import { describe, it, expect } from 'vitest';
import { nutritionTargets, refeedingStart, enteralVolume, pnLimits, espenAdjustedWeight } from '../utils/nutrition';

const ok = (o: ReturnType<typeof nutritionTargets>) => {
  if (o.ok === false) throw new Error(o.error);
  return o.result;
};
const by = <T extends { guideline: string }>(arr: T[], g: string) => arr.find((x) => x.guideline === g)!;

describe('Energi & protein — 70 kg, TB 170, laki-laki, tidak obes', () => {
  it('akut lanjut: ESPEN 16–25 kkal/kg = 1.120–1.750; ASPEN 2022 12–25 = 840–1.750 (dulu 25–30 = 1.750–2.100)', () => {
    const r = ok(nutritionTargets({ weightKg: 70, heightCm: 170, sex: 'm', phase: 'akut-lanjut', condition: 'kritis' }));
    expect(r.obese).toBe(false);
    expect(by(r.energy, 'ESPEN').total).toEqual({ min: 1120, max: 1750 });
    expect(by(r.energy, 'ASPEN').total).toEqual({ min: 840, max: 1750 });
    expect(by(r.protein, 'ESPEN').total).toEqual({ min: 91, max: 91 });
    expect(by(r.protein, 'ASPEN').total).toEqual({ min: 84, max: 140 });
  });
  it('akut awal: ESPEN maks 70% → 14–17,5 kkal/kg = 980–1.225 (batas atas)', () => {
    const r = ok(nutritionTargets({ weightKg: 70, heightCm: 170, sex: 'm', phase: 'akut-awal', condition: 'kritis' }));
    const e = by(r.energy, 'ESPEN');
    expect(e.total).toEqual({ min: 980, max: 1225 });
    expect(e.upperOnly).toBe(true);
  });
  it('recovery: ESPEN 20–25 = 1.400–1.750; ASPEN 2016 25–30 = 1.750–2.100', () => {
    const r = ok(nutritionTargets({ weightKg: 70, heightCm: 170, sex: 'm', phase: 'recovery', condition: 'kritis' }));
    expect(by(r.energy, 'ESPEN').total).toEqual({ min: 1400, max: 1750 });
    expect(by(r.energy, 'ASPEN').total).toEqual({ min: 1750, max: 2100 });
  });
});

describe('AKI — protein TIDAK dibatasi (dulu 0,8–1,0 g/kg)', () => {
  it('AKI tanpa KRT 70 kg: ESPEN 1,0–1,3 = 70–91 g; ASPEN 1,2–2,0 = 84–140 g', () => {
    const r = ok(nutritionTargets({ weightKg: 70, heightCm: 170, sex: 'm', phase: 'akut-lanjut', condition: 'aki' }));
    expect(by(r.protein, 'ESPEN').total).toEqual({ min: 70, max: 91 });
    expect(by(r.protein, 'ASPEN').total).toEqual({ min: 84, max: 140 });
    expect(r.warnings.some((w) => w.includes('EFFORT'))).toBe(true);
  });
  it('CRRT 70 kg: ESPEN 1,5–1,7 = 105–119 g; ASPEN hingga 2,5 = 84–175 g', () => {
    const r = ok(nutritionTargets({ weightKg: 70, heightCm: 170, sex: 'm', phase: 'akut-lanjut', condition: 'crrt' }));
    expect(by(r.protein, 'ESPEN').total).toEqual({ min: 105, max: 119 });
    expect(by(r.protein, 'ASPEN').total).toEqual({ min: 84, max: 175 });
  });
});

describe('Obesitas — ASPEN 2016 & ESPEN berdampingan', () => {
  it('120 kg, TB 170, laki-laki (IMT 41,5): BBI 66,0; ABW ESPEN 83,8', () => {
    expect(espenAdjustedWeight(66.016, 120)).toBeCloseTo(83.83, 2);
    const r = ok(nutritionTargets({ weightKg: 120, heightCm: 170, sex: 'm', phase: 'akut-lanjut', condition: 'kritis' }));
    expect(r.bmi).toBe(41.5);
    expect(r.ibw).toBe(66);
    expect(r.abwEspen).toBe(83.8);
    expect(by(r.energy, 'ESPEN').total).toEqual({ min: 1341, max: 2096 });   // 16–25 × 83,83
    expect(by(r.energy, 'ASPEN').total).toEqual({ min: 1320, max: 1680 });   // 11–14 × 120
    expect(by(r.protein, 'ESPEN').total).toEqual({ min: 109, max: 109 });    // 1,3 × 83,83
    expect(by(r.protein, 'ASPEN').total).toEqual({ min: 165, max: 165 });    // 2,5 × 66,02
  });
  it('IMT >50 (160 kg, TB 170): ASPEN 22–25 kkal/kg BBI = 1.452–1.650', () => {
    const r = ok(nutritionTargets({ weightKg: 160, heightCm: 170, sex: 'm', phase: 'akut-lanjut', condition: 'kritis' }));
    expect(by(r.energy, 'ASPEN').total).toEqual({ min: 1452, max: 1650 });
  });
  it('perempuan 100 kg, TB 160 (IMT 39,1): BBI 52,4 → protein ASPEN 2,0 × 52,4 = 104,8 g', () => {
    const r = ok(nutritionTargets({ weightKg: 100, heightCm: 160, sex: 'f', phase: 'akut-lanjut', condition: 'kritis' }));
    expect(r.ibw).toBe(52.4);
    expect(by(r.protein, 'ASPEN').total.min).toBe(104.8);
  });
  it('obes tanpa JK & tanpa BBI manual → error (tidak memakai rumus laki-laki diam-diam)', () => {
    const o = nutritionTargets({ weightKg: 120, heightCm: 170, sex: '', phase: 'akut-lanjut', condition: 'kritis' });
    expect(o.ok).toBe(false);
    const o2 = nutritionTargets({ weightKg: 120, heightCm: 170, sex: '', ibwOverride: 66, phase: 'akut-lanjut', condition: 'kritis' });
    expect(o2.ok).toBe(true);
  });
});

describe('Refeeding, volume EN, batas PN', () => {
  it('refeeding 70 kg fase akut awal: 10–20 kkal/kg dibatasi target terendah (1.225) → 700–1.225 (dulu NAIK ke 700–1.400)', () => {
    const r = ok(nutritionTargets({ weightKg: 70, heightCm: 170, sex: 'm', phase: 'akut-awal', condition: 'kritis' }));
    expect(refeedingStart(r.energyBasisKg, r.energy)).toEqual({ min: 700, max: 1225 });
  });
  it('volume EN 1.120–1.750 kkal ÷ 1,2 = 933–1.458 mL; dikurangi 200 kkal non-nutrisi = 767–1.292 mL', () => {
    expect(enteralVolume({ min: 1120, max: 1750 }, 1.2)).toEqual({ min: 933, max: 1458 });
    expect(enteralVolume({ min: 1120, max: 1750 }, 1.2, 200)).toEqual({ min: 767, max: 1292 });
  });
  it('batas PN 70 kg: glukosa 5 mg/kg/mnt = 504 g/hari; lemak 1,5 g/kg = 105 g/hari', () => {
    expect(pnLimits(70)).toEqual({ glucoseG: 504, lipidG: 105 });
  });
});
