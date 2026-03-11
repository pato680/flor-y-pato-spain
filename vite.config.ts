import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/flor-y-pato-spain/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-180.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Flor & Pato — España 2026',
        short_name: 'Flor & Pato',
        description: 'Viaje a España 2026',
        theme_color: '#F5F5F3',
        background_color: '#F5F5F3',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/flor-y-pato-spain/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-180.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple touch icon',
          },
        ],
      },
    }),
  ],
})
