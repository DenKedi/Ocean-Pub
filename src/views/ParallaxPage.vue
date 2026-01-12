<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Background and foreground images
import spinneFullImg from '../assets/pictures/spinne_full.webp'
import spinneFrontImg from '../assets/pictures/spinne_front.webp'
import decke5Img from '../assets/pictures/decke5.webp'

// GSAP Parallax - refs for elements
const parallaxPage = ref(null)
const heroSection = ref(null)
const deepBackgroundLayer = ref(null)
const backgroundLayer = ref(null)
const foregroundLayer = ref(null)

// Store ScrollTrigger instances for cleanup
let scrollTriggers = []

// Initialize GSAP Parallax animations
const initParallax = () => {
  // Clean up existing triggers first
  scrollTriggers.forEach(st => {
    if (st && st.kill) st.kill()
  })
  scrollTriggers = []
  ScrollTrigger.getAll().forEach(st => st.kill())
  
  // Responsive offset - smaller screens need less offset
  const isMobile = window.innerWidth <= 768
  const fgStartOffset = isMobile ? 2 : 5
  const fgEndOffset = isMobile ? -13 : -10
  
  // Set initial position for foreground layer
  if (foregroundLayer.value) {
    gsap.set(foregroundLayer.value, {
      yPercent: fgStartOffset
    })
  }
  
  // Deep background layer - same speed as background layer
  // Speed: 0 → -15 over full scroll
  if (deepBackgroundLayer.value && parallaxPage.value) {
    const deepBgTrigger = gsap.to(deepBackgroundLayer.value, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxPage.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    })
    if (deepBgTrigger.scrollTrigger) {
      scrollTriggers.push(deepBgTrigger.scrollTrigger)
    }
  }
  
  // Background layer - moves SLOWER than scroll (appears further away)
  // Speed: 0 → -15 over full scroll
  if (backgroundLayer.value && parallaxPage.value) {
    const bgTrigger = gsap.to(backgroundLayer.value, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxPage.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    })
    if (bgTrigger.scrollTrigger) {
      scrollTriggers.push(bgTrigger.scrollTrigger)
    }
  }
  
  // Foreground layer - Same speed as background, just starts lower
  // Both move at the same rate
  if (foregroundLayer.value && parallaxPage.value) {
    const fgTrigger = gsap.to(foregroundLayer.value, {
      yPercent: fgEndOffset,
      ease: 'none',
      scrollTrigger: {
        trigger: parallaxPage.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    })
    if (fgTrigger.scrollTrigger) {
      scrollTriggers.push(fgTrigger.scrollTrigger)
    }
  }
  
  // Hero section fade out on scroll
  if (heroSection.value) {
    const heroTrigger = gsap.to(heroSection.value, {
      opacity: 0,
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection.value,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    })
    if (heroTrigger.scrollTrigger) {
      scrollTriggers.push(heroTrigger.scrollTrigger)
    }
  }
}

onMounted(() => {
  nextTick(() => {
    initParallax()
  })
})

onUnmounted(() => {
  // Clean up all ScrollTrigger instances
  scrollTriggers.forEach(st => {
    if (st) st.kill()
  })
  scrollTriggers = []
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<template>
  <MainLayout>
    <div ref="parallaxPage" class="parallax-page">
      
      <!-- DEEP BACKGROUND LAYER - decke5.webp (slowest scroll = furthest away) -->
      <div ref="deepBackgroundLayer" class="parallax-layer deep-background-layer">
        <div class="deep-bg-image" :style="{ backgroundImage: `url(${decke5Img})` }"></div>
      </div>
      
      <!-- BACKGROUND LAYER - spinne_full.webp (slower scroll = further away) -->
      <div ref="backgroundLayer" class="parallax-layer background-layer">
        <!-- Left blurred edge -->
        <div class="blur-edge blur-left" :style="{ backgroundImage: `url(${spinneFullImg})` }"></div>
        <!-- Center main image -->
        <div class="main-image" :style="{ backgroundImage: `url(${spinneFullImg})` }"></div>
        <!-- Right blurred edge -->
        <div class="blur-edge blur-right" :style="{ backgroundImage: `url(${spinneFullImg})` }"></div>
      </div>
      
      <!-- FOREGROUND LAYER - spinne_front.webp (faster scroll = closer) -->
      <div ref="foregroundLayer" class="parallax-layer foreground-layer">
        <!-- Image Container -->
        <div class="foreground-image-container">
          <!-- Left blurred edge -->
          <div class="blur-edge blur-left" :style="{ backgroundImage: `url(${spinneFrontImg})` }"></div>
          <!-- Center main image -->
          <div class="main-image" :style="{ backgroundImage: `url(${spinneFrontImg})` }"></div>
          <!-- Right blurred edge -->
          <div class="blur-edge blur-right" :style="{ backgroundImage: `url(${spinneFrontImg})` }"></div>
        </div>
        
        <!-- Content Section - docked below foreground image -->
        <section class="foreground-content">
          <div class="container">
            <h2 class="section-title">Upcoming Events</h2>
            
            <div class="events-grid">
              <!-- Sample Event 1 -->
              <article class="event-card">
                <div class="event-image"></div>
                <div class="event-details">
                  <span class="event-date">SA 15. Feb 2026</span>
                  <h3 class="event-title">Techno Night</h3>
                  <p class="event-description">Electronic beats until dawn with international DJs</p>
                  <span class="event-price">15€</span>
                </div>
              </article>
              
              <!-- Sample Event 2 -->
              <article class="event-card">
                <div class="event-image"></div>
                <div class="event-details">
                  <span class="event-date">FR 21. Feb 2026</span>
                  <h3 class="event-title">Jazz & Wine</h3>
                  <p class="event-description">Live jazz session with premium wine selection</p>
                  <span class="event-price">Eintritt frei</span>
                </div>
              </article>
              
              <!-- Sample Event 3 -->
              <article class="event-card">
                <div class="event-image"></div>
                <div class="event-details">
                  <span class="event-date">SA 28. Feb 2026</span>
                  <h3 class="event-title">House Classics</h3>
                  <p class="event-description">The best house tracks from the 90s and 2000s</p>
                  <span class="event-price">12€</span>
                </div>
              </article>
              
              <!-- Sample Event 4 -->
              <article class="event-card">
                <div class="event-image"></div>
                <div class="event-details">
                  <span class="event-date">FR 07. Mar 2026</span>
                  <h3 class="event-title">Disco Fever</h3>
                  <p class="event-description">Funk, soul and disco vibes all night long</p>
                  <span class="event-price">10€</span>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>

      <!-- Hero Header -->
      <section ref="heroSection" class="page-hero">
        <div class="container">
          <h1 class="page-title pallas-heading">Pallas.Parallax</h1>
          <p class="page-subtitle theme-text-secondary">Pure Motion</p>
        </div>
      </section>

      <!-- Spacer to create scroll height -->
      <section class="spacer-section">
        <div class="container">
          <!-- Empty space for scrolling -->
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<style scoped>
/* PALLAS Accent Colors */
:root {
  --pallas-orange: #FF9d66;
}

.parallax-page {
  min-height: 300vh;
  background: #000000;
  position: relative;
  isolation: isolate;
}

/* Solid overlay to ensure MainLayout background doesn't show through */
.parallax-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  z-index: -1;
  pointer-events: none;
}

/* Parallax Layers - Common Styles */
.parallax-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  pointer-events: none;
  will-change: transform;
  backface-visibility: hidden;
}

/* Deep Background Layer - furthest back */
.deep-background-layer {
  z-index: -1;
  height: 150vh;
}

.deep-bg-image {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center top;
  background-repeat: no-repeat;
  opacity: 0.5;
}

/* Background Layer - behind foreground */
.background-layer {
  z-index: 0;
  height: 120vh;
  display: flex;
}

/* Foreground Layer - in front of background */
.foreground-layer {
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: auto;
}

/* Foreground image container */
.foreground-image-container {
  display: flex;
  width: 100%;
  height: 120vh;
  flex-shrink: 0;
}

/* Main centered image */
.main-image {
  flex: 0 0 auto;
  width: 100vh; /* Square based on viewport height */
  max-width: 80vw;
  height: 100%;
  background-size: contain;
  background-position: center top;
  background-repeat: no-repeat;
  margin: 0 auto;
  /* Prevent blur overlap */
  position: relative;
  z-index: 1;
}

/* Blurred edge fills */
.blur-edge {
  flex: 1;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(50px);
  transform: scale(1.2);
  opacity: 0.5;
  /* Push blur edges behind main image and away from center */
  position: relative;
  z-index: 0;
}

.blur-left {
  background-position: right center;
  margin-right: -20px; /* Small gap to prevent overlap */
}

.blur-right {
  background-position: left center;
  margin-left: -20px; /* Small gap to prevent overlap */
}

/* Background layer adjustments */
.background-layer .main-image {
  opacity: 1;
}

.background-layer .blur-edge {
  opacity: 1;
}

/* Foreground layer adjustments */
.foreground-layer .main-image {
  opacity: 0.95;
}

.foreground-layer .blur-edge {
  opacity: 0.95;
}

/* Content Layer */
.parallax-page > section {
  position: relative;
  z-index: 10;
}

/* Hero */
.page-hero {
  padding: 8rem 0 3rem;
  text-align: center;
  position: relative;
  z-index: 10;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.page-hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FF9d66, transparent);
}

.page-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: #fff !important;
}

.page-subtitle {
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5) !important;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Spacer Section */
.spacer-section {
  min-height: 250vh;
  position: relative;
  z-index: 10;
}

/* Foreground Content Section */
.foreground-content {
  width: 100%;
  background: #000000;
  padding: 4rem 0;
  pointer-events: auto;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 3rem;
  color: #fff !important;
}

/* Events Grid */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.event-card {
  background: #111;
  border-radius: 0;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(255, 157, 102, 0.15);
}

.event-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
}

.event-details {
  padding: 1.5rem;
}

.event-date {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FF9d66 !important;
  display: block;
  margin-bottom: 0.5rem;
}

.event-title {
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  color: #fff !important;
}

.event-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.6) !important;
  margin-bottom: 1rem;
}

.event-price {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #FF9d66 !important;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .page-hero {
    padding: 6rem 0 3rem;
  }

  .container {
    padding: 0 1rem;
  }
  
  .main-image {
    width: 100vw;
    max-width: 100vw;
  }
  
  .blur-edge {
    display: none;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .foreground-content {
    padding: 2rem 0;
  }
}
</style>
