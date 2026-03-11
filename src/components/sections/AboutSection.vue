<template>
  <section class="content-section theme-section-bg about-section">
    <div class="container">
      <h2 class="section-title theme-text-primary">Über das Pallas</h2>
      <p class="section-subtitle theme-text-secondary">
        Das Pallas versteht sich als dein persönliches Wohnzimmer - ein Ort, an dem Begegnung,
        Kultur und Nachtleben miteinander verschmelzen, ganz ohne Timing, ohne Hektik, aber mit Haltung.
        Sorgsam kuratierte Musik trifft auf hochwertige Drinks und künstlerische Impulse.
      </p>
      <p class="about-body theme-text-secondary">
        Am Wochenende verwandelt sich dieses Wohnzimmer in einen pulsierenden Mikrokosmos voller Energie
        und Leichtigkeit. Zwischen Beats und Begegnungen entsteht eine Dynamik, die trägt - mal subtil,
        mal mitreißend, aber immer authentisch.
      </p>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  padding: 8rem 0;
  border-bottom: 1px solid var(--theme-border);
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
