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
      '@': '/src',
      'antd/lib/avatar': 'antd/es/avatar',
    },
  },
  worker: {
    format: 'es',
  },
})
