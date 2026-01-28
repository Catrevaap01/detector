// src/screens/DetectionScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Button,
  Card,
  Title,
  Paragraph,
  Text,
  Chip,
  Divider,
  IconButton,
  Portal,
  Dialog,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import DetectionService, { CompleteAnalysis } from '../services/DetectionService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const DetectionScreen = ({ navigation }: any) => {
  // Estados principais
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CompleteAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para modal de imagem
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Estado para localização
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  
  // Estado para diálogo de ajuda
  const [helpVisible, setHelpVisible] = useState(false);

  // Solicitar permissões de câmera e galeria
  const requestPermissions = async () => {
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
  };

  // Obter localização atual
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização negada');
        return null;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
      return currentLocation;
    } catch (err) {
      console.error('Erro ao obter localização:', err);
      return null;
    } finally {
      setLocationLoading(false);
    }
  };

  // Tirar foto com a câmera
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    // Obter localização antes de tirar foto
    await getCurrentLocation();

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
      exif: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setAnalysis(null);
      setError(null);
      
      // Mostrar sugestão para análise
      setTimeout(() => {
        Alert.alert(
          'Foto capturada!',
          'Deseja analisar esta imagem agora?',
          [
            { text: 'Mais tarde', style: 'cancel' },
            { text: 'Analisar', onPress: analyzeImage }
          ]
        );
      }, 500);
    }
  };

  // Selecionar imagem da galeria
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setAnalysis(null);
      setError(null);
    }
  };

  // Analisar imagem
  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('Sem imagem', 'Selecione uma imagem primeiro');
      return;
    }

    setLoading(true);
    setError(null);
    
    // Mostrar status de progresso
    const progressMessages = [
      'Identificando planta...',
      'Analisando saúde...',
      'Processando resultados...'
    ];
    
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      if (currentProgress < progressMessages.length) {
        console.log(progressMessages[currentProgress]);
        currentProgress++;
      }
    }, 1000);

    try {
      // Análise completa (PlantNet + Kindwise/simulação)
      const completeAnalysis = await DetectionService.completeAnalysis(image);
      setAnalysis(completeAnalysis);
      
      // Adicionar localização ao resultado se disponível
      if (location) {
        const enrichedAnalysis = {
          ...completeAnalysis,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          }
        };
        setAnalysis(enrichedAnalysis);
        
        // Salvar com localização
        await AsyncStorage.setItem('last_analysis', JSON.stringify(enrichedAnalysis));
      } else {
        await AsyncStorage.setItem('last_analysis', JSON.stringify(completeAnalysis));
      }

      // Feedback baseado nos resultados
      if (!completeAnalysis.usedKindwise) {
        Alert.alert(
          '⚠️ Modo de Demonstração',
          'Usando serviço gratuito para identificação.\n\nPara diagnóstico preciso de doenças, configure a API Key do Kindwise.',
          [{ text: 'Entendi' }]
        );
      }
      
    } catch (err: any) {
      console.error('Erro na análise:', err);
      setError(err.message || 'Erro na análise da imagem');
      Alert.alert('Erro', 'Não foi possível analisar a imagem. Tente novamente.');
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  // Salvar análise nos favoritos
  const saveToFavorites = async () => {
    if (!analysis) return;
    
    try {
      const favorites = await AsyncStorage.getItem('favorite_analyses');
      let favoritesArray = favorites ? JSON.parse(favorites) : [];
      
      favoritesArray.unshift({
        ...analysis,
        savedAt: new Date().toISOString(),
        id: `fav_${Date.now()}`,
      });
      
      await AsyncStorage.setItem('favorite_analyses', JSON.stringify(favoritesArray));
      Alert.alert('✅ Salvo!', 'Análise adicionada aos favoritos.');
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
      Alert.alert('Erro', 'Não foi possível salvar nos favoritos.');
    }
  };

  // Compartilhar resultados (simulação)
  const shareResults = () => {
    if (!analysis) return;
    
    Alert.alert(
      'Compartilhar Resultados',
      'Esta funcionalidade permitiria compartilhar os resultados por email, WhatsApp, etc.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Simular', onPress: () => {
          Alert.alert('Compartilhado!', 'Resultados prontos para compartilhar.');
        }}
      ]
    );
  };

  // Nova análise
  const resetAnalysis = () => {
    Alert.alert(
      'Nova Análise',
      'Deseja começar uma nova análise?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sim', 
          onPress: () => {
            setImage(null);
            setAnalysis(null);
            setError(null);
            setLocation(null);
          }
        }
      ]
    );
  };

  // Abrir imagem em tela cheia
  const openImageModal = (imageUri: string) => {
    setSelectedImage(imageUri);
    setImageModalVisible(true);
  };

  // Renderizar seção de identificação
  const renderIdentificationSection = () => {
    if (!analysis) return null;

    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name="leaf" size={24} color="#4CAF50" />
            <Title style={styles.sectionTitle}>Identificação da Planta</Title>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nome Comum</Text>
              <Text style={styles.infoValue}>{analysis.identification.commonName}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nome Científico</Text>
              <Text style={styles.scientificName}>{analysis.identification.scientificName}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Família</Text>
              <Text style={styles.infoValue}>{analysis.identification.family || 'Não identificada'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Confiança</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{analysis.identification.probability}%</Text>
              </View>
            </View>
          </View>
          
          {analysis.identification.commonNames && analysis.identification.commonNames.length > 0 && (
            <View style={styles.commonNamesContainer}>
              <Text style={styles.subLabel}>Também conhecida como:</Text>
              <View style={styles.chipsContainer}>
                {analysis.identification.commonNames.slice(0, 3).map((name, index) => (
                  <Chip key={index} style={styles.nameChip} textStyle={styles.chipText}>
                    {name}
                  </Chip>
                ))}
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  // Renderizar seção de saúde
  const renderHealthSection = () => {
    if (!analysis) return null;

    const healthStatus = analysis.health.isHealthy ? 'healthy' : 'unhealthy';
    const healthConfig = {
      healthy: {
        icon: 'check-circle',
        color: '#4CAF50',
        label: 'Saudável',
        message: 'A planta parece estar em boas condições'
      },
      unhealthy: {
        icon: 'alert-circle',
        color: '#FF9800',
        label: 'Problemas Detectados',
        message: 'Foram identificados possíveis problemas'
      }
    };

    const config = healthConfig[healthStatus];

    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name="heart-pulse" size={24} color={config.color} />
            <Title style={styles.sectionTitle}>Diagnóstico de Saúde</Title>
          </View>
          
          <View style={styles.healthStatusCard}>
            <View style={styles.healthHeader}>
              <Icon name={config.icon} size={32} color={config.color} />
              <View style={styles.healthTextContainer}>
                <Text style={[styles.healthLabel, { color: config.color }]}>
                  {config.label}
                </Text>
                <Text style={styles.healthMessage}>{config.message}</Text>
              </View>
              <View style={styles.healthScoreContainer}>
                <Text style={styles.scoreLabel}>Pontuação</Text>
                <Text style={styles.healthScore}>
                  {analysis.health.healthScore.toFixed(0)}
                  <Text style={styles.scoreTotal}>/100</Text>
                </Text>
              </View>
            </View>
            
            {/* Barra de progresso da saúde */}
            <View style={styles.healthBarContainer}>
              <View style={styles.healthBarBackground}>
                <View 
                  style={[
                    styles.healthBarFill,
                    { 
                      width: `${analysis.health.healthScore}%`,
                      backgroundColor: config.color
                    }
                  ]} 
                />
              </View>
              <Text style={styles.healthBarLabel}>
                {analysis.health.healthScore >= 70 ? 'Boa' : 
                 analysis.health.healthScore >= 40 ? 'Moderada' : 'Baixa'} saúde
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Renderizar lista de doenças
  const renderDiseasesSection = () => {
    if (!analysis || !analysis.health.diseases || analysis.health.diseases.length === 0) {
      return null;
    }

    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name="alert" size={24} color="#F44336" />
            <Title style={styles.sectionTitle}>Problemas Identificados</Title>
            <Chip style={styles.countChip}>
              {analysis.health.diseases.length}
            </Chip>
          </View>
          
          <Text style={styles.sectionSubtitle}>
            Baseado na análise da imagem, foram detectados os seguintes problemas:
          </Text>
          
          {analysis.health.diseases.map((disease, index) => (
            <View key={index} style={styles.diseaseCard}>
              <View style={styles.diseaseHeader}>
                <View style={styles.diseaseTitleContainer}>
                  <Text style={styles.diseaseName}>{disease.name}</Text>
                  {disease.scientificName && (
                    <Text style={styles.diseaseScientific}>{disease.scientificName}</Text>
                  )}
                </View>
                <View style={styles.probabilityContainer}>
                  <Text style={styles.probabilityLabel}>Probabilidade</Text>
                  <View style={styles.probabilityBadge}>
                    <Text style={styles.probabilityText}>{disease.probability.toFixed(0)}%</Text>
                  </View>
                </View>
              </View>
              
              {/* Tipo e Severidade */}
              <View style={styles.diseaseMeta}>
                <Chip 
                  icon="tag" 
                  style={styles.typeChip}
                  textStyle={styles.chipText}
                >
                  {disease.type === 'fungal' ? 'Fúngico' :
                   disease.type === 'bacterial' ? 'Bacteriano' :
                   disease.type === 'viral' ? 'Viral' :
                   disease.type === 'pest' ? 'Praga' : 'Outro'}
                </Chip>
                
                <Chip 
                  icon="alert" 
                  style={[
                    styles.severityChip,
                    { 
                      backgroundColor: 
                        disease.severity === 'high' ? '#FFEBEE' :
                        disease.severity === 'medium' ? '#FFF3E0' : '#E8F5E9'
                    }
                  ]}
                  textStyle={[
                    styles.chipText,
                    { 
                      color: 
                        disease.severity === 'high' ? '#C62828' :
                        disease.severity === 'medium' ? '#F57C00' : '#2E7D32'
                    }
                  ]}
                >
                  {disease.severity === 'high' ? 'Alta' :
                   disease.severity === 'medium' ? 'Média' : 'Baixa'} severidade
                </Chip>
              </View>
              
              {/* Descrição */}
              {disease.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionLabel}>Sintomas/Descrição:</Text>
                  <Text style={styles.descriptionText}>{disease.description}</Text>
                </View>
              )}
              
              {/* Tratamentos */}
              {disease.treatment && disease.treatment.length > 0 && (
                <View style={styles.treatmentContainer}>
                  <Text style={styles.treatmentLabel}>💡 Recomendações de Tratamento:</Text>
                  {disease.treatment.map((treatment, i) => (
                    <View key={i} style={styles.treatmentItem}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <Text style={styles.treatmentText}>{treatment}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              {/* Prevenção */}
              {disease.prevention && disease.prevention.length > 0 && (
                <View style={styles.preventionContainer}>
                  <Text style={styles.preventionLabel}>🛡️ Medidas Preventivas:</Text>
                  {disease.prevention.map((prevent, i) => (
                    <View key={i} style={styles.preventionItem}>
                      <Icon name="shield" size={16} color="#2196F3" />
                      <Text style={styles.preventionText}>{prevent}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              <Divider style={styles.divider} />
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  // Renderizar sugestões
  const renderSuggestionsSection = () => {
    if (!analysis) return null;

    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name="lightbulb-on" size={24} color="#FFC107" />
            <Title style={styles.sectionTitle}>Recomendações Gerais</Title>
          </View>
          
          <View style={styles.suggestionsList}>
            {analysis.health.suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Icon name="checkbox-marked-circle" size={20} color="#4CAF50" />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </View>
            ))}
          </View>
          
          {/* Informações da análise */}
          <View style={styles.analysisInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabelSmall}>Modo de análise:</Text>
              <Chip 
                icon={analysis.usedKindwise ? "shield-check" : "test-tube"}
                style={styles.modeChip}
                textStyle={styles.chipText}
              >
                {analysis.usedKindwise ? 'Diagnóstico Real' : 'Modo Simulação'}
              </Chip>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabelSmall}>Confiança do diagnóstico:</Text>
              <Text style={styles.confidenceValue}>
                {(analysis.health.confidence * 100).toFixed(0)}%
              </Text>
            </View>
            
            {location && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabelSmall}>Localização:</Text>
                <Chip icon="map-marker" style={styles.locationChip}>
                  {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                </Chip>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabelSmall}>Data da análise:</Text>
              <Text style={styles.dateText}>
                {new Date(analysis.timestamp).toLocaleString('pt-PT')}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Renderizar botões de ação
  const renderActionButtons = () => {
    if (!analysis) return null;

    return (
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.actionsTitle}>Ações</Title>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={saveToFavorites}
            >
              <Icon name="star" size={24} color="#FFC107" />
              <Text style={styles.actionText}>Favoritar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={shareResults}
            >
              <Icon name="share-variant" size={24} color="#2196F3" />
              <Text style={styles.actionText}>Compartilhar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('History')}
            >
              <Icon name="history" size={24} color="#9C27B0" />
              <Text style={styles.actionText}>Histórico</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={resetAnalysis}
            >
              <Icon name="refresh" size={24} color="#FF9800" />
              <Text style={styles.actionText}>Nova Análise</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Modal para visualização de imagem em tela cheia
  const renderImageModal = () => (
    <Modal
      visible={imageModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setImageModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <IconButton
            icon="close"
            size={30}
            onPress={() => setImageModalVisible(false)}
            style={styles.modalCloseButton}
          />
        </View>
        
        <Image 
          source={{ uri: selectedImage || image }} 
          style={styles.fullImage}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );

  // Diálogo de ajuda
  const renderHelpDialog = () => (
    <Portal>
      <Dialog visible={helpVisible} onDismiss={() => setHelpVisible(false)}>
        <Dialog.Title>Dicas para Melhor Análise</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.helpText}>
            1. <Text style={styles.helpBold}>Boa iluminação:</Text> Tire fotos durante o dia com luz natural
          </Text>
          <Text style={styles.helpText}>
            2. <Text style={styles.helpBold}>Foco nas folhas:</Text> Fotografe as folhas afetadas de perto
          </Text>
          <Text style={styles.helpText}>
            3. <Text style={styles.helpBold}>Múltiplos ângulos:</Text> Tire fotos de diferentes partes da planta
          </Text>
          <Text style={styles.helpText}>
            4. <Text style={styles.helpBold}>Evite fundo:</Text> Tente isolar a planta do fundo
          </Text>
          <Text style={styles.helpText}>
            5. <Text style={styles.helpBold}>Sintomas claros:</Text> Inclua áreas com sintomas evidentes
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setHelpVisible(false)}>Entendi</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Cabeçalho */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <Icon name="microscope" size={32} color="#2E7D32" />
              <View style={styles.headerTextContainer}>
                <Title style={styles.appTitle}>Detector de Pragas</Title>
                <Paragraph style={styles.appSubtitle}>
                  Análise inteligente de plantas e diagnóstico de saúde
                </Paragraph>
              </View>
              <IconButton
                icon="help-circle"
                size={24}
                onPress={() => setHelpVisible(true)}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Seção de Captura de Imagem */}
        <Card style={styles.uploadCard}>
          <Card.Content>
            <Title style={styles.uploadTitle}>📸 Capturar Imagem</Title>
            <Paragraph style={styles.uploadDescription}>
              Tire uma foto da planta ou selecione uma da galeria
            </Paragraph>
            
            <View style={styles.uploadButtons}>
              <Button
                mode="contained"
                icon="camera"
                onPress={takePhoto}
                style={styles.uploadButton}
                disabled={loading}
                loading={locationLoading}
              >
                {locationLoading ? 'Obtendo localização...' : 'Tirar Foto'}
              </Button>
              
              <Button
                mode="outlined"
                icon="image"
                onPress={pickImage}
                style={styles.uploadButton}
                disabled={loading}
              >
                Galeria
              </Button>
            </View>
            
            {image && (
              <View style={styles.imagePreviewContainer}>
                <TouchableOpacity 
                  onPress={() => openImageModal(image)}
                  style={styles.imagePreview}
                >
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <View style={styles.imageOverlay}>
                    <Icon name="magnify-plus" size={24} color="white" />
                    <Text style={styles.overlayText}>Toque para ampliar</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                  disabled={loading}
                >
                  <Icon name="close-circle" size={28} color="#F44336" />
                </TouchableOpacity>
              </View>
            )}
            
            {image && !analysis && (
              <Button
                mode="contained"
                onPress={analyzeImage}
                loading={loading}
                disabled={loading}
                style={styles.analyzeButton}
                icon="magnify"
                contentStyle={styles.analyzeButtonContent}
              >
                {loading ? 'Analisando...' : '🔍 Analisar Imagem'}
              </Button>
            )}
            
            {error && (
              <Card style={styles.errorCard}>
                <Card.Content style={styles.errorContent}>
                  <Icon name="alert-circle" size={24} color="#F44336" />
                  <Text style={styles.errorText}>{error}</Text>
                </Card.Content>
              </Card>
            )}
          </Card.Content>
        </Card>

        {/* Mostrar indicador de carregamento */}
        {loading && (
          <Card style={styles.loadingCard}>
            <Card.Content style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Analisando imagem...</Text>
              <Text style={styles.loadingSubtext}>
                Identificando planta e verificando saúde
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Resultados da Análise */}
        {analysis && (
          <>
            {renderIdentificationSection()}
            {renderHealthSection()}
            {renderDiseasesSection()}
            {renderSuggestionsSection()}
            {renderActionButtons()}
          </>
        )}

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Dica: Para melhor precisão, configure sua API Key do Kindwise
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsButton}
          >
            Configurações
          </Button>
        </View>
      </ScrollView>

      {/* Modais e Diálogos */}
      {renderImageModal()}
      {renderHelpDialog()}
    </View>
  );
};

// ESTILOS COMPLETOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  uploadCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    elevation: 3,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
    elevation: 3,
  },
  analyzeButton: {
    marginTop: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    elevation: 2,
  },
  analyzeButtonContent: {
    paddingVertical: 8,
  },
  errorCard: {
    marginTop: 16,
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  errorText: {
    marginLeft: 12,
    color: '#C62828',
    flex: 1,
    fontSize: 14,
  },
  loadingCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  infoItem: {
    width: '50%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoLabelSmall: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#2E7D32',
    fontWeight: '500',
  },
  confidenceBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  confidenceText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 14,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  commonNamesContainer: {
    marginTop: 8,
  },
  subLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nameChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  chipText: {
    fontSize: 12,
  },
  healthStatusCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  healthLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  healthMessage: {
    fontSize: 14,
    color: '#666',
  },
  healthScoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  healthScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreTotal: {
    fontSize: 14,
    color: '#999',
  },
  healthBarContainer: {
    marginTop: 8,
  },
  healthBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthBarLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  countChip: {
    backgroundColor: '#FFEBEE',
  },
  diseaseCard: {
    backgroundColor: '#FAFAFA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  diseaseTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  diseaseScientific: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
  },
  probabilityContainer: {
    alignItems: 'flex-end',
  },
  probabilityLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  probabilityBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  probabilityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  diseaseMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeChip: {
    marginRight: 8,
    backgroundColor: '#E3F2FD',
  },
  severityChip: {
    backgroundColor: '#FFF3E0',
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  treatmentContainer: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  treatmentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  treatmentText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
  preventionContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  preventionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 8,
  },
  preventionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  preventionText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#333',
    flex: 1,
    lineHeight: 18,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#E0E0E0',
  },
  suggestionsList: {
    marginTop: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  analysisInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeChip: {
    backgroundColor: '#F3E5F5',
  },
  locationChip: {
    backgroundColor: '#E8F5E9',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  actionsCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    minWidth: 80,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  settingsButton: {
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  fullImage: {
    width: width,
    height: width,
  },
  helpText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  helpBold: {
    fontWeight: 'bold',
  },
});

export default DetectionScreen;