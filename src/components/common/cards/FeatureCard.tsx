// src/components/common/cards/FeatureCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import { useTheme } from '../../../hooks/useTheme';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color,
  onPress,
  disabled = false,
}) => {
  const { currentTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={styles.container}
    >
      <Card
        variant="elevated"
        padding="medium"
        borderRadius="large"
        style={[
          styles.card,
          disabled && styles.disabled,
        ]}
      >
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
            <Icon name={icon} size={28} color={color} />
          </View>
          
          <Text
            style={[
              styles.title,
              {
                color: currentTheme.colors.text,
                fontSize: currentTheme.typography.h4.fontSize,
                fontWeight: currentTheme.typography.h4.fontWeight,
              },
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
          
          <Text
            style={[
              styles.description,
              {
                color: currentTheme.colors.textSecondary,
                fontSize: currentTheme.typography.caption.fontSize,
              },
            ]}
            numberOfLines={3}
          >
            {description}
          </Text>
          
          <View style={styles.arrowContainer}>
            <Icon
              name="chevron-right"
              size={20}
              color={currentTheme.colors.textSecondary}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '48%',
    marginBottom: 16,
  },
  card: {
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    textAlign: 'center',
    lineHeight: 16,
    flex: 1,
  },
  arrowContainer: {
    marginTop: 12,
  },
});

export default FeatureCard;