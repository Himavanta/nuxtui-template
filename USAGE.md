# 用这个模版新建项目

```bash
npx degit Himavanta/nuxtui-template my-app
cd my-app
git init
vp install
vp dev
```

`degit` 只下载最新快照，不带 git 历史，也不需要事后手动删 `.git`。

需要在 GitHub 网页上用「Use this template」按钮的话，先在仓库
`Settings → General → Template repository` 勾选，之后按钮会出现在仓库首页。

---

> 这个文件由 `degit.json` 在生成项目时自动删除，不会出现在你的新项目里。
