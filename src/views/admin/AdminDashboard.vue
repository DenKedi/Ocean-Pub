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
const API_BASE = import.meta.env.VITE_API_BASE_URL
const BASE_URL = import.meta.env.BASE_URL || 'https://pallas.bleck.it'

// State
const events = ref([])
const categories = ref([])
const loading = ref(true)
const showEventModal = ref(false)
const showCategoryModal = ref(false)
const showCropperModal = ref(false)
const showPreview = ref(false)
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
  extra_label: '',
  link_text: '',
  link_url: ''
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

// History section collapse
const historyOpen = ref(false)

// Section Navigation State
const activeSection = ref('events')

// Rooms State
const roomsData = ref({ sketch1: [], sketch2: [] })
const roomsLoading = ref(false)
const roomsSaving = ref(false)
const roomsSaveSuccess = ref(false)
const editingRoom = ref(null)       // { sketch, index }
const roomForm = ref({})
const roomFeatureInput = ref('')

const linkTooltipVisible = ref(false)
const linkTooltipX = ref(0)
const linkTooltipY = ref(0)
const linkTooltipUrl = ref('')
const linkTooltipSelectionStart = ref(0)
const linkTooltipSelectionEnd = ref(0)

const roomImageInput = ref(null)
const roomImagesUploading = ref(false)
const dragImageIdx = ref(null)
const dragOverIdx = ref(null)
const roomDropActive = ref(false)
const eventDropActive = ref(false)
const categoryDropActive = ref(false)

// Jobs State
const jobs = ref([])
const jobsLoading = ref(false)
const showJobModal = ref(false)
const editingJob = ref(null)
const jobForm = ref({
  title: '',
  description: '',
  type: '',
  startTime: '',
  endTime: '',
  extra_label: '',
  link_url: '',
  link_text: '',
  isActive: true
})
const jobFormError = ref('')
const jobFormLoading = ref(false)

// Users State
const users = ref([])
const usersLoading = ref(false)
const showUserModal = ref(false)
const userForm = ref({ name: '', email: '', password: '', passwordConfirm: '' })
const userFormError = ref('')
const userFormLoading = ref(false)
const userDeleteConfirm = ref(null) // id of user to delete
const showEditUserModal = ref(false)
const editingUser = ref(null)
const editUserForm = ref({ name: '', email: '', password: '', passwordConfirm: '' })
const editUserFormError = ref('')
const editUserFormLoading = ref(false)

// Drinks PDF State
const drinksPdfUrl = ref('')
const drinksPdfUploading = ref(false)
const drinksPdfSuccess = ref(false)
const drinksPdfError = ref('')
const drinksPdfInput = ref(null)

// Instagram Settings State
const instagramUrlLeft = ref('')
const instagramUrlRight = ref('')
const instagramSaving = ref(false)
const instagramSaveSuccess = ref(false)
const instagramSaveError = ref('')

function extractInstagramId(input) {
  if (!input) return ''
  const match = input.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/)
  if (match) return match[1]
  // If user already typed just an ID
  if (/^[A-Za-z0-9_-]+$/.test(input.trim())) return input.trim()
  return ''
}

const instagramIdLeft = computed(() => extractInstagramId(instagramUrlLeft.value))
const instagramIdRight = computed(() => extractInstagramId(instagramUrlRight.value))

// Computed
const stats = computed(() => ({
  total: events.value.length,
  upcoming: events.value.filter(e => new Date(e.startTime) >= new Date()).length,
  categories: categories.value.length
}))

const futureEvents = computed(() => {
  const n = new Date()
  return [...events.value]
    .filter(e => new Date(e.startTime) >= n)
    .sort((a, b) => {
      let aVal, bVal
      switch (sortBy.value) {
        case 'title':    aVal = a.title?.toLowerCase() || ''; bVal = b.title?.toLowerCase() || ''; break
        case 'category': aVal = a.category?.name?.toLowerCase() || ''; bVal = b.category?.name?.toLowerCase() || ''; break
        case 'price':    aVal = a.price || 0; bVal = b.price || 0; break
        default:         aVal = new Date(a.startTime); bVal = new Date(b.startTime)
      }
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
})

const pastEvents = computed(() => {
  const n = new Date()
  return [...events.value]
    .filter(e => new Date(e.startTime) < n)
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)) // always newest first
})

const previewData = computed(() => {
  const cat = categories.value.find(c => c._id === form.value.category)
  const image = eventImagePreview.value || (cat?.defaultImageUrl ? getFullImageUrl(cat.defaultImageUrl) : null) || '/images/placeholders/event_default_bw.webp'
  return {
    title: form.value.title || 'Event-Titel',
    description: form.value.description,
    image,
    category: cat || null,
    extra_label: form.value.extra_label,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
    room: form.value.room ? form.value.room.split(',').map(r => r.trim()).filter(Boolean) : [],
    price: parseFloat(form.value.price) || 0,
    link_text: form.value.link_text,
    link_url: form.value.link_url,
  }
})

function previewFormatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
}

function previewFormatTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'
}

function previewFormatTimeRange(start, end) {
  if (!start) return ''
  const s = previewFormatTime(start)
  if (!end) return s
  const e = new Date(end).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  return `${s} – ${e} Uhr`
}

function previewFormatPrice(price) {
  if (!price || price === 0) return 'Eintritt frei'
  return `${price}€`
}

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
  return cat?.defaultImageUrl ? getFullImageUrl(cat.defaultImageUrl) : null
})

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchEvents(), fetchCategories(), fetchRooms(), fetchUsers(), fetchInstagramSettings(), fetchJobs(), fetchDrinksSettings()])
  loading.value = false
  
  // Close context menu on click outside
  document.addEventListener('click', closeContextMenu)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeContextMenu)
})

// Methods
async function fetchUsers() {
  usersLoading.value = true
  try {
    const { data } = await api.get('/users')
    users.value = data
  } catch (err) {
    console.error('Fehler beim Laden der Admins:', err)
  } finally {
    usersLoading.value = false
  }
}

async function createUser() {
  userFormError.value = ''
  if (!userForm.value.name.trim()) { userFormError.value = 'Name erforderlich'; return }
  if (!userForm.value.email.trim()) { userFormError.value = 'E-Mail erforderlich'; return }
  if (!userForm.value.password) { userFormError.value = 'Passwort erforderlich'; return }
  if (userForm.value.password !== userForm.value.passwordConfirm) { userFormError.value = 'Passwörter stimmen nicht überein'; return }
  if (userForm.value.password.length < 6) { userFormError.value = 'Passwort muss mindestens 6 Zeichen lang sein'; return }
  userFormLoading.value = true
  try {
    await api.post('/users/register', {
      name: userForm.value.name,
      email: userForm.value.email,
      password: userForm.value.password
    })
    userForm.value = { name: '', email: '', password: '', passwordConfirm: '' }
    showUserModal.value = false
    await fetchUsers()
  } catch (err) {
    userFormError.value = err.response?.data?.msg || 'Fehler beim Erstellen des Admins'
  } finally {
    userFormLoading.value = false
  }
}

async function deleteUser(id) {
  try {
    await api.delete(`/users/${id}`)
    userDeleteConfirm.value = null
    await fetchUsers()
  } catch (err) {
    console.error('Fehler beim Löschen:', err)
  }
}

function openEditUserModal(user) {
  editingUser.value = user
  editUserForm.value = { name: user.name || '', email: user.email, password: '', passwordConfirm: '' }
  editUserFormError.value = ''
  showEditUserModal.value = true
}

function closeEditUserModal() {
  showEditUserModal.value = false
  editingUser.value = null
  editUserForm.value = { name: '', email: '', password: '', passwordConfirm: '' }
  editUserFormError.value = ''
}

async function updateUser() {
  editUserFormError.value = ''
  if (!editUserForm.value.email.trim()) { editUserFormError.value = 'E-Mail erforderlich'; return }
  if (editUserForm.value.password && editUserForm.value.password.length < 6) {
    editUserFormError.value = 'Passwort muss mindestens 6 Zeichen lang sein'; return
  }
  if (editUserForm.value.password && editUserForm.value.password !== editUserForm.value.passwordConfirm) {
    editUserFormError.value = 'Passwörter stimmen nicht überein'; return
  }
  editUserFormLoading.value = true
  try {
    await api.put(`/users/update/${editingUser.value._id}`, {
      name: editUserForm.value.name,
      email: editUserForm.value.email
    })
    if (editUserForm.value.password) {
      await api.put(`/users/${editingUser.value._id}/reset-password`, {
        password: editUserForm.value.password
      })
    }
    closeEditUserModal()
    await fetchUsers()
  } catch (err) {
    editUserFormError.value = err.response?.data?.msg || 'Fehler beim Aktualisieren'
  } finally {
    editUserFormLoading.value = false
  }
}

async function fetchRooms() {
  roomsLoading.value = true
  try {
    const { data } = await api.get('/rooms')
    roomsData.value = data
  } catch (err) {
    console.error('Fehler beim Laden der Räume:', err)
  } finally {
    roomsLoading.value = false
  }
}

async function fetchDrinksSettings() {
  try {
    const { data } = await api.get('/settings')
    drinksPdfUrl.value = data?.drinksPdfUrl || ''
  } catch (err) {
    console.error('Fehler beim Laden der Drinks-Einstellungen:', err)
  }
}

async function uploadDrinksPdf(event) {
  const file = event.target.files?.[0]
  if (!file) return
  drinksPdfError.value = ''
  drinksPdfSuccess.value = false
  drinksPdfUploading.value = true
  try {
    const formData = new FormData()
    formData.append('pdf', file)
    const { data } = await api.post('/upload/drinks-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    drinksPdfUrl.value = data.pdfUrl
    drinksPdfSuccess.value = true
    setTimeout(() => { drinksPdfSuccess.value = false }, 4000)
  } catch (err) {
    drinksPdfError.value = err.response?.data?.error || 'Fehler beim Hochladen'
  } finally {
    drinksPdfUploading.value = false
    if (drinksPdfInput.value) drinksPdfInput.value.value = ''
  }
}

async function fetchInstagramSettings() {
  try {
    const { data } = await api.get('/settings')
    // Populate URL fields with the stored ID so the user sees what's active
    instagramUrlLeft.value = data?.instagram?.postLeft
      ? `https://www.instagram.com/p/${data.instagram.postLeft}/`
      : ''
    instagramUrlRight.value = data?.instagram?.postRight
      ? `https://www.instagram.com/p/${data.instagram.postRight}/`
      : ''
  } catch (err) {
    console.error('Fehler beim Laden der Instagram-Einstellungen:', err)
  }
}

async function saveInstagramSettings() {
  instagramSaveError.value = ''
  const left = instagramIdLeft.value
  const right = instagramIdRight.value
  if (!left || !right) {
    instagramSaveError.value = 'Bitte gültige Instagram-Links eingeben'
    return
  }
  instagramSaving.value = true
  try {
    await api.put('/settings/instagram', { postLeft: left, postRight: right })
    instagramSaveSuccess.value = true
    setTimeout(() => { instagramSaveSuccess.value = false }, 3000)
  } catch (err) {
    instagramSaveError.value = err.response?.data?.msg || 'Fehler beim Speichern'
  } finally {
    instagramSaving.value = false
  }
}

function handleDescriptionSelect(event) {
  const textarea = event.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
  if (start !== end && textarea.value) {
    const selectedText = textarea.value.substring(start, end).trim();
    if (selectedText.length > 0) {
      linkTooltipSelectionStart.value = start;
      linkTooltipSelectionEnd.value = end;
      
      const rect = textarea.getBoundingClientRect();
      
      let x = event.clientX;
      let y = event.clientY;
      
      // If triggered by keyboard, event.clientX is undefined
      if (x === undefined || y === undefined) {
        x = rect.left + (rect.width / 2);
        y = rect.top + 30; // Just slightly below the top of the textarea
      }
      
      linkTooltipX.value = x;
      linkTooltipY.value = y - 10; // Pop up slightly above the cursor/position
      
      linkTooltipUrl.value = 'https://';
      linkTooltipVisible.value = true;
      return;
    }
  }
  linkTooltipVisible.value = false;
}

function insertLink() {
  const url = linkTooltipUrl.value.trim();
  if (!url || url === 'https://') {
    linkTooltipVisible.value = false;
    return;
  }
  
  const start = linkTooltipSelectionStart.value;
  const end = linkTooltipSelectionEnd.value;
  const text = roomForm.value.description;
  const selectedText = text.substring(start, end);
  
  const insertString = `[${selectedText}](${url})`;
  roomForm.value.description = text.substring(0, start) + insertString + text.substring(end);
  
  linkTooltipVisible.value = false;
}

function openRoomEditor(sketch, index) {
  const spot = roomsData.value[sketch][index]
  editingRoom.value = { sketch, index }
  roomForm.value = JSON.parse(JSON.stringify(spot))
  if (!Array.isArray(roomForm.value.features)) roomForm.value.features = []
  if (!Array.isArray(roomForm.value.images)) roomForm.value.images = []
  roomFeatureInput.value = ''
}

function addRoomFeature() {
  const val = roomFeatureInput.value.trim()
  if (val && !roomForm.value.features.includes(val)) {
    roomForm.value.features.push(val)
  }
  roomFeatureInput.value = ''
}

function removeRoomFeature(index) {
  roomForm.value.features.splice(index, 1)
}

async function saveRoom() {
  if (!editingRoom.value) return
  roomsSaving.value = true
  roomsSaveSuccess.value = false
  try {
    const { sketch, index } = editingRoom.value
    const { id, images, ...fields } = roomForm.value
    await api.patch(`/rooms/${sketch}/${id}`, fields)
    roomsData.value[sketch][index] = { ...roomsData.value[sketch][index], ...fields }
    roomsSaveSuccess.value = true
    setTimeout(() => { roomsSaveSuccess.value = false }, 3000)
  } catch (err) {
    console.error('Fehler beim Speichern:', err)
    alert('Fehler beim Speichern der Raumdaten.')
  } finally {
    roomsSaving.value = false
  }
}

async function uploadRoomImagesFromFiles(files) {
  if (!files?.length) return
  roomImagesUploading.value = true
  try {
    const { sketch, index } = editingRoom.value
    const id = roomsData.value[sketch][index].id
    const formData = new FormData()
    for (const file of files) formData.append('images', file)
    const { data } = await api.post(`/rooms/${sketch}/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    roomForm.value.images = data.images
    roomsData.value[sketch][index].images = data.images
  } catch (e) {
    alert('Fehler beim Hochladen der Bilder.')
  } finally {
    roomImagesUploading.value = false
  }
}

async function uploadRoomImages(event) {
  const files = event.target.files
  await uploadRoomImagesFromFiles(files)
  event.target.value = ''
}

async function onRoomFileDrop(event) {
  roomDropActive.value = false
  await uploadRoomImagesFromFiles(event.dataTransfer.files)
}

async function deleteRoomImage(filename) {
  if (!confirm(`Bild "${filename}" wirklich löschen?`)) return
  const { sketch, index } = editingRoom.value
  const id = roomsData.value[sketch][index].id
  try {
    const { data } = await api.delete(`/rooms/${sketch}/${id}/images/${encodeURIComponent(filename)}`)
    roomForm.value.images = data.images
    roomsData.value[sketch][index].images = data.images
  } catch (e) {
    alert('Fehler beim Löschen des Bildes.')
  }
}

async function onImageDrop(targetIdx) {
  const fromIdx = dragImageIdx.value
  dragOverIdx.value = null
  dragImageIdx.value = null
  if (fromIdx === null || fromIdx === targetIdx) return
  const imgs = [...roomForm.value.images]
  const [moved] = imgs.splice(fromIdx, 1)
  imgs.splice(targetIdx, 0, moved)
  roomForm.value.images = imgs
  const { sketch, index } = editingRoom.value
  const id = roomsData.value[sketch][index].id
  try {
    await api.put(`/rooms/${sketch}/${id}/images/order`, { images: imgs })
    roomsData.value[sketch][index].images = imgs
  } catch (e) {
    console.error('Reihenfolge konnte nicht gespeichert werden', e)
  }
}

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
    extra_label: event.extra_label || '',
    link_text: event.link_text || '',
    link_url: event.link_url || ''
  }
  // Vorschau für bestehendes Event-Bild
  if (event.eventImageUrl) {
    eventImagePreview.value = getFullImageUrl(event.eventImageUrl)
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
    extra_label: '',
    link_text: '',
    link_url: ''
  }
  eventImageFile.value = null
  eventImagePreview.value = ''
  formError.value = ''
}

function formatDateTimeLocal(dateStr) {
  const d = new Date(dateStr)
  return d.toISOString().slice(0, 16)
}

function formatDateLocal(dateStr) {
  const d = new Date(dateStr)
  return d.toISOString().slice(0, 10)
}

function contrastColor(hex) {
  if (!hex) return '#ffffff'
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  // Perceived luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
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

      eventImageUrl = uploadResponse.data.imageUrl
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
      extra_label: form.value.extra_label || null,
      link_text: form.value.link_text || null,
      link_url: form.value.link_url || null
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

function openImageCropper(file, mode) {
  if (!file) return
  originalFileName.value = file.name
  croppingMode.value = mode
  const reader = new FileReader()
  reader.onload = (e) => {
    cropperImage.value = e.target.result
    showCropperModal.value = true
  }
  reader.readAsDataURL(file)
}

function handleCategoryImageChange(event) {
  openImageCropper(event.target.files[0], 'category')
}

function handleEventImageChange(event) {
  openImageCropper(event.target.files[0], 'event')
}

function onEventImageDrop(event) {
  eventDropActive.value = false
  openImageCropper(event.dataTransfer.files[0], 'event')
}

function onCategoryImageDrop(event) {
  categoryDropActive.value = false
  openImageCropper(event.dataTransfer.files[0], 'category')
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
    const imageUrl = uploadResponse.data.imageUrl
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
// --- JOBS METHODS ---
async function fetchJobs() {
  jobsLoading.value = true
  try {
    const { data } = await api.get('/jobs')
    jobs.value = data
  } catch (err) {
    console.error('Fehler beim Laden der Jobs:', err)
  } finally {
    jobsLoading.value = false
  }
}

function openNewJobModal() {
  editingJob.value = null
  resetJobForm()
  showJobModal.value = true
}

function openEditJobModal(job) {
  editingJob.value = job
  jobForm.value = {
    title: job.title || '',
    description: job.description || '',
    type: job.type || '',
    startTime: job.startTime ? formatDateLocal(job.startTime) : '',
    endTime: job.endTime ? formatDateLocal(job.endTime) : '',
    extra_label: job.extra_label || '',
    link_url: job.link_url || '',
    link_text: job.link_text || '',
    isActive: job.isActive !== false
  }
  jobFormError.value = ''
  showJobModal.value = true
}

function closeJobModal() {
  showJobModal.value = false
  editingJob.value = null
  resetJobForm()
}

function resetJobForm() {
  jobForm.value = {
    title: '',
    description: '',
    type: '',
    startTime: '',
    endTime: '',
    extra_label: '',
    link_url: '',
    link_text: '',
    isActive: true
  }
  jobFormError.value = ''
}

async function handleJobSubmit() {
  jobFormError.value = ''
  if (!jobForm.value.title.trim()) {
    jobFormError.value = 'Bitte füllen Sie den Titel aus'
    return
  }
  jobFormLoading.value = true
  try {
    const payload = { ...jobForm.value }
    if (!payload.startTime) payload.startTime = null
    if (!payload.endTime) payload.endTime = null
    
    if (editingJob.value) {
      await api.put(`/jobs/${editingJob.value._id}`, payload)
    } else {
      await api.post('/jobs', payload)
    }
    await fetchJobs()
    closeJobModal()
  } catch (err) {
    jobFormError.value = err.response?.data?.msg || err.response?.data?.error || 'Ein Fehler ist aufgetreten'
  } finally {
    jobFormLoading.value = false
  }
}

async function deleteJob(job) {
  if (!confirm(`Möchten Sie den Job "${job.title}" wirklich löschen?`)) return
  try {
    await api.delete(`/jobs/${job._id}`)
    await fetchJobs()
  } catch (err) {
    alert('Fehler beim Löschen: ' + (err.response?.data?.msg || err.message))
  }
}
</script>

<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <a :href="BASE_URL" class="logo-link">
          <img src="@/assets/icons/Pallas_Logo_III.svg" alt="Pallas Logo" class="logo" />
        </a>
        <button @click="toggleMobileMenu" class="hamburger-btn">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <div class="mobile-menu-wrapper" :class="{ open: mobileMenuOpen }">
        <nav class="sidebar-nav">
          <a href="#" class="nav-item" :class="{ active: activeSection === 'events' }" @click.prevent="activeSection = 'events'">
            Events
          </a>
          <a href="#" class="nav-item" :class="{ active: activeSection === 'rooms' }" @click.prevent="activeSection = 'rooms'">
            Räume
          </a>
          <a href="#" class="nav-item" :class="{ active: activeSection === 'users' }" @click.prevent="activeSection = 'users'">
            Benutzer
          </a>
          <a href="#" class="nav-item" :class="{ active: activeSection === 'instagram' }" @click.prevent="activeSection = 'instagram'">
            Instagram
          </a>
          <a href="#" class="nav-item" :class="{ active: activeSection === 'jobs' }" @click.prevent="activeSection = 'jobs'; toggleMobileMenu()">
            Jobs
          </a>
          <a href="#" class="nav-item" :class="{ active: activeSection === 'drinks' }" @click.prevent="activeSection = 'drinks'; toggleMobileMenu()">
            Drinks
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
        <button v-if="activeSection === 'events'" @click="openNewEventModal" class="btn-primary">
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
        <section v-if="activeSection === 'events'" class="section">
          <div class="section-header">
            <h2>Demnächst <span class="event-count">({{ futureEvents.length }})</span></h2>
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

          <div v-if="futureEvents.length === 0" class="empty-state">
            <p>Keine kommenden Events vorhanden</p>
            <button @click="openNewEventModal" class="btn-secondary">Event erstellen</button>
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
                <tr v-for="event in futureEvents" :key="event._id">
                  <td>{{ event.title }}</td>
                  <td>
                    <span class="category-badge" :style="{ backgroundColor: event.category?.color || '#333', '--badge-color': contrastColor(event.category?.color) }">
                      {{ event.category?.name || 'Keine' }}
                    </span>
                  </td>
                  <td>{{ formatDate(event.startTime) }}</td>
                  <td>{{ Array.isArray(event.room) ? event.room.join(', ') : event.room }}</td>
                  <td>{{ event.price ? `${event.price} €` : 'Kostenlos' }}</td>
                  <td>
                    <div class="actions">
                      <button class="btn-icon" @click="openEditEventModal(event)" title="Bearbeiten">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button class="btn-icon danger" @click="deleteEvent(event)" title="Löschen">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- History -->
          <div class="history-header" @click="historyOpen = !historyOpen">
            <h2>Vergangene Events <span class="event-count">({{ pastEvents.length }})</span></h2>
            <span class="history-toggle">{{ historyOpen ? '↑' : '↓' }}</span>
          </div>

          <div v-if="historyOpen" class="events-table history-table">
            <table>
              <thead>
                <tr>
                  <th>Titel</th>
                  <th>Kategorie</th>
                  <th>Datum</th>
                  <th>Raum</th>
                  <th>Preis</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in pastEvents" :key="event._id" class="past-row">
                  <td>{{ event.title }}</td>
                  <td>
                    <span class="category-badge" :style="{ backgroundColor: event.category?.color || '#333', '--badge-color': contrastColor(event.category?.color) }">
                      {{ event.category?.name || 'Keine' }}
                    </span>
                  </td>
                  <td>{{ formatDate(event.startTime) }}</td>
                  <td>{{ Array.isArray(event.room) ? event.room.join(', ') : event.room }}</td>
                  <td>{{ event.price ? `${event.price} €` : 'Kostenlos' }}</td>
                  <td>
                    <div class="actions">
                      <button class="btn-icon" @click="openEditEventModal(event)" title="Bearbeiten">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button class="btn-icon danger" @click="deleteEvent(event)" title="Löschen">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Users Section -->
        <section v-if="activeSection === 'users'" class="section">
          <div class="section-header">
            <h2>Admins</h2>
            <button @click="showUserModal = true" class="btn-primary">+ Admin erstellen</button>
          </div>

          <div v-if="usersLoading" class="loading-state"><div class="spinner"></div></div>
          <div v-else class="users-list">
            <div v-for="u in users" :key="u._id" class="user-row">
              <div class="user-info-block">
                <div class="user-row-name-line">
                  <span class="user-row-name">{{ u.name || '–' }}</span>
                </div>
                <span class="user-row-email">{{ u.email }}</span>
              </div>
              <div class="user-row-meta">
                <span class="user-row-date">Erstellt: {{ new Date(u.date).toLocaleDateString('de-DE') }}</span>
                <span v-if="u._id === authState.user?._id || u._id === authState.user?.id" class="user-row-self">(Du)</span>
              </div>
              <div class="user-row-actions">
                <template v-if="!u.isLegacy">
                  <button class="btn-edit-sm" @click="openEditUserModal(u)">Bearbeiten</button>
                  <button
                    v-if="u._id !== authState.user?._id && u._id !== authState.user?.id"
                    class="btn-danger-sm"
                    @click="userDeleteConfirm = u._id"
                  >Löschen</button>
                </template>
              </div>
            </div>
            <div v-if="users.length === 0" class="empty-state"><p>Keine Admins gefunden</p></div>
          </div>
        </section>

        <!-- Rooms Section -->
        <section v-if="activeSection === 'rooms'" class="section">
          <div class="section-header">
            <h2>Räume &amp; Hotspots</h2>
          </div>

          <div v-if="roomsLoading" class="loading-state"><div class="spinner"></div></div>
          <div v-else class="rooms-editor">

            <!-- Spot List -->
            <div class="rooms-spot-list">
              <div
                v-for="(sketch, sketchKey) in roomsData"
                :key="sketchKey"
                class="rooms-sketch-group"
              >
                <p class="rooms-sketch-label">{{ sketchKey === 'sketch1' ? 'Sketch 1 – Bar/DJ' : 'Sketch 2 – Weitere Räume' }}</p>
                <button
                  v-for="(spot, idx) in sketch"
                  :key="spot.id"
                  class="rooms-spot-btn"
                  :class="{ active: editingRoom && editingRoom.sketch === sketchKey && editingRoom.index === idx }"
                  @click="openRoomEditor(sketchKey, idx)"
                >
                  {{ spot.label }}
                </button>
              </div>
            </div>

            <!-- Editor Form -->
            <div v-if="editingRoom" class="rooms-form">
              <h3 class="rooms-form-title">{{ roomForm.label }}</h3>

              <div class="form-group">
                <label>Label</label>
                <input v-model="roomForm.label" class="form-input" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Kapazität</label>
                  <input v-model="roomForm.capacity" class="form-input" placeholder="z.B. 300 Personen" />
                </div>
                <div class="form-group">
                  <label>Fläche</label>
                  <input v-model="roomForm.area" class="form-input" placeholder="z.B. 170 qm" />
                </div>
              </div>

              <div class="form-group">
                <label>Beschreibung</label>
                <div class="textarea-wrapper" style="position: relative;">
                  <textarea 
                    v-model="roomForm.description" 
                    class="form-input rooms-textarea" 
                    rows="6"
                    @mouseup="handleDescriptionSelect"
                    @keyup="handleDescriptionSelect"
                  ></textarea>
                  <!-- Link Tooltip -->
                  <div 
                    v-if="linkTooltipVisible" 
                    class="link-tooltip"
                    :style="{ left: linkTooltipX + 'px', top: (linkTooltipY - 20) + 'px' }"
                  >
                    <input 
                      v-model="linkTooltipUrl" 
                      type="text" 
                      placeholder="https://" 
                      class="link-tooltip-input"
                      @keydown.enter.prevent="insertLink"
                    />
                    <button @click.prevent="insertLink" class="btn-primary btn-sm link-tooltip-btn">Link einfügen</button>
                    <button @click.prevent="linkTooltipVisible = false" class="btn-icon link-tooltip-close">×</button>
                  </div>
                </div>
                <small class="form-help">Links mit folgendem Format einfügen: [Linktext](https://example.com) oder Text markieren.</small>
              </div>

              <div class="form-group">
                <label>Features</label>
                <div class="feature-tags-editor">
                  <span
                    v-for="(f, fi) in roomForm.features"
                    :key="fi"
                    class="feature-tag-edit"
                  >
                    {{ f }}
                    <button @click="removeRoomFeature(fi)" class="feature-tag-remove">×</button>
                  </span>
                </div>
                <div class="feature-add-row">
                  <input
                    v-model="roomFeatureInput"
                    class="form-input"
                    placeholder="Feature hinzufügen…"
                    @keydown.enter.prevent="addRoomFeature"
                  />
                  <button @click="addRoomFeature" class="btn-secondary">+</button>
                </div>
              </div>

              <div class="form-group">
                <label>Zusatztext (optional)</label>
                <input v-model="roomForm.extraText" class="form-input" placeholder="z.B. Kombination mit Bar 5 möglich" />
              </div>

              <!-- Image Management -->
              <div class="form-group">
                <div class="room-images-header">
                  <label>Bilder</label>
                  <input
                    ref="roomImageInput"
                    type="file"
                    accept="image/*"
                    multiple
                    class="hidden-file-input"
                    @change="uploadRoomImages"
                  />
                </div>

                <div
                  class="room-drop-area"
                  :class="{ 'room-drop-area--active': roomDropActive, 'room-drop-area--uploading': roomImagesUploading }"
                  @dragover.prevent="roomDropActive = true"
                  @dragleave.self="roomDropActive = false"
                  @drop.prevent="onRoomFileDrop"
                >
                  <div v-if="roomForm.images?.length" class="room-images-grid">
                    <div
                      v-for="(img, imgIdx) in roomForm.images"
                      :key="img"
                      class="room-img-item"
                      draggable="true"
                      :class="{ 'is-drag-over': dragOverIdx === imgIdx }"
                      @dragstart="dragImageIdx = imgIdx"
                      @dragover.prevent.stop="dragOverIdx = imgIdx"
                      @dragleave="dragOverIdx = null"
                      @drop.prevent.stop="onImageDrop(imgIdx)"
                    >
                      <img
                        :src="img.startsWith('http') ? img : `${API_BASE}/uploads/rooms/${roomForm.imageFolder}/${img}`"
                        class="room-img-thumb"
                        :alt="img"
                      />
                      <button
                        type="button"
                        class="img-delete-btn"
                        title="Löschen"
                        @click="deleteRoomImage(img)"
                      >×</button>
                      <div class="img-drag-handle" title="Zum Sortieren ziehen">⠿</div>
                    </div>
                  </div>

                  <div class="room-drop-hint" @click="roomImageInput.click()">
                    <span v-if="roomImagesUploading">Lädt hoch…</span>
                    <span v-else-if="roomDropActive">Loslassen zum Hochladen</span>
                    <span v-else>{{ roomForm.images?.length ? '+ Weitere Bilder' : '+ Bilder ablegen oder klicken' }}</span>
                  </div>
                </div>
              </div>

              <div class="rooms-form-actions">
                <button @click="saveRoom" class="btn-primary" :disabled="roomsSaving">
                  {{ roomsSaving ? 'Speichern…' : 'Speichern' }}
                </button>
                <span v-if="roomsSaveSuccess" class="save-success">✓ Gespeichert</span>
              </div>
            </div>
            <div v-else class="rooms-empty-hint">
              <p>Wähle links einen Raum zum Bearbeiten aus.</p>
            </div>
          </div>
        </section>

        <!-- Instagram Settings Section -->
        <section v-if="activeSection === 'instagram'" class="section">
          <div class="section-header">
            <h2>Instagram Posts</h2>
          </div>
          <div class="instagram-settings">
            <p class="instagram-settings-hint">Instagram-Link des Posts einfügen, z.B. <code>https://www.instagram.com/p/DVTYNbNDATB/</code></p>
            <div class="form-group">
              <label>Linker Post (unten links)</label>
              <input v-model="instagramUrlLeft" class="form-input" placeholder="https://www.instagram.com/p/…" />
              <div class="post-id-preview" :class="{ valid: instagramIdLeft, invalid: instagramUrlLeft && !instagramIdLeft }">
                <template v-if="instagramIdLeft">
                  ID: <code>{{ instagramIdLeft }}</code>
                  <a :href="`https://www.instagram.com/p/${instagramIdLeft}/`" target="_blank" rel="noopener noreferrer" class="post-preview-link">↗ öffnen</a>
                </template>
                <template v-else-if="instagramUrlLeft">Ungültiger Link</template>
              </div>
            </div>
            <div class="form-group">
              <label>Rechter Post (oben rechts)</label>
              <input v-model="instagramUrlRight" class="form-input" placeholder="https://www.instagram.com/p/…" />
              <div class="post-id-preview" :class="{ valid: instagramIdRight, invalid: instagramUrlRight && !instagramIdRight }">
                <template v-if="instagramIdRight">
                  ID: <code>{{ instagramIdRight }}</code>
                  <a :href="`https://www.instagram.com/p/${instagramIdRight}/`" target="_blank" rel="noopener noreferrer" class="post-preview-link">↗ öffnen</a>
                </template>
                <template v-else-if="instagramUrlRight">Ungültiger Link</template>
              </div>
            </div>
            <div class="instagram-settings-actions">
              <button @click="saveInstagramSettings" class="btn-primary" :disabled="instagramSaving || !instagramIdLeft || !instagramIdRight">
                {{ instagramSaving ? 'Speichern…' : 'Speichern' }}
              </button>
              <span v-if="instagramSaveSuccess" class="save-success">✓ Gespeichert</span>
              <span v-if="instagramSaveError" class="save-error">{{ instagramSaveError }}</span>
            </div>
          </div>
        </section>

        <!-- Jobs Section -->
        <section v-if="activeSection === 'jobs'" class="section fade-in">
          <div class="section-header">
            <h2>Jobs verwalten</h2>
            <div class="actions">
              <button class="btn-primary" @click="openNewJobModal">
                Neuer Job
              </button>
            </div>
          </div>
          
          <div class="events-table glass-panel">
            <div v-if="jobsLoading" class="loading-state">
              <div class="spinner"></div>
              <p>Jobs werden geladen...</p>
            </div>
            <div v-else class="table-responsive">
              <table v-if="jobs.length > 0">
                <thead>
                  <tr>
                    <th>Titel</th>
                    <th>Status</th>
                    <th>Art</th>
                    <th>Start</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="job in jobs" :key="job._id">
                    <td>
                      <div class="event-info">
                        <strong>{{ job.title }}</strong>
                      </div>
                    </td>
                    <td>
                      <span class="category-badge" :style="{ backgroundColor: job.isActive !== false ? '#4caf50' : '#f44336' }">
                        {{ job.isActive !== false ? 'Aktiv' : 'Inaktiv' }}
                      </span>
                    </td>
                    <td>{{ job.type || '-' }}</td>
                    <td>{{ job.startTime ? formatDate(job.startTime) : '-' }}</td>
                    <td>
                      <div class="actions">
                        <button class="btn-icon" @click="openEditJobModal(job)" title="Bearbeiten">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon danger" @click="deleteJob(job)" title="Löschen">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="empty-state">
                <p>Keine Jobs gefunden</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Drinks PDF Section -->
        <section v-if="activeSection === 'drinks'" class="section">
          <div class="section-header">
            <h2>Drinks Karte</h2>
          </div>
          <div class="drinks-pdf-settings">
            <p class="instagram-settings-hint">Lade hier die aktuelle Drinks-Karte als PDF hoch. Sie wird sofort auf der Website angezeigt.</p>

            <div class="form-group">
              <label>Aktuelle Karte</label>
              <div v-if="drinksPdfUrl" class="drinks-pdf-current">
                <a :href="drinksPdfUrl" target="_blank" rel="noopener" class="drinks-pdf-link">↗ Aktuelle PDF öffnen</a>
              </div>
              <p v-else class="drinks-pdf-none">Noch keine PDF hochgeladen – es wird die Standardkarte verwendet.</p>
            </div>

            <div class="form-group">
              <label>Neue PDF hochladen</label>
              <div
                class="room-drop-area"
                :class="{ 'room-drop-area--uploading': drinksPdfUploading }"
                @click="drinksPdfInput.click()"
              >
                <input
                  ref="drinksPdfInput"
                  type="file"
                  accept="application/pdf,.pdf"
                  class="hidden-file-input"
                  @change="uploadDrinksPdf"
                />
                <div class="room-drop-hint">
                  <span v-if="drinksPdfUploading">Lädt hoch…</span>
                  <span v-else>PDF hier ablegen oder klicken</span>
                </div>
              </div>
            </div>

            <div class="instagram-settings-actions">
              <span v-if="drinksPdfSuccess" class="save-success">✓ Erfolgreich hochgeladen</span>
              <span v-if="drinksPdfError" class="save-error">{{ drinksPdfError }}</span>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Job Modal -->
    <Teleport to="body">
      <div v-if="showJobModal" class="modal-overlay" @click.self="closeJobModal">
        <div class="modal modal-large">
          <div class="modal-header">
            <h2>{{ editingJob ? 'Job bearbeiten' : 'Neuer Job' }}</h2>
            <button @click="closeJobModal" class="close-btn">×</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="handleJobSubmit" class="modal-form">
              <div class="form-row">
                <div class="form-group" style="flex: 2;">
                  <label>Titel *</label>
                  <input v-model="jobForm.title" type="text" required placeholder="z.B. Barkeeper (m/w/d)">
                </div>
                <div class="form-group" style="flex: 1;">
                  <label>Status</label>
                  <select v-model="jobForm.isActive">
                    <option :value="true">Aktiv</option>
                    <option :value="false">Inaktiv</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label>Beschreibung</label>
                <textarea v-model="jobForm.description" rows="4" placeholder="Job-Details..."></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Startzeitraum (Optional)</label>
                  <input v-model="jobForm.startTime" type="date">
                </div>
                <div class="form-group">
                  <label>Endzeitraum (Optional)</label>
                  <input v-model="jobForm.endTime" type="date">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Art</label>
                  <input v-model="jobForm.type" type="text" placeholder="z.B. Vollzeit">
                </div>
                <div class="form-group">
                  <label>Extra Label</label>
                  <input v-model="jobForm.extra_label" type="text" placeholder="z.B. Ab sofort">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Button Text</label>
                  <input v-model="jobForm.link_text" type="text" placeholder="z.B. Jetzt bewerben">
                </div>
                <div class="form-group">
                  <label>Button Link (URL)</label>
                  <input v-model="jobForm.link_url" type="text" placeholder="mailto:... oder https://...">
                </div>
              </div>
              
              <div v-if="jobFormError" class="error-message">
                {{ jobFormError }}
              </div>
              
              <div class="modal-actions">
                <button type="button" class="btn-secondary" @click="closeJobModal">Abbrechen</button>
                <button type="submit" class="btn-primary" :disabled="jobFormLoading">
                  {{ jobFormLoading ? 'Wird gespeichert...' : 'Speichern' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Create Admin Modal -->
    <Teleport to="body">
      <div v-if="showUserModal" class="modal-overlay" @click.self="showUserModal = false; userFormError = ''">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2>Neuen Admin erstellen</h2>
            <button @click="showUserModal = false; userFormError = ''" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Name</label>
              <input v-model="userForm.name" type="text" placeholder="Name" />
            </div>
            <div class="form-group">
              <label>E-Mail *</label>
              <input v-model="userForm.email" type="email" placeholder="admin@example.com" />
            </div>
            <div class="form-group">
              <label>Passwort *</label>
              <input v-model="userForm.password" type="password" placeholder="Mindestens 6 Zeichen" />
            </div>
            <div class="form-group">
              <label>Passwort bestätigen *</label>
              <input v-model="userForm.passwordConfirm" type="password" placeholder="Passwort wiederholen" />
            </div>
            <div v-if="userFormError" class="error-message">{{ userFormError }}</div>
          </div>
          <div class="modal-footer">
            <button @click="showUserModal = false; userFormError = ''" class="btn-secondary">Abbrechen</button>
            <button @click="createUser" class="btn-primary" :disabled="userFormLoading">
              {{ userFormLoading ? 'Erstelle...' : 'Admin erstellen' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Admin Confirm Modal -->
    <Teleport to="body">
      <div v-if="userDeleteConfirm" class="modal-overlay" @click.self="userDeleteConfirm = null">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2>Admin löschen</h2>
            <button @click="userDeleteConfirm = null" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <p>Möchtest du diesen Admin wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
          </div>
          <div class="modal-footer">
            <button @click="userDeleteConfirm = null" class="btn-secondary">Abbrechen</button>
            <button @click="deleteUser(userDeleteConfirm)" class="btn-danger">Löschen</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Admin Modal -->
    <Teleport to="body">
      <div v-if="showEditUserModal" class="modal-overlay" @click.self="closeEditUserModal">
        <div class="modal modal-sm">
          <div class="modal-header">
            <h2>Admin bearbeiten</h2>
            <button @click="closeEditUserModal" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Name</label>
              <input v-model="editUserForm.name" type="text" placeholder="Name" />
            </div>
            <div class="form-group">
              <label>E-Mail *</label>
              <input v-model="editUserForm.email" type="email" placeholder="admin@example.com" />
            </div>
            <div class="edit-user-section-divider">Passwort zurücksetzen (optional)</div>
            <div class="form-group">
              <label>Neues Passwort</label>
              <input v-model="editUserForm.password" type="password" placeholder="Leer lassen = nicht ändern" />
            </div>
            <div class="form-group">
              <label>Passwort bestätigen</label>
              <input v-model="editUserForm.passwordConfirm" type="password" placeholder="Passwort wiederholen" />
            </div>
            <div v-if="editUserFormError" class="error-message">{{ editUserFormError }}</div>
          </div>
          <div class="modal-footer">
            <button @click="closeEditUserModal" class="btn-secondary">Abbrechen</button>
            <button @click="updateUser" class="btn-primary" :disabled="editUserFormLoading">
              {{ editUserFormLoading ? 'Speichert...' : 'Speichern' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Event Modal -->
    <Teleport to="body">
      <div v-if="showEventModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal modal-with-preview">
          <div class="modal-header">
            <h2>{{ editingEvent ? 'Event bearbeiten' : 'Neues Event' }}</h2>
            <div class="modal-header-actions">
              <button type="button" class="preview-toggle-btn" @click="showPreview = !showPreview">
                {{ showPreview ? 'Formular' : 'Vorschau' }}
              </button>
              <button @click="closeModal" class="close-btn">×</button>
            </div>
          </div>

          <div class="modal-body">
            <!-- Form Column -->
            <form @submit.prevent="handleSubmit" class="modal-form" :class="{ 'hidden-mobile': showPreview }">
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
                  <input
                    type="file"
                    ref="eventImageInput"
                    accept="image/*"
                    @change="handleEventImageChange"
                    style="display: none"
                  />
                  <div
                    class="image-drop-zone"
                    :class="{ 'image-drop-zone--active': eventDropActive, 'image-drop-zone--has-image': eventImagePreview || selectedCategoryImage }"
                    @dragover.prevent="eventDropActive = true"
                    @dragleave.self="eventDropActive = false"
                    @drop.prevent="onEventImageDrop"
                    @click="$refs.eventImageInput.click()"
                  >
                    <template v-if="eventImagePreview || selectedCategoryImage">
                      <img
                        :src="eventImagePreview || selectedCategoryImage"
                        alt="Event Vorschau"
                        class="drop-zone-preview-img"
                      />
                      <div class="drop-zone-overlay">
                        <span>{{ eventDropActive ? 'Loslassen' : 'Klicken oder ablegen' }}</span>
                      </div>
                      <span v-if="!eventImagePreview && selectedCategoryImage" class="fallback-badge">Default</span>
                      <span v-else-if="eventImagePreview" class="custom-badge">Eigenes Bild</span>
                    </template>
                    <template v-else>
                      <div class="drop-zone-empty">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span>{{ eventDropActive ? 'Loslassen zum Hochladen' : 'Bild ablegen oder klicken' }}</span>
                        <small>Kategorie-Bild wird als Standard verwendet</small>
                      </div>
                    </template>
                  </div>
                  <div v-if="eventImagePreview" class="image-upload-actions">
                    <button
                      type="button"
                      @click="eventImagePreview = null; eventImageFile = null"
                      class="btn btn-danger"
                    >
                      Eigenes Bild entfernen
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Extra Label</label>
                <input v-model="form.extra_label" type="text" placeholder="z.B. 'Special Guest'" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Button Text</label>
                  <input v-model="form.link_text" type="text" maxlength="15" placeholder="z.B. Tickets" />
                </div>
                <div class="form-group">
                  <label>Button Link (URL)</label>
                  <input v-model="form.link_url" type="url" placeholder="https://..." />
                </div>
              </div>

              <div v-if="formError" class="error-message">{{ formError }}</div>

              <div class="modal-actions">
                <button type="button" @click="closeModal" class="btn-secondary">Abbrechen</button>
                <button type="submit" class="btn-primary" :disabled="formLoading">
                  {{ formLoading ? 'Speichern...' : (editingEvent ? 'Aktualisieren' : 'Erstellen') }}
                </button>
              </div>
            </form>

            <!-- Preview Column -->
            <div class="modal-preview-col" :class="{ 'visible-mobile': showPreview }">
              <p class="preview-label">Vorschau</p>
              <article class="preview-event-card">
                <div class="preview-image-container">
                  <img
                    :src="previewData.image"
                    alt="Vorschau"
                    class="preview-image"
                    @error="$event.target.src = '/images/placeholders/event_default_bw.webp'"
                  />
                  <div
                    v-if="previewData.category"
                    class="preview-category-badge"
                    :style="{ backgroundColor: previewData.category.color }"
                  >
                    {{ previewData.category.name }}
                  </div>
                  <div v-if="previewData.extra_label" class="preview-extra-label">
                    {{ previewData.extra_label }}
                  </div>
                </div>

                <div class="preview-details">
                  <h3 class="preview-title">{{ previewData.title }}</h3>

                  <div class="preview-meta">
                    <div v-if="previewData.startTime" class="preview-meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span>{{ previewFormatDate(previewData.startTime) }}</span>
                    </div>
                    <div v-if="previewData.startTime" class="preview-meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      <span>{{ previewFormatTimeRange(previewData.startTime, previewData.endTime) }}</span>
                    </div>
                    <div v-if="previewData.room.length > 0" class="preview-meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      <span>{{ previewData.room.join(' & ') }}</span>
                    </div>
                  </div>

                  <p v-if="previewData.description" class="preview-description">{{ previewData.description }}</p>

                  <div class="preview-footer">
                    <span class="preview-price" :class="{ free: previewData.price === 0 }">
                      {{ previewFormatPrice(previewData.price) }}
                    </span>
                    <a
                      v-if="previewData.link_url && previewData.link_text"
                      href="#"
                      @click.prevent
                      class="preview-link-btn"
                    >{{ previewData.link_text }}</a>
                  </div>
                </div>
              </article>
            </div>
          </div>
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
              <input
                type="file"
                ref="categoryImageInput"
                @change="handleCategoryImageChange"
                accept="image/*"
                style="display: none"
              />
              <div
                class="image-drop-zone"
                :class="{ 'image-drop-zone--active': categoryDropActive, 'image-drop-zone--has-image': categoryImagePreview }"
                @dragover.prevent="categoryDropActive = true"
                @dragleave.self="categoryDropActive = false"
                @drop.prevent="onCategoryImageDrop"
                @click="$refs.categoryImageInput.click()"
              >
                <template v-if="categoryImagePreview">
                  <img :src="categoryImagePreview" alt="Vorschau" class="drop-zone-preview-img" />
                  <div class="drop-zone-overlay">
                    <span>{{ categoryDropActive ? 'Loslassen' : 'Klicken oder ablegen' }}</span>
                  </div>
                </template>
                <template v-else>
                  <div class="drop-zone-empty">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span>{{ categoryDropActive ? 'Loslassen zum Hochladen' : 'Bild ablegen oder klicken' }}</span>
                  </div>
                </template>
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
  height: 100vh;
  overflow: hidden;
  background: #0f0f1a;
  color: #fff;
}

/* Sidebar */
.sidebar {
  width: 260px;
  height: 100%;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  height: 90px;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.logo-link:hover {
  opacity: 0.8;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.content-header {
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
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

.event-count {
  font-weight: 400;
  opacity: 0.5;
  font-size: 0.9em;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  padding: 1rem 0 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  user-select: none;
}

.history-header:hover h2 {
  opacity: 0.9;
}

.history-header h2 {
  font-size: 1.1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.history-toggle {
  font-size: 1rem;
  opacity: 0.4;
}

.history-table {
  margin-top: 0.75rem;
  opacity: 0.6;
}

.past-row td {
  color: rgba(255, 255, 255, 0.5);
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
  color: var(--badge-color, #fff) !important;
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

.modal-with-preview {
  max-width: 1060px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.modal-body {
  display: flex;
  overflow: hidden;
  min-height: 0;
  flex: 1;
}

.modal-with-preview .modal-form {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
}

.modal-preview-col {
  width: 280px;
  flex-shrink: 0;
  padding: 1.25rem 1.25rem 1.5rem;
  overflow-y: auto;
  background: #13131f;
}

.preview-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 0.75rem;
}

/* Preview card — mirrors EventsPage .event-card */
.preview-event-card {
  background: #111;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border-left: 3px solid #FF9d66;
}

.preview-image-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
}

.preview-image {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: grayscale(20%) contrast(1.1);
  background: #1a1a1a;
}

.preview-category-badge {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #000;
}

.preview-extra-label {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.3rem 0.6rem;
  background: #FF9d66;
  color: #000;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.preview-details {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-title {
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1.3;
  color: #fff;
}

.preview-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.preview-meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
}

.preview-meta-item svg {
  color: #FF9d66;
  opacity: 0.7;
  flex-shrink: 0;
}

.preview-description {
  font-size: 0.8rem;
  line-height: 1.5;
  color: rgba(255,255,255,0.6);
  white-space: pre-wrap;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preview-price {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
}

.preview-price.free {
  color: #FF9d66;
}

.preview-link-btn {
  padding: 0.35rem 0.75rem;
  border: 1px solid rgba(255,157,102,0.5);
  color: #FF9d66;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-decoration: none;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: default;
}

/* Mobile: preview toggle */
.preview-toggle-btn {
  display: none;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: #fff;
  font-size: 0.8rem;
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  cursor: pointer;
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .sidebar-header {
    height: auto;
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
    height: auto;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

/* ───────────────────────────────────────────
   Rooms Editor
─────────────────────────────────────────── */
.rooms-editor {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  align-items: start;
}

.rooms-spot-list {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rooms-sketch-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rooms-sketch-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 0.25rem;
}

.rooms-spot-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.75);
  border-radius: 6px;
  padding: 0.55rem 1rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.rooms-spot-btn:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #fff;
}

.rooms-spot-btn.active {
  background: rgba(100, 108, 255, 0.15);
  border-color: rgba(100, 108, 255, 0.5);
  color: #fff;
}

.rooms-form {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rooms-form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.rooms-textarea {
  resize: vertical;
  line-height: 1.6;
  min-height: 120px;
  width: 100%;
}

.textarea-wrapper {
  width: 100%;
}

.link-tooltip {
  position: fixed;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  transform: translate(-50%, -100%);
}

.link-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: #111 transparent transparent transparent;
}

.link-tooltip-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  min-width: 150px;
}

.link-tooltip-input:focus {
  outline: none;
  border-color: #646cff;
}

.link-tooltip-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  white-space: nowrap;
}

.link-tooltip-close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.2rem;
  line-height: 1;
}

.link-tooltip-close:hover {
  color: #fff;
}

.feature-tags-editor {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  min-height: 2rem;
}

.feature-tag-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(100, 108, 255, 0.12);
  border: 1px solid rgba(100, 108, 255, 0.3);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.feature-tag-remove {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  transition: color 0.15s;
}

.feature-tag-remove:hover {
  color: #ff6b6b;
}

.feature-add-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.feature-add-row .form-input {
  flex: 1;
}

.rooms-form-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.rooms-empty-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* Room Image Management */
.room-images-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.875rem;
}

.room-images-header label {
  margin: 0;
}

.hidden-file-input {
  display: none;
}

.btn-sm {
  padding: 0.35rem 0.85rem;
  font-size: 0.82rem;
}

.room-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.75rem;
}

.room-img-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  cursor: grab;
  aspect-ratio: 1;
  transition: border-color 0.15s;
  user-select: none;
}

.room-img-item:active {
  cursor: grabbing;
}

.room-img-item.is-drag-over {
  border-color: #646cff;
  box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.2);
}

.room-img-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.img-delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  background: rgba(0, 0, 0, 0.75);
  border: none;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s;
}

.room-img-item:hover .img-delete-btn {
  opacity: 1;
}

.img-delete-btn:hover {
  background: rgba(220, 50, 50, 0.85);
}

.img-drag-handle {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.75rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
}

.room-img-item:hover .img-drag-handle {
  opacity: 1;
}

/* Room drop area */
.room-drop-area {
  border: 2px dashed rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 0.5rem;
  transition: border-color 0.2s, background 0.2s;
}

.room-drop-area--active {
  border-color: #646cff;
  background: rgba(100, 108, 255, 0.07);
}

.room-drop-area--uploading {
  opacity: 0.7;
  pointer-events: none;
}

.room-drop-hint {
  margin-top: 0.5rem;
  padding: 0.6rem 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.82rem;
  cursor: pointer;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.room-drop-hint:hover {
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.04);
}

.room-drop-area--active .room-drop-hint {
  color: #a0a8ff;
}

/* Generic image drop zone (events + categories) */
.image-drop-zone {
  position: relative;
  border: 2px dashed rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  max-width: 400px;
}

.image-drop-zone:hover {
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.02);
}

.image-drop-zone--active {
  border-color: #646cff !important;
  background: rgba(100, 108, 255, 0.08) !important;
}

.image-drop-zone--has-image {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.12);
}

.drop-zone-preview-img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.drop-zone-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
}

.image-drop-zone:hover .drop-zone-overlay,
.image-drop-zone--active .drop-zone-overlay {
  opacity: 1;
}

.drop-zone-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 2.5rem 1.5rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}

.drop-zone-empty svg {
  opacity: 0.6;
}

.drop-zone-empty span {
  font-size: 0.9rem;
}

.drop-zone-empty small {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.3);
}

.image-drop-zone--active .drop-zone-empty {
  color: #a0a8ff;
}

@media (max-width: 900px) {
  .rooms-editor {
    grid-template-columns: 1fr;
  }

  .rooms-spot-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .rooms-sketch-group {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .rooms-sketch-label {
    width: 100%;
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

/* Users Section */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
}

.user-info-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.user-row-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #fff;
}

.user-row-email {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.user-row-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.user-row-self {
  font-size: 0.7rem;
  color: #646cff;
  font-style: italic;
}

/* Small modal variant */
.modal-sm {
  max-width: 480px !important;
  width: 95% !important;
  overflow-y: auto;
}

.modal-sm .modal-body {
  display: block;
  padding: 1.5rem 1.5rem 0.5rem;
  overflow-y: visible;
}

.modal-sm .modal-body p {
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.btn-danger {
  padding: 0.55rem 1.25rem;
  background: rgba(231, 76, 60, 0.15);
  border: 1px solid rgba(231, 76, 60, 0.5);
  color: #e74c3c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: rgba(231, 76, 60, 0.3);
  border-color: #e74c3c;
}

.btn-danger-sm {
  padding: 0.35rem 0.85rem;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.4);
  color: #e74c3c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.btn-danger-sm:hover {
  background: rgba(231, 76, 60, 0.25);
}

.user-row-name-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.user-badge-legacy {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #f0a500;
  background: rgba(240, 165, 0, 0.1);
  border: 1px solid rgba(240, 165, 0, 0.35);
  border-radius: 3px;
  padding: 0.1rem 0.45rem;
}

.user-row-actions {
  min-width: 80px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.btn-edit-sm {
  padding: 0.35rem 0.85rem;
  background: rgba(100, 108, 255, 0.1);
  border: 1px solid rgba(100, 108, 255, 0.4);
  color: #848bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.btn-edit-sm:hover {
  background: rgba(100, 108, 255, 0.25);
  border-color: #646cff;
}

.edit-user-section-divider {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding-top: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
}

/* Instagram Settings */
.instagram-settings {
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.instagram-settings-hint {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
  margin: 0;
}

.instagram-settings-hint code {
  background: rgba(255, 255, 255, 0.08);
  padding: 0.1em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
}

.post-preview-link {
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
}

.post-preview-link:hover {
  color: rgba(255, 255, 255, 0.8);
}

.post-id-preview {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.2em;
}

.post-id-preview.valid {
  color: #4caf50;
}

.post-id-preview.invalid {
  color: #f44336;
}

.post-id-preview code {
  background: rgba(255, 255, 255, 0.08);
  padding: 0.1em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
  color: inherit;
}

.instagram-settings-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.save-success {
  color: #4caf50;
  font-size: 0.9rem;
}

.save-error {
  color: #f44336;
  font-size: 0.9rem;
}
</style>
