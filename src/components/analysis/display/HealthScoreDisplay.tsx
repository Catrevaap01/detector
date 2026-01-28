// src/components/analysis/display/HealthScoreDisplay.tsx
import React from 'react';
import { View } from 'react-native';
import Typography from '../../common/typography/Typography';

interface HealthScoreDisplayProps {
  score: number;
  isHealthy: boolean;
  theme: any;
}

const HealthScoreDisplay: React.FC<HealthScoreDisplayProps> = ({ score, isHealthy, theme }) => {
  const getScoreColor = () => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const scoreColor = getScoreColor();

  return (
    <View style={{
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.large,
      backgroundColor: `${scoreColor}15`,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: scoreColor,
      position: 'relative',
    }}>
      <Typography variant="h2" style={{
        color: scoreColor,
        fontWeight: '800',
        fontSize: 28,
      }}>
        {score}
      </Typography>
      
      <View style={{
        position: 'absolute',
        bottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}>
        <View style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: isHealthy ? theme.colors.success : theme.colors.error,
        }} />
        <Typography variant="caption" style={{
          color: theme.colors.textTertiary,
          fontWeight: '600',
          fontSize: 10,
        }}>
          /100
        </Typography>
      </View>
    </View>
  );
};

export default HealthScoreDisplay;