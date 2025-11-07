<script setup>
import { computed, onMounted } from 'vue'
import { currentTheme } from '../../stores/themeStore.js'

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Computed property to determine if video should be shown in hero
const shouldShowHeroVideo = computed(() => {
  return currentTheme.value === 'minimal-flat'
})

onMounted(() => {
  // Ensure hero video starts playing when minimal-flat theme is active
  if (shouldShowHeroVideo.value) {
    const video = document.querySelector('.hero-background-video')
    if (video) {
      video.play().catch(e => console.log('Hero video autoplay failed:', e))
    }
  }
})
</script>

<template>
  <section id="home" class="hero-section theme-section-bg">
    <!-- Video Background - Only for minimal-flat theme and only in hero -->
    <video 
      v-if="shouldShowHeroVideo"
      class="hero-background-video" 
      autoplay 
      muted 
      loop 
      playsinline
      preload="auto"
    >
      <source src="/src/assets/flash.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    
    <div class="hero-content theme-container-bg">
      <h1 class="hero-title theme-text-primary pallas-title">PALLAS</h1>
      <p class="hero-subtitle theme-text-secondary pallas-subtitle">Restaurant | Bar | Club</p>
      <div class="hero-buttons">
        <button @click="scrollToSection('reservierung')" class="cta-button primary theme-button theme-text-primary">
          Reservierung
        </button>
        <button @click="scrollToSection('speisekarte')" class="cta-button secondary theme-button theme-text-secondary">
          Speisekarte
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid var(--theme-border);
}

/* Override section background for hero - no blur */
.hero-section.theme-section-bg {
  background: transparent !important;
  backdrop-filter: none !important;
}

.hero-background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  opacity: 0.8;
  pointer-events: none;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.01) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.015) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  text-align: center;
  padding: 4rem 3rem;
  max-width: 800px;
  z-index: 3;
  border-radius: 4px;
  position: relative;
  background: transparent !important;
  backdrop-filter: none !important;
}

.hero-title {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 300;
  margin-bottom: 1.5rem;
  text-shadow: 
    0 0 40px rgba(255, 255, 255, 0.1),
    0 0 80px rgba(255, 255, 255, 0.05);
  letter-spacing: 0.3em;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  position: relative;
  filter: brightness(1.1);
  color: #ffffff !important;
}

.hero-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--theme-border), transparent);
}

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 2rem);
  margin-bottom: 3rem;
  opacity: 0.9;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-size: 1.1rem;
  color: #ffffff !important;
}

.hero-buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 1.2rem 2.5rem;
  font-size: 0.9rem;
  font-weight: 400;
  border: none;
  border-radius: 1px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(20px);
  min-width: 180px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-family: 'Montserrat', sans-serif;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  color: #ffffff !important;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button.primary {
  border: 1px solid var(--theme-border);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  background: transparent !important;
}

.cta-button.primary:hover {
  transform: translateY(-3px) rotateX(5deg);
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.cta-button.secondary {
  border: 1px solid var(--theme-border);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
  background: transparent !important;
}

.cta-button.secondary:hover {
  transform: translateY(-3px) rotateX(5deg);
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Mobile Optimization */
@media (max-width: 767px) {
  .hero-content {
    padding: 3rem 2rem;
    margin: 1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .cta-button {
    width: 100%;
    max-width: 280px;
  }
}
</style>