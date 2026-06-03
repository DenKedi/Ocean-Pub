<template>
  <section id="hours" class="hours-section theme-section-bg">
    <div class="container">
      <h2 class="section-title theme-text-primary pallas-heading">Öffnungszeiten</h2>
      
      <div class="hours-content">
        <div class="hours-card theme-container-bg">
          <div class="day-row">
            <span class="day">Montag</span>
            <span class="time">16:00 – 00:00</span>
          </div>
          <div class="day-row">
            <span class="day">Dienstag</span>
            <span class="time">16:00 – 00:00</span>
          </div>
          <div class="day-row">
            <span class="day">Mittwoch</span>
            <span class="time">16:00 – 00:00</span>
          </div>
          <div class="day-row">
            <span class="day">Donnerstag</span>
            <span class="time">16:00 – 00:00</span>
          </div>
          <div class="day-row">
            <span class="day">Freitag</span>
            <span class="time">16:00 – 00:00</span>
          </div>
          <div class="day-row">
            <span class="day">Samstag</span>
            <span class="time">13:00 – 00:00</span>
          </div>
          <div class="day-row">
            <span class="day">Sonntag</span>
            <span class="time">13:00 – 00:00</span>
          </div>
        </div>
        <p class="hours-disclaimer theme-text-muted">Tatsächliche Öffnungszeiten können abweichen</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hours-section {
  padding: 8rem 0;
  border-top: 1px solid var(--theme-border);
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 4rem;
  font-weight: 100;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hours-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.hours-card {
  padding: 3rem 4rem;
  border-radius: 8px;
  min-width: 500px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem; /* Further reduced from 2rem */
    letter-spacing: 0.1em; /* Reduced spacing */
  }
  
  .hours-card {
    min-width: auto;
    width: 100%;
    padding: 1.5rem 1rem; /* Compact padding */
  }
  
  .day-row {
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 1rem 0; /* Reduced padding */
  }

  .day, .time {
    font-size: 0.95rem; /* Smaller text */
  }
}

.day-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--theme-border);
}

.day-row:last-child {
  border-bottom: none;
}

.day {
  font-size: 1.1rem;
  font-weight: 300;
  letter-spacing: 0.05em;
}

.time {
  font-size: 1.1rem;
  font-weight: 400;
  color: #87CEEB;
}

.hours-disclaimer {
  text-align: center;
  font-size: 0.9rem;
  font-style: italic;
  letter-spacing: 0.02em;
  opacity: 0.7;
}

@media (max-width: 767px) {
  .hours-card {
    min-width: 100%;
    padding: 2rem;
  }
  
  .day-row {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    padding: 1rem 0;
  }
  
  .day, .time {
    font-size: 1rem;
  }
}
</style>