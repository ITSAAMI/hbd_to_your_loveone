import { defineConfig } from 'vite';

export default defineConfig({
  base: '/hbd_to_your_loveone/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 3000,
  }
});
