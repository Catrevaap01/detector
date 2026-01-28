// src/components/common/buttons/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  style,
  textStyle,
  children,
  fullWidth = false,
}) => {
  const { currentTheme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? currentTheme.colors.textDisabled : currentTheme.colors.primary,
          borderWidth: 0,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? currentTheme.colors.surfaceVariant : currentTheme.colors.secondary,
          borderWidth: 0,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? currentTheme.colors.border : currentTheme.colors.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderColor: 'transparent',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: currentTheme.spacing.xs,
          paddingHorizontal: currentTheme.spacing.sm,
          borderRadius: currentTheme.borderRadius.small,
        };
      case 'large':
        return {
          paddingVertical: currentTheme.spacing.md,
          paddingHorizontal: currentTheme.spacing.lg,
          borderRadius: currentTheme.borderRadius.medium,
        };
      default: // medium
        return {
          paddingVertical: currentTheme.spacing.sm,
          paddingHorizontal: currentTheme.spacing.md,
          borderRadius: currentTheme.borderRadius.small,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return currentTheme.colors.textDisabled;
    if (variant === 'outline' || variant === 'text') return currentTheme.colors.primary;
    return '#FFFFFF';
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return currentTheme.typography.caption.fontSize;
      case 'large':
        return currentTheme.typography.body1.fontSize;
      default:
        return currentTheme.typography.body2.fontSize;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : currentTheme.colors.primary}
        />
      ) : (
        <>
          {iconLeft && (
            <Icon
              name={iconLeft}
              size={getTextSize() + 2}
              color={getTextColor()}
              style={styles.iconLeft}
            />
          )}
          
          {children || (
            <Text
              style={[
                styles.text,
                {
                  color: getTextColor(),
                  fontSize: getTextSize(),
                  fontWeight: currentTheme.typography.body2.fontWeight,
                },
                textStyle,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          
          {iconRight && (
            <Icon
              name={iconRight}
              size={getTextSize() + 2}
              color={getTextColor()}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;