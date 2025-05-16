import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api/auth/teams": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/auth/users": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/auth/userteams": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },

      //Apartado de tickets
      "/api/tasks/sprints": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/epics": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasksprint": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasks/": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasks/tasks": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasks/taskassignments": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/task_dependencies": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/files/attachments/": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
      "/api/files/attachments/upload": {
        target: "http://140.84.189.81",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
