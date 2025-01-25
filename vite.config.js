import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    middlewareMode: true,
    headers: {
      'Content-Type': 'application/javascript'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  }
})
