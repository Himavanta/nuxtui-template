# nuxtui-template

Vue 3 项目模版：TypeScript + Vite+ + Nuxt UI + Pinia + Vue Router + ky。
面向 AI coding 场景做了约定与工程化配置，开箱即用。

## 用这个模版新建项目

不要 `git clone` 后手动删 `.git`，也不要用 `vp create` 从零搭。三种方式选一种：

```bash
# 1. degit（推荐）：只取快照，不带 git 历史，最干净
npx degit Himavanta/nuxtui-template my-app

# 2. GitHub「Use this template」按钮：需要先在仓库 Settings 勾选 Template repository

# 3. 需要保留 git 历史时用 clone
git clone git@github.com:Himavanta/nuxtui-template.git my-app && rm -rf my-app/.git
```

然后：

```bash
cd my-app
git init        # degit 只下快照，不带 .git
vp install      # 装依赖，同时按 package.json 的声明切换 Node / pnpm 版本
vp dev
```

环境要求：Node.js `>=22.12`、pnpm 12.21（`devEngines` 已声明，`vp install` 会自动下载）。

## 命令

| 命令               | 作用                             |
| ------------------ | -------------------------------- |
| `vp dev`           | 启动开发服务器                   |
| `vp run build`     | 类型检查 + 生产构建（CI 用这个） |
| `vp run build:app` | 只构建，不做类型检查             |
| `vp run typecheck` | 类型检查                         |
| `vp check`         | 格式化 + lint 检查（不改文件）   |
| `vp check --fix`   | 格式化 + lint + 自动修复         |
| `vp preview`       | 预览构建产物                     |

> ⚠️ `vp <name>` 优先匹配内置命令，`vp build` 只构建不检查类型。跑 npm script
> 必须加 `run`：`vp run build`。

## 目录

```
src/
├── api/            # ky 封装与领域接口，业务代码只从这里请求
├── components/     # 跨页面复用组件
├── composables/    # useXxx 组合式函数
├── layouts/        # 布局壳
├── pages/          # 页面，后缀 Page
├── router/         # 手写路由表（非文件约定式）
├── stores/         # Pinia store
├── styles/         # main.css 入口 + tokens.css 设计变量
├── types/          # 共享类型
└── utils/          # 纯函数
```

详细约定（分层规则、样式规范、加页面/接口/store 的步骤）见 [AGENTS.md](./AGENTS.md)。

## 给 AI 助手

项目根目录的 [AGENTS.md](./AGENTS.md) 是本模版的约定入口，其中「动手前先查 llms.txt」
一节列出了每个依赖面向 LLM 的文档地址（Vite+ / Vite / Vue / Vue Router / Pinia /
Nuxt UI / Oxc / Tabler）。用 Claude Code、Codex、Cursor 等工具时无需额外配置，
它们会读取 AGENTS.md；其他工具可把它当作 system prompt 的补充。

## 技术决策记录

- **路由手写**：不用 `vue-router/vite` 的文件约定式路由。页面少、需要 AI 生成时，
  显式路由表更可控，不会出现「建了页面忘记注册」。
- **图标走 Iconify**：统一 `i-tabler-xxx`，由 `@iconify-json/tabler` 本地提供图标数据，
  支持 Nuxt UI 各处 `icon` 属性。`@tabler/icons-vue` 仅作备用。
- **ky 封装在 `src/api`**：`client.ts` 提供泛型方法、统一超时/重试/token 注入，
  `error.ts` 把 ky 的各类错误归一成 `ApiError`。
- **样式双轨**：Tailwind 工具类做原子布局，SCSS Modules 做有语义的组件样式，两者不混写。

## 已知限制

`vp check`（Oxlint）当前不分析 `.vue` 文件内部，类型错误和未使用变量都检查不到。
因此：

- 类型问题以 `vp run typecheck` 为准；
- pre-commit 钩子在 `vp staged` 之后额外跑一次 `vue-tsc`；
- `.vue` 里不要依赖 Nuxt UI 的隐式自动导入，`useToast` 等要显式 import
  （`auto-imports.d.ts` 只在 vite 跑过之后才生成，clean checkout 上没有）。
