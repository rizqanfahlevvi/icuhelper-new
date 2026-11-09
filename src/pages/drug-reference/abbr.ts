import type { AbbrKey } from '../../utils/abbreviations';

/**
 * Kandidat singkatan yang muncul di database obat (`drugDb*.ts`, `data.ts`, `interactionUtils.ts`).
 * Legenda di modal obat & pemeriksa interaksi hanya menampilkan yang benar-benar tertulis
 * pada teks yang tampil (lihat `abbrInText`). Homonim dipilih sesuai konteks data:
 * VT = takikardia ventrikel, HRS = Heart Rhythm Society, MP = metilprednisolon,
 * PF = peak flow; SC muncul sebagai subkutan maupun sectio caesarea.
 * `NICE` sengaja tidak dimasukkan (hanya muncul sebagai nama uji NICE-SUGAR).
 */
export const DRUG_ABBR: readonly AbbrKey[] = [
  // umum, rute & layanan
  'ICU', 'IGD', 'UGD', 'IBS-bedah', 'RS', 'DPJP', 'IV', 'IM', 'SC', 'SC-sesar', 'PO', 'IO', 'PRN', 'NGT', 'OGT', 'BB', 'WFI',
  'PVC-plastik', 'CVC', 'CVP', 'TDM', 'MIC', 'AUC-farmako', 'COVID-19', 'TM', 'ASI', 'BAB', 'BPJS', 'PK/PD',
  // hemodinamik & jantung
  'MAP', 'TD', 'SBP', 'BP', 'HR', 'RR', 'CO', 'CI', 'SVR', 'PVR', 'ScvO2', 'SpO2', 'NE', 'EKG', 'QTc', 'TdP', 'AF',
  'SVT', 'VT-aritmia', 'VF', 'pVT', 'PEA', 'AV', 'SA-nodus', 'SR', 'RVR', 'LBBB', 'RBBB', 'LV', 'RV-ventrikel', 'EF',
  'LCOS', 'HF', 'CHF', 'NYHA', 'ACS', 'STEMI', 'NSTEMI', 'CABG', 'DAPT', 'ECMO', 'IABP', 'LVAD', 'PA-kateter', 'PE',
  'PTX', 'DVT', 'VTE', 'ACLS',
  // farmakologi
  'ACEi', 'ARB', 'CCB', 'PDE3', 'NMDA', 'GABA', 'COX', 'CYP', 'COMT', 'MAO', 'MAOI', 'SSRI', 'NSAID', 'PPI', 'SUP', 'LMWH',
  'UFH', 'HIT', 'AT-III', 'INR', 'PCC', 'TXA', 'SNP', 'NAC', 'LOLA', 'SBECD', 'MC', 'MP-metilprednisolon', 'KCl', 'NS',
  'RL', 'D5W', 'D10W', 'D50W', 'NMB', 'NDNMB', 'NMJ', 'CIS', 'TOF', 'RSI', 'TIVA', 'CTZ', 'HPA', 'CMRO2', 'ACE', 'H2RA',
  'M6G', 'PT', 'BIS', 'RVOTO',
  // sedasi & neuro
  'RASS', 'CPOT', 'NRS', 'CAM-ICU', 'SAT', 'PADIS', 'PRIS', 'ICUAW', 'CIPNM', 'EPS', 'NMS', 'EEG', 'RSE', 'GCS', 'NIHSS',
  'CIWA', 'TIK', 'ICP', 'TBI', 'SSP', 'CNS', 'TIO', 'PONV',
  // ginjal, hati, metabolik & GI
  'AKI', 'ATN', 'CKD', 'ESRD', 'GFR', 'eGFR', 'BUN', 'HD', 'CRRT', 'RRT', 'ODS', 'ADH', 'LFT', 'ALT', 'AST',
  'HE-ensefalopati', 'GI', 'UGIB', 'GERD', 'GRV', 'TPN', 'DKA', 'HHS', 'GDS', 'GD', 'BG', 'GCU', 'TG', 'TFT', 'TSH',
  // paru & infeksi
  'ARDS', 'PPOK', 'PF-peakflow', 'CAP', 'HAP', 'VAP', 'ISK', 'MRSA', 'MRSE', 'MSSA', 'ESBL', 'MDR', 'PBP', 'PCT', 'CBC',
  'WBC', 'CMV-virus', 'HSV',
  // obstetri & neonatus
  'HPP', 'IUGR', 'NAS',
  // organisasi & panduan
  'SSC', 'SCCM', 'ESICM', 'AHA', 'ACC', 'HRS-ritme', 'ASA', 'ASA-stroke', 'ESC', 'EACTS', 'IDSA', 'ESCMID', 'ACCP',
  'ACEP', 'ACOG', 'AAP', 'SOAP', 'NCS', 'WAO', 'ISMP', 'ASHP', 'INS', 'CDC', 'FDA', 'WHO', 'KDIGO', 'GINA', 'GOLD',
  'EASL', 'AASLD', 'ESE', 'PERDICI', 'PAPDI', 'PDPI', 'PERKI', 'PERDOSSI', 'POGI', 'PGI',
];
