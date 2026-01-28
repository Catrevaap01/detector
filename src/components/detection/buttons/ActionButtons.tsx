// src/components/detection/ActionButtons.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import Card from '../../common/cards/Card';
import Typography from '../../common/typography/Typography';
import Button from '../../common/buttons/Button';

import { toggleFavorite, isFavorite } from '../../../services/historyStorageService';

interface ActionButtonsProps {
  analysisId?: string;
  onSave?: () => void;
  onShare: () => void;
  onHistory: () => void;
  onReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  analysisId,
  onSave,
  onShare,
  onHistory,
  onReset,
}) => {
  const { currentTheme, makeStyles } = useTheme();
  const [isFavorited, setIsFavorited] = useState(false);
  
  const styles = makeStyles((theme) => ({
    container: {
      marginBottom: theme.spacing.md,
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      color: theme.colors.text,
    },
    buttonGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    actionButton: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.surfaceVariant,
    },
    actionIcon: {
      marginBottom: theme.spacing.xs,
    },
    actionText: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
    },
    favoriteButton: {
      borderWidth: isFavorited ? 2 : 0,
      borderColor: currentTheme.colors.warning,
    },
  }));

  // Verificar se já está favoritado
  useEffect(() => {
    if (analysisId) {
      checkFavoriteStatus();
    }
  }, [analysisId]);

  const checkFavoriteStatus = async () => {
    if (analysisId) {
      const favorited = await isFavorite(analysisId);
      setIsFavorited(favorited);
    }
  };

  const handleToggleFavorite = async () => {
    if (!analysisId) {
      if (onSave) onSave();
      return;
    }
    
    try {
      const newFavoriteStatus = await toggleFavorite(analysisId);
      setIsFavorited(newFavoriteStatus);
      
      Alert.alert(
        newFavoriteStatus ? '✅ Favoritado!' : '❌ Removido dos favoritos',
        newFavoriteStatus 
          ? 'Análise adicionada aos seus favoritos.'
          : 'Análise removida dos favoritos.'
      );
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os favoritos.');
    }
  };

   const actions = [
    {
      id: 'save',
      icon: isFavorited ? 'star' : 'star-outline',
      label: isFavorited ? 'Favoritado' : 'Favoritar',
      color: isFavorited ? currentTheme.colors.warning : currentTheme.colors.textSecondary,
      onPress: handleToggleFavorite,
      style: isFavorited ? styles.favoriteButton : undefined,
    },
    {
      id: 'share',
      icon: 'share-variant',
      label: 'Compartilhar',
      color: currentTheme.colors.secondary,
      onPress: onShare,
    },
    {
      id: 'history',
      icon: 'history',
      label: 'Histórico',
      color: currentTheme.colors.secondaryDark,
      onPress: onHistory,
    },
    {
      id: 'reset',
      icon: 'refresh',
      label: 'Nova Análise',
      color: currentTheme.colors.primary,
      onPress: onReset,
    },
  ];

return (
    <Card variant="elevated" padding="medium" borderRadius="large" style={styles.container}>
      <Typography variant="h4" style={styles.title}>
        Ações
      </Typography>
      <View style={styles.buttonGrid}>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="text"
            onPress={action.onPress}
            style={[styles.actionButton, action.style]}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name={action.icon} size={24} color={action.color} style={styles.actionIcon} />
              <Typography variant="caption" style={styles.actionText}>
                {action.label}
              </Typography>
            </View>
          </Button>
        ))}
      </View>
    </Card>
  );
};

export default ActionButtons;