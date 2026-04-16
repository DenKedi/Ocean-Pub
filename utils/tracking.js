import { getSessionId } from './sessionId'

/**
 * Tracks a button click interaction.
 * Fire-and-forget — errors are silently swallowed to avoid impacting UX.
 */
export function trackClick(buttonType, eventId = null, metadata = {}) {
  if (!import.meta.client) return
  try {
    const api = useApi()
    const sessionId = getSessionId()
    api.post('/interactions', { buttonType, eventId, sessionId, metadata }).catch(() => {})
  } catch {
    // Never propagate tracking errors
  }
}
