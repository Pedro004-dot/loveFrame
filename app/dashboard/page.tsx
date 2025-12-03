'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Settings, Eye, Plus, Sparkles } from 'lucide-react'
import { RetrospectiveService } from '@/lib/retrospectiveService'
import { WrappedService } from '@/lib/wrappedService'
import type { Retrospective } from '@/lib/supabase'
import { getPublicUrl } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [retrospectives, setRetrospectives] = useState<Retrospective[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRetrospectives()
  }, [])

  const loadRetrospectives = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get user email from localStorage
      const userEmail = localStorage.getItem('userEmail')
      const storedData = localStorage.getItem('onboardingData')
      let emailToUse = userEmail
      
      // Try to get email from onboardingData if not in userEmail
      if (!emailToUse && storedData) {
        try {
          const data = JSON.parse(storedData)
          emailToUse = data.creatorEmail
        } catch (e) {
          console.error('Error parsing stored data:', e)
        }
      }
      
      if (emailToUse) {
        // Load retrospectives by email
        try {
          // Check if method exists before calling
          if (!('getByCreatorEmail' in RetrospectiveService)) {
            console.warn('[Dashboard] getByCreatorEmail not found, using fallback')
            throw new Error('Method not available')
          }
          
          const result = await RetrospectiveService.getByCreatorEmail(emailToUse)
          
          if (result && result.data && !result.error) {
            setRetrospectives(result.data)
          } else if (result && result.error) {
            console.error('Error loading retrospectives:', result.error)
            setError('Erro ao carregar retrospectivas')
          } else {
            setRetrospectives([])
          }
        } catch (err: any) {
          console.error('Error calling getByCreatorEmail:', err)
          // Fallback: try to load from uniqueId
          if (storedData) {
            try {
              const data = JSON.parse(storedData)
              const retrospectiveId = data.retrospectiveId || data.uniqueId
              if (retrospectiveId) {
                const { data: retrospective, error } = await RetrospectiveService.getByUniqueId(retrospectiveId)
                if (retrospective && !error) {
                  setRetrospectives([retrospective])
                }
              }
            } catch (e) {
              console.error('Error in fallback:', e)
              setError('Erro ao carregar retrospectivas. Tente recarregar a página.')
            }
          } else {
            setError('Erro ao carregar retrospectivas. Tente recarregar a página.')
          }
        }
      } else {
        // Fallback: try to load from localStorage uniqueId (for backward compatibility)
        if (storedData) {
          try {
            const data = JSON.parse(storedData)
            const retrospectiveId = data.retrospectiveId || data.uniqueId
            
            if (retrospectiveId) {
              const { data: retrospective, error } = await RetrospectiveService.getByUniqueId(retrospectiveId)
              if (retrospective && !error) {
                setRetrospectives([retrospective])
              }
            }
          } catch (e) {
            console.error('Error parsing stored data:', e)
          }
        }
      }
    } catch (err) {
      console.error('Error loading retrospectives:', err)
      setError('Erro ao carregar retrospectivas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigureWrapped = (retrospectiveId: string) => {
    router.push(`/dashboard/${retrospectiveId}/wrapped`)
  }

  const handleViewRetrospective = (uniqueId: string) => {
    router.push(`/view/${uniqueId}`)
  }

  const handleCreateNew = () => {
    router.push('/create')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="text-gray-600 mt-4">Carregando suas retrospectivas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                LoveFrame
              </span>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Retrospectiva</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Retrospectivas</h1>
          <p className="text-gray-600">Gerencie e configure suas retrospectivas de amor</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {retrospectives.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma retrospectiva ainda</h2>
            <p className="text-gray-600 mb-6">Crie sua primeira retrospectiva de amor agora mesmo!</p>
            <button
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Criar Retrospectiva
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retrospectives.map((retrospective) => {
              const coverPhotoUrl = retrospective.cover_photo_path
                ? getPublicUrl('retrospectives', retrospective.cover_photo_path)
                : null

              return (
                <div
                  key={retrospective.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105"
                >
                  {/* Preview Image */}
                  <div className="relative h-48 bg-gradient-to-br from-pink-200 via-purple-200 to-rose-200">
                    {coverPhotoUrl ? (
                      <img
                        src={coverPhotoUrl}
                        alt={retrospective.gift_title || 'Retrospectiva'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-16 h-16 text-pink-400 opacity-50" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {retrospective.payment_status === 'completed' ? (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          ✓ Pago
                        </span>
                      ) : (
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Pendente
                        </span>
                      )}
                    </div>

                    {/* Wrapped Badge */}
                    {retrospective.has_wrapped && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Wrapped</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {retrospective.gift_title || 'Sem título'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {retrospective.couple_name || `${retrospective.user_name} e ${retrospective.partner_name}`}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>
                        {new Date(retrospective.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewRetrospective(retrospective.unique_id)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Visualizar</span>
                      </button>
                      
                      {retrospective.has_wrapped && (
                        <button
                          onClick={() => handleConfigureWrapped(retrospective.id)}
                          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Configurar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

