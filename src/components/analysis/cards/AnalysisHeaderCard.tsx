// src/components/analysis/cards/AnalysisHeaderCard.tsx (atualizado)
import React from 'react';
import { View } from 'react-native';
import Card from '../../common/cards/Card';
import PlantInfoDisplay from '../display/PlantInfoDisplay';
import { HistoryItem } from '../../../services/historyStorageService';

interface AnalysisHeaderCardProps {
  analysis: HistoryItem;
  theme: any;
}

const AnalysisHeaderCard: React.FC<AnalysisHeaderCardProps> = ({ analysis, theme }) => {
  const getPlantInfo = () => {
    if (!analysis?.analysis?.identification) {
      return {
        commonName: 'Planta não identificada',
        confidence: 0,
        isHealthy: false,
      };
    }
    
    const identification = analysis.analysis.identification;
    const health = analysis.analysis.health || {};
    
    return {
      commonName: identification.commonNames?.[0] || identification.name || 'Planta não identificada',
      scientificName: identification.scientificName,
      description: identification.description,
      family: identification.family,
      genus: identification.genus,
      species: identification.species,
      confidence: identification.confidence || identification.probability || 0,
      isHealthy: health.isHealthy || false,
    };
  };

  const plantInfo = getPlantInfo();

  return (
    <Card 
      variant="elevated" 
      padding="medium" // Alterado de large para medium
      borderRadius="large" // Alterado de xlarge para large
      style={{
        borderWidth: 1,
        borderColor: theme.colors.outline,
        backgroundColor: theme.colors.surface,
      }}
    >
      <PlantInfoDisplay
        plantInfo={plantInfo}
        theme={theme}
        variant="compact" // Alterado de summary para compact
      />
    </Card>
  );
};

export default AnalysisHeaderCard;