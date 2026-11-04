// ux-motion.js — 交互反馈与动效升级（5 组）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");
let ok = 0, fail = [];
function rep(label, oldS, newS) {
  if (js.indexOf(oldS) < 0) { fail.push(label); return; }
  js = js.split(oldS).join(newS); ok++;
  console.log("✓ " + label);
}

/* ===== 1. 商店翻牌：补 is-opening / just-revealed 类 + 揭示特效时长 ===== */
rep("翻牌类名",
  "className: 'fantasy-flip ' + (slot.revealed ? 'revealed ' : '') + (purchased ? 'signed ' : '')",
  "className: 'fantasy-flip ' + (slot.revealed ? 'revealed ' : '') + (purchased ? 'signed ' : '') + (opening && !slot.revealed ? 'is-opening ' : '') + (freshReveal && freshReveal.slot === id && freshReveal.owner === context.cloudOwner && freshReveal.date === context.date ? 'just-revealed ' : '')");
rep("揭示特效时长",
  "freshTimer.current = root.setTimeout(() => setFreshReveal(null), 180);",
  "freshTimer.current = root.setTimeout(() => setFreshReveal(null), 1100);");
rep("签约成功提示",
  "if (accepted) setSelectedSlot(null); else setNotice(root.CBAStorageSession.getSnapshot()?.message || '签约未被接受，请刷新报价后重试。');",
  "if (accepted) { setSelectedSlot(null); root.__CBA_TOAST__ && root.__CBA_TOAST__('已签下 ' + p.name); } else setNotice(root.CBAStorageSession.getSnapshot()?.message || '签约未被接受，请刷新报价后重试。');");

/* ===== 2. 预测：提交成功提示 + 结算记录高亮 ===== */
rep("预测提交提示",
  "if (root.CBAStorageSession.dispatch({ type: 'predict', matchId: selection.match.id, teamId: selection.team.id, coins, expectedOdds: selection.team.odds, quoteDate: selection.date, multiplierItem: code || null })) clearDraft(); else submitted.current = false;",
  "if (root.CBAStorageSession.dispatch({ type: 'predict', matchId: selection.match.id, teamId: selection.team.id, coins, expectedOdds: selection.team.odds, quoteDate: selection.date, multiplierItem: code || null })) { clearDraft(); root.__CBA_TOAST__ && root.__CBA_TOAST__('预测已提交 · 待开奖'); } else submitted.current = false;");
rep("结算记录类名",
  "h('p', { key: r.matchId }, h('span', null, r.matchLabel || r.teamName || r.day || 'CBA 比赛'),",
  "h('p', { key: r.matchId, className: 'fantasy-settled-row ' + (r.status === 'won' || r.status === 'void' ? 'won' : 'lost') }, h('span', null, r.matchLabel || r.teamName || r.day || 'CBA 比赛'),");

/* ===== 4. 阵容拖拽反馈 ===== */
rep("拖拽反馈",
  "onDragStart: e => { if (dragId) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); } }, onDragOver: e => { if (onDropCard) e.preventDefault(); }, onDrop: e => { if (onDropCard) { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); if (id) onDropCard(id); } },",
  "onDragStart: e => { if (dragId) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); e.currentTarget.classList.add('dragging'); } }, onDragEnd: e => { e.currentTarget.classList.remove('dragging'); document.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over')); }, onDragOver: e => { if (onDropCard) { e.preventDefault(); const pos = e.currentTarget.closest('.court-position'); if (pos) pos.classList.add('drag-over'); } }, onDragLeave: e => { const pos = e.currentTarget.closest('.court-position'); if (pos) pos.classList.remove('drag-over'); }, onDrop: e => { if (onDropCard) { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); if (id) onDropCard(id); const pos = e.currentTarget.closest('.court-position'); if (pos) { pos.classList.remove('drag-over'); pos.classList.remove('tile-pop'); void pos.offsetWidth; pos.classList.add('tile-pop'); } } document.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over')); },");

/* ===== 5. 征战细节 ===== */
rep("快进状态文案",
  "(0,D.jsx)(ug,{}),`快进结束`",
  "(0,D.jsx)(ug,{}),completionPending?`结算中…`:`快进结束`");
rep("战术生效提示",
  "onTactics:(e,t)=>F({type:`adjustMatchTactics`,matchId:xe.id,style:e,playedEvents:t})",
  "onTactics:(e,t)=>{const ok=F({type:`adjustMatchTactics`,matchId:xe.id,style:e,playedEvents:t});ok!==false&&window.__CBA_TOAST__&&window.__CBA_TOAST__(`战术已生效`)}");

if (fail.length) { console.log("✗ 未命中: " + fail.join(" / ")); process.exit(1); }
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ bundle 语法 OK"); } catch (e) { console.log("✗ 语法失败: " + e.message); process.exit(1); }

/* ===== 3+全局 CSS ===== */
const cssPath = root + "cba-startup.css";
let css = fs.readFileSync(cssPath, "utf8");
const MARK = "/* ux-motion: 20261030 */";
if (css.indexOf(MARK) < 0) {
  css += "\n" + MARK + `
@keyframes cba-page-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
main.game-content>*{animation:cba-page-in .18s ease-out}
@keyframes cba-settle-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.match-settled .arena-mvp,.match-settled .arena-rewards,.match-settled .arena-boxscore{animation:cba-settle-in .3s ease-out}
@keyframes cba-tile-pop{0%{transform:scale(.9)}55%{transform:scale(1.03)}100%{transform:scale(1)}}
.court-position.tile-pop .fantasy-person-tile{animation:cba-tile-pop .32s ease-out}
.fantasy-person-tile.dragging{opacity:.55}
.court-position.drag-over .fantasy-person-tile{outline:2px solid #a3e635;outline-offset:2px;border-radius:6px}
.fantasy-settled-row.won b{color:#a3e635}
.fantasy-settled-row.won{animation:cba-settle-in .3s ease-out}
.cba-toast{position:fixed;left:50%;bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:3000;max-width:calc(100% - 48px);padding:9px 16px;border-radius:10px;background:#111827ee;border:1px solid #263244;color:#f8fafc;font:600 13px/1.4 "Noto Sans SC",PingFang SC,Microsoft YaHei,sans-serif;box-shadow:0 8px 24px #0009;opacity:0;transform:translate(-50%,8px);pointer-events:none;white-space:nowrap;backdrop-filter:blur(6px)}
.cba-toast.show{opacity:1;transform:translate(-50%,0);transition:opacity .22s ease,transform .22s ease}
.cba-toast-ok{border-color:#3f5b2a;box-shadow:0 8px 24px #0009,0 0 0 1px #a3e63522}
.cba-toast-ok::before{content:"";display:inline-block;width:7px;height:7px;margin-right:8px;border-radius:50%;background:#a3e635;vertical-align:1px}
@media(prefers-reduced-motion:reduce){main.game-content>*,.court-position.tile-pop .fantasy-person-tile,.match-settled .arena-mvp,.match-settled .arena-rewards,.match-settled .arena-boxscore,.fantasy-settled-row.won{animation:none!important}.cba-toast.show{transition:none}}
`;
  fs.writeFileSync(cssPath, css, "utf8");
  console.log("✓ CSS 动效层已追加");
}

/* ===== 全局 toast 组件（glue） ===== */
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
if (glue.indexOf("__CBA_TOAST__") < 0) {
  const toastCode = `
  /* ---------- 轻提示 Toast（交互反馈） ---------- */
  function installToast() {
    if (global.__CBA_TOAST__) return;
    var queue = [], showing = false;
    function next() {
      var item = queue.shift();
      if (!item) { showing = false; return; }
      showing = true;
      var doc = global.document;
      var el = doc.createElement('div');
      el.className = 'cba-toast cba-toast-' + (item.kind || 'ok');
      el.setAttribute('role', 'status');
      el.textContent = item.text;
      doc.body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add('show'); });
      setTimeout(function () {
        el.classList.remove('show');
        setTimeout(function () { el.remove(); next(); }, 260);
      }, 1800);
    }
    global.__CBA_TOAST__ = function (text, kind) {
      if (!text) return;
      queue.push({ text: String(text), kind: kind || 'ok' });
      if (!showing) next();
    };
  }

`;
  glue = glue.replace("  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */", toastCode + "  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */");
  glue = glue.replace("  function boot() {\n    installFrozenNotice();", "  function boot() {\n    installToast();\n    installFrozenNotice();");
  fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
  console.log("✓ glue toast 组件已注入");
}
try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (e) { console.log("✗ glue 语法失败: " + e.message); process.exit(1); }

/* ===== 版本 ===== */
const VER = "20261030h-ux-motion";
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '" + VER + "';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=" + VER);
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=" + VER);
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("版本 → " + VER);