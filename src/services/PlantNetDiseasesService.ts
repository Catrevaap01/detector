// src/services/PlantNetService.ts
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { API_CONFIG } from '../utils/apiConfig';

export interface PlantNetDiseaseResult {
  name: string;
  score: number;
  description: string;
}

export interface PlantNetDiseaseResponse {
  results: PlantNetDiseaseResult[];
  query: {
    images: string[];
    organs: string[];
    includeRelatedImages: boolean;
    noReject: boolean;
  };
  language: string;
  version: string;
  remainingIdentificationRequests: number;
}

export interface PlantDiseaseInfo {
  code: string;
  scientificName: string;
  commonName: string;
  description: string;
  probability: number;
}

class PlantNetDiseaseService {
  // Identificar doença com PlantNet - retorna até 4 resultados
  static async identifyPlantDisease(imageUri: string): Promise<{
    mainResult: PlantDiseaseInfo;
    otherResults: PlantDiseaseInfo[];
  }> {
    // Verificar se tem API key
    if (!API_CONFIG.PLANTNET.API_KEY) {
      throw new Error('API Key do PlantNet não configurada. Obtenha uma em: https://my.plantnet.org/account');
    }

    try {
      console.log('🌿 Identificando doenca com PlantNet...');
      
      // Usar FormData
      const formData = new FormData();
      formData.append('organs', 'leaf');
      formData.append('images', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'plant.jpg',
      } as any);

      // URL com API key como query parameter
      const apiUrl = `${API_CONFIG.PLANTNET.URL_DISEASES}?api-key=${API_CONFIG.PLANTNET.API_KEY}`;

      console.log(apiUrl);
      

      const response = await axios.post<PlantNetDiseaseResponse>(
        apiUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      console.log('✅ Resposta PlantNet - Disease:', JSON.stringify(response.data,null,2));
      
      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('Nenhuma doença identificada na imagem');
      }

      // Processar o resultado principal (o primeiro)
      const bestResult = response.data.results[0];
      const mainDisease = this.parseDiseaseResult(bestResult);
      
      // Processar outros resultados (máximo 3, pois já temos 1 principal)
      const otherDiseases: PlantDiseaseInfo[] = [];
      const maxOtherResults = Math.min(3, response.data.results.length - 1);
      
      for (let i = 1; i <= maxOtherResults; i++) {
        const result = response.data.results[i];
        const disease = this.parseDiseaseResult(result);
        otherDiseases.push(disease);
      }

      return {
        mainResult: mainDisease,
        otherResults: otherDiseases
      };
      
    } catch (error: any) {
      console.error('❌ Erro PlantNet:', error);
      
      // Mensagem de erro específica
      if (error.response?.status === 401) {
        throw new Error('API Key do PlantNet inválida ou expirada');
      } else if (error.response?.status === 403) {
        throw new Error('Limite de requisições excedido. Tente amanhã.');
      } else if (error.response?.status === 404) {
        throw new Error('Endpoint da API não encontrado');
      }
      
      throw new Error(`Falha ao identificar doença: ${error.message}`);
    }
  }

  // Método auxiliar para parsear um resultado
  private static parseDiseaseResult(result: PlantNetDiseaseResult): PlantDiseaseInfo {
    // Parsear a descrição para extrair nome científico e comum
    const descriptionParts = result.description.split(' - ');
    const scientificName = descriptionParts[0] || result.name;
    const commonName = descriptionParts[1] || scientificName;

    return {
      code: result.name,
      scientificName: scientificName.trim(),
      commonName: commonName.trim(),
      description: result.description,
      probability: Math.round(result.score * 10000) / 100, // Converte para porcentagem com 2 decimais
    };
  }

  // O resto do código permanece EXATAMENTE como estava...
  // Método alternativo com JSON (se FormData não funcionar)
  static async identifyPlantJSON(imageUri: string): Promise<{
    mainResult: PlantDiseaseInfo;
    otherResults: PlantDiseaseInfo[];
  }> {
    if (!API_CONFIG.PLANTNET.API_KEY || API_CONFIG.PLANTNET.API_KEY === 'SEU_API_KEY_AQUI') {
      throw new Error('API Key do PlantNet não configurada');
    }

    try {
      console.log('🌿 Identificando planta (método JSON)...');
      
      // Converter para base64
      const base64Image = await this.imageToBase64(imageUri);
      
      const payload = {
        project: API_CONFIG.PLANTNET.PROJECTS.ALL,
        images: [base64Image],
        organs: ['leaf'],
      };

      const apiUrl = `${API_CONFIG.PLANTNET.URL}?api-key=${API_CONFIG.PLANTNET.API_KEY}`;

      const response = await axios.post<PlantNetDiseaseResponse>(
        apiUrl,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: API_CONFIG.PLANTNET.DEFAULT_PARAMS,
          timeout: 30000,
        }
      );

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('Nenhuma planta identificada');
      }

      // Processar o resultado principal (o primeiro)
      const bestResult = response.data.results[0];
      const mainDisease = this.parseDiseaseResult(bestResult);
      
      // Processar outros resultados (máximo 3, pois já temos 1 principal)
      const otherDiseases: PlantDiseaseInfo[] = [];
      const maxOtherResults = Math.min(3, response.data.results.length - 1);
      
      for (let i = 1; i <= maxOtherResults; i++) {
        const result = response.data.results[i];
        const disease = this.parseDiseaseResult(result);
        otherDiseases.push(disease);
      }

      return {
        mainResult: mainDisease,
        otherResults: otherDiseases
      };
      
    } catch (error: any) {
      console.error('❌ Erro PlantNet (JSON):', error);
      throw new Error(`Falha no método JSON: ${error.message}`);
    }
  }

  // Método auxiliar: converter imagem para base64
  static async imageToBase64(uri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('❌ Erro ao converter imagem para base64:', error);
      throw new Error('Falha ao processar a imagem');
    }
  }

  // Verificar se é praga
  static isPlantPest(plantName: string): boolean {
    const lowerName = plantName.toLowerCase();
    return API_CONFIG.PEST_KEYWORDS.some(keyword => lowerName.includes(keyword));
  }

  // Obter tipo de problema
  static getPlantProblemType(plantName: string): string {
    const lowerName = plantName.toLowerCase();
    
    if (API_CONFIG.PEST_KEYWORDS.some(kw => 
      ['lagarta', 'broca', 'pulgão', 'ácaro', 'cochonilha'].includes(kw) && 
      lowerName.includes(kw)
    )) {
      return 'inseto';
    }
    
    if (API_CONFIG.PEST_KEYWORDS.some(kw => 
      ['ferrugem', 'oídio', 'míldio', 'fungo'].includes(kw) && 
      lowerName.includes(kw)
    )) {
      return 'fungo';
    }
    
    if (lowerName.includes('bactéria')) {
      return 'bacteria';
    }
    
    if (lowerName.includes('vírus')) {
      return 'virus';
    }
    
    return 'outro';
  }
}

export default PlantNetDiseaseService;