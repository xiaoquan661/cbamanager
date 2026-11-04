// cba-relay.js — CBA 官方数据中转脚本（自建数据源核心）
// 用法：
//   bun cba-relay.js day 2026-10-28          # 生成当日 games JSON
//   bun cba-relay.js backfill 2026-10-10 2026-10-28   # 批量回填
//   bun cba-relay.js meta 2026-10-10         # 生成 meta（日期索引）
//   bun cba-relay.js catalog                 # 生成球员目录（含官方头像直链）
// 输出到 ./out/，格式见 docs/01-迁移方案与服务器需求清单.md
// 部署：out/ 目录整体上传任意静态托管即可（三个接口 = 三个静态文件）

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const KEY = "uVayqL4ONKjFbVzQ"; // CBA 官方数据站前端 AES-128-ECB 密钥（公开前端可提取）
const BASE = "https://data-server.cbaleague.com";
const HEADERS = { "isEncrypt": "encrypt", "Content-Type": "application/json" };
const OUT = path.join(__dirname, "out");

function decrypt(base64) {
  const d = crypto.createDecipheriv("aes-128-ecb", Buffer.from(KEY, "utf8"), null);
  return Buffer.concat([d.update(Buffer.from(base64.trim(), "base64")), d.final()]).toString("utf8");
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

const ensureOut = () => fs.mkdirSync(OUT, { recursive: true });
const save = (name, obj) => {
  ensureOut();
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(obj), "utf8");
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- 赛程 → 我们的游戏格式 ----
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

// ---- 单场 boxscore → 每名球员统计（含缺席推定） ----
function mapStats(dataCount, roster) {
  const played = [];
  const seen = new Set();
  for (const side of ["homeCounts", "visitingCounts"]) {
    for (const p of dataCount[side] || []) {
      seen.add(String(p.playerId));
      played.push({
        playerId: "cba-" + p.playerId,
        officialId: String(p.playerId),
        name: p.cnAlias,
        number: p.number,
        starter: p.gameStart === 1,
        played: true,
        min: Math.round((p.upTime || 0) / 60 * 100) / 100,
        pts: p.points || 0,
        reb: p.rebounds || 0,
        oreb: p.reboundsOffensive || 0,
        dreb: p.reboundsDefensive || 0,
        ast: p.assists || 0,
        stl: p.steals || 0,
        blk: p.blocked || 0,
        turnovers: p.turnovers || 0,
        fouls: p.fouls || 0,
        fgMade: p.fieldGoals || 0,
        fgAttempt: p.fieldGoalsAttempted || 0,
        ftMade: p.freeThrows || 0,
        ftAttempt: p.freeThrowsAttempted || 0,
        threeMade: p.threePointGoals || 0,
        threeAttempt: p.threePointAttempted || 0,
        plusMinus: p.plusMinus,
      });
    }
  }
  // 名单中未出现在统计里的 = 当场未出战（DNP/伤停/轮休判定依据）
  // 注意：roster.id 是超出 Number 安全范围的雪花ID（解析会丢精度），
  // 与统计端点同域的是 roster.playerId（官方ID）；isInjury 可直接用于伤停判定
  const dnps = [];
  for (const side of ["hostPlayers", "guestPlayers"]) {
    for (const p of roster[side] || []) {
      const id = String(p.playerId || "");
      if (id && !seen.has(id)) {
        dnps.push({
          playerId: "cba-" + id, officialId: id, name: p.cnAlias || p.cnAliasShow,
          number: p.number, played: false, min: 0,
          injured: p.isInjury === 1 || p.isInjury === true,
        });
      }
    }
  }
  return { stats: played, dnps };
}

async function buildDay(day) {
  const schedules = await api(`${BASE}/api/schedules/day?day=${day}&auto=0`);
  const games = [];
  for (const g of schedules) {
    const game = mapSchedule(g);
    if (game.status === "final") {
      try {
        const [box, roster] = await Promise.all([
          api(`${BASE}/api/player-match-datas/data-count`, { scheduleId: game.gameId }),
          api(`${BASE}/api/schedules/getPlayersByScheduleId/${game.gameId}`),
        ]);
        const { stats, dnps } = mapStats(box, roster);
        game.stats = stats;
        game.dnps = dnps;
      } catch (e) {
        game.error = String(e.message || e);
      }
      await sleep(300); // 温和限速
    }
    games.push(game);
  }
  save(`games-${day}.json`, { date: day, updatedAt: new Date().toISOString(), games });
  const finals = games.filter((g) => g.status === "final").length;
  console.log(`[${day}] ${games.length} 场，完场 ${finals}，已写入 out/games-${day}.json`);
  return games;
}

async function buildMeta(startDay, days) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(Date.parse(startDay + "T00:00:00Z") + i * 86400000).toISOString().slice(0, 10);
    try {
      const s = await api(`${BASE}/api/schedules/day?day=${d}&auto=0`);
      const finished = s.filter((g) => Number(g.status) === 4 || (g.homeTeamScore != null && g.isReport === 1)).length;
      dates.push({ date: d, finished: finished > 0 && finished === s.length, gameCount: s.length, finishedCount: finished });
    } catch (e) {
      dates.push({ date: d, finished: false, gameCount: 0, finishedCount: 0 });
    }
    await sleep(250);
  }
  save("meta.json", { season: "2026-2027", lastUpdated: new Date().toISOString(), dates });
  console.log(`meta.json：${dates.length} 天索引已写入`);
}

async function buildCatalog() {
  const players = await api(`${BASE}/api/players/all`);
  save("players-catalog.json", { version: new Date().toISOString().slice(0, 10), players });
  console.log(`球员目录：${Array.isArray(players) ? players.length : Object.keys(players).length} 条已写入`);
}

// ---- 入口 ----
(async () => {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === "day") await buildDay(a);
  else if (cmd === "backfill") {
    let cur = a;
    while (cur <= b) {
      try { await buildDay(cur); } catch (e) { console.log(`[${cur}] skip: ${e.message}`); }
      cur = new Date(Date.parse(cur + "T00:00:00Z") + 86400000).toISOString().slice(0, 10);
    }
  } else if (cmd === "meta") await buildMeta(a, Number(b || 30));
  else if (cmd === "catalog") await buildCatalog();
  else console.log("用法: day|backfill|meta|catalog");
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
