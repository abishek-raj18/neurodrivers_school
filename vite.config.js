import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['neurodrivers-school.vercel.app', 'seedneurodiverse.in']
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        blogSignsOfAutism: 'blog-signs-of-autism.html',
        blogSupportNeurodiverseKids: 'blog-support-neurodiverse-kids.html'
      }
    }
  }
})
