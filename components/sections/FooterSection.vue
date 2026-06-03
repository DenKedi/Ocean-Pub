<script setup>
const props = defineProps({
  theme: {
    type: String,
    default: 'dark'
  }
})

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <footer class="footer theme-section-bg" :class="{ 'footer-light': theme === 'light' }">
    <div class="container">
      <div class="footer-content">
        <!-- Ocean Pub Info Section -->
        <div class="footer-section brand-section">
          <img src="/icon.png" alt="Ocean Pub Logo" class="footer-logo" width="160" height="48" />
          <p class="theme-text-secondary footer-slogan">Die Beste Bar in Dahme</p>
          <div class="footer-address theme-text-secondary">
            <p>
              <a href="https://maps.app.goo.gl/WQWnzB3psH2qgkCy6" target="_blank" rel="noopener noreferrer" class="footer-link theme-text-secondary">
                An d. Strandpromenade 20, 23747 Dahme
              </a>
            </p>
          </div>
        </div>
        
        <!-- Contact Info -->
        <div class="footer-section contact-section">
          <h4 class="theme-text-primary">Kontakt</h4>
          <div class="contact-info">
            <a href="mailto:info@ocean-bar.de" class="contact-item footer-link theme-text-secondary">info@ocean-bar.de</a>
            <a href="tel:+4915205714152" class="contact-item footer-link theme-text-secondary">015205714152</a>
          </div>
        </div>
        
        <!-- Legal Links -->
        <div class="footer-section legal-section">
          <h4 class="theme-text-primary">Rechtliches</h4>
          <div class="footer-links">
            <RouterLink to="/impressum" class="footer-link theme-text-secondary">Impressum</RouterLink>
            <RouterLink to="/datenschutz" class="footer-link theme-text-secondary">Datenschutz</RouterLink>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom"> 
        <p class="theme-text-muted">&copy; 2026 OCEAN PUB. All rights reserved. | Made with ♥ by <a href="mailto:cedric@bleck.it">Cedric Bleck</a></p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--theme-border);
  padding: 2rem 0 2rem;
  position: relative;
  z-index: 10;
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
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 3rem 0;
}


.footer-logo {
  height: 48px;
  width: auto;
  margin-bottom: 2rem;
  transition: filter 0.3s ease;
}

.footer-slogan {
  margin-top: -1rem !important;
}

.footer-section h4 {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  margin-top: 0;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-family: var(--font-primary);
  color: #163a4e !important;
}

.footer-section p {
  line-height: 1.8;
  margin: 0 0 0.8rem 0;
  font-family: var(--font-text);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  color: #1f4c63 !important;
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
  font-family: var(--font-text);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  padding: 0.3rem 0;
  position: relative;
  color: #1f4c63 !important;
}

.footer-link:hover {
  color: #ff6f59 !important;
}

.footer-bottom {
  text-align: center;
  padding-top: 2.5rem;
  border-top: 1px solid var(--theme-border);
  position: relative;
}

/* Light Theme Override */
.footer-light.theme-section-bg {
  background: #fffaf0 !important;
  border-top: 1px solid rgba(22, 58, 78, 0.12) !important;
  box-shadow: 0 -4px 30px rgba(22, 58, 78, 0.06);
}

.footer-light .theme-text-primary,
.footer-light h4 {
  color: #163a4e !important;
}

.footer-light .theme-text-secondary,
.footer-light p,
.footer-light .contact-item,
.footer-light .theme-text-muted {
  color: #1f4c63 !important;
}

.footer-light .footer-logo {
  filter: none !important;
}

.footer-light .footer-link {
  color: #1f4c63 !important;
}

.footer-light .footer-link:hover {
  color: #ff6f59 !important;
}

.footer-light .footer-bottom {
  border-top: 1px solid rgba(22, 58, 78, 0.1);
}

.footer-light .footer-address p {
  color: #1f4c63 !important;
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

  .footer-logo {
    height: 32px;
    margin-bottom: 1rem;
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