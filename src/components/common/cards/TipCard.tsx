// src/components/common/cards/TipCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import { useTheme } from '../../../hooks/useTheme';

interface TipCardProps {
  icon?: string;
  title?: string;
  children: React.ReactNode;
}

const TipCard: React.FC<TipCardProps> = ({
  icon = 'lightbulb-on',
  title = 'Dica',
  children,
}) => {
  const { currentTheme } = useTheme();

  return (
    <Card
      variant="filled"
      padding="medium"
      borderRadius="medium"
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: currentTheme.colors.warningLight }]}>
          <Icon name={icon} size={20} color={currentTheme.colors.warning} />
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
        >
          {title}
        </Text>
      </View>
      
      <View style={styles.content}>
        {typeof children === 'string' ? (
          <Text
            style={[
              styles.text,
              {
                color: currentTheme.colors.textSecondary,
                fontSize: currentTheme.typography.body2.fontSize,
              },
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
  },
  content: {},
  text: {
    lineHeight: 20,
  },
});

export default TipCard;