import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['events', 'buffer', 'stream']
    })
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/]react/, priority: 20 },
            { name: 'mantine', test: /node_modules[\\/]@mantine/, priority: 15 },
            { name: 'vendor', test: /node_modules/, priority: 10 }
          ]
        }
      }
    }
  }
});
