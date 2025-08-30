import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
    Buffer: 'globalThis.Buffer',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      util: 'util',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
