<template>
  <div class="friends-page">
    <section class="content-section theme-section-bg">
      <div class="container">
        <h1 class="page-title theme-text-primary">Pallas.Friends</h1>
        <p class="page-subtitle theme-text-secondary">Unsere Partner & Freunde</p>
      </div>
    </section>
  </div>
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
}

.page-subtitle {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  opacity: 0.8;
}
</style>