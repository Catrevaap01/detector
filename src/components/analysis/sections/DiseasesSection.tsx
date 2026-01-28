// src/components/analysis/sections/DiseasesSection.tsx
import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography';
import DiseaseCard from '../cards/DiseaseCard';

interface DiseasesSectionProps {
  diseases: any[];
  theme: any;
}

const DiseasesSection: React.FC<DiseasesSectionProps> = ({ diseases, theme }) => {
  const { width: screenWidth } = Dimensions.get('window');
  
  // Largura do card baseada no DiseaseCard atual (300px) com espaçamento
  const cardWidth = 300; // Mesma largura definida no DiseaseCard
  const cardGap = theme.spacing.md;
  const horizontalPadding = theme.spacing.md;
  
  // Calcula margem extra para o último item
  const extraRightPadding = horizontalPadding;

  return (
    <View style={{ 
      marginBottom: theme.spacing.lg,
      width: '100%',
    }}>
      {/* Header da seção */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        paddingHorizontal: horizontalPadding,
      }}>
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: `${theme.colors.error}15`,
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <Icon name="alert" size={22} color={theme.colors.error} />
        </View>
        <Typography variant="h4" style={{ 
          color: theme.colors.text,
          fontWeight: '700',
          fontSize: 18,
        }}>
          Problemas Identificados ({diseases.length})
        </Typography>
      </View>

      {/* Container do ScrollView com largura total */}
      <View style={{ width: '100%' }}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={cardWidth + cardGap}
          snapToAlignment="start"
          contentContainerStyle={{
            paddingLeft: horizontalPadding,
            paddingRight: horizontalPadding + extraRightPadding,
            gap: cardGap,
            alignItems: 'flex-start',
          }}
          style={{
            width: '100%',
          }}
        >
          {diseases.map((disease: any, index: number) => (
            <DiseaseCard
              key={index}
              disease={disease}
              index={index}
              theme={theme}
              variant="horizontal"
              // O DiseaseCard já tem width: 300 definido internamente
            />
          ))}
        </ScrollView>
      </View>
      
      {/* Indicador de scroll (opcional) */}
      {diseases.length > 1 && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          marginTop: theme.spacing.sm,
          paddingHorizontal: horizontalPadding,
        }}>
          <Typography variant="caption" style={{ 
            color: theme.colors.textTertiary,
            fontSize: 11,
          }}>
            Deslize para ver mais
          </Typography>
          <Icon name="chevron-right" size={14} color={theme.colors.textTertiary} />
        </View>
      )}
    </View>
  );
};

export default DiseasesSection;