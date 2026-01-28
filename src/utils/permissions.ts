// src/components/detection/utils/permissions.ts
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export const requestCameraAndGalleryPermissions = async (): Promise<boolean> => {
  try {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!cameraPermission.granted || !mediaPermission.granted) {
      Alert.alert(
        'Permissões necessárias',
        'Precisamos de permissão para acessar a câmera e galeria',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao solicitar permissões:', error);
    return false;
  }
};

export const requestLocationPermission = async (): Promise<Location.LocationObject | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão de localização negada');
      return null;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return currentLocation;
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    return null;
  }
};

export const takePhoto = async (options?: {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}): Promise<string | null> => {
  try {
    const hasPermission = await requestCameraAndGalleryPermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: options?.allowsEditing || false, // ← DESATIVADO por padrão
      aspect: options?.aspect || [4, 3], // Apenas se allowsEditing=true
      quality: options?.quality || 0.85,
      exif: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Erro ao tirar foto:', error);
    return null;
  }
};

export const pickImageFromGallery = async (options?: {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  multiple?: boolean;
}): Promise<string | string[] | null> => {
  try {
    const hasPermission = await requestCameraAndGalleryPermissions();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: options?.allowsEditing || false, // ← DESATIVADO por padrão
      aspect: options?.aspect, // Apenas se allowsEditing=true
      quality: options?.quality || 0.85,
      allowsMultipleSelection: options?.multiple || false,
      selectionLimit: options?.multiple ? 10 : 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (options?.multiple) {
        return result.assets.map(asset => asset.uri);
      }
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Erro ao selecionar imagem:', error);
    return null;
  }
};

// Funções específicas para diferentes casos de uso
export const takePhotoWithCrop = async (): Promise<string | null> => {
  return await takePhoto({
    allowsEditing: true,
    aspect: [1, 1], // Quadrado
    quality: 0.9,
  });
};

export const takePhotoForAnalysis = async (): Promise<string | null> => {
  return await takePhoto({
    allowsEditing: false, // ← Sem corte obrigatório
    quality: 0.9, // Alta qualidade para análise
  });
};

export const pickImageForAnalysis = async (): Promise<string | null> => {
  return await pickImageFromGallery({
    allowsEditing: false, // ← Sem corte obrigatório
    quality: 0.9, // Alta qualidade para análise
  }) as Promise<string | null>;
};