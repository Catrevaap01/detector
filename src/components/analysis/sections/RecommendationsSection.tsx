// src/components/analysis/sections/RecommendationsSection.tsx (atualizado)
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography';
import Card from '../../common/cards/Card';
import RecommendationCard from '../cards/RecommendationCard';

interface RecommendationsSectionProps {
  recommendations: string[];
  theme: any;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations, theme }) => {
  return (
    <View>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
      }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: `${theme.colors.success}15`,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Icon name="lightbulb" size={24} color={theme.colors.success} />
        </View>
        <Typography variant="h4" style={{ 
          color: theme.colors.success,
          fontWeight: '600',
        }}>
          Recomendações Gerais ({recommendations.length})
        </Typography>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        {recommendations.map((recommendation: string, index: number) => (
          <RecommendationCard
            key={index}
            recommendation={recommendation}
            index={index}
            theme={theme}
            type="general"
            priority={index === 0 ? 'high' : index < 3 ? 'medium' : 'low'}
          />
        ))}
      </View>
    </View>
  );
};

export default RecommendationsSection;