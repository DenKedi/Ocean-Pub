<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import api from '../utils/api'
import { getImageUrl } from '../utils/imageUrl'
import bgImage from '@/assets/pictures/decke5.webp'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// State
const events = ref([])
const categories = ref([])
const loading = ref(true)
const error = ref(null)
const selectedCategory = ref(null)
const viewMode = ref('grid') // 'grid' or 'list'

// Fetch events from API
const fetchEvents = async () => {
  loading.value = true
  error.value = null
  try {
    const params = {}
    if (selectedCategory.value) {
      params.category = selectedCategory.value
    }
    // Nur zukünftige Events
    params.startDate = new Date().toISOString()
    
    const response = await api.get('/events', { params })
    events.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching events:', err)
    error.value = 'Events konnten nicht geladen werden'
  } finally {
    loading.value = false
  }
}

// Fetch categories for filter
const fetchCategories = async () => {
  try {
    const response = await api.get('/categories')
    categories.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Format time
const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  }) + ' Uhr'
}

// Format time range
const formatTimeRange = (startTime, endTime) => {
  const start = formatTime(startTime)
  if (!endTime) return start
  const end = new Date(endTime).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  })
  return `${start} - ${end} Uhr`
}

// Format price
const formatPrice = (price) => {
  if (!price || price === 0) return 'Eintritt frei'
  return `${price}€`
}

// Truncate text to max characters
const truncateText = (text, maxChars = 15) => {
  if (!text) return ''
  return text.length > maxChars ? text.substring(0, maxChars) + '…' : text
}

// Get image URL with fallback
const getEventImageUrl = (event) => {
  const imagePath = event.eventImageUrl || event.category?.defaultImageUrl
  return imagePath ? getImageUrl(imagePath) : '/images/placeholders/event_default_bw.webp'
}

// Format rooms
const formatRooms = (rooms) => {
  if (!rooms || rooms.length === 0) return ''
  return rooms.join(' & ')
}

// Filter by category
const filterByCategory = (categoryId) => {
  selectedCategory.value = categoryId === selectedCategory.value ? null : categoryId
  fetchEvents()
}

// Group events by date
const eventsByDate = computed(() => {
  const grouped = {}
  events.value.forEach(event => {
    const dateKey = new Date(event.startTime).toLocaleDateString('de-DE')
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        dateLabel: formatDate(event.startTime),
        events: []
      }
    }
    grouped[dateKey].events.push(event)
  })
  return Object.values(grouped)
})

// Parallax refs
const eventsPage = ref(null)
const backgroundLayer = ref(null)
let scrollTrigger = null

// Initialize parallax
const initParallax = () => {
  if (scrollTrigger) scrollTrigger.kill()
  
  // Set initial position as requested
  // Using fromTo to ensure animation works starting from -20
  if (backgroundLayer.value && eventsPage.value) {
    scrollTrigger = gsap.fromTo(backgroundLayer.value, 
      { yPercent: -20 }, // Start position
      {
        yPercent: -40,   // Move further up to create parallax effect
        ease: 'none',
        scrollTrigger: {
          trigger: eventsPage.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      }
    ).scrollTrigger
  }
}

onMounted(() => {
  fetchCategories()
  fetchEvents().then(() => {
    nextTick(() => {
      initParallax()
    })
  })
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<template>
  <MainLayout>
    <div ref="eventsPage" class="events-page">
      <!-- Parallax Background -->
      <div ref="backgroundLayer" class="background-layer">
        <img :src="bgImage" alt="" class="parallax-bg-image" fetchpriority="high" />
      </div>
      
      <!-- Hero Header -->
      <section class="page-hero">
        <div class="container">
          <h1 class="page-title pallas-heading">Pallas.Events</h1>
          <p class="page-subtitle theme-text-secondary">Unser Programm für dich</p>
        </div>
      </section>

      <!-- Filter Section -->
      <section class="filter-section">
        <div class="container">
          <div class="filter-bar">
            <!-- Category Filter -->
            <div class="category-filters">
              <button 
                class="filter-btn"
                :class="{ active: !selectedCategory }"
                @click="filterByCategory(null)"
              >
                Alle
              </button>
              <button 
                v-for="cat in categories" 
                :key="cat._id"
                class="filter-btn"
                :class="{ active: selectedCategory === cat._id }"
                :style="{ '--cat-color': cat.color }"
                @click="filterByCategory(cat._id)"
              >
                {{ cat.name }}
              </button>
            </div>

            <!-- View Toggle -->
            <div class="view-toggle">
              <button 
                class="toggle-btn" 
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
                title="Grid-Ansicht"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button 
                class="toggle-btn" 
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
                title="Listen-Ansicht"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Request CTA -->
      <section class="request-cta">
        <div class="container">
          <div class="cta-content">
            <p class="cta-text">Du möchtest bei uns veranstalten? Jetzt Anfragen unter</p>
            <router-link to="/request" class="cta-button">
              Pallas.Request
            </router-link>
          </div>
        </div>
      </section>

      <!-- Events Content -->
      <section class="events-content">
        <div class="container">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Events werden geladen...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button class="retry-btn" @click="fetchEvents">Erneut versuchen</button>
          </div>

          <!-- Empty State -->
          <div v-else-if="events.length === 0" class="empty-state">
            <p>Keine kommenden Events gefunden</p>
          </div>

          <!-- Grid View -->
          <div v-else-if="viewMode === 'grid'" class="events-grid">
            <article 
              v-for="event in events" 
              :key="event._id" 
              class="event-card theme-container-bg"
            >
              <!-- Event Image (Square) -->
              <div class="event-image-container">
                <img 
                  :src="getEventImageUrl(event)" 
                  :alt="event.title"
                  class="event-image"
                  loading="lazy"
                  @error="$event.target.src = '/images/placeholders/event_default_bw.webp'"
                />
                <div 
                  v-if="event.category" 
                  class="event-category-badge"
                  :style="{ backgroundColor: event.category.color }"
                >
                  {{ event.category.name }}
                </div>
                <div v-if="event.extra_label" class="event-extra-label">
                  {{ event.extra_label }}
                </div>
              </div>

              <!-- Event Details -->
              <div class="event-details">
                <h3 class="event-title">{{ event.title }}</h3>
                
                <div class="event-meta">
                  <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{{ formatDate(event.startTime) }}</span>
                  </div>
                  
                  <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{{ formatTimeRange(event.startTime, event.endTime) }}</span>
                  </div>

                  <div v-if="event.room && event.room.length > 0" class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{{ formatRooms(event.room) }}</span>
                  </div>
                </div>

                <p v-if="event.description" class="event-description theme-text-secondary">
                  {{ event.description }}
                </p>

                <div class="event-footer">
                  <span class="event-price" :class="{ free: !event.price || event.price === 0 }">
                    {{ formatPrice(event.price) }}
                  </span>
                  <a
                    v-if="event.link_url && event.link_text"
                    :href="event.link_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="event-link-btn"
                  >{{ truncateText(event.link_text) }}</a>
                </div>
              </div>
            </article>
          </div>

          <!-- List View -->
          <div v-else class="events-list">
            <div v-for="dateGroup in eventsByDate" :key="dateGroup.dateLabel" class="date-group">
              <h3 class="date-header">{{ dateGroup.dateLabel }}</h3>
              
              <article 
                v-for="event in dateGroup.events" 
                :key="event._id" 
                class="event-list-item theme-container-bg"
              >
                <!-- Event Image (Square, smaller) -->
                <div class="list-image-container">
                  <img 
                    :src="getEventImageUrl(event)" 
                    :alt="event.title"
                    class="list-image"
                    loading="lazy"
                    @error="$event.target.src = '/images/placeholders/event_default_bw.webp'"
                  />
                </div>

                <!-- Event Info -->
                <div class="list-content">
                  <div class="list-header">
                    <h4 class="list-title">{{ event.title }}</h4>
                    <span 
                      v-if="event.category" 
                      class="list-category"
                      :style="{ color: event.category.color }"
                    >
                      {{ event.category.name }}
                    </span>
                  </div>
                  
                  <div class="list-meta">
                    <span class="list-time">{{ formatTimeRange(event.startTime, event.endTime) }}</span>
                    <span v-if="event.room && event.room.length > 0" class="list-room">
                      {{ formatRooms(event.room) }}
                    </span>
                  </div>

                  <p v-if="event.description" class="list-description theme-text-muted">
                    {{ event.description }}
                  </p>
                </div>

                <!-- Price -->
                <div class="list-price-container">
                  <span class="list-price" :class="{ free: !event.price || event.price === 0 }">
                    {{ formatPrice(event.price) }}
                  </span>
                  <span v-if="event.extra_label" class="list-extra">{{ event.extra_label }}</span>
                  <a
                    v-if="event.link_url && event.link_text"
                    :href="event.link_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="event-link-btn"
                  >{{ truncateText(event.link_text) }}</a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<style scoped>
/* PALLAS Accent Colors */
:root {
  --pallas-orange: #FF9d66;
  --pallas-orange-bright: #FFE4D6;
  --pallas-orange-dark: #E8B89E;
}

.events-page {
  min-height: 100vh;
  background: #000000;
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

/* Parallax background layer */
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0.5;
  z-index: 0;
  pointer-events: none;
  will-change: transform;
}

.parallax-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  pointer-events: none;
  will-change: transform;
}

.events-page > section {
  position: relative;
  z-index: 1;
}

/* Hero */
.page-hero {
  padding: 8rem 0 3rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.page-hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FF9d66, transparent);
}

.page-title {
  font-size: clamp(2.2rem, 5.2vw, 3.4rem);
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: #fff !important;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .page-title {
    letter-spacing: 0.04em;
    font-size: 2.1rem;
  }
}

.page-subtitle {
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5) !important;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Request CTA */
.request-cta {
  padding: 0.5rem 0;
  position: relative;
  z-index: 1;
}

.cta-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0;
}

.cta-text {
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.5) !important;
  margin: 0;
}

.cta-button {
  padding: 0.4rem 0.8rem;
  background: transparent;
  border: 1px solid rgba(255, 157, 102, 0.4);
  color: rgba(255, 157, 102, 0.8) !important;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cta-button:hover {
  border-color: #FF9d66;
  color: #FF9d66 !important;
}

/* Filter Section */
.filter-section {
  padding: 1.5rem 0;
  position: relative;
  z-index: 1;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.category-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0;
}

.filter-btn:hover {
  border-color: #FF9d66;
  color: #FF9d66;
}

.filter-btn.active {
  background: #FF9d66;
  border-color: #FF9d66;
  color: #000 !important;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  padding: 0.6rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-btn:hover {
  border-color: #FF9d66;
  color: #FF9d66;
}

.toggle-btn.active {
  background: #FF9d66;
  border-color: #FF9d66;
  color: #000 !important;
}

/* Events Content */
.events-content {
  padding: 4rem 0;
  position: relative;
  z-index: 1;
}

/* Loading, Error, Empty States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 6rem 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 2px solid var(--theme-border);
  border-top-color: var(--theme-textPrimary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.8rem 2rem;
  background: transparent;
  border: 1px solid var(--theme-border);
  color: var(--theme-textPrimary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Grid View */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.event-card {
  border-radius: 0;
  overflow: hidden;
  border: none;
  background: #111;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 0;
  background: #FF9d66;
  transition: height 0.4s ease;
  z-index: 2;
}

.event-card:hover::before {
  height: 100%;
}

.event-card:hover {
  box-shadow: 0 20px 40px rgba(226, 114, 75, 0.15);
}

.event-image-container {
  position: relative;
  width: 100%;
  padding-top: 100%; /* Square aspect ratio */
  overflow: hidden;
}

.event-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(20%) contrast(1.1);
  background-color: #1a1a1a;
}

.event-image[src*="event_default_bw"] {
  filter: grayscale(100%);
}

/* Deactivate hover effects for placeholders */
.event-card:hover .event-image[src*="event_default_bw"],
.event-image[src*="event_default_bw"]:hover {
    filter: grayscale(100%);
    transform: none;
}

.event-category-badge {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-radius: 0;
  background: #FF9d66 !important;
  color: #000 !important;
}

.event-extra-label {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  background: #FF9d66;
  color: #000 !important;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 0;
}

.event-details {
  padding: 1.25rem;
  background: #111;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.event-title {
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-clamp: 2; /* Added for standard line-clamp property */
  line-height: 1.3;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.02em;
}

.meta-item svg {
  opacity: 0.5;
  flex-shrink: 0;
  color: #FF9d66 !important;
}

.event-description {
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-wrap;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.event-price {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.event-price.free {
  color: #FF9d66 !important;
}

.event-link-btn {
  display: inline-block;
  padding: 0.45rem 1.1rem;
  border: 1px solid rgba(255, 157, 102, 0.5);
  color: #FF9d66;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.25s ease;
  border-radius: 2px;
}

.event-link-btn:hover {
  background: rgba(255, 157, 102, 0.12);
  border-color: #FF9d66;
}
.events-list {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.date-header {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #FF9d66;
  color: #FF9d66 !important;
  display: inline-block;
}

.event-list-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1.5rem;
  padding: 1.25rem;
  border-radius: 0;
  border: none;
  border-left: 3px solid transparent;
  background: #111;
  transition: all 0.3s ease;
  align-items: center;
}

.event-list-item:hover {
  border-left-color: #FF9d66;
  background: #1a1a1a;
}

.list-image-container {
  width: 100px;
  height: 125px;
  border-radius: 0;
  overflow: hidden;
  flex-shrink: 0;
}

.list-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(20%) contrast(1.1);
  transition: filter 0.3s ease;
  background-color: #1a1a1a;
}

.list-image[src*="event_default_bw"] {
  filter: grayscale(100%);
}

.event-list-item:hover .list-image[src*="event_default_bw"],
.list-image[src*="event_default_bw"]:hover {
    filter: grayscale(100%);
}

.event-list-item:hover .list-image {
  filter: grayscale(0%) contrast(1.05);
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.list-title {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
}

.list-category {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FF9d66 !important;
}

.list-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.list-description {
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
}

.list-price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.list-price {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.list-price.free {
  color: #FF9d66 !important;
}

.list-extra {
  font-size: 0.65rem;
  padding: 0.3rem 0.6rem;
  background: #FF9d66;
  color: #000 !important;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 0;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .page-hero {
    padding: 6rem 0 3rem;
  }

  .container {
    padding: 0 1rem;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .category-filters {
    justify-content: center;
  }

  .view-toggle {
    justify-content: center;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .event-list-item {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }

  .list-image-container {
    width: 80px;
    height: 80px;
  }

  .list-price-container {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--theme-border);
  }
}

@media (max-width: 480px) {
  .filter-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>
