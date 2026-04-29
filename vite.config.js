import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true, // ✅ important
    allowedHosts: ['seedneurodiverse.up.railway.app']
  },

  preview: {
    host: true, // ✅ important
    allowedHosts: ['seedneurodiverse.up.railway.app']
  }
})
