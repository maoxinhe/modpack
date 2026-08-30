const fs = require('fs');
const path = require('path');
const cfg = require('./config');
const { ensureDir } = require('./db');

function safeName(name) {
  const n = String(name || '').trim();
  if (!n) return null;
  if (path.basename(n) !== n) return null; // 禁止路径穿越
  if (n.includes('..')) return null;
  if (/[<>:"/\\|?*\x00-\x1f]/.test(n)) return null; // Windows 非法字符
  return n;
}

function validateJarName(name) {
  const n = safeName(name);
  if (!n || !n.toLowerCase().endsWith('.jar')) return null;
  return n;
}

function modPath(name) {
  return path.join(cfg.modsDir, name);
}

function saveUploadedJar(file) {
  // file 来自 multer：{ originalname, path }
  const name = validateJarName(file.originalname);
  if (!name) {
    fs.rmSync(file.path, { force: true });
    throw new Error('模组文件名不合法，必须是以 .jar 结尾的合法文件名');
  }
  const dest = modPath(name);
  if (fs.existsSync(dest)) {
    fs.rmSync(file.path, { force: true });
    throw new Error(`同名模组已存在: ${name}`);
  }
  ensureDir(cfg.modsDir);
  fs.renameSync(file.path, dest);
  return { name, size: fs.statSync(dest).size };
}

function renameMod(oldName, newName) {
  const from = validateJarName(oldName);
  const to = validateJarName(newName);
  if (!from || !to) throw new Error('文件名不合法');
  if (!fs.existsSync(modPath(from))) throw new Error(`模组不存在: ${from}`);
  if (fs.existsSync(modPath(to))) throw new Error(`目标文件名已存在: ${to}`);
  fs.renameSync(modPath(from), modPath(to));
  return to;
}

function deleteMod(name) {
  const n = validateJarName(name);
  if (!n) throw new Error('文件名不合法');
  const p = modPath(n);
  if (!fs.existsSync(p)) throw new Error(`模组不存在: ${n}`);
  fs.rmSync(p, { force: true });
  return n;
}

module.exports = { saveUploadedJar, renameMod, deleteMod, validateJarName };
