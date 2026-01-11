import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'   // Vite React plugin
import tailwindcss from '@tailwindcss/vite'      // Tailwind Vite plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    cssMinify: 'esbuild',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5020',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
