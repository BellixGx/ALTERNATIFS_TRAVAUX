import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // For Ant Design
      },
    },
  },
  resolve: {
    alias: {
      // If you use Ant Design, this might help with imports
      '@': '/src',
      'antd/lib/avatar': 'antd/es/avatar',
    },
  },
  worker: {
    format: 'es', // Ensure Web Workers use ES modules
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://bellix.pythonanywhere.com',
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
})
