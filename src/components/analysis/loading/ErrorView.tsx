// src/components/analysis/loading/ErrorView.tsx
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography';
import Button from '../../common/buttons/Button';

interface ErrorViewProps {
  theme: any;
  onGoBack: () => void;
  message?: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ theme, onGoBack, message = 'Análise não encontrada' }) => {
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
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: `${theme.colors.error}10`,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: `${theme.colors.error}30`,
      }}>
        <Icon name="alert-circle" size={48} color={theme.colors.error} />
      </View>
      
      <View style={{ alignItems: 'center', gap: theme.spacing.sm }}>
        <Typography variant="h3" style={{ 
          textAlign: 'center',
          color: theme.colors.text,
          fontWeight: '700',
        }}>
          Oops!
        </Typography>
        <Typography variant="body1" style={{ 
          textAlign: 'center',
          color: theme.colors.textSecondary,
          maxWidth: 250,
        }}>
          {message}
        </Typography>
      </View>
      
      <View style={{ width: '100%', maxWidth: 200 }}>
        <Button
          variant="primary"
          title="Voltar"
          onPress={onGoBack}
          iconLeft="arrow-left"
        />
      </View>
    </View>
  );
};

export default ErrorView;