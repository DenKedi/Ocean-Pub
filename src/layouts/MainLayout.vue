<script setup>
import { ref, onMounted, computed } from 'vue'
import BurgerMenu from '../components/BurgerMenu.vue'
import { currentTheme } from '../stores/themeStore.js'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isMenuOpen.value = false
}

// Computed property to determine if video should be shown
const shouldShowVideo = computed(() => {
  return currentTheme.value !== 'minimal-flat'
})

onMounted(() => {
  // Ensure video starts playing
  const video = document.querySelector('.background-video')
  if (video) {
    // Set muted before playing
    video.muted = true
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video autoplay started successfully')
        })
        .catch(e => {
          console.log('Video autoplay failed:', e)
          // Retry after a short delay
          setTimeout(() => {
            video.play().catch(err => console.log('Video retry failed:', err))
          }, 1000)
        })
    }
  }
})
</script>

<template>
  <div class="main-layout">
    <!-- Video Background - Only shown for non-minimal-flat themes -->
    <video 
      v-if="shouldShowVideo"
      class="background-video" 
      autoplay 
      muted 
      loop 
      playsinline
      preload="auto"
    >
      <source src="/assets/flash.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <!-- Burger Menu -->
    <BurgerMenu :is-open="isMenuOpen" @toggle="toggleMenu" />

    <!-- Navigation Overlay -->
    <nav class="main-nav" :class="{ 'nav-open': isMenuOpen }">
      <router-link to="/" @click="isMenuOpen = false" class="nav-link">Home</router-link>
      <a @click="scrollToSection('ueber-uns')" class="nav-link">Über uns</a>
      <a @click="scrollToSection('speisekarte')" class="nav-link">Speisekarte</a>
      <router-link to="/events" @click="isMenuOpen = false" class="nav-link">Events</router-link>
      <a @click="scrollToSection('instagram')" class="nav-link">Instagram</a>
      <a @click="scrollToSection('kontakt')" class="nav-link">Kontakt</a>
      <router-link to="/impressum" @click="isMenuOpen = false" class="nav-link legal">Impressum</router-link>
      <router-link to="/datenschutz" @click="isMenuOpen = false" class="nav-link legal">Datenschutz</router-link>
    </nav>

    <!-- Content Slot -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
  opacity: 0.8;
  pointer-events: none;
}

.main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  background: transparent;
}

.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: 999;
  backdrop-filter: blur(10px);
}

.main-nav.nav-open {
  display: flex;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 300;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  display: block;
  letter-spacing: 0.05em;
  border-bottom: 1px solid transparent;
  margin: 0.2rem 0;
}

.nav-link:hover {
  color: #87CEEB;
  border-bottom-color: #87CEEB;
}

.nav-link.legal {
  font-size: 0.9rem;
  padding: 0.3rem 0;
  opacity: 0.7;
  margin-top: 1rem;
}

/* Desktop Navigation */
@media (min-width: 1024px) {
  .main-nav {
    display: none !important; /* Hide overlay nav on desktop */
  }
  
  .main-nav.nav-open {
    display: flex !important;
  }
}

/* Mobile Optimization */
@media (max-width: 767px) {
  .nav-link {
    font-size: 1rem;
    padding: 0.4rem 0;
  }
  
  .nav-link.legal {
    font-size: 0.85rem;
  }
}
</style>