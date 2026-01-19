<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import BurgerMenu from "../components/BurgerMenu.vue";
import iconImage from "../assets/icons/Pallas_Logo_III-cropped.svg";

const props = defineProps({
  bgImage: {
    type: String,
    default: null
  }
});

const isMenuOpen = ref(false);
const isNavHidden = ref(false);
const lastScrollY = ref(0);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  
  // Show navbar if scrolling up or at the very top
  // Hide navbar if scrolling down and past 50px
  if (currentScrollY > lastScrollY.value && currentScrollY > 50) {
    isNavHidden.value = true;
  } else {
    isNavHidden.value = false;
  }
  
  lastScrollY.value = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  isMenuOpen.value = false;
};

// Navigation items for both desktop and mobile
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/events', label: 'Events' },
  { path: '/stories', label: 'Stories' },
  { path: '/friends', label: 'Friends' },
  { path: '/art', label: 'Art' },
  { path: '/request', label: 'Request' }
];
</script>

<template>
  <div class="main-layout">
    <!-- Background Image -->
    <div
      v-if="props.bgImage"
      class="background-image"
      :style="{ backgroundImage: `url(${props.bgImage})` }"
    ></div>

    <!-- Desktop Navigation Bar -->
    <nav class="desktop-nav" :class="{ 'nav-hidden': isNavHidden }">
      <div class="desktop-nav-content">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          class="desktop-nav-link"
        >
          {{ item.label }}
        </router-link>
      </div>
    </nav>

    <!-- Burger Menu (Mobile only) -->
    <div class="mobile-menu-wrapper">
      <BurgerMenu :is-open="isMenuOpen" @toggle="toggleMenu" />
    </div>

    <!-- Navigation Overlay (Mobile) -->
    <nav class="main-nav" :class="{ 'nav-open': isMenuOpen }">
      <div class="nav-logo">
        <img :src="iconImage" alt="Pallas Logo" class="logo-image" />
      </div>
      
      <div class="nav-content">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          @click="isMenuOpen = false" 
          class="nav-link"
        >
          <span class="prefix">Pallas</span><span class="dot">.</span>{{ item.label }}
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

/* ===== Desktop Navigation Bar ===== */
.desktop-nav {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 3rem;
  transition: transform 0.3s ease;
}

.desktop-nav.nav-hidden {
  transform: translateY(-100%);
}

.desktop-nav-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.desktop-nav-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.desktop-nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.desktop-nav-link:hover {
  color: rgba(255, 255, 255, 1);
}

.desktop-nav-link:hover::after {
  width: 100%;
}

.desktop-nav-link.router-link-exact-active {
  color: rgba(255, 255, 255, 1);
}

.desktop-nav-link.router-link-exact-active::after {
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
}

/* ===== Mobile Menu Wrapper ===== */
.mobile-menu-wrapper {
  display: block;
}

/* ===== Mobile Navigation Overlay ===== */
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
  overflow-y: auto;
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

/* ===== Desktop: Show navbar, hide burger ===== */
@media (min-width: 1024px) {
  .desktop-nav {
    display: block;
  }

  .mobile-menu-wrapper {
    display: none;
  }

  .main-nav {
    display: none !important;
  }
}

/* ===== Mobile Optimization ===== */
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
  
  .logo-image {
    width: 60px;
  }
}
</style>
