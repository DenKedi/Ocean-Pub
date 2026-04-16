<script setup>
</script>

<template>
  <section id="home" class="hero-section theme-section-bg">
    
    <div class="hero-content">
      <img src="~/assets/icons/Pallas_Logo_II.svg" alt="Pallas Logo" class="hero-logo" />
      <p class="hero-subtitle theme-text-secondary pallas-subtitle">Everybody Welcome</p>
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
  max-width: clamp(300px, 50vw, 550px);
  height: auto;
  margin-bottom: 4rem;
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
  margin-bottom: 0;
  opacity: 0.9;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  font-family: var(--font-primary);
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 1.1rem;
  color: #ffffff !important;
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
}
</style>