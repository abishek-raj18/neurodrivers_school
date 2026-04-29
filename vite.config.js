import { defineConfig } from 'vite'

export default defineConfig({
  // Expose any env variable prefixed with VITE_ to the browser
  // (Vite does this by default, but explicit config makes it clear)
  envPrefix: 'VITE_',

  server: {
    port: 3000,         // local dev port
    open: true,         // auto-open browser on `npm run dev`
  },

  preview: {
    // `npm run start` (Railway) reads PORT from process.env automatically
    port: parseInt(process.env.PORT) || 4173,
    host: '0.0.0.0',   // required to be reachable on Railway
    allowedHosts: ['all'],
  },
})
