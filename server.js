require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const cfg = require('./src/config');
const { router } = require('./src/routes');

const app = express();

app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(session({
  secret: cfg.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: cfg.baseUrl.startsWith('https'),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);

app.listen(cfg.port, () => {
  console.log('==========================================');
  console.log('  梦之韵模组发布系统已启动');
  console.log(`  面板地址: http://localhost:${cfg.port}`);
  console.log(`  mods 文件夹: ${cfg.modsDir}`);
  console.log(`  发布仓库: ${cfg.repoOwner}/${cfg.repoName}`);
  console.log(`  管理员: ${cfg.adminLogin}`);
  if (!cfg.githubClientId) {
    console.log('  [警告] 未配置 GITHUB_CLIENT_ID，GitHub 登录暂不可用');
  }
  console.log('==========================================');
});
