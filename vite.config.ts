import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api/auth/teams": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/auth/users": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/auth/userteams": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },

      //Apartado de tickets
      "/api/tasks/sprints": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasks/epics/": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasks/tasksprint/": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasks/": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasks/tasks": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasks/taskassignments": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/tasks/task_dependencies": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/files/attachments/": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/files/attachments/upload": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/auth/userteams/remove": {
        target: "https://oraclekairo.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
