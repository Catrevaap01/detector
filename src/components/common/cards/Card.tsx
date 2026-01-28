// src/components/common/cards/Card.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large' | 'xlarge';
}

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'elevated',
  padding = 'medium',
  borderRadius = 'medium',
}) => {
  const { currentTheme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: currentTheme.colors.surface,
          borderWidth: 0,
          shadowColor: currentTheme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        };
      case 'outlined':
        return {
          backgroundColor: currentTheme.colors.surface,
          borderWidth: 1,
          borderColor: currentTheme.colors.border,
          shadowColor: 'transparent',
          elevation: 0,
        };
      case 'filled':
        return {
          backgroundColor: currentTheme.colors.surfaceVariant,
          borderWidth: 0,
          shadowColor: 'transparent',
          elevation: 0,
        };
      default:
        return {};
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return currentTheme.spacing.sm;
      case 'large':
        return currentTheme.spacing.lg;
      default: // medium
        return currentTheme.spacing.md;
    }
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'small':
        return currentTheme.borderRadius.small;
      case 'large':
        return currentTheme.borderRadius.large;
      case 'xlarge':
        return currentTheme.borderRadius.xlarge;
      default: // medium
        return currentTheme.borderRadius.medium;
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      style={[
        styles.container,
        getVariantStyles(),
        {
          padding: getPadding(),
          borderRadius: getBorderRadius(),
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Card;