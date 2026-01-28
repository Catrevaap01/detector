// src/services/TreatmentDatabase.ts
interface Treatment {
  organic: string[];
  chemical: string[];
  preventive: string[];
}

interface TreatmentData {
  name: string;
  type: 'inseto' | 'fungo' | 'bacteria' | 'virus' | 'aracnídeo' | 'outro';
  treatment: Treatment;
}

// Banco de dados de tratamentos
const TREATMENTS_DATABASE: Record<string, TreatmentData> = {
  // Insetos/Pragas
  'lagarta': {
    name: 'Lagarta',
    type: 'inseto',
    treatment: {
      organic: [
        'Controle manual (coleta das lagartas)',
        'Óleo de neem (5ml por litro de água)',
        'Extrato de alho (50g de alho triturado em 1L de água)',
        'Bacillus thuringiensis (inseticida biológico)'
      ],
      chemical: [
        'Inseticida à base de cipermetrina',
        'Inseticida específico para lagartas',
        'Aplicar conforme instruções do fabricante'
      ],
      preventive: [
        'Monitoramento regular das plantas',
        'Rotação de culturas',
        'Manter área limpa de ervas daninhas',
        'Insetos predadores (joaninha, vespas)'
      ]
    }
  },
  
  'pulgão': {
    name: 'Pulgão',
    type: 'inseto',
    treatment: {
      organic: [
        'Calda de fumo (100g de fumo em 1L de água por 24h)',
        'Sabão neutro (20g por litro de água)',
        'Óleo mineral (aplicação foliar)',
        'Insetos predadores (joaninhas, crisopídeos)'
      ],
      chemical: [
        'Inseticida sistêmico',
        'Imidacloprido (aplicação foliar)',
        'Aplicar de manhã cedo ou final da tarde'
      ],
      preventive: [
        'Controle de formigas (elas protegem os pulgões)',
        'Plantas repelentes (hortelã, alho, calêndula)',
        'Evitar excesso de nitrogênio',
        'Poda de partes muito infestadas'
      ]
    }
  },
  
  'ácaro': {
    name: 'Ácaro',
    type: 'aracnídeo',
    treatment: {
      organic: [
        'Enxofre molhável',
        'Óleo de neem ou mineral',
        'Extrato de pimenta (50g em 1L de água)',
        'Aumentar umidade do ambiente'
      ],
      chemical: [
        'Acaricida específico',
        'Abamectina',
        'Hexitiazox'
      ],
      preventive: [
        'Manter boa ventilação',
        'Evitar estresse hídrico',
        'Monitorar plantas próximas',
        'Lavar folhas periodicamente'
      ]
    }
  },
  
  'cochonilha': {
    name: 'Cochonilha',
    type: 'inseto',
    treatment: {
      organic: [
        'Álcool isopropílico (70%) com cotonete',
        'Óleo de neem (aplicação direta)',
        'Calda de fumo',
        'Sabão potássico'
      ],
      chemical: [
        'Óleo mineral emulsionável',
        'Acetamiprido',
        'Tiametoxam'
      ],
      preventive: [
        'Inspeção regular de plantas novas',
        'Poda de partes infestadas',
        'Evitar excesso de adubação nitrogenada',
        'Manter equilíbrio biológico'
      ]
    }
  },
  
  'ferrugem': {
    name: 'Ferrugem',
    type: 'fungo',
    treatment: {
      organic: [
        'Calda bordalesa (sulfato de cobre + cal)',
        'Bicarbonato de sódio (10g por litro de água)',
        'Extrato de cavalinha',
        'Óleo de neem'
      ],
      chemical: [
        'Fungicida à base de cobre',
        'Triazol',
        'Estrobilurina'
      ],
      preventive: [
        'Boa ventilação entre plantas',
        'Evitar molhar folhas à noite',
        'Poda de limpeza',
        'Rotação de culturas'
      ]
    }
  },
  
  'oídio': {
    name: 'Oídio',
    type: 'fungo',
    treatment: {
      organic: [
        'Leite (1 parte de leite para 9 partes de água)',
        'Bicarbonato de sódio (5g por litro de água)',
        'Óleo de neem',
        'Enxofre molhável'
      ],
      chemical: [
        'Fungicida sistêmico',
        'Triazol',
        'Miclobutanil'
      ],
      preventive: [
        'Evitar aglomeração de plantas',
        'Boa circulação de ar',
        'Regar no período da manhã',
        'Resistência varietal'
      ]
    }
  },
  
  'míldio': {
    name: 'Míldio',
    type: 'fungo',
    treatment: {
      organic: [
        'Calda bordalesa',
        'Extrato de alho',
        'Óleo de cravo',
        'Controle da umidade'
      ],
      chemical: [
        'Fungicida específico para míldio',
        'Mancozebe',
        'Metalaxil'
      ],
      preventive: [
        'Irrigação por gotejamento',
        'Escolha de variedades resistentes',
        'Destruição de restos culturais',
        'Evitar sombreamento excessivo'
      ]
    }
  }
};

// Funções de acesso ao banco de dados
export const findTreatment = (problemName: string): Treatment | null => {
  if (!problemName) return null;
  
  const lowerProblem = problemName.toLowerCase();
  
  // Procura por correspondência exata ou parcial
  for (const [key, treatmentData] of Object.entries(TREATMENTS_DATABASE)) {
    if (lowerProblem.includes(key) || lowerProblem.includes(treatmentData.name.toLowerCase())) {
      return treatmentData.treatment;
    }
  }
  
  return null;
};

export const getProblemInfo = (problemName: string): TreatmentData | null => {
  if (!problemName) return null;
  
  const lowerProblem = problemName.toLowerCase();
  
  // Procura por correspondência
  for (const [key, treatmentData] of Object.entries(TREATMENTS_DATABASE)) {
    if (lowerProblem.includes(key) || lowerProblem.includes(treatmentData.name.toLowerCase())) {
      return treatmentData;
    }
  }
  
  return null;
};

export const hasTreatment = (problemName: string): boolean => {
  const treatment = findTreatment(problemName);
  return treatment !== null && treatment.organic.length > 0;
};

// Exporta tipos
export type { Treatment, TreatmentData };