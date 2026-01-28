// src/hooks/useTheme.ts
import { useTheme as useThemeContext } from '../context/ThemeContext';
import { StyleSheet } from 'react-native';

export function useTheme() {
  const themeContext = useThemeContext();
  
  const makeStyles = <T extends StyleSheet.NamedStyles<T>>(
    styleCreator: (theme: typeof themeContext.currentTheme) => T
  ) => {
    return StyleSheet.create(styleCreator(themeContext.currentTheme));
  };

  return {
    ...themeContext,
    makeStyles,
  };
}