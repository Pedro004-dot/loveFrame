/**
 * Utilities for exporting retrospective as image
 */

/**
 * Export element as image using html2canvas
 */
export const exportAsImage = async (
  elementId: string,
  filename: string = 'retrospectiva-loveframe.png'
): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('Element not found:', elementId)
      return false
    }

    // Dynamically import html2canvas
    const html2canvas = (await import('html2canvas')).default

    const canvas = await html2canvas(element, {
      backgroundColor: '#fef1f2', // rose-50 background
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: element.scrollWidth,
      height: element.scrollHeight
    })

    // Convert to blob and download
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Error creating blob')
          resolve(false)
          return
        }

        const link = document.createElement('a')
        link.download = filename
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
        resolve(true)
      }, 'image/png')
    })
  } catch (error) {
    console.error('Error exporting as image:', error)
    return false
  }
}

/**
 * Export full page as image
 */
export const exportFullPage = async (filename?: string): Promise<boolean> => {
  try {
    const html2canvas = (await import('html2canvas')).default
    
    const canvas = await html2canvas(document.body, {
      backgroundColor: '#fef1f2',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight
    })

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false)
          return
        }

        const link = document.createElement('a')
        link.download = filename || `retrospectiva-${Date.now()}.png`
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
        resolve(true)
      }, 'image/png')
    })
  } catch (error) {
    console.error('Error exporting full page:', error)
    return false
  }
}

