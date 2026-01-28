// src/components/settings/ThemeSelector.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, ThemeMode } from '../../hooks/useTheme';
import Typography from '../common/typography/Typography';
import Button from '../common/buttons/Button';

interface ThemeSelectorProps {
  currentThemeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeMode,
  onThemeChange,
}) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    optionsContainer: {
      gap: theme.spacing.sm,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.surfaceVariant,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    optionIcon: {
      marginRight: theme.spacing.md,
    },
    optionLabel: {
      color: theme.colors.text,
      flex: 1,
    },
    checkIcon: {
      color: theme.colors.primary,
    },
  }));

  const themeOptions = [
    {
      id: 'auto',
      label: 'Automático',
      description: 'Seguir configuração do sistema',
      icon: 'theme-light-dark',
    },
    {
      id: 'light',
      label: 'Claro',
      description: 'Tema claro',
      icon: 'white-balance-sunny',
    },
    {
      id: 'dark',
      label: 'Escuro',
      description: 'Tema escuro',
      icon: 'weather-night',
    },
  ] as const;

  return (
    <View style={styles.container}>
      <Typography variant="h4" style={styles.title}>
        Tema da Aplicação
      </Typography>
      
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => {
          const isSelected = currentThemeMode === option.id;
          
          return (
            <Button
              key={option.id}
              variant="text"
              onPress={() => onThemeChange(option.id as ThemeMode)}
              style={[
                styles.optionButton,
                isSelected && { backgroundColor: currentTheme.colors.primary + '20' }
              ]}
            >
              <View style={styles.optionLeft}>
                <Icon
                  name={option.icon}
                  size={24}
                  color={currentTheme.colors.primary}
                  style={styles.optionIcon}
                />
                <View style={{ flex: 1 }}>
                  <Typography variant="body1" style={styles.optionLabel}>
                    {option.label}
                  </Typography>
                  <Typography variant="caption" style={{ color: currentTheme.colors.textSecondary }}>
                    {option.description}
                  </Typography>
                </View>
              </View>
              
              {isSelected && (
                <Icon
                  name="check-circle"
                  size={24}
                  color={currentTheme.colors.primary}
                  style={styles.checkIcon}
                />
              )}
            </Button>
          );
        })}
      </View>
    </View>
  );
};

export default ThemeSelector;