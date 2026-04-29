import { defineConfig } from 'vite'

export default defineConfig({
  // Expose any env variable prefixed with VITE_ to the browser
  envPrefix: 'VITE_',

  server: {
    port: 3000,       // local dev port
    open: true,       // auto-open browser on `npm run dev`
    // Allow Railway domain during dev tunnelling (optional but safe)
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'seedneurodiverse.up.railway.app',
    ],
  },

  preview: {
    // Railway injects $PORT at runtime
    port: parseInt(process.env.PORT) || 4173,
    host: '0.0.0.0',   // bind to all interfaces — required on Railway
    // Explicitly allow the Railway public domain
    allowedHosts: [
      'seedneurodiverse.up.railway.app',
      'localhost',
    ],
  },
})
