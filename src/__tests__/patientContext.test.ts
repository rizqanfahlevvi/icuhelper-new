import { describe, it, expect } from 'vitest';
import {
  LEGACY_OWNER,
  cleanClinicalRecord,
  cleanTimestamps,
  clinicalGenderToPatient,
  demographicUpdatesFromClinical,
  demographicsToClinical,
  formatDataAge,
  normalizeLegacyClinicalRecord,
  patientGenderToClinical,
  resolveStartupAction,
  stampChanges,
  toClinicalData,
} from '../utils/patientContext';
import { CLINICAL_KEYS, CLINICAL_VARIABLES, EMPTY_CLINICAL_DATA } from '../utils/clinicalVariables';
import {
  albuminGdlFromMgdl,
  bunFromUreum,
  creatinineMgFromUmol,
  creatinineUmolFromMg,
  kpaFromMmHg,
  mmHgFromKpa,
  ureumFromBun,
} from '../utils/clinicalUnits';

describe('registri variabel klinis', () => {
  it('setiap kunci punya label & grup; tidak ada lagi kunci gds terpisah', () => {
    for (const k of CLINICAL_KEYS) {
      expect(CLINICAL_VARIABLES[k].label.length).toBeGreaterThan(0);
      expect(EMPTY_CLINICAL_DATA[k]).toBe('');
    }
    expect(CLINICAL_KEYS).not.toContain('gds');
    expect(CLINICAL_KEYS).toEqual(expect.arrayContaining(['laktat', 'spo2', 'peep', 'creatinineBaseline', 'neutrofilPct', 'limfositPct']));
  });
});

describe('pemetaan jenis kelamin', () => {
  it('L/P ↔ m/f dua arah', () => {
    expect(patientGenderToClinical('L')).toBe('m');
    expect(patientGenderToClinical('P')).toBe('f');
    expect(patientGenderToClinical('')).toBe('');
    expect(clinicalGenderToPatient('m')).toBe('L');
    expect(clinicalGenderToPatient('f')).toBe('P');
    expect(clinicalGenderToPatient('')).toBe('');
  });
});

describe('normalisasi snapshot lama', () => {
  it('gds digabung ke glukosa bila glukosa kosong, kunci asing & kosong dibuang', () => {
    expect(normalizeLegacyClinicalRecord({ gds: '250', na: '130', foo: 'x', k: '' })).toEqual({ glukosa: '250', na: '130' });
  });
  it('glukosa yang sudah ada tidak ditimpa gds', () => {
    expect(normalizeLegacyClinicalRecord({ gds: '250', glukosa: '180' })).toEqual({ glukosa: '180' });
  });
  it('toClinicalData memvalidasi gender', () => {
    expect(toClinicalData({ gender: 'L', na: '140' })).toEqual({ gender: 'm', na: '140' });
    expect(toClinicalData({ gender: 'zzz' })).toEqual({});
  });
  it('cleanClinicalRecord & cleanTimestamps hanya menyimpan kunci berisi', () => {
    const clean = cleanClinicalRecord({ ...EMPTY_CLINICAL_DATA, na: '128', k: '' });
    expect(clean).toEqual({ na: '128' });
    expect(cleanTimestamps({ na: 1000, k: 2000 }, clean)).toEqual({ na: 1000 });
  });
});

describe('cap waktu per variabel', () => {
  it('hanya kunci yang berubah yang diberi waktu baru; dikosongkan → cap dihapus', () => {
    const prev = { ...EMPTY_CLINICAL_DATA, na: '130', k: '3.5' };
    const stamps = stampChanges(prev, { na: '128', k: '3.5', hb: '' }, { na: 1, k: 2 }, 99);
    expect(stamps).toEqual({ na: 99, k: 2 });
    expect(stampChanges(prev, { k: '' }, { na: 1, k: 2 }, 99)).toEqual({ na: 1 });
  });

  it('formatDataAge tanpa ambang kedaluwarsa', () => {
    const now = Date.UTC(2026, 10, 8, 12, 0, 0);
    expect(formatDataAge(undefined, now)).toBe('');
    expect(formatDataAge(now - 30_000, now)).toBe('baru saja');
    expect(formatDataAge(now - 5 * 60_000, now)).toBe('5 mnt lalu');
    expect(formatDataAge(now - 3 * 3_600_000, now)).toBe('3 jam lalu');
    expect(formatDataAge(now - 2 * 86_400_000, now)).toBe('2 hari lalu');
    expect(formatDataAge(now + 10_000, now)).toBe('baru saja'); // jam perangkat maju
  });
});

describe('demografi satu sumber', () => {
  const patient = { weightKg: '60', heightCm: '165', ageYears: '45', gender: 'L' as const };

  it('data pasien → clinical store (termasuk nilai kosong)', () => {
    expect(demographicsToClinical(patient)).toEqual({ weight: '60', height: '165', age: '45', gender: 'm' });
    expect(demographicsToClinical({ ...patient, weightKg: '' }).weight).toBe('');
  });

  it('clinical → data pasien: hanya nilai non-kosong yang berbeda', () => {
    const data = { ...EMPTY_CLINICAL_DATA, weight: '62', height: '165', age: '', gender: 'f' as const };
    expect(demographicUpdatesFromClinical(data, patient)).toEqual({ weightKg: '62', gender: 'P' });
    // Mengosongkan BB di kalkulator tidak menghapus BB pasien
    expect(demographicUpdatesFromClinical({ ...EMPTY_CLINICAL_DATA }, patient)).toBeNull();
  });

  it('usia dari kalkulator menyetel satuan tahun secara konsisten', () => {
    const u = demographicUpdatesFromClinical({ ...EMPTY_CLINICAL_DATA, age: '70' }, patient);
    expect(u).toEqual({ ageUnit: 'tahun', ageInput: '70', ageYears: '70', ageMonths: '', agePrecise: '70 tahun' });
  });
});

describe('rekonsiliasi saat aplikasi dibuka', () => {
  it.each([
    // [ownerId, activePatientId, activeExists, expected]
    ['p1', 'p1', true, 'keep'],
    ['p2', 'p1', true, 'load'],          // data kerja milik pasien lain → muat snapshot p1
    [null, 'p1', true, 'load'],          // data sesi anonim tidak boleh menempel ke p1
    [LEGACY_OWNER, 'p1', true, 'load'],  // versi lama (bisa bocor) → percayai snapshot
    ['p1', 'p1', false, 'clear'],        // pasien aktif sudah terhapus
    ['p1', null, false, 'clear'],        // pasien ditutup tapi data kerja belum dikosongkan
    [null, null, false, 'keepSession'],
    [LEGACY_OWNER, null, false, 'keepSession'],
  ] as const)('owner=%s aktif=%s ada=%s → %s', (owner, active, exists, expected) => {
    expect(resolveStartupAction(owner, active, exists)).toBe(expected);
  });
});

describe('konversi satuan (hitung manual)', () => {
  it('kreatinin: 110 µmol/L ÷ 88,4 = 1,24 mg/dL; 1,25 mg/dL × 88,4 = 111 µmol/L', () => {
    expect(creatinineMgFromUmol('110')).toBe('1.24');
    expect(creatinineUmolFromMg('1.25')).toBe('111');
  });
  it('urea: BUN 14 × 60/28 = ureum 30; ureum 30 × 28/60 = BUN 14', () => {
    expect(ureumFromBun('14')).toBe('30');
    expect(bunFromUreum('30')).toBe('14');
  });
  it('tekanan gas: 5,33 kPa × 7,5006 = 40 mmHg; 40 mmHg ÷ 7,5006 = 5,33 kPa', () => {
    expect(mmHgFromKpa('5.33')).toBe('40');
    expect(kpaFromMmHg('40')).toBe('5.33');
  });
  it('albumin: 3500 mg/dL = 3,5 g/dL', () => {
    expect(albuminGdlFromMgdl('3500')).toBe('3.5');
  });
  it('input kosong / bukan angka → kosong (tidak ditebak)', () => {
    expect(creatinineMgFromUmol('')).toBe('');
    expect(ureumFromBun('abc')).toBe('');
  });
});
