// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },

  // Nitro for Cloudflare Pages
  nitro: {
    preset: 'cloudflare-pages',
  },

  // Dev server
  devServer: {
    port: 5172,
  },

  // SSR enabled (default)
  ssr: true,

  // Route-level SSR rules
  routeRules: {
    '/admin/**': { ssr: false },
  },

  // Modules
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
  ],

  // Global CSS
  css: [
    '~/assets/styles/style.css',
    '~/assets/styles/themes.css',
  ],

  // App head (global meta tags)
  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'PALLAS.WORLD – Bar, Events & Kultur in Hamburg',
      meta: [
        { name: 'description', content: 'PALLAS.WORLD – Dein Wohnzimmer in Hamburg-St. Pauli. Bar, Events, Kultur & Nachtleben am Neuen Pferdemarkt 13. Everybody Welcome.' },
        { name: 'theme-color', content: '#000000' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'PALLAS.WORLD' },
        { property: 'og:title', content: 'PALLAS.WORLD – Bar, Events & Kultur in Hamburg' },
        { property: 'og:description', content: 'Dein Wohnzimmer in Hamburg-St. Pauli. Bar, Events, Kultur & Nachtleben am Neuen Pferdemarkt 13. Everybody Welcome.' },
        { property: 'og:image', content: 'https://pallas.world/og-image.jpg' },
        { property: 'og:url', content: 'https://pallas.world' },
        { property: 'og:locale', content: 'de_DE' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'PALLAS.WORLD – Bar, Events & Kultur in Hamburg' },
        { name: 'twitter:description', content: 'Dein Wohnzimmer in Hamburg-St. Pauli. Bar, Events, Kultur & Nachtleben am Neuen Pferdemarkt 13.' },
        { name: 'twitter:image', content: 'https://pallas.world/og-image.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'apple-touch-icon', href: '/icon.png' },
        { rel: 'canonical', href: 'https://pallas.world' },
      ],
    },
  },

  // Google Fonts (optimized loading)
  googleFonts: {
    families: {
      'Krona One': true,
      'Montserrat': [100, 200, 300, 400, 500, 600, 700],
      'Source Sans 3': [200, 300, 400, 500, 600, 700],
    },
    display: 'swap',
    preconnect: true,
    prefetch: true,
  },

  // Sitemap
  site: {
    url: 'https://pallas.world',
    name: 'PALLAS.WORLD',
  },

  sitemap: {
    urls: [
      { loc: '/', priority: 1.0, changefreq: 'weekly' },
      { loc: '/events', priority: 0.9, changefreq: 'daily' },
      { loc: '/request', priority: 0.8, changefreq: 'monthly' },
      { loc: '/jobs', priority: 0.7, changefreq: 'weekly' },
      { loc: '/drinks', priority: 0.7, changefreq: 'monthly' },
      { loc: '/stories', priority: 0.6, changefreq: 'monthly' },
    ],
  },

  // Robots
  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
    ],
    sitemap: 'https://pallas.world/sitemap.xml',
  },

  // Schema.org
  schemaOrg: {
    identity: {
      type: 'BarOrPub',
      name: 'PALLAS.WORLD',
      url: 'https://pallas.world',
      logo: 'https://pallas.world/icon.png',
      image: 'https://pallas.world/og-image.jpg',
      description: 'Bar, Events & Kultur in Hamburg-St. Pauli. Everybody Welcome.',
      address: {
        streetAddress: 'Neuer Pferdemarkt 13',
        addressLocality: 'Hamburg',
        postalCode: '20359',
        addressCountry: 'DE',
      },
      email: 'adjsavedmylife@pallas.world',
      sameAs: [
        'https://instagram.com/pallas_world',
      ],
    },
  },

  // Vite config
  vite: {
    resolve: {
      alias: {
        '@': '/assets',
      },
    },
  },

  // Runtime config for API
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:5051',
      apiUrl: process.env.VITE_API_URL || 'http://localhost:5051',
    },
  },
})
