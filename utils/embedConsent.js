const PREFIX = 'pallas_embed_consent_'

export function getConsent(key) {
  if (!import.meta.client) return false
  try {
    return localStorage.getItem(PREFIX + key) === 'true'
  } catch {
    return false
  }
}

export function setConsent(key) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(PREFIX + key, 'true')
  } catch {
    // localStorage unavailable
  }
}
