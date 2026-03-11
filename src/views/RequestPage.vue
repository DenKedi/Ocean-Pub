<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import sketch1 from '@/assets/raumplan/sketch1.png'
import sketch2 from '@/assets/raumplan/sketch2.png'
import roomsFallback from '@/assets/default/rooms.json'

const baseRingColors = [
  '#ff6201', '#f80000', '#d70009', '#ff6201',
  '#2b2c77', '#0055a5', '#ff6201', '#f80000',
  '#2b2c77', '#0055a5', '#d70009', '#ff6201',
]

const ringColors = Array.from({ length: 150 }, (_, i) => baseRingColors[i % baseRingColors.length])

// Import images from each room folder using import.meta.glob (static fallback)
const allImages = {
  bar: import.meta.glob('@/assets/pictures/raum/bar/*', { eager: true, import: 'default' }),
  dj: import.meta.glob('@/assets/pictures/raum/dj/*', { eager: true, import: 'default' }),
  tresor: import.meta.glob('@/assets/pictures/raum/tresor/*', { eager: true, import: 'default' }),
  bar5: import.meta.glob('@/assets/pictures/raum/bar5/*', { eager: true, import: 'default' }),
  orangerie: import.meta.glob('@/assets/pictures/raum/orangerie/*', { eager: true, import: 'default' }),
}

const API_BASE = import.meta.env.VITE_API_BASE_URL

const getImagesForFolder = (folder) =>
  Object.values(allImages[folder] || {}).filter(Boolean)

const mapSpots = (spots) =>
  spots.map(spot => ({
    ...spot,
    images: spot.images?.length
      ? spot.images.map(f => f.startsWith('http') ? f : `${API_BASE}/uploads/rooms/${spot.imageFolder}/${f}`)
      : getImagesForFolder(spot.imageFolder)
  }))

// Modal state
const isModalOpen = ref(false)
const selectedSpot = ref(null)
const showFullDescription = ref(false)

const hotspotsSketch1 = ref([])
const hotspotsSketch2 = ref([])
const roomsLoading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rooms`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    hotspotsSketch1.value = mapSpots(data.sketch1 || [])
    hotspotsSketch2.value = mapSpots(data.sketch2 || [])
  } catch (e) {
    console.warn('API nicht erreichbar, nutze Fallback-Daten:', e)
    hotspotsSketch1.value = mapSpots(roomsFallback.sketch1 || [])
    hotspotsSketch2.value = mapSpots(roomsFallback.sketch2 || [])
  } finally {
    roomsLoading.value = false
  }
})

const openSpotModal = (spot) => {
  selectedSpot.value = spot
  showFullDescription.value = false
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  selectedSpot.value = null
  closeLightbox()
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
}

onUnmounted(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})

// Lightbox state (vue-easy-lightbox)
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)
const lightboxImages = ref([])

const openLightbox = (images, index) => {
  lightboxImages.value = images
  lightboxIndex.value = index
  lightboxVisible.value = true
}

const closeLightbox = () => {
  lightboxVisible.value = false
}

// ── Request Form ──
const availableRooms = computed(() => {
  const allRooms = [...hotspotsSketch1.value, ...hotspotsSketch2.value]
  // Filter out DJ Booth — not bookable as a standalone room
  return allRooms.filter(r => r.label !== 'DJ Booth')
})

const form = ref({
  // Ansprechpartner
  name: '',
  email: '',
  telefon: '',
  firma: '',
  // Veranstaltung
  thema: '',
  gaeste: '',
  datum: '',
  musikrichtung: '',
  djQuelle: '',        // 'uns' oder 'pallas'
  raeume: [],          // multiple choice room ids
  budget: '',
  nachricht: '',
  // Alternativdatum
  altDatum: false,
  altDatumWert: '',
  // Consent
  datenschutz: false,
})

const formSubmitted = ref(false)
const formErrors = ref({})

const validate = () => {
  const errors = {}
  if (!form.value.name.trim()) errors.name = 'Bitte Name angeben'
  if (!form.value.email.trim()) errors.email = 'Bitte E-Mail angeben'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.email = 'Ungültige E-Mail-Adresse'
  if (!form.value.thema.trim()) errors.thema = 'Bitte Thema angeben'
  if (!form.value.gaeste) errors.gaeste = 'Bitte Gästeanzahl angeben'
  if (!form.value.datum) errors.datum = 'Bitte Datum auswählen'
  if (form.value.altDatum && !form.value.altDatumWert) errors.altDatumWert = 'Bitte Alternativdatum auswählen'
  if (!form.value.datenschutz) errors.datenschutz = 'Bitte Einverständnis geben'
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const toggleRoom = (id) => {
  const idx = form.value.raeume.indexOf(id)
  if (idx === -1) form.value.raeume.push(id)
  else form.value.raeume.splice(idx, 1)
}

const submitForm = () => {
  if (!validate()) return
  // No e-mail functionality yet — just show success
  formSubmitted.value = true
  console.log('Request form data:', JSON.parse(JSON.stringify(form.value)))
}

const resetForm = () => {
  formSubmitted.value = false
  form.value = {
    name: '', email: '', telefon: '', firma: '',
    thema: '', gaeste: '', datum: '',
    musikrichtung: '', djQuelle: '', raeume: [], budget: '', nachricht: '',
    altDatum: false, altDatumWert: '',
    datenschutz: false,
  }
  formErrors.value = {}
}
</script>

<template>
  <MainLayout theme="light">
    <div class="request-page">
      <!-- Top Rings -->
      <div class="rings-bg top-rings" aria-hidden="true">
        <span
          v-for="(color, idx) in ringColors"
          :key="'top-' + idx"
          class="ring"
          :style="{ '--i': idx + 1, '--color': color }"
        />
      </div>
      <!-- Bottom Rings -->
      <div class="rings-bg bottom-rings" aria-hidden="true">
        <span
          v-for="(color, idx) in ringColors"
          :key="'bottom-' + idx"
          class="ring"
          :style="{ '--i': idx + 1, '--color': color }"
        />
      </div>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-content">
          <h1 class="page-title theme-text-primary">Pallas.Request</h1>
          <p class="page-subtitle theme-text-secondary">Dein Event in unserer Location</p>
          
          <div class="intro-text theme-text-secondary">
            
       Mitten in Hamburg


<p>
Das Pallas in der Schanze ist genau das, was du daraus machen möchtest. 



Wir haben ca. Fünf Bereiche, die du einzeln nutzen oder komplett miteinander verbinden kannst.

Klick dich unten durch unseren interaktiven Raumplan oder schau dir in unseren <router-link to="/stories" class="text-link">Stories</router-link> an, was bei uns schon alles abging. Klingt gut? Dann schreib uns eine Anfrage.


            </p>
          </div>
        </div>
      </section>

      <!-- Interactive Floor Plan Section -->
      <section class="floorplan-section">
        <div class="container">
          
          <div v-if="roomsLoading" class="rooms-loading">Lade Raumdaten...</div>
          <div v-else class="floorplan-container">
            <!-- Sketch 1 - Landscape (Left Side) -->
            <div class="sketch-wrapper sketch-landscape">
              <img :src="sketch1" alt="Bar Sketch - Linke Seite" class="sketch-image" />
              <div 
                v-for="spot in hotspotsSketch1" 
                :key="spot.id"
                class="hotspot"
                :style="{ left: spot.x + '%', top: spot.y + '%' }"
                @click="openSpotModal(spot)"
              >
                <span class="hotspot-dot"></span>
              </div>
            </div>

            <!-- Sketch 2 - Portrait (Right Side) -->
            <div class="sketch-wrapper sketch-portrait">
              <img :src="sketch2" alt="Bar Sketch - Rechte Seite" class="sketch-image" />
              <div 
                v-for="spot in hotspotsSketch2" 
                :key="spot.id"
                class="hotspot"
                :style="{ left: spot.x + '%', top: spot.y + '%' }"
                @click="openSpotModal(spot)"
              >
                <span class="hotspot-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Request Form Section -->
      <section class="form-section">
        <div class="container form-container">
          <h2 class="section-title">Anfrage senden</h2>
          <p class="section-subtitle theme-text-secondary">
            Interesse an einem Event bei uns? Füll das Formular aus und wir melden uns bei dir.
          </p>

          <!-- Success state -->
          <div v-if="formSubmitted" class="form-success">
            <div class="success-icon">✓</div>
            <h3>Vielen Dank für deine Anfrage!</h3>
            <p class="theme-text-secondary">Wir haben deine Nachricht erhalten und melden uns so schnell wie möglich bei dir.</p>
            <button class="form-btn form-btn-secondary" @click="resetForm">Neue Anfrage</button>
          </div>

          <!-- Form -->
          <form v-else class="request-form" @submit.prevent="submitForm" novalidate>

            <!-- ── Ansprechpartner ── -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Ansprechpartner</legend>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="req-name">Name *</label>
                  <input id="req-name" v-model="form.name" type="text" class="form-input" :class="{ 'has-error': formErrors.name }" />
                  <span v-if="formErrors.name" class="form-error">{{ formErrors.name }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label" for="req-email">E-Mail *</label>
                  <input id="req-email" v-model="form.email" type="email" class="form-input" :class="{ 'has-error': formErrors.email }" />
                  <span v-if="formErrors.email" class="form-error">{{ formErrors.email }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label" for="req-telefon">Telefon</label>
                  <input id="req-telefon" v-model="form.telefon" type="tel" class="form-input" />
                </div>

                <div class="form-group">
                  <label class="form-label" for="req-firma">Firma</label>
                  <input id="req-firma" v-model="form.firma" type="text" class="form-input" />
                </div>
              </div>
            </fieldset>

            <!-- ── Veranstaltung ── -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Veranstaltung</legend>

              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label" for="req-thema">Thema / Anlass *</label>
                  <input id="req-thema" v-model="form.thema" type="text" class="form-input" :class="{ 'has-error': formErrors.thema }" />
                  <span v-if="formErrors.thema" class="form-error">{{ formErrors.thema }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label" for="req-gaeste">Gästeanzahl *</label>
                  <input id="req-gaeste" v-model="form.gaeste" type="number" min="1" class="form-input" :class="{ 'has-error': formErrors.gaeste }" />
                  <span v-if="formErrors.gaeste" class="form-error">{{ formErrors.gaeste }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label" for="req-budget">Budget (optional)</label>
                  <input id="req-budget" v-model="form.budget" type="text" class="form-input" />
                </div>

                <!-- Datum -->
                <div class="form-group">
                  <label class="form-label" for="req-datum">Datum *</label>
                  <input id="req-datum" v-model="form.datum" type="date" class="form-input" :class="{ 'has-error': formErrors.datum }" />
                  <span v-if="formErrors.datum" class="form-error">{{ formErrors.datum }}</span>
                </div>

                <!-- Alternativdatum -->
                <div class="form-group form-group-flex full-width">
                  <label class="form-toggle">
                    <input type="checkbox" v-model="form.altDatum" />
                    <span class="toggle-label">Alternativdatum angeben?</span>
                  </label>
                  <div v-if="form.altDatum" class="alt-date-row">
                    <div class="alt-date-field">
                      <input v-model="form.altDatumWert" type="date" class="form-input form-input-sm" :class="{ 'has-error': formErrors.altDatumWert }" />
                      <span v-if="formErrors.altDatumWert" class="form-error">{{ formErrors.altDatumWert }}</span>
                    </div>
                  </div>
                </div>

                <!-- Musikrichtung -->
                <div class="form-group">
                  <label class="form-label" for="req-musik">Musikrichtung</label>
                  <input id="req-musik" v-model="form.musikrichtung" type="text" class="form-input" />
                </div>

                <!-- DJ Quelle -->
                <div class="form-group dj-quelle-group full-width">
                  <label class="form-label">Soll Pallas sich um den DJ kümmern?</label>
                  <div class="dj-quelle-buttons">
                    <button
                      type="button"
                      class="dj-quelle-btn"
                      :class="{ active: form.djQuelle === 'ja' }"
                      @click="form.djQuelle = form.djQuelle === 'ja' ? '' : 'ja'"
                    >
                      Ja
                    </button>
                    <button
                      type="button"
                      class="dj-quelle-btn"
                      :class="{ active: form.djQuelle === 'nein' }"
                      @click="form.djQuelle = form.djQuelle === 'nein' ? '' : 'nein'"
                    >
                      Nein
                    </button>
                  </div>
                </div>
              </div>

              <!-- Räume (multiple choice) -->
              <div class="form-group rooms-group">
                <label class="form-label">Welche Räume interessieren dich?</label>
                <div class="rooms-choices">
                  <button
                    v-for="room in availableRooms"
                    :key="room.id"
                    type="button"
                    class="room-chip"
                    :class="{ active: form.raeume.includes(room.id) }"
                    @click="toggleRoom(room.id)"
                  >
                    {{ room.label }}
                    <span v-if="room.capacity" class="room-chip-cap">{{ room.capacity }}</span>
                  </button>
                </div>
              </div>
            </fieldset>

            <!-- ── Nachricht ── -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Nachricht</legend>
              <div class="form-group full-width">
                <label class="form-label" for="req-nachricht">Deine Nachricht (optional)</label>
                <textarea id="req-nachricht" v-model="form.nachricht" class="form-input form-textarea" rows="5"></textarea>
              </div>
            </fieldset>

            <!-- ── Datenschutz ── -->
            <div class="form-group consent-group">
              <label class="form-checkbox" :class="{ 'has-error': formErrors.datenschutz }">
                <input type="checkbox" v-model="form.datenschutz" />
                <span class="checkbox-box"></span>
                <span class="checkbox-text">
                  Ich bin einverstanden mit der Verarbeitung meiner Daten gemäß der
                  <router-link to="/datenschutz" target="_blank">Datenschutzerklärung</router-link>. *
                </span>
              </label>
              <span v-if="formErrors.datenschutz" class="form-error">{{ formErrors.datenschutz }}</span>
            </div>

            <!-- ── Submit ── -->
            <div class="form-actions">
              <button type="submit" class="form-btn form-btn-primary">Anfrage absenden</button>
            </div>
          </form>
        </div>
      </section>

      <!-- Modal -->
      <Teleport to="body">
        <div v-if="isModalOpen && !lightboxVisible" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <button class="modal-close" @click="closeModal">×</button>
            <h3 class="modal-title">{{ selectedSpot?.label }}</h3>
            
            <!-- Room Details -->
            <div class="room-details">
              <div class="detail-row" v-if="selectedSpot?.capacity || selectedSpot?.area">
                <div v-if="selectedSpot?.capacity" class="detail-item">
                  <span class="detail-label">Kapazität</span>
                  <span class="detail-value">{{ selectedSpot.capacity }}</span>
                </div>
                
                <div v-if="selectedSpot?.area" class="detail-item">
                  <span class="detail-label">Fläche</span>
                  <span class="detail-value">{{ selectedSpot.area }}</span>
                </div>
              </div>
              
              <div v-if="selectedSpot?.features?.length > 0" class="detail-item features">
                <div class="feature-tags">
                  <span 
                    v-for="(feature, index) in selectedSpot.features" 
                    :key="index"
                    class="feature-tag"
                  >
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Description (Moved down) -->
            <div class="description-container">
              <p 
                class="modal-description" 
                :class="{ 'collapsed': !showFullDescription }"
              >
                {{ selectedSpot?.description }}
              </p>
              <button 
                v-if="selectedSpot?.description && selectedSpot.description.length > 150"
                class="read-more-btn"
                @click="showFullDescription = !showFullDescription"
              >
                {{ showFullDescription ? 'Weniger anzeigen' : 'Mehr anzeigen' }}
              </button>
            </div>
            
            <div v-if="selectedSpot?.extraText" class="extra-text">
              {{ selectedSpot.extraText }}
            </div>

            <!-- Images (Moved to bottom) -->
            <div v-if="selectedSpot?.images?.length > 0" class="modal-gallery">
              <img 
                v-for="(img, index) in selectedSpot.images" 
                :key="index" 
                :src="img" 
                :alt="selectedSpot.label"
                class="modal-image"
                @click="openLightbox(selectedSpot.images, index)"
              />
            </div>
            <div v-else class="modal-placeholder">
              <p class="theme-text-muted">Bilder folgen bald...</p>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Lightbox (vue-easy-lightbox) -->
      <VueEasyLightbox
        :visible="lightboxVisible"
        :imgs="lightboxImages"
        :index="lightboxIndex"
        @hide="closeLightbox"
        teleport="body"
        scroll-disabled
        move-disabled
        rotate-disabled
        loop
      />
    </div>
  </MainLayout>
</template>

<style scoped>
.request-page {
  min-height: 100vh;
  background: transparent; /* Changed to transparent so MainLayout background shines through */
  color: #000;
  position: relative;
  z-index: 1;
}

.rings-bg {
  position: absolute;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: -1;
  overflow: visible;
}

.top-rings {
  top: 0;
}

.bottom-rings {
  bottom: 0;
}

.ring {
  position: absolute;
  border-radius: 50%;
  width: calc(var(--i) * 200px);
  height: calc(var(--i) * 200px);
  top: calc(var(--i) * -100px);
  left: calc(var(--i) * -100px);

  background: transparent;
  border: 3px solid var(--color);
  opacity: max(0.1, calc(0.35 - (var(--i) - 1) * 0.002));
  box-shadow: 0 0 8px color-mix(in srgb, var(--color) 50%, transparent), 0 0 16px color-mix(in srgb, var(--color) 20%, transparent);
}

/* Hero Section */
.hero-section {
  padding: 3rem 2rem 4rem;
  text-align: center;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

/* Force text colors to overcome global !important values */
.request-page ::selection,
.modal-overlay ::selection {
  background: rgba(43, 44, 119, 0.4); /* Blue tone matching ring color #2b2c77 */
  color: #000;
}

.request-page p,
.request-page span,
.request-page div,
.request-page h1,
.request-page h2,
.request-page h3,
.request-page strong,
.request-page label,
.request-page legend {
  color: #000 !important;
}

.request-page .theme-text-secondary,
.request-page .theme-text-secondary p,
.request-page .theme-text-muted {
  color: rgba(0, 0, 0, 0.65) !important;
}

.page-title {
  font-size: clamp(2.1rem, 5.2vw, 3.4rem);
  margin-bottom: 1rem;
  font-weight: 300;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: var(--font-primary);
  white-space: nowrap;
}

.page-subtitle {
  font-family: var(--font-secondary);
  font-size: 1.25rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.6;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.85;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.intro-text p {
  margin: 0;
}

.text-link {
  color: #FF9d66 !important;
  text-decoration: none;
  border-bottom: 1px dotted rgba(255, 157, 102, 0.5);
  transition: all 0.3s ease;
}

.text-link:hover {
  border-bottom-color: #FF9d66;
  color: #fff !important;
}

/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Section Titles */
.section-title {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 300;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #000 !important;
}

.section-subtitle {
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0.7;
}

/* Floorplan Section */
.floorplan-section {
  padding: 4rem 0;
}

.rooms-loading {
  text-align: center;
  padding: 4rem;
  color: rgba(0, 0, 0, 0.4) !important;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}

.floorplan-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
}

.sketch-wrapper {
  position: relative;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.sketch-landscape {
  flex: 1.65;
  max-width: 770px;
  min-width: 300px;
}

.sketch-portrait {
  flex: 1;
  max-width: 335px;
  min-width: 225px;
}

.sketch-image {
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(30%) brightness(0.9);
  transition: filter 0.3s ease;
}

.sketch-wrapper:hover .sketch-image {
  filter: grayscale(0%) brightness(1);
}

/* Hotspots */
.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
}

.hotspot-dot {
  display: block;
  width: 14px;
  height: 14px;
  background: #FF9d66;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 157, 102, 0.7);
  transition: all 0.3s ease;
  position: relative;
  animation: dot-pulse 2s ease-in-out infinite;
}

/* Expanding ring */
.hotspot-dot::before,
.hotspot-dot::after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(1);
  background: rgba(255, 157, 102, 0.4);
  animation: ripple 2s ease-out infinite;
  pointer-events: none;
}

.hotspot-dot::after {
  animation-delay: 0.7s;
}

.hotspot:hover .hotspot-dot {
  transform: scale(1.4);
  box-shadow: 0 0 20px rgba(255, 157, 102, 1);
}

.hotspot:hover .hotspot-dot::before,
.hotspot:hover .hotspot-dot::after {
  animation-play-state: paused;
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.15); }
}

@keyframes ripple {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
}

/* Form Section */
.form-section {
  padding: 6rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.form-container {
  max-width: 860px;
}

/* Success State */
.form-success {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 157, 102, 0.25);
  border-radius: 4px;
}

.success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  border: 2px solid #FF9d66;
  color: #FF9d66;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-success h3 {
  font-size: 1.4rem;
  font-weight: 300;
  letter-spacing: 0.06em;
  margin-bottom: 0.75rem;
}

/* Form */
.request-form {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.form-fieldset {
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  padding: 2rem 1.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.form-legend {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #FF9d66;
  padding: 0 0.75rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.65) !important;
}

.form-input {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  color: #000 !important;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  outline: none;
  width: 100%;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.form-input::placeholder {
  color: rgba(0, 0, 0, 0.4) !important;
}

.form-input:focus {
  border-color: rgba(255, 157, 102, 0.5);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 2px rgba(255, 157, 102, 0.2);
}

.form-input.has-error {
  border-color: #e74c3c;
}

.form-input-sm {
  padding: 0.55rem 0.75rem;
  font-size: 0.9rem;
}

.form-textarea {
  resize: none;
  min-height: 120px;
}

.form-error {
  font-size: 0.7rem;
  color: #e74c3c !important;
  letter-spacing: 0.02em;
}

/* Toggle / checkbox inline */
.form-group-flex {
  flex-direction: column;
  gap: 0.6rem;
  justify-content: flex-start;
}

.form-toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.85) !important;
}

.form-toggle input[type="checkbox"] {
  accent-color: #FF9d66;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.toggle-label {
  letter-spacing: 0.02em;
}

.inline-time {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-width: 180px;
}

.alt-date-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 0.25rem;
}

.alt-date-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* Room chips */
.rooms-group {
  margin-top: 1.25rem;
}

.rooms-choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.25rem;
}

.room-chip {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.85) !important;
  padding: 0.6rem 1.1rem;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.room-chip:hover {
  border-color: rgba(255, 157, 102, 0.4);
  background: rgba(255, 255, 255, 0.9);
}

.room-chip.active {
  border-color: #FF9d66;
  background: rgba(255, 157, 102, 0.15);
  color: #000 !important;
  box-shadow: inset 0 0 0 1px #FF9d66;
}

.room-chip-cap {
  font-size: 0.65rem;
  color: rgba(0, 0, 0, 0.5) !important;
  letter-spacing: 0.02em;
}

/* DJ Quelle Buttons */
.dj-quelle-group {
  margin-top: 1.25rem;
}

.dj-quelle-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
}

.dj-quelle-btn {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.85) !important;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.dj-quelle-btn:hover {
  border-color: rgba(255, 157, 102, 0.4);
  background: rgba(255, 255, 255, 0.9);
}

.dj-quelle-btn.active {
  border-color: #FF9d66;
  background: rgba(255, 157, 102, 0.15);
  color: #000 !important;
  box-shadow: inset 0 0 0 1px #FF9d66;
}

/* Consent */
.consent-group {
  gap: 0.5rem;
}

.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.form-checkbox input[type="checkbox"] {
  accent-color: #FF9d66;
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.75) !important;
  line-height: 1.5;
}

.checkbox-text a {
  color: #FF9d66 !important;
  text-decoration: underline;
}

/* Buttons */
.form-actions {
  display: flex;
  justify-content: center;
}

.form-btn {
  font-family: inherit;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1rem 2.5rem;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-btn-primary {
  background: rgba(255, 157, 102, 0.15);
  border-color: rgba(255, 157, 102, 0.5);
  color: #FF9d66 !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.form-btn-primary:hover {
  background: rgba(255, 157, 102, 0.25);
  border-color: #FF9d66 !important;
  box-shadow: 0 4px 12px rgba(255, 157, 102, 0.2);
}

.form-btn-secondary {
  background: transparent;
  border-color: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.8) !important;
  margin-top: 1.5rem;
}

.form-btn-secondary:hover {
  border-color: rgba(0, 0, 0, 0.5);
  color: #000 !important;
}

/* Date/time input colour fixes (dark theme) */
.form-input[type="date"],
.form-input[type="time"] {
  color-scheme: light;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4); /* Weicheres Overlay für den weißen Hintergrund */
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.modal-content {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  border-radius: 4px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 3rem;
  position: relative;
  color: #000 !important;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #000 !important;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  line-height: 1;
}

.modal-close:hover {
  opacity: 1;
}

.description-container {
  margin-bottom: 2rem;
}

.modal-description {
  color: rgba(0, 0, 0, 0.7) !important;
  line-height: 1.6;
  white-space: pre-line;
}

.modal-description.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-btn {
  background: none;
  border: none;
  color: #FF9d66 !important;
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  text-decoration: underline;
  opacity: 0.9;
}

.read-more-btn:hover {
  opacity: 1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
  text-transform: uppercase;
  color: #000 !important;
}

/* Room Details */
.room-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.detail-row {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item.features {
  gap: 0.75rem;
}

.detail-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FF9d66 !important;
  font-weight: 600;
}

.detail-value {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.9) !important;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  padding: 0.4rem 0.9rem;
  background: rgba(255, 157, 102, 0.1);
  border: 1px solid rgba(255, 157, 102, 0.4);
  color: #000 !important;
  font-size: 0.8rem;
  border-radius: 3px;
  letter-spacing: 0.02em;
}

.extra-text {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.5) !important;
  font-style: italic;
  text-align: center;
}

.modal-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.modal-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(255, 157, 102, 0.3);
}

/* vue-easy-lightbox z-index fix */
:deep(.vel-modal) {
  z-index: 99999 !important;
}

.modal-placeholder {
  padding: 3rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.02);
  border: 1px dashed rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.5) !important;
}

/* Mobile */
@media (max-width: 768px) {
  .floorplan-container {
    flex-direction: column;
    align-items: center;
  }
  
  .sketch-landscape,
  .sketch-portrait {
    max-width: 100%;
    width: 100%;
  }
  
  .hotspot-dot {
    width: 16px;
    height: 16px;
  }
  
  /* Form mobile */
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-fieldset {
    padding: 1.5rem 1rem 1rem;
  }

  .alt-date-row {
    flex-direction: column;
  }

  .room-chip {
    flex: 1 1 calc(50% - 0.6rem);
    min-width: 120px;
  }

  .dj-quelle-buttons {
    flex-direction: column;
  }

  .dj-quelle-btn {
    width: 100%;
  }
}
</style>