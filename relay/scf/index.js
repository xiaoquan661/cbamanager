// index.js — 腾讯云函数（SCF）版 CBA 数据中转
// 运行环境：Node.js 18（内置全局 fetch，无需任何依赖）
//
// 部署：见同目录 deploy.md
// 游戏端接口（把 <函数URL> 换成你的触发器地址）：
//   <函数URL>/cba/meta          日期索引
//   <函数URL>/cba/players       球员+球队目录
//   <函数URL>/cba/games?date=2026-10-28   当日赛程+boxscore

const crypto = require("crypto");

const KEY = "uVayqL4ONKjFbVzQ"; // CBA 官方数据站前端 AES-128-ECB 密钥
const BASE = "https://data-server.cbaleague.com";
const HEADERS = { "isEncrypt": "encrypt", "Content-Type": "application/json" };

// ---- 进程级内存缓存（云函数实例复用时生效，TTL 秒）----
const CACHE = new Map(); // key -> { at, data }
const TTL = { meta: 600, players: 86400, schedules: 120, box: 300 };

function cacheGet(key, ttl) {
  const hit = CACHE.get(key);
  if (hit && Date.now() - hit.at < ttl * 1000) return hit.data;
  return null;
}
function cacheSet(key, data) { CACHE.set(key, { at: Date.now(), data }); }

function decrypt(base64) {
  const d = crypto.createDecipheriv("aes-128-ecb", Buffer.from(KEY, "utf8"), null);
  return Buffer.concat([d.update(Buffer.from(String(base64).trim(), "base64")), d.final()]).toString("utf8");
}

async function api(url, body) {
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(url + " -> HTTP " + res.status);
  return JSON.parse(decrypt(await res.text()));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- 格式转换（与 relay/cba-relay.js 保持一致）----
function mapSchedule(g) {
  const finished = Number(g.status) === 4 || (g.homeTeamScore != null && g.isReport === 1);
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
  const played = [];
  const seen = new Set();
  for (const side of ["homeCounts", "visitingCounts"]) {
    for (const p of dataCount[side] || []) {
      seen.add(String(p.playerId));
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
  const dnps = [];
  for (const side of ["hostPlayers", "guestPlayers"]) {
    for (const p of roster[side] || []) {
      const id = String(p.playerId || ""); // roster.id 是雪花大整数，会丢精度，用 playerId
      if (id && !seen.has(id)) {
        dnps.push({ playerId: "cba-" + id, officialId: id, name: p.cnAlias || p.cnAliasShow,
          number: p.number, played: false, min: 0, injured: p.isInjury === 1 || p.isInjury === true });
      }
    }
  }
  return { stats: played, dnps };
}

// ---- 三个接口 ----
async function apiGames(date) {
  const key = "games:" + date;
  const hit = cacheGet(key, TTL.schedules);
  if (hit) return hit;
  const schedules = await api(`${BASE}/api/schedules/day?day=${date}&auto=0`);
  const games = [];
  for (const g of schedules) {
    const game = mapSchedule(g);
    if (game.status === "final") {
      try {
        const [box, roster] = await Promise.all([
          api(`${BASE}/api/player-match-datas/data-count`, { scheduleId: game.gameId }),
          api(`${BASE}/api/schedules/getPlayersByScheduleId/${game.gameId}`),
        ]);
        Object.assign(game, mapStats(box, roster));
      } catch (e) { game.error = String(e.message || e); }
      await sleep(200); // 温和限速
    }
    games.push(game);
  }
  const out = { date, updatedAt: new Date().toISOString(), games };
  cacheSet(key, out);
  return out;
}

async function apiMeta() {
  const hit = cacheGet("meta", TTL.meta);
  if (hit) return hit;
  const now = new Date(Date.now() + 8 * 3600 * 1000); // 北京时间
  const dates = [];
  // 最近 45 天 + 未来 15 天，逐月拉（每月 1 个请求）
  const months = new Set();
  for (let off = -45; off <= 15; off += 20) {
    const d = new Date(now.getTime() + off * 86400000);
    months.add(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"));
  }
  const all = [];
  for (const ym of months) {
    const [y, m] = ym.split("-");
    try {
      const list = await api(`${BASE}/api/schedules/month?year=${y}&month=${m}`);
      all.push(...(Array.isArray(list) ? list : []));
    } catch (e) { /* 单月失败不影响整体 */ }
  }
  const byDate = new Map();
  for (const g of all) {
    const day = String(g.scheduleTime || "").slice(0, 10);
    if (!day) continue;
    const rec = byDate.get(day) || { date: day, gameCount: 0, finishedCount: 0 };
    rec.gameCount++;
    if (Number(g.status) === 4 || (g.homeTeamScore != null && g.isReport === 1)) rec.finishedCount++;
    byDate.set(day, rec);
  }
  for (const rec of byDate.values()) rec.finished = rec.finishedCount > 0 && rec.finishedCount === rec.gameCount;
  const out = {
    season: "2026-2027",
    lastUpdated: new Date().toISOString(),
    dates: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
  };
  cacheSet("meta", out);
  return out;
}

async function apiPlayers() {
  const hit = cacheGet("players", TTL.players);
  if (hit) return hit;
  const [players, teams] = await Promise.all([
    api(`${BASE}/api/players/all`),
    api(`${BASE}/api/teams/teamList`),
  ]);
  const out = {
    version: new Date().toISOString().slice(0, 10),
    players: Array.isArray(players) ? players : (players.players || players.records || []),
    teams: Array.isArray(teams) ? teams : (teams.teams || teams.records || []),
  };
  cacheSet("players", out);
  return out;
}

// ---- SCF 入口（Web 函数 / HTTP 触发器通用事件解析）----
exports.main = async (event) => {
  // SCF HTTP 触发器：event.path / event.queryString；集成响应返回 { isBase64Encoded, statusCode, headers, body }
  try {
    const path = String(event.path || event.rawPath || "");
    const query = event.queryString || event.queryStringParameters || {};
    let data, status = 200;
    if (path.includes("/cba/meta")) {
      data = await apiMeta();
    } else if (path.includes("/cba/players")) {
      data = await apiPlayers();
    } else if (path.includes("/cba/games")) {
      const date = String(query.date || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return { isBase64Encoded: false, statusCode: 400, headers: { "content-type": "application/json" },
          body: JSON.stringify({ code: 1, msg: "date 参数格式应为 YYYY-MM-DD" }) };
      }
      data = await apiGames(date);
    } else {
      data = { code: 0, msg: "CBA 数据中转运行中", endpoints: ["/cba/meta", "/cba/players", "/cba/games?date=YYYY-MM-DD"] };
    }
    return { isBase64Encoded: false, statusCode: status, headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      body: JSON.stringify({ code: 0, data }) };
  } catch (e) {
    return { isBase64Encoded: false, statusCode: 502, headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: 2, msg: String(e.message || e) }) };
  }
};
