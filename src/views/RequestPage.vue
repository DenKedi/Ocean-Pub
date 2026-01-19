<script setup>
import { ref } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import sketch1 from '@/assets/raumplan/sketch1.png'
import sketch2 from '@/assets/raumplan/sketch2.png'

// Import images from each room folder using import.meta.glob
const barImages = import.meta.glob('@/assets/pictures/raum/bar/*', { eager: true, import: 'default' })
const djImages = import.meta.glob('@/assets/pictures/raum/dj/*', { eager: true, import: 'default' })
const tresorImages = import.meta.glob('@/assets/pictures/raum/tresor/*', { eager: true, import: 'default' })
const bar5Images = import.meta.glob('@/assets/pictures/raum/bar5/*', { eager: true, import: 'default' })
const orangerieImages = import.meta.glob('@/assets/pictures/raum/orangerie/*', { eager: true, import: 'default' })

// Convert glob objects to arrays of image URLs
const getImagesArray = (globObj) => Object.values(globObj).filter(img => img)

// Modal state
const isModalOpen = ref(false)
const selectedSpot = ref(null)

// Hotspots for sketch1 (landscape - left side of bar)
// Positions are in percentages (x%, y%) relative to the image
const hotspotsSketch1 = ref([
  { 
    id: 1, 
    x: 40, 
    y: 87, 
    label: 'Bar', 
    images: getImagesArray(barImages), 
    description: 'Die Hauptbar von Pallas',
    features: ['Musik', 'Bar', 'Kultur', 'Essen', 'Live DJ', 'Live Musik', 'Sitzplätze (ca. 100)'],
    capacity: '300 Personen',
    area: '170 qm',
    extraText: null
  },
  { 
    id: 2, 
    x: 82, 
    y: 78, 
    label: 'DJ Booth', 
    images: getImagesArray(djImages), 
    description: 'DJ Bereich',
    features: ['DJ', 'Musik', 'Sound', 'Licht'],
    capacity: null,
    area: '9 qm',
    extraText: null
  },
])

// Hotspots for sketch2 (portrait - right side of bar)
const hotspotsSketch2 = ref([
  { 
    id: 2, 
    x: 57, 
    y: 35, 
    label: 'Tresor', 
    images: getImagesArray(tresorImages), 
    description: 'Exklusiver Raum für besondere Events',
    features: ['Drinks', 'Food', 'Musik', 'Barkeeper (Drinks Show)', 'Tastings'],
    capacity: '8-20 Personen',
    area: '20 qm',
    extraText: null
  },
  { 
    id: 3, 
    x: 21.5, 
    y: 57.5, 
    label: 'Bar 5', 
    images: getImagesArray(bar5Images), 
    description: 'Privater Barbereich',
    features: ['Barkeeper', 'Cocktails', 'Musik', 'Exklusiv mietbar'],
    capacity: '10-30 Personen',
    area: '30 qm',
    extraText: null
  },
  { 
    id: 4, 
    x: 60, 
    y: 90, 
    label: 'Orangerie', 
    images: getImagesArray(orangerieImages), 
    description: 'Vielseitiger Veranstaltungsraum',
    features: ['Listening', 'Food', 'Bar', 'Bühne', 'Kunst', 'Kultur', 'Meetingraum'],
    capacity: '40 Sitzplätze',
    area: '46 qm',
    extraText: 'Kombination mit Bar 5 und Tresor möglich'
  },
])

const openSpotModal = (spot) => {
  selectedSpot.value = spot
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedSpot.value = null
  closeLightbox()
}

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
</script>

<template>
  <MainLayout>
    <div class="request-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <h1 class="page-title theme-text-primary">Pallas.Request</h1>
          <p class="page-subtitle theme-text-secondary">Erkunde unsere Location</p>
        </div>
      </section>

      <!-- Interactive Floor Plan Section -->
      <section class="floorplan-section">
        <div class="container">
          <h2 class="section-title">Raumplan</h2>
          <p class="section-subtitle theme-text-secondary">Klicke auf die Punkte, um mehr über die Bereiche zu erfahren</p>
          
          <div class="floorplan-container">
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
                <span class="hotspot-label">{{ spot.label }}</span>
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
                <span class="hotspot-label">{{ spot.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section">
        <div class="container">
          <h2 class="section-title">Anfrage senden</h2>
          <p class="section-subtitle theme-text-secondary">
            Interesse an einem Event bei uns? Schreib uns!
          </p>
          <a href="mailto:info@pallas.world" class="contact-button">
            info@pallas.world
          </a>
        </div>
      </section>

      <!-- Modal -->
      <Teleport to="body">
        <div v-if="isModalOpen && !lightboxVisible" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <button class="modal-close" @click="closeModal">×</button>
            <h3 class="modal-title">{{ selectedSpot?.label }}</h3>
            <p class="modal-description">{{ selectedSpot?.description }}</p>
            
            <!-- Room Details -->
            <div class="room-details">
              <div v-if="selectedSpot?.capacity" class="detail-item">
                <span class="detail-label">Kapazität:</span>
                <span class="detail-value">{{ selectedSpot.capacity }}</span>
              </div>
              
              <div v-if="selectedSpot?.area" class="detail-item">
                <span class="detail-label">Fläche:</span>
                <span class="detail-value">{{ selectedSpot.area }}</span>
              </div>
              
              <div v-if="selectedSpot?.features?.length > 0" class="detail-item features">
                <span class="detail-label">Features:</span>
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
            
            <div v-if="selectedSpot?.extraText" class="extra-text">
              {{ selectedSpot.extraText }}
            </div>
            
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
  background: #000;
}

/* Hero Section */
.hero-section {
  padding: 8rem 2rem 4rem;
  text-align: center;
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: var(--font-primary);
}

.page-subtitle {
  font-family: var(--font-secondary);
  font-size: 1.25rem;
  opacity: 0.8;
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

.floorplan-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
}

.sketch-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  width: 20px;
  height: 20px;
  background: #FF9d66;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(255, 157, 102, 0.6);
  transition: all 0.3s ease;
  animation: pulse 2s ease-in-out infinite;
}

.hotspot:hover .hotspot-dot {
  transform: scale(1.3);
  box-shadow: 0 0 25px rgba(255, 157, 102, 0.9);
}

.hotspot-label {
  position: absolute;
  left: 50%;
  top: calc(100% + 8px);
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border-radius: 3px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.hotspot:hover .hotspot-label {
  opacity: 1;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 157, 102, 0.6);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 157, 102, 0.9), 0 0 40px rgba(255, 157, 102, 0.3);
  }
}

/* Contact Section */
.contact-section {
  padding: 6rem 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: transparent;
  border: 1px solid rgba(255, 157, 102, 0.5);
  color: #FF9d66 !important;
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-button:hover {
  background: rgba(255, 157, 102, 0.1);
  border-color: #FF9d66;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
}

.modal-content {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  line-height: 1;
}

.modal-close:hover {
  opacity: 1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.modal-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

/* Room Details */
.room-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  color: #FF9d66;
  font-weight: 600;
}

.detail-value {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  padding: 0.4rem 0.9rem;
  background: rgba(255, 157, 102, 0.15);
  border: 1px solid rgba(255, 157, 102, 0.3);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  border-radius: 3px;
  letter-spacing: 0.02em;
}

.extra-text {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
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
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 4px;
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
  
  .hotspot-label {
    font-size: 0.65rem;
  }
}
</style>