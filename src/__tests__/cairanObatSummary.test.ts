import { describe, it, expect } from 'vitest';
import {
  transfusiSummary, basalSummary, totalCairanSummary, kumulatifSummary, overloadSummary, balance24Summary,
  gfrSummary, fenaSummary, akiSummary, osmolSummary,
} from '../utils/cairanObatSummary';

describe('ringkasan bilah — renal', () => {
  it('eGFR dewasa: satuan sama dengan rincian, nada per kategori G', () => {
    // CKD-EPI 2021, L 58 th, SCr 1,9 → 40,4 (G3b)
    const r = gfrSummary({ isPediatric: false, ckdEpi: '40.4', cgRecommended: '40.4', stage: 'G3b', stageDesc: 'Penurunan LFG Sedang-Berat' });
    expect(r.text).toBe('eGFR 40.4 mL/min/1.73m²');
    expect(r.tone).toBe('warn');
    expect(gfrSummary({ isPediatric: false, ckdEpi: '95', cgRecommended: '100', stage: 'G1' }).tone).toBe('good');
    expect(gfrSummary({ isPediatric: false, ckdEpi: '10', cgRecommended: '9', stage: 'G5' }).tone).toBe('bad');
  });
  it('Schwartz anak', () => {
    expect(gfrSummary({ isPediatric: true, schwartz: '21.7', stage: 'G4', stageDesc: 'x' }).text).toBe('GFR Schwartz 21.7 mL/min/1.73m²');
  });
  it('FENa: (UNa × SCr)/(SNa × UCr) = (10 × 1,9)/(138 × 100) = 0,14% → pre-renal', () => {
    expect(fenaSummary('0.14', null)).toMatchObject({ text: 'FENa 0.14%', caption: 'Pre-renal (< 1%)', tone: 'good' });
    expect(fenaSummary('1.5', null).tone).toBe('warn');
    expect(fenaSummary('3.2', '55.00').caption).toBe('FENa: Renal Intrinsik (> 2%) · FEUrea: Renal Intrinsik (> 50%)');
  });
  it('AKI: tahap null = data belum cukup', () => {
    expect(akiSummary(null, 'Belum dapat dinilai').caption).toBe('Data belum cukup — lihat catatan di rincian');
    expect(akiSummary(2, 'AKI Stage 2').tone).toBe('bad');
    expect(akiSummary(0, 'Tidak memenuhi kriteria AKI').tone).toBe('good');
  });
  it('osmolalitas: gap >10 → nada bahaya; rasio BUN:Cr berlabel sama dengan rincian', () => {
    expect(osmolSummary(null, null, null)).toBeNull();
    expect(osmolSummary(290.1, 15, null)).toMatchObject({ text: 'Osm hitung 290.1 mOsm/kg · gap 15.0', tone: 'bad' });
    expect(osmolSummary(null, null, 25).caption).toBe('Pre-Renal (Dehidrasi, Hipoperfusi)');
  });
});

describe('ringkasan bilah — transfusi', () => {
  it('PRC: kolf + volume + ΔHb', () => {
    const r = transfusiSummary({ type: 'prc', kolf: 3, vol: 518.4, dhb: 1.8 });
    expect(r.text).toBe('3 kolf PRC (±518 mL)');
    expect(r.caption).toBe('Target kenaikan Hb +1.8 g/dL');
  });
  it('TC RD vs SDA memakai satuan yang sama dengan rincian', () => {
    expect(transfusiSummary({ type: 'tc', subtype: 'rd', units: 8, vol: 480, minExpectedPltRise: 38.9, maxExpectedPltRise: 77.8 }).text)
      .toBe('8 unit TC RD (±480 mL)');
    expect(transfusiSummary({ type: 'tc', subtype: 'sda', units: 1, vol: 250, minExpectedPltRise: 30, maxExpectedPltRise: 60 }).text)
      .toBe('1 kantong TC SDA (±250 mL)');
  });
  it('FFP menyebut dosis mL/kgBB', () => {
    expect(transfusiSummary({ type: 'ffp', kolf: 5, vol: 1080, dose: 15 }).caption).toBe('Dosis 15 mL/kgBB');
  });
});

describe('ringkasan bilah — cairan (label per-hari vs per-jam eksplisit)', () => {
  it('basal: mL/hari dan mL/jam keduanya berlabel', () => {
    // 72 kg × 25 mL/kg/hari = 1800 mL/hari = 75 mL/jam
    const r = basalSummary(1800, 75, '25');
    expect(r.text).toBe('1800 mL/hari (75.0 mL/jam)');
  });
  it('total kebutuhan', () => {
    expect(totalCairanSummary(2160, 90, null).text).toBe('Total 2160 mL/hari (90.0 mL/jam)');
  });
  it('balans kumulatif: tanda & nada mengikuti pita halaman', () => {
    expect(kumulatifSummary(-500, 2, 'x').tone).toBe('info');
    expect(kumulatifSummary(1500, 1, 'x')).toMatchObject({ text: 'Balans kumulatif +1500 mL · 1 hari', tone: 'good' });
    expect(kumulatifSummary(3500, 2, 'x').tone).toBe('warn');
    expect(kumulatifSummary(12000, 7, 'x').tone).toBe('bad');
  });
  it('fluid overload: 80 → 88 kg = +10,0%', () => {
    expect(overloadSummary(10, 8, 'x')).toMatchObject({ text: 'FO +10.0% (+8.0 kg)', tone: 'bad' });
    expect(overloadSummary(-2.5, -2, 'x').text).toBe('FO −2.5% (−2.0 kg)');
  });
  it('balance 24 jam: pita >2 L / 1–2 L / netral / negatif', () => {
    expect(balance24Summary(2500, 2500, 0, 'x').tone).toBe('bad');
    expect(balance24Summary(1500, 2500, 1000, 'x')).toMatchObject({ text: 'Balance 24 jam +1500 mL', tone: 'warn' });
    expect(balance24Summary(0, 1000, 1000, 'x').tone).toBe('good');
    expect(balance24Summary(-1000, 1000, 2000, 'x').tone).toBe('info');
    expect(balance24Summary(-2000, 0, 2000, 'x').tone).toBe('bad');
  });
});
