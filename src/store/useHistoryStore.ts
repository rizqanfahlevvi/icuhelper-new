import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryEntry {
  id: string;
  module: string;
  label: string;
  inputs: Record<string, any>;
  summary: string;
  timestamp: number;
}

interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (module: string, label: string, inputs: Record<string, any>, summary: string) => void;
  deleteEntry: (id: string) => void;
  clearHistory: (module?: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (module, label, inputs, summary) => set((state) => {
        const newEntry: HistoryEntry = {
          id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
          module,
          label,
          inputs,
          summary,
          timestamp: Date.now(),
        };
        return {
          entries: [newEntry, ...state.entries].slice(0, 30), // Max 30 entries
        };
      }),
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter(e => e.id !== id)
      })),
      clearHistory: (module) => set((state) => ({
        entries: module ? state.entries.filter(e => e.module !== module) : []
      })),
    }),
    {
      name: 'icu-calc-history',
    }
  )
);
