import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({ include: ["events", "fs", "http", "path"] }),
    tailwindcss(),
    preact({
      prerender: {
        enabled: false,
        renderTarget: "#app",
        additionalPrerenderRoutes: ["/404"],
      },
    }),
    VitePWA({
      injectRegister: "inline",
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      includeManifestIcons: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        inlineWorkboxRuntime: true,
        navigateFallbackDenylist: [/^\/api/],
      },
      manifest: {
        name: "Schichtkalender Bosch RtP1",
        short_name: "Kontischicht",
        description:
          "Inoffizieller Schichtkalender für Bosch Reutlingen. Listet alle Kontischichten von Bosch Reutlingen auf.",
        start_url: "./?pwa",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#064E3B",
        icons: [
          {
            src: "assets/icons/favicon-32x32.png",
            type: "image/png",
            purpose: "any maskable",
            sizes: "32x32",
          },
          {
            src: "assets/icons/favicon-16x16.png",
            type: "image/png",
            purpose: "any maskable",
            sizes: "16x16",
          },
          {
            src: "assets/icons/android-chrome-192x192.png",
            type: "image/png",
            purpose: "any maskable",
            sizes: "192x192",
          },
          {
            src: "assets/icons/apple-touch-icon.png",
            type: "image/png",
            sizes: "180x180",
          },
          {
            src: "assets/icons/android-chrome-512x512.png",
            type: "image/png",
            purpose: "any maskable",
            sizes: "512x512",
          },
        ],
      },
    }),
  ],
});
