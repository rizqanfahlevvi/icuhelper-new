import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[]; // List of route paths, e.g. "/calculator/ibw"
  toggleFavorite: (path: string) => void;
  isFavorite: (path: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (path) => set((state) => {
        const isFav = state.favorites.includes(path);
        const newFavs = isFav
          ? state.favorites.filter((f) => f !== path)
          : [...state.favorites, path];
        return { favorites: newFavs };
      }),
      isFavorite: (path) => get().favorites.includes(path),
    }),
    {
      name: 'icu-favorites',
    }
  )
);
