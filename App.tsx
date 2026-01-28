// /App.tsx
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppContainer from './src/main';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppContainer />
    </SafeAreaProvider>
  );
}