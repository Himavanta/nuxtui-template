# nuxtui-template

Vue 3 项目模版。TypeScript + Vite+ + Nuxt UI + Pinia + Vue Router + ky。

新项目用 `npx degit Himavanta/nuxtui-template <dir>` 或 GitHub 的「Use this template」
创建，不要 `vp create` 从零搭，也不要 git clone 后手动删 `.git`。

## 动手前先查 llms.txt

**涉及依赖的 API、配置项、插件用法，先读该依赖的 llms.txt，不要凭记忆写。**
这几个库都在快速迭代（Nuxt UI 4、Vue Router 5、Vite+ 1.x、Tailwind 4 近期都有破坏性变更），
训练数据里的写法大概率已过时，猜错比不写代价更大。

| 依赖           | llms.txt                          | 什么时候查                                                   |
| -------------- | --------------------------------- | ------------------------------------------------------------ |
| Vite+          | https://viteplus.dev/llms.txt     | `vp` 命令、`vite.config.ts` 各配置块、env / hooks / monorepo |
| Vite           | https://vite.dev/llms.txt         | 插件、`resolve.alias`、环境变量、构建选项                    |
| Vue            | https://vuejs.org/llms.txt        | 响应式、生命周期、`<script setup>`、组件通信                 |
| Vue Router     | https://router.vuejs.org/llms.txt | 路由配置、守卫、meta、懒加载（注意 v5 的变化）               |
| Pinia          | https://pinia.vuejs.org/llms.txt  | store 定义、插件、store 外使用                               |
| Nuxt UI        | https://ui.nuxt.com/llms.txt      | 组件 props / slots / 主题变量 / composable，**最高频**       |
| Oxlint / Oxfmt | https://oxc.rs/llms.txt           | lint 规则名、格式化选项、与 Vite+ 的集成                     |
| Tabler Icons   | https://tabler.io/llms.txt        | 找图标名、确认图标集合                                       |

Nuxt UI 还有一份 agent 专属的约定与选型指南，**加组件或做布局前先看这个**：
https://ui.nuxt.com/.well-known/skills/nuxt-ui/SKILL.md

llms.txt 只是索引。具体页面在路径后加 `.md` 就能拿 Markdown 全文，例如
`https://ui.nuxt.com/docs/components/button.md`；Vue / Vue Router / Pinia 的文档站同样支持。

没有 llms.txt 的：Tailwind CSS、Sass、TypeScript、pnpm 查各自官网；ky 没有官网，
读 `node_modules/ky/readme.md`（含完整 options 与 hook 说明）。
Vite+ 的完整文档本地也有一份：`node_modules/vite-plus/docs`。

## 技术栈

| 领域          | 选型                                         | 说明                                                                    |
| ------------- | -------------------------------------------- | ----------------------------------------------------------------------- |
| 构建 / 工具链 | **Vite+**（`vp`）                            | 统一 CLI，注意 `vp <cmd>` 是内置命令，`vp run <script>` 才是 npm script |
| 框架          | Vue 3.5 + `<script setup lang="ts">`         | 不写 Options API                                                        |
| 类型          | TypeScript 6                                 | `vue-tsc -b` 做类型检查                                                 |
| UI            | Nuxt UI 4                                    | 组件自动导入，前缀 `U`                                                  |
| 样式          | Tailwind CSS 4 + SCSS Modules                | 规则见「样式规范」                                                      |
| 图标          | Tabler，经 Iconify（`@iconify-json/tabler`） | 统一写 `i-tabler-xxx`                                                   |
| 路由          | Vue Router 5，**手写路由表**                 | 不用文件约定式路由                                                      |
| 状态          | Pinia，setup 语法                            |                                                                         |
| 请求          | ky，封装在 `src/api`                         | 业务代码不直接 import ky                                                |
| 格式化 / Lint | Oxfmt + Oxlint（`vp check`）                 |                                                                         |

## 目录职责

```
src/
├── api/            # 网络层，唯一允许 import ky 的地方
│   ├── client.ts   # ky 实例、泛型请求方法、token 存取
│   ├── error.ts    # ApiError 与错误归一化
│   └── modules/    # 按业务域分文件：user.ts / order.ts
├── assets/         # 参与构建的静态资源
├── components/     # 跨页面复用的组件（AppHeader 等）
├── composables/    # useXxx 组合式函数，纯逻辑
├── layouts/        # 布局壳：AppLayout.vue
├── pages/          # 页面组件，后缀固定 Page：HomePage.vue
├── router/         # index.ts（创建与守卫）+ routes.ts（路由表）
├── stores/         # Pinia store，按域分文件
├── styles/         # main.css（入口）+ tokens.css（设计变量）
├── types/          # 跨模块共享类型
└── utils/          # 无状态纯函数
```

分层规则（违反即视为错误）：

- `pages/` 只能在 `api/modules`、`stores`、`composables`、`components` 之间组合，不直接 import `ky`。
- `api/` 不 import 任何 Vue、store、组件。它只管拼路径和声明类型。
- `stores/` 不 import 组件，也不做路由跳转。
- `components/` 不 import `pages/`。
- `utils/` 必须是无副作用的纯函数，不 import 上面任何一层。

## 样式规范

只有两种合法写法，不要混用、不要引入其他方案（不写 `<style>` 无 module 的全局样式、不引入 WindiCSS/UnoCSS/styled-components 之类）。

**1. Tailwind 工具类** —— 用于布局、间距、排版等一次性的原子样式：

```vue
<template>
  <div class="flex flex-col gap-4 p-4">
    <h2 class="text-lg font-semibold text-(--ui-text-highlighted)">标题</h2>
  </div>
</template>
```

**2. SCSS Modules** —— 用于有语义的、需要复用或嵌套的样式：

```vue
<template>
  <div :class="$style.Component"></div>
</template>

<script setup lang="ts"></script>

<style module lang="scss">
.Component {
  color: inherit;
}
</style>
```

约定：

- **模板顺序固定**：`<template>` → `<script setup>` → `<style module>`。
- CSS class 命名用 **PascalCase，与文件名一致**（`.HomePage`、`.AppHeader`），子元素用 camelCase（`$style.toolbar`）。
- 允许 `<style module lang="scss">` 内嵌套，但要克制，超过 3 层就拆组件。
- 颜色、间距等设计值优先取 CSS 变量：Tailwind 的 `--color-*`，Nuxt UI 的 `--ui-*`（如 `var(--ui-text-muted)`、`var(--ui-border)`、`var(--ui-bg-elevated)`）。
- 需要新增品牌色时改 `src/styles/tokens.css` 的 `@theme` 块，不要在组件里硬编码色值。
- 不要在 `.vue` 里写 `<style>`（不带 `module`）—— 会污染全局。

## 常用任务

### 加一个页面

1. 新建 `src/pages/XxxPage.vue`，用上面的模板顺序。
2. 在 `src/router/routes.ts` 追加一条记录：
   ```ts
   {
     path: '/xxx',
     name: 'Xxx',
     component: () => import('@/pages/XxxPage.vue'),
     meta: { title: '标题', requiresAuth: true }
   }
   ```
   `path` 用 kebab-case，`name` 用 PascalCase 且全局唯一，`component` 必须是动态 import。
3. 兜底路由 `/:pathMatch(.*)*` 永远放数组最后。
4. 新增 meta 字段前先在 `src/types/router.d.ts` 里声明。

### 加一个接口

1. 在 `src/api/modules/` 下找到或新建域文件（单数小写，如 `order.ts`）。
2. 声明请求/响应的 interface，然后用 `api.get/post/put/patch/delete`：
   ```ts
   export const orderApi = {
     getById: (id: string) => api.get<Order>(`orders/${id}`)
   }
   ```
3. 路径只写相对部分，`baseUrl` 由 `client.ts` 统一拼接。
4. 错误不要在这里 catch，交给调用方；需要转成用户文案时用 `normalizeError`。

### 加一个 store

1. 新建 `src/stores/xxx.ts`，**必须用 setup 语法**：
   ```ts
   export const useXxxStore = defineStore('xxx', () => {
     const list = ref<T[]>([])
     const count = computed(() => list.value.length)
     return { list, count }
   })
   ```
2. store 只放跨组件共享的状态。只在单个页面用的状态用 `ref`，不要塞进 store。
3. 异步请求放在 store 的 action 里，错误用 `normalizeError` 归一化后抛给调用方。

### 加一个组件

- 跨页面复用 → `src/components/`。
- 只在某个页面用 → 放在页面同级的 `src/pages/XxxPage/` 目录下，不要污染 `components/`。
- 组件名 PascalCase，文件名与组件名一致。

## 图标

统一使用 Nuxt UI 的 `UIcon` 或组件的 `icon` 属性，图标名一律 `i-tabler-xxx`：

```vue
<UIcon name="i-tabler-home" class="size-5" />
<UButton icon="i-tabler-plus">新建</UButton>
```

不要 `import { IconHome } from '@tabler/icons-vue'`——`@tabler/icons-vue` 仅保留给确实需要直接拿组件（且无法用 Iconify）的场景，默认不用。
找图标去 https://icones.js.org（或 Iconify 的 tabler 集合）。

## 命令

```bash
vp dev              # 开发
vp run build        # 类型检查 + 构建
vp run typecheck    # 只做类型检查
vp check            # 格式化 + lint（不加 --fix 不会改文件）
vp check --fix      # 格式化 + lint + 自动修复
vp exec vue-tsc -b  # 直接跑类型检查
```

### ⚠️ 三个必须知道的坑

1. **`vp check` 不检查 `.vue` 文件内部。** 实测：`.vue` 里写 `const n: number = 'x'`、未使用变量、模板 props 类型错误，`vp check` 全部放过（exit 0），只有 `vue-tsc` 能发现。所以类型问题一律以 `vp run typecheck` / `vp run build` 为准。
2. **`vp build` 是内置命令，会遮蔽 `package.json` 里同名的 `build` 脚本。** 要跑 npm script 必须 `vp run build`。本项目 `build` 脚本 = `vue-tsc -b && vp build`，`vp build` 只构建不检查类型。
3. **Nuxt UI 会生成 `auto-imports.d.ts` / `components.d.ts`，只在 vite 跑过之后才存在**，已 gitignore。因此 clean checkout 上直接跑类型检查可能报找不到全局名字——`.vue` 里不要依赖隐式自动导入，`useToast` 这类要显式 import。`build` 脚本的顺序（先 `vue-tsc` 后 `vp build`）依赖这一点。

## 禁止事项

- **不凭记忆写依赖 API**。不确定某个 prop、配置项、插件参数时，先读对应的 llms.txt，猜错比不写代价更大。
- 不使用文件约定式路由（`vue-router/vite` 插件、`src/pages` 自动注册），路由一律手写。
- 不新增 UI 组件库、不新增 CSS 方案、不新增 HTTP 客户端。
- 业务代码不直接 `import ky`，一律走 `src/api`。
- 不写 `any`；实在无法避免时用 `unknown` 加类型守卫。
- 不在 `.vue` 的 `<style module>` 之外写全局样式。
- 不提交 `auto-imports.d.ts`、`components.d.ts`、`.env*`（除 `.env.example`）。
