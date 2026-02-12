/**
 * ThemeProvider.tsx
 *
 * Global theme state for Cook Now.
 * Controls light / dark mode toggle across the app.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { lightTheme, darkTheme } from '@/constants/theme';

export type ThemeType = typeof lightTheme;

export type ThemeContextProps = {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

// --- Provider component ---
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// --- Custom hook for safe access ---
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

