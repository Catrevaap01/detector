// src/screens/SettingsScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Alert,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, ThemeMode } from '../../hooks/useTheme';
import ScreenContainer from '../../components/common/layout/ScreenContainer';
import SettingsGroup from '../../components/settings/SettingsGroup';
import ThemeSelector from '../../components/settings/ThemeSelector';
import AboutSection from '../../components/settings/AboutSection';
import Button from '../../components/common/buttons/Button';
import Typography from '../../components/common/typography/Typography';

const APP_VERSION = '1.0.0';

const SettingsScreen = () => {
  const { themeMode, toggleTheme, currentTheme } = useTheme();
  const [appVersion] = useState(APP_VERSION);

  const handleClearCache = useCallback(async () => {
    Alert.alert(
      'Limpar Cache',
      'Tem certeza que deseja limpar todos os dados em cache? Isso removerá análises salvas e configurações.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Limpar dados do usuário
              await AsyncStorage.removeItem('favorite_analyses');
              await AsyncStorage.removeItem('last_analysis');
              await AsyncStorage.removeItem('@plant_detector_theme_mode');
              
              Alert.alert('Sucesso', 'Cache limpo com sucesso!');
            } catch (error) {
              console.error('Erro ao limpar cache:', error);
              Alert.alert('Erro', 'Não foi possível limpar o cache.');
            }
          },
        },
      ]
    );
  }, []);

  const handleSendFeedback = useCallback(() => {
    const email = 'suporte@detectorpragas.com';
    const subject = 'Feedback - Detector de Pragas';
    const body = '\n\n---\nInformações do app:\n';
    
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      .catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o cliente de email.');
      });
  }, []);

  const handleRateApp = useCallback(() => {
    // Em produção, link para app store
    Alert.alert(
      'Avaliar App',
      'Em produção, isso abriria a loja de aplicativos.',
      [{ text: 'OK' }]
    );
  }, []);

  const handleShareApp = useCallback(() => {
    Alert.alert(
      'Compartilhar App',
      'Em produção, isso permitiria compartilhar o app com amigos.',
      [{ text: 'OK' }]
    );
  }, []);

  return (
    <ScreenContainer
      headerTitle="Configurações"
      scrollable={false}
    >
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: currentTheme.spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção: Aparência */}
        <SettingsGroup title="Aparência">
          <ThemeSelector
            currentThemeMode={themeMode}
            onThemeChange={toggleTheme}
          />
        </SettingsGroup>

        {/* Seção: Dados */}
        <SettingsGroup title="Dados">
          <View style={{ gap: currentTheme.spacing.sm }}>
            <Button
              variant="outline"
              title="Limpar Cache"
              iconLeft="delete"
              onPress={handleClearCache}
              style={{ backgroundColor: currentTheme.colors.surfaceVariant }}
            />
            
            <Button
              variant="outline"
              title="Exportar Dados"
              iconLeft="export"
              onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em desenvolvimento.')}
              style={{ backgroundColor: currentTheme.colors.surfaceVariant }}
            />
          </View>
        </SettingsGroup>

        {/* Seção: Suporte */}
        <SettingsGroup title="Suporte">
          <View style={{ gap: currentTheme.spacing.sm }}>
            <Button
              variant="outline"
              title="Enviar Feedback"
              iconLeft="email"
              onPress={handleSendFeedback}
              style={{ backgroundColor: currentTheme.colors.surfaceVariant }}
            />
            
            <Button
              variant="outline"
              title="Avaliar App"
              iconLeft="star"
              onPress={handleRateApp}
              style={{ backgroundColor: currentTheme.colors.surfaceVariant }}
            />
            
            <Button
              variant="outline"
              title="Compartilhar App"
              iconLeft="share-variant"
              onPress={handleShareApp}
              style={{ backgroundColor: currentTheme.colors.surfaceVariant }}
            />
          </View>
        </SettingsGroup>

        {/* Seção: Sobre */}
        <AboutSection version={appVersion} />

        {/* Rodapé */}
        <View style={{ 
          marginTop: currentTheme.spacing.xl, 
          paddingTop: currentTheme.spacing.lg,
          borderTopWidth: 1,
          borderTopColor: currentTheme.colors.border,
          alignItems: 'center'
        }}>
          <Typography variant="caption" style={{ color: currentTheme.colors.textSecondary, textAlign: 'center' }}>
            🌱 Detector de Pragas v{appVersion}
          </Typography>
          <Typography variant="caption" style={{ 
            color: currentTheme.colors.textSecondary, 
            textAlign: 'center',
            marginTop: currentTheme.spacing.xs
          }}>
            Identificação inteligente de doenças em plantas
          </Typography>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default SettingsScreen;