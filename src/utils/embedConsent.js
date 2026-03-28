const PREFIX = 'pallas_embed_consent_';

export function getConsent(key) {
  try {
    return localStorage.getItem(PREFIX + key) === 'true';
  } catch {
    return false;
  }
}

export function setConsent(key) {
  try {
    localStorage.setItem(PREFIX + key, 'true');
  } catch {
    // localStorage unavailable (e.g. private mode restrictions)
  }
}
