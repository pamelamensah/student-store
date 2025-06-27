import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [
    react({
      include: ["./src/main.jsx"],
    }),
  ],
  server: {
    port: 5173,
    open: true,
    host: true,
    proxy: {
      "/products": "http://localhost:3000",
      "/orders": "http://localhost:3000",
      "/order-items": "http://localhost:3000",
    }
  }
})
