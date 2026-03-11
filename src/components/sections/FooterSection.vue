<script setup>
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <footer class="footer theme-section-bg">
    <div class="container">
      <div class="footer-content">
        <!-- PALLAS Info Section -->
        <div class="footer-section brand-section">
          <h4 class="theme-text-primary">PALLAS.WORLD</h4>
          <p class="theme-text-secondary">Everybody Welcome</p>
          <div class="footer-address theme-text-secondary">
            <p>Neuer Pferdemarkt 13, 20359 Hamburg, Germany</p>
          </div>
        </div>
        
        <!-- Navigation Links -->
        <div class="footer-section links-section">
          <h4 class="theme-text-primary">Navigation</h4>
          <div class="footer-links">
            <a @click="scrollToSection('kontakt')" class="footer-link theme-text-secondary">Kontakt</a>
            <a @click="scrollToSection('speisekarte')" class="footer-link theme-text-secondary">Drinks-Menü</a>
            <a @click="scrollToSection('events')" class="footer-link theme-text-secondary">Events</a>
          </div>
        </div>
        
        <!-- Contact Info -->
        <div class="footer-section contact-section">
          <h4 class="theme-text-primary">Kontakt</h4>
          <div class="contact-info">
            <span class="contact-item theme-text-secondary">+49 40 98246368</span>
            <span class="contact-item theme-text-secondary">adjsavedmylife@pallas.world</span>
            <a href="https://instagram.com/pallas_world" target="_blank" class="contact-item footer-link theme-text-secondary">@pallas_world</a>
          </div>
        </div>
        
        <!-- Legal Links -->
        <div class="footer-section legal-section">
          <h4 class="theme-text-primary">Rechtliches</h4>
          <div class="footer-links">
            <a href="#impressum" class="footer-link theme-text-secondary">Impressum</a>
            <a href="#datenschutz" class="footer-link theme-text-secondary">Datenschutz</a>
            <a href="#agb" class="footer-link theme-text-secondary">AGB</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom"> 
        <p class="theme-text-muted">&copy; 2026 PALLAS.WORLD. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--theme-border);
  padding: 2rem 0 2rem;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.005) 0%, transparent 50%),
    radial-gradient(circle at 70% 90%, rgba(255, 255, 255, 0.008) 0%, transparent 50%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 3rem 0;
}

.footer-section {
  position: relative;
}

.footer-section h4 {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  margin-top: 0;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  color: #ffffff !important;
}

.footer-section p {
  line-height: 1.8;
  margin: 0 0 0.8rem 0;
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 400;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  color: #ffffff !important;
}

.footer-section p:last-child {
  margin-bottom: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.contact-item {
  display: block;
  padding: 0.3rem 0;
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 400;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.footer-link {
  display: block;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 400;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  padding: 0.3rem 0;
  position: relative;
  color: #ffffff !important;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.7) !important;
}

.footer-bottom {
  text-align: center;
  padding-top: 2.5rem;
  border-top: 1px solid var(--theme-border);
  position: relative;
}

.footer-bottom::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--theme-border), transparent);
}

.footer-bottom p {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 100;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
  text-transform: uppercase;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 1.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr; /* Force single column on mobile/tablet */
    gap: 3rem;
    text-align: center;
  }

  /* Center items */
  .contact-info, .brand-section, .links-section, .legal-section {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
}

/* Fix Underscore on Phone Numbers */
.contact-item {
  display: block;
  margin-bottom: 0.5rem;
  text-decoration: none !important;
}

/* iOS auto-linking (tel/mail) underline fix */
:deep(a[x-apple-data-detectors]),
:deep(a[href^="tel"]),
:deep(a[href^="mailto"]) {
  color: inherit !important;
  text-decoration: none !important;
  border-bottom: none !important;
}

@media (max-width: 480px) {
/* Merged into 768px block mostly, but keeping specific overrides if needed */
}
</style>