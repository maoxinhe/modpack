# modpack-release Worker

梦之韵模组包的发布 / 下载 / 工单 / 崩溃分析后端（Cloudflare Worker）。
线上：https://releases.camzy.uno

## 目录结构

```
worker/
├── src/index.js          Worker 主入口（唯一模块，无外部依赖）
├── wrangler.toml         配置（由线上部署反推生成）
├── public/               静态资源目录（线上 assets，暂未纳入仓库，见下方警告）
└── scripts/
    ├── migrate-d1.mjs    D1 结构变更（新增列 + 统计表）
    ├── recover-queued.mjs 一次性恢复卡死/被丢弃的报告
    ├── deploy-api.mjs    只更新脚本、不动 assets/secrets 的部署方式
    └── test-local.mjs    本地纯函数自测（指纹/版本/限流判定）
```

## ⚠️ 关于 public/（静态资源）

线上这个 Worker 带 assets（`index.html`、`error-report.html`、`ticket.html` 等），
但这些静态页目前**只存在于线上，没有纳入仓库**。

因此：

- **不要直接跑 `wrangler deploy`** —— 它会用本地 `public/` 覆盖线上 assets，
  而本地目录是空的，等于把线上页面清掉。
- 要部署代码，用 `node scripts/deploy-api.mjs`（只 PUT 脚本，bindings 原样回填）。
- 想让 `wrangler deploy` 可用，需要先把线上静态页导出到 `public/` 并提交。

## 常用命令

```bash
# 本地自测（不需要 Worker 运行时）
node scripts/test-local.mjs

# 结构变更（可重复执行，已存在的列会自动跳过）
CF_API_TOKEN=xxx node scripts/migrate-d1.mjs
CF_API_TOKEN=xxx node scripts/migrate-d1.mjs --dry   # 只看会执行什么

# 恢复卡住的报告（先看 --dry，确认无误再执行）
CF_API_TOKEN=xxx node scripts/recover-queued.mjs --dry
CF_API_TOKEN=xxx node scripts/recover-queued.mjs

# 部署（只更新脚本）
CF_API_TOKEN=xxx node scripts/deploy-api.mjs --dry
CF_API_TOKEN=xxx node scripts/deploy-api.mjs
```

## 环境变量

| 变量 | 说明 |
|---|---|
| `CF_API_TOKEN` | Cloudflare API Token（需 Workers + D1 写权限） |
| `CF_ACCOUNT_ID` | 默认 `93fe0753b1dce058535acb744bb78794` |
| `CF_D1_ID` | 默认 `b838b9e7-5ca1-416d-a420-307be040acb7`（modpack-release-db） |
| `CF_WORKER_NAME` | 默认 `modpack-release` |

## 崩溃分析流程

```
上传 zip → 解压取日志 → 算指纹 → 命中历史？
                                   ├─ 是 → 复制历史结果 → done（不调 AI、不排队）
                                   └─ 否 → 入队 queued → cron 每 5 分钟认领
                                            → GLM 分析 → done（顺带落指纹/环境/统计维度）
```

限流（智谱"访问量过大"）不消耗重试次数，退避 1/2/4 分钟后自动重试，最多 3 次。
