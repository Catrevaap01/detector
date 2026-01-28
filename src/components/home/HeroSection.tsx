// src/components/home/HeroSection.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import Typography from '../common/typography/Typography';

const HeroSection = () => {
  const { currentTheme, makeStyles } = useTheme();
  
  const styles = makeStyles((theme) => ({
    heroSection: {
      backgroundColor: theme.colors.primaryLight + '20',
      borderRadius: theme.borderRadius.large,
      padding: theme.spacing.lg,
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    appTitle: {
      color: theme.colors.primaryDark,
      fontSize: theme.typography.h1.fontSize,
      fontWeight: theme.typography.h1.fontWeight,
      marginBottom: theme.spacing.xs,
    },
    appSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.body1.fontSize,
      textAlign: 'center',
      lineHeight: 22,
    },
  }));

  return (
    <View style={styles.heroSection}>
      <Icon name="leaf" size={48} color={currentTheme.colors.primary} />
      <View style={{ marginTop: currentTheme.spacing.md, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="microscope" size={24} color={currentTheme.colors.primary} />
          <Typography variant="h1" style={styles.appTitle}>
            Detector de Pragas
          </Typography>
        </View>
        <Typography variant="body1" style={styles.appSubtitle}>
          Identificação inteligente de doenças em plantas usando IA
        </Typography>
      </View>
    </View>
  );
};

export default HeroSection;