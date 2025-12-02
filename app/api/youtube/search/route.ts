import { NextRequest, NextResponse } from 'next/server'

interface YouTubeVideo {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    channelTitle: string
    thumbnails: {
      default: { url: string }
      medium: { url: string }
      high: { url: string }
    }
  }
}

interface YouTubeSearchResponse {
  items: YouTubeVideo[]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || !query.trim()) {
      return NextResponse.json({ items: [] })
    }

    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
    
    if (!apiKey) {
      throw new Error('YouTube API key not found in environment variables')
    }

    const encodedQuery = encodeURIComponent(query + ' music')
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=10&q=${encodedQuery}&key=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data: YouTubeSearchResponse = await response.json()
    
    // Transform YouTube data to match our interface
    const transformedVideos = data.items.map(video => ({
      id: video.id.videoId,
      title: video.snippet.title,
      artist: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
      videoId: video.id.videoId
    }))
    
    return NextResponse.json({ items: transformedVideos })
  } catch (error) {
    console.error('Error searching YouTube videos:', error)
    return NextResponse.json(
      { error: 'Failed to search videos' },
      { status: 500 }
    )
  }
}