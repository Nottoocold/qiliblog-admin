import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeConfig {
  theme: 'light' | 'dark';
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (themeMode: 'light' | 'dark' | 'system') => void;
}

export const useThemeStore = create<ThemeConfig>()(
  persist(
    set => ({
      themeMode: 'system',
      theme: 'light',
      setThemeMode: themeMode => {
        set({ themeMode });
        if (themeMode === 'system') {
          set({
            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
          });
        } else {
          set({ theme: themeMode });
        }
      },
    }),
    {
      name: 'user-theme',
    }
  )
);
