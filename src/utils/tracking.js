import api from './api';
import { getSessionId } from './sessionId';

/**
 * Tracks a button click interaction.
 * Fire-and-forget — errors are silently swallowed to avoid impacting UX.
 *
 * @param {'ticket'|'mehr_infos'|'alle_events'|'category_filter'} buttonType
 * @param {string|null} eventId
 * @param {object} metadata
 */
export function trackClick(buttonType, eventId = null, metadata = {}) {
  try {
    const sessionId = getSessionId();
    api.post('/interactions', { buttonType, eventId, sessionId, metadata }).catch(() => {});
  } catch {
    // Never propagate tracking errors
  }
}
