const fs = require('fs');

const code = `<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const isBeaming = ref(false)
const isNight = ref(false)
const sunProgress = ref(0)
const dipProgress = ref(0) // Für Sonne nach unten
const sandProgress = ref(0) // Für Strand nach oben
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

const moonPhasePath = computed(() => moonBoundingPaths[moonPhaseIndex.value] || moonBoundingPaths[4])

const checkTimeAndPhase = async () => {
  try {
    let mockData = null
    try {
      const mockRes = await fetch('/time-mock.json')
      if (mockRes.ok) mockData = await mockRes.json()
    } catch (e) {}

    let now, sunrise, sunset

    if (mockData && mockData.useMock) {
      now = new Date(mockData.now)
      sunrise = new Date(mockData.sunrise)
      sunset = new Date(mockData.sunset)
    } else {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=54.22&longitude=11.08&daily=sunrise,sunset&timezone=Europe%2FBerlin&start_date=\${today}&end_date=\${today}\`)
      const data = await res.json()
      
      now = new Date()
      if (data.daily?.sunrise) {
        sunrise = new Date(data.daily.sunrise[0])
        sunset = new Date(data.daily.sunset[0])
      }
    }

    if (sunrise && sunset) {
      const msNow = now.getTime()
      const msSr = sunrise.getTime()
      const msSs = sunset.getTime()
      const halfHourMs = 30 * 60 * 1000
      
      let tProgress = 0

      // Calculate transitions
      if (msNow >= msSr - halfHourMs && msNow <= msSr + halfHourMs) {
        // Sunrise transition: -1 (night) to 1 (day)
        tProgress = (msNow - msSr) / halfHourMs
      } else if (msNow >= msSs - halfHourMs && msNow <= msSs + halfHourMs) {
        // Sunset transition: -1 (day) to 1 (night)
        tProgress = (msNow - msSs) / halfHourMs
      }

      // Check purely night or day for visibility
      if (msNow < msSr || msNow >= msSs) {
        isNight.value = true
        sunProgress.value = 1
      } else {
        isNight.value = false
        const midDay = msSr + (msSs - msSr) / 2
        sunProgress.value = Math.abs((msNow - midDay) / (msSs - midDay))
      }
      
      // Calculate intersection multipliers (0 = normal, 1 = max intersecting)
      if (msNow >= msSr - halfHourMs && msNow <= msSr + halfHourMs) {
        dipProgress.value = 1 - Math.abs(tProgress)
        sandProgress.value = 1 - Math.abs(tProgress)
      } else if (msNow >= msSs - halfHourMs && msNow <= msSs + halfHourMs) {
        dipProgress.value = 1 - Math.abs(tProgress)
        sandProgress.value = 1 - Math.abs(tProgress)
      } else {
        dipProgress.value = 0
        sandProgress.value = 0
      }
    }

    const lp = 2551443
    const knownNewMoon = new Date("2024-01-11T11:57:00Z")
    let phase = ((now.getTime() - knownNewMoon.getTime()) / 1000 % lp) / lp
    if (phase < 0) phase += 1
    moonPhaseIndex.value = Math.floor((phase + (1/16)) % 1 * 8) || 4

  } catch (e) {
    console.error('Konnte Sonnen/Monddaten nicht laden', e)
  }
}

let intervalId
onMounted(() => {
  checkTimeAndPhase()
  intervalId = setInterval(checkTimeAndPhase, 60000)
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
    const distance = 30 + Math.random() * 40
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
  setTimeout(() => isBeaming.value = false, 700)
}
</script>

<template>
  <section id="home" class="hero-section" :class="{ 'is-night': isNight }" :style="{ '--p': sunProgress, '--dip': dipProgress, '--sand': sandProgress }">
    <svg v-if="isNight" width="0" height="0" style="position: absolute;">
      <defs>
        <clipPath id="moon-phase-clip" clipPathUnits="objectBoundingBox">
          <path v-if="moonPhaseIndex !== 0" :d="moonPhasePath" />
        </clipPath>
      </defs>
    </svg>

    <div class="hero-sky" aria-hidden="true">
      <div v-if="isNight" class="stars-container">
        <div v-for="(star, index) in stars" :key="'star-' + index" class="star" :style="{ left: star.left, top: star.top, width: star.size, height: star.size, opacity: star.opacity, animationDelay: star.animationDelay }"></div>
      </div>
      <div v-if="isNight" class="shooting-stars-container">
        <div v-for="star in shootingStars" :key="star.id" class="shooting-star" :style="{ left: star.left, top: star.top, '--angle': star.angle + 'deg', '--dist': star.distance + 'vw' }"></div>
      </div>

      <span class="cloud cloud-1"></span>
      <span class="cloud cloud-2"></span>

      <svg class="gull gull-1" viewBox="0 0 60 24" aria-hidden="true"><path d="M2 16 Q15 2 28 14 Q41 2 54 16" fill="none" stroke="#163a4e" stroke-width="2.4" stroke-linecap="round" /></svg>
      <svg class="gull gull-2" viewBox="0 0 60 24" aria-hidden="true"><path d="M2 16 Q15 2 28 14 Q41 2 54 16" fill="none" stroke="#163a4e" stroke-width="2.4" stroke-linecap="round" /></svg>
      <svg class="gull gull-3" viewBox="0 0 60 24" aria-hidden="true"><path d="M2 16 Q15 2 28 14 Q41 2 54 16" fill="none" stroke="#1f4c63" stroke-width="2" stroke-linecap="round" /></svg>
    </div>

    <div class="hero-content">
      <div class="hero-logo-wrapper" @click="triggerRays">
        <div v-if="!isNight" class="sun-rays" :class="{ 'is-beaming': isBeaming }">
          <div v-for="n in 12" :key="n" class="ray" :style="{ '--rot': \`\${(n - 1) * 30}deg\` }"></div>
        </div>
        <div class="sun-glow"></div>
        
        <div class="sun" :class="{ 'is-moon': isNight }">
          <div v-if="isNight" class="moon-dark-bg"></div>
          <div v-if="isNight" class="moon-bright-overlay" style="clip-path: url(#moon-phase-clip);">
            <div class="moon-bright-bg"></div>
            <strong class="moon-text dark">OCEAN<br/>BAR & PUB</strong>
          </div>
          <strong class="sun-text" :class="{ 'light': isNight }">OCEAN<br/>BAR & PUB</strong>
        </div>
      </div>
      <p class="hero-subtitle brand-subtitle">Deine Strandbar an der Ostsee · Dahme</p>
    </div>

    <div class="hero-waves" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path class="wave wave-back" d="M0,64 C240,112 480,16 720,48 C960,80 1200,112 1440,64 L1440,120 L0,120 Z" fill="#aee3da" />
        <path class="wave wave-front" d="M0,80 C240,40 480,120 720,80 C960,40 1200,96 1440,72 L1440,120 L0,120 Z" fill="#fbf1dd" />
      </svg>
      <div class="wave-fill"></div>
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
  
  --sky-1: color-mix(in srgb, #8fd2ea calc((1 - var(--p, 0)) * 100%), #0b1a26);
  --sky-2: color-mix(in srgb, #aadff0 calc((1 - var(--p, 0)) * 100%), #102636);
  --sky-3: color-mix(in srgb, #d8f0ea calc((1 - var(--p, 0)) * 100%), #16364a);
  --sky-4: color-mix(in srgb, #fbf1dd calc((1 - var(--p, 0)) * 100%), #1b415c);
  
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
  z-index: 10;
  /* Celestial dip uses var(--dip) max 45vh down */
  transform: translateY(calc(var(--dip, 0) * 45vh));
  transition: transform 1s ease-in-out;
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

/* Typography styles */
.sun-text {
  font-family: var(--font-secondary);
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 700;
  color: #163a4e !important;
  text-align: center;
  line-height: 1.1;
  letter-spacing: 0.05em;
  z-index: 3;
}

.sun-text.light { color: #fffdf0 !important; }
.moon-text.dark { color: #163a4e !important; }

.moon-text {
  font-family: var(--font-secondary);
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 700;
  text-align: center;
  line-height: 1.1;
  letter-spacing: 0.05em;
  z-index: 3;
}

.sun-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140%;
  height: 140%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 220, 130, 0.45) 0%, rgba(255, 220, 130, 0) 70%);
  animation: sunPulse 8s ease-in-out infinite;
  z-index: 1;
}

.hero-section.is-night .sun-glow {
  background: radial-gradient(circle, rgba(255, 253, 240, 0.15) 0%, rgba(255, 253, 240, 0) 70%);
  width: 160%;
  height: 160%;
}

.sun-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 180%;
  background: linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255, 201, 77, 0.6) 20%, rgba(255, 201, 77, 0.6) 80%, rgba(255,255,255,0) 100%);
  transform: translate(-50%, -50%) rotate(var(--rot));
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.sun-rays.is-beaming .ray {
  animation: rayShoot 0.7s ease-out forwards;
}

@keyframes rayShoot {
  0%   { opacity: 1; transform: translate(-50%, -50%) rotate(var(--rot)) scaleY(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--rot)) scaleY(2.5); }
}

@keyframes sunPulse {
  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.06); }
}

/* Stars */
.stars-container {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px white;
  animation: twinkle 4s ease-in-out infinite alternate;
}
@keyframes twinkle {
  0% { transform: scale(0.8); opacity: 0.2; }
  100% { transform: scale(1.2); opacity: 1; }
}

.shooting-stars-container {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
}
.shooting-star {
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0));
  transform-origin: left center;
  transform: rotate(var(--angle)) translateX(0);
  opacity: 1;
  animation: shoot 1.2s ease-out forwards;
}
@keyframes shoot {
  100% {
    transform: rotate(var(--angle)) translateX(var(--dist));
    opacity: 0;
  }
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
  transition: background 2s ease, box-shadow 2s ease;
  z-index: 1;
}

.hero-section.is-night .cloud {
  background: rgba(94, 131, 158, 0.2);
  box-shadow: 36px 6px 0 -6px rgba(94, 131, 158, 0.2), -34px 8px 0 -8px rgba(94, 131, 158, 0.15);
}

.cloud-1 { top: 22%; left: -160px; animation: drift 38s linear infinite; }
.cloud-2 { top: 38%; left: -220px; transform: scale(0.7); animation: drift 52s linear infinite; animation-delay: -10s; }

@keyframes drift {
  from { left: -260px; }
  to   { left: calc(100vw + 260px); }
}

/* Seagulls */
.gull {
  position: absolute;
  width: clamp(34px, 5vw, 56px);
  height: auto;
  opacity: 0.85;
  transition: opacity 2s ease;
  z-index: 1;
}

.hero-section.is-night .gull { opacity: 0.15; }

.gull-1 { top: 26%; left: -80px; animation: fly1 26s linear infinite, flap 1.6s ease-in-out infinite; }
.gull-2 { top: 34%; left: -80px; animation: fly2 32s linear infinite, flap 1.9s ease-in-out infinite; animation-delay: -6s; }
.gull-3 { top: 20%; left: -80px; transform: scale(0.75); animation: fly1 40s linear infinite, flap 2.2s ease-in-out infinite; animation-delay: -14s; }

@keyframes fly1 {
  from { left: -100px; transform: translateY(0); }
  to   { left: calc(100vw + 160px); transform: translateY(30px); }
}
@keyframes fly2 {
  from { left: -100px; transform: translateY(20px); }
  to   { left: calc(100vw + 160px); transform: translateY(-20px); }
}
@keyframes flap {
  0%, 100% { transform: scaleY(1); }
  50%      { transform: scaleY(0.7); }
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
  0%, 100% { top: 0px; }
  50%      { top: -10px; }
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
  z-index: 10;
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
  z-index: 4; /* Higher than content to cover the sun */
  /* Using var(--sand) max 18vh up */
  transform: translateY(calc(var(--sand, 0) * -18vh));
  transition: transform 1s ease-in-out;
}

.wave-fill {
  background: #fbf1dd;
  height: 25vh;
  width: 100%;
  margin-top: -1px;
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
  }
}
</style>
`;
fs.writeFileSync('components/sections/HeroSection.vue', code);
