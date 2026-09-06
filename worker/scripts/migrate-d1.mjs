#!/usr/bin/env node
/**
 * 一次性 D1 结构变更：为三项新功能加列 + 建统计表。
 *
 * 用法：
 *   CF_API_TOKEN=<Cloudflare API Token> node scripts/migrate-d1.mjs [--dry]
 *
 * 说明：
 *   - ALTER TABLE ADD COLUMN 在 D1 上只加可空列，不锁表、不改已有数据，可安全重复执行；
 *     重复执行遇到 "duplicate column name" 会忽略。
 *   - --dry 只打印将要执行的 SQL，不真正执行。
 */
const TOKEN = process.env.CF_API_TOKEN || process.env.CF_TOKEN;
const ACCOUNT = process.env.CF_ACCOUNT_ID || "93fe0753b1dce058535acb744bb78794";
const DATABASE = process.env.CF_D1_ID || "b838b9e7-5ca1-416d-a420-307be040acb7";
const DRY = process.argv.includes("--dry");

const STATEMENTS = [
  // 功能 1：崩溃指纹复用
  "ALTER TABLE error_reports ADD COLUMN fingerprint TEXT",
  "ALTER TABLE error_reports ADD COLUMN matched_from TEXT",
  // 功能 2：版本自检
  "ALTER TABLE error_reports ADD COLUMN env_check TEXT",
  "ALTER TABLE error_reports ADD COLUMN mc_version TEXT",
  "ALTER TABLE error_reports ADD COLUMN pack_version TEXT",
  "ALTER TABLE error_reports ADD COLUMN detected_outdated INTEGER DEFAULT 0",
  // 功能 3：崩溃排行（统计维度随报告一起存，避免额外写入）
  "ALTER TABLE error_reports ADD COLUMN error_type TEXT",
  "ALTER TABLE error_reports ADD COLUMN suspect_mod TEXT",
  // 任务 3：GLM 限流延迟重试（不消耗 attempts）
  "ALTER TABLE error_reports ADD COLUMN delay_count INTEGER DEFAULT 0",
  "ALTER TABLE error_reports ADD COLUMN next_retry_at TEXT",
  // 每日汇总表（1 行/天）+ 查询索引
  "CREATE TABLE IF NOT EXISTS er_stats_daily (date TEXT PRIMARY KEY, payload TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_er_fingerprint ON error_reports(fingerprint)",
  "CREATE INDEX IF NOT EXISTS idx_er_created ON error_reports(createdAt)"
];

async function run(sql) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/d1/database/${DATABASE}/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql })
    }
  );
  return res.json();
}

(async () => {
  if (!TOKEN) {
    console.error("缺少 CF_API_TOKEN 环境变量");
    process.exit(1);
  }
  for (const sql of STATEMENTS) {
    if (DRY) {
      console.log("[dry]", sql);
      continue;
    }
    const out = await run(sql);
    const err = (out.errors || []).map((e) => e.message).join("; ");
    if (err && /duplicate column name/i.test(err)) {
      console.log("[skip] 字段已存在:", sql.slice(0, 70));
    } else if (err) {
      console.error("[fail]", sql, "->", err);
    } else {
      console.log("[ok]  ", sql.slice(0, 70));
    }
  }
  // 校验：把最终表结构打出来
  const info = await run("PRAGMA table_info(error_reports)");
  const cols = ((info.result || [{}])[0].results || []).map((c) => c.name);
  console.log("\nerror_reports 现有列:", cols.join(", "));
})();
