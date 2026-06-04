<template>
  <section id="events-preview" class="content-section theme-section-bg events-preview-section">
    <!-- Decorative Beach Vibe Background -->
    <div class="beach-background" aria-hidden="true">
      <!-- Warm sun glow -->
      <div class="beach-sun"></div>

      <!-- Layered ocean waves -->
      <svg class="beach-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path class="wave wave--back" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,224C672,224,768,192,864,186.7C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,320L0,320Z" />
        <path class="wave wave--mid" d="M0,256L48,250.7C96,245,192,235,288,229.3C384,224,480,224,576,234.7C672,245,768,267,864,266.7C960,267,1056,245,1152,240C1248,235,1344,245,1392,250.7L1440,256L1440,320L0,320Z" />
        <path class="wave wave--front" d="M0,288L48,282.7C96,277,192,267,288,272C384,277,480,299,576,298.7C672,299,768,277,864,277.3C960,277,1056,299,1152,298.7C1248,299,1344,277,1392,266.7L1440,256L1440,320L0,320Z" />
      </svg>
    </div>
    
    <div class="container">
      <h2 class="section-title theme-text-primary">Demnächst</h2>
      <p class="section-subtitle theme-text-secondary">Diese Events stehen bald an</p>
      
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
                @error="$event.target.src = '/images/placeholders/Ocean_Bar_Icon.png'"
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
                    @click="trackClick('link', event._id)"
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
import useApi from '../../composables/useApi.js'
import { useImageUrl } from '../../composables/useImageUrl.js'
import { trackClick } from '~/utils/tracking'

const router = useRouter()
const api = useApi()
const { getImageUrl } = useImageUrl()
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
  return imagePath ? getImageUrl(imagePath) : '/images/placeholders/Ocean_Bar_Icon.png'
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

/* Decorative Beach Vibe Background */
.beach-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    linear-gradient(180deg,
      rgba(135, 206, 224, 0.18) 0%,
      rgba(174, 222, 233, 0.12) 35%,
      rgba(251, 241, 221, 0) 70%);
}

/* Warm sun glow in the top corner */
.beach-sun {
  position: absolute;
  top: -120px;
  right: -80px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle at center,
    rgba(255, 201, 77, 0.45) 0%,
    rgba(255, 173, 90, 0.25) 35%,
    rgba(255, 173, 90, 0) 70%);
  filter: blur(8px);
  animation: beach-sun-pulse 8s ease-in-out infinite;
}

@keyframes beach-sun-pulse {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.08); opacity: 1; }
}

/* Layered ocean waves at the bottom */
.beach-waves {
  position: absolute;
  bottom: -1px;
  left: -5%;
  width: 110%;
  height: 38%;
  min-height: 160px;
}

.wave {
  transform-origin: center;
}

.wave--back {
  fill: rgba(90, 155, 148, 0.22);
  animation: beach-wave-drift 12s ease-in-out infinite alternate;
}

.wave--mid {
  fill: rgba(45, 95, 93, 0.20);
  animation: beach-wave-drift 9s ease-in-out infinite alternate-reverse;
}

.wave--front {
  fill: rgba(135, 206, 224, 0.30);
  animation: beach-wave-drift 7s ease-in-out infinite alternate;
}

@keyframes beach-wave-drift {
  0% { transform: translateX(-2%); }
  100% { transform: translateX(2%); }
}

@media (prefers-reduced-motion: reduce) {
  .beach-sun,
  .wave {
    animation: none;
  }
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
  color: #ffffff !important;
  line-height: 1;
}

.event-date-badge .month {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8) !important;
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
