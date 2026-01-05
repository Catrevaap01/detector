// src/services/DetectionService.ts
import PlantNetService, { PlantInfo } from './PlantNetService';
import KindwisePlantHealthService, { 
  PlantHealthResponse, 
  DiseaseDiagnosis 
} from './KindwisePlantHealthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Resultado unificado para a aplicação
export interface CompleteAnalysis {
  identification: PlantInfo;
  health: PlantHealthResponse;
  timestamp: string;
  analysisId: string;
  usedKindwise: boolean; // Se usou Kindwise real ou simulação
}

class DetectionService {
  // Configurações
  private static readonly USE_KINDWISE_REAL = false; // Mude para true quando tiver API key
  private static readonly KINDWISE_API_KEY = 'SUA_API_KEY_AQUI';

  // Método principal: análise completa em duas etapas
  static async completeAnalysis(imageUri: string): Promise<CompleteAnalysis> {
    console.log('🔍 Iniciando análise completa...');
    
    try {
      // ETAPA 1: Identificar a planta com PlantNet (GRATUITO)
      console.log('1️⃣ Identificando planta...');
      const plantInfo = await PlantNetService.identifyPlant(imageUri);
      
      // ETAPA 2: Diagnóstico de saúde com Kindwise
      console.log('2️⃣ Diagnosticando saúde...');
      let healthAnalysis: PlantHealthResponse;
      let usedKindwise = false;
      
      if (this.USE_KINDWISE_REAL && this.KINDWISE_API_KEY && this.KINDWISE_API_KEY !== 'SUA_API_KEY_AQUI') {
        // Usar Kindwise REAL
        healthAnalysis = await KindwisePlantHealthService.diagnosePlant(
          imageUri, 
          plantInfo.scientificName
        );
        usedKindwise = true;
      } else {
        // Usar simulação (para desenvolvimento)
        healthAnalysis = await KindwisePlantHealthService.simulateDiagnosis(
          imageUri,
          plantInfo.scientificName
        );
      }
      
      // Criar resultado completo
      const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const completeResult: CompleteAnalysis = {
        identification: plantInfo,
        health: healthAnalysis,
        timestamp: new Date().toISOString(),
        analysisId,
        usedKindwise
      };
      
      // Salvar no histórico
      await this.saveToHistory(completeResult);
      
      console.log('✅ Análise completa realizada!');
      return completeResult;
      
    } catch (error: any) {
      console.error('❌ Erro na análise completa:', error);
      
      // Fallback: análise básica apenas com PlantNet
      return this.getFallbackAnalysis(imageUri);
    }
  }

  // Análise de fallback (se tudo falhar)
  private static async getFallbackAnalysis(imageUri: string): Promise<CompleteAnalysis> {
    console.log('🔄 Usando análise de fallback...');
    
    const plantInfo = await PlantNetService.identifyPlant(imageUri);
    const analysisId = `fallback_${Date.now()}`;
    
    return {
      identification: plantInfo,
      health: {
        isHealthy: true,
        healthScore: 75,
        plantName: plantInfo.commonName,
        plantScientificName: plantInfo.scientificName,
        diseases: [],
        suggestions: [
          'Não foram detectadas doenças evidentes',
          'Para diagnóstico preciso, verifique condições de cultivo'
        ],
        confidence: 0.5,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      analysisId,
      usedKindwise: false
    };
  }

  // Salvar no histórico local
  static async saveToHistory(analysis: CompleteAnalysis): Promise<void> {
    try {
      const history = await AsyncStorage.getItem('plant_analysis_history');
      let historyArray = history ? JSON.parse(history) : [];
      
      historyArray.unshift({
        ...analysis,
        id: analysis.analysisId,
        date: new Date().toLocaleString('pt-PT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
      
      // Manter apenas últimos 100 análises
      if (historyArray.length > 100) {
        historyArray = historyArray.slice(0, 100);
      }
      
      await AsyncStorage.setItem('plant_analysis_history', JSON.stringify(historyArray));
      console.log('💾 Análise salva no histórico');
      
    } catch (error) {
      console.error('❌ Erro ao salvar histórico:', error);
    }
  }

  // Buscar histórico
  static async getHistory(): Promise<any[]> {
    try {
      const history = await AsyncStorage.getItem('plant_analysis_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('❌ Erro ao buscar histórico:', error);
      return [];
    }
  }

  // Limpar histórico
  static async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem('plant_analysis_history');
      console.log('🗑️ Histórico limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar histórico:', error);
    }
  }
}

export default DetectionService;