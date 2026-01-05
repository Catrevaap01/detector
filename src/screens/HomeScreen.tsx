// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const features = [
    {
      id: 1,
      title: 'Analisar Planta',
      description: 'Use a câmera para identificar pragas',
      icon: 'camera',
      screen: 'Detection',
      color: '#4CAF50',
    },
    {
      id: 2,
      title: 'Manual',
      description: 'Identifique por sintomas',
      icon: 'clipboard-text',
      screen: 'Manual',
      color: '#2196F3',
    },
    {
      id: 3,
      title: 'Tratamentos',
      description: 'Recomendações',
      icon: 'medical-bag',
      screen: 'Treatment',
      color: '#FF9800',
    },
    {
      id: 4,
      title: 'Histórico',
      description: 'Análises anteriores',
      icon: 'history',
      screen: 'History',
      color: '#9C27B0',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.welcome}>🌱 Detector de Pragas</Title>
        <Paragraph style={styles.subtitle}>
          Identifique pragas agrícolas com IA
        </Paragraph>
      </View>

      <View style={styles.grid}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            onPress={() => navigation.navigate(feature.screen)}
            style={styles.cardContainer}
          >
            <Card style={[styles.card, { borderTopColor: feature.color }]}>
              <Card.Content style={styles.cardContent}>
                <Icon name={feature.icon} size={32} color={feature.color} />
                <Title style={styles.cardTitle}>{feature.title}</Title>
                <Paragraph style={styles.cardDesc}>
                  {feature.description}
                </Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Dicas Rápidas</Title>
          <View style={styles.tipContainer}>
            <Icon name="lightbulb-on" size={24} color="#FFC107" />
            <Text style={styles.tipText}>
              Tire fotos claras das folhas e pragas para melhor análise
            </Text>
          </View>
          <View style={styles.tipContainer}>
            <Icon name="lightbulb-on" size={24} color="#FFC107" />
            <Text style={styles.tipText}>
              Analise plantas em diferentes horários para melhor precisão
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon="logout"
        onPress={() => navigation.navigate('Login')}
        style={styles.logoutButton}
      >
        Sair
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    borderTopWidth: 4,
    borderRadius: 12,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  cardDesc: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  statsCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 3,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#5D4037',
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 30,
    backgroundColor: '#F44336',
  },
});

export default HomeScreen;