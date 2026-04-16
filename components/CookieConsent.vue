<template>
  <Transition name="cookie-banner">
    <div v-if="!consentGiven" class="cookie-banner">
      <div class="cookie-inner">
        <div class="cookie-text">
          <p>
            Wir nutzen Cookies und externe Dienste (Instagram). Mehr dazu in unserer <NuxtLink to="/datenschutz" class="cookie-link">Datenschutzerklärung</NuxtLink>.
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
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
}

.cookie-text p {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  letter-spacing: 0.01em;
}

.cookie-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.3s ease;
}

.cookie-link:hover {
  color: #fff;
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
  font-weight: 400;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: inherit;
}

.cookie-btn-primary {
  background: rgba(255, 255, 255, 0.95);
  color: #0a0a0a !important;
  border: 1px solid rgba(255, 255, 255, 0.95);
}

.cookie-btn-primary:hover {
  background: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15);
}

.cookie-btn-secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.cookie-btn-secondary:hover {
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
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
