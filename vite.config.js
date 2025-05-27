import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './', 
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@common': path.resolve(__dirname, './src/components/common'),
      '@footer': path.resolve(__dirname, './src/components/footer'),
      '@header': path.resolve(__dirname, './src/components/header'),
      '@post': path.resolve(__dirname, './src/components/post'),
      '@sidebar': path.resolve(__dirname, './src/components/sidebar'),
      '@stories': path.resolve(__dirname, './src/components/stories'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@icons': path.resolve(__dirname, './src/assets/icons'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@utils': path.resolve(__dirname, './src/services/utils'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
    }
  }
})
