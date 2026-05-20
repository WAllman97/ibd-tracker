import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration
// This tells Vite how to build and run your React app
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // Automatically open browser when you run npm run dev
  }
})
