import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  EMPTY_CLINICAL_DATA,
  type ClinicalData,
  type ClinicalKey,
  type ClinicalTimestamps,
} from '../utils/clinicalVariables';
import { LEGACY_OWNER, normalizeLegacyClinicalRecord, stampChanges, toClinicalData } from '../utils/patientContext';

export type { ClinicalData, ClinicalKey, ClinicalTimestamps } from '../utils/clinicalVariables';

/**
 * "Data kerja" klinis yang dibaca/ditulis semua kalkulator (registri kunci & satuan:
 * utils/clinicalVariables.ts).
 *
 * - `ownerId` = id pasien pemilik data kerja ini (null = sesi tanpa pasien).
 *   Saat pasien diganti/ditutup, data kerja DIGANTI (bukan digabung) oleh
 *   store/patientContextSync.ts — mencegah nilai pasien A terbawa ke pasien B.
 * - `updatedAt` = cap waktu pembaruan per variabel (ditampilkan sebagai umur data).
 * - Perubahan otomatis disimpan ke snapshot pasien aktif (patientContextSync).
 */
interface ClinicalState {
  data: ClinicalData;
  updatedAt: ClinicalTimestamps;
  ownerId: string | null;
  setField: (key: ClinicalKey, value: string) => void;
  setFields: (fields: Partial<ClinicalData>) => void;
  /** Ganti seluruh data kerja (dipakai saat memuat snapshot pasien). */
  loadSnapshot: (snapshot: { data: Partial<ClinicalData>; updatedAt?: ClinicalTimestamps; ownerId: string | null }) => void;
  clearStore: () => void;
}

interface PersistedClinical {
  data?: Record<string, string>;
  updatedAt?: ClinicalTimestamps;
  ownerId?: string | null;
}

export const useClinicalStore = create<ClinicalState>()(
  persist(
    (set) => ({
      data: { ...EMPTY_CLINICAL_DATA },
      updatedAt: {},
      ownerId: null,
      setField: (key, value) =>
        set((state) => {
          if ((state.data[key] ?? '') === value) return state;
          return {
            data: { ...state.data, [key]: value },
            updatedAt: stampChanges(state.data, { [key]: value }, state.updatedAt, Date.now()),
          };
        }),
      setFields: (fields) =>
        set((state) => {
          const changed = (Object.keys(fields) as ClinicalKey[]).some((k) => (state.data[k] ?? '') !== (fields[k] ?? ''));
          if (!changed) return state;
          return {
            data: { ...state.data, ...fields },
            updatedAt: stampChanges(state.data, fields, state.updatedAt, Date.now()),
          };
        }),
      loadSnapshot: ({ data, updatedAt, ownerId }) =>
        set({
          data: { ...EMPTY_CLINICAL_DATA, ...data },
          updatedAt: { ...(updatedAt ?? {}) },
          ownerId,
        }),
      clearStore: () => set({ data: { ...EMPTY_CLINICAL_DATA }, updatedAt: {}, ownerId: null }),
    }),
    {
      name: 'icu-clinical-data',
      version: 1,
      partialize: (s) => ({ data: s.data, updatedAt: s.updatedAt, ownerId: s.ownerId }),
      migrate: (persisted, version) => {
        const p = (persisted ?? {}) as PersistedClinical;
        if (version < 1) {
          // v0: belum ada pemilik data & cap waktu; `gds` terpisah dari `glukosa`.
          return {
            data: { ...EMPTY_CLINICAL_DATA, ...toClinicalData(normalizeLegacyClinicalRecord(p.data)) },
            updatedAt: {},
            ownerId: LEGACY_OWNER,
          };
        }
        return {
          data: { ...EMPTY_CLINICAL_DATA, ...toClinicalData(normalizeLegacyClinicalRecord(p.data)) },
          updatedAt: p.updatedAt ?? {},
          ownerId: p.ownerId === undefined ? LEGACY_OWNER : p.ownerId,
        };
      },
      merge: (persisted, current) => {
        // Instalasi baru (tidak ada data tersimpan) → zustand tetap memanggil merge dengan undefined.
        if (!persisted || typeof persisted !== 'object') return current;
        const p = persisted as PersistedClinical;
        return {
          ...current,
          data: { ...EMPTY_CLINICAL_DATA, ...toClinicalData(normalizeLegacyClinicalRecord(p.data)) },
          updatedAt: p.updatedAt ?? {},
          ownerId: p.ownerId === undefined ? LEGACY_OWNER : p.ownerId,
        };
      },
    }
  )
);
