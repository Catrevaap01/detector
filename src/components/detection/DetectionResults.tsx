// src/components/detection/DetectionResults.tsx
import React from 'react';
import { CompleteAnalysis } from '../../services/DetectionService';
import IdentificationSection from './sections/IdentificationSection';
import HealthSection from './sections/HealthSection';
import DiseasesSection from './sections/DiseasesSection';
import SuggestionsSection from './sections/SuggestionsSection';
import ActionButtons from './buttons/ActionButtons';

interface DetectionResultsProps {
  analysis: CompleteAnalysis;
  location?: any;
  onSave: () => void;
  onShare: () => void;
  onHistory: () => void;
  onReset: () => void;
}

const DetectionResults: React.FC<DetectionResultsProps> = ({
  analysis,
  location,
  onSave,
  onShare,
  onHistory,
  onReset,
}) => {
  return (
    <>
      <IdentificationSection analysis={analysis} />
      <HealthSection analysis={analysis} />
      <DiseasesSection analysis={analysis} />
      <SuggestionsSection analysis={analysis} location={location} />
      
      <ActionButtons
        onSave={onSave}
        onShare={onShare}
        onHistory={onHistory}
        onReset={onReset}
      />
    </>
  );
};

export default DetectionResults;