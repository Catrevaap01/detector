// src/components/analysis/cards/DiseaseCard.tsx
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography';
import Card from '../../common/cards/Card';
import Chip from '../../common/chips/Chip';

interface DiseaseCardProps {
  disease: any;
  index: number;
  theme: any;
  onPress?: () => void;
  variant?: 'horizontal' | 'vertical';
}

const DiseaseCard: React.FC<DiseaseCardProps> = ({
  disease,
  index,
  theme,
  onPress,
  variant = 'horizontal'
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return severity || 'Desconhecida';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fungal': return 'Fúngico';
      case 'bacterial': return 'Bacteriano';
      case 'viral': return 'Viral';
      case 'pest': return 'Praga';
      default: return type || 'Outro';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fungal': return 'mushroom';
      case 'bacterial': return 'bacteria';
      case 'viral': return 'virus';
      case 'pest': return 'bug';
      default: return 'alert-circle';
    }
  };

  const diseaseType = disease.type || 'other';
  const severity = disease.severity || 'medium';
  const severityColor = getSeverityColor(severity);
  const probability = disease.probability || 0;
  const hasDescription = !!disease.description;

  // Variante horizontal (para lista scrollável)
  if (variant === 'horizontal') {
    return (
      <Card
        variant="filled"
        padding="medium" // Aumentado de small para medium
        borderRadius="large"
        onPress={onPress}
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          borderLeftWidth: 4,
          borderLeftColor: severityColor,
          width: 300, // Largura aumentada para caber mais conteúdo
          minHeight: hasDescription ? 110 : 100, // Altura mínima baseada no conteúdo
          justifyContent: 'center', // Centraliza verticalmente o conteúdo
        }}
      >
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'flex-start', 
          gap: theme.spacing.md,
          flex: 1,
        }}>
          {/* Ícone */}
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: `${severityColor}15`,
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
            marginTop: 2,
          }}>
            <Icon name={getTypeIcon(diseaseType)} size={22} color={severityColor} />
          </View>

          {/* Conteúdo */}
          <View style={{ 
            flex: 1, 
            gap: theme.spacing.sm,
            justifyContent: 'center',
          }}>
            {/* Linha 1: Nome + Probabilidade */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: theme.spacing.xs,
            }}>
              <Typography 
                variant="body1"
                numberOfLines={2}
                style={{ 
                  color: theme.colors.text,
                  fontWeight: '600',
                  fontSize: 15,
                  flex: 1,
                  lineHeight: 20,
                }}
              >
                {disease.name || 'Doença não identificada'}
              </Typography>
              
              <View style={{
                backgroundColor: `${severityColor}15`,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: theme.borderRadius.medium,
                minWidth: 44,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Typography variant="body2" style={{ 
                  color: severityColor,
                  fontWeight: '700',
                  fontSize: 13,
                }}>
                  {probability.toFixed(0)}%
                </Typography>
              </View>
            </View>

            {/* Linha 2: Tags */}
            <View style={{ 
              flexDirection: 'row', 
              gap: theme.spacing.xs,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <Chip
                label={getTypeLabel(diseaseType)}
                icon={getTypeIcon(diseaseType)}
                variant="filled"
                size="small"
                style={{ 
                  backgroundColor: `${theme.colors.primary}15`,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
                textStyle={{ 
                  color: theme.colors.primary,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              />
              
              <Chip
                label={getSeverityLabel(severity)}
                icon="alert"
                variant="filled"
                size="small"
                style={{ 
                  backgroundColor: `${severityColor}15`,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
                textStyle={{ 
                  color: severityColor,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              />
            </View>

            {/* Linha 3: Descrição (se disponível) */}
            {disease.description && (
              <Typography 
                variant="body2"
                numberOfLines={2}
                style={{ 
                  color: theme.colors.textSecondary,
                  fontSize: 12,
                  lineHeight: 16,
                  marginTop: 2,
                }}
              >
                {disease.description}
              </Typography>
            )}
          </View>
        </View>
      </Card>
    );
  }

  // Variante vertical (para visualização detalhada)
  return (
    <Card
      variant="elevated"
      padding="large"
      borderRadius="xlarge"
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        overflow: 'hidden',
        marginBottom: theme.spacing.sm,
      }}
    >
      {/* Indicador de severidade */}
      <View style={{
        height: 5,
        backgroundColor: severityColor,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: theme.borderRadius.xlarge,
        borderTopRightRadius: theme.borderRadius.xlarge,
      }} />

      <View style={{ gap: theme.spacing.md, marginTop: 4 }}>
        {/* Cabeçalho */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          gap: theme.spacing.sm,
        }}>
          <View style={{ flex: 1 }}>
            <Typography variant="h4" style={{ 
              color: theme.colors.text,
              fontWeight: '700',
              fontSize: 17,
              marginBottom: theme.spacing.xs,
              lineHeight: 22,
            }}>
              {disease.name || 'Doença não identificada'}
            </Typography>
            
            {disease.scientificName && (
              <Typography variant="caption" style={{ 
                color: theme.colors.textSecondary,
                fontStyle: 'italic',
                fontSize: 13,
                lineHeight: 16,
              }}>
                {disease.scientificName}
              </Typography>
            )}
          </View>

          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: `${severityColor}15`,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: severityColor,
            flexShrink: 0,
          }}>
            <Typography variant="body1" style={{ 
              color: severityColor,
              fontWeight: '800',
              fontSize: 15,
            }}>
              {probability.toFixed(0)}%
            </Typography>
          </View>
        </View>

        {/* Tags */}
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          gap: theme.spacing.sm,
        }}>
          <Chip
            label={getTypeLabel(diseaseType)}
            icon={getTypeIcon(diseaseType)}
            variant="filled"
            size="medium"
            style={{ 
              backgroundColor: `${theme.colors.primary}15`,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            textStyle={{ 
              color: theme.colors.primary,
              fontSize: 13,
              fontWeight: '600',
            }}
          />
          
          <Chip
            label={getSeverityLabel(severity)}
            icon="alert"
            variant="filled"
            size="medium"
            style={{ 
              backgroundColor: `${severityColor}15`,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            textStyle={{ 
              color: severityColor, 
              fontWeight: '700',
              fontSize: 13,
            }}
          />
        </View>

        {/* Descrição */}
        {disease.description && (
          <Typography variant="body2" style={{ 
            color: theme.colors.textSecondary,
            lineHeight: 22,
            fontSize: 14,
          }}>
            {disease.description}
          </Typography>
        )}

        {/* Botão de ação */}
        {onPress && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.outlineVariant,
          }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              gap: 6,
            }}>
              <Typography 
                variant="body2" 
                style={{ 
                  color: theme.colors.primary,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                Ver detalhes completos
              </Typography>
              <Icon name="chevron-right" size={18} color={theme.colors.primary} />
            </View>
          </View>
        )}
      </View>
    </Card>
  );
};

export default React.memo(DiseaseCard);