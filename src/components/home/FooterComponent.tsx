// src/components/home/FooterComponent.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Button from '../common/buttons/Button';

interface FooterComponentProps {
  onSettingsPress: () => void;
}

const FooterComponent: React.FC<FooterComponentProps> = ({ onSettingsPress }) => {
  const { makeStyles } = useTheme();
  
  const styles = makeStyles((theme) => ({
    container: {
      marginTop: 'auto',
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  }));

  return (
    <View style={styles.container}>
      <Button
        variant="outline"
        size="large"
        title="Configurações"
        iconLeft="cog"
        onPress={onSettingsPress}
        fullWidth
      />
    </View>
  );
};

export default FooterComponent;