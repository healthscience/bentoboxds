import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  // base: path.resolve(__dirname, "./dist/"),
  base: "/",
  plugins: [
    vue(),
    wasm(),
    topLevelAwait(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'logo-bb.png'],
      manifest: {
        name: 'BentoBox-DS',
        short_name: 'BB-DS',
        description: 'Nocode AI  datas cience',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo-bb.png',
            sizes: '144x144',
            type: 'image/png'
          }
        ]
      }

    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
