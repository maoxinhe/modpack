# 备份：modpack-release Worker 原版代码（部署 8da4bf7e / 版本 a6e37aae）

## 用途
本地存档线上 `releases.camzy.uno` 的 Worker 原版源码，防止 Cloudflare 部署历史丢失或再次被误清后无代码可恢复。

## 来源与可信度
- 对应部署：`8da4bf7e-a8e6-448e-93da-470bdf366460`（创建于 `2026-09-05T12:45:56Z`，北京时间 09-05 20:45）
- 对应版本：`a6e37aae-1485-41cf-9341-bb79adfddd96`
- 说明：Cloudflare API token **没有脚本源码下载权限**（`GET /scripts/{name}` 返回 204，`/content` 返回 405），故本目录中的源码文件为**本会话早些时候从线上实际拉取的 authentic 原版**（早于任何改造，不含 `extractReportFacts` 等后续新增函数），与 `a6e37aae` 部署等价。
- 校验：文件尾部为 `export { index_default as default }`；`scheduled` 处理器依次调用 `migrateTicketsFromKV` / `erKvCleanup` / `drainErrorReportQueue` / `drainMrpackJobs`，与版本元数据的 `handlers: ['fetch','scheduled']` 吻合。

## 文件清单
| 文件 | 内容 |
|---|---|
| `modpack-release.src.8da4bf7e.js` | Worker 入口源码（ES module，203634 字节 / 4700 行，含 `//# sourceMappingURL`） |
| `modpack-release.config.8da4bf7e.toml` | wrangler 配置（绑定 D1/KV/R2/ASSETS、cron、非敏感 vars） |
| `modpack-release.metadata.a6e37aae.json` | 版本完整元数据（41 个绑定、处理器、资源清单） |

## 恢复方式
1. 将 `modpack-release.src.8da4bf7e.js` 作为 `main` 入口。
2. 按 `modpack-release.config.8da4bf7e.toml` 配置绑定与 vars。
3. secret_text 类（`DEV_AUTH_TOKEN` / `GITHUB_TOKEN` / `GLM_API_KEY` / `GITHUB_CLIENT_SECRET` / `QQ_APPKEY` / `RESEND_API_KEY`）需通过 `wrangler secret put` 重新注入（值不在本备份中）。
4. `wrangler deploy`。

## 安全提示
- `modpack-release.config.8da4bf7e.toml` 含 `ADMIN_INIT_PASSWORD` 等明文，**不要提交到公开仓库**；如需入库，请先移除敏感值或用环境变量注入。
- 线上目前仍有明文密钥（含上述 secret），建议轮换。
