import { getSupabaseClient } from './supabase'
import type { WrappedConfig, WrappedTemplateType, WrappedTemplateRecord } from '@/types/wrapped'

export class WrappedService {
  /**
   * Get all available wrapped templates
   */
  static getAvailableTemplates() {
    const templates = [
      {
        id: 'couple-quiz' as WrappedTemplateType,
        name: 'Quiz do Casal',
        description: 'Teste o quanto vocês se conhecem com perguntas personalizadas',
        icon: '🎯',
        category: 'interactive' as const,
        isPremium: false,
        difficulty: 'medium' as const,
        estimatedTime: 5
      },
      {
        id: 'word-game' as WrappedTemplateType,
        name: 'Jogo de Palavras',
        description: 'Palavras que descrevem o que você mais gosta no seu parceiro',
        icon: '💬',
        category: 'emotional' as const,
        isPremium: false,
        difficulty: 'easy' as const,
        estimatedTime: 3
      },
      {
        id: 'timeline' as WrappedTemplateType,
        name: 'Linha do Tempo',
        description: 'Eventos importantes do relacionamento em uma linha do tempo interativa',
        icon: '⏰',
        category: 'emotional' as const,
        isPremium: false,
        difficulty: 'medium' as const,
        estimatedTime: 8
      },
      {
        id: 'photo-stories' as WrappedTemplateType,
        name: 'Stories de Fotos',
        description: 'Fotos com frases especiais que você pode arrastar para ver',
        icon: '📸',
        category: 'emotional' as const,
        isPremium: false,
        difficulty: 'easy' as const,
        estimatedTime: 5
      },
      {
        id: 'time-stats' as WrappedTemplateType,
        name: 'Estatísticas do Tempo',
        description: 'Dados impressionantes sobre o tempo que passaram juntos',
        icon: '📊',
        category: 'statistics' as const,
        isPremium: false,
        difficulty: 'easy' as const,
        estimatedTime: 2
      },
      {
        id: 'star-map' as WrappedTemplateType,
        name: 'Mapa de Estrelas',
        description: 'O céu exato do dia que vocês se conheceram',
        icon: '⭐',
        category: 'premium' as const,
        isPremium: true,
        difficulty: 'easy' as const,
        estimatedTime: 2
      },
      {
        id: 'roulette' as WrappedTemplateType,
        name: 'Roleta Surpresa',
        description: 'Desafios e memórias aleatórias para descobrir',
        icon: '🎰',
        category: 'interactive' as const,
        isPremium: false,
        difficulty: 'medium' as const,
        estimatedTime: 5
      },
      {
        id: 'special-messages' as WrappedTemplateType,
        name: 'Mensagens Especiais',
        description: 'Mensagens do coração com revelação progressiva',
        icon: '💌',
        category: 'emotional' as const,
        isPremium: false,
        difficulty: 'easy' as const,
        estimatedTime: 4
      }
    ]
    return templates
  }

  /**
   * Get all wrapped templates for a retrospective
   */
  static async getWrappedTemplates(retrospectiveId: string): Promise<WrappedConfig[]> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('wrapped_templates')
        .select('*')
        .eq('retrospective_id', retrospectiveId)
        .eq('enabled', true)
        .order('order', { ascending: true })

      if (error) {
        console.error('Error fetching wrapped templates:', error)
        return []
      }

      if (!data || data.length === 0) {
        return []
      }

      // Convert database records to WrappedConfig
      return data.map((record: WrappedTemplateRecord) => record.config as WrappedConfig)
    } catch (error) {
      console.error('Error in getWrappedTemplates:', error)
      return []
    }
  }

  /**
   * Get all wrapped template records (including metadata) for a retrospective
   */
  static async getWrappedTemplateRecords(retrospectiveId: string): Promise<WrappedTemplateRecord[]> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('wrapped_templates')
        .select('*')
        .eq('retrospective_id', retrospectiveId)
        .order('order', { ascending: true })

      if (error) {
        console.error('Error fetching wrapped template records:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getWrappedTemplateRecords:', error)
      return []
    }
  }

  /**
   * Save a wrapped template configuration
   */
  static async saveWrappedTemplate(
    retrospectiveId: string,
    config: WrappedConfig,
    order?: number
  ): Promise<{ success: boolean; id?: string; error?: any }> {
    try {
      const supabase = getSupabaseClient()
      
      // Get current max order if not provided
      let templateOrder = order
      if (templateOrder === undefined) {
        const { data: existing } = await supabase
          .from('wrapped_templates')
          .select('order')
          .eq('retrospective_id', retrospectiveId)
          .order('order', { ascending: false })
          .limit(1)
          .single()
        
        templateOrder = existing ? (existing.order + 1) : 0
      }

      const { data, error } = await supabase
        .from('wrapped_templates')
        .insert({
          retrospective_id: retrospectiveId,
          template_id: config.templateId,
          config: config as any,
          order: templateOrder,
          enabled: config.enabled !== false
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving wrapped template:', error)
        return { success: false, error }
      }

      return { success: true, id: data.id }
    } catch (error) {
      console.error('Error in saveWrappedTemplate:', error)
      return { success: false, error }
    }
  }

  /**
   * Update an existing wrapped template
   */
  static async updateWrappedTemplate(
    templateId: string,
    config: Partial<WrappedConfig>,
    order?: number
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const supabase = getSupabaseClient()
      
      const updateData: any = {
        config: config as any,
        updated_at: new Date().toISOString()
      }

      if (order !== undefined) {
        updateData.order = order
      }

      if (config.enabled !== undefined) {
        updateData.enabled = config.enabled
      }

      const { error } = await supabase
        .from('wrapped_templates')
        .update(updateData)
        .eq('id', templateId)

      if (error) {
        console.error('Error updating wrapped template:', error)
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in updateWrappedTemplate:', error)
      return { success: false, error }
    }
  }

  /**
   * Update the order of multiple templates
   */
  static async updateTemplateOrder(
    retrospectiveId: string,
    orders: { id: string; order: number }[]
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const supabase = getSupabaseClient()
      
      // Update each template's order
      const updates = orders.map(({ id, order }) =>
        supabase
          .from('wrapped_templates')
          .update({ order, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('retrospective_id', retrospectiveId)
      )

      const results = await Promise.all(updates)
      const hasError = results.some(result => result.error)

      if (hasError) {
        console.error('Error updating template orders:', results.find(r => r.error)?.error)
        return { success: false, error: results.find(r => r.error)?.error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in updateTemplateOrder:', error)
      return { success: false, error }
    }
  }

  /**
   * Delete a wrapped template
   */
  static async deleteWrappedTemplate(templateId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('wrapped_templates')
        .delete()
        .eq('id', templateId)

      if (error) {
        console.error('Error deleting wrapped template:', error)
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in deleteWrappedTemplate:', error)
      return { success: false, error }
    }
  }

  /**
   * Toggle enabled status of a template
   */
  static async toggleTemplateEnabled(
    templateId: string,
    enabled: boolean
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('wrapped_templates')
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq('id', templateId)

      if (error) {
        console.error('Error toggling template enabled:', error)
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in toggleTemplateEnabled:', error)
      return { success: false, error }
    }
  }

  /**
   * Update retrospective wrapped status
   */
  static async updateRetrospectiveWrappedStatus(
    retrospectiveId: string,
    hasWrapped: boolean,
    wrappedEnabled?: boolean
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const supabase = getSupabaseClient()
      const updateData: any = {
        has_wrapped: hasWrapped,
        updated_at: new Date().toISOString()
      }

      if (wrappedEnabled !== undefined) {
        updateData.wrapped_enabled = wrappedEnabled
      }

      const { error } = await supabase
        .from('retrospectives')
        .update(updateData)
        .eq('id', retrospectiveId)

      if (error) {
        console.error('Error updating retrospective wrapped status:', error)
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in updateRetrospectiveWrappedStatus:', error)
      return { success: false, error }
    }
  }
}

