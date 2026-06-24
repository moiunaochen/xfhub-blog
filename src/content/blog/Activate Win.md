---
title: 'Windows 与 Office 极简授权配置指南'
description: '基于 PowerShell 的 Windows 系统与 Office 办公套件授权状态管理及部署方案。'
publishDate: 2025-10-20 14:52:01
tags:
  - 系统优化
language: '中文'
---

## 系统与办公软件授权管理

这是一种基于开源脚本的高效环境配置方案。该方法利用 PowerShell 直接拉取并执行云端脚本，支持对 Windows 与 Office 进行一键授权凭证部署，彻底免去了下载任何带有潜在安全风险的第三方可执行程序（如各类 KMS 破解工具）的必要。

### 核心命令

若您熟悉 PowerShell 操作，可直接使用以下命令部署：

```powershell
irm [https://get.activated.win](https://get.activated.win) | iex
```

---

## 详细操作指南

### 1. 唤起高级权限终端

配置脚本需要系统的底层权限，才能正确写入相关的授权凭证信息。

- 鼠标右键点击屏幕底部的 **开始** 按键（Windows 图标）。
- 在弹出的高级系统菜单中，单击 **Windows PowerShell (管理员)** 或 **终端 (管理员)**。
- 若系统弹出“用户账户控制”提示框，请点击 **是** 允许运行。

### 2. 执行部署命令

将以下命令复制到 PowerShell 窗口中，然后按下 <kbd>Enter</kbd> 键执行：

```powershell
irm [https://get.activated.win](https://get.activated.win) | iex
```

> **操作提示**：在终端窗口中，通常只需单击鼠标右键即可完成代码的粘贴。（注：切勿在代码块内带有 Markdown 的链接格式，纯文本复制即可）

### 3. 选择配置选项

等待脚本从云端加载完毕后，请根据终端屏幕上的可视化菜单提示进行对应选择：

- 输入 `1`：配置 Windows 系统授权（部署 HWID 数字权利凭证）
- 输入 `2`：配置 Office 办公套件（部署 Ohook 本地验证方案）

> **排错提示**：若输入命令后出现红字的 Error 报错，通常是因为当前网络环境无法直连至 GitHub 的原始分发服务器。建议开启系统全局代理规则后，重新执行上述命令。