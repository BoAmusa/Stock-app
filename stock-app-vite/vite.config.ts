import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [react()],
    server: {
      proxy: isDev
        ? {
            '/api': {
              target: 'http://127.0.0.1:7071/',
              changeOrigin: true,
            },
          }
        : undefined,
    },
  }
})

