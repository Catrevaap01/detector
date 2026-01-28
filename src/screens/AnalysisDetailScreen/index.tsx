// src/screens/AnalysisDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, View, Share } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import ScreenContainer from '../../components/common/layout/ScreenContainer';
import Button from '../../components/common/buttons/Button';
import { getAnalysisById, deleteFromHistory, toggleFavorite, isFavorite } from '../../services/historyStorageService';
import { HistoryItem } from '../../services/historyStorageService';

// Verifique se estes componentes existem e estão exportados corretamente
import AnalysisImage from '../../components/analysis/display/AnalysisImage';
import AnalysisHeaderCard from '../../components/analysis/cards/AnalysisHeaderCard';
import AnalysisInfoSection from '../../components/analysis/sections/AnalysisInfoSection';
import DiseasesSection from '../../components/analysis/sections/DiseasesSection';
import RecommendationsSection from '../../components/analysis/sections/RecommendationsSection';
import AnalysisActions from '../../components/analysis/actions/AnalysisActions';
import LoadingView from '../../components/analysis/loading/LoadingView';
import ErrorView from '../../components/analysis/loading/ErrorView';

type AnalysisDetailRouteProp = RouteProp<{
  AnalysisDetail: { analysisId: string; analysisData?: HistoryItem };
}, 'AnalysisDetail'>;

const AnalysisDetailScreen = () => {
  const route = useRoute<AnalysisDetailRouteProp>();
  const navigation = useNavigation();
  const { analysisId, analysisData: initialData } = route.params;
  
  const [analysis, setAnalysis] = useState<HistoryItem | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [isFavorited, setIsFavorited] = useState(false);
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (!initialData) {
      loadAnalysis();
    }
    checkFavoriteStatus();
  }, [analysisId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const data = await getAnalysisById(analysisId);
      
      if (data) {
        setAnalysis(data);
      } else {
        Alert.alert('Erro', 'Análise não encontrada.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro ao carregar análise:', error);
      Alert.alert('Erro', 'Não foi possível carregar a análise.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const favorited = await isFavorite(analysisId);
      setIsFavorited(favorited);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const newFavoriteStatus = await toggleFavorite(analysisId);
      setIsFavorited(newFavoriteStatus);
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar favorito.');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Deletar Análise',
      'Tem certeza que deseja deletar esta análise? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteFromHistory(analysisId);
              if (success) {
                Alert.alert('Sucesso', 'Análise deletada com sucesso!');
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a análise.');
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!analysis || !analysis.analysis) return;
    
    try {
      const plantName = getPlantName();
      const healthScore = getHealthScore();
      const isHealthy = getIsHealthy();
      
      const message = `🌱 Análise de Planta\n` +
        `Planta: ${plantName}\n` +
        `Saúde: ${healthScore}/100\n` +
        `Resultado: ${isHealthy ? 'Saudável' : 'Com problemas'}\n` +
        `Data: ${new Date(analysis.timestamp).toLocaleDateString('pt-PT')}`;
      
      await Share.share({
        message,
        title: 'Resultado da Análise - Detector de Pragas',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  // Funções auxiliares
  const getPlantName = () => {
    if (!analysis?.analysis?.identification) return 'Planta não identificada';
    const identification = analysis.analysis.identification;
    return identification.commonNames?.[0] || identification.name || 'Planta não identificada';
  };

  const getHealthScore = () => {
    if (!analysis?.analysis?.health) return 0;
    return analysis.analysis.health.score || analysis.analysis.health.healthScore || 0;
  };

  const getIsHealthy = () => {
    return analysis?.analysis?.health?.isHealthy || false;
  };

  // Header actions
  const headerRight = (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      <Button
        variant="text"
        iconLeft={isFavorited ? 'star' : 'star-outline'}
        onPress={handleToggleFavorite}
        color={isFavorited ? currentTheme.colors.warning : currentTheme.colors.textSecondary}
        size="small"
        style={{ paddingHorizontal: 6, paddingVertical: 4 }}
      />
      <Button
        variant="text"
        iconLeft="delete"
        onPress={handleDelete}
        color={currentTheme.colors.error}
        size="small"
        style={{ paddingHorizontal: 6, paddingVertical: 4 }}
      />
    </View>
  );

  if (loading) {
    return (
      <ScreenContainer 
        headerTitle="Detalhes da Análise"
        headerStyle={{ height: 48 }}
        headerTitleStyle={{ fontSize: 16 }}
      >
        <LoadingView theme={currentTheme} />
      </ScreenContainer>
    );
  }

  if (!analysis) {
    return (
      <ScreenContainer 
        headerTitle="Detalhes da Análise"
        headerStyle={{ height: 48 }}
        headerTitleStyle={{ fontSize: 16 }}
        showBackButton={true}
      >
        <ErrorView theme={currentTheme} onGoBack={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      headerTitle="Detalhes da Análise"
      headerRight={headerRight}
      scrollable={false}
      headerStyle={{ 
        height: 52,
        paddingHorizontal: currentTheme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: currentTheme.colors.outline,
      }}
      headerTitleStyle={{ 
        fontSize: 18, 
        fontWeight: '600',
      }}
      safeAreaStyle={{ flex: 1 }}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: currentTheme.spacing.md,
          paddingTop: currentTheme.spacing.sm,
          paddingBottom: currentTheme.spacing.xl,
          gap: currentTheme.spacing.md,
        }}
      >
        {/* Imagem */}
        <AnalysisImage 
          imageUri={analysis.imageUri}
          timestamp={analysis.timestamp}
          theme={currentTheme}
        />

        {/* Header com informações principais */}
        <AnalysisHeaderCard 
          analysis={analysis}
          theme={currentTheme}
        />

        {/* Informações da análise */}
        <AnalysisInfoSection 
          analysis={analysis}
          theme={currentTheme}
        />

        {/* Doenças */}
        {analysis.analysis?.health?.diseases && analysis.analysis.health.diseases.length > 0 && (
          <DiseasesSection 
            diseases={analysis.analysis.health.diseases}
            theme={currentTheme}
          />
        )}

        {/* Recomendações */}
        {analysis.analysis?.health?.recommendations && analysis.analysis.health.recommendations.length > 0 && (
          <RecommendationsSection 
            recommendations={analysis.analysis.health.recommendations}
            theme={currentTheme}
          />
        )}

        {/* Ações */}
        <AnalysisActions
          isFavorited={isFavorited}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
          onShare={handleShare}
          onNewAnalysis={() => navigation.navigate('Detection')}
          theme={currentTheme}
          showFullActions={true}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

export default AnalysisDetailScreen;