// src/hooks/useSplashScreen.ts
import { useState, useCallback } from 'react';

interface UseSplashScreenReturn {
  splashVisible: boolean;
  showSplash: (message?: string, type?: 'app' | 'screen') => void;
  hideSplash: () => void;
}

export const useSplashScreen = (): UseSplashScreenReturn => {
  const [splashVisible, setSplashVisible] = useState(false);
  const [splashMessage, setSplashMessage] = useState('Carregando...');
  const [splashType, setSplashType] = useState<'app' | 'screen'>('app');

  const showSplash = useCallback((message?: string, type?: 'app' | 'screen') => {
    if (message) setSplashMessage(message);
    if (type) setSplashType(type);
    setSplashVisible(true);
  }, []);

  const hideSplash = useCallback(() => {
    setSplashVisible(false);
    // Resetar para valores padrão após esconder
    setTimeout(() => {
      setSplashMessage('Carregando...');
      setSplashType('app');
    }, 500);
  }, []);

  return {
    splashVisible,
    showSplash,
    hideSplash,
  };
};