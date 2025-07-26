import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true, // <- Allow cross-origin requests
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: ['63213bb3ec85.ngrok-free.app'],
  }
})
