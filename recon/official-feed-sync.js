// official-feed-sync.js — 接入 Lamps 官方代理的赛果数据源（仅平台 request 通道）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");

if (glue.indexOf("installOfficialFeedSync") >= 0) { console.log("已存在"); process.exit(0); }

const MODULE = `
  /* ---------- 官方赛果数据同步（Lamps 平台代理通道） ----------
   * 数据源：lamps-api.hoorahgo.com/cloud-proxy/.../api/official-feed
   * 仅通过 LampsGame.request（平台通道）访问；无任何 XHR/fetch 直连。
   * 启动时先用本地缓存（若有更新的快照），再联网同步；失败保持包内快照。
   */
  var OFFICIAL_FEED_URL = 'https://lamps-api.hoorahgo.com/cloud-proxy/app-1b8c1d4749-d8gmk54gz5fc75d0d-1252166086.ap-shanghai.app.tcloudbase.com/api/official-feed';
  var FEED_CACHE_KEY = 'cba-official-feed-v1';
  var FEED_SYNC_INTERVAL = 30 * 60 * 1000;

  function installOfficialFeedSync() {
    var running = false;
    var lastSync = 0;

    function decodeFeedValue(value) {
      if (typeof value === 'string') {
        var s = value.trim();
        if (!s) return null;
        try { s = decodeURIComponent(s); } catch (_) {}
        try { return JSON.parse(s); } catch (_) { return null; }
      }
      return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    }
    function extractFeed(res) {
      if (!res || !res.ok) return null;
      var d = res.data;
      var parsed = decodeFeedValue(d);
      if (parsed) d = parsed;
      if (d && typeof d === 'object') {
        var inner = decodeFeedValue(d.data);
        if (inner && typeof inner === 'object') d = inner;
        if (d && d.data && typeof d.data === 'object' && (d.data.players || d.data.schedules)) d = d.data;
        if (d && d.players && d.schedules) return d;
        var r = decodeFeedValue(d.result);
        if (r && r.players && r.schedules) return r;
      }
      return null;
    }

    function snapshotDate() {
      try {
        var snap = global.CBAPlayerData && global.CBAPlayerData.getSnapshot && global.CBAPlayerData.getSnapshot();
        return String((snap && snap.updatedAt) || '');
      } catch (_) { return ''; }
    }
    function applyFeed(feed, source) {
      try {
        var current = snapshotDate();
        var next = String(feed.updatedAt || '');
        if (next && current && next <= current) {
          console.log('[赛果同步] ' + source + ' 数据不新于本地，跳过（' + next + '）');
          return false;
        }
        global.CBAPlayerData.update(feed);
        try { global.dispatchEvent(new CustomEvent('cba:data-date-changed', { detail: { feed: true, source: source } })); } catch (_) {}
        try { global.CBAFantasyUI && global.CBAFantasyUI.refreshMarket && global.CBAFantasyUI.refreshMarket({ invalidate: false }); } catch (_) {}
        console.log('[赛果同步] 快照已更新 → ' + (next || '(无日期)') + '（' + source + '）');
        return true;
      } catch (e) {
        console.warn('[赛果同步] 应用失败:', e && e.message);
        return false;
      }
    }
    function loadCache() {
      try {
        var raw = global.localStorage.getItem(FEED_CACHE_KEY);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        return parsed && parsed.players && parsed.schedules ? parsed : null;
      } catch (_) { return null; }
    }
    function saveCache(feed) {
      try {
        var text = JSON.stringify(feed);
        if (text.length > 4 * 1024 * 1024) return;
        global.localStorage.setItem(FEED_CACHE_KEY, text);
      } catch (_) {}
    }

    function sync() {
      if (running) return;
      if (!global.CBAPlayerData || typeof global.CBAPlayerData.update !== 'function') return;
      if (!(global.LampsGame && typeof global.LampsGame.request === 'function')) return; // 本地调试：仅用包内快照
      if (Date.now() - lastSync < FEED_SYNC_INTERVAL) return;
      running = true;
      lastSync = Date.now();
      global.LampsGame.request({
        url: OFFICIAL_FEED_URL,
        method: 'get',
        header: { 'Content-Type': 'application/json' },
      }).then(function (res) {
        running = false;
        var feed = extractFeed(res);
        if (!feed) {
          console.warn('[赛果同步] 响应结构未识别:', res && res.message ? res.message : '');
          return;
        }
        saveCache(feed);
        applyFeed(feed, 'lamp-proxy');
      }, function (err) {
        running = false;
        console.warn('[赛果同步] 请求失败:', err && err.message);
      });
    }

    function start() {
      // 1) 先应用本地缓存（重载秒级恢复新鲜数据）
      var cached = loadCache();
      if (cached) applyFeed(cached, 'cache');
      // 2) 等游戏数据就绪后联网同步
      var tries = 0;
      var timer = setInterval(function () {
        tries++;
        if (global.CBAPlayerData && typeof global.CBAPlayerData.update === 'function') {
          clearInterval(timer);
          setTimeout(sync, 2500);
          setInterval(function () { lastSync = 0; sync(); }, FEED_SYNC_INTERVAL);
          global.addEventListener('focus', function () { if (Date.now() - lastSync > 5 * 60 * 1000) sync(); });
          global.document.addEventListener('visibilitychange', function () {
            if (global.document.visibilityState === 'visible' && Date.now() - lastSync > 5 * 60 * 1000) sync();
          });
        } else if (tries > 90) {
          clearInterval(timer);
        }
      }, 1000);
    }

    if (global.document.readyState === 'loading') global.document.addEventListener('DOMContentLoaded', start);
    else start();
  }

`;

glue = glue.replace("  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */",
  MODULE + "  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */");
glue = glue.replace("  function boot() {\n    installToast();", "  function boot() {\n    installToast();\n    installOfficialFeedSync();");

// 冻结提示文案：改为联网自动同步
glue = glue.split("' · 数据源接入后恢复每日更新'").join("' · 联网自动同步'");

fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (e) { console.log("✗ " + e.message); process.exit(1); }

const VER = "20261031a-official-feed";
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '" + VER + "';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=" + VER);
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=" + VER);
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("版本 → " + VER);