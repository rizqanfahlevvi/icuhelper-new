import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePatientStore } from './usePatientStore';

export interface HistoryEntry {
  id: string;
  module: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- bentuk input berbeda per kalkulator (kode lama)
  inputs: Record<string, any>;
  summary: string;
  timestamp: number;
  /** Pasien aktif saat disimpan (null/undefined = sesi tanpa pasien atau entri lama). */
  patientId?: string | null;
  patientName?: string;
}

/** Batas total entri di perangkat (dulu 30; kini lebih longgar karena riwayat dipisah per pasien). */
export const HISTORY_MAX = 100;

interface HistoryState {
  entries: HistoryEntry[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addEntry: (module: string, label: string, inputs: Record<string, any>, summary: string) => void;
  deleteEntry: (id: string) => void;
  clearHistory: (module?: string) => void;
  /** Hapus semua riwayat milik satu pasien (dipakai saat pasien dihapus). */
  clearPatientHistory: (patientId: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (module, label, inputs, summary) => set((state) => {
        const p = usePatientStore.getState();
        const newEntry: HistoryEntry = {
          id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
          module,
          label,
          inputs,
          summary,
          timestamp: Date.now(),
          patientId: p.activePatientId ?? null,
          patientName: p.activePatientId ? (p.nama || 'Pasien tanpa nama') : undefined,
        };
        return { entries: [newEntry, ...state.entries].slice(0, HISTORY_MAX) };
      }),
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter(e => e.id !== id)
      })),
      clearHistory: (module) => set((state) => ({
        entries: module ? state.entries.filter(e => e.module !== module) : []
      })),
      clearPatientHistory: (patientId) => set((state) => ({
        entries: state.entries.filter(e => e.patientId !== patientId)
      })),
    }),
    {
      name: 'icu-calc-history',
    }
  )
);
