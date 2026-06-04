<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const isBeaming = ref(false)
const isNight = ref(false)
const sunProgress = ref(0)
const moonPhaseIndex = ref(4)

const moonBoundingPaths = {
  1: "M 0.5 0 A 0.5 0.5 0 0 1 0.5 1 A 0.25 0.5 0 0 0 0.5 0 Z",
  2: "M 0.5 0 A 0.5 0.5 0 0 1 0.5 1 L 0.5 0 Z",
  3: "M 0.5 0 A 0.5 0.5 0 0 1 0.5 1 A 0.25 0.5 0 0 1 0.5 0 Z",
  4: "M 0.5 0 A 0.5 0.5 0 0 1 0.5 1 A 0.5 0.5 0 0 1 0.5 0 Z",
  5: "M 0.5 0 A 0.5 0.5 0 0 0 0.5 1 A 0.25 0.5 0 0 0 0.5 0 Z",
  6: "M 0.5 0 A 0.5 0.5 0 0 0 0.5 1 L 0.5 0 Z",
  7: "M 0.5 0 A 0.5 0.5 0 0 0 0.5 1 A 0.25 0.5 0 0 1 0.5 0 Z"
}

const moonPhasePath = computed(() => moonBoundingPaths[moonPhaseIndex.value])

const checkTimeAndPhase = async () => {
  try {
    // 1. Lokale Mock-Datei für Tests prüfen
    let mockData = null
    try {
      const mockRes = await fetch('/time-mock.json')
      if (mockRes.ok) {
        mockData = await mockRes.json()
      }
    } catch (e) {
      // Ignorieren, ist eventuell in Produktion gar nicht vorhanden
    }

    let now, sunrise, sunset

    if (mockData && mockData.useMock) {
      // Mock-Daten nutzen
      now = new Date(mockData.now)
      sunrise = new Date(mockData.sunrise)
      sunset = new Date(mockData.sunset)
    } else {
      // Reale Daten von Open-Meteo abfragen
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=54.22&longitude=11.08&daily=sunrise,sunset&timezone=Europe%2FBerlin&start_date=${today}&end_date=${today}`)
      const data = await res.json()
      
      now = new Date()
      if (data.daily?.sunrise) {
        sunrise = new Date(data.daily.sunrise[0])
        sunset = new Date(data.daily.sunset[0])
      }
    }

    if (sunrise && sunset) {
      if (now < sunrise || now >= sunset) {
        isNight.value = true
        sunProgress.value = 1
      } else {
        isNight.value = false
        const twoHours = 2 * 60 * 60 * 1000
        
        let p = 0
        if (now.getTime() - sunrise.getTime() < twoHours) {
          // Within 2 hours of sunrise: transitions from 1 (at sunrise) to 0 (at +2h)
          p = 1 - ((now.getTime() - sunrise.getTime()) / twoHours)
        } else if (sunset.getTime() - now.getTime() < twoHours) {
          // Within 2 hours of sunset: transitions from 0 (at -2h) to 1 (at sunset)
          p = 1 - ((sunset.getTime() - now.getTime()) / twoHours)
        } else {
          // Over 2 hours from sunrise/sunset, perfectly midday (0 = pure yellow)
          p = 0
        }
        
        sunProgress.value = Math.max(0, Math.min(1, p))
      }
    }

    // Näherungswert für die aktuelle Mondphase berechnen (0 bis 7)
    const lp = 2551443 // Ein Mondmonat in Sekunden
    const knownNewMoon = new Date("2024-01-11T11:57:00Z")
    let phase = ((now.getTime() - knownNewMoon.getTime()) / 1000 % lp) / lp
    if (phase < 0) phase += 1
    moonPhaseIndex.value = Math.floor((phase + (1/16)) % 1 * 8)

  } catch (e) {
    console.error('Konnte Sonnen/Monddaten nicht laden', e)
  }
}

let intervalId
onMounted(() => {
  checkTimeAndPhase()
  intervalId = setInterval(checkTimeAndPhase, 60000) // jede Minute updaten
})
onUnmounted(() => clearInterval(intervalId))

const stars = Array.from({ length: 80 }, () => ({
  left: Math.random() * 100 + '%',
  top: Math.random() * 70 + '%',
  size: Math.random() * 2 + 1 + 'px',
  opacity: Math.random() * 0.8 + 0.2,
  animationDelay: Math.random() * 4 + 's'
}))

const shootingStars = ref([])

const triggerRays = () => {
  if (isNight.value) {
    const angle = Math.random() * 360
    const distance = 30 + Math.random() * 40 // 30vw bis 70vw Flugweite
    const newStar = {
      id: Date.now() + Math.random(),
      top: Math.random() * 60 + 10 + '%',
      left: Math.random() * 80 + 10 + '%',
      angle: angle,
      distance: distance
    }
    shootingStars.value.push(newStar)
    setTimeout(() => {
      shootingStars.value = shootingStars.value.filter(s => s.id !== newStar.id)
    }, 1200)
    return
  }

  if (isBeaming.value) return
  isBeaming.value = true
  setTimeout(() => {
    isBeaming.value = false
  }, 700)
}
</script>

<template>
  <section id="home" class="hero-section" :class="{ 'is-night': isNight }" :style="{ '--p': sunProgress }">
    <!-- SVG Clip Path Definition for the Moon Phase -->
    <svg v-if="isNight" width="0" height="0" style="position: absolute;">
      <defs>
        <clipPath id="moon-phase-clip" clipPathUnits="objectBoundingBox">
          <path v-if="moonPhaseIndex !== 0" :d="moonPhasePath" />
        </clipPath>
      </defs>
    </svg>

    <!-- Sky / sun backdrop -->
    <div class="hero-sky" aria-hidden="true">
      <!-- Stars (Night only) -->
      <div v-if="isNight" class="stars-container">
        <div v-for="(star, index) in stars" :key="'star-' + index" class="star" 
             :style="{ left: star.left, top: star.top, width: star.size, height: star.size, opacity: star.opacity, animationDelay: star.animationDelay }"></div>
      </div>

      <!-- Shooting Stars (Night only) -->
      <div v-if="isNight" class="shooting-stars-container">
        <div v-for="star in shootingStars" :key="star.id" class="shooting-star" :style="{ left: star.left, top: star.top, '--angle': star.angle + 'deg', '--dist': star.distance + 'vw' }"></div>
      </div>

      <!-- Drifting clouds -->
      <span class="cloud cloud-1"></span>
      <span class="cloud cloud-2"></span>

      <!-- Flying seagulls -->
      <svg class="gull gull-1" viewBox="0 0 60 24" aria-hidden="true">
        <path d="M2 16 Q15 2 28 14 Q41 2 54 16" fill="none" stroke="#163a4e" stroke-width="2.4" stroke-linecap="round" />
      </svg>
      <svg class="gull gull-2" viewBox="0 0 60 24" aria-hidden="true">
        <path d="M2 16 Q15 2 28 14 Q41 2 54 16" fill="none" stroke="#163a4e" stroke-width="2.4" stroke-linecap="round" />
      </svg>
      <svg class="gull gull-3" viewBox="0 0 60 24" aria-hidden="true">
        <path d="M2 16 Q15 2 28 14 Q41 2 54 16" fill="none" stroke="#1f4c63" stroke-width="2" stroke-linecap="round" />
      </svg>
    </div>

    <div class="hero-content">
      <div class="hero-logo-wrapper" @click="triggerRays">
        <div v-if="!isNight" class="sun-rays" :class="{ 'is-beaming': isBeaming }">
          <div v-for="n in 12" :key="n" class="ray" :style="{ '--rot': `${(n - 1) * 30}deg` }"></div>
        </div>
        <div class="sun-glow"></div>
        
        <div class="sun" :class="{ 'is-moon': isNight }">
          <!-- Dark background of moon -->
          <div v-if="isNight" class="moon-dark-bg"></div>

          <!-- Base Text (Light text for the dark part of the moon) -->
          <h1 class="logo-text">
            <span class="logo-ocean">OCEAN</span>
            <span class="logo-barpub">BAR & PUB</span>
          </h1>

          <!-- Bright Moon Overlay (clipped to phase with dark text inside) -->
          <div v-if="isNight && moonPhaseIndex !== 0" class="moon-bright-overlay" style="clip-path: url(#moon-phase-clip); -webkit-clip-path: url(#moon-phase-clip);">
             <div class="moon-bright-bg"></div>
             <!-- Dark text, identically aligned -->
             <h1 class="logo-text text-dark-moon">
               <span class="logo-ocean">OCEAN</span>
               <span class="logo-barpub">BAR & PUB</span>
             </h1>
          </div>
        </div>
      </div>
      <p class="hero-subtitle brand-subtitle">Deine Strandbar an der Ostsee · Dahme</p>
    </div>

    <!-- Wave divider into the next section -->
    <div class="hero-waves" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path class="wave wave-back" d="M0,64 C240,112 480,16 720,48 C960,80 1200,112 1440,64 L1440,120 L0,120 Z" fill="#aee3da" />
        <path class="wave wave-front" d="M0,80 C240,40 480,120 720,80 C960,40 1200,96 1440,72 L1440,120 L0,120 Z" fill="#fbf1dd" />
      </svg>
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
  overflow: hidden;
  transition: background 2s ease;
  
  --sky-1: #8fd2ea;
  --sky-2: #aadff0;
  --sky-3: #d8f0ea;
  --sky-4: #fbf1dd;
  background: linear-gradient(180deg, var(--sky-1) 0%, var(--sky-2) 32%, var(--sky-3) 62%, var(--sky-4) 100%);
}

.hero-section.is-night {
  --sky-1: #0b1a26;
  --sky-2: #102636;
  --sky-3: #16364a;
  --sky-4: #1b415c;
}

.hero-sky {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* Sun Logo Container */
.hero-logo-wrapper {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2.5rem;
  width: clamp(280px, 46vw, 420px);
  height: clamp(280px, 46vw, 420px);
  animation: logoFloat 6s ease-in-out infinite;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.sun {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  transition: box-shadow 2s ease, background 2s ease;

  --color-1: color-mix(in srgb, #ffcfcf calc(var(--p, 0) * 100%), #fff4cf);
  --color-2: color-mix(in srgb, #ff6b6b calc(var(--p, 0) * 100%), #ffd66b);
  --color-3: color-mix(in srgb, #c83232 calc(var(--p, 0) * 100%), #ffc94d);
  --glow: color-mix(in srgb, rgba(200, 50, 50, 0.6) calc(var(--p, 0) * 100%), rgba(255, 201, 77, 0.6));
  --inner: color-mix(in srgb, #801a1a calc(var(--p, 0) * 100%), #ffb300);

  background: radial-gradient(circle at 50% 50%, var(--color-1) 0%, var(--color-2) 45%, var(--color-3) 100%);
  box-shadow: 0 0 80px var(--glow), inset 0 0 30px var(--inner);
}

.sun.is-moon {
  background: none;
  box-shadow: 0 0 80px rgba(255, 253, 240, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.4);
}

/* Moon Overlays */
.moon-dark-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #1b415c;
  z-index: 0;
}

.moon-bright-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.moon-bright-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #fffdf0;
  z-index: -1;
}

.sun-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  border-radius: 50%;
  --glow-ring: color-mix(in srgb, rgba(200, 50, 50, 0.45) calc(var(--p, 0) * 100%), rgba(255, 220, 130, 0.45));
  background: radial-gradient(circle, var(--glow-ring) 0%, rgba(255, 220, 130, 0) 70%);
  animation: sunPulse 8s ease-in-out infinite;
  z-index: 1;
}

.hero-section.is-night .sun-glow {
  background: radial-gradient(circle, rgba(204, 227, 240, 0.3) 0%, rgba(204, 227, 240, 0) 70%);
}

/* Sun Rays (Click Effect) */
.sun-rays {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  transform-origin: center center;
}

.sun-rays.is-beaming {
  animation: sunSpin 0.7s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
}

@keyframes sunSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(120deg); }
}

.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4%;
  height: 48%;
  margin-top: -24%;
  margin-left: -2%;
  background: linear-gradient(to top, rgba(255, 201, 77, 0), #ffc94d, #fff4cf);
  border-radius: 20px;
  opacity: 0;
  transform: rotate(var(--rot)) translateY(-80%);
}

.hero-section.is-night .ray {
  background: linear-gradient(to top, rgba(204, 227, 240, 0), #a3cce6, #ffffff);
}

.is-beaming .ray {
  animation: rayBurst 0.7s ease-out forwards;
}

@keyframes rayBurst {
  0% {
    opacity: 1;
    transform: rotate(var(--rot)) translateY(-95%);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--rot)) translateY(-155%) scaleY(1.2);
  }
}

/* Stars Container and Twinkling */
.stars-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.star {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  animation: twinkle 4s ease-in-out infinite;
  box-shadow: 0 0 6px 1px rgba(255, 255, 255, 0.6);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.3); }
}

/* Shooting Stars */
.shooting-stars-container {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.shooting-star {
  position: absolute;
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,1));
  border-radius: 999px;
  opacity: 0;
  animation: shoot 1.2s cubic-bezier(0.2, 0.1, 0.1, 1) forwards;
}

@keyframes shoot {
  0% {
    opacity: 1;
    transform: rotate(var(--angle)) translateX(0) scaleX(0.5);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--angle)) translateX(var(--dist)) scaleX(2);
  }
}

.logo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0;
  line-height: 1.1;
  transform: translateY(-5%);
  position: relative;
  z-index: 1;
}

.logo-ocean {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  letter-spacing: 0.05em;
  color: #000 !important;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.3) !important;
  transition: color 2s ease, text-shadow 2s ease;
}

.text-dark-moon .logo-ocean {
  color: #1b415c !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
}

.hero-section.is-night .sun > .logo-text .logo-ocean {
  color: #fff !important;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.6) !important;
}

.logo-barpub {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 400;
  margin-top: -0.3em;
  color: #000 !important;
  transition: color 2s ease, text-shadow 2s ease;
  text-shadow: 
    -1px -1px 0 #fff,  
     1px -1px 0 #fff,
    -1px  1px 0 #fff,
     1px  1px 0 #fff,
    -2px -2px 0 #fff,  
     2px -2px 0 #fff,
    -2px  2px 0 #fff,
     2px  2px 0 #fff,
     0px  4px 8px rgba(0,0,0,0.4) !important;
}

.text-dark-moon .logo-barpub {
  color: #1b415c !important;
  text-shadow: 
    -1px -1px 0 #fff,  1px -1px 0 #fff,
    -1px  1px 0 #fff,  1px  1px 0 #fff,
     0px  2px 4px rgba(0,0,0,0.2) !important;
}

.hero-section.is-night .sun > .logo-text .logo-barpub {
  color: #fff !important;
  text-shadow: 
    -1px -1px 0 #1b415c,  1px -1px 0 #1b415c,
    -1px  1px 0 #1b415c,  1px  1px 0 #1b415c,
    -2px -2px 0 #1b415c,  2px -2px 0 #1b415c,
    -2px  2px 0 #1b415c,  2px  2px 0 #1b415c,
     0px  4px 8px rgba(0,0,0,0.6) !important;
}

@keyframes sunPulse {
  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.06); }
}

/* Clouds */
.cloud {
  position: absolute;
  width: 120px;
  height: 36px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  filter: blur(2px);
  box-shadow: 36px 6px 0 -6px rgba(255, 255, 255, 0.85),
              -34px 8px 0 -8px rgba(255, 255, 255, 0.8);
}

.cloud-1 { top: 22%; left: -160px; animation: drift 38s linear infinite; }
.cloud-2 { top: 38%; left: -220px; transform: scale(0.7); animation: drift 52s linear infinite; animation-delay: -10s; }

@keyframes drift {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(100vw + 260px)); }
}

/* Seagulls */
.gull {
  position: absolute;
  width: clamp(34px, 5vw, 56px);
  height: auto;
  opacity: 0.85;
}

.gull-1 { top: 26%; left: -80px; animation: fly1 26s linear infinite, flap 1.6s ease-in-out infinite; }
.gull-2 { top: 34%; left: -80px; animation: fly2 32s linear infinite, flap 1.9s ease-in-out infinite; animation-delay: -6s; }
.gull-3 { top: 20%; left: -80px; transform: scale(0.75); animation: fly1 40s linear infinite, flap 2.2s ease-in-out infinite; animation-delay: -14s; }

@keyframes fly1 {
  from { transform: translate(0, 0); }
  to   { transform: translate(calc(100vw + 160px), 30px); }
}
@keyframes fly2 {
  from { transform: translate(0, 20px); }
  to   { transform: translate(calc(100vw + 160px), -20px); }
}
@keyframes flap {
  0%, 100% { scale: 1 1; }
  50%      { scale: 1 0.7; }
}

.hero-content {
  text-align: center;
  padding: 4rem 3rem;
  max-width: 800px;
  z-index: 3;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.6vw, 1.6rem);
  margin-bottom: 0;
  font-family: var(--font-secondary);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #163a4e !important;
  text-shadow: 0 2px 12px rgba(255, 255, 255, 0.45);
  transition: color 2s ease, text-shadow 2s ease;
}

.hero-section.is-night .hero-subtitle {
  color: #fff !important;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
}

/* Wave divider */
.hero-waves {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  line-height: 0;
  z-index: 2;
}

.hero-waves svg {
  display: block;
  width: 100%;
  height: clamp(70px, 12vw, 130px);
}

.wave-back { animation: waveShift 14s ease-in-out infinite; opacity: 0.9; }
.wave-front { animation: waveShift 10s ease-in-out infinite reverse; }

@keyframes waveShift {
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(-30px); }
}

/* Mobile Optimization */
@media (max-width: 767px) {
  .hero-content {
    padding: 3rem 2rem;
    margin: 1rem;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .sun-glow,
  .cloud,
  .gull,
  .hero-logo-wrapper,
  .wave-back,
  .wave-front {
    animation: none !important;
  }
}
</style>