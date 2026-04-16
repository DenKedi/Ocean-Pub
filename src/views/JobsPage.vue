<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import api from '../utils/api'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import heroImage from '@/assets/pictures/Pallas Jobs/Drink1.webp'
import barImage from '@/assets/pictures/bar1.webp'
import galleryImage2 from '@/assets/pictures/Pallas Jobs/Barkeeper2.webp'
import galleryImage3 from '@/assets/pictures/Pallas Jobs/Drink2.webp'
import galleryImage4 from '@/assets/pictures/Pallas Jobs/Drink3.webp'
import galleryImage5 from '@/assets/pictures/Pallas Jobs/Drink4.webp'
import galleryImage6 from '@/assets/pictures/Pallas Jobs/Drink5.webp'
import galleryImage7 from '@/assets/pictures/Pallas Jobs/Drink6.webp'
import galleryImage8 from '@/assets/pictures/Pallas Jobs/Drink7.webp'

// All images for marquee strip
const marqueeImages = [
  galleryImage2, galleryImage3, galleryImage4,
  galleryImage5, galleryImage6, galleryImage7, galleryImage8, barImage
]

gsap.registerPlugin(ScrollTrigger)

// State
const jobs = ref([])
const loading = ref(true)
const error = ref(null)

// Fetch jobs from API
const fetchJobs = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/jobs')
    // Only show active jobs
    jobs.value = (response.data || []).filter(j => j.isActive)
  } catch (err) {
    console.error('Error fetching jobs:', err)
    error.value = 'Jobs konnten nicht geladen werden'
  } finally {
    loading.value = false
  }
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Parallax refs
const jobsPage = ref(null)
const backgroundLayer = ref(null)
let scrollTrigger = null

const initParallax = () => {
  if (scrollTrigger) scrollTrigger.kill()

  if (backgroundLayer.value && jobsPage.value) {
    scrollTrigger = gsap.fromTo(backgroundLayer.value,
      { yPercent: -10 },
      {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: jobsPage.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      }
    ).scrollTrigger
  }
}

onMounted(() => {
  fetchJobs().then(() => {
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
    <div ref="jobsPage" class="jobs-page">
      <!-- Parallax Background -->
      <div ref="backgroundLayer" class="background-layer">
        <img :src="heroImage" alt="" class="parallax-bg-image" fetchpriority="high" />
      </div>

      <!-- Hero Header -->
      <section class="page-hero">
        <div class="container">
          <h1 class="page-title pallas-heading">Pallas.Jobs</h1>
          <p v-if="!loading && jobs.length > 0" class="page-subtitle page-subtitle--active">Wir Suchen!</p>
          <p v-else-if="!loading" class="page-subtitle">Aktuell Suchen wir nicht!</p>
        </div>
      </section>

      <!-- Jobs & Images Content -->
      <section class="jobs-content">
        <div class="container">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Jobs werden geladen...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
            <button class="retry-btn" @click="fetchJobs">Erneut versuchen</button>
          </div>

          <!-- Empty State -->
          <div v-else-if="jobs.length === 0" class="empty-state">
            <p>Aktuell keine offenen Stellen — aber wir freuen uns über Initiativbewerbungen!</p>
          </div>

          <!-- Job Listings with Alternating Images -->
          <div v-else class="jobs-alternating">
            <template v-for="(job, index) in jobs" :key="job._id">
              <!-- Job Card -->
              <article class="job-card theme-container-bg">
                <div class="job-header">
                  <h2 class="job-title">{{ job.title }}</h2>
                  <span v-if="job.type" class="job-type">{{ job.type }}</span>
                </div>

                <p v-if="job.description" class="job-description theme-text-secondary">
                  {{ job.description }}
                </p>

                <div class="job-meta">
                  <div v-if="job.startTime" class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Ab {{ formatDate(job.startTime) }}</span>
                  </div>

                  <div v-if="job.endTime" class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Bis {{ formatDate(job.endTime) }}</span>
                  </div>

                  <span v-if="job.extra_label" class="job-extra-label">{{ job.extra_label }}</span>
                </div>

                <div v-if="job.link_url && job.link_text" class="job-footer">
                  <a
                    :href="job.link_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="job-link-btn"
                  >{{ job.link_text }}</a>
                </div>
              </article>
            </template>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-box">
            <h2 class="cta-heading">Initiativbewerbung</h2>
            <p class="cta-text">
              Schicke uns deine Bewerbung mit Anschreiben und Lebenslauf an:
            </p>
            <a href="mailto:jobs@pallas.world" class="cta-button">
              jobs@pallas.world
            </a>
          </div>
        </div>
      </section>

      <!-- Marquee Image Strip -->
      <section class="marquee-section">
        <div class="marquee-track">
          <div class="marquee-inner">
            <img
              v-for="(img, i) in marqueeImages"
              :key="'a' + i"
              :src="img"
              :alt="'Pallas Jobs ' + (i + 1)"
              class="marquee-img"
              loading="lazy"
            />
            <!-- Duplicate for seamless loop -->
            <img
              v-for="(img, i) in marqueeImages"
              :key="'b' + i"
              :src="img"
              :alt="'Pallas Jobs ' + (i + 1)"
              class="marquee-img"
              loading="lazy"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<style scoped>
.jobs-page {
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
  width: 100vw;
  height: 160lvh;
  opacity: 0.35;
  z-index: 0;
  pointer-events: none;
  will-change: transform;
  overflow: hidden;
}

.parallax-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  pointer-events: none;
  filter: none;
}

.jobs-page > section {
  position: relative;
  z-index: 1;
}

/* Container */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero */
.page-hero {
  padding: 8rem 0 3rem;
  text-align: center;
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

.page-subtitle {
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.page-subtitle--active {
  color: #FF9d66;
}

.jobs-alternating {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Jobs Content */
.jobs-content {
  padding: 3rem 0 2rem;
}

/* Loading, Error, Empty States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #fff;
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
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  border-color: #FF9d66;
  color: #FF9d66;
}

/* Job Cards */
.job-card {
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.job-card:hover {
  border-color: rgba(255, 157, 102, 0.3) !important;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.job-title {
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #fff;
  margin: 0;
}

.job-type {
  padding: 0.3rem 0.8rem;
  border: 1px solid rgba(255, 157, 102, 0.4);
  color: rgba(255, 157, 102, 0.85);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.job-description {
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: pre-line;
}

.job-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

.meta-item svg {
  flex-shrink: 0;
  color: rgba(255, 157, 102, 0.6);
}

.job-extra-label {
  padding: 0.25rem 0.6rem;
  background: rgba(255, 157, 102, 0.12);
  color: rgba(255, 157, 102, 0.8);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  border-radius: 2px;
}

.job-footer {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.job-link-btn {
  display: inline-block;
  padding: 0.6rem 1.4rem;
  background: transparent;
  border: 1px solid rgba(255, 157, 102, 0.4);
  color: rgba(255, 157, 102, 0.85);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-decoration: none;
  transition: all 0.3s ease;
}

.job-link-btn:hover {
  background: rgba(255, 157, 102, 0.1);
  border-color: #FF9d66;
  color: #FF9d66;
}

/* CTA Section */
.cta-section {
  padding: 3rem 0 6rem;
}

.cta-box {
  text-align: center;
  padding: 3rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
}

.cta-heading {
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
  max-width: 100%;
  margin: 0 auto 2rem;
  white-space: nowrap;
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 2rem;
  border: 1px solid #FF9d66 !important;
  color: #FF9d66;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: #FF9d66;
  color: #000;
}

/* Marquee Strip */
.marquee-section {
  padding: 0;
  overflow: hidden;
  width: 100%;
  position: relative;
  z-index: 1;
}

.marquee-track {
  overflow: hidden;
  width: 100%;
}

.marquee-inner {
  display: flex;
  gap: 0.75rem;
  width: max-content;
  animation: marquee-scroll 30s linear infinite;
  padding: 1.5rem 0;
}

.marquee-inner:hover {
  animation-play-state: paused;
}

.marquee-img {
  height: 240px;
  width: auto;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
  filter: grayscale(10%);
  transition: filter 0.3s ease, transform 0.3s ease;
}

.marquee-img:hover {
  filter: grayscale(0%);
  transform: scale(1.02);
}

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    letter-spacing: 0.04em;
    font-size: 2.1rem;
  }

  .container {
    padding: 0 1.25rem;
  }

  .marquee-img {
    height: 160px;
  }

  .job-card {
    padding: 1.5rem;
  }

  .job-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .job-meta {
    gap: 1rem;
  }

  .cta-box {
    padding: 2rem 1.5rem;
  }
}
</style>
