// src/components/home/TipsSection.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import TipCard from '../common/cards/TipCard';
import Typography from '../common/typography/Typography';

const TipsSection = () => {
  const { makeStyles } = useTheme();
  
  const styles = makeStyles((theme) => ({
    container: {
      marginBottom: theme.spacing.xl,
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
      <Typography variant="h3" style={styles.sectionTitle}>
        💡 Dicas Rápidas
      </Typography>
      <TipCard icon="camera" title="Para Melhor Análise">
        Tire fotos claras das folhas com boa iluminação natural
      </TipCard>
      <TipCard icon="clock" title="Horário Ideal">
        Analise plantas pela manhã para identificar sintomas frescos
      </TipCard>
      <TipCard icon="water" title="Rega Adequada">
        Evite analisar plantas logo após regar para não confundir sintomas
      </TipCard>
    </View>
  );
};

export default TipsSection;