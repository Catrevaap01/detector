// src/components/analysis/display/PlantInfoDisplay.tsx
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography';
import Card from '../../common/cards/Card';
import Chip from '../../common/chips/Chip';

interface PlantInfoDisplayProps {
  plantInfo: {
    commonName?: string;
    scientificName?: string;
    description?: string;
    family?: string;
    genus?: string;
    species?: string;
    confidence?: number;
    isHealthy?: boolean;
  };
  theme: any;
  variant?: 'compact' | 'detailed' | 'summary';
}

const PlantInfoDisplay: React.FC<PlantInfoDisplayProps> = ({
  plantInfo,
  theme,
  variant = 'detailed'
}) => {
  const {
    commonName = 'Planta não identificada',
    scientificName,
    description,
    family,
    genus,
    species,
    confidence = 0,
    isHealthy = false,
  } = plantInfo;

  if (variant === 'compact') {
    return (
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: theme.borderRadius.large,
      }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: `${theme.colors.primary}15`,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: `${theme.colors.primary}30`,
        }}>
          <Icon name="leaf" size={24} color={theme.colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Typography variant="body1" style={{ 
            color: theme.colors.text,
            fontWeight: '600',
            marginBottom: 2,
          }}>
            {commonName}
          </Typography>
          
          {scientificName && (
            <Typography variant="caption" style={{ 
              color: theme.colors.textSecondary,
              fontStyle: 'italic',
            }}>
              {scientificName}
            </Typography>
          )}
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Chip
            label={`${confidence.toFixed(0)}%`}
            variant="filled"
            size="small"
            style={{
              backgroundColor: confidence >= 80 ? `${theme.colors.success}15` : 
                             confidence >= 60 ? `${theme.colors.warning}15` : 
                             `${theme.colors.error}15`,
              marginBottom: theme.spacing.xs,
            }}
            textStyle={{
              color: confidence >= 80 ? theme.colors.success : 
                    confidence >= 60 ? theme.colors.warning : 
                    theme.colors.error,
              fontWeight: '700',
            }}
          />
          
          <Chip
            label={isHealthy ? 'Saudável' : 'Atenção'}
            icon={isHealthy ? 'check-circle' : 'alert-circle'}
            variant="outlined"
            size="small"
            style={{
              borderColor: isHealthy ? theme.colors.success : theme.colors.warning,
            }}
            textStyle={{
              color: isHealthy ? theme.colors.success : theme.colors.warning,
              fontSize: 10,
            }}
          />
        </View>
      </View>
    );
  }

  if (variant === 'summary') {
    return (
      <Card
        variant="elevated"
        padding="medium"
        borderRadius="large"
        style={{
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        }}
      >
        <View style={{ gap: theme.spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${theme.colors.primary}15`,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="leaf" size={20} color={theme.colors.primary} />
            </View>
            
            <Typography variant="h4" style={{ 
              color: theme.colors.text,
              fontWeight: '700',
              flex: 1,
            }}>
              {commonName}
            </Typography>
          </View>

          {scientificName && (
            <Typography variant="body2" style={{ 
              color: theme.colors.textSecondary,
              fontStyle: 'italic',
              paddingLeft: 56,
            }}>
              {scientificName}
            </Typography>
          )}

          {(family || genus || species) && (
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              gap: theme.spacing.xs,
              paddingLeft: 56,
            }}>
              {family && (
                <Chip
                  label={`Família: ${family}`}
                  icon="family-tree"
                  variant="outlined"
                  size="small"
                />
              )}
              
              {genus && (
                <Chip
                  label={`Gênero: ${genus}`}
                  icon="tag"
                  variant="outlined"
                  size="small"
                />
              )}
              
              {species && (
                <Chip
                  label={`Espécie: ${species}`}
                  icon="leaf"
                  variant="outlined"
                  size="small"
                />
              )}
            </View>
          )}

          {description && (
            <Typography variant="caption" style={{ 
              color: theme.colors.textSecondary,
              lineHeight: 16,
              paddingLeft: 56,
            }}>
              {description}
            </Typography>
          )}
        </View>
      </Card>
    );
  }

  // Variante detailed (padrão)
  return (
    <Card
      variant="elevated"
      padding="large"
      borderRadius="xlarge"
      style={{
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        overflow: 'hidden',
      }}
    >
      {/* Header decorativo */}
      <View style={{
        height: 4,
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }} />

      <View style={{ gap: theme.spacing.lg }}>
        {/* Cabeçalho principal */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flex: 1 }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: `${theme.colors.primary}10`,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: `${theme.colors.primary}30`,
            }}>
              <Icon name="leaf" size={28} color={theme.colors.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Typography variant="h3" style={{ 
                color: theme.colors.text,
                fontWeight: '800',
                marginBottom: theme.spacing.xs,
              }}>
                {commonName}
              </Typography>
              
              {scientificName && (
                <Typography variant="body1" style={{ 
                  color: theme.colors.textSecondary,
                  fontStyle: 'italic',
                }}>
                  {scientificName}
                </Typography>
              )}
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Typography variant="caption" style={{ 
              color: theme.colors.textTertiary,
              marginBottom: theme.spacing.xs,
            }}>
              Confiança
            </Typography>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: confidence >= 80 ? `${theme.colors.success}15` : 
                             confidence >= 60 ? `${theme.colors.warning}15` : 
                             `${theme.colors.error}15`,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: confidence >= 80 ? theme.colors.success : 
                          confidence >= 60 ? theme.colors.warning : 
                          theme.colors.error,
            }}>
              <Typography variant="h4" style={{ 
                color: confidence >= 80 ? theme.colors.success : 
                      confidence >= 60 ? theme.colors.warning : 
                      theme.colors.error,
                fontWeight: '800',
              }}>
                {confidence}%
              </Typography>
            </View>
          </View>
        </View>

        {/* Informações taxonômicas */}
        {(family || genus || species) && (
          <View style={{
            backgroundColor: theme.colors.surfaceVariant,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.large,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
          }}>
            <Typography variant="body2" style={{ 
              color: theme.colors.textSecondary,
              fontWeight: '600',
              marginBottom: theme.spacing.sm,
              textTransform: 'uppercase',
            }}>
              Classificação Taxonômica
            </Typography>
            
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              gap: theme.spacing.sm,
            }}>
              {family && (
                <View style={{
                  flex: 1,
                  minWidth: 120,
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.medium,
                  borderWidth: 1,
                  borderColor: theme.colors.outline,
                }}>
                  <Typography variant="caption" style={{ 
                    color: theme.colors.textTertiary,
                    marginBottom: 2,
                  }}>
                    Família
                  </Typography>
                  <Typography variant="body2" style={{ 
                    color: theme.colors.text,
                    fontWeight: '600',
                  }}>
                    {family}
                  </Typography>
                </View>
              )}
              
              {genus && (
                <View style={{
                  flex: 1,
                  minWidth: 120,
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.medium,
                  borderWidth: 1,
                  borderColor: theme.colors.outline,
                }}>
                  <Typography variant="caption" style={{ 
                    color: theme.colors.textTertiary,
                    marginBottom: 2,
                  }}>
                    Gênero
                  </Typography>
                  <Typography variant="body2" style={{ 
                    color: theme.colors.text,
                    fontWeight: '600',
                  }}>
                    {genus}
                  </Typography>
                </View>
              )}
              
              {species && (
                <View style={{
                  flex: 1,
                  minWidth: 120,
                  backgroundColor: theme.colors.surface,
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.medium,
                  borderWidth: 1,
                  borderColor: theme.colors.outline,
                }}>
                  <Typography variant="caption" style={{ 
                    color: theme.colors.textTertiary,
                    marginBottom: 2,
                  }}>
                    Espécie
                  </Typography>
                  <Typography variant="body2" style={{ 
                    color: theme.colors.text,
                    fontWeight: '600',
                  }}>
                    {species}
                  </Typography>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Descrição */}
        {description && (
          <View>
            <Typography variant="body2" style={{ 
              color: theme.colors.textSecondary,
              fontWeight: '600',
              marginBottom: theme.spacing.sm,
              textTransform: 'uppercase',
            }}>
              Descrição
            </Typography>
            <Typography variant="body1" style={{ 
              color: theme.colors.text,
              lineHeight: 24,
              textAlign: 'justify',
            }}>
              {description}
            </Typography>
          </View>
        )}

        {/* Status de saúde */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          padding: theme.spacing.md,
          backgroundColor: isHealthy ? `${theme.colors.success}10` : `${theme.colors.warning}10`,
          borderRadius: theme.borderRadius.large,
          borderWidth: 1,
          borderColor: isHealthy ? `${theme.colors.success}30` : `${theme.colors.warning}30`,
        }}>
          <Icon 
            name={isHealthy ? "check-circle" : "alert-circle"} 
            size={24} 
            color={isHealthy ? theme.colors.success : theme.colors.warning} 
          />
          <View style={{ flex: 1 }}>
            <Typography variant="body1" style={{ 
              color: theme.colors.text,
              fontWeight: '600',
              marginBottom: 2,
            }}>
              {isHealthy ? 'Planta Saudável' : 'Atenção Necessária'}
            </Typography>
            <Typography variant="caption" style={{ 
              color: theme.colors.textSecondary,
            }}>
              {isHealthy 
                ? 'A análise não identificou problemas significativos na planta.'
                : 'Foram detectados problemas que requerem atenção.'}
            </Typography>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default React.memo(PlantInfoDisplay);