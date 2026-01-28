// src/main.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './navigation/MainTabNavigator';
import CustomSplash from './components/splash/SplashScreen';

// Componente principal
const AppContent = () => {
  const { currentTheme, isDark } = useTheme();
  const [showSplash, setShowSplash] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Para o splash screen
  if (showSplash) {
    return (
      <SafeAreaView style={{ 
        flex: 1, 
        backgroundColor: '#F8F9FA' // Cor de fundo do splash
      }}>
        <StatusBar 
          backgroundColor="#F8F9FA"
          barStyle="dark-content"
        />
        <CustomSplash />
      </SafeAreaView>
    );
  }

  // Para o app principal
  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: currentTheme.colors.background 
    }}>
      <StatusBar 
        backgroundColor={currentTheme.colors.background}
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
};

// Container principal
export default function AppContainer() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}