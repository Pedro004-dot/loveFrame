/**
 * Utilities for sharing retrospective links across different platforms
 */

export interface ShareOptions {
  url: string
  title?: string
  text?: string
}

/**
 * Share using Web Share API (native sharing)
 */
export const shareNative = async (options: ShareOptions): Promise<boolean> => {
  if (typeof window === 'undefined' || !navigator.share) {
    return false
  }

  try {
    await navigator.share({
      title: options.title || 'Nossa História de Amor',
      text: options.text || 'Veja nossa retrospectiva de relacionamento!',
      url: options.url
    })
    return true
  } catch (error: any) {
    // User cancelled or error occurred
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error)
    }
    return false
  }
}

/**
 * Share to WhatsApp
 */
export const shareToWhatsApp = (options: ShareOptions): void => {
  const text = encodeURIComponent(
    `${options.text || 'Veja nossa retrospectiva de relacionamento!'}\n\n${options.url}`
  )
  const whatsappUrl = `https://wa.me/?text=${text}`
  window.open(whatsappUrl, '_blank')
}

/**
 * Share to Facebook
 */
export const shareToFacebook = (options: ShareOptions): void => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(options.url)}`
  window.open(facebookUrl, '_blank', 'width=600,height=400')
}

/**
 * Share to Twitter/X
 */
export const shareToTwitter = (options: ShareOptions): void => {
  const text = encodeURIComponent(
    `${options.text || 'Veja nossa retrospectiva de relacionamento!'} ${options.url}`
  )
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`
  window.open(twitterUrl, '_blank', 'width=600,height=400')
}

/**
 * Copy link to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof window === 'undefined' || !navigator.clipboard) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      document.body.removeChild(textArea)
      return false
    }
  }

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}

/**
 * Get shareable URL for the retrospective
 */
export const getShareableUrl = (uniqueId: string): string => {
  if (typeof window === 'undefined') {
    return ''
  }
  return `${window.location.origin}/view/${uniqueId}`
}

