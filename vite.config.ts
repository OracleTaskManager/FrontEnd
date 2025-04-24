import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/teams": {
        target: "http://159.54.136.26:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
