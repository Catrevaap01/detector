// src/components/detection/sections/SuggestionsSection.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CompleteAnalysis } from '../../../services/DetectionService';
import { useTheme } from '../../../hooks/useTheme';
import AnalysisResultCard from '../cards/AnalysisResultCard';
import Typography from '../../common/typography/Typography';
import Chip from '../../common/chips/Chip';

interface SuggestionsSectionProps {
  analysis: CompleteAnalysis;
  location: any;
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ analysis, location }) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    suggestionsList: {
      gap: theme.spacing.sm,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    suggestionText: {
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    analysisInfo: {
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    infoLabel: {
      color: theme.colors.textSecondary,
    },
  }));

  return (
    <AnalysisResultCard
      title="Recomendações Gerais"
      icon="lightbulb-on"
      iconColor={currentTheme.colors.warning}
    >
      <View style={styles.suggestionsList}>
        {analysis.suggestions.map((suggestion, index) => (
          <View key={index} style={styles.suggestionItem}>
            <Icon name="checkbox-marked-circle" size={20} color={currentTheme.colors.success} />
            
          </View>
        ))}
      </View>
      
      {/* Informações da análise */}
      <View style={styles.analysisInfo}>
        <View style={styles.infoRow}>
          <Typography variant="caption" style={styles.infoLabel}>
            Modo de análise:
          </Typography>
          <Chip
            label={analysis.usedKindwise ? 'Diagnóstico Real' : 'Modo Simulação'}
            icon={analysis.usedKindwise ? "shield-check" : "test-tube"}
            variant="filled"
            size="small"
          />
        </View>
        
        <View style={styles.infoRow}>
          <Typography variant="caption" style={styles.infoLabel}>
            Confiança do diagnóstico:
          </Typography>
          <Typography variant="caption" style={{ color: currentTheme.colors.success, fontWeight: 'bold' }}>
            {(analysis.health.confidence * 100).toFixed(0)}%
          </Typography>
        </View>
        
        {location && (
          <View style={styles.infoRow}>
            <Typography variant="caption" style={styles.infoLabel}>
              Localização:
            </Typography>
            <Chip
              label={`${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`}
              icon="map-marker"
              variant="outlined"
              size="small"
            />
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Typography variant="caption" style={styles.infoLabel}>
            Data da análise:
          </Typography>
          <Typography variant="caption" style={{ color: currentTheme.colors.textSecondary }}>
            {new Date(analysis.timestamp).toLocaleString('pt-PT')}
          </Typography>
        </View>
      </View>
    </AnalysisResultCard>
  );
};

export default SuggestionsSection;