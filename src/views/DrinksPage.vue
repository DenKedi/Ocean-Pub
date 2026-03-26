<script setup>
import { ref, onMounted, computed } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import VuePdfEmbed from 'vue-pdf-embed'
import defaultPdf from '@/assets/Karten/Karte_Pallas.pdf?url'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const pdfUrl = ref(defaultPdf)
const directUrl = ref(defaultPdf)
const loading = ref(true)
const pdfLoaded = ref(false)
const pageCount = ref(0)
const currentPage = ref(null)

const isMobile = computed(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/settings`)
    if (res.ok) {
      const data = await res.json()
      if (data.drinksPdfUrl) {
        directUrl.value = data.drinksPdfUrl
        // Use proxy to avoid CORS issues with R2 CDN
        pdfUrl.value = `${API_BASE}/settings/drinks-pdf`
      }
    }
  } catch {
    // fallback to default
  } finally {
    loading.value = false
  }
})

function onPdfLoaded(pdf) {
  pageCount.value = pdf.numPages
  if (isMobile.value) currentPage.value = 1
  pdfLoaded.value = true
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < pageCount.value) currentPage.value++
}
</script>

<template>
  <MainLayout>
    <div class="drinks-page">
      <div class="pdf-header">
        <h1 class="page-title">Pallas.Drinks</h1>
        <a :href="directUrl" target="_blank" rel="noopener" class="open-link">
          PDF öffnen
        </a>
      </div>

      <div class="pdf-wrapper">
        <div v-if="loading" class="pdf-loading">Lade Karte…</div>

        <template v-else>
          <div v-if="isMobile && pdfLoaded && pageCount > 1" class="page-controls">
            <button class="page-btn" :disabled="currentPage <= 1" @click="prevPage">&#8592;</button>
            <span class="page-indicator">{{ currentPage }} / {{ pageCount }}</span>
            <button class="page-btn" :disabled="currentPage >= pageCount" @click="nextPage">&#8594;</button>
          </div>

          <div class="pdf-canvas-wrapper">
            <VuePdfEmbed
              :source="pdfUrl"
              :page="currentPage ?? undefined"
              class="pdf-embed"
              @loaded="onPdfLoaded"
            />
          </div>

          <div v-if="!isMobile && pdfLoaded && pageCount > 1" class="page-info">
            {{ pageCount }} Seiten
          </div>
        </template>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.drinks-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 5rem;
}

.pdf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem 1rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.page-title {
  font-size: clamp(1.6rem, 3vw, 2.5rem);
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
}

.open-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}
.open-link:hover { color: #ffffff; }

.pdf-wrapper {
  flex: 1;
  padding: 0 1rem 4rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.pdf-loading {
  text-align: center;
  padding: 6rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}

.page-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.75rem 0 1rem;
}

.page-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 1.1rem;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:disabled { opacity: 0.25; cursor: default; }
.page-btn:not(:disabled):hover { background: rgba(255, 255, 255, 0.16); }

.page-indicator {
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.5);
  min-width: 4rem;
  text-align: center;
}

.pdf-canvas-wrapper {
  border-radius: 4px;
  overflow: hidden;
  background: #1a1a1a;
}

.pdf-embed {
  width: 100%;
  display: block;
}

.page-info {
  text-align: center;
  padding: 0.75rem 0;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.25);
}

@media (max-width: 768px) {
  .pdf-wrapper { padding: 0 0.5rem 4rem; }
  .pdf-header { padding: 1.25rem 1rem 0.75rem; }
}
</style>
