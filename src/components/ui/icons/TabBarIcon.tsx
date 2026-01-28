// src/components/ui/icons/TabBarIcon.tsx
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TabBarIconProps {
  name: string;
  color: string;
  size: number;
}

export default function TabBarIcon({ name, color, size }: TabBarIconProps) {
  return <Icon name={name} size={size} color={color} />;
}