import { useMemo } from 'react';
import { AbgInputs, getFio2Value } from './types';

export interface AbgResultData {
  step1: { status: string; color: string; detail: string; cls: string; } | null;
  step2Primer: { interp: string; color: string; detail: string; cls: string; } | null;
  step2KompStatus: { interp: string; color: string; cls: string; } | null;
  step3Kompensasi: { detail: string; color: string; cls: string; } | null;
  step4Ag: { high: boolean; interp: string; detail: string; ddNote?: string; color: string; cls: string; corr: boolean; } | null;
  step5Laktat: { interp: string; detail: string; color: string; cls: string; } | null;
  step6Oksigenasi: { html: string; color: string; cls: string; } | null;
  saran: string[];
  mgmt: { judul: string; color: string; isi: string[]; ref: string; }[];
}

export function useAbgCalculator(inputs: AbgInputs): AbgResultData | null {
  return useMemo(() => {
    let rawPh = parseFloat(inputs.ph);
    let rawPco2 = parseFloat(inputs.pco2);
    let hco3 = parseFloat(inputs.hco3);

    if (isNaN(rawPh) || isNaN(rawPco2) || isNaN(hco3)) {
      return null;
    }

    const pH = rawPh;
    const paco2Unit = inputs.paco2Unit;
    const pco2 = paco2Unit === 'kPa' ? rawPco2 * 7.5006 : rawPco2;

    const po2 = parseFloat(inputs.po2);
    const be = parseFloat(inputs.be) || 0;
    const spo2 = parseFloat(inputs.spo2);
    const fio2 = getFio2Value(inputs);
    const mapV = parseFloat(inputs.mapV);
    const na = parseFloat(inputs.na);
    const cl = parseFloat(inputs.cl);
    let alb = parseFloat(inputs.alb);
    if (!isNaN(alb) && inputs.albUnit === 'mg/dL') alb = alb / 1000;
    const laktat = parseFloat(inputs.laktat);
    const rr = parseFloat(inputs.rr);
    const kondisi = inputs.kondisi;
    
    const spo2Source = inputs.spo2Source === 'pulse' ? 'SpO₂ (Pulse Ox)' : 'SaO₂ (ABG)';
    const paco2Label = paco2Unit === 'kPa' ? `${(pco2 / 7.5006).toFixed(1)} kPa (= ${pco2.toFixed(0)} mmHg)` : `${pco2.toFixed(0)} mmHg`;

    const result: AbgResultData = {
      step1: null, step2Primer: null, step2KompStatus: null,
      step3Kompensasi: null, step4Ag: null, step5Laktat: null,
      step6Oksigenasi: null, saran: [], mgmt: []
    };

    // LANGKAH 1: STATUS pH
    let phStatus, phColor, phClass;
    if (pH < 7.35) {
      phStatus = pH < 7.20 ? 'Asidemia BERAT (pH <7.20)' : 'Asidemia';
      phColor = 'destructive'; phClass = 'bg-destructive/10 border-destructive/30 text-destructive';
    } else if (pH > 7.45) {
      phStatus = pH > 7.55 ? 'Alkalemia BERAT (pH >7.55)' : 'Alkalemia';
      phColor = 'warning'; phClass = 'bg-warning/10 border-warning/30 text-warning';
    } else {
      phStatus = 'pH Normal (7.35–7.45)';
      phColor = 'success'; phClass = 'bg-success/10 border-success/30 text-success';
    }
    
    result.step1 = {
      status: phStatus, color: phColor, cls: phClass,
      detail: `pH = ${pH} · PaCO₂ = ${paco2Label} · HCO₃⁻ = ${hco3} mmol/L · BE = ${be} mEq/L${!isNaN(alb) ? ` · Albumin = ${inputs.albUnit === 'mg/dL' ? (alb * 1000).toFixed(0) + ' mg/dL' : alb.toFixed(1) + ' g/dL'}` : ''}`
    };

    // LANGKAH 2: GANGGUAN PRIMER
    const acidosis = pH < 7.35, alkalosis = pH > 7.45;
    const respAcid = pco2 > 45, respAlk = pco2 < 35;
    const metAcid  = hco3 < 22 || be < -2, metAlk = hco3 > 26 || be > 2;
    const phAcidLean = pH < 7.40;
    
    let primary = '';
    if (acidosis) {
      if (respAcid && metAcid) primary = 'Mixed: Asidosis Respiratorik + Asidosis Metabolik';
      else if (respAcid) primary = metAlk ? 'Asidosis Respiratorik Primer — dengan kompensasi metabolik parsial' : 'Asidosis Respiratorik Primer (kompensasi metabolik belum tampak)';
      else if (metAcid) primary = respAlk ? 'Asidosis Metabolik Primer — dengan kompensasi respiratorik parsial' : 'Asidosis Metabolik Primer (kompensasi respiratorik belum tampak)';
      else primary = 'Asidemia — penyebab tidak jelas (cek nilai)';
    } else if (alkalosis) {
      if (respAlk && metAlk) primary = 'Mixed: Alkalosis Respiratorik + Alkalosis Metabolik';
      else if (respAlk) primary = metAcid ? 'Alkalosis Respiratorik Primer — dengan kompensasi metabolik parsial' : 'Alkalosis Respiratorik Primer (kompensasi metabolik belum tampak)';
      else if (metAlk) primary = respAcid ? 'Alkalosis Metabolik Primer — dengan kompensasi respiratorik parsial' : 'Alkalosis Metabolik Primer (kompensasi respiratorik belum tampak)';
      else primary = 'Alkalemia — penyebab tidak jelas';
    } else {
      if (respAcid && metAlk) primary = phAcidLean ? 'Asidosis Respiratorik TERKOMPENSASI (kronik, mendekati penuh) — primer: Asidosis Respiratorik · cek Langkah 3' : 'Alkalosis Metabolik TERKOMPENSASI — primer: Alkalosis Metabolik · cek Langkah 3';
      else if (respAlk && metAcid) primary = phAcidLean ? 'Asidosis Metabolik TERKOMPENSASI — primer: Asidosis Metabolik · cek Langkah 3' : 'Alkalosis Respiratorik TERKOMPENSASI (kronik) — primer: Alkalosis Respiratorik · cek Langkah 3';
      else if (!respAcid && !respAlk && !metAcid && !metAlk) primary = 'ABG Normal — tidak ada gangguan primer';
      else if (respAcid) primary = 'Asidosis Respiratorik — pH masih normal (kompensasi/onset dini), cek Langkah 3';
      else if (respAlk) primary = 'Alkalosis Respiratorik — pH masih normal (kompensasi/onset dini), cek Langkah 3';
      else if (metAcid) primary = 'Asidosis Metabolik — pH masih normal (kompensasi/onset dini), cek Langkah 3';
      else if (metAlk) primary = 'Alkalosis Metabolik — pH masih normal (kompensasi/onset dini), cek Langkah 3';
      else primary = 'pH Normal dengan kompensasi atau mixed disorder';
    }
    
    result.step2Primer = {
      interp: primary, color: 'primary', cls: 'bg-primary/10 border-primary/20 text-foreground',
      detail: `pH ${pH < 7.40 ? '<7.40 (condong asam)' : pH > 7.40 ? '>7.40 (condong basa)' : '= 7.40'} · PaCO₂ = ${pco2.toFixed(0)} mmHg (N:35–45) · HCO₃⁻ = ${hco3} (N:22–26) · BE = ${be}`
    };

    // LANGKAH 2b: STATUS KOMPENSASI
    let compStatus, compColor, compCls;
    const bothOpposite = (respAcid && metAlk) || (respAlk && metAcid);
    if (!acidosis && !alkalosis) {
      if (!respAcid && !respAlk && !metAcid && !metAlk) {
        compStatus = 'Tidak ada gangguan — kompensasi tidak applicable';
        compColor = 'success'; compCls = 'bg-success/10 border-success/30';
      } else if (bothOpposite) {
        compStatus = 'TERKOMPENSASI PENUH — pH sudah kembali ke rentang normal';
        compColor = 'success'; compCls = 'bg-success/10 border-success/30';
      } else {
        compStatus = 'Kompensasi dini / belum penuh — pH masih normal, baru satu sistem yang bergeser';
        compColor = 'warning'; compCls = 'bg-warning/10 border-warning/30';
      }
    } else {
      let compPresent = false, mixedSame = false;
      if (acidosis) {
        if (respAcid && metAcid) mixedSame = true;
        else if (respAcid) compPresent = hco3 > 26;
        else if (metAcid) compPresent = pco2 < 35;
      } else {
        if (respAlk && metAlk) mixedSame = true;
        else if (respAlk) compPresent = hco3 < 22;
        else if (metAlk) compPresent = pco2 > 45;
      }
      if (mixedSame) {
        compStatus = 'Gangguan campuran searah — kompensasi tidak applicable (kedua sistem ke arah yang sama)';
        compColor = 'destructive'; compCls = 'bg-destructive/10 border-destructive/30';
      } else if (compPresent) {
        compStatus = 'TERKOMPENSASI SEBAGIAN — sistem lawan sudah mengompensasi, namun pH belum kembali normal';
        compColor = 'warning'; compCls = 'bg-warning/10 border-warning/30';
      } else {
        compStatus = 'TIDAK TERKOMPENSASI — sistem lawan belum bergeser untuk mengompensasi';
        compColor = 'destructive'; compCls = 'bg-destructive/10 border-destructive/30';
      }
    }
    result.step2KompStatus = { interp: compStatus, color: compColor, cls: compCls };

    // LANGKAH 3: KOMPENSASI
    let compNote = '';
    if (respAcid && !respAlk) {
      const expAcute = 24 + 0.1 * (pco2 - 40);
      const expChronic = 24 + 0.35 * (pco2 - 40);
      if (Math.abs(hco3 - expAcute) <= 2) compNote = `Asidosis Resp AKUT — Kompensasi metabolik adekuat (Expected HCO₃⁻ akut: ${expAcute.toFixed(1)}, actual: ${hco3})`;
      else if (Math.abs(hco3 - expChronic) <= 3) compNote = `Asidosis Resp KRONIK — Kompensasi metabolik adekuat (Expected HCO₃⁻ kronik: ${expChronic.toFixed(1)}, actual: ${hco3})`;
      else if (hco3 > expChronic + 3) compNote = `Asidosis Resp + Alkalosis Metabolik Concurrent (HCO₃⁻ ${hco3} > expected kronik ${expChronic.toFixed(1)}+3)`;
      else compNote = `Kompensasi TIDAK ADEKUAT — Mixed disorder? Expected akut: ${expAcute.toFixed(1)}, kronik: ${expChronic.toFixed(1)}, actual: ${hco3}`;
    } else if (respAlk) {
      const expAcute = 24 - 0.2 * (40 - pco2);
      const expChronic = 24 - 0.5 * (40 - pco2);
      if (Math.abs(hco3 - expAcute) <= 2.5) compNote = `Alkalosis Resp AKUT — Kompensasi adekuat (Expected HCO₃⁻ akut: ${expAcute.toFixed(1)})`;
      else if (Math.abs(hco3 - expChronic) <= 2.5) compNote = `Alkalosis Resp KRONIK — Kompensasi adekuat (Expected HCO₃⁻ kronik: ${expChronic.toFixed(1)})`;
      else compNote = `Alkalosis Resp + kemungkinan Asidosis Met Concurrent. Expected akut: ${expAcute.toFixed(1)}, kronik: ${expChronic.toFixed(1)}, actual: ${hco3}`;
    } else if (metAcid && hco3 < 22) {
      const expPCO2 = 1.5 * hco3 + 8;
      if (Math.abs(pco2 - expPCO2) <= 2) compNote = `Asidosis Metabolik — Kompensasi respiratorik adekuat (Winter's: expected PaCO₂ = ${expPCO2.toFixed(0)} ± 2, actual: ${pco2.toFixed(0)})`;
      else if (pco2 > expPCO2 + 2) compNote = `Asidosis Metabolik + Asidosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} > Winter's ${expPCO2.toFixed(0)})`;
      else compNote = `Asidosis Metabolik + Alkalosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} < Winter's ${expPCO2.toFixed(0)})`;
    } else if (metAlk && hco3 > 26) {
      const expPCO2 = 0.7 * hco3 + 21;
      if (Math.abs(pco2 - expPCO2) <= 2) compNote = `Alkalosis Metabolik — Kompensasi respiratorik adekuat (Expected PaCO₂ = ${expPCO2.toFixed(0)} ± 2, actual: ${pco2.toFixed(0)})`;
      else if (pco2 < expPCO2 - 2) compNote = `Alkalosis Metabolik + Alkalosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} < expected ${expPCO2.toFixed(0)})`;
      else compNote = `Alkalosis Metabolik + Asidosis Respiratorik Concurrent (PaCO₂ ${pco2.toFixed(0)} > expected ${expPCO2.toFixed(0)})`;
    } else {
      compNote = 'Tidak ada gangguan primer signifikan — kompensasi tidak applicable.';
    }
    result.step3Kompensasi = { detail: compNote, color: 'warning', cls: 'bg-warning/10 border-warning/30 text-warning' };

    // LANGKAH 4: ANION GAP
    let agHigh = false;
    if (!isNaN(na) && !isNaN(cl)) {
      const ag = na - (cl + hco3);
      const agCorr = !isNaN(alb) ? ag + 2.5 * (4 - alb) : null;
      agHigh = agCorr !== null ? agCorr > 14 : ag > 12;
      let agNote = `AG = ${na} − (${cl} + ${hco3}) = ${ag.toFixed(1)} mEq/L (Normal 8–12)`;
      if (agCorr !== null) agNote += ` · AG terkoreksi albumin: ${agCorr.toFixed(1)} (Albumin ${alb.toFixed(1)} g/dL)`;
      
      let ddNote = '';
      if (agHigh && metAcid) {
        const dd = (ag - 12) / (24 - hco3);
        if (dd < 0.4) ddNote = `Delta-Delta = ${dd.toFixed(2)} (<0.4) → Mixed HAGMA + Non-AGMA (misalnya: ketoasidosis + RTA)`;
        else if (dd <= 1) ddNote = `Delta-Delta = ${dd.toFixed(2)} (0.4–1.0) → Non-anion gap metabolic acidosis concurrent`;
        else if (dd <= 2) ddNote = `Delta-Delta = ${dd.toFixed(2)} (1–2) → Pure HAGMA (tanpa komponen non-AG)`;
        else ddNote = `Delta-Delta = ${dd.toFixed(2)} (>2) → HAGMA + Alkalosis Metabolik Concurrent (HCO₃⁻ lebih tinggi dari expected)`;
      }
      
      result.step4Ag = {
        high: agHigh, corr: agCorr !== null,
        interp: agNote, detail: agHigh ? 'Penyebab HAGMA: Laktat, Ketoasidosis (DKA/alkohol), Uremia, Racun (metanol/etilen glikol), Salisilat — Mnemonic LKURS' : '',
        ddNote: ddNote || undefined,
        color: agHigh ? 'destructive' : 'success', cls: agHigh ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'bg-success/10 border-success/30 text-success'
      };
    }

    // LANGKAH 5: LAKTAT
    if (!isNaN(laktat)) {
      const lakColor = laktat < 2 ? 'success' : laktat < 4 ? 'warning' : 'destructive';
      const lakCls = laktat < 2 ? 'bg-success/10 border-success/30 text-success' : laktat < 4 ? 'bg-warning/10 border-warning/30 text-warning' : 'bg-destructive/10 border-destructive/30 text-destructive';
      const lakNote = laktat < 2 ? 'Normal (<2 mmol/L)' : laktat < 4 ? `Hiperlaktatemia (${laktat.toFixed(1)} mmol/L) — waspada hipoperfusi/HAGMA` : `Laktat BERAT (${laktat.toFixed(1)} mmol/L) — asidosis laktat, mortalitas ↑ signifikan`;
      result.step5Laktat = {
        interp: lakNote, color: lakColor, cls: lakCls,
        detail: laktat >= 2 ? 'Evaluasi: syok (Tipe A), DKA, gagal hati, metformin, thiamine def (Tipe B)' : ''
      };
    }

    // LANGKAH 6: OKSIGENASI
    if (!isNaN(po2) || fio2 !== null || !isNaN(spo2)) {
      let oxHtml = '';
      if (!isNaN(po2) && fio2 !== null) {
        const pf = po2 / fio2;
        const pfClass = pf >= 400 ? 'Normal' : pf >= 300 ? 'Hipoksemia ringan' : pf >= 200 ? 'ARDS Mild' : pf >= 100 ? 'ARDS Moderate' : 'ARDS Severe';
        const pfColor = pf >= 300 ? 'text-success' : pf >= 200 ? 'text-warning' : 'text-destructive';
        oxHtml += `P/F Ratio = ${pf.toFixed(0)} → <strong class="${pfColor}">${pfClass}</strong> <br/>`;
        
        const pao2calc = (fio2 * (760 - 47)) - (pco2 / 0.8);
        const aaGrad = pao2calc - po2;
        oxHtml += `A-a Gradient = ${aaGrad.toFixed(0)} mmHg (normal &lt;20) → ${aaGrad > 20 ? 'MENINGKAT (V/Q mismatch/shunt)' : 'Normal (hipoventilasi murni jika hipoksemia ada)'} <br/>`;
      }
      if (!isNaN(po2) && fio2 !== null && !isNaN(mapV)) {
        const oi = (mapV * fio2 * 100) / po2;
        oxHtml += `OI = ${oi.toFixed(1)} (${oi < 5 ? 'Ringan' : oi < 25 ? 'Moderate' : oi < 40 ? 'Berat' : 'Sangat Berat — ECMO?'}) <br/>`;
      }
      if (!isNaN(spo2) && fio2 !== null && !isNaN(rr)) {
        const rox = (spo2 / fio2) / rr;
        const roxColor = rox >= 4.88 ? 'text-success' : rox >= 3.85 ? 'text-warning' : 'text-destructive';
        oxHtml += `ROX Index = (${spo2}/FiO₂${fio2.toFixed(2)})/RR${rr} = <strong class="${roxColor}">${rox.toFixed(2)}</strong> [sumber: <em>${spo2Source}</em>] → ${rox >= 4.88 ? 'Risiko HFNC gagal RENDAH' : rox >= 3.85 ? 'Intermediate — evaluasi ketat' : 'Risiko HFNC gagal TINGGI → pertimbangkan intubasi'}`;
      }
      if (oxHtml) {
        result.step6Oksigenasi = {
          html: oxHtml, color: 'primary', cls: 'bg-primary/10 border-primary/20 text-foreground'
        };
      }
    }

    // KONSIDERASI KLINIS
    if (!isNaN(po2) && fio2 !== null) {
      const pf = po2 / fio2;
      if (pf < 100) result.saran.push('P/F <100 (ARDS Severe): ↑ PEEP 13–18, prone position jika P/F <150, pertimbangkan NMB cisatrakurium, ECMO jika OI >40');
      else if (pf < 200) result.saran.push('P/F 100–200 (ARDS Moderate): ↑ PEEP 8–13, FiO₂ 0.4–0.7, pertimbangkan prone jika tidak membaik');
      else if (pf < 300) result.saran.push('P/F 200–300 (ARDS Mild): PEEP 5–8, FiO₂ titrasi, evaluasi ventilasi lung-protective');
    }
    if (pH < 7.25 && pco2 > 50) result.saran.push('Asidosis respiratorik berat: ↑ RR atau ↑ VT (hati-hati Pplat), pertimbangkan NaHCO₃ jika pH <7.10 dengan ventilasi adekuat');
    if (pco2 < 35 && pH > 7.45) result.saran.push('Alkalosis respiratorik: ↓ RR (bertahap), cek dead space, pastikan tidak ada pain/agitasi yang meningkatkan drive');
    if (metAcid && be < -5) result.saran.push('Asidosis metabolik: koreksi penyebab primer (sepsis, hipovolemia, DKA). NaHCO₃ hanya jika pH <7.10 DAN ventilasi adekuat');
    if (pH > 7.50 && hco3 > 30) result.saran.push('Alkalosis metabolik: koreksi hipokalemia, hipokloremia; hentikan diuretik; KCl replacement');
    if (kondisi === 'copd' && pco2 > 55) result.saran.push('PPOK: TARGET PaCO₂ = baseline pasien, bukan normocapnia! Koreksi bertahap — risiko alkalosis metabolik berat');
    if (kondisi === 'ards') result.saran.push('ARDS: Pertahankan driving pressure ≤15 cmH₂O. Toleransi permissive hypercapnia (PaCO₂ 45–65) jika pH >7.20');

    // ── KOREKSI ASAM-BASA SPESIFIK ──────────────────────────────────────────
    if (metAcid) {
      const isHAGMA = agHigh;
      const isNAGMA = !isNaN(na) && !isNaN(cl) && !agHigh;
      const bicarInd = pH < 7.10 ? '⚠ TERINDIKASI (pH <7.10)' : pH < 7.20 ? 'Pertimbangkan (pH 7.10–7.20, esp. AKI/NAGMA)' : 'Belum terindikasi — koreksi penyebab primer dulu';
      result.mgmt.push({
        judul: 'Koreksi Asidosis Metabolik',
        color: 'text-destructive',
        isi: [
          `NaHCO₃ IV: ${bicarInd}`,
          `Formula dosis: 0.5 × BBideal(kg) × (target HCO₃ − ${hco3.toFixed(0)} mmol/L) = mEq NaHCO₃ — targetkan HCO₃ 12–15, BUKAN normalisasi penuh`,
          'Pemberian: ½ dosis dalam 4 jam pertama → evaluasi AGD → ½ sisanya jika perlu. NaHCO₃ 8.4% = 1 mEq/mL; NaHCO₃ 7.5% = 0.9 mEq/mL',
          'Perhatian: NaHCO₃ → ↑ PaCO₂ transien (CO₂ release dari buffer) — pastikan ventilasi adekuat. Hindari jika alkalosis concurrent (Δ-Δ >2)',
          isHAGMA ? 'HAGMA: Prioritas koreksi kausa (laktat → resusitasi, DKA → insulin, uremia → RRT, toksik → eliminasi)' : '',
          isNAGMA ? 'NAGMA: Identifikasi etiologi — diarrhea → rehidrasi; RTA → NaHCO₃ kronik 1–2 mEq/kg/hari; dilutional → hentikan saline, ganti ke balanced crystalloid' : '',
          'Monitoring post-koreksi: pH, PaCO₂, K⁺ (hipokalemia memburuk saat pH naik), Na⁺ (hati-hati Na overload)'
        ].filter(Boolean),
        ref: 'Kraut JA, Madias NE. NEJM 2014 · Jaber S et al. Lancet 2018 (BICAR-ICU) · Berend K. NEJM 2014'
      });
    }

    if (metAlk) {
      const severeAlk = hco3 > 40 || pH > 7.55;
      result.mgmt.push({
        judul: 'Koreksi Alkalosis Metabolik',
        color: 'text-warning',
        isi: [
          'Tentukan tipe: Chloride-responsive (urin Cl⁻ <20 mEq/L) vs Chloride-resistant (urin Cl⁻ >20 mEq/L)',
          'Chloride-responsive (muntah, NGT suction, diuretik): NaCl 0.9% IV + KCl replacement',
          'KCl IV: 10–20 mEq/jam via central line — koreksi hipokalemia WAJIB dulu (target K⁺ ≥3.5 mEq/L)',
          'Chloride-resistant (hiperaldosteronisme, Cushing, Bartter): koreksi underlying + spironolakton/amiloride',
          hco3 > 35 ? 'Acetazolamide 250–500 mg IV/8 jam: pilihan untuk CHF/fluid-overloaded (hindari eGFR <30, sulfa allergy)' : '',
          severeAlk ? 'Alkalosis BERAT (pH >7.55): pertimbangkan HCl 0.1N via CVC — dosis: 0.1 × BB × (HCO₃ aktual − 24) mEq, berikan dalam 12–24 jam, pantau ketat' : '',
          'Stop penyebab iatrogenik: kurangi/stop diuretik, hindari antasid berlebihan, kurangi transfusi sitrat'
        ].filter(Boolean),
        ref: 'Emmett M. CJASN 2020 · Gennari FJ. NEJM 1998 · Laski ME. Am J Kidney Dis 2006'
      });
    }

    if (respAcid && acidosis) {
      const permHyperCap = kondisi === 'ards' || (!isNaN(po2) && fio2 !== null && (po2/fio2) < 200);
      result.mgmt.push({
        judul: 'Koreksi Asidosis Respiratorik',
        color: 'text-destructive',
        isi: [
          kondisi === 'copd' ? 'PPOK: TARGET PaCO₂ = baseline pasien (bukan 40 mmHg!) — koreksi agresif risiko alkalosis rebound berat' : 'Target: perbaiki ventilasi alveolar, bukan buffer HCO₃',
          kondisi === 'copd' || kondisi === 'umum' ? 'NIV BiPAP lini pertama (GCS baik, kooperatif): IPAP 12–18 / EPAP 4–8 cmH₂O, titrasi PaCO₂ turun 5–8 mmHg/jam' : '',
          'Intubasi jika: NIV gagal/kontraindikasi, GCS ↓ berat, sekresi tidak terkontrol, instabilitas hemodinamik',
          'Pada ventilator: ↑ RR 2–3/mnt bertahap (max 35/mnt), awasi auto-PEEP. ↑ VT 6→8 mL/kgBBP hanya jika Pplat <28 cmH₂O',
          permHyperCap ? `Permissive hypercapnia (ARDS/lung-protective): toleransi PaCO₂ hingga 70 mmHg jika pH >7.20 dan driving pressure ≤15 cmH₂O — JANGAN ↑ VT untuk "normalisasi" CO₂` : '',
          'NaHCO₃ TIDAK diindikasikan untuk asidosis resp murni — hanya sebagai bridge jika pH <7.10 dan ventilasi optimal sudah tercapai',
          'Bronkodilator nebulisasi: salbutamol 2.5 mg + ipratropium 0.5 mg q4–6h (esp. PPOK/asma)'
        ].filter(Boolean),
        ref: 'GOLD 2024 · Rochwerg B. Eur Respir J 2017 (NIV) · Matthay MA. NEJM 2019 · Slutsky AS. NEJM 2013 (lung-protective)'
      });
    }

    if (respAlk && alkalosis) {
      result.mgmt.push({
        judul: 'Koreksi Alkalosis Respiratorik',
        color: 'text-warning',
        isi: [
          'Koreksi penyebab: nyeri → analgesia (morfin/fentanyl titrasi); agitasi → sedasi (propofol/midazolam titrasi); sepsis → kultur + antibiotik',
          'Pada ventilator: ↓ RR 2/mnt bertahap (min 10/mnt), atau tambah dead space connector (increase anatomical dead space)',
          'Target pH <7.50 secara bertahap — koreksi terlalu cepat dapat presipitasi seizure (alkalosis akut → vasokonstriksi serebral)',
          'Elektrolit yang sering terganggu: hipokalemia, hipofosfatemia, hipokalsemia ionik — koreksi bersamaan',
          'Liver failure: alkalosis resp persisten akibat hiperammonemia — tidak bisa dicegah tanpa koreksi kausa hepatik',
          'Cek VD/VT meningkat jika PaCO₂ rendah persisten meski RR sudah diturunkan (dead space patologis)'
        ],
        ref: 'Berend K. NEJM 2014 · Laffey JG. NEJM 2002 · Seifter JL. NEJM 2023'
      });
    }

    // ── TATALAKSANA KONDISI KLINIS SPESIFIK ─────────────────────────────────
    if (agHigh && !isNaN(laktat) && laktat >= 2) {
      result.mgmt.push({
        judul: 'Asidosis Laktat / HAGMA',
        color: 'text-primary',
        isi: [
          'Target MAP ≥65 mmHg — resusitasi dengan Ringer Laktat atau PlasmaLyte (lebih sedikit dilutional acidosis vs NaCl 0.9%)',
          'Norepinefrin lini pertama jika MAP tidak respons cairan: 0.1–0.5 mcg/kg/mnt via central, titrasi',
          `Laktat clearance: target ≥10% penurunan per 2 jam. Laktat saat ini: ${laktat.toFixed(1)} mmol/L${laktat >= 4 ? ' — BERAT, mortalitas ↑' : ''}`,
          `NaHCO₃: ${pH < 7.10 ? 'TERINDIKASI (pH <7.10) — dosis 0.5 × BBideal × (15 − ' + hco3.toFixed(0) + ') mEq, berikan ½ dalam 4 jam' : pH < 7.20 ? 'Pertimbangkan jika AKI concurrent (BICAR-ICU benefit subgroup)' : 'Belum terindikasi — koreksi kausa primer dulu'}`,
          'Koreksi kausa primer: sepsis (antibiotik <1 jam dari onset), iskemia (revaskularisasi), DKA (insulin), hepatik (koreksi koagulopati)',
          'Tiamin IV 100–200 mg jika suspek defisiensi (alkohol, malnutrisi, refrakter terhadap resusitasi)'
        ],
        ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Jaber S. Lancet 2018 (BICAR-ICU) · Levy B. Chest 2015'
      });
    }

    if (agHigh && (isNaN(laktat) || laktat < 4) && metAcid) {
      result.mgmt.push({
        judul: 'Kemungkinan DKA / Ketoasidosis',
        color: 'text-primary',
        isi: [
          'Cek GDS, keton darah (beta-hydroxybutyrate), K⁺, Mg²⁺, fosfat sebelum mulai terapi',
          'Resusitasi cairan: NaCl 0.9% 1 L/jam pertama (1–2 jam), lanjut 250–500 mL/jam sesuai hidrasi + output',
          '⚠ CEK K⁺ DAHULU — jika K⁺ <3.5: TUNDA insulin, berikan KCl 20–40 mEq/jam IV sampai K⁺ ≥3.5',
          'Insulin regular IV: 0.1 unit/kgBB/jam (setelah K⁺ ≥3.5). Target: ↓ GDS 50–75 mg/dL/jam, AG normalisasi',
          'Ganti ke D5%/D10% + insulin saat GDS <200 (DKA) atau <250 (HHS) mg/dL — jaga agar GDS 150–200',
          'Fosfat: koreksi jika <1 mg/dL atau ada kelemahan otot napas',
          'NaHCO₃ pada DKA: hanya jika pH <7.0 setelah 1 jam resusitasi (ADA 2024 — kontroversi)'
        ],
        ref: 'ADA Standards of Care 2024 · Kitabchi AE. Diabetes Care 2009 · Umpierrez GE. Endocr Rev 2023'
      });
    }

    if (kondisi === 'ards' || (!isNaN(po2) && fio2 !== null && (po2/fio2) < 300)) {
      const pf = !isNaN(po2) && fio2 !== null ? po2/fio2 : null;
      result.mgmt.push({
        judul: 'Manajemen ARDS',
        color: 'text-primary',
        isi: [
          'Lung-Protective Ventilation: VT 6 mL/kgBBP, Pplat ≤28 cmH₂O, Driving Pressure ≤15 cmH₂O, PEEP per ARDSNet table',
          pf !== null && pf < 150 ? '🔄 Prone positioning: ≥16 jam/hari — wajib jika P/F <150 (PROSEVA 2013, NNT=8 untuk mortalitas)' : 'Prone positioning: pertimbangkan jika P/F tidak membaik 12–24 jam (threshold P/F <200–300 per PROSEVA update)',
          pf !== null && pf < 120 ? '💊 Neuromuscular blockade: cisatracurium 37.5 mg bolus → 37.5 mg/jam drip IV (48 jam awal, jika RASS ≤-3)' : '',
          'Konservasi cairan: fluid-restrictive strategy hari 2–7 setelah stabilisasi hemodinamik (FACTT trial)',
          pf !== null && pf < 80 ? '🔴 Pertimbangkan ECMO-VV: jika OI >40 atau P/F <80 refrakter ≥6 jam (EOLIA 2018 — konsultasi ECMO center segera)' : '',
          'Kortikosteroid: deksametason 6 mg/hari IV — dipertimbangkan pada ARDS moderate-severe (RECOVERY 2021, DEXA-ARDS 2020)',
          'Target: SpO₂ 92–96%, pH >7.20 (toleransi permissive hypercapnia), Pplat <28, driving pressure <15'
        ].filter(Boolean),
        ref: 'Matthay MA. NEJM 2019 · Guérin C. NEJM 2013 (PROSEVA) · Combes A. NEJM 2018 (EOLIA) · Villar J. Lancet Respir Med 2020 (DEXA-ARDS) · Slutsky AS. NEJM 2013'
      });
    }

    if (kondisi === 'sepsis' || (!isNaN(laktat) && laktat >= 2 && agHigh)) {
      result.mgmt.push({
        judul: 'Manajemen Sepsis / Syok Septik (SSC 2021)',
        color: 'text-primary',
        isi: [
          '⏱ HOUR-1 BUNDLE: Kultur darah (2 set, aerob+anaerob) → Antibiotik broad-spectrum IV → Laktat → Akses IV → Resusitasi',
          'Cairan: 30 mL/kgBB balanced crystalloid (RL preferred) dalam 3 jam; nilai respons cairan dengan PLR / VTI / PPV — STOP jika tidak responsif (cegah fluid overload)',
          'Vasopressor: Norepinefrin lini pertama 0.01–0.5 mcg/kg/mnt via central/IO, target MAP ≥65 mmHg (atau ≥80 jika riwayat hipertensi)',
          'Vasopressin 0.03 unit/mnt: tambahkan jika dosis NE >0.25 mcg/kg/mnt (sparing effect, turunkan NE dose)',
          'Kortikosteroid: hidrokortison 200 mg/hari IV (50 mg/6 jam atau infus kontinu) jika refrakter vasopressor — bukan semua sepsis',
          `Laktat monitoring: target clearance ≥10%/2 jam (saat ini: ${isNaN(laktat) ? '?' : laktat.toFixed(1)} mmol/L). ScvO₂ ≥70%; transfusi PRC jika Hb <7 dan ScvO₂ rendah`,
          'Antibiotik: de-eskalasi setelah 48–72 jam sesuai kultur. Durasi: 5–7 hari untuk respons klinis baik (IDSA/SSC)'
        ],
        ref: 'Evans L et al. Intensive Care Med 2021 (SSC) · Levy MM. Crit Care Med 2018 · Rhodes A. Intensive Care Med 2017'
      });
    }

    if (kondisi === 'cardiac') {
      result.mgmt.push({
        judul: 'Edema Paru Kardiogenik Akut',
        color: 'text-primary',
        isi: [
          'Posisi duduk 90°, oksigen → NIV (CPAP 5–10 cmH₂O atau BiPAP 8–12/5 cmH₂O) — turunkan preload, afterload, WOB',
          'Furosemide IV: 40–80 mg bolus (2× dosis oral harian) atau infus 5–10 mg/jam; target UO ≥100 mL/jam 2 jam pertama',
          'Nitrogliserin IV: mulai 10–20 mcg/mnt, titrasi 10–20 mcg/mnt tiap 5 mnt jika sistolik >100 mmHg (turunkan afterload)',
          'HINDARI cairan berlebihan — resusitasi hanya jika ada bukti hipovolemia konkuren (RV failure, tamponade)',
          'Low output / kardiogenik syok: dobutamin 2–10 mcg/kgBB/mnt (ionotropik) + NE jika MAP tidak tercapai',
          'Intubasi: jika gagal NIV, GCS ↓, asidosis berat (pH <7.20), atau distres napas yang tidak terkontrol',
          'Koreksi penyebab precipitating: ACS (kateterisasi emergent), AF rapid (rate control/kardioversi), hipertensif emergensi (NTG IV)'
        ],
        ref: 'McDonagh TA et al. Eur Heart J 2021 (ESC HF) · Mebazaa A. Intensive Care Med 2018 · Masip J. Eur Heart J Acute Cardiovasc Care 2022'
      });
    }
    
    return result;
  }, [inputs]);
}
