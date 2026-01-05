<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/authStore'
import api from '@/utils/api'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const router = useRouter()
const { state: authState, logout } = useAuth()
const API_URL = import.meta.env.VITE_API_URL

// State
const events = ref([])
const categories = ref([])
const loading = ref(true)
const showEventModal = ref(false)
const showCategoryModal = ref(false)
const showCropperModal = ref(false)
const editingEvent = ref(null)

// Form State
const form = ref({
  title: '',
  category: '',
  description: '',
  room: '',
  startTime: '',
  endTime: '',
  price: 0,
  eventImageUrl: '',
  extra_label: ''
})
const formError = ref('')
const formLoading = ref(false)
const eventImageFile = ref(null)
const eventImagePreview = ref('')

// Category Form State
const categoryForm = ref({
  name: '',
  defaultImageUrl: '',
  description: '',
  color: '#646cff'
})
const categoryImageFile = ref(null)
const categoryImagePreview = ref('')
const categoryFormError = ref('')
const categoryFormLoading = ref(false)
const cropperImage = ref('')
const cropper = ref(null)
const originalFileName = ref('')
const croppingMode = ref('') // 'category' or 'event'

// Sorting State
const sortBy = ref('startTime')
const sortOrder = ref('asc')

// Context Menu State
const activeContextMenu = ref(null)

// Mobile Menu State
const mobileMenuOpen = ref(false)

// Computed
const sortedEvents = computed(() => {
  const sorted = [...events.value].sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy.value) {
      case 'title':
        aVal = a.title?.toLowerCase() || ''
        bVal = b.title?.toLowerCase() || ''
        break
      case 'category':
        aVal = a.category?.name?.toLowerCase() || ''
        bVal = b.category?.name?.toLowerCase() || ''
        break
      case 'startTime':
        aVal = new Date(a.startTime)
        bVal = new Date(b.startTime)
        break
      case 'price':
        aVal = a.price || 0
        bVal = b.price || 0
        break
      default:
        return 0
    }
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  
  return sorted
})

const stats = computed(() => ({
  total: events.value.length,
  upcoming: events.value.filter(e => new Date(e.startTime) >= new Date()).length,
  categories: categories.value.length
}))

function setSorting(field) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

function toggleContextMenu(eventId) {
  activeContextMenu.value = activeContextMenu.value === eventId ? null : eventId
}

function closeContextMenu() {
  activeContextMenu.value = null
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const getFullImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

const selectedCategoryImage = computed(() => {
  if (!form.value.category) return null
  const cat = categories.value.find(c => c._id === form.value.category)
  return cat?.defaultImageUrl || null
})

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchEvents(), fetchCategories()])
  loading.value = false
  
  // Close context menu on click outside
  document.addEventListener('click', closeContextMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeContextMenu)
})

// Methods
async function fetchEvents() {
  try {
    const { data } = await api.get('/events?limit=100')
    events.value = data.data || []
  } catch (err) {
    console.error('Fehler beim Laden der Events:', err)
  }
}

async function fetchCategories() {
  try {
    const { data } = await api.get('/categories')
    categories.value = data.data || []
  } catch (err) {
    console.error('Fehler beim Laden der Kategorien:', err)
  }
}

function openNewEventModal() {
  editingEvent.value = null
  resetForm()
  showEventModal.value = true
}

function openEditEventModal(event) {
  editingEvent.value = event
  form.value = {
    title: event.title,
    category: event.category?._id || event.category,
    description: event.description || '',
    room: Array.isArray(event.room) ? event.room.join(', ') : event.room,
    startTime: formatDateTimeLocal(event.startTime),
    endTime: event.endTime ? formatDateTimeLocal(event.endTime) : '',
    price: event.price || 0,
    eventImageUrl: event.eventImageUrl || '',
    extra_label: event.extra_label || ''
  }
  // Vorschau für bestehendes Event-Bild
  if (event.eventImageUrl) {
    eventImagePreview.value = event.eventImageUrl
  }
  showEventModal.value = true
}

function closeModal() {
  showEventModal.value = false
  editingEvent.value = null
  resetForm()
}

function resetForm() {
  form.value = {
    title: '',
    category: '',
    description: '',
    room: '',
    startTime: '',
    endTime: '',
    price: 0,
    eventImageUrl: '',
    extra_label: ''
  }
  eventImageFile.value = null
  eventImagePreview.value = ''
  formError.value = ''
}

function formatDateTimeLocal(dateStr) {
  const d = new Date(dateStr)
  return d.toISOString().slice(0, 16)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function handleSubmit() {
  if (!form.value.title || !form.value.category || !form.value.startTime) {
    formError.value = 'Bitte fülle alle Pflichtfelder aus'
    return
  }

  formLoading.value = true
  formError.value = ''

  try {
    let eventImageUrl = form.value.eventImageUrl

    // Wenn ein neues Bild hochgeladen wurde
    if (eventImageFile.value) {
      const formData = new FormData()
      formData.append('image', eventImageFile.value)
      formData.append('eventName', form.value.title)

      const uploadResponse = await api.post('/upload/event-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      eventImageUrl = `${API_URL}${uploadResponse.data.imageUrl}`
    }

    const payload = {
      title: form.value.title,
      category: form.value.category,
      description: form.value.description,
      room: form.value.room.split(',').map(r => r.trim()).filter(Boolean),
      startTime: new Date(form.value.startTime).toISOString(),
      endTime: form.value.endTime ? new Date(form.value.endTime).toISOString() : null,
      price: parseFloat(form.value.price) || 0,
      eventImageUrl: eventImageUrl || null,
      extra_label: form.value.extra_label || null
    }

    if (editingEvent.value) {
      await api.put(`/events/${editingEvent.value._id}`, payload)
    } else {
      await api.post('/events', payload)
    }
    
    await fetchEvents()
    closeModal()
  } catch (err) {
    formError.value = err.response?.data?.error || 'Fehler beim Speichern'
  } finally {
    formLoading.value = false
  }
}

async function deleteEvent(event) {
  if (!confirm(`Event "${event.title}" wirklich löschen?`)) return

  try {
    await api.delete(`/events/${event._id}`)
    await fetchEvents()
  } catch (err) {
    alert('Fehler beim Löschen: ' + (err.response?.data?.error || err.message))
  }
}

function handleLogout() {
  logout()
  router.push('/admin')
}

// Category Modal Methods
function openCategoryModal() {
  resetCategoryForm()
  showCategoryModal.value = true
}

function closeCategoryModal() {
  showCategoryModal.value = false
  resetCategoryForm()
}

function resetCategoryForm() {
  categoryForm.value = {
    name: '',
    defaultImageUrl: '',
    description: '',
    color: '#646cff'
  }
  categoryImageFile.value = null
  categoryImagePreview.value = ''
  categoryFormError.value = ''
  cropperImage.value = ''
  originalFileName.value = ''
}

function handleCategoryImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    originalFileName.value = file.name
    croppingMode.value = 'category'
    // Bild für Cropper laden
    const reader = new FileReader()
    reader.onload = (e) => {
      cropperImage.value = e.target.result
      showCropperModal.value = true
    }
    reader.readAsDataURL(file)
  }
}

function handleEventImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    originalFileName.value = file.name
    croppingMode.value = 'event'
    // Bild für Cropper laden
    const reader = new FileReader()
    reader.onload = (e) => {
      cropperImage.value = e.target.result
      showCropperModal.value = true
    }
    reader.readAsDataURL(file)
  }
}

function closeCropperModal() {
  showCropperModal.value = false
  cropperImage.value = ''
  croppingMode.value = ''
}

async function handleCropComplete() {
  const { canvas } = cropper.value.getResult()
  if (canvas) {
    // Canvas zu Blob konvertieren
    canvas.toBlob((blob) => {
      // Blob zu File konvertieren
      const file = new File([blob], originalFileName.value || 'image.jpg', {
        type: 'image/jpeg'
      })
      
      const preview = canvas.toDataURL('image/jpeg')
      
      if (croppingMode.value === 'category') {
        categoryImageFile.value = file
        categoryImagePreview.value = preview
      } else if (croppingMode.value === 'event') {
        eventImageFile.value = file
        eventImagePreview.value = preview
      }
      
      closeCropperModal()
    }, 'image/jpeg', 0.9)
  }
}

async function handleCategorySubmit() {
  if (!categoryForm.value.name) {
    categoryFormError.value = 'Name ist ein Pflichtfeld'
    return
  }

  if (!categoryImageFile.value) {
    categoryFormError.value = 'Bitte ein Bild hochladen'
    return
  }

  categoryFormLoading.value = true
  categoryFormError.value = ''

  try {
    // Erst das Bild hochladen
    const formData = new FormData()
    formData.append('image', categoryImageFile.value)
    formData.append('categoryName', categoryForm.value.name)

    const uploadResponse = await api.post('/upload/category-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Dann die Kategorie mit der Bild-URL erstellen
    const imageUrl = `${API_URL}${uploadResponse.data.imageUrl}`
    const categoryData = {
      ...categoryForm.value,
      defaultImageUrl: imageUrl
    }

    const { data } = await api.post('/categories', categoryData)
    await fetchCategories()
    
    // Neue Kategorie im Event-Form auswählen
    form.value.category = data.data._id
    
    closeCategoryModal()
  } catch (err) {
    categoryFormError.value = err.response?.data?.error || 'Fehler beim Erstellen'
  } finally {
    categoryFormLoading.value = false
  }
}
</script>

<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="@/assets/Pallas_Logo_III.svg" alt="Pallas Logo" class="logo" />
        <button @click="toggleMobileMenu" class="hamburger-btn">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div class="mobile-menu-wrapper" :class="{ open: mobileMenuOpen }">
        <nav class="sidebar-nav">
          <a href="#" class="nav-item active">
            Events
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <span class="user-name">{{ authState.user?.name || authState.user?.email }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn">Abmelden</button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="content-header">
        <h1>Dashboard</h1>
        <button @click="openNewEventModal" class="btn-primary">
          + Neues Event
        </button>
      </header>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>

      <!-- Content -->
      <div v-else class="content-body">

        <!-- All Events -->
        <section class="section">
          <div class="section-header">
            <h2>Alle Events ({{ events.length }})</h2>
            <div class="sort-controls">
              <label>Sortieren nach:</label>
              <select v-model="sortBy" class="sort-select">
                <option value="startTime">Datum</option>
                <option value="title">Titel</option>
                <option value="category">Kategorie</option>
                <option value="price">Preis</option>
              </select>
              <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="btn-icon sort-btn" :title="sortOrder === 'asc' ? 'Aufsteigend' : 'Absteigend'">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </button>
            </div>
          </div>
          
          <div v-if="events.length === 0" class="empty-state">
            <p>Keine Events vorhanden</p>
            <button @click="openNewEventModal" class="btn-secondary">
              Event erstellen
            </button>
          </div>

          <div v-else class="events-table">
            <table>
              <thead>
                <tr>
                  <th @click="setSorting('title')" class="sortable" :class="{ active: sortBy === 'title' }">
                    Titel {{ sortBy === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
                  </th>
                  <th @click="setSorting('category')" class="sortable" :class="{ active: sortBy === 'category' }">
                    Kategorie {{ sortBy === 'category' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
                  </th>
                  <th @click="setSorting('startTime')" class="sortable" :class="{ active: sortBy === 'startTime' }">
                    Datum {{ sortBy === 'startTime' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
                  </th>
                  <th>Raum</th>
                  <th @click="setSorting('price')" class="sortable" :class="{ active: sortBy === 'price' }">
                    Preis {{ sortBy === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
                  </th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in sortedEvents" :key="event._id">
                  <td>{{ event.title }}</td>
                  <td>
                    <span class="category-badge" :style="{ backgroundColor: event.category?.color || '#333' }">
                      {{ event.category?.name || 'Keine' }}
                    </span>
                  </td>
                  <td>{{ formatDate(event.startTime) }}</td>
                  <td>{{ Array.isArray(event.room) ? event.room.join(', ') : event.room }}</td>
                  <td>{{ event.price ? `${event.price} €` : 'Kostenlos' }}</td>
                  <td class="actions">
                    <div class="context-menu-wrapper">
                      <button @click.stop="toggleContextMenu(event._id)" class="btn-context-menu" title="Aktionen">
                        ⋮
                      </button>
                      <div v-if="activeContextMenu === event._id" class="context-menu" @click.stop>
                        <button @click="openEditEventModal(event); closeContextMenu()" class="context-menu-item">
                          Bearbeiten
                        </button>
                        <button @click="deleteEvent(event); closeContextMenu()" class="context-menu-item danger">
                          Löschen
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>

    <!-- Event Modal -->
    <Teleport to="body">
      <div v-if="showEventModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ editingEvent ? 'Event bearbeiten' : 'Neues Event' }}</h2>
            <button @click="closeModal" class="close-btn">×</button>
          </div>

          <form @submit.prevent="handleSubmit" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>Titel *</label>
                <input v-model="form.title" type="text" required placeholder="Event-Titel" />
              </div>

              <div class="form-group">
                <label>Kategorie *</label>
                <div class="input-with-button">
                  <select v-model="form.category" required>
                    <option value="" disabled>Kategorie wählen</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                      {{ cat.name }}
                    </option>
                  </select>
                  <button type="button" @click="openCategoryModal" class="add-btn" title="Neue Kategorie">+</button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Beschreibung</label>
              <textarea v-model="form.description" rows="3" placeholder="Event-Beschreibung"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Start *</label>
                <input v-model="form.startTime" type="datetime-local" required />
              </div>

              <div class="form-group">
                <label>Ende</label>
                <input v-model="form.endTime" type="datetime-local" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Raum (Komma-getrennt)</label>
                <input v-model="form.room" type="text" placeholder="Hauptsaal, VIP Lounge" />
              </div>

              <div class="form-group">
                <label>Preis (€)</label>
                <input v-model.number="form.price" type="number" min="0" step="0.01" placeholder="0.00" />
              </div>
            </div>

            <div class="form-group">
              <label>Event-Bild</label>
              <div class="image-upload-section">
                <div v-if="eventImagePreview || selectedCategoryImage" class="image-preview-wrapper">
                  <img 
                    :src="eventImagePreview || selectedCategoryImage" 
                    alt="Event Vorschau" 
                    class="image-preview"
                  />
                  <span v-if="!eventImagePreview && selectedCategoryImage" class="fallback-badge">
                    Default
                  </span>
                  <span v-else-if="eventImagePreview" class="custom-badge">
                    Eigenes Bild
                  </span>
                </div>
                <div v-else class="image-placeholder">
                  <span>Kein Bild (Kategorie wählen für Standard)</span>
                </div>
                <div class="image-upload-actions">
                  <input 
                    type="file" 
                    ref="eventImageInput" 
                    accept="image/*" 
                    @change="handleEventImageChange" 
                    style="display: none"
                  />
                  <button 
                    type="button" 
                    @click="$refs.eventImageInput.click()" 
                    class="btn btn-secondary"
                  >
                    {{ eventImagePreview ? 'Bild ändern' : 'Bild hochladen' }}
                  </button>
                  <button 
                    v-if="eventImagePreview" 
                    type="button" 
                    @click="eventImagePreview = null; eventImageFile = null" 
                    class="btn btn-danger"
                  >
                    Eigenes Bild entfernen
                  </button>
                </div>
                <small class="form-help">
                  Optional: Lade ein eigenes Bild hoch oder nutze das Kategorie-Standardbild
                </small>
              </div>
            </div>

            <div class="form-group">
              <label>Extra Label</label>
              <input v-model="form.extra_label" type="text" placeholder="z.B. 'Special Guest'" />
            </div>

            <div v-if="formError" class="error-message">{{ formError }}</div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">Abbrechen</button>
              <button type="submit" class="btn-primary" :disabled="formLoading">
                {{ formLoading ? 'Speichern...' : (editingEvent ? 'Aktualisieren' : 'Erstellen') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Category Modal -->
    <Teleport to="body">
      <div v-if="showCategoryModal" class="modal-overlay" @click.self="closeCategoryModal">
        <div class="modal modal-small">
          <div class="modal-header">
            <h2>Neue Kategorie</h2>
            <button @click="closeCategoryModal" class="close-btn">×</button>
          </div>

          <form @submit.prevent="handleCategorySubmit" class="modal-form">
            <div class="form-group">
              <label>Name *</label>
              <input v-model="categoryForm.name" type="text" required placeholder="z.B. Konzert" maxlength="50" />
            </div>

            <div class="form-group">
              <label>Kategorie-Bild *</label>
              <p class="field-hint">Wähle ein Bild aus</p>
              <input 
                type="file" 
                @change="handleCategoryImageChange" 
                accept="image/*" 
                required 
                class="file-input"
              />
              <div v-if="categoryImagePreview" class="image-preview">
                <img :src="categoryImagePreview" alt="Vorschau" />
                <span class="preview-hint">Vorschau</span>
              </div>
            </div>

            <div class="form-group">
              <label>Beschreibung</label>
              <textarea v-model="categoryForm.description" rows="2" placeholder="Kurze Beschreibung" maxlength="200"></textarea>
            </div>

            <div class="form-group">
              <label>Farbe</label>
              <div class="color-picker-wrapper">
                <input v-model="categoryForm.color" type="color" class="color-input" />
                <input v-model="categoryForm.color" type="text" placeholder="#646cff" class="color-text" />
              </div>
            </div>

            <div v-if="categoryFormError" class="error-message">{{ categoryFormError }}</div>

            <div class="modal-actions">
              <button type="button" @click="closeCategoryModal" class="btn-secondary">Abbrechen</button>
              <button type="submit" class="btn-primary" :disabled="categoryFormLoading">
                {{ categoryFormLoading ? 'Erstellen...' : 'Kategorie erstellen' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Cropper Modal -->
    <Teleport to="body">
      <div v-if="showCropperModal" class="modal-overlay" @click.self="closeCropperModal">
        <div class="modal modal-large">
          <div class="modal-header">
            <h2>Bild zuschneiden</h2>
            <button @click="closeCropperModal" class="close-btn">×</button>
          </div>

          <div class="cropper-container">
            <Cropper
              ref="cropper"
              :src="cropperImage"
              :stencil-props="{
                aspectRatio: 1
              }"
              class="cropper"
            />
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeCropperModal" class="btn-secondary">Abbrechen</button>
            <button type="button" @click="handleCropComplete" class="btn-primary">Übernehmen</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #0f0f1a;
  color: #fff;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-header .logo {
  width: 100%;
  max-width: 200px;
  height: auto;
  filter: brightness(0) invert(1);
}

.hamburger-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.hamburger-btn span {
  width: 24px;
  height: 2px;
  background: #fff;
  transition: all 0.3s ease;
}

.mobile-menu-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.nav-item.active {
  background: rgba(100, 108, 255, 0.15);
  color: #646cff;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.user-info {
  margin-bottom: 0.75rem;
}

.user-name {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.logout-btn {
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 82, 82, 0.15);
  border-color: #ff5252;
  color: #ff5252;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.content-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.content-body {
  padding: 2rem;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #646cff;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Section */
.section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section h2,
.section-header h2 {
  font-size: 1.25rem;
  margin: 0;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-controls label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.sort-select {
  padding: 0.5rem 3rem 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
}

.sort-select:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.25);
}

.sort-btn {
  padding: 0.5rem 0.75rem;
  font-size: 1.2rem;
  min-width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Table */
.events-table {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: visible;
}

.events-table table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.events-table td {
  padding: 1rem;
  text-align: left;
}

.events-table th {
  background: rgba(255, 255, 255, 0.05);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.7);
}

.events-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.events-table th.sortable:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

.events-table th.sortable.active {
  color: #646cff;
}

.events-table tr:not(:last-child) td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.events-table tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #fff;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  position: relative;
}

.context-menu-wrapper {
  position: relative;
}

.actions {
  position: relative;
  overflow: visible;
}

.btn-context-menu {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  line-height: 1;
  font-weight: bold;
}

.btn-context-menu:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.context-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 0.25rem);
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  min-width: 160px;
  overflow: hidden;
  animation: contextMenuFadeIn 0.15s ease;
}

@keyframes contextMenuFadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.context-menu-item {
  width: 100%;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.context-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.context-menu-item.danger {
  color: #ff6b6b;
}

.context-menu-item.danger:hover {
  background: rgba(255, 107, 107, 0.1);
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #646cff, #535bf2);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(100, 108, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
}

.btn-icon {
  background: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-danger:hover {
  background: rgba(255, 82, 82, 0.2);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state p {
  margin-bottom: 1rem;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.6);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #646cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-small {
  max-width: 450px;
}

.modal-large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.modal-header h2 {
  font-size: 1.25rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.form-group input,
.form-group select,
.form-group textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #646cff;
}

.form-group textarea {
  resize: vertical;
}

.error-message {
  background: rgba(255, 82, 82, 0.15);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: #ff5252;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* Input with Button */
.input-with-button {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.input-with-button select {
  flex: 1;
}

.add-btn {
  background: linear-gradient(135deg, #646cff, #535bf2);
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 40px;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(100, 108, 255, 0.3);
}

/* Color Picker */
.color-picker-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.color-input {
  width: 60px;
  height: 40px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}

.color-text {
  flex: 1;
}

/* File Input */
.file-input {
  padding: 0.75rem;
  cursor: pointer;
}

.field-hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0.25rem 0 0.5rem 0;
}

.file-input::file-selector-button {
  background: linear-gradient(135deg, #646cff, #535bf2);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-right: 1rem;
  transition: all 0.2s ease;
}

.file-input::file-selector-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(100, 108, 255, 0.3);
}

.image-preview {
  margin-top: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  overflow: hidden;
  max-width: 400px;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.preview-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
}

/* Image Upload Section Styles */
.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview-container {
  position: relative;
}

.image-preview-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  max-width: 400px;
}

.image-preview-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.fallback-badge,
.custom-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
}

.fallback-badge {
  background: rgba(255, 193, 7, 0.9);
  color: #000;
  border: 1px solid rgba(255, 193, 7, 1);
}

.custom-badge {
  background: rgba(76, 175, 80, 0.9);
  color: #fff;
  border: 1px solid rgba(76, 175, 80, 1);
}

.image-placeholder {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  max-width: 400px;
  background: rgba(0, 0, 0, 0.2);
}

.image-upload-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.form-help {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .sidebar-header {
    position: relative;
    justify-content: center;
  }

  .hamburger-btn {
    display: flex;
  }

  .mobile-menu-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .mobile-menu-wrapper.open {
    max-height: 500px;
  }

  .sidebar-nav {
    display: flex;
    padding: 0;
    overflow-x: auto;
    flex-direction: column;
  }

  .nav-item {
    padding: 1rem;
    border-right: none;
  }

  .nav-item.active {
    border-right: none;
    border-left: 3px solid #646cff;
  }

  .sidebar-footer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem;
  }

  .sidebar-footer .user-info {
    margin-bottom: 0;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .content-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

/* Cropper */
.cropper-container {
  padding: 1.5rem;
  background: #0f0f1a;
  min-height: 400px;
  max-height: 60vh;
}

.cropper {
  height: 100%;
  max-height: 60vh;
}
</style>
