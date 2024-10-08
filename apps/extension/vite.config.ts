import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  define: {
    // a workaround for @metamask/post-message-stream - readable-stream
    'process.env.DEBUG': 'false',
    'process.nextTick': `(callback, ...args) => {
          if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
          }
          Promise.resolve().then(() => callback(...args));
        }`,
  },
  plugins: [
    react(),
    crx({ manifest }),
    // a workaround for @metamask/post-message-stream - readable-stream
    nodePolyfills({
      include: ['process', 'util'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // 'util': 'node_modules'
    },
  },
  build: {
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        sidePanel: resolve(__dirname, 'src/entries/side-panel/index.html'),
        tab: resolve(__dirname, 'src/entries/tab/index.html'),
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
