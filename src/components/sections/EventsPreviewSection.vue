<template>
  <section id="events-preview" class="content-section theme-section-bg events-preview-section">
    <!-- Decorative Tile Grid Background -->
    <div class="tile-grid-background">
      <div class="tile" data-size="large" data-color="teal"></div>
      <div class="tile" data-size="medium" data-color="orange"></div>
      <div class="tile" data-size="small" data-color="gold"></div>
      <div class="tile" data-size="large" data-color="black"></div>
      <div class="tile" data-size="medium" data-color="rust"></div>
      <div class="tile" data-size="small" data-color="teal-light"></div>
      <div class="tile" data-size="medium" data-color="gold-dark"></div>
      <div class="tile" data-size="large" data-color="orange-bright"></div>
      <div class="tile" data-size="small" data-color="black"></div>
      <div class="tile" data-size="medium" data-color="teal"></div>
      <div class="tile" data-size="large" data-color="rust"></div>
      <div class="tile" data-size="small" data-color="gold"></div>
      <div class="tile" data-size="medium" data-color="orange"></div>
      <div class="tile" data-size="large" data-color="teal-light"></div>
      <div class="tile" data-size="small" data-color="orange-bright"></div>
      <div class="tile" data-size="medium" data-color="black"></div>
      <div class="tile" data-size="large" data-color="gold-dark"></div>
      <div class="tile" data-size="small" data-color="rust"></div>
      <div class="tile" data-size="medium" data-color="teal"></div>
      <div class="tile" data-size="large" data-color="orange"></div>
    </div>
    
    <div class="container">
      <h2 class="section-title theme-text-primary">Demnächst</h2>
      <p class="section-subtitle theme-text-secondary">Folgende Events haben wir für dich in der Pipeline</p>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p class="theme-text-secondary">Events werden geladen...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="hasError" class="empty-state theme-container-bg">
        <div class="empty-icon">⚠️</div>
        <h3 class="empty-title theme-text-primary">Events können nicht geladen werden</h3>
        <p class="empty-text theme-text-secondary">
          Aktuell können leider keine Events geladen werden. Schau auch auf Instagram, um auf dem Laufenden zu bleiben.
        </p>
        <a :href="instagramUrl" target="_blank" class="instagram-button theme-item-bg">
          <span class="instagram-icon">📸</span>
          Folge uns auf Instagram
        </a>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="upcomingEvents.length === 0" class="empty-state theme-container-bg">
        <div class="empty-icon">📅</div>
        <h3 class="empty-title theme-text-primary">Keine Events geplant</h3>
        <p class="empty-text theme-text-secondary">
          Aktuell sind keine Events geplant. Schau bald wieder vorbei oder folge uns auf Instagram für Updates!
        </p>
        <a :href="instagramUrl" target="_blank" class="instagram-button theme-item-bg">
          <span class="instagram-icon">📸</span>
          Folge uns auf Instagram
        </a>
      </div>
      
      <!-- Events Grid -->
      <div v-else>
        <div class="events-grid">
          <div v-for="event in upcomingEvents" :key="event._id" class="event-card theme-container-bg">
            <div class="event-image">
              <img 
                :src="getEventImageUrl(event)" 
                :alt="event.title" 
                @error="$event.target.src = '/images/placeholders/event_default_bw.webp'"
              />
            </div>
            <div class="event-content">
              <div class="event-header">
                <div class="event-title-group">
                  <h3 class="event-title theme-text-primary">{{ event.title }}</h3>
                  <span v-if="event.category" class="category-badge" :style="{ borderColor: event.category.color || 'rgba(255,255,255,0.3)' }">
                    {{ event.category.name }}
                  </span>
                </div>
                <div class="event-date-badge">
                  <span class="day">{{ formatDate(event.startTime).day }}</span>
                  <span class="month">{{ formatDate(event.startTime).month }}</span>
                </div>
              </div>
              <p class="event-description theme-text-secondary">{{ getPreviewDescription(event.description) }}</p>
              <div class="event-footer">
                <div class="event-meta theme-text-muted">
                  <span class="event-time">{{ formatTime(event.startTime) }}</span>
                </div>
                <div class="event-actions">
                  <span class="event-price theme-text-primary">{{ formatPrice(event.price) }}</span>
                  <a
                    v-if="event.link_url && event.link_text"
                    :href="event.link_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="event-link-btn theme-item-bg"
                    @click="trackClick('ticket', event._id)"
                  >{{ truncateText(event.link_text) }}</a>
                  <button @click="goToEventDetails(event._id)" class="event-button theme-item-bg theme-text-primary">
                    Mehr Infos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="view-all-section">
          <button @click="goToEvents" class="view-all-button cta-button primary">
            Alle Events ansehen
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/api'
import { getImageUrl } from '@/utils/imageUrl'
import { trackClick } from '@/utils/tracking'

const router = useRouter()
const upcomingEvents = ref([])
const isLoading = ref(true)
const hasError = ref(false)
const instagramUrl = 'https://www.instagram.com/pallas_world/'

// Fetch events from API
const fetchEvents = async () => {
  try {
    isLoading.value = true
    hasError.value = false
    const response = await api.get('/events')
    
    // Backend gibt Events in response.data.data zurück
    const events = response.data.data || []
    
    // Filter nur zukünftige Events und sortiere nach Datum
    const now = new Date()
    upcomingEvents.value = events
      .filter(event => new Date(event.startTime) >= now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 3) // Nur die nächsten 3 Events
    
  } catch (error) {
    console.error('Error fetching events:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

// Get proper image URL
const getEventImageUrl = (event) => {
  const imagePath = event.eventImageUrl || event.category?.defaultImageUrl
  return imagePath ? getImageUrl(imagePath) : '/images/placeholders/event_default_bw.webp'
}

// Get description up to first line break
const getPreviewDescription = (description) => {
  if (!description) return 'Mehr Informationen folgen bald!'
  const firstLineBreak = description.indexOf('\n')
  if (firstLineBreak === -1) return description
  return description.substring(0, firstLineBreak)
}

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('de-DE', { month: 'short' }).toUpperCase()
  return { day, month }
}

// Format time for display
const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'
}

// Format price for display
const formatPrice = (price) => {
  if (!price || price === 0) return 'Eintritt frei'
  return `${price}€`
}

// Truncate text to max characters
const truncateText = (text, maxChars = 15) => {
  if (!text) return ''
  return text.length > maxChars ? text.substring(0, maxChars) + '…' : text
}

const goToEvents = () => {
  trackClick('alle_events')
  router.push('/events')
}

const goToEventDetails = (eventId) => {
  trackClick('mehr_infos', eventId)
  router.push(`/events#event-${eventId}`)
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.content-section {
  padding: 8rem 0;
  border-top: 1px solid var(--theme-border);
  border-bottom: 1px solid var(--theme-border);
  position: relative;
  overflow: hidden;
}

.events-preview-section.theme-section-bg {
  background: var(--theme-sectionBg) !important;
}

/* Decorative Tile Grid Background */
.tile-grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  grid-auto-rows: 80px;
  gap: 0;
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
}

.tile {
  position: relative;
  transition: all 0.3s ease;
}

/* Tile Sizes */
.tile[data-size="small"] {
  grid-column: span 1;
  grid-row: span 1;
}

.tile[data-size="medium"] {
  grid-column: span 2;
  grid-row: span 1;
}

.tile[data-size="large"] {
  grid-column: span 2;
  grid-row: span 2;
}

/* Tile Colors - inspired by the image */
.tile[data-color="teal"] {
  background: linear-gradient(135deg, #2d5f5d 0%, #1a3f3d 100%);
}

.tile[data-color="teal-light"] {
  background: linear-gradient(135deg, #5a9b94 0%, #3d7a74 100%);
}

.tile[data-color="orange"] {
  background: linear-gradient(135deg, #d97742 0%, #b85a2f 100%);
}

.tile[data-color="orange-bright"] {
  background: linear-gradient(135deg, #ff8c42 0%, #e06f28 100%);
}

.tile[data-color="rust"] {
  background: linear-gradient(135deg, #8b4726 0%, #6d3318 100%);
}

.tile[data-color="gold"] {
  background: linear-gradient(135deg, #c9a961 0%, #a88b47 100%);
}

.tile[data-color="gold-dark"] {
  background: linear-gradient(135deg, #8b7355 0%, #6d5838 100%);
}

.tile[data-color="black"] {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
}

/* Add subtle pattern overlay */
.tile::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.05) 2px,
    rgba(0, 0, 0, 0.05) 4px
  );
  opacity: 0.3;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 4rem;
  opacity: 0.9;
}

.events-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.event-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 150px;
}

.event-image {
  position: relative;
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: var(--theme-borderRadius);
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: grayscale(20%) contrast(1.1);
  transition: all 0.5s ease;
}

.event-image img[src*="event_default_bw"] {
  filter: grayscale(100%);
}

.event-card:hover .event-image img:not([src*="event_default_bw"]) {
  filter: grayscale(0%) contrast(1.05);
  transform: scale(1.05);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.event-title-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-title {
  font-size: 1.3rem;
  margin-bottom: 0;
  font-weight: 500;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  border: 1.5px solid;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
  align-self: flex-start;
  opacity: 0.9;
}

.event-date-badge {
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.35rem 0.65rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.event-date-badge .day {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.event-date-badge .month {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.05em;
  margin-top: 0.2rem;
}

.event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
}

.event-description {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  opacity: 0.9;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.event-meta {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.event-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.event-price {
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
}

.event-button {
  align-self: flex-start;
  padding: 0.6rem 1.25rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.event-button:hover {
  transform: translateY(-2px);
}

.event-link-btn {
  align-self: flex-start;
  padding: 0.6rem 1.25rem;
  border: 1px solid rgba(255, 157, 102, 0.5);
  color: #FF9d66;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: all 0.3s ease;
}

.event-link-btn:hover {
  background: rgba(255, 157, 102, 0.12);
  border-color: #FF9d66;
  transform: translateY(-2px);
}

.view-all-section {
  text-align: center;
}

.view-all-button {
  padding: 1rem 3rem;
  font-size: 1rem;
  border: 1px solid var(--theme-border);
  background: transparent;
  color: var(--theme-textPrimary);
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.view-all-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.1);
  border-color: var(--theme-borderHover);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1.5rem;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.empty-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.instagram-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-decoration: none;
  color: var(--theme-textPrimary);
}

.instagram-button:hover {
  transform: translateY(-3px);
}

.instagram-icon {
  font-size: 1.5rem;
}

/* Mobile Optimization */
@media (max-width: 767px) {
  .content-section {
    padding: 4rem 0;
  }
  
  .events-grid {
    gap: 1rem;
  }
  
  .section-subtitle {
    margin-bottom: 2rem;
  }
  
  .event-card {
    flex-direction: column;
    padding: 1rem;
  }
  
  .event-image {
    width: 100%;
    /* Fix: Squared image on mobile */
    height: auto;
    aspect-ratio: 1/1; 
  }
  
  .event-button {
    width: 100%;
  }
}
</style>
