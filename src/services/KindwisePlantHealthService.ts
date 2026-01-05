// src/services/KindwisePlantHealthService.ts
import axios from 'axios';
import { API_CONFIG } from '../utils/apiConfig';

export interface DiseaseDiagnosis {
  id: string;
  name: string;
  probability: number;
  scientificName?: string;
  type: 'fungal' | 'bacterial' | 'viral' | 'pest' | 'deficiency' | 'environmental';
  description?: string;
  treatment?: string[];
  prevention?: string[];
  severity: 'low' | 'medium' | 'high';
  affectedParts: string[];
}

export interface PlantHealthResponse {
  isHealthy: boolean;
  healthScore: number;
  plantName?: string;
  plantScientificName?: string;
  diseases: DiseaseDiagnosis[];
  suggestions: string[];
  confidence: number;
  timestamp: string;
}

class KindwisePlantHealthService {
  // Diagnóstico de saúde para uma planta específica
  static async diagnosePlant(
    imageUri: string, 
    plantScientificName?: string
  ): Promise<PlantHealthResponse> {
    // Verificar se tem API key configurada
    if (!API_CONFIG.KINDUISE.API_KEY) {
      throw new Error('API Key do Kindwise não configurada. Use simulateDiagnosis() para testes.');
    }

    try {
      console.log('🏥 Diagnosticando saúde com Kindwise...');
      
      // Preparar FormData
      const formData = new FormData();
      formData.append('images', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'plant_health.jpg',
      } as any);

      // Parâmetros para diagnóstico - usando constantes do apiConfig se disponíveis
      const params: any = {
        api_key: API_CONFIG.KINDUISE.API_KEY,
        health: 'auto',
        disease_level: 'general',
        language: 'pt',
      };

      // Se sabemos a planta, podemos melhorar a precisão
      if (plantScientificName) {
        params.plant_species = plantScientificName;
      }

      // Fazer requisição usando URL do apiConfig
      const response = await axios.post(
        API_CONFIG.KINDUISE.HEALTH_URL,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params,
          timeout: 40000,
        }
      );

      console.log('✅ Resposta Kindwise:', response.data);
      return this.formatHealthResponse(response.data, plantScientificName);
      
    } catch (error: any) {
      console.error('❌ Erro Kindwise:', error.response?.data || error.message);
      
      // Tratamento de erros específicos
      if (error.response?.status === 401) {
        throw new Error('API Key do Kindwise inválida ou expirada');
      } else if (error.response?.status === 402) {
        throw new Error('Créditos insuficientes na conta Kindwise');
      } else if (error.response?.status === 429) {
        throw new Error('Limite de requisições excedido. Tente mais tarde.');
      }
      
      throw new Error(`Diagnóstico falhou: ${error.message}`);
    }
  }

  // Formatar resposta da API
  private static formatHealthResponse(data: any, plantScientificName?: string): PlantHealthResponse {
    const isHealthy = data.is_healthy || 
                     (data.diseases && data.diseases.length === 0) || 
                     data.health_score > 70;

    const diseases: DiseaseDiagnosis[] = (data.diseases || []).map((d: any) => ({
      id: d.id || `disease_${Date.now()}_${Math.random()}`,
      name: d.common_name || d.scientific_name || 'Doença não identificada',
      probability: (d.probability || d.confidence || 0) * 100,
      scientificName: d.scientific_name,
      type: this.mapDiseaseType(d.type || d.category),
      description: d.description || d.symptoms,
      treatment: d.treatment_advice ? [d.treatment_advice] : ['Consultar agrônomo'],
      prevention: d.prevention_advice || ['Boas práticas agrícolas'],
      severity: this.mapSeverity(d.severity || d.probability),
      affectedParts: d.affected_parts || ['leaf']
    }));

    return {
      isHealthy,
      healthScore: data.health_score || (isHealthy ? 85 : 40),
      plantName: data.plant_name || plantScientificName,
      plantScientificName: plantScientificName,
      diseases,
      suggestions: data.suggestions || this.getDefaultSuggestions(isHealthy),
      confidence: data.confidence || 0.7,
      timestamp: new Date().toISOString()
    };
  }

  // Sugestões padrão baseadas no estado de saúde
  private static getDefaultSuggestions(isHealthy: boolean): string[] {
    if (isHealthy) {
      return [
        'Continue com as boas práticas de cultivo',
        'Monitore regularmente para detecção precoce',
        'Mantenha condições adequadas de irrigação e nutrição'
      ];
    } else {
      return [
        'Isole plantas doentes para evitar contaminação',
        'Aplique tratamentos recomendados',
        'Consulte um agrônomo para diagnóstico preciso'
      ];
    }
  }

  // Mapear tipo de doença
  private static mapDiseaseType(type: string): DiseaseDiagnosis['type'] {
    const lower = type.toLowerCase();
    if (lower.includes('fung')) return 'fungal';
    if (lower.includes('bact')) return 'bacterial';
    if (lower.includes('virus')) return 'viral';
    if (lower.includes('pest') || lower.includes('insect')) return 'pest';
    if (lower.includes('defic')) return 'deficiency';
    return 'environmental';
  }

  // Mapear severidade
  private static mapSeverity(severityOrProb: any): 'low' | 'medium' | 'high' {
    if (typeof severityOrProb === 'string') {
      const lower = severityOrProb.toLowerCase();
      if (lower.includes('high') || lower.includes('severe')) return 'high';
      if (lower.includes('medium') || lower.includes('moderate')) return 'medium';
      return 'low';
    }
    
    const prob = Number(severityOrProb) || 0;
    if (prob > 0.7) return 'high';
    if (prob > 0.4) return 'medium';
    return 'low';
  }

  // Simulação para desenvolvimento (sem API key)
  static async simulateDiagnosis(
    imageUri: string, 
    plantScientificName?: string
  ): Promise<PlantHealthResponse> {
    console.log('🔬 Simulando diagnóstico (sem API key)...');
    
    // Verificar se é uma praga usando apiConfig
    const isPest = plantScientificName ? 
      API_CONFIG.PEST_KEYWORDS.some(keyword => 
        plantScientificName.toLowerCase().includes(keyword)
      ) : false;
    
    return new Promise(resolve => {
      setTimeout(() => {
        const diseases: DiseaseDiagnosis[] = isPest ? [
          {
            id: 'simulated_pest_1',
            name: 'Lagarta do Cartucho',
            probability: 78,
            type: 'pest',
            description: 'Praga comum que causa danos nas folhas de milho',
            treatment: ['Bacillus thuringiensis (Bt)', 'Controle manual', 'Inseticidas específicos'],
            prevention: ['Rotação de culturas', 'Eliminação de restos culturais'],
            severity: 'medium',
            affectedParts: ['leaf']
          }
        ] : [
          {
            id: 'simulated_fungal_1',
            name: 'Ferrugem Comum',
            probability: 65,
            type: 'fungal',
            description: 'Manchas amarelo-alaranjadas nas folhas',
            treatment: ['Fungicidas triazóis', 'Remover folhas infectadas'],
            prevention: ['Rotação de culturas', 'Espaçamento adequado'],
            severity: 'medium',
            affectedParts: ['leaf']
          }
        ];

        resolve({
          isHealthy: !isPest && Math.random() > 0.5,
          healthScore: isPest ? 45 : Math.random() * 40 + 60,
          plantName: plantScientificName || 'Milho',
          plantScientificName: plantScientificName || 'Zea mays',
          diseases,
          suggestions: isPest ? [
            'Aplicar inseticida biológico',
            'Monitorar população da praga',
            'Práticas de manejo integrado'
          ] : [
            'Aplicar fungicida preventivo',
            'Melhorar circulação de ar',
            'Evitar irrigação por aspersão'
          ],
          confidence: 0.73,
          timestamp: new Date().toISOString()
        });
      }, 1500);
    });
  }

  // Verificar se pode usar Kindwise real
  static canUseRealAPI(): boolean {
    return !!API_CONFIG.KINDUISE.API_KEY && 
           API_CONFIG.KINDUISE.API_KEY !== '' &&
           API_CONFIG.KINDUISE.API_KEY !== 'SUA_API_KEY_AQUI';
  }
}

export default KindwisePlantHealthService;