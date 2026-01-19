/**
 * Utility function to construct full image URLs
 * Handles both development and production environments
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5051'

/**
 * Constructs a full image URL from a relative path
 * @param {string} imagePath - The relative image path (e.g., '/uploads/categories/image.jpg')
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  
  // If already a full URL (starts with http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If it's a relative path, construct the full URL
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${API_URL}${path}`
}

/**
 * Extracts the relative path from a full URL
 * Used when saving to database
 * @param {string} fullUrl - The full image URL
 * @returns {string} - The relative path
 */
export const getRelativePath = (fullUrl) => {
  if (!fullUrl) return null
  
  // If already a relative path, return as is
  if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
    return fullUrl
  }
  
  try {
    const url = new URL(fullUrl)
    return url.pathname
  } catch (e) {
    return fullUrl
  }
}
