// lobby-pvp-rank.js — 大厅：移除我的球队，新增匹配对决 + 排行榜磁贴
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

function balanceEnd(src, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    if (c === "\"" || c === "'") { const q = c; i++; while (i < src.length && src[i] !== q) { if (src[i] === "\\") i++; i++; } }
    else if (c === "`") { i++; let d = 0; while (i < src.length) { if (src[i] === "\\") { i += 2; continue; } if (src[i] === "`") break; if (src[i] === "$" && src[i + 1] === "{") { d++; i += 2; continue; } if (d > 0 && src[i] === "}") { d--; } i++; } }
    else if (c === "{" || c === "(" || c === "[") depth++;
    else if (c === "}" || c === ")" || c === "]") { depth--; if (depth === 0) return i; }
  }
  return -1;
}

// 1. 找到 cover-team 磁贴整体（精确起止锚点，避免嵌套模板串误配平）
const anchor = "cover-tile cover-team";
const a = js.indexOf(anchor);
if (a < 0) { console.log("✗ 未找到 cover-team 锚点"); process.exit(1); }
const callStart = js.lastIndexOf("(0,D.jsxs)(", a);
const endMark = "`cover-team-arrow`})]})";
const endAt = js.indexOf(endMark, a);
if (callStart < 0 || endAt < 0) { console.log("✗ cover-team 边界失败"); process.exit(1); }
const callEnd = endAt + endMark.length - 1;
console.log("cover-team 磁贴范围: " + callStart + " ~ " + callEnd);
console.log("起点后文: " + JSON.stringify(js.slice(callStart, callStart + 80)));
console.log("终点后文: " + JSON.stringify(js.slice(callEnd - 30, callEnd + 40)));

const NEW_TILES = "(0,D.jsxs)(`button`,{className:`cover-tile cover-pvp`,onClick:()=>{const snap=window.CBAStorageSession.getSnapshot(),gameState=snap.state||{};const slots=(gameState.lineupSlots&&gameState.lineupSlots.some(Boolean)?gameState.lineupSlots:gameState.lineup||[]).filter(Boolean);if(gameState.pendingMatch){window.__CBA_TOAST__&&window.__CBA_TOAST__(`请先完成当前比赛`);t(`season`);return}if(slots.length!==5){window.__CBA_TOAST__&&window.__CBA_TOAST__(`请先在我的球队上阵 5 位球员`);t(`collection`);return}window.__CBA_TOAST__&&window.__CBA_TOAST__(`正在匹配玩家阵容…`);const ok=window.CBAStorageSession.dispatch({type:`beginMatch`});if(!ok)window.__CBA_TOAST__&&window.__CBA_TOAST__((window.CBAStorageSession.getSnapshot()||{}).message||`匹配暂不可用，请稍后再试`)},children:[(0,D.jsx)(`span`,{className:`module-art art-pvp`}),(0,D.jsxs)(`span`,{className:`cover-label`,children:[(0,D.jsx)(`b`,{children:`匹配对决`}),(0,D.jsx)(`small`,{children:`PVP MATCH`})]}),(0,D.jsxs)(`span`,{className:`cover-foot`,children:[`与玩家阵容实时对阵 `,(0,D.jsx)(Z,{})]})]}),(0,D.jsxs)(`button`,{className:`cover-tile cover-ranking`,onClick:()=>{window.CBALampsRankBoard&&window.CBALampsRankBoard.open()},children:[(0,D.jsx)(`span`,{className:`module-art art-ranking`}),(0,D.jsxs)(`span`,{className:`cover-label`,children:[(0,D.jsx)(`b`,{children:`排行榜`}),(0,D.jsx)(`small`,{children:`LEADERBOARD`})]}),(0,D.jsxs)(`span`,{className:`cover-foot`,children:[`战力 · 价值 · 预测榜 `,(0,D.jsx)(Z,{})]})]})";

js = js.slice(0, callStart) + NEW_TILES + js.slice(callEnd + 1);
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ bundle 语法 OK"); } catch (e) { console.log("✗ 语法失败: " + e.message); process.exit(1); }

// 2. CSS
const cssPath = root + "cba-startup.css";
let css = fs.readFileSync(cssPath, "utf8");
const MARK = "/* lobby-pvp-rank: 20261030 */";
if (css.indexOf(MARK) < 0) {
  css += "\n" + MARK + `
.page-home .cover-grid button.cover-season{grid-area:2/1/auto/7!important}
.page-home .cover-grid button.cover-pvp{grid-area:3/1/auto/7!important;background:radial-gradient(130% 120% at 18% 15%,#1c3149 0,#101a2a 52%,#0b111c 100%)!important;border:1px solid #263244!important;box-shadow:inset 0 1px 0 #ffffff14!important}
.page-home .cover-grid button.cover-pvp .module-art{opacity:0!important}
.page-home .cover-grid button.cover-ranking{grid-area:4/1/auto/7!important}
.page-home .cover-grid button.cover-pvp .cover-label b{color:#f8fafc;text-shadow:0 2px 6px #0008}
.page-home .cover-grid button.cover-pvp .cover-foot{color:#a3e635}
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("✓ CSS 已追加");
}

// 3. glue 排行榜面板
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
if (glue.indexOf("CBALampsRankBoard") < 0) {
  const MODULE = `
  /* ---------- 排行榜面板（战力/价值/预测三榜，Lamps 榜单） ---------- */
  function installRankBoard() {
    var doc = global.document;
    var cache = {};        // type -> {at, list}
    var openPanel = null;
    var activeTab = 'power';
    var TAB_META = [
      { key: 'power', label: '战力榜', unit: '战力' },
      { key: 'value', label: '价值榜', unit: '金币' },
      { key: 'predict', label: '预测榜', unit: '次' }
    ];

    function ensureStyle() {
      if (doc.getElementById('cba-rankboard-style')) return;
      var css = doc.createElement('style');
      css.id = 'cba-rankboard-style';
      css.textContent = [
        '#cba-rankboard-overlay{position:fixed;inset:0;z-index:2800;background:#000000a8;display:flex;align-items:center;justify-content:center;padding:16px}',
        '#cba-rankboard{width:min(420px,100%);max-height:84dvh;display:flex;flex-direction:column;background:#111827;border:1px solid #263244;border-radius:14px;color:#f8fafc;font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;box-shadow:0 16px 48px #000c;overflow:hidden}',
        '#cba-rankboard header{display:flex;align-items:center;gap:10px;padding:14px 16px 10px}',
        '#cba-rankboard header h3{margin:0;font-size:17px;color:#a3e635;letter-spacing:1px;flex:1}',
        '#cba-rankboard header button{background:none;border:0;color:#94a3b8;font-size:20px;cursor:pointer;padding:2px 6px}',
        '#cba-rankboard .rb-tabs{display:flex;gap:6px;padding:0 16px 10px}',
        '#cba-rankboard .rb-tabs button{flex:1;min-height:36px;border:1px solid #263244;border-radius:8px;background:#1b2535;color:#94a3b8;font:600 13px inherit;cursor:pointer}',
        '#cba-rankboard .rb-tabs button.active{background:#1f2b1c;border-color:#a3e63566;color:#a3e635}',
        '#cba-rankboard .rb-list{flex:1;min-height:120px;overflow-y:auto;padding:0 12px 8px;margin:0;list-style:none;display:flex;flex-direction:column;gap:2px}',
        '#cba-rankboard .rb-list li{display:flex;align-items:center;gap:10px;padding:9px 8px;border-radius:8px;font-size:13px}',
        '#cba-rankboard .rb-list li:nth-child(odd){background:#1b2535}',
        '#cba-rankboard .rb-list li.me{outline:1px solid #a3e63566;background:#1f2b1c}',
        '#cba-rankboard .rb-rank{flex:none;width:24px;text-align:center;color:#94a3b8;font:700 12px Arial}',
        '#cba-rankboard .rb-list li:nth-child(1) .rb-rank{color:#ffd700}',
        '#cba-rankboard .rb-list li:nth-child(2) .rb-rank{color:#c0c8d4}',
        '#cba-rankboard .rb-list li:nth-child(3) .rb-rank{color:#cd7f32}',
        '#cba-rankboard .rb-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '#cba-rankboard .rb-score{flex:none;color:#a3e635;font-weight:700;font-variant-numeric:tabular-nums}',
        '#cba-rankboard .rb-state{margin:14px 16px 18px;color:#94a3b8;font-size:12px;line-height:1.6}',
        '#cba-rankboard .rb-state b{color:#a3e635}'
      ].join('');
      doc.head.appendChild(css);
    }

    function esc(v) { return String(v == null ? '' : v).replace(/[<>&"]/g, function (c) { return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]; }); }

    function localStatsText() {
      var out = [];
      try {
        var p = global.CBARankSync && global.CBARankSync.readPredict && global.CBARankSync.readPredict();
        if (p) out.push('本机成功预测 <b>' + p.wins + '</b> 次');
      } catch (_) {}
      out.push('全服榜单需在 Lamps 环境查看，联网后自动上榜');
      return out.join(' · ');
    }

    function renderList() {
      var panel = doc.getElementById('cba-rankboard');
      if (!panel) return;
      ensureStyle();
      var meta = TAB_META.filter(function (t) { return t.key === activeTab; })[0] || TAB_META[0];
      var head = '<header><h3>排行榜</h3><button type="button" aria-label="关闭">✕</button></header>' +
        '<div class="rb-tabs">' + TAB_META.map(function (t) {
          return '<button type="button" data-tab="' + t.key + '" class="' + (t.key === activeTab ? 'active' : '') + '">' + t.label + '</button>';
        }).join('') + '</div>';
      var body;
      var isLamps = inLamps && global.LampsPlatform && typeof global.LampsPlatform.getLeaderboard === 'function';
      if (!isLamps) {
        body = '<p class="rb-state">' + localStatsText() + '</p>';
      } else {
        var c = cache[activeTab];
        if (!c) { body = '<p class="rb-state">正在读取' + meta.label + '…</p>'; fetchBoard(activeTab); }
        else if (!c.list.length) { body = '<p class="rb-state">暂无上榜记录，先完成一场比赛或一次预测吧。</p>'; }
        else {
          body = '<ol class="rb-list">' + c.list.slice(0, 10).map(function (item, idx) {
            var name = (item.dataLoad && item.dataLoad.nickname) || item.nickname || '神秘经理';
            var rank = Number(item.rank) || idx + 1;
            var score = Number(item.score);
            return '<li' + (item.isCurrentUser ? ' class="me"' : '') + '><b class="rb-rank">' + rank + '</b><span class="rb-name">' + esc(name) + '</span><em class="rb-score">' + (Number.isFinite(score) ? score : '—') + ' ' + meta.unit + '</em></li>';
          }).join('') + '</ol>';
        }
      }
      panel.innerHTML = head + body;
      var close = panel.querySelector('header button');
      if (close) close.onclick = closePanel;
      panel.querySelectorAll('.rb-tabs button').forEach(function (btn) {
        btn.onclick = function () { activeTab = btn.getAttribute('data-tab') || 'power'; renderList(); };
      });
    }

    function fetchBoard(type) {
      if (cache[type] && Date.now() - cache[type].at < 60000) { renderList(); return; }
      global.LampsPlatform.getLeaderboard(type).then(function (res) {
        var list = (res && res.ok && res.data && Array.isArray(res.data.list)) ? res.data.list : [];
        cache[type] = { at: Date.now(), list: list };
        if (openPanel) renderList();
      }, function () {
        cache[type] = { at: Date.now(), list: [] };
        if (openPanel) renderList();
      });
    }

    function open() {
      ensureStyle();
      if (openPanel) return;
      var overlay = doc.createElement('div');
      overlay.id = 'cba-rankboard-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', '排行榜');
      var panel = doc.createElement('div');
      panel.id = 'cba-rankboard';
      overlay.appendChild(panel);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) closePanel(); });
      doc.body.appendChild(overlay);
      openPanel = overlay;
      activeTab = 'power';
      renderList();
    }

    function closePanel() {
      if (!openPanel) return;
      openPanel.remove();
      openPanel = null;
    }

    global.CBALampsRankBoard = Object.freeze({ open: open, close: closePanel });
  }

`;
  glue = glue.replace("  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */",
    MODULE + "  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */");
  glue = glue.replace("  function boot() {\n    installToast();", "  function boot() {\n    installToast();\n    installRankBoard();");
  fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
  console.log("✓ 排行榜面板已注入");
}
try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (e) { console.log("✗ glue 语法失败: " + e.message); process.exit(1); }

const VER = "20261030k-pvp-rank";
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '" + VER + "';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=" + VER);
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=" + VER);
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("版本 → " + VER);