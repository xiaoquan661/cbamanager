// cba-daily-tasks.js — 每日任务 + 周活跃度（P3，glue 端 DOM 模块）
// 5 项每日任务（各 20 金币）+ 周活跃满 600 送 300。
// 进度判定全部由游戏状态推导（基线对比法）；发奖走引擎 taskClaim 动作。
// 领取记录存 localStorage（按北京时间日期）。
(function (global) {
  'use strict';

  var STORE_KEY = 'cba-daily-tasks-v1';
  var TASKS = [
    { id: 'checkin',    name: '完成每日签到',     hint: '领取当天签到奖励' },
    { id: 'shopflip',   name: '翻开一张球探推荐卡', hint: '在球探中心翻开任意卡牌' },
    { id: 'sign',       name: '签约一名球员',     hint: '从市场或球探中心成功签约' },
    { id: 'predict',    name: '提交一次每日预测', hint: '成功提交任意一场预测' },
    { id: 'campaign',   name: '完成一场征战',     hint: '完整结算一场，胜负均可' },
  ];
  var REWARD = 20, WEEK_GOAL = 600, WEEK_BONUS = 300;

  function bjDay() { return new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10); }
  function weekKey() {
    var d = new Date(Date.now() + 8 * 3600 * 1000);
    var day = (d.getUTCDay() + 6) % 7; // 周一=0
    var monday = new Date(d.getTime() - day * 86400000);
    return monday.toISOString().slice(0, 10);
  }

  function load() {
    try { return JSON.parse(global.localStorage.getItem(STORE_KEY)) || {}; } catch (_) { return {}; }
  }
  function save(data) { try { global.localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (_) {} }

  function snap() { try { return global.CBAStorageSession.getSnapshot(); } catch (_) { return {}; } }
  function state() { var s = snap(); return s.state || (s.saved && s.saved.state) || null; }

  // ---- 信号读取 ----
  function checkedInToday() {
    try { return global.localStorage.getItem('cba-daily-checkin-date') === bjDay(); } catch (_) { return false; }
  }
  function doCheckin() {
    var ok = false;
    try {
      ok = global.CBAStorageSession.dispatch({ type: 'dailyCheckin' }) === true;
    } catch (_) { ok = false; }
    if (ok) { try { global.localStorage.setItem('cba-daily-checkin-date', bjDay()); } catch (_) {} }
    return ok;
  }
  function signal(id, st, snapshot) {
    var today = bjDay();
    var shop = st && st.fantasyShop;
    switch (id) {
      case 'checkin':
        return checkedInToday() || !!(snapshot.status && snapshot.status.claimed === true);
      case 'shopflip':
        return !!(shop && shop.date === today && (shop.offers || []).some(function (o) { return o.revealed; }));
      case 'sign':
        return !!(st && (st.myTransactions || []).some(function (t2) {
          return t2.createdAt && new Date(t2.createdAt + 8 * 3600 * 1000).toISOString().slice(0, 10) === today &&
            (/^buy/.test(String(t2.type)) || String(t2.type) === 'coach-buy');
        }));
      case 'predict':
        return !!(st && (st.practicePredictions || []).some(function (p) { return p.date === today; }));
      case 'campaign':
        return !!(st && Number(st.played) > 0 && st.lastSettledMatchId); // 征战进行中即视为活跃（完成判据见基线增量）
      default:
        return false;
    }
  }

  // 基线：当天首次打开时记录各计数的起始值，任务完成=当前计数>基线（对增量型信号）
  function baseline() {
    var data = load();
    var today = bjDay();
    if (data.baseline && data.baseline.date === today) return data.baseline;
    var st = state() || {};
    data.baseline = {
      date: today,
      txBuy: (st.myTransactions || []).filter(function (t2) {
        return t2.createdAt && new Date(t2.createdAt + 8 * 3600 * 1000).toISOString().slice(0, 10) === today;
      }).length,
      predictions: (st.practicePredictions || []).filter(function (p) { return p.date === today; }).length,
      played: Number(st.played) || 0,
    };
    save(data);
    return data.baseline;
  }

  function taskDone(id) {
    var snapshot = snap(), st = state(), base = baseline();
    var today = bjDay();
    if (id === 'checkin') return signal('checkin', st, snapshot);
    if (id === 'shopflip') return signal('shopflip', st, snapshot);
    switch (id) {
      case 'sign':
        return (st ? (st.myTransactions || []).filter(function (t2) {
          return t2.createdAt && new Date(t2.createdAt + 8 * 3600 * 1000).toISOString().slice(0, 10) === today &&
            (/^buy/.test(String(t2.type)) || String(t2.type) === 'coach-buy');
        }).length : 0) > (base.txBuy || 0);
      case 'predict':
        return (st ? (st.practicePredictions || []).filter(function (p) { return p.date === today; }).length : 0) > (base.predictions || 0);
      case 'campaign': {
        var nowPlayed = Number(st && st.played) || 0;
        var basePlayed = Number(base.played) || 0;
        return nowPlayed > basePlayed || (nowPlayed > 0 && base.date !== today && basePlayed === nowPlayed && false) ||
          !!(st && st.lastSettledMatchId && !st.pendingMatch && base.date !== today && nowPlayed === basePlayed && nowPlayed > 0);
      }
      default: return false;
    }
  }

  function claimedToday(data) { return (data.claims && data.claims[bjDay()]) || {}; }
  function weekCoins(data) { return (data.weeks && data.weeks[weekKey()]) || 0; }
  function weeklyClaimed(data) { return (data.weekBonus && data.weekBonus[weekKey()]) === true; }

  function claimReward(taskId, amount, kind) {
    var data = load();
    var day = bjDay();
    if (taskId === 'checkin') {
      // 签到任务：先完成常驻每日签到（+200），再领任务奖励（+20）
      if (checkedInToday()) return false;
      if (!doCheckin()) return false;
    }
    data.claims = data.claims || {};
    data.claims[day] = data.claims[day] || {};
    data.claims = data.claims || {};
    data.claims[day] = data.claims[day] || {};
    if (data.claims[day][taskId]) return false;
    // 先发奖（dispatch 返回 false 表示被会话拒绝），成功才记领取标记
    var granted = false;
    try {
      var bridge = global.CBAStorageSession;
      if (bridge && typeof bridge.dispatch === 'function') {
        granted = bridge.dispatch({ type: 'taskClaim', amount: amount, taskId: taskId, kind: kind || 'daily' }) === true;
      }
    } catch (_) { granted = false; }
    if (!granted) return false;
    data.claims[day][taskId] = true;
    if (kind !== 'weekly') {
      var wk = weekKey();
      data.weeks = data.weeks || {};
      data.weeks[wk] = (data.weeks[wk] || 0) + amount;
    }
    save(data);
    return true;
  }

  function claimWeekly() {
    var data = load();
    var wk = weekKey();
    if (weeklyClaimed(data) || weekCoins(data) < WEEK_GOAL) return false;
    var granted = false;
    try {
      granted = global.CBAStorageSession.dispatch({ type: 'taskClaim', amount: WEEK_BONUS, taskId: 'weekly-' + wk, kind: 'weekly' }) === true;
    } catch (_) { granted = false; }
    if (!granted) return false;
    data.weekBonus = data.weekBonus || {};
    data.weekBonus[wk] = true;
    save(data);
    return true;
  }

  // ---- UI ----
  function ensureStyle(doc) {
    if (doc.getElementById('cba-tasks-style')) return;
    var css = doc.createElement('style');
    css.id = 'cba-tasks-style';
    css.textContent = [
      /* 入口红点 */
      '.lobby-shortcuts [data-cba-task-entry="1"]{position:relative;}',
      '.lobby-shortcuts [data-cba-task-entry="1"] .cba-red-dot{position:absolute;top:5px;right:7px;width:8px;height:8px;border-radius:50%;background:#a3e635;border:2px solid #090d16;box-sizing:content-box;box-shadow:0 0 8px #a3e63599;z-index:2;}',

      /* 全屏任务页 */
      '#cba-tasks-panel{position:fixed;inset:0;z-index:2600;display:flex;flex-direction:column;background:#090d16;color:#f8fafc;font-family:Inter,"Noto Sans SC",system-ui,-apple-system,"PingFang SC",sans-serif;overflow:hidden;animation:cba-page-in .24s ease-out both;}',
      '#cba-tasks-panel.cba-in-scroll{position:absolute!important;}',
      '@keyframes cba-task-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}',
      '#cba-tasks-panel .ts-scroll{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:0 0 28px;}',
      '#cba-tasks-panel .ts-wrap{width:min(560px,100%);margin:0 auto;padding:0 13px;}',

      /* 顶栏 */
      '#cba-tasks-panel .ts-head{position:sticky;top:0;z-index:2;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 0 12px;background:linear-gradient(#090d16 70%,#090d1600);}',
      '#cba-tasks-panel .ts-kicker{margin:0 0 4px;font-size:9px;font-weight:800;letter-spacing:2.4px;color:#a3e635;}',
      '#cba-tasks-panel h3{margin:0;font-size:22px;line-height:1.25;font-weight:800;color:#f8fafc;}',
      '#cba-tasks-panel .ts-date{margin:5px 0 0;font-size:11px;line-height:1.5;color:#94a3b8;}',
      '#cba-tasks-panel .close{flex:none;min-width:44px;height:34px;padding:0 12px;border:1px solid #263244;border-radius:9px;background:#111827;color:#94a3b8;font:600 12px/1 inherit;cursor:pointer;}',
      '#cba-tasks-panel .close:active{background:#1b2535;color:#f8fafc;}',

      /* 今日进度 */
      '#cba-tasks-panel .ts-summary{display:flex;align-items:center;gap:12px;margin:4px 0 14px;padding:14px;border:1px solid #263244;border-radius:14px;background:linear-gradient(120deg,#111827,#0f1622);}',
      '#cba-tasks-panel .ts-score{flex:none;width:52px;height:52px;display:grid;place-items:center;border-radius:50%;border:2px solid #a3e635;background:#0b1220;color:#a3e635;font-size:15px;font-weight:800;letter-spacing:-.3px;}',
      '#cba-tasks-panel .ts-summary-copy{flex:1;min-width:0;}',
      '#cba-tasks-panel .ts-summary-copy b{display:block;font-size:13px;line-height:1.4;color:#f8fafc;}',
      '#cba-tasks-panel .ts-summary-copy small{display:block;margin-top:3px;font-size:11px;line-height:1.45;color:#94a3b8;}',
      '#cba-tasks-panel .ts-bar{height:7px;margin-top:8px;border-radius:99px;background:#1b2535;overflow:hidden;}',
      '#cba-tasks-panel .ts-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#a3e635,#83bb1b);transition:width .25s ease;}',

      /* 任务列表 */
      '#cba-tasks-panel .ts-list{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none;}',
      '#cba-tasks-panel .ts-row{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #263244;border-radius:12px;background:#111827;}',
      '#cba-tasks-panel .ts-row.is-done{border-color:#3f6212;background:linear-gradient(110deg,#14210f,#111827 62%);}',
      '#cba-tasks-panel .ts-row.is-claimed{background:#0f1622;border-color:#1f2b3a;}',
      '#cba-tasks-panel .ts-ico{flex:none;width:30px;height:30px;display:grid;place-items:center;border-radius:9px;background:#1b2535;color:#94a3b8;font-size:12px;font-weight:800;}',
      '#cba-tasks-panel .ts-row.is-done .ts-ico{background:#a3e635;color:#111827;}',
      '#cba-tasks-panel .ts-row.is-claimed .ts-ico{background:#1b2535;color:#a3e635;}',
      '#cba-tasks-panel .ts-copy{flex:1;min-width:0;}',
      '#cba-tasks-panel .ts-copy b{display:block;font-size:13px;line-height:1.4;font-weight:700;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '#cba-tasks-panel .ts-copy small{display:block;margin-top:2px;font-size:10px;line-height:1.45;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '#cba-tasks-panel .ts-reward{flex:none;font-size:11px;font-weight:800;color:#a3e635;}',
      '#cba-tasks-panel .ts-row.is-claimed .ts-reward{color:#64748b;}',
      '#cba-tasks-panel .claim{flex:none;min-width:62px;height:32px;padding:0 10px;border:0;border-radius:8px;background:linear-gradient(100deg,#a3e635,#83bb1b);color:#111827;font:800 12px/1 inherit;cursor:pointer;box-shadow:0 3px 10px #a3e63526;}',
      '#cba-tasks-panel .claim:active{transform:translateY(1px);}',
      '#cba-tasks-panel .t-state{flex:none;min-width:54px;text-align:right;font-size:11px;font-weight:700;color:#64748b;white-space:nowrap;}',
      '#cba-tasks-panel .t-state.ok{color:#a3e635;}',

      /* 周活跃 */
      '#cba-tasks-panel .ts-week{margin-top:16px;padding:14px;border:1px solid #263244;border-radius:14px;background:linear-gradient(135deg,#111827,#0b1220);}',
      '#cba-tasks-panel .ts-week-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;}',
      '#cba-tasks-panel .ts-week-head b{font-size:13px;color:#f8fafc;}',
      '#cba-tasks-panel .ts-week-head span{font-size:11px;font-weight:800;color:#a3e635;font-variant-numeric:tabular-nums;}',
      '#cba-tasks-panel .ts-week .ts-bar{height:9px;margin:10px 0 12px;}',
      '#cba-tasks-panel .ts-week-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;}',
      '#cba-tasks-panel .ts-week-foot small{font-size:10px;line-height:1.5;color:#94a3b8;}',

      /* 与「范特西表现榜」统一的页头 / 统计栏 / 列表行 */
      '#cba-tasks-panel .cba-page-title{position:sticky;top:0;z-index:3;margin:0;padding:14px 0;border-bottom:1px solid #1f2b3a;background:#090d16;}',
      '#cba-tasks-panel .cba-page-title h1{color:#f8fafc;font-size:22px;line-height:1.3;letter-spacing:1px;}',
      '#cba-tasks-panel .cba-page-title>span{color:#64748b;font-size:9px;letter-spacing:1px;margin-left:auto;}',
      '#cba-tasks-panel .cba-page-title button{color:#f8fafc;background:none;border:0;padding:0;display:flex;min-width:0;height:auto;border-radius:0;}',
      '#cba-tasks-panel .ts-rule{margin:8px 0 12px;font-size:11px;line-height:1.5;color:#94a3b8;}',
      '#cba-tasks-panel .ts-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:0 0 14px;border:1px solid #263244;border-radius:8px;overflow:hidden;background:#111827;}',
      '#cba-tasks-panel .ts-stats>div{padding:9px 6px;text-align:center;border-left:1px solid #263244;}',
      '#cba-tasks-panel .ts-stats>div:first-child{border-left:0;}',
      '#cba-tasks-panel .ts-stats small{display:block;font-size:9px;line-height:1.5;color:#94a3b8;letter-spacing:.4px;}',
      '#cba-tasks-panel .ts-stats b{display:block;margin-top:2px;font-size:14px;line-height:1.3;color:#f8fafc;font-variant-numeric:tabular-nums;}',
      '#cba-tasks-panel .ts-stats b.is-green{color:#a3e635;}',
      '#cba-tasks-panel .ts-list{gap:9px;}',
      '#cba-tasks-panel .ts-row{display:block;padding:12px;border:1px solid #111827;border-radius:10px;background:#111827;}',
      '#cba-tasks-panel .ts-row.is-done{border-color:#111827;background:#111827;}',
      '#cba-tasks-panel .ts-row.is-claimed{background:#111827;border-color:#111827;}',
      '#cba-tasks-panel .ts-row-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:10px;line-height:1.5;color:#94a3b8;}',
      '#cba-tasks-panel .ts-row-meta b{font-weight:600;color:#a3e635;}',
      '#cba-tasks-panel .ts-row-meta b.is-muted{color:#64748b;}',
      '#cba-tasks-panel .ts-row-main{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:3px;}',
      '#cba-tasks-panel .ts-row-main b{min-width:0;font-size:14px;line-height:1.45;font-weight:700;color:#f8fafc;}',
      '#cba-tasks-panel .ts-row-main strong{flex:none;font-size:14px;line-height:1.45;font-weight:800;color:#a3e635;font-variant-numeric:tabular-nums;}',
      '#cba-tasks-panel .ts-row>small{display:block;margin-top:2px;font-size:10px;line-height:1.55;color:#94a3b8;}',
      '#cba-tasks-panel .ts-row.is-claimed .ts-row-main b{color:#94a3b8;}',
      '#cba-tasks-panel .ts-row.is-claimed .ts-row-main strong{color:#64748b;}',
      '#cba-tasks-panel .ts-row-meta .claim{min-width:0;height:auto;padding:0;border:0;background:none;box-shadow:none;color:#a3e635;font:700 10px/1.5 inherit;}',
      '#cba-tasks-panel .ts-week{margin-top:14px;padding:12px;border:1px solid #111827;border-radius:10px;background:#111827;}',
      '#cba-tasks-panel .ts-week-head b{font-size:12px;}',
      '#cba-tasks-panel .ts-week-head span{font-size:12px;}',
      '#cba-tasks-panel .ts-week .ts-bar{height:6px;margin:8px 0;}',
      '#cba-tasks-panel .ts-week-foot small{font-size:10px;}',
    ].join('');
    doc.head.appendChild(css);
  }

  function renderPanel(doc) {
    var data = load();
    var claimed = claimedToday(data);
    var doneCount = 0;
    var claimable = 0;
    var rows = TASKS.map(function (t, index) {
      var done = taskDone(t.id);
      if (done) doneCount++;
      var isClaimed = !!claimed[t.id];
      if (done && !isClaimed) claimable++;
      var action;
      if (isClaimed) action = '<b class="is-muted">已领取</b>';
      else if (t.id === 'checkin') action = '<button class="claim ts-claim" data-task="checkin">签到 +220</button>';
      else if (done) action = '<button class="claim ts-claim" data-task="' + t.id + '">领取</button>';
      else action = '<b class="is-muted">进行中</b>';
      var stateCls = isClaimed ? ' is-claimed' : (done ? ' is-done' : '');
      return '<li class="ts-row' + stateCls + '">' +
        '<div class="ts-row-meta"><span>任务 ' + String(index + 1).padStart(2, '0') + '</span>' + action + '</div>' +
        '<div class="ts-row-main"><b>' + t.name + '</b><strong>+' + REWARD + '</strong></div>' +
        '<small>' + t.hint + '</small>' +
        '</li>';
    }).join('');
    var week = weekCoins(data);
    var bar = Math.min(100, Math.round(week / WEEK_GOAL * 100));
    var weekFoot = weeklyClaimed(data) ? '<span class="t-state ok">周奖励已领取</span>'
      : week >= WEEK_GOAL ? '<button class="claim" data-task="__week">领取 ' + WEEK_BONUS + ' 金币</button>'
      : '<small>满 ' + WEEK_GOAL + ' 领 ' + WEEK_BONUS + ' 金币</small>';
    var weekHtml = '<section class="ts-week"><div class="ts-week-head"><b>本周活跃度</b><span>' + week + ' / ' + WEEK_GOAL + '</span></div>' +
      '<div class="ts-bar"><i style="width:' + bar + '%"></i></div>' +
      '<div class="ts-week-foot">' + weekFoot + '</div></section>';
    var panel = doc.getElementById('cba-tasks-panel');
    if (!panel) {
      panel = doc.createElement('div');
      panel.id = 'cba-tasks-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-label', '每日任务');
    }
    // 挂在 .game-scroll 内，保留顶部信息和底部导航，和签到/表现榜一致
    var host = doc.querySelector('.game-scroll') || doc.body;
    panel.classList.toggle('cba-in-scroll', host !== doc.body);
    if (panel.parentNode !== host) host.appendChild(panel);
    panel.innerHTML = '<div class="ts-scroll"><div class="ts-wrap">' +
      '<header class="page-title cba-page-title"><button class="ts-back" aria-label="返回大厅">' +
      '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>' +
      '</button><h1>每日任务</h1><span>DAILY</span></header>' +
      '<p class="ts-rule">' + bjDay().replaceAll('-', '.') + ' · 每日 00:00 重置</p>' +
      '<div class="ts-stats">' +
      '<div><small>今日完成</small><b>' + doneCount + ' / ' + TASKS.length + '</b></div>' +
      '<div><small>可领取</small><b class="' + (claimable ? 'is-green' : '') + '">' + claimable + ' 项</b></div>' +
      '<div><small>本周活跃</small><b>' + weekCoins(data) + ' / ' + WEEK_GOAL + '</b></div>' +
      '</div>' +
      '<ul class="ts-list">' + rows + '</ul>' + weekHtml + '</div></div>';
    doc.body.classList.add('cba-task-open');
    var close = function () { panel.remove(); doc.body.classList.remove('cba-task-open'); };
    panel.querySelector('.ts-back').onclick = close;
    panel.querySelectorAll('.claim').forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute('data-task');
        var okTask = id === '__week' ? claimWeekly() : claimReward(id, REWARD, 'daily');
        if (okTask) renderPanel(doc);
      };
    });
  }

  function install() {
    var doc = global.document;
    ensureStyle(doc);
    // 红 dot：存在可领取（done 未领 或 周活跃满）时点亮
    function updateDot() {
      var b = doc.querySelector('[data-cba-task-entry="1"]');
      if (!b) return;
      var data = load();
      var claimed = claimedToday(data);
      var hasClaimable = TASKS.some(function (t) { return taskDone(t.id) && !claimed[t.id]; }) ||
        !checkedInToday() ||
        (weekCoins(data) >= WEEK_GOAL && !weeklyClaimed(data));
      var dot = b.querySelector('.cba-red-dot');
      if (hasClaimable && !dot) {
        var d = doc.createElement('i');
        d.className = 'cba-red-dot';
        b.appendChild(d);
      } else if (!hasClaimable && dot) {
        dot.remove();
      }
    }
    // 「每日任务」作为独立入口插入快捷栏，保留原有「每日签到」入口（React 重渲染后自动补回）
    function makeEntryButton() {
      var b = doc.createElement('button');
      b.type = 'button';
      b.className = 'cba-daily-task-entry';
      b.setAttribute('data-cba-task-entry', '1');
      b.setAttribute('aria-label', '每日任务');
      b.innerHTML = '<span class="shortcut-medal" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="4.5" y="3.5" width="15" height="17" rx="3"></rect>' +
        '<path d="M8.5 8.5h4M8.5 12h6M8.5 15.5h3.5"></path>' +
        '<path d="m14.5 16.5 1.6 1.6 3-3.2"></path></svg></span>' +
        '<b>每日任务</b><small>100 金币/日</small>';
      b.onclick = function () { renderPanel(doc); updateDot(); };
      return b;
    }
    function convert() {
      var host = doc.querySelector('.lobby-shortcuts');
      if (!host) return; // 只在主界面工作，比赛/其他页面的高频 DOM 更新直接跳过
      var entry = host.querySelector('[data-cba-task-entry="1"]');
      if (!entry) entry = makeEntryButton();
      // 始终固定在第一位：React 按索引重排子节点后，这里会在同一帧内纠正回来
      if (host.firstElementChild !== entry) {
        host.insertBefore(entry, host.firstElementChild);
      }
      updateDot();
    }
    // 同一帧内合并多次 DOM 变化，在浏览器绘制前补回入口，避免切回大厅时闪一下
    var queue = 0;
    var obs = new MutationObserver(function () {
      if (queue) return;
      queue = (global.requestAnimationFrame || function (fn) { return setTimeout(fn, 16); })(function () {
        queue = 0; convert();
      });
    });
    function start() {
      obs.observe(doc.body, { childList: true, subtree: true });
      convert();
      setInterval(updateDot, 5000);
    }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start);
    else start();
  }

  global.CBADailyTasks = Object.freeze({
    VERSION: 'tasks-r30-20261103',
    TASKS: TASKS,
    taskDone: taskDone,
    claimReward: claimReward,
    claimWeekly: claimWeekly,
    install: install,
  });

  function boot() {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', function () { global.CBADailyTasks.install(); });
    } else {
      global.CBADailyTasks.install();
    }
  }
  boot();
})(window);