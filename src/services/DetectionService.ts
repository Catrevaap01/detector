// src/services/DetectionService.ts
import * as ImageManipulator from 'expo-image-manipulator';
import PlantNetService, { PlantInfo } from './PlantNetService';
import KindwisePlantHealthService, { PlantHealthResponse, DiseaseDiagnosis } from './KindwisePlantHealthService';
import { findTreatment } from './TreatmentDatabase';

// Tipos exportados (mantidos para compatibilidade)
export interface DiseaseInfo {
  name: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  treatment: {
    organic: string[];
    chemical: string[];
    preventive: string[];
  };
  symptoms: string[];
}

export interface PlantIdentification {
  name: string;
  confidence: number;
  scientificName?: string;
  description?: string;
  commonNames: string[];
}

export interface HealthAssessment {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  isHealthy: boolean;
  healthScore: number;
  diseases: DiseaseInfo[];
  recommendations: string[];
}

export interface Treatment {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  products?: Array<{
    name: string;
    type: 'organic' | 'chemical';
    dosage: string;
  }>;
}

export interface Suggestion {
  name: string;
  probability: number;
  scientificName?: string;
  description?: string;
  isPest: boolean;
  treatment?: any;
  symptoms?: string;
}

export interface CompleteAnalysis {
  id?: string;
  timestamp: string;
  identification: PlantIdentification;
  health: HealthAssessment;
  treatment: Treatment;
  suggestions: Suggestion[];
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  imageUri?: string;
}

class DetectionService {
  // Pré-processar imagem
  static async preprocessImage(imageUri: string): Promise<string> {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      return `data:image/jpeg;base64,${manipulatedImage.base64}`;
    } catch (error) {
      console.error('Erro no pré-processamento:', error);
      throw error;
    }
  }

  // Orquestrar análise completa usando serviços especializados
  static async completeAnalysis(
    imageUri: string, 
    location?: any
  ): Promise<CompleteAnalysis> {
    console.log('🚀 Iniciando análise orquestrada...');

    try {
      // 1. Identificar planta com PlantNetService
      console.log('🌿 Identificando planta...');
      const plantInfo = await PlantNetService.identifyPlant(imageUri);
      
      // 2. Diagnóstico de saúde com KindwisePlantHealthService
      console.log('🏥 Diagnosticando saúde...');
      let healthResponse: PlantHealthResponse;
      
      if (KindwisePlantHealthService.canUseRealAPI()) {
        healthResponse = await KindwisePlantHealthService.diagnosePlant(
          imageUri, 
          plantInfo.scientificName
        );
      } else {
        healthResponse = await KindwisePlantHealthService.simulateDiagnosis(
          imageUri,
          plantInfo.scientificName
        );
      }

      // 3. Combinação dos resultados
      console.log('🔗 Combinando resultados...');
      const completeAnalysis = this.combineResults(
        plantInfo,
        healthResponse,
        imageUri,
        location
      );

      console.log('✅ Análise completa gerada:', completeAnalysis);
      return completeAnalysis;

    } catch (error: any) {
      console.error('❌ Erro na análise orquestrada:', error);
      
      // Fallback: análise simulada
      console.log('🔄 Usando fallback...');
      return await this.simulateCompleteAnalysis(imageUri, location);
    }
  }

  // Combina resultados dos serviços especializados
  private static combineResults(
    plantInfo: PlantInfo,
    healthResponse: PlantHealthResponse,
    imageUri: string,
    location?: any
  ): CompleteAnalysis {
    // Converter doenças do Kindwise para formato padrão
    const diseases: DiseaseInfo[] = healthResponse.diseases.map(disease => ({
      name: disease.name,
      probability: disease.probability,
      severity: disease.severity,
      description: disease.description || 'Doença identificada',
      treatment: this.getTreatmentForDisease(disease),
      symptoms: disease.affectedParts ? [`Afeta: ${disease.affectedParts.join(', ')}`] : []
    }));

    // Determinar status de saúde
    const healthStatus = healthResponse.isHealthy ? 'healthy' : 
                        healthResponse.healthScore > 50 ? 'warning' : 'critical';

    // Gerar sugestões combinadas
    const suggestions: Suggestion[] = [
      {
        name: plantInfo.commonName,
        probability: plantInfo.probability,
        scientificName: plantInfo.scientificName,
        description: `Planta identificada: ${plantInfo.commonName}`,
        isPest: false
      },
      ...healthResponse.diseases.map(disease => ({
        name: disease.name,
        probability: disease.probability,
        scientificName: disease.scientificName,
        description: disease.description,
        isPest: disease.type === 'pest',
        treatment: findTreatment(disease.name),
        symptoms: disease.description
      }))
    ];

    // Tratamentos baseados nas doenças
    const treatment = this.generateTreatment(healthResponse, diseases);

    return {
      timestamp: new Date().toISOString(),
      identification: {
        name: plantInfo.commonName,
        confidence: plantInfo.probability,
        scientificName: plantInfo.scientificName,
        description: `Família: ${plantInfo.family || 'Desconhecida'}`,
        commonNames: plantInfo.commonNames || [plantInfo.commonName]
      },
      health: {
        status: healthStatus,
        score: healthResponse.healthScore,
        isHealthy: healthResponse.isHealthy,
        healthScore: healthResponse.healthScore,
        diseases,
        recommendations: healthResponse.suggestions
      },
      treatment,
      suggestions,
      location: location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      } : undefined,
      imageUri
    };
  }

  // Obter tratamento para doença
  private static getTreatmentForDisease(disease: DiseaseDiagnosis): DiseaseInfo['treatment'] {
    const customTreatment = findTreatment(disease.name);
    
    if (customTreatment) {
      return {
        organic: customTreatment.organic || [],
        chemical: customTreatment.chemical || [],
        preventive: customTreatment.preventive || []
      };
    }

    // Tratamento padrão baseado no tipo
    return {
      organic: disease.treatment || ['Tratamento orgânico recomendado'],
      chemical: ['Consulte produto químico específico'],
      preventive: disease.prevention || ['Boas práticas agrícolas']
    };
  }

  // Gerar plano de tratamento
  private static generateTreatment(
    healthResponse: PlantHealthResponse,
    diseases: DiseaseInfo[]
  ): Treatment {
    const hasDiseases = diseases.length > 0;
    const isCritical = healthResponse.healthScore < 40;

    return {
      immediate: hasDiseases ? [
        'Identificar problema específico',
        'Isolar planta se necessário'
      ] : ['Nenhuma ação imediata necessária'],
      
      shortTerm: hasDiseases ? [
        'Aplicar tratamento recomendado',
        'Monitorar evolução diariamente'
      ] : ['Continuar cuidados regulares'],
      
      longTerm: hasDiseases ? [
        'Implementar medidas preventivas',
        'Fortalecer defesas naturais da planta'
      ] : ['Manter rotina de cuidados'],
      
      products: hasDiseases ? [
        { name: 'Óleo de Neem', type: 'organic', dosage: '5ml por litro' },
        { name: 'Fungicida/Inseticida', type: 'chemical', dosage: 'Conforme instruções' }
      ] : undefined
    };
  }

  // Análise rápida (apenas identificação)
  static async quickAnalysis(imageUri: string): Promise<PlantIdentification> {
    try {
      const plantInfo = await PlantNetService.identifyPlant(imageUri);
      
      return {
        name: plantInfo.commonName,
        confidence: plantInfo.probability,
        scientificName: plantInfo.scientificName,
        description: `Família: ${plantInfo.family || 'Desconhecida'}`,
        commonNames: plantInfo.commonNames || [plantInfo.commonName]
      };
    } catch (error) {
      console.error('Erro na análise rápida:', error);
      return {
        name: 'Planta não identificada',
        confidence: 0,
        commonNames: []
      };
    }
  }

  // Fallback: análise simulada completa
  private static async simulateCompleteAnalysis(
    imageUri: string, 
    location?: any
  ): Promise<CompleteAnalysis> {
    console.log('🔄 Executando análise simulada...');

    // Simular atraso de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      timestamp: new Date().toISOString(),
      identification: {
        name: 'Tomateiro (Lycopersicon esculentum)',
        confidence: 88,
        scientificName: 'Solanum lycopersicum',
        description: 'Planta frutífera da família das solanáceas',
        commonNames: ['Tomate', 'Tomateiro']
      },
      health: {
        status: 'warning',
        score: 65,
        isHealthy: false,
        healthScore: 65,
        diseases: [
          {
            name: 'Míldio do Tomateiro',
            probability: 78,
            severity: 'medium',
            description: 'Doença fúngica que causa manchas foliares e murcha',
            treatment: {
              organic: ['Calda bordalesa', 'Extrato de alho'],
              chemical: ['Fungicida sistêmico'],
              preventive: ['Boa ventilação', 'Evitar molhar folhas']
            },
            symptoms: ['Manchas foliares', 'Murcha das folhas']
          }
        ],
        recommendations: [
          'Aplicar fungicida preventivo',
          'Melhorar circulação de ar',
          'Monitorar evolução'
        ]
      },
      treatment: {
        immediate: ['Remover folhas afetadas'],
        shortTerm: ['Aplicar fungicida'],
        longTerm: ['Melhorar drenagem'],
        products: [
          { name: 'Fungicida X', type: 'chemical', dosage: '10ml/L' }
        ]
      },
      suggestions: [
        {
          name: 'Tomateiro',
          probability: 88,
          isPest: false
        },
        {
          name: 'Míldio',
          probability: 78,
          isPest: true
        }
      ],
      location: location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      } : undefined,
      imageUri
    };
  }
}

export default DetectionService;
export const detectionService = new DetectionService();