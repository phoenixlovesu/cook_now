/**
 * theme.ts
 *
 * Centralized theme definitions for Cook Now.
 * Includes light and dark mode colors, fonts, and component-specific colors.
 *
 * To use:
 *   import { lightTheme, darkTheme, Fonts } from '@/constants/theme';
 *   const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;
 */

import { Platform } from 'react-native';

export const lightTheme = {
  background: "#F5FAF9",           
  card: "#FFFFFF",                  
  textPrimary: "#2E2E2E",          
  textSecondary: "#4E908A",         
  accent: "#3B9A9A",                // Buttons, highlights, active icons
  buttonText: "#FFFFFF",            
  divider: "#DCE8E7",               // Borders, separators
  navbar: "#FFFFFF",                 // NavBar / TabBar background
  toggleTrack: "#DCE8E7",           // Track for switches/toggles
  toggleThumb: "#3B9A9A",           // Thumb for switches/toggles
};

export const darkTheme = {
  background: "#121A19",            
  card: "#1E2B2A",                  
  textPrimary: "#F5F5F5",           
  textSecondary: "#64B5B5",         
  accent: "#3B9A9A",                
  buttonText: "#FFFFFF",            
  divider: "#263636",              
  navbar: "#1E2B2A",                 
  toggleTrack: "#263636",     
  toggleThumb: "#3B9A9A",           
};


export const Fonts = Platform.select({
  ios: {
    sans: 'Poppins', 
    serif: 'Georgia',
    rounded: 'Poppins', 
    mono: 'Courier New',
  },
  android: {
    sans: 'Poppins',
    serif: 'serif',
    rounded: 'Poppins',
    mono: 'monospace',
  },
  web: {
    sans: "Poppins, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  default: {
    sans: 'Poppins',
    serif: 'serif',
    rounded: 'Poppins',
    mono: 'monospace',
  },
});

