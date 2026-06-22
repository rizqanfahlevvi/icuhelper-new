import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontFamily = 'lexend' | 'inter' | 'roboto' | 'jetbrains' | 'system';
export type FontWeight = number; // -100 to 150 (offset from standard weights)
export type ThemeMode = 'system' | 'light' | 'dark';

interface SettingsState {
  fontFamily: FontFamily;
  fontScale: number; // 0.8 to 1.3
  fontWeight: FontWeight;
  themeMode: ThemeMode;
  bwMode: boolean; // Black & White Mode
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  
  setFontFamily: (fontFamily: FontFamily) => void;
  setFontScale: (scale: number) => void;
  setFontWeight: (weight: FontWeight) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setBwMode: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVibrationEnabled: (enabled: boolean) => void;
  
  resetSettings: () => void;
}

const defaultSettings = {
  fontFamily: 'lexend' as FontFamily,
  fontScale: 1.0,
  fontWeight: 0 as FontWeight,
  themeMode: 'system' as ThemeMode,
  bwMode: false,
  soundEnabled: true,
  vibrationEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setFontScale: (fontScale) => set({ fontScale }),
      setFontWeight: (fontWeight) => set({ fontWeight }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setBwMode: (bwMode) => set({ bwMode }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setVibrationEnabled: (vibrationEnabled) => set({ vibrationEnabled }),
      
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'icu-helper-settings',
    }
  )
);
