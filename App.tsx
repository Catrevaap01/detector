// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Manter a tela de splash visível enquanto carregamos as fontes
SplashScreen.preventAutoHideAsync();

// Configurar tema do React Native Paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    accent: '#FF9800',
    background: '#f5f5f5',
    surface: '#FFFFFF',
    text: '#333333',
  },
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        // Carregar fontes do MaterialCommunityIcons
        await Font.loadAsync({
          ...MaterialCommunityIcons.font,
          // Você pode adicionar outras fontes aqui se necessário
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar fontes:', error);
      } finally {
        // Esconder a tela de splash
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Ou um componente de loading
  }

  return (
    <SafeAreaProvider>
      <PaperProvider
        theme={theme}
        settings={{
          icon: (props) => <MaterialCommunityIcons {...props} />,
        }}
      >
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}