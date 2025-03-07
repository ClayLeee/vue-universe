import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vue-universe/',
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@assets', replacement: '/src/assets' }
    ]
  },
  // 防止 OrbitControls 等 Three.js 組件被識別為外部依賴
  optimizeDeps: {
    include: ['three']
  }
})
