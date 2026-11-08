import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../utils/idbStorage';

export interface Patient {
  id: string;
  nama: string;
  category: 'dewasa' | 'geriatri';
  gender: '' | 'L' | 'P';
  ageUnit: 'tahun' | 'bulan' | 'tgl-lahir';
  ageInput: string;
  ageYears: string;
  ageMonths: string;
  agePrecise: string;
  weightKg: string;
  heightCm: string;
  createdAt: string;
  mrsDate?: string;
  /** Snapshot data klinis/lab pasien (kunci: utils/clinicalVariables.ts). */
  clinicalData?: Record<string, string>;
  /** Cap waktu (epoch ms) pembaruan terakhir per variabel di clinicalData. */
  clinicalUpdatedAt?: Record<string, number>;
}

export interface PatientData {
  category: 'dewasa' | 'geriatri';
  nama: string;
  gender: '' | 'L' | 'P';
  ageUnit: 'tahun' | 'bulan' | 'tgl-lahir';
  ageInput: string;
  ageYears: string;
  ageMonths: string;
  agePrecise: string;
  weightKg: string;
  heightCm: string;
  mrsDate?: string;
}

interface PatientState extends PatientData {
  patients: Patient[];
  activePatientId: string | null;
  setPatientData: (data: Partial<PatientData>) => void;
  resetPatientData: () => void;
  
  // List management
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => string;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  setActivePatient: (id: string | null) => void;
  /** Simpan snapshot klinis ke pasien tertentu (dipanggil otomatis oleh store/patientContextSync.ts). */
  savePatientClinicalData: (id: string, clinicalData: Record<string, string>, clinicalUpdatedAt: Record<string, number>) => void;
}

const initialPatientData: PatientData = {
  category: 'dewasa',
  nama: '',
  gender: '',
  ageUnit: 'tahun',
  ageInput: '',
  ageYears: '',
  ageMonths: '',
  agePrecise: '',
  weightKg: '',
  heightCm: '',
  mrsDate: '',
};

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      ...initialPatientData,
      patients: [],
      activePatientId: null,

      setPatientData: (data) => set((state) => {
        // If there's an active patient, we also auto-update their entry in the list!
        const updatedPatients = state.activePatientId
          ? state.patients.map((p) =>
              p.id === state.activePatientId ? { ...p, ...data } : p
            )
          : state.patients;
        
        return {
          ...state,
          ...data,
          patients: updatedPatients,
        };
      }),

      resetPatientData: () => set((state) => ({
        ...state,
        ...initialPatientData,
        activePatientId: null,
      })),

      addPatient: (newPatient) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        const createdAt = new Date().toISOString();
        const patientRecord: Patient = {
          ...newPatient,
          id,
          createdAt,
        };

        set((state) => ({
          patients: [patientRecord, ...state.patients],
        }));

        return id;
      },

      updatePatient: (id, updates) => set((state) => {
        const updatedPatients = state.patients.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        );

        // If the updated patient is the active patient, sync active patient root state
        const isActive = state.activePatientId === id;
        const activeSync = isActive ? updates : {};

        return {
          patients: updatedPatients,
          ...activeSync,
        };
      }),

      deletePatient: (id) => set((state) => {
        const updatedPatients = state.patients.filter((p) => p.id !== id);
        const shouldResetActive = state.activePatientId === id;

        return {
          patients: updatedPatients,
          ...(shouldResetActive ? { ...initialPatientData, activePatientId: null } : {}),
        };
      }),

      setActivePatient: (id) => set((state) => {
        if (!id) {
          return {
            ...state,
            ...initialPatientData,
            activePatientId: null,
          };
        }

        const found = state.patients.find((p) => p.id === id);
        if (!found) return state;

        // Extract patient properties
        const { id: _, createdAt: __, clinicalData: ___, clinicalUpdatedAt: ____, ...patientData } = found;

        return {
          ...state,
          ...patientData,
          activePatientId: id,
        };
      }),

      savePatientClinicalData: (id, clinicalData, clinicalUpdatedAt) => set((state) => {
        let changed = false;
        const updatedPatients = state.patients.map((p) => {
          if (p.id !== id) return p;
          if (
            JSON.stringify(p.clinicalData ?? {}) === JSON.stringify(clinicalData) &&
            JSON.stringify(p.clinicalUpdatedAt ?? {}) === JSON.stringify(clinicalUpdatedAt)
          ) return p;
          changed = true;
          return { ...p, clinicalData, clinicalUpdatedAt };
        });
        return changed ? { patients: updatedPatients } : state;
      }),
    }),
    {
      name: 'icu-patient-multi',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
