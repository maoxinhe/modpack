// 管理后台逻辑
let currentMods = [];

async function json(url, opts) {
  const res = await fetch(url, opts);
  let data = {};
  try { data = await res.json(); } catch (_) { data = {}; }
  if (!res.ok) throw new Error(data.error || `请求失败 (${res.status})`);
  return data;
}

function toast(msg, type = 'ok') {
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

function fmtSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function esc(s) {
  const div = document.createElement('div');
  div.textContent = String(s == null ? '' : s);
  return div.innerHTML;
}

function fmtTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('zh-CN');
}

function handlePublishResult(p, actionText) {
  if (!p) { toast(`${actionText}完成`, 'ok'); return; }
  if (p.error) {
    toast(`${actionText}成功，但自动发布失败：${p.error}`, 'err');
  } else {
    toast(`${actionText}成功，已自动发布 v${p.version} → ${p.tag}`, 'ok');
  }
}

async function init() {
  try {
    const me = await json('/api/me');
    const area = document.getElementById('meArea');
    if (!me.isAdmin) {
      document.getElementById('needLogin').hidden = false;
      if (me.user) area.innerHTML = `<span class="pill pill-gray">${esc(me.user.name)}（非管理员）</span>`;
      return;
    }
    document.getElementById('needLogin').hidden = true;
    document.getElementById('panel').hidden = false;
    area.innerHTML = `<span class="pill pill-green">✅ ${esc(me.user.name)}（管理员）</span>`;
    loadMods();
    loadReleases();
    bindUpload();
  } catch (e) {
    document.getElementById('needLogin').hidden = false;
    document.getElementById('needLogin').innerHTML =
      `<h2>🔒 登录失败</h2><p style="color:var(--muted)">${esc(e.message)}</p><a href="/auth/login" class="btn btn-primary">重新登录</a>`;
  }
}

async function loadMods() {
  try {
    const data = await json('/api/admin/mods');
    currentMods = data.mods || [];
    renderMods();
  } catch (e) {
    toast('加载模组列表失败：' + e.message, 'err');
  }
}

function renderMods() {
  const list = document.getElementById('modList');
  document.getElementById('modCount').textContent = currentMods.length;
  if (!currentMods.length) {
    list.innerHTML = '<div class="empty">mods 文件夹暂无模组，请上传</div>';
    return;
  }
  list.innerHTML = currentMods.map((m) => `
    <div class="mod-item">
      <span class="name">📦 ${esc(m.name)}</span>
      <span class="meta">${fmtSize(m.size)}</span>
      <span class="ops">
        <button class="btn btn-sm" data-act="rename" data-name="${esc(m.name)}">重命名</button>
        <button class="btn btn-danger btn-sm" data-act="del" data-name="${esc(m.name)}">删除</button>
      </span>
    </div>`).join('');

  list.querySelectorAll('[data-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      if (btn.dataset.act === 'rename') doRename(name);
      else doDelete(name);
    });
  });
}

function bindUpload() {
  const drop = document.getElementById('dropZone');
  const input = document.getElementById('fileInput');
  drop.addEventListener('click', () => input.click());
  input.addEventListener('change', () => input.files.length && upload(input.files[0]));
  ['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('drag'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('drag'); }));
  drop.addEventListener('drop', (e) => {
    const f = e.dataTransfer.files[0];
    if (f) upload(f);
  });
}

async function upload(file) {
  if (!file.name.toLowerCase().endsWith('.jar')) {
    toast('只能上传 .jar 文件', 'err');
    return;
  }
  const fd = new FormData();
  fd.append('file', file);
  toast(`正在上传 ${file.name} 并自动打包发布…`, 'loading');
  try {
    const data = await json('/api/admin/mods', { method: 'POST', body: fd });
    handlePublishResult(data.publish, `上传 ${file.name}`);
    loadMods();
    loadReleases();
  } catch (e) {
    toast('上传失败：' + e.message, 'err');
  }
}

async function doRename(name) {
  const newName = window.prompt(`将 "${name}" 重命名为（必须以 .jar 结尾）：`, name);
  if (!newName || newName === name) return;
  toast('正在重命名并自动发布…', 'loading');
  try {
    const data = await json('/api/admin/mods/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldName: name, newName }),
    });
    handlePublishResult(data.publish, `重命名 ${name}`);
    loadMods();
    loadReleases();
  } catch (e) {
    toast('重命名失败：' + e.message, 'err');
  }
}

async function doDelete(name) {
  if (!window.confirm(`确定删除模组 "${name}"？删除后将自动发布新版本。`)) return;
  toast(`正在删除 ${name} 并自动发布…`, 'loading');
  try {
    const data = await json('/api/admin/mods/' + encodeURIComponent(name), { method: 'DELETE' });
    handlePublishResult(data.publish, `删除 ${name}`);
    loadMods();
    loadReleases();
  } catch (e) {
    toast('删除失败：' + e.message, 'err');
  }
}

document.getElementById('publishBtn').addEventListener('click', async () => {
  const msg = document.getElementById('publishMsg').value.trim();
  toast('正在打包并发布新版本…', 'loading');
  try {
    const data = await json('/api/admin/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
    });
    toast(`发布成功：v${data.result.version} → ${data.result.tag}`, 'ok');
    loadMods();
    loadReleases();
  } catch (e) {
    toast('发布失败：' + e.message, 'err');
  }
});

async function loadReleases() {
  try {
    const data = await json('/api/releases');
    const list = document.getElementById('releaseList');
    if (!data.releases || !data.releases.length) {
      list.innerHTML = '<div class="empty">暂无发布记录</div>';
      return;
    }
    list.innerHTML = data.releases.map((r) => {
      const zip = (r.assets || []).find((a) => a.name.toLowerCase().endsWith('.zip'));
      return `
      <div class="mod-item">
        <span class="name">🏷 ${esc(r.tag)} <span class="pill pill-green" style="margin-left:6px;">${esc(r.name || '')}</span></span>
        <span class="meta">${fmtTime(r.published_at)}${zip ? ' · ' + fmtSize(zip.size) : ''}</span>
        <span class="ops">
          ${zip ? `<a class="btn btn-primary btn-sm" href="${esc(zip.url)}" target="_blank" rel="noopener">下载</a>` : ''}
          <a class="btn btn-sm" href="${esc(r.html_url)}" target="_blank" rel="noopener">详情</a>
        </span>
      </div>`;
    }).join('');
  } catch (e) {
    document.getElementById('releaseList').innerHTML = `<div class="empty">加载失败：${esc(e.message)}</div>`;
  }
}

init();
