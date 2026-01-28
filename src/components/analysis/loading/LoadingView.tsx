// src/components/analysis/loading/LoadingView.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Typography from '../../common/typography/Typography';

interface LoadingViewProps {
  theme: any;
  message?: string;
}

const LoadingView: React.FC<LoadingViewProps> = ({ theme, message = 'Carregando análise...' }) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.lg,
    }}>
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${theme.colors.primary}10`,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: `${theme.colors.primary}30`,
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
      
      <View>
        <Typography variant="h4" style={{ 
          textAlign: 'center',
          color: theme.colors.text,
          fontWeight: '600',
          marginBottom: theme.spacing.xs,
        }}>
          Carregando análise
        </Typography>
        <Typography variant="body2" style={{ 
          textAlign: 'center',
          color: theme.colors.textSecondary,
          maxWidth: 250,
        }}>
          {message}
        </Typography>
      </View>
    </View>
  );
};

export default LoadingView;