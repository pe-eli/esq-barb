import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // ← permite acesso de outros dispositivos da rede
    port: 5173         // ← ou outra porta, se desejar
  }
})
