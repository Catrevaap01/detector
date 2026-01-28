// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  error: string;
  errorLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  info: string;
  border: string;
  borderLight: string;
  overlay: string;
  shadow: string;
}

interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

interface ThemeTypography {
  h1: { fontSize: number; fontWeight: string };
  h2: { fontSize: number; fontWeight: string };
  h3: { fontSize: number; fontWeight: string };
  h4: { fontSize: number; fontWeight: string };
  body1: { fontSize: number; fontWeight: string };
  body2: { fontSize: number; fontWeight: string };
  caption: { fontSize: number; fontWeight: string };
}

interface AppTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
}

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: AppTheme;
  toggleTheme: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// TEMA CLARO MODERNO
const lightTheme: AppTheme = {
  colors: {
    // Verde Natureza Vibrante
    primary: '#00B894', // Verde água moderno
    primaryLight: '#55EFC4',
    primaryDark: '#00A085',
    
    // Azul Profundo Elegante
    secondary: '#0984E3',
    secondaryLight: '#74B9FF',
    secondaryDark: '#0A79DF',
    
    // Neutros Sofisticados
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F2F6',
    
    // Texto com Bom Contraste
    text: '#2D3436',
    textSecondary: '#636E72',
    textDisabled: '#B2BEC3',
    
    // Cores de Status Modernas
    error: '#D63031',
    errorLight: '#FFEAA7',
    success: '#00B894',
    successLight: '#55EFC4',
    warning: '#FDCB6E',
    warningLight: '#FFF3C4',
    info: '#6C5CE7',
    
    // Bordas Suaves
    border: '#DFE6E9',
    borderLight: '#F1F2F6',
    
    // Overlays
    overlay: 'rgba(45, 52, 54, 0.5)',
    shadow: 'rgba(99, 110, 114, 0.15)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  typography: {
    h1: { fontSize: 32, fontWeight: '800' },
    h2: { fontSize: 26, fontWeight: '700' },
    h3: { fontSize: 20, fontWeight: '600' },
    h4: { fontSize: 18, fontWeight: '600' },
    body1: { fontSize: 16, fontWeight: '400' },
    body2: { fontSize: 14, fontWeight: '400' },
    caption: { fontSize: 12, fontWeight: '500' },
  },
  
  borderRadius: {
    small: 10,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
};

// TEMA ESCURO MODERNO
const darkTheme: AppTheme = {
  colors: {
    // Verde com Mais Saturação
    primary: '#00D8A7',
    primaryLight: '#5CFFD6',
    primaryDark: '#00C095',
    
    // Azul Mais Brilhante
    secondary: '#1E90FF',
    secondaryLight: '#63B8FF',
    secondaryDark: '#1874CD',
    
    // Neutros Escuros Profundos
    background: '#0F0F14',
    surface: '#1A1A23',
    surfaceVariant: '#252531',
    
    // Texto Suave no Escuro
    text: '#EAEAEA',
    textSecondary: '#B0B0C0',
    textDisabled: '#6A6A7A',
    
    // Cores de Status Vibrantes
    error: '#FF6B6B',
    errorLight: '#2A1F1F',
    success: '#00D8A7',
    successLight: '#1A2A24',
    warning: '#FFD166',
    warningLight: '#2A271F',
    info: '#8884FF',
    
    // Bordas com Contraste
    border: '#2D2D3A',
    borderLight: '#3A3A47',
    
    // Overlays Mais Escuros
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
  borderRadius: lightTheme.borderRadius,
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentTheme = (): AppTheme => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  };

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@plant_detector_theme_mode');
        if (savedTheme) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemePreference();
  }, []);

  const toggleTheme = async (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem('@plant_detector_theme_mode', mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  const currentTheme = getCurrentTheme();
  const isDark = currentTheme === darkTheme;

  return (
    <ThemeContext.Provider value={{
      themeMode,
      currentTheme,
      toggleTheme,
      isDark,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  // Helper function para criar estilos
  const makeStyles = (stylesFn: (theme: AppTheme) => any) => {
    return stylesFn(context.currentTheme);
  };

  return {
    ...context,
    makeStyles,
  };
}