const PREFIX = 'pallas_embed_consent_'

export function getConsent(key) {
  if (!import.meta.client) return false
  try {
    // Check global consent first
    const global = localStorage.getItem('pallas_consent')
    if (global) {
      const parsed = JSON.parse(global)
      if (parsed.embeds === true) return true
    }
    // Fall back to per-embed consent
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
