import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'ocean_pub_consent'
const EXPIRY_MONTHS = 6
const EMBED_KEYS = []

// Module-level singleton — shared across all component instances on the client.
// On the server each request gets a fresh module context, so this is safe.
const consentGiven = ref(false)
const embedsAllowed = ref(false)
let initialized = false

function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
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

function init() {
  if (initialized) return
  initialized = true
  const stored = readConsent()
  if (stored !== null) {
    consentGiven.value = true
    embedsAllowed.value = stored.embeds === true
  }
}

function writeConsent(embeds) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      embeds,
      timestamp: new Date().toISOString()
    }))
    const PREFIX = 'ocean_pub_embed_consent_'
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
  // Read from localStorage after mount (client-only, avoids SSR hydration mismatch)
  onMounted(() => {
    init()
  })

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
    try {
      localStorage.removeItem(STORAGE_KEY)
      const PREFIX = 'ocean_pub_embed_consent_'
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
