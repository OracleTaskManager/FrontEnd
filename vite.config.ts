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
      "/users": {
        target: "http://159.54.136.26:8080",
        changeOrigin: true,
        secure: false,
      },
      "/userteams": {
        target: "http://159.54.136.26:8080",
        changeOrigin: true,
        secure: false,
      },
      //Apartado de tickets
      "/sprints": {
        target: "http://159.54.147.6:8081",
        changeOrigin: true,
        secure: false,
      },
      "/epics": {
        target: "http://159.54.147.6:8081",
        changeOrigin: true,
        secure: false,
      },
      "/tasksprint": {
        target: "http://159.54.147.6:8081",
        changeOrigin: true,
        secure: false,
      },
      "/task": {
        target: "http://159.54.147.6:8081",
        changeOrigin: true,
        secure: false,
      },
      "/taskassignments": {
        target: "http://159.54.147.6:8081",
        changeOrigin: true,
        secure: false,
      },
      "/task_dependencies": {
        target: "http://159.54.147.6:8081",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
