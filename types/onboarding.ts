export interface YouTubeVideo {
  id: string
  title: string
  artist: string
  thumbnail: string
  videoId: string
  customTitle?: string // Título editável pelo usuário
  customArtist?: string // Artista editável pelo usuário
}

export interface OnboardingData {
  userName: string
  partnerName: string
  relationshipStart: string
  relationshipTime: string
  giftTitle: string
  selectedTrack: YouTubeVideo | null
  coverPhoto: File | null
  coverPhotoUrl: string
  musicCoverPhoto: File | null
  musicCoverPhotoUrl: string
  timeCounterPhoto: File | null
  timeCounterPhotoUrl: string
  specialMessage: string
  coupleGalleryPhotos: File[]
  coupleGalleryPhotoUrls: string[]
}

export interface TimeData {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}