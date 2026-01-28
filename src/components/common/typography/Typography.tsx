// src/components/common/typography/Typography.tsx
import React from 'react';
import {
  Text,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption';

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
  color?: string;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  children,
  style,
  numberOfLines,
  color,
}) => {
  const { currentTheme } = useTheme();

  const getVariantStyles = (): TextStyle => {
    const typography = currentTheme.typography[variant];
    return {
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight as any,
      color: color || currentTheme.colors.text,
    };
  };

  return (
    <Text
      style={[getVariantStyles(), style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

export default Typography;