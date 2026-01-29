// src/components/detection/sections/SuggestionsSection.tsx
import React from 'react';
import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CompleteAnalysis, Suggestion } from '../../../services/DetectionService';
import { useTheme } from '../../../hooks/useTheme';
import AnalysisResultCard from '../cards/AnalysisResultCard';
import Typography from '../../common/typography/Typography';
import Chip from '../../common/chips/Chip';

interface SuggestionsSectionProps {
  analysis: CompleteAnalysis;
  location?: any;
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ analysis, location }) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: `${theme.colors.background}80`,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    suggestionIcon: {
      marginRight: theme.spacing.sm,
      marginTop: 2,
      flexShrink: 0,
    },
    suggestionContent: {
      flex: 1,
      minWidth: 0, // Importante para flex shrink funcionar
    },
    suggestionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    suggestionNameContainer: {
      flex: 1,
      marginRight: 8,
      minWidth: 0, // Permite que o texto quebre
    },
    suggestionName: {
      fontWeight: '600',
      color: theme.colors.text,
      fontSize: 14,
      flexWrap: 'wrap',
    },
    suggestionProbability: {
      backgroundColor: theme.colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      minWidth: 40,
      alignItems: 'center',
      flexShrink: 0,
    },
    probabilityText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    suggestionDescription: {
      color: theme.colors.textSecondary,
      fontSize: 13,
      marginBottom: 4,
      lineHeight: 18,
    },
    suggestionChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 4,
    },
    pestChip: {
      backgroundColor: `${theme.colors.error}20`,
    },
    analysisInfo: {
      marginTop: currentTheme.spacing.lg,
      paddingTop: currentTheme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentTheme.colors.border,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: currentTheme.spacing.sm,
    },
    infoLabel: {
      color: currentTheme.colors.textSecondary,
    },
  }));

  // Determinar ícone baseado no tipo de sugestão
  const getSuggestionIcon = (suggestion: Suggestion) => {
    if (suggestion.isPest) {
      return { name: 'bug', color: currentTheme.colors.error };
    }
    if (suggestion.name === analysis.identification.name) {
      return { name: 'leaf', color: currentTheme.colors.success };
    }
    return { name: 'information', color: currentTheme.colors.primary };
  };

  // Função para truncar texto muito longo
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <AnalysisResultCard
      title="Sugestões e Alternativas"
      icon="lightbulb-on"
      iconColor={currentTheme.colors.warning}
    >
      {analysis.suggestions.length === 0 ? (
        <Typography variant="body2" style={{ 
          color: currentTheme.colors.textSecondary,
          textAlign: 'center',
          padding: currentTheme.spacing.md 
        }}>
          Nenhuma sugestão adicional disponível
        </Typography>
      ) : (
        <View>
          {analysis.suggestions.map((suggestion, index) => {
            const icon = getSuggestionIcon(suggestion);
            
            return (
              <View 
                key={index} 
                style={[
                  styles.suggestionItem,
                  index === analysis.suggestions.length - 1 && { marginBottom: 0 }
                ]}
              >
                <View style={styles.suggestionIcon}>
                  <Icon name={icon.name} size={18} color={icon.color} />
                </View>
                
                <View style={styles.suggestionContent}>
                  <View style={styles.suggestionHeader}>
                    <View style={styles.suggestionNameContainer}>
                      <Typography 
                        variant="body2" 
                        style={styles.suggestionName}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {truncateText(suggestion.name, 50)}
                      </Typography>
                    </View>
                    
                    {suggestion.probability > 0 && (
                      <View style={styles.suggestionProbability}>
                        <Typography variant="caption" style={styles.probabilityText}>
                          {suggestion.probability}%
                        </Typography>
                      </View>
                    )}
                  </View>
                  
                  {suggestion.description && (
                    <Typography 
                      variant="body2" 
                      style={styles.suggestionDescription}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {truncateText(suggestion.description, 120)}
                    </Typography>
                  )}
                  
                  {suggestion.scientificName && suggestion.scientificName !== suggestion.name && (
                    <Typography 
                      variant="caption" 
                      style={{ 
                        color: currentTheme.colors.success,
                        fontStyle: 'italic',
                        marginBottom: 4,
                        fontSize: 11,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {truncateText(suggestion.scientificName, 40)}
                    </Typography>
                  )}
                  
                  <View style={styles.suggestionChips}>
                    {suggestion.isPest && (
                      <Chip
                        label="Praga"
                        style={[styles.pestChip, { marginRight: 4 }]}
                        size="small"
                        textStyle={{ 
                          color: currentTheme.colors.error, 
                          fontSize: 10,
                          fontWeight: 'bold'
                        }}
                        icon="bug"
                        iconSize={12}
                      />
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
      
      {/* Informações da análise */}
      <View style={styles.analysisInfo}>
        <View style={styles.infoRow}>
          <Typography variant="caption" style={styles.infoLabel}>
            Modo de análise:
          </Typography>
          <Chip
            label="PlantNet API"
            icon="api"
            variant="filled"
            size="small"
            textStyle={{ fontSize: 11 }}
            iconSize={12}
          />
        </View>
        
        <View style={styles.infoRow}>
          <Typography variant="caption" style={styles.infoLabel}>
            Confiança geral:
          </Typography>
          <Typography variant="caption" style={{ 
            color: currentTheme.colors.success, 
            fontWeight: 'bold',
            fontSize: 12,
          }}>
            {analysis.health.healthScore || analysis.health.score || 0}%
          </Typography>
        </View>
        
        {analysis.location && (
          <View style={styles.infoRow}>
            <Typography variant="caption" style={styles.infoLabel}>
              Localização:
            </Typography>
            <Chip
              label={`${analysis.location.latitude?.toFixed(4) || 'N/A'}, ${analysis.location.longitude?.toFixed(4) || 'N/A'}`}
              icon="map-marker"
              variant="outlined"
              size="small"
              textStyle={{ fontSize: 10 }}
              iconSize={10}
            />
          </View>
        )}
        
        {location && analysis.location === undefined && (
          <View style={styles.infoRow}>
            <Typography variant="caption" style={styles.infoLabel}>
              Localização:
            </Typography>
            <Chip
              label={`${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`}
              icon="map-marker"
              variant="outlined"
              size="small"
              textStyle={{ fontSize: 10 }}
              iconSize={10}
            />
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Typography variant="caption" style={styles.infoLabel}>
            Data da análise:
          </Typography>
          <Typography variant="caption" style={{ 
            color: currentTheme.colors.textSecondary,
            fontSize: 11,
          }}>
            {new Date(analysis.timestamp).toLocaleString('pt-BR')}
          </Typography>
        </View>
      </View>
    </AnalysisResultCard>
  );
};

export default SuggestionsSection;