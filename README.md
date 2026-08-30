# 🎮 梦之韵模组发布系统

将 `mods` 文件夹内的 Minecraft `.jar` 模组自动打包为 ZIP 上传到 **GitHub Releases**，并提供：
- 🌐 **网页面板**：显示最新版本与 ZIP 下载直链；GitHub 登录后由管理员（`maoxinhe`）上传 / 重命名 / 删除模组
- ⚡ **自动发布**：上传、重命名或删除模组后自动打包并发布新版本到 GitHub Releases
- 🚀 **更新器**（`mod-updater.exe`）：玩家放入启动器的 `mods` 文件夹双击运行，自动拉取最新 ZIP 并解压

---

## 📁 项目结构

```
modpack-release/
├── server.js              # 服务端入口（Express）
├── src/
│   ├── config.js          # 环境配置
│   ├── routes.js          # 所有路由（OAuth / mods / releases）
│   ├── github.js          # GitHub API 封装
│   ├── pack.js            # 打包 ZIP
│   ├── publish.js         # 发布流水线（打包 → 建 Release → 传资产）
│   ├── mods.js            # mods 文件夹文件操作
│   └── db.js              # 版本状态存储
├── public/                # 网页面板（下载页 + 管理后台）
├── mods/                  # 服务端 mods 文件夹（存放 .jar，已 gitignore）
├── dist/                  # 打包产物（已 gitignore）
├── data/                  # 版本状态（已 gitignore）
└── updater/               # Go 更新器源码 + 编译脚本
    └── mod-updater.exe    # Windows 更新器
```

---

## 🚀 部署步骤

### 1. 安装依赖

需要 Node.js 18+ 与 Go 1.21+（仅编译更新器时需要）。

```bash
cd modpack-release
npm install
```

### 2. 注册 GitHub OAuth App（网页面板登录用）

1. 打开 [https://github.com/settings/developers](https://github.com/settings/developers) → **New OAuth App**
2. 填写：
   - **Application name**：梦之韵模组发布面板
   - **Homepage URL**：`http://localhost:3000`（部署后填你的公网地址）
   - **Authorization callback URL**：`http://localhost:3000/auth/callback`（必须与下方 BASE_URL 一致）
3. 创建后记录 **Client ID** 和 **Client Secret**。

### 3. 配置 `.env`

```bash
cp .env.example .env
```

必填项：
- `GITHUB_TOKEN`：需要 **repo** 权限的 Personal Access Token，用于创建 Release 与上传 ZIP
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`：上一步注册的 OAuth App
- `BASE_URL`：对外访问地址（OAuth 回调会用到）
- `ADMIN_LOGIN`：管理员 GitHub 用户名（默认 `maoxinhe`，只有该账号能管理）

> `DEV_AUTH_TOKEN` 是开发/脚本通道：请求头带 `X-Dev-Token: <值>` 即视为管理员，方便自动化脚本或未配置 OAuth 时测试。**生产环境建议留空。**

### 4. 启动

```bash
node server.js
```

打开 `http://localhost:3000` 即可访问下载页，`/admin.html` 为管理后台（需 GitHub 登录）。

---

## 🌐 网页面板功能

| 页面 | 功能 |
|------|------|
| 首页 `/` | 显示最新版本号、发布时间、ZIP 下载直链、模组列表、使用说明 |
| 管理后台 `/admin.html` | GitHub 登录；仅 `maoxinhe` 可上传 / 重命名 / 删除模组、手动发布、查看发布历史 |

> 上传、重命名、删除操作会**自动触发打包发布**，无需手动操作。

---

## 🔄 更新器（mod-updater.exe）

### 玩家使用

1. 把 `updater/mod-updater.exe` 放进启动器的 **mods 文件夹**
2. 双击运行
3. 程序自动查询 GitHub 最新版本 → 下载 ZIP → 解压到 mods 文件夹 → 完成

### 编译（Windows 版）

```bash
cd updater
./build.sh        # 产出 mod-updater.exe（Windows amd64）与 mod-updater（Linux 测试版）
```

或手动：

```bash
cd updater
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -ldflags "-s -w" -o mod-updater.exe .
```

### 可选配置

在 exe 同目录放 `updater.json` 可覆盖默认仓库或指向自定义服务端：

```json
{ "owner": "maoxinhe", "repo": "modpack", "api_base": "" }
```

命令行参数：`-check`（仅检查版本）、`-force`（强制重下）、`-url <地址>`（自定义服务端 API）。

---

## 🔧 手动发布（可选）

管理后台有“手动发布”按钮，可填写更新说明后手动触发发布。

---

## ⚠️ 安全提示

- `.env` 中的 Token 请妥善保管，切勿提交到 git
- 生产环境请将 `DEV_AUTH_TOKEN` 留空、`SESSION_SECRET` 改为强随机值
- 部署到公网时建议配置 HTTPS（GitHub OAuth 与生产环境均要求 HTTPS）
