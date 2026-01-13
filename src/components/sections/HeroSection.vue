<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToEvents = () => {
  router.push('/events')
}
</script>

<template>
  <section id="home" class="hero-section theme-section-bg">
    
    <div class="hero-content">
      <img src="@/assets/icons/Pallas_Logo_II.svg" alt="Pallas Logo" class="hero-logo" />
      <p class="hero-subtitle theme-text-secondary pallas-subtitle">Everybody Welcome</p>
      <div class="hero-buttons">
        <button @click="scrollToSection('drinks')" class="cta-button primary theme-button theme-text-primary">
          Pallas.Drinks
        </button>
        <button @click="goToEvents" class="cta-button secondary theme-button theme-text-secondary">
          Pallas.Events
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

.hero-logo {
  width: 100%;
  max-width: clamp(250px, 40vw, 400px);
  height: auto;
  margin-bottom: 2rem;
  filter: brightness(1) drop-shadow(0 0 40px rgba(255, 255, 255, 0.15));
  animation: logoFloat 6s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 2rem);
  margin-bottom: 3rem;
  opacity: 0.9;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  font-family: var(--font-primary);
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
  font-family: var(--font-primary);
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
  .parallax-image-container {
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .parallax-image {
    width: clamp(150px, 40vw, 250px);
  }
  
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