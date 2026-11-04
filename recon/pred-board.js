// pred-board.js — 每日预测页底部「预测榜」卡片（Lamps 读榜单 / 本地显示成绩）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");

if (glue.indexOf("installPredictionBoard") >= 0) { console.log("已存在"); process.exit(0); }

const MODULE = `
  /* ---------- 预测榜（成功预测次数，gameRankType='predict'） ----------
   * 挂在每日预测页底部：Lamps 环境读 LampsPlatform.getLeaderboard('predict')，
   * 本地调试显示本机成功预测次数。提交由 cba-rank-sync.js 负责。
   */
  function installPredictionBoard() {
    var doc = global.document;
    var MARK = 'data-cba-pred-board';
    var lastFetch = 0;
    var rows = null;       // null=未读 / []=空榜
    var fetching = false;
    var sig = '';

    function ensureStyle() {
      if (doc.getElementById('cba-pred-board-style')) return;
      var css = doc.createElement('style');
      css.id = 'cba-pred-board-style';
      css.textContent = [
        '#cba-predict-board{background:#111827;border:1px solid #263244;border-radius:12px;padding:14px 14px 10px;margin:16px 0 8px;color:#f8fafc;font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif}',
        '#cba-predict-board header{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:10px}',
        '#cba-predict-board h3{margin:0;font-size:15px;color:#a3e635;letter-spacing:1px}',
        '#cba-predict-board .pb-sub{color:#94a3b8;font-size:11px}',
        '#cba-predict-board .pb-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}',
        '#cba-predict-board .pb-list li{display:flex;align-items:center;gap:10px;padding:7px 8px;border-radius:8px;font-size:13px}',
        '#cba-predict-board .pb-list li:nth-child(odd){background:#1b2535}',
        '#cba-predict-board .pb-list li.me{outline:1px solid #a3e63566;background:#1f2b1c}',
        '#cba-predict-board .pb-rank{flex:none;width:22px;text-align:center;color:#94a3b8;font:700 12px Arial}',
        '#cba-predict-board .pb-list li:nth-child(1) .pb-rank{color:#ffd700}',
        '#cba-predict-board .pb-list li:nth-child(2) .pb-rank{color:#c0c8d4}',
        '#cba-predict-board .pb-list li:nth-child(3) .pb-rank{color:#cd7f32}',
        '#cba-predict-board .pb-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '#cba-predict-board .pb-score{flex:none;color:#a3e635;font-weight:700;font-variant-numeric:tabular-nums}',
        '#cba-predict-board .pb-empty,#cba-predict-board .pb-local{margin:6px 2px 4px;color:#94a3b8;font-size:12px;line-height:1.6}',
        '#cba-predict-board .pb-local b{color:#a3e635}',
        '#cba-predict-board .pb-note{margin:8px 2px 2px;color:#64748b;font-size:10px}'
      ].join('');
      doc.head.appendChild(css);
    }

    function localStats() {
      try {
        var s = global.CBAStorageSession && global.CBAStorageSession.getSnapshot();
        var st = s && (s.state || (s.saved && s.saved.state));
        var list = (st && st.practicePredictions) || [];
        var wins = 0, settled = 0;
        for (var i = 0; i < list.length; i++) {
          var r = list[i];
          if (!r) continue;
          if (r.outcome === 'won') wins++;
          if (r.outcome === 'won' || r.outcome === 'lost') settled++;
        }
        return { wins: wins, settled: settled };
      } catch (_) { return { wins: 0, settled: 0 }; }
    }

    function build() {
      var section = doc.createElement('section');
      section.id = 'cba-predict-board';
      section.setAttribute(MARK, '1');
      section.setAttribute('aria-label', '预测榜');
      return section;
    }

    function render(section) {
      ensureStyle();
      var isLamps = inLamps && global.LampsPlatform && typeof global.LampsPlatform.getLeaderboard === 'function';
      if (!isLamps) {
        var st = localStats();
        var sigLocal = 'local:' + st.wins + ':' + st.settled;
        if (sig === sigLocal) return;
        sig = sigLocal;
        section.innerHTML = '<header><h3>预测榜</h3><span class="pb-sub">成功预测次数 · 前 10 名</span></header>' +
          '<p class="pb-local">本机练习 · 成功预测 <b>' + st.wins + '</b> 次 / 已结算 ' + st.settled + ' 场</p>' +
          '<p class="pb-note">联网（Lamps）后自动进入全服预测榜：按累计猜中的比赛场次数排名。</p>';
        return;
      }
      // Lamps：读榜（60 秒节流；空榜也缓存）
      var nowD = Date.now();
      if (rows === null && !fetching && nowD - lastFetch > 60000) {
        fetching = true;
        lastFetch = nowD;
        global.CBARIkiBoardFetch = null;
        global.LampsPlatform.getLeaderboard('predict').then(function (res) {
          rows = (res && res.ok && res.data && Array.isArray(res.data.list)) ? res.data.list : [];
        }, function () { rows = []; }).then(function () {
          fetching = false;
          var sec = doc.getElementById('cba-predict-board');
          if (sec) render(sec);
        });
      }
      var list = rows || [];
      var sigRows = JSON.stringify(list);
      if (sig === sigRows && section.querySelector('.pb-list,.pb-empty')) return;
      sig = sigRows;
      var html = '<header><h3>预测榜</h3><span class="pb-sub">成功预测次数 · 前 10 名</span></header>';
      if (!list.length) {
        html += '<p class="pb-empty">' + (rows === null ? '正在读取榜单…' : '暂无上榜记录，猜中第一场就能登榜。') + '</p>';
      } else {
        html += '<ol class="pb-list">' + list.slice(0, 10).map(function (item, idx) {
          var name = (item.dataLoad && item.dataLoad.nickname) || item.nickname || '神秘经理';
          var rank = Number(item.rank) || idx + 1;
          var score = Number(item.score);
          return '<li' + (item.isCurrentUser ? ' class="me"' : '') + '>' +
            '<b class="pb-rank">' + rank + '</b>' +
            '<span class="pb-name">' + String(name).replace(/[<>&"]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]; }) + '</span>' +
            '<em class="pb-score">' + (Number.isFinite(score) ? score : '—') + ' 次</em>' +
            '</li>';
        }).join('') + '</ol>';
      }
      html += '<p class="pb-note">按累计猜中的比赛场次数排名，同分先达到者在前。</p>';
      section.innerHTML = html;
    }

    function decorate() {
      if (!global.document || !doc.body) return;
      var title = null;
      var titles = doc.querySelectorAll('main.game-content .page-title');
      for (var i = 0; i < titles.length; i++) {
        if ((titles[i].textContent || '').indexOf('每日预测') >= 0) { title = titles[i]; break; }
      }
      var existing = doc.getElementById('cba-predict-board');
      if (!title) {
        if (existing) { existing.remove(); sig = ''; rows = null; }
        return;
      }
      var page = title.closest('section.fantasy-predictions') || title.closest('main.game-content');
      if (!page) return;
      var section = existing;
      if (!section) { section = build(); page.appendChild(section); }
      else if (section.parentElement !== page) { page.appendChild(section); }
      render(section);
    }

    var pendingTimer = null;
    var observer = new MutationObserver(function () {
      if (pendingTimer) return;
      pendingTimer = setTimeout(function () { pendingTimer = null; decorate(); }, 350);
    });
    function start() {
      if (!doc.body) { setTimeout(start, 800); return; }
      observer.observe(doc.body, { childList: true, subtree: true });
      decorate();
    }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start);
    else start();
  }
`;

glue = glue.replace("  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */",
  MODULE + "\n  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */");
glue = glue.replace("  function boot() {\n    installToast();", "  function boot() {\n    installToast();\n    installPredictionBoard();");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (e) { console.log("✗ 语法失败: " + e.message); process.exit(1); }

// 版本
const VER = "20261030j-predict-board";
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '" + VER + "';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=" + VER);
html = html.replace(/cba-lamps-glue\.js\?v=20261030i-ux-motion/, "cba-lamps-glue.js?v=" + VER);
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=" + VER);
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("版本 → " + VER);