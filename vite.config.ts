import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api/teams": {
        target: "http://140.84.189.81:8080",
        changeOrigin: true,
        secure: false,
      },
      "/api/users": {
        target: "http://140.84.189.81:8080",
        changeOrigin: true,
        secure: false,
      },
      "/api/userteams": {
        target: "http://140.84.189.81:8080",
        changeOrigin: true,
        secure: false,
      },
      //Apartado de tickets
      "/api/sprints": {
        target: "http://140.84.189.81:8081",
        changeOrigin: true,
        secure: false,
      },
      "/api/epics": {
        target: "http://140.84.189.81:8081",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasksprint": {
        target: "http://140.84.189.81:8081",
        changeOrigin: true,
        secure: false,
      },
      "/api/task": {
        target: "http://140.84.189.81:8081",
        changeOrigin: true,
        secure: false,
      },
      "/api/taskassignments": {
        target: "http://140.84.189.81:8081",
        changeOrigin: true,
        secure: false,
      },
      "/api/task_dependencies": {
        target: "http://140.84.189.81:8081",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
