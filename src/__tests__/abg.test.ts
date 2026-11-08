import { describe, it, expect } from 'vitest';
import {
  analyzeAcidBase, hhCheck, hco3FromHH, validateCore, resolveDirectFio2, estimateLowFlowFio2,
  fio2ToPercentString, fio2FromStoreString,
} from '../utils/abg';
import { anionGap, deltaRatio, normalizeAgUpper, hclPlan } from '../utils/acidBase';
import { interpretAbg } from '../pages/abg/abgInterpretation';
import { defaultAbgInputs, AbgInputs } from '../pages/abg/types';

const run = (p: Partial<AbgInputs>, agUpper?: number) => interpretAbg({ ...defaultAbgInputs, ...p }, { agUpper })!;
const titles = (p: Partial<AbgInputs>) => run(p).mgmt.map(m => m.judul);

// Skenario dibuat konsisten Henderson–Hasselbalch (pH dihitung dari PaCO₂ & HCO₃).
describe('ABG — pemilihan gangguan primer & rumus kompensasi (bug audit #1)', () => {
  it('DKA terkompensasi: pH 7.26 / PaCO₂ 23 / HCO₃ 10 → Winter 23 ± 2 adekuat (bukan "alkalosis resp")', () => {
    const a = analyzeAcidBase(7.26, 23, 10, -16);
    expect(a.primaries).toEqual(['asidosis-metabolik']);
    expect(a.evals[0].fit).toBe('adekuat');
    expect(a.evals[0].expected[0].value).toBeCloseTo(23, 5); // 1,5×10 + 8
    expect(a.disorders).toEqual(['asidosis-metabolik']);
  });
  it('NAGMA diare: pH 7.31 / PaCO₂ 30 / HCO₃ 15 → Winter 30,5 adekuat', () => {
    const a = analyzeAcidBase(7.31, 30, 15, -10);
    expect(a.primaries).toEqual(['asidosis-metabolik']);
    expect(a.evals[0].fit).toBe('adekuat');
  });
  it('Alkalosis metabolik terkompensasi: HCO₃ 36 / PaCO₂ 46 → harapan 0,7×36+21 = 46,2 adekuat', () => {
    const a = analyzeAcidBase(7.51, 46, 36, 12);
    expect(a.primaries).toEqual(['alkalosis-metabolik']);
    expect(a.evals[0].expected[0].value).toBeCloseTo(46.2, 5);
    expect(a.evals[0].fit).toBe('adekuat');
    expect(a.disorders).not.toContain('asidosis-respiratorik');
  });
  it('Asidosis respiratorik akut: PaCO₂ 60 / HCO₃ 26 → akut', () => {
    const a = analyzeAcidBase(7.26, 60, 26, 0);
    expect(a.primaries).toEqual(['asidosis-respiratorik']);
    expect(a.evals[0].fit).toBe('akut');
  });
  it('PPOK kronik: PaCO₂ 60 / HCO₃ 31 → kronik, TIDAK ada alkalosis metabolik', () => {
    const a = analyzeAcidBase(7.34, 60, 31, 5);
    expect(a.evals[0].fit).toBe('kronik');
    expect(a.disorders).toEqual(['asidosis-respiratorik']);
  });
  it('Alkalosis respiratorik akut: PaCO₂ 25 / HCO₃ 21 → akut, TIDAK ada asidosis metabolik', () => {
    const a = analyzeAcidBase(7.55, 25, 21, -2);
    expect(a.evals[0].fit).toBe('akut');
    expect(a.disorders).toEqual(['alkalosis-respiratorik']);
  });
  it('Alkalosis respiratorik kronik pH normal 7.44: primer alkalosis resp (pH > 7,40), kronik', () => {
    const a = analyzeAcidBase(7.44, 25, 16.5, -6);
    expect(a.primaries).toEqual(['alkalosis-respiratorik']);
    expect(a.evals[0].fit).toBe('kronik');
    expect(a.notes.length).toBeGreaterThan(0); // catatan "pH kembali normal jarang"
  });
  it('Asidosis resp + asidosis metabolik bersamaan: PaCO₂ 60 / HCO₃ 23 (< harapan akut 26 − 2)', () => {
    const a = analyzeAcidBase(7.20, 60, 23, -4);
    expect(a.primaries).toEqual(['asidosis-respiratorik']);
    expect(a.concurrent).toEqual(['asidosis-metabolik']);
  });
  it('Asidosis metabolik + asidosis resp bersamaan: HCO₃ 14 / PaCO₂ 40 (Winter 29 ± 2)', () => {
    const a = analyzeAcidBase(7.16, 40, 14, -12);
    expect(a.concurrent).toEqual(['asidosis-respiratorik']);
  });
  it('Asidosis campuran searah: pH 7.00 / PaCO₂ 60 / HCO₃ 14', () => {
    const a = analyzeAcidBase(6.98, 60, 14, -16);
    expect(a.primaries).toEqual(['asidosis-respiratorik', 'asidosis-metabolik']);
    expect(a.compStatus.tone).toBe('red');
  });
  it('pH tepat 7,40 → primer dipilih dari kecocokan rumus (PaCO₂ 50 / HCO₃ 30 → asidosis resp kronik)', () => {
    const a = analyzeAcidBase(7.40, 50, 30, 6);
    expect(a.primaries).toEqual(['asidosis-respiratorik']);
    expect(a.evals[0].fit).toBe('kronik');
  });
  it('pH tepat 7,40 dan tidak ada rumus yang cocok → kemungkinan campuran (kedua gangguan ditandai)', () => {
    const a = analyzeAcidBase(7.40, 50, 30.6, 6); // kronik 27,5 ± 3 → batas 30,5; alk met harapan 42,4 ± 2
    expect(a.primaries).toEqual(['asidosis-respiratorik', 'alkalosis-metabolik']);
    expect(a.compNote.text).toContain('sama-sama tidak cocok');
  });
  it('ABG normal → tidak ada gangguan; BE kosong tidak dianggap 0', () => {
    const a = analyzeAcidBase(7.40, 40, 24, null);
    expect(a.disorders).toEqual([]);
    const r = run({ ph: '7.40', pco2: '40', hco3: '24' });
    expect(r.step1!.detail).toContain('BE = — (tidak diisi)');
  });
  it('HCO₃ normal tetapi BE −3 → catatan BE (tanpa memaksa diagnosis)', () => {
    const a = analyzeAcidBase(7.36, 44, 24, -3);
    expect(a.disorders).toEqual([]);
    expect(a.notes.join(' ')).toContain('BE -3');
  });
  it('kPa dikonversi ke mmHg', () => {
    const r = run({ ph: '7.26', pco2: '3.07', paco2Unit: 'kPa', hco3: '10' });
    expect(r.analysis!.primaries).toEqual(['asidosis-metabolik']);
    expect(r.analysis!.evals[0].fit).toBe('adekuat');
  });
});

describe('ABG — kartu tatalaksana mengikuti gangguan teridentifikasi (bug audit #2)', () => {
  it('PPOK kronik: TIDAK muncul "Koreksi Alkalosis Metabolik"', () => {
    const t = titles({ ph: '7.34', pco2: '60', hco3: '31', be: '5' });
    expect(t).not.toContain('Koreksi Alkalosis Metabolik');
  });
  it('Alkalosis resp akut & kronik: TIDAK muncul "Koreksi Asidosis Metabolik" (rumus NaHCO₃)', () => {
    expect(titles({ ph: '7.55', pco2: '25', hco3: '21', be: '-2' })).not.toContain('Koreksi Asidosis Metabolik');
    expect(titles({ ph: '7.44', pco2: '25', hco3: '16.5', be: '-6' })).not.toContain('Koreksi Asidosis Metabolik');
  });
  it('DKA: kartu Koreksi Asidosis Metabolik tetap muncul', () => {
    expect(titles({ ph: '7.26', pco2: '23', hco3: '10', be: '-16', na: '135', cl: '100' })).toContain('Koreksi Asidosis Metabolik');
  });
  it('Gangguan resp "relatif" (PaCO₂ 30 > Winter 27,5) tidak memicu kartu Koreksi Asidosis Respiratorik', () => {
    const r = run({ ph: '7.25', pco2: '30', hco3: '13', be: '-13' });
    expect(r.analysis!.concurrent).toEqual(['asidosis-respiratorik']);
    expect(r.mgmt.map(m => m.judul)).not.toContain('Koreksi Asidosis Respiratorik');
  });
  it('Alkalosis metabolik bersamaan pada asidosis resp (HCO₃ > harapan kronik + 3) → kartu alkalosis metabolik muncul', () => {
    // PaCO₂ 60 → harapan kronik 31 ± 3; HCO₃ 38 → alkalosis metabolik bersamaan
    expect(titles({ ph: '7.42', pco2: '60', hco3: '38' })).toContain('Koreksi Alkalosis Metabolik');
  });
});

describe('Anion gap & delta ratio — satu sumber (albumin 4,0; batas atas default 12; Wrenn)', () => {
  it('AG dasar & koreksi albumin 4,0', () => {
    const r = anionGap(140, 104, 24, 2)!;
    expect(r.ag).toBe(12);
    expect(r.agCorr).toBeCloseTo(17, 5); // 12 + 2,5 × (4,0 − 2)
    expect(r.high).toBe(true);
  });
  it('batas atas bisa diatur', () => {
    expect(anionGap(140, 105, 20, null, 12)!.high).toBe(true);   // AG 15
    expect(anionGap(140, 105, 20, null, 16)!.high).toBe(false);
    expect(normalizeAgUpper(NaN)).toBe(12);
    expect(normalizeAgUpper(0)).toBe(12);
  });
  it('albumin g/L (35) → koreksi tidak dihitung, AG mentah 18 tetap terdeteksi tinggi (bug audit #4)', () => {
    const r = anionGap(140, 106, 16, 35)!;
    expect(r.albuminSuspectUnit).toBe(true);
    expect(r.agCorr).toBeNull();
    expect(r.high).toBe(true);
  });
  it('delta ratio memakai AG terkoreksi: hipoalbumin AG 12 → corr 17, HCO₃ 18 → 0,83 (HAGMA murni)', () => {
    const r = anionGap(135, 105, 18, 2)!;
    const d = deltaRatio(r.effective, 18, r.upper);
    expect(d.ratio).toBeCloseTo(5 / 6, 5);
    expect(d.band).toBe('murni');
  });
  it('pita Wrenn di batasnya', () => {
    expect(deltaRatio(12 + 0.39 * 10, 14).band).toBe('nagma');
    expect(deltaRatio(12 + 0.4 * 10, 14).band).toBe('campuran');
    expect(deltaRatio(12 + 0.8 * 10, 14).band).toBe('murni');
    expect(deltaRatio(12 + 2.0 * 10, 14).band).toBe('murni');
    expect(deltaRatio(12 + 2.1 * 10, 14).band).toBe('alkalosis');
  });
  it('HCO₃ ≥ 24 → rasio tidak terdefinisi (bukan Infinity/negatif), pola alkalosis bila AG naik (bug audit #3)', () => {
    expect(deltaRatio(16, 24)).toMatchObject({ ratio: null, band: 'alkalosis' });
    expect(deltaRatio(16, 25)).toMatchObject({ ratio: null, band: 'alkalosis' });
    expect(deltaRatio(10, 25)).toMatchObject({ ratio: null, band: null });
  });
  it('ABG Interpreter: teks delta ratio tidak lagi "Infinity" atau negatif', () => {
    const r = run({ ph: '7.36', pco2: '44', hco3: '24', be: '-3', na: '140', cl: '100' });
    expect(r.step4Ag!.ddNote).toContain('tidak terdefinisi');
    expect(r.step4Ag!.ddNote).not.toMatch(/Infinity|-\d/);
  });
});

describe('Guard input & konsistensi', () => {
  it('pH di luar 6,5–8,0 → error input, tidak diinterpretasi', () => {
    expect(validateCore(74, 40, 24)).not.toBeNull();
    const r = run({ ph: '74', pco2: '40', hco3: '24' });
    expect(r.inputError).not.toBeNull();
    expect(r.step2Primer).toBeNull();
  });
  it('Henderson–Hasselbalch: input konsisten lolos, salah ketik terdeteksi', () => {
    expect(hco3FromHH(7.40, 40)).toBeCloseTo(24.5, 1);
    expect(hhCheck(7.26, 23, 10).consistent).toBe(true);
    expect(hhCheck(7.40, 40, 15).consistent).toBe(false);
    expect(run({ ph: '7.40', pco2: '40', hco3: '15' }).warnings.join(' ')).toContain('Henderson');
  });
  it('FiO₂: fraksi, persen eksplisit, nilai tidak valid', () => {
    expect(resolveDirectFio2('0.4').value).toBe(0.4);
    const pct = resolveDirectFio2('40');
    expect(pct.value).toBeCloseTo(0.4, 10);
    expect(pct.note).toContain('40%');
    expect(resolveDirectFio2('10').value).toBeNull();
    expect(resolveDirectFio2('0.15').value).toBeNull();
    expect(estimateLowFlowFio2('nasal', 4)).toBeCloseTo(0.37, 10);
  });
  it('FiO₂ 40 tidak lagi menghasilkan P/F 2 (bug audit #5)', () => {
    const r = run({ ph: '7.40', pco2: '40', hco3: '24', po2: '80', fio2Direct: '40' });
    const pf = r.step6Oksigenasi!.items.find(i => i.label === 'P/F Ratio')!;
    expect(pf.value).toBe('200');
  });
  it('konversi FiO₂ untuk clinical store (persen) dua arah', () => {
    expect(fio2ToPercentString('0.4')).toBe('40');
    expect(fio2ToPercentString('40')).toBe('40');
    expect(fio2FromStoreString('40')).toBe('0.4');
    expect(fio2FromStoreString('0.4')).toBe('0.4'); // data lama (fraksi) dibiarkan
  });
});

describe('Kelas warna hanya memakai token yang ada (bug audit #10)', () => {
  it('tidak ada bg-/text-/border-warning atau -success', () => {
    const samples = [
      run({ ph: '7.50', pco2: '46', hco3: '36', laktat: '3', po2: '70', fio2Direct: '0.3', spo2: '94', rr: '22' }),
      run({ ph: '7.40', pco2: '40', hco3: '24', laktat: '1' }),
      run({ ph: '7.26', pco2: '23', hco3: '10', na: '135', cl: '100', laktat: '5' }),
    ];
    const blob = JSON.stringify(samples);
    expect(blob).not.toMatch(/\b(bg|text|border)-(warning|success)\b/);
  });
});

describe('Fase 2 — isi tatalaksana sesuai referensi', () => {
  const blob = (p: Partial<AbgInputs>) => JSON.stringify(run(p).mgmt) + JSON.stringify(run(p).saran);
  const ardsSevere = { kondisi: 'ards', ph: '7.25', pco2: '55', hco3: '23.5', po2: '60', fio2Direct: '0.8' };

  it('HCl: defisit H⁺ = 0,5 × BB × (HCO₃ aktual − target); laju ≤0,2 mEq/kg/jam', () => {
    // 0,5 × 60 × (45 − 35) = 300 mEq → 3000 mL HCl 0,1 N; laju maks 12 mEq/jam (120 mL/jam) → ≥25 jam
    const h = hclPlan(60, 45, 35)!;
    expect(h.doseMeq).toBeCloseTo(300, 10);
    expect(h.volume01NmL).toBeCloseTo(3000, 10);
    expect(h.maxRateMeqH).toBeCloseTo(12, 10);
    expect(h.maxRateMlH).toBeCloseTo(120, 10);
    expect(h.minHours).toBeCloseTo(25, 10);
    expect(hclPlan(60, 45, 45)).toBeNull();
    expect(hclPlan(60, 45, NaN)).toBeNull();
    expect(hclPlan(0, 45, 35)).toBeNull();
  });
  it('Kartu alkalosis metabolik berat memakai rumus 0,5 × BB (bukan 0,1) dan Cl⁻ URIN', () => {
    const b = blob({ ph: '7.58', pco2: '50', hco3: '45' });
    expect(b).toContain('0,5 × BB × (HCO₃ aktual − HCO₃ target)');
    expect(b).not.toContain('0.1 × BB');
    expect(b).toContain('Cl⁻ URIN');
  });
  it('ARDS berat: cisatrakurium 15 mg bolus (ACURASYS), deksametason DEXA-ARDS 20→10 mg, NNT prone ≈6', () => {
    const b = blob(ardsSevere);
    expect(b).toContain('15 mg bolus');
    expect(b).not.toContain('37.5 mg bolus');
    expect(b).toContain('20 mg/hari IV hari 1–5 lalu 10 mg/hari');
    expect(b).toContain('NNT ≈6');
    expect(b).not.toContain('NNT=8');
    expect(b).not.toContain('P/F <200–300 per PROSEVA');
  });
  it('ECMO memakai kriteria EOLIA (termasuk hiperkapnia), bukan OI >40', () => {
    const b = blob({ ...ardsSevere, ph: '7.20', pco2: '65', hco3: '24.8', po2: '90', fio2Direct: '0.6' });
    expect(b).toContain('pH <7,25 dengan PaCO₂ ≥60');
    expect(blob(ardsSevere)).not.toMatch(/OI >40/);
  });
  it('NaHCO₃ mengikuti BICAR-ICU & BICARICU-2 (tidak lagi "TERINDIKASI pH <7.10")', () => {
    const b = blob({ ph: '7.05', pco2: '25', hco3: '6.8', na: '140', cl: '100' });
    expect(b).not.toContain('TERINDIKASI (pH <7.10)');
    expect(b).toContain('BICARICU-2');
    expect(b).toContain('62,1% vs 61,7%');
  });
  it('DKA: dekstrosa saat GDS <250, K⁺ <3,5 tunda insulin, sitasi konsensus 2024', () => {
    const b = blob({ ph: '7.26', pco2: '23', hco3: '10', na: '135', cl: '100' });
    expect(b).toContain('GDS <250 mg/dL');
    expect(b).toContain('K⁺ <3,5 mmol/L: TUNDA insulin');
    expect(b).toContain('Diabetes Care 2024;47:1257');
    expect(b).not.toContain('20–40 mEq/jam');
  });
  it('Edema paru kardiogenik + laktat tinggi: kartu Sepsis (30 mL/kg) & ARDS tidak muncul otomatis', () => {
    const t = run({ kondisi: 'cardiac', ph: '7.25', pco2: '30', hco3: '13', na: '138', cl: '100', laktat: '4.5', po2: '60', fio2Direct: '0.6' }).mgmt.map(m => m.judul);
    expect(t).toContain('Edema Paru Kardiogenik Akut');
    expect(t).not.toContain('Manajemen Sepsis / Syok Septik (SSC 2021)');
    expect(t).not.toContain('Manajemen ARDS');
  });
  it('Sepsis: target awal MAP 65 (SEPSISPAM), tanpa target ScvO₂', () => {
    const b = blob({ kondisi: 'sepsis', ph: '7.30', pco2: '30', hco3: '14.5', laktat: '4' });
    expect(b).toContain('target awal MAP 65');
    expect(b).not.toContain('≥80 jika riwayat hipertensi');
    expect(b).not.toContain('ScvO₂ ≥70%');
  });
  it('Hiperkapnia permisif mengikuti algoritma ARDSNet (bukan "PaCO₂ hingga 70")', () => {
    const b = blob(ardsSevere);
    expect(b).toContain('target pH 7,30–7,45');
    expect(b).not.toContain('hingga 70 mmHg');
    expect(b).not.toContain('45–65');
  });
  it('Sitasi yang tidak ditemukan/salah sudah diganti', () => {
    const all = [
      blob(ardsSevere),
      blob({ kondisi: 'sepsis', ph: '7.30', pco2: '30', hco3: '14.5', na: '140', cl: '100', laktat: '4' }),
      blob({ kondisi: 'cardiac', ph: '7.55', pco2: '28', hco3: '24' }),
      blob({ ph: '7.58', pco2: '50', hco3: '45' }),
      blob({ ph: '7.26', pco2: '23', hco3: '10', na: '135', cl: '100', laktat: '3' }),
    ].join(' ');
    for (const bad of ['Feldman', 'Levy B. Chest', 'Endocr Rev', 'Seifter JL. NEJM 2023', 'Matthay MA. NEJM 2019', 'Mebazaa A. Intensive Care Med 2018', 'Gennari FJ. NEJM 1998', 'Laski ME. Am J Kidney Dis']) {
      expect(all).not.toContain(bad);
    }
  });
});
