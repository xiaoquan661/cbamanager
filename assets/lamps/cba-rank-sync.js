// cba-rank-sync.js — Lamps 云端排行榜接入（三榜：战力 power / 价值 value / 预测 predict）
// 按 lamps-game-leaderboard skill 规范：
//   - gameRankType 固定稳定字符串："power" / "value" / "predict"
//   - dataLoad 只带 {nickname} / {nickname, wins}，不上传阵容
//   - 只在 Lamps 环境（UA 含 LampsSDK）提交；本地静默跳过
//   - 提交时机：boot（数据就绪后）+ 每 30 分钟 + 赛果更新 + 预测成功数变化（立即）
(function (global) {
  'use strict';

  var RANK_POWER = 'power';
  var RANK_VALUE = 'value';
  var RANK_PREDICT = 'predict';
  var SUBMIT_INTERVAL = 30 * 60 * 1000;
  var lastSubmit = 0;
  var lastPredWins = -1;

  function inLamps() {
    try {
      return String((global.navigator && global.navigator.userAgent) || '').indexOf('LampsSDK') !== -1;
    } catch (_) { return false; }
  }

  function lp() { return global.LampsPlatform || null; }

  function nickname() {
    try {
      var u = global.CBAUser && global.CBAUser.getSnapshot && global.CBAUser.getSnapshot();
      if (u && u.nickname) return String(u.nickname).slice(0, 24);
    } catch (_) {}
    return '神秘经理';
  }

  // ---- 从游戏状态计算战力/价值/阵容 ----
  function readTeam() {
    try {
      var s = global.CBAStorageSession.getSnapshot();
      var st = s.state || (s.saved && s.saved.state) || null;
      if (!st || !Array.isArray(st.cards)) return null;
      var slots = (st.lineupSlots && st.lineupSlots.some(Boolean)) ? st.lineupSlots : st.lineup;
      if (!slots || !slots.length) return null;
      var pricing = global.CBAFantasyPricing;
      var data = global.CBAFantasyData;
      var day = global.CBADataClock && global.CBADataClock.chinaDate ? global.CBADataClock.chinaDate() : null;
      var count = 0, power = 0, value = 0;
      var seen = {};
      for (var i = 0; i < slots.length; i++) {
        var uid = slots[i];
        if (!uid) continue;
        var card = (st.cards || []).find(function (c) { return c.uid === uid; });
        if (!card) continue;
        var pid = String(card.playerId);
        if (seen[pid]) continue;
        seen[pid] = 1;
        var player = null;
        try { player = pricing.getPlayer(pid); } catch (_) {}
        if (!player) continue;
        var rating = 0;
        try { rating = Number(global.CBAPlayerData.getCardRating(player, day).value) || 0; } catch (_) {}
        var price = 0;
        try { price = Math.round(Number(data.playerQuote(player).price)) || 0; } catch (_) {}
        power += rating;
        value += price;
        count++;
      }
      if (count !== 5) return null;
      return {
        power: Math.round(power),
        value: Math.round(value),
        dataLoad: { nickname: nickname() },
      };
    } catch (_) { return null; }
  }

  // ---- 预测成绩（成功预测次数） ----
  function readPredict() {
    try {
      var s = global.CBAStorageSession.getSnapshot();
      var st = s.state || (s.saved && s.saved.state) || null;
      if (!st) return null;
      var rows = Array.isArray(st.practicePredictions) ? st.practicePredictions : [];
      var wins = 0, settled = 0;
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (!r) continue;
        if (r.outcome === 'won') wins++;
        if (r.outcome === 'won' || r.outcome === 'lost') settled++;
      }
      return { wins: wins, settled: settled, dataLoad: { nickname: nickname(), wins: wins } };
    } catch (_) { return null; }
  }

  function submitPredict() {
    if (!inLamps()) return Promise.resolve(false);
    var platform = lp();
    if (!platform || typeof platform.submitLeaderboardScore !== 'function') return Promise.resolve(false);
    var p = readPredict();
    if (!p) return Promise.resolve(false);
    lastPredWins = p.wins;
    return platform.submitLeaderboardScore(p.wins, RANK_PREDICT, p.dataLoad)
      .then(function (r) { return !!(r && r.ok); })
      .catch(function () { return false; });
  }

  function submitBoards() {
    if (!inLamps()) return Promise.resolve(false);
    var platform = lp();
    if (!platform || typeof platform.submitLeaderboardScore !== 'function') return Promise.resolve(false);
    var team = readTeam();
    var head = team
      ? platform.submitLeaderboardScore(team.power, RANK_POWER, team.dataLoad)
          .then(function (r1) {
            return platform.submitLeaderboardScore(team.value, RANK_VALUE, team.dataLoad)
              .then(function (r2) { return { power: !!(r1 && r1.ok), value: !!(r2 && r2.ok) }; });
          })
      : Promise.resolve({ power: false, value: false });
    return head.then(function (res) {
      return submitPredict().then(function (okP) {
        res.predict = okP;
        return res;
      });
    }).catch(function () { return false; });
  }

  function submitThrottled() {
    if (Date.now() - lastSubmit < SUBMIT_INTERVAL) return;
    lastSubmit = Date.now();
    submitBoards();
  }

  // 预测结算后成功数变化：立即上报预测榜（不做 30 分钟节流）
  function onStorageState() {
    var p = readPredict();
    if (!p) return;
    if (p.wins !== lastPredWins) submitPredict();
  }

  // ---- 对外 ----
  global.CBARankSync = Object.freeze({
    VERSION: 'rank-r31-20261103',
    submitNow: function () { lastSubmit = 0; return submitBoards(); },
    submitPredictNow: function () { return submitPredict(); },
    readPredict: readPredict,
    readBoard: function (type) {
      var platform = lp();
      if (!platform || typeof platform.getLeaderboard !== 'function') return Promise.resolve([]);
      return platform.getLeaderboard(type).then(function (res) {
        return (res && res.ok && res.data && res.data.list) ? res.data.list : [];
      }).catch(function () { return []; });
    },
    RANK_POWER: RANK_POWER,
    RANK_VALUE: RANK_VALUE,
    RANK_PREDICT: RANK_PREDICT,
  });

  function start() {
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (global.CBAStorageSession && global.CBAStorageSession.getSnapshot && global.CBAFantasyPricing) {
        clearInterval(timer);
        submitThrottled();
        setInterval(submitThrottled, 10 * 60 * 1000); // 检查节流窗口，到点才真正提交
        // 征战完场/市场更新后机会性提交（监听既有事件）
        global.addEventListener('cba:data-date-changed', submitThrottled);
        // 预测结算（成功数变化）后立即上报预测榜
        global.addEventListener('cba:storage-state', onStorageState);
      } else if (tries > 60) {
        clearInterval(timer);
      }
    }, 1000);
  }

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window);