// src/components/SplashScreen.tsx
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedSplash from './AnimatedSplash';
import { useTheme } from '../../hooks/useTheme';

const SplashScreen = () => {
  const { currentTheme, makeStyles } = useTheme();
  
  const styles = makeStyles((theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    microscopeIcon: {
      marginRight: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      color: theme.colors.text,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: theme.typography.body1.fontSize,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
      opacity: 0.8,
    },
  }));

  return (
    <View style={styles.container}>
      <AnimatedSplash>
        <Icon name="leaf" size={80} color={currentTheme.colors.primary} />
        <View style={styles.textContainer}>
          <Icon name="microscope" size={24} color={currentTheme.colors.primary} style={styles.microscopeIcon} />
          <AnimatedSplash.Text style={styles.title}>
            Detector de Pragas
          </AnimatedSplash.Text>
        </View>
        <AnimatedSplash.Text style={styles.subtitle}>
          Análise inteligente de plantas
        </AnimatedSplash.Text>
      </AnimatedSplash>
    </View>
  );
};

export default SplashScreen;