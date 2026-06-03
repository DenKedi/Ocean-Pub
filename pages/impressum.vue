<script setup>
import { onMounted } from 'vue'
import DefaultLayout from '../layouts/default.vue'

onMounted(() => { document.title = 'Impressum | Ocean Pub Dahme' })
</script>

<template>
  <DefaultLayout>
  <section class="legal-section">
    <div class="container">
      <h1 class="legal-title">Impressum</h1>
      
      <div class="legal-content">
        <div class="company-info">
          <h2>Ocean Pub Dahme</h2>
          <p>
            An d. Strandpromenade 20<br>
            23747 Dahme<br>
            Deutschland
          </p>

          <p>
            <strong>Inhaber:</strong> Ilias Haroon Yasini
          </p>

          <div class="contact-details">
            <h3>Kontakt:</h3>
            <p>
              <strong>E-Mail:</strong> info@ocean-bar.de<br>
              <strong>Telefon:</strong> +49 15205714152
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  </DefaultLayout>
</template>

<style scoped>
.legal-section {
  padding: 8rem 0 5rem;
  background: var(--beach-sky, #EAF6FB);
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.legal-title {
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--beach-navy, #163A4E);
  text-align: center;
  margin-bottom: 3rem;
  font-family: var(--font-primary);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.legal-content {
  color: var(--beach-navy, #163A4E);
  line-height: 1.7;
  background: var(--beach-sand, #FBF3E4);
  border-radius: 20px;
  padding: 3rem;
  border: 1.5px solid rgba(22, 58, 78, 0.12);
  box-shadow: 0 4px 24px rgba(22, 58, 78, 0.08);
}

.company-info h2 {
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--beach-navy, #163A4E);
}

.company-info h3 {
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 1.1rem;
  margin: 2rem 0 0.75rem;
  color: var(--beach-ocean, #2A7FA5);
}

.company-info p {
  margin-bottom: 1rem;
  color: rgba(22, 58, 78, 0.85);
}

.contact-details {
  margin-top: 2rem;
  padding: 1.75rem 2rem;
  background: rgba(42, 127, 165, 0.08);
  border-radius: 14px;
  border: 1.5px solid rgba(42, 127, 165, 0.2);
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .legal-section {
    padding: 6rem 0 3rem;
  }

  .container {
    padding: 0 1rem;
  }

  .legal-content {
    padding: 2rem 1.5rem;
  }

  .contact-details {
    padding: 1.25rem;
  }
}
</style>