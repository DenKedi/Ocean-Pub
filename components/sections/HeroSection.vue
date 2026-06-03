<script setup>
</script>

<template>
  <section id="home" class="hero-section">
    <!-- Sky / sun backdrop -->
    <div class="hero-sky" aria-hidden="true">
      <div class="sun"></div>
      <div class="sun-glow"></div>

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
      <img src="/icon.png" alt="Ocean Pub Logo" class="hero-logo" />
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
  background: linear-gradient(180deg,
    #8fd2ea 0%,
    #aadff0 32%,
    #d8f0ea 62%,
    #fbf1dd 100%);
}

.hero-sky {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* Sun */
.sun {
  position: absolute;
  top: 14%;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(120px, 22vw, 220px);
  height: clamp(120px, 22vw, 220px);
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, #fff4cf 0%, #ffd66b 45%, #ffc94d 100%);
  box-shadow: 0 0 80px rgba(255, 201, 77, 0.6);
}

.sun-glow {
  position: absolute;
  top: 14%;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(260px, 48vw, 520px);
  height: clamp(260px, 48vw, 520px);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 220, 130, 0.45) 0%, rgba(255, 220, 130, 0) 70%);
  animation: sunPulse 8s ease-in-out infinite;
}

@keyframes sunPulse {
  0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
  50%      { opacity: 1;   transform: translateX(-50%) scale(1.06); }
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
}

.hero-logo {
  width: 100%;
  max-width: clamp(280px, 46vw, 520px);
  height: auto;
  margin-bottom: 2.5rem;
  filter: drop-shadow(0 18px 30px rgba(22, 58, 78, 0.25));
  animation: logoFloat 6s ease-in-out infinite;
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
  .sun { top: 12%; }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .sun-glow,
  .cloud,
  .gull,
  .hero-logo,
  .wave-back,
  .wave-front {
    animation: none !important;
  }
}
</style>