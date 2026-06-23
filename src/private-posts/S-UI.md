---
title: '基于 GCP 免费实例的 S-UI 节点搭建指南 (Hysteria2 + VLESS + TUIC)'
description: '在谷歌云 e2-micro 实例上从零部署 S-UI 面板，配置真实 TLS 证书，搭建最适合高丢包线路的抗封锁节点组合。'
publishDate: 2026-01-21 08:00:00
tags:
  - 后端
language: '中文'
---

## 引言

对于谷歌云（GCP）永久免费的 `e2-micro` 实例（尤其是处于“重灾区”的俄勒冈机房），高延迟与动辄 50% 的丢包率是常态。在这种极端网络环境下，死磕传统的 TCP 协议往往体验极差。

为了榨干这台 1GB 内存小机器的极限性能，我们需要抛弃臃肿的 Docker 架构，选择原生基于 Sing-box 核心的 **S-UI 面板**，并采用基于 UDP 的暴力发包协议（Hysteria 2 / TUIC）作为主力。本文将带你完成一套“三位一体”的最强节点配置。

---

## 核心前提准备

1. **一台纯净的 GCP 服务器**：建议使用 **Debian 12 (Bookworm)** 系统。
2. **一个域名**：已在 Cloudflare 解析到你的服务器 IP（必须开启“仅 DNS”的灰色云朵模式，绝不能开启代理）。
3. **获取 Root 权限**：通过 SSH 连接服务器后，输入 `sudo -i` 切换为 root 用户。

---

## 第一阶段：环境更新与 S-UI 安装

### 1. 更新系统环境
新开的 Debian 系统必须先进行组件更新，确保后续安装不报错：

```bash
apt update && apt upgrade -y
```

### 2. 运行 S-UI 一键安装脚本
执行官方安装命令：

```bash
bash <(curl -Ls [https://raw.githubusercontent.com/alireza0/s-ui/master/install.sh](https://raw.githubusercontent.com/alireza0/s-ui/master/install.sh))
```

**安装交互指南：**
- **Panel Port (面板端口)**：输入 `2053`（建议避开 80/443 以防冲突）。
- **Panel Path / Sub Port / Sub Path**：直接回车，保持默认或留空。
- **Change admin credentials?**：输入 `y`。然后设置你自己记得住的登录用户名和密码。

---

## 第二阶段：GCP 防火墙放行与 BBR 加速

### 1. 谷歌云控制台放行端口
面板安装完毕后，网页端是打不开的，必须去 GCP 后台放行端口。

1. 进入 GCP 控制台 -> **VPC 网络** -> **防火墙**。
2. 点击 **创建防火墙规则**。
3. **流量方向**：入站。
4. **目标**：网络中的所有实例。
5. **来源 IPv4 范围**：`0.0.0.0/0`
6. **协议和端口**：勾选 TCP 和 UDP，输入 `80,443,2053,8443`。
   *(解释：80 用于申请证书，2053 是面板，443/8443 是节点端口)*。

### 2. 开启 BBR 拥塞控制
在 SSH 终端中输入 `s-ui` 回车，呼出管理菜单。
输入数字 `18` (Enable or Disable BBR) 并回车，开启 BBR 以优化网络吞吐量。

---

## 第三阶段：申请真实 TLS 证书

为了隐蔽性和防封锁，我们必须抛弃“自签证书”，使用真正的 Let's Encrypt 证书。

在 S-UI 管理菜单（终端输入 `s-ui` 调出）中：
1. 输入 `19` (SSL Certificate Management)。
2. 选择 `1` (Get SSL - Standalone Mode)。
3. 输入你的域名（例如 `s.xxff.dpdns.org`），端口保持默认 `80`。

申请成功后，屏幕会打印出两条极其重要的路径，请务必记录：
- **公钥 (Cert Path)**：`/root/cert/你的域名/fullchain.pem`
- **私钥 (Key Path)**：`/root/cert/你的域名/privkey.pem`

---

## 第四阶段：面板安全与智能分流配置

使用浏览器访问 `http://你的IP:2053/app/` 登录 S-UI 面板。

### 1. 面板设置 (Panel Settings)
进入面板设置，进行以下基础加固：
- **域名 (Domain)**：填入你的域名。
- **时区 (Timezone)**：改为 `Asia/Shanghai`。
- **SSL 密钥/证书路径**：填入上一阶段获取的 `privkey.pem` 和 `fullchain.pem` 路径。
- 保存并**重启面板**。重启后，必须使用 `https://你的域名:2053/app/` 重新登录。

### 2. JSON 订阅设置 (国内外智能分流)
进入 **JSON (订阅设置)**，配置客户端路由，实现国内直连、去广告：
- **路由到直连 (Route to Direct)**：勾选 `CN Site-China`、`CN IP-China`、`Site-Private`、`IP-Private`。（取消勾选所有 Iran 相关的规则）。
- **路由到阻止 (Route to Block)**：勾选 `Site-Ads`。
- 下方高级选项：仅开启 **DNS**（全局设为 `8.8.8.8`，直连设为 `local`），关闭日志、入站等其他干扰项。保存并重启面板。

---

## 第五阶段：搭建“三位一体”最强节点

我们将在同一个面板下，部署互不干扰的三大协议。进入 **入站列表 (Inbounds)**，点击 **添加入站**。

### 🛡️ 主力舰：Hysteria 2 (极速暴力突围)
对抗 50% 丢包线路的绝对王者。
- **协议**：`hysteria2`
- **监听端口**：`443`
- **忽略客户端带宽**：开启 (ON)
- **Hysteria2 选项**：开启 **混淆密码 (Obfuscation Password)**，填入你的密码。
- **TLS**：开启。填入域名、证书路径 (`fullchain.pem`) 和密钥路径 (`privkey.pem`)。

### 🗡️ 护卫舰：VLESS + Vision (极致轻量防封)
资源占用极低的 TCP 备用方案。
- **协议**：`vless`
- **监听端口**：`443` *(Linux 下 TCP 443 和 UDP 443 互不冲突)*
- **网络**：`tcp`
- **流控 (Flow)**：手动输入或选择 `xtls-rprx-vision`。
- **用户管理**：选择 **全部 (All)** 以复用密码。
- **TLS**：开启。调用已设置的证书路径。

### 🛸 游骑兵：TUIC v5 (QUIC 协议尝鲜)
基于标准 HTTP/3 协议的 0-RTT 秒开方案。
- **协议**：`tuic`
- **监听端口**：`8443` *(⚠️ 必须避开 443，防止与 Hy2 冲突)*
- **拥塞控制**：`bbr`
- **Zero-RTT 握手**：开启 (ON)
- **用户管理**：选择 **全部 (All)**。
- **TLS**：开启并填好证书路径。
- **(极度关键) 客户端配置**：切换到“客户端 (Client)”标签页，在 TLS 选项弹窗中，必须且只能勾选 **ALPN: `h3`**，否则握手必败。

---

## 结语

全部保存后，点击节点列表右侧的二维码或链接图标，将其导入至 Nekobox、v2rayN 或 Clash Verge 等客户端中。

在 GCP 这种弱 CPU 且高丢包的环境下，这套 S-UI 配置不仅榨干了每一滴硬件性能，更在保证极致隐蔽性的同时，彻底解决了连接超时的痛点。尽情享受你的网络吧！