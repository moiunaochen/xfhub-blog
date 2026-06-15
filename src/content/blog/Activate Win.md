---
title: 'Win 和 Office 激活'
description: '基于 PowerShell 的 Windows 与 Office 极简激活方案。'
publishDate: '2025-10-20 14:52:01'
tags:
  - 系统优化
language: '中文'
---

# 激活 Windows 和 Office

基于开源脚本的高效激活方案。该方法利用 PowerShell 直接拉取并执行云端脚本，支持 Windows 与 Office 的一键激活，无需下载任何带有潜在风险的第三方可执行程序（如 KMS 激活器）。

## 核心命令

若你熟悉 PowerShell 操作，可直接使用以下命令：

```powershell
irm [https://get.activated.win](https://get.activated.win) | iex
```

## 操作指南

### 1. 唤起高级权限终端

脚本需要系统底层权限才能写入激活信息。

- 鼠标右键点击屏幕底部的 **开始** 按键（Windows 图标）。
- 在弹出的高级系统菜单中，单击 **Powershell（管理员）** 或 **终端（管理员）**。
- 若系统弹出“用户账户控制”提示框，请点击 **是** 允许运行。

### 2. 输入激活命令

将以下命令复制到 PowerShell 窗口中，然后按下回车键（Enter）执行：

```powershell
irm [https://get.activated.win](https://get.activated.win) | iex
```
*(注意：在终端中通常通过单击鼠标右键即可粘贴)*

### 3. 选择激活选项

等待脚本加载完毕后，根据终端屏幕上的可视化菜单提示进行选择：

- 输入 `1`：激活 Windows 系统（数字权利 HWID 永久激活）
- 输入 `2`：激活 Office 办公套件（Ohook 方案激活）

> **排错提示**：若输入命令后出现红色报错，通常是因为网络无法直连至 GitHub 原始服务器，建议开启系统代理后重新执行命令。