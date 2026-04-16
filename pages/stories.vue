<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

import spinneFullImg from '~/assets/pictures/spinne_full.webp'
import spinneFrontImg from '~/assets/pictures/spinne_front.webp'
import logoV from '~/assets/icons/Pallas_Logo_V.svg'

const { $gsap: gsap, $ScrollTrigger: ScrollTrigger } = useNuxtApp()

// SEO
useSeoMeta({
  title: 'Pallas.Stories – Referenzen & Event-Location Hamburg | PALLAS.WORLD',
  ogTitle: 'Pallas.Stories – Wer schon hier war',
  description: 'Vom Kulturabend bis zur Firmenfeier: OMR, FC St. Pauli, Warner Music, Amazon Music und Google haben ihre Events im Pallas am Neuen Pferdemarkt veranstaltet. Wann bist du dran?',
  ogDescription: 'Von OMR bis FC St. Pauli – wer Events im Herzen von Hamburg feiern möchte, feiert im Pallas.',
  ogImage: 'https://pallas.world/og-stories.jpg',
  ogUrl: 'https://pallas.world/stories',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://pallas.world/stories' }],
})

const parallaxPage = ref(null)
const heroSection = ref(null)
const backgroundLayer = ref(null)
const foregroundLayer = ref(null)
const nameItems = ref([])
const historyStatement = ref(null)
const isLoading = ref(true)

const clients = [
  'OMR',
  'Warner Music',
  'Warner Movies',
  'Hamburg Towers',
  'FC St. Pauli',
  'Amazon Music',
  'Google',
  'Heineken',
  'Planted',
  'Die Zeit',
  'Deutsche Funkturm AG',
]

let scrollTriggers = []

const initParallax = () => {
  scrollTriggers.forEach(st => { if (st && st.kill) st.kill() })
  scrollTriggers = []
  ScrollTrigger.getAll().forEach(st => st.kill())

  const isMobile = window.innerWidth <= 768
  const fgStartOffset = isMobile ? 10 : 15

  if (foregroundLayer.value) {
    gsap.set(foregroundLayer.value, { yPercent: 0 })
  }

  // Fade out spider foreground as user scrolls down
  if (foregroundLayer.value && parallaxPage.value) {
    const fadeOutSpider = gsap.to(foregroundLayer.value, {
      opacity: 0,
      scrollTrigger: {
        trigger: parallaxPage.value,
        start: '15% top',
        end: '50% top',
        scrub: true,
      },
    })
    scrollTriggers.push(fadeOutSpider.scrollTrigger)
  }

  // Background layer - medium speed parallax
  if (backgroundLayer.value && parallaxPage.value) {
    const bgTrigger = gsap.fromTo(
      backgroundLayer.value,
      { yPercent: 0 },
      {
        yPercent: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxPage.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
    scrollTriggers.push(bgTrigger.scrollTrigger)
  }

  // Foreground layer - fastest parallax
  if (foregroundLayer.value && parallaxPage.value) {
    const fgTrigger = gsap.fromTo(
      foregroundLayer.value,
      { yPercent: fgStartOffset },
      {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxPage.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
    scrollTriggers.push(fgTrigger.scrollTrigger)
  }

  // Name dropping fly-in animations
  nameItems.value.forEach((el, i) => {
    if (!el) return
    const fromLeft = i % 2 === 0
    gsap.set(el, { xPercent: fromLeft ? -120 : 120, opacity: 0 })
    const trig = gsap.to(el, {
      xPercent: 0,
      opacity: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        end: 'top 55%',
        scrub: false,
        toggleActions: 'play none none reverse',
      },
    })
    scrollTriggers.push(trig.scrollTrigger)
  })

  // History statement fly-in
  if (historyStatement.value) {
    gsap.set(historyStatement.value, { yPercent: 40, opacity: 0 })
    const histTrig = gsap.to(historyStatement.value, {
      yPercent: 0,
      opacity: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: historyStatement.value,
        start: 'top 90%',
        end: 'top 55%',
        scrub: false,
        toggleActions: 'play none none reverse',
      },
    })
    scrollTriggers.push(histTrig.scrollTrigger)
  }
}

onMounted(() => {
  const imagesToLoad = [spinneFullImg, spinneFrontImg]

  const safetyTimer = setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false
      nextTick(() => {
        initParallax()
        ScrollTrigger.refresh()
      })
    }
  }, 4000)

  Promise.all(
    imagesToLoad.map(
      src =>
        new Promise(resolve => {
          const img = new Image()
          img.src = src
          img.onload = resolve
          img.onerror = resolve
        })
    )
  ).then(() => {
    if (isLoading.value) {
      clearTimeout(safetyTimer)
      isLoading.value = false
      nextTick(() => {
        initParallax()
        ScrollTrigger.refresh()
      })
    }
  })
})

onUnmounted(() => {
  scrollTriggers.forEach(st => { if (st) st.kill() })
  scrollTriggers = []
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<template>
  <NuxtLayout>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loader-spinner"></div>
    </div>
    <div v-else ref="parallaxPage" class="parallax-page">

      <!-- BACKGROUND LAYER - spinne_full -->
      <div ref="backgroundLayer" class="parallax-layer background-layer">
        <div class="layer-bg-blur" :style="{ backgroundImage: `url(${spinneFullImg})` }"></div>
        <div class="layer-subject" :style="{ backgroundImage: `url(${spinneFullImg})` }"></div>
      </div>

      <!-- FOREGROUND LAYER - spinne_front -->
      <div ref="foregroundLayer" class="parallax-layer foreground-layer">
        <div class="layer-bg-blur" :style="{ backgroundImage: `url(${spinneFrontImg})` }"></div>
        <div class="layer-subject" :style="{ backgroundImage: `url(${spinneFrontImg})` }"></div>
      </div>

      <!-- Hero Header -->
      <section ref="heroSection" class="page-hero">
        <div class="container">
          <NuxtLink to="/">
            <img :src="logoV" alt="Pallas Logo" class="hero-logo" />
          </NuxtLink>
          <p class="page-subtitle">These are our Stories</p>
        </div>
      </section>

      <!-- Scroll Content -->
      <section class="scroll-content">
        <div class="spacer-hero"></div>

        <!-- Name Dropping Section -->
        <div class="name-drop-section">
          <div class="container">
            <p class="name-drop-intro">Pallas Hosted Events for</p>
            <ul class="name-list">
              <li
                v-for="(client, i) in clients"
                :key="client"
                :ref="el => { if (el) nameItems[i] = el }"
                class="name-item"
                :class="i % 2 === 0 ? 'align-left' : 'align-right'"
              >
                {{ client }}
              </li>
            </ul>
            <p ref="historyStatement" class="history-statement">...And the Rest is History</p>
          </div>
        </div>

        <!-- History Closing Statement -->
        <div class="history-section">
          <div class="container">
            <p class="history-sub">Write your own Story:</p>
            <p class="history-bookings">Bookings via <NuxtLink to="/request" class="history-link">Pallas.Request</NuxtLink></p>
          </div>
        </div>

        <div class="spacer-end"></div>
      </section>

    </div>
  </NuxtLayout>
</template>

<style scoped>
.parallax-page {
  min-height: 400vh;
  position: relative;
  isolation: isolate;
}

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

/* Loading */
.loading-overlay {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Parallax Layers */
.parallax-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  pointer-events: none;
  will-change: transform;
  backface-visibility: hidden;
}

.background-layer {
  z-index: 0;
  height: 120vh;
}

.foreground-layer {
  z-index: 1;
  height: 120vh;
}

.layer-bg-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(40px) brightness(0.4);
  transform: scale(1.2);
  opacity: 0.6;
}

.layer-subject {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center top;
  background-repeat: no-repeat;
  mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
}

.background-layer .layer-subject { opacity: 0.8; }
.foreground-layer .layer-subject { opacity: 1; z-index: 10; }

/* Hero */
.page-hero {
  padding: 4rem 0 3rem;
  text-align: center;
  position: relative;
  z-index: 10;
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

.hero-logo {
  width: 300px;
  max-width: 80vw;
  height: auto;
  margin-bottom: 2rem;
  filter: brightness(0) invert(1) drop-shadow(0 0 20px rgba(0,0,0,0.5));
  transition: transform 0.3s ease;
}

.hero-logo:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.page-subtitle {
  font-size: 1.3rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

/* Scroll Content */
.scroll-content {
  position: relative;
  width: 100%;
  z-index: 50;
  pointer-events: none;
}

.spacer-hero { height: 100vh; }
.spacer-end  { height: 20vh; }

/* Name Drop Section */
.name-drop-section {
  pointer-events: auto;
  padding: 8rem 0;
  position: relative;
}

.name-drop-section .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.name-drop-intro {
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: #FF9d66;
  font-weight: 600;
  margin-bottom: 4rem;
}

.name-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.name-item {
  font-family: 'Krona One', sans-serif;
  font-size: clamp(1.8rem, 5.5vw, 4.5rem);
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1;
  color: #ffffff;
  letter-spacing: -0.02em;
  will-change: transform, opacity;
  overflow: hidden;
}

.name-item.align-left  { text-align: left;  }
.name-item.align-right { text-align: right; }

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* History Section */
.history-section {
  pointer-events: auto;
  padding: 12rem 0 6rem;
  text-align: center;
}

.history-statement {
  text-align: center;
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-top: 6rem;
  margin-bottom: 0;
  line-height: 1.1;
  will-change: transform, opacity;
}

.history-sub {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: clamp(0.7rem, 1.2vw, 0.9rem);
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1.5rem;
}

.history-bookings {
  font-size: clamp(1rem, 2.5vw, 1.75rem);
  font-weight: 300;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
}

.history-link {
  display: inline;
  font-family: 'Krona One', sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: #FF9d66;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.history-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #FF9d66;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.history-link:hover {
  color: #ffffff;
}

.history-link:hover::after {
  transform: scaleX(1);
}

/* Mobile */
@media (max-width: 768px) {
  .page-hero {
    padding: 6rem 0 3rem;
  }

  .layer-bg-blur {
    display: none !important;
  }

  .parallax-layer {
    will-change: auto;
  }

  .container {
    padding: 0 1.25rem;
  }

  .layer-subject {
    background-size: cover;
    background-position: center center;
  }

  .name-item {
    text-align: left !important;
  }
}
</style>
