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
  pdfLoaded.value = true
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
      <!-- QR Modal -->
      <Teleport to="body">
        <div v-if="showQrModal" class="qr-overlay" @click.self="showQrModal = false">
          <div class="qr-modal">
            <button class="qr-close" @click="showQrModal = false">✕</button>
            <img :src="qrDataUrl" alt="QR Code" class="qr-image" />
            <p class="qr-url">{{ drinksPageUrl }}</p>
          </div>
        </div>
      </Teleport>

      <div class="pdf-wrapper">
        <div v-if="loading" class="pdf-loading">Lade Karte…</div>

        <template v-else>
          <div v-if="!pdfLoaded" class="pdf-spinner-wrapper">
            <div class="pdf-spinner"></div>
          </div>
          <div class="pdf-canvas-wrapper">
            <VuePdfEmbed
              :source="pdfUrl"
              :page="currentPage ?? undefined"
              class="pdf-embed"
              @loaded="onPdfLoaded"
            />
            <h1 class="pdf-title">Pallas.Drinks</h1>
            <div class="pdf-corner-group">
              <button class="pdf-corner-btn" @click="openQrModal" title="QR Code anzeigen">
                <img src="/qr-code-outline.svg" alt="" aria-hidden="true" class="pdf-corner-icon pdf-corner-icon--qr" />
              </button>
              <a :href="directUrl" download class="pdf-corner-btn" title="PDF herunterladen">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            </div>
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
  padding-top: 0;
}

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

.pdf-spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6rem 0;
}

.pdf-spinner {
  width: 36px;
  height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.pdf-title {
  position: absolute;
  top: 5.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  font-size: clamp(1.2rem, 2.5vw, 2rem);
  font-weight: 300;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ffffff;
  white-space: nowrap;
  text-shadow: 0 1px 8px rgba(0,0,0,0.7);
  pointer-events: none;
  margin: 0;
  line-height: 34px;
  width: calc(100% - 14rem);
  text-align: center;
}

.pdf-corner-group {
  position: absolute;
  top: 5.25rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  gap: 0.4rem;
}

.pdf-corner-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  text-decoration: none;
  backdrop-filter: blur(4px);
  transition: background 0.2s ease, color 0.2s ease;
}
.pdf-corner-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
}

.pdf-corner-icon {
  display: block;
  width: 16px;
  height: 16px;
}

.pdf-corner-icon--qr {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
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
  .pdf-wrapper { padding: 0 0 4rem; }
  .pdf-title {
    position: fixed;
    top: 1rem;
    font-size: 1.1rem;
    width: calc(100% - 8rem);
  }
  .pdf-corner-group {
    position: fixed;
    top: 1rem;
    left: 1rem;
  }
}
</style>
