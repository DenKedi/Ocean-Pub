/**
 * Utility function to construct full image URLs
 * Handles both development and production environments
 */
export const useImageUrl = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051'

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null

    // If already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }

    // If it's a relative path, construct the full URL
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
    return `${API_URL}${path}`
  }

  const getRelativePath = (fullUrl) => {
    if (!fullUrl) return null

    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      return fullUrl
    }

    try {
      const url = new URL(fullUrl)
      return url.pathname
    } catch {
      return fullUrl
    }
  }

  return { getImageUrl, getRelativePath }
}
