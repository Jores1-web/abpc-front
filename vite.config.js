import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
    registerType: "autoUpdate",
    injectRegister: 'auto',
    strategies: 'generateSW',
    devOptions: {
      enabled: false,
    },
    includeAssets: [
      "favicon.svg",
      "robots.txt", 
      "apple-touch-icon.png",
      "logo-header.png",
    ],
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
    },
    manifest: {
      name: "ABPC — Signalement des Sinistres",
      short_name: "ABPC",
      description: "Signalez un sinistre en temps réel à l'Agence Béninoise de Protection Civile",
      theme_color: "#0B1E3D",
      background_color: "#0B1E3D",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      lang: "fr",
      icons: [
        {
          src: "/logo-header.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/logo-header.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        },
      ],
      shortcuts: [
        {
          name: "Signaler un sinistre",
          short_name: "Signaler",
          url: "/signaler",
          icons: [{ src: "/logo-header.png", sizes: "192x192" }],
        },
      ],
    },
  }),
    ],

  server: {
    host: true,
    allowedHosts: ["browsing-user-regroup.ngrok-free.dev"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
