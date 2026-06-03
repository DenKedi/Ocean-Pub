<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import BurgerMenu from '../components/BurgerMenu.vue'
import CookieConsent from '../components/CookieConsent.vue'
import FooterSection from '../components/sections/FooterSection.vue'

const { state: authState } = useAuth();

const props = defineProps({
  bgImage: {
    type: String,
    default: null
  },
  theme: {
    type: String,
    default: 'dark', // 'dark' (default, white text) or 'light' (black text for bright pages)
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

const bgHeight = ref('100vh');
let lastWindowWidth = 0;

const updateBgHeight = () => {
  // Only update if width changed significantly (indicates orientation change)
  if (typeof window !== 'undefined') {
    if (Math.abs(window.innerWidth - lastWindowWidth) > 50) {
      bgHeight.value = `${window.innerHeight}px`;
      lastWindowWidth = window.innerWidth;
    }
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') lastWindowWidth = window.innerWidth;
  bgHeight.value = `${window.innerHeight}px`;
  window.addEventListener('resize', updateBgHeight);
  window.addEventListener('orientationchange', updateBgHeight);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('resize', updateBgHeight);
  window.removeEventListener('orientationchange', updateBgHeight);
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
const baseNavItems = [
  { path: '/', label: 'Home' },
  { path: '/drinks', label: 'Drinks' },
  { path: '/events', label: 'Events' },
  { path: '/request', label: 'Request' }
];

// Add Admin link if authenticated
const navItems = computed(() => {
  const items = [...baseNavItems];
  if (authState.isAuthenticated) {
    items.unshift({ path: '/admin/dashboard', label: 'Admin' });
  }
  return items;
});
</script>

<template>
  <div class="main-layout" :class="{ 'layout-light': props.theme === 'light' }">
    <!-- Background Image -->
    <div
      v-if="props.bgImage"
      class="background-image"
      :style="{ backgroundImage: `url(${props.bgImage})`, height: bgHeight }"
    ></div>

    <!-- Desktop Navigation Bar -->
    <nav class="desktop-nav" :class="{ 'nav-hidden': isNavHidden, 'nav-dark': props.theme === 'dark', 'nav-light': props.theme === 'light' }">
      <div class="desktop-nav-content">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          class="desktop-nav-link"
        >
          {{ item.label }}
          <svg v-if="item.showArrow" class="nav-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </RouterLink>
      </div>
    </nav>

    <!-- Burger Menu (Mobile only) -->
    <div class="mobile-menu-wrapper">
      <BurgerMenu :is-open="isMenuOpen" :theme="props.theme" @toggle="toggleMenu" />
    </div>

    <!-- Navigation Overlay (Mobile) -->
    <nav class="main-nav" :class="{ 'nav-open': isMenuOpen }">
      <div class="nav-logo">
        <img src="/icon.png" alt="Ocean Pub Logo" class="logo-image" />
      </div>
      
      <div class="nav-content">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          @click="isMenuOpen = false" 
          class="nav-link"
        >
          {{ item.label }}
          <svg v-if="item.showArrow" class="nav-arrow-mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </RouterLink>
      </div>

      <div class="nav-footer">
        <RouterLink
          to="/impressum"
          @click="isMenuOpen = false"
          class="footer-link"
          >Impressum</RouterLink
        >
        <RouterLink
          to="/datenschutz"
          @click="isMenuOpen = false"
          class="footer-link"
          >Datenschutz</RouterLink
        >
      </div>
    </nav>

    <!-- Content Slot -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <FooterSection :theme="theme" />

    <!-- Cookie Consent Banner -->
    <CookieConsent />
  </div>
</template>

<style scoped>
.main-layout {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden; /* Clips elements that extend past the footer */
}

.layout-light {
  background-color: #fbf1dd;
  color: #163a4e;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* Height is dynamically set via JS to prevent mobile scroll-zoom issues */
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
  color: rgba(22, 58, 78, 0.7);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 600;
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
  height: 2px;
  background: #ff6f59;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.desktop-nav-link:hover {
  color: #ff6f59;
}

.desktop-nav-link:hover::after {
  width: 100%;
}

.desktop-nav-link.router-link-exact-active {
  color: #163a4e;
}

.desktop-nav-link.router-link-exact-active::after {
  width: 100%;
  background: #ff6f59;
}

.nav-arrow {
  position: absolute;
  top: 0.4rem;
  right: -0.9rem;
  width: 11px;
  height: 11px;
  opacity: 0.8;
  transition: transform 0.3s ease;
}

.desktop-nav-link:hover .nav-arrow {
  transform: translate(2px, -2px);
}

/* Light Theme overrides for desktop nav */
.desktop-nav.nav-light .desktop-nav-link {
  color: rgba(0, 0, 0, 0.5) !important;
}

.desktop-nav.nav-light .desktop-nav-link::after {
  background: rgba(0, 0, 0, 0.5);
}

.desktop-nav.nav-light .desktop-nav-link:hover {
  color: rgba(0, 0, 0, 1) !important;
}

.desktop-nav.nav-light .desktop-nav-link.router-link-exact-active {
  color: rgba(0, 0, 0, 1) !important;
}

.desktop-nav.nav-light .desktop-nav-link.router-link-exact-active::after {
  background: rgba(0, 0, 0, 0.8);
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
  background: linear-gradient(180deg, #7fc9e3 0%, #aee3da 38%, #fbf1dd 100%);
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
  border-top: 1px solid rgba(22, 58, 78, 0.12);
}

.footer-link {
  color: rgba(22, 58, 78, 0.55);
  text-decoration: none;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ff6f59;
}

.nav-link {
  color: #163a4e;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 700;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  display: block;
  letter-spacing: 0.02em;
  border-bottom: 1px solid transparent;
  margin: 0.2rem 0;
}

.nav-link:hover {
  color: #ff6f59;
}

.nav-arrow-mobile {
  display: inline-block;
  vertical-align: super;
  margin-left: 0.2rem;
  width: 12px;
  height: 12px;
  opacity: 0.8;
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
    font-size: 1.25rem;
    padding: 0.5rem 0;
    margin: 0.5rem 0;
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
