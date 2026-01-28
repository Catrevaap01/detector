// src/components/history/EmptyHistory.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import Typography from '../common/typography/Typography';
import Button from '../common/buttons/Button';

interface EmptyHistoryProps {
  onStartDetection: () => void;
}

const EmptyHistory: React.FC<EmptyHistoryProps> = ({ onStartDetection }) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      maxWidth: 300,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="history" size={40} color={currentTheme.colors.textSecondary} />
      </View>
      
      <Typography variant="h3" style={styles.title}>
        Nenhuma análise ainda
      </Typography>
      
      <Typography variant="body1" style={styles.subtitle}>
        Suas análises de plantas aparecerão aqui. Comece fazendo sua primeira análise!
      </Typography>
      
      <Button
        variant="primary"
        title="Fazer Primeira Análise"
        iconLeft="camera"
        onPress={onStartDetection}
      />
    </View>
  );
};

export default EmptyHistory;