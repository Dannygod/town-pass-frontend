import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import ui from '@nuxt/ui/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數
  const env = loadEnv(mode, process.cwd(), '')
  
  // 構建代理配置
  const proxyConfig: Record<string, any> = {}
  
  // 只有在有設定 VITE_BACKEND_URL 時才配置代理
  if (env.VITE_BACKEND_URL) {
    proxyConfig['/api'] = {
      target: env.VITE_BACKEND_URL,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ''),
    }
  }
  
  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      ui(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      proxy: proxyConfig,
    },
  }
})
