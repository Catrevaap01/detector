// src/components/analysis/actions/AnalysisActions.tsx
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../common/buttons/Button';

interface AnalysisActionsProps {
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onShare: () => void;
  onNewAnalysis?: () => void;
  theme: any;
  showFullActions?: boolean;
}

const AnalysisActions: React.FC<AnalysisActionsProps> = ({
  isFavorited,
  onToggleFavorite,
  onDelete,
  onShare,
  onNewAnalysis,
  theme,
  showFullActions = false,
}) => {
  if (showFullActions) {
    return (
      <View style={{ gap: theme.spacing.md }}>
        <View style={{ 
          flexDirection: 'row', 
          gap: theme.spacing.sm,
        }}>
          <Button
            variant="primary"
            title="Compartilhar"
            iconLeft="share-variant"
            onPress={onShare}
            style={{ flex: 1 }}
          />
          
          {onNewAnalysis && (
            <Button
              variant="outline"
              title="Nova Análise"
              iconLeft="camera"
              onPress={onNewAnalysis}
              style={{ flex: 1 }}
            />
          )}
        </View>
        
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center',
          gap: theme.spacing.md,
          paddingTop: theme.spacing.sm,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
        }}>
          <Button
            variant="text"
            iconLeft={isFavorited ? 'star' : 'star-outline'}
            title={isFavorited ? 'Remover Favorito' : 'Favoritar'}
            onPress={onToggleFavorite}
            color={isFavorited ? theme.colors.warning : theme.colors.textSecondary}
          />
          
          <Button
            variant="text"
            iconLeft="delete"
            title="Deletar"
            onPress={onDelete}
            color={theme.colors.error}
          />
        </View>
      </View>
    );
  }

  // Para uso no header
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      <Button
        variant="text"
        iconLeft={isFavorited ? 'star' : 'star-outline'}
        onPress={onToggleFavorite}
        color={isFavorited ? theme.colors.warning : theme.colors.textSecondary}
        size="small"
      />
      <Button
        variant="text"
        iconLeft="delete"
        onPress={onDelete}
        color={theme.colors.error}
        size="small"
      />
    </View>
  );
};

export default AnalysisActions;