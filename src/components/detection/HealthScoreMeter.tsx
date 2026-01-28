// src/components/detection/HealthScoreMeter.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import Typography from '../common/typography/Typography';

interface HealthScoreMeterProps {
  score: number;
  isHealthy: boolean;
  label: string;
  message: string;
}

const HealthScoreMeter: React.FC<HealthScoreMeterProps> = ({
  score,
  isHealthy,
  label,
  message,
}) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    healthTextContainer: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    healthLabel: {
      color: isHealthy ? theme.colors.success : theme.colors.warning,
      marginBottom: 2,
    },
    healthMessage: {
      color: theme.colors.textSecondary,
    },
    scoreContainer: {
      alignItems: 'center',
    },
    scoreLabel: {
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    scoreValue: {
      color: theme.colors.text,
    },
    scoreTotal: {
      color: theme.colors.textSecondary,
    },
    healthBarContainer: {
      marginTop: theme.spacing.sm,
    },
    healthBarBackground: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: theme.spacing.xs,
    },
    healthBarFill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: isHealthy ? currentTheme.colors.success : currentTheme.colors.warning,
    },
    healthBarLabel: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
    },
  }));

  const getHealthLevel = () => {
    if (score >= 70) return 'Boa';
    if (score >= 40) return 'Moderada';
    return 'Baixa';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name={isHealthy ? 'check-circle' : 'alert-circle'}
          size={32}
          color={isHealthy ? currentTheme.colors.success : currentTheme.colors.warning}
        />
        <View style={styles.healthTextContainer}>
          <Typography variant="h4" style={styles.healthLabel}>
            {label}
          </Typography>
          <Typography variant="body2" style={styles.healthMessage}>
            {message}
          </Typography>
        </View>
        <View style={styles.scoreContainer}>
          <Typography variant="caption" style={styles.scoreLabel}>
            Pontuação
          </Typography>
          <Typography variant="h3" style={styles.scoreValue}>
            {score.toFixed(0)}
            <Typography variant="body2" style={styles.scoreTotal}>
              /100
            </Typography>
          </Typography>
        </View>
      </View>
      
      <View style={styles.healthBarContainer}>
        <View style={styles.healthBarBackground}>
          <View 
            style={[
              styles.healthBarFill,
              { width: `${score}%` }
            ]} 
          />
        </View>
        <Typography variant="caption" style={styles.healthBarLabel}>
          {getHealthLevel()} saúde
        </Typography>
      </View>
    </View>
  );
};

export default HealthScoreMeter;
