// fetch-missing.js — 抓取 relay/out 缺失日期（10-29 起）的官方赛果
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const KEY = "uVayqL4ONKjFbVzQ";
const BASE = "https://data-server.cbaleague.com";
const OUT = "C:/10.19源码/签下整个CBA/relay/out";
const H = { isEncrypt: "encrypt", "Content-Type": "application/json" };

function decrypt(b64) {
  const d = crypto.createDecipheriv("aes-128-ecb", Buffer.from(KEY, "utf8"), null);
  return Buffer.concat([d.update(Buffer.from(String(b64).trim(), "base64")), d.final()]).toString("utf8");
}
async function api(url, body) {
  const res = await fetch(BASE + url, { method: body ? "POST" : "GET", headers: H, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(url + " HTTP " + res.status);
  return JSON.parse(decrypt(await res.text()));
}
function mapSchedule(g) {
  const finished = Number(g.status) === 4 || (g.homeTeamScore != null && g.isReport === 1);
  return {
    gameId: String(g.scheduleId), date: String(g.scheduleTime || "").slice(0, 10),
    home: String(g.homeTeamId), away: String(g.visitingTeamId),
    homeName: g.homeTeamName, awayName: g.visitingTeamName,
    homeScore: g.homeTeamScore, awayScore: g.visitingTeamScore,
    status: finished ? "final" : (Number(g.status) === 2 ? "live" : "scheduled"),
    officialStatus: finished ? 4 : 0,
    matchTypeName: Number(g.matchTypeId) === 3 ? "季前赛" : "常规赛第" + (g.round || "?") + "轮",
    matchTypeId: g.matchTypeId, scheduleTime: g.scheduleTime,
  };
}
function mapStats(box, roster) {
  const played = [], seen = {};
  for (const side of ["homeCounts", "visitingCounts"]) for (const p of box[side] || []) {
    seen[String(p.playerId)] = 1;
    played.push({
      playerId: "cba-" + p.playerId, officialId: String(p.playerId),
      name: p.cnAlias, number: p.number, starter: p.gameStart === 1, played: true,
      min: Math.round((p.upTime || 0) / 60 * 100) / 100,
      pts: p.points || 0, reb: p.rebounds || 0, oreb: p.reboundsOffensive || 0, dreb: p.reboundsDefensive || 0,
      ast: p.assists || 0, stl: p.steals || 0, blk: p.blocked || 0,
      turnovers: p.turnovers || 0, fouls: p.fouls || 0,
      fgMade: p.fieldGoals || 0, fgAttempt: p.fieldGoalsAttempted || 0,
      ftMade: p.freeThrows || 0, ftAttempt: p.freeThrowsAttempted || 0,
      threeMade: p.threePointGoals || 0, threeAttempt: p.threePointAttempted || 0, plusMinus: p.plusMinus,
    });
  }
  const dnps = [];
  for (const side of ["hostPlayers", "guestPlayers"]) for (const rp of roster[side] || []) {
    const id = String(rp.playerId || "");
    if (id && !seen[id]) dnps.push({ playerId: "cba-" + id, officialId: id, name: rp.cnAlias || rp.cnAliasShow, number: rp.number, played: false, min: 0, injured: rp.isInjury === 1 || rp.isInjury === true });
  }
  return { stats: played, dnps };
}
(async () => {
  const dates = ["2026-10-29", "2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02", "2026-11-03"];
  for (const date of dates) {
    const outFile = path.join(OUT, "games-" + date + ".json");
    if (fs.existsSync(outFile)) { console.log(date, "已存在，跳过"); continue; }
    try {
      const schedules = await api("/api/schedules/day?day=" + date + "&auto=0");
      const games = [];
      for (const s of schedules) {
        const g = mapSchedule(s);
        if (g.status === "final") {
          try {
            const box = await api("/api/player-match-datas/data-count", { scheduleId: g.gameId });
            const roster = await api("/api/schedules/getPlayersByScheduleId/" + g.gameId);
            const m = mapStats(box, roster);
            g.stats = m.stats; g.dnps = m.dnps;
          } catch (e) { g.error = String(e.message || e); }
        }
        games.push(g);
      }
      const out = { date, updatedAt: new Date().toISOString(), games };
      fs.writeFileSync(outFile, JSON.stringify(out), "utf8");
      console.log(date, "比赛", games.length, "完场", games.filter(x => x.status === "final").length);
    } catch (e) { console.log(date, "失败:", e.message); }
  }
})();
