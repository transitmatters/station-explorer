import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  // The router plugin must come before react() so it can generate routeTree.gen.ts first
  plugins: [tanstackRouter({ target: 'react' }), react()],
});
