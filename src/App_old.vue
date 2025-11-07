<script setup>
import { ref, onMounted } from 'vue'
import BurgerMenu from './components/BurgerMenu.vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

onMounted(() => {
  // Ensure video starts playing
  const video = document.querySelector('.background-video')
  if (video) {
    video.play().catch(e => console.log('Video autoplay failed:', e))
  }
})

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isMenuOpen.value = false
}
</script>

<template>
  <div id="app">
    <!-- Video Background - Full Screen -->
    <video 
      class="background-video" 
      autoplay 
      muted 
      loop 
      playsinline
      preload="auto"
    >
      <source src="./assets/flash.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <!-- Burger Menu -->
    <BurgerMenu :is-open="isMenuOpen" @toggle="toggleMenu" />

    <!-- Hero Section -->
    <section id="home" class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Pallas Bar</h1>
        <p class="hero-subtitle">Elegante Cocktails & Exklusive Atmosphäre</p>
        <div class="hero-buttons">
          <button @click="scrollToSection('reservierung')" class="cta-button primary">
            Reservierung
          </button>
          <button @click="scrollToSection('speisekarte')" class="cta-button secondary">
            Speisekarte
          </button>
        </div>
        
        <!-- Navigation Menu -->
        <nav class="main-nav" :class="{ 'nav-open': isMenuOpen }">
          <a @click="scrollToSection('home')" class="nav-link">Home</a>
          <a @click="scrollToSection('ueber-uns')" class="nav-link">Über uns</a>
          <a @click="scrollToSection('speisekarte')" class="nav-link">Speisekarte</a>
          <a @click="scrollToSection('events')" class="nav-link">Events</a>
          <a @click="scrollToSection('galerie')" class="nav-link">Galerie</a>
          <a @click="scrollToSection('kontakt')" class="nav-link">Kontakt</a>
        </nav>
      </div>
    </section>

    <!-- Über uns Section -->
    <section id="ueber-uns" class="content-section">
      <div class="container">
        <h2 class="section-title">Über Pallas Bar</h2>
        <div class="section-grid">
          <div class="text-content">
            <p class="lead-text">
              Willkommen in der Pallas Bar – einem Ort, wo Eleganz auf Innovation trifft. 
              Seit 2018 kreieren wir einzigartige Cocktail-Erlebnisse in stilvoller Atmosphäre.
            </p>
            <p>
              Unsere erfahrenen Barkeeper verwenden nur die besten Zutaten und modernste Techniken, 
              um Ihnen unvergessliche Geschmackserlebnisse zu bieten. Von klassischen Cocktails 
              bis hin zu unseren exklusiven Pallas-Kreationen.
            </p>
          </div>
          <div class="feature-list">
            <div class="feature-item">
              <h3>Premium Spirituosen</h3>
              <p>Ausgewählte Spirituosen aus aller Welt</p>
            </div>
            <div class="feature-item">
              <h3>Handgefertigte Cocktails</h3>
              <p>Jeder Cocktail ein Kunstwerk</p>
            </div>
            <div class="feature-item">
              <h3>Exklusive Atmosphäre</h3>
              <p>Stilvolles Ambiente für besondere Momente</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Speisekarte Section -->
    <section id="speisekarte" class="content-section dark">
      <div class="container">
        <h2 class="section-title">Unsere Spezialitäten</h2>
        <div class="menu-categories">
          <div class="menu-category">
            <h3>Signature Cocktails</h3>
            <div class="menu-item">
              <div class="item-info">
                <h4>Pallas Negroni</h4>
                <p>Gin, Campari, süßer Wermut, Orange</p>
              </div>
              <span class="price">14€</span>
            </div>
            <div class="menu-item">
              <div class="item-info">
                <h4>Golden Hour</h4>
                <p>Whisky, Honig, Zitrone, Thymian</p>
              </div>
              <span class="price">16€</span>
            </div>
            <div class="menu-item">
              <div class="item-info">
                <h4>Midnight Storm</h4>
                <p>Vodka, schwarze Johannisbeere, Limette</p>
              </div>
              <span class="price">15€</span>
            </div>
          </div>
          
          <div class="menu-category">
            <h3>Klassiker</h3>
            <div class="menu-item">
              <div class="item-info">
                <h4>Old Fashioned</h4>
                <p>Bourbon, Zucker, Angostura, Orange</p>
              </div>
              <span class="price">12€</span>
            </div>
            <div class="menu-item">
              <div class="item-info">
                <h4>Martini</h4>
                <p>Gin oder Vodka, trockener Wermut, Olive</p>
              </div>
              <span class="price">11€</span>
            </div>
            <div class="menu-item">
              <div class="item-info">
                <h4>Mojito</h4>
                <p>Weißer Rum, Minze, Limette, Soda</p>
              </div>
              <span class="price">10€</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section id="events" class="content-section">
      <div class="container">
        <h2 class="section-title">Events & Veranstaltungen</h2>
        <div class="events-grid">
          <div class="event-card">
            <h3>Cocktail Tastings</h3>
            <p class="event-time">Jeden Donnerstag, 19:00 Uhr</p>
            <p>Entdecken Sie die Kunst der Cocktail-Zubereitung in unseren exklusiven Tastings.</p>
          </div>
          <div class="event-card">
            <h3>Live Jazz Nights</h3>
            <p class="event-time">Freitag & Samstag, ab 21:00 Uhr</p>
            <p>Genießen Sie erstklassige Jazz-Musik in entspannter Atmosphäre.</p>
          </div>
          <div class="event-card">
            <h3>Private Events</h3>
            <p class="event-time">Nach Vereinbarung</p>
            <p>Feiern Sie Ihre besonderen Anlässe in unserem exklusiven Ambiente.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Galerie Section -->
    <section id="galerie" class="content-section dark">
      <div class="container">
        <h2 class="section-title">Galerie</h2>
        <div class="gallery-grid">
          <div class="gallery-item">
            <div class="placeholder-image">Cocktail 1</div>
          </div>
          <div class="gallery-item">
            <div class="placeholder-image">Bar Interior</div>
          </div>
          <div class="gallery-item">
            <div class="placeholder-image">Cocktail 2</div>
          </div>
          <div class="gallery-item">
            <div class="placeholder-image">Event</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reservierung Section -->
    <section id="reservierung" class="content-section">
      <div class="container">
        <h2 class="section-title">Reservierung</h2>
        <div class="reservation-content">
          <div class="reservation-info">
            <h3>Tisch reservieren</h3>
            <p>Sichern Sie sich Ihren Platz in der Pallas Bar. Wir empfehlen eine Reservierung, 
               besonders an Wochenenden und für größere Gruppen.</p>
            <div class="contact-info">
              <p><strong>Telefon:</strong> +49 40 123 456 789</p>
              <p><strong>E-Mail:</strong> reservierung@pallasbar.de</p>
              <p><strong>Online:</strong> Über unser Reservierungssystem</p>
            </div>
          </div>
          <div class="opening-hours">
            <h3>Öffnungszeiten</h3>
            <div class="hours-list">
              <div class="hours-item">
                <span>Montag - Mittwoch</span>
                <span>18:00 - 01:00</span>
              </div>
              <div class="hours-item">
                <span>Donnerstag</span>
                <span>17:00 - 02:00</span>
              </div>
              <div class="hours-item">
                <span>Freitag - Samstag</span>
                <span>17:00 - 03:00</span>
              </div>
              <div class="hours-item">
                <span>Sonntag</span>
                <span>18:00 - 24:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kontakt Section -->
    <section id="kontakt" class="content-section dark">
      <div class="container">
        <h2 class="section-title">Kontakt & Anfahrt</h2>
        <div class="contact-grid">
          <div class="contact-info-section">
            <h3>Pallas Bar</h3>
            <div class="contact-details">
              <p><strong>Adresse:</strong><br>
                 Musterstraße 123<br>
                 20095 Hamburg
              </p>
              <p><strong>Telefon:</strong> +49 40 123 456 789</p>
              <p><strong>E-Mail:</strong> info@pallasbar.de</p>
              <p><strong>Instagram:</strong> @pallasbar_hamburg</p>
            </div>
          </div>
          <div class="map-placeholder">
            <div class="placeholder-map">
              <p>Google Maps Integration</p>
              <p>Pallas Bar Hamburg</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Pallas Bar</h4>
            <p>Elegante Cocktails & Exklusive Atmosphäre</p>
          </div>
          <div class="footer-section">
            <h4>Schnelllinks</h4>
            <a @click="scrollToSection('reservierung')">Reservierung</a>
            <a @click="scrollToSection('speisekarte')">Speisekarte</a>
            <a @click="scrollToSection('events')">Events</a>
          </div>
          <div class="footer-section">
            <h4>Rechtliches</h4>
            <a href="#impressum">Impressum</a>
            <a href="#datenschutz">Datenschutz</a>
            <a href="#agb">AGB</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 Pallas Bar Hamburg. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
#app {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.background-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.8;
}

.main-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.content-wrapper {
  text-align: center;
  color: white;
  padding: 2rem;
  max-width: 800px;
}

.title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.1em;
}

.subtitle {
  font-size: clamp(1.2rem, 3vw, 2rem);
  margin-bottom: 3rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.main-nav {
  display: none;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.main-nav.nav-open {
  display: flex;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

/* Desktop Navigation */
@media (min-width: 768px) {
  .main-nav {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .nav-link {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
  }
}

/* Mobile Optimization */
@media (max-width: 767px) {
  .content-wrapper {
    padding: 1rem;
  }
  
  .title {
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    margin-bottom: 2rem;
  }
}
</style>
