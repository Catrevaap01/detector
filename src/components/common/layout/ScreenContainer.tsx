// src/components/layout/ScreenContainer.tsx
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../hooks/useTheme';

interface ScreenContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentPadding?: boolean;
  safeArea?: boolean;
  statusBarStyle?: 'light' | 'dark' | 'auto';
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  contentPadding = true,
  safeArea = true,
  statusBarStyle = 'auto',
  ...scrollProps
}) => {
  const { currentTheme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Determinar estilo da status bar
  const barStyle = statusBarStyle === 'auto' 
    ? (isDark ? 'light-content' : 'dark-content')
    : statusBarStyle === 'light' ? 'light-content' : 'dark-content';

  // Aplicar estilo da status bar
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.colors.background);
    }
    StatusBar.setBarStyle(barStyle);
  }, [currentTheme, barStyle]);

  const ContentWrapper = scrollable ? ScrollView : View;

  // Calcular padding baseado em safeArea
  const safeAreaPadding = {
    paddingTop: safeArea ? insets.top : 0,
    paddingBottom: safeArea ? insets.bottom : 0,
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <ContentWrapper
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          contentPadding && { padding: currentTheme.spacing.md },
          safeAreaPadding,
        ]}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {children}
      </ContentWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default ScreenContainer;