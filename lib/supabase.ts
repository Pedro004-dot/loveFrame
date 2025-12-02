import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Retrospective {
  id: string
  unique_id: string
  user_name?: string
  partner_name?: string
  couple_name?: string
  start_date: string // Required NOT NULL field
  relationship_start_date?: string
  relationship_time?: string
  gift_title?: string
  selected_song?: YouTubeSongData
  cover_photo_path?: string
  special_message?: string
  main_photo_url?: string
  main_song_url?: string
  music_cover_photo_path?: string
  time_counter_photo_path?: string
  gallery_photos?: string[] | any // Array of photo paths stored as JSONB
  plan_type: 'free' | 'premium' | 'deluxe'
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled'
  expires_at?: string
  created_at: string
  updated_at: string
  is_active: boolean
  is_published: boolean
  view_count: number
  creator_email?: string
  creator_ip?: string
}

export interface YouTubeSongData {
  id: string
  title: string
  artist: string
  thumbnail: string
  videoId: string
  selected_at: string
  customTitle?: string // Título editável pelo usuário
  customArtist?: string // Artista editável pelo usuário
}

export interface MediaFile {
  id: string
  retrospective_id: string
  file_type: 'image' | 'video' | 'audio'
  original_name?: string
  storage_path: string
  storage_bucket: string
  public_url?: string
  file_size?: number
  created_at: string
}

export interface Story {
  id: string
  retrospective_id: string
  story_type: string
  story_order: number
  story_data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  retrospective_id: string
  amount: number
  currency?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  stripe_payment_id?: string
  stripe_customer_id?: string
  created_at: string
}

// Storage helpers
export const uploadToSupabaseStorage = async (
  file: File,
  bucket: string,
  path: string
): Promise<{ data: any; error: any }> => {
  return await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
}

export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

export const deleteFromStorage = async (
  bucket: string,
  path: string
): Promise<{ data: any; error: any }> => {
  return await supabase.storage
    .from(bucket)
    .remove([path])
}