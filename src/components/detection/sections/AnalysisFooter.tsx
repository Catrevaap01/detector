// src/components/detection/sections/AnalysisFooter.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import Button from '../../common/buttons/Button';
import Typography from '../../common/typography/Typography';

interface AnalysisFooterProps {
  onNavigateToSettings: () => void;
}

const AnalysisFooter: React.FC<AnalysisFooterProps> = ({ onNavigateToSettings }) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    footer: {
      padding: theme.spacing.lg,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    footerText: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      lineHeight: 18,
    },
    tipContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      marginBottom: theme.spacing.md,
      width: '100%',
    },
    tipIcon: {
      marginRight: theme.spacing.sm,
    },
    tipText: {
      flex: 1,
      color: theme.colors.text,
    },
  }));

  const tips = [
    '🌞 Tire fotos com luz natural',
    '📷 Foque nas folhas afetadas',
    '🌱 Inclua várias partes da planta',
  ];

  return (
    <View style={styles.footer}>
      <Typography variant="caption" style={styles.footerText}>
        💡 Dicas para melhor análise
      </Typography>
      
      {tips.map((tip, index) => (
        <View key={index} style={styles.tipContainer}>
          <Typography variant="body2" style={styles.tipText}>
            {tip}
          </Typography>
        </View>
      ))}
    </View>
  );
};

export default AnalysisFooter;
