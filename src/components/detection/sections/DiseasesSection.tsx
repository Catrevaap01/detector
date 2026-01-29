// src/components/detection/sections/DiseasesSection.tsx
import React from 'react';
import { View } from 'react-native'; // Adicionar View
import { CompleteAnalysis } from '../../../services/DetectionService';
import { useTheme } from '../../../hooks/useTheme';
import AnalysisResultCard from '../cards/AnalysisResultCard';
import DiseaseCard from '../DiseaseCard';
import Typography from '../../common/typography/Typography';

interface DiseasesSectionProps {
  analysis: CompleteAnalysis;
}

const DiseasesSection: React.FC<DiseasesSectionProps> = ({ analysis }) => {
  const { currentTheme } = useTheme();

  // Função para converter severidade para o formato do DiseaseCard
  const convertSeverity = (severity: string): 'low' | 'medium' | 'high' => {
    switch (severity) {
      case 'baixa': return 'low';
      case 'media': return 'medium';
      case 'alta': return 'high';
      case 'low': return 'low';
      case 'medium': return 'medium';
      case 'high': return 'high';
      default: return 'medium';
    }
  };

  // Função para determinar tipo baseado no nome da doença
  const determineType = (diseaseName: string): string => {
    const lowerName = diseaseName.toLowerCase();
    if (lowerName.includes('lagarta') || lowerName.includes('broca') || 
        lowerName.includes('pulgão') || lowerName.includes('ácaro') || 
        lowerName.includes('inseto') || lowerName.includes('weevil') || 
        lowerName.includes('bug') || lowerName.includes('moth')) {
      return 'pest';
    }
    if (lowerName.includes('fungo') || lowerName.includes('mildew') || 
        lowerName.includes('anthracnose') || lowerName.includes('rot')) {
      return 'fungus';
    }
    if (lowerName.includes('bactéria') || lowerName.includes('bacterial')) {
      return 'bacteria';
    }
    if (lowerName.includes('vírus') || lowerName.includes('virus')) {
      return 'virus';
    }
    return 'other';
  };

  // Converter doenças para formato esperado pelo DiseaseCard
  const formattedDiseases = analysis.health.diseases?.map(disease => {
    // Extrair tratamento - já está no formato correto da DiseaseInfo
    const treatment = disease.treatment;
    
    return {
      name: disease.name,
      probability: disease.probability,
      severity: convertSeverity(disease.severity),
      description: disease.description,
      type: determineType(disease.name),
      // Converter tratamento de objeto para arrays
      treatment: [
        ...(treatment?.organic || []),
        ...(treatment?.chemical || [])
      ],
      prevention: treatment?.preventive || [],
      // Não temos scientificName no DiseaseInfo, usar nome como fallback
      scientificName: disease.name,
    };
  }) || [];

  // Se não houver doenças, mas houver problemas no health status
  const hasIssues = analysis.health.status !== 'healthy' || formattedDiseases.length > 0;

  if (!hasIssues) {
    return (
      <AnalysisResultCard
        title="Saúde da Planta"
        subtitle="Planta saudável"
        icon="check-circle"
        iconColor={currentTheme.colors.success}
      >
        <Typography variant="body2" style={{ color: currentTheme.colors.textSecondary, marginBottom: 16 }}>
          A análise não identificou problemas na planta. Continue com os cuidados regulares.
        </Typography>
      </AnalysisResultCard>
    );
  }

  return (
    <AnalysisResultCard
      title="Problemas Identificados"
      subtitle={formattedDiseases.length > 0 
        ? `${formattedDiseases.length} problema(s) encontrado(s)` 
        : `Status: ${analysis.health.status}`}
      icon="alert"
      iconColor={analysis.health.status === 'critical' ? currentTheme.colors.error : currentTheme.colors.warning}
    >
      <Typography variant="body2" style={{ color: currentTheme.colors.textSecondary, marginBottom: 16 }}>
        {formattedDiseases.length > 0 
          ? 'Baseado na análise da imagem, foram detectados os seguintes problemas:' 
          : `A planta apresenta estado de ${analysis.health.status}. Saúde geral: ${analysis.health.healthScore}%`}
      </Typography>
      
      {formattedDiseases.length > 0 ? (
        formattedDiseases.map((disease, index) => (
          <DiseaseCard
            key={index}
            name={disease.name}
            scientificName={disease.scientificName}
            probability={disease.probability}
            type={disease.type}
            severity={disease.severity}
            description={disease.description}
            treatment={disease.treatment}
            prevention={disease.prevention}
          />
        ))
      ) : (
        <View style={{ marginBottom: 16 }}>
          <Typography variant="body2" style={{ 
            color: currentTheme.colors.warning, 
            fontStyle: 'italic',
            marginBottom: 8,
          }}>
            Recomendações:
          </Typography>
          <Typography variant="body2" style={{ 
            color: currentTheme.colors.textSecondary,
            lineHeight: 20,
          }}>
            {analysis.health.recommendations?.join('. ') || 'Continue monitorando a planta.'}
          </Typography>
        </View>
      )}
    </AnalysisResultCard>
  );
};

export default DiseasesSection;