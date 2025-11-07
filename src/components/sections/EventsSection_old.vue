<template>
  <section id="events" class="content-section">
    <div class="container">
      <h2 class="section-title pallas-heading">PALLAS.WORLD Events</h2>
      <div class="events-grid">
        <div class="event-card">
          <div class="event-icon">�</div>
          <h3>World Unity Nights</h3>
          <p class="event-time">Jeden Samstag, ab 21:00 Uhr</p>
          <p>Kulturen treffen aufeinander – eine Nacht voller internationaler Musik, 
             Tanz und kulinarischer Vielfalt. Everybody Welcome!</p>
          <div class="event-price">Eintritt frei</div>
        </div>
        <div class="event-card">
          <div class="event-icon">�️</div>
          <h3>Cultural Food Journey</h3>
          <p class="event-time">Jeden Donnerstag, 18:00 Uhr</p>
          <p>Entdecke mit uns die Geschmäcker der Welt. Jede Woche ein anderes Land, 
             authentische Küche und spannende Geschichten.</p>
          <div class="event-price">20€ pro Person</div>
        </div>
        <div class="event-card">
          <div class="event-icon">🎵</div>
          <h3>Open Stage for All</h3>
          <p class="event-time">Montag, ab 20:00 Uhr</p>
          <p>Deine Bühne, deine Kunst! Musik, Poetry, Comedy – alle sind willkommen. 
             PALLAS.WORLD gibt allen eine Stimme.</p>
          <div class="event-price">Eintritt frei</div>
        </div>
        <div class="event-card">
          <div class="event-icon">�</div>
          <h3>Private Celebrations</h3>
          <p class="event-time">Nach Vereinbarung</p>
          <p>Feiere deine besonderen Momente bei PALLAS.WORLD. Von Geburtstagen bis 
             Firmenfeiern – wir schaffen unvergessliche Erlebnisse.</p>
          <div class="event-price">Ab 30€ pro Person</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  padding: 5rem 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: white;
  text-align: center;
  margin-bottom: 4rem;
  font-weight: 700;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.event-card {
  background: rgba(255, 255, 255, 0.08);
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  text-align: center;
  transition: all 0.3s ease;
}

.event-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.3);
}

.event-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.event-card h3 {
  color: white;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.event-time {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: inline-block;
}

.event-card p:not(.event-time) {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.event-price {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 25px;
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .content-section {
    padding: 3rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .event-card {
    padding: 2rem;
  }
}
</style>