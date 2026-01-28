// src/hooks/useDetectionFlow.ts
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetectionService, { CompleteAnalysis } from '../services/DetectionService';
import { saveCompleteAnalysis } from '../services/historyStorageService';
import { 
  takePhoto as takePhotoUtil, 
  pickImageFromGallery, 
  requestLocationPermission 
} from '../utils/permissions';

type DetectionStep = 'capture' | 'analyzing' | 'results';

export const useDetectionFlow = (navigation: any) => {
  const [currentStep, setCurrentStep] = useState<DetectionStep>('capture');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CompleteAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleCaptureImage = useCallback(async () => {
    try {
      // Solicitar permissões
      await requestLocationPermission();
      
      const imageUri = await takePhotoUtil();
      if (imageUri) {
        setImage(imageUri);
        setCapturedImage(imageUri);
        setCurrentStep('capture');
        
        // Sugerir análise após 1 segundo
        setTimeout(() => {
          Alert.alert(
            'Imagem capturada!',
            'Deseja analisar esta imagem agora?',
            [
              { 
                text: 'Melhorar foto', 
                style: 'default',
                onPress: () => setCurrentStep('capture')
              },
              { 
                text: 'Analisar', 
                style: 'primary',
                onPress: () => handleAnalyze(imageUri)
              }
            ]
          );
        }, 1000);
      }
    } catch (err: any) {
      Alert.alert('Erro', 'Não foi possível acessar a câmera');
      console.error(err);
    }
  }, []);

  const handleSelectFromGallery = useCallback(async () => {
    try {
      const imageUri = await pickImageFromGallery();
      if (imageUri) {
        setImage(imageUri);
        setCurrentStep('capture');
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível acessar a galeria');
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setCapturedImage(null);
    setAnalysis(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async (imageUri?: string) => {
    const targetImage = imageUri || image;
    
    if (!targetImage) {
      Alert.alert('Atenção', 'Selecione uma imagem primeiro');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep('analyzing');

    try {
      // 1. Análise completa
      const completeAnalysis = await DetectionService.completeAnalysis(targetImage);
      
      // 2. Obter localização
      const location = await requestLocationPermission();
      
      // 3. Criar ID único
      const enrichedAnalysis: CompleteAnalysis = {
        ...completeAnalysis,
        id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        } : undefined,
      };

      // 4. Salvar no histórico usando a nova função
      const savedId = await saveCompleteAnalysis(
        enrichedAnalysis,
        targetImage,
        location
      );

      // 5. Atualizar análise com ID salvo
      const finalAnalysis = {
        ...enrichedAnalysis,
        id: savedId,
      };

      // 6. Atualizar estado
      setAnalysis(finalAnalysis);
      setCurrentStep('results');
      
      // 7. Feedback baseado na gravidade
      const hasCriticalIssues = finalAnalysis.health.diseases?.some(d => d.severity === 'high');
      if (hasCriticalIssues) {
        Alert.alert(
          '⚠️ Atenção!',
          'Foram encontrados problemas críticos na planta. Recomendamos ação imediata.',
          [{ text: 'Ver soluções', onPress: () => {} }]
        );
      } else if (finalAnalysis.health.diseases && finalAnalysis.health.diseases.length > 0) {
        Alert.alert(
          '⚠️ Problemas Detectados',
          `Foram encontrados ${finalAnalysis.health.diseases.length} problema(s) na planta.`,
          [{ text: 'Ver detalhes' }]
        );
      } else {
        Alert.alert(
          '✅ Planta Saudável',
          'A análise não identificou problemas significativos.',
          [{ text: 'Ótimo!' }]
        );
      }
      
    } catch (err: any) {
      console.error('Erro completo na análise:', err);
      setError(err.message || 'Erro na análise');
      setCurrentStep('results');
      Alert.alert('Erro na análise', 'Tente novamente com uma imagem mais clara.');
    } finally {
      setLoading(false);
    }
  }, [image]);

  const handleRetry = useCallback(() => {
    setError(null);
    setCurrentStep('capture');
  }, []);

  const handleSave = useCallback(async () => {
    if (!analysis) return;
    
    try {
      const favorites = await AsyncStorage.getItem('favorite_analyses');
      let favoritesArray = favorites ? JSON.parse(favorites) : [];
      
      favoritesArray.unshift({
        ...analysis,
        savedAt: new Date().toISOString(),
        isFavorite: true,
      });
      
      await AsyncStorage.setItem('favorite_analyses', JSON.stringify(favoritesArray));
      Alert.alert('✅', 'Análise salva nos favoritos');
    } catch (err) {
      console.error('Erro ao salvar favorito:', err);
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  }, [analysis]);

  const handleShare = useCallback(() => {
    if (!analysis) return;
    
    // Aqui você integraria com APIs de compartilhamento
    Alert.alert(
      'Compartilhar',
      'Resultados prontos para compartilhar.',
      [
        { text: 'WhatsApp', onPress: () => {} },
        { text: 'E-mail', onPress: () => {} },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  }, [analysis]);

  const handleNewScan = useCallback(() => {
    Alert.alert(
      'Nova análise',
      'Começar uma nova análise?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sim', 
          style: 'destructive',
          onPress: () => {
            setImage(null);
            setAnalysis(null);
            setError(null);
            setCurrentStep('capture');
          }
        }
      ]
    );
  }, []);

  const showHelp = useCallback(() => {
    navigation.navigate('DetectionHelp');
  }, [navigation]);

  return {
    currentStep,
    image,
    loading,
    analysis,
    error,
    capturedImage,
    handleCaptureImage,
    handleSelectFromGallery,
    handleRemoveImage,
    handleAnalyze,
    handleRetry,
    handleSave,
    handleShare,
    handleNewScan,
    showHelp,
  };
};