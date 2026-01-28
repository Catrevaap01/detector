// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput, Button, Title, Text, Card } from 'react-native-paper';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulação de login - na versão final conectaremos ao backend
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Home');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Title style={styles.title}>🌿 Detector de Pragas</Title>
          <Text style={styles.subtitle}>Agricultura Inteligente</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.loginTitle}>Entrar</Title>
            
            <TextInput
              label="Email ou Telefone"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Entrar
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Home')}
              style={styles.guestButton}
            >
              Continuar como Visitante
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Não tem conta?{' '}
            <Text style={styles.link} onPress={() => {}}>
              Registre-se
            </Text>
          </Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
    backgroundColor: '#4CAF50',
  },
  guestButton: {
    marginTop: 12,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  version: {
    marginTop: 16,
    color: '#999',
    fontSize: 12,
  },
});

export default LoginScreen;