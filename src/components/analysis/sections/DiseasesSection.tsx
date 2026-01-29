// src/components/analysis/sections/DiseasesSection.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography';
import DiseaseCard from '../cards/DiseaseCard';

interface DiseasesSectionProps {
  diseases: any[];
  theme: any;
}

const DiseasesSection: React.FC<DiseasesSectionProps> = ({ diseases, theme }) => {
  // Se não houver doenças
  if (!diseases || diseases.length === 0) {
    return (
      <View style={{ 
        marginBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: theme.spacing.md,
        }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: `${theme.colors.success}15`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme.spacing.sm,
          }}>
            <Icon name="check-circle" size={22} color={theme.colors.success} />
          </View>
          <Typography variant="h4" style={{ 
            color: theme.colors.text,
            fontWeight: '700',
            fontSize: 18,
          }}>
            Sem Problemas Detectados
          </Typography>
        </View>
        
        <Typography variant="body2" style={{ 
          color: theme.colors.textSecondary,
          paddingHorizontal: theme.spacing.sm,
          lineHeight: 22,
        }}>
          A análise não identificou problemas na planta. Continue com os cuidados regulares.
        </Typography>
      </View>
    );
  }

  return (
    <View style={{ 
      marginBottom: theme.spacing.lg,
    }}>
      {/* Header da seção */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
      }}>
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: `${theme.colors.error}15`,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: theme.spacing.sm,
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

      {/* Container do ScrollView */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={320} // Largura fixa + margem
        snapToAlignment="start"
        contentContainerStyle={{
          paddingLeft: theme.spacing.md,
          paddingRight: theme.spacing.md * 2,
          paddingBottom: theme.spacing.sm,
        }}
      >
        {diseases.map((disease: any, index: number) => (
          <View key={index} style={{ marginRight: theme.spacing.md }}>
            <DiseaseCard
              disease={disease}
              index={index}
              theme={theme}
              variant="horizontal"
            />
          </View>
        ))}
      </ScrollView>
      
      {/* Indicador de scroll */}
      {diseases.length > 1 && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        }}>
          <Typography variant="caption" style={{ 
            color: theme.colors.textTertiary,
            fontSize: 11,
            marginRight: 4,
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