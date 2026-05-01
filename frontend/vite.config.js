import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api':    { target: 'http://localhost:3000', changeOrigin: true, credentials: true },
      '/auth':   { target: 'http://localhost:3000', changeOrigin: true, credentials: true },
      '/logout': { target: 'http://localhost:3000', changeOrigin: true, credentials: true },
    },
  },
  build: {
    outDir: '../public/app',
    emptyOutDir: true,
  },
})
