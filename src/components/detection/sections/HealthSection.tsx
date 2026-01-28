// src/components/detection/sections/HealthSection.tsx
import React from 'react';
import { CompleteAnalysis } from '../../../services/DetectionService';
import { useTheme } from '../../../hooks/useTheme';
import AnalysisResultCard from '../cards/AnalysisResultCard';
import HealthScoreMeter from '../HealthScoreMeter';

interface HealthSectionProps {
  analysis: CompleteAnalysis;
}

const HealthSection: React.FC<HealthSectionProps> = ({ analysis }) => {
  const { currentTheme } = useTheme();

  // Usar health.isHealthy se existir, senão calcular baseado no status
  const isHealthy = analysis.health.isHealthy !== undefined 
    ? analysis.health.isHealthy 
    : analysis.health.status === 'healthy';
  
  const score = analysis.health.score || analysis.health.healthScore || 0;

  const healthConfig = isHealthy ? {
    label: 'Saudável',
    message: 'A planta parece estar em boas condições'
  } : {
    label: analysis.health.status === 'warning' ? 'Atenção' : 'Crítico',
    message: analysis.health.status === 'warning' 
      ? 'Foram identificados possíveis problemas' 
      : 'Problemas graves detectados!'
  };

  return (
    <AnalysisResultCard
      title="Diagnóstico de Saúde"
      icon="heart-pulse"
      iconColor={
        isHealthy ? currentTheme.colors.success : 
        analysis.health.status === 'warning' ? currentTheme.colors.warning : 
        currentTheme.colors.error
      }
    >
      <HealthScoreMeter
        score={score}
        isHealthy={isHealthy}
        label={healthConfig.label}
        message={healthConfig.message}
      />
    </AnalysisResultCard>
  );
};

export default HealthSection;