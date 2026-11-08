import { resolveDirectFio2, estimateLowFlowFio2 } from '../../utils/abg';

export interface AbgInputs {
  ph: string;
  pco2: string;
  po2: string;
  hco3: string;
  be: string;
  spo2: string;
  fio2Direct: string;
  fio2Device: string;
  fio2Flow: string;
  mapV: string;
  na: string;
  cl: string;
  alb: string;
  laktat: string;
  rr: string;
  kondisi: string;
  paco2Unit: 'mmHg' | 'kPa';
  albUnit: 'g/dL' | 'mg/dL';
  spo2Source: 'pulse' | 'abg';
  fio2Mode: 'direct' | 'lowflow';
}

export const defaultAbgInputs: AbgInputs = {
  ph: '', pco2: '', po2: '', hco3: '', be: '', spo2: '',
  fio2Direct: '', fio2Device: 'nasal', fio2Flow: '',
  mapV: '', na: '', cl: '', alb: '', laktat: '', rr: '',
  kondisi: 'umum', paco2Unit: 'mmHg', albUnit: 'g/dL',
  spo2Source: 'pulse', fio2Mode: 'direct'
};

/** FiO₂ efektif (fraksi) — lihat resolveDirectFio2/estimateLowFlowFio2 di utils/abg.ts. */
export const getFio2Value = (inputs: AbgInputs): number | null => {
  if (inputs.fio2Mode === 'direct') return resolveDirectFio2(inputs.fio2Direct).value;
  return estimateLowFlowFio2(inputs.fio2Device, parseFloat(inputs.fio2Flow));
};
