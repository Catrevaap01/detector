// src/components/layout/Header.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';
import Typography from '../typography/Typography';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  safeArea?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  leftComponent,
  safeArea = true,
}) => {
  const { currentTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: currentTheme.colors.surface,
        paddingTop: safeArea ? insets.top : 0,
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {leftComponent}
        </View>
        
        <View style={styles.centerSection}>
          <Typography variant="h3" style={styles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 3,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 2,
  },
});

export default Header;