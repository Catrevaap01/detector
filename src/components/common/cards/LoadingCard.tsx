// src/components/detection/cards/LoadingCard.tsx
import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import Card from '../../common/cards/Card';
import Typography from '../../common/typography/Typography';

interface LoadingCardProps {
  message?: string;
  subMessage?: string;
}

const LoadingCard: React.FC<LoadingCardProps> = ({
  message = 'Analisando imagem...',
  subMessage = 'Identificando planta e verificando saúde',
}) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    loadingSubtext: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  }));

  return (
    <Card variant="elevated" padding="medium" borderRadius="large">
      <View style={styles.container}>
        <ActivityIndicator size="large" color={currentTheme.colors.primary} />
        <Typography variant="h4" style={styles.loadingText}>
          {message}
        </Typography>
        <Typography variant="body2" style={styles.loadingSubtext}>
          {subMessage}
        </Typography>
      </View>
    </Card>
  );
};

export default LoadingCard;