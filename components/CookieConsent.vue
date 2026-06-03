<template>
  <Transition name="cookie-banner">
    <div v-if="!consentGiven" class="cookie-banner">
      <div class="cookie-inner">
        <div class="cookie-text">
          <p>
            Wir nutzen Cookies. Mehr dazu in unserer <RouterLink to="/datenschutz" class="cookie-link">Datenschutzerklärung</RouterLink>.
          </p>
        </div>
        <div class="cookie-actions">
          <button class="cookie-btn cookie-btn-primary" @click="acceptAll">Alle akzeptieren</button>
          <button class="cookie-btn cookie-btn-secondary" @click="acceptEssentialOnly">Nur notwendige</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCookieConsent } from '../composables/useCookieConsent.js'
const { consentGiven, acceptAll, acceptEssentialOnly } = useCookieConsent()
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 1rem;
  pointer-events: none;
}

.cookie-inner {
  pointer-events: auto;
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 1.75rem;
  position: relative;
  background: var(--beach-sand, #FBF3E4);
  border: 1.5px solid rgba(22, 58, 78, 0.15);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(22, 58, 78, 0.14), 0 2px 8px rgba(22, 58, 78, 0.08);
}

.cookie-text p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.6;
  color: rgba(22, 58, 78, 0.75);
  font-weight: 400;
  letter-spacing: 0.01em;
}

.cookie-link {
  color: var(--beach-ocean, #2A7FA5);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.3s ease;
}

.cookie-link:hover {
  color: var(--beach-coral, #E8614D);
}

.cookie-actions {
  display: flex;
  gap: 0.6rem;
  flex-shrink: 0;
}

.cookie-btn {
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
  font-family: inherit;
}

.cookie-btn-primary {
  background: var(--beach-coral, #E8614D);
  color: #fff !important;
  border: 1.5px solid var(--beach-coral, #E8614D);
}

.cookie-btn-primary:hover {
  background: #d44f3c;
  border-color: #d44f3c;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(232, 97, 77, 0.3);
}

.cookie-btn-secondary {
  background: transparent;
  color: var(--beach-navy, #163A4E) !important;
  border: 1.5px solid rgba(22, 58, 78, 0.3);
}

.cookie-btn-secondary:hover {
  border-color: var(--beach-navy, #163A4E);
  background: rgba(22, 58, 78, 0.06);
  transform: translateY(-1px);
}

/* Transition */
.cookie-banner-enter-active {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
}

.cookie-banner-leave-active {
  transition: transform 0.35s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.3s ease;
}

.cookie-banner-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.cookie-banner-leave-to {
  transform: translateY(30%);
  opacity: 0;
}

/* Mobile */
@media (max-width: 640px) {
  .cookie-banner {
    padding: 0.75rem;
  }

  .cookie-inner {
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 12px;
  }

  .cookie-text p {
    text-align: center;
    font-size: 0.8rem;
  }

  .cookie-actions {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }

  .cookie-btn {
    width: 100%;
    padding: 0.75rem;
    text-align: center;
    font-size: 0.82rem;
  }
}
</style>
