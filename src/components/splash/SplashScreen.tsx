// src/components/SplashScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedSplash from './AnimatedSplash';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <AnimatedSplash>
        <Icon name="leaf" size={80} color="#00B894" />
        <View style={styles.textContainer}>
          <Icon name="microscope" size={24} color="#00B894" style={styles.microscopeIcon} />
          <AnimatedSplash.Text style={styles.title}>
            Detector de Pragas
          </AnimatedSplash.Text>
        </View>
        <AnimatedSplash.Text style={styles.subtitle}>
          Análise inteligente de plantas
        </AnimatedSplash.Text>
      </AnimatedSplash>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  microscopeIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3436',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#636E72',
    marginTop: 8,
    opacity: 0.8,
  },
});

export default SplashScreen;