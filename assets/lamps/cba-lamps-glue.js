/* cba-lamps-glue.js — Lamps 平台接入层（M1）
 *
 * 职责（取代虎扑平台的接入方式）：
 *   0. 本文件不发起任何第三方域名请求（Lamps 域名门禁合规）
 *   1. 预载 Lamps 云存档（getGameProgress），提供同步存储适配器
 *      `window.CBA_LAMPS_STORAGE` 给 practice 会话（cba-startup.js 注入点）。
 *      读写三层：内存 → localStorage → Lamps 云存档（防抖推送）。
 *   2. 游戏主 bundle（cba-startup.js）改由本文件在云存档预载完成后加载，
 *      保证首次同步 getItem 就能读到云端进度（manifest 已移除该项）。
 *   3. 把虎扑 vatask 广告接口垫到 Lamps 激励视频：
 *      getActivityTaskState → 恒定可播；completeRewardVideo → showRewardedVideo，
 *      只在 res.ok === true 时发奖（code:200 / data.rewarded:true）。
 *      本地调试（UA 无 LampsSDK）直接发奖，保持单机可玩。
 */
(function (global) {
  'use strict';

  var VERSION = '20261103unify-internal22';
  var STARTUP_URL = 'cba-startup.js?v=' + VERSION;
  var PRACTICE_KEY_MARK = ':r13-isolated-practice';
  var platform = global.LampsPlatform || {};
  var lampsGame = global.LampsGame || {};
  var inLamps = false;
  try {
    inLamps = String((global.navigator && global.navigator.userAgent) || '').indexOf('LampsSDK') !== -1;
  } catch (_) {}

  /* ---------- 云存档：预载 / 推送 ---------- */

  var cloudPayload = null;   // Lamps 云端最新一份 practice 存档（字符串）
  var lastPushed = '';
  var pendingText = null;
  var pushTimer = null;
  var pushing = false;

  function preload() {
    // 非 Lamps 环境（本地调试，UA 无 LampsSDK）跳过云端预载，避免通道等待拖慢启动
    if (!inLamps || typeof platform.getGameProgress !== 'function') return Promise.resolve();
    return platform.getGameProgress().then(function (res) {
      if (!res || !res.ok || !res.data || !res.data.record) return;
      var p = res.data.record.gamePayload;
      if (typeof p === 'string') cloudPayload = p;
      else if (p && typeof p === 'object') {
        if (typeof p.game_payload === 'string') cloudPayload = p.game_payload;
        else if (p.state) { try { cloudPayload = JSON.stringify(p); } catch (_) {} }
      }
    }).catch(function () { /* 云端不可用时走本地存档 */ });
  }

  function pushDone() {
    if (pendingText && pendingText !== lastPushed) pushNow();
  }

  function pushNow() {
    if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; }
    if (pushing) return;
    var text = pendingText;
    if (!text || text === lastPushed) return;
    if (typeof platform.saveGameProgress !== 'function') return;
    pendingText = null; pushing = true;
    platform.saveGameProgress({ game_payload: text }).then(function (res) {
      pushing = false;
      if (res && res.ok) lastPushed = text;
      pushDone();
    }).catch(function () { pushing = false; pushDone(); });
  }

  function queuePush(text) {
    pendingText = text;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(pushNow, 800);
  }

  global.addEventListener('visibilitychange', function () {
    if (global.document.visibilityState === 'hidden') pushNow();
  });
  global.addEventListener('pagehide', pushNow);
  global.addEventListener('beforeunload', pushNow);

  /* ---------- 同步存储适配器（practice 会话注入点） ---------- */

  var mem = {};
  var adapter = {
    getItem: function (key) {
      if (Object.prototype.hasOwnProperty.call(mem, key)) return mem[key];
      var local = null;
      try { local = global.localStorage.getItem(key); } catch (_) {}
      if ((local == null || local === '') && cloudPayload != null && String(key).indexOf(PRACTICE_KEY_MARK) >= 0) {
        local = cloudPayload;
      }
      return local;
    },
    setItem: function (key, value) {
      mem[key] = String(value);
      try { global.localStorage.setItem(key, String(value)); } catch (_) {}
      if (String(key).indexOf(PRACTICE_KEY_MARK) >= 0) queuePush(String(value));
    },
    removeItem: function (key) {
      delete mem[key];
      try { global.localStorage.removeItem(key); } catch (_) {}
    }
  };
  global.CBA_LAMPS_STORAGE = adapter;

  /* ---------- vatask → Lamps 激励视频 ---------- */

  var colorbox = global.ColorboxAI = global.ColorboxAI || {};
  colorbox.vatask = {
    getActivityTaskState: function () {
      // 游戏只认 code:200 + tasks[].taskCode==='reward' && status==='pending'
      return Promise.resolve({ code: 200, data: { tasks: [{ taskCode: 'reward', status: 'pending' }] } });
    },
    completeRewardVideo: function () {
      if (!inLamps || typeof lampsGame.showRewardedVideo !== 'function') {
        // 本地调试：无 Lamps 宿主，直接发奖保持可玩（线上 Lamps 环境不会走到这里）
        return Promise.resolve({ code: 200, data: { rewarded: true } });
      }
      return lampsGame.showRewardedVideo({ source: 'shop-refresh' }).then(function (res) {
        if (res && res.ok) return { code: 200, data: { rewarded: true } };
        return { code: 0, message: (res && res.message) || '观看视频失败，请重试' };
      });
    }
  };

  /* ---------- 数据冻结提示（每日预测/范特西表现榜） ----------
   * 数据源接口（/cba/*）接入前，真实赛果快照冻结在内置 player-feed.json。
   * 在这两页的页头下加一行提示，避免玩家把过期数据当成最新赛果。
   */
  function installFrozenNotice() {
    var doc = global.document;
    var MARK = 'data-lamps-frozen-note';
    function snapshotDate() {
      try {
        var feed = (global.CBAPlayerData && global.CBAPlayerData.getSnapshot && global.CBAPlayerData.getSnapshot())
          || global.CBA_PLAYER_FEED || {};
        var d = String(feed.updatedAt || '').slice(0, 10);
        return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '';
      } catch (_) { return ''; }
    }
    function decorate() {
      var titles = doc.querySelectorAll('main.game-content .page-title');
      for (var i = 0; i < titles.length; i++) {
        var el = titles[i];
        var text = (el.textContent || '').trim();
        if (text.indexOf('每日预测') < 0 && text.indexOf('范特西表现榜') < 0) continue;
        // textContent 赋值即使内容相同也会触发 mutation（否则 MutationObserver 无限循环冻结页面）
        var label = '真实数据快照更新至 ' + (snapshotDate() || '2026-10-19') + ' · 联网自动同步';
        var existing = el.parentElement && el.parentElement.querySelector('[' + MARK + ']');
        if (!existing) {
          var main = el.closest('main.game-content');
          if (!main) continue;
          var note = doc.createElement('p');
          note.setAttribute(MARK, '1');
          note.style.cssText = 'margin:0;padding:6px 14px;font-size:12px;line-height:1.5;color:#94a3b8;';
          note.textContent = label;
          main.insertBefore(note, el.nextSibling);
        } else if (existing.textContent !== label) {
          existing.textContent = label;
        }
      }
    }
    var observer = new MutationObserver(decorate);
    function start() {
      observer.observe(doc.body, { childList: true, subtree: true });
      decorate();
    }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start);
    else start();
  }

  /* ---------- 状态角标（P1-b）：市场页/球员行可视化 ----------
   * 在 button.fantasy-row 的球员名旁注入 火热/冰凉/伤停/轮休 徽章。
   * 球员名→状态 映射来自 CBAFantasyPricing.listPlayers() + CBAFormR29。
   * React 重渲染会清掉注入节点，MutationObserver 自动补挂。
   */
  function installFormBadges() {
    var doc = global.document;
    var css = doc.createElement('style');
    css.textContent = [
      '.cba-form-badge{display:inline-block;margin-left:6px;padding:1px 6px;border-radius:8px;',
      'font-size:10px;line-height:1.5;font-weight:700;vertical-align:middle;white-space:nowrap;',
      'width:max-content;max-width:100%;align-self:flex-start;}',
      '.cba-form-hot{background:#111827;color:#f8fafc;border:1px solid #1b2535;}',
      '.cba-form-cold{background:#111827;color:#8cd0ef;border:1px solid #1b2535;}',
      '.cba-form-injured{background:#111827;color:#f8fafc;border:1px solid #1b2535;}',
      '.cba-form-rested{background:#263244;color:#f8fafc;border:1px solid #64748b;}',
      '.cba-form-legend{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;margin:8px 0 10px;padding:8px 10px;border-radius:10px;background:#111827;border:1px solid #263244;font-size:10px;line-height:1.6;color:#94a3b8;}',
      '.cba-form-legend>b{color:#f8fafc;font-size:10px;margin-right:2px;}',
      '.cba-form-legend-item{white-space:nowrap;}',
      '.cba-form-panel{margin:10px 14px 0;padding:9px 12px;border-radius:12px;background:#111827;border:1px solid #263244;}',
      '.cba-form-panel>div{display:flex;align-items:center;justify-content:space-between;gap:8px;}',
      '.cba-form-panel b{font-size:12px;color:#f8fafc;}',
      '.cba-form-panel span{font-size:12px;font-weight:800;color:#a3e635;}',
      '.cba-form-panel small{display:block;margin-top:3px;font-size:10px;color:#94a3b8;}',
      '.cba-form-panel.cba-form-rested span,.cba-form-panel.cba-form-cold span{color:#38bdf8;}',
      '.cba-form-panel.cba-form-injured span{color:#f87171;}',
      '.cba-form-panel.cba-form-normal span{color:#94a3b8;}',
      '.fantasy-person-tile{position:relative;}',
      '.cba-tile-badge{position:absolute!important;top:4px!important;left:4px!important;z-index:5!important;margin:0!important;padding:1px 5px!important;font-size:9px!important;border-radius:6px!important;background:#090d16e6!important;color:#f8fafc!important;border:1px solid #263244!important;box-shadow:0 2px 8px #00000066!important;}',
      '.cba-tile-badge.cba-form-hot{color:#a3e635!important;}',
      '.cba-tile-badge.cba-form-cold,.cba-tile-badge.cba-form-rested{color:#38bdf8!important;}',
      '.cba-tile-badge.cba-form-injured{color:#f87171!important;}',
    ].join('');
    doc.head.appendChild(css);

    var nameMap = null; // name -> {id, form}
    function refreshNameMap() {
      try {
        var list = global.CBAFantasyPricing && global.CBAFantasyPricing.listPlayers
          ? global.CBAFantasyPricing.listPlayers() : [];
        var map = {};
        for (var i = 0; i < list.length; i++) {
          var p = list[i];
          var st = global.CBAFormR29.status(p.id);
          if (st.kind !== 'normal') map[p.name] = { kind: st.kind, label: st.label };
        }
        nameMap = map;
      } catch (_) { nameMap = nameMap || {}; }
    }

    var FORM_INFO = {
      hot: { badge: '🔥火热', effect: '能力 +5%', desc: '近 3 场范特西得分 ≥ 赛季平均值 ×1.2' },
      cold: { badge: '🧊冰凉', effect: '能力 -5%', desc: '近 3 场范特西得分 ≤ 赛季平均值 ×0.8' },
      rested: { badge: '😴轮休', effect: '能力 -8%', desc: '上一场出战不足 15 分钟' },
      injured: { badge: '🏥伤停', effect: '禁止进入首发', desc: '最近 2 场球队比赛连续未出战' }
    };
    var FORM_ORDER = ['hot', 'cold', 'rested', 'injured'];
    function decorate() {
      if (!global.CBAFormR29) return;
      if (!nameMap) refreshNameMap();
      // 市场页等：button.fantasy-row
      var rows = doc.querySelectorAll('button.fantasy-row:not([data-cba-form])');
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        row.setAttribute('data-cba-form', '1');
        var person = row.querySelector('.fantasy-row-person');
        var nameEl = person ? person.querySelector('strong') : null;
        if (!nameEl) continue;
        var info = nameMap[nameEl.textContent.trim()];
        if (!info || !FORM_INFO[info.kind]) continue;
        var meta = FORM_INFO[info.kind];
        var badge = doc.createElement('span');
        badge.className = 'cba-form-badge cba-form-' + info.kind;
        badge.textContent = meta.badge;
        badge.title = meta.desc;
        badge.setAttribute('aria-label', info.label);
        person.appendChild(badge);
      }
      // 表现榜：.schedule-game（球员名在 .schedule-player-name）
      var sched = doc.querySelectorAll('main.game-content .schedule-game:not([data-cba-form])');
      for (var k = 0; k < sched.length; k++) {
        var srow = sched[k];
        srow.setAttribute('data-cba-form', '1');
        var sName = srow.querySelector('.schedule-player-name');
        if (!sName) continue;
        var nm = (sName.textContent || '').trim();
        var info2 = nameMap[nm] || nameMap[nm.split(' ')[0]] || null;
        if (!info2 || !FORM_INFO[info2.kind]) continue;
        var meta2 = FORM_INFO[info2.kind];
        var badge2 = doc.createElement('span');
        badge2.className = 'cba-form-badge cba-form-' + info2.kind;
        badge2.textContent = meta2.badge;
        badge2.title = meta2.desc;
        badge2.setAttribute('aria-label', info2.label);
        sName.appendChild(badge2);
      }
      // 我的球队：首发/替补球员卡状态角标（直接按 data-cba-motion-player 查状态）
      var tiles = doc.querySelectorAll('button[data-cba-motion-player]:not([data-cba-form-tile])');
      for (var ti = 0; ti < tiles.length; ti++) {
        var tile = tiles[ti];
        tile.setAttribute('data-cba-form-tile', '1');
        var pid = tile.getAttribute('data-cba-motion-player');
        var tst;
        try { tst = global.CBAFormR29.status(pid); } catch (_) { continue; }
        if (!tst || !FORM_INFO[tst.kind]) continue;
        var tmeta = FORM_INFO[tst.kind];
        var tbadge = doc.createElement('span');
        tbadge.className = 'cba-form-badge cba-tile-badge cba-form-' + tst.kind;
        tbadge.textContent = tmeta.badge;
        tbadge.title = tmeta.desc;
        tile.appendChild(tbadge);
      }
      // 右上角「游戏说明」入口（React 重渲染后补挂）
      try { global.__CBA_GUIDE_ENSURE__ && global.__CBA_GUIDE_ENSURE__(); } catch (_) {}
      // 市场「行情日期 / 最近赛果」状态行
      try { global.__CBA_MARKET_SYNC_ENSURE__ && global.__CBA_MARKET_SYNC_ENSURE__(); } catch (_) {}
      // 签到页返回大厅按钮
      try { global.__CBA_CHECKIN_BACK_ENSURE__ && global.__CBA_CHECKIN_BACK_ENSURE__(); } catch (_) {}
    }

    var pending = null;
    var observer = new MutationObserver(function () {
      if (pending) return;
      pending = setTimeout(function () { pending = null; decorate(); }, 120);
    });
    function start() {
      if (!doc.body) { setTimeout(start, 300); return; }
      // React 切页会整体替换 <main>，之前挂在 main 上的观察器会失效，
      // 只能等 2 秒兜底才补角标。改挂到 body，切页也能立即触发。
      observer.observe(doc.body, { childList: true, subtree: true });
      setInterval(decorate, 800); // 兜底：极端情况下补挂
      if (global.addEventListener) {
        global.addEventListener('cba:player-data-updated', function () {
          nameMap = null; // 赛果更新后重建 姓名→状态 映射
          decorate();
        });
      }
      decorate();
    }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start);
    else start();
  }

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
        '#cba-predict-board .pb-list li.me{outline:1px solid #a3e63566;background:#111827}',
        '#cba-predict-board .pb-rank{flex:none;width:22px;text-align:center;color:#94a3b8;font:700 12px Arial}',
        '#cba-predict-board .pb-list li:nth-child(1) .pb-rank{color:#1b2535}',
        '#cba-predict-board .pb-list li:nth-child(2) .pb-rank{color:#a2d9f2}',
        '#cba-predict-board .pb-list li:nth-child(3) .pb-rank{color:#1b2535}',
        '#cba-predict-board .pb-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '#cba-predict-board .pb-score{flex:none;color:#a3e635;font-weight:700;font-variant-numeric:tabular-nums}',
        '#cba-predict-board .pb-empty,#cba-predict-board .pb-local{margin:6px 2px 4px;color:#94a3b8;font-size:12px;line-height:1.6}',
        '#cba-predict-board .pb-local b{color:#a3e635}',
        '#cba-predict-board .pb-note{margin:8px 2px 2px;color:#1b2535;font-size:10px}'
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
        '#cba-rankboard-overlay{position:fixed;inset:0;z-index:2800;background:#090d16a8;display:flex;align-items:center;justify-content:center;padding:16px}',
        '#cba-rankboard{width:min(420px,100%);max-height:84dvh;display:flex;flex-direction:column;background:#111827;border:1px solid #263244;border-radius:14px;color:#f8fafc;font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;box-shadow:0 16px 48px #000c;overflow:hidden}',
        '#cba-rankboard header{display:flex;align-items:center;gap:10px;padding:14px 16px 10px}',
        '#cba-rankboard header h3{margin:0;font-size:17px;color:#a3e635;letter-spacing:1px;flex:1}',
        '#cba-rankboard header button{background:none;border:0;color:#94a3b8;font-size:20px;cursor:pointer;padding:2px 6px}',
        '#cba-rankboard .rb-tabs{display:flex;gap:6px;padding:0 16px 10px}',
        '#cba-rankboard .rb-tabs button{flex:1;min-height:36px;border:1px solid #263244;border-radius:8px;background:#1b2535;color:#94a3b8;font:600 13px inherit;cursor:pointer}',
        '#cba-rankboard .rb-tabs button.active{background:#111827;border-color:#a3e63566;color:#a3e635}',
        '#cba-rankboard .rb-list{flex:1;min-height:120px;overflow-y:auto;padding:0 12px 8px;margin:0;list-style:none;display:flex;flex-direction:column;gap:2px}',
        '#cba-rankboard .rb-list li{display:flex;align-items:center;gap:10px;padding:9px 8px;border-radius:8px;font-size:13px}',
        '#cba-rankboard .rb-list li:nth-child(odd){background:#1b2535}',
        '#cba-rankboard .rb-list li.me{outline:1px solid #a3e63566;background:#111827}',
        '#cba-rankboard .rb-rank{flex:none;width:24px;text-align:center;color:#94a3b8;font:700 12px Arial}',
        '#cba-rankboard .rb-list li:nth-child(1) .rb-rank{color:#1b2535}',
        '#cba-rankboard .rb-list li:nth-child(2) .rb-rank{color:#a2d9f2}',
        '#cba-rankboard .rb-list li:nth-child(3) .rb-rank{color:#1b2535}',
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
      var s = value;
      for (var n = 0; n < 3 && typeof s === 'string'; n++) {
        s = s.trim();
        if (!s) return null;
        var before = s;
        try { s = decodeURIComponent(s); } catch (_) {}
        try { return JSON.parse(s); } catch (_) {}
        if (s === before) return null;
      }
      return s && typeof s === 'object' && !Array.isArray(s) ? s : null;
    }
    function failureMessage(res) {
      try {
        if (res && res.message) return String(res.message);
        var d = res && res.data;
        if (d && (d.msg || d.message)) return String(d.msg || d.message);
        if (d && d.code !== undefined && d.code !== 0) return '行情刷新失败（' + d.code + '）';
      } catch (_) {}
      return '行情刷新失败，请稍后再试';
    }
    function extractFeed(res) {
      if (!res || !res.ok) return null;
      var d = res.data;
      for (var i = 0; i < 5; i++) {
        var parsed = decodeFeedValue(d);
        if (!parsed) break;
        d = parsed;
        if (d.players && d.schedules) return d;
        if (d.data !== undefined) { d = d.data; continue; }
        if (d.result !== undefined) { d = d.result; continue; }
        break;
      }
      return d && typeof d === 'object' && d.players && d.schedules ? d : null;
    }

    function snapshotDate() {
      try {
        var snap = global.CBAPlayerData && global.CBAPlayerData.getSnapshot && global.CBAPlayerData.getSnapshot();
        return String((snap && snap.updatedAt) || '');
      } catch (_) { return ''; }
    }
    /* 拿到接口数据后与包内/缓存快照做保护性合并：
     * 接口若只返回增量赛程，也按 id 并入，避免整季赛程被截断；
     * coverage 只前进不后退；teams 缺失时保留原有。 */
    function mergeSnapshot(feed) {
      var base = {};
      try { base = (global.CBAPlayerData && global.CBAPlayerData.getSnapshot && global.CBAPlayerData.getSnapshot()) || {}; } catch (_) {}
      var merged = {};
      for (var k in feed) if (Object.prototype.hasOwnProperty.call(feed, k)) merged[k] = feed[k];
      var baseSchedules = Array.isArray(base.schedules) ? base.schedules : [];
      var incoming = Array.isArray(feed.schedules) ? feed.schedules : [];
      if (incoming.length && baseSchedules.length && incoming.length < baseSchedules.length) {
        var byId = {}, order = [];
        var add = function (item) {
          if (!item || typeof item !== 'object') return;
          var id = item.id != null ? String(item.id) : (item.matchId != null ? String(item.matchId) : (item.scheduleId != null ? String(item.scheduleId) : ''));
          if (!id) return;
          if (!byId[id]) { order.push(id); byId[id] = item; }
          else {
            var prev = byId[id];
            for (var kk in item) if (Object.prototype.hasOwnProperty.call(item, kk)) prev[kk] = item[kk];
          }
        };
        baseSchedules.forEach(add);
        incoming.forEach(add);
        merged.schedules = order.map(function (id) { return byId[id]; });
      }
      if (base.coverage && merged.coverage) {
        var a = String(base.coverage.completeThrough || '');
        var b = String(merged.coverage.completeThrough || '');
        if (a && (!b || b < a)) merged.coverage = base.coverage;
      }
      if (!merged.teams && base.teams) merged.teams = base.teams;
      return merged;
    }
    function applyFeed(feed, source) {
      try {
        var current = snapshotDate();
        var next = String(feed.updatedAt || '');
        if (next && current && next <= current) {
          console.log('[赛果同步] ' + source + ' 数据不新于本地，跳过（' + next + '）');
          return false;
        }
        global.CBAPlayerData.update(mergeSnapshot(feed));
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

    function forceSync() {
      if (!global.LampsGame || typeof global.LampsGame.request !== 'function') {
        return Promise.resolve({ ok: false, message: '当前为离线预览，联网后即可刷新行情' });
      }
      if (running) return Promise.resolve({ ok: false, busy: true, message: '数据正在同步，请稍候' });
      running = true;
      lastSync = Date.now();
      return global.LampsGame.request({
        url: OFFICIAL_FEED_URL,
        method: 'get',
        header: { 'Content-Type': 'application/json' },
      }).then(function (res) {
        running = false;
        var feed = extractFeed(res);
        var snap = {};
        try { snap = global.CBAPlayerData.getSnapshot() || {}; } catch (_) {}
        var date = String((snap && snap.updatedAt) || '').slice(0, 10);
        if (!feed) return { ok: false, message: failureMessage(res) };
        saveCache(feed);
        var updated = applyFeed(feed, 'manual');
        if (updated) {
          try { snap = global.CBAPlayerData.getSnapshot() || snap; } catch (_) {}
          date = String((snap && snap.updatedAt) || feed.updatedAt || '').slice(0, 10);
        }
        return { ok: true, updated: updated, date: date };
      }, function (err) {
        running = false;
        return { ok: false, message: (err && err.message) || '行情刷新失败，请稍后再试' };
      });
    }
    global.CBAOfficialFeedRefresh = forceSync;

    function start() {
      // 等游戏数据 API 就绪：先回放本地缓存，再联网同步
      var tries = 0;
      var timer = setInterval(function () {
        tries++;
        if (global.CBAPlayerData && typeof global.CBAPlayerData.update === 'function') {
          clearInterval(timer);
          var cached = loadCache();
          if (cached) applyFeed(cached, 'cache');
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


  /* ---------- 右上角「游戏说明」：集中展示临场状态等规则 ---------- */
  function installGameGuide() {
    var doc = global.document;
    if (!doc || global.__CBA_GUIDE__) return;
    global.__CBA_GUIDE__ = true;

    var css = doc.createElement('style');
    css.textContent = [
      '.cba-guide-trigger{padding:6px 9px!important;font-size:11px!important;line-height:1.2!important;border-radius:6px!important;background:#111827!important;color:#f8fafc!important;border:1px solid #64748b!important;font-weight:700!important;white-space:nowrap;}',
      '.game-header{position:relative!important;}',
      '.cba-guide-trigger-top{position:absolute!important;right:16px!important;top:69px!important;z-index:30!important;padding:4px 8px!important;font-size:10px!important;line-height:1.2!important;color:#94a3b8!important;border-color:#263244!important;background:#111827!important;}',
      '.cba-guide-backdrop{position:fixed;inset:0;z-index:13000;background:#000000b8;display:flex;align-items:flex-end;justify-content:center;}',
      '.cba-guide-sheet{width:min(100%,480px);max-height:88vh;background:#0b1220;border:1px solid #263244;border-bottom:0;border-radius:16px 16px 0 0;display:flex;flex-direction:column;box-shadow:0 -12px 40px #00000099;}',
      '.cba-guide-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #263244;flex:0 0 auto;}',
      '.cba-guide-head h2{margin:0;font-size:16px;color:#f8fafc;}',
      '.cba-guide-close{width:34px;height:34px;border-radius:50%;border:1px solid #64748b;background:#111827;color:#f8fafc;font-size:20px;line-height:1;display:grid;place-items:center;}',
      '.cba-guide-body{overflow-y:auto;-webkit-overflow-scrolling:touch;padding:14px 16px calc(28px + env(safe-area-inset-bottom));}',
      '.cba-guide-body h3{margin:16px 0 8px;font-size:13px;color:#a3e635;}',
      '.cba-guide-body h3:first-child{margin-top:0;}',
      '.cba-guide-body p{margin:0 0 8px;font-size:12px;line-height:1.7;color:#cbd5e1;}',
      '.cba-guide-status{list-style:none;margin:0;padding:0;display:grid;gap:8px;}',
      '.cba-guide-status li{background:#111827;border:1px solid #263244;border-radius:10px;padding:9px 11px;}',
      '.cba-guide-status-top{display:flex;align-items:center;justify-content:space-between;gap:10px;}',
      '.cba-guide-status-top b{font-size:13px;color:#f8fafc;}',
      '.cba-guide-status-top strong{font-size:12px;color:#a3e635;font-weight:800;}',
      '.cba-guide-status li small{display:block;margin-top:4px;font-size:10px;line-height:1.6;color:#94a3b8;}',
      '.cba-guide-cold strong,.cba-guide-rested strong{color:#38bdf8!important;}',
      '.cba-guide-injured strong{color:#f87171!important;}',
    ].join('');
    doc.head.appendChild(css);

    function el(tag, cls, text) {
      var node = doc.createElement(tag);
      if (cls) node.className = cls;
      if (text != null) node.textContent = String(text);
      return node;
    }
    function statusRow(kind, emoji, name, effect, condition) {
      var li = el('li', 'cba-guide-' + kind);
      var top = el('div', 'cba-guide-status-top');
      top.appendChild(el('b', '', emoji + ' ' + name));
      top.appendChild(el('strong', '', effect));
      li.appendChild(top);
      li.appendChild(el('small', '', condition));
      return li;
    }

    var panel = null;
    function onKey(event) { if (event.key === 'Escape') close(); }
    function close() {
      if (panel) { try { panel.remove(); } catch (_) {} panel = null; }
      doc.removeEventListener('keydown', onKey);
    }
    function open() {
      if (panel) return;
      panel = el('div', 'cba-guide-backdrop');
      panel.setAttribute('data-cba-guide', '1');
      panel.addEventListener('click', function (event) { if (event.target === panel) close(); });

      var sheet = el('section', 'cba-guide-sheet');
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-modal', 'true');
      sheet.setAttribute('aria-label', '游戏说明');
      var head = el('header', 'cba-guide-head');
      head.appendChild(el('h2', '', '游戏说明'));
      var closeBtn = el('button', 'cba-guide-close', '×');
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', '关闭');
      closeBtn.addEventListener('click', close);
      head.appendChild(closeBtn);

      var body = el('div', 'cba-guide-body');
      body.appendChild(el('h3', '', '临场状态'));
      body.appendChild(el('p', '', '状态每日按真实比赛数据更新，只影响你首发球员的有效能力，不改变市场身价。'));
      var list = el('ul', 'cba-guide-status');
      list.appendChild(statusRow('hot', '🔥', '火热', '能力 +5%', '近 3 场范特西得分 ≥ 赛季平均值 ×1.2'));
      list.appendChild(statusRow('cold', '🧊', '冰凉', '能力 -5%', '近 3 场范特西得分 ≤ 赛季平均值 ×0.8'));
      list.appendChild(statusRow('rested', '😴', '轮休', '能力 -8%', '上一场出战不足 15 分钟'));
      list.appendChild(statusRow('injured', '🏥', '伤停', '禁止进入首发', '最近 2 场球队比赛连续未出战'));
      body.appendChild(list);

      body.appendChild(el('h3', '', '签约与身价'));
      body.appendChild(el('p', '', '签约市场价格每天 00:00 按真实赛果更新；当天没有新赛果时维持前值。卖出按当前市场价的 90% 回收（10% 手续费）。'));
      body.appendChild(el('p', '', '市场排序：点击「涨跌幅 / 能力 / 价格」切换排序，再点同一标签切换正序与倒序。'));
      body.appendChild(el('h3', '', '教练战力'));
      body.appendChild(el('p', '', '教练基础战力＝上季胜率×10%，只统计已核实的本人执教战绩；新帅或记录待核实的教练显示「待核实」，暂不计战力。'));
      body.appendChild(el('h3', '', '阵容与战力'));
      body.appendChild(el('p', '', '首发 5 人；位置不符会降低有效能力（8%–22%）；战力为首发球员有效能力之和。'));
      body.appendChild(el('h3', '', '金币'));
      body.appendChild(el('p', '', '新账户开局 500 金币；每日签到、每日任务、比赛结算和广告都能获得金币。金币仅用于游戏，无提现。'));

      sheet.appendChild(head);
      sheet.appendChild(body);
      panel.appendChild(sheet);
      doc.body.appendChild(panel);
      doc.addEventListener('keydown', onKey);
    }
    global.__CBA_OPEN_GUIDE__ = open;
    global.__CBA_GUIDE_ENSURE__ = function () {
      var header = doc.querySelector('.game-header');
      if (!header) return;
      var triggers = doc.querySelectorAll('[data-cba-guide-trigger]');
      for (var i = 0; i < triggers.length; i++) {
        if (!header.contains(triggers[i])) triggers[i].remove();
      }
      if (header.querySelector('[data-cba-guide-trigger]')) return;
      var btn = el('button', 'cba-guide-trigger cba-guide-trigger-top', '游戏说明');
      btn.type = 'button';
      btn.setAttribute('data-cba-guide-trigger', '1');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        open();
      });
      header.appendChild(btn);
    };
  }

  /* ---------- 签到页：与「范特西表现榜」统一的页头、统计栏和列表行 ---------- */
  function installCheckinBack() {
    var doc = global.document;
    if (!doc || global.__CBA_CHECKIN_BACK__) return;
    global.__CBA_CHECKIN_BACK__ = true;
    var css = doc.createElement('style');
    css.textContent = [
      '.fantasy-app .page-checkin .cba-attendance{margin:0 0 18px!important;}',
      '.fantasy-app .page-checkin .cba-checkin-title{margin:0!important;padding:14px 0!important;border-bottom:1px solid #1f2b3a!important;}',
      '.fantasy-app .page-checkin .cba-checkin-title h1{color:#f8fafc!important;font-size:22px!important;line-height:1.3!important;letter-spacing:1px!important;}',
      '.fantasy-app .page-checkin .cba-checkin-title>span{color:#64748b!important;font-size:9px!important;letter-spacing:1px!important;margin-left:auto;}',
      '.fantasy-app .page-checkin .cba-checkin-back{display:flex!important;align-items:center!important;justify-content:center!important;',
      'width:21px!important;height:21px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;',
      'background:none!important;color:#f8fafc!important;font-size:0!important;line-height:0!important;box-shadow:none!important;align-self:center!important;}',
      '.fantasy-app .page-checkin .cba-checkin-back::before{content:none!important;}',
      '.fantasy-app .page-checkin .cba-checkin-back svg{width:21px!important;height:21px!important;display:block!important;}',
      '.fantasy-app .page-checkin .cba-checkin-date{margin:8px 0 12px!important;font-size:11px!important;line-height:1.5!important;color:#94a3b8!important;}',
      '.fantasy-app .page-checkin .cba-checkin-stats{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;margin:0 0 14px!important;border:1px solid #263244!important;border-radius:8px!important;overflow:hidden!important;background:#111827!important;}',
      '.fantasy-app .page-checkin .cba-checkin-stats>div{padding:9px 6px!important;text-align:center!important;border-left:1px solid #263244!important;}',
      '.fantasy-app .page-checkin .cba-checkin-stats>div:first-child{border-left:0!important;}',
      '.fantasy-app .page-checkin .cba-checkin-stats small{display:block!important;font-size:9px!important;line-height:1.5!important;color:#94a3b8!important;letter-spacing:.4px!important;}',
      '.fantasy-app .page-checkin .cba-checkin-stats b{display:block!important;margin-top:2px!important;font-size:14px!important;line-height:1.3!important;color:#f8fafc!important;font-variant-numeric:tabular-nums;}',
      '.fantasy-app .page-checkin .cba-checkin-stats b.is-green{color:#a3e635!important;}',
      '.fantasy-app .page-checkin .attendance-hero{display:none!important;}',
      '.fantasy-app .page-checkin .attendance-meta{display:none!important;}',
      '.fantasy-app .page-checkin .attendance-month{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:none!important;grid-auto-rows:auto!important;align-content:start!important;gap:9px!important;row-gap:9px!important;padding:0!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;}',
      '.fantasy-app .page-checkin .attendance-cell{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;',
      'grid-template-areas:"day state" "label label" "amount amount"!important;gap:3px 6px!important;align-items:center!important;',
      'min-height:0!important;min-width:0!important;max-width:100%!important;box-sizing:border-box!important;padding:11px 12px!important;border:1px solid #263244!important;border-radius:10px!important;background:#111827!important;text-align:left!important;overflow:hidden!important;}',
      '.fantasy-app .page-checkin .attendance-cell.is-blank{display:none!important;}',
      '.fantasy-app .page-checkin .attendance-day{grid-area:day!important;font-size:9px!important;font-weight:600!important;line-height:1.5!important;color:#94a3b8!important;text-align:left!important;letter-spacing:.5px!important;}',
      '.fantasy-app .page-checkin .attendance-state{grid-area:state!important;position:static!important;background:none!important;padding:0!important;font-size:9px!important;font-weight:600!important;line-height:1.5!important;color:#64748b!important;text-align:right!important;white-space:nowrap!important;}',
      '.fantasy-app .page-checkin .attendance-cell.is-claimed .attendance-state{background:none!important;color:#a3e635!important;}',
      '.fantasy-app .page-checkin .attendance-day-label{grid-area:label!important;font-size:10px!important;font-weight:600!important;line-height:1.35!important;color:#f8fafc!important;text-align:left!important;margin:1px 0 0!important;white-space:normal!important;overflow-wrap:anywhere!important;}',
      '.fantasy-app .page-checkin .attendance-coin-amount{grid-area:amount!important;height:auto!important;display:block!important;margin-top:2px!important;font-size:clamp(19px,5vw,24px)!important;font-weight:800!important;line-height:1.15!important;color:#a3e635!important;text-align:left!important;letter-spacing:0!important;}',
      '.fantasy-app .page-checkin .attendance-coin-amount::after{content:" 金币";font-size:9px!important;font-weight:600!important;color:#94a3b8!important;letter-spacing:0!important;}',
      '.fantasy-app .page-checkin .attendance-name{display:none!important;}',
      '.fantasy-app .page-checkin .attendance-edition{display:none!important;}',
      '.fantasy-app .page-checkin .attendance-cell.day-7{grid-column:1/-1!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-areas:"day state" "label amount"!important;padding:13px 14px!important;}',
      '.fantasy-app .page-checkin .attendance-cell.day-7 .attendance-coin-amount{text-align:right!important;font-size:clamp(22px,6vw,28px)!important;margin-top:0!important;}',
      '@media (max-width:430px){',
      '.fantasy-app .page-checkin .attendance-month{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;row-gap:10px!important;}',
      '.fantasy-app .page-checkin .attendance-cell{padding:12px!important;}',
      '.fantasy-app .page-checkin .attendance-day{font-size:10px!important;}',
      '.fantasy-app .page-checkin .attendance-day-label{font-size:11px!important;white-space:nowrap!important;overflow-wrap:normal!important;}',
      '.fantasy-app .page-checkin .attendance-coin-amount{font-size:24px!important;}',
      '.fantasy-app .page-checkin .attendance-cell.day-7 .attendance-coin-amount{font-size:28px!important;}',
      '}',
      '.fantasy-app .page-checkin .attendance-cell.is-claimed{background:#0f1622!important;}',
      '.fantasy-app .page-checkin .attendance-cell.is-claimed .attendance-coin-amount{color:#64748b!important;}',
      '.fantasy-app .page-checkin .attendance-cell.is-claimed .attendance-day-label{color:#94a3b8!important;}',
      '.fantasy-app .page-checkin .attendance-claim{width:100%!important;margin:14px 0 0!important;min-height:44px!important;border:0!important;border-radius:5px!important;background:linear-gradient(110deg,#83bb1b,#a3e635)!important;color:#111827!important;font-size:14px!important;font-weight:800!important;box-shadow:none!important;}',
      '.fantasy-app .page-checkin .attendance-claim:disabled{background:#111827!important;color:#64748b!important;}',
      '.fantasy-app .page-checkin .attendance-rule{font-size:10px!important;line-height:1.7!important;padding:0!important;margin:12px 0 16px!important;color:#64748b!important;}',
    ].join('');
    doc.head.appendChild(css);
    var BACK_SVG = '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>';
    function goHome() {
      var navs = doc.querySelectorAll('.bottom-nav button');
      for (var i = 0; i < navs.length; i++) {
        if (String(navs[i].textContent || '').trim() === '大厅') { navs[i].click(); return; }
      }
    }
    function ensure() {
      var page = doc.querySelector('.page-checkin');
      if (!page) return;
      var cal = page.querySelector('.cba-attendance');
      if (!cal) return;

      var title = cal.querySelector('.cba-checkin-title');
      if (!title) {
        title = doc.createElement('div');
        title.className = 'page-title cba-checkin-title';
        title.innerHTML = '<h1>每日签到</h1><span>CHECK-IN</span>';
        cal.insertBefore(title, cal.firstChild);
      }

      var back = page.querySelector('[data-cba-checkin-back]');
      if (!back) {
        back = doc.createElement('button');
        back.type = 'button';
        back.setAttribute('data-cba-checkin-back', '1');
        back.addEventListener('click', goHome);
      }
      back.className = 'cba-checkin-back';
      back.setAttribute('aria-label', '返回大厅');
      if (back.parentNode !== title) title.insertBefore(back, title.firstChild);
      if (!back.querySelector('svg')) back.innerHTML = BACK_SVG;

      var meta = cal.querySelector('.attendance-meta');
      var metaLabel = meta && meta.querySelector('b');
      var dateText = metaLabel ? String(metaLabel.textContent || '').trim() : '';
      var date = cal.querySelector('.cba-checkin-date');
      if (!date) {
        date = doc.createElement('p');
        date.className = 'cba-checkin-date';
      }
      if (date.textContent !== dateText) date.textContent = dateText;

      var cells = cal.querySelectorAll('.attendance-cell:not(.is-blank)');
      var total = cells.length || 7;
      var claimed = 0;
      var coins = 0;
      for (var i = 0; i < cells.length; i++) {
        if (!cells[i].classList.contains('is-claimed')) continue;
        claimed++;
        var amount = cells[i].querySelector('.attendance-coin-amount');
        coins += parseInt(amount ? amount.textContent : '0', 10) || 0;
      }
      var dayMatch = dateText.split('·');
      var todayText = dayMatch.length > 1 ? dayMatch[dayMatch.length - 1].trim() : '第 ' + Math.min(total, claimed + 1) + ' 天';
      var stats = cal.querySelector('.cba-checkin-stats');
      if (!stats) {
        stats = doc.createElement('div');
        stats.className = 'cba-checkin-stats';
      }
      var statsHtml = '<div><small>今日签到</small><b>' + todayText + '</b></div>' +
        '<div><small>已领取</small><b class="is-green">' + claimed + ' / ' + total + '</b></div>' +
        '<div><small>累计到账</small><b>' + coins + ' 金币</b></div>';
      if (stats.innerHTML !== statsHtml) stats.innerHTML = statsHtml;

      var month = cal.querySelector('.attendance-month');
      if (month) {
        if (date.nextElementSibling !== stats || stats.nextElementSibling !== month) {
          cal.insertBefore(date, month);
          cal.insertBefore(stats, month);
        }
      } else {
        if (date.parentNode !== cal) cal.appendChild(date);
        if (stats.parentNode !== cal) cal.appendChild(stats);
      }
    }
    global.__CBA_CHECKIN_BACK_ENSURE__ = ensure;
    ensure();
    // 签到页挂载后立即补齐页头/统计，避免 120ms 防抖后才插入造成内容下跳
    new MutationObserver(function () {
      var page = doc.querySelector('.page-checkin');
      if (!page) return;
      if (!page.querySelector('.cba-checkin-title') || !page.querySelector('.cba-checkin-stats')) ensure();
    }).observe(doc.body, { childList: true, subtree: true });
  }

  /* ---------- 球队替补席「签约新援」：从球探中心返回时回到球队 ---------- */
  function installShopReturnContext() {
    var doc = global.document;
    if (!doc || global.__CBA_SHOP_RETURN_CTX__) return;
    global.__CBA_SHOP_RETURN_CTX__ = true;
    var backToTeam = false;

    function goTeam() {
      var navs = doc.querySelectorAll('.bottom-nav button');
      for (var i = 0; i < navs.length; i++) {
        if (String(navs[i].textContent || '').trim() === '球队') { navs[i].click(); return true; }
      }
      return false;
    }

    doc.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;

      // 从球队替补席的空位进入商店：记住来源，返回时回球队
      if (target.closest('.page-collection button.bench-empty')) {
        backToTeam = true;
        return;
      }

      // 球探中心左上角返回：来自球队时改回球队，而不是大厅
      var back = target.closest('.page-recruit .page-title button[aria-label="返回大厅"]');
      if (back && backToTeam) {
        event.preventDefault();
        event.stopImmediatePropagation();
        backToTeam = false;
        goTeam();
        return;
      }

      // 其他导航操作清除来源，避免影响下一次正常进入商店
      if (target.closest('.bottom-nav button') || target.closest('.lobby-shortcuts button') || target.closest('.page-title button')) {
        backToTeam = false;
      }
    }, true);
  }

  /* ---------- 比赛进行中的教练/球员限制提示：固定到页面最上方 ---------- */
  function installMatchLockTopToast() {
    var doc = global.document;
    if (!doc || global.__CBA_MATCH_LOCK_TOAST__) return;
    global.__CBA_MATCH_LOCK_TOAST__ = true;
    var css = doc.createElement('style');
    css.textContent = [
      '.game-toast.cba-toast-top{position:fixed!important;top:calc(env(safe-area-inset-top,0px) + 10px)!important;',
      'bottom:auto!important;left:16px!important;right:16px!important;z-index:4000!important;}',
    ].join('');
    doc.head.appendChild(css);
    function scan() {
      var list = doc.querySelectorAll('.game-toast');
      for (var i = 0; i < list.length; i++) {
        var text = String(list[i].textContent || '');
        if (/比赛进行中|请先完成当前比赛|赛季中途/.test(text)) list[i].classList.add('cba-toast-top');
      }
    }
    new MutationObserver(scan).observe(doc.body, { childList: true, subtree: true, characterData: true });
    scan();
  }

  /* ---------- 市场页「刷新行情」：走 Lamps 官方赛果通道 ----------
   * 原按钮调用旧云端 /fantasy/market（Lamps 未配置），点击无任何反馈。
   * 这里在捕获阶段接管点击：强制拉取 official-feed，更新本地快照与行情，
   * 并按结果给出 Toast 提示。
   */
  function installMarketRefresh() {
    var doc = global.document;
    if (!doc || global.__CBA_MARKET_REFRESH__) return;
    global.__CBA_MARKET_REFRESH__ = true;

    var css = doc.createElement('style');
    css.textContent = [
      '.cba-market-sync{display:flex;flex-wrap:wrap;align-items:center;gap:3px 10px;margin:0 0 8px;padding:6px 10px;border-radius:8px;background:#111827;border:1px solid #263244;font-size:10px;line-height:1.5;color:#94a3b8;}',
      '.cba-market-sync b{color:#f8fafc;margin-left:2px;font-weight:700;}',
      '.cba-sync-state{margin-left:auto;font-weight:800;white-space:nowrap;}',
      '.cba-sync-state.is-ok{color:#a3e635;}',
      '.cba-sync-state.is-err{color:#f87171;}',
      '.cba-sync-state.is-busy{color:#38bdf8;}',
    ].join('');
    doc.head.appendChild(css);

    var syncBox = null, syncMode = 'latest', syncMessage = '';
    function fmtCn(iso) {
      var ms = Date.parse(iso);
      if (!Number.isFinite(ms)) return '—';
      var d = new Date(ms + 8 * 3600 * 1000);
      return (d.getUTCMonth() + 1) + '/' + String(d.getUTCDate()).padStart(2, '0') + ' ' +
        String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
    }
    function snapInfo() {
      var s = {};
      try { s = (global.CBAPlayerData && global.CBAPlayerData.getSnapshot && global.CBAPlayerData.getSnapshot()) || {}; } catch (_) {}
      // 最近赛果只看“今天及以前已完场”的比赛，避免取到赛季末的未来赛程。
      var today = new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
      var last = '';
      if (Array.isArray(s.schedules)) {
        for (var i = 0; i < s.schedules.length; i++) {
          var g = s.schedules[i];
          if (!g || !g.date || g.date > today) continue;
          if (g.status === 'final' || g.officialStatus === 4) {
            if (g.date > last) last = g.date;
          }
        }
      }
      if (!last) {
        var fallback = s.coverage && s.coverage.lastGameDate;
        if (fallback && String(fallback) <= today) last = String(fallback);
      }
      return {
        iso: String(s.updatedAt || ''),
        time: fmtCn(s.updatedAt),
        players: s.players ? Object.keys(s.players).length : 0,
        last: last ? String(last).slice(5).replace('-', '/') : '—',
      };
    }
    function renderSync() {
      if (!syncBox || !syncBox.isConnected) syncBox = doc.querySelector('[data-cba-market-sync]');
      if (!syncBox) return;
      var info = snapInfo();
      syncBox.textContent = '';
      function add(label, value) {
        var span = doc.createElement('span');
        span.textContent = label;
        if (value != null) {
          var b = doc.createElement('b');
          b.textContent = String(value);
          span.appendChild(b);
        }
        syncBox.appendChild(span);
      }
      add('行情日期 ', info.time);
      add('最近赛果 ', info.last);
      add('球员 ', info.players);
      var state = doc.createElement('span');
      var cls = 'cba-sync-state ';
      var text = '已是最新';
      if (syncMode === 'busy') { cls += 'is-busy'; text = '正在同步…'; }
      else if (syncMode === 'updated') { cls += 'is-ok'; text = '行情已更新'; }
      else if (syncMode === 'error') { cls += 'is-err'; text = '同步失败：' + (syncMessage || '请稍后再试'); }
      else { cls += 'is-ok'; }
      state.className = cls;
      state.textContent = text;
      syncBox.appendChild(state);
      syncBox.title = info.iso ? ('官方数据 updatedAt: ' + info.iso) : '';
    }
    function setSync(mode, message) { syncMode = mode || 'latest'; syncMessage = message || ''; renderSync(); }
    function ensureSync() {
      var caption = doc.querySelector('.fantasy-market-caption');
      if (!caption) return;
      if (!doc.querySelector('[data-cba-market-sync]')) {
        var box = doc.createElement('div');
        box.className = 'cba-market-sync';
        box.setAttribute('data-cba-market-sync', '1');
        caption.parentNode.insertBefore(box, caption.nextSibling);
      }
      if (!syncBox || !syncBox.isConnected) syncBox = doc.querySelector('[data-cba-market-sync]');
      renderSync();
    }
    global.__CBA_MARKET_SYNC_ENSURE__ = ensureSync;

    function toast(text, kind) { try { global.__CBA_TOAST__ && global.__CBA_TOAST__(text, kind); } catch (_) {} }
    function findButton(node) {
      while (node && node !== doc) {
        if (node.tagName === 'BUTTON') {
          var text = String(node.textContent || '').replace(/\s+/g, '');
          if (text === '刷新行情' || text === '更新中…' || text === '更新中...') return node;
          return null;
        }
        node = node.parentNode;
      }
      return null;
    }
    doc.addEventListener('click', function (event) {
      var btn = findButton(event.target);
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      if (btn.getAttribute('data-cba-refreshing') === '1') return;
      if (typeof global.CBAOfficialFeedRefresh !== 'function') {
        setSync('error', '刷新服务未就绪');
        toast('行情刷新暂不可用，请重新打开游戏', 'error');
        return;
      }
      btn.setAttribute('data-cba-refreshing', '1');
      btn.disabled = true;
      btn.textContent = '更新中…';
      setSync('busy');
      var finished = false;
      var timer = setTimeout(function () { finish({ ok: false, message: '刷新超时，请稍后再试' }); }, 15000);
      function finish(res) {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        try {
          if (btn.isConnected !== false) {
            btn.removeAttribute('data-cba-refreshing');
            btn.disabled = false;
            btn.textContent = '刷新行情';
          }
        } catch (_) {}
        if (res && res.ok && res.updated) {
          setSync('updated');
          toast('行情已刷新' + (res.date ? ' · ' + res.date : ''));
        } else if (res && res.ok) {
          setSync('latest');
          toast('当前已是最新行情' + (res.date ? ' · ' + res.date : ''));
        } else {
          setSync('error', res && res.message);
          toast((res && res.message) || '行情刷新失败，请稍后再试', 'error');
        }
      }
      try {
        global.CBAOfficialFeedRefresh().then(finish, function (err) {
          finish({ ok: false, message: (err && err.message) || '行情刷新失败，请稍后再试' });
        });
      } catch (err) {
        finish({ ok: false, message: (err && err.message) || '行情刷新失败，请稍后再试' });
      }
    }, true);
  }

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

  /* ---------- 金币与道具页：招募卡补给与使用 ---------- */
  function installRecruitTicketUI() {
    var doc = global.document;
    if (!doc || global.__CBA_RECRUIT_TICKET__) return;
    global.__CBA_RECRUIT_TICKET__ = true;
    var busy = false;

    var css = doc.createElement('style');
    css.textContent = [
      '.cba-recruit-ticket .cba-item-symbol{font-size:22px!important;}',
      '.cba-recruit-ticket .cba-recruit-actions{display:flex;gap:8px;margin-top:auto;}',
      '.cba-recruit-ticket .cba-recruit-actions button{flex:1;min-height:36px;font-size:12px;}',
      '.cba-recruit-ticket .cba-recruit-ad{border-color:#a3e635!important;color:#a3e635!important;}',
    ].join('');
    doc.head.appendChild(css);

    function readState() {
      try {
        var s = global.CBAStorageSession && global.CBAStorageSession.getSnapshot && global.CBAStorageSession.getSnapshot();
        return (s && (s.state || (s.saved && s.saved.state))) || {};
      } catch (_) { return {}; }
    }
    function toast(text) { try { global.__CBA_TOAST__ && global.__CBA_TOAST__(text); } catch (_) {} }

    function build(grid) {
      var card = doc.createElement('article');
      card.className = 'cba-item-card cba-recruit-ticket';
      var top = doc.createElement('div'); top.className = 'cba-item-card-top';
      var sym = doc.createElement('span'); sym.className = 'cba-item-symbol'; sym.setAttribute('aria-hidden', 'true'); sym.textContent = '🎟';
      var owned = doc.createElement('span'); owned.className = 'cba-item-owned'; owned.setAttribute('data-recruit-owned', '1');
      top.appendChild(sym); top.appendChild(owned);
      var title = doc.createElement('h3'); title.textContent = '招募卡';
      var desc = doc.createElement('p'); desc.textContent = '看上方「看广告，随机领卡」补给 · 使用后随机招募 1 名球员';
      var actions = doc.createElement('div'); actions.className = 'cba-recruit-actions';
      var use = doc.createElement('button'); use.type = 'button'; use.className = 'fantasy-button subtle'; use.textContent = '使用'; use.setAttribute('data-recruit-use', '1');
      use.addEventListener('click', function () {
        var count = Math.max(0, Number(readState().drawTickets) || 0);
        if (count < 1) { toast('还没有招募卡，先看广告补给'); return; }
        if (!global.CBAStorageSession || typeof global.CBAStorageSession.dispatch !== 'function') { toast('存档尚未就绪'); return; }
        if (global.CBAStorageSession.dispatch({ type: 'draw', count: 1 })) toast('招募卡已使用 · 随机新援加入');
        else toast('招募未完成，请稍后重试');
      });
      actions.appendChild(use);
      card.appendChild(top); card.appendChild(title); card.appendChild(desc); card.appendChild(actions);
      grid.insertBefore(card, grid.firstChild);
    }

    function render() {
      var page = doc.querySelector('.cba-rewards-page');
      var grid = page && page.querySelector('.cba-item-grid');
      var card = doc.querySelector('.cba-recruit-ticket');
      if (!grid) { if (card) card.remove(); return; }
      if (!card || !grid.contains(card)) build(grid);
      card = grid.querySelector('.cba-recruit-ticket');
      if (!card) return;
      var count = Math.max(0, Number(readState().drawTickets) || 0);
      var owned = card.querySelector('[data-recruit-owned]');
      var use = card.querySelector('[data-recruit-use]');
      if (owned) owned.textContent = '拥有 ' + count;
      if (use) use.disabled = count < 1;
    }

    function randomAdButton(node) {
      while (node && node !== doc) {
        if (node.tagName === 'BUTTON' && String(node.textContent || '').indexOf('看广告，随机领卡') >= 0) return node;
        node = node.parentNode;
      }
      return null;
    }
    doc.addEventListener('click', function (event) {
      var btn = randomAdButton(event.target);
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      if (busy) return;
      busy = true;
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = '正在播放…';
      var play = (inLamps && typeof lampsGame.showRewardedVideo === 'function')
        ? lampsGame.showRewardedVideo({ source: 'random-item' })
        : Promise.resolve({ ok: true });
      play.then(function (res) {
        if (!res || !res.ok) throw new Error((res && res.message) || '观看视频失败，请重试');
        if (!global.CBAStorageSession || typeof global.CBAStorageSession.dispatch !== 'function') throw new Error('存档尚未就绪');
        if (!global.CBAStorageSession.dispatch({ type: 'randomAdReward' })) throw new Error('奖励发放失败');
        toast('随机道具已到账');
      }).catch(function (err) {
        toast((err && err.message) || '观看视频失败，请重试');
      }).then(function () {
        busy = false;
        if (btn.isConnected) { btn.disabled = false; btn.textContent = original; }
        render();
      });
    }, true);

    var pending = null;
    new MutationObserver(function () {
      if (pending) return;
      pending = setTimeout(function () { pending = null; render(); }, 300);
    }).observe(doc.body, { childList: true, subtree: true });
    global.addEventListener('cba:storage-state', function () { setTimeout(render, 60); });
    setInterval(render, 1500);
    render();
  }

  /* ---------- 主流程：云存档预载完成后再加载游戏 bundle ---------- */

  function boot() {
    installToast();
    installCoinAdReward();
    installRecruitTicketUI();
    installOfficialFeedSync();
    installMarketRefresh();
    installRankBoard();
    installPredictionBoard();
    installGameGuide();
    installCheckinBack();
    installShopReturnContext();
    installMatchLockTopToast();
    installFormBadges();
    preload().then(function () {
      var el = global.document.createElement('script');
      el.src = STARTUP_URL;
      el.async = false;
      el.onerror = function () {
        var panel = global.document.getElementById('cba-boot-error');
        if (panel) {
          panel.innerHTML = '<p>游戏资源暂时无法打开，请重试。</p>';
          panel.hidden = false;
        }
      };
      global.document.head.appendChild(el);
    });
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
