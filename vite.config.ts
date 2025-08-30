import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'buffer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
    Buffer: Buffer,
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
