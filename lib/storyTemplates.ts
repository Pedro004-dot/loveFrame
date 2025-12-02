import type { StoryTemplate, TimeTogetherConfig } from '@/types/stories'

// Template para o story "Tempo Juntos"
export const timeTogetherTemplate: StoryTemplate = {
  id: 'time-together',
  name: 'Tempo Juntos',
  description: 'Contador animado dos dias, horas e minutos que vocês estão juntos',
  icon: '⏰',
  category: 'statistics',
  isPremium: false,
  difficulty: 'easy',
  estimatedTime: 3, // 3 minutos para configurar
  configFields: [
    {
      key: 'startDate',
      type: 'date',
      label: 'Data do Início do Relacionamento',
      required: true,
      placeholder: 'Quando começaram a namorar?'
    },
    {
      key: 'customMessage',
      type: 'textarea',
      label: 'Mensagem Personalizada (opcional)',
      required: false,
      placeholder: 'Ex: "Cada dia ao seu lado é um presente..."',
      validation: {
        max: 150
      }
    },
    {
      key: 'showHours',
      type: 'select',
      label: 'Mostrar Horas',
      required: true,
      options: [
        { label: 'Sim', value: 'true' },
        { label: 'Não', value: 'false' }
      ]
    },
    {
      key: 'showMinutes',
      type: 'select',
      label: 'Mostrar Minutos',
      required: true,
      options: [
        { label: 'Sim', value: 'true' },
        { label: 'Não', value: 'false' }
      ]
    },
    {
      key: 'animationStyle',
      type: 'select',
      label: 'Estilo da Animação',
      required: true,
      options: [
        { label: 'Contador Progressivo', value: 'counter' },
        { label: 'Pulsação Cardíaca', value: 'heartbeat' },
        { label: 'Pulso Radiante', value: 'pulse' }
      ]
    },
    {
      key: 'backgroundColor',
      type: 'color',
      label: 'Cor de Fundo',
      required: true,
      placeholder: '#8B5CF6'
    },
    {
      key: 'textColor',
      type: 'color',
      label: 'Cor do Texto',
      required: true,
      placeholder: '#FFFFFF'
    }
  ],
  defaultConfig: {
    startDate: '',
    customMessage: '',
    showHours: true,
    showMinutes: true,
    animationStyle: 'counter',
    backgroundColor: '#8B5CF6', // Purple-500
    textColor: '#FFFFFF',
    // Base config
    id: 'time-together',
    enabled: true,
    order: 0,
    duration: 30,
    type: 'time-together'
  } as Partial<TimeTogetherConfig>
}

// Template para "Primeiro Encontro"
export const firstMeetingTemplate: StoryTemplate = {
  id: 'first-meeting',
  name: 'Primeiro Encontro',
  description: 'Celebre o momento mágico quando tudo começou',
  icon: '💫',
  category: 'emotional',
  isPremium: false,
  difficulty: 'easy',
  estimatedTime: 4,
  configFields: [
    {
      key: 'meetingDate',
      type: 'date',
      label: 'Data do Primeiro Encontro',
      required: true
    },
    {
      key: 'location',
      type: 'text',
      label: 'Local do Encontro',
      required: true,
      placeholder: 'Ex: Café da esquina, Parque da cidade...',
      validation: {
        max: 100
      }
    },
    {
      key: 'description',
      type: 'textarea',
      label: 'Como foi esse momento?',
      required: true,
      placeholder: 'Conte como foi esse primeiro encontro especial...',
      validation: {
        max: 200
      }
    },
    {
      key: 'mood',
      type: 'select',
      label: 'Atmosfera do Encontro',
      required: true,
      options: [
        { label: '💕 Romântico', value: 'romantic' },
        { label: '🎉 Divertido', value: 'fun' },
        { label: '🥰 Emocionante', value: 'emotional' }
      ]
    }
  ],
  defaultConfig: {
    meetingDate: '',
    location: '',
    description: '',
    mood: 'romantic',
    id: 'first-meeting',
    enabled: true,
    order: 0,
    duration: 30,
    type: 'first-meeting'
  }
}

// Template para "Nossa Música"
export const ourSongTemplate: StoryTemplate = {
  id: 'our-song',
  name: 'Nossa Música',
  description: 'A trilha sonora da história de vocês',
  icon: '🎵',
  category: 'emotional',
  isPremium: false,
  difficulty: 'medium',
  estimatedTime: 5,
  configFields: [
    {
      key: 'songTitle',
      type: 'text',
      label: 'Nome da Música',
      required: true,
      placeholder: 'Ex: Perfect, All of Me...',
      validation: {
        max: 100
      }
    },
    {
      key: 'artist',
      type: 'text',
      label: 'Artista',
      required: true,
      placeholder: 'Ex: Ed Sheeran, John Legend...',
      validation: {
        max: 100
      }
    },
    {
      key: 'specialLyric',
      type: 'textarea',
      label: 'Trecho Especial da Letra (opcional)',
      required: false,
      placeholder: 'Qual parte da música mais representa vocês?',
      validation: {
        max: 150
      }
    },
    {
      key: 'whySpecial',
      type: 'textarea',
      label: 'Por que essa música é especial?',
      required: true,
      placeholder: 'Conte a história por trás dessa música...',
      validation: {
        min: 20,
        max: 200
      }
    }
  ],
  defaultConfig: {
    songTitle: '',
    artist: '',
    specialLyric: '',
    whySpecial: '',
    id: 'our-song',
    enabled: true,
    order: 0,
    duration: 30,
    type: 'our-song'
  }
}

// Exportar todos os templates disponíveis
export const availableTemplates: StoryTemplate[] = [
  timeTogetherTemplate,
  firstMeetingTemplate,
  ourSongTemplate
]

// Helper function para buscar template por ID
export const getTemplateById = (id: string): StoryTemplate | undefined => {
  return availableTemplates.find(template => template.id === id)
}

// Helper function para filtrar templates por categoria
export const getTemplatesByCategory = (category: string): StoryTemplate[] => {
  return availableTemplates.filter(template => template.category === category)
}

// Helper function para templates gratuitos
export const getFreeTemplates = (): StoryTemplate[] => {
  return availableTemplates.filter(template => !template.isPremium)
}

// Helper function para templates premium
export const getPremiumTemplates = (): StoryTemplate[] => {
  return availableTemplates.filter(template => template.isPremium)
}