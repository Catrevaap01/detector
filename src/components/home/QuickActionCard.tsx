// src/components/home/QuickActions.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Button from '../common/buttons/Button';
import Typography from '../common/typography/Typography';

interface QuickActionsProps {
  onStartAnalysis: () => void;
  onShowTutorial: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onStartAnalysis, 
  onShowTutorial 
}) => {
  const { makeStyles } = useTheme();
  
  const styles = makeStyles((theme) => ({
    container: {
      marginBottom: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      marginBottom: theme.spacing.md,
    },
  }));

  return (
    <View style={styles.container}>
      <Button
        variant="primary"
        title="Iniciar Análise Rápida"
        iconLeft="camera"
        onPress={onStartAnalysis}
      />
    </View>
  );
};

export default QuickActions;