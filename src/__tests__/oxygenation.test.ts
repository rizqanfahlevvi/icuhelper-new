import { describe, it, expect } from 'vitest';
import {
  classifyRespFailure, ardsOxygenation, severityFromPf, severityFromSf, aaGradient, interpretAa,
  expectedAaRoomAir, roxIndex, interpretRox, ardsnetLowPeep, pfLabel,
} from '../utils/oxygenation';
import { interpretAbg } from '../pages/abg/abgInterpretation';
import { defaultAbgInputs, AbgInputs } from '../pages/abg/types';

const run = (p: Partial<AbgInputs>) => interpretAbg({ ...defaultAbgInputs, ...p })!;
const base = { fio2Estimated: false };

describe('Kategori gagal napas (StatPearls; BTS/ICS 2016)', () => {
  it('Tipe 1: PaO₂ 55 udara ruang, PaCO₂ 33', () => {
    const r = classifyRespFailure({ ...base, ph: 7.46, pco2: 33, hco3: 23, pao2: 55, fio2: 0.21 });
    expect(r.type).toBe('tipe1');
  });
  it('Tipe 1 dengan O₂: PaO₂ 80 pada FiO₂ 0,5 (P/F 160) → tetap tipe 1', () => {
    const r = classifyRespFailure({ ...base, ph: 7.44, pco2: 34, hco3: 23, pao2: 80, fio2: 0.5 });
    expect(r.type).toBe('tipe1');
    expect(r.details.join(' ')).toContain('P/F 160');
  });
  it('Tipe 2 AKUT: PaCO₂ 60, HCO₃ 26, pH 7,26', () => {
    const r = classifyRespFailure({ ...base, ph: 7.26, pco2: 60, hco3: 26, pao2: 70, fio2: 0.21 });
    expect(r.type).toBe('tipe2');
    expect(r.title).toContain('AKUT');
    expect(r.title).not.toContain('KRONIK');
  });
  it('Tipe 2 AKUT-PADA-KRONIK: PaCO₂ 80, HCO₃ 32 (antara harapan akut 28 dan kronik 38), pH 7,22', () => {
    const r = classifyRespFailure({ ...base, ph: 7.22, pco2: 80, hco3: 32, pao2: 55, fio2: 0.28 });
    expect(r.title).toContain('AKUT-PADA-KRONIK');
    expect(r.title).toContain('hipoksemia');
  });
  it('Tipe 2 KRONIK terkompensasi: PaCO₂ 55, HCO₃ 33, pH 7,40', () => {
    const r = classifyRespFailure({ ...base, ph: 7.40, pco2: 55, hco3: 33, pao2: 65, fio2: 0.21 });
    expect(r.type).toBe('tipe2');
    expect(r.title).toContain('KRONIK');
    expect(r.tone).toBe('amber');
  });
  it('Hiperkapnia ringan tanpa asidemia & HCO₃ normal → belum gagal napas tipe 2', () => {
    expect(classifyRespFailure({ ...base, ph: 7.36, pco2: 46, hco3: 25, pao2: 85, fio2: 0.21 }).type).toBe('tidak');
  });
  it('PaO₂ kosong & tidak hiperkapnik → tipe 1 belum dapat dinilai', () => {
    expect(classifyRespFailure({ ...base, ph: 7.40, pco2: 40, hco3: 24, pao2: null, fio2: null }).type).toBe('tidak-dinilai');
  });
  it('Normal → tidak memenuhi', () => {
    expect(classifyRespFailure({ ...base, ph: 7.40, pco2: 40, hco3: 24, pao2: 90, fio2: 0.21 }).type).toBe('tidak');
  });
  it('Catatan tipe III pada pasca-operasi', () => {
    const r = classifyRespFailure({ ...base, ph: 7.45, pco2: 35, hco3: 24, pao2: 58, fio2: 0.21, kondisi: 'postop' });
    expect(r.details.join(' ')).toContain('tipe III');
  });
});

describe('Klasifikasi oksigenasi ARDS (Berlin 2012 · Global 2023)', () => {
  it('pita P/F & S/F', () => {
    expect(severityFromPf(301)).toBeNull();
    expect(severityFromPf(300)).toBe('ringan');
    expect(severityFromPf(200)).toBe('sedang');
    expect(severityFromPf(100)).toBe('berat');
    expect(severityFromSf(316)).toBeNull();
    expect(severityFromSf(315)).toBe('ringan');
    expect(severityFromSf(235)).toBe('sedang');
    expect(severityFromSf(148)).toBe('berat');
    expect(pfLabel(350).text).toContain('300–400');
  });
  it('Invasif PEEP 8, P/F 150 → Berlin SEDANG, Global SEDANG', () => {
    const r = ardsOxygenation({ pf: 150, spo2: 92, fio2: 0.6, support: 'invasif', peep: 8, hfnoFlow: null, fio2Estimated: false });
    expect(r.berlin).toContain('SEDANG');
    expect(r.global).toContain('SEDANG');
  });
  it('NIV PEEP 5, P/F 150 → Berlin: kategori sedang butuh ventilasi invasif', () => {
    const r = ardsOxygenation({ pf: 150, spo2: 92, fio2: 0.6, support: 'niv', peep: 5, hfnoFlow: null, fio2Estimated: false });
    expect(r.berlin).toContain('mensyaratkan ventilasi invasif');
    expect(r.global).toContain('non-intubasi');
  });
  it('HFNC: flow ≥30 memenuhi ambang Global non-intubasi; flow 20 tidak', () => {
    expect(ardsOxygenation({ pf: 250, spo2: 93, fio2: 0.5, support: 'hfno', peep: null, hfnoFlow: 40, fio2Estimated: false }).global).toContain('memenuhi ambang');
    expect(ardsOxygenation({ pf: 250, spo2: 93, fio2: 0.5, support: 'hfno', peep: null, hfnoFlow: 20, fio2Estimated: false }).global).toContain('≥30 L/menit');
  });
  it('Udara/O₂ low-flow → Berlin tidak memenuhi; Global hanya fasilitas terbatas', () => {
    const r = ardsOxygenation({ pf: 250, spo2: 93, fio2: 0.35, support: 'udara', peep: null, hfnoFlow: null, fio2Estimated: false });
    expect(r.berlin).toContain('tidak memenuhi');
    expect(r.global).toContain('FASILITAS TERBATAS');
  });
  it('S/F terintubasi tanpa PaO₂: SpO₂ 92 / FiO₂ 0,46 = 200 → Global SEDANG', () => {
    const r = ardsOxygenation({ pf: null, spo2: 92, fio2: 0.46, support: 'invasif', peep: 10, hfnoFlow: null, fio2Estimated: false });
    expect(r.sf).toBeCloseTo(200, 0);
    expect(r.global).toContain('SEDANG');
    expect(r.berlin).toContain('butuh PaO₂');
  });
  it('SpO₂ >97% → S/F tidak valid', () => {
    const r = ardsOxygenation({ pf: null, spo2: 98, fio2: 0.4, support: 'invasif', peep: 8, hfnoFlow: null, fio2Estimated: false });
    expect(r.sfValid).toBe(false);
    expect(r.meetsOxygenation).toBe(false);
  });
  it('FiO₂ estimasi → Berlin tidak dapat diklasifikasi', () => {
    const r = ardsOxygenation({ pf: 162, spo2: 91, fio2: 0.37, support: 'udara', peep: null, hfnoFlow: null, fio2Estimated: true });
    expect(r.berlin).toContain('FiO₂ estimasi');
  });
});

describe('A-a gradient, ROX, PEEP ARDSNet', () => {
  it('A-a udara ruang: PaCO₂ 40, PaO₂ 90 → 713×0,21 − 50 − 90 = 9,7', () => {
    expect(aaGradient(0.21, 40, 90)).toBeCloseTo(9.73, 2);
    expect(expectedAaRoomAir(60)).toBe(19);
    expect(interpretAa(25, 0.21, 60).tone).toBe('red');
    expect(interpretAa(15, 0.21, 60).tone).toBe('emerald');
    expect(interpretAa(15, 0.5, 60).text).toContain('terbatas');
    expect(interpretAa(-20, 0.21, 60).text).toContain('Negatif');
    expect(interpretAa(40, 0.21, null).text).toContain('usia berapa pun');
  });
  it('ROX bergantung waktu (Roca 2019)', () => {
    expect(roxIndex(92, 0.5, 30)).toBeCloseTo(6.13, 2);
    expect(interpretRox(5, '').tone).toBe('emerald');
    expect(interpretRox(3.0, '6').tone).toBe('red');     // <3,47
    expect(interpretRox(3.6, '6').tone).toBe('amber');
    expect(interpretRox(3.6, '12').tone).toBe('red');    // <3,85
    expect(interpretRox(2.9, '2').tone).toBe('amber');   // ≥2,85
    expect(interpretRox(3.0, '').tone).toBe('slate');
  });
  it('Tabel PEEP rendah ARDSNet', () => {
    expect(ardsnetLowPeep(0.25)).toBe('5');
    expect(ardsnetLowPeep(0.5)).toBe('8–10');
    expect(ardsnetLowPeep(0.55)).toBe('10');
    expect(ardsnetLowPeep(1.0)).toBe('18–24');
  });
});

describe('Integrasi ABG — Langkah 6', () => {
  it('ROX tidak dihitung bila bukan HFNC; dihitung bila HFNC', () => {
    const p = { ph: '7.45', pco2: '34', hco3: '23', po2: '60', fio2Direct: '0.5', spo2: '91', rr: '28' };
    const a = run(p).step6Oksigenasi!;
    expect(a.items.find(i => i.label === 'ROX Index')).toBeUndefined();
    expect(a.notes.join(' ')).toContain('ROX tidak dihitung');
    const b = run({ ...p, support: 'hfno', hfnoFlow: '50', roxHour: '6' }).step6Oksigenasi!;
    expect(b.items.find(i => i.label === 'ROX Index')).toBeDefined();
  });
  it('Label P/F tidak lagi "ARDS Mild/Moderate/Severe"; OI tanpa ambang ECMO', () => {
    const r = run({ ph: '7.30', pco2: '50', hco3: '24', po2: '60', fio2Direct: '0.8', support: 'invasif', peep: '12', mapV: '20' });
    const blob = JSON.stringify(r.step6Oksigenasi);
    expect(blob).not.toMatch(/ARDS (Mild|Moderate|Severe)/);
    expect(blob).not.toContain('ECMO');
    expect(blob).toContain('OI (Paw)');
    expect(r.respFailure!.type).toBe('tipe2');
  });
  it('Saran PEEP memakai tabel ARDSNet (bukan heuristik 13–18)', () => {
    const r = run({ ph: '7.30', pco2: '50', hco3: '24', po2: '60', fio2Direct: '0.8', support: 'invasif', peep: '12' });
    const s = r.saran.join(' ');
    expect(s).toContain('tabel PEEP rendah ARDSNet untuk FiO₂ 0.80 → PEEP 14');
    expect(s).not.toContain('PEEP 13–18');
  });
  it('Kategori gagal napas ditampilkan walau PaO₂ kosong (tipe 2 dari PaCO₂/pH)', () => {
    const r = run({ ph: '7.26', pco2: '60', hco3: '26' });
    expect(r.respFailure!.type).toBe('tipe2');
  });
});
