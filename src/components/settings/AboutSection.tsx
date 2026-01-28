// src/components/settings/AboutSection.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import Typography from '../common/typography/Typography';
import Button from '../common/buttons/Button';

interface AboutSectionProps {
  version: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ version }) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    infoContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    infoLabel: {
      color: theme.colors.textSecondary,
      width: 100,
    },
    infoValue: {
      color: theme.colors.text,
      flex: 1,
    },
    description: {
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    linksContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
  }));

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(err => 
      console.error('Erro ao abrir link:', err)
    );
  };

  return (
    <View style={styles.container}>
      <Typography variant="h4" style={styles.title}>
        Sobre o Aplicativo
      </Typography>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Typography variant="body2" style={styles.infoLabel}>
            Versão:
          </Typography>
          <Typography variant="body2" style={styles.infoValue}>
            {version}
          </Typography>
        </View>
        
        <View style={styles.infoRow}>
          <Typography variant="body2" style={styles.infoLabel}>
            Desenvolvedor:
          </Typography>
          <Typography variant="body2" style={styles.infoValue}>
            Detector de Pragas Team
          </Typography>
        </View>
      </View>
      
      <Typography variant="body2" style={styles.description}>
        Aplicativo para identificação inteligente de doenças em plantas usando IA.
        Combinamos tecnologia avançada para fornecer diagnósticos precisos e recomendações úteis.
      </Typography>
      
      <View style={styles.linksContainer}>
        <Button
          variant="outline"
          title="Política de Privacidade"
          iconLeft="shield"
          onPress={() => handleOpenLink('https://detectorpragas.com/privacy')}
          style={{ flex: 1 }}
        />
        
        <Button
          variant="outline"
          title="Termos de Uso"
          iconLeft="file-document"
          onPress={() => handleOpenLink('https://detectorpragas.com/terms')}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

export default AboutSection;