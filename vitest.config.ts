import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import type { ConfigEnv } from 'vite'
import viteConfig from './vite.config'

// viteConfig 是一個函數，需要調用它來獲取配置對象
const viteConfigObj = typeof viteConfig === 'function' 
  ? viteConfig({ mode: 'test', command: 'build' } as ConfigEnv) 
  : viteConfig

export default mergeConfig(
  viteConfigObj,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
