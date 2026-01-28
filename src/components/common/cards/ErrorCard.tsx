// src/components/detection/cards/ErrorCard.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import Card from '../../common/cards/Card';
import Typography from '../../common/typography/Typography';

interface ErrorCardProps {
  message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.errorLight,
      marginBottom: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.error,
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
  }));

  return (
    <View style={styles.container}>
      <Icon name="alert-circle" size={24} color={currentTheme.colors.error} />
      <Typography variant="body2" style={styles.errorText}>
        {message}
      </Typography>
    </View>
  );
};

export default ErrorCard;