// src/screens/DetectionScreen/index.tsx
import React from 'react';
import { Alert } from 'react-native';

// Hooks
import { useDetectionState } from '../../hooks/useDetectionState';
import { useDetectionHandlers } from '../../hooks/useDetectionHandlers';

// Components
import ScreenContainer from '../../components/common/layout/ScreenContainer';
import ImageUploadCard from '../../components/detection/cards/ImageUploadCard';
import LoadingCard from '../../components/common/cards/LoadingCard';
import ErrorCard from '../../components/common/cards/ErrorCard';
import AnalyzeButton from '../../components/detection/buttons/AnalyzeButton';
import HelpModal from '../../components/detection/modals/HelpModal';
import ImageModal from '../../components/detection/modals/ImageModal';
import AnalysisFooter from '../../components/detection/sections/AnalysisFooter';

// Sections
import DetectionResults from '../../components/detection/DetectionResults';

const DetectionScreen = ({ navigation }: any) => {
  // Estado
  const {
    image,
    loading,
    analysis,
    error,
    location,
    locationLoading,
    imageModalVisible,
    helpModalVisible,
    updateState,
    resetAnalysis,
  } = useDetectionState();

  // Handlers
  const handlers = useDetectionHandlers({
    image,
    location,
    updateState,
    navigation,
  });

  // Funções de callback específicas
  const handleSaveToFavorites = () => {
    if (analysis) {
      handlers.handleSaveToFavorites(analysis);
    }
  };

  const handleShareResults = () => {
    if (analysis) {
      handlers.handleShareResults(analysis);
    }
  };

  const handleResetWithConfirmation = () => {
    handlers.handleResetAnalysis(resetAnalysis);
  };

  const handleOpenImage = () => {
    if (image) {
      handlers.handleOpenImageModal(image, updateState);
    }
  };

  return (
    <ScreenContainer
      headerTitle="Detector de Pragas"
      headerSubtitle="Análise inteligente de plantas"
 
      scrollable={true}
      contentPadding={true}
    >
      {/* Upload de Imagem */}
      <ImageUploadCard
        imageUri={image}
        onTakePhoto={handlers.handleTakePhoto}
        onPickImage={handlers.handlePickImage}
        onRemoveImage={() => updateState({ image: null })}
        onOpenImage={handleOpenImage}
        loading={loading}
        locationLoading={locationLoading}
      />

      {/* Botão de Análise */}
      <AnalyzeButton
        onPress={() => handlers.handleAnalyzeImage()}
        loading={loading}
        hasImage={!!image}
        hasAnalysis={!!analysis}
      />

      {/* Estado de Erro */}
      {error && <ErrorCard message={error} />}

      {/* Estado de Loading */}
      {loading && <LoadingCard />}

      {/* Resultados da Análise */}
      {analysis && (
        <DetectionResults
          analysis={analysis}
          location={location}
          onSave={handleSaveToFavorites}
          onShare={handleShareResults}
          onHistory={() => navigation.navigate('History')}
          onReset={handleResetWithConfirmation}
        />
      )}

      {/* Rodapé */}
      <AnalysisFooter onNavigateToSettings={() => navigation.navigate('Settings')} />

      {/* Modais */}
      <ImageModal
        visible={imageModalVisible}
        imageUri={image}
        onClose={() => updateState({ imageModalVisible: false })}
      />
      
      <HelpModal
        visible={helpModalVisible}
        onClose={() => updateState({ helpModalVisible: false })}
      />
    </ScreenContainer>
  );
};

export default DetectionScreen;