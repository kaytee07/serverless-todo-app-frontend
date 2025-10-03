import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']
  })],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://d99r7diwwi.execute-api.eu-west-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/prod')
      }
    }
  },
  // Add this to fix AWS Amplify issues
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    }
  },
  optimizeDeps: {
    include: ['aws-amplify'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  
})