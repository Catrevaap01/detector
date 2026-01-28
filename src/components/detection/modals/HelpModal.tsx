// src/components/detection/modals/HelpModal.tsx
import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import Button from '../../common/buttons/Button';
import Typography from '../../common/typography/Typography';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
  const { currentTheme } = useTheme();

  const helpTips = [
    { id: 1, text: 'Boa iluminação: Tire fotos durante o dia com luz natural' },
    { id: 2, text: 'Foco nas folhas: Fotografe as folhas afetadas de perto' },
    { id: 3, text: 'Múltiplos ângulos: Tire fotos de diferentes partes da planta' },
    { id: 4, text: 'Evite fundo: Tente isolar a planta do fundo' },
    { id: 5, text: 'Sintomas claros: Inclua áreas com sintomas evidentes' },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: currentTheme.colors.overlay }]}>
        <View style={[
          styles.modalContent,
          { 
            backgroundColor: currentTheme.colors.surface,
            borderTopLeftRadius: currentTheme.borderRadius.large,
            borderTopRightRadius: currentTheme.borderRadius.large,
          }
        ]}>
          <View style={styles.modalHeader}>
            <Typography variant="h3">Dicas para Melhor Análise</Typography>
            <Button
              variant="text"
              iconLeft="close"
              onPress={onClose}
            />
          </View>
          
          <View style={styles.tipsList}>
            {helpTips.map((tip) => (
              <View key={tip.id} style={styles.tipItem}>
                <Typography variant="body1" style={{ color: currentTheme.colors.primary, marginRight: 8 }}>
                  {tip.id}.
                </Typography>
                <Typography variant="body2" style={{ flex: 1, color: currentTheme.colors.text }}>
                  {tip.text}
                </Typography>
              </View>
            ))}
          </View>
          
          <Button
            variant="primary"
            title="Entendi"
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tipsList: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  closeButton: {
    marginTop: 24,
  },
});

export default HelpModal;