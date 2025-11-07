<template>
  <section id="kontakt" class="content-section theme-section-bg">
    <div class="container">
      <h2 class="section-title theme-text-primary pallas-heading">Kontakt & Reservierung</h2>
      
      <div class="contact-content">
        <!-- Location & Info -->
        <div class="contact-paragraph">
          <h3 class="contact-heading">Besuche uns</h3>
          <p class="contact-text">
            <strong>PALLAS.WORLD</strong><br>
            Neuer Pferdemarkt 13<br>
            20359 Hamburg, Deutschland<br>
            <a href="https://maps.app.goo.gl/jHFgfDFinbBSzVMN8" target="_blank" class="maps-link">📍 In Google Maps anzeigen</a>
          </p>
        </div>

        <!-- Contact Info -->
        <div class="contact-paragraph">
          <h3 class="contact-heading">Kontaktiere uns</h3>
          <p class="contact-text">
            <strong>Telefon:</strong> <a href="tel:+4940982463 68" class="contact-link">+49 40 98246368</a><br>
            <strong>E-Mail:</strong> <a href="mailto:adjsavedmylife@pallas.world" class="contact-link">adjsavedmylife@pallas.world</a><br>
            <strong>Instagram:</strong> <a href="https://instagram.com/pallas_world" target="_blank" class="contact-link">@pallas_world</a>
          </p>
        </div>

        <!-- Opening Hours -->
        <div class="contact-paragraph">
          <h3 class="contact-heading">Öffnungszeiten</h3>
          <p class="contact-text">
            <strong>Montag - Mittwoch:</strong> 18:00 - 01:00<br>
            <strong>Donnerstag:</strong> 17:00 - 02:00<br>
            <strong>Freitag - Samstag:</strong> 17:00 - 03:00<br>
            <strong>Sonntag:</strong> 18:00 - 24:00
          </p>
        </div>

        <!-- Reservation -->
        <div class="contact-paragraph">
          <h3 class="contact-heading">Reservierung</h3>
          <p class="contact-text">
            Sichern Sie sich Ihren Platz in der Pallas Bar. Wir empfehlen eine Reservierung, besonders an Wochenenden und für größere Gruppen.<br><br>
            Kontaktieren Sie uns unter <a href="tel:+4940982463 68" class="contact-link">+49 40 98246368</a> oder via <a href="mailto:adjsavedmylife@pallas.world" class="contact-link">E-Mail</a>.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  padding: 8rem 0;
  border-top: 1px solid var(--theme-border);
  position: relative;
}

.content-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.008) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.012) 0%, transparent 50%);
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
  margin-bottom: 5rem;
  font-weight: 100;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--theme-border), transparent);
}

.contact-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;
}

.contact-paragraph {
  padding: 2.5rem;
  border-left: 1px solid var(--theme-border);
  line-height: 1.8;
}

.contact-paragraph:first-child {
  border-left: 2px solid #87CEEB;
}

.contact-heading {
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.contact-text {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.95rem;
  font-weight: 200;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.8;
}

.contact-text strong {
  font-weight: 300;
  color: #ffffff;
}

.contact-link,
.maps-link {
  color: #87CEEB;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
  cursor: pointer;
}

.contact-link:hover,
.maps-link:hover {
  color: #FFD1BA;
  border-bottom-color: #FFD1BA;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-paragraph {
    padding: 2rem;
    border-left: 2px solid #87CEEB;
  }
  
  .section-title {
    margin-bottom: 3rem;
  }
}
</style>