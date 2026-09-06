var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
var __defProp222 = Object.defineProperty;
var __name222 = /* @__PURE__ */ __name22((target, value) => __defProp222(target, "name", { value, configurable: true }), "__name");
var __defProp2222 = Object.defineProperty;
var __name2222 = /* @__PURE__ */ __name222((target, value) => __defProp2222(target, "name", { value, configurable: true }), "__name");
var __name22222 = /* @__PURE__ */ __name2222((target, value) => Object.defineProperty(target, "name", { value, configurable: true }), "__name");
var API = "https://api.github.com";
function headers(env, token) {
  return {
    Authorization: `token ${token || env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "modpack-release-worker"
  };
}
__name(headers, "headers");
__name2(headers, "headers");
__name22(headers, "headers");
__name222(headers, "headers");
__name2222(headers, "headers");
__name22222(headers, "headers");
function repoPath(env) {
  return `/repos/${env.REPO_OWNER}/${env.REPO_NAME}`;
}
__name(repoPath, "repoPath");
__name2(repoPath, "repoPath");
__name22(repoPath, "repoPath");
__name222(repoPath, "repoPath");
__name2222(repoPath, "repoPath");
__name22222(repoPath, "repoPath");
async function parse(res) {
  const text2 = await res.text();
  let data = null;
  try {
    data = JSON.parse(text2);
  } catch (_) {
    data = text2;
  }
  if (!res.ok) {
    const err2 = new Error(`GitHub API ${res.status}: ${res.statusText}`);
    err2.status = res.status;
    err2.data = data;
    throw err2;
  }
  return data;
}
__name(parse, "parse");
__name2(parse, "parse");
__name22(parse, "parse");
__name222(parse, "parse");
__name2222(parse, "parse");
__name22222(parse, "parse");
async function getUser(env, token) {
  return parse(await fetch(`${API}/user`, { headers: headers(env, token) }));
}
__name(getUser, "getUser");
__name2(getUser, "getUser");
__name22(getUser, "getUser");
__name222(getUser, "getUser");
__name2222(getUser, "getUser");
__name22222(getUser, "getUser");
async function getLatestRelease(env) {
  try {
    return await parse(await fetch(`${API}${repoPath(env)}/releases/latest`, { headers: headers(env) }));
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}
__name(getLatestRelease, "getLatestRelease");
__name2(getLatestRelease, "getLatestRelease");
__name22(getLatestRelease, "getLatestRelease");
__name222(getLatestRelease, "getLatestRelease");
__name2222(getLatestRelease, "getLatestRelease");
__name22222(getLatestRelease, "getLatestRelease");
async function listReleases(env) {
  return parse(await fetch(`${API}${repoPath(env)}/releases?per_page=20`, { headers: headers(env) }));
}
__name(listReleases, "listReleases");
__name2(listReleases, "listReleases");
__name22(listReleases, "listReleases");
__name222(listReleases, "listReleases");
__name2222(listReleases, "listReleases");
__name22222(listReleases, "listReleases");
async function createRelease(env, tagName, name, body) {
  return parse(await fetch(`${API}${repoPath(env)}/releases`, {
    method: "POST",
    headers: { ...headers(env), "Content-Type": "application/json" },
    body: JSON.stringify({ tag_name: tagName, name, body, draft: false, prerelease: false, generate_release_notes: false })
  }));
}
__name(createRelease, "createRelease");
__name2(createRelease, "createRelease");
__name22(createRelease, "createRelease");
__name222(createRelease, "createRelease");
__name2222(createRelease, "createRelease");
__name22222(createRelease, "createRelease");
async function uploadAsset(env, releaseId, data, assetName, contentType = "application/zip") {
  const url = `https://uploads.github.com${repoPath(env)}/releases/${releaseId}/assets?name=${encodeURIComponent(assetName)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...headers(env), "Content-Type": contentType },
    body: data
  });
  return parse(res);
}
__name(uploadAsset, "uploadAsset");
__name2(uploadAsset, "uploadAsset");
__name22(uploadAsset, "uploadAsset");
__name222(uploadAsset, "uploadAsset");
__name2222(uploadAsset, "uploadAsset");
__name22222(uploadAsset, "uploadAsset");
async function deleteRelease(env, releaseId) {
  return parse(await fetch(`${API}${repoPath(env)}/releases/${releaseId}`, { method: "DELETE", headers: headers(env) }));
}
__name(deleteRelease, "deleteRelease");
__name2(deleteRelease, "deleteRelease");
__name22(deleteRelease, "deleteRelease");
__name222(deleteRelease, "deleteRelease");
__name2222(deleteRelease, "deleteRelease");
__name22222(deleteRelease, "deleteRelease");
async function getRelease(env, id) {
  return parse(await fetch(`${API}${repoPath(env)}/releases/${id}`, { headers: headers(env) }));
}
__name(getRelease, "getRelease");
__name2(getRelease, "getRelease");
__name22(getRelease, "getRelease");
__name222(getRelease, "getRelease");
__name2222(getRelease, "getRelease");
__name22222(getRelease, "getRelease");
async function getReleaseAsset(env, assetId) {
  const res = await fetch(`${API}${repoPath(env)}/releases/assets/${assetId}`, {
    headers: { ...headers(env), Accept: "application/octet-stream" }
  });
  if (!res.ok) {
    const err2 = new Error(`GitHub API ${res.status}: ${res.statusText}`);
    err2.status = res.status;
    throw err2;
  }
  return new Uint8Array(await res.arrayBuffer());
}
__name(getReleaseAsset, "getReleaseAsset");
__name2(getReleaseAsset, "getReleaseAsset");
__name22(getReleaseAsset, "getReleaseAsset");
__name222(getReleaseAsset, "getReleaseAsset");
__name2222(getReleaseAsset, "getReleaseAsset");
__name22222(getReleaseAsset, "getReleaseAsset");
async function deleteTag(env, tag) {
  return parse(await fetch(`${API}${repoPath(env)}/git/refs/tags/${encodeURIComponent(tag)}`, { method: "DELETE", headers: headers(env) }));
}
__name(deleteTag, "deleteTag");
__name2(deleteTag, "deleteTag");
__name22(deleteTag, "deleteTag");
__name222(deleteTag, "deleteTag");
__name2222(deleteTag, "deleteTag");
__name22222(deleteTag, "deleteTag");
function repoBranch(env) {
  return env.REPO_BRANCH || "main";
}
__name(repoBranch, "repoBranch");
__name2(repoBranch, "repoBranch");
__name22(repoBranch, "repoBranch");
__name222(repoBranch, "repoBranch");
__name2222(repoBranch, "repoBranch");
__name22222(repoBranch, "repoBranch");
function encPath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}
__name(encPath, "encPath");
__name2(encPath, "encPath");
__name22(encPath, "encPath");
__name222(encPath, "encPath");
__name2222(encPath, "encPath");
__name22222(encPath, "encPath");
async function fileMeta(env, path) {
  try {
    return await parse(await fetch(`${API}${repoPath(env)}/contents/${encPath(path)}`, { headers: headers(env) }));
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}
__name(fileMeta, "fileMeta");
__name2(fileMeta, "fileMeta");
__name22(fileMeta, "fileMeta");
__name222(fileMeta, "fileMeta");
__name2222(fileMeta, "fileMeta");
__name22222(fileMeta, "fileMeta");
async function listRepoDir(env, dir) {
  const meta = await fileMeta(env, dir);
  if (!meta) return [];
  if (Array.isArray(meta)) return meta.filter((e) => e.type === "file");
  return [];
}
__name(listRepoDir, "listRepoDir");
__name2(listRepoDir, "listRepoDir");
__name22(listRepoDir, "listRepoDir");
__name222(listRepoDir, "listRepoDir");
__name2222(listRepoDir, "listRepoDir");
__name22222(listRepoDir, "listRepoDir");
async function readRepoFile(env, path) {
  const res = await fetch(`${API}${repoPath(env)}/contents/${encPath(path)}`, {
    headers: { ...headers(env), Accept: "application/vnd.github.raw+json" }
  });
  if (!res.ok) {
    const err2 = new Error(`GitHub API ${res.status}: ${res.statusText}`);
    err2.status = res.status;
    throw err2;
  }
  return new Uint8Array(await res.arrayBuffer());
}
__name(readRepoFile, "readRepoFile");
__name2(readRepoFile, "readRepoFile");
__name22(readRepoFile, "readRepoFile");
__name222(readRepoFile, "readRepoFile");
__name2222(readRepoFile, "readRepoFile");
__name22222(readRepoFile, "readRepoFile");
async function writeRepoFile(env, path, data, message) {
  const existing = await fileMeta(env, path);
  const body = { message, content: bytesToBase64(data), branch: repoBranch(env) };
  if (existing) body.sha = existing.sha;
  return parse(await fetch(`${API}${repoPath(env)}/contents/${encPath(path)}`, {
    method: "PUT",
    headers: { ...headers(env), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }));
}
__name(writeRepoFile, "writeRepoFile");
__name2(writeRepoFile, "writeRepoFile");
__name22(writeRepoFile, "writeRepoFile");
__name222(writeRepoFile, "writeRepoFile");
__name2222(writeRepoFile, "writeRepoFile");
__name22222(writeRepoFile, "writeRepoFile");
async function deleteRepoFile(env, path, message) {
  const meta = await fileMeta(env, path);
  if (!meta) return null;
  return parse(await fetch(`${API}${repoPath(env)}/contents/${encPath(path)}`, {
    method: "DELETE",
    headers: { ...headers(env), "Content-Type": "application/json" },
    body: JSON.stringify({ message, sha: meta.sha, branch: repoBranch(env) })
  }));
}
__name(deleteRepoFile, "deleteRepoFile");
__name2(deleteRepoFile, "deleteRepoFile");
__name22(deleteRepoFile, "deleteRepoFile");
__name222(deleteRepoFile, "deleteRepoFile");
__name2222(deleteRepoFile, "deleteRepoFile");
__name22222(deleteRepoFile, "deleteRepoFile");
function bytesToBase64(bytes) {
  let binary = "";
  const CHUNK = 32768;
  for (let i2 = 0; i2 < bytes.length; i2 += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i2, i2 + CHUNK));
  }
  return btoa(binary);
}
__name(bytesToBase64, "bytesToBase64");
__name2(bytesToBase64, "bytesToBase64");
__name22(bytesToBase64, "bytesToBase64");
__name222(bytesToBase64, "bytesToBase64");
__name2222(bytesToBase64, "bytesToBase64");
__name22222(bytesToBase64, "bytesToBase64");
var STATE_KEY = "state";
var MODS_DIR = "mods";
var UPDATER_PATH = "updater/mod-updater.exe";
function defaultState() {
  return { currentVersion: "1.0.0", lastPublishAt: null, lastReleaseId: null, lastReleaseTag: null };
}
__name(defaultState, "defaultState");
__name2(defaultState, "defaultState");
__name22(defaultState, "defaultState");
__name222(defaultState, "defaultState");
__name2222(defaultState, "defaultState");
__name22222(defaultState, "defaultState");
async function readState(env) {
  const raw = await env.MODS_KV.get(STATE_KEY);
  if (!raw) return defaultState();
  try {
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch (_) {
    return defaultState();
  }
}
__name(readState, "readState");
__name2(readState, "readState");
__name22(readState, "readState");
__name222(readState, "readState");
__name2222(readState, "readState");
__name22222(readState, "readState");
async function writeState(env, state) {
  await env.MODS_KV.put(STATE_KEY, JSON.stringify(state));
}
__name(writeState, "writeState");
__name2(writeState, "writeState");
__name22(writeState, "writeState");
__name222(writeState, "writeState");
__name2222(writeState, "writeState");
__name22222(writeState, "writeState");
function bumpVersion(v) {
  const parts = String(v || "1.0.0").split(".").map((n) => parseInt(n, 10) || 0);
  while (parts.length < 3) parts.push(0);
  parts[2] += 1;
  return parts.join(".");
}
__name(bumpVersion, "bumpVersion");
__name2(bumpVersion, "bumpVersion");
__name22(bumpVersion, "bumpVersion");
__name222(bumpVersion, "bumpVersion");
__name2222(bumpVersion, "bumpVersion");
__name22222(bumpVersion, "bumpVersion");
async function listMods(env) {
  const entries = await listRepoDir(env, MODS_DIR);
  return entries.filter((e) => e.name.toLowerCase().endsWith(".jar")).map((e) => ({ name: e.name, size: e.size, mtime: null }));
}
__name(listMods, "listMods");
__name2(listMods, "listMods");
__name22(listMods, "listMods");
__name222(listMods, "listMods");
__name2222(listMods, "listMods");
__name22222(listMods, "listMods");
async function putMod(env, name, data, size) {
  const toR2 = new Uint8Array(data.slice(0));
  const toGit = new Uint8Array(data.slice(0));
  await env.MODS_R2.put(name, toR2);
  try {
    await writeRepoFile(env, `${MODS_DIR}/${name}`, toGit, `\u4E0A\u4F20\u6A21\u7EC4 ${name}`);
  } catch (e) {
    throw e;
  }
  await env.MODS_R2.delete(name).catch(() => {
  });
  return { name, size, mtime: null };
}
__name(putMod, "putMod");
__name2(putMod, "putMod");
__name22(putMod, "putMod");
__name222(putMod, "putMod");
__name2222(putMod, "putMod");
__name22222(putMod, "putMod");
async function removeMod(env, name) {
  await deleteRepoFile(env, `${MODS_DIR}/${name}`, `\u5220\u9664\u6A21\u7EC4 ${name}`);
}
__name(removeMod, "removeMod");
__name2(removeMod, "removeMod");
__name22(removeMod, "removeMod");
__name222(removeMod, "removeMod");
__name2222(removeMod, "removeMod");
__name22222(removeMod, "removeMod");
async function renameMod(env, oldName, newName) {
  const raw = await readRepoFile(env, `${MODS_DIR}/${oldName}`);
  await writeRepoFile(env, `${MODS_DIR}/${newName}`, raw, `\u91CD\u547D\u540D\u6A21\u7EC4 ${oldName} \u2192 ${newName}`);
  await deleteRepoFile(env, `${MODS_DIR}/${oldName}`, `\u91CD\u547D\u540D\u6A21\u7EC4 ${oldName} \u2192 ${newName}`);
}
__name(renameMod, "renameMod");
__name2(renameMod, "renameMod");
__name22(renameMod, "renameMod");
__name222(renameMod, "renameMod");
__name2222(renameMod, "renameMod");
__name22222(renameMod, "renameMod");
async function readUpdater(env) {
  try {
    return await readRepoFile(env, UPDATER_PATH);
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}
__name(readUpdater, "readUpdater");
__name2(readUpdater, "readUpdater");
__name22(readUpdater, "readUpdater");
__name222(readUpdater, "readUpdater");
__name2222(readUpdater, "readUpdater");
__name22222(readUpdater, "readUpdater");
async function createSession(env, user) {
  const rnd = /* @__PURE__ */ __name22222(() => crypto.randomUUID().replace(/-/g, ""), "rnd");
  const token = rnd() + rnd();
  const ttlHours = parseInt(env.SESSION_TTL_HOURS || "168", 10);
  const session = { login: user.login, name: user.name || user.login, role: user.role || null, avatar_url: user.avatar_url };
  await env.MODS_KV.put(`session:${token}`, JSON.stringify(session), { expirationTtl: ttlHours * 3600 });
  return token;
}
__name(createSession, "createSession");
__name2(createSession, "createSession");
__name22(createSession, "createSession");
__name222(createSession, "createSession");
__name2222(createSession, "createSession");
__name22222(createSession, "createSession");
async function getSession(env, token) {
  if (!token) return null;
  const raw = await env.MODS_KV.get(`session:${token}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}
__name(getSession, "getSession");
__name2(getSession, "getSession");
__name22(getSession, "getSession");
__name222(getSession, "getSession");
__name2222(getSession, "getSession");
__name22222(getSession, "getSession");
async function deleteSession(env, token) {
  if (token) await env.MODS_KV.delete(`session:${token}`);
}
__name(deleteSession, "deleteSession");
__name2(deleteSession, "deleteSession");
__name22(deleteSession, "deleteSession");
__name222(deleteSession, "deleteSession");
__name2222(deleteSession, "deleteSession");
__name22222(deleteSession, "deleteSession");
var ADMIN_USERS_KEY = "admin:users";
var ROLE_SUPER = "superadmin";
var ROLE_ADMIN = "admin";
function bytesToB64(u8arr) {
  let bin = "";
  for (let i2 = 0; i2 < u8arr.length; i2++) bin += String.fromCharCode(u8arr[i2]);
  return btoa(bin);
}
__name(bytesToB64, "bytesToB64");
__name2(bytesToB64, "bytesToB64");
__name22(bytesToB64, "bytesToB64");
__name222(bytesToB64, "bytesToB64");
__name2222(bytesToB64, "bytesToB64");
__name22222(bytesToB64, "bytesToB64");
function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i2 = 0; i2 < bin.length; i2++) out[i2] = bin.charCodeAt(i2);
  return out;
}
__name(b64ToBytes, "b64ToBytes");
__name2(b64ToBytes, "b64ToBytes");
__name22(b64ToBytes, "b64ToBytes");
__name222(b64ToBytes, "b64ToBytes");
__name2222(b64ToBytes, "b64ToBytes");
__name22222(b64ToBytes, "b64ToBytes");
async function hashPassword(password) {
  const iterations = 1e5;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits2 = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return `pbkdf2$${iterations}$${bytesToB64(salt)}$${bytesToB64(new Uint8Array(bits2))}`;
}
__name(hashPassword, "hashPassword");
__name2(hashPassword, "hashPassword");
__name22(hashPassword, "hashPassword");
__name222(hashPassword, "hashPassword");
__name2222(hashPassword, "hashPassword");
__name22222(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  try {
    const parts = String(stored || "").split("$");
    if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
    const iterations = parseInt(parts[1], 10) || 1e5;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits2 = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: b64ToBytes(parts[2]), iterations },
      key,
      256
    );
    return bytesToB64(new Uint8Array(bits2)) === parts[3];
  } catch (_) {
    return false;
  }
}
__name(verifyPassword, "verifyPassword");
__name2(verifyPassword, "verifyPassword");
__name22(verifyPassword, "verifyPassword");
__name222(verifyPassword, "verifyPassword");
__name2222(verifyPassword, "verifyPassword");
__name22222(verifyPassword, "verifyPassword");
async function readAdminUsers(env) {
  const raw = await env.MODS_KV.get(ADMIN_USERS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}
__name(readAdminUsers, "readAdminUsers");
__name2(readAdminUsers, "readAdminUsers");
__name22(readAdminUsers, "readAdminUsers");
__name222(readAdminUsers, "readAdminUsers");
__name2222(readAdminUsers, "readAdminUsers");
__name22222(readAdminUsers, "readAdminUsers");
async function writeAdminUsers(env, users) {
  await env.MODS_KV.put(ADMIN_USERS_KEY, JSON.stringify(users));
}
__name(writeAdminUsers, "writeAdminUsers");
__name2(writeAdminUsers, "writeAdminUsers");
__name22(writeAdminUsers, "writeAdminUsers");
__name222(writeAdminUsers, "writeAdminUsers");
__name2222(writeAdminUsers, "writeAdminUsers");
__name22222(writeAdminUsers, "writeAdminUsers");
async function ensureAdminUsers(env) {
  const users = await readAdminUsers(env);
  if (users && Object.keys(users).length) return users;
  const initPass = env.ADMIN_INIT_PASSWORD || "admin123";
  const next = {
    maoxinhe: {
      name: "maoxinhe",
      role: ROLE_SUPER,
      passwordHash: await hashPassword(initPass),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  };
  await writeAdminUsers(env, next);
  return next;
}
__name(ensureAdminUsers, "ensureAdminUsers");
__name2(ensureAdminUsers, "ensureAdminUsers");
__name22(ensureAdminUsers, "ensureAdminUsers");
__name222(ensureAdminUsers, "ensureAdminUsers");
__name2222(ensureAdminUsers, "ensureAdminUsers");
__name22222(ensureAdminUsers, "ensureAdminUsers");
async function getAdminUser(env, login) {
  const users = await ensureAdminUsers(env);
  return users[login] || null;
}
__name(getAdminUser, "getAdminUser");
__name2(getAdminUser, "getAdminUser");
__name22(getAdminUser, "getAdminUser");
__name222(getAdminUser, "getAdminUser");
__name2222(getAdminUser, "getAdminUser");
__name22222(getAdminUser, "getAdminUser");
async function getAdminRole(env, login) {
  if (!login) return null;
  const users = await ensureAdminUsers(env);
  if (users[login]) return users[login].role;
  if (env.ADMIN_LOGIN && login === env.ADMIN_LOGIN) return ROLE_SUPER;
  return null;
}
__name(getAdminRole, "getAdminRole");
__name2(getAdminRole, "getAdminRole");
__name22(getAdminRole, "getAdminRole");
__name222(getAdminRole, "getAdminRole");
__name2222(getAdminRole, "getAdminRole");
__name22222(getAdminRole, "getAdminRole");
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = /* @__PURE__ */ __name22222(function(eb, start) {
  var b = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new i32(b[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = j - b[i2] << 5 | i2;
    }
  }
  return { b, r };
}, "freb");
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = /* @__PURE__ */ __name22222((function(cd, mb, r) {
  var s = cd.length;
  var i2 = 0;
  var l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd[i2])
      ++l[cd[i2] - 1];
  }
  var le = new u16(mb);
  for (i2 = 1; i2 < mb; ++i2) {
    le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        var sv = i2 << 4 | cd[i2];
        var r_1 = mb - cd[i2];
        var v = le[cd[i2] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
      }
    }
  }
  return co;
}), "hMap");
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flm = /* @__PURE__ */ hMap(flt, 9, 0);
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = /* @__PURE__ */ __name22222(function(a) {
  var m = a[0];
  for (var i2 = 1; i2 < a.length; ++i2) {
    if (a[i2] > m)
      m = a[i2];
  }
  return m;
}, "max");
var bits = /* @__PURE__ */ __name22222(function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
}, "bits");
var bits16 = /* @__PURE__ */ __name22222(function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
}, "bits16");
var shft = /* @__PURE__ */ __name22222(function(p) {
  return (p + 7) / 8 | 0;
}, "shft");
var slc = /* @__PURE__ */ __name22222(function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
}, "slc");
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = /* @__PURE__ */ __name22222(function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
}, "err");
var inflt = /* @__PURE__ */ __name22222(function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = /* @__PURE__ */ __name22222(function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  }, "cbuf");
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i2 = 0; i2 < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i2++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i2++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i2 = sym - 257, b = fleb[i2];
          add = bits(dat, pos, (1 << b) - 1) + fl[i2];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
}, "inflt");
var wbits = /* @__PURE__ */ __name22222(function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
}, "wbits");
var wbits16 = /* @__PURE__ */ __name22222(function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
  d[o + 2] |= v >> 16;
}, "wbits16");
var hTree = /* @__PURE__ */ __name22222(function(d, mb) {
  var t = [];
  for (var i2 = 0; i2 < d.length; ++i2) {
    if (d[i2])
      t.push({ s: i2, f: d[i2] });
  }
  var s = t.length;
  var t2 = t.slice();
  if (!s)
    return { t: et, l: 0 };
  if (s == 1) {
    var v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return { t: v, l: 1 };
  }
  t.sort(function(a, b) {
    return a.f - b.f;
  });
  t.push({ s: -1, f: 25001 });
  var l = t[0], r = t[1], i0 = 0, i1 = 1, i22 = 2;
  t[0] = { s: -1, f: l.f + r.f, l, r };
  while (i1 != s - 1) {
    l = t[t[i0].f < t[i22].f ? i0++ : i22++];
    r = t[i0 != i1 && t[i0].f < t[i22].f ? i0++ : i22++];
    t[i1++] = { s: -1, f: l.f + r.f, l, r };
  }
  var maxSym = t2[0].s;
  for (var i2 = 1; i2 < s; ++i2) {
    if (t2[i2].s > maxSym)
      maxSym = t2[i2].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i2 = 0, dt = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t2.sort(function(a, b) {
      return tr[b.s] - tr[a.s] || a.f - b.f;
    });
    for (; i2 < s; ++i2) {
      var i2_1 = t2[i2].s;
      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t2[i2].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i2;
    }
    for (; i2 >= 0 && dt; --i2) {
      var i2_3 = t2[i2].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
}, "hTree");
var ln = /* @__PURE__ */ __name22222(function(n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
}, "ln");
var lc = /* @__PURE__ */ __name22222(function(c) {
  var s = c.length;
  while (s && !c[--s])
    ;
  var cl = new u16(++s);
  var cli = 0, cln = c[0], cls = 1;
  var w = /* @__PURE__ */ __name22222(function(v) {
    cl[cli++] = v;
  }, "w");
  for (var i2 = 1; i2 <= s; ++i2) {
    if (c[i2] == cln && i2 != s)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w(32754);
        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;
        for (; cls > 6; cls -= 6)
          w(8304);
        if (cls > 2)
          w(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w(cln);
      cls = 1;
      cln = c[i2];
    }
  }
  return { c: cl.subarray(0, cli), n: s };
}, "lc");
var clen = /* @__PURE__ */ __name22222(function(cf, cl) {
  var l = 0;
  for (var i2 = 0; i2 < cl.length; ++i2)
    l += cf[i2] * cl[i2];
  return l;
}, "clen");
var wfblk = /* @__PURE__ */ __name22222(function(out, pos, dat) {
  var s = dat.length;
  var o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;
  for (var i2 = 0; i2 < s; ++i2)
    out[o + i2 + 4] = dat[i2];
  return (o + 4 + s) * 8;
}, "wfblk");
var wblk = /* @__PURE__ */ __name22222(function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i2 = 0; i2 < lclt.length; ++i2)
    ++lcfreq[lclt[i2] & 31];
  for (var i2 = 0; i2 < lcdt.length; ++i2)
    ++lcfreq[lcdt[i2] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;
    for (var i2 = 0; i2 < nlcc; ++i2)
      wbits(out, p + 3 * i2, lct[clim[i2]]);
    p += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];
      for (var i2 = 0; i2 < clct.length; ++i2) {
        var len = clct[i2] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15)
          wbits(out, p, clct[i2] >> 5 & 127), p += clct[i2] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i2 = 0; i2 < li; ++i2) {
    var sym = syms[i2];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7)
        wbits(out, p, sym >> 23 & 31), p += fleb[len];
      var dst = sym & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3)
        wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[sym]), p += ll[sym];
    }
  }
  wbits16(out, p, lm[256]);
  return p + ll[256];
}, "wblk");
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et = /* @__PURE__ */ new u8(0);
var dflt = /* @__PURE__ */ __name22222(function(dat, lvl, plvl, pre, post, st) {
  var s = st.z || dat.length;
  var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
  var w = o.subarray(pre, o.length - post);
  var lst = st.l;
  var pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w[0] = st.r >> 3;
    var opt = deo[lvl - 1];
    var n = opt >> 13, c = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = /* @__PURE__ */ __name22222(function(i3) {
      return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
    }, "hsh");
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i2 = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (; i2 + 2 < s; ++i2) {
      var hv = hsh(i2);
      var imod = i2 & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i2) {
        var rem = s - i2;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
          li = lc_1 = eb = 0, bs = i2;
          for (var j = 0; j < 286; ++j)
            lf[j] = 0;
          for (var j = 0; j < 30; ++j)
            df[j] = 0;
        }
        var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i2 - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i2);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i2 + l] == dat[i2 + l - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                ;
              if (nl > l) {
                l = nl, d = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j = 0; j < mmd; ++j) {
                  var ti = i2 - dif + j & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d) {
          syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
          var lin = revfl[l] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i2 + l;
          ++lc_1;
        } else {
          syms[li++] = dat[i2];
          ++lf[dat[i2]];
        }
      }
    }
    for (i2 = Math.max(i2, wi); i2 < s; ++i2) {
      syms[li++] = dat[i2];
      ++lf[dat[i2]];
    }
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
    if (!lst) {
      st.r = pos & 7 | w[pos / 8 | 0] << 3;
      pos -= 7;
      st.h = head, st.p = prev, st.i = i2, st.w = wi;
    }
  } else {
    for (var i2 = st.w || 0; i2 < s + lst; i2 += 65535) {
      var e = i2 + 65535;
      if (e >= s) {
        w[pos / 8 | 0] = lst;
        e = s;
      }
      pos = wfblk(w, pos + 1, dat.subarray(i2, e));
    }
    st.i = s;
  }
  return slc(o, 0, pre + shft(pos) + post);
}, "dflt");
var crct = /* @__PURE__ */ (function() {
  var t = new Int32Array(256);
  for (var i2 = 0; i2 < 256; ++i2) {
    var c = i2, k = 9;
    while (--k)
      c = (c & 1 && -306674912) ^ c >>> 1;
    t[i2] = c;
  }
  return t;
})();
var crc = /* @__PURE__ */ __name22222(function() {
  var c = -1;
  return {
    p: /* @__PURE__ */ __name22222(function(d) {
      var cr = c;
      for (var i2 = 0; i2 < d.length; ++i2)
        cr = crct[cr & 255 ^ d[i2]] ^ cr >>> 8;
      c = cr;
    }, "p"),
    d: /* @__PURE__ */ __name22222(function() {
      return ~c;
    }, "d")
  };
}, "crc");
var dopt = /* @__PURE__ */ __name22222(function(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
}, "dopt");
var mrg = /* @__PURE__ */ __name22222(function(a, b) {
  var o = {};
  for (var k in a)
    o[k] = a[k];
  for (var k in b)
    o[k] = b[k];
  return o;
}, "mrg");
var b2 = /* @__PURE__ */ __name22222(function(d, b) {
  return d[b] | d[b + 1] << 8;
}, "b2");
var b4 = /* @__PURE__ */ __name22222(function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
}, "b4");
var b8 = /* @__PURE__ */ __name22222(function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
}, "b8");
var wbytes = /* @__PURE__ */ __name22222(function(d, b, v) {
  for (; v; ++b)
    d[b] = v, v >>>= 8;
}, "wbytes");
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
__name(deflateSync, "deflateSync");
__name2(deflateSync, "deflateSync");
__name22(deflateSync, "deflateSync");
__name222(deflateSync, "deflateSync");
__name2222(deflateSync, "deflateSync");
__name22222(deflateSync, "deflateSync");
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
__name(inflateSync, "inflateSync");
__name2(inflateSync, "inflateSync");
__name22(inflateSync, "inflateSync");
__name222(inflateSync, "inflateSync");
__name2222(inflateSync, "inflateSync");
__name22222(inflateSync, "inflateSync");
var fltn = /* @__PURE__ */ __name22222(function(d, p, t, o) {
  for (var k in d) {
    var val = d[k], n = p + k, op = o;
    if (Array.isArray(val))
      op = mrg(o, val[1]), val = val[0];
    if (ArrayBuffer.isView(val))
      t[n] = [val, op];
    else {
      t[n += "/"] = [new u8(0), op];
      fltn(val, n, t, o);
    }
  }
}, "fltn");
var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = /* @__PURE__ */ __name22222(function(d) {
  for (var r = "", i2 = 0; ; ) {
    var c = d[i2++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i2 + eb > d.length)
      return { s: r, r: slc(d, i2 - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
  }
}, "dutf8");
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i2 = 0; i2 < str.length; ++i2)
      ar_1[i2] = str.charCodeAt(i2);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w = /* @__PURE__ */ __name22222(function(v) {
    ar[ai++] = v;
  }, "w");
  for (var i2 = 0; i2 < l; ++i2) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i2 << 1));
      n.set(ar);
      ar = n;
    }
    var c = str.charCodeAt(i2);
    if (c < 128 || latin1)
      w(c);
    else if (c < 2048)
      w(192 | c >> 6), w(128 | c & 63);
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i2) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
    else
      w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
  }
  return slc(ar, 0, ai);
}
__name(strToU8, "strToU8");
__name2(strToU8, "strToU8");
__name22(strToU8, "strToU8");
__name222(strToU8, "strToU8");
__name2222(strToU8, "strToU8");
__name22222(strToU8, "strToU8");
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i2 = 0; i2 < dat.length; i2 += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
__name(strFromU8, "strFromU8");
__name2(strFromU8, "strFromU8");
__name22(strFromU8, "strFromU8");
__name222(strFromU8, "strFromU8");
__name2222(strFromU8, "strFromU8");
__name22222(strFromU8, "strFromU8");
var slzh = /* @__PURE__ */ __name22222(function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
}, "slzh");
var zh = /* @__PURE__ */ __name22222(function(d, b, z) {
  var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
  var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
}, "zh");
var z64hs = /* @__PURE__ */ __name22222(function(d, b, l, z, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
  var nf = nsc + nsu + noff;
  if (z && nf) {
    for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
      if (b2(d, b) == 1) {
        return [
          nsc ? b8(d, b + 4 + 8 * nsu) : sc,
          nsu ? b8(d, b + 4) : su,
          noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z < 2)
      err(13);
  }
  return [sc, su, off, 0];
}, "z64hs");
var exfl = /* @__PURE__ */ __name22222(function(ex) {
  var le = 0;
  if (ex) {
    for (var k in ex) {
      var l = ex[k].length;
      if (l > 65535)
        err(9);
      le += l + 4;
    }
  }
  return le;
}, "exfl");
var wzh = /* @__PURE__ */ __name22222(function(d, b, f, fn, u, c, ce, co) {
  var fl2 = fn.length, ex = f.extra, col = co && co.length;
  var exl = exfl(ex);
  wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
  if (ce != null)
    d[b++] = 20, d[b++] = f.os;
  d[b] = 20, b += 2;
  d[b++] = f.flag << 1 | (c < 0 && 8), d[b++] = u && 8;
  d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
  var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119)
    err(10);
  wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
  if (c != -1) {
    wbytes(d, b, f.crc);
    wbytes(d, b + 4, c < 0 ? -c - 2 : c);
    wbytes(d, b + 8, f.size);
  }
  wbytes(d, b + 12, fl2);
  wbytes(d, b + 14, exl), b += 16;
  if (ce != null) {
    wbytes(d, b, col);
    wbytes(d, b + 6, f.attrs);
    wbytes(d, b + 10, ce), b += 14;
  }
  d.set(fn, b);
  b += fl2;
  if (exl) {
    for (var k in ex) {
      var exf = ex[k], l = exf.length;
      wbytes(d, b, +k);
      wbytes(d, b + 2, l);
      d.set(exf, b + 4), b += 4 + l;
    }
  }
  if (col)
    d.set(co, b), b += col;
  return b;
}, "wzh");
var wzf = /* @__PURE__ */ __name22222(function(o, b, c, d, e) {
  wbytes(o, b, 101010256);
  wbytes(o, b + 8, c);
  wbytes(o, b + 10, c);
  wbytes(o, b + 12, d);
  wbytes(o, b + 16, e);
}, "wzf");
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r = {};
  var files = [];
  fltn(data, "", r, opts);
  var o = 0;
  var tot = 0;
  for (var fn in r) {
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var compression = p.level == 0 ? 0 : 8;
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    if (s > 65535)
      err(11);
    var d = compression ? deflateSync(file, p) : file, l = d.length;
    var c = crc();
    c.p(file);
    files.push(mrg(p, {
      size: file.length,
      crc: c.d(),
      c: d,
      f,
      m,
      u: s != fn.length || m && com.length != ms,
      o,
      compression
    }));
    o += 30 + s + exl + l;
    tot += 76 + 2 * (s + exl) + (ms || 0) + l;
  }
  var out = new u8(tot + 22), oe = o, cdl = tot - o;
  for (var i2 = 0; i2 < files.length; ++i2) {
    var f = files[i2];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd);
    wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
  }
  wzf(out, o, files.length, cdl, oe);
  return out;
}
__name(zipSync, "zipSync");
__name2(zipSync, "zipSync");
__name22(zipSync, "zipSync");
__name222(zipSync, "zipSync");
__name2222(zipSync, "zipSync");
__name22222(zipSync, "zipSync");
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = b4(data, e - 20) == 117853008;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i2 = 0; i2 < c; ++i2) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}
__name(unzipSync, "unzipSync");
__name2(unzipSync, "unzipSync");
__name22(unzipSync, "unzipSync");
__name222(unzipSync, "unzipSync");
__name2222(unzipSync, "unzipSync");
__name22222(unzipSync, "unzipSync");
async function publish(env, message = "") {
  const mods = await listMods(env);
  if (mods.length === 0) {
    const err2 = new Error("mods \u4E2D\u6CA1\u6709\u6A21\u7EC4\uFF0C\u65E0\u6CD5\u53D1\u5E03");
    err2.status = 400;
    throw err2;
  }
  const state = await readState(env);
  const version = bumpVersion(state.currentVersion);
  const tag = `v${version}`;
  const files = {};
  for (const m of mods) {
    try {
      files[m.name] = await readRepoFile(env, `mods/${m.name}`);
    } catch (_) {
    }
  }
  if (Object.keys(files).length === 0) {
    const err2 = new Error("\u4ECE GitHub \u4ED3\u5E93\u8BFB\u53D6\u6A21\u7EC4\u5931\u8D25\uFF0C\u65E0\u6CD5\u53D1\u5E03");
    err2.status = 400;
    throw err2;
  }
  const zipped = zipSync(files, { level: 0 });
  let release = null;
  try {
    const modsList = mods.filter((m) => files[m.name]).map((f) => `- \`${f.name}\` (${(f.size / 1024).toFixed(1)} KB)`).join("\n");
    const notes = `## \u68A6\u4E4B\u97F5\u6A21\u7EC4\u5305 v${version}

\u5171 ${Object.keys(files).length} \u4E2A\u6A21\u7EC4\uFF1A

${modsList}

${message ? `> ${message}` : ""}

> \u7531\u68A6\u4E4B\u97F5\u6A21\u7EC4\u53D1\u5E03\u7CFB\u7EDF\u81EA\u52A8\u6253\u5305\u751F\u6210\u3002`;
    release = await createRelease(env, tag, `\u68A6\u4E4B\u97F5\u6A21\u7EC4\u5305 v${version}`, notes);
    const asset = await uploadAsset(env, release.id, zipped, `mods-${version}.zip`);
    const fixedAsset = await uploadAsset(env, release.id, zipped, "modpack.zip");
    let updaterAsset = null;
    const updaterBuf = await readUpdater(env);
    if (updaterBuf) {
      const exe = await uploadAsset(env, release.id, updaterBuf, "mod-updater.exe", "application/octet-stream");
      updaterAsset = { name: exe.name, url: exe.browser_download_url, size: exe.size };
    }
    state.currentVersion = version;
    state.lastPublishAt = (/* @__PURE__ */ new Date()).toISOString();
    state.lastReleaseId = release.id;
    state.lastReleaseTag = tag;
    await writeState(env, state);
    return {
      version,
      tag,
      release: { id: release.id, url: release.html_url },
      asset: { name: asset.name, url: asset.browser_download_url, size: asset.size },
      fixedAsset: { name: fixedAsset.name, url: fixedAsset.browser_download_url, size: fixedAsset.size },
      updaterAsset,
      mods: Object.keys(files).map((n) => ({ name: n })),
      zipSize: zipped.byteLength
    };
  } catch (e) {
    if (release && release.id) {
      try {
        await deleteRelease(env, release.id);
      } catch (_) {
      }
      try {
        await deleteTag(env, tag);
      } catch (_) {
      }
    }
    throw e;
  }
}
__name(publish, "publish");
__name2(publish, "publish");
__name22(publish, "publish");
__name222(publish, "publish");
__name2222(publish, "publish");
__name22222(publish, "publish");
var SESSION_COOKIE = "mp_session";
var MIRROR_PROXIES = [
  { name: "GitHub \u6E90\u7AD9", prefix: "" },
  { name: "gh-proxy.com", prefix: "https://gh-proxy.com/" },
  { name: "gh.dpik.top", prefix: "https://gh.dpik.top/" },
  { name: "ghfast.top", prefix: "https://ghfast.top/" }
];
var DOWNLOAD_PATH = "/maoxinhe/modpack/releases/latest/download/modpack.zip";
async function testMirror(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12e3);
  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: { Range: "bytes=0-524287" },
      // 前 512KB
      redirect: "follow",
      signal: controller.signal
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    if (!res.body) throw new Error("\u65E0\u54CD\u5E94\u4F53");
    const reader = res.body.getReader();
    let total = 0;
    while (total < 524288) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
    }
    const ms = Date.now() - start;
    return { ok: true, time_ms: ms, speed_bps: ms > 0 ? Math.round(total * 1e3 / ms) : 0 };
  } catch (e) {
    return { ok: false, error: e.name === "AbortError" ? "\u8FDE\u63A5\u8D85\u65F6" : e.message };
  } finally {
    clearTimeout(timer);
  }
}
__name(testMirror, "testMirror");
__name2(testMirror, "testMirror");
__name22(testMirror, "testMirror");
__name222(testMirror, "testMirror");
__name2222(testMirror, "testMirror");
__name22222(testMirror, "testMirror");
async function handleMirrors(request) {
  const base = "https://github.com" + DOWNLOAD_PATH;
  const list = MIRROR_PROXIES.map((p) => ({ name: p.name, url: p.prefix + base }));
  if (new URL(request.url).searchParams.get("test") === "1") {
    const results = await Promise.all(list.map(async (m) => ({ ...m, ...await testMirror(m.url) })));
    return json({ mirrors: results });
  }
  return json({ mirrors: list });
}
__name(handleMirrors, "handleMirrors");
__name2(handleMirrors, "handleMirrors");
__name22(handleMirrors, "handleMirrors");
__name222(handleMirrors, "handleMirrors");
__name2222(handleMirrors, "handleMirrors");
__name22222(handleMirrors, "handleMirrors");
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders }
  });
}
__name(json, "json");
__name2(json, "json");
__name22(json, "json");
__name222(json, "json");
__name2222(json, "json");
__name22222(json, "json");
function text(msg, status = 400) {
  return new Response(String(msg), { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
__name(text, "text");
__name2(text, "text");
__name22(text, "text");
__name222(text, "text");
__name2222(text, "text");
__name22222(text, "text");
function getSessionToken(request) {
  const cookie = request.headers.get("Cookie") || "";
  for (const part of cookie.split(";")) {
    const i2 = part.indexOf("=");
    if (i2 < 0) continue;
    const k = part.slice(0, i2).trim();
    const v = part.slice(i2 + 1).trim();
    if (k === SESSION_COOKIE) return decodeURIComponent(v);
  }
  return null;
}
__name(getSessionToken, "getSessionToken");
__name2(getSessionToken, "getSessionToken");
__name22(getSessionToken, "getSessionToken");
__name222(getSessionToken, "getSessionToken");
__name2222(getSessionToken, "getSessionToken");
__name22222(getSessionToken, "getSessionToken");
function sessionCookie(token) {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}
__name(sessionCookie, "sessionCookie");
__name2(sessionCookie, "sessionCookie");
__name22(sessionCookie, "sessionCookie");
__name222(sessionCookie, "sessionCookie");
__name2222(sessionCookie, "sessionCookie");
__name22222(sessionCookie, "sessionCookie");
function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
__name(clearSessionCookie, "clearSessionCookie");
__name2(clearSessionCookie, "clearSessionCookie");
__name22(clearSessionCookie, "clearSessionCookie");
__name222(clearSessionCookie, "clearSessionCookie");
__name2222(clearSessionCookie, "clearSessionCookie");
__name22222(clearSessionCookie, "clearSessionCookie");
async function isAdmin(request, env) {
  const devToken = request.headers.get("X-Dev-Token");
  if (env.DEV_AUTH_TOKEN && devToken === env.DEV_AUTH_TOKEN) return true;
  const session = await getSession(env, getSessionToken(request));
  if (!session) return false;
  const role = await getAdminRole(env, session.login);
  return role === ROLE_SUPER || role === ROLE_ADMIN;
}
__name(isAdmin, "isAdmin");
__name2(isAdmin, "isAdmin");
__name22(isAdmin, "isAdmin");
__name222(isAdmin, "isAdmin");
__name2222(isAdmin, "isAdmin");
__name22222(isAdmin, "isAdmin");
async function requireAdmin(request, env) {
  if (await isAdmin(request, env)) return null;
  return json({ error: "\u9700\u8981\u7BA1\u7406\u5458\u6743\u9650" }, 403);
}
__name(requireAdmin, "requireAdmin");
__name2(requireAdmin, "requireAdmin");
__name22(requireAdmin, "requireAdmin");
__name222(requireAdmin, "requireAdmin");
__name2222(requireAdmin, "requireAdmin");
__name22222(requireAdmin, "requireAdmin");
function getBearerToken(request) {
  const h = String(request.headers.get("Authorization") || "");
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}
__name(getBearerToken, "getBearerToken");
__name2(getBearerToken, "getBearerToken");
__name22(getBearerToken, "getBearerToken");
__name222(getBearerToken, "getBearerToken");
__name2222(getBearerToken, "getBearerToken");
__name22222(getBearerToken, "getBearerToken");
async function isValidApiToken(env, token) {
  if (!token) return false;
  const id = await env.MODS_KV.get(`api:token:secret:${token}`);
  if (!id) return false;
  return Boolean(await env.MODS_KV.get(`api:token:${id}`));
}
__name(isValidApiToken, "isValidApiToken");
__name2(isValidApiToken, "isValidApiToken");
__name22(isValidApiToken, "isValidApiToken");
__name222(isValidApiToken, "isValidApiToken");
__name2222(isValidApiToken, "isValidApiToken");
__name22222(isValidApiToken, "isValidApiToken");
async function requireAdminOrToken(request, env) {
  const bearer = getBearerToken(request);
  if (bearer && await isValidApiToken(env, bearer)) return null;
  return requireAdmin(request, env);
}
__name(requireAdminOrToken, "requireAdminOrToken");
__name2(requireAdminOrToken, "requireAdminOrToken");
__name22(requireAdminOrToken, "requireAdminOrToken");
__name222(requireAdminOrToken, "requireAdminOrToken");
__name2222(requireAdminOrToken, "requireAdminOrToken");
__name22222(requireAdminOrToken, "requireAdminOrToken");
async function currentAdmin(request, env) {
  const session = await getSession(env, getSessionToken(request));
  if (!session) return { session: null, role: null };
  return { session, role: await getAdminRole(env, session.login) };
}
__name(currentAdmin, "currentAdmin");
__name2(currentAdmin, "currentAdmin");
__name22(currentAdmin, "currentAdmin");
__name222(currentAdmin, "currentAdmin");
__name2222(currentAdmin, "currentAdmin");
__name22222(currentAdmin, "currentAdmin");
async function tryPublish(env) {
  try {
    return await publish(env);
  } catch (e) {
    console.error("[publish-error]", e.message, e.data ? "| " + JSON.stringify(e.data).slice(0, 300) : "");
    return { error: e.message };
  }
}
__name(tryPublish, "tryPublish");
__name2(tryPublish, "tryPublish");
__name22(tryPublish, "tryPublish");
__name222(tryPublish, "tryPublish");
__name2222(tryPublish, "tryPublish");
__name22222(tryPublish, "tryPublish");
function safeNext(raw) {
  if (raw && typeof raw === "string" && /^\/[^/].*/.test(raw)) return raw;
  return "/admin.html";
}
__name(safeNext, "safeNext");
__name2(safeNext, "safeNext");
__name22(safeNext, "safeNext");
async function handleLogin(request, env) {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return text("\u5C1A\u672A\u914D\u7F6E GitHub OAuth\uFF08GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET\uFF09\uFF0C\u8BF7\u7528 wrangler secret \u914D\u7F6E\u540E\u91CD\u8BD5", 400);
  }
  const next = safeNext(new URL(request.url).searchParams.get("next"));
  const token = randomHex(16);
  await env.MODS_KV.put(`oauth:n:${token}`, next, { expirationTtl: 600 });
  const redirectUri = `${env.BASE_URL || "https://modpack-release.catkinr-93f.workers.dev"}/auth/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(env.GITHUB_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user&state=l:${token}`;
  return Response.redirect(url, 302);
}
__name(handleLogin, "handleLogin");
__name2(handleLogin, "handleLogin");
__name22(handleLogin, "handleLogin");
__name222(handleLogin, "handleLogin");
__name2222(handleLogin, "handleLogin");
__name22222(handleLogin, "handleLogin");
async function handleCallback(request, env) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state") || "modpack";
    if (!code) return text("\u7F3A\u5C11\u6388\u6743\u7801", 400);
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return oauthResultPage("GitHub \u6388\u6743\u5931\u8D25", `${tokenData.error_description || tokenData.error || "unknown"}`, false);
    }
    const user = await getUser(env, tokenData.access_token);
    if (state === "bind") {
      const { session } = await currentAdmin(request, env);
      if (!session) {
        return oauthResultPage("\u7ED1\u5B9A\u5931\u8D25", "\u767B\u5F55\u72B6\u6001\u5DF2\u5931\u6548\uFF0C\u8BF7\u5148\u767B\u5F55\u7BA1\u7406\u540E\u53F0\u540E\u518D\u7ED1\u5B9A GitHub\u3002", false, "/auth/login");
      }
      const users2 = await ensureAdminUsers(env);
      const existing = findLoginByOAuth(users2, "github", user.login);
      if (existing && existing !== session.login) {
        return oauthResultPage("\u7ED1\u5B9A\u5931\u8D25", `\u8BE5 GitHub \u8D26\u53F7\uFF08${user.login}\uFF09\u5DF2\u7ED1\u5B9A\u5230\u8D26\u53F7 ${existing}\u3002`, false, "/admin.html#/admin/profile");
      }
      users2[session.login].oauth = users2[session.login].oauth || {};
      users2[session.login].oauth.github = { login: user.login, name: user.name || user.login, boundAt: (/* @__PURE__ */ new Date()).toISOString() };
      await writeAdminUsers(env, users2);
      return new Response(null, { status: 302, headers: { Location: "/admin.html#/admin/profile?oauth=github&status=bound" } });
    }
    const users = await ensureAdminUsers(env);
    let login = null;
    const legacyRole = await getAdminRole(env, user.login);
    if (legacyRole) login = user.login;
    if (!login) login = findLoginByOAuth(users, "github", user.login);
    if (!login) {
      return oauthResultPage("\u767B\u5F55\u5931\u8D25", `GitHub \u8D26\u53F7 ${user.login} \u672A\u7ED1\u5B9A\u4EFB\u4F55\u7BA1\u7406\u5458\u8D26\u53F7\u3002<br>\u8BF7\u5148\u7528\u8D26\u53F7\u5BC6\u7801\u767B\u5F55\uFF0C\u5728\u300C\u4E2A\u4EBA\u4E2D\u5FC3 \u2192 OAuth \u7ED1\u5B9A\u300D\u4E2D\u7ED1\u5B9A\u540E\u518D\u4F7F\u7528 GitHub \u767B\u5F55\u3002`, false);
    }
    const admin = users[login];
    const role = admin.role;
    const sessionToken = await createSession(env, { login, name: admin.name || login, role, avatar_url: user.avatar_url });
    let next = "/admin.html";
    if (state.startsWith("l:")) {
      const t = state.slice(2);
      const stored = await env.MODS_KV.get(`oauth:n:${t}`);
      if (stored) next = safeNext(stored);
      await env.MODS_KV.delete(`oauth:n:${t}`).catch(() => {
      });
    }
    return new Response(null, {
      status: 302,
      headers: { Location: next, "Set-Cookie": sessionCookie(sessionToken) }
    });
  } catch (e) {
    return oauthResultPage("\u767B\u5F55\u5931\u8D25", e.message, false);
  }
}
__name(handleCallback, "handleCallback");
__name2(handleCallback, "handleCallback");
__name22(handleCallback, "handleCallback");
__name222(handleCallback, "handleCallback");
__name2222(handleCallback, "handleCallback");
__name22222(handleCallback, "handleCallback");
async function handlePasswordLogin(request, env) {
  try {
    const body = await request.json().catch(() => null);
    const username = String(body && body.username || "").trim();
    const password = String(body && body.password || "");
    if (!username || !password) return json({ error: "\u8BF7\u8F93\u5165\u8D26\u53F7\u548C\u5BC6\u7801" }, 400);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const failKey = `login:fail:${username}:${ip}`;
    const failCount = parseInt(await env.MODS_KV.get(failKey) || "0", 10);
    if (failCount >= 8) return json({ error: "\u5C1D\u8BD5\u5931\u8D25\u6B21\u6570\u8FC7\u591A\uFF0C\u8BF7 10 \u5206\u949F\u540E\u518D\u8BD5" }, 429);
    const user = await getAdminUser(env, username);
    if (!user || !await verifyPassword(password, user.passwordHash)) {
      await env.MODS_KV.put(failKey, String(failCount + 1), { expirationTtl: 600 });
      return json({ error: "\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF" }, 401);
    }
    await env.MODS_KV.delete(failKey);
    const token = await createSession(env, { login: username, name: user.name || username, role: user.role, avatar_url: null });
    return json(
      { ok: true, user: { login: username, name: user.name || username, role: user.role } },
      200,
      { "Set-Cookie": sessionCookie(token) }
    );
  } catch (e) {
    return json({ error: "\u767B\u5F55\u5931\u8D25\uFF1A" + e.message }, 500);
  }
}
__name(handlePasswordLogin, "handlePasswordLogin");
__name2(handlePasswordLogin, "handlePasswordLogin");
__name22(handlePasswordLogin, "handlePasswordLogin");
__name222(handlePasswordLogin, "handlePasswordLogin");
__name2222(handlePasswordLogin, "handlePasswordLogin");
__name22222(handlePasswordLogin, "handlePasswordLogin");
async function handleAdminUsersList(request, env) {
  const users = await ensureAdminUsers(env);
  const { session } = await currentAdmin(request, env);
  const me = session ? session.login : null;
  const list = Object.keys(users).map((login) => ({
    login,
    name: users[login].name || login,
    role: users[login].role,
    createdAt: users[login].createdAt,
    isSelf: login === me,
    oauth: oauthInfo(users[login])
  }));
  return json({ users: list, isSuper: me ? await getAdminRole(env, me) === ROLE_SUPER : false });
}
__name(handleAdminUsersList, "handleAdminUsersList");
__name2(handleAdminUsersList, "handleAdminUsersList");
__name22(handleAdminUsersList, "handleAdminUsersList");
__name222(handleAdminUsersList, "handleAdminUsersList");
__name2222(handleAdminUsersList, "handleAdminUsersList");
__name22222(handleAdminUsersList, "handleAdminUsersList");
async function handleAdminUsersCreate(request, env) {
  const { session, role: callerRole } = await currentAdmin(request, env);
  if (!session || callerRole !== ROLE_SUPER && callerRole !== ROLE_ADMIN) return json({ error: "\u6CA1\u6709\u6743\u9650" }, 403);
  const body = await request.json().catch(() => null);
  const username = String(body && body.username || "").trim();
  const name = String(body && body.name || "").trim() || username;
  const password = String(body && body.password || "");
  const role = body && body.role === ROLE_SUPER ? ROLE_SUPER : ROLE_ADMIN;
  if (!/^[A-Za-z0-9_\-]{2,32}$/.test(username)) return json({ error: "\u8D26\u53F7\u4EC5\u80FD\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u3001\u77ED\u6A2A\u7EBF\uFF082-32\u4F4D\uFF09" }, 400);
  if (password.length < 6) return json({ error: "\u5BC6\u7801\u81F3\u5C11 6 \u4F4D" }, 400);
  if (role === ROLE_SUPER && callerRole !== ROLE_SUPER) return json({ error: "\u53EA\u6709\u8D85\u7EA7\u7BA1\u7406\u5458\u53EF\u4EE5\u521B\u5EFA\u8D85\u7EA7\u7BA1\u7406\u5458" }, 403);
  const users = await ensureAdminUsers(env);
  if (users[username]) return json({ error: "\u8BE5\u8D26\u53F7\u5DF2\u5B58\u5728" }, 409);
  users[username] = { name, role, passwordHash: await hashPassword(password), createdAt: (/* @__PURE__ */ new Date()).toISOString() };
  await writeAdminUsers(env, users);
  return json({ ok: true, user: { login: username, name, role } });
}
__name(handleAdminUsersCreate, "handleAdminUsersCreate");
__name2(handleAdminUsersCreate, "handleAdminUsersCreate");
__name22(handleAdminUsersCreate, "handleAdminUsersCreate");
__name222(handleAdminUsersCreate, "handleAdminUsersCreate");
__name2222(handleAdminUsersCreate, "handleAdminUsersCreate");
__name22222(handleAdminUsersCreate, "handleAdminUsersCreate");
async function handleAdminUsersDelete(request, env, username) {
  const { session, role: callerRole } = await currentAdmin(request, env);
  if (!session || callerRole !== ROLE_SUPER && callerRole !== ROLE_ADMIN) return json({ error: "\u6CA1\u6709\u6743\u9650" }, 403);
  const users = await ensureAdminUsers(env);
  if (!users[username]) return json({ error: "\u8D26\u53F7\u4E0D\u5B58\u5728" }, 404);
  if (username === session.login) return json({ error: "\u4E0D\u80FD\u5220\u9664\u81EA\u5DF1\u7684\u8D26\u53F7" }, 400);
  if (users[username].role === ROLE_SUPER && callerRole !== ROLE_SUPER) return json({ error: "\u53EA\u6709\u8D85\u7EA7\u7BA1\u7406\u5458\u53EF\u4EE5\u5220\u9664\u8D85\u7EA7\u7BA1\u7406\u5458" }, 403);
  const superCount = Object.values(users).filter((u) => u.role === ROLE_SUPER).length;
  if (users[username].role === ROLE_SUPER && superCount <= 1) return json({ error: "\u4E0D\u80FD\u5220\u9664\u6700\u540E\u4E00\u4E2A\u8D85\u7EA7\u7BA1\u7406\u5458" }, 400);
  delete users[username];
  await writeAdminUsers(env, users);
  return json({ ok: true });
}
__name(handleAdminUsersDelete, "handleAdminUsersDelete");
__name2(handleAdminUsersDelete, "handleAdminUsersDelete");
__name22(handleAdminUsersDelete, "handleAdminUsersDelete");
__name222(handleAdminUsersDelete, "handleAdminUsersDelete");
__name2222(handleAdminUsersDelete, "handleAdminUsersDelete");
__name22222(handleAdminUsersDelete, "handleAdminUsersDelete");
async function handleAdminUserPassword(request, env, username) {
  const { session, role: callerRole } = await currentAdmin(request, env);
  if (!session || callerRole !== ROLE_SUPER && callerRole !== ROLE_ADMIN) return json({ error: "\u6CA1\u6709\u6743\u9650" }, 403);
  const body = await request.json().catch(() => null);
  const password = String(body && body.password || "");
  if (password.length < 6) return json({ error: "\u5BC6\u7801\u81F3\u5C11 6 \u4F4D" }, 400);
  if (username !== session.login && callerRole !== ROLE_SUPER) return json({ error: "\u53EA\u80FD\u4FEE\u6539\u81EA\u5DF1\u7684\u5BC6\u7801" }, 403);
  const users = await ensureAdminUsers(env);
  if (!users[username]) return json({ error: "\u8D26\u53F7\u4E0D\u5B58\u5728" }, 404);
  users[username].passwordHash = await hashPassword(password);
  await writeAdminUsers(env, users);
  return json({ ok: true });
}
__name(handleAdminUserPassword, "handleAdminUserPassword");
__name2(handleAdminUserPassword, "handleAdminUserPassword");
__name22(handleAdminUserPassword, "handleAdminUserPassword");
__name222(handleAdminUserPassword, "handleAdminUserPassword");
__name2222(handleAdminUserPassword, "handleAdminUserPassword");
__name22222(handleAdminUserPassword, "handleAdminUserPassword");
async function handleAdminUserRole(request, env, username) {
  const { session, role: callerRole } = await currentAdmin(request, env);
  if (!session || callerRole !== ROLE_SUPER) return json({ error: "\u53EA\u6709\u8D85\u7EA7\u7BA1\u7406\u5458\u53EF\u4EE5\u8C03\u6574\u89D2\u8272" }, 403);
  const body = await request.json().catch(() => null);
  const role = body && body.role === ROLE_SUPER ? ROLE_SUPER : ROLE_ADMIN;
  const users = await ensureAdminUsers(env);
  if (!users[username]) return json({ error: "\u8D26\u53F7\u4E0D\u5B58\u5728" }, 404);
  const superCount = Object.values(users).filter((u) => u.role === ROLE_SUPER).length;
  if (username === session.login && role !== ROLE_SUPER && superCount <= 1) return json({ error: "\u4E0D\u80FD\u964D\u7EA7\u6700\u540E\u4E00\u4E2A\u8D85\u7EA7\u7BA1\u7406\u5458" }, 400);
  users[username].role = role;
  await writeAdminUsers(env, users);
  return json({ ok: true, role });
}
__name(handleAdminUserRole, "handleAdminUserRole");
__name2(handleAdminUserRole, "handleAdminUserRole");
__name22(handleAdminUserRole, "handleAdminUserRole");
__name222(handleAdminUserRole, "handleAdminUserRole");
__name2222(handleAdminUserRole, "handleAdminUserRole");
__name22222(handleAdminUserRole, "handleAdminUserRole");
async function handleProfileUpdate(request, env) {
  const { session } = await currentAdmin(request, env);
  if (!session) return json({ error: "\u672A\u767B\u5F55" }, 401);
  const body = await request.json().catch(() => null);
  const name = String(body && body.name || "").trim().slice(0, 40);
  if (!name) return json({ error: "\u663E\u793A\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A" }, 400);
  const users = await ensureAdminUsers(env);
  if (!users[session.login]) return json({ error: "\u8D26\u53F7\u4E0D\u5B58\u5728" }, 404);
  users[session.login].name = name;
  await writeAdminUsers(env, users);
  return json({ ok: true, user: { login: session.login, name, role: users[session.login].role } });
}
__name(handleProfileUpdate, "handleProfileUpdate");
__name2(handleProfileUpdate, "handleProfileUpdate");
__name22(handleProfileUpdate, "handleProfileUpdate");
__name222(handleProfileUpdate, "handleProfileUpdate");
__name2222(handleProfileUpdate, "handleProfileUpdate");
__name22222(handleProfileUpdate, "handleProfileUpdate");
async function handleProfilePassword(request, env) {
  const { session } = await currentAdmin(request, env);
  if (!session) return json({ error: "\u672A\u767B\u5F55" }, 401);
  const body = await request.json().catch(() => null);
  const oldPassword = String(body && body.oldPassword || "");
  const newPassword = String(body && body.newPassword || "");
  if (newPassword.length < 6) return json({ error: "\u65B0\u5BC6\u7801\u81F3\u5C11 6 \u4F4D" }, 400);
  const users = await ensureAdminUsers(env);
  const user = users[session.login];
  if (!user) return json({ error: "\u8D26\u53F7\u4E0D\u5B58\u5728" }, 404);
  if (!await verifyPassword(oldPassword, user.passwordHash)) return json({ error: "\u65E7\u5BC6\u7801\u4E0D\u6B63\u786E" }, 401);
  user.passwordHash = await hashPassword(newPassword);
  await writeAdminUsers(env, users);
  return json({ ok: true });
}
__name(handleProfilePassword, "handleProfilePassword");
__name2(handleProfilePassword, "handleProfilePassword");
__name22(handleProfilePassword, "handleProfilePassword");
__name222(handleProfilePassword, "handleProfilePassword");
__name2222(handleProfilePassword, "handleProfilePassword");
__name22222(handleProfilePassword, "handleProfilePassword");
var QQ_API_BASE = "http://u.0mz.cn/connect.php";
function getBaseUrl(env) {
  return env.BASE_URL || "https://modpack-release.catkinr-93f.workers.dev";
}
__name(getBaseUrl, "getBaseUrl");
__name2(getBaseUrl, "getBaseUrl");
__name22(getBaseUrl, "getBaseUrl");
__name222(getBaseUrl, "getBaseUrl");
__name2222(getBaseUrl, "getBaseUrl");
__name22222(getBaseUrl, "getBaseUrl");
function findLoginByOAuth(users, provider, identity) {
  for (const [login, u] of Object.entries(users)) {
    const o = u && u.oauth && u.oauth[provider];
    if (!o) continue;
    if (provider === "qq" && o.uid && o.uid === identity) return login;
    if (provider === "github" && o.login && o.login === identity) return login;
  }
  return null;
}
__name(findLoginByOAuth, "findLoginByOAuth");
__name2(findLoginByOAuth, "findLoginByOAuth");
__name22(findLoginByOAuth, "findLoginByOAuth");
__name222(findLoginByOAuth, "findLoginByOAuth");
__name2222(findLoginByOAuth, "findLoginByOAuth");
__name22222(findLoginByOAuth, "findLoginByOAuth");
function oauthInfo(u) {
  const o = u && u.oauth || {};
  return {
    qq: o.qq ? { bound: true, nickname: o.qq.nickname || "", faceimg: o.qq.faceimg || "" } : null,
    github: o.github ? { bound: true, login: o.github.login || "" } : null
  };
}
__name(oauthInfo, "oauthInfo");
__name2(oauthInfo, "oauthInfo");
__name22(oauthInfo, "oauthInfo");
__name222(oauthInfo, "oauthInfo");
__name2222(oauthInfo, "oauthInfo");
__name22222(oauthInfo, "oauthInfo");
function oauthResultPage(title, msg, ok, link) {
  const icon = ok ? "\u2705" : "\u274C";
  const btn = link ? `<a href="${link}" class="btn btn-primary" style="text-decoration:none;">\u7EE7\u7EED\u524D\u5F80</a>` : '<a href="/" class="btn btn-primary" style="text-decoration:none;">\u8FD4\u56DE\u4E0B\u8F7D\u9875</a>';
  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} \xB7 \u68A6\u4E4B\u97F5</title>
<style>body{font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;background:#f5f6f8;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;color:#1f2329}
.card{background:#fff;border:1px solid #e8eaee;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.08);padding:40px 48px;max-width:420px;width:calc(100% - 40px);text-align:center}
.ico{font-size:52px}.t{font-size:20px;font-weight:800;margin:14px 0 8px}.m{color:#86909c;font-size:14px;line-height:1.9;margin-bottom:24px}
.btn{display:inline-block;background:#1677ff;color:#fff;padding:10px 26px;border-radius:8px;font-size:14px}
a.btn:hover{background:#4096ff}</style></head><body><div class="card"><div class="ico">${icon}</div><div class="t">${title}</div><div class="m">${msg}</div>${btn}</div></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
__name(oauthResultPage, "oauthResultPage");
__name2(oauthResultPage, "oauthResultPage");
__name22(oauthResultPage, "oauthResultPage");
__name222(oauthResultPage, "oauthResultPage");
__name2222(oauthResultPage, "oauthResultPage");
__name22222(oauthResultPage, "oauthResultPage");
async function qqApi(env, params) {
  if (!env.QQ_APPID || !env.QQ_APPKEY) throw new Error("QQ \u805A\u5408\u767B\u5F55\u5C1A\u672A\u914D\u7F6E\uFF08QQ_APPID / QQ_APPKEY\uFF09");
  const url = new URL(QQ_API_BASE);
  url.searchParams.set("appid", env.QQ_APPID);
  url.searchParams.set("appkey", env.QQ_APPKEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  const data = await res.json().catch(() => null);
  if (!data) throw new Error("QQ \u63A5\u53E3\u65E0\u54CD\u5E94");
  return data;
}
__name(qqApi, "qqApi");
__name2(qqApi, "qqApi");
__name22(qqApi, "qqApi");
__name222(qqApi, "qqApi");
__name2222(qqApi, "qqApi");
__name22222(qqApi, "qqApi");
async function handleQQLoginUrl(env) {
  try {
    const data = await qqApi(env, { act: "login", type: "qq", redirect_uri: `${getBaseUrl(env)}/auth/qq/callback` });
    if (data.code !== 0 || !data.url) throw new Error(data.msg || "\u83B7\u53D6 QQ \u767B\u5F55\u5730\u5740\u5931\u8D25");
    return json({ url: data.url });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
__name(handleQQLoginUrl, "handleQQLoginUrl");
__name2(handleQQLoginUrl, "handleQQLoginUrl");
__name22(handleQQLoginUrl, "handleQQLoginUrl");
__name222(handleQQLoginUrl, "handleQQLoginUrl");
__name2222(handleQQLoginUrl, "handleQQLoginUrl");
__name22222(handleQQLoginUrl, "handleQQLoginUrl");
async function handleQQLogin(request, env) {
  try {
    const data = await qqApi(env, { act: "login", type: "qq", redirect_uri: `${getBaseUrl(env)}/auth/qq/callback` });
    if (data.code !== 0 || !data.url) throw new Error(data.msg || "\u83B7\u53D6 QQ \u767B\u5F55\u5730\u5740\u5931\u8D25");
    const next = safeNext(new URL(request.url).searchParams.get("next"));
    const token = randomHex(16);
    await env.MODS_KV.put(`oauth:n:${token}`, next, { expirationTtl: 600 });
    const sep = data.url.includes("?") ? "&" : "?";
    return Response.redirect(`${data.url}${sep}state=l:${token}`, 302);
  } catch (e) {
    return text("QQ \u767B\u5F55\u521D\u59CB\u5316\u5931\u8D25\uFF1A" + e.message, 500);
  }
}
__name(handleQQLogin, "handleQQLogin");
__name2(handleQQLogin, "handleQQLogin");
__name22(handleQQLogin, "handleQQLogin");
__name222(handleQQLogin, "handleQQLogin");
__name2222(handleQQLogin, "handleQQLogin");
__name22222(handleQQLogin, "handleQQLogin");
async function handleQQBindUrl(env) {
  try {
    const data = await qqApi(env, { act: "login", type: "qq", redirect_uri: `${getBaseUrl(env)}/auth/qq/bind-callback` });
    if (data.code !== 0 || !data.url) throw new Error(data.msg || "\u83B7\u53D6 QQ \u7ED1\u5B9A\u5730\u5740\u5931\u8D25");
    return json({ url: data.url });
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
__name(handleQQBindUrl, "handleQQBindUrl");
__name2(handleQQBindUrl, "handleQQBindUrl");
__name22(handleQQBindUrl, "handleQQBindUrl");
__name222(handleQQBindUrl, "handleQQBindUrl");
__name2222(handleQQBindUrl, "handleQQBindUrl");
__name22222(handleQQBindUrl, "handleQQBindUrl");
async function handleQQCallback(request, env) {
  try {
    const code = new URL(request.url).searchParams.get("code");
    if (!code) return oauthResultPage("\u767B\u5F55\u5931\u8D25", "\u7F3A\u5C11\u6388\u6743\u7801", false);
    const data = await qqApi(env, { act: "callback", type: "qq", code });
    if (data.code !== 0 || !data.social_uid) throw new Error(data.msg || "QQ \u767B\u5F55\u5931\u8D25");
    const users = await ensureAdminUsers(env);
    const login = findLoginByOAuth(users, "qq", data.social_uid);
    if (!login) {
      return oauthResultPage("\u767B\u5F55\u5931\u8D25", `\u8BE5 QQ\uFF08${data.nickname || data.social_uid}\uFF09\u672A\u7ED1\u5B9A\u4EFB\u4F55\u7BA1\u7406\u5458\u8D26\u53F7\u3002<br>\u8BF7\u5148\u7528\u8D26\u53F7\u5BC6\u7801\u767B\u5F55\uFF0C\u5728\u300C\u4E2A\u4EBA\u4E2D\u5FC3 \u2192 OAuth \u7ED1\u5B9A\u300D\u4E2D\u7ED1\u5B9A\u540E\u518D\u4F7F\u7528 QQ \u767B\u5F55\u3002`, false);
    }
    const admin = users[login];
    if (admin.oauth && admin.oauth.qq && data.faceimg && admin.oauth.qq.faceimg !== data.faceimg) {
      admin.oauth.qq.faceimg = data.faceimg;
      await writeAdminUsers(env, users);
    }
    const token = await createSession(env, { login, name: admin.name || login, role: admin.role, avatar_url: data.faceimg || null });
    let next = "/admin.html";
    const state = new URL(request.url).searchParams.get("state") || "";
    if (state.startsWith("l:")) {
      const t = state.slice(2);
      const stored = await env.MODS_KV.get(`oauth:n:${t}`);
      if (stored) next = safeNext(stored);
      await env.MODS_KV.delete(`oauth:n:${t}`).catch(() => {
      });
    }
    return new Response(null, { status: 302, headers: { Location: next, "Set-Cookie": sessionCookie(token) } });
  } catch (e) {
    return oauthResultPage("\u767B\u5F55\u5931\u8D25", e.message, false);
  }
}
__name(handleQQCallback, "handleQQCallback");
__name2(handleQQCallback, "handleQQCallback");
__name22(handleQQCallback, "handleQQCallback");
__name222(handleQQCallback, "handleQQCallback");
__name2222(handleQQCallback, "handleQQCallback");
__name22222(handleQQCallback, "handleQQCallback");
async function handleQQBindCallback(request, env) {
  try {
    const { session } = await currentAdmin(request, env);
    if (!session) {
      return oauthResultPage("\u7ED1\u5B9A\u5931\u8D25", "\u767B\u5F55\u72B6\u6001\u5DF2\u5931\u6548\uFF0C\u8BF7\u5148\u767B\u5F55\u7BA1\u7406\u540E\u53F0\u540E\u518D\u7ED1\u5B9A QQ\u3002", false, "/auth/login");
    }
    const code = new URL(request.url).searchParams.get("code");
    if (!code) throw new Error("\u7F3A\u5C11\u6388\u6743\u7801");
    const data = await qqApi(env, { act: "callback", type: "qq", code });
    if (data.code !== 0 || !data.social_uid) throw new Error(data.msg || "QQ \u6388\u6743\u5931\u8D25");
    const users = await ensureAdminUsers(env);
    const existing = findLoginByOAuth(users, "qq", data.social_uid);
    if (existing && existing !== session.login) {
      return oauthResultPage("\u7ED1\u5B9A\u5931\u8D25", `\u8BE5 QQ\uFF08${data.nickname || data.social_uid}\uFF09\u5DF2\u7ED1\u5B9A\u5230\u8D26\u53F7 ${existing}\u3002`, false, "/admin.html#/admin/profile");
    }
    users[session.login].oauth = users[session.login].oauth || {};
    users[session.login].oauth.qq = { uid: data.social_uid, nickname: data.nickname || "", faceimg: data.faceimg || "", boundAt: (/* @__PURE__ */ new Date()).toISOString() };
    await writeAdminUsers(env, users);
    return new Response(null, { status: 302, headers: { Location: "/admin.html#/admin/profile?oauth=qq&status=bound" } });
  } catch (e) {
    return oauthResultPage("\u7ED1\u5B9A\u5931\u8D25", e.message, false, "/admin.html#/admin/profile");
  }
}
__name(handleQQBindCallback, "handleQQBindCallback");
__name2(handleQQBindCallback, "handleQQBindCallback");
__name22(handleQQBindCallback, "handleQQBindCallback");
__name222(handleQQBindCallback, "handleQQBindCallback");
__name2222(handleQQBindCallback, "handleQQBindCallback");
__name22222(handleQQBindCallback, "handleQQBindCallback");
async function handleGithubBindUrl(env) {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return json({ error: "\u5C1A\u672A\u914D\u7F6E GitHub OAuth\uFF08GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET\uFF09" }, 400);
  }
  const redirectUri = `${getBaseUrl(env)}/auth/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(env.GITHUB_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user&state=bind`;
  return json({ url });
}
__name(handleGithubBindUrl, "handleGithubBindUrl");
__name2(handleGithubBindUrl, "handleGithubBindUrl");
__name22(handleGithubBindUrl, "handleGithubBindUrl");
__name222(handleGithubBindUrl, "handleGithubBindUrl");
__name2222(handleGithubBindUrl, "handleGithubBindUrl");
__name22222(handleGithubBindUrl, "handleGithubBindUrl");
async function handleOAuthUnbind(request, env) {
  const { session } = await currentAdmin(request, env);
  if (!session) return json({ error: "\u672A\u767B\u5F55" }, 401);
  const body = await request.json().catch(() => null);
  const provider = String(body && body.provider || "");
  if (provider !== "qq" && provider !== "github") return json({ error: "\u4E0D\u652F\u6301\u7684\u767B\u5F55\u65B9\u5F0F" }, 400);
  const users = await ensureAdminUsers(env);
  if (!users[session.login]) return json({ error: "\u8D26\u53F7\u4E0D\u5B58\u5728" }, 404);
  if (users[session.login].oauth) delete users[session.login].oauth[provider];
  await writeAdminUsers(env, users);
  return json({ ok: true });
}
__name(handleOAuthUnbind, "handleOAuthUnbind");
__name2(handleOAuthUnbind, "handleOAuthUnbind");
__name22(handleOAuthUnbind, "handleOAuthUnbind");
__name222(handleOAuthUnbind, "handleOAuthUnbind");
__name2222(handleOAuthUnbind, "handleOAuthUnbind");
__name22222(handleOAuthUnbind, "handleOAuthUnbind");
async function handleMods(env) {
  const mods = (await listMods(env)).map((m) => ({ name: m.name, size: m.size, mtime: m.mtime }));
  return json({ mods });
}
__name(handleMods, "handleMods");
__name2(handleMods, "handleMods");
__name22(handleMods, "handleMods");
__name222(handleMods, "handleMods");
__name2222(handleMods, "handleMods");
__name22222(handleMods, "handleMods");
async function handleLatest(env) {
  try {
    const release = await getLatestRelease(env);
    if (!release) return json({ release: null, state: await readState(env) });
    return json({
      release: {
        tag_name: release.tag_name,
        name: release.name,
        published_at: release.published_at,
        html_url: release.html_url,
        body: release.body,
        assets: (release.assets || []).map((a) => ({ name: a.name, browser_download_url: a.browser_download_url, size: a.size }))
      },
      state: await readState(env)
    });
  } catch (e) {
    return json({ error: e.message || "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF" }, e.status || 500);
  }
}
__name(handleLatest, "handleLatest");
__name2(handleLatest, "handleLatest");
__name22(handleLatest, "handleLatest");
__name222(handleLatest, "handleLatest");
__name2222(handleLatest, "handleLatest");
__name22222(handleLatest, "handleLatest");
async function handleReleases(env) {
  try {
    const releases = await listReleases(env);
    return json({
      releases: releases.map((r) => ({
        id: r.id,
        tag: r.tag_name,
        name: r.name,
        published_at: r.published_at,
        html_url: r.html_url,
        assets: (r.assets || []).map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size }))
      }))
    });
  } catch (e) {
    return json({ error: e.message || "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF" }, e.status || 500);
  }
}
__name(handleReleases, "handleReleases");
__name2(handleReleases, "handleReleases");
__name22(handleReleases, "handleReleases");
__name222(handleReleases, "handleReleases");
__name2222(handleReleases, "handleReleases");
__name22222(handleReleases, "handleReleases");
async function handleReleaseDetail(env, id) {
  try {
    const release = await getRelease(env, id);
    if (!release) return json({ error: "\u7248\u672C\u4E0D\u5B58\u5728" }, 404);
    return json({
      release: {
        id: release.id,
        tag: release.tag_name,
        name: release.name,
        body: release.body,
        published_at: release.published_at,
        html_url: release.html_url,
        assets: (release.assets || []).map((a) => ({
          id: a.id,
          name: a.name,
          url: a.browser_download_url,
          size: a.size,
          download_count: a.download_count
        }))
      }
    });
  } catch (e) {
    return json({ error: e.message || "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF" }, e.status || 500);
  }
}
__name(handleReleaseDetail, "handleReleaseDetail");
__name2(handleReleaseDetail, "handleReleaseDetail");
__name22(handleReleaseDetail, "handleReleaseDetail");
__name222(handleReleaseDetail, "handleReleaseDetail");
__name2222(handleReleaseDetail, "handleReleaseDetail");
__name22222(handleReleaseDetail, "handleReleaseDetail");
async function handleAdminStats(env) {
  const [mods, releases, state] = await Promise.all([listMods(env), listReleases(env), readState(env)]);
  const tickets = await ticketList(env, 300);
  return json({
    stats: {
      mods: mods.length,
      releases: releases.length,
      tickets: tickets.length,
      pendingTickets: tickets.filter((t) => t.status === "new").length,
      currentVersion: state.currentVersion || null,
      lastReleaseTag: state.lastReleaseTag || null
    },
    recentReleases: releases.slice(0, 5).map((r) => ({ id: r.id, tag: r.tag, name: r.name, published_at: r.published_at })),
    recentTickets: tickets.slice(-5).reverse().map((t) => ({ id: t.id, nickname: t.nickname, gamename: t.gamename, status: t.status, createdAt: t.createdAt }))
  });
}
__name(handleAdminStats, "handleAdminStats");
__name2(handleAdminStats, "handleAdminStats");
__name22(handleAdminStats, "handleAdminStats");
__name222(handleAdminStats, "handleAdminStats");
__name2222(handleAdminStats, "handleAdminStats");
__name22222(handleAdminStats, "handleAdminStats");
async function handleAdminModsList(env) {
  return json({ mods: await listMods(env) });
}
__name(handleAdminModsList, "handleAdminModsList");
__name2(handleAdminModsList, "handleAdminModsList");
__name22(handleAdminModsList, "handleAdminModsList");
__name222(handleAdminModsList, "handleAdminModsList");
__name2222(handleAdminModsList, "handleAdminModsList");
__name22222(handleAdminModsList, "handleAdminModsList");
function extractJarsFromZip(buf, maxBytes) {
  let files;
  try {
    files = unzipSync(new Uint8Array(buf), {
      filter: /* @__PURE__ */ __name22222((f) => (f.name.split("/").pop() || "").toLowerCase().endsWith(".jar"), "filter")
    });
  } catch (e) {
    throw new Error("ZIP \u89E3\u538B\u5931\u8D25: " + (e.message || "\u65E0\u6CD5\u89E3\u6790\u538B\u7F29\u5305"));
  }
  const entries = [];
  for (const [path, data] of Object.entries(files)) {
    const segments = path.replace(/\\/g, "/").split("/").filter(Boolean);
    const fileName = segments.pop();
    if (!fileName || !fileName.toLowerCase().endsWith(".jar")) continue;
    if (data.byteLength > maxBytes) {
      throw new Error(`ZIP \u4E2D\u7684 ${fileName} \u8D85\u8FC7\u5927\u5C0F\u4E0A\u9650`);
    }
    entries.push({ name: fileName, data, inMods: segments.some((s) => s.toLowerCase() === "mods") });
  }
  let selected = entries.filter((e) => e.inMods);
  if (selected.length === 0) selected = entries;
  const byName = /* @__PURE__ */ new Map();
  for (const e of selected) byName.set(e.name, e);
  return [...byName.values()].map((e) => ({
    name: e.name,
    data: e.data.buffer.slice(e.data.byteOffset, e.data.byteOffset + e.data.byteLength)
  }));
}
__name(extractJarsFromZip, "extractJarsFromZip");
__name2(extractJarsFromZip, "extractJarsFromZip");
__name22(extractJarsFromZip, "extractJarsFromZip");
__name222(extractJarsFromZip, "extractJarsFromZip");
__name2222(extractJarsFromZip, "extractJarsFromZip");
__name22222(extractJarsFromZip, "extractJarsFromZip");
async function handleAdminUpload(request, env) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") return json({ error: "\u672A\u6536\u5230\u6587\u4EF6" }, 400);
    const name = file.name;
    const lower = name.toLowerCase();
    if (!lower.endsWith(".jar") && !lower.endsWith(".zip")) {
      return json({ error: "\u4EC5\u652F\u6301 .jar \u6A21\u7EC4\u6216 .zip \u538B\u7F29\u5305\uFF08\u81EA\u52A8\u89E3\u538B\u5E76\u63D0\u53D6 mods \u4E2D\u7684\u6A21\u7EC4\uFF09" }, 400);
    }
    const maxBytes = parseInt(env.MAX_UPLOAD_MB || "100", 10) * 1024 * 1024;
    const buf = await file.arrayBuffer();
    if (buf.byteLength > maxBytes) return json({ error: "\u6587\u4EF6\u8D85\u8FC7\u5927\u5C0F\u4E0A\u9650" }, 400);
    if (lower.endsWith(".jar")) {
      const mod = await putMod(env, name, buf, buf.byteLength);
      const publishResult2 = await tryPublish(env);
      return json({ ok: true, mod, publish: publishResult2 });
    }
    const jars = extractJarsFromZip(buf, maxBytes);
    if (jars.length === 0) return json({ error: "ZIP \u4E2D\u672A\u627E\u5230\u4EFB\u4F55 .jar \u6A21\u7EC4\u6587\u4EF6" }, 400);
    const mods = [];
    try {
      for (const jar of jars) {
        mods.push(await putMod(env, jar.name, jar.data, jar.data.byteLength));
      }
    } catch (e) {
      await Promise.all(jars.map((j) => env.MODS_R2.delete(j.name).catch(() => {
      })));
      throw e;
    }
    const publishResult = await tryPublish(env);
    return json({ ok: true, count: mods.length, mods, publish: publishResult });
  } catch (e) {
    return json({ error: e.message || "\u4E0A\u4F20\u5931\u8D25" }, e.status || 500);
  }
}
__name(handleAdminUpload, "handleAdminUpload");
__name2(handleAdminUpload, "handleAdminUpload");
__name22(handleAdminUpload, "handleAdminUpload");
__name222(handleAdminUpload, "handleAdminUpload");
__name2222(handleAdminUpload, "handleAdminUpload");
__name22222(handleAdminUpload, "handleAdminUpload");
async function handleAdminRename(request, env) {
  try {
    const body = await request.json();
    const { oldName, newName } = body || {};
    if (!oldName || !newName) return json({ error: "\u7F3A\u5C11\u53C2\u6570" }, 400);
    if (!newName.toLowerCase().endsWith(".jar")) return json({ error: "\u65B0\u540D\u79F0\u5FC5\u987B\u4EE5 .jar \u7ED3\u5C3E" }, 400);
    if (oldName === newName) return json({ error: "\u65B0\u65E7\u540D\u79F0\u76F8\u540C" }, 400);
    await renameMod(env, oldName, newName);
    const publishResult = await tryPublish(env);
    return json({ ok: true, name: newName, publish: publishResult });
  } catch (e) {
    return json({ error: e.message || "\u91CD\u547D\u540D\u5931\u8D25" }, e.status || 500);
  }
}
__name(handleAdminRename, "handleAdminRename");
__name2(handleAdminRename, "handleAdminRename");
__name22(handleAdminRename, "handleAdminRename");
__name222(handleAdminRename, "handleAdminRename");
__name2222(handleAdminRename, "handleAdminRename");
__name22222(handleAdminRename, "handleAdminRename");
async function handleAdminDelete(request, env, name) {
  try {
    const decoded = decodeURIComponent(name);
    await removeMod(env, decoded);
    const publishResult = await tryPublish(env);
    return json({ ok: true, name: decoded, publish: publishResult });
  } catch (e) {
    return json({ error: e.message || "\u5220\u9664\u5931\u8D25" }, e.status || 500);
  }
}
__name(handleAdminDelete, "handleAdminDelete");
__name2(handleAdminDelete, "handleAdminDelete");
__name22(handleAdminDelete, "handleAdminDelete");
__name222(handleAdminDelete, "handleAdminDelete");
__name2222(handleAdminDelete, "handleAdminDelete");
__name22222(handleAdminDelete, "handleAdminDelete");
async function handleMrpackUpload(request, env, ctx) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") return json({ error: "\u672A\u6536\u5230\u6587\u4EF6" }, 400);
    const name = file.name || "";
    if (!name.toLowerCase().endsWith(".mrpack") && !name.toLowerCase().endsWith(".zip")) {
      return json({ error: "\u4EC5\u652F\u6301 .mrpack \u6A21\u7EC4\u5305\u6587\u4EF6" }, 400);
    }
    const maxBytes = parseInt(env.MAX_UPLOAD_MB || "100", 10) * 1024 * 1024;
    const buf = await file.arrayBuffer();
    if (buf.byteLength > maxBytes) return json({ error: "\u6587\u4EF6\u8D85\u8FC7\u5927\u5C0F\u4E0A\u9650" }, 400);
    const unzipped = unzipSync(new Uint8Array(buf), {});
    let indexJson = null;
    const fileNames = Object.keys(unzipped);
    for (const fn of fileNames) {
      if (fn.replace(/\\/g, "/").split("/").pop() === "modrinth.index.json") {
        indexJson = JSON.parse(new TextDecoder().decode(unzipped[fn]));
        break;
      }
    }
    if (!indexJson || !Array.isArray(indexJson.files)) {
      return json({ error: "\u672A\u627E\u5230 modrinth.index.json \u6216\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u4E0D\u662F\u6709\u6548\u7684 .mrpack \u6587\u4EF6" }, 400);
    }
    const modsToDownload = indexJson.files.filter((f) => {
      const path = (f.path || "").replace(/\\/g, "/");
      return path.toLowerCase().startsWith("mods/") && path.toLowerCase().endsWith(".jar");
    });
    if (modsToDownload.length === 0) return json({ error: ".mrpack \u4E2D\u672A\u627E\u5230 mods/ \u76EE\u5F55\u4E0B\u7684 .jar \u6A21\u7EC4" }, 400);
    let message = "";
    try {
      message = (form.get("message") || "").toString().slice(0, 500);
    } catch (_) {
    }
    const mods = modsToDownload.map((entry) => {
      const rawPath = (entry.path || "").replace(/\\/g, "/");
      const hashes = entry.hashes || {};
      return {
        path: rawPath,
        name: rawPath.split("/").pop(),
        sha1: hashes.sha1 || hashes["sha-1"] || null,
        sha512: hashes.sha512 || hashes["sha-512"] || null,
        urls: Array.isArray(entry.downloads) ? entry.downloads.slice() : [],
        _state: "pending"
      };
    });
    const id = randomHex(8);
    const job = {
      id,
      name,
      message,
      status: "queued",
      createdAt: mrpackNow(),
      updatedAt: mrpackNow(),
      total: mods.length,
      done: 0,
      ok: 0,
      failed: 0,
      logs: [],
      mods,
      errors: [],
      publish: null,
      cleaned: false,
      processingAt: null
    };
    mrpackLog(job, "info", `\u5DF2\u89E3\u6790 ${name}\uFF1A\u5171 ${mods.length} \u4E2A\u6A21\u7EC4\u5F85\u4E0B\u8F7D`);
    await saveMrpackJob(env, job);
    const idx = JSON.parse(await env.MODS_KV.get("mrpack:index") || "[]");
    idx.push(id);
    await env.MODS_KV.put("mrpack:index", JSON.stringify(idx.slice(-50)));
    if (ctx && ctx.waitUntil) ctx.waitUntil(drainMrpackJobs(env));
    return json({ ok: true, jobId: id });
  } catch (e) {
    return json({ error: e.message || ".mrpack \u5BFC\u5165\u5931\u8D25" }, e.status || 500);
  }
}
__name(handleMrpackUpload, "handleMrpackUpload");
function mrpackNow() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
__name(mrpackNow, "mrpackNow");
function mrpackFmtSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}
__name(mrpackFmtSize, "mrpackFmtSize");
function mrpackLog(job, level, msg) {
  job.logs.push({ t: mrpackNow(), level, msg });
  if (job.logs.length > 300) job.logs = job.logs.slice(-300);
}
__name(mrpackLog, "mrpackLog");
async function saveMrpackJob(env, job) {
  job.updatedAt = mrpackNow();
  await env.MODS_KV.put(`mrpack:job:${job.id}`, JSON.stringify(job));
}
__name(saveMrpackJob, "saveMrpackJob");
async function handleMrpackJobsList(env) {
  const indexRaw = await env.MODS_KV.get("mrpack:index");
  const ids = indexRaw ? JSON.parse(indexRaw) : [];
  const jobs = [];
  for (const id of ids.slice(-10)) {
    const raw = await env.MODS_KV.get(`mrpack:job:${id}`);
    if (raw) {
      const j = JSON.parse(raw);
      jobs.push({ id: j.id, name: j.name, status: j.status, total: j.total, done: j.done, ok: j.ok, failed: j.failed, createdAt: j.createdAt });
    }
  }
  return json({ jobs: jobs.reverse() });
}
__name(handleMrpackJobsList, "handleMrpackJobsList");
async function handleMrpackJobStatus(env, id) {
  const raw = await env.MODS_KV.get(`mrpack:job:${id}`);
  if (!raw) return json({ error: "\u4EFB\u52A1\u4E0D\u5B58\u5728\u6216\u5DF2\u8FC7\u671F" }, 404);
  const job = JSON.parse(raw);
  return json({
    job: {
      id: job.id,
      name: job.name,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      total: job.total,
      done: job.done,
      ok: job.ok,
      failed: job.failed,
      logs: job.logs,
      errors: job.errors,
      publish: job.publish
    }
  });
}
__name(handleMrpackJobStatus, "handleMrpackJobStatus");
async function handleModpackApply(request, env) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") return json({ error: "\u672A\u6536\u5230\u6587\u4EF6" }, 400);
    let message = "";
    try {
      message = (form.get("message") || "").toString().slice(0, 500);
    } catch (_) {
    }
    const maxBytes = parseInt(env.MAX_UPLOAD_MB || "100", 10) * 1024 * 1024;
    const buf = await file.arrayBuffer();
    if (buf.byteLength > maxBytes) return json({ error: "\u6587\u4EF6\u8D85\u8FC7\u5927\u5C0F\u4E0A\u9650" }, 400);
    const jars = extractJarsFromZip(buf, maxBytes);
    if (jars.length === 0) return json({ error: "\u538B\u7F29\u5305\u4E2D\u672A\u627E\u5230\u4EFB\u4F55 .jar \u6A21\u7EC4" }, 400);
    const existing = await listMods(env);
    for (const m of existing) {
      await deleteRepoFile(env, `mods/${m.name}`, `\u5BFC\u5165 mods.zip\uFF1A\u79FB\u9664\u65E7\u6A21\u7EC4 ${m.name}`).catch(() => {
      });
    }
    const mods = [];
    for (const jar of jars) {
      mods.push(await putMod(env, jar.name, jar.data, jar.data.byteLength));
    }
    const publishResult = await tryPublish(env);
    return json({ ok: true, count: mods.length, mods, message, publish: publishResult });
  } catch (e) {
    return json({ error: e.message || "\u5E94\u7528 mods.zip \u5931\u8D25" }, e.status || 500);
  }
}
__name(handleModpackApply, "handleModpackApply");
async function handleProxy(request, env) {
  try {
    const parsed = new URL(request.url);
    const target = parsed.searchParams.get("url") || "";
    let dest;
    try {
      dest = new URL(target);
    } catch (_) {
      return json({ error: "url \u53C2\u6570\u65E0\u6548" }, 400);
    }
    if (dest.protocol !== "http:" && dest.protocol !== "https:") return json({ error: "\u4EC5\u652F\u6301 http/https" }, 400);
    const host = dest.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0" || host.endsWith(".local") || /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host) || /^169\.254\./.test(host)) {
      return json({ error: "\u76EE\u6807\u5730\u5740\u4E0D\u53D7\u652F\u6301" }, 403);
    }
    const maxBytes = parseInt(env.MAX_UPLOAD_MB || "100", 10) * 1024 * 1024;
    const res = await fetch(dest.toString(), { cf: { cacheTtl: 3600 } });
    if (!res.ok) return json({ error: `\u6E90\u7AD9\u8FD4\u56DE ${res.status}` }, res.status);
    const length = parseInt(res.headers.get("content-length") || "0", 10);
    if (length > maxBytes) return json({ error: "\u6587\u4EF6\u8D85\u8FC7\u5927\u5C0F\u4E0A\u9650" }, 413);
    const body = await res.arrayBuffer();
    if (body.byteLength > maxBytes) return json({ error: "\u6587\u4EF6\u8D85\u8FC7\u5927\u5C0F\u4E0A\u9650" }, 413);
    return new Response(body, {
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/octet-stream",
        "Content-Length": String(body.byteLength),
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (e) {
    return json({ error: "\u4EE3\u7406\u5931\u8D25\uFF1A" + (e.message || e) }, 502);
  }
}
__name(handleProxy, "handleProxy");
async function drainMrpackJobs(env) {
  try {
    const lockRaw = await env.MODS_KV.get("mrpack:lock");
    if (lockRaw) return;
    const budgetMs = parseInt(env.MRPACK_CRON_BUDGET_MS || "40000", 10);
    const perRun = parseInt(env.MRPACK_PER_RUN || "12", 10);
    const leaseMs = parseInt(env.MRPACK_LEASE_MS || "900000", 10);
    await env.MODS_KV.put("mrpack:lock", "1", { expirationTtl: Math.ceil(budgetMs / 1e3) + 60 });
    const deadline = Date.now() + budgetMs;
    const indexRaw = await env.MODS_KV.get("mrpack:index");
    const ids = indexRaw ? JSON.parse(indexRaw) : [];
    for (const id of ids) {
      if (Date.now() > deadline) break;
      const raw = await env.MODS_KV.get(`mrpack:job:${id}`);
      if (!raw) continue;
      const job = JSON.parse(raw);
      if (job.status === "done" || job.status === "error") continue;
      if (job.status === "processing" && job.processingAt) {
        const since = Date.now() - new Date(job.processingAt).getTime();
        if (since < leaseMs) continue;
      }
      job.status = "processing";
      job.processingAt = mrpackNow();
      const finalStatus = await processMrpackJob(env, job, perRun, deadline);
      job.status = finalStatus;
      job.processingAt = null;
      await saveMrpackJob(env, job);
    }
  } catch (e) {
    console.error("[mrpack-drain]", e.message);
  } finally {
    try {
      await env.MODS_KV.delete("mrpack:lock");
    } catch (_) {
    }
  }
}
__name(drainMrpackJobs, "drainMrpackJobs");
async function processMrpackJob(env, job, perRun, deadline) {
  if (!job.cleaned) {
    mrpackLog(job, "info", "\u6E05\u7406 mods \u76EE\u5F55\u4E2D\u7684\u65E7\u6A21\u7EC4\u2026");
    const existing = await listMods(env);
    for (const m of existing) {
      await deleteRepoFile(env, `mods/${m.name}`, `\u5BFC\u5165 mrpack\uFF1A\u79FB\u9664\u65E7\u6A21\u7EC4 ${m.name}`).catch(() => {
      });
    }
    job.cleaned = true;
  }
  await resolveModrinthUrls(env, job);
  const pending = job.mods.filter((m) => m._state === "pending");
  const batch = pending.slice(0, perRun);
  const concurrency = parseInt(env.MRPACK_CONCURRENCY || "5", 10);
  for (let i2 = 0; i2 < batch.length && Date.now() < deadline; i2 += concurrency) {
    const chunk = batch.slice(i2, i2 + concurrency);
    const settled = await Promise.allSettled(chunk.map((m) => downloadMrpackMod(env, job, m)));
    for (const r of settled) {
      if (r.status === "rejected") {
        mrpackLog(job, "error", `\u2717 \u5904\u7406\u5F02\u5E38\uFF1A${r.reason && r.reason.message || r.reason}`);
      }
    }
    await saveMrpackJob(env, job);
  }
  job.done = job.mods.filter((m) => m._state === "ok" || m._state === "fail").length;
  job.ok = job.mods.filter((m) => m._state === "ok").length;
  job.failed = job.mods.filter((m) => m._state === "fail").length;
  job.errors = job.mods.filter((m) => m._state === "fail").map((m) => m.error || `${m.name}\uFF1A\u4E0B\u8F7D\u5931\u8D25`).slice(-30);
  if (job.done >= job.total) {
    return finishMrpackJob(env, job);
  }
  return "processing";
}
__name(processMrpackJob, "processMrpackJob");
async function finishMrpackJob(env, job) {
  if (job.ok === 0) {
    mrpackLog(job, "error", "\u6240\u6709\u6A21\u7EC4\u4E0B\u8F7D\u5931\u8D25\uFF0C\u672A\u53D1\u5E03\u65B0\u7248\u672C");
    job.status = "error";
    await saveMrpackJob(env, job);
    return "error";
  }
  mrpackLog(job, "info", `\u4E0B\u8F7D\u5B8C\u6210\uFF1A\u6210\u529F ${job.ok} \u4E2A\uFF0C\u5931\u8D25 ${job.failed} \u4E2A\uFF0C\u5F00\u59CB\u6253\u5305\u53D1\u5E03\u65B0\u7248\u672C\u2026`);
  const publishResult = await tryPublish(env);
  job.publish = publishResult;
  if (publishResult && !publishResult.error) {
    mrpackLog(job, "ok", `\u5DF2\u81EA\u52A8\u53D1\u5E03 v${publishResult.version} \u2192 ${publishResult.tag}`);
    job.status = "done";
  } else {
    mrpackLog(job, "error", `\u6A21\u7EC4\u5DF2\u5C31\u7EEA\uFF0C\u4F46\u81EA\u52A8\u53D1\u5E03\u5931\u8D25\uFF1A${publishResult && publishResult.error || "\u672A\u77E5\u9519\u8BEF"}`);
    job.status = "done";
  }
  await saveMrpackJob(env, job);
  return job.status;
}
__name(finishMrpackJob, "finishMrpackJob");
async function downloadMrpackMod(env, job, m) {
  const urls = m._resolvedUrl ? [m._resolvedUrl, ...m.urls || []] : m.urls || [];
  const tried = /* @__PURE__ */ new Set();
  let lastErr = "\u65E0\u53EF\u7528\u4E0B\u8F7D\u5730\u5740";
  for (const url of urls) {
    if (!url || tried.has(url)) continue;
    tried.add(url);
    try {
      const res = await fetch(url, { cf: { cacheTtl: 3600 } });
      if (!res.ok) throw new Error(`\u4E0B\u8F7D\u5931\u8D25 (${res.status})`);
      const data = await res.arrayBuffer();
      if (data.byteLength === 0) throw new Error("\u4E0B\u8F7D\u5185\u5BB9\u4E3A\u7A7A");
      if (m.sha1 || m.sha512) {
        const algo = m.sha1 ? "SHA-1" : "SHA-512";
        const expected = (m.sha1 || m.sha512).toLowerCase();
        const digest = await crypto.subtle.digest(algo, data);
        const actual = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
        if (actual !== expected) throw new Error("\u54C8\u5E0C\u6821\u9A8C\u5931\u8D25");
      }
      await putMod(env, m.name, data, data.byteLength);
      m._state = "ok";
      mrpackLog(job, "ok", `\u2713 ${m.name}\uFF08${mrpackFmtSize(data.byteLength)}\uFF09`);
      return;
    } catch (e) {
      lastErr = e.message;
    }
  }
  m._state = "fail";
  m.error = `${m.name}\uFF1A${lastErr}`;
  mrpackLog(job, "error", `\u2717 ${m.name}\uFF1A${lastErr}`);
}
__name(downloadMrpackMod, "downloadMrpackMod");
async function resolveModrinthUrls(env, job) {
  const targets = job.mods.filter((m) => m._state === "pending" && m.sha1 && !m._modrinthAttempted);
  if (!targets.length) return;
  for (const m of targets) m._modrinthAttempted = true;
  const hashes = [...new Set(targets.map((m) => m.sha1.toLowerCase()))];
  let map = {};
  try {
    const res = await fetch("https://api.modrinth.com/v2/version_files", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "modpack-release-worker" },
      body: JSON.stringify({ hashes, algorithm: "sha1" })
    });
    if (res.ok) {
      map = await res.json();
    } else {
      mrpackLog(job, "warn", `Modrinth \u89E3\u6790\u6E90\u8BF7\u6C42\u5931\u8D25 (${res.status})\uFF0C\u5C06\u56DE\u9000\u5230 mrpack \u5185\u7F6E\u4E0B\u8F7D\u5730\u5740`);
    }
  } catch (e) {
    mrpackLog(job, "warn", `Modrinth \u89E3\u6790\u6E90\u4E0D\u53EF\u7528\uFF1A${e.message}\uFF0C\u5C06\u56DE\u9000\u5230\u5185\u7F6E\u4E0B\u8F7D\u5730\u5740`);
  }
  let hit = 0;
  for (const m of targets) {
    const ver = map[m.sha1.toLowerCase()];
    if (!ver || !Array.isArray(ver.files) || !ver.files.length) continue;
    const matched = ver.files.find((f) => f.hashes && f.hashes.sha1 && f.hashes.sha1.toLowerCase() === m.sha1.toLowerCase());
    const pick = matched || ver.files[0];
    if (pick && pick.url) {
      m._resolvedUrl = pick.url;
      hit++;
    }
  }
  if (hit > 0) mrpackLog(job, "info", `\u4F7F\u7528 Modrinth \u89E3\u6790\u6E90\uFF08PCL2 \u540C\u6B3E\uFF09\u5B9A\u4F4D\u5230 ${hit} \u4E2A\u6A21\u7EC4\u7684\u4E0B\u8F7D\u5730\u5740`);
}
__name(resolveModrinthUrls, "resolveModrinthUrls");
__name2(handleMrpackUpload, "handleMrpackUpload");
__name22(handleMrpackUpload, "handleMrpackUpload");
__name222(handleMrpackUpload, "handleMrpackUpload");
__name2222(handleMrpackUpload, "handleMrpackUpload");
__name22222(handleMrpackUpload, "handleMrpackUpload");
async function handleAdminPublish(request, env) {
  try {
    let message = "";
    try {
      const body = await request.json();
      message = (body || {}).message || "";
    } catch (_) {
    }
    const result = await publish(env, message);
    return json({ ok: true, result });
  } catch (e) {
    return json({ error: e.message || "\u53D1\u5E03\u5931\u8D25" }, e.status || 500);
  }
}
__name(handleAdminPublish, "handleAdminPublish");
__name2(handleAdminPublish, "handleAdminPublish");
__name22(handleAdminPublish, "handleAdminPublish");
__name222(handleAdminPublish, "handleAdminPublish");
__name2222(handleAdminPublish, "handleAdminPublish");
__name22222(handleAdminPublish, "handleAdminPublish");
async function handleAdminReleaseRollback(request, env) {
  try {
    const body = await request.json();
    const { id, tag } = body || {};
    if (!id) return json({ error: "\u7F3A\u5C11\u7248\u672C ID" }, 400);
    const release = await getRelease(env, id);
    const asset = (release.assets || []).find((a) => a.name.toLowerCase().endsWith(".zip"));
    if (!asset) return json({ error: "\u8BE5\u7248\u672C\u6CA1\u6709\u6A21\u7EC4\u5305\u8D44\u4EA7\uFF0C\u65E0\u6CD5\u56DE\u6EDA" }, 400);
    const zipped = await getReleaseAsset(env, asset.id);
    const maxBytes = parseInt(env.MAX_UPLOAD_MB || "100", 10) * 1024 * 1024;
    const jars = extractJarsFromZip(zipped, maxBytes);
    if (jars.length === 0) return json({ error: "\u6A21\u7EC4\u5305\u4E2D\u672A\u627E\u5230\u4EFB\u4F55 .jar \u6A21\u7EC4" }, 400);
    const rollTag = tag || release.tag_name;
    const existing = await listMods(env);
    for (const m of existing) {
      await deleteRepoFile(env, `mods/${m.name}`, `\u56DE\u6EDA\u5230 ${rollTag}\uFF1A\u79FB\u9664 ${m.name}`);
    }
    for (const jar of jars) {
      await writeRepoFile(env, `mods/${jar.name}`, jar.data, `\u56DE\u6EDA\u5230 ${rollTag}\uFF1A\u6062\u590D ${jar.name}`);
    }
    const publishResult = await tryPublish(env);
    return json({ ok: true, count: jars.length, tag: rollTag, publish: publishResult });
  } catch (e) {
    return json({ error: e.message || "\u56DE\u6EDA\u5931\u8D25" }, e.status || 500);
  }
}
__name(handleAdminReleaseRollback, "handleAdminReleaseRollback");
__name2(handleAdminReleaseRollback, "handleAdminReleaseRollback");
__name22(handleAdminReleaseRollback, "handleAdminReleaseRollback");
__name222(handleAdminReleaseRollback, "handleAdminReleaseRollback");
__name2222(handleAdminReleaseRollback, "handleAdminReleaseRollback");
__name22222(handleAdminReleaseRollback, "handleAdminReleaseRollback");
async function handleAdminReleaseDelete(request, env, id) {
  try {
    const release = await getRelease(env, id);
    await deleteRelease(env, id);
    try {
      await deleteTag(env, release.tag_name);
    } catch (_) {
    }
    const state = await readState(env);
    const latest = await getLatestRelease(env);
    if (latest) {
      state.lastReleaseId = latest.id;
      state.lastReleaseTag = latest.tag_name;
      const v = String(latest.tag_name).replace(/^v/i, "");
      if (v) state.currentVersion = v;
    } else {
      state.lastReleaseId = null;
      state.lastReleaseTag = null;
    }
    await writeState(env, state);
    return json({ ok: true, tag: release.tag_name });
  } catch (e) {
    return json({ error: e.message || "\u5220\u9664\u5931\u8D25" }, e.status || 500);
  }
}
__name(handleAdminReleaseDelete, "handleAdminReleaseDelete");
__name2(handleAdminReleaseDelete, "handleAdminReleaseDelete");
__name22(handleAdminReleaseDelete, "handleAdminReleaseDelete");
__name222(handleAdminReleaseDelete, "handleAdminReleaseDelete");
__name2222(handleAdminReleaseDelete, "handleAdminReleaseDelete");
__name22222(handleAdminReleaseDelete, "handleAdminReleaseDelete");
async function sendEmail(env, to, subject, body, html) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_xxxx")) throw new Error("\u672A\u914D\u7F6E RESEND_API_KEY");
  let from = env.MAIL_FROM || "\u5DE5\u5355\u7CFB\u7EDF <noreply@mail.catfix.top>";
  try {
    const list = JSON.parse(env.MAIL_FROM_LIST || "[]");
    if (Array.isArray(list) && list.length) {
      from = list[Math.floor(Math.random() * list.length)];
    }
  } catch (_) {
  }
  const payload = { from, to: [to], subject, text: body };
  if (html) payload.html = html;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${res.status}: ${data.message || JSON.stringify(data)}`);
  return data;
}
__name(sendEmail, "sendEmail");
__name2(sendEmail, "sendEmail");
__name22(sendEmail, "sendEmail");
__name222(sendEmail, "sendEmail");
__name2222(sendEmail, "sendEmail");
__name22222(sendEmail, "sendEmail");
function escHtml(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(escHtml, "escHtml");
__name2(escHtml, "escHtml");
__name22(escHtml, "escHtml");
__name222(escHtml, "escHtml");
__name2222(escHtml, "escHtml");
__name22222(escHtml, "escHtml");
function inlineMd(s) {
  s = s.replace(/`([^`]+)`/g, (m, c) => `<code>${c}</code>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}
__name(inlineMd, "inlineMd");
__name2(inlineMd, "inlineMd");
__name22(inlineMd, "inlineMd");
__name222(inlineMd, "inlineMd");
__name2222(inlineMd, "inlineMd");
__name22222(inlineMd, "inlineMd");
function mdToHtml(md) {
  const lines = String(md || "").replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let inCode = false;
  let codeBuf = [];
  let listType = null;
  let para = [];
  const flushPara = /* @__PURE__ */ __name2222(() => {
    if (para.length) {
      out.push(`<p>${inlineMd(para.map(escHtml).join("<br>"))}</p>`);
      para = [];
    }
  }, "flushPara");
  const closeList = /* @__PURE__ */ __name2222(() => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  }, "closeList");
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      flushPara();
      closeList();
      if (inCode) {
        out.push(`<pre><code>${escHtml(codeBuf.join("\n"))}</code></pre>`);
        codeBuf = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(raw);
      continue;
    }
    if (!line) {
      flushPara();
      closeList();
      continue;
    }
    if (/^#{1,4}\s/.test(line)) {
      flushPara();
      closeList();
      const lvl = Math.min(line.match(/^#{1,4}/)[1].length + 1, 5);
      out.push(`<h${lvl}>${inlineMd(escHtml(line.replace(/^#{1,4}\s*/, "")))}</h${lvl}>`);
      continue;
    }
    if (/^>\s?/.test(line)) {
      flushPara();
      closeList();
      out.push(`<blockquote>${inlineMd(escHtml(line.replace(/^>\s?/, "")))}</blockquote>`);
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      flushPara();
      if (listType !== "ul") {
        closeList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${inlineMd(escHtml(line.replace(/^[-*]\s/, "")))}</li>`);
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      flushPara();
      if (listType !== "ol") {
        closeList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${inlineMd(escHtml(line.replace(/^\d+\.\s/, "")))}</li>`);
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line)) {
      flushPara();
      closeList();
      out.push("<hr>");
      continue;
    }
    para.push(raw);
  }
  flushPara();
  closeList();
  if (inCode) out.push(`<pre><code>${escHtml(codeBuf.join("\n"))}</code></pre>`);
  return out.join("");
}
__name(mdToHtml, "mdToHtml");
__name2(mdToHtml, "mdToHtml");
__name22(mdToHtml, "mdToHtml");
__name222(mdToHtml, "mdToHtml");
__name2222(mdToHtml, "mdToHtml");
__name22222(mdToHtml, "mdToHtml");
function emailShell(title, inner) {
  return `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdf0f5;font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:30px 16px;">
  <div style="background:rgba(255,255,255,.9);border:1px solid #f7d3e2;border-radius:18px;padding:30px 32px;box-shadow:0 10px 32px rgba(233,111,157,.14);">
    <div style="font-size:20px;font-weight:700;color:#e35d8e;margin-bottom:18px;">${escHtml(title)}</div>
    <div style="color:#6b5560;font-size:14px;line-height:1.9;">${inner}</div>
    <div style="margin-top:26px;padding-top:16px;border-top:1px solid #f3dce8;color:#b89aa8;font-size:12px;line-height:1.8;">
      \u2014\u2014 \u68A6\u4E4B\u97F5\u5DE5\u5355\u7CFB\u7EDF<br>\u5B98\u65B9\u53D1\u4EF6\u90AE\u7BB1\uFF1Anoreply@mail.catfix.top / noreply@camzy.uno<br>\u5176\u4ED6\u5730\u5740\u53D1\u6765\u7684"\u5DE5\u5355"\u90AE\u4EF6\u5747\u4E3A\u4EFF\u5192\uFF0C\u8BF7\u52FF\u56DE\u590D\u3002
    </div>
  </div>
</div>
</body></html>`;
}
__name(emailShell, "emailShell");
__name2(emailShell, "emailShell");
__name22(emailShell, "emailShell");
__name222(emailShell, "emailShell");
__name2222(emailShell, "emailShell");
__name22222(emailShell, "emailShell");
function verifyEmailHtml(nickname, code) {
  return emailShell("\u90AE\u7BB1\u9A8C\u8BC1\u7801", `
<p>\u4F60\u597D <strong>${escHtml(nickname)}</strong>\uFF1A</p>
<p>\u4F60\u6B63\u5728 <strong>\u68A6\u4E4B\u97F5</strong> \u63D0\u4EA4\u5DE5\u5355\uFF0C\u8BF7\u8F93\u5165\u4EE5\u4E0B\u9A8C\u8BC1\u7801\u5B8C\u6210\u63D0\u4EA4\uFF08<strong>10 \u5206\u949F\u5185\u6709\u6548</strong>\uFF09\uFF1A</p>
<div style="margin:22px 0;text-align:center;background:#fdf0f5;border:1px dashed #e89bb8;border-radius:14px;padding:20px;">
  <div style="font-size:36px;font-weight:800;letter-spacing:10px;color:#d64b7f;font-family:Consolas,Menlo,monospace;">${escHtml(code)}</div>
</div>
<p style="color:#b89aa8;font-size:12px;">\u5982\u679C\u8FD9\u4E0D\u662F\u4F60\u672C\u4EBA\u7684\u64CD\u4F5C\uFF0C\u8BF7\u5FFD\u7565\u672C\u90AE\u4EF6\u3002</p>`);
}
__name(verifyEmailHtml, "verifyEmailHtml");
__name2(verifyEmailHtml, "verifyEmailHtml");
__name22(verifyEmailHtml, "verifyEmailHtml");
__name222(verifyEmailHtml, "verifyEmailHtml");
__name2222(verifyEmailHtml, "verifyEmailHtml");
__name22222(verifyEmailHtml, "verifyEmailHtml");
function notifyAdminEmailHtml(id, ticket) {
  const rows = [
    ["\u5DE5\u5355\u7F16\u53F7", id],
    ["\u7B80\u79F0", ticket.nickname],
    ["\u6E38\u620F\u540D", ticket.gamename],
    ["\u7528\u6237\u90AE\u7BB1", ticket.email],
    ["\u63D0\u4EA4\u65F6\u95F4", ticket.createdAt]
  ].map(([k, v]) => `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#b89aa8;font-size:13px;white-space:nowrap;vertical-align:top;">${escHtml(k)}</td>
      <td style="padding:6px 0;color:#6b5560;font-size:14px;vertical-align:top;overflow-wrap:anywhere;">${escHtml(v)}</td>
    </tr>`).join("");
  return emailShell("\u6536\u5230\u65B0\u5DE5\u5355", `
<p>\u6709\u7528\u6237\u63D0\u4EA4\u4E86\u65B0\u5DE5\u5355\uFF0C\u8BF7\u53CA\u65F6\u5904\u7406\uFF1A</p>
<table style="border-collapse:collapse;margin:16px 0;width:100%;">${rows}</table>
<div style="background:#fdf0f5;border:1px solid #f3dce8;border-radius:12px;padding:14px 16px;">
  <div style="font-size:12px;color:#b89aa8;margin-bottom:6px;">\u7528\u6237\u7559\u8A00\uFF1A</div>
  <div style="color:#6b5560;font-size:14px;line-height:1.9;white-space:pre-wrap;">${escHtml(ticket.content)}</div>
</div>
<p style="color:#b89aa8;font-size:12px;">\u8BF7\u524D\u5F80\u7BA1\u7406\u540E\u53F0\u5904\u7406\uFF1Ahttps://releases.camzy.uno/tickets</p>`);
}
__name(notifyAdminEmailHtml, "notifyAdminEmailHtml");
__name2(notifyAdminEmailHtml, "notifyAdminEmailHtml");
__name22(notifyAdminEmailHtml, "notifyAdminEmailHtml");
__name222(notifyAdminEmailHtml, "notifyAdminEmailHtml");
__name2222(notifyAdminEmailHtml, "notifyAdminEmailHtml");
__name22222(notifyAdminEmailHtml, "notifyAdminEmailHtml");
function officialFroms(env) {
  let list = [];
  try {
    const l = JSON.parse(env.MAIL_FROM_LIST || "[]");
    if (Array.isArray(l)) list = l;
  } catch (_) {
  }
  if (!list.length && env.MAIL_FROM) list = [env.MAIL_FROM];
  return list.map((s) => {
    const m = String(s).match(/<([^>]+)>/);
    return m && m[1] || String(s).trim();
  }).filter(Boolean);
}
__name(officialFroms, "officialFroms");
__name2(officialFroms, "officialFroms");
__name22(officialFroms, "officialFroms");
__name222(officialFroms, "officialFroms");
__name2222(officialFroms, "officialFroms");
__name22222(officialFroms, "officialFroms");
async function handleTicketInfo(env) {
  return json({ official: officialFroms(env) });
}
__name(handleTicketInfo, "handleTicketInfo");
__name2(handleTicketInfo, "handleTicketInfo");
__name22(handleTicketInfo, "handleTicketInfo");
__name222(handleTicketInfo, "handleTicketInfo");
__name2222(handleTicketInfo, "handleTicketInfo");
__name22222(handleTicketInfo, "handleTicketInfo");
function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
__name(isValidEmail, "isValidEmail");
__name2(isValidEmail, "isValidEmail");
__name22(isValidEmail, "isValidEmail");
__name222(isValidEmail, "isValidEmail");
__name2222(isValidEmail, "isValidEmail");
__name22222(isValidEmail, "isValidEmail");
async function getNotifyEmails(env) {
  const raw = await env.MODS_KV.get("ticket:notify-emails");
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    } catch (_) {
    }
  }
  const def = env.ADMIN_EMAIL ? [env.ADMIN_EMAIL] : [];
  await env.MODS_KV.put("ticket:notify-emails", JSON.stringify(def));
  return def;
}
__name(getNotifyEmails, "getNotifyEmails");
__name2(getNotifyEmails, "getNotifyEmails");
__name22(getNotifyEmails, "getNotifyEmails");
__name222(getNotifyEmails, "getNotifyEmails");
__name2222(getNotifyEmails, "getNotifyEmails");
__name22222(getNotifyEmails, "getNotifyEmails");
function ticketId(d) {
  const p = /* @__PURE__ */ __name2222((n, l = 2) => String(n).padStart(l, "0"), "p");
  return `T${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}${Math.floor(100 + Math.random() * 900)}`;
}
__name(ticketId, "ticketId");
__name2(ticketId, "ticketId");
__name22(ticketId, "ticketId");
__name222(ticketId, "ticketId");
__name2222(ticketId, "ticketId");
__name22222(ticketId, "ticketId");
async function erKvGet(env, k) {
  try {
    const row = await env.MODS_D1.prepare("SELECT v FROM er_kv WHERE k=? AND expires_at>?").bind(k, Date.now()).first();
    return row ? row.v : null;
  } catch (e) {
    return null;
  }
}
__name(erKvGet, "erKvGet");
__name2(erKvGet, "erKvGet");
__name22(erKvGet, "erKvGet");
async function erKvPut(env, k, v, ttlSec) {
  const exp = Date.now() + (ttlSec || 3600) * 1e3;
  try {
    await env.MODS_D1.prepare("INSERT INTO er_kv (k, v, expires_at) VALUES (?,?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v, expires_at=excluded.expires_at").bind(k, v, exp).run();
  } catch (e) {
  }
}
__name(erKvPut, "erKvPut");
__name2(erKvPut, "erKvPut");
__name22(erKvPut, "erKvPut");
async function erKvDel(env, k) {
  try {
    await env.MODS_D1.prepare("DELETE FROM er_kv WHERE k=?").bind(k).run();
  } catch (e) {
  }
}
__name(erKvDel, "erKvDel");
__name2(erKvDel, "erKvDel");
__name22(erKvDel, "erKvDel");
async function erKvCleanup(env) {
  try {
    await env.MODS_D1.prepare("DELETE FROM er_kv WHERE expires_at<=?").bind(Date.now()).run();
  } catch (e) {
  }
}
__name(erKvCleanup, "erKvCleanup");
__name2(erKvCleanup, "erKvCleanup");
__name22(erKvCleanup, "erKvCleanup");
async function ticketGet(env, id) {
  const row = await env.MODS_D1.prepare("SELECT data FROM tickets WHERE id=?").bind(id).first();
  if (!row) return null;
  try {
    return JSON.parse(row.data);
  } catch (_) {
    return null;
  }
}
__name(ticketGet, "ticketGet");
__name2(ticketGet, "ticketGet");
__name22(ticketGet, "ticketGet");
async function ticketPut(env, t) {
  const data = JSON.stringify(t);
  const created = t.createdAt || (/* @__PURE__ */ new Date()).toISOString();
  await env.MODS_D1.prepare("INSERT INTO tickets (id, data, createdAt) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data").bind(t.id, data, created).run();
}
__name(ticketPut, "ticketPut");
__name2(ticketPut, "ticketPut");
__name22(ticketPut, "ticketPut");
async function ticketList(env, limit = 300) {
  const rows = await env.MODS_D1.prepare("SELECT data FROM tickets ORDER BY createdAt DESC LIMIT ?").bind(limit).all();
  return (rows.results || []).map((r) => JSON.parse(r.data));
}
__name(ticketList, "ticketList");
__name2(ticketList, "ticketList");
__name22(ticketList, "ticketList");
async function ticketDelete(env, id) {
  await env.MODS_D1.prepare("DELETE FROM tickets WHERE id=?").bind(id).run();
}
__name(ticketDelete, "ticketDelete");
__name2(ticketDelete, "ticketDelete");
__name22(ticketDelete, "ticketDelete");
async function migrateTicketsFromKV(env) {
  try {
    const count = (await env.MODS_D1.prepare("SELECT COUNT(*) AS c FROM tickets").first())?.c || 0;
    if (count > 0) return;
    const indexRaw = await env.MODS_KV.get("ticket:index");
    const ids = indexRaw ? JSON.parse(indexRaw) : [];
    const stmts = [];
    for (const id of ids) {
      const raw = await env.MODS_KV.get(`ticket:${id}`);
      if (!raw) continue;
      let t;
      try {
        t = JSON.parse(raw);
      } catch (_) {
        continue;
      }
      if (!t || !t.id) continue;
      stmts.push(env.MODS_D1.prepare("INSERT OR IGNORE INTO tickets (id, data, createdAt) VALUES (?,?,?)").bind(t.id, JSON.stringify(t), t.createdAt || ""));
    }
    if (!stmts.length) return;
    await env.MODS_D1.batch(stmts);
    for (const id of ids) await env.MODS_KV.delete(`ticket:${id}`).catch(() => {
    });
    await env.MODS_KV.delete("ticket:index").catch(() => {
    });
    console.log("[ticket-migrate]", "migrated", stmts.length, "tickets from KV to D1");
  } catch (e) {
    console.error("[ticket-migrate]", e.message);
  }
}
__name(migrateTicketsFromKV, "migrateTicketsFromKV");
__name2(migrateTicketsFromKV, "migrateTicketsFromKV");
__name22(migrateTicketsFromKV, "migrateTicketsFromKV");
async function handleTicketSubmit(request, env) {
  try {
    const body = await request.json().catch(() => ({}));
    const nickname = String(body.nickname || "").trim();
    const gamename = String(body.gamename || "").trim();
    const email = String(body.email || "").trim();
    const content = String(body.content || "").trim();
    if (!nickname || !gamename || !email || !content) {
      return json({ error: "\u8BF7\u586B\u5199\u7B80\u79F0\u3001\u6E38\u620F\u540D\u3001\u90AE\u7BB1\u548C\u7559\u8A00\u5185\u5BB9" }, 400);
    }
    if (nickname.length > 20 || gamename.length > 40 || content.length > 5e3) {
      return json({ error: "\u5185\u5BB9\u957F\u5EA6\u8D85\u51FA\u9650\u5236" }, 400);
    }
    if (!isValidEmail(email)) return json({ error: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E" }, 400);
    const code = String(Math.floor(1e5 + Math.random() * 9e5));
    const pending = { nickname, gamename, email, content, code, at: (/* @__PURE__ */ new Date()).toISOString() };
    await erKvPut(env, `tverify:${email.toLowerCase()}`, JSON.stringify(pending), 600);
    try {
      await sendEmail(
        env,
        email,
        "\u3010\u68A6\u4E4B\u97F5\u5DE5\u5355\u3011\u90AE\u7BB1\u9A8C\u8BC1\u7801",
        `\u4F60\u597D ${nickname} \uFF1A

\u4F60\u6B63\u5728\u68A6\u4E4B\u97F5\u63D0\u4EA4\u5DE5\u5355\uFF0C\u4F60\u7684\u9A8C\u8BC1\u7801\u662F\uFF1A${code}

\u8BF7\u5728 10 \u5206\u949F\u5185\u586B\u5199\u9A8C\u8BC1\u7801\u5B8C\u6210\u63D0\u4EA4\u3002\u5982\u975E\u672C\u4EBA\u64CD\u4F5C\uFF0C\u8BF7\u5FFD\u7565\u672C\u90AE\u4EF6\u3002

\u2014\u2014 \u68A6\u4E4B\u97F5\u5DE5\u5355\u7CFB\u7EDF`,
        verifyEmailHtml(nickname, code)
      );
    } catch (e) {
      await erKvDel(env, `tverify:${email.toLowerCase()}`);
      return json({ error: "\u9A8C\u8BC1\u7801\u90AE\u4EF6\u53D1\u9001\u5931\u8D25\uFF1A" + e.message }, 502);
    }
    return json({ ok: true, message: `\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001\u5230 ${email}\uFF0C\u8BF7\u5728 10 \u5206\u949F\u5185\u586B\u5199` });
  } catch (e) {
    return json({ error: e.message || "\u63D0\u4EA4\u5931\u8D25" }, 500);
  }
}
__name(handleTicketSubmit, "handleTicketSubmit");
__name2(handleTicketSubmit, "handleTicketSubmit");
__name22(handleTicketSubmit, "handleTicketSubmit");
__name222(handleTicketSubmit, "handleTicketSubmit");
__name2222(handleTicketSubmit, "handleTicketSubmit");
__name22222(handleTicketSubmit, "handleTicketSubmit");
async function handleTicketVerify(request, env, ctx) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "").trim();
    const raw = await erKvGet(env, `tverify:${email}`);
    if (!raw) return json({ error: "\u9A8C\u8BC1\u7801\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u63D0\u4EA4" }, 400);
    const pending = JSON.parse(raw);
    if (pending.code !== code) return json({ error: "\u9A8C\u8BC1\u7801\u4E0D\u6B63\u786E" }, 400);
    await erKvDel(env, `tverify:${email}`);
    const id = ticketId(/* @__PURE__ */ new Date());
    const ticket = {
      id,
      nickname: pending.nickname,
      gamename: pending.gamename,
      email: pending.email,
      content: pending.content,
      status: "new",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      replies: []
    };
    await ticketPut(env, ticket);
    const proc = autoProcessTicket(env, id);
    if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(proc);
    else await proc;
    return json({ ok: true, id, message: "\u5DE5\u5355\u63D0\u4EA4\u6210\u529F" });
  } catch (e) {
    return json({ error: e.message || "\u9A8C\u8BC1\u5931\u8D25" }, 500);
  }
}
__name(handleTicketVerify, "handleTicketVerify");
__name2(handleTicketVerify, "handleTicketVerify");
__name22(handleTicketVerify, "handleTicketVerify");
__name222(handleTicketVerify, "handleTicketVerify");
__name2222(handleTicketVerify, "handleTicketVerify");
__name22222(handleTicketVerify, "handleTicketVerify");
function clientIP(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
}
__name(clientIP, "clientIP");
__name2(clientIP, "clientIP");
__name22(clientIP, "clientIP");
async function checkRateLimit(env, kind, key, limit, windowSeconds) {
  const now = Date.now();
  const cutoff = now - windowSeconds * 1e3;
  try {
    const row = await env.MODS_D1.prepare("SELECT ts FROM er_rl WHERE kind=? AND k=?").bind(kind, key).first();
    let recent = [];
    if (row && row.ts) {
      try {
        recent = JSON.parse(row.ts);
      } catch (_) {
        recent = [];
      }
      recent = recent.filter((t) => t > cutoff);
    }
    if (recent.length >= limit) {
      const oldest = recent[0] || now;
      return { error: "\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5", retryAfter: Math.max(1, Math.ceil((oldest + windowSeconds * 1e3 - now) / 1e3)) };
    }
    recent.push(now);
    recent = recent.filter((t) => t > cutoff);
    await env.MODS_D1.prepare("INSERT INTO er_rl (kind, k, ts) VALUES (?,?,?) ON CONFLICT(kind,k) DO UPDATE SET ts=excluded.ts").bind(kind, key, JSON.stringify(recent)).run();
    return null;
  } catch (e) {
    return null;
  }
}
__name(checkRateLimit, "checkRateLimit");
__name2(checkRateLimit, "checkRateLimit");
__name22(checkRateLimit, "checkRateLimit");
function extractLogsFromZip(buf, maxFiles, maxTotalBytes, maxPerFileBytes, maxTextBytes) {
  let count = 0;
  let totalBytes = 0;
  let selectedBytes = 0;
  const isCandidate = /* @__PURE__ */ __name22((name) => {
    const n = String(name).replace(/\\/g, "/").split("/").pop() || "";
    const lower = n.toLowerCase();
    return lower.endsWith(".log") || lower.endsWith(".txt") || /(crash|hs_err|debug|latest|log)\./.test(lower);
  }, "isCandidate");
  let files;
  try {
    files = unzipSync(new Uint8Array(buf), {
      filter: /* @__PURE__ */ __name22((f) => {
        count++;
        if (count > maxFiles) throw new Error("\u538B\u7F29\u5305\u5185\u6587\u4EF6\u6570\u91CF\u8FC7\u591A");
        totalBytes += f.originalSize || f.size || 0;
        if (totalBytes > maxTotalBytes) throw new Error("\u538B\u7F29\u5305\u89E3\u538B\u540E\u4F53\u79EF\u8FC7\u5927\uFF0C\u7591\u4F3C zip \u70B8\u5F39");
        if (!isCandidate(f.name)) return false;
        if ((f.originalSize || f.size || 0) > maxPerFileBytes) return false;
        if (selectedBytes + (f.originalSize || f.size || 0) > maxTextBytes) return false;
        selectedBytes += f.originalSize || f.size || 0;
        return true;
      }, "filter")
    });
  } catch (e) {
    if (e && e.message && /\u538B\u7F29\u5305\u5185\u6587\u4EF6\u6570\u91CF\u8FC7\u591A|\u7591\u4F3C zip \u70B8\u5F39/.test(e.message)) throw e;
    throw new Error("\u538B\u7F29\u5305\u89E3\u538B\u5931\u8D25: " + (e && e.message || "\u65E0\u6CD5\u89E3\u6790\u6587\u4EF6"));
  }
  const decoder = new TextDecoder("utf-8", { fatal: false });
  const parts = [];
  let total = 0;
  for (const [path, data] of Object.entries(files)) {
    const text2 = decoder.decode(data);
    const tail = text2.length > maxPerFileBytes ? text2.slice(-maxPerFileBytes) : text2;
    parts.push(`\u3010\u6587\u4EF6 ${path}\u3011
${tail}`);
    total += tail.length + path.length + 6;
    if (total >= maxTextBytes) break;
  }
  return parts.join("\n\n").slice(-maxTextBytes);
}
__name(extractLogsFromZip, "extractLogsFromZip");
__name2(extractLogsFromZip, "extractLogsFromZip");
__name22(extractLogsFromZip, "extractLogsFromZip");
async function analyzeLogWithGLM(env, logText, meta) {
  const system = `\u4F60\u662F\u4E00\u540D\u8D44\u6DF1\u7684 Minecraft \u6A21\u7EC4\u5305\u6280\u672F\u652F\u6301\u5DE5\u7A0B\u5E08\uFF0C\u64C5\u957F\u9605\u8BFB\u6E38\u620F\u65E5\u5FD7\uFF08latest.log / crash-reports \u7B49\uFF09\u5E76\u5B9A\u4F4D\u5D29\u6E83\u539F\u56E0\u3002

\u3010\u786C\u6027\u8981\u6C42\u3011
1. \u53EA\u4F9D\u636E\u63D0\u4F9B\u7684\u65E5\u5FD7\u5185\u5BB9\u5206\u6790\uFF0C\u7EDD\u4E0D\u7F16\u9020\u65E5\u5FD7\u4E2D\u4E0D\u5B58\u5728\u7684\u4FE1\u606F\u3002
2. \u5982\u679C\u65E5\u5FD7\u4E0D\u8DB3\u4EE5\u786E\u5B9A\u539F\u56E0\uFF0C\u660E\u786E\u8BF4\u660E\u201C\u6839\u636E\u5F53\u524D\u65E5\u5FD7\u65E0\u6CD5\u5B8C\u5168\u786E\u5B9A\u201D\uFF0C\u5E76\u7ED9\u51FA\u6700\u53EF\u80FD\u7684\u6392\u67E5\u65B9\u5411\u3002
3. \u8F93\u51FA\u4F7F\u7528\u7B80\u4F53\u4E2D\u6587\u3001\u7ED3\u6784\u6E05\u6670\u3001\u53EF\u76F4\u63A5\u53D1\u9001\u7ED9\u73A9\u5BB6\u3002

\u3010\u8F93\u51FA\u683C\u5F0F\u3011\u7528 Markdown \u8F93\u51FA\u4EE5\u4E0B\u56DB\u4E2A\u7AE0\u8282\uFF08\u5FC5\u987B\u90FD\u542B\uFF09\uFF1A
- **\u57FA\u7840\u4FE1\u606F**\uFF1A\u4ECE\u65E5\u5FD7\u4E2D\u63D0\u53D6\u7684\u73AF\u5883\u4FE1\u606F\uFF0C\u5305\u62EC\u4F46\u4E0D\u9650\u4E8E\uFF1AMinecraft \u7248\u672C\u3001\u6A21\u7EC4\u52A0\u8F7D\u5668\uFF08Fabric/Forge/Quilt\u53CA\u5176\u7248\u672C\uFF09\u3001Java \u7248\u672C\u3001\u6A21\u7EC4\u6570\u91CF\u3001\u5DF2\u52A0\u8F7D\u7684\u5173\u952E\u6A21\u7EC4\uFF08\u5C24\u5176\u662F\u5F15\u53D1\u95EE\u9898\u7684\u6A21\u7EC4\uFF09\u3001\u64CD\u4F5C\u7CFB\u7EDF\uFF08\u82E5\u65E5\u5FD7\u6709\uFF09\u3002\u6BCF\u9879\u7528\u7B80\u77ED\u65AD\u53E5\uFF0C\u672A\u77E5\u7684\u6807\u6CE8\u201C\u672A\u77E5\u201D\u3002
- **\u5D29\u6E83\u539F\u56E0**\uFF1A\u7528 2-3 \u53E5\u8BDD\u6982\u62EC\u6700\u53EF\u80FD\u7684\u5D29\u6E83\u539F\u56E0\uFF0C\u6307\u660E\u662F\u54EA\u4E2A\u6A21\u7EC4/\u78C1\u6761\u5F15\u53D1\u3002
- **\u5173\u952E\u65E5\u5FD7\u8BC1\u636E**\uFF1A\u5217\u51FA 3-6 \u6761\u5BF9\u5224\u65AD\u6700\u6709\u7528\u7684\u65E5\u5FD7\u7247\u6BB5\u3002
- **\u89E3\u51B3\u65B9\u6848**\uFF1A\u7ED9\u51FA\u5206\u6B65\u9AA4\u3001\u53EF\u64CD\u4F5C\u7684\u89E3\u51B3\u5EFA\u8BAE\uFF08\u5982\u66F4\u65B0/\u5220\u9664\u67D0\u6A21\u7EC4\u3001\u8C03\u6574 Java \u53C2\u6570\u3001\u4FEE\u590D\u7F3A\u5931\u4F9D\u8D56\u7B49\uFF09\u3002
- **\u5982\u65E0\u6CD5\u786E\u5B9A**\uFF1A\u5217\u51FA\u9700\u8981\u73A9\u5BB6\u8865\u5145\u7684\u4FE1\u606F\u3002`;
  const user = `\u3010\u9519\u8BEF\u62A5\u544A\u4FE1\u606F\u3011
\u6E38\u620F\u540D\uFF1A${meta.gamename || "\u672A\u77E5"}
\u73A9\u5BB6\u63CF\u8FF0\uFF1A${meta.description || "\u65E0"}
\u4E0A\u4F20\u6587\u4EF6\u540D\uFF1A${meta.fileName || "\u672A\u77E5"}

\u3010\u65E5\u5FD7\u5185\u5BB9\u3011\uFF08\u622A\u53D6\u81EA\u4E0A\u4F20\u7684 zip\uFF09
${logText}`;
  return callGLM(env, system, user, parseInt(env.ERROR_REPORT_MAX_TOKENS || "1500", 10));
}
__name(analyzeLogWithGLM, "analyzeLogWithGLM");
__name2(analyzeLogWithGLM, "analyzeLogWithGLM");
__name22(analyzeLogWithGLM, "analyzeLogWithGLM");
async function handleErrorReportVerify(request, env) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    if (!isValidEmail(email)) return json({ error: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E" }, 400);
    const ip = clientIP(request);
    const vLimit = parseInt(env.ERROR_REPORT_VERIFY_LIMIT || "5", 10);
    const vWindow = parseInt(env.ERROR_REPORT_VERIFY_WINDOW || "3600", 10);
    const rlIp = await checkRateLimit(env, "verify-ip", ip, vLimit, vWindow);
    if (rlIp) return json({ error: rlIp.error, retry_after: rlIp.retryAfter }, 429, { "Retry-After": String(rlIp.retryAfter) });
    const rlMail = await checkRateLimit(env, "verify-mail", email, vLimit, vWindow);
    if (rlMail) return json({ error: rlMail.error, retry_after: rlMail.retryAfter }, 429, { "Retry-After": String(rlMail.retryAfter) });
    const cdRaw = await erKvGet(env, `verify-cd:${email}`);
    if (cdRaw) return json({ error: "\u53D1\u9001\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7 1 \u5206\u949F\u540E\u518D\u8BD5", retry_after: 60 }, 429, { "Retry-After": "60" });
    const code = String(Math.floor(1e5 + Math.random() * 9e5));
    const nickname = String(body.nickname || "\u73A9\u5BB6").trim().slice(0, 20);
    await erKvPut(env, `verify:${email}`, JSON.stringify({ email, code, at: (/* @__PURE__ */ new Date()).toISOString() }), 600);
    await erKvPut(env, `verify-cd:${email}`, "1", 60);
    try {
      await sendEmail(
        env,
        email,
        "\u3010\u68A6\u4E4B\u97F5\u3011\u9519\u8BEF\u62A5\u544A\u4E0A\u4F20\u90AE\u7BB1\u9A8C\u8BC1\u7801",
        `\u4F60\u597D ${nickname} \uFF1A

\u4F60\u6B63\u5728\u68A6\u4E4B\u97F5\u4E0A\u4F20\u9519\u8BEF\u62A5\u544A\uFF0C\u4F60\u7684\u9A8C\u8BC1\u7801\u662F\uFF1A${code}

\u8BF7\u5728 10 \u5206\u949F\u5185\u586B\u5199\u9A8C\u8BC1\u7801\u5E76\u5B8C\u6210\u4E0A\u4F20\u3002\u5982\u975E\u672C\u4EBA\u64CD\u4F5C\uFF0C\u8BF7\u5FFD\u7565\u672C\u90AE\u4EF6\u3002

\u2014\u2014 \u68A6\u4E4B\u97F5\u5DE5\u5355\u7CFB\u7EDF`,
        verifyEmailHtml(nickname, code)
      );
    } catch (e) {
      await erKvDel(env, `verify:${email}`);
      await erKvDel(env, `verify-cd:${email}`);
      return json({ error: "\u9A8C\u8BC1\u7801\u90AE\u4EF6\u53D1\u9001\u5931\u8D25\uFF1A" + e.message }, 502);
    }
    return json({ ok: true, message: `\u9A8C\u8BC1\u7801\u5DF2\u53D1\u9001\u5230 ${email}\uFF0C\u8BF7\u5728 10 \u5206\u949F\u5185\u586B\u5199` });
  } catch (e) {
    return json({ error: e.message || "\u9A8C\u8BC1\u5931\u8D25" }, 500);
  }
}
__name(handleErrorReportVerify, "handleErrorReportVerify");
__name2(handleErrorReportVerify, "handleErrorReportVerify");
__name22(handleErrorReportVerify, "handleErrorReportVerify");
async function handleErrorReportBind(request, env) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = String(body.id || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "").trim();
    if (!id) return json({ error: "\u8BF7\u63D0\u4F9B\u7528\u6237 ID" }, 400);
    if (id.length > 64) return json({ error: "ID \u8FC7\u957F" }, 400);
    if (!isValidEmail(email)) return json({ error: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E" }, 400);
    if (!code) return json({ error: "\u8BF7\u586B\u5199\u90AE\u7BB1\u9A8C\u8BC1\u7801" }, 400);
    const vRaw = await erKvGet(env, `verify:${email}`);
    if (!vRaw) return json({ error: "\u9A8C\u8BC1\u7801\u5DF2\u8FC7\u671F\u6216\u672A\u8BF7\u6C42\uFF0C\u8BF7\u91CD\u65B0\u83B7\u53D6" }, 400);
    const v = JSON.parse(vRaw);
    if (v.code !== code) return json({ error: "\u9A8C\u8BC1\u7801\u4E0D\u6B63\u786E" }, 400);
    await erKvDel(env, `verify:${email}`);
    const ttl = parseInt(env.ERROR_REPORT_BIND_TTL_DAYS || "30", 10) * 24 * 3600;
    await erKvPut(env, `bind:${id}`, JSON.stringify({ email, boundAt: (/* @__PURE__ */ new Date()).toISOString() }), ttl);
    return json({ ok: true, id, email, message: "\u90AE\u7BB1\u9A8C\u8BC1\u6210\u529F\uFF0C\u5DF2\u5C06\u7528\u6237 ID \u4E0E\u90AE\u7BB1\u7ED1\u5B9A\uFF0C\u4EE5\u540E\u4E0A\u4F20\u65E0\u9700\u518D\u8F93\u5165\u9A8C\u8BC1\u7801", ttl_days: parseInt(env.ERROR_REPORT_BIND_TTL_DAYS || "30", 10) });
  } catch (e) {
    return json({ error: e.message || "\u7ED1\u5B9A\u5931\u8D25" }, 500);
  }
}
__name(handleErrorReportBind, "handleErrorReportBind");
__name2(handleErrorReportBind, "handleErrorReportBind");
__name22(handleErrorReportBind, "handleErrorReportBind");
async function handleErrorReportUploadPage(request, env) {
  const noStore = { "Cache-Control": "no-store" };
  try {
    const q = new URL(request.url);
    const token = q.searchParams.get("token") || "";
    if (token) {
      const raw = await erKvGet(env, `session:${token}`);
      if (!raw) return json({ ok: true, valid: false, report_id: "", report_token: "" }, 200, noStore);
      const s = JSON.parse(raw);
      return json({
        ok: true,
        valid: !s.used,
        // 已使用（上传完成）则 false
        report_id: s.reportId || "",
        // 已上传则有报告号，未上传为空
        report_token: s.reportToken || ""
      }, 200, noStore);
    }
    const wantsJson = /application\/json/i.test(request.headers.get("Accept") || "");
    const st = randomHex(24);
    const ttl = parseInt(env.ERROR_REPORT_SESSION_TTL || "3600", 10);
    await erKvPut(env, `session:${st}`, JSON.stringify({ used: false, createdAt: (/* @__PURE__ */ new Date()).toISOString() }), ttl);
    if (wantsJson) {
      return json({ ok: true, token: st, valid: true, report_id: "", report_token: "" }, 200, noStore);
    }
    const page = `${env.BASE_URL || "https://releases.camzy.uno"}/error-report.html?token=${st}`;
    return Response.redirect(page, 302, { "Cache-Control": "no-store" });
  } catch (e) {
    return json({ error: e.message || "\u83B7\u53D6\u4E0A\u4F20\u9875\u9762\u5931\u8D25" }, 500, noStore);
  }
}
__name(handleErrorReportUploadPage, "handleErrorReportUploadPage");
__name2(handleErrorReportUploadPage, "handleErrorReportUploadPage");
__name22(handleErrorReportUploadPage, "handleErrorReportUploadPage");
async function handleErrorReportUpload(request, env, ctx) {
  try {
    const ip = clientIP(request);
    const limit = parseInt(env.ERROR_REPORT_RATE_LIMIT || "3", 10);
    const windowSec = parseInt(env.ERROR_REPORT_RATE_WINDOW || "3600", 10);
    const rlIp = await checkRateLimit(env, "ip", ip, limit, windowSec);
    if (rlIp) return json({ error: rlIp.error, retry_after: rlIp.retryAfter }, 429, { "Retry-After": String(rlIp.retryAfter) });
    const form = await request.formData().catch(() => null);
    if (!form) return json({ error: "\u4EC5\u652F\u6301 multipart/form-data \u4E0A\u4F20" }, 400);
    const session = String(form.get("session") || "").trim();
    const sRaw = await erKvGet(env, `session:${session}`);
    if (!sRaw) return json({ error: "\u4E0A\u4F20\u9875\u9762\u5DF2\u5931\u6548\u6216\u5DF2\u4F7F\u7528\uFF0C\u8BF7\u901A\u8FC7\u4E13\u7528\u5165\u53E3\u91CD\u65B0\u83B7\u53D6" }, 400);
    let sObj = null;
    try {
      sObj = JSON.parse(sRaw);
    } catch (_) {
    }
    if (sObj && sObj.used) return json({ error: "\u4E0A\u4F20\u9875\u9762\u5DF2\u4F7F\u7528\uFF0C\u4E0D\u53EF\u91CD\u590D\u4E0A\u4F20" }, 400);
    const file = form.get("file");
    if (!file || typeof file === "string") return json({ error: "\u672A\u6536\u5230\u6587\u4EF6\u5B57\u6BB5 file" }, 400);
    const email = String(form.get("email") || "").trim().toLowerCase();
    if (!isValidEmail(email)) return json({ error: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E" }, 400);
    const uid = String(form.get("id") || "").trim();
    const code = String(form.get("code") || "").trim();
    let verifiedVia = null;
    if (uid && uid.length <= 64) {
      const bindRaw = await erKvGet(env, `bind:${uid}`);
      if (bindRaw) {
        const b = JSON.parse(bindRaw);
        if (b.email === email) verifiedVia = "bind";
      }
    }
    if (!verifiedVia) {
      if (!code) return json({ error: "\u8BF7\u5148\u83B7\u53D6\u5E76\u586B\u5199\u90AE\u7BB1\u9A8C\u8BC1\u7801\uFF0C\u6216\u5148\u5B8C\u6210\u90AE\u7BB1\u7ED1\u5B9A" }, 400);
      const vRaw = await erKvGet(env, `verify:${email}`);
      if (!vRaw) return json({ error: "\u9A8C\u8BC1\u7801\u5DF2\u8FC7\u671F\u6216\u672A\u8BF7\u6C42\uFF0C\u8BF7\u91CD\u65B0\u83B7\u53D6" }, 400);
      const v = JSON.parse(vRaw);
      if (v.code !== code) return json({ error: "\u9A8C\u8BC1\u7801\u4E0D\u6B63\u786E" }, 400);
      await erKvDel(env, `verify:${email}`);
      if (uid && uid.length <= 64) {
        const ttl = parseInt(env.ERROR_REPORT_BIND_TTL_DAYS || "30", 10) * 24 * 3600;
        await erKvPut(env, `bind:${uid}`, JSON.stringify({ email, boundAt: (/* @__PURE__ */ new Date()).toISOString() }), ttl);
      }
      verifiedVia = "code";
    }
    const nickname = String(form.get("nickname") || "\u73A9\u5BB6").trim().slice(0, 20);
    const gamename = String(form.get("gamename") || "").trim().slice(0, 40);
    const description = String(form.get("description") || "").trim().slice(0, 2e3);
    const name = String(file.name || "");
    if (!/\.zip$/i.test(name)) return json({ error: "\u4EC5\u652F\u6301 .zip \u538B\u7F29\u5305" }, 400);
    const maxMB = parseInt(env.ERROR_REPORT_MAX_MB || "20", 10);
    const maxBytes = maxMB * 1024 * 1024;
    const buf = await file.arrayBuffer();
    if (buf.byteLength <= 0) return json({ error: "\u6587\u4EF6\u4E3A\u7A7A" }, 400);
    if (buf.byteLength > maxBytes) return json({ error: `\u6587\u4EF6\u8D85\u8FC7\u5927\u5C0F\u4E0A\u9650\uFF08${maxMB}MB\uFF09` }, 400);
    const rlMail = await checkRateLimit(env, "mail", email, limit, windowSec);
    if (rlMail) return json({ error: rlMail.error, retry_after: rlMail.retryAfter }, 429, { "Retry-After": String(rlMail.retryAfter) });
    const maxQueue = parseInt(env.ERROR_REPORT_MAX_QUEUE || "20", 10);
    const queuedCount = (await env.MODS_D1.prepare("SELECT COUNT(*) AS c FROM error_reports WHERE status IN ('queued','processing')").first())?.c || 0;
    if (queuedCount >= maxQueue) return json({ error: "\u5F53\u524D\u5206\u6790\u4EFB\u52A1\u7E41\u5FD9\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5" }, 429);
    const id = "ER" + Date.now().toString(36).toUpperCase() + randomHex(4).toUpperCase();
    const token = randomHex(24);
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const record = { id, token, uid: uid || null, email, nickname, gamename, description, fileName: name, size: buf.byteLength, status: "queued", createdAt: nowIso, updatedAt: nowIso, result: null, error: null, ticketId: null, attempts: 0, verifiedVia };
    await env.MODS_R2.put(`error-reports/${id}/original.zip`, buf, {
      httpMetadata: { contentType: "application/zip" },
      customMetadata: { email, uploadedAt: nowIso }
    });
    await env.MODS_D1.prepare("INSERT INTO error_reports (id, token, uid, email, nickname, gamename, description, fileName, size, status, createdAt, updatedAt, attempts, verifiedVia) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(id, token, uid || null, email, nickname, gamename, description, name, buf.byteLength, "queued", nowIso, nowIso, 0, verifiedVia).run();
    await erKvPut(env, `session:${session}`, JSON.stringify({
      used: true,
      reportId: id,
      reportToken: token,
      createdAt: sObj ? sObj.createdAt : nowIso,
      uploadedAt: nowIso
    }), 7 * 24 * 3600).catch(() => {
    });
    return json({ ok: true, report_id: id, status: "queued", message: "\u4E0A\u4F20\u6210\u529F\uFF0C\u5DF2\u5165\u961F\u7B49\u5F85\u5206\u6790\uFF0C\u7ED3\u679C\u5C06\u53D1\u9001\u5230\u4F60\u7684\u90AE\u7BB1\u5E76\u53EF\u901A\u8FC7\u67E5\u8BE2\u63A5\u53E3\u83B7\u53D6", poll: { method: "GET", path: `/api/error-reports/${id}`, token }, ttl_hours: 168 });
  } catch (e) {
    return json({ error: e.message || "\u4E0A\u4F20\u5931\u8D25" }, e.status || 500);
  }
}
__name(handleErrorReportUpload, "handleErrorReportUpload");
__name2(handleErrorReportUpload, "handleErrorReportUpload");
__name22(handleErrorReportUpload, "handleErrorReportUpload");
async function handleErrorReportLookup(request, env, id) {
  const record = await env.MODS_D1.prepare("SELECT * FROM error_reports WHERE id=?").bind(id).first();
  if (!record) return json({ error: "\u9519\u8BEF\u62A5\u544A\u4E0D\u5B58\u5728\u6216\u5DF2\u8FC7\u671F" }, 404);
  const q = new URL(request.url);
  const token = request.headers.get("X-Report-Token") || q.searchParams.get("token") || "";
  if (token !== record.token) return json({ error: "token \u4E0D\u6B63\u786E\uFF0C\u65E0\u6CD5\u67E5\u8BE2\u8BE5\u62A5\u544A" }, 403);
  return json({ ok: true, report_id: record.id, status: record.status, created_at: record.createdAt, updated_at: record.updatedAt, ticket_id: record.ticketId, result: record.status === "done" ? record.result : null, error: record.error });
}
__name(handleErrorReportLookup, "handleErrorReportLookup");
__name2(handleErrorReportLookup, "handleErrorReportLookup");
__name22(handleErrorReportLookup, "handleErrorReportLookup");
async function deleteErrorReportR2(env, id) {
  try {
    await env.MODS_R2.delete(`error-reports/${id}/original.zip`);
  } catch (_) {
  }
}
__name(deleteErrorReportR2, "deleteErrorReportR2");
__name2(deleteErrorReportR2, "deleteErrorReportR2");
__name22(deleteErrorReportR2, "deleteErrorReportR2");
async function processErrorReport(env, id) {
  try {
    const record = await env.MODS_D1.prepare("SELECT * FROM error_reports WHERE id=?").bind(id).first();
    if (!record) return;
    if (record.status !== "queued" && record.status !== "processing") return;
    record.status = "processing";
    record.attempts = (record.attempts || 0) + 1;
    record.processingAt = (/* @__PURE__ */ new Date()).toISOString();
    record.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await env.MODS_D1.prepare("UPDATE error_reports SET status=?, attempts=?, processingAt=?, updatedAt=? WHERE id=?").bind(record.status, record.attempts, record.processingAt, record.updatedAt, id).run();
    const obj = await env.MODS_R2.get(`error-reports/${id}/original.zip`);
    if (!obj) throw new Error("\u539F\u59CB\u6587\u4EF6\u4E0D\u5B58\u5728");
    const buf = await obj.arrayBuffer();
    const maxTotal = parseInt(env.ERROR_REPORT_MAX_UNCOMPRESSED_MB || "200", 10) * 1024 * 1024;
    const maxPer = parseInt(env.ERROR_REPORT_MAX_FILE_MB || "25", 10) * 1024 * 1024;
    const maxText = parseInt(env.ERROR_REPORT_MAX_TEXT || "120000", 10);
    const logText = extractLogsFromZip(buf, 200, maxTotal, maxPer, maxText);
    if (!logText) throw new Error("\u538B\u7F29\u5305\u5185\u672A\u627E\u5230\u53EF\u5206\u6790\u7684\u65E5\u5FD7\u6587\u4EF6\uFF08.log/.txt/\u5D29\u6E83\u62A5\u544A\uFF09");
    const result = await analyzeLogWithGLM(env, logText, record);
    record.status = "done";
    record.result = result;
    record.error = null;
    record.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    try {
      const tid = ticketId(/* @__PURE__ */ new Date());
      const ticket = { id: tid, nickname: record.nickname || "\u73A9\u5BB6", gamename: record.gamename || "", email: record.email, content: `\u3010\u9519\u8BEF\u62A5\u544A\u81EA\u52A8\u5206\u6790\u3011
\u6587\u4EF6\u540D\uFF1A${record.fileName}
\u73A9\u5BB6\u63CF\u8FF0\uFF1A${record.description || "\u65E0"}

${record.result}`, status: "auto", source: "error-report", errorReportId: id, createdAt: (/* @__PURE__ */ new Date()).toISOString(), replies: [{ from: "ai", auto: true, content: record.result, at: (/* @__PURE__ */ new Date()).toISOString() }] };
      await ticketPut(env, ticket);
      record.ticketId = tid;
      await notifyAdminNewTicket(env, ticket);
      const mailBody = `\u4F60\u597D ${record.nickname || "\u73A9\u5BB6"}\uFF1A

\u6211\u4EEC\u5DF2\u901A\u8FC7 AI \u5206\u6790\u4E86\u4F60\u4E0A\u4F20\u7684\u9519\u8BEF\u62A5\u544A\uFF08${record.fileName}\uFF09\uFF0C\u5206\u6790\u7ED3\u679C\u5982\u4E0B\uFF1A

${record.result}

\u5982\u95EE\u9898\u4ECD\u672A\u89E3\u51B3\uFF0C\u6B22\u8FCE\u5230 ${env.BASE_URL || "https://releases.camzy.uno"}/ticket.html \u63D0\u4EA4\u5DE5\u5355\u7EE7\u7EED\u6C9F\u901A\u3002

\u2014\u2014 \u68A6\u4E4B\u97F5\u5DE5\u5355\u7CFB\u7EDF`;
      await sendEmail(env, record.email, "\u3010\u68A6\u4E4B\u97F5\u3011\u4F60\u7684\u9519\u8BEF\u62A5\u544A\u5206\u6790\u7ED3\u679C", mailBody, emailShell("\u9519\u8BEF\u62A5\u544A\u5206\u6790\u7ED3\u679C", mdToHtml(record.result)));
    } catch (e) {
      console.error("[error-report-mail]", e.message);
      record.emailError = e.message;
    }
    await deleteErrorReportR2(env, id);
    record.r2DeletedAt = (/* @__PURE__ */ new Date()).toISOString();
    await env.MODS_D1.prepare("UPDATE error_reports SET status=?, result=?, error=?, updatedAt=?, ticketId=?, emailError=?, r2DeletedAt=? WHERE id=?").bind(record.status, record.result, record.error, record.updatedAt, record.ticketId, record.emailError, record.r2DeletedAt, id).run();
  } catch (e) {
    console.error("[error-report]", id, e.message);
    try {
      const rec = await env.MODS_D1.prepare("SELECT * FROM error_reports WHERE id=?").bind(id).first();
      if (rec) {
        rec.status = "error";
        rec.error = e.message || "\u5206\u6790\u5931\u8D25";
        rec.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
        await env.MODS_D1.prepare("UPDATE error_reports SET status=?, error=?, updatedAt=? WHERE id=?").bind(rec.status, rec.error, rec.updatedAt, id).run();
      }
    } catch (_) {
    }
  }
}
__name(processErrorReport, "processErrorReport");
__name2(processErrorReport, "processErrorReport");
__name22(processErrorReport, "processErrorReport");
async function migrateErrorReportsFromKV(env) {
  try {
    const count = (await env.MODS_D1.prepare("SELECT COUNT(*) AS c FROM error_reports").first())?.c || 0;
    if (count > 0) return;
    const list = await env.MODS_KV.list({ prefix: "er:report:" });
    const keys = list && list.keys || [];
    if (!keys.length) return;
    const stmts = [];
    for (const { name } of keys) {
      const raw = await env.MODS_KV.get(name);
      if (!raw) continue;
      let rec;
      try {
        rec = JSON.parse(raw);
      } catch (_) {
        continue;
      }
      if (!rec.id) continue;
      const nn = /* @__PURE__ */ __name((v) => v === void 0 ? null : v, "nn");
      stmts.push(env.MODS_D1.prepare("INSERT OR IGNORE INTO error_reports (id, token, uid, email, nickname, gamename, description, fileName, size, status, createdAt, updatedAt, processingAt, result, error, ticketId, attempts, verifiedVia, emailError, r2DeletedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(nn(rec.id), nn(rec.token), nn(rec.uid), nn(rec.email), nn(rec.nickname), nn(rec.gamename), nn(rec.description), nn(rec.fileName), nn(rec.size), nn(rec.status), nn(rec.createdAt), nn(rec.updatedAt), nn(rec.processingAt), nn(rec.result), nn(rec.error), nn(rec.ticketId), rec.attempts || 0, nn(rec.verifiedVia), nn(rec.emailError), nn(rec.r2DeletedAt)));
    }
    if (!stmts.length) return;
    await env.MODS_D1.batch(stmts);
    for (const { name } of keys) await env.MODS_KV.delete(name).catch(() => {
    });
    await env.MODS_KV.delete("er:queue").catch(() => {
    });
    await env.MODS_KV.delete("er:lock").catch(() => {
    });
    console.log("[error-report-migrate]", "migrated", stmts.length, "records from KV to D1");
  } catch (e) {
    console.error("[error-report-migrate]", e.message);
  }
}
__name(migrateErrorReportsFromKV, "migrateErrorReportsFromKV");
__name2(migrateErrorReportsFromKV, "migrateErrorReportsFromKV");
__name22(migrateErrorReportsFromKV, "migrateErrorReportsFromKV");
async function drainErrorReportQueue(env, ctx) {
  try {
    await migrateErrorReportsFromKV(env);
    const maxPerRun = parseInt(env.ERROR_REPORT_CRON_MAX || "2", 10);
    const maxRetry = parseInt(env.ERROR_REPORT_MAX_RETRY || "2", 10);
    const leaseMs = parseInt(env.ERROR_REPORT_LEASE_MS || "900000", 10);
    const budgetMs = parseInt(env.ERROR_REPORT_CRON_BUDGET_MS || "720000", 10);
    const deadline = Date.now() + budgetMs;
    const nowIso = /* @__PURE__ */ __name(() => (/* @__PURE__ */ new Date()).toISOString(), "nowIso");
    await env.MODS_D1.prepare(
      "UPDATE error_reports SET status='queued', updatedAt=? WHERE status='processing' AND processingAt IS NOT NULL AND (julianday(?) - julianday(processingAt)) * 86400000 >= ?"
    ).bind(nowIso(), nowIso(), leaseMs).run();
    const stale = await env.MODS_D1.prepare("SELECT id FROM error_reports WHERE status='error' AND attempts < ?").bind(maxRetry).all();
    for (const row of stale.results || []) {
      await env.MODS_D1.prepare("UPDATE error_reports SET status='queued', updatedAt=? WHERE id=?").bind(nowIso(), row.id).run();
    }
    const exhausted = await env.MODS_D1.prepare("SELECT id FROM error_reports WHERE status='error' AND attempts >= ?").bind(maxRetry).all();
    for (const row of exhausted.results || []) {
      await deleteErrorReportR2(env, row.id);
      await env.MODS_D1.prepare("UPDATE error_reports SET error=?, r2DeletedAt=?, updatedAt=? WHERE id=?").bind("\u91CD\u8BD5\u8017\u5C3D\uFF0C\u5DF2\u653E\u5F03", nowIso(), nowIso(), row.id).run();
    }
    let processed = 0;
    while (processed < maxPerRun && Date.now() < deadline) {
      const claimed = await env.MODS_D1.prepare(
        "UPDATE error_reports SET status='processing', processingAt=?, updatedAt=? WHERE id IN (SELECT id FROM error_reports WHERE status='queued' ORDER BY createdAt ASC LIMIT 1) RETURNING id"
      ).bind(nowIso(), nowIso()).first();
      if (!claimed) break;
      await processErrorReport(env, claimed.id);
      processed++;
    }
  } catch (e) {
    console.error("[error-report-drain]", e.message);
  }
}
__name(drainErrorReportQueue, "drainErrorReportQueue");
__name2(drainErrorReportQueue, "drainErrorReportQueue");
__name22(drainErrorReportQueue, "drainErrorReportQueue");
__name222(drainErrorReportQueue, "drainErrorReportQueue");
async function handleAdminTickets(env) {
  const all = await ticketList(env, 300);
  const tickets = all.map((t) => ({
    id: t.id,
    nickname: t.nickname,
    gamename: t.gamename,
    email: t.email,
    status: t.status,
    createdAt: t.createdAt,
    replyCount: (t.replies || []).length,
    content: t.content
  }));
  return json({ tickets });
}
__name(handleAdminTickets, "handleAdminTickets");
__name2(handleAdminTickets, "handleAdminTickets");
__name22(handleAdminTickets, "handleAdminTickets");
__name222(handleAdminTickets, "handleAdminTickets");
__name2222(handleAdminTickets, "handleAdminTickets");
__name22222(handleAdminTickets, "handleAdminTickets");
async function handleAdminTicketDetail(env, id) {
  const t = await ticketGet(env, id);
  if (!t) return json({ error: "\u5DE5\u5355\u4E0D\u5B58\u5728" }, 404);
  return json({ ticket: t });
}
__name(handleAdminTicketDetail, "handleAdminTicketDetail");
__name2(handleAdminTicketDetail, "handleAdminTicketDetail");
__name22(handleAdminTicketDetail, "handleAdminTicketDetail");
__name222(handleAdminTicketDetail, "handleAdminTicketDetail");
__name2222(handleAdminTicketDetail, "handleAdminTicketDetail");
__name22222(handleAdminTicketDetail, "handleAdminTicketDetail");
async function handleAdminTicketReply(request, env, id) {
  try {
    const ticket = await ticketGet(env, id);
    if (!ticket) return json({ error: "\u5DE5\u5355\u4E0D\u5B58\u5728" }, 404);
    const body = await request.json().catch(() => ({}));
    const content = String(body.content || "").trim();
    if (!content) return json({ error: "\u56DE\u590D\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A" }, 400);
    ticket.replies = ticket.replies || [];
    ticket.replies.push({ from: "admin", content, at: (/* @__PURE__ */ new Date()).toISOString() });
    if (ticket.status !== "closed") ticket.status = "replied";
    await ticketPut(env, ticket);
    try {
      const body2 = `\u4F60\u597D ${ticket.nickname} \uFF1A

\u7BA1\u7406\u5458\u56DE\u590D\u4E86\u4F60\u7684\u5DE5\u5355 ${id}\uFF1A

${content}

\u2014\u2014 \u68A6\u4E4B\u97F5\u5DE5\u5355\u7CFB\u7EDF`;
      await sendEmail(
        env,
        ticket.email,
        `\u3010\u68A6\u4E4B\u97F5\u5DE5\u5355\u3011\u7BA1\u7406\u5458\u56DE\u590D\u4E86\u4F60\u7684\u5DE5\u5355 ${id}`,
        body2,
        emailShell("\u7BA1\u7406\u5458\u56DE\u590D", mdToHtml(body2))
      );
    } catch (e) {
      console.error("[ticket-reply-mail]", e.message);
    }
    return json({ ok: true, ticket });
  } catch (e) {
    return json({ error: e.message || "\u56DE\u590D\u5931\u8D25" }, 500);
  }
}
__name(handleAdminTicketReply, "handleAdminTicketReply");
__name2(handleAdminTicketReply, "handleAdminTicketReply");
__name22(handleAdminTicketReply, "handleAdminTicketReply");
__name222(handleAdminTicketReply, "handleAdminTicketReply");
__name2222(handleAdminTicketReply, "handleAdminTicketReply");
__name22222(handleAdminTicketReply, "handleAdminTicketReply");
async function handleAdminTicketClose(env, id) {
  const ticket = await ticketGet(env, id);
  if (!ticket) return json({ error: "\u5DE5\u5355\u4E0D\u5B58\u5728" }, 404);
  ticket.status = "closed";
  await ticketPut(env, ticket);
  try {
    const body = `\u4F60\u597D ${ticket.nickname} \uFF1A

\u4F60\u7684\u5DE5\u5355 ${id} \u5DF2\u7ECF\u5904\u7406\u5B8C\u6210\u5E76\u5173\u95ED\u3002

\u5982\u679C\u4F60\u8FD8\u6709\u5176\u4ED6\u95EE\u9898\uFF0C\u968F\u65F6\u53EF\u4EE5\u518D\u6B21\u63D0\u4EA4\u65B0\u5DE5\u5355\u3002

\u611F\u8C22\u4F60\u7684\u53CD\u9988\uFF01

\u2014\u2014 \u68A6\u4E4B\u97F5\u5DE5\u5355\u7CFB\u7EDF`;
    await sendEmail(
      env,
      ticket.email,
      `\u3010\u68A6\u4E4B\u97F5\u5DE5\u5355\u3011\u5DE5\u5355 ${id} \u5DF2\u5173\u95ED`,
      body,
      emailShell("\u5DE5\u5355\u5DF2\u5173\u95ED", mdToHtml(body))
    );
  } catch (e) {
    console.error("[ticket-close-mail]", e.message);
  }
  return json({ ok: true, ticket });
}
__name(handleAdminTicketClose, "handleAdminTicketClose");
__name2(handleAdminTicketClose, "handleAdminTicketClose");
__name22(handleAdminTicketClose, "handleAdminTicketClose");
__name222(handleAdminTicketClose, "handleAdminTicketClose");
__name2222(handleAdminTicketClose, "handleAdminTicketClose");
__name22222(handleAdminTicketClose, "handleAdminTicketClose");
function bigrams(s) {
  const clean = String(s || "").toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, "");
  const set = /* @__PURE__ */ new Set();
  for (let i2 = 0; i2 < clean.length - 1; i2++) set.add(clean.slice(i2, i2 + 2));
  return set;
}
__name(bigrams, "bigrams");
__name2(bigrams, "bigrams");
__name22(bigrams, "bigrams");
__name222(bigrams, "bigrams");
__name2222(bigrams, "bigrams");
function stripHtml(html) {
  return String(html || "").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<nav[\s\S]*?<\/nav>/gi, " ").replace(/<header[\s\S]*?<\/header>/gi, " ").replace(/<footer[\s\S]*?<\/footer>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}
__name(stripHtml, "stripHtml");
__name2(stripHtml, "stripHtml");
__name22(stripHtml, "stripHtml");
__name222(stripHtml, "stripHtml");
__name2222(stripHtml, "stripHtml");
async function fetchWikiContext(env, question) {
  const base = (env.WIKI_BASE || "https://camzy.uno").replace(/\/$/, "");
  try {
    const sm = await (await fetch(`${base}/sitemap.xml`, { cf: { cacheTtl: 600 } })).text();
    const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const pages = locs.map((u) => {
      try {
        return new URL(u).pathname;
      } catch (_) {
        return null;
      }
    }).filter((p) => p && (/^\/posts\/[^/]+\/$/.test(p) || /^\/wiki\/[^/]+\/$/.test(p)));
    if (!pages.length) return { text: "", sources: [] };
    const qset = bigrams(question);
    const scored = [];
    for (const p of pages) {
      let text3 = "";
      try {
        text3 = stripHtml(await (await fetch(base + p)).text());
      } catch (_) {
        continue;
      }
      if (!text3) continue;
      let score = 0;
      for (const g of qset) if (text3.includes(g)) score++;
      scored.push({ path: p, text: text3, score });
    }
    scored.sort((a, b) => b.score - a.score);
    const top = scored.filter((s) => s.score > 0).slice(0, 4);
    const chosen = top.length ? top : scored.slice(0, 3);
    let text2 = "", sources = [];
    for (const c of chosen) {
      if (text2.length >= 14e3) break;
      text2 += `

\u3010\u9875\u9762 ${base}${c.path}\u3011
${c.text.slice(0, 4e3)}`;
      sources.push(base + c.path);
    }
    return { text: text2.trim(), sources };
  } catch (e) {
    console.error("[wiki-context]", e.message);
    return { text: "", sources: [] };
  }
}
__name(fetchWikiContext, "fetchWikiContext");
__name2(fetchWikiContext, "fetchWikiContext");
__name22(fetchWikiContext, "fetchWikiContext");
__name222(fetchWikiContext, "fetchWikiContext");
__name2222(fetchWikiContext, "fetchWikiContext");
async function callGLM(env, system, user, maxTokens = 1200) {
  const key = env.GLM_API_KEY;
  if (!key) throw new Error("\u672A\u914D\u7F6E\u667A\u8C31 API Key\uFF08GLM_API_KEY\uFF09");
  let budget = maxTokens;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: env.GLM_MODEL || "glm-4.7-flash",
        thinking: { type: "enabled" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: 0.3,
        max_tokens: budget
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const errMsg = data.error && (data.error.message || data.error.code) || `\u667A\u8C31\u63A5\u53E3\u9519\u8BEF (${res.status})`;
      const retriable = res.status === 429 || res.status >= 500 || /\u8BBF\u95EE\u91CF\u8FC7\u5927|\u9650\u6D41|overload|rate.?limit/i.test(String(errMsg));
      if (!retriable || attempt === 2) throw new Error(errMsg);
      await new Promise((r) => setTimeout(r, 700 * (attempt + 1)));
      continue;
    }
    const msg = data.choices && data.choices[0] && data.choices[0].message;
    const content = msg && (msg.content || msg.reasoning_content);
    if (content) return content;
    if (data.choices && data.choices[0] && data.choices[0].finish_reason === "length") {
      budget = Math.min(12e3, Math.max(budget * 3, 4e3));
      continue;
    }
    break;
  }
  throw new Error("\u667A\u8C31\u672A\u8FD4\u56DE\u5185\u5BB9");
}
__name(callGLM, "callGLM");
__name2(callGLM, "callGLM");
__name22(callGLM, "callGLM");
__name222(callGLM, "callGLM");
__name2222(callGLM, "callGLM");
__name22222(callGLM, "callGLM");
async function handleAdminTicketAi(request, env, id) {
  try {
    const t = await ticketGet(env, id);
    if (!t) return json({ error: "\u5DE5\u5355\u4E0D\u5B58\u5728" }, 404);
    const ctx = await fetchWikiContext(env, `${t.gamename || ""} ${t.content || ""}`);
    const system = `\u4F60\u662F\u300C\u68A6\u4E4B\u97F5\u300DMinecraft \u6A21\u7EC4\u5305\u5B98\u65B9\u5BA2\u670D\uFF0C\u8D1F\u8D23\u57FA\u4E8E\u77E5\u8BC6\u5E93\u64B0\u5199\u5DE5\u5355\u56DE\u590D\u8349\u7A3F\u3002

\u3010\u786C\u6027\u8981\u6C42\u3011
1. \u53EA\u80FD\u4F9D\u636E\u4E0B\u65B9\u3010\u77E5\u8BC6\u5E93\u3011\u63D0\u4F9B\u7684\u5185\u5BB9\u56DE\u7B54\uFF0C\u7981\u6B62\u7F16\u9020\u3001\u81C6\u6D4B\u4EFB\u4F55\u77E5\u8BC6\u5E93\u4E2D\u6CA1\u6709\u7684\u4FE1\u606F\u3002
2. \u5982\u679C\u77E5\u8BC6\u5E93\u5185\u5BB9\u4E0D\u8DB3\u4EE5\u56DE\u7B54\u7528\u6237\u95EE\u9898\uFF0C\u5FC5\u987B\u5728\u56DE\u590D\u5F00\u5934\u660E\u786E\u8BF4\u660E\u300C\u77E5\u8BC6\u5E93\u6682\u672A\u6536\u5F55\u8BE5\u95EE\u9898\u7684\u5B8C\u6574\u89E3\u7B54\u300D\uFF0C\u5E76\u7ED9\u51FA\u53EF\u64CD\u4F5C\u5EFA\u8BAE\uFF08\u4F8B\u5982\u67E5\u770B wiki\u3001\u8865\u5145\u622A\u56FE\u3001\u7531\u4EBA\u5DE5\u5904\u7406\uFF09\uFF0C\u7EDD\u5BF9\u4E0D\u8981\u5F3A\u884C\u7F16\u9020\u7B54\u6848\u3002
3. \u7ED3\u5408\u5DE5\u5355\u91CC\u7684\u6E38\u620F\u540D\u4E0E\u95EE\u9898\u63CF\u8FF0\uFF0C\u7528\u7B80\u4F53\u4E2D\u6587\u3001\u793C\u8C8C\u3001\u6E05\u6670\u7684\u53E3\u543B\u7ED9\u73A9\u5BB6\u5199\u4E00\u6BB5\u53EF\u76F4\u63A5\u53D1\u9001\u7684\u56DE\u590D\u3002
4. \u8F93\u51FA\u7EAF\u6587\u672C\u56DE\u590D\u8349\u7A3F\uFF08\u53EF\u5305\u542B Markdown \u6392\u7248\uFF1A**\u52A0\u7C97**\u3001- \u5217\u8868\u7B49\uFF09\uFF0C\u4E0D\u8981\u5199\u300C\u56DE\u590D\uFF1A\u300D\u4E4B\u7C7B\u7684\u524D\u7F00\u6807\u9898\u3002`;
    const user = `\u3010\u73A9\u5BB6\u5DE5\u5355\u3011
\u7B80\u79F0\uFF1A${t.nickname || ""}
\u6E38\u620F\u540D\uFF1A${t.gamename || ""}
\u90AE\u7BB1\uFF1A${t.email || ""}
\u95EE\u9898\u5185\u5BB9\uFF1A
${t.content || ""}

\u3010\u77E5\u8BC6\u5E93\u3011\uFF08\u6765\u6E90\u4E8E wiki\uFF0C\u4EC5\u5728\u4EE5\u4E0B\u5185\u5BB9\u8303\u56F4\u5185\u4F5C\u7B54\uFF09
${ctx.text || "\uFF08\u5F53\u524D\u77E5\u8BC6\u5E93\u4E3A\u7A7A\uFF09"}`;
    const draft = await callGLM(env, system, user);
    return json({ ok: true, draft, model: env.GLM_MODEL || "glm-4.7-flash", sources: ctx.sources });
  } catch (e) {
    return json({ error: e.message || "AI \u751F\u6210\u5931\u8D25" }, 500);
  }
}
__name(handleAdminTicketAi, "handleAdminTicketAi");
__name2(handleAdminTicketAi, "handleAdminTicketAi");
__name22(handleAdminTicketAi, "handleAdminTicketAi");
__name222(handleAdminTicketAi, "handleAdminTicketAi");
__name2222(handleAdminTicketAi, "handleAdminTicketAi");
async function callGLMRouter(env, ticket, wikiText) {
  const system = `\u4F60\u662F\u300C\u68A6\u4E4B\u97F5\u300DMinecraft \u6A21\u7EC4\u5305\u5B98\u65B9\u5BA2\u670D\u667A\u80FD\u4F53\uFF0C\u8D1F\u8D23\u5224\u65AD\u5DE5\u5355\u80FD\u5426\u4EC5\u4F9D\u636E\u77E5\u8BC6\u5E93\u81EA\u52A8\u89E3\u7B54\u3002

\u3010\u5224\u5B9A\u89C4\u5219\u3011
- action \u4E3A "auto"\uFF1A\u4EC5\u5F53\u3010\u77E5\u8BC6\u5E93\u3011\u5185\u5BB9\u80FD\u5B8C\u6574\u3001\u660E\u786E\u5730\u56DE\u7B54\u73A9\u5BB6\u7684\u57FA\u7840\u95EE\u9898\uFF08\u4F8B\u5982\u5B89\u88C5\u65B9\u6CD5\u3001\u914D\u7F6E\u6B65\u9AA4\u3001\u5E38\u89C1\u95EE\u9898\uFF09\uFF0C\u4E14\u4F60\u636E\u6B64\u751F\u6210\u4E86\u5B8C\u6574\u3001\u53EF\u76F4\u63A5\u53D1\u9001\u7684\u56DE\u590D\u3002
- \u53EA\u8981\u7B26\u5408\u4EE5\u4E0B\u4EFB\u4E00\u60C5\u51B5\uFF0Caction \u5C31\u5FC5\u987B\u4E3A "manual"\uFF08\u8F6C\u4EBA\u5DE5\u5904\u7406\uFF09\uFF1A
  1. \u77E5\u8BC6\u5E93\u5185\u5BB9\u4E0D\u8DB3\u4EE5\u56DE\u7B54\uFF0C\u6216\u95EE\u9898\u590D\u6742\u3001\u4E13\u4E1A\u3001\u9700\u8981\u5177\u4F53\u6392\u9519\uFF1B
  2. \u6D89\u53CA\u73A9\u5BB6\u4E2A\u4EBA\u8D26\u53F7\u3001\u8D2D\u4E70\u3001\u9000\u6B3E\u3001\u9690\u79C1\u3001\u5B58\u6863\u6062\u590D\u7B49\u9700\u7BA1\u7406\u5458\u4ECB\u5165\u7684\u4FE1\u606F\uFF1B
  3. \u95EE\u9898\u63CF\u8FF0\u542B\u7CCA\u3001\u7F3A\u5C11\u5173\u952E\u4FE1\u606F\u3001\u9700\u8981\u8FDB\u4E00\u6B65\u6C9F\u901A\u786E\u8BA4\uFF1B
  4. \u5C5E\u4E8E\u5EFA\u8BAE\u53CD\u9988\u3001\u6295\u8BC9\u3001\u8FB1\u9A82\u3001\u7D27\u6025\u6C42\u52A9\u7B49\u4E0D\u5B9C\u81EA\u52A8\u56DE\u590D\u7684\u5185\u5BB9\u3002

\u3010\u786C\u6027\u8981\u6C42\u3011
- \u53EA\u80FD\u4F9D\u636E\u3010\u77E5\u8BC6\u5E93\u3011\u5185\u5BB9\u4F5C\u7B54\uFF0C\u7981\u6B62\u7F16\u9020\u3001\u81C6\u6D4B\u4EFB\u4F55\u77E5\u8BC6\u5E93\u4E2D\u6CA1\u6709\u7684\u4FE1\u606F\u3002
- \u77E5\u8BC6\u5E93\u4FE1\u606F\u4E0D\u8DB3\u65F6\u7EDD\u4E0D\u80FD\u9009 "auto"\uFF0C\u5B81\u53EF\u8F6C\u4EBA\u5DE5\u3002

\u3010\u8F93\u51FA\u3011
\u53EA\u8F93\u51FA\u4E00\u4E2A JSON \u5BF9\u8C61\uFF08\u4E0D\u8981\u8F93\u51FA\u4EFB\u4F55\u5176\u4ED6\u6587\u5B57\u6216\u4EE3\u7801\u5757\u6807\u8BB0\uFF09\uFF1A
{"action":"auto" \u6216 "manual","reply":"\u5F53 action \u4E3A auto \u65F6\u7ED9\u51FA\u5B8C\u6574\u56DE\u590D\u8349\u7A3F\uFF1B\u5426\u5219\u4E3A\u7A7A\u5B57\u7B26\u4E32"}

auto \u65F6 reply \u8981\u6C42\uFF1A\u7528\u7B80\u4F53\u4E2D\u6587\u3001\u793C\u8C8C\u3001\u6E05\u6670\u7684\u53E3\u543B\uFF0C\u53EF\u76F4\u63A5\u53D1\u9001\uFF1B\u4EE5\u73A9\u5BB6\u79F0\u547C\u5F00\u5934\uFF1B\u53EF\u542B Markdown \u6392\u7248\u3002`;
  const user = `\u3010\u73A9\u5BB6\u5DE5\u5355\u3011
\u6E38\u620F\u540D\uFF1A${ticket.gamename || ""}
\u95EE\u9898\u5185\u5BB9\uFF1A
${ticket.content || ""}

\u3010\u77E5\u8BC6\u5E93\u3011\uFF08\u6765\u6E90\u4E8E wiki\uFF0C\u4EC5\u53EF\u5728\u4EE5\u4E0B\u5185\u5BB9\u8303\u56F4\u5185\u4F5C\u7B54\uFF09
${wikiText || "\uFF08\u77E5\u8BC6\u5E93\u4E3A\u7A7A\uFF09"}`;
  const content = await callGLM(env, system, user, 2e3);
  const m = String(content || "").match(/\{[\s\S]*\}/);
  if (!m) throw new Error("AI \u672A\u8FD4\u56DE\u6709\u6548\u5224\u5B9A\u7ED3\u679C");
  let parsed = {};
  try {
    parsed = JSON.parse(m[0]);
  } catch (_) {
    parsed = {};
  }
  const action = parsed.action === "auto" ? "auto" : "manual";
  return { action, reply: String(parsed.reply || "").trim() };
}
__name(callGLMRouter, "callGLMRouter");
__name2(callGLMRouter, "callGLMRouter");
__name22(callGLMRouter, "callGLMRouter");
__name222(callGLMRouter, "callGLMRouter");
__name2222(callGLMRouter, "callGLMRouter");
__name22222(callGLMRouter, "callGLMRouter");
async function notifyAdminNewTicket(env, ticket) {
  const notifyEmails = await getNotifyEmails(env);
  for (const mail of notifyEmails) {
    if (!mail) continue;
    try {
      const body = `\u65B0\u5DE5\u5355 ${ticket.id}
\u7B80\u79F0\uFF1A${ticket.nickname}
\u6E38\u620F\u540D\uFF1A${ticket.gamename}
\u90AE\u7BB1\uFF1A${ticket.email}
\u65F6\u95F4\uFF1A${ticket.createdAt}

\u7559\u8A00\u5185\u5BB9\uFF1A
${ticket.content}`;
      await sendEmail(
        env,
        mail,
        `\u3010\u65B0\u5DE5\u5355\u3011${ticket.id} \u6765\u81EA ${ticket.nickname}`,
        body,
        notifyAdminEmailHtml(ticket.id, ticket)
      );
    } catch (e) {
      console.error("[ticket-notify-admin]", mail, e.message);
    }
  }
}
__name(notifyAdminNewTicket, "notifyAdminNewTicket");
__name2(notifyAdminNewTicket, "notifyAdminNewTicket");
__name22(notifyAdminNewTicket, "notifyAdminNewTicket");
__name222(notifyAdminNewTicket, "notifyAdminNewTicket");
__name2222(notifyAdminNewTicket, "notifyAdminNewTicket");
__name22222(notifyAdminNewTicket, "notifyAdminNewTicket");
async function autoProcessTicket(env, id) {
  try {
    const t = await ticketGet(env, id);
    if (!t) return;
    if (t.status !== "new") return;
    if (!env.GLM_API_KEY) {
      await notifyAdminNewTicket(env, t);
      return;
    }
    const wiki = await fetchWikiContext(env, `${t.gamename || ""} ${t.content || ""}`);
    const result = await callGLMRouter(env, t, wiki.text);
    if (result.action === "auto" && result.reply) {
      const reply = result.reply;
      t.replies = t.replies || [];
      t.replies.push({ from: "ai", auto: true, content: reply, at: (/* @__PURE__ */ new Date()).toISOString() });
      t.status = "auto";
      await ticketPut(env, t);
      try {
        const body = `\u4F60\u597D ${t.nickname}\uFF1A

\u4F60\u7684\u5DE5\u5355 ${id} \u5DF2\u7531\u7CFB\u7EDF\u81EA\u52A8\u56DE\u590D\uFF1A

${reply}

\u2014\u2014 \u68A6\u4E4B\u97F5\u5DE5\u5355\u7CFB\u7EDF`;
        await sendEmail(env, t.email, `\u3010\u68A6\u4E4B\u97F5\u5DE5\u5355\u3011\u4F60\u7684\u5DE5\u5355 ${id} \u5DF2\u81EA\u52A8\u56DE\u590D`, body, emailShell("\u81EA\u52A8\u56DE\u590D", mdToHtml(reply)));
      } catch (e) {
        console.error("[ticket-auto-mail]", e.message);
      }
      return;
    }
    await notifyAdminNewTicket(env, t);
  } catch (e) {
    console.error("[ticket-auto]", id, e.message);
    try {
      const t2 = await ticketGet(env, id);
      if (t2 && t2.status === "new") await notifyAdminNewTicket(env, t2);
    } catch (_) {
    }
  }
}
__name(autoProcessTicket, "autoProcessTicket");
__name2(autoProcessTicket, "autoProcessTicket");
__name22(autoProcessTicket, "autoProcessTicket");
__name222(autoProcessTicket, "autoProcessTicket");
__name2222(autoProcessTicket, "autoProcessTicket");
__name22222(autoProcessTicket, "autoProcessTicket");
async function handleNotifyEmailsList(env) {
  return json({ emails: await getNotifyEmails(env) });
}
__name(handleNotifyEmailsList, "handleNotifyEmailsList");
__name2(handleNotifyEmailsList, "handleNotifyEmailsList");
__name22(handleNotifyEmailsList, "handleNotifyEmailsList");
__name222(handleNotifyEmailsList, "handleNotifyEmailsList");
__name2222(handleNotifyEmailsList, "handleNotifyEmailsList");
__name22222(handleNotifyEmailsList, "handleNotifyEmailsList");
async function handleNotifyEmailsAdd(request, env) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    if (!isValidEmail(email)) return json({ error: "\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E" }, 400);
    const list = await getNotifyEmails(env);
    if (list.includes(email)) return json({ error: "\u8BE5\u90AE\u7BB1\u5DF2\u5728\u5217\u8868\u4E2D" }, 400);
    list.push(email);
    await env.MODS_KV.put("ticket:notify-emails", JSON.stringify(list));
    return json({ ok: true, emails: list });
  } catch (e) {
    return json({ error: e.message || "\u6DFB\u52A0\u5931\u8D25" }, 500);
  }
}
__name(handleNotifyEmailsAdd, "handleNotifyEmailsAdd");
__name2(handleNotifyEmailsAdd, "handleNotifyEmailsAdd");
__name22(handleNotifyEmailsAdd, "handleNotifyEmailsAdd");
__name222(handleNotifyEmailsAdd, "handleNotifyEmailsAdd");
__name2222(handleNotifyEmailsAdd, "handleNotifyEmailsAdd");
__name22222(handleNotifyEmailsAdd, "handleNotifyEmailsAdd");
async function handleNotifyEmailsRemove(env, email) {
  const target = String(email || "").toLowerCase();
  const list = await getNotifyEmails(env);
  const next = list.filter((m) => m.toLowerCase() !== target);
  if (next.length === list.length) return json({ error: "\u8BE5\u90AE\u7BB1\u4E0D\u5728\u5217\u8868\u4E2D" }, 404);
  await env.MODS_KV.put("ticket:notify-emails", JSON.stringify(next));
  return json({ ok: true, emails: next });
}
__name(handleNotifyEmailsRemove, "handleNotifyEmailsRemove");
__name2(handleNotifyEmailsRemove, "handleNotifyEmailsRemove");
__name22(handleNotifyEmailsRemove, "handleNotifyEmailsRemove");
__name222(handleNotifyEmailsRemove, "handleNotifyEmailsRemove");
__name2222(handleNotifyEmailsRemove, "handleNotifyEmailsRemove");
__name22222(handleNotifyEmailsRemove, "handleNotifyEmailsRemove");
function randomHex(len) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(randomHex, "randomHex");
__name2(randomHex, "randomHex");
__name22(randomHex, "randomHex");
__name222(randomHex, "randomHex");
__name2222(randomHex, "randomHex");
__name22222(randomHex, "randomHex");
async function handleApiTokensList(env) {
  const indexRaw = await env.MODS_KV.get("api:token:index");
  const ids = indexRaw ? JSON.parse(indexRaw) : [];
  const tokens = [];
  for (const id of ids) {
    const raw = await env.MODS_KV.get(`api:token:${id}`);
    if (!raw) continue;
    const d = JSON.parse(raw);
    tokens.push({ id, name: d.name, createdBy: d.createdBy, createdAt: d.createdAt, prefix: d.token.slice(0, 10) + "\u2026" });
  }
  return json({ tokens });
}
__name(handleApiTokensList, "handleApiTokensList");
__name2(handleApiTokensList, "handleApiTokensList");
__name22(handleApiTokensList, "handleApiTokensList");
__name222(handleApiTokensList, "handleApiTokensList");
__name2222(handleApiTokensList, "handleApiTokensList");
__name22222(handleApiTokensList, "handleApiTokensList");
async function handleApiTokensCreate(request, env) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = String(body.name || "\u9ED8\u8BA4 Token").trim().slice(0, 40);
    const who = await currentAdmin(request, env);
    const createdBy = who.session ? who.session.login : "api";
    const id = randomHex(6);
    const token = "mz_" + randomHex(30);
    const meta = { token, name, createdBy, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
    await env.MODS_KV.put(`api:token:${id}`, JSON.stringify(meta));
    await env.MODS_KV.put(`api:token:secret:${token}`, id);
    const indexRaw = await env.MODS_KV.get("api:token:index");
    const index = indexRaw ? JSON.parse(indexRaw) : [];
    index.unshift(id);
    await env.MODS_KV.put("api:token:index", JSON.stringify(index.slice(0, 100)));
    return json({ ok: true, id, token, name, createdAt: meta.createdAt });
  } catch (e) {
    return json({ error: e.message || "\u521B\u5EFA\u5931\u8D25" }, 500);
  }
}
__name(handleApiTokensCreate, "handleApiTokensCreate");
__name2(handleApiTokensCreate, "handleApiTokensCreate");
__name22(handleApiTokensCreate, "handleApiTokensCreate");
__name222(handleApiTokensCreate, "handleApiTokensCreate");
__name2222(handleApiTokensCreate, "handleApiTokensCreate");
__name22222(handleApiTokensCreate, "handleApiTokensCreate");
async function handleApiTokensRemove(env, id) {
  const raw = await env.MODS_KV.get(`api:token:${id}`);
  if (!raw) return json({ error: "Token \u4E0D\u5B58\u5728" }, 404);
  const d = JSON.parse(raw);
  await env.MODS_KV.delete(`api:token:${id}`);
  await env.MODS_KV.delete(`api:token:secret:${d.token}`);
  const indexRaw = await env.MODS_KV.get("api:token:index");
  const index = indexRaw ? JSON.parse(indexRaw) : [];
  await env.MODS_KV.put("api:token:index", JSON.stringify(index.filter((x2) => x2 !== id)));
  return json({ ok: true, message: "Token \u5DF2\u64A4\u9500" });
}
__name(handleApiTokensRemove, "handleApiTokensRemove");
__name2(handleApiTokensRemove, "handleApiTokensRemove");
__name22(handleApiTokensRemove, "handleApiTokensRemove");
__name222(handleApiTokensRemove, "handleApiTokensRemove");
__name2222(handleApiTokensRemove, "handleApiTokensRemove");
__name22222(handleApiTokensRemove, "handleApiTokensRemove");
async function handleTicketLookup(request, env, id) {
  try {
    const url = new URL(request.url);
    const email = String(url.searchParams.get("email") || "").trim().toLowerCase();
    const t = await ticketGet(env, id);
    if (!t) return json({ error: "\u5DE5\u5355\u4E0D\u5B58\u5728" }, 404);
    if (!email || t.email.toLowerCase() !== email) return json({ error: "\u90AE\u7BB1\u4E0E\u5DE5\u5355\u4E0D\u5339\u914D" }, 403);
    return json({
      ticket: {
        id: t.id,
        gamename: t.gamename,
        status: t.status,
        createdAt: t.createdAt,
        content: t.content,
        replies: (t.replies || []).map((r) => ({ from: r.from, content: r.content, at: r.at }))
      }
    });
  } catch (e) {
    return json({ error: e.message || "\u67E5\u8BE2\u5931\u8D25" }, 500);
  }
}
__name(handleTicketLookup, "handleTicketLookup");
__name2(handleTicketLookup, "handleTicketLookup");
__name22(handleTicketLookup, "handleTicketLookup");
__name222(handleTicketLookup, "handleTicketLookup");
__name2222(handleTicketLookup, "handleTicketLookup");
__name22222(handleTicketLookup, "handleTicketLookup");
async function handleTicketFollowup(request, env, id) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const content = String(body.content || "").trim();
    if (!content) return json({ error: "\u7559\u8A00\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A" }, 400);
    if (content.length > 5e3) return json({ error: "\u5185\u5BB9\u8D85\u51FA\u9650\u5236" }, 400);
    const t = await ticketGet(env, id);
    if (!t) return json({ error: "\u5DE5\u5355\u4E0D\u5B58\u5728" }, 404);
    if (!email || t.email.toLowerCase() !== email) return json({ error: "\u90AE\u7BB1\u4E0E\u5DE5\u5355\u4E0D\u5339\u914D" }, 403);
    t.replies = t.replies || [];
    t.replies.push({ from: "user", content, at: (/* @__PURE__ */ new Date()).toISOString() });
    if (t.status === "auto" || t.status === "closed") t.status = "new";
    await ticketPut(env, t);
    const notifyEmails = await getNotifyEmails(env);
    for (const mail of notifyEmails) {
      if (!mail) continue;
      try {
        const body2 = `\u73A9\u5BB6 ${t.nickname} \u5728\u5DE5\u5355 ${id} \u8FFD\u52A0\u4E86\u7559\u8A00\uFF1A

${content}

\u2014\u2014 \u68A6\u4E4B\u97F5\u5DE5\u5355\u7CFB\u7EDF`;
        await sendEmail(env, mail, `\u3010\u5DE5\u5355\u8FFD\u52A0\u3011${id} \u6765\u81EA ${t.nickname}`, body2);
      } catch (e) {
        console.error("[ticket-followup-mail]", mail, e.message);
      }
    }
    return json({ ok: true, message: "\u7559\u8A00\u5DF2\u63D0\u4EA4\uFF0C\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u5904\u7406" });
  } catch (e) {
    return json({ error: e.message || "\u7559\u8A00\u5931\u8D25" }, 500);
  }
}
__name(handleTicketFollowup, "handleTicketFollowup");
__name2(handleTicketFollowup, "handleTicketFollowup");
__name22(handleTicketFollowup, "handleTicketFollowup");
__name222(handleTicketFollowup, "handleTicketFollowup");
__name2222(handleTicketFollowup, "handleTicketFollowup");
__name22222(handleTicketFollowup, "handleTicketFollowup");
async function handleAdminTicketReopen(env, id) {
  const t = await ticketGet(env, id);
  if (!t) return json({ error: "\u5DE5\u5355\u4E0D\u5B58\u5728" }, 404);
  if (t.status === "closed") t.status = "replied";
  else if (t.status === "auto") t.status = "new";
  await ticketPut(env, t);
  return json({ ok: true, ticket: { id: t.id, status: t.status } });
}
__name(handleAdminTicketReopen, "handleAdminTicketReopen");
__name2(handleAdminTicketReopen, "handleAdminTicketReopen");
__name22(handleAdminTicketReopen, "handleAdminTicketReopen");
__name222(handleAdminTicketReopen, "handleAdminTicketReopen");
__name2222(handleAdminTicketReopen, "handleAdminTicketReopen");
__name22222(handleAdminTicketReopen, "handleAdminTicketReopen");
async function handleAdminTicketDelete(env, id) {
  const t = await ticketGet(env, id);
  if (!t) return json({ error: "\u5DE5\u5355\u4E0D\u5B58\u5728" }, 404);
  await ticketDelete(env, id);
  return json({ ok: true, message: "\u5DE5\u5355\u5DF2\u5220\u9664" });
}
__name(handleAdminTicketDelete, "handleAdminTicketDelete");
__name2(handleAdminTicketDelete, "handleAdminTicketDelete");
__name22(handleAdminTicketDelete, "handleAdminTicketDelete");
__name222(handleAdminTicketDelete, "handleAdminTicketDelete");
__name2222(handleAdminTicketDelete, "handleAdminTicketDelete");
__name22222(handleAdminTicketDelete, "handleAdminTicketDelete");
var index_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "GET" && (path === "/error-report" || path === "/error-report.html") && !url.searchParams.get("token")) {
      return Response.redirect(new URL("/api/error-reports/upload-page", request.url).toString(), 302);
    }
    if (path === "/auth/login") return handleLogin(request, env);
    if (path === "/auth/callback") return handleCallback(request, env);
    if (path === "/auth/logout") {
      await deleteSession(env, getSessionToken(request));
      return new Response(null, { status: 302, headers: { Location: "/", "Set-Cookie": clearSessionCookie() } });
    }
    if (path === "/auth/qq") return handleQQLogin(request, env);
    if (path === "/auth/qq/callback") return handleQQCallback(request, env);
    if (path === "/auth/qq/bind-callback") return handleQQBindCallback(request, env);
    if (path === "/api/oauth/qq/login-url") return handleQQLoginUrl(env);
    if (path === "/api/oauth/qq/bind-url") {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      return handleQQBindUrl(env);
    }
    if (path === "/api/oauth/github/bind-url") {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      return handleGithubBindUrl(env);
    }
    if (path === "/api/oauth/unbind" && request.method === "POST") {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      return handleOAuthUnbind(request, env);
    }
    if (path === "/api/auth/login" && request.method === "POST") return handlePasswordLogin(request, env);
    if (path === "/api/me") {
      const session = await getSession(env, getSessionToken(request));
      let user = null;
      let isAdmin2 = false;
      let isSuper = false;
      if (session) {
        const role = await getAdminRole(env, session.login);
        const users = await ensureAdminUsers(env);
        const admin = users[session.login] || {};
        user = { login: session.login, name: session.name, role, avatar_url: session.avatar_url || admin.oauth && admin.oauth.qq && admin.oauth.qq.faceimg || null, oauth: oauthInfo(admin) };
        isAdmin2 = role === ROLE_SUPER || role === ROLE_ADMIN;
        isSuper = role === ROLE_SUPER;
      }
      return json({ user, isAdmin: isAdmin2, isSuper });
    }
    if (path === "/api/me/profile" && request.method === "POST") return handleProfileUpdate(request, env);
    if (path === "/api/me/password" && request.method === "POST") return handleProfilePassword(request, env);
    if (path === "/api/mods") return handleMods(env);
    if (path === "/api/mirrors") return handleMirrors(request);
    if (path === "/api/releases/latest") return handleLatest(env);
    if (path === "/api/releases") return handleReleases(env);
    if (/^\/api\/releases\/[^/]+$/.test(path) && request.method === "GET") {
      return handleReleaseDetail(env, path.slice("/api/releases/".length));
    }
    if (path === "/api/admin/stats") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleAdminStats(env);
    }
    if (path === "/api/admin/mods" || path.startsWith("/api/admin/mods/")) {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      if (path === "/api/admin/mods" && request.method === "GET") return handleAdminModsList(env);
      if (path === "/api/admin/mods" && request.method === "POST") return handleAdminUpload(request, env);
      if (path === "/api/admin/mods/rename" && request.method === "POST") return handleAdminRename(request, env);
      if (request.method === "DELETE") {
        const name = path.slice("/api/admin/mods/".length);
        if (name) return handleAdminDelete(request, env, name);
      }
      return json({ error: "\u4E0D\u652F\u6301\u7684\u8BF7\u6C42" }, 404);
    }
    if (path === "/api/admin/mrpack" && request.method === "POST") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleMrpackUpload(request, env, ctx);
    }
    if (path === "/api/admin/mrpack/jobs" && request.method === "GET") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleMrpackJobsList(env);
    }
    if (/^\/api\/admin\/mrpack\/jobs\/[^/]+$/.test(path) && request.method === "GET") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleMrpackJobStatus(env, path.slice("/api/admin/mrpack/jobs/".length));
    }
    if (path === "/api/modpack/apply" && request.method === "POST") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleModpackApply(request, env);
    }
    if (path === "/proxy" && request.method === "GET") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleProxy(request, env);
    }
    if (path === "/api/admin/publish" && request.method === "POST") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleAdminPublish(request, env);
    }
    if (path === "/api/admin/releases/rollback" && request.method === "POST") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleAdminReleaseRollback(request, env);
    }
    if (path.startsWith("/api/admin/releases/")) {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      const id = path.slice("/api/admin/releases/".length);
      if (id && request.method === "DELETE") return handleAdminReleaseDelete(request, env, id);
      return json({ error: "\u4E0D\u652F\u6301\u7684\u8BF7\u6C42" }, 404);
    }
    if (path === "/api/tickets" && request.method === "POST") return handleTicketSubmit(request, env);
    if (path === "/api/tickets/verify" && request.method === "POST") return handleTicketVerify(request, env, ctx);
    if (/^\/api\/tickets\/[^/]+$/.test(path) && request.method === "GET") {
      return handleTicketLookup(request, env, path.slice("/api/tickets/".length));
    }
    if (/^\/api\/tickets\/[^/]+\/message$/.test(path) && request.method === "POST") {
      const id = path.slice("/api/tickets/".length, -"/message".length);
      return handleTicketFollowup(request, env, id);
    }
    if (path === "/api/ticket-info" && request.method === "GET") return handleTicketInfo(env);
    if (path === "/api/error-reports/verify" && request.method === "POST") return handleErrorReportVerify(request, env);
    if (path === "/api/error-reports/bind" && request.method === "POST") return handleErrorReportBind(request, env);
    if ((path === "/api/error-reports/upload-page" || path === "/api/error-reports/upload-session") && request.method === "GET") return handleErrorReportUploadPage(request, env);
    if (path === "/api/error-reports" && request.method === "POST") return handleErrorReportUpload(request, env, ctx);
    if (/^\/api\/error-reports\/[^/]+$/.test(path) && request.method === "GET") {
      return handleErrorReportLookup(request, env, path.slice("/api/error-reports/".length));
    }
    if (path === "/api/admin/tickets" && request.method === "GET") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleAdminTickets(env);
    }
    if (path.startsWith("/api/admin/tickets/")) {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      const rest = path.slice("/api/admin/tickets/".length);
      if (request.method === "GET" && rest) return handleAdminTicketDetail(env, rest);
      if (request.method === "POST" && rest.endsWith("/reply")) return handleAdminTicketReply(request, env, rest.slice(0, -6));
      if (request.method === "POST" && rest.endsWith("/close")) return handleAdminTicketClose(env, rest.slice(0, -6));
      if (request.method === "POST" && rest.endsWith("/reopen")) return handleAdminTicketReopen(env, rest.slice(0, -7));
      if (request.method === "POST" && rest.endsWith("/ai")) return handleAdminTicketAi(request, env, rest.slice(0, -3));
      if (request.method === "DELETE" && rest) return handleAdminTicketDelete(env, rest);
      return json({ error: "\u4E0D\u652F\u6301\u7684\u8BF7\u6C42" }, 404);
    }
    if (path === "/api/admin/notify-emails") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      if (request.method === "GET") return handleNotifyEmailsList(env);
      if (request.method === "POST") return handleNotifyEmailsAdd(request, env);
      return json({ error: "\u4E0D\u652F\u6301\u7684\u8BF7\u6C42" }, 404);
    }
    if (path.startsWith("/api/admin/notify-emails/") && request.method === "DELETE") {
      const denied = await requireAdminOrToken(request, env);
      if (denied) return denied;
      return handleNotifyEmailsRemove(env, decodeURIComponent(path.slice("/api/admin/notify-emails/".length)));
    }
    if (path === "/api/admin/api-tokens") {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      if (request.method === "GET") return handleApiTokensList(env);
      if (request.method === "POST") return handleApiTokensCreate(request, env);
      return json({ error: "\u4E0D\u652F\u6301\u7684\u8BF7\u6C42" }, 404);
    }
    if (path.startsWith("/api/admin/api-tokens/") && request.method === "DELETE") {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      return handleApiTokensRemove(env, path.slice("/api/admin/api-tokens/".length));
    }
    if (path === "/api/admin/users" && request.method === "GET") {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      return handleAdminUsersList(request, env);
    }
    if (path === "/api/admin/users" && request.method === "POST") {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      return handleAdminUsersCreate(request, env);
    }
    if (path.startsWith("/api/admin/users/")) {
      const denied = await requireAdmin(request, env);
      if (denied) return denied;
      const rest = path.slice("/api/admin/users/".length);
      const slash = rest.lastIndexOf("/");
      const username = decodeURIComponent(slash < 0 ? rest : rest.slice(0, slash));
      const action = slash < 0 ? "" : rest.slice(slash + 1);
      if (!action && request.method === "DELETE") return handleAdminUsersDelete(request, env, username);
      if (action === "password" && request.method === "POST") return handleAdminUserPassword(request, env, username);
      if (action === "role" && request.method === "POST") return handleAdminUserRole(request, env, username);
      return json({ error: "\u4E0D\u652F\u6301\u7684\u64CD\u4F5C" }, 404);
    }
    return env.ASSETS.fetch(request);
  },
  async scheduled(controller, env, ctx) {
    await migrateTicketsFromKV(env);
    await erKvCleanup(env);
    await drainErrorReportQueue(env, ctx);
    await drainMrpackJobs(env);
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map