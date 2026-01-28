// src/components/detection/AnalysisResultCard.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import Card from '../../common/cards/Card';
import Typography from '../../common/typography/Typography';
import Chip from '../../common/chips/Chip';

interface AnalysisResultCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  children: React.ReactNode;
}

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  title,
  subtitle,
  icon,
  iconColor,
  children,
}) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      marginBottom: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      marginRight: theme.spacing.sm,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      color: theme.colors.text,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  }));

  return (
    <Card variant="elevated" padding="medium" borderRadius="large" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.titleContainer}>
          <Typography variant="h4" style={styles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
      </View>
      {children}
    </Card>
  );
};

export default AnalysisResultCard;