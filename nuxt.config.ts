import { defineLocalBusiness } from 'nuxt-schema-org/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  experimental: {
    appManifest: false,
  },

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
      title: 'OCEAN PUB - Die Beste Bar in Dahme',
      meta: [
        { name: 'description', content: 'OCEAN PUB – Deine Strandbar an der Ostsee in Dahme. Drinks, Sonnenuntergänge, Events & gute Laune direkt an der Strandpromenade. Everybody Welcome.' },
        { name: 'theme-color', content: '#7fc9e3' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'OCEAN PUB' },
        { property: 'og:title', content: 'OCEAN PUB – Strandbar, Drinks & Events in Dahme' },
        { property: 'og:description', content: 'Deine Strandbar an der Ostsee in Dahme. Drinks, Sonnenuntergänge, Events & gute Laune an der Strandpromenade. Everybody Welcome.' },
        { property: 'og:image', content: 'https://ocean-bar.de/og-image.jpg' },
        { property: 'og:url', content: 'https://ocean-bar.de' },
        { property: 'og:locale', content: 'de_DE' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'OCEAN PUB – Strandbar, Drinks & Events in Dahme' },
        { name: 'twitter:description', content: 'Deine Strandbar an der Ostsee in Dahme. Drinks, Sonnenuntergänge & Events an der Strandpromenade.' },
        { name: 'twitter:image', content: 'https://ocean-bar.de/og-image.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icon.png' },
        { rel: 'apple-touch-icon', href: '/icon.png' },
        { rel: 'canonical', href: 'https://ocean-bar.de' },
      ],
    },
  },

  // Google Fonts (optimized loading)
  googleFonts: {
    families: {
      'Baloo 2': [400, 500, 600, 700, 800],
      'Quicksand': [400, 500, 600, 700],
      'Nunito': [300, 400, 500, 600, 700],
      'Montserrat': [400, 500, 600, 700],
    },
    display: 'swap',
    preconnect: true,
    prefetch: true,
  },

  // Sitemap
  site: {
    url: 'https://ocean-bar.de',
    name: 'OCEAN PUB',
  },

  sitemap: {
    urls: [
      { loc: '/', priority: 1.0, changefreq: 'weekly' },
      { loc: '/events', priority: 0.9, changefreq: 'daily' },
      { loc: '/request', priority: 0.8, changefreq: 'monthly' },
      { loc: '/drinks', priority: 0.7, changefreq: 'monthly' },
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
    sitemap: 'https://ocean-bar.de/sitemap.xml',
  },

  // Schema.org
  schemaOrg: {
    identity: defineLocalBusiness({
      '@type': 'BarOrPub',
      'name': 'OCEAN PUB',
      'url': 'https://ocean-bar.de',
      'logo': 'https://ocean-bar.de/icon.png',
      'image': 'https://ocean-bar.de/og-image.jpg',
      'description': 'Strandbar an der Ostsee in Dahme. Drinks, Sonnenuntergänge & Events an der Strandpromenade. Everybody Welcome.',
      'address': {
        streetAddress: 'An d. Strandpromenade 20',
        addressLocality: 'Dahme',
        postalCode: '23747',
        addressCountry: 'DE',
      },
      'email': 'info@ocean-bar.de',
      'sameAs': [
        'https://instagram.com/oceanpub_dahme',
      ],
    }),
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
