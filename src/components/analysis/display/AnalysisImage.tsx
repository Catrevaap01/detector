// src/components/analysis/display/AnalysisImage.tsx
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
  if (!imageUri) {
    return (
      <View style={{
        width: '100%',
        height: 220,
        borderRadius: theme.borderRadius.large,
        backgroundColor: theme.colors.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
      }}>
        <Icon name="image-off" size={48} color={theme.colors.textDisabled} />
        <Typography variant="body2" style={{ 
          color: theme.colors.textDisabled,
          marginTop: theme.spacing.sm,
        }}>
          Imagem não disponível
        </Typography>
      </View>
    );
  }

  // Formatador de data que se adapta ao tema
  const formatDate = () => {
    try {
      const date = new Date(timestamp);
      
      // Formato completo para tooltip ou visualização
      const fullDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      
      const time = date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      
      return `${fullDate} às ${time}`;
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Determinar cor de fundo baseada no tema - CORREÇÃO: usar valores mais claros
  const getBadgeBackgroundColor = () => {
    if (theme.isDark) {
      return 'rgba(30, 30, 30, 0.85)'; // Cinza escuro semi-transparente
    }
    return 'rgba(255, 255, 255, 0.85)'; // Branco semi-transparente para tema claro
  };

  // Determinar cor do texto baseada no tema - CORREÇÃO: cores com contraste
  const getBadgeTextColor = () => {
    if (theme.isDark) {
      return '#FFFFFF'; // Branco puro para tema escuro
    }
    return '#000000'; // Preto puro para tema claro
  };

  // Determinar cor do ícone
  const getIconColor = () => {
    if (theme.isDark) {
      return theme.colors.primaryLight || '#64B5F6';
    }
    return theme.colors.primary || '#1976D2';
  };

  // Cor para o indicador "IMAGEM"
  const getIndicatorBackgroundColor = () => {
    if (theme.isDark) {
      return 'rgba(255, 255, 255, 0.15)';
    }
    return 'rgba(0, 0, 0, 0.15)';
  };

  const formattedDate = formatDate();

  return (
    <View style={{
      width: '100%',
      height: 220,
      borderRadius: theme.borderRadius.large,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceVariant,
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <Image 
        source={{ uri: imageUri }} 
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
        progressiveRenderingEnabled={true}
      />
      
      {/* Overlay de data - CORRIGIDO: fundo mais claro para texto escuro */}
      <View style={{
        position: 'absolute',
        bottom: theme.spacing.sm,
        left: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: getBadgeBackgroundColor(),
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.medium,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: theme.isDark 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.1)',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Icon 
            name="calendar-clock" 
            size={14} 
            color={getIconColor()}
            style={{ marginRight: 8 }}
          />
          <Typography 
            variant="caption" 
            style={{ 
              color: getBadgeTextColor(), 
              fontWeight: '600', // Mais espesso para melhor legibilidade
              fontSize: 12,
              flex: 1,
              textShadowColor: 'rgba(0, 0, 0, 0.3)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formattedDate}
          </Typography>
        </View>
        
        <Icon 
          name="camera" 
          size={14} 
          color={getIconColor()}
        />
      </View>
      
      {/* Indicador de canto - CORRIGIDO: melhor contraste */}
      <View style={{
        position: 'absolute',
        top: theme.spacing.xs,
        right: theme.spacing.xs,
        backgroundColor: getIndicatorBackgroundColor(),
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.small,
        borderWidth: 1,
        borderColor: theme.isDark 
          ? 'rgba(255, 255, 255, 0.2)' 
          : 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
      }}>
        <Typography variant="caption" style={{ 
          color: getBadgeTextColor(), 
          fontWeight: '700',
          fontSize: 10,
          letterSpacing: 0.5,
          textShadowColor: 'rgba(0, 0, 0, 0.3)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 1,
        }}>
          IMAGEM
        </Typography>
      </View>
      
      {/* Overlay escurecido na parte inferior para melhor contraste do texto */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70, // Altura do gradiente
        background: theme.isDark 
          ? 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' 
          : 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
      }} />
    </View>
  );
};

export default AnalysisImage;