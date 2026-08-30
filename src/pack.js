const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const cfg = require('./config');
const { ensureDir } = require('./db');

function listModFiles() {
  ensureDir(cfg.modsDir);
  return fs.readdirSync(cfg.modsDir)
    .filter((n) => n.toLowerCase().endsWith('.jar'))
    .map((n) => {
      const st = fs.statSync(path.join(cfg.modsDir, n));
      return { name: n, size: st.size, mtime: st.mtime.toISOString() };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function packMods(version) {
  ensureDir(cfg.distDir);
  const files = listModFiles();
  const zipPath = path.join(cfg.distDir, `mods-${version}.zip`);
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => resolve({ zipPath, files, size: archive.pointer() }));
    archive.on('error', reject);
    archive.pipe(output);
    for (const f of files) {
      archive.file(path.join(cfg.modsDir, f.name), { name: f.name });
    }
    archive.finalize();
  });
}

module.exports = { listModFiles, packMods };
