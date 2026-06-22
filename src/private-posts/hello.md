---
title: '我的第一篇私密文章'
description: '这是一篇测试私密文章，只有输入密码才能看到。'
publishDate: 2026-06-15 15:30:00
tags:
  - 测试
language: '中文'
---

## 欢迎来到私密空间 🎉

恭喜你成功进入了私密文章区域！这里的内容不会出现在博客首页、文章列表、RSS 订阅、归档页面和搜索结果中。

### 如何使用

1. 在 `src/private-posts/` 目录下新建 `.md` 文件
2. 添加标准的 YAML frontmatter（title、date、description）
3. 像写普通博客一样撰写 Markdown 内容
4. 文件名即为访问路径，例如 `hello.md` → `/private/hello`

### 安全说明

- 密码存储在环境变量中，不写入代码仓库
- 认证状态通过加密签名的 HttpOnly Cookie 管理
- 服务端验证，未授权用户在网页源码中看不到任何内容

> 这篇示例文章可以随时删除或修改。
