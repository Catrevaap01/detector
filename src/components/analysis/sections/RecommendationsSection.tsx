// src/components/analysis/sections/RecommendationsSection.tsx
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography';
import RecommendationCard from '../cards/RecommendationCard';

interface RecommendationsSectionProps {
  recommendations: string[];
  theme: any;
  type?: 'general' | 'treatment' | 'prevention';
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ 
  recommendations, 
  theme,
  type = 'general'
}) => {
  // Se não houver recomendações
  if (!recommendations || recommendations.length === 0) {
    return (
      <View style={{ marginBottom: theme.spacing.lg }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: theme.spacing.md,
        }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${theme.colors.info}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme.spacing.sm,
          }}>
            <Icon name="information" size={24} color={theme.colors.info} />
          </View>
          <Typography variant="h4" style={{ 
            color: theme.colors.info,
            fontWeight: '600',
          }}>
            Sem Recomendações Disponíveis
          </Typography>
        </View>
        
        <Typography variant="body2" style={{ 
          color: theme.colors.textSecondary,
          lineHeight: 22,
          paddingHorizontal: theme.spacing.sm,
        }}>
          A análise não gerou recomendações específicas. Continue com os cuidados regulares da planta.
        </Typography>
      </View>
    );
  }

  // Determinar título e ícone baseado no tipo
  const getSectionConfig = () => {
    switch (type) {
      case 'treatment':
        return {
          title: 'Recomendações de Tratamento',
          icon: 'medical-bag',
          color: theme.colors.error,
        };
      case 'prevention':
        return {
          title: 'Medidas Preventivas',
          icon: 'shield-check',
          color: theme.colors.warning,
        };
      default:
        return {
          title: 'Recomendações Gerais',
          icon: 'lightbulb',
          color: theme.colors.success,
        };
    }
  };

  const config = getSectionConfig();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: theme.spacing.md,
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: `${config.color}15`,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: theme.spacing.sm,
        }}>
          <Icon name={config.icon} size={24} color={config.color} />
        </View>
        <Typography variant="h4" style={{ 
          color: config.color,
          fontWeight: '600',
          flex: 1,
        }}>
          {config.title} ({recommendations.length})
        </Typography>
      </View>

      <View>
        {recommendations.map((recommendation: string, index: number) => (
          <View key={index} style={{ marginBottom: theme.spacing.md }}>
            <RecommendationCard
              recommendation={recommendation}
              index={index}
              theme={theme}
              type={type}
              priority={index === 0 ? 'high' : index < 3 ? 'medium' : 'low'}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecommendationsSection;