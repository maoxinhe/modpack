const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const cfg = require('./config');
const github = require('./github');
const modsService = require('./mods');
const { listModFiles } = require('./pack');
const { readState } = require('./db');
const { publish } = require('./publish');

const router = express.Router();

const upload = multer({
  dest: path.join(cfg.dataDir, 'tmp'),
  limits: { fileSize: cfg.maxUploadSizeMb * 1024 * 1024, files: 1 },
});

function isAdmin(req) {
  if (cfg.devAuthToken && req.get('X-Dev-Token') === cfg.devAuthToken) return true;
  return !!(req.session && req.session.user && req.session.user.login === cfg.adminLogin);
}

function requireAdmin(req, res, next) {
  if (isAdmin(req)) return next();
  return res.status(403).json({ error: '需要管理员权限' });
}

function handleError(res, e) {
  console.error('[error]', e);
  const status = e.status || (e.code === 'NO_MODS' ? 400 : 500);
  res.status(status).json({ error: e.message || '服务器内部错误' });
}

async function tryPublish() {
  try {
    return await publish();
  } catch (e) {
    return { error: e.message };
  }
}

// ---------- GitHub OAuth ----------
router.get('/auth/login', (req, res) => {
  if (!cfg.githubClientId) {
    return res.status(400).send('尚未配置 GitHub OAuth（GITHUB_CLIENT_ID），请先在 GitHub 注册 OAuth App 并配置 .env');
  }
  const redirectUri = `${cfg.baseUrl || `http://localhost:${cfg.port}`}/auth/callback`;
  const url = 'https://github.com/login/oauth/authorize' +
    `?client_id=${encodeURIComponent(cfg.githubClientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    '&scope=read:user&state=modpack';
  res.redirect(url);
});

router.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send('缺少授权码');
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: cfg.githubClientId,
        client_secret: cfg.githubClientSecret,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.access_token) {
      return res.status(400).send(`GitHub 授权失败: ${tokenData.error_description || tokenData.error || 'unknown'}`);
    }
    const user = await github.getUser(tokenData.access_token);
    req.session.user = {
      login: user.login,
      name: user.name || user.login,
      avatar_url: user.avatar_url,
      token: tokenData.access_token,
    };
    res.redirect(isAdmin(req) ? '/admin.html' : '/');
  } catch (e) {
    res.status(500).send('登录失败: ' + e.message);
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

router.get('/api/me', (req, res) => {
  if (!req.session || !req.session.user) return res.json({ user: null, isAdmin: false });
  res.json({ user: req.session.user, isAdmin: isAdmin(req) });
});

// ---------- 公开接口 ----------
router.get('/api/mods', (req, res) => {
  res.json({ mods: listModFiles() });
});

router.get('/api/releases/latest', async (req, res) => {
  try {
    const release = await github.getLatestRelease();
    if (!release) return res.json({ release: null, state: readState() });
    const zipAsset = (release.assets || []).find((a) => a.name.toLowerCase().endsWith('.zip')) || null;
    res.json({
      release: {
        tag: release.tag_name,
        name: release.name,
        published_at: release.published_at,
        html_url: release.html_url,
        body: release.body,
        asset: zipAsset
          ? { name: zipAsset.name, url: zipAsset.browser_download_url, size: zipAsset.size }
          : null,
      },
      state: readState(),
    });
  } catch (e) {
    handleError(res, e);
  }
});

router.get('/api/releases', async (req, res) => {
  try {
    const releases = await github.listReleases();
    res.json({
      releases: releases.map((r) => ({
        id: r.id,
        tag: r.tag_name,
        name: r.name,
        published_at: r.published_at,
        html_url: r.html_url,
        assets: (r.assets || []).map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size })),
      })),
    });
  } catch (e) {
    handleError(res, e);
  }
});

// ---------- 管理接口（仅 maoxinhe） ----------
router.get('/api/admin/mods', requireAdmin, (req, res) => {
  res.json({ mods: listModFiles() });
});

router.post('/api/admin/mods', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: '未收到文件' });
    const saved = modsService.saveUploadedJar(req.file);
    const publishResult = await tryPublish();
    res.json({ ok: true, mod: saved, publish: publishResult });
  } catch (e) {
    handleError(res, e);
  }
});

router.post('/api/admin/mods/rename', requireAdmin, async (req, res) => {
  try {
    const { oldName, newName } = req.body || {};
    const renamed = modsService.renameMod(oldName, newName);
    const publishResult = await tryPublish();
    res.json({ ok: true, name: renamed, publish: publishResult });
  } catch (e) {
    handleError(res, e);
  }
});

router.delete('/api/admin/mods/:name', requireAdmin, async (req, res) => {
  try {
    const deleted = modsService.deleteMod(req.params.name);
    const publishResult = await tryPublish();
    res.json({ ok: true, name: deleted, publish: publishResult });
  } catch (e) {
    handleError(res, e);
  }
});

router.post('/api/admin/publish', requireAdmin, (req, res) => {
  publish({ message: (req.body || {}).message || '' })
    .then((result) => res.json({ ok: true, result }))
    .catch((e) => handleError(res, e));
});

module.exports = { router, isAdmin };
