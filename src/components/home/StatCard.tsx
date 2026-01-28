// src/components/home/StatCard.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import Typography from '../common/typography/Typography';

interface StatCardProps {
  value: string;
  label: string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  color,
}) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    value: {
      color: color,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    label: {
      color: currentTheme.colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    iconContainer: {
      marginTop: theme.spacing.xs,
    },
  }));

  return (
    <View style={styles.container}>
      <Typography variant="h2" style={styles.value}>
        {value}
      </Typography>
      <Typography variant="caption" style={styles.label}>
        {label}
      </Typography>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={20} color={color} />
      </View>
    </View>
  );
};

export default StatCard;