// src/components/detection/buttons/AnalyzeButton.tsx
import React from 'react';
import Button from '../../common/buttons/Button';
import { useTheme } from '../../../hooks/useTheme';

interface AnalyzeButtonProps {
  onPress: () => void;
  loading: boolean;
  disabled?: boolean;
  hasImage: boolean;
  hasAnalysis?: boolean;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  onPress,
  loading,
  disabled = false,
  hasImage,
  hasAnalysis = false,
}) => {
  const { currentTheme } = useTheme();

  if (!hasImage || hasAnalysis) return null;

  return (
    <Button
      variant="primary"
      title={loading ? 'Analisando...' : '🔍 Analisar Imagem'}
      iconLeft="magnify"
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      fullWidth
      style={{ 
        marginBottom: currentTheme.spacing.md,
        backgroundColor: loading ? currentTheme.colors.primaryLight : currentTheme.colors.primary 
      }}
    />
  );
};

export default AnalyzeButton;