// src/components/detection/modals/ImageModal.tsx
import React from 'react';
import {
  View,
  Modal,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import Button from '../../common/buttons/Button';

interface ImageModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const ImageModal: React.FC<ImageModalProps> = ({ visible, imageUri, onClose }) => {
  const { currentTheme } = useTheme();

  if (!imageUri) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: currentTheme.colors.overlay }]}>
        <View style={styles.modalHeader}>
          <Button
            variant="text"
            iconLeft="close"
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: currentTheme.colors.surface }]}
          />
        </View>
        
        <Image 
          source={{ uri: imageUri }} 
          style={styles.fullImage}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  closeButton: {
    borderRadius: 20,
    padding: 8,
  },
  fullImage: {
    width: width,
    height: width,
  },
});

export default ImageModal;