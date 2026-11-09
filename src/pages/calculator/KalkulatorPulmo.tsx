import React, { useState, useEffect, useMemo } from 'react';
import { CalcActionBar, type CalcTone } from '../../components/ui/CalcActionBar';
import { useCalcTrigger } from '../../hooks/useCalcTrigger';
import { useActiveSection } from '../../hooks/useActiveSection';
import { Stethoscope, Wind, FileText, ChevronDown } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { CalcSteps } from '../../components/ui/CalcSteps';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner, type SyncField } from '../../components/UnifiedSyncBanner';
import { fio2ToPercentString } from '../../utils/abg';
import { curb65Group, psiIsClassI, psiClass, smartCopRisk } from '../../utils/pneumonia';
import { interpretAa, expectedAaRoomAir } from '../../utils/oxygenation';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { AbbrLegend } from '../../components/ui/AbbrLegend';

const MISSING_RING = ' ring-2 ring-[var(--sys-red)]';
const RISK_TONE: Record<string, CalcTone> = { low: 'good', mid: 'warn', high: 'bad', veryhigh: 'bad' };
const SECTIONS = ['sec-curb', 'sec-psi', 'sec-smartcop', 'sec-ats', 'sec-aa'] as const;

export default function KalkulatorPulmo() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [ureumMgdl, setUreumMgdl] = useState('');
  const [ureumMmol, setUreumMmol] = useState('');
  const [bunMgdl, setBunMgdl] = useState('');

  // CURB-65
  const [curbC, setCurbC] = useState('0');
  const [curbRr, setCurbRr] = useState('');
  const [curbSbp, setCurbSbp] = useState('');
  const [curbDbp, setCurbDbp] = useState('');
  const [curbAge, setCurbAge] = useState('');
  const [curbRes, setCurbRes] = useState<any>(null);

  // PSI/PORT
  const [psiSex, setPsiSex] = useState<'m'|'f'>('m');
  const [psiAge, setPsiAge] = useState('');
  const [psiNursing, setPsiNursing] = useState(false);
  const [psiNeoplastic, setPsiNeoplastic] = useState(false);
  const [psiLiver, setPsiLiver] = useState(false);
  const [psiChf, setPsiChf] = useState(false);
  const [psiCva, setPsiCva] = useState(false);
  const [psiRenal, setPsiRenal] = useState(false);
  const [psiAms, setPsiAms] = useState(false);
  const [psiRr, setPsiRr] = useState('');
  const [psiSbp, setPsiSbp] = useState('');
  const [psiTemp, setPsiTemp] = useState('');
  const [psiHr, setPsiHr] = useState('');
  const [psiPh, setPsiPh] = useState('');
  const [psiBun, setPsiBun] = useState('');
  const [psiNa, setPsiNa] = useState('');
  const [psiGlucose, setPsiGlucose] = useState('');
  const [psiHct, setPsiHct] = useState('');
  const [psiPao2, setPsiPao2] = useState('');
  const [psiSpo2, setPsiSpo2] = useState('');
  const [psiEffusion, setPsiEffusion] = useState(false);
  const [psiRes, setPsiRes] = useState<any>(null);

  // SMART-COP
  const [scAge, setScAge] = useState('');
  const [scSbp, setScSbp] = useState(false);
  const [scMulti, setScMulti] = useState(false);
  const [scAlbumin, setScAlbumin] = useState(false);
  const [scRr, setScRr] = useState(false);
  const [scTachy, setScTachy] = useState(false);
  const [scConfusion, setScConfusion] = useState(false);
  const [scO2, setScO2] = useState(false);
  const [scPh, setScPh] = useState(false);
  const [smartCopRes, setSmartCopRes] = useState<any>(null);

  // ATS/IDSA Checklist
  const [atsInvasive, setAtsInvasive] = useState(false);
  const [atsShock, setAtsShock] = useState(false);
  const [atsRr, setAtsRr] = useState(false);
  const [atsPf, setAtsPf] = useState(false);
  const [atsMulti, setAtsMulti] = useState(false);
  const [atsConfusion, setAtsConfusion] = useState(false);
  const [atsUremia, setAtsUremia] = useState(false);
  const [atsLeuko, setAtsLeuko] = useState(false);
  const [atsThrombo, setAtsThrombo] = useState(false);
  const [atsHypoT, setAtsHypoT] = useState(false);
  const [atsHypoBP, setAtsHypoBP] = useState(false);

  // A-a Gradient
  const [aaFio2Mode, setAaFio2Mode] = useState<'decimal'|'percent'>('decimal');
  const [aaFio2Raw, setAaFio2Raw] = useState('');
  const [aaPaco2, setAaPaco2] = useState('');
  const [aaPao2, setAaPao2] = useState('');
  const [aaPatm, setAaPatm] = useState('760');
  const [aaAge, setAaAge] = useState('');
  const [aaRes, setAaRes] = useState<any>(null);
  const [aaFio2Error, setAaFio2Error] = useState('');
  const [aaInputError, setAaInputError] = useState('');
  const [psiError, setPsiError] = useState('');

  const handleUreumChange = (val: string, type: 'mgdl' | 'mmol' | 'bun') => {
    if (val === '') {
      setUreumMgdl(''); setUreumMmol(''); setBunMgdl('');
      return;
    }
    const num = parseFloat(val);
    if (type === 'mgdl') {
      setUreumMgdl(val);
      setUreumMmol((num / 6.006).toFixed(2));
      setBunMgdl((num * 0.4667).toFixed(1));
    } else if (type === 'mmol') {
      setUreumMmol(val);
      setUreumMgdl((num * 6.006).toFixed(1));
      setBunMgdl((num * 2.8).toFixed(1));
    } else {
      setBunMgdl(val);
      setUreumMgdl((num / 0.4667).toFixed(1));
      setUreumMmol((num / 2.8).toFixed(2));
    }
  };

  const getFio2Decimal = (): number => {
    const raw = parseFloat(aaFio2Raw);
    if (isNaN(raw)) return NaN;
    return aaFio2Mode === 'percent' ? raw / 100 : raw;
  };

  const getFio2Hint = (): string => {
    const dec = getFio2Decimal();
    if (isNaN(dec)) return '';
    if (dec < 0.21 || dec > 1.0) return '⚠ FiO₂ harus 0.21–1.0 (21–100%)';
    return aaFio2Mode === 'decimal' ? `= ${(dec * 100).toFixed(0)}%` : `= ${dec.toFixed(2)} (desimal)`;
  };

  const handleAutofill = () => {
    const cs = clinicalStore.data;
    const age = patient.ageYears || cs.age || '';

    if (cs.ureum) handleUreumChange(cs.ureum, 'mgdl');

    if (cs.rr) setCurbRr(cs.rr);
    if (cs.systolic) setCurbSbp(cs.systolic);
    if (cs.diastolic) setCurbDbp(cs.diastolic);
    if (age) setCurbAge(age);

    if (age) setPsiAge(age);
    if (cs.gender) setPsiSex(cs.gender === 'f' ? 'f' : 'm');
    if (cs.rr) setPsiRr(cs.rr);
    if (cs.systolic) setPsiSbp(cs.systolic);
    if (cs.temp) setPsiTemp(cs.temp);
    if (cs.hr) setPsiHr(cs.hr);
    if (cs.ph) setPsiPh(cs.ph);
    if (cs.ureum) {
      const bun = (parseFloat(cs.ureum) * 0.4667).toFixed(1);
      setPsiBun(bun);
    }
    if (cs.na) setPsiNa(cs.na);
    if (cs.glukosa) setPsiGlucose(cs.glukosa);
    if (cs.hematokrit) setPsiHct(cs.hematokrit);
    if (cs.pao2) setPsiPao2(cs.pao2);
    if (cs.spo2) setPsiSpo2(cs.spo2);

    if (age) setScAge(age);
    if (cs.systolic) setScSbp(parseFloat(cs.systolic) < 90);
    if (cs.albumin) setScAlbumin(parseFloat(cs.albumin) < 3.5);
    if (cs.ph) setScPh(parseFloat(cs.ph) < 7.35);
    if (cs.hr) setScTachy(parseFloat(cs.hr) >= 125);
    // SMART-COP: ambang RR & oksigenasi bergantung usia (≤50 vs >50 th, Charles 2008).
    // Tanpa usia → kriteria TIDAK dicentang otomatis (tidak menebak usia).
    const ageNum = parseFloat(age);
    if (Number.isFinite(ageNum)) {
      const young = ageNum <= 50;
      if (cs.rr) setScRr(parseFloat(cs.rr) >= (young ? 25 : 30));
      const p2 = parseFloat(cs.pao2 || '');
      const s2 = parseFloat(cs.spo2 || '');
      const lowPao2 = Number.isFinite(p2) && p2 < (young ? 70 : 60);
      const lowSpo2 = Number.isFinite(s2) && s2 <= (young ? 93 : 90);
      if (Number.isFinite(p2) || Number.isFinite(s2)) setScO2(lowPao2 || lowSpo2);
    }

    if (age) setAaAge(age);
    if (cs.pco2) setAaPaco2(cs.pco2);
    if (cs.pao2) setAaPao2(cs.pao2);
    if (cs.fio2) {
      setAaFio2Mode('percent');
      setAaFio2Raw(cs.fio2);
    }
  };

  useEffect(() => { handleAutofill(); }, []);

  // Satu set variabel pasien untuk semua tool di halaman ini (CURB-65, PSI, SMART-COP, A-a).
  const syncFields = useMemo<SyncField[]>(() => [
    { key: 'age', label: 'Usia', value: psiAge, setter: (v: string) => { setCurbAge(v); setPsiAge(v); setScAge(v); setAaAge(v); }, unit: 'tahun' },
    { key: 'gender', label: 'JK', value: psiSex, setter: (v: string) => setPsiSex(v === 'f' ? 'f' : 'm'), formatDisplay: (v: string) => (v === 'f' ? 'Perempuan' : 'Laki-laki') },
    { key: 'ureum', label: 'Ureum', value: ureumMgdl, setter: (v: string) => handleUreumChange(v, 'mgdl'), unit: 'mg/dL' },
    { key: 'rr', label: 'RR', value: curbRr, setter: (v: string) => { setCurbRr(v); setPsiRr(v); }, unit: 'x/menit' },
    { key: 'systolic', label: 'TDS', value: curbSbp, setter: (v: string) => { setCurbSbp(v); setPsiSbp(v); }, unit: 'mmHg' },
    { key: 'diastolic', label: 'TDD', value: curbDbp, setter: setCurbDbp, unit: 'mmHg' },
    { key: 'hr', label: 'HR', value: psiHr, setter: setPsiHr, unit: 'x/menit' },
    { key: 'temp', label: 'Suhu', value: psiTemp, setter: setPsiTemp, unit: '°C' },
    { key: 'na', label: 'Na', value: psiNa, setter: setPsiNa, unit: 'mEq/L' },
    { key: 'glukosa', label: 'GDS', value: psiGlucose, setter: setPsiGlucose, unit: 'mg/dL' },
    { key: 'hematokrit', label: 'Ht', value: psiHct, setter: setPsiHct, unit: '%' },
    { key: 'pco2', label: 'PaCO₂', value: aaPaco2, setter: setAaPaco2, unit: 'mmHg' },
    { key: 'pao2', label: 'PaO₂', value: aaPao2, setter: (v: string) => { setAaPao2(v); setPsiPao2(v); }, unit: 'mmHg' },
    { key: 'spo2', label: 'SpO₂', value: psiSpo2, setter: setPsiSpo2, unit: '%' },
    { key: 'ph', label: 'pH', value: psiPh, setter: setPsiPh, unit: '' },
    {
      key: 'fio2', label: 'FiO₂',
      value: fio2ToPercentString(aaFio2Raw),
      rawValue: aaFio2Raw,
      setter: (v: string) => { setAaFio2Mode('percent'); setAaFio2Raw(v); },
      unit: '%',
    },
  ], [psiAge, psiSex, ureumMgdl, curbRr, curbSbp, curbDbp, psiHr, psiTemp, psiNa, psiGlucose, psiHct, aaPaco2, aaPao2, psiSpo2, psiPh, aaFio2Raw]);

  const atsResult = useMemo(() => {
    const isMajor = atsInvasive || atsShock;
    const minorCount = [atsRr, atsPf, atsMulti, atsConfusion, atsUremia, atsLeuko, atsThrombo, atsHypoT, atsHypoBP].filter(Boolean).length;
    if (isMajor) return { isSevere: true, desc: `Kriteria mayor terpenuhi — admisi ICU diindikasikan`, major: (atsInvasive ? 1 : 0) + (atsShock ? 1 : 0), minor: minorCount };
    if (minorCount >= 3) return { isSevere: true, desc: `${minorCount}/9 kriteria minor terpenuhi (threshold ≥3)`, major: 0, minor: minorCount };
    return { isSevere: false, desc: `${minorCount}/9 kriteria minor — belum memenuhi threshold severe CAP`, major: 0, minor: minorCount };
  }, [atsInvasive, atsShock, atsRr, atsPf, atsMulti, atsConfusion, atsUremia, atsLeuko, atsThrombo, atsHypoT, atsHypoBP]);


  const calcCurb = () => {
    let score = parseInt(curbC);
    let rows = [];

    rows.push({ n: 'C — Confusion', d: curbC === '1' ? 'Ya' : 'Tidak', p: parseInt(curbC) });

    if (ureumMgdl) {
      const u = parseFloat(ureumMgdl) > 42 ? 1 : 0;
      rows.push({ n: 'U — Urea (>42 mg/dL)', d: u ? 'Ya' : 'Tidak', p: u });
      score += u;
    } else {
      rows.push({ n: 'U — Urea', d: 'Tidak dimasukkan', p: 0 });
    }

    const missing: string[] = [];
    if (!ureumMgdl) missing.push('Urea');
    if (curbRr) {
      const r = parseFloat(curbRr) >= 30 ? 1 : 0;
      rows.push({ n: 'R — Respiratory Rate (≥30)', d: r ? 'Ya' : 'Tidak', p: r });
      score += r;
    } else { rows.push({ n: 'R — Respiratory Rate', d: 'Tidak diisi', p: 0 }); missing.push('RR'); }

    if (curbSbp || curbDbp) {
      const b = ((curbSbp && parseFloat(curbSbp) < 90) || (curbDbp && parseFloat(curbDbp) <= 60)) ? 1 : 0;
      rows.push({ n: 'B — Blood Pressure (TDS <90 / TDD ≤60)', d: b ? 'Ya (Hipotensi)' : 'Tidak', p: b });
      score += b;
      if (!b && (!curbSbp || !curbDbp)) missing.push(!curbSbp ? 'TDS' : 'TDD');
    } else { rows.push({ n: 'B — Blood Pressure', d: 'Tidak diisi', p: 0 }); missing.push('Tekanan darah'); }

    if (curbAge) {
      const a = parseFloat(curbAge) >= 65 ? 1 : 0;
      rows.push({ n: '65 — Usia (≥65)', d: a ? 'Ya' : 'Tidak', p: a });
      score += a;
    } else { rows.push({ n: '65 — Usia', d: 'Tidak diisi', p: 0 }); missing.push('Usia'); }

    // Mortalitas per skor kohort derivasi Lim 2003 (dulu skor ≥3 ditulis "22–57%").
    const g = curb65Group(score);
    const cls = g.tone === 'low' ? 'text-teal-500' : g.tone === 'mid' ? 'text-amber-500' : 'text-red-500';
    const act = missing.length ? `${g.act} · SKOR PARSIAL — belum diisi: ${missing.join(', ')} (dihitung 0, skor bisa lebih tinggi).` : g.act;

    setCurbRes({ score, rows, interp: g.interp, act, cls, tone: g.tone, partial: missing.length > 0 });
  };

  const calcPSI = () => {
    const age = parseFloat(psiAge);
    if (isNaN(age)) { setPsiError('Masukkan usia pasien'); setPsiRes(null); return; }
    setPsiError('');

    const hasComorbid = psiNeoplastic || psiLiver || psiChf || psiCva || psiRenal;
    const hasAbnormalVitals = (
      psiAms ||
      (!isNaN(parseFloat(psiRr)) && parseFloat(psiRr) >= 30) ||
      (!isNaN(parseFloat(psiSbp)) && parseFloat(psiSbp) < 90) ||
      (!isNaN(parseFloat(psiTemp)) && (parseFloat(psiTemp) < 35 || parseFloat(psiTemp) >= 40)) ||
      (!isNaN(parseFloat(psiHr)) && parseFloat(psiHr) >= 125)
    );
    // Fine 1997: kelas I bila usia ≤50 (dulu <50 — usia tepat 50 tidak bisa kelas I).
    const isClassI = psiIsClassI(age, !!hasComorbid, !!hasAbnormalVitals);

    let score = psiSex === 'f' ? Math.max(age - 10, 0) : age;
    const rows: {name: string; pts: number; detail: string}[] = [];
    rows.push({ name: 'Usia (skor dasar)', pts: psiSex === 'f' ? Math.max(age - 10, 0) : age, detail: psiSex === 'f' ? `${age} − 10 = ${Math.max(age-10,0)}` : `${age}` });

    const add = (name: string, pts: number, detail: string) => {
      if (pts > 0) score += pts;
      rows.push({ name, pts, detail });
    };

    add('Nursing home', psiNursing ? 10 : 0, psiNursing ? 'Ya +10' : 'Tidak');
    if (psiNeoplastic) add('Neoplastic disease', 30, 'Ya +30');
    if (psiLiver) add('Liver disease', 20, 'Ya +20');
    if (psiChf) add('CHF', 10, 'Ya +10');
    if (psiCva) add('Cerebrovascular disease', 10, 'Ya +10');
    if (psiRenal) add('Renal disease', 10, 'Ya +10');

    add('Altered mental status', psiAms ? 20 : 0, psiAms ? 'Ya +20' : 'Tidak');
    const rr = parseFloat(psiRr);
    if (!isNaN(rr)) add('RR ≥30/mnt', rr >= 30 ? 20 : 0, `${rr}/mnt → ${rr >= 30 ? '≥30 +20' : '<30'}`);
    const sbp = parseFloat(psiSbp);
    if (!isNaN(sbp)) add('SBP <90 mmHg', sbp < 90 ? 20 : 0, `${sbp} mmHg → ${sbp < 90 ? '<90 +20' : '≥90'}`);
    const temp = parseFloat(psiTemp);
    if (!isNaN(temp)) add('Suhu <35 atau ≥40°C', (temp < 35 || temp >= 40) ? 15 : 0, `${temp}°C → ${(temp < 35 || temp >= 40) ? 'Abnormal +15' : 'Normal'}`);
    const hr = parseFloat(psiHr);
    if (!isNaN(hr)) add('HR ≥125/mnt', hr >= 125 ? 10 : 0, `${hr}/mnt → ${hr >= 125 ? '≥125 +10' : '<125'}`);

    const ph = parseFloat(psiPh);
    if (!isNaN(ph)) add('pH arteri <7.35', ph < 7.35 ? 30 : 0, `pH ${ph} → ${ph < 7.35 ? '<7.35 +30' : '≥7.35'}`);
    const bun = parseFloat(psiBun);
    if (!isNaN(bun)) add('BUN ≥30 mg/dL', bun >= 30 ? 20 : 0, `BUN ${bun} mg/dL → ${bun >= 30 ? '≥30 +20' : '<30'}`);
    const na = parseFloat(psiNa);
    if (!isNaN(na)) add('Na <130 mEq/L', na < 130 ? 20 : 0, `${na} mEq/L → ${na < 130 ? '<130 +20' : '≥130'}`);
    const glucose = parseFloat(psiGlucose);
    if (!isNaN(glucose)) add('Glukosa ≥250 mg/dL', glucose >= 250 ? 10 : 0, `${glucose} mg/dL → ${glucose >= 250 ? '≥250 +10' : '<250'}`);
    const hct = parseFloat(psiHct);
    if (!isNaN(hct)) add('Hematokrit <30%', hct < 30 ? 10 : 0, `${hct}% → ${hct < 30 ? '<30% +10' : '≥30%'}`);
    const po2 = parseFloat(psiPao2);
    const spo2v = parseFloat(psiSpo2);
    const oxyAbn = (!isNaN(po2) && po2 < 60) || (!isNaN(spo2v) && spo2v < 90);
    if (!isNaN(po2) || !isNaN(spo2v)) {
      add('PaO₂ <60 atau SpO₂ <90%', oxyAbn ? 10 : 0, !isNaN(po2) ? `PaO₂ ${po2} mmHg` : `SpO₂ ${spo2v}%`);
    }
    add('Efusi pleura (CXR)', psiEffusion ? 10 : 0, psiEffusion ? 'Ya +10' : 'Tidak');

    let riskClass: string, mortality: string, disposition: string, cls: string, dispositionCls: string, tone: CalcTone;
    // Mortalitas 30 hari: kelas I–III = rentang antar-kohort Fine 1997 (abstrak); IV–V nilai satu kohort.
    const pc = psiClass(score, isClassI);
    riskClass = pc.cls; mortality = pc.mortality;
    if (isClassI || score <= 70) {
      disposition = 'Rawat Jalan'; cls = 'text-green-500'; dispositionCls = 'text-green-600'; tone = 'good';
    } else if (score <= 90) {
      disposition = 'Rawat Inap Singkat / Observasi Ketat'; cls = 'text-amber-400'; dispositionCls = 'text-amber-600'; tone = 'warn';
    } else if (score <= 130) {
      disposition = 'Rawat Inap'; cls = 'text-orange-500'; dispositionCls = 'text-orange-600'; tone = 'warn';
    } else {
      disposition = 'Rawat Inap / ICU'; cls = 'text-red-500'; dispositionCls = 'text-red-600'; tone = 'bad';
    }

    setPsiRes({ score, riskClass, mortality, disposition, cls, dispositionCls, rows, isClassI, tone });
  };

  const calcSmartCop = () => {
    let score = 0;
    if (scSbp) score += 2;
    if (scMulti) score += 1;
    if (scAlbumin) score += 1;
    if (scRr) score += 1;
    if (scTachy) score += 1;
    if (scConfusion) score += 1;
    if (scO2) score += 2;
    if (scPh) score += 2;

    // SMART-COP memprediksi kebutuhan bantuan napas intensif/vasopresor (IRVS), BUKAN mortalitas
    // (dulu dilabeli "Mortalitas 1/12/33/67%").
    const sr = smartCopRisk(score);
    const risk = sr.risk;
    const desc = sr.desc;
    const cls = sr.tone === 'low' ? 'text-green-500 dark:text-green-400' : sr.tone === 'mid' ? 'text-amber-500 dark:text-amber-400' : sr.tone === 'high' ? 'text-orange-500 dark:text-orange-400' : 'text-red-600 dark:text-red-400';

    setSmartCopRes({ score, risk, desc, cls, tone: sr.tone });
  };

  const calcAa = () => {
    const f = getFio2Decimal();
    const pco2 = parseFloat(aaPaco2);
    const po2 = parseFloat(aaPao2);
    const patm = parseFloat(aaPatm) || 760;
    const age = parseFloat(aaAge);

    setAaFio2Error('');
    if (!aaFio2Raw) { setAaFio2Error('Masukkan FiO₂'); setAaRes(null); return; }
    if (isNaN(f) || f < 0.21 || f > 1.0) {
      setAaFio2Error(`FiO₂ tidak valid. Harus antara ${aaFio2Mode === 'percent' ? '21–100%' : '0.21–1.0'}`);
      setAaRes(null);
      return;
    }
    if (isNaN(pco2) || isNaN(po2)) { setAaInputError('Masukkan PaCO₂ dan PaO₂'); setAaRes(null); return; }
    setAaInputError('');

    const paO2calc = f * (patm - 47) - pco2 / 0.8;
    const aaGrad = paO2calc - po2;
    // Interpretasi sama dengan modul ABG (utils/oxygenation): normal ≈ usia/4 + 4 pada udara
    // ruang; pada FiO₂ >0,21 A-a normal ikut melebar → pakai P/F (dulu ambang 35/100 tak bersumber).
    const normalAa = !isNaN(age) ? expectedAaRoomAir(age) : NaN;
    const ia = interpretAa(aaGrad, f, !isNaN(age) ? age : null);
    const ai = ia.text;
    const ac = ia.tone === 'red' ? 'text-red-500' : ia.tone === 'amber' ? 'text-amber-500' : ia.tone === 'emerald' ? 'text-teal-500' : 'text-slate-500';

    setAaRes({ tone: ia.tone, grad: aaGrad.toFixed(1), calc: paO2calc.toFixed(1), po2, normal: isNaN(normalAa) ? '—' : normalAa.toFixed(0), ai, ac, fio2pct: (f*100).toFixed(0), fio2dec: f.toFixed(2) });
  };

  // Pola Hitung per bagian: hasil tampil setelah Hitung; sesudahnya ikut berubah otomatis (tanpa hasil basi).
  // SMART-COP & ATS/IDSA = ceklis ketuk → selalu live.
  const curb = useCalcTrigger({ compute: () => calcCurb(), deps: [curbC, ureumMgdl, curbRr, curbSbp, curbDbp, curbAge] });
  const psi = useCalcTrigger({
    compute: () => calcPSI(),
    deps: [psiSex, psiAge, psiNursing, psiNeoplastic, psiLiver, psiChf, psiCva, psiRenal, psiAms, psiRr, psiSbp, psiTemp, psiHr, psiPh, psiBun, psiNa, psiGlucose, psiHct, psiPao2, psiSpo2, psiEffusion],
    required: [{ id: 'psi-age', label: 'Usia', filled: !isNaN(parseFloat(psiAge)) }],
  });
  const aa = useCalcTrigger({
    compute: () => calcAa(),
    deps: [aaFio2Mode, aaFio2Raw, aaPaco2, aaPao2, aaPatm, aaAge],
    required: [
      { id: 'aa-fio2', label: 'FiO₂', filled: aaFio2Raw.trim() !== '' },
      { id: 'aa-paco2', label: 'PaCO₂', filled: !isNaN(parseFloat(aaPaco2)) },
      { id: 'aa-pao2', label: 'PaO₂', filled: !isNaN(parseFloat(aaPao2)) },
    ],
  });
  useEffect(() => { calcSmartCop(); }, [scSbp, scMulti, scAlbumin, scRr, scTachy, scConfusion, scO2, scPh]);

  // Bilah bawah mengikuti bagian yang sedang dilihat (bagian konversi ureum di atas → CURB-65).
  const active = useActiveSection(SECTIONS) ?? 'sec-curb';
  const bar = (() => {
    switch (active) {
      case 'sec-psi':
        return {
          mode: 'button' as const, armed: psi.armed, onCalculate: psi.trigger, label: 'Hitung PSI/PORT', missing: psi.missing, target: 'psi-hasil',
          summary: psi.armed && psiRes ? `PSI ${psiRes.score} · Kelas ${psiRes.riskClass}` : null,
          caption: psi.armed && psiRes ? `${psiRes.disposition} · mortalitas ${psiRes.mortality}` : undefined,
          tone: (psi.armed && psiRes ? psiRes.tone : 'neutral') as CalcTone,
        };
      case 'sec-smartcop':
        return {
          mode: 'live' as const, armed: true, onCalculate: undefined, label: 'Hitung', missing: [], target: 'sc-hasil',
          summary: smartCopRes ? `SMART-COP ${smartCopRes.score} · ${smartCopRes.risk}` : null,
          caption: smartCopRes ? smartCopRes.desc : undefined,
          tone: (smartCopRes ? RISK_TONE[smartCopRes.tone] : 'neutral') as CalcTone,
        };
      case 'sec-ats':
        return {
          mode: 'live' as const, armed: true, onCalculate: undefined, label: 'Hitung', missing: [], target: 'ats-hasil',
          summary: atsResult.isSevere ? 'Severe CAP — ATS/IDSA' : 'Belum memenuhi severe CAP',
          caption: `Mayor ${atsResult.major} · Minor ${atsResult.minor} — ${atsResult.desc}`,
          tone: (atsResult.isSevere ? 'bad' : 'neutral') as CalcTone,
        };
      case 'sec-aa':
        return {
          mode: 'button' as const, armed: aa.armed, onCalculate: aa.trigger, label: 'Hitung A-a Gradient', missing: aa.missing, target: 'aa-hasil',
          summary: aa.armed && aaRes ? `A-a ${aaRes.grad} mmHg` : null,
          caption: aa.armed && aaRes ? aaRes.ai : (aa.armed ? (aaFio2Error || aaInputError || undefined) : undefined),
          tone: (aa.armed && aaRes ? ({ red: 'bad', amber: 'warn', emerald: 'good' } as Record<string, CalcTone>)[aaRes.tone] ?? 'neutral' : 'neutral') as CalcTone,
        };
      default:
        return {
          mode: 'button' as const, armed: curb.armed, onCalculate: curb.trigger, label: 'Hitung CURB-65', missing: curb.missing, target: 'curb-hasil',
          summary: curb.armed && curbRes ? `CURB-65 ${curbRes.score} · ${curbRes.interp}${curbRes.partial ? ' (parsial)' : ''}` : null,
          caption: curb.armed && curbRes ? curbRes.act : undefined,
          tone: (curb.armed && curbRes ? RISK_TONE[curbRes.tone] : 'neutral') as CalcTone,
        };
    }
  })();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      {/* Konversi Ureum */}
      <div className="flex flex-col gap-0 mt-2">
        <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Konversi Ureum ↔ BUN
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">Ureum (mg/dL)</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={ureumMgdl} onChange={e => handleUreumChange(e.target.value, 'mgdl')} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">Ureum (mmol/L)</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={ureumMmol} onChange={e => handleUreumChange(e.target.value, 'mmol')} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">BUN (mg/dL)</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={bunMgdl} onChange={e => handleUreumChange(e.target.value, 'bun')} />
            </div>
          </div>
        </div>
      </div>

      {/* CURB-65 */}
      <div id="sec-curb" className="flex flex-col gap-0 mt-4">
        <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          CURB-65 Score
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex flex-wrap justify-between px-4 py-3 items-center gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 text-left w-32 truncate">C — Confusion</span>
            <select className="flex-1 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all overflow-hidden text-ellipsis" value={curbC} onChange={e => setCurbC(e.target.value)}>
              <option value="0">Tidak (0)</option>
              <option value="1">Ya (1)</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">U — Ureum (&gt;42)</span>
            <div className="flex-1 flex items-center justify-end gap-2 opacity-60">
              <input type="number" disabled className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={ureumMgdl} placeholder="Dari konversi" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">R — Resp. Rate</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={curbRr} onChange={e => setCurbRr(e.target.value)} />
              <span className="text-xs font-semibold text-slate-500 w-8 text-left">/mnt</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">B — Sistolik</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={curbSbp} onChange={e => setCurbSbp(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">B — Diastolik</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={curbDbp} onChange={e => setCurbDbp(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0 truncate">65 — Usia</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={curbAge} onChange={e => setCurbAge(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {curb.armed && curbRes && (
        <div id="curb-hasil" className="scroll-mt-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden p-4 text-center">
            <div className={`text-5xl font-black mb-2 ${curbRes.cls}`}>{curbRes.score}</div>
            <div className={`text-[15px] font-bold mb-1 ${curbRes.cls}`}>{curbRes.interp}</div>
            <div className="text-[13px] text-slate-600 dark:text-slate-400 font-medium mb-4">{curbRes.act}</div>
            <div className="space-y-2 mt-4 text-left">
              {curbRes.rows.map((r:any) => (
                <div key={r.n} className="flex justify-between items-center text-[13px] bg-slate-50 dark:bg-[#2C2C2E] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{r.n.split('—')[0]}</span> <span className="text-slate-500 font-medium mx-1">{r.d}</span>
                  </div>
                  <div className="font-bold text-slate-700 dark:text-slate-300">+{r.p}</div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 italic text-center">
              Lim WS et al. <em>Thorax</em> 2003;58:377–382 · Metlay JP et al. <em>AJRCCM</em> 2019;200:e45–e67
            </p>
            <div className="mt-4">
              <SaveToHistoryButton 
                module="curb65" 
                label={`CURB-65: ${curbRes.score} (${curbRes.interp})`}
                inputs={{ curbC, ureumMgdl, curbRr, curbSbp, curbDbp, curbAge }}
                summary={`CURB-65 Score: ${curbRes.score} — ${curbRes.interp}. ${curbRes.act}`}
                className="w-full bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* PSI/PORT Score */}
      <div id="sec-psi" className="flex flex-col gap-0 mt-6">
        <h2 className="mb-1 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          PSI / PORT Score
        </h2>
        <p className="px-4 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
          20 variabel · Fine MJ et al. NEJM 1997 · Sensitivitas tinggi untuk risiko rendah
        </p>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mb-4">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
             <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Jenis Kelamin</span>
             <div className="flex bg-slate-200 dark:bg-[#1C1C1E] p-1 rounded-lg">
                <button className={`px-4 py-1.5 text-xs font-bold rounded-md ${psiSex === 'm' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`} onClick={() => setPsiSex('m')}>Laki-laki</button>
                <button className={`px-4 py-1.5 text-xs font-bold rounded-md ${psiSex === 'f' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`} onClick={() => setPsiSex('f')}>Perempuan</button>
             </div>
          </div>
          <div className="px-4 py-2 text-[11px] text-slate-500 bg-slate-100/50 dark:bg-slate-800/50 italic text-right">
             Perempuan: skor dasar = usia − 10
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
             <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Usia (Tahun)</span>
             <input id="psi-age" aria-label="Usia (tahun)" type="number" inputMode="decimal" className={`w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]${psi.isMissing('psi-age') ? MISSING_RING : ''}`} value={psiAge} onChange={e => setPsiAge(e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
             <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Nursing home resident</span>
             <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiNursing ? '1' : '0'} onChange={e => setPsiNursing(e.target.value === '1')}>
                <option value="0">Tidak</option><option value="1">Ya</option>
             </select>
          </div>
        </div>

        <h3 className="px-4 text-[12px] font-bold text-slate-600 dark:text-slate-400 mt-2 mb-1">Komorbiditas</h3>
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mb-4">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Neoplastic disease <span className="text-slate-400 text-[11px] ml-1">+30</span></span>
            <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiNeoplastic ? '1' : '0'} onChange={e => setPsiNeoplastic(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Liver disease <span className="text-slate-400 text-[11px] ml-1">+20</span></span>
            <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiLiver ? '1' : '0'} onChange={e => setPsiLiver(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">CHF <span className="text-slate-400 text-[11px] ml-1">+10</span></span>
            <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiChf ? '1' : '0'} onChange={e => setPsiChf(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Cerebrovascular disease <span className="text-slate-400 text-[11px] ml-1">+10</span></span>
            <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiCva ? '1' : '0'} onChange={e => setPsiCva(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Renal disease <span className="text-slate-400 text-[11px] ml-1">+10</span></span>
            <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiRenal ? '1' : '0'} onChange={e => setPsiRenal(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
          </div>
        </div>

        <h3 className="px-4 text-[12px] font-bold text-slate-600 dark:text-slate-400 mt-2 mb-1">Pemeriksaan Fisik</h3>
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mb-4">
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Altered mental status <span className="text-slate-400 text-[11px] ml-1">+20</span></span>
            <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiAms ? '1' : '0'} onChange={e => setPsiAms(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Resp. Rate (/mnt)</span>
              <input type="number" className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiRr} onChange={e => setPsiRr(e.target.value)} />
            </div>
            <div className={`text-[10px] font-bold text-right ${parseFloat(psiRr)>=30 ? 'text-red-500' : 'text-slate-400'}`}>≥30: +20</div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">TD Sistolik (mmHg)</span>
              <input type="number" className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiSbp} onChange={e => setPsiSbp(e.target.value)} />
            </div>
            <div className={`text-[10px] font-bold text-right ${parseFloat(psiSbp)<90 ? 'text-red-500' : 'text-slate-400'}`}>&lt;90: +20</div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Suhu (°C)</span>
              <input type="number" className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiTemp} onChange={e => setPsiTemp(e.target.value)} />
            </div>
            <div className={`text-[10px] font-bold text-right ${(parseFloat(psiTemp)<35 || parseFloat(psiTemp)>=40) ? 'text-red-500' : 'text-slate-400'}`}>&lt;35 atau ≥40: +15</div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Heart Rate (/mnt)</span>
              <input type="number" className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiHr} onChange={e => setPsiHr(e.target.value)} />
            </div>
            <div className={`text-[10px] font-bold text-right ${parseFloat(psiHr)>=125 ? 'text-red-500' : 'text-slate-400'}`}>≥125: +10</div>
          </div>
        </div>

        <h3 className="px-4 text-[12px] font-bold text-slate-600 dark:text-slate-400 mt-2 mb-1">Lab & Radiologi</h3>
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mb-4">
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">pH Arteri</span>
              <input type="number" className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiPh} onChange={e => setPsiPh(e.target.value)} />
            </div>
            <div className={`text-[10px] font-bold text-right ${parseFloat(psiPh)<7.35 ? 'text-red-500' : 'text-slate-400'}`}>&lt;7.35: +30</div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">BUN (mg/dL)</span>
              <input type="number" className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiBun} onChange={e => setPsiBun(e.target.value)} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 italic">BUN = Ureum × 0.47</span>
              <span className={`text-[10px] font-bold ${parseFloat(psiBun)>=30 ? 'text-red-500' : 'text-slate-400'}`}>≥30: +20</span>
            </div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Na Serum (mEq/L)</span>
              <input type="number" className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiNa} onChange={e => setPsiNa(e.target.value)} />
            </div>
            <div className={`text-[10px] font-bold text-right ${parseFloat(psiNa)<130 ? 'text-red-500' : 'text-slate-400'}`}>&lt;130: +20</div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Glukosa (mg/dL)</span>
              <input type="number" className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiGlucose} onChange={e => setPsiGlucose(e.target.value)} />
            </div>
            <div className={`text-[10px] font-bold text-right ${parseFloat(psiGlucose)>=250 ? 'text-red-500' : 'text-slate-400'}`}>≥250: +10</div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Hematokrit (%)</span>
              <input type="number" className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiHct} onChange={e => setPsiHct(e.target.value)} />
            </div>
            <div className={`text-[10px] font-bold text-right ${parseFloat(psiHct)<30 ? 'text-red-500' : 'text-slate-400'}`}>&lt;30%: +10</div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">PaO₂ (mmHg) / SpO₂ (%)</span>
              <div className="flex gap-2">
                <input type="number" className="w-16 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" placeholder="PaO2" value={psiPao2} onChange={e => setPsiPao2(e.target.value)} />
                <input type="number" className="w-16 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" placeholder="SpO2" value={psiSpo2} onChange={e => setPsiSpo2(e.target.value)} />
              </div>
            </div>
            <div className={`text-[10px] font-bold text-right ${((!isNaN(parseFloat(psiPao2)) && parseFloat(psiPao2)<60) || (!isNaN(parseFloat(psiSpo2)) && parseFloat(psiSpo2)<90)) ? 'text-red-500' : 'text-slate-400'}`}>PaO₂ &lt;60 atau SpO₂ &lt;90: +10</div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Efusi Pleura (CXR) <span className="text-slate-400 text-[11px] ml-1">+10</span></span>
            <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={psiEffusion ? '1' : '0'} onChange={e => setPsiEffusion(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
          </div>
        </div>
        {psi.armed && psiError && <p className="px-4 text-sm text-destructive mt-2 text-center">{psiError}</p>}
      </div>

      {psi.armed && psiRes && (
        <div id="psi-hasil" className="scroll-mt-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden p-4 text-center">
            {psiRes.isClassI && (
              <div className="mb-4 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 p-3 rounded-xl border border-green-200 dark:border-green-800 text-[13px] font-bold">
                Pasien memenuhi kriteria Class I (usia &lt;50, tanpa komorbid, tanpa abnormalitas tanda vital).
              </div>
            )}
            <div className={`text-[12px] font-bold uppercase tracking-wider mb-1 ${psiRes.cls}`}>{psiRes.riskClass}</div>
            <div className={`text-5xl font-black mb-2 ${psiRes.cls}`}>{psiRes.score}</div>
            <div className="text-[13px] text-slate-700 dark:text-slate-300 mb-1 font-medium">Mortalitas: <span className="font-bold">{psiRes.mortality}</span></div>
            <div className={`text-[14px] font-bold mb-4 ${psiRes.dispositionCls}`}>{psiRes.disposition}</div>
            <Accordion title="Lihat Rincian Skor">
               <div className="space-y-1 mt-2 text-left">
                 {psiRes.rows.map((r:any, idx:number) => (
                   <div key={idx} className="flex justify-between items-center text-[12px] bg-slate-50 dark:bg-[#2C2C2E] p-2 rounded border border-slate-100 dark:border-slate-800">
                     <div>
                       <span className="font-bold text-slate-800 dark:text-slate-200 block">{r.name}</span>
                       <span className="text-slate-500">{r.detail}</span>
                     </div>
                     <div className="font-bold text-slate-700 dark:text-slate-300">+{r.pts}</div>
                   </div>
                 ))}
               </div>
            </Accordion>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 italic text-center">
              Fine MJ et al. <em>N Engl J Med</em> 1997;336:243–250
            </p>
            <div className="mt-4">
              <SaveToHistoryButton 
                module="psi_port" 
                label={`PSI/PORT: ${psiRes.score} (${psiRes.riskClass})`}
                inputs={{ psiSex, psiAge, psiNursing, psiNeoplastic, psiLiver, psiChf, psiCva, psiRenal, psiAms, psiRr, psiSbp, psiTemp, psiHr, psiPh, psiBun, psiNa, psiGlucose, psiHct, psiPao2, psiSpo2, psiEffusion }}
                summary={`PSI/PORT Score: ${psiRes.score} (${psiRes.riskClass}). Mortalitas: ${psiRes.mortality}. Disposisi: ${psiRes.disposition}`}
                className="w-full bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* SMART-COP Score */}
      <div id="sec-smartcop" className="flex flex-col gap-0 mt-6">
        <h2 className="mb-1 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          SMART-COP Score
        </h2>
        <p className="px-4 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
          Prediksi kebutuhan dukungan ventilator/vasopresor pada CAP
        </p>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mb-4">
          <div className="flex flex-col px-4 py-3 gap-2">
             <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">S: Systolic BP &lt; 90 mmHg <span className="text-slate-400 text-[11px] ml-1">+2</span></span>
                <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={scSbp ? '1' : '0'} onChange={e => setScSbp(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
             </div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">M: Multilobar infiltrates <span className="text-slate-400 text-[11px] ml-1">+1</span></span>
                <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={scMulti ? '1' : '0'} onChange={e => setScMulti(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
             </div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">A: Albumin &lt; 3.5 g/dL <span className="text-slate-400 text-[11px] ml-1">+1</span></span>
                <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={scAlbumin ? '1' : '0'} onChange={e => setScAlbumin(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
             </div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">R: Resp rate (usia adjust) <span className="text-slate-400 text-[11px] ml-1">+1</span></span>
                <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={scRr ? '1' : '0'} onChange={e => setScRr(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
             </div>
             <div className="text-[11px] text-slate-500 text-right italic">&le;50 thn: &ge;25. &gt;50 thn: &ge;30</div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">T: Tachycardia &ge; 125 bpm <span className="text-slate-400 text-[11px] ml-1">+1</span></span>
                <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={scTachy ? '1' : '0'} onChange={e => setScTachy(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
             </div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">C: Confusion <span className="text-slate-400 text-[11px] ml-1">+1</span></span>
                <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={scConfusion ? '1' : '0'} onChange={e => setScConfusion(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
             </div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">O: Oksigen rendah (usia adj) <span className="text-slate-400 text-[11px] ml-1">+2</span></span>
                <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={scO2 ? '1' : '0'} onChange={e => setScO2(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
             </div>
             <div className="text-[11px] text-slate-500 text-right italic">&le;50 thn: PaO₂ &lt;70, SpO₂ &le;93%, P/F &lt;333<br/>&gt;50 thn: PaO₂ &lt;60, SpO₂ &le;90%, P/F &lt;250</div>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">P: pH &lt; 7.35 <span className="text-slate-400 text-[11px] ml-1">+2</span></span>
                <select className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[14px]" value={scPh ? '1' : '0'} onChange={e => setScPh(e.target.value === '1')}><option value="0">Tidak</option><option value="1">Ya</option></select>
             </div>
          </div>
        </div>
      </div>

      {smartCopRes && (
        <div id="sc-hasil" className="scroll-mt-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden p-4 text-center">
            <div className={`text-[12px] font-bold uppercase tracking-wider mb-1 ${smartCopRes.cls}`}>{smartCopRes.risk}</div>
            <div className={`text-5xl font-black mb-2 ${smartCopRes.cls}`}>{smartCopRes.score}</div>
            <div className={`text-[14px] font-bold mb-4 text-slate-800 dark:text-slate-200`}>{smartCopRes.desc}</div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 italic text-center">
              Charles PG et al. <em>Clin Infect Dis</em> 2008;47:375–384
            </p>
            <div className="mt-4">
              <SaveToHistoryButton 
                module="smart_cop" 
                label={`SMART-COP: ${smartCopRes.score} (${smartCopRes.risk})`}
                inputs={{ scAge, scSbp, scMulti, scAlbumin, scRr, scTachy, scConfusion, scO2, scPh }}
                summary={`SMART-COP Score: ${smartCopRes.score} — ${smartCopRes.risk}. ${smartCopRes.desc}`}
                className="w-full bg-blue-600 hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* ATS/IDSA */}
      <div id="sec-ats" className="flex flex-col gap-0 mt-6">
        <h2 className="mb-1 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          ATS/IDSA Severe CAP
        </h2>
        <p className="px-4 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
          Kriteria mayor dan minor untuk masuk ICU pada CAP
        </p>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 font-bold text-[12px] uppercase">Kriteria Mayor</div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsInvasive} onChange={e => setAtsInvasive(e.target.checked)}/>
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Ventilasi mekanik invasif</span>
            </label>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsShock} onChange={e => setAtsShock(e.target.checked)}/>
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Syok septik butuh vasopresor</span>
            </label>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold text-[12px] uppercase mt-2">Kriteria Minor</div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <label className="flex items-start gap-3">
               <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsRr} onChange={e => setAtsRr(e.target.checked)}/>
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Resp. Rate &ge; 30/mnt</span>
             </label>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <label className="flex items-start gap-3">
               <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsPf} onChange={e => setAtsPf(e.target.checked)}/>
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Rasio PaO₂/FiO₂ &le; 250</span>
             </label>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <label className="flex items-start gap-3">
               <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsMulti} onChange={e => setAtsMulti(e.target.checked)}/>
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Infiltrat multilobar</span>
             </label>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <label className="flex items-start gap-3">
               <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsConfusion} onChange={e => setAtsConfusion(e.target.checked)}/>
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Confusion / disorientasi</span>
             </label>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <label className="flex items-start gap-3">
               <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsUremia} onChange={e => setAtsUremia(e.target.checked)}/>
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Uremia (BUN &ge; 20 mg/dL)</span>
             </label>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <label className="flex items-start gap-3">
               <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsLeuko} onChange={e => setAtsLeuko(e.target.checked)}/>
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Leukopenia (WBC &lt; 4000)</span>
             </label>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <label className="flex items-start gap-3">
               <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsThrombo} onChange={e => setAtsThrombo(e.target.checked)}/>
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Trombositopenia (&lt; 100,000)</span>
             </label>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <label className="flex items-start gap-3">
               <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsHypoT} onChange={e => setAtsHypoT(e.target.checked)}/>
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Hipotermia (Suhu &lt; 36°C)</span>
             </label>
          </div>
          <div className="flex flex-col px-4 py-3 gap-2">
             <label className="flex items-start gap-3">
               <input type="checkbox" className="mt-1 form-checkbox h-4 w-4 text-blue-600 border-slate-300 rounded" checked={atsHypoBP} onChange={e => setAtsHypoBP(e.target.checked)}/>
               <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Hipotensi (butuh resusitasi cairan agresif)</span>
             </label>
          </div>
        </div>

        <div id="ats-hasil" className="scroll-mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className={`border rounded-xl shadow-sm p-4 text-center ${atsResult.isSevere ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-[#1C1C1E] border-slate-200 dark:border-slate-800'}`}>
            <div className={`text-[12px] font-bold uppercase tracking-wider mb-2 ${atsResult.isSevere ? 'text-red-700 dark:text-red-400' : 'text-slate-500'}`}>Kesimpulan ATS/IDSA</div>
            <div className={`text-[15px] font-bold mb-1 ${atsResult.isSevere ? 'text-red-800 dark:text-red-300' : 'text-slate-800 dark:text-slate-200'}`}>{atsResult.desc}</div>
            <div className={`text-[12px] font-medium ${atsResult.isSevere ? 'text-red-600 dark:text-red-400' : 'text-slate-500'}`}>Mayor: {atsResult.major} | Minor: {atsResult.minor}</div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 italic text-center">
              Metlay JP et al. <em>Am J Respir Crit Care Med</em> 2019;200:e45–e67
            </p>
            <div className="mt-4">
              <SaveToHistoryButton 
                module="ats_idsa" 
                label={atsResult.isSevere ? 'Severe CAP (ICU)' : 'Non-Severe CAP'}
                inputs={{ atsInvasive, atsShock, atsRr, atsPf, atsMulti, atsConfusion, atsUremia, atsLeuko, atsThrombo, atsHypoT, atsHypoBP }}
                summary={`Kriteria ATS/IDSA: ${atsResult.isSevere ? 'Severe CAP' : 'Non-Severe CAP'}. ${atsResult.desc} (Mayor: ${atsResult.major}, Minor: ${atsResult.minor})`}
                className={`w-full ${atsResult.isSevere ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-600 hover:bg-slate-700'}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* A-a Gradient */}
      <div id="sec-aa" className="flex flex-col gap-0 mt-6">
        <h2 className="mb-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          A-a Gradient — Analisis Hipoksemia
        </h2>

        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">FiO₂ {getFio2Hint()}</span>
              <div className="flex-1 flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 bg-slate-200 dark:bg-[#1C1C1E] p-1 rounded-lg self-end mb-1">
                  <button className={`px-2 py-1 text-[10px] font-bold rounded-md ${aaFio2Mode === 'decimal' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`} onClick={() => setAaFio2Mode('decimal')}>Desimal</button>
                  <button className={`px-2 py-1 text-[10px] font-bold rounded-md ${aaFio2Mode === 'percent' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'}`} onClick={() => setAaFio2Mode('percent')}>Persen</button>
                </div>
                <input id="aa-fio2" aria-label="FiO₂" type="number" inputMode="decimal" step={aaFio2Mode === 'decimal' ? '0.01' : '1'} className={`${aa.isMissing('aa-fio2') ? 'ring-2 ring-[var(--sys-red)] ' : ''}w-32 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold transition-all text-[14px] ${aaFio2Error ? 'text-red-500 focus:ring-red-500/50' : 'text-slate-900 dark:text-white focus:ring-blue-500/50'}`} value={aaFio2Raw} onChange={e=>{setAaFio2Raw(e.target.value); setAaFio2Error('');}} placeholder={aaFio2Mode==='percent'?'21':'0.21'}/>
              </div>
            </div>
            {aaFio2Error && <div className="text-[10px] font-bold text-red-500 text-right">{aaFio2Error}</div>}
            {aaFio2Raw && !aaFio2Error && <div className="text-[10px] text-slate-400 text-right italic">{getFio2Decimal()}</div>}
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">PaCO₂ (mmHg)</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className={`w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all${aa.isMissing('aa-paco2') ? MISSING_RING : ''}`} value={aaPaco2} onChange={e=>setAaPaco2(e.target.value)} id="aa-paco2" aria-label="PaCO₂ (mmHg)" inputMode="decimal"/>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">PaO₂ (mmHg)</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className={`w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all${aa.isMissing('aa-pao2') ? MISSING_RING : ''}`} value={aaPao2} onChange={e=>setAaPao2(e.target.value)} id="aa-pao2" aria-label="PaO₂ (mmHg)" inputMode="decimal"/>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Usia (Tahun)</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={aaAge} onChange={e=>setAaAge(e.target.value)}/>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-x-4 gap-y-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">P. atm (mmHg)</span>
            <div className="flex-1 min-w-[8rem] flex items-center justify-end gap-2">
              <input type="number" className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" value={aaPatm} onChange={e=>setAaPatm(e.target.value)} placeholder="760"/>
            </div>
          </div>
        </div>
      </div>

      {aa.armed && aaInputError && <p className="text-sm text-destructive mt-2 text-center">{aaInputError}</p>}

      {aa.armed && aaRes && (
        <div id="aa-hasil" className="scroll-mt-4 mt-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-5 text-center">
             <div className={`text-[12px] font-bold uppercase tracking-wider mb-1 ${aaRes.ac}`}>A-a Gradient</div>
             <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">{aaRes.grad} <span className="text-[15px] font-semibold text-slate-500">mmHg</span></div>
             <div className="text-[13px] text-slate-700 dark:text-slate-300 mb-5 font-medium">{aaRes.normal !== '—' ? `Normal udara ruang ≤ ${aaRes.normal} mmHg (usia/4 + 4)` : 'Isi usia untuk perkiraan normal (usia/4 + 4)'}</div>

             <div className="grid grid-cols-2 gap-3 mb-5">
               <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">PAO₂ (Alveolar)</div>
                  <div className="text-[17px] font-black text-slate-800 dark:text-slate-200">{aaRes.calc}</div>
               </div>
               <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">PaO₂ (Arteri)</div>
                  <div className="text-[17px] font-black text-slate-800 dark:text-slate-200">{aaPao2}</div>
               </div>
             </div>

             <div className={`text-[14px] font-bold ${aaRes.ac} p-3 rounded-xl border border-current bg-current/5`}>
               {aaRes.ai}
             </div>
             
             <div className="mt-4 text-left">
               <CalcSteps
                 tone="blue"
                 steps={[
                   {
                     label: 'Langkah 1 — Tekanan O₂ alveolar (PAO₂):',
                     formula: `PAO₂ = FiO₂ × (Patm − 47) − PaCO₂/0.8\n= ${aaRes.fio2dec} × (${aaPatm} − 47) − ${aaPaco2}/0.8 = ${aaRes.calc} mmHg`,
                     note: '47 mmHg = tekanan uap air; 0.8 = respiratory quotient. Persamaan gas alveolar.',
                   },
                   {
                     label: 'Langkah 2 — Gradien A-a:',
                     formula: `A-a = PAO₂ − PaO₂ = ${aaRes.calc} − ${aaRes.po2} = ${aaRes.grad} mmHg`,
                   },
                   {
                     label: 'Langkah 3 — Bandingkan dengan normal sesuai usia:',
                     formula: aaAge ? `Normal udara ruang ≈ (usia/4) + 4 = ${aaRes.normal} mmHg\nHasil: ${aaRes.grad} vs ${aaRes.normal}` : `Isi usia untuk perkiraan normal (usia/4 + 4)\nHasil: ${aaRes.grad} mmHg`,
                     note: aaRes.ai,
                   },
                 ]}
                 footer="A-a normal + hipoksemia → hipoventilasi atau FiO₂ rendah. A-a melebar → V/Q mismatch, shunt, atau gangguan difusi."
               />
             </div>

             <div className="mt-4">
               <SaveToHistoryButton
                 module="aa_gradient"
                 label={`A-a Grad: ${aaRes.grad} mmHg`}
                 inputs={{ aaFio2Mode, aaFio2Raw, aaPaco2, aaPao2, aaPatm, aaAge }}
                 summary={`A-a Gradient: ${aaRes.grad} mmHg (Normal: ~${aaRes.normal} mmHg). ${aaRes.ai.split('→')[0]}`}
                 className="w-full bg-blue-600 hover:bg-blue-700"
               />
             </div>
          </div>
        </div>
      )}

      <Accordion title="📖 Teori & Referensi: Pneumonia & A-a Gradient">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">CURB-65 & PSI/PORT:</strong> Skoring utama untuk menentukan setting perawatan Community-Acquired Pneumonia (CAP) apakah Rawat Jalan, Ruang Rawat Biasa, atau ICU. PSI memiliki sensitivitas lebih tinggi untuk mortalitas rendah, sedangkan CURB-65 lebih sederhana untuk digunakan di IGD.</li>
          <li><strong className="text-foreground">SMART-COP:</strong> Prediktor klinis yang didesain secara spesifik memprediksi kebutuhan dukungan inotropik (vasopressor) atau dukungan ventilator intervensi (CPAP/Intubasi) pada kasus pneumonia komunitas.</li>
          <li><strong className="text-foreground">ATS/IDSA Severe CAP:</strong> Kriteria mayor dan minor dari panduan ATS/IDSA 2019 untuk mengidentifikasi pasien CAP yang memerlukan perawatan ICU. 1 Mayor atau 3 Minor mengindikasikan pneumonia berat.</li>
          <li><strong className="text-foreground">Alveolar-arterial (A-a) Gradient:</strong> Digunakan membedakan penyebab hipoksemia. A-a normal (Hipoventilasi, Ketinggian, FiO2 rendah). A-a meningkat (V/Q mismatch, R-L shunt, defek difusi seperti ILD). Normal A-a = (Usia / 4) + 4. Meningkat berkisar 10-20 mmHg tiap penambahan usia.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Lim WS et al. (2003) Guidelines CAP; Fine MJ et al. (1997) NEJM PSI; Charles PG et al. (2008) Clin Infect Dis SMART-COP; Metlay JP et al. (2019) AJRCCM ATS/IDSA Guidelines.
        </div>
      </Accordion>
      <AbbrLegend
        terms={[
          'CURB-65', 'PSI', 'PORT', 'SMART-COP', 'IRVS', 'CAP', 'ATS', 'IDSA', 'A-a', 'PAO2', 'PaO2', 'PaCO2',
          'FiO2', 'SpO2', 'P/F', 'Patm', 'JK', 'RR', 'TDS', 'TDD-diastolik', 'SBP', 'BP', 'HR', 'GDS', 'Ht', 'BUN',
          'CHF', 'CXR', 'WBC', 'ICU', 'IGD', 'CPAP', 'ILD', 'V/Q',
        ]}
      />
      <CalcActionBar
        mode={bar.mode}
        armed={bar.armed}
        onCalculate={bar.onCalculate}
        label={bar.label}
        summary={bar.summary}
        summaryTone={bar.tone}
        caption={bar.caption}
        missing={bar.missing}
        resultTargetId={bar.target}
      />
    </div>
  );
}
