import { ref, reactive } from 'vue'

// Theme Store for different design concepts
export const useThemeStore = () => {
  const currentTheme = ref('beach')

  const themes = reactive({
    'beach': {
      name: 'Beach',
      description: 'Bright airy Schleswig-Holstein beach-bar: sand, sky and sea-foam',
      colors: {
        sectionBg: '#fbf1dd',
        containerBg: '#fffaf0',
        itemBg: '#fff6e6',
        textPrimary: '#163a4e',
        textSecondary: '#1f4c63',
        textMuted: '#4f6b78',
        border: 'rgba(22, 58, 78, 0.12)',
        borderHover: 'rgba(255, 111, 89, 0.55)',
        accent: '#ff6f59',
        accentSecondary: '#2f8fb0',
      },
      effects: {
        backdropBlur: '0px',
        borderRadius: '22px',
        shadow: '0 14px 34px rgba(22, 58, 78, 0.12)',
        shadowHover: '0 20px 48px rgba(22, 58, 78, 0.18)',
        borderWidth: '1px',
      }
    },

    'sunset': {
      name: 'Sunset',
      description: 'Warm dusk variant with deeper sand and golden hour tones',
      colors: {
        sectionBg: '#f6e3c8',
        containerBg: '#fff1d9',
        itemBg: '#ffe9c7',
        textPrimary: '#163a4e',
        textSecondary: '#1f4c63',
        textMuted: '#5a6f78',
        border: 'rgba(22, 58, 78, 0.14)',
        borderHover: 'rgba(247, 179, 43, 0.6)',
        accent: '#f7b32b',
        accentSecondary: '#ff6f59',
      },
      effects: {
        backdropBlur: '0px',
        borderRadius: '22px',
        shadow: '0 14px 34px rgba(22, 58, 78, 0.14)',
        shadowHover: '0 20px 48px rgba(22, 58, 78, 0.2)',
        borderWidth: '1px',
      }
    }
  })

  const applyThemeToCSS = (theme) => {
    if (!import.meta.client) return
    const root = document.documentElement

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })

    Object.entries(theme.effects).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
  }

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      currentTheme.value = themeName
      applyThemeToCSS(themes[themeName])
    }
  }

  const initTheme = () => {
    setTheme('beach')
  }

  const saveTheme = (themeName) => {
    if (import.meta.client) {
      localStorage.setItem('oceanpub-theme', themeName)
    }
    setTheme(themeName)
  }

  return { currentTheme, themes, setTheme, initTheme, saveTheme }
}
