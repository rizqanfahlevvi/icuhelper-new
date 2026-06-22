import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check if theme exists in localStorage
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      
      // Fallback to system preference
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPreference ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Smooth transitively disable transitions during theme change to prevent weird flashing on heavy elements
    const disableTransitions = () => {
      const css = document.createElement('style');
      css.type = 'text/css';
      css.appendChild(
        document.createTextNode(
          `* {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -ms-transition: none !important;
            transition: none !important;
          }`
        )
      );
      document.head.appendChild(css);
      return css;
    };

    const cssStyle = disableTransitions();

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);

    // Forces a reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    window.getComputedStyle(cssStyle).opacity;
    
    // Re-enable transitions
    document.head.removeChild(cssStyle);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    setTheme: (newTheme: Theme) => setThemeState(newTheme),
    isDarkMode: theme === 'dark',
    toggleTheme,
  };
}
