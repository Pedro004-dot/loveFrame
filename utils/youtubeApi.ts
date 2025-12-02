import type { YouTubeVideo } from '@/types/onboarding'

export const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
  try {
    if (!query.trim()) {
      return []
    }

    const encodedQuery = encodeURIComponent(query)
    const response = await fetch(`/api/youtube/search?q=${encodedQuery}`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error searching YouTube videos:', error)
    return []
  }
}

export const cleanVideoTitle = (title: string): string => {
  // Remove common YouTube music suffixes
  return title
    .replace(/\(Official Video\)/gi, '')
    .replace(/\(Official Audio\)/gi, '')
    .replace(/\(Official Music Video\)/gi, '')
    .replace(/\(Lyric Video\)/gi, '')
    .replace(/\(Lyrics\)/gi, '')
    .replace(/\[Official Video\]/gi, '')
    .replace(/\[Official Audio\]/gi, '')
    .replace(/- Official Video/gi, '')
    .replace(/- Official Audio/gi, '')
    .trim()
}