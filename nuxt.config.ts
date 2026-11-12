// https://nuxt.com/docs/api/configuration/nuxt-config
import data from './app/data/conference-data.json'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // PWA module: manifest + service worker (Workbox), see docs/schritt3/01-pwa-setup.md
  modules: ['@vite-pwa/nuxt'],

  // Global design tokens from /tokens (~~ points to the project root)
  css: ['~~/tokens/tokens.css'],

  // Register components by file name only, e.g. SessionCard instead of FeaturesSessionsSessionCard
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'Ctrl Alt Meet',
      meta: [
        // Browser UI colour, same as manifest theme_color (--green-700 / --color-action)
        { name: 'theme-color', content: '#075e46' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@700&display=swap',
        },
      ],
    },
  },

  // Rendering strategy per route, see docs/schritt2/01-rendering-strategie-adr.md
  routeRules: {
    '/':            { prerender: true },                    // SSG, home page
    '/speakers':    { prerender: true },                    // SSG, speaker list
    '/speakers/**': { prerender: true },                    // SSG, profiles
    '/sessions':    { swr: 60, prerender: false },          // ISR principle, overview, never static
    '/sessions/**': { swr: 60, prerender: false },          // ISR principle, never static
    '/my-program':  { ssr: false, prerender: false, headers: { 'x-robots-tag': 'noindex' } }, // CSR
  },

  nitro: {
    prerender: {
      // All 18 profiles explicitly, independent of the crawler
      routes: ['/speakers', ...data.speakers.map((s) => `/speakers/${s.id}`)],
    },
  },

  // PWA, see docs/schritt3/01-pwa-setup.md
  pwa: {
    registerType: 'autoUpdate', // new service worker activates without user prompt
    manifest: {
      name: 'Ctrl Alt Meet',
      short_name: 'Ctrl Alt Meet',
      description: 'Der Shortcut durch die FrontendNow',
      lang: 'de',
      id: '/',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      theme_color: '#075e46',      // --green-700 / --color-action
      background_color: '#e8fff2', // --green-50 / --color-bg
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      // App shell with home page: precached on install (Cache-First).
      // See 02-offline-strategie-konzept.md, "1. Statische Assets".
      globPatterns: ['**/*.{js,css,png,svg,ico}', 'index.html'],
      // "Mein Programm" page is precached as well ("3. Mein Programm").
      // It is CSR (rendering ADR, decision 4) and not a static file, so it is added by hand.
      // The revision changes with every build.
      additionalManifestEntries: [{ url: '/my-program', revision: String(Date.now()) }],
      // Nuxt appends the build id (?_b=...) to payload requests. Ignore it so the
      // precached _payload.json of the home page is found offline.
      // utm_ and fbclid are Workbox defaults and must be listed again.
      ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^_b$/],
      navigateFallback: null, // offline behaviour follows in C
    },
  },
})