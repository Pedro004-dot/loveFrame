'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Play, Pencil, X } from 'lucide-react'
import { searchYouTubeVideos, cleanVideoTitle } from '@/utils/youtubeApi'
import type { YouTubeVideo } from '@/types/onboarding'

interface Step4MusicProps {
  selectedTrack: YouTubeVideo | null
  couplePhoto: string | null
  onTrackSelect: (track: YouTubeVideo) => void
}

export default function Step4Music({ selectedTrack, couplePhoto, onTrackSelect }: Step4MusicProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingArtist, setEditingArtist] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [customArtist, setCustomArtist] = useState('')
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Inicializar campos editáveis quando uma música é selecionada
  // Preservar valores customizados se já existirem
  useEffect(() => {
    if (selectedTrack) {
      // Se o selectedTrack já tem valores customizados, usar eles
      if (selectedTrack.customTitle !== undefined) {
        setCustomTitle(selectedTrack.customTitle)
      } else if (!customTitle) {
        // Só inicializar se não houver valor local
        setCustomTitle(selectedTrack.title)
      }
      
      if (selectedTrack.customArtist !== undefined) {
        setCustomArtist(selectedTrack.customArtist)
      } else if (!customArtist) {
        // Só inicializar se não houver valor local
        setCustomArtist(selectedTrack.artist)
      }
    } else {
      // Limpar quando não há música selecionada
      setCustomTitle('')
      setCustomArtist('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack?.id]) // Usar apenas o ID para evitar resetar quando customTitle/customArtist mudam

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true)
        const results = await searchYouTubeVideos(searchQuery)
        setSearchResults(results)
        setIsSearching(false)
      }, 500)
    } else {
      setSearchResults([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const handleTrackSelect = (track: YouTubeVideo) => {
    onTrackSelect(track)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleTitleChange = (value: string) => {
    setCustomTitle(value)
    if (selectedTrack) {
      // Sempre preservar customTitle e customArtist ao atualizar
      onTrackSelect({
        ...selectedTrack,
        customTitle: value,
        customArtist: selectedTrack.customArtist || selectedTrack.artist
      })
    }
  }

  const handleArtistChange = (value: string) => {
    setCustomArtist(value)
    if (selectedTrack) {
      // Sempre preservar customTitle e customArtist ao atualizar
      onTrackSelect({
        ...selectedTrack,
        customTitle: selectedTrack.customTitle || selectedTrack.title,
        customArtist: value
      })
    }
  }

  const handleRemoveTrack = () => {
    onTrackSelect(null as any)
    setCustomTitle('')
    setCustomArtist('')
  }

  const displayTitle = selectedTrack ? (selectedTrack.customTitle || selectedTrack.title) : ''
  const displayArtist = selectedTrack ? (selectedTrack.customArtist || selectedTrack.artist) : ''

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Música
        </h2>
        <p className="text-lg text-gray-700">Escolha aquela música que representa a relação de vocês</p>
       
      </div>

      {/* Música Selecionada com Edição */}
      {selectedTrack && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-start space-x-4 mb-4">
            {/* Thumbnail */}
            <img 
              src={selectedTrack.thumbnail} 
              alt={displayTitle}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            
            {/* Info da Música */}
            <div className="flex-1 space-y-3">
              {/* Título Editável */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-purple-200">🎵</span>
                  {editingTitle ? (
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      onBlur={() => setEditingTitle(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditingTitle(false)
                        }
                      }}
                      className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                      placeholder="Nome da música"
                      autoFocus
                    />
                  ) : (
                    <div 
                      onClick={() => setEditingTitle(true)}
                      className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between group"
                    >
                      <span className="font-semibold">{displayTitle}</span>
                      <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              </div>

              {/* Artista Editável */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-200">🎤</span>
                  {editingArtist ? (
                    <input
                      type="text"
                      value={customArtist}
                      onChange={(e) => handleArtistChange(e.target.value)}
                      onBlur={() => setEditingArtist(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditingArtist(false)
                        }
                      }}
                      className="flex-1 bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                      placeholder="Nome do artista"
                      autoFocus
                    />
                  ) : (
                    <div 
                      onClick={() => setEditingArtist(true)}
                      className="flex-1 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between group"
                    >
                      <span className="text-sm">{displayArtist}</span>
                      <Pencil className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botão Remover */}
            <button
              onClick={handleRemoveTrack}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors flex-shrink-0"
              title="Remover música"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Duração (mock - pode ser obtida da API) */}
          <div className="text-right text-white/80 text-sm">
            3:23
          </div>
        </div>
      )}

      {/* Search Input */}
      {!selectedTrack && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar música no YouTube..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-base text-gray-900 placeholder-gray-500"
          />
        </div>
      )}

      {/* Search Results */}
      {!selectedTrack && isSearching && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 mt-2">Buscando músicas...</p>
        </div>
      )}

      {!selectedTrack && searchResults.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {searchResults.map((track) => (
            <div
              key={track.id}
              onClick={() => handleTrackSelect(track)}
              className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={track.thumbnail} 
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{cleanVideoTitle(track.title)}</p>
                  <p className="text-sm text-gray-600">{track.artist}</p>
                </div>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
