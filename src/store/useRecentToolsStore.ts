import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentToolsState {
  recentPaths: string[]; // paths of recent tools
  addRecentPath: (path: string) => void;
}

export const useRecentToolsStore = create<RecentToolsState>()(
  persist(
    (set) => ({
      recentPaths: [],
      addRecentPath: (path) => set((state) => {
        // filter out the incoming path if it already exists to move it to the front
        const filtered = state.recentPaths.filter(p => p !== path);
        return {
          // keep max 10 recent
          recentPaths: [path, ...filtered].slice(0, 10),
        };
      }),
    }),
    {
      name: 'icu-calc-recent-tools',
    }
  )
);
