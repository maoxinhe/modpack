const cfg = require('./config');
const { readState, writeState, bumpVersion } = require('./db');
const { packMods, listModFiles } = require('./pack');
const { createRelease, uploadAsset, deleteRelease } = require('./github');

async function publish({ message } = {}) {
  const files = listModFiles();
  if (files.length === 0) {
    const err = new Error('mods 文件夹中没有 .jar 模组，无法发布');
    err.code = 'NO_MODS';
    throw err;
  }

  const state = readState();
  const version = bumpVersion(state.currentVersion);
  const tag = `v${version}`;

  const packed = await packMods(version);

  let release = null;
  try {
    const modsList = packed.files
      .map((f) => `- \`${f.name}\` (${(f.size / 1024).toFixed(1)} KB)`)
      .join('\n');
    const notes = `## 梦之韵模组包 v${version}\n\n共 ${packed.files.length} 个模组：\n\n${modsList}\n\n${message ? `> ${message}` : ''}\n\n> 由梦之韵模组发布系统自动打包生成。`;
    release = await createRelease(tag, `梦之韵模组包 v${version}`, notes);
    const asset = await uploadAsset(release.id, packed.zipPath, `mods-${version}.zip`);

    state.currentVersion = version;
    state.lastPublishAt = new Date().toISOString();
    state.lastReleaseId = release.id;
    state.lastReleaseTag = tag;
    writeState(state);

    return {
      version,
      tag,
      release: { id: release.id, url: release.html_url },
      asset: { name: asset.name, url: asset.browser_download_url, size: asset.size },
      mods: packed.files,
      zipSize: packed.size,
    };
  } catch (e) {
    // 发布失败时清理已创建的 release，避免产生空 release
    if (release && release.id) {
      try { await deleteRelease(release.id); } catch (_) { /* ignore */ }
    }
    throw e;
  }
}

module.exports = { publish };
