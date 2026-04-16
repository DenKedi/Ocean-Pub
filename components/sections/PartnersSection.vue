<template>
  <section class="partners-section theme-section-bg">
    <p class="partners-label theme-text-muted">Partners of Pallas</p>
    <div class="ticker-wrapper">
      <div class="ticker-track">
        <div
          v-for="partner in [...partners, ...partners]"
          :key="partner.id + '-' + Math.random()"
          class="ticker-item"
        >
          <img
            v-if="partner.logo"
            :src="partner.logo"
            :alt="partner.name"
            class="partner-logo"
            :style="partner.size ? { height: partner.size } : {}"
          />
          <span v-else class="partner-name theme-text-secondary">{{ partner.name }}</span>
          <span class="ticker-dot">•</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const partners = [
  { id: 1, name: 'Irie Daily',    logo: '/partners/IRIEDAILY.png' },
  { id: 2, name: 'Birra Moretti', logo: '/partners/Birra_Moretti_Logo.png' },
  { id: 3, name: 'Cramer Möbel',  logo: '/partners/Cramer_Logo.png', size: '28px' },
  { id: 4, name: 'Typeholics',    logo: '/partners/typeholics.png' },
  { id: 5, name: 'Slomo',         logo: '/partners/Slomo.png', size: '52px' },
  { id: 6, name: 'Flor de Caña',  logo: '/partners/Flor_de_Cana_logo.png' },
]
</script>

<style scoped>
.partners-section {
  padding: 3rem 0 calc(3rem + 2rem + 1.125rem);
  border-top: 1px solid var(--theme-border);
  overflow: hidden;
}

.partners-label {
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.65;
  margin: 0 0 2rem;
}

/* ── Ticker ── */
.ticker-wrapper {
  width: 100%;
  overflow: hidden;
  padding: 1rem 0;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
}

.ticker-track {
  display: flex;
  align-items: center;
  width: max-content;
  animation: ticker-scroll 28s linear infinite;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-shrink: 0;
  padding: 0 1rem;
}

.partner-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 52px;
  opacity: 0.75;
  transition: opacity 0.3s ease;
}

.partner-logo {
  height: 52px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.75;
  transition: opacity 0.3s ease;
}

.ticker-dot {
  color: #FF9d66;
  font-size: 1rem;
  flex-shrink: 0;
}

@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Pause on hover */
.ticker-wrapper:hover .ticker-track {
  animation-play-state: paused;
}

/* Hover highlight */
.ticker-item:hover .partner-name,
.ticker-item:hover .partner-logo {
  opacity: 1;
}
</style>
