import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/chapatucancha/',
  plugins: [react()],
  build: {
    outDir: 'publish',
    emptyOutDir: false,   // Preserva Dockerfile y nginx.conf en publish/
    rollupOptions: {
      output: {
        // Nombres estables para evitar acumulación de chunks con hash
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/index[extname]',
      }
    }
  },
})
