<script setup>
import { ref } from 'vue'
import { currentTheme, themes, saveTheme } from '../stores/themeStore.js'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'dark' // supports 'dark' (white lines) and 'light' (black lines)
  }
})

defineEmits(['toggle'])

const showThemeSelector = ref(false)

const toggleThemeSelector = () => {
  showThemeSelector.value = !showThemeSelector.value
}

const selectTheme = (themeName) => {
  saveTheme(themeName)
  showThemeSelector.value = false
}
</script>

<template>
  <div class="burger-menu">
    <button 
      class="burger-button" 
      :class="{ 'is-open': isOpen, 'is-light-theme': theme === 'light' }"
      @click="$emit('toggle')"
      aria-label="Toggle menu"
    >
      <span class="burger-line"></span>
      <span class="burger-line"></span>
      <span class="burger-line"></span>
    </button>
    
    <!-- Theme Selector Button -->
    <button 
      class="theme-button"
      @click="toggleThemeSelector"
      :class="{ 'active': showThemeSelector, 'is-light-theme': theme === 'light' && !isOpen }"
      aria-label="Change theme"
      title="Design Varianten"
    >
      🎨
    </button>
    
    <!-- Theme Selector Dropdown -->
    <div class="theme-selector" :class="{ 'show': showThemeSelector }">
      <div class="theme-header">
        <h3>Design Varianten</h3>
      </div>
      
      <div class="theme-options">
        <div 
          v-for="(theme, key) in themes" 
          :key="key"
          class="theme-option"
          :class="{ 'active': currentTheme === key }"
          @click="selectTheme(key)"
        >
          <div class="theme-preview" :data-theme="key"></div>
          <div class="theme-info">
            <h4>{{ theme.name }}</h4>
            <p>{{ theme.description }}</p>
          </div>
          <div class="theme-check" v-if="currentTheme === key">✓</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.burger-menu {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.burger-button {
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.burger-button:hover {
  transform: scale(1.05);
}

.burger-line {
  width: 20px;
  height: 2px;
  background: white;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
}

/* Light Theme support for the Burger Lines */
.burger-button.is-light-theme:not(.is-open) .burger-line {
  background: black;
}

/* Hamburger to X animation */
.burger-button.is-open .burger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.burger-button.is-open .burger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.burger-button.is-open .burger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Theme Button */
.theme-button {
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.theme-button:hover,
.theme-button.active {
  transform: scale(1.05);
}

.theme-button.is-light-theme {
  filter: invert(1);
}

/* Theme Selector */
.theme-selector {
  position: absolute;
  top: 0;
  right: 90px;
  width: 320px;
  max-height: 500px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1.2rem;
  opacity: 0;
  visibility: hidden;
  transform: translateX(20px);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
}

.theme-selector.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

.theme-header {
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.8rem;
}

.theme-header h3 {
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  font-weight: 300;
  margin: 0 0 0.3rem 0;
  letter-spacing: 0.1em;
}

.theme-header p {
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.9rem;
  margin: 0;
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.theme-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.theme-option.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.theme-preview {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

/* Theme Preview Styles */
.theme-preview[data-theme="berlin-bar"] {
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.8) 0%, 
    rgba(255, 255, 255, 0.1) 100%);
}

.theme-preview[data-theme="glass-luxe"] {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(10px);
}

.theme-preview[data-theme="cyber-noir"] {
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.9) 0%, 
    rgba(0, 255, 255, 0.2) 100%);
  box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.3);
}

.theme-preview[data-theme="minimal-white"] {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.3) 0%, 
    rgba(255, 255, 255, 0.1) 100%);
}

.theme-preview[data-theme="retro-gradient"] {
  background: linear-gradient(135deg, 
    rgba(255, 0, 150, 0.3) 0%, 
    rgba(0, 255, 255, 0.3) 100%);
}

.theme-info {
  flex: 1;
}

.theme-info h4 {
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.95rem;
  font-weight: 300;
  margin: 0 0 0.3rem 0;
  letter-spacing: 0.05em;
}

.theme-info p {
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.3;
}

.theme-check {
  color: #00ff88;
  font-size: 1.2rem;
  font-weight: bold;
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .burger-menu {
    top: 1rem;
    right: 1rem;
  }
  
  .burger-button,
  .theme-button {
    width: 36px;
    height: 36px;
    padding: 0.4rem;
  }
  
  .burger-line {
    width: 18px;
  }
  
  .theme-selector {
    right: 50px;
    width: 280px;
    padding: 1rem;
  }
  
  .theme-option {
    padding: 0.6rem;
    gap: 0.6rem;
  }
  
  .theme-preview {
    width: 28px;
    height: 28px;
  }
  
  .theme-info h4 {
    font-size: 0.85rem;
  }
  
  .theme-info p {
    font-size: 0.75rem;
  }
}

/* Ultra-wide screens */
@media (max-width: 500px) {
  .theme-selector {
    right: -240px;
    width: 260px;
  }
}

/* Hide on desktop when nav is always visible */
@media (min-width: 768px) {
  .burger-menu {
    display: flex; /* Keep visible for demo purposes */
  }
}
</style>