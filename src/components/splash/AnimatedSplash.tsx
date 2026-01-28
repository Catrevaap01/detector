// src/components/AnimatedSplash.tsx
import React, { useEffect, useRef, ReactNode } from 'react';
import { Animated, Easing, StyleProp, TextStyle } from 'react-native';

interface AnimatedSplashProps {
  children: ReactNode;
}

interface AnimatedTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

const AnimatedSplash = ({ children }: AnimatedSplashProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
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
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        alignItems: 'center',
      }}
    >
      {children}
    </Animated.View>
  );
};

const AnimatedText = ({ children, style }: AnimatedTextProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.Text style={[style, { opacity: fadeAnim }]}>
      {children}
    </Animated.Text>
  );
};

// Anexar o componente Text ao AnimatedSplash
AnimatedSplash.Text = AnimatedText;

export default AnimatedSplash;