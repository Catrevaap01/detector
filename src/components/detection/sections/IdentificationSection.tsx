// src/components/detection/sections/IdentificationSection.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { CompleteAnalysis } from '../../../services/DetectionService';
import { useTheme } from '../../../hooks/useTheme';
import AnalysisResultCard from '../cards/AnalysisResultCard';
import Typography from '../../common/typography/Typography';
import Chip from '../../common/chips/Chip';

interface IdentificationSectionProps {
  analysis: CompleteAnalysis;
}

const IdentificationSection: React.FC<IdentificationSectionProps> = ({ analysis }) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.md,
    },
    infoItem: {
      width: '50%',
      marginBottom: theme.spacing.md,
    },
    infoLabel: {
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    infoValue: {
      color: theme.colors.text,
    },
    confidenceBadge: {
      backgroundColor: theme.colors.successLight,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    confidenceText: {
      color: theme.colors.success,
      fontWeight: 'bold',
    },
    commonNamesContainer: {
      marginTop: theme.spacing.sm,
    },
    subLabel: {
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  }));

  // Extrair dados corretamente da estrutura
  const identification = analysis.identification;
  const confidence = identification.confidence;
  const scientificName = identification.scientificName;
  const commonName = identification.name;
  const family = identification.description?.replace('Família: ', '') || 'Não identificada';
  
  // Extrair nomes comuns do array ou do nome principal
  const commonNames = identification.commonNames && identification.commonNames.length > 0 
    ? identification.commonNames 
    : [commonName];

  return (
    <AnalysisResultCard
      title="Identificação da Planta"
      icon="leaf"
      iconColor={currentTheme.colors.success}
    >
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Typography variant="caption" style={styles.infoLabel}>
            Nome Comum
          </Typography>
          <Typography variant="body1" style={styles.infoValue}>
            {commonName}
          </Typography>
        </View>
        
        <View style={styles.infoItem}>
          <Typography variant="caption" style={styles.infoLabel}>
            Nome Científico
          </Typography>
          <Typography variant="body2" style={{ color: currentTheme.colors.success, fontStyle: 'italic' }}>
            {scientificName || 'Não identificado'}
          </Typography>
        </View>
        
        <View style={styles.infoItem}>
          <Typography variant="caption" style={styles.infoLabel}>
            Família
          </Typography>
          <Typography variant="body2" style={styles.infoValue}>
            {family}
          </Typography>
        </View>
        
        <View style={styles.infoItem}>
          <Typography variant="caption" style={styles.infoLabel}>
            Confiança
          </Typography>
          <View style={styles.confidenceBadge}>
            <Typography variant="caption" style={styles.confidenceText}>
              {confidence}%
            </Typography>
          </View>
        </View>
      </View>
      
      {commonNames.length > 0 && (
        <View style={styles.commonNamesContainer}>
          <Typography variant="caption" style={styles.subLabel}>
            Também conhecida como:
          </Typography>
          <View style={styles.chipsContainer}>
            {commonNames.slice(0, 5).map((name, index) => (
              <Chip
                key={index}
                label={name}
                style={{ marginRight: 8, marginBottom: 8 }}
                size="small"
              />
            ))}
          </View>
        </View>
      )}
      
      {identification.description && (
        <View style={{ marginTop: currentTheme.spacing.sm }}>
          <Typography variant="caption" style={styles.infoLabel}>
            Descrição
          </Typography>
          <Typography variant="body2" style={styles.infoValue}>
            {identification.description}
          </Typography>
        </View>
      )}
    </AnalysisResultCard>
  );
};

export default IdentificationSection;