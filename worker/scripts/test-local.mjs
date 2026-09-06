#!/usr/bin/env node
/**
 * 本地自测：只测纯函数（不需要 Worker 运行时）。
 * 覆盖：指纹去噪/稳定性/区分度、版本提取与比较、可疑模组提取、限流判定。
 *
 * 用法：node scripts/test-local.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(here, "..", "src", "index.js"), "utf-8");

// 从 src/index.js 里切出"崩溃分析增强"这段纯逻辑，拼成可 import 的临时模块
const begin = src.indexOf("// ===== 崩溃分析增强");
const end = src.indexOf("async function analyzeLogWithGLM");
if (begin < 0 || end < 0) throw new Error("没找到增强函数块，index.js 结构变了？");
const block = src.slice(begin, end);
const tmp = join(here, ".tmp-er-fns.mjs");
writeFileSync(
  tmp,
  block +
    "\nexport { fnv1a32, normalizeFrame, parseCrashFacts, computeFingerprint, parsePackVersion, compareVersion, isRateLimitError };\n"
);
const m = await import("file://" + tmp);

let pass = 0;
let fail = 0;
function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}\n      期望: ${JSON.stringify(expected)}\n      实际: ${JSON.stringify(actual)}`);
  }
}
function ok(name, cond) {
  check(name, !!cond, true);
}

console.log("\n[1] 指纹去噪：同一崩溃换个行号/时间戳/UUID 仍算同一个");
const crashA = [
  "[12:00:02] [main/ERROR]: java.lang.RuntimeException: Failed to find mod entrypoint class for mod mymod",
  "[12:00:02] [main/ERROR]: \tat net.fabricmc.loader.impl.entrypoint.EntrypointUtils.invoke0(EntrypointUtils.java:52)",
  "[12:00:02] [main/ERROR]: \tat net.fabricmc.loader.impl.game.MinecraftGameProvider.launch(MinecraftGameProvider.java:471)"
].join("\n");
const crashB = crashA
  .replace(/EntrypointUtils\.java:52/, "EntrypointUtils.java:88")
  .replace(/MinecraftGameProvider\.java:471/, "MinecraftGameProvider.java:123")
  .replace(/12:00:02/g, "18:44:07");
const fA = m.computeFingerprint(m.parseCrashFacts(crashA), crashA);
const fB = m.computeFingerprint(m.parseCrashFacts(crashB), crashB);
check("改行号+时间戳后指纹一致", fA, fB);
ok("指纹长度为 8", fA.length === 8);

console.log("\n[2] 指纹区分度：不同异常类型必须算出不同指纹");
const crashC = "java.lang.OutOfMemoryError: Java heap space\n\tat net.minecraft.world.chunk.storage.RegionFile.write(RegionFile.java:31)";
const fC = m.computeFingerprint(m.parseCrashFacts(crashC), crashC);
ok("OOM 与 RuntimeException 指纹不同", fA !== fC);

console.log("\n[3] 去噪细节");
check("去掉文件名和行号", m.normalizeFrame("at a.b.C.d(D.java:52)"), "at a.b.C.d()");
check("十六进制地址被抹掉", m.normalizeFrame("at a.b.C.d(Unknown Source) 0x1a2b3c"), "at a.b.C.d()");

console.log("\n[4] 环境信息提取");
const factsA = m.parseCrashFacts(
  "[12:00:00] [main/INFO]: Loading Minecraft 1.20.1 with Fabric Loader 0.15.0\n" + crashA
);
check("MC 版本", factsA.mcVersion, "1.20.1");
check("加载器", factsA.loader, "Fabric Loader 0.15.0");
check("异常类型", factsA.errorType, "java.lang.RuntimeException");
check("可疑模组（来自 from mod 线索）", factsA.suspectMod, "mymod");

console.log("\n[5] 版本比较（1.0.10 必须大于 1.0.9）");
check("1.0.9 < 1.0.10", m.compareVersion("1.0.9", "1.0.10"), -1);
check("v1.0.10 == 1.0.10", m.compareVersion("v1.0.10", "1.0.10"), 0);
check("1.1.0 > 1.0.30", m.compareVersion("1.1.0", "1.0.30"), 1);

console.log("\n[6] 模组包版本文件解析");
check("manifest.json 的 version 字段", m.parsePackVersion("manifest.json", JSON.stringify({ name: "dream", version: "1.0.7" })), "1.0.7");
check("纯文本版本号", m.parsePackVersion("version.txt", "v2.1.0"), "2.1.0");
check("空内容返回 null", m.parsePackVersion("version.txt", ""), null);

console.log("\n[7] 限流判定");
check("429 算限流", m.isRateLimitError(429, "Too Many Requests"), true);
check("智谱'访问量过大'算限流", m.isRateLimitError(200, "该模型当前访问量过大，请您稍后再试"), true);
check("英文 rate limit 算限流", m.isRateLimitError(200, "rate limit exceeded"), true);
check("内容类错误不算限流", m.isRateLimitError(400, "压缩包解压失败: 无法解析文件"), false);

console.log(`\n结果：${pass} 通过 / ${fail} 失败\n`);
process.exit(fail ? 1 : 0);
