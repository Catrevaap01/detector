// src/navigation/MainTabNavigator.tsx - Adicionar Stack Navigator para History
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import DetectionScreen from '../screens/DetectionScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AnalysisDetailScreen from '../screens/AnalysisDetailScreen';
import TabBarIcon from '../components/ui/icons/TabBarIcon';

const Tab = createBottomTabNavigator();
const HistoryStack = createStackNavigator();

// Stack Navigator para Histórico
function HistoryStackNavigator() {
  const { currentTheme } = useTheme();
  
  return (
    <HistoryStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: currentTheme.colors.surface,
        },
        headerTintColor: currentTheme.colors.text,
        headerShadowVisible: false,
      }}
    >
      <HistoryStack.Screen 
        name="HistoryList" 
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <HistoryStack.Screen 
        name="AnalysisDetail" 
        component={AnalysisDetailScreen}
        options={{ 
          title: 'Detalhes da Análise',
          headerBackTitle: 'Voltar',
        }}
      />
    </HistoryStack.Navigator>
  );
}

export default function MainTabNavigator() {
  const { currentTheme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: currentTheme.colors.surface,
          borderTopColor: currentTheme.colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarInactiveTintColor: currentTheme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Detection"
        component={DetectionScreen}
        options={{
          tabBarLabel: 'Detectar',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="camera" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStackNavigator}
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Config',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}