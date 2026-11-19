import { fileURLToPath, URL } from 'node:url'

import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, lazyPlugins } from 'vite-plus'

// https://vite.dev/config/
export default defineConfig({
  // Nuxt UI 的 Vite 插件内部已经带了 Tailwind，不要再单独加 @tailwindcss/vite
  plugins: lazyPlugins(() => [vue(), ui()]),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  staged: {
    // 注意：vp check 不检查 .vue 文件内部（含类型），所以 pre-commit 额外跑一次 vue-tsc
    '*': 'vp check --fix'
  },
  fmt: {
    semi: false,
    sortImports: {},
    singleQuote: true,
    trailingComma: 'none',
    jsxSingleQuote: true
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    plugins: ['vue'],
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error'
    },
    options: { typeAware: true, typeCheck: true }
  }
})
