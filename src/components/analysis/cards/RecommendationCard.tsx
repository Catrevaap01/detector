// src/components/analysis/cards/RecommendationCard.tsx
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography';
import Card from '../../common/cards/Card';
import Chip from '../../common/chips/Chip';

interface RecommendationCardProps {
  recommendation: string;
  index: number;
  theme: any;
  type?: 'general' | 'treatment' | 'prevention' | 'care';
  priority?: 'high' | 'medium' | 'low';
  onPress?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  index,
  theme,
  type = 'general',
  priority = 'medium',
  onPress,
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'treatment': return theme.colors.error;
      case 'prevention': return theme.colors.warning;
      case 'care': return theme.colors.success;
      default: return theme.colors.primary;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'treatment': return 'Tratamento';
      case 'prevention': return 'Prevenção';
      case 'care': return 'Cuidados';
      default: return 'Recomendação';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'medium': return 'information';
      case 'low': return 'check-circle';
      default: return 'lightbulb';
    }
  };

  const typeColor = getTypeColor(type);
  const priorityColor = getPriorityColor(priority);

  return (
    <Card
      variant="filled"
      padding="large"
      borderRadius="large"
      onPress={onPress}
      style={{
        backgroundColor: `${typeColor}08`,
        borderWidth: 1,
        borderColor: `${typeColor}20`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Indicador lateral */}
      <View style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: typeColor,
        borderTopLeftRadius: theme.borderRadius.large,
        borderBottomLeftRadius: theme.borderRadius.large,
      }} />

      <View style={{ gap: theme.spacing.md, marginLeft: 4 }}>
        {/* Cabeçalho */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flex: 1 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${typeColor}15`,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: typeColor,
            }}>
              <Typography variant="caption" style={{ 
                color: typeColor,
                fontWeight: '800',
                fontSize: 16,
              }}>
                {index + 1}
              </Typography>
            </View>

            <View>
              <Typography variant="body1" style={{ 
                color: theme.colors.text,
                fontWeight: '700',
                marginBottom: 2,
              }}>
                {getTypeLabel(type)}
              </Typography>
              
              <Chip
                label={priority === 'high' ? 'Prioridade Alta' : 
                      priority === 'medium' ? 'Prioridade Média' : 'Prioridade Baixa'}
                icon={getPriorityIcon(priority)}
                variant="filled"
                size="small"
                style={{
                  backgroundColor: `${priorityColor}15`,
                  paddingHorizontal: 8,
                }}
                textStyle={{
                  color: priorityColor,
                  fontWeight: '600',
                  fontSize: 10,
                }}
              />
            </View>
          </View>

          {type === 'treatment' && (
            <View style={{
              backgroundColor: `${theme.colors.error}15`,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.borderRadius.small,
              borderWidth: 1,
              borderColor: `${theme.colors.error}30`,
            }}>
              <Typography variant="caption" style={{ 
                color: theme.colors.error,
                fontWeight: '700',
                fontSize: 10,
                textTransform: 'uppercase',
              }}>
                Importante
              </Typography>
            </View>
          )}
        </View>

        {/* Conteúdo */}
        <Typography variant="body1" style={{ 
          color: theme.colors.text,
          lineHeight: 24,
          paddingLeft: theme.spacing.xs,
        }}>
          {recommendation}
        </Typography>

        {/* Ícone de ação */}
        {onPress && (
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: theme.spacing.xs,
          }}>
            <Typography variant="caption" style={{ 
              color: typeColor,
              fontWeight: '600',
              textTransform: 'uppercase',
              fontSize: 11,
            }}>
              Mais detalhes
            </Typography>
            <Icon name="chevron-right" size={16} color={typeColor} />
          </View>
        )}
      </View>
    </Card>
  );
};

export default React.memo(RecommendationCard);