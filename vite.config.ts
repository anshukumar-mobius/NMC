import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
    Buffer: 'globalThis.Buffer',
    process: 'globalThis.process',
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      util: 'util',
      stream: 'stream-browserify',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['jsonwebtoken', 'jws', 'util', 'stream-browserify', 'readable-stream'],
  },
});
