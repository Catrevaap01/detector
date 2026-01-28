// src/screens/HistoryScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../hooks/useTheme';
import ScreenContainer from '../../components/common/layout/ScreenContainer';
import HistoryList, { FilterType } from '../../components/history/HistoryList';
import Typography from '../../components/common/typography/Typography';
import Button from '../../components/common/buttons/Button';
import { 
  getHistory, 
  clearHistory, 
  getHistoryStats,
  HistoryItem,
  deleteFromHistory,
} from '../../services/historyStorageService';

const HistoryScreen = ({ navigation, route }: any) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    healthy: 0,
    unhealthy: 0,
  });

  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      color: theme.colors.textSecondary,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: currentTheme.colors.surface,
      borderRadius: currentTheme.borderRadius.large,
      padding: currentTheme.spacing.md,
      marginBottom: currentTheme.spacing.md,
      marginHorizontal: currentTheme.spacing.md,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: currentTheme.colors.primary,
      marginBottom: currentTheme.spacing.xs,
    },
    statLabel: {
      color: currentTheme.colors.textSecondary,
      fontSize: 12,
      textAlign: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: currentTheme.spacing.xl,
    },
    emptyIcon: {
      marginBottom: currentTheme.spacing.lg,
    },
    emptyText: {
      textAlign: 'center',
      marginBottom: currentTheme.spacing.lg,
      color: currentTheme.colors.textSecondary,
    },
  }));

  // Carregar histórico
  const loadHistory = useCallback(async () => {
    try {
      const [history, historyStats] = await Promise.all([
        getHistory(),
        getHistoryStats(),
      ]);
      
      setHistoryItems(history);
      setFilteredItems(history);
      setStats({
        total: historyStats.total,
        healthy: historyStats.healthy,
        unhealthy: historyStats.unhealthy,
      });
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Filtrar itens
  const filterItems = useCallback((filter: FilterType, items: HistoryItem[]) => {
    let filtered = [...items];
    
    switch (filter) {
      case 'healthy':
        filtered = filtered.filter(item => item.analysis.health.isHealthy);
        break;
      case 'unhealthy':
        filtered = filtered.filter(item => !item.analysis.health.isHealthy);
        break;
      case 'recent':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        break;
      case 'favorites':
        // Implementar lógica para favoritos
        // Por enquanto, retorna todos
        break;
      case 'all':
      default:
        // Ordenar por data mais recente primeiro
        filtered = [...filtered].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        break;
    }
    
    return filtered;
  }, []);

  // Handler para mudança de filtro
  const handleFilterChange = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
    const filtered = filterItems(filter, historyItems);
    setFilteredItems(filtered);
  }, [historyItems, filterItems]);

  // Handler para refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistory();
  }, [loadHistory]);

  // Handler para pressionar item
  const handleItemPress = useCallback((item: HistoryItem) => {
    navigation.navigate('AnalysisDetail', { 
      analysisId: item.id,
      analysisData: item 
    });
  }, [navigation]);

  // Handler para iniciar detecção
  const handleStartDetection = useCallback(() => {
    navigation.navigate('Detection');
  }, [navigation]);

  // Handler para limpar histórico
  const handleClearHistory = useCallback(() => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todo o histórico? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearHistory();
              await loadHistory();
              Alert.alert('Sucesso', 'Histórico limpo com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar o histórico.');
            }
          },
        },
      ]
    );
  }, [loadHistory]);

  // Handler para deletar item
  const handleDeleteItem = useCallback(async (id: string) => {
    try {
      const success = await deleteFromHistory(id);
      if (success) {
        await loadHistory(); // Recarregar histórico
        Alert.alert('Sucesso', 'Análise removida do histórico.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a análise.');
    }
  }, [loadHistory]);

  // Handler para toggle de favorito
  const handleFavoriteToggle = useCallback((id: string, isFavorite: boolean) => {
    // Atualizar item localmente se necessário
    const updatedItems = historyItems.map(item => {
      if (item.id === id) {
        // Pode adicionar flag de favorito no item se quiser
      }
      return item;
    });
    setHistoryItems(updatedItems);
  }, [historyItems]);

  // Carregar histórico inicial
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Atualizar filtros quando histórico mudar
  useEffect(() => {
    const filtered = filterItems(activeFilter, historyItems);
    setFilteredItems(filtered);
  }, [historyItems, activeFilter, filterItems]);

  // Verificar se tem parâmetros de atualização
  useEffect(() => {
    if (route.params?.refresh) {
      loadHistory();
    }
  }, [route.params?.refresh, loadHistory]);

  if (loading) {
    return (
      <ScreenContainer
        headerTitle="Histórico"
        scrollable={false}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentTheme.colors.primary} />
          <Typography variant="body1" style={styles.loadingText}>
            Carregando histórico...
          </Typography>
        </View>
      </ScreenContainer>
    );
  }

  const headerRight = (
    <View style={styles.headerActions}>
      <Button
        variant="text"
        iconLeft="delete"
        onPress={handleClearHistory}
        style={{ marginRight: currentTheme.spacing.xs }}
      />
    </View>
  );

  return (
    <ScreenContainer
      headerTitle="Histórico"
      headerSubtitle={`${stats.total} análise${stats.total !== 1 ? 's' : ''}`}
      headerRight={stats.total > 0 ? headerRight : undefined}
      scrollable={false}
    >
      {stats.total > 0 ? (
        <>
          {/* Estatísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Typography variant="h2" style={styles.statValue}>
                {stats.total}
              </Typography>
              <Typography variant="caption" style={styles.statLabel}>
                Total
              </Typography>
            </View>
            
            <View style={styles.statItem}>
              <Typography variant="h2" style={[styles.statValue, { color: currentTheme.colors.success }]}>
                {stats.healthy}
              </Typography>
              <Typography variant="caption" style={styles.statLabel}>
                Saudáveis
              </Typography>
            </View>
            
            <View style={styles.statItem}>
              <Typography variant="h2" style={[styles.statValue, { color: currentTheme.colors.warning }]}>
                {stats.unhealthy}
              </Typography>
              <Typography variant="caption" style={styles.statLabel}>
                Com problemas
              </Typography>
            </View>
          </View>

          {/* Lista de histórico */}
          <HistoryList
            items={filteredItems}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onItemPress={handleItemPress}
            onStartDetection={handleStartDetection}
            onDeleteItem={handleDeleteItem}
            onFavoriteToggle={handleFavoriteToggle}
            loading={refreshing}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[currentTheme.colors.primary]}
                tintColor={currentTheme.colors.primary}
              />
            }
          />
        </>
      ) : (
        // Tela vazia
        <View style={styles.emptyContainer}>
          <Icon name="history" size={80} color={currentTheme.colors.textSecondary} style={styles.emptyIcon} />
          
          <Typography variant="h4" style={styles.emptyText}>
            Nenhuma análise no histórico
          </Typography>
          
          <Typography variant="body2" style={[styles.emptyText, { maxWidth: 300 }]}>
            Suas análises de plantas aparecerão aqui. 
            Comece fazendo sua primeira análise!
          </Typography>
          
          <Button
            variant="primary"
            title="Fazer Primeira Análise"
            iconLeft="camera"
            onPress={handleStartDetection}
            style={{ marginTop: currentTheme.spacing.lg }}
          />
        </View>
      )}
    </ScreenContainer>
  );
};

export default HistoryScreen;