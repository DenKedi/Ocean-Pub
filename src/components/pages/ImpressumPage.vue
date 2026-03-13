<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <MainLayout>
  <section class="legal-section">
    <div class="container">
      <h1 class="legal-title">Impressum</h1>
      
      <div class="legal-content">
        <div class="company-info">
          <h2>PALLAS.WORLD GmbH & Co. KG</h2>
          <p>
            Neuer Pferdemarkt 13<br>
            20359 Hamburg<br>
            Germany
          </p>
          
          <p>
            <strong>AG / RG:</strong> Hamburg – HRA 121215
          </p>
          
          <h3>Persönlich haftende Gesellschafterin:</h3>
          <p>
            NPM 13 GmbH – Sitz: Hamburg<br>
            <strong>AG / RG:</strong> Hamburg – HRB 166704<br>
            <strong>Geschäftsführer:</strong> Erkan Alkasi
          </p>
          
          <div class="contact-details">
            <h3>Kontakt:</h3>
            <p>
              <strong>E-Mail:</strong> adjsavedmylife@pallas.world<br>
              <strong>Telefon:</strong> +49 40 98246368
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  </MainLayout>
</template>

<style scoped>
.legal-section {
  padding: 8rem 0 4rem;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.legal-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: white;
  text-align: center;
  margin-bottom: 3rem;
  font-family: var(--font-primary);
  font-weight: 200;
  letter-spacing: 0.08em;
}

.legal-content {
  color: white;
  line-height: 1.7;
}

.company-info h2 {
  font-family: var(--font-primary);
  font-weight: 300;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.company-info h3 {
  font-family: var(--font-primary);
  font-weight: 300;
  font-size: 1.2rem;
  margin: 2rem 0 1rem;
  color: white;
}

.company-info p {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.contact-details {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .legal-section {
    padding: 6rem 0 3rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .contact-details {
    padding: 1.5rem;
  }
}
</style>