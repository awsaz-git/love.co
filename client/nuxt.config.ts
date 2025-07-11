// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: ['@nuxt/fonts', '@nuxt/ui', '@nuxt/image', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: false,
  }
})