import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    strictPort: true,
    host: "0.0.0.0",
    watch: {
      usePolling: true
    },
    allowedHosts: [
      'localhost'
    ]
  },
  publicDir: 'public',
  preview: {
    port: 3000,
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    outDir: './src/dist',
  },
});