// 公共下载页逻辑
async function json(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `请求失败 (${res.status})`);
  return data;
}

function toast(msg, type = 'ok') {
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 4000);
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

async function loadMe() {
  try {
    const me = await json('/api/me');
    const area = document.getElementById('meArea');
    const loginBtn = document.getElementById('loginBtn');
    if (me.user) {
      const isAdmin = me.isAdmin;
      loginBtn.hidden = true;
      area.innerHTML = isAdmin
        ? `<a href="/admin.html" class="btn btn-sm">⚙ 管理后台</a> <span class="pill pill-green">${esc(me.user.name)}</span>`
        : `<span class="pill pill-gray">已登录：${esc(me.user.name)}</span>`;
    } else {
      loginBtn.hidden = false;
    }
  } catch (e) { /* ignore */ }
}

async function loadLatest() {
  try {
    const data = await json('/api/releases/latest');
    const badge = document.getElementById('verBadge');
    const sub = document.getElementById('verSub');
    const dl = document.getElementById('downloadBtn');

    if (!data.release || !data.release.asset) {
      badge.textContent = '暂无版本';
      sub.textContent = '尚未发布任何模组包';
      return;
    }
    const r = data.release;
    badge.textContent = r.tag;
    const when = new Date(r.published_at);
    sub.innerHTML = `发布于 ${when.toLocaleString('zh-CN')} · 包含 ${r.asset ? fmtSize(r.asset.size) : ''} 压缩包 · <a href="${esc(r.html_url)}" target="_blank" rel="noopener">Release 详情</a>`;
    dl.hidden = false;
    dl.href = r.asset.url;
    dl.textContent = `⬇ 下载最新模组包 (${r.tag} · ${fmtSize(r.asset.size)})`;
    document.getElementById('releasesLink').href = r.html_url;
  } catch (e) {
    document.getElementById('verBadge').textContent = '加载失败';
    document.getElementById('verSub').textContent = e.message;
  }
}

async function loadMods() {
  try {
    const data = await json('/api/mods');
    const list = document.getElementById('modList');
    if (!data.mods || data.mods.length === 0) {
      list.innerHTML = '<div class="empty">mods 文件夹暂无模组</div>';
      return;
    }
    list.innerHTML = data.mods.map((m) => `
      <div class="mod-item">
        <span class="name">📦 ${esc(m.name)}</span>
        <span class="meta">${fmtSize(m.size)}</span>
      </div>`).join('');
  } catch (e) {
    document.getElementById('modList').innerHTML = `<div class="empty">加载失败：${esc(e.message)}</div>`;
  }
}

loadMe();
loadLatest();
loadMods();
