// add-coin-ad-reward.js — 金币页排版统一 + 看广告领 300 金币（每日 2 次）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

// 1) 引擎：白名单 + 发奖分支
let js = fs.readFileSync(root + "cba-startup.js", "utf8");
const wlOld = "'taskClaim','dailyCheckin']";
const wlNew = "'taskClaim','dailyCheckin','adCoinReward']";
console.log("白名单匹配:", js.split(wlOld).length - 1);
js = js.split(wlOld).join(wlNew);

const branch = "if(t.type===`adCoinReward`){let d=String(t.date||``);$(/^\\d{4}-\\d{2}-\\d{2}$/.test(d),`奖励日期无效`);if(n.adCoinDate!==d){n.adCoinDate=d;n.adCoinCount=0}$(Number(n.adCoinCount||0)<2,`今日广告金币次数已用完`);n.adCoinCount=Number(n.adCoinCount||0)+1;n.coins+=300;Q_(n,`看广告奖励 +300金币（`+n.adCoinCount+`/2）`);return n}";
const taskAnchor = "if(t.type===`fuse`){";
const idx = js.indexOf(taskAnchor);
console.log("fuse 锚点:", idx);
js = js.slice(0, idx) + branch + js.slice(idx);
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ bundle 语法 OK"); } catch (e) { console.log("✗ bundle:", e.message); process.exit(1); }

// 2) glue：金币页广告入口
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
if (glue.indexOf("installCoinAdReward") < 0) {
  const MODULE = `
  /* ---------- 金币页：看广告领 300 金币（每日 2 次） ---------- */
  function installCoinAdReward() {
    var doc = global.document;
    if (!doc || doc.getElementById('cba-coin-ad')) return;
    var busy = false;

    function chinaDay() {
      try { if (global.CBADataClock && global.CBADataClock.chinaDate) return global.CBADataClock.chinaDate(); } catch (_) {}
      return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
    }
    function readState() {
      try {
        var s = global.CBAStorageSession && global.CBAStorageSession.getSnapshot && global.CBAStorageSession.getSnapshot();
        return (s && (s.state || (s.saved && s.saved.state))) || {};
      } catch (_) { return {}; }
    }
    function remaining() {
      var st = readState(), d = chinaDay();
      var used = String(st.adCoinDate || '') === d ? Number(st.adCoinCount || 0) : 0;
      return Math.max(0, 2 - used);
    }
    function toast(t, kind) { try { global.__CBA_TOAST__ && global.__CBA_TOAST__(t, kind); } catch (_) {} }
    function setText(el, text) { if (el && el.textContent !== text) el.textContent = text; }

    function render() {
      var page = doc.querySelector('.cba-rewards-page');
      var old = doc.getElementById('cba-coin-ad');
      if (!page) { if (old) old.remove(); return; }
      var anchor = page.querySelector('.cba-reward-watch');
      if (!anchor || !anchor.parentElement) return;
      var box = old;
      if (!box) {
        box = doc.createElement('div');
        box.id = 'cba-coin-ad';
        box.className = 'cba-coin-ad';
        var btn = doc.createElement('button');
        btn.type = 'button'; btn.className = 'cba-coin-ad-btn';
        var note = doc.createElement('p');
        note.className = 'cba-coin-ad-note';
        box.appendChild(btn); box.appendChild(note);
        btn.addEventListener('click', claim);
        anchor.parentElement.insertBefore(box, anchor.nextSibling);
      }
      var left = remaining();
      var b = box.querySelector('button'), n = box.querySelector('.cba-coin-ad-note');
      b.disabled = busy || left <= 0;
      setText(b, left <= 0 ? '今日广告金币已领完' : (busy ? '正在播放广告…' : '看广告，直接领 300 金币'));
      if (box.getAttribute('data-left') !== String(left)) {
        box.setAttribute('data-left', String(left));
        n.innerHTML = '每日 2 次 · 今日剩余 <b>' + left + '</b> 次';
      }
    }

    function claim() {
      if (busy) return;
      if (remaining() <= 0) { toast('今日广告金币次数已用完'); return; }
      busy = true; render();
      var play = (inLamps && typeof lampsGame.showRewardedVideo === 'function')
        ? lampsGame.showRewardedVideo({ source: 'coin-reward' })
        : Promise.resolve({ ok: true });
      play.then(function (res) {
        if (!res || !res.ok) throw new Error((res && res.message) || '观看视频失败，请重试');
        try {
          global.CBAStorageSession.dispatch({ type: 'adCoinReward', date: chinaDay() });
        } catch (e) { throw new Error((e && e.message) || '奖励发放失败'); }
        toast('+300 金币已到账');
      }).catch(function (e) {
        toast((e && e.message) || '观看视频失败，请重试', 'error');
      }).then(function () { busy = false; render(); });
    }

    function start() {
      var tries = 0;
      var timer = setInterval(function () {
        tries++;
        if (doc.querySelector('.cba-rewards-page')) { clearInterval(timer); render(); }
        else if (tries > 90) clearInterval(timer);
      }, 1000);
      var pending = null;
      new MutationObserver(function () {
        if (pending) return;
        pending = setTimeout(function () { pending = null; render(); }, 300);
      }).observe(doc.body, { childList: true, subtree: true });
      global.addEventListener('cba:storage-state', function () { setTimeout(render, 60); });
    }

    start();
  }

`;
  glue = glue.replace("  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */",
    MODULE + "  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */");
  glue = glue.replace("  function boot() {\n    installToast();", "  function boot() {\n    installToast();\n    installCoinAdReward();");
  fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
  try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (e) { console.log("✗ glue:", e.message); process.exit(1); }
}

// 3) CSS：金币页排版 + 新入口
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* rewards-layout: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-app .cba-rewards-page{padding:14px 16px 28px!important;background:#090d16!important}
.fantasy-app .cba-rewards-heading{align-items:center!important;gap:12px!important;margin:0 0 14px!important}
.fantasy-app .cba-rewards-heading h2{font-size:18px!important;color:#f8fafc!important}
.fantasy-app .cba-rewards-heading p{margin-top:5px!important;font-size:11px!important;color:#94a3b8!important;line-height:1.5!important}
.fantasy-app .cba-rewards-heading>span{flex:none!important;background:#1b2535!important;border:1px solid #263244!important;border-radius:999px!important;padding:4px 10px!important;font-size:11px!important;font-weight:700!important;color:#a3e635!important;white-space:nowrap!important}
.fantasy-app .cba-reward-watch{border-radius:10px!important;border:1px solid #83bb1b!important;background:linear-gradient(110deg,#a3e635,#83bb1b)!important;color:#111827!important;font-weight:700!important;box-shadow:0 6px 16px #a3e6351f!important}
.fantasy-app .cba-reward-rules{margin:12px 0 14px!important;padding:10px 12px!important;background:#0f1622!important;border:1px solid #263244!important;border-radius:10px!important}
.fantasy-app .cba-reward-rules summary{color:#94a3b8!important;font-size:12px!important}
.fantasy-app .cba-item-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin-top:4px!important}
.fantasy-app .cba-item-card{background:#111827!important;border:1px solid #263244!important;border-radius:12px!important;padding:14px!important}
.fantasy-app .cba-item-card h3{margin:10px 0 6px!important;font-size:14px!important;color:#f8fafc!important}
.fantasy-app .cba-item-card p{font-size:11px!important;line-height:1.5!important;color:#94a3b8!important;min-height:32px!important;margin:0!important}
.fantasy-app .cba-item-card .fantasy-button{width:100%!important;margin-top:10px!important}
.cba-coin-ad{margin:10px 0 0!important;padding:12px!important;background:#0f1622!important;border:1px solid #263244!important;border-radius:12px!important}
.cba-coin-ad-btn{display:block!important;width:100%!important;min-height:44px!important;border:1px solid #263244!important;border-radius:9px!important;background:#1b2535!important;color:#a3e635!important;font:700 13px/1.4 inherit!important;cursor:pointer}
.cba-coin-ad-btn:disabled{color:#64748b!important;cursor:default!important}
.cba-coin-ad-note{margin:8px 0 0!important;color:#94a3b8!important;font-size:11px!important;text-align:center!important;line-height:1.4!important}
.cba-coin-ad-note b{color:#a3e635!important}
`;
  fs.writeFileSync(root + "cba-startup.css", css, "utf8");
  console.log("✓ 金币页样式已统一");
}
