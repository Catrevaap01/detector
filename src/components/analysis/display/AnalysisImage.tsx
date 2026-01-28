// src/components/analysis/display/AnalysisImage.tsx (atualizado)
import React from 'react';
import { View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Typography from '../../common/typography/Typography';

interface AnalysisImageProps {
  imageUri?: string;
  timestamp: string;
  theme: any;
}

const AnalysisImage: React.FC<AnalysisImageProps> = ({ imageUri, timestamp, theme }) => {
  if (!imageUri) return null;

  return (
    <View style={{
      width: '100%',
      height: 220, // Reduzido de 280
      borderRadius: theme.borderRadius.large, // Reduzido de xlarge
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceVariant,
      position: 'relative',
    }}>
      <Image 
        source={{ uri: imageUri }} 
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />
      <View style={{
        position: 'absolute',
        top: theme.spacing.xs, // Reduzido
        right: theme.spacing.xs, // Reduzido
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2, // Reduzido
        borderRadius: theme.borderRadius.small,
      }}>
        <Typography variant="caption" style={{ 
          color: theme.colors.white, 
          fontWeight: '500',
          fontSize: 10, // Reduzido
        }}>
          {new Date(timestamp).toLocaleDateString('pt-PT')}
        </Typography>
      </View>
    </View>
  );
};

export default AnalysisImage;