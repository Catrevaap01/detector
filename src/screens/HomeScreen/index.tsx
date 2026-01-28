// src/screens/HomeScreen/index.tsx
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import ScreenContainer from '../../components/common/layout/ScreenContainer';
import HeroSection from '../../components/home/HeroSection';
import QuickActions from '../../components/home/QuickActionCard';
import RecentActivity from '../../components/home/RecentActivity';

const HomeScreen = ({ navigation }: any) => {
  const { makeStyles } = useTheme();
  
  const styles = makeStyles((theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  }));

  return (
    <ScreenContainer scrollable={true} contentPadding={true}>
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Actions */}
      <QuickActions
        onStartAnalysis={() => navigation.navigate('Detection')}
      />

      {/* Atividade Recente */}
      <RecentActivity 
        onViewMore={() => navigation.navigate('History')}
      />

    </ScreenContainer>
  );
};

export default HomeScreen;