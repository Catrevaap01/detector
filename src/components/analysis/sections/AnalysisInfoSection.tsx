// src/components/analysis/sections/AnalysisInfoSection.tsx
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography'; // Verifique este caminho
import Card from '../../common/cards/Card';
import Chip from '../../common/chips/Chip';
import { HistoryItem } from '../../../services/historyStorageService';

interface AnalysisInfoSectionProps {
  analysis: HistoryItem;
  theme: any;
}

const AnalysisInfoSection: React.FC<AnalysisInfoSectionProps> = ({ analysis, theme }) => {
  const getConfidence = () => {
    if (!analysis?.analysis?.identification) return 0;
    const identification = analysis.analysis.identification;
    return identification.confidence || identification.probability || 0;
  };

  const getIsHealthy = () => {
    return analysis?.analysis?.health?.isHealthy || false;
  };

  const confidence = getConfidence();
  const isHealthy = getIsHealthy();

  return (
    <Card 
      variant="filled" 
      padding="medium"
      borderRadius="large"
      style={{
        backgroundColor: theme.colors.surfaceVariant,
      }}
    >
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.sm,
      }}>
        <Icon name="information" size={20} color={theme.colors.primary} />
        <Typography variant="body1" style={{
          color: theme.colors.text,
          fontWeight: '600',
        }}>
          Informações da Análise
        </Typography>
      </View>

      <View style={{
        gap: theme.spacing.sm,
      }}>
        {/* Confiança */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: theme.spacing.xs,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: `${theme.colors.primary}15`,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="shield-check" size={16} color={theme.colors.primary} />
            </View>
            <Typography variant="body2" style={{ color: theme.colors.textSecondary }}>
              Confiança
            </Typography>
          </View>
          <Typography variant="body1" style={{ 
            color: theme.colors.primary,
            fontWeight: '600',
          }}>
            {confidence}%
          </Typography>
        </View>

        {/* Status */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: theme.spacing.xs,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: isHealthy ? `${theme.colors.success}15` : `${theme.colors.error}15`,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon 
                name={isHealthy ? "check-circle" : "alert-circle"} 
                size={16} 
                color={isHealthy ? theme.colors.success : theme.colors.error} 
              />
            </View>
            <Typography variant="body2" style={{ color: theme.colors.textSecondary }}>
              Status
            </Typography>
          </View>
          <Chip
            label={isHealthy ? 'Saudável' : 'Problemas'}
            icon={isHealthy ? 'check-circle' : 'alert-circle'}
            variant="filled"
            size="small"
            style={{
              backgroundColor: isHealthy ? theme.colors.successLight : theme.colors.errorLight,
              borderWidth: 0,
              paddingHorizontal: 8,
            }}
            textStyle={{
              color: isHealthy ? theme.colors.success : theme.colors.error,
              fontWeight: '600',
              fontSize: 12,
            }}
          />
        </View>

        {/* Data */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: theme.spacing.xs,
          borderBottomWidth: analysis.location ? 1 : 0,
          borderBottomColor: theme.colors.outlineVariant,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: `${theme.colors.info}15`,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Icon name="calendar" size={16} color={theme.colors.info} />
            </View>
            <Typography variant="body2" style={{ color: theme.colors.textSecondary }}>
              Data
            </Typography>
          </View>
          <Typography variant="body2" style={{ 
            color: theme.colors.text,
            fontWeight: '500',
          }}>
            {new Date(analysis.timestamp).toLocaleString('pt-PT').slice(0, 16)}
          </Typography>
        </View>

        {/* Localização */}
        {analysis.location && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: `${theme.colors.warning}15`,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Icon name="map-marker" size={16} color={theme.colors.warning} />
              </View>
              <Typography variant="body2" style={{ color: theme.colors.textSecondary }}>
                Local
              </Typography>
            </View>
            <Typography variant="body2" style={{ 
              color: theme.colors.text,
              fontWeight: '500',
              fontFamily: 'monospace',
              fontSize: 12,
            }}>
              {analysis.location.latitude.toFixed(4)}, {analysis.location.longitude.toFixed(4)}
            </Typography>
          </View>
        )}
      </View>
    </Card>
  );
};

export default AnalysisInfoSection;