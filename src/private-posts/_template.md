---
title: '在这里填写文章标题'
description: '在这里填写一到两句简短的文章描述。'
publishDate: 2026-06-15 15:30:00
tags:
  - 标签1
  - 标签2
language: '中文'
# comment: true # 取消注释此行以开启底部 Waline 评论区（私密文章默认不开启评论）
---

## 引言

在这里写下文章的开头部分...

---

## 常用语法速查备忘录

### 1. 文本样式与排版
- **加粗**：`**粗体文本**` 或直接使用 HTML `<b>粗体文本</b>`
- *斜体*：`_斜体文本_`
- ~~删除线~~：`~~删除文本~~`
- 换行：段落之间必须**空一行**才能正常分段。
- 键位：使用 `<kbd>Ctrl</kbd> + <kbd>C</kbd>` 来显示按键样式。
- 符号转义：如果不想符号被 Markdown 引擎解析，前面加反斜杠，如 `\#` 或 `\*`。

### 2. 代码块 (Shiki)
需要高亮时，记得在三个反引号后紧跟语言标识（如 js, ts, bash, yaml 等）：

```js
// calculate fibonacci
function fibonacci(n) {
  if (n <= 1) return 1
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

### 3. 数学公式 (KaTeX)
行内公式使用单美元符号包围，例如：$e^{i\pi} + 1 = 0$

公式块使用双美元符号单独成行：
$$
\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{-2\pi i x \xi} \, dx
$$

### 4. 进阶 HTML 组件
**自定义尺寸图片与嵌套跳转**：
<a href="https://comment.xfhub.com"><img src="你的图片URL" alt="替代文本" width="200" /></a>

**隐藏折叠块**：
<details><summary>点击展开查看详情</summary>这里是默认隐藏的详细内容</details>

### 5. 列表与注脚
- [x] 已完成的任务
- [ ] 待办的任务

> 这是一段引用文本。引用里还可以继续嵌套其他 Markdown 语法。

需要补充说明时，使用注脚语法[^1]。

[^1]: 这里是注脚的详细内容，文章渲染时会自动将其归档到页面最底部。
