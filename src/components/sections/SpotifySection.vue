<template>
  <section class="spotify-section theme-section-bg">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title theme-text-primary">Unsere Musik</h2>
        <div class="title-line"></div>
      </div>

      <div class="spotify-container">
        <!-- Facade Placeholder (shown until consent) -->
        <div v-if="!consentGiven" class="spotify-facade theme-container-bg">
          <div class="facade-icon">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path fill="#1DB954" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <p class="facade-text theme-text-secondary">
            Dieser Inhalt wird von Spotify bereitgestellt. Beim Laden werden Daten an Spotify übertragen.
          </p>
          <button class="facade-btn" @click="giveConsent">
            Spotify-Inhalt laden
          </button>
          <p class="facade-hint theme-text-muted">
            Mehr Informationen in unserer <router-link to="/datenschutz" class="facade-link">Datenschutzerklärung</router-link>.
          </p>
        </div>

        <!-- Actual Spotify Embed (shown after consent) -->
        <div v-else class="spotify-embed">
          <iframe 
            style="border-radius:12px" 
            src="https://open.spotify.com/embed/user/vbwrck9x1n6c3cx1pjh8ki4ih?utm_source=generator&theme=0" 
            width="100%" 
            height="400" 
            frameBorder="0" 
            allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          ></iframe>
        </div>
        
        <div class="spotify-cta">
          <a 
            href="https://open.spotify.com/user/vbwrck9x1n6c3cx1pjh8ki4ih" 
            target="_blank" 
            rel="noopener noreferrer"
            class="spotify-link theme-button"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" class="spotify-icon">
              <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Auf Spotify anhören
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { getConsent, setConsent } from '@/utils/embedConsent'

const CONSENT_KEY = 'spotify'
const consentGiven = ref(getConsent(CONSENT_KEY))

function giveConsent() {
  setConsent(CONSENT_KEY)
  consentGiven.value = true
}
</script>

<style scoped>
.spotify-section {
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
}

.spotify-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 20%, rgba(30, 215, 96, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(30, 215, 96, 0.01) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-family: 'Montserrat', sans-serif;
}

.title-line {
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--theme-border), transparent);
  margin: 0 auto;
}

.spotify-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.spotify-embed {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--theme-border);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.spotify-embed iframe {
  width: 100%;
  min-height: 400px;
  display: block;
}

/* Facade Placeholder */
.spotify-facade {
  width: 100%;
  border-radius: 12px;
  padding: 3rem 2rem;
  border: 1px solid var(--theme-border);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;
}

.facade-icon {
  opacity: 0.7;
}

.facade-text {
  max-width: 380px;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.facade-btn {
  padding: 0.75rem 2rem;
  background: rgba(30, 215, 96, 0.15);
  border: 1px solid rgba(30, 215, 96, 0.4);
  border-radius: 50px;
  color: #1DB954;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.04em;
}

.facade-btn:hover {
  background: rgba(30, 215, 96, 0.25);
  border-color: rgba(30, 215, 96, 0.6);
  transform: translateY(-2px);
}

.facade-hint {
  font-size: 0.78rem;
  margin: 0;
}

.facade-link {
  color: var(--theme-text-secondary, #aaa);
  text-decoration: underline;
  text-underline-offset: 2px;
}


.spotify-cta {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spotify-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: rgba(30, 215, 96, 0.1);
  border: 1px solid rgba(30, 215, 96, 0.3);
  border-radius: 50px;
  color: #1DB954;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.spotify-link:hover {
  background: rgba(30, 215, 96, 0.2);
  border-color: rgba(30, 215, 96, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(30, 215, 96, 0.2);
}

.spotify-icon {
  transition: transform 0.3s ease;
}

.spotify-link:hover .spotify-icon {
  transform: scale(1.1);
}

/* Mobile Optimization */
@media (max-width: 767px) {
  .spotify-section {
    padding: 4rem 1rem;
  }

  .spotify-embed {
    padding: 0.5rem;
  }

  .spotify-embed iframe {
    min-height: 380px;
  }

  .spotify-link {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
