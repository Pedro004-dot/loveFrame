import { getSupabaseClient, type Retrospective, type YouTubeSongData } from './supabase'
import { uploadToSupabaseStorage, getPublicUrl } from './supabase'

export interface OnboardingFormData {
  userName: string
  partnerName: string
  relationshipStartDate: string
  relationshipTime: string
  giftTitle: string
  selectedSong: YouTubeSongData | null
  coverPhoto: File | null
  musicCoverPhoto: File | null
  timeCounterPhoto: File | null
  specialMessage: string
  coupleGalleryPhotos: File[]
  creatorEmail?: string
  creatorPhone?: string
}

export class RetrospectiveService {
  
  /**
   * Create a new retrospective from onboarding data
   */
  static async createFromOnboarding(data: OnboardingFormData): Promise<{ data: Retrospective | null, error: any }> {
    try {
      // Generate unique ID for the retrospective
      const uniqueId = this.generateUniqueId()
      
      // Prepare retrospective data
      const retrospectiveData: Partial<Retrospective> = {
        unique_id: uniqueId,
        user_name: data.userName,
        partner_name: data.partnerName,
        couple_name: `${data.userName} e ${data.partnerName}`,
        start_date: data.relationshipStartDate, // Map to the required NOT NULL field
        relationship_start_date: data.relationshipStartDate, // Also keep this for completeness
        relationship_time: data.relationshipTime,
        gift_title: data.giftTitle,
        selected_song: data.selectedSong ? {
          ...data.selectedSong,
          selected_at: new Date().toISOString()
        } : undefined,
        special_message: data.specialMessage || undefined,
        plan_type: 'free',
        payment_status: 'pending',
        is_active: true,
        is_published: false,
        view_count: 0,
        creator_email: data.creatorEmail || undefined
      }

      // Insert retrospective
      const supabase = getSupabaseClient()
      const { data: retrospective, error } = await supabase
        .from('retrospectives')
        .insert(retrospectiveData)
        .select()
        .single()

      if (error) {
        console.error('Error creating retrospective:', error)
        return { data: null, error }
      }

      // Upload cover photo if provided
      if (data.coverPhoto && retrospective) {
        const photoPath = await this.uploadCoverPhoto(retrospective.id, data.coverPhoto)
        
        if (photoPath) {
          // Update retrospective with photo path
          const supabase = getSupabaseClient()
          const { error: updateError } = await supabase
            .from('retrospectives')
            .update({ cover_photo_path: photoPath })
            .eq('id', retrospective.id)

          if (updateError) {
            console.error('Error updating cover photo path:', updateError)
          }

          // Update local data
          retrospective.cover_photo_path = photoPath
        }
      }

      // Upload music cover photo if provided
      if (data.musicCoverPhoto && retrospective) {
        const musicPhotoPath = await this.uploadPhoto(retrospective.id, data.musicCoverPhoto, 'music-cover')
        
        if (musicPhotoPath) {
          const supabase = getSupabaseClient()
          const { error: updateError } = await supabase
            .from('retrospectives')
            .update({ music_cover_photo_path: musicPhotoPath })
            .eq('id', retrospective.id)

          if (updateError) {
            console.error('Error updating music cover photo path:', updateError)
          } else {
            retrospective.music_cover_photo_path = musicPhotoPath
          }
        }
      }

      // Upload time counter photo if provided
      if (data.timeCounterPhoto && retrospective) {
        const timePhotoPath = await this.uploadPhoto(retrospective.id, data.timeCounterPhoto, 'time-counter')
        
        if (timePhotoPath) {
          const supabase = getSupabaseClient()
          const { error: updateError } = await supabase
            .from('retrospectives')
            .update({ time_counter_photo_path: timePhotoPath })
            .eq('id', retrospective.id)

          if (updateError) {
            console.error('Error updating time counter photo path:', updateError)
          } else {
            retrospective.time_counter_photo_path = timePhotoPath
          }
        }
      }

      // Upload gallery photos if provided
      if (data.coupleGalleryPhotos.length > 0 && retrospective) {
        const galleryPaths: string[] = []
        for (const photo of data.coupleGalleryPhotos) {
          const galleryPath = await this.uploadPhoto(retrospective.id, photo, 'gallery')
          if (galleryPath) {
            galleryPaths.push(galleryPath)
          }
        }
        
        // Store gallery paths as JSON array
        if (galleryPaths.length > 0) {
          const supabase = getSupabaseClient()
          const { error: updateError } = await supabase
            .from('retrospectives')
            .update({ gallery_photos: galleryPaths })
            .eq('id', retrospective.id)

          if (updateError) {
            console.error('Error updating gallery photos:', updateError)
          } else {
            retrospective.gallery_photos = galleryPaths
          }
        }
      }

      return { data: retrospective, error: null }
      
    } catch (error) {
      console.error('Error in createFromOnboarding:', error)
      return { data: null, error }
    }
  }

  /**
   * Upload cover photo to Supabase Storage
   */
  static async uploadCoverPhoto(retrospectiveId: string, file: File): Promise<string | null> {
    return this.uploadPhoto(retrospectiveId, file, 'cover-photo')
  }

  /**
   * Generic photo upload method
   */
  static async uploadPhoto(retrospectiveId: string, file: File, type: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${type}-${Date.now()}.${fileExt}`
      const filePath = `retrospectives/${retrospectiveId}/${fileName}`

      const { error } = await uploadToSupabaseStorage(file, 'retrospectives', filePath)

      if (error) {
        console.error(`Error uploading ${type} photo:`, error)
        return null
      }

      // Create media file record
      const supabase = getSupabaseClient()
      await supabase.from('media_files').insert({
        retrospective_id: retrospectiveId,
        file_type: 'image',
        original_name: file.name,
        storage_path: filePath,
        storage_bucket: 'retrospectives',
        public_url: getPublicUrl('retrospectives', filePath),
        file_size: file.size
      })

      return filePath
      
    } catch (error) {
      console.error(`Error in uploadPhoto (${type}):`, error)
      return null
    }
  }

  /**
   * Get retrospective by unique ID
   */
  static async getByUniqueId(uniqueId: string): Promise<{ data: Retrospective | null, error: any }> {
    const supabase = getSupabaseClient()
    return await supabase
      .from('retrospectives')
      .select('*')
      .eq('unique_id', uniqueId)
      .single()
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    retrospectiveId: string, 
    status: 'completed' | 'failed' | 'cancelled'
  ): Promise<{ data: any, error: any }> {
    const supabase = getSupabaseClient()
    const updateData: any = {
      payment_status: status,
      updated_at: new Date().toISOString()
    }

    // If payment completed, upgrade to premium
    if (status === 'completed') {
      updateData.plan_type = 'premium'
      updateData.is_published = true
      // Set expiration to 1 year from now
      updateData.expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }

    return await supabase
      .from('retrospectives')
      .update(updateData)
      .eq('id', retrospectiveId)
  }

  /**
   * Get retrospectives by creator email
   */
  static async getByCreatorEmail(email: string): Promise<{ data: Retrospective[] | null, error: any }> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('retrospectives')
      .select('*')
      .eq('creator_email', email)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  /**
   * Update retrospective creator email
   */
  static async updateCreatorEmail(retrospectiveId: string, email: string, phone?: string): Promise<{ data: any, error: any }> {
    const supabase = getSupabaseClient()
    const updateData: any = {
      creator_email: email,
      updated_at: new Date().toISOString()
    }

    // Note: We don't have a phone field in the database yet, but we can add it later if needed
    // For now, we'll just save the email

    return await supabase
      .from('retrospectives')
      .update(updateData)
      .eq('id', retrospectiveId)
  }

  /**
   * Get public URL for cover photo
   */
  static getCoverPhotoUrl(coverPhotoPath: string): string {
    return getPublicUrl('retrospectives', coverPhotoPath)
  }

  /**
   * Generate unique ID for retrospective sharing
   */
  private static generateUniqueId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Increment view count
   * This is a non-critical operation - failures are silently ignored
   */
  static async incrementViewCount(retrospectiveId: string): Promise<void> {
    try {
      const supabase = getSupabaseClient()
      // Get current view count
      const { data: current, error: selectError } = await supabase
        .from('retrospectives')
        .select('view_count')
        .eq('id', retrospectiveId)
        .single()
      
      if (selectError) {
        // Ignore 406 errors (Not Acceptable) - likely RLS policy issue
        // PostgrestError uses 'code' property, not 'statusCode'
        const errorCode = (selectError as any).code || (selectError as any).statusCode
        if (errorCode !== 'PGRST116' && errorCode !== 406) {
          console.debug('Failed to get current view count (non-critical):', selectError)
        }
        return
      }
      
      if (current) {
        // Update with incremented value
        const { error: updateError } = await supabase
          .from('retrospectives')
          .update({ view_count: (current.view_count || 0) + 1 })
          .eq('id', retrospectiveId)
        
        if (updateError) {
          // Ignore 406 errors (Not Acceptable) - likely RLS policy issue
          const errorCode = (updateError as any).code || (updateError as any).statusCode
          if (errorCode !== 'PGRST116' && errorCode !== 406) {
            console.debug('Failed to increment view count (non-critical):', updateError)
          }
        }
      }
    } catch (error: any) {
      // Silently fail - view count is not critical
      // Ignore 406 errors specifically
      const errorCode = error?.code || error?.statusCode || error?.status
      if (errorCode !== 406) {
        console.debug('Failed to increment view count (non-critical):', error)
      }
    }
  }
}