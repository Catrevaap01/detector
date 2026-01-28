// src/components/detection/DiseaseCard.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import Card from '../common/cards/Card';
import Typography from '../common/typography/Typography';
import Chip from '../common/chips/Chip';

interface DiseaseCardProps {
  name: string;
  scientificName?: string;
  probability: number;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description?: string;
  treatment?: string[];
  prevention?: string[];
}

const DiseaseCard: React.FC<DiseaseCardProps> = ({
  name,
  scientificName,
  probability,
  type,
  severity,
  description,
  treatment,
  prevention,
}) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    titleContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    diseaseName: {
      color: theme.colors.text,
      marginBottom: 2,
    },
    scientificName: {
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
    probabilityContainer: {
      alignItems: 'flex-end',
    },
    probabilityLabel: {
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    probabilityBadge: {
      backgroundColor: theme.colors.warningLight,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: 8,
    },
    probabilityText: {
      color: theme.colors.warning,
      fontWeight: 'bold',
    },
    metaContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    descriptionContainer: {
      marginBottom: theme.spacing.sm,
    },
    descriptionLabel: {
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    descriptionText: {
      color: theme.colors.text,
      lineHeight: 20,
    },
    treatmentContainer: {
      backgroundColor: theme.colors.successLight,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.small,
      marginBottom: theme.spacing.sm,
    },
    treatmentLabel: {
      color: theme.colors.success,
      marginBottom: theme.spacing.xs,
    },
    treatmentItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    treatmentText: {
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
      flex: 1,
      lineHeight: 18,
    },
    preventionContainer: {
      backgroundColor: theme.colors.info + '20',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.small,
    },
    preventionLabel: {
      color: theme.colors.info,
      marginBottom: theme.spacing.xs,
    },
    preventionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    preventionText: {
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
      flex: 1,
      lineHeight: 18,
    },
  }));

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fungal': return 'Fúngico';
      case 'bacterial': return 'Bacteriano';
      case 'viral': return 'Viral';
      case 'pest': return 'Praga';
      default: return 'Outro';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return { bg: currentTheme.colors.errorLight, text: currentTheme.colors.error };
      case 'medium':
        return { bg: currentTheme.colors.warningLight, text: currentTheme.colors.warning };
      case 'low':
        return { bg: currentTheme.colors.successLight, text: currentTheme.colors.success };
      default:
        return { bg: currentTheme.colors.border, text: currentTheme.colors.text };
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Desconhecida';
    }
  };

  const severityColors = getSeverityColor(severity);

  return (
    <Card variant="filled" padding="medium" borderRadius="medium" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Typography variant="h4" style={styles.diseaseName}>
            {name}
          </Typography>
          {scientificName && (
            <Typography variant="caption" style={styles.scientificName}>
              {scientificName}
            </Typography>
          )}
        </View>
        <View style={styles.probabilityContainer}>
          <Typography variant="caption" style={styles.probabilityLabel}>
            Probabilidade
          </Typography>
          <View style={styles.probabilityBadge}>
            <Typography variant="caption" style={styles.probabilityText}>
              {probability.toFixed(0)}%
            </Typography>
          </View>
        </View>
      </View>

      <View style={styles.metaContainer}>
        <Chip
          label={getTypeLabel(type)}
          icon="tag"
          variant="outlined"
          size="small"
        />
        <Chip
          label={`${getSeverityLabel(severity)} severidade`}
          icon="alert"
          variant="filled"
          size="small"
          style={{ backgroundColor: severityColors.bg }}
          textStyle={{ color: severityColors.text }}
        />
      </View>

      {description && (
        <View style={styles.descriptionContainer}>
          <Typography variant="caption" style={styles.descriptionLabel}>
            Sintomas/Descrição:
          </Typography>
          <Typography variant="body2" style={styles.descriptionText}>
            {description}
          </Typography>
        </View>
      )}

      {treatment && treatment.length > 0 && (
        <View style={styles.treatmentContainer}>
          <Typography variant="body2" style={styles.treatmentLabel}>
            💡 Recomendações de Tratamento:
          </Typography>
          {treatment.map((item, index) => (
            <View key={index} style={styles.treatmentItem}>
              <Icon name="check-circle" size={16} color={currentTheme.colors.success} />
              <Typography variant="caption" style={styles.treatmentText}>
                {item}
              </Typography>
            </View>
          ))}
        </View>
      )}

      {prevention && prevention.length > 0 && (
        <View style={styles.preventionContainer}>
          <Typography variant="body2" style={styles.preventionLabel}>
            🛡️ Medidas Preventivas:
          </Typography>
          {prevention.map((item, index) => (
            <View key={index} style={styles.preventionItem}>
              <Icon name="shield" size={16} color={currentTheme.colors.info} />
              <Typography variant="caption" style={styles.preventionText}>
                {item}
              </Typography>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

export default DiseaseCard;
