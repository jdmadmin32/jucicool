import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Split vendor chunks to reduce main bundle size (fixes the 500kB warning)
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react'],
          'vendor-utils': ['canvas-confetti', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // Raise the warning threshold slightly (500kB → 600kB)
    chunkSizeWarningLimit: 600,
  },
})

