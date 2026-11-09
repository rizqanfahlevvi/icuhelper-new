import type { AbbrKey } from '../../utils/abbreviations';

/**
 * Kandidat singkatan yang muncul di data cairan (`data.ts`). Legenda di daftar & modal
 * hanya menampilkan yang benar-benar tertulis pada item yang tampil (lihat `abbrInText`).
 * Homonim sudah dipilih sesuai konteks data: SBP = peritonitis bakterial spontan,
 * HE = ensefalopati hepatik, AA = asam amino.
 */
export const FLUID_ABBR: readonly AbbrKey[] = [
  // umum & tanda vital
  'ICU', 'IGD', 'RS', 'IV', 'IM', 'SC', 'PO', 'BB', 'MAP', 'RR', 'GCS', 'EKG', 'RCT', 'NE',
  // cairan & elektrolit
  'NS', 'RL', 'RA-ringer', 'MAKE30', 'D5', 'D5W', 'D10', 'D10W', 'D20', 'D20W', 'D40', 'D50', 'KCl', 'HES', 'HTS', 'HCO3', 'BE', 'AGD',
  'GIR', 'GDS', 'GD', 'ODS', 'SIADH', 'DKA', 'HHS', 'TdP', 'TCA', 'MW',
  // ginjal, hati & neuro
  'AKI', 'GFR', 'BUN', 'CRRT', 'RRT', 'HRS', 'SHR', 'SBP-peritonitis', 'HE-ensefalopati', 'LVP', 'LFT', 'ALT', 'AST',
  'TBI', 'TIK', 'ICP', 'CPP', 'ARDS',
  // nutrisi
  'TPN', 'PN', 'BCAA', 'AA-amino', 'MCT', 'LCT', 'TG', 'EPA', 'DHA', 'GIT',
  // akses vena
  'CVC', 'PICC', 'UAC',
  // organisasi, regulator & panduan
  'SSC', 'NICE', 'CG', 'NG-NICE', 'ASPEN', 'ESPEN', 'SCCM', 'ESPGHAN', 'ESPR', 'EASL', 'AHA', 'ACLS', 'PALS', 'EMA', 'FDA',
  'BPOM', 'SmPC',
];
