import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {  // Redirects all `/api` requests to backend
        target: 'http://localhost:8080',  // Your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
