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

export const getFio2Value = (inputs: AbgInputs): number | null => {
  if (inputs.fio2Mode === 'direct') {
    return parseFloat(inputs.fio2Direct) || null;
  }
  const device = inputs.fio2Device;
  const flow = parseFloat(inputs.fio2Flow);
  if (device.startsWith('venturi')) {
    return parseInt(device.replace('venturi', '')) / 100;
  }
  if (!isNaN(flow)) {
    if (device === 'nasal') return Math.min(0.21 + 0.04 * flow, 0.44);
    if (device === 'simple') {
      if (flow <= 6) return 0.35;
      if (flow >= 10) return 0.60;
      return 0.35 + (flow - 6) * 0.0625;
    }
    if (device === 'nrm') {
      if (flow <= 10) return 0.80;
      if (flow >= 15) return 0.95;
      return 0.80 + (flow - 10) * 0.03;
    }
  }
  return null;
}
