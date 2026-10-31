// https://nuxt.com/docs/api/configuration/nuxt-config
import data from './app/data/conference-data.json'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Global design tokens from /tokens (~~ points to the project root)
  css: ['~~/tokens/tokens.css'],

  // Register components by file name only, e.g. SessionCard instead of FeaturesSessionsSessionCard
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'Ctrl Alt Meet',
      link: [
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
    '/sessions':    { swr: 60 },                            // ISR principle, overview
    '/sessions/**': { swr: 60, prerender: false },          // ISR principle, never static
    '/my-program':  { ssr: false, headers: { 'x-robots-tag': 'noindex' } }, // CSR
  },

  nitro: {
    prerender: {
      // All 18 profiles explicitly, independent of the crawler
      routes: ['/speakers', ...data.speakers.map((s) => `/speakers/${s.id}`)],
    },
  },
})