import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  // base: path.resolve(__dirname, "./dist/"),
  base: "/bentobox/",
  plugins: [
    vue(),
    wasm(),
    topLevelAwait(),
    basicSsl(),
    VitePWA({
      mode: "development",
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false
      },
      includeAssets: ['favicon.ico', 'logo-512x512.png'],
      manifest: {
        name: 'BentoBox-DS',
        short_name: 'BB-DS',
        description: 'Nocode AI  datas cience',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo-512x512.png',
            sizes: '512x512',
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
