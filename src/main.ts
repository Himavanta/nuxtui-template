import ui from '@nuxt/ui/vue-plugin'
import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'
import { pinia } from './stores'

import './styles/main.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
// ui 插件要注册 router 实例，Nuxt UI 的 UButton/Link 才能走 vue-router 跳转而不是刷新页面
app.use(ui, { router: () => router })

app.mount('#app')
