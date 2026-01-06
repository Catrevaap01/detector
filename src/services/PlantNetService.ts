// src/services/PlantNetService.ts
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { API_CONFIG } from '../utils/apiConfig';

export interface PlantNetIdentification {
  score: number;
  species: {
    scientificName: string;
    family?: { scientificName: string };
    genus?: { scientificName: string };
    commonNames?: string[];
  };
  images?: Array<{ url?: string }>;
}

export interface PlantNetResponse {
  results: PlantNetIdentification[];
  query: { images: string[] };
  language: string;
  preferedReferential?: string;
  version: string;
}

export interface PlantInfo {
  scientificName: string;
  commonName: string;
  family?: string;
  genus?: string;
  probability: number;
  commonNames?: string[];
  images?: string[];
}

class PlantNetService {
  // Identificar planta com PlantNet (com API key)
  static async identifyPlant(imageUri: string): Promise<PlantInfo> {
    // Verificar se tem API key
    if (!API_CONFIG.PLANTNET.API_KEY || API_CONFIG.PLANTNET.API_KEY === 'SEU_API_KEY_AQUI') {
      throw new Error('API Key do PlantNet não configurada. Obtenha uma em: https://my.plantnet.org/account');
    }

    try {
      console.log('🌿 Identificando planta com PlantNet...');
      console.log(
        API_CONFIG.PLANTNET.API_KEY, 
        API_CONFIG.PLANTNET.URL,
    API_CONFIG.KINDUISE.HEALTH_URL,
API_CONFIG.KINDUISE.API_KEY);
      
      
      // Usar FormData (método recomendado com API key)
      const formData = new FormData();
      formData.append('organs', 'leaf');
      formData.append('images', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'plant.jpg',
      } as any);

      // URL com API key como query parameter
      const apiUrl = `${API_CONFIG.PLANTNET.URL}?api-key=${API_CONFIG.PLANTNET.API_KEY}`;

      const response = await axios.post<PlantNetResponse>(
        apiUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: API_CONFIG.PLANTNET.DEFAULT_PARAMS,
          timeout: 30000,
        }
      );

      console.log('✅ Resposta PlantNet:', response.data);
      
      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('Nenhuma planta identificada na imagem');
      }

      const bestResult = response.data.results[0];
      const commonName = bestResult.species.commonNames?.[0] || bestResult.species.scientificName;
      
      const imageUrls = bestResult.images?.map(img => img.url || '').filter(url => url) || [];

      return {
        scientificName: bestResult.species.scientificName,
        commonName: commonName,
        family: bestResult.species.family?.scientificName,
        genus: bestResult.species.genus?.scientificName,
        probability: Math.round(bestResult.score * 100),
        commonNames: bestResult.species.commonNames,
        images: imageUrls,
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
      
      throw new Error(`Falha ao identificar planta: ${error.message}`);
    }
  }

  // Método alternativo com JSON (se FormData não funcionar)
  static async identifyPlantJSON(imageUri: string): Promise<PlantInfo> {
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

      const response = await axios.post<PlantNetResponse>(
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

      const bestResult = response.data.results[0];
      const commonName = bestResult.species.commonNames?.[0] || bestResult.species.scientificName;

      return {
        scientificName: bestResult.species.scientificName,
        commonName: commonName,
        family: bestResult.species.family?.scientificName,
        genus: bestResult.species.genus?.scientificName,
        probability: Math.round(bestResult.score * 100),
        commonNames: bestResult.species.commonNames,
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

export default PlantNetService;