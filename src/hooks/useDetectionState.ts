// src/hooks/useDetectionState.ts
import { useState, useCallback } from 'react';
import { CompleteAnalysis } from '../services/DetectionService';
import { HistoryItem } from '../services/historyStorageService';

interface DetectionState {
  image: string | null;
  loading: boolean;
  analysis: CompleteAnalysis | null;
  error: string | null;
  location: any;
  locationLoading: boolean;
  imageModalVisible: boolean;
  helpModalVisible: boolean;
}

export const useDetectionState = () => {
  const [state, setState] = useState<DetectionState>({
    image: null,
    loading: false,
    analysis: null,
    error: null,
    location: null,
    locationLoading: false,
    imageModalVisible: false,
    helpModalVisible: false,
  });

  const updateState = useCallback((updates: Partial<DetectionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetAnalysis = useCallback(() => {
    setState(prev => ({
      ...prev,
      image: null,
      analysis: null,
      error: null,
      location: null,
    }));
  }, []);

  return {
    ...state,
    updateState,
    resetAnalysis,
  };
};