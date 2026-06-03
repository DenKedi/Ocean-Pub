import { ref } from 'vue'

const STORAGE_KEY = 'pallas_consent'
const EXPIRY_MONTHS = 6
const EMBED_KEYS = []

function readConsent() {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Check expiry
    if (parsed.timestamp) {
      const expiry = new Date(parsed.timestamp)
      expiry.setMonth(expiry.getMonth() + EXPIRY_MONTHS)
      if (new Date() > expiry) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }
    }
    return parsed
  } catch {
    return null
  }
}

function writeConsent(embeds) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      embeds,
      timestamp: new Date().toISOString()
    }))
    // Sync per-embed keys for backward compatibility
    const PREFIX = 'pallas_embed_consent_'
    for (const key of EMBED_KEYS) {
      if (embeds) {
        localStorage.setItem(PREFIX + key, 'true')
      } else {
        localStorage.removeItem(PREFIX + key)
      }
    }
  } catch {
    // localStorage unavailable
  }
}

export function useCookieConsent() {
  const consentGiven = ref(false)
  const embedsAllowed = ref(false)

  // Re-read from localStorage
  const stored = readConsent()
  if (stored !== null) {
    consentGiven.value = true
    embedsAllowed.value = stored.embeds === true
  }

  function acceptAll() {
    writeConsent(true)
    consentGiven.value = true
    embedsAllowed.value = true
  }

  function acceptEssentialOnly() {
    writeConsent(false)
    consentGiven.value = true
    embedsAllowed.value = false
  }

  function revokeConsent() {
    if (!import.meta.client) return
    try {
      localStorage.removeItem(STORAGE_KEY)
      const PREFIX = 'pallas_embed_consent_'
      for (const key of EMBED_KEYS) {
        localStorage.removeItem(PREFIX + key)
      }
    } catch {
      // localStorage unavailable
    }
    consentGiven.value = false
    embedsAllowed.value = false
  }

  return {
    consentGiven,
    embedsAllowed,
    acceptAll,
    acceptEssentialOnly,
    revokeConsent
  }
}
