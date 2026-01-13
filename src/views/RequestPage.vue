<script setup>
import MainLayout from '../layouts/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <div class="request-page">
      <section class="content-section theme-section-bg">
        <div class="container">
          <h1 class="page-title theme-text-primary">Pallas.Request</h1>
          <p class="page-subtitle theme-text-secondary">Sende uns deine Anfrage</p>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<style scoped>
.content-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: var(--font-primary);
}

.page-subtitle {
  font-family: var(--font-secondary);
  font-size: 1.25rem;
  opacity: 0.8;
}
</style>