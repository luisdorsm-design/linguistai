
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Esto permite usar process.env.API_KEY en el cliente
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    port: 5173,
    host: true
  }
});
