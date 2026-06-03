<script setup>
import { ref, onMounted } from 'vue'
import DefaultLayout from '../layouts/default.vue'
import useApi from '../composables/useApi.js'

const api = useApi()

onMounted(() => {
  document.title = 'Event & Anfragen | Ocean Pub Dahme'
})

// ── Booking type ──────────────────────────────────────────────────────────────
const bookingType = ref('bar') // 'bar' | 'bike'

// ── Form state ────────────────────────────────────────────────────────────────
const form = ref({
  name: '',
  email: '',
  telefon: '',
  firma: '',
  thema: '',
  gaeste: '',
  datum: '',
  altDatum: false,
  altDatumWert: '',
  budget: '',
  nachricht: '',
  datenschutz: false,
})

const formSubmitted = ref(false)
const formErrors   = ref({})
const formLoading  = ref(false)
const formServerError = ref(null)

const validate = () => {
  const e = {}
  if (!form.value.name.trim())  e.name  = 'Bitte Name angeben'
  if (!form.value.email.trim()) e.email = 'Bitte E-Mail angeben'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
    e.email = 'Ungültige E-Mail-Adresse'
  if (!form.value.thema.trim()) e.thema = 'Bitte Thema / Anlass angeben'
  if (!form.value.gaeste)       e.gaeste = 'Bitte Gästeanzahl angeben'
  if (!form.value.datum)        e.datum  = 'Bitte Datum auswählen'
  if (form.value.altDatum && !form.value.altDatumWert)
    e.altDatumWert = 'Bitte Alternativdatum auswählen'
  if (!form.value.datenschutz)  e.datenschutz = 'Bitte Einverständnis geben'
  formErrors.value = e
  return Object.keys(e).length === 0
}

const submitForm = async () => {
  if (!validate()) return
  formLoading.value = true
  formServerError.value = null
  try {
    await api.post('/contact', { ...form.value, bookingType: bookingType.value })
    formSubmitted.value = true
  } catch (err) {
    formServerError.value =
      err?.response?.data?.message ||
      'Die Anfrage konnte nicht gesendet werden. Bitte versuche es später erneut.'
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formSubmitted.value = false
  formErrors.value = {}
  formServerError.value = null
  form.value = {
    name: '', email: '', telefon: '', firma: '',
    thema: '', gaeste: '', datum: '',
    altDatum: false, altDatumWert: '',
    budget: '', nachricht: '', datenschutz: false,
  }
}
</script>

<template>
  <DefaultLayout>
    <div class="request-page">

      <!-- ── Hero ──────────────────────────────────────────────────── -->
      <section class="hero">
        <div class="container hero-inner">
          <h1 class="hero-title">Dein Event bei uns</h1>
          <p class="hero-sub">Private Feier, Firmen-Event oder mobiler Cocktail-Service — wir freuen uns auf deine Anfrage.</p>
        </div>
      </section>

      <!-- ── Booking Type Cards ─────────────────────────────────────── -->
      <section class="booking-type-section">
        <div class="container">
          <h2 class="section-title">Was möchtest du buchen?</h2>
          <div class="booking-cards">

            <!-- Bar / Location -->
            <button
              class="booking-card"
              :class="{ active: bookingType === 'bar' }"
              type="button"
              @click="bookingType = 'bar'"
            >

              <span class="booking-card-title">Ocean Pub Dahme</span>
              <span class="booking-card-desc">Private Veranstaltung in unserer Strandbar — Geburtstage, Feiern, Firmen-Events & mehr.</span>
              <span class="booking-card-check">✓</span>
            </button>

            <!-- Ocean Bike -->
            <button
              class="booking-card"
              :class="{ active: bookingType === 'bike' }"
              type="button"
              @click="bookingType = 'bike'"
            >

              <span class="booking-card-title">Ocean Bike</span>
              <span class="booking-card-desc">Unser mobiles Cocktail-Bar-Fahrrad — frische Drinks direkt zu deinem Event, wohin du willst.</span>
              <span class="booking-card-check">✓</span>
            </button>

          </div>

          <!-- Context hint -->
          <div class="booking-hint" v-if="bookingType === 'bar'">
            <p>Du buchst die <strong>Ocean Pub Strandbar</strong> in Dahme für dein privates Event. Wir besprechen alles weitere nach deiner Anfrage.</p>
          </div>
          <div class="booking-hint" v-else>
            <p>Du buchst den <strong>Ocean Bike</strong> — unsere mobile Cocktail-Bar auf Rädern. Ideal für Strand-Events, Märkte, Firmen-Feiern & Co.</p>
          </div>
        </div>
      </section>

      <!-- ── Form Section ───────────────────────────────────────────── -->
      <section class="form-section">
        <div class="container form-container">
          <h2 class="section-title">Anfrage senden</h2>
          <p class="section-subtitle">Füll das Formular aus — wir melden uns schnellstmöglich bei dir.</p>

          <!-- Success -->
          <div v-if="formSubmitted" class="form-success">
            <div class="success-icon">✓</div>
            <h3>Anfrage erhalten!</h3>
            <p>Wir melden uns bald bei dir!</p>
            <button class="btn-primary" @click="resetForm">Neue Anfrage</button>
          </div>

          <!-- Form -->
          <form v-else class="request-form" @submit.prevent="submitForm" novalidate>

            <!-- Ansprechpartner -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Ansprechpartner</legend>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="req-name">Name *</label>
                  <input id="req-name" v-model="form.name" type="text" class="form-input" :class="{ 'has-error': formErrors.name }" />
                  <span v-if="formErrors.name" class="form-error">{{ formErrors.name }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="req-email">E-Mail *</label>
                  <input id="req-email" v-model="form.email" type="email" class="form-input" :class="{ 'has-error': formErrors.email }" />
                  <span v-if="formErrors.email" class="form-error">{{ formErrors.email }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="req-telefon">Telefon</label>
                  <input id="req-telefon" v-model="form.telefon" type="tel" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="req-firma">Firma / Organisation</label>
                  <input id="req-firma" v-model="form.firma" type="text" class="form-input" />
                </div>
              </div>
            </fieldset>

            <!-- Veranstaltung -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">
                {{ bookingType === 'bike' ? 'Event-Details (Ocean Bike)' : 'Veranstaltung' }}
              </legend>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label" for="req-thema">Thema / Anlass *</label>
                  <input id="req-thema" v-model="form.thema" type="text" class="form-input" :class="{ 'has-error': formErrors.thema }"
                    :placeholder="bookingType === 'bike' ? 'z.B. Strandparty, Firmen-BBQ, Hochzeit…' : 'z.B. Geburtstag, Firmenfeier, Clubbing…'" />
                  <span v-if="formErrors.thema" class="form-error">{{ formErrors.thema }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="req-gaeste">Gästeanzahl *</label>
                  <input id="req-gaeste" v-model="form.gaeste" type="text" class="form-input" :class="{ 'has-error': formErrors.gaeste }" />
                  <span v-if="formErrors.gaeste" class="form-error">{{ formErrors.gaeste }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="req-budget">Budget (optional)</label>
                  <input id="req-budget" v-model="form.budget" type="text" class="form-input" placeholder="z.B. 500 €" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="req-datum">Datum *</label>
                  <input id="req-datum" v-model="form.datum" type="date" class="form-input" :class="{ 'has-error': formErrors.datum }" />
                  <span v-if="formErrors.datum" class="form-error">{{ formErrors.datum }}</span>
                </div>

                <div class="form-group form-group-flex full-width">
                  <label class="form-toggle">
                    <input type="checkbox" v-model="form.altDatum" />
                    <span class="toggle-label">Alternativdatum angeben?</span>
                  </label>
                  <div v-if="form.altDatum" class="alt-date-row">
                    <input v-model="form.altDatumWert" type="date" class="form-input form-input-sm" :class="{ 'has-error': formErrors.altDatumWert }" />
                    <span v-if="formErrors.altDatumWert" class="form-error">{{ formErrors.altDatumWert }}</span>
                  </div>
                </div>
              </div>
            </fieldset>

            <!-- Nachricht -->
            <fieldset class="form-fieldset">
              <legend class="form-legend">Nachricht</legend>
              <div class="form-group full-width">
                <label class="form-label" for="req-nachricht">Deine Nachricht (optional)</label>
                <textarea id="req-nachricht" v-model="form.nachricht" class="form-input form-textarea" rows="5"
                  :placeholder="bookingType === 'bike' ? 'Besondere Wünsche, gewünschte Cocktails, Stromanschluss vorhanden?…' : 'Besondere Wünsche, Fragen, Anmerkungen…'"></textarea>
              </div>
            </fieldset>

            <!-- Datenschutz -->
            <div class="form-group consent-group">
              <label class="form-checkbox" :class="{ 'has-error': formErrors.datenschutz }">
                <input type="checkbox" v-model="form.datenschutz" />
                <span class="checkbox-box"></span>
                <span class="checkbox-text">
                  Ich bin einverstanden mit der Verarbeitung meiner Daten gemäß der
                  <RouterLink to="/datenschutz" target="_blank">Datenschutzerklärung</RouterLink>. *
                </span>
              </label>
              <span v-if="formErrors.datenschutz" class="form-error">{{ formErrors.datenschutz }}</span>
            </div>

            <!-- Submit -->
            <div class="form-actions">
              <p v-if="formServerError" class="form-server-error">{{ formServerError }}</p>
              <button type="submit" class="btn-submit" :disabled="formLoading">
                {{ formLoading ? 'Wird gesendet…' : 'Anfrage absenden' }}
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  </DefaultLayout>
</template>

<style scoped>
/* ── Page base ── */
.request-page {
  min-height: 100vh;
  background: var(--beach-sky, #EAF6FB);
}

/* ── Hero ── */
.hero {
  background: linear-gradient(160deg, #d4edec 0%, #EAF6FB 60%, #FBF3E4 100%);
  padding: 5rem 1.5rem 4rem;
  text-align: center;
}

.hero-inner {
  max-width: 700px;
  margin: 0 auto;
}

.hero-title {
  font-family: var(--font-primary, 'Nunito', sans-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: var(--beach-navy, #163A4E);
  margin-bottom: 1rem;
}

.hero-sub {
  font-size: 1.1rem;
  color: rgba(22, 58, 78, 0.65);
  line-height: 1.6;
}

/* ── Container ── */
.container {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ── Section titles ── */
.section-title {
  font-family: var(--font-primary, 'Nunito', sans-serif);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--beach-navy, #163A4E);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: rgba(22, 58, 78, 0.6);
  margin-bottom: 2rem;
}

/* ── Booking type section ── */
.booking-type-section {
  padding: 3.5rem 1.5rem 0;
}

.booking-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.booking-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  background: #fff;
  border: 2px solid rgba(22, 58, 78, 0.12);
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.22s ease;
  box-shadow: 0 2px 12px rgba(22, 58, 78, 0.06);
}

.booking-card:hover {
  border-color: var(--beach-ocean, #2A7FA5);
  box-shadow: 0 6px 24px rgba(42, 127, 165, 0.12);
  transform: translateY(-2px);
}

.booking-card.active {
  border-color: var(--beach-ocean, #2A7FA5);
  background: linear-gradient(135deg, rgba(42, 127, 165, 0.06) 0%, rgba(168, 216, 208, 0.1) 100%);
  box-shadow: 0 6px 24px rgba(42, 127, 165, 0.15);
}

.booking-card-title {
  font-family: var(--font-primary, 'Nunito', sans-serif);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--beach-navy, #163A4E) !important;
}

.booking-card-desc {
  font-size: 0.875rem;
  color: rgba(22, 58, 78, 0.6) !important;
  line-height: 1.5;
}

.booking-card-check {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--beach-ocean, #2A7FA5);
  color: #fff !important;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.booking-card.active .booking-card-check {
  opacity: 1;
}

.booking-hint {
  background: var(--beach-sand, #FBF3E4);
  border: 1.5px solid rgba(22, 58, 78, 0.1);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 0;
}

.booking-hint p {
  font-size: 0.9rem;
  color: rgba(22, 58, 78, 0.75) !important;
  margin: 0;
}

.booking-hint strong {
  color: var(--beach-navy, #163A4E) !important;
}

/* ── Form section ── */
.form-section {
  padding: 3rem 1.5rem 5rem;
}

.form-container {
  background: #fff;
  border: 1.5px solid rgba(22, 58, 78, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 24px rgba(22, 58, 78, 0.08);
}

/* ── Form elements ── */
.request-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-legend {
  font-family: var(--font-primary, 'Nunito', sans-serif);
  font-size: 1rem;
  font-weight: 800;
  color: var(--beach-navy, #163A4E) !important;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 0;
  margin-bottom: 0.75rem;
  border-bottom: 2px solid var(--beach-coral, #E8614D);
  padding-bottom: 0.4rem;
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(22, 58, 78, 0.8) !important;
}

.form-input {
  background: var(--beach-sand, #FBF3E4);
  border: 1.5px solid rgba(22, 58, 78, 0.15);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  color: var(--beach-navy, #163A4E) !important;
  font-family: inherit;
  transition: all 0.2s ease;
  width: 100%;
}

.form-input::placeholder {
  color: rgba(22, 58, 78, 0.35) !important;
}

.form-input:focus {
  outline: none;
  border-color: var(--beach-ocean, #2A7FA5);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(42, 127, 165, 0.1);
}

.form-input.has-error {
  border-color: var(--beach-coral, #E8614D);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-input-sm {
  max-width: 200px;
}

.form-error {
  font-size: 0.8rem;
  color: var(--beach-coral, #E8614D) !important;
}

/* Toggle checkbox row */
.form-group-flex {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
}

.form-toggle input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--beach-ocean, #2A7FA5);
  cursor: pointer;
}

.toggle-label {
  font-size: 0.9rem;
  color: rgba(22, 58, 78, 0.75) !important;
}

.alt-date-row {
  padding-left: 1.5rem;
}

/* Consent checkbox */
.consent-group {
  padding-top: 0.5rem;
}

.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.form-checkbox input[type="checkbox"] {
  display: none;
}

.checkbox-box {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(22, 58, 78, 0.3);
  border-radius: 4px;
  background: var(--beach-sand, #FBF3E4);
  margin-top: 2px;
  transition: all 0.2s ease;
  position: relative;
}

.form-checkbox input:checked ~ .checkbox-box,
.form-checkbox:has(input:checked) .checkbox-box {
  background: var(--beach-ocean, #2A7FA5);
  border-color: var(--beach-ocean, #2A7FA5);
}

.form-checkbox:has(input:checked) .checkbox-box::after {
  content: '✓';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #fff !important;
  font-weight: 700;
}

.checkbox-text {
  font-size: 0.875rem;
  color: rgba(22, 58, 78, 0.7) !important;
  line-height: 1.5;
}

.checkbox-text a {
  color: var(--beach-ocean, #2A7FA5) !important;
  text-decoration: underline;
}

/* Submit */
.form-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.btn-submit {
  background: var(--beach-coral, #E8614D);
  color: #fff !important;
  border: none;
  border-radius: 12px;
  padding: 0.9rem 2.5rem;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-submit:hover:not(:disabled) {
  background: #d44f3c;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(232, 97, 77, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-server-error {
  color: var(--beach-coral, #E8614D) !important;
  font-size: 0.9rem;
  background: rgba(232, 97, 77, 0.08);
  border: 1px solid rgba(232, 97, 77, 0.25);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  margin: 0;
}

/* Success state */
.form-success {
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--beach-ocean, #2A7FA5);
  color: #fff;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-success h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--beach-navy, #163A4E) !important;
}

.form-success p {
  color: rgba(22, 58, 78, 0.65) !important;
}

.btn-primary {
  background: var(--beach-coral, #E8614D);
  color: #fff !important;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 2rem;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-primary:hover {
  background: #d44f3c;
  transform: translateY(-1px);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .booking-cards {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-container {
    padding: 1.5rem 1.25rem;
  }
}
</style>
