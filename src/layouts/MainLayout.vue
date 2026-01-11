<script setup>
import { ref, onMounted, computed } from "vue";
import BurgerMenu from "../components/BurgerMenu.vue";
import { currentTheme } from "../stores/themeStore.js";
import iconImage from "../assets/icons/Pallas_Logo_III-cropped.svg";

const props = defineProps({
  bgImage: {
    type: String,
    default: null
  }
});

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  isMenuOpen.value = false;
};
</script>

<template>
  <div class="main-layout">
    <!-- Background Image -->
    <div
      v-if="props.bgImage"
      class="background-image"
      :style="{ backgroundImage: `url(${props.bgImage})` }"
    ></div>

    <!-- Burger Menu -->
    <BurgerMenu :is-open="isMenuOpen" @toggle="toggleMenu" />

    <!-- Navigation Overlay -->
    <nav class="main-nav" :class="{ 'nav-open': isMenuOpen }">
      <div class="nav-logo">
        <img :src="iconImage" alt="Pallas Logo" class="logo-image" />
      </div>
      
      <div class="nav-content">
        <router-link to="/" @click="isMenuOpen = false" class="nav-link">
          <span class="prefix">Pallas</span><span class="dot">.</span>Home
        </router-link>
              <router-link to="/drinks" @click="isMenuOpen = false" class="nav-link">
          <span class="prefix">Pallas</span><span class="dot">.</span>Drinks
        </router-link>
        <router-link to="/events" @click="isMenuOpen = false" class="nav-link">
          <span class="prefix">Pallas</span><span class="dot">.</span>Events
        </router-link>
        <router-link to="/stories" @click="isMenuOpen = false" class="nav-link">
          <span class="prefix">Pallas</span><span class="dot">.</span>Stories
        </router-link>
        <router-link to="/friends" @click="isMenuOpen = false" class="nav-link">
          <span class="prefix">Pallas</span><span class="dot">.</span>Friends
        </router-link>
        <router-link to="/request" @click="isMenuOpen = false" class="nav-link">
          <span class="prefix">Pallas</span><span class="dot">.</span>Request
        </router-link>
      </div>

      <div class="nav-footer">
        <router-link
          to="/impressum"
          @click="isMenuOpen = false"
          class="footer-link"
          >Impressum</router-link
        >
        <router-link
          to="/datenschutz"
          @click="isMenuOpen = false"
          class="footer-link"
          >Datenschutz</router-link
        >
      </div>
    </nav>

    <!-- Content Slot -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  opacity: 0.6;
}

.main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  background: transparent;
}

.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 1);
  display: none;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  padding: 4rem 2rem 2rem;
  overflow-y: auto; /* Allow scrolling */
  overflow-x: hidden;
}

.main-nav.nav-open {
  display: flex;
}

.nav-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0 0.5rem;
}

.logo-image {
  width: 80px;
  height: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.nav-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.nav-footer {
  display: flex;
  gap: 2rem;
  padding: 0.5rem 0 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-link {
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  font-size: 0.7rem;
  font-weight: 200;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.6);
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 300;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  display: block;
  letter-spacing: 0.05em;
  border-bottom: 1px solid transparent;
  margin: 0.2rem 0;
}

.nav-link .prefix {
  opacity: 0;
  transition: opacity 0.8s ease-in-out !important;
}

.nav-link:hover .prefix {
  opacity: 1;
}

.nav-link:hover {
  color: #87ceeb;
}

/* Mobile Nav Optimization */
@media (max-width: 768px) {
  .nav-link {
    font-size: 1rem; /* Reduced from 1.2rem */
    padding: 0.2rem 0;
  }
  
  .logo-image {
    width: 60px; /* Smaller logo */
  }
}

/* Desktop Navigation */
@media (min-width: 1024px) {
  .main-nav {
    display: none !important; /* Hide overlay nav on desktop */
  }

  .main-nav.nav-open {
    display: flex !important;
  }
}

/* Mobile Optimization */
@media (max-width: 767px) {
  .nav-link {
    font-size: 1rem;
    padding: 0.5rem 0;
    margin: 0.5rem 0;
  }

  .nav-link .prefix,
  .nav-link .dot {
    display: none;
  }

  .nav-content {
    gap: 2rem;
  }

  .footer-link {
    font-size: 0.8rem;
  }

  .nav-footer {
    gap: 2.5rem;
    padding: 1rem 0 2rem;
  }
}
</style>
