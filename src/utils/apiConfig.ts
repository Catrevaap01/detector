// src/utils/apiConfig.ts
export const API_CONFIG = {
  // PlantNet API (GRATUITA com limite)
  PLANTNET: {
    URL: 'https://my-api.plantnet.org/v2/identify/all',
    // Obtenha sua API key em: https://my.plantnet.org/account
    API_KEY: '2b10NUANgaKd5MMW3M42RO0',
    
    // Projetos disponíveis
    PROJECTS: {
      ALL: 'all',
      WEUROPE: 'weurope',
      CANADA: 'canada',
    },
    
    // Parâmetros padrão
    DEFAULT_PARAMS: {
      'include-related-images': false,
      'no-reject': false,
      'lang': 'pt'
    }
  },

  // Kindwise Plant.health API (Premium)
  KINDUISE: {
    HEALTH_URL: 'https://crop.kindwise.com/api/v1',
    API_KEY: 'gLyHz6bDrcx3fJDFyqAS1QKD7lQLH5eOr6TE8AgVROfh3sIeR8', // ← Adicione quando tiver
  },

  // Palavras-chave para identificar pragas
  PEST_KEYWORDS: [
    'lagarta', 'broca', 'percevejo', 'pulgão', 'ácaro', 'cochonilha',
    'mosca', 'branca', 'vaquinha', 'ferrugem', 'oídio', 'míldio',
    'bactéria', 'vírus', 'murcha', 'mancha', 'podridão'
  ],

  // Chaves de armazenamento
  STORAGE_KEYS: {
    HISTORY: 'plant_analysis_history',
    FAVORITES: 'favorite_analyses',
    SETTINGS: 'app_settings',
  }
};

// Verifica se é praga
export const isPest = (plantName: string): boolean => {
  if (!plantName) return false;
  const lowerName = plantName.toLowerCase();
  return API_CONFIG.PEST_KEYWORDS.some(keyword => lowerName.includes(keyword));
};

// Determina tipo do problema
export const getProblemType = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('lagarta') || lower.includes('pulgão')) return 'inseto';
  if (lower.includes('ferrugem') || lower.includes('oídio')) return 'fungo';
  if (lower.includes('bactéria')) return 'bacteria';
  if (lower.includes('vírus')) return 'virus';
  return 'outro';
};
