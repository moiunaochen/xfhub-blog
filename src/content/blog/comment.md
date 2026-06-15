---
title: Blog 评论系统
description: '基于 Waline 的评论系统全栈部署指南，采用 Vercel + Supabase 架构。'
publishDate: 2026-05-26 08:00:00
tags:
  - 后端
language: '中文'
---

## 核心架构与前期准备

基于 Vercel（无服务器后端） + Supabase（PostgreSQL 云数据库） + 独立子域名 + GitHub OAuth（免密提权管理）的现代化架构。该方案彻底摆脱 LeanCloud 的束缚，具备零冷启动延迟与数据完全自主掌控的核心优势。

### 基础设施需求

- **GitHub 账号**：用于后台管理员免密登录及代码托管授权。
- **Vercel 账号**：用于部署和托管 Waline 后端服务。
- **Supabase 账号**：提供完全免费的云端 PostgreSQL 数据库（建议选择 `Singapore` 节点以降低国内直连延迟）。
- **个人域名**：用于绑定 Vercel，绕过 `*.vercel.app` 的网络限制（本文以 `comment.xfhub.com` 为例）。

---

## 第一阶段：Supabase 数据库建表

Waline 依赖底层数据库存储评论、配置和用户信息。

### 创建数据库实例与获取密钥

1. 登录 Supabase，点击 **New Project**。
2. 填写项目名称，设置高强度数据库密码（**务必妥善记录**）。
3. Region 选择 **Singapore**，点击创建并等待初始化完成。
4. 进入项目，点击左下角 ⚙️ **Project Settings** -> **Database**。
5. 定位至 **Connection string** 区域，切换到 **URI** 标签，复制 `postgresql://` 开头的连接字符串。

> ⚠️ **注意：** 必须手动将复制链接中的 `[YOUR-PASSWORD]` 替换为你刚才设置的真实数据库密码。

### 绕过 RLS 强制建表

1. 点击 Supabase 左侧菜单的 **SQL Editor**，新建查询。
2. 获取 [Waline 官方 PostgreSQL 建表脚本](https://raw.githubusercontent.com/walinejs/waline/main/assets/waline.pgsql)。
3. 将完整脚本粘贴至编辑器，点击 **Run**。
4. 遇到“未启用行级安全 (RLS)”的弹窗警告时，**必须点击 `Run without RLS`**。
5. 控制台提示 `Success. No rows returned` 即代表核心表落建成功。

---

## 第二阶段：Vercel 后端部署

### 部署后端服务

前往 Waline 官方文档，点击 **Vercel 一键部署** 按钮，将服务端代码 Fork 至个人 GitHub 仓库并导入 Vercel 进行部署。

### 配置环境变量

在 Vercel 部署页面的 **Environment Variables** 区域，必须注入数据库连接凭证：

```yaml
NAME: DATABASE_URL
VALUE: postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres
```

点击 **Deploy**，等待构建流程完毕（状态显示 `Ready`）。

---

## 第三阶段：独立域名绑定解析

默认的 Vercel 域名在国内连通率极低，必须通过 CNAME 绑定自定义子域名。

### Vercel 获取解析地址

1. 在 Vercel 项目面板，点击 **Settings** -> **Domains**。
2. 输入规划的子域名（如 `comment.xfhub.com`），点击 **Add**。
3. 观察面板上的 `DNS Change Recommended` 提示，复制 Vercel 分配的**专属哈希 CNAME 地址**（如 `28673b634ca89203.vercel-dns-017.com`）。

### 添加 DNS 解析

前往你的域名提供商控制台，添加如下解析记录：

| 记录类型 | 主机记录 | 记录值 |
| ----- | ----- | ----- |
| CNAME | comment | 粘贴 Vercel 专属哈希地址 |

保存后等待 Vercel 面板状态变更为 `Valid Configuration` 且下发 SSL 证书。

---

## 第四阶段：GitHub 提权管理

为摆脱传统账号密码体系，直接利用 GitHub OAuth 登录并从数据库底层强制分配超级管理员权限。

### 初始化账号身份

1. 在浏览器中访问已绑定的独立域名：`https://comment.xfhub.com`。
2. 点击空白评论输入框下方的 **GitHub 图标** 授权登录。此时账号在数据库中的初始身份为 `guest`（访客）。

### Supabase 数据库底层提权

1. 回到 Supabase 控制台，点击左侧 **Table Editor**，打开 **wl_users** 表。
2. 找到刚才通过 GitHub 登录生成的账号数据行。
3. **修改 type**：双击 `type` 列，将 `guest` 更改为 `administrator`，按回车保存。
4. **修改 url**：双击 `url` 列，将其更改为博客主页地址，按回车保存。
5. 删除表内多余的冗余测试数据行。

---

## 第五阶段：常见排错指南

### 1. 删除评论抓包提示 401 Unauthorized

> **病因：** 数据库底层权限已变动，但浏览器前端仍缓存在旧的 JWT 身份令牌。
> **解药：** 按 <kbd>F12</kbd> 打开开发者工具，进入 **Application** -> **Storage**，点击 **Clear site data** 清除缓存。刷新页面重新使用 GitHub 登录即可。

### 2. 用户信息更新后旧评论头像/昵称未变

> **病因：** Waline 采用快照机制（Snapshot），历史评论强绑定发送瞬间的用户信息状态。
> **解药：** 此为正常业务逻辑。使用提权后的管理员账号直接将带有旧信息的测试评论删除即可。

---

## 终极接入：前端配置

后端引擎部署完毕后，进入 Astro Pure 博客的主题配置文件，定位至 Waline 配置块，将 `serverURL` 替换为你的真实独立域名：

```yaml
waline:
  enable: true
  serverURL: https://comment.xfhub.com
  lang: zh-CN
```