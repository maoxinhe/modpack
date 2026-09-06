#!/usr/bin/env node
/**
 * 用 Cloudflare API 只更新 Worker 脚本，不碰静态资源（assets）和 secrets。
 *
 * 为什么不用 wrangler deploy：
 *   线上这个 Worker 带 assets（index.html / error-report.html 等静态页），
 *   而 wrangler deploy 会用本地 worker/public 目录整体覆盖线上 assets。
 *   本地 public 目前是空的，直接 deploy 会把线上页面清空。
 *   本脚本只 PUT script + metadata，bindings 原样回填（secret 值不受影响），
 *   assets 内容保持不变。
 *
 * 用法：
 *   CF_API_TOKEN=<token> node scripts/deploy-api.mjs [--dry]
 *
 * 部署后请自测：
 *   1) curl https://releases.camzy.uno/                                  -> 200（assets 还在）
 *   2) curl -H "Accept: application/json" .../api/error-reports/upload-page -> 200 JSON
 *   3) 上传一份崩溃包，确认 status 从 queued 变 done（secret 未丢）
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const TOKEN = process.env.CF_API_TOKEN || process.env.CF_TOKEN;
const ACCOUNT = process.env.CF_ACCOUNT_ID || "93fe0753b1dce058535acb744bb78794";
const SERVICE = process.env.CF_WORKER_NAME || "modpack-release";
const ENV = "production";
const DRY = process.argv.includes("--dry");
const here = dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = join(here, "..", "src", "index.js");
const CRONS = ["*/5 * * * *"];

const api = (path, init) =>
  fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(init && init.headers ? init.headers : {})
    }
  }).then((r) => r.json());

(async () => {
  if (!TOKEN) {
    console.error("缺少 CF_API_TOKEN 环境变量");
    process.exit(1);
  }

  // 1) 拉现有 settings，把 bindings 原样回填（含 ASSETS / D1 / KV / R2 / secret_text）
  const cur = await api(`/workers/scripts/${SERVICE}/settings`);
  if (!cur.success) {
    console.error("读取现有配置失败:", JSON.stringify(cur.errors));
    process.exit(1);
  }
  const bindings = (cur.result.bindings || []).map((b) => {
    // secret_text 只声明名字，值仍存在 Cloudflare 的 secret 存储里，不会被清掉
    if (b.type === "secret_text") return { name: b.name, type: "secret_text" };
    if (b.type === "assets") return { name: b.name, type: "assets" };
    return b;
  });
  console.log(`回填 ${bindings.length} 个绑定：`, bindings.map((b) => b.name).join(", "));

  const metadata = {
    main_module: "index.js",
    bindings,
    compatibility_date: cur.result.compatibility_date || "2025-08-01",
    compatibility_flags: cur.result.compatibility_flags || [],
    usage_model: cur.result.usage_model || "standard"
  };

  const code = readFileSync(SCRIPT_PATH, "utf-8");
  console.log(`脚本 ${SCRIPT_PATH}：${code.length} 字节`);

  if (DRY) {
    console.log("\n[dry] 未上传。metadata 预览：\n" + JSON.stringify(metadata, null, 1).slice(0, 800));
    return;
  }

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }), "metadata");
  form.append("index.js", new Blob([code], { type: "application/javascript" }), "index.js");

  const up = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/services/${SERVICE}/environments/${ENV}`,
    { method: "PUT", headers: { Authorization: `Bearer ${TOKEN}` }, body: form }
  ).then((r) => r.json());

  if (!up.success) {
    console.error("上传失败:", JSON.stringify(up.errors));
    process.exit(1);
  }
  console.log("✓ 脚本已部署");

  // 2) 更新 cron（wrangler.toml 里的 crons 只在 wrangler deploy 时生效，
  //    用 API 部署就得单独同步一次）
  const cron = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/scripts/${SERVICE}/schedules`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ schedules: CRONS.map((cron2) => ({ cron: cron2 })) })
  }).then((r) => r.json());
  console.log(cron.success ? `✓ cron 已设为 ${CRONS.join(",")}` : "✗ cron 更新失败: " + JSON.stringify(cron.errors));

  console.log("\n请立刻自测：");
  console.log("  curl -s -o /dev/null -w '%{http_code}\\n' https://releases.camzy.uno/");
  console.log("  curl -s -H 'Accept: application/json' https://releases.camzy.uno/api/error-reports/upload-page");
})();
