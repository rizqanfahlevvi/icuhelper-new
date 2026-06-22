import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ClinicalData {
  age?: string;             // tahun
  gender?: 'm' | 'f' | '';  // m / f
  weight?: string;          // kg
  height?: string;          // cm
  ph?: string;              // pH darah
  pco2?: string;            // mmHg
  pao2?: string;            // mmHg
  hco3?: string;            // mmol/L
  be?: string;              // mEq/L
  na?: string;              // mEq/L
  k?: string;               // mEq/L
  cl?: string;              // mEq/L
  ca?: string;              // mg/dL
  mg?: string;              // mg/dL
  albumin?: string;         // g/dL
  creatinine?: string;      // mg/dL
  ureum?: string;           // mg/dL
  hb?: string;              // g/dL
  leukosit?: string;        // 10^3/µL
  trombosit?: string;       // 10^3/µL
  glukosa?: string;         // mg/dL
  gcs?: string;             // total score (3-15)
  fio2?: string;            // % (21 - 100)
  rr?: string;              // n/menit
  hr?: string;              // bpm
  systolic?: string;        // mmHg
  diastolic?: string;       // mmHg
  map?: string;             // mmHg
  temp?: string;            // °C
  peep?: string;            // cmH2O
  spo2?: string;            // %
  
  // Extended Clinical Records
  diagnosis?: string;       // diagnosis utama
  hematokrit?: string;      // %
  mcv?: string;             // fL
  mch?: string;             // pg
  mchc?: string;            // g/dL
  acidUric?: string;        // mg/dL
  cholesterol?: string;     // mg/dL
  ldl?: string;             // mg/dL
  hdl?: string;             // mg/dL
  trigliserida?: string;    // mg/dL
  gds?: string;             // mg/dL
  gdp?: string;             // mg/dL
  gd2pp?: string;           // mg/dL
  hba1c?: string;           // %
  sgot?: string;            // U/L
  sgpt?: string;            // U/L
  bilirubinTotal?: string;  // mg/dL
  bilirubinDirek?: string;  // mg/dL
  bilirubinIndirek?: string;// mg/dL
}

interface ClinicalState {
  data: ClinicalData;
  setField: (key: keyof ClinicalData, value: string) => void;
  setFields: (fields: Partial<ClinicalData>) => void;
  clearStore: () => void;
}

const initialData: ClinicalData = {
  age: '',
  gender: '',
  weight: '',
  height: '',
  ph: '',
  pco2: '',
  pao2: '',
  hco3: '',
  be: '',
  na: '',
  k: '',
  cl: '',
  ca: '',
  mg: '',
  albumin: '',
  creatinine: '',
  ureum: '',
  hb: '',
  leukosit: '',
  trombosit: '',
  glukosa: '',
  gcs: '',
  fio2: '',
  rr: '',
  hr: '',
  systolic: '',
  diastolic: '',
  map: '',
  temp: '',
  
  // Extended Clinical Records
  diagnosis: '',
  hematokrit: '',
  mcv: '',
  mch: '',
  mchc: '',
  acidUric: '',
  cholesterol: '',
  ldl: '',
  hdl: '',
  trigliserida: '',
  gds: '',
  gdp: '',
  gd2pp: '',
  hba1c: '',
  sgot: '',
  sgpt: '',
  bilirubinTotal: '',
  bilirubinDirek: '',
  bilirubinIndirek: '',
};

export const useClinicalStore = create<ClinicalState>()(
  persist(
    (set) => ({
      data: initialData,
      setField: (key, value) =>
        set((state) => ({
          data: {
            ...state.data,
            [key]: value,
          },
        })),
      setFields: (fields) =>
        set((state) => ({
          data: {
            ...state.data,
            ...fields,
          },
        })),
      clearStore: () => set({ data: initialData }),
    }),
    {
      name: 'icu-clinical-data',
    }
  )
);
