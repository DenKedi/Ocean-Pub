<template>
  <section id="ueber-uns" class="content-section theme-section-bg about-section">
    <div class="container">
      <h2 class="section-title theme-text-primary">Über PALLAS</h2>
      <div class="section-grid">
        <div class="text-content theme-container-bg">
          <p class="lead-text theme-text-primary">
            Willkommen bei PALLAS.WORLD – einem Ort, wo jeder willkommen ist. 
            Im Herzen von Hamburg, am Neuer Pferdemarkt 13, schaffen wir einzigartige Erlebnisse.
          </p>
          <p class="theme-text-secondary">
            PALLAS steht für Vielfalt, Kreativität und Gemeinschaft. Ob Restaurant, Bar oder Club – 
            bei uns findest du einen Raum, der dich inspiriert und verbindet. Everybody Welcome.
          </p>
        </div>
        <div class="feature-list">
          <div class="feature-item theme-item-bg">
            <h3 class="theme-text-primary">Restaurant</h3>
            <p class="theme-text-muted">Kulinarische Vielfalt und besondere Geschmackserlebnisse</p>
          </div>
          <div class="feature-item theme-item-bg">
            <h3 class="theme-text-primary">Bar</h3>
            <p class="theme-text-muted">Kreative Cocktails und entspannte Atmosphäre</p>
          </div>
          <div class="feature-item theme-item-bg">
            <h3 class="theme-text-primary">Club</h3>
            <p class="theme-text-muted">Musik, Tanz und unvergessliche Nächte</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  padding: 8rem 0;
  border-top: 1px solid var(--theme-border);
  border-bottom: 1px solid var(--theme-border);
  position: relative;
}

/* Section-specific background for minimal theme */
.about-section.theme-section-bg {
  background: var(--theme-aboutBg, var(--theme-sectionBg)) !important;
}

.content-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.008) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.012) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 4rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
  position: relative;
  color: #ffffff !important;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--theme-border), transparent);
}

.section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;
}

.text-content {
  padding: 3rem;
  background: transparent !important;
}

.lead-text {
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-weight: 400;
  font-family: 'Source Sans 3', sans-serif;
  letter-spacing: 0.02em;
  color: #ffffff !important;
}

.text-content p {
  font-size: 1rem;
  line-height: 1.8;
  font-weight: 400;
  font-family: 'Source Sans 3', sans-serif;
  letter-spacing: 0.01em;
  color: #ffffff !important;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  padding: 2.5rem 2rem;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
  background: transparent !important;
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.02), transparent);
  transition: left 0.6s ease;
}

.feature-item:hover::before {
  left: 100%;
}

.feature-item:hover {
  transform: translateY(-5px) translateX(3px);
}

.feature-item h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  opacity: 0.95;
  color: #ffffff !important;
}

.feature-item p {
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  color: #ffffff !important;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .content-section {
    padding: 5rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .section-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .text-content {
    padding: 2.5rem 2rem;
  }
  
  .feature-item {
    padding: 2rem 1.5rem;
  }
}
</style>