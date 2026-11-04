// index.js — 腾讯云函数「Web函数」版 CBA 数据中转
// 兼容运行环境：Node.js 12.16（无 fetch、无可选链，全部用 https 模块实现）
// 监听端口：9001（腾讯云 Web 函数默认）
//
// 接口：
//   /cba/meta                    日期索引
//   /cba/players                 球员+球队目录
//   /cba/games?date=2026-10-28   当日赛程+boxscore

const http = require("http");
const https = require("https");
const crypto = require("crypto");

const KEY = "uVayqL4ONKjFbVzQ"; // CBA 官方数据站前端 AES-128-ECB 密钥
const BASE = "https://data-server.cbaleague.com";
const REQ_HEADERS = { "isEncrypt": "encrypt", "Content-Type": "application/json" };
const PORT = process.env.PORT || 9001;

// ---- 进程级内存缓存（实例复用时生效）----
const CACHE = new Map();
const TTL = { meta: 600, players: 86400, schedules: 120, box: 300 };
function cacheGet(k, ttl) { var h = CACHE.get(k); return (h && Date.now() - h.at < ttl * 1000) ? h.data : null; }
function cacheSet(k, d) { CACHE.set(k, { at: Date.now(), data: d }); }

function decrypt(base64) {
  var d = crypto.createDecipheriv("aes-128-ecb", Buffer.from(KEY, "utf8"), null);
  return Buffer.concat([d.update(Buffer.from(String(base64).trim(), "base64")), d.final()]).toString("utf8");
}

// Node12 无 fetch：用 https 模块封装
function request(method, url, body) {
  return new Promise(function (resolve, reject) {
    var u = new URL(url);
    var payload = body ? JSON.stringify(body) : null;
    var req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method: method,
      headers: payload ? Object.assign({}, REQ_HEADERS, { "Content-Length": Buffer.byteLength(payload) }) : REQ_HEADERS,
      timeout: 25000,
    }, function (res) {
      var chunks = [];
      res.on("data", function (c) { chunks.push(c); });
      res.on("end", function () {
        var text = Buffer.concat(chunks).toString("utf8");
        if (res.statusCode !== 200) return reject(new Error(url + " -> HTTP " + res.statusCode));
        try { resolve(JSON.parse(decrypt(text))); } catch (e) { reject(new Error("解密失败: " + e.message)); }
      });
    });
    req.on("timeout", function () { req.destroy(new Error("请求超时: " + url)); });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}
function api(url, body) { return request(body ? "POST" : "GET", url, body); }

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// ---- 格式转换 ----
function mapSchedule(g) {
  var finished = Number(g.status) === 4 || (g.homeTeamScore != null && g.isReport === 1);
  return {
    gameId: String(g.scheduleId),
    date: String(g.scheduleTime || "").slice(0, 10),
    home: String(g.homeTeamId),
    away: String(g.visitingTeamId),
    homeName: g.homeTeamName,
    awayName: g.visitingTeamName,
    homeScore: g.homeTeamScore,
    awayScore: g.visitingTeamScore,
    status: finished ? "final" : (Number(g.status) === 2 ? "live" : "scheduled"),
    officialStatus: finished ? 4 : 0,
    matchTypeName: Number(g.matchTypeId) === 3 ? "季前赛" : "常规赛第" + (g.round || "?") + "轮",
    matchTypeId: g.matchTypeId,
    scheduleTime: g.scheduleTime,
  };
}

function mapStats(dataCount, roster) {
  var played = [], seen = {};
  var sides = ["homeCounts", "visitingCounts"];
  for (var i = 0; i < sides.length; i++) {
    var arr = dataCount[sides[i]] || [];
    for (var j = 0; j < arr.length; j++) {
      var p = arr[j];
      seen[String(p.playerId)] = 1;
      played.push({
        playerId: "cba-" + p.playerId, officialId: String(p.playerId),
        name: p.cnAlias, number: p.number, starter: p.gameStart === 1, played: true,
        min: Math.round((p.upTime || 0) / 60 * 100) / 100,
        pts: p.points || 0, reb: p.rebounds || 0,
        oreb: p.reboundsOffensive || 0, dreb: p.reboundsDefensive || 0,
        ast: p.assists || 0, stl: p.steals || 0, blk: p.blocked || 0,
        turnovers: p.turnovers || 0, fouls: p.fouls || 0,
        fgMade: p.fieldGoals || 0, fgAttempt: p.fieldGoalsAttempted || 0,
        ftMade: p.freeThrows || 0, ftAttempt: p.freeThrowsAttempted || 0,
        threeMade: p.threePointGoals || 0, threeAttempt: p.threePointAttempted || 0,
        plusMinus: p.plusMinus,
      });
    }
  }
  var dnps = [];
  var rsides = ["hostPlayers", "guestPlayers"];
  for (var a = 0; a < rsides.length; a++) {
    var list = roster[rsides[a]] || [];
    for (var b = 0; b < list.length; b++) {
      var rp = list[b];
      var id = String(rp.playerId || ""); // roster.id 是雪花大整数，会丢精度，用 playerId
      if (id && !seen[id]) {
        dnps.push({ playerId: "cba-" + id, officialId: id, name: rp.cnAlias || rp.cnAliasShow,
          number: rp.number, played: false, min: 0, injured: rp.isInjury === 1 || rp.isInjury === true });
      }
    }
  }
  return { stats: played, dnps: dnps };
}

// ---- 三个接口 ----
async function apiGames(date) {
  var key = "games:" + date;
  var hit = cacheGet(key, TTL.schedules);
  if (hit) return hit;
  var schedules = await api(BASE + "/api/schedules/day?day=" + date + "&auto=0");
  var games = [];
  for (var i = 0; i < schedules.length; i++) {
    var game = mapSchedule(schedules[i]);
    if (game.status === "final") {
      try {
        var box = await api(BASE + "/api/player-match-datas/data-count", { scheduleId: game.gameId });
        var roster = await api(BASE + "/api/schedules/getPlayersByScheduleId/" + game.gameId);
        var mapped = mapStats(box, roster);
        game.stats = mapped.stats;
        game.dnps = mapped.dnps;
      } catch (e) { game.error = String(e.message || e); }
      await sleep(200); // 温和限速
    }
    games.push(game);
  }
  var out = { date: date, updatedAt: new Date().toISOString(), games: games };
  cacheSet(key, out);
  return out;
}

async function apiMeta() {
  var hit = cacheGet("meta", TTL.meta);
  if (hit) return hit;
  var now = new Date(Date.now() + 8 * 3600 * 1000); // 北京时间
  var months = {};
  var offs = [-45, -25, -5, 15];
  for (var i = 0; i < offs.length; i++) {
    var d = new Date(now.getTime() + offs[i] * 86400000);
    months[d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0")] = 1;
  }
  var byDate = {};
  for (var ym in months) {
    var parts = ym.split("-");
    try {
      var list = await api(BASE + "/api/schedules/month?year=" + parts[0] + "&month=" + parts[1]);
      if (!Array.isArray(list)) continue;
      for (var j = 0; j < list.length; j++) {
        var g = list[j], day = String(g.scheduleTime || "").slice(0, 10);
        if (!day) continue;
        var rec = byDate[day] || { date: day, gameCount: 0, finishedCount: 0 };
        rec.gameCount++;
        if (Number(g.status) === 4 || (g.homeTeamScore != null && g.isReport === 1)) rec.finishedCount++;
        byDate[day] = rec;
      }
    } catch (e) { /* 单月失败不影响整体 */ }
  }
  var dates = [];
  for (var day2 in byDate) {
    var r = byDate[day2];
    r.finished = r.finishedCount > 0 && r.finishedCount === r.gameCount;
    dates.push(r);
  }
  dates.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  var out = { season: "2026-2027", lastUpdated: new Date().toISOString(), dates: dates };
  cacheSet("meta", out);
  return out;
}

async function apiPlayers() {
  var hit = cacheGet("players", TTL.players);
  if (hit) return hit;
  var both = await Promise.all([
    api(BASE + "/api/players/all"),
    api(BASE + "/api/teams/teamList"),
  ]);
  var players = both[0], teams = both[1];
  var out = {
    version: new Date().toISOString().slice(0, 10),
    players: Array.isArray(players) ? players : (players.players || players.records || []),
    teams: Array.isArray(teams) ? teams : (teams.teams || teams.records || []),
  };
  cacheSet("players", out);
  return out;
}

// ---- 异步 PVP：玩家阵容池（P2）----
// 内存池（实例存活期共享；实例回收后池重建，玩家会自动重新上报）。上限 200 条 FIFO。
var LINEUP_POOL = []; // [{nickname, players:[{playerId,name,position}], updatedAt}]
var LINEUP_LIMIT = 200;
function lineupKey(lu) { return (lu.nickname || "") + "|" + (lu.players || []).map(function (p) { return p.playerId; }).join(","); }

function handleLineupRoutes(req, res, u, body) {
  if (u.pathname === "/cba/lineup" && req.method === "POST") {
    try {
      var lu = typeof body === "string" ? JSON.parse(body) : body;
      if (!lu || !Array.isArray(lu.players) || lu.players.length !== 5) {
        json(res, 400, { code: 1, msg: "阵容需要 5 名球员" }); return true;
      }
      lu.players = lu.players.slice(0, 5).map(function (p) {
        return { playerId: String(p.playerId || ""), name: String(p.name || ""), position: String(p.position || "") };
      });
      lu.nickname = String(lu.nickname || "神秘经理").slice(0, 24);
      lu.updatedAt = new Date().toISOString();
      var key = lineupKey(lu);
      LINEUP_POOL = LINEUP_POOL.filter(function (x) { return lineupKey(x) !== key; });
      LINEUP_POOL.unshift(lu);
      if (LINEUP_POOL.length > LINEUP_LIMIT) LINEUP_POOL.length = LINEUP_LIMIT;
      json(res, 200, { code: 0, data: { ok: true, poolSize: LINEUP_POOL.length } });
      return true;
    } catch (e) { json(res, 400, { code: 1, msg: String(e.message || e) }); return true; }
  }
  if (u.pathname === "/cba/lineups" && req.method === "GET") {
    var count = Math.min(20, Math.max(1, Number(u.searchParams.get("count")) || 19));
    var exclude = u.searchParams.get("exclude") || "";
    var pool = LINEUP_POOL.filter(function (x) { return lineupKey(x) !== exclude; });
    // 洗牌取前 count
    for (var i = pool.length - 1; i > 0; i--) {
      var j2 = Math.floor(Math.random() * (i + 1));
      var t2 = pool[i]; pool[i] = pool[j2]; pool[j2] = t2;
    }
    json(res, 200, { code: 0, data: { lineups: pool.slice(0, count) } });
    return true;
  }
  return false;
}

// ---- HTTP 路由（Web 函数入口）----
function json(res, status, obj) {
  var body = JSON.stringify(obj);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" });
  res.end(body);
}

var server = http.createServer(function (req, res) {
  var u = new URL(req.url, "http://localhost");
  var path = u.pathname;
  var date = u.searchParams.get("date") || "";
  if (path.indexOf("/cba/lineup") === 0) {
    var rawBody = "";
    req.on("data", function (c) { rawBody += c; });
    req.on("end", function () { handleLineupRoutes(req, res, u, rawBody); });
    return;
  }
  var handler = null;
  if (path.indexOf("/cba/meta") >= 0) handler = apiMeta;
  else if (path.indexOf("/cba/players") >= 0) handler = apiPlayers;
  else if (path.indexOf("/cba/games") >= 0) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      json(res, 400, { code: 1, msg: "date 参数格式应为 YYYY-MM-DD" });
      return;
    }
    handler = function () { return apiGames(date); };
  } else {
    json(res, 200, { code: 0, msg: "CBA 数据中转运行中", endpoints: ["/cba/meta", "/cba/players", "/cba/games?date=YYYY-MM-DD"] });
    return;
  }
  handler().then(function (data) { json(res, 200, { code: 0, data: data }); })
    .catch(function (e) { json(res, 502, { code: 2, msg: String(e.message || e) }); });
});

server.listen(PORT, function () { console.log("CBA relay listening on " + PORT); });
