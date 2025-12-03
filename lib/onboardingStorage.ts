import type { OnboardingData, YouTubeVideo } from '@/types/onboarding'
import { compressImage } from '@/utils/fileUpload'

const STORAGE_KEY = 'loveframe_onboarding_data'

export interface StoredOnboardingData {
  userName: string
  partnerName: string
  relationshipStart: string
  relationshipTime: string
  giftTitle: string
  coverPhotoUrl: string | null
  coverPhotoFile: File | null
  selectedTrack: YouTubeVideo | null
  musicCoverPhotoUrl: string | null
  musicCoverPhotoFile: File | null
  timeCounterPhotoUrl: string | null
  timeCounterPhotoFile: File | null
  specialMessage: string
  coupleGalleryPhotoUrls: string[]
  coupleGalleryPhotoFiles: File[] | null
  createdAt: string
  updatedAt: string
}

class OnboardingStorageService {
  // Salvar dados no localStorage
  static saveData(data: Partial<StoredOnboardingData>): void {
    try {
      const existingData = this.getData()
      
      // Preservar URLs base64 existentes da galeria antes de fazer merge
      const existingGalleryUrls = (existingData.coupleGalleryPhotoUrls || [])
        .filter((url: any) => url && typeof url === 'string' && url.startsWith('data:image'))
      
      let updatedData: any = {
        ...existingData,
        ...data,
        updatedAt: new Date().toISOString()
      }

      // Se não há novos arquivos para processar, preservar URLs base64 existentes
      if (!data.coupleGalleryPhotoFiles || data.coupleGalleryPhotoFiles.length === 0) {
        if (existingGalleryUrls.length > 0) {
          updatedData.coupleGalleryPhotoUrls = existingGalleryUrls
        }
      }

      // Lista de arquivos para converter
      const filesToConvert: Array<{ file: File | null; field: keyof StoredOnboardingData; urlField: keyof StoredOnboardingData }> = [
        { file: data.coverPhotoFile || null, field: 'coverPhotoFile', urlField: 'coverPhotoUrl' },
        { file: data.musicCoverPhotoFile || null, field: 'musicCoverPhotoFile', urlField: 'musicCoverPhotoUrl' },
        { file: data.timeCounterPhotoFile || null, field: 'timeCounterPhotoFile', urlField: 'timeCounterPhotoUrl' }
      ]

      // Processar galeria de fotos (múltiplos arquivos)
      const galleryFiles = data.coupleGalleryPhotoFiles || null
      
      // Preservar URLs base64 existentes se não houver novos arquivos para processar
      if (data.coupleGalleryPhotoUrls && Array.isArray(data.coupleGalleryPhotoUrls) && data.coupleGalleryPhotoUrls.length > 0) {
        // Se já temos URLs base64 (começam com "data:image"), preservá-las
        const hasBase64Urls = data.coupleGalleryPhotoUrls.some((url: string) => url && typeof url === 'string' && url.startsWith('data:image'))
        if (hasBase64Urls && (!galleryFiles || galleryFiles.length === 0)) {
          // Preservar URLs base64 existentes
          updatedData.coupleGalleryPhotoUrls = data.coupleGalleryPhotoUrls.filter((url: any) => url && typeof url === 'string' && url.startsWith('data:image'))
        }
      }
      
      // Verificar se há arquivos para converter
      const filesToProcess = filesToConvert.filter(item => item.file !== null)
      const hasGalleryFiles = galleryFiles && galleryFiles.length > 0
      
      if (filesToProcess.length > 0 || hasGalleryFiles) {
        // Processar múltiplos arquivos
        let processedCount = 0
        const totalFiles = filesToProcess.length + (hasGalleryFiles ? galleryFiles!.length : 0)
        const convertedData: any = { ...updatedData }

        // Processar arquivos individuais (com compressão)
        filesToProcess.forEach(({ file, field, urlField }) => {
          if (file) {
            compressImage(file, 800, 800, 0.7)
              .then((base64) => {
                convertedData[field] = null // Não salvar File object
                convertedData[urlField] = base64 // Salvar como base64 comprimido
                
                processedCount++
                if (processedCount === totalFiles) {
                  // Todos os arquivos foram processados
                  convertedData.coupleGalleryPhotoFiles = null
                  try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                  } catch (error: any) {
                    if (error.name === 'QuotaExceededError') {
                      console.error('[onboardingStorage] localStorage quota exceeded. Clearing old data...')
                      // Tentar limpar dados antigos e salvar novamente
                      this.clearData()
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                    } else {
                      throw error
                    }
                  }
                }
              })
              .catch((error) => {
                console.error('[onboardingStorage] Error compressing image:', error)
                // Fallback: usar conversão direta sem compressão
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result as string
                  convertedData[field] = null
                  convertedData[urlField] = base64
                  
                  processedCount++
                  if (processedCount === totalFiles) {
                    convertedData.coupleGalleryPhotoFiles = null
                    try {
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                    } catch (error: any) {
                      if (error.name === 'QuotaExceededError') {
                        console.error('[onboardingStorage] localStorage quota exceeded. Clearing old data...')
                        this.clearData()
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                      } else {
                        throw error
                      }
                    }
                  }
                }
                reader.onerror = () => {
                  processedCount++
                  if (processedCount === totalFiles) {
                    convertedData.coupleGalleryPhotoFiles = null
                    try {
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                    } catch (error: any) {
                      if (error.name === 'QuotaExceededError') {
                        console.error('[onboardingStorage] localStorage quota exceeded. Clearing old data...')
                        this.clearData()
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                      }
                    }
                  }
                }
                reader.readAsDataURL(file)
              })
          }
        })

        // Processar galeria de fotos
        if (hasGalleryFiles) {
          // SEMPRE preservar URLs base64 existentes do localStorage (fonte de verdade)
          const existingDataForGallery = this.getData()
          const existingBase64Urls = (existingDataForGallery.coupleGalleryPhotoUrls || [])
            .filter((url: any) => url && typeof url === 'string' && url.startsWith('data:image'))
          
          // Também verificar se há URLs base64 nos dados recebidos (do estado atual)
          // Mas priorizar sempre as do localStorage para evitar perder dados
          const receivedBase64Urls = (data.coupleGalleryPhotoUrls || [])
            .filter((url: any) => url && typeof url === 'string' && url.startsWith('data:image'))
          
          // SEMPRE usar URLs base64 do localStorage como base, e adicionar novas se houver
          // Se recebemos URLs base64 no estado, usar elas (podem ser mais recentes)
          // Mas se não houver, usar as do localStorage
          const preservedUrls = receivedBase64Urls.length > 0 ? receivedBase64Urls : existingBase64Urls
          
          console.log('[onboardingStorage] Processing gallery files:', {
            existingBase64Count: existingBase64Urls.length,
            receivedBase64Count: receivedBase64Urls.length,
            preservedCount: preservedUrls.length,
            newFilesCount: galleryFiles!.length,
            preservedSample: preservedUrls[0]?.substring(0, 50) + '...'
          })
          
          const galleryUrls: string[] = [...preservedUrls] // Começar com URLs existentes preservadas
          let galleryProcessed = 0
          
          galleryFiles!.forEach((file) => {
            // Comprimir imagem antes de converter para base64
            compressImage(file, 800, 800, 0.7)
              .then((base64) => {
                // Adicionar novas URLs base64 ao final (apenas se ainda não existir)
                if (!galleryUrls.includes(base64)) {
                  galleryUrls.push(base64)
                }
                galleryProcessed++
                
                if (galleryProcessed === galleryFiles!.length) {
                  convertedData.coupleGalleryPhotoUrls = galleryUrls
                  convertedData.coupleGalleryPhotoFiles = null
                  
                  // Debug log
                  console.log('[onboardingStorage] Saved gallery photos to localStorage:', {
                    preservedUrls: preservedUrls.length,
                    newUrls: galleryFiles!.length,
                    totalUrls: galleryUrls.length,
                    sampleUrl: galleryUrls[0]?.substring(0, 50) + '...',
                    allUrlsAreBase64: galleryUrls.every((url: string) => url.startsWith('data:image'))
                  })
                  
                  processedCount += galleryProcessed
                  if (processedCount === totalFiles) {
                    try {
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                    } catch (error: any) {
                      if (error.name === 'QuotaExceededError') {
                        console.error('[onboardingStorage] localStorage quota exceeded. Clearing old data...')
                        this.clearData()
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                      } else {
                        throw error
                      }
                    }
                  }
                }
              })
              .catch((error) => {
                console.error('[onboardingStorage] Error compressing gallery image:', error)
                // Fallback: usar conversão direta sem compressão
                const reader = new FileReader()
                reader.onload = () => {
                  const base64 = reader.result as string
                  if (!galleryUrls.includes(base64)) {
                    galleryUrls.push(base64)
                  }
                  galleryProcessed++
                  
                  if (galleryProcessed === galleryFiles!.length) {
                    convertedData.coupleGalleryPhotoUrls = galleryUrls.length > 0 ? galleryUrls : preservedUrls
                    convertedData.coupleGalleryPhotoFiles = null
                    processedCount += galleryProcessed
                    if (processedCount === totalFiles) {
                      try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                      } catch (error: any) {
                        if (error.name === 'QuotaExceededError') {
                          console.error('[onboardingStorage] localStorage quota exceeded. Clearing old data...')
                          this.clearData()
                          localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                        }
                      }
                    }
                  }
                }
                reader.onerror = () => {
                  galleryProcessed++
                  if (galleryProcessed === galleryFiles!.length) {
                    // Mesmo com erro, preservar URLs existentes
                    convertedData.coupleGalleryPhotoUrls = galleryUrls.length > 0 ? galleryUrls : preservedUrls
                    convertedData.coupleGalleryPhotoFiles = null
                    processedCount += galleryProcessed
                    if (processedCount === totalFiles) {
                      try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                      } catch (error: any) {
                        if (error.name === 'QuotaExceededError') {
                          console.error('[onboardingStorage] localStorage quota exceeded. Clearing old data...')
                          this.clearData()
                          localStorage.setItem(STORAGE_KEY, JSON.stringify(convertedData))
                        }
                      }
                    }
                  }
                }
                reader.readAsDataURL(file)
              })
          })
        }
      } else {
        // Sem arquivos para converter, salvar diretamente
        updatedData.coupleGalleryPhotoFiles = null
        // Preservar URLs base64 existentes se não houver arquivos para processar
        // Priorizar URLs base64 do localStorage, depois as recebidas
        const existingBase64Urls = (existingData.coupleGalleryPhotoUrls || [])
          .filter((url: any) => url && typeof url === 'string' && url.startsWith('data:image'))
        
        const receivedBase64Urls = (data.coupleGalleryPhotoUrls || [])
          .filter((url: any) => url && typeof url === 'string' && url.startsWith('data:image'))
        
        // Usar URLs recebidas se houver, senão usar as do localStorage
        const finalGalleryUrls = receivedBase64Urls.length > 0 ? receivedBase64Urls : existingBase64Urls
        
        if (finalGalleryUrls.length > 0) {
          updatedData.coupleGalleryPhotoUrls = finalGalleryUrls
          console.log('[onboardingStorage] Preserved gallery URLs (no new files):', {
            count: finalGalleryUrls.length,
            source: receivedBase64Urls.length > 0 ? 'received' : 'existing',
            sample: finalGalleryUrls[0]?.substring(0, 50) + '...'
          })
        } else if (existingBase64Urls.length > 0) {
          // Se não há URLs recebidas mas há no localStorage, preservar
          updatedData.coupleGalleryPhotoUrls = existingBase64Urls
          console.log('[onboardingStorage] Preserved existing gallery URLs from localStorage:', {
            count: existingBase64Urls.length
          })
        }
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
        } catch (error: any) {
          if (error.name === 'QuotaExceededError') {
            console.error('[onboardingStorage] localStorage quota exceeded. Clearing old data...')
            this.clearData()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
          } else {
            throw error
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error)
    }
  }

  // Recuperar dados do localStorage
  static getData(): StoredOnboardingData {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
    } catch (error) {
      console.error('Erro ao recuperar dados do localStorage:', error)
    }

    // Dados padrão
    return {
      userName: '',
      partnerName: '',
      relationshipStart: '',
      relationshipTime: '',
      giftTitle: '',
      coverPhotoUrl: null,
      coverPhotoFile: null,
      selectedTrack: null,
      musicCoverPhotoUrl: null,
      musicCoverPhotoFile: null,
      timeCounterPhotoUrl: null,
      timeCounterPhotoFile: null,
      specialMessage: '',
      coupleGalleryPhotoUrls: [],
      coupleGalleryPhotoFiles: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  // Verificar se existem dados salvos
  static hasData(): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data !== null
    } catch (error) {
      return false
    }
  }

  // Limpar dados do localStorage
  static clearData(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Erro ao limpar dados do localStorage:', error)
    }
  }

  // Converter dados armazenados para formato OnboardingData
  static toOnboardingData(stored: StoredOnboardingData): Partial<OnboardingData> {
    // Garantir que as URLs sejam strings válidas (não null/undefined)
    const musicCoverUrl = stored.musicCoverPhotoUrl && typeof stored.musicCoverPhotoUrl === 'string' 
      ? stored.musicCoverPhotoUrl 
      : ''
    const timeCounterUrl = stored.timeCounterPhotoUrl && typeof stored.timeCounterPhotoUrl === 'string'
      ? stored.timeCounterPhotoUrl
      : ''
    
    // Processar URLs da galeria - aceitar tanto base64 quanto URLs normais
    let galleryUrls: string[] = []
    if (Array.isArray(stored.coupleGalleryPhotoUrls)) {
      galleryUrls = stored.coupleGalleryPhotoUrls
        .filter((url: any) => {
          // Aceitar URLs base64 (data:image) ou URLs HTTP/HTTPS
          if (!url || typeof url !== 'string') return false
          const trimmed = url.trim()
          return trimmed !== '' && (trimmed.startsWith('data:image') || trimmed.startsWith('http'))
        })
        .map((url: string) => url.trim())
    }
    
    // Debug log
    console.log('toOnboardingData - Gallery URLs:', {
      raw: stored.coupleGalleryPhotoUrls,
      rawLength: stored.coupleGalleryPhotoUrls?.length || 0,
      processed: galleryUrls,
      processedLength: galleryUrls.length,
      sample: galleryUrls[0]?.substring(0, 50) + '...'
    })
    
    return {
      userName: stored.userName,
      partnerName: stored.partnerName,
      relationshipStart: stored.relationshipStart,
      relationshipTime: stored.relationshipTime || '',
      giftTitle: stored.giftTitle,
      coverPhotoUrl: stored.coverPhotoUrl || '',
      selectedTrack: stored.selectedTrack,
      musicCoverPhotoUrl: musicCoverUrl,
      timeCounterPhotoUrl: timeCounterUrl,
      specialMessage: stored.specialMessage || '',
      coupleGalleryPhotoUrls: galleryUrls
    }
  }

  // Converter OnboardingData para formato de armazenamento
  static fromOnboardingData(data: OnboardingData, file?: File, musicCoverFile?: File, timeCounterFile?: File, galleryFiles?: File[]): Partial<StoredOnboardingData> {
    return {
      userName: data.userName || '',
      partnerName: data.partnerName || '',
      relationshipStart: data.relationshipStart || '',
      relationshipTime: data.relationshipTime || '',
      giftTitle: data.giftTitle || '',
      coverPhotoUrl: data.coverPhotoUrl || null,
      coverPhotoFile: file || null,
      selectedTrack: data.selectedTrack, // Inclui customTitle e customArtist
      musicCoverPhotoUrl: data.musicCoverPhotoUrl || null,
      musicCoverPhotoFile: musicCoverFile || data.musicCoverPhoto || null,
      timeCounterPhotoUrl: data.timeCounterPhotoUrl || null,
      timeCounterPhotoFile: timeCounterFile || data.timeCounterPhoto || null,
      specialMessage: data.specialMessage || '',
      coupleGalleryPhotoUrls: data.coupleGalleryPhotoUrls || [],
      coupleGalleryPhotoFiles: galleryFiles || data.coupleGalleryPhotos || null
    }
  }
}

export default OnboardingStorageService