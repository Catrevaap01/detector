// src/components/common/chips/Chip.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';

interface ChipProps {
  label: string;
  icon?: string;
  onPress?: () => void;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  style?: any;
  textStyle?: any;
}

const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  onPress,
  variant = 'filled',
  size = 'medium',
  style,
  textStyle,
}) => {
  const { currentTheme } = useTheme();

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: variant === 'filled' ? currentTheme.colors.surfaceVariant : 'transparent',
          borderWidth: variant === 'outlined' ? 1 : 0,
          borderColor: currentTheme.colors.border,
          paddingVertical: size === 'small' ? 4 : 6,
          paddingHorizontal: size === 'small' ? 8 : 12,
          borderRadius: currentTheme.borderRadius.large,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      {icon && (
        <Icon
          name={icon}
          size={size === 'small' ? 14 : 16}
          color={currentTheme.colors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            fontSize: size === 'small' ? 11 : 12,
            color: currentTheme.colors.textSecondary,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '500',
  },
});

export default Chip;