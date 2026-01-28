// src/components/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Easing 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  visible: boolean;
  onFinish?: () => void;
  message?: string;
  type?: 'app' | 'screen';
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  visible, 
  onFinish, 
  message = 'Carregando...',
  type = 'app' 
}) => {
  const { currentTheme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const leafScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Resetar animações
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      rotateAnim.setValue(0);
      leafScale.setValue(1);

      // Animação de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();

      // Animar rotação contínua
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulsar o ícone da folha
      Animated.loop(
        Animated.sequence([
          Animated.timing(leafScale, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(leafScale, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Se for splash de app, ocultar automaticamente após delay
      if (type === 'app' && onFinish) {
        const timer = setTimeout(() => {
          hideSplash();
        }, 2500);
        
        return () => clearTimeout(timer);
      }
    } else {
      hideSplash();
    }
  }, [visible]);

  const hideSplash = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onFinish) onFinish();
    });
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const backgroundColor = type === 'app' 
    ? currentTheme.colors.primary 
    : 'rgba(255, 255, 255, 0.95)';

  const textColor = type === 'app' ? '#FFFFFF' : currentTheme.colors.text;

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { 
      backgroundColor,
      opacity: fadeAnim 
    }]}>
      <Animated.View style={[
        styles.content, 
        { 
          transform: [
            { scale: scaleAnim },
            { rotate: rotateInterpolate }
          ] 
        }
      ]}>
        {/* Ícone central animado */}
        <Animated.View style={{ transform: [{ scale: leafScale }] }}>
          <Icon 
            name="leaf" 
            size={type === 'app' ? 80 : 60} 
            color={type === 'app' ? '#FFFFFF' : currentTheme.colors.primary}
          />
        </Animated.View>
        
        {/* Textos */}
        <View style={styles.textContainer}>
          <Animated.Text style={[
            styles.title, 
            { color: textColor, opacity: fadeAnim }
          ]}>
            {type === 'app' ? 'PlantDetect' : ''}
          </Animated.Text>
          
          <Animated.Text style={[
            styles.subtitle, 
            { color: textColor, opacity: fadeAnim }
          ]}>
            {message}
          </Animated.Text>
        </View>

        {/* Pontos de loading */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: textColor,
                  opacity: rotateAnim.interpolate({
                    inputRange: [0, 0.33, 0.66, 1],
                    outputRange: i === 0 ? [1, 0.3, 0.3, 1] : 
                                 i === 1 ? [0.3, 1, 0.3, 0.3] : 
                                 [0.3, 0.3, 1, 0.3]
                  }),
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default SplashScreen;