import { describe, it, expect } from 'vitest';
import { fluidRequirement, feverExtraMl, fluidOverloadFromBalance, fluidOverloadFromWeight } from '../utils/fluids';

describe('Kebutuhan cairan — maintenance + kehilangan abnormal (NICE CG174 / Malbrain 2018)', () => {
  it('70 kg, 25 mL/kg, normotermi, tanpa kehilangan → 1.750 mL/hari (dulu 3.430 karena IWL + UO dihitung ganda)', () => {
    const r = fluidRequirement({ weightKg: 70, maintPerKg: 25, vent: 'spontan', sweat: 'none', uoTargetMlKgH: 0.5 })!;
    expect(r.maint).toBe(1750);
    expect(r.total).toBe(1750);
    expect(r.rateMlH).toBeCloseTo(72.92, 2);
    expect(r.perKgDay).toBe(25);
    // Informasi saja — tidak ikut dijumlahkan
    expect(r.iwlBaseInfo).toBe(840);
    expect(r.uoTargetMlH).toBe(35);
    expect(r.uoTargetMlDay).toBe(840);
  });

  it('demam 38,5 °C + diaforesis ringan + NGT 300 → 1.750 + 175 + 200 + 300 = 2.425 mL/hari', () => {
    const r = fluidRequirement({
      weightKg: 70, maintPerKg: 25, tempC: 38.5, vent: 'spontan', sweat: 'mild', ngtMl: 300,
    })!;
    expect(r.feverExtra).toBeCloseTo(175, 6);
    expect(r.sweatExtra).toBe(200);
    expect(r.measuredLosses).toBe(300);
    expect(r.total).toBeCloseTo(2425, 6);
    expect(r.rateMlH).toBeCloseTo(101.04, 2);
  });

  it('koreksi demam hanya di atas 37,5 °C (estimasi praktis 10%/°C)', () => {
    expect(feverExtraMl(1750, undefined)).toBe(0);
    expect(feverExtraMl(1750, 37.0)).toBe(0);
    expect(feverExtraMl(1750, 37.5)).toBe(0);
    expect(feverExtraMl(1750, 39.5)).toBeCloseTo(350, 6);
  });

  it('status ventilasi hanya mengubah info IWL, bukan total', () => {
    const a = fluidRequirement({ weightKg: 70, maintPerKg: 25, vent: 'spontan', sweat: 'none' })!;
    const b = fluidRequirement({ weightKg: 70, maintPerKg: 25, vent: 'ventilator', sweat: 'none' })!;
    expect(b.iwlBaseInfo).toBe(455);
    expect(b.total).toBe(a.total);
  });

  it('input tidak valid → null; kehilangan negatif diabaikan; UO kosong → null', () => {
    expect(fluidRequirement({ weightKg: 0, maintPerKg: 25, vent: 'spontan', sweat: 'none' })).toBeNull();
    expect(fluidRequirement({ weightKg: 70, maintPerKg: 0, vent: 'spontan', sweat: 'none' })).toBeNull();
    const r = fluidRequirement({ weightKg: 70, maintPerKg: 25, vent: 'spontan', sweat: 'none', drainMl: -100 })!;
    expect(r.total).toBe(1750);
    expect(r.uoTargetMlH).toBeNull();
  });
});

describe('Fluid overload %', () => {
  it('balans kumulatif +7 L pada BB basal 70 kg → 10%', () => {
    expect(fluidOverloadFromBalance(7000, 70)).toBeCloseTo(10, 6);
    expect(fluidOverloadFromBalance(-1400, 70)).toBeCloseTo(-2, 6);
    expect(fluidOverloadFromBalance(7000, 0)).toBeNull();
  });
  it('metode berat badan: 77 vs 70 kg → 10%', () => {
    expect(fluidOverloadFromWeight(77, 70)).toBeCloseTo(10, 6);
    expect(fluidOverloadFromWeight(77, 0)).toBeNull();
  });
});
