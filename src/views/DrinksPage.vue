<script setup>
import { ref, onMounted, computed } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import VuePdfEmbed from 'vue-pdf-embed'
import defaultPdf from '@/assets/Karten/Karte_Pallas.pdf?url'
import QRCode from 'qrcode'

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

const showQrModal = ref(false)
const qrDataUrl = ref('')
const drinksPageUrl = window.location.origin + '/drinks'

async function openQrModal() {
  qrDataUrl.value = await QRCode.toDataURL(drinksPageUrl, {
    width: 280,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' }
  })
  showQrModal.value = true
}
</script>

<template>
  <MainLayout>
    <div class="drinks-page">
      <div class="pdf-header">
        <h1 class="page-title">Pallas.Drinks</h1>
        <div class="header-buttons">
          <a :href="directUrl" download class="header-btn">PDF Herunterladen</a>
          <button class="header-btn" @click="openQrModal">QR Code anzeigen</button>
        </div>
      </div>

      <!-- QR Modal -->
      <Teleport to="body">
        <div v-if="showQrModal" class="qr-overlay" @click.self="showQrModal = false">
          <div class="qr-modal">
            <button class="qr-close" @click="showQrModal = false">✕</button>
            <p class="qr-label">Pallas.Drinks</p>
            <img :src="qrDataUrl" alt="QR Code" class="qr-image" />
            <p class="qr-url">{{ drinksPageUrl }}</p>
          </div>
        </div>
      </Teleport>

      <div class="pdf-wrapper">
        <div v-if="loading" class="pdf-loading">Lade Karte…</div>

        <template v-else>
          <div class="pdf-canvas-wrapper">
            <VuePdfEmbed
              :source="pdfUrl"
              :page="currentPage ?? undefined"
              class="pdf-embed"
              @loaded="onPdfLoaded"
            />
            <template v-if="isMobile && pdfLoaded && pageCount > 1">
              <button class="page-btn page-btn--prev" :disabled="currentPage <= 1" @click="prevPage">&#8592;</button>
              <span class="page-indicator">{{ currentPage }} / {{ pageCount }}</span>
              <button class="page-btn page-btn--next" :disabled="currentPage >= pageCount" @click="nextPage">&#8594;</button>
            </template>
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
  padding-top: 3.5rem;
}

.pdf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem 0.5rem;
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

.page-btn--prev {
  position: absolute;
  top: 50%;
  left: 0.5rem;
  transform: translateY(-50%);
}

.page-btn--next {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
}

.page-indicator {
  position: absolute;
  bottom: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.5);
  min-width: 4rem;
  text-align: center;
  pointer-events: none;
}

.pdf-canvas-wrapper {
  border-radius: 4px;
  overflow: hidden;
  background: #1a1a1a;
  position: relative;
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

.header-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.header-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.2s ease;
  font-family: inherit;
}
.header-btn:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.7);
}

.qr-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.qr-modal {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
  min-width: 300px;
}

.qr-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  padding: 0.25rem;
  transition: color 0.2s;
}
.qr-close:hover { color: #ffffff; }

.qr-label {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.qr-image {
  display: block;
  border-radius: 4px;
}

.qr-url {
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.25);
  margin: 0;
}

@media (max-width: 768px) {
  .pdf-wrapper { padding: 0 0.5rem 4rem; }
  .pdf-header {
    padding: 0.5rem 1rem 0.4rem;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
