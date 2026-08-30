require('dotenv').config();
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

module.exports = {
  port: parseInt(process.env.PORT || '3000', 10),
  root: ROOT,
  baseUrl: String(process.env.BASE_URL || '').replace(/\/+$/, ''),

  githubClientId: process.env.GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  githubToken: process.env.GITHUB_TOKEN || '',

  repoOwner: process.env.REPO_OWNER || 'maoxinhe',
  repoName: process.env.REPO_NAME || 'modpack',
  adminLogin: process.env.ADMIN_LOGIN || 'maoxinhe',

  modsDir: path.resolve(ROOT, process.env.MODS_DIR || 'mods'),
  dataDir: path.resolve(ROOT, process.env.DATA_DIR || 'data'),
  distDir: path.resolve(ROOT, process.env.DIST_DIR || 'dist'),

  sessionSecret: process.env.SESSION_SECRET || 'change-me-in-production',
  devAuthToken: process.env.DEV_AUTH_TOKEN || '',
  maxUploadSizeMb: parseInt(process.env.MAX_UPLOAD_MB || '100', 10),
};
