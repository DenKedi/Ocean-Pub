import { ref, reactive } from 'vue'

// Theme Store for different design concepts
export const currentTheme = ref('glassmorphism')

export const themes = reactive({
  'glassmorphism': {
    name: 'Glassmorphism',
    description: 'Frosted glass effect with subtle transparency and blur',
    colors: {
      sectionBg: 'rgba(255, 255, 255, 0.05)',
      containerBg: 'rgba(255, 255, 255, 0.1)',
      itemBg: 'rgba(255, 255, 255, 0.08)',
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.9)',
      textMuted: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(255, 255, 255, 0.18)',
      borderHover: 'rgba(255, 255, 255, 0.35)',
    },
    effects: {
      backdropBlur: '20px',
      borderRadius: '16px',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
      shadowHover: '0 12px 48px rgba(0, 0, 0, 0.45)',
      borderWidth: '1px',
    }
  },
  
  'minimalist': {
    name: 'Minimalist',
    description: 'Clean and simple with ample white space',
    colors: {
      sectionBg: 'rgba(0, 0, 0, 0.02)',
      containerBg: 'rgba(0, 0, 0, 0.05)',
      itemBg: 'rgba(0, 0, 0, 0.03)',
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.85)',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(255, 255, 255, 0.08)',
      borderHover: 'rgba(255, 255, 255, 0.15)',
    },
    effects: {
      backdropBlur: '0px',
      borderRadius: '2px',
      shadow: 'none',
      shadowHover: '0 2px 8px rgba(255, 255, 255, 0.1)',
      borderWidth: '1px',
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
  const savedTheme = 'glassmorphism'
  setTheme(savedTheme)
}

// Theme speichern
export const saveTheme = (themeName) => {
  localStorage.setItem('pallas-theme', themeName)
  setTheme(themeName)
}