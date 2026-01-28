// src/components/detection/ImageUploadCard.tsx
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import Card from '../../common/cards/Card';
import Button from '../../common/buttons/Button';
import Typography from '../../common/typography/Typography';

interface ImageUploadCardProps {
  imageUri: string | null;
  onTakePhoto: () => void;
  onPickImage: () => void;
  onRemoveImage: () => void;
  onOpenImage: (uri: string) => void;
  loading: boolean;
  locationLoading: boolean;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  imageUri,
  onTakePhoto,
  onPickImage,
  onRemoveImage,
  onOpenImage,
  loading,
  locationLoading,
}) => {
  const { currentTheme, makeStyles } = useTheme();
  const styles = makeStyles((theme) => ({
    container: {
      marginBottom: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      color: theme.colors.textSecondary,
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    imagePreviewContainer: {
      position: 'relative',
      marginBottom: theme.spacing.md,
    },
    imagePreview: {
      width: '100%',
      height: 250,
      borderRadius: theme.borderRadius.medium,
      overflow: 'hidden',
    },
    previewImage: {
      width: '100%',
      height: '100%',
    },
    imageOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.overlay,
      padding: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlayText: {
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    removeButton: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
  }));

  return (
    <Card variant="elevated" padding="medium" borderRadius="large" style={styles.container}>
      <View style={styles.header}>
        <Icon name="camera" size={28} color={currentTheme.colors.primary} />
        <View style={styles.titleContainer}>
          <Typography variant="h4" style={styles.title}>
            Capturar Imagem
          </Typography>
          <Typography variant="body2" style={styles.subtitle}>
            Tire uma foto da planta ou selecione uma da galeria
          </Typography>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <Button
          variant="primary"
          title="Tirar Foto"
          iconLeft="camera"
          onPress={onTakePhoto}
          disabled={loading}
          loading={locationLoading}
          style={{ flex: 1 }}
        />
        <Button
          variant="outline"
          title="Galeria"
          iconLeft="image"
          onPress={onPickImage}
          disabled={loading}
          style={{ flex: 1 }}
        />
      </View>

      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <TouchableOpacity 
            onPress={() => onOpenImage(imageUri)}
            style={styles.imagePreview}
            activeOpacity={0.8}
          >
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <View style={styles.imageOverlay}>
              <Icon name="magnify-plus" size={20} color={currentTheme.colors.text} />
              <Typography variant="caption" style={styles.overlayText}>
                Toque para ampliar
              </Typography>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemoveImage}
            disabled={loading}
          >
            <Icon name="close-circle" size={24} color={currentTheme.colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

export default ImageUploadCard;