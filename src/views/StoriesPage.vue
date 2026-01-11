<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Background and foreground images
import spinneFullImg from '../assets/pictures/spinne_full.png'
import spinneFrontImg from '../assets/pictures/spinne_front.png'
import logoV from '../assets/icons/Pallas_Logo_V.svg'
import djs1Img from '../assets/pictures/stories/supreme/djs1.png'
import barkeeper1Img from '../assets/pictures/stories/supreme/barkeeper1.png'
import floor1Img from '../assets/pictures/stories/supreme/floor1.png'
import flyer1Img from '../assets/pictures/stories/supreme/flyer1.png'
import plattenImg from '../assets/pictures/stories/supreme/platten.png'

// GSAP Parallax - refs for elements
const parallaxPage = ref(null)
const heroSection = ref(null)
const backgroundLayer = ref(null)
const foregroundLayer = ref(null)

// Supreme Section Refs
const supremeBgLayer = ref(null)
const supremeFgLayer = ref(null)
const supremeTitle = ref(null)
const gallerySection = ref(null)
const galleryImages = ref([])

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
  
  // Responsive offset
  const isMobile = window.innerWidth <= 768
  const fgStartOffset = isMobile ? 10 : 15 
  
  // --- SPIDER SECTION (0 -> 100vh scroll) ---
  
  if (foregroundLayer.value) {
    gsap.set(foregroundLayer.value, { yPercent: 0 }) 
  }

  // Fade out Spider Foreground early to clear way for DJS
  if (foregroundLayer.value && parallaxPage.value) {
     const fadeOutSpider = gsap.to(foregroundLayer.value, {
      opacity: 0,
      scrollTrigger: {
        trigger: parallaxPage.value,
        start: '15% top', 
        end: '50% top',
        scrub: true
      }
    })
    scrollTriggers.push(fadeOutSpider.scrollTrigger)
  }
  
  // Background layer - moves medium speed
  if (backgroundLayer.value && parallaxPage.value) {
    const bgTrigger = gsap.fromTo(backgroundLayer.value, 
      { yPercent: 0 },
      {
        yPercent: -35, 
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxPage.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      }
    )
    scrollTriggers.push(bgTrigger.scrollTrigger)
  }
  
  // Foreground layer - Closest, moves fastest
  if (foregroundLayer.value && parallaxPage.value) {
    const fgTrigger = gsap.fromTo(foregroundLayer.value, 
      { yPercent: fgStartOffset },
      {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxPage.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      }
    )
    scrollTriggers.push(fgTrigger.scrollTrigger)
  }

  // --- SUPREME SECTION (Appears after Spider) ---

  // Fade IN Supreme Background (DJs)
  if (supremeBgLayer.value && parallaxPage.value) {
    gsap.set(supremeBgLayer.value, { opacity: 0 })
    const bgIn = gsap.to(supremeBgLayer.value, {
      opacity: 1,
      scrollTrigger: {
        trigger: parallaxPage.value,
        start: '10% top', // Start very early for slow fade
        end: '80% top',   // End very late for slow fade
        scrub: true
      }
    })
    scrollTriggers.push(bgIn.scrollTrigger)
  }

  // Slide/Fade IN Supreme Foreground (Barkeeper) - REMOVED
  /*
  if (supremeFgLayer.value && parallaxPage.value) {
    gsap.set(supremeFgLayer.value, { opacity: 0, scale: 1.1, yPercent: 20 })
    const fgIn = gsap.to(supremeFgLayer.value, {
      opacity: 1,
      scale: 1,
      yPercent: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: parallaxPage.value,
        start: '30% top', // Start slightly after BG
        end: '80% top',   // End much later
        scrub: true
      }
    })
    scrollTriggers.push(fgIn.scrollTrigger)
  }
  */

  // Supreme Title - REMOVED custom fly-in, now follows natural scroll
  /*
  if (supremeTitle.value && parallaxPage.value) {
    gsap.set(supremeTitle.value, { x: -100, opacity: 0 })
    const titleIn = gsap.to(supremeTitle.value, {
      x: 0,
      opacity: 1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: parallaxPage.value,
        start: '35% top', // Adjusted to appear BEFORE text content scrolls into view
        end: '40% top',
        scrub: 1
      }
    })
    scrollTriggers.push(titleIn.scrollTrigger)
  }
  */
  
  // Gallery Images - Staggered Fly In
  if (galleryImages.value.length && parallaxPage.value) {
    galleryImages.value.forEach((img, i) => {
      // Randomize start positions slightly
      const startX = i % 2 === 0 ? -50 : 50
      const startY = 100
      
      gsap.set(img, { x: startX, y: startY, opacity: 0, rotation: startX > 0 ? 5 : -5 })
      
      const imgIn = gsap.to(img, {
        x: 0,
        y: 0,
        opacity: 1,
        rotation: (Math.random() * 6) - 3, // Slight random tilt
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gallerySection.value, // Trigger relative to the gallery section container
          start: `top+=${i * 100} bottom`,
          end: `top+=${i * 100 + 300} center`,
          scrub: 1
        }
      })
      scrollTriggers.push(imgIn.scrollTrigger)
    })
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
      
      <!-- BACKGROUND LAYER - spinne_full.png -->
      <div ref="backgroundLayer" class="parallax-layer background-layer">
        <!-- Ambilight Blur Background -->
        <div class="layer-bg-blur" :style="{ backgroundImage: `url(${spinneFullImg})` }"></div>
        <!-- Sharp Main Subject -->
        <div class="layer-subject" :style="{ backgroundImage: `url(${spinneFullImg})` }"></div>
      </div>
      
      <!-- FOREGROUND LAYER - spinne_front.png -->
      <div ref="foregroundLayer" class="parallax-layer foreground-layer">
         <!-- Ambilight Blur Background -->
        <div class="layer-bg-blur" :style="{ backgroundImage: `url(${spinneFrontImg})` }"></div>
        <!-- Sharp Main Subject -->
        <div class="layer-subject" :style="{ backgroundImage: `url(${spinneFrontImg})` }"></div>
      </div>

      <!-- Hero Header -->
      <section ref="heroSection" class="page-hero">
        <div class="container">
          <img :src="logoV" alt="Pallas Logo" class="hero-logo" />
          <p class="page-subtitle theme-text-secondary">These are our Stories</p>
        </div>
      </section>

      <!-- SUPREME SECTION LAYERS (Fixed Position, Fade In) -->
      
      <!-- Supreme BG: DJs -->
      <div ref="supremeBgLayer" class="parallax-layer supreme-layer opacity-0">
          <div class="layer-bg-blur" :style="{ backgroundImage: `url(${djs1Img})` }"></div>
          <div class="layer-subject" :style="{ backgroundImage: `url(${djs1Img})` }"></div>
      </div>
      
      <!-- Spacer for Scroll & Content -->
      <section class="scroll-content">
         <div class="spacer-hero"></div> <!-- Space for Spider Scroll -->
         
         <div class="spacer-transition-early"></div> <!-- Smaller spacer before title -->
         
         <!-- Title separated -->
         <div class="container supreme-header-block">
            <p class="supreme-pre">Pallas hosted</p>
            <h2 ref="supremeTitle" class="supreme-title">Supreme Music</h2>
            <p class="supreme-date">on the 14th March 2024</p>
         </div>

         <div class="spacer-between"></div> <!-- Space between title and gallery -->
         
         <!-- Gallery Section -->
         <section ref="gallerySection" class="gallery-section">
            <div class="container">
               <div class="text-content">
                  <p>Eine unvergessliche Nacht voller Highlights.</p>
                  <p>Die besten Beats, exklusive Drinks und eine Atmosphäre, die ihresgleichen sucht.</p>
               </div>
               
               <div class="gallery-grid">
                  <div class="gallery-item" :ref="el => { if(el) galleryImages[0] = el }">
                     <img :src="floor1Img" alt="Dancefloor" />
                  </div>
                  <div class="gallery-item" :ref="el => { if(el) galleryImages[1] = el }">
                     <img :src="flyer1Img" alt="Flyer Art" />
                  </div>
                   <div class="gallery-item" :ref="el => { if(el) galleryImages[2] = el }">
                     <img :src="plattenImg" alt="Vinyls" />
                  </div>
               </div>

               <!-- Footer Statement -->
               <div class="history-footer">
                  <p class="page-subtitle theme-text-secondary">And the rest is History</p>
               </div>
            </div>
         </section>
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
  min-height: 200vh; /* Reduced from 300vh since content is removed */
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

/* Background Layer */
.background-layer {
  z-index: 0;
  height: 120vh;
}

/* Foreground Layer */
.foreground-layer {
  z-index: 1;
  height: 120vh; /* Consistent height */
}

/* Supreme Layers */
.supreme-layer {
  z-index: 5; /* Above spider layers */
  height: 120vh;
  /* Removal of flex align-items allows default absolute positioning behavior from children or inherited layouts */
  display: block; 
}
/* Removed .supreme-layer .layer-subject override to allow fallback to generic .layer-subject (contain) */

.opacity-0 {
  opacity: 0;
}

.supreme-header-block {
  text-align: center;
  position: relative;
  z-index: 50; /* Ensure interactivity if needed */
}

.supreme-pre {
  font-family: inherit; /* Use default sans/serif */
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.9rem;
  color: var(--pallas-orange);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.supreme-date {
  font-family: inherit;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
  margin-top: -1rem; /* Pull closer to title */
  margin-bottom: 2rem;
}

.supreme-title {
  font-family: 'Krona One', sans-serif;
  font-size: clamp(3rem, 8vw, 6rem);
  color: #fff;
  text-transform: uppercase;
  text-shadow: 0 10px 30px rgba(0,0,0,0.8);
  letter-spacing: -2px;
  text-align: center;
  margin-bottom: 2rem;
  display: block;
}

.scroll-content {
  position: relative;
  width: 100%;
  z-index: 50; /* Above fixed layers for interaction if needed */
  pointer-events: none; /* Let clicks pass through to layers unless on specific items */
}

.text-content {
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.text-content p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: rgba(255,255,255,0.9);
}

.spacer-hero { height: 100vh; }
.spacer-transition { height: 80vh; }
.spacer-transition-early { height: 30vh; }
.spacer-between { height: 40vh; }

.gallery-section {
  padding: 0 0 10rem 0;
  pointer-events: auto;
}

.gallery-grid {
  display: flex;
  flex-direction: column;
  gap: 15vh;
  align-items: center;
}

.history-footer {
  margin-top: 15vh;
  text-align: center;
  padding-bottom: 5rem;
}

.history-footer .page-subtitle {
  color: rgba(255, 255, 255, 0.8) !important; /* Less transparent as requested */
}

.gallery-item {
  width: 100%;
  max-width: 800px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.gallery-item img {
  width: 100%;
  height: auto;
  display: block;
}

.gallery-item:nth-child(even) {
  margin-left: auto; /* Stagger right */
  max-width: 600px;
  transform: translateX(-5%); /* Initial hint */
}

.gallery-item:nth-child(odd) {
  margin-right: auto; /* Stagger left */
  max-width: 600px;
  transform: translateX(5%);
}

/* New "Ambilight" Technique styles */
.layer-bg-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(40px) brightness(0.4);
  transform: scale(1.2); /* Prevent white edges from blur */
  opacity: 0.6;
}

.layer-subject {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain; /* Ensures WHOLE image is seen without cutting */
  background-position: center top;
  background-repeat: no-repeat;
  
  /* Subtle mask at the very bottom/edges to blend into darkness if needed */
  mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
}

/* Adjust opacities */
.background-layer .layer-subject {
  opacity: 0.8;
}

.foreground-layer .layer-subject {
  opacity: 1;
  z-index: 10;
}

/* Hero */
.page-hero {
  padding: 4rem 0 3rem; /* Reduced padding to move logo higher */
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

.hero-logo {
  width: 300px;
  max-width: 80vw;
  height: auto;
  margin-bottom: 2rem;
  /* Make white and add shadow */
  filter: brightness(0) invert(1) drop-shadow(0 0 20px rgba(0,0,0,0.5));
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
  min-height: 200vh; /* Reduced to match page min-height somewhat */
  position: relative;
  z-index: 10;
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
}
</style>