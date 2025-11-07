import { ref, reactive } from 'vue'

// Theme Store für verschiedene Design-Varianten
export const currentTheme = ref('berlin-bar')

export const themes = reactive({
  'berlin-bar': {
    name: 'Main',
    description: 'Sophisticated glassmorphism design with minimal transparency',
    colors: {
      sectionBg: 'rgba(0, 0, 0, 0.3)',
      containerBg: 'rgba(0, 0, 0, 0.4)',
      itemBg: 'rgba(0, 0, 0, 0.3)',
      textPrimary: '#ffffff',
      textSecondary: '#ffffff',
      textMuted: '#ffffff',
      border: 'rgba(255, 255, 255, 0.1)',
      borderHover: 'rgba(255, 255, 255, 0.25)',
    },
    effects: {
      backdropBlur: '15px',
      borderRadius: '4px',
      shadow: '0 5px 25px rgba(0, 0, 0, 0.2)',
      shadowHover: '0 15px 50px rgba(0, 0, 0, 0.3)',
    }
  },
  
  'glass-luxe': {
    name: 'Glass Luxe',
    description: 'Ultra-transparent glassmorphism with heavy blur effects',
    colors: {
      sectionBg: 'rgba(255, 255, 255, 0.02)',
      containerBg: 'rgba(255, 255, 255, 0.08)',
      itemBg: 'rgba(255, 255, 255, 0.06)',
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.9)',
      textMuted: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(255, 255, 255, 0.15)',
      borderHover: 'rgba(255, 255, 255, 0.3)',
    },
    effects: {
      backdropBlur: '25px',
      borderRadius: '12px',
      shadow: '0 8px 40px rgba(0, 0, 0, 0.3)',
      shadowHover: '0 20px 60px rgba(0, 0, 0, 0.4)',
    }
  },
  
  'minimal-flat': {
    name: 'Minimal Flat Design',
    description: 'Clean flat design with video only in hero section',
    colors: {
      sectionBg: 'rgb(18, 18, 18)',
      containerBg: 'rgba(255, 255, 255, 0.05)',
      itemBg: 'rgba(255, 255, 255, 0.03)',
      textPrimary: 'rgb(255, 255, 255)',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(255, 255, 255, 0.1)',
      borderHover: 'rgba(255, 255, 255, 0.2)',
      // Section-spezifische Hintergründe
      aboutBg: 'rgb(16, 16, 16)',
      menuBg: 'rgb(20, 20, 20)',
      eventsBg: 'rgb(14, 14, 14)',
      instagramBg: 'rgb(22, 22, 22)',
      contactBg: 'rgb(12, 12, 12)',
      footerBg: 'rgb(10, 10, 10)',
    },
    effects: {
      backdropBlur: '0px',
      borderRadius: '8px',
      shadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      shadowHover: '0 4px 20px rgba(0, 0, 0, 0.4)',
    }
  }
})

// Funktion zum Wechseln der Themes
export const setTheme = (themeName) => {
  if (themes[themeName]) {
    currentTheme.value = themeName
    applyThemeToCSS(themes[themeName])
  }
}

// CSS Custom Properties dynamisch setzen
const applyThemeToCSS = (theme) => {
  const root = document.documentElement
  
  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value)
  })
  
  // Effects
  Object.entries(theme.effects).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value)
  })
}

// Theme beim App-Start laden
export const initTheme = () => {
  const savedTheme = localStorage.getItem('pallas-theme') || 'berlin-bar'
  setTheme(savedTheme)
}

// Theme speichern
export const saveTheme = (themeName) => {
  localStorage.setItem('pallas-theme', themeName)
  setTheme(themeName)
}