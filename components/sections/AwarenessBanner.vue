<template>
  <section class="awareness-section">
    <span>NO SEXISM</span>
    <span class="dot">•</span>
    <span>NO RACISM</span>
    <span class="dot">•</span>
    <span>NO BAD VIBES</span>
  </section>
</template>

<style scoped>
.awareness-section {
  width: 100%;
  padding: 2rem 3rem;
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
  color: #ffffff;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .awareness-section {
    flex-direction: column;
    gap: 1rem;
    font-size: 1rem;
  }
  .dot {
    display: none;
  }
}
</style>
