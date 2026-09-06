#!/usr/bin/env node
/**
 * 一次性恢复脚本：把卡住的报告重新并入队列。
 *
 * 背景：
 *   1) 早期 KV -> D1 迁移时 processingAt 丢失，留下 status='processing' 但 processingAt IS NULL
 *      的记录，而 lease 回收 SQL 要求 processingAt IS NOT NULL，导致这些报告永久卡死。
 *   2) GLM 限流期间被判为"重试耗尽，已放弃"的报告，限流修好后不会自动回到队列。
 *
 * 本脚本做三件事：
 *   A. processing 且 processingAt 为空 -> 补 processingAt 并置回 queued
 *   B. processing 且超时（超过 lease） -> 置回 queued
 *   C. error 且未耗尽重试次数 -> 置回 queued（并把 delay_count 清零，让它立刻可跑）
 *
 * 用法：
 *   CF_API_TOKEN=<token> node scripts/recover-queued.mjs [--dry]
 */
const TOKEN = process.env.CF_API_TOKEN || process.env.CF_TOKEN;
const ACCOUNT = process.env.CF_ACCOUNT_ID || "93fe0753b1dce058535acb744bb78794";
const DATABASE = process.env.CF_D1_ID || "b838b9e7-5ca1-416d-a420-307be040acb7";
const LEASE_MS = Number(process.env.LEASE_MS || 900000);
const MAX_RETRY = Number(process.env.MAX_RETRY || 2);
const DRY = process.argv.includes("--dry");

async function q(sql, params) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/d1/database/${DATABASE}/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(params ? { sql, params } : { sql })
    }
  );
  const out = await res.json();
  if (!out.success) throw new Error((out.errors || []).map((e) => e.message).join("; ") || "D1 查询失败");
  const r = (out.result || [])[0] || {};
  return { results: r.results || [], meta: r.meta || {} };
}

(async () => {
  if (!TOKEN) {
    console.error("缺少 CF_API_TOKEN 环境变量");
    process.exit(1);
  }
  const nowIso = new Date().toISOString();

  // 先看看现状
  const before = await q(
    "SELECT status, COUNT(*) AS c FROM error_reports GROUP BY status"
  );
  console.log("恢复前状态分布:", before.results.map((r) => `${r.status}=${r.c}`).join("  ") || "(空)");

  const stuck = await q(
    "SELECT id, status, attempts, createdAt, updatedAt, processingAt FROM error_reports WHERE status='processing' OR status='queued' OR (status='error' AND attempts < ?) ORDER BY createdAt ASC",
    [MAX_RETRY]
  );
  console.log(`待处理记录 ${stuck.results.length} 条：`);
  for (const r of stuck.results) {
    console.log(` - ${r.id}  status=${r.status} attempts=${r.attempts} processingAt=${r.processingAt || "(null)"} createdAt=${r.createdAt}`);
  }

  if (DRY) {
    console.log("\n[dry] 未执行任何写入。去掉 --dry 再跑一次即可生效。");
    return;
  }

  // A + B：卡住的 processing 回到队列
  const a = await q(
    `UPDATE error_reports SET status='queued', processingAt=?, updatedAt=?, delay_count=0, next_retry_at=NULL
     WHERE status='processing'
       AND (processingAt IS NULL
            OR (julianday(?) - julianday(processingAt)) * 86400000 >= ?)`,
    [nowIso, nowIso, LEASE_MS]
  );
  console.log(`\nA/B. processing 回收 -> 影响 ${a.meta.rows_written ?? "?"} 行`);

  // C：未耗尽重试的 error 回到队列
  const c = await q(
    `UPDATE error_reports SET status='queued', updatedAt=?, delay_count=0, next_retry_at=NULL
     WHERE status='error' AND attempts < ? AND (error IS NULL OR error <> ?)`,
    [nowIso, MAX_RETRY, "重试耗尽，已放弃"]
  );
  console.log(`C. error 复位 -> 影响 ${c.meta.rows_written ?? "?"} 行`);

  const after = await q("SELECT status, COUNT(*) AS c FROM error_reports GROUP BY status");
  console.log("恢复后状态分布:", after.results.map((r) => `${r.status}=${r.c}`).join("  ") || "(空)");
  console.log("\n完成。下一次 cron（<=5 分钟）会自动捡起这些报告。");
})();
