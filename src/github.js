const fs = require('fs');
const cfg = require('./config');

const API = 'https://api.github.com';
const REPO = `/repos/${cfg.repoOwner}/${cfg.repoName}`;

function headers(token) {
  return {
    Authorization: token ? `token ${token}` : `token ${cfg.githubToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'modpack-release',
  };
}

async function parse(res) {
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch (_) { data = text; }
  if (!res.ok) {
    const err = new Error(`GitHub API ${res.status}: ${res.statusText}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function getUser(token) {
  return parse(await fetch(`${API}/user`, { headers: headers(token) }));
}

async function getLatestRelease() {
  try {
    return await parse(await fetch(`${API}${REPO}/releases/latest`, { headers: headers() }));
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

async function listReleases() {
  return parse(await fetch(`${API}${REPO}/releases?per_page=20`, { headers: headers() }));
}

async function createRelease(tagName, name, body) {
  return parse(await fetch(`${API}${REPO}/releases`, {
    method: 'POST',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag_name: tagName, name, body, draft: false, prerelease: false, generate_release_notes: false }),
  }));
}

async function uploadAsset(releaseId, filePath, assetName) {
  const fileData = fs.readFileSync(filePath);
  const url = `${API}${REPO}/releases/${releaseId}/assets?name=${encodeURIComponent(assetName)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...headers(), 'Content-Type': 'application/zip', 'Content-Length': String(fileData.length) },
    body: fileData,
  });
  return parse(res);
}

async function deleteRelease(releaseId) {
  return parse(await fetch(`${API}${REPO}/releases/${releaseId}`, { method: 'DELETE', headers: headers() }));
}

module.exports = { getUser, getLatestRelease, listReleases, createRelease, uploadAsset, deleteRelease };
