<template>
  <section class="content-section theme-section-bg about-section">
    <div class="container">
      <h2 class="section-title theme-text-primary">Über das Pallas</h2>
      <p class="section-subtitle theme-text-secondary">Dein Persönliches Wohnzimmer</p>
      <p class="about-body theme-text-secondary">

      </p>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  padding: 8rem 0 4rem;
  border-top: 1px solid var(--theme-border);
  border-bottom: 1px solid var(--theme-border);
  position: relative;
}

.awareness-banner {
  margin-top: 4rem;
  padding: 2rem 3rem;
  width: 100%;
  background-color: #ff00aa;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  letter-spacing: 0.2em;
}

.dot {
  color: #FF9d66;
  font-size: 1.2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 3rem;
  text-align: center;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 2.5rem;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.section-subtitle {
  font-size: 1.1rem;
  line-height: 1.9;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.about-body {
  font-size: 1.1rem;
  line-height: 1.9;
  opacity: 0.75;
}

@media (max-width: 768px) {
  .content-section {
    padding: 4rem 0;
  }
}
</style>
