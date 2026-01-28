// src/components/settings/SettingsGroup.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Typography from '../common/typography/Typography';

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({ title, children }) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
  }));

  return (
    <View style={styles.container}>
      <Typography variant="h4" style={styles.title}>
        {title}
      </Typography>
      {children}
    </View>
  );
};

export default SettingsGroup;