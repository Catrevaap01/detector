// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetectionScreen from '../screens/DetectionScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Detector de Pragas' }}
      />
      <Stack.Screen 
        name="Detection" 
        component={DetectionScreen}
        options={{ title: 'Análise por Imagem' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;