const fs = require('fs');
const path = require('path');
const cfg = require('./config');

const stateFile = path.join(cfg.dataDir, 'state.json');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function defaultState() {
  return {
    currentVersion: '1.0.0',
    lastPublishAt: null,
    lastReleaseId: null,
    lastReleaseTag: null,
  };
}

function readState() {
  ensureDir(cfg.dataDir);
  if (!fs.existsSync(stateFile)) return defaultState();
  try {
    return { ...defaultState(), ...JSON.parse(fs.readFileSync(stateFile, 'utf8')) };
  } catch (_) {
    return defaultState();
  }
}

function writeState(state) {
  ensureDir(cfg.dataDir);
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

function bumpVersion(v) {
  const parts = String(v || '1.0.0').split('.').map((n) => parseInt(n, 10) || 0);
  while (parts.length < 3) parts.push(0);
  parts[2] += 1;
  return parts.join('.');
}

module.exports = { ensureDir, readState, writeState, bumpVersion };
