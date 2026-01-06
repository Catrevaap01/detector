import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'detector-app',
  slug: 'detector-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    EXPO_PUBLIC_PLANTNET_API_URL: process.env.EXPO_PUBLIC_PLANTNET_API_URL,
    EXPO_PUBLIC_PLANTNET_API_KEY: process.env.EXPO_PUBLIC_PLANTNET_API_KEY,
    EXPO_PUBLIC_KINDUISE_API_URL: process.env.EXPO_PUBLIC_KINDUISE_API_URL,
    EXPO_PUBLIC_KINDUISE_API_KEY: process.env.EXPO_PUBLIC_KINDUISE_API_KEY,
  },
});
