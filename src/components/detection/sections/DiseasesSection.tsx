// Atualize o DiseasesSection para converter tratamento
import React from 'react';
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

  // Converter doenças para formato esperado pelo DiseaseCard
  const formattedDiseases = analysis.health.diseases?.map(disease => {
    // Converter tratamento do objeto para array de strings
    let treatmentArray: string[] = [];
    let preventionArray: string[] = [];
    
    if (disease.treatment) {
      if (Array.isArray(disease.treatment)) {
        treatmentArray = disease.treatment;
      } else if (typeof disease.treatment === 'object') {
        treatmentArray = [
          ...(disease.treatment.organic || []),
          ...(disease.treatment.chemical || [])
        ];
        preventionArray = disease.treatment.preventive || [];
      }
    }
    
    return {
      name: disease.name,
      probability: disease.probability,
      severity: disease.severity,
      description: disease.description,
      // Usar 'pest' como tipo padrão se não tiver
      type: (disease as any).type || 'pest',
      treatment: treatmentArray,
      prevention: preventionArray,
      scientificName: disease.scientificName,
    };
  }) || [];

  if (formattedDiseases.length === 0) {
    return (
      <AnalysisResultCard
        title="Problemas Identificados"
        subtitle="Nenhum problema detectado"
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
      subtitle={`${formattedDiseases.length} problema(s) encontrado(s)`}
      icon="alert"
      iconColor={currentTheme.colors.error}
    >
      <Typography variant="body2" style={{ color: currentTheme.colors.textSecondary, marginBottom: 16 }}>
        Baseado na análise da imagem, foram detectados os seguintes problemas:
      </Typography>
      
      {formattedDiseases.map((disease, index) => (
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
      ))}
    </AnalysisResultCard>
  );
};

export default DiseasesSection;