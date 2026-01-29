// src/components/detection/sections/HealthSection.tsx
import React from 'react';
import { View } from 'react-native';
import { CompleteAnalysis } from '../../../services/DetectionService';
import { useTheme } from '../../../hooks/useTheme';
import AnalysisResultCard from '../cards/AnalysisResultCard';
import HealthScoreMeter from '../HealthScoreMeter';
import Typography from '../../common/typography/Typography';

interface HealthSectionProps {
  analysis: CompleteAnalysis;
}

const HealthSection: React.FC<HealthSectionProps> = ({ analysis }) => {
  const { currentTheme } = useTheme();

  // Extrair dados da estrutura health
  const health = analysis.health;
  
  // Usar health.isHealthy se existir, senão calcular baseado no status
  const isHealthy = health.isHealthy !== undefined 
    ? health.isHealthy 
    : health.status === 'healthy';
  
  // Usar healthScore ou score (preferência para healthScore)
  const score = health.healthScore || health.score || 0;
  
  // Determinar status baseado no score se não houver status específico
  const status = health.status || (score >= 80 ? 'healthy' : score >= 50 ? 'warning' : 'critical');

  // Configurar mensagens baseadas no status
  const getHealthConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          label: 'Saudável',
          message: health.diseases?.length === 0 
            ? 'A planta parece estar em boas condições' 
            : 'Problemas detectados mas sob controle',
          description: health.recommendations?.join('. ') || 'Continue com os cuidados regulares.'
        };
      case 'warning':
        return {
          label: 'Atenção Necessária',
          message: health.diseases?.length > 0 
            ? `${health.diseases.length} problema(s) detectado(s)` 
            : 'Algumas condições podem melhorar',
          description: health.recommendations?.join('. ') || 'Recomenda-se monitoramento mais frequente.'
        };
      case 'critical':
        return {
          label: 'Ação Imediata',
          message: health.diseases?.length > 0 
            ? `${health.diseases.length} problema(s) graves detectados` 
            : 'Estado crítico identificado',
          description: health.recommendations?.join('. ') || 'Ação corretiva necessária imediatamente.'
        };
      default:
        return {
          label: 'Status Desconhecido',
          message: 'Análise realizada',
          description: 'Verifique os detalhes abaixo'
        };
    }
  };

  const healthConfig = getHealthConfig();

  return (
    <AnalysisResultCard
      title="Diagnóstico de Saúde"
      icon="heart-pulse"
      iconColor={
        status === 'healthy' ? currentTheme.colors.success : 
        status === 'warning' ? currentTheme.colors.warning : 
        currentTheme.colors.error
      }
    >
      <HealthScoreMeter
        score={score}
        isHealthy={isHealthy}
        label={healthConfig.label}
        message={healthConfig.message}
      />
      
      {healthConfig.description && (
        <View style={{ 
          marginTop: currentTheme.spacing.md, 
          padding: currentTheme.spacing.sm,
          backgroundColor: status === 'healthy' 
            ? `${currentTheme.colors.success}15` 
            : status === 'warning' 
              ? `${currentTheme.colors.warning}15` 
              : `${currentTheme.colors.error}15`,
          borderRadius: currentTheme.borderRadius.sm,
        }}>
          <Typography variant="body2" style={{ 
            color: currentTheme.colors.textSecondary,
            margin: 0,
            lineHeight: 20,
          }}>
            {healthConfig.description}
          </Typography>
        </View>
      )}
    </AnalysisResultCard>
  );
};

export default HealthSection;