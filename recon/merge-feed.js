// merge-feed.js — 把 relay/out 已抓取的真实赛果合并进 player-feed.json
const fs = require("fs");
const path = require("path");
const root = "C:/10.19源码/签下整个CBA";
const feedPath = path.join(root, "player-feed.json");
const outDir = path.join(root, "relay/out");

const feed = JSON.parse(fs.readFileSync(feedPath, "utf8"));
fs.copyFileSync(feedPath, feedPath + ".bak-merge");

const files = fs.readdirSync(outDir).filter(f => /^games-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
let added = 0, updated = 0, skipped = 0;
let maxUpdated = feed.updatedAt || "";
const finalDates = new Set();

for (const file of files) {
  const day = JSON.parse(fs.readFileSync(path.join(outDir, file), "utf8"));
  if (day.updatedAt && day.updatedAt > maxUpdated) maxUpdated = day.updatedAt;
  for (const g of day.games || []) {
    if (g.status !== "final" || !Array.isArray(g.stats)) continue;
    finalDates.add(g.date);
    const sch = feed.schedules.find(s => String(s.id) === String(g.gameId));
    if (sch) {
      if (sch.status !== "final") updated++;
      sch.status = "final";
      sch.officialStatus = 4;
      sch.homeScore = g.homeScore;
      sch.awayScore = g.awayScore;
      sch.matchTypeId = g.matchTypeId ?? sch.matchTypeId;
      sch.matchTypeName = g.matchTypeName || sch.matchTypeName;
      sch.scheduleTime = g.scheduleTime || sch.scheduleTime;
    }
    const homeId = String(g.home), awayId = String(g.away);
    for (const st of g.stats) {
      const pid = String(st.playerId || "");
      if (!pid || pid === "cba-null" || pid === "cba-undefined" || pid === "cba-NaN") { skipped++; continue; }
      const player = feed.players[pid] || Object.values(feed.players).find(p => String(p.officialId) === String(st.officialId));
      if (!player) { skipped++; continue; }
      const teamId = String(player.teamId || "");
      const isHome = teamId === homeId;
      const opponentId = isHome ? awayId : homeId;
      const teamList = Array.isArray(feed.teams) ? feed.teams : Object.values(feed.teams || {});
      const oppTeam = teamList.find(t => String(t.id) === opponentId || String(t.teamId) === opponentId);
      const row = {
        id: String(g.gameId),
        date: g.date,
        stats: {
          ast: st.ast || 0, blk: st.blk || 0, min: st.min || 0, pts: st.pts || 0,
          reb: st.reb || 0, stl: st.stl || 0, dreb: st.dreb || 0, oreb: st.oreb || 0,
          fouls: st.fouls || 0, fgMade: st.fgMade || 0, ftMade: st.ftMade || 0,
          turnover: st.turnovers || 0, fgAttempt: st.fgAttempt || 0,
          ftAttempt: st.ftAttempt || 0, threeMade: st.threeMade || 0, threeAttempt: st.threeAttempt || 0,
        },
        isHome,
        played: true,
        season: feed.season,
        status: "final",
        teamId,
        starter: !!st.starter,
        opponent: oppTeam ? oppTeam.name : (isHome ? g.awayName : g.homeName),
        sourceUrl: "data-source.html#gameReport?scheduleId=" + g.gameId + "&date=" + g.date + "&isToMatch=0",
        teamScore: isHome ? g.homeScore : g.awayScore,
        opponentId,
        matchTypeId: g.matchTypeId ?? 1,
        scheduleTime: g.scheduleTime,
        matchTypeName: g.matchTypeName,
        opponentScore: isHome ? g.awayScore : g.homeScore,
        officialStatus: 4,
      };
      player.games = Array.isArray(player.games) ? player.games : [];
      const idx = player.games.findIndex(x => String(x.id) === String(g.gameId));
      if (idx >= 0) player.games[idx] = row; else { player.games.push(row); added++; }
    }
  }
}

const finals = feed.schedules.filter(s => s.status === "final");
const dates = finals.map(s => s.date).sort();
const last = dates[dates.length - 1] || feed.coverage.completeThrough;
const rows = Object.values(feed.players).reduce((n, p) => n + (p.games || []).length, 0);
feed.coverage = {
  ...feed.coverage,
  completedGames: finals.length,
  playerGameRows: rows,
  completeThrough: last,
  lastGameDate: feed.coverage.lastGameDate,
  missingBoxScores: [],
  pendingBoxScores: 0,
};
for (const k of Object.keys(feed.coverage.byMatchType || {})) {
  const mt = Number(k);
  const list = finals.filter(s => Number(s.matchTypeId) === mt);
  feed.coverage.byMatchType[k] = { ...feed.coverage.byMatchType[k], completedGames: list.length };
}
feed.updatedAt = maxUpdated || new Date().toISOString();
feed.syncStatus = "merged-local-relay";

fs.writeFileSync(feedPath, JSON.stringify(feed), "utf8");
console.log("赛果日期文件:", files.length, "新增球员行:", added, "赛程转 final:", updated, "跳过:", skipped);
console.log("completedGames:", feed.coverage.completedGames, "completeThrough:", feed.coverage.completeThrough, "playerGameRows:", rows);
console.log("updatedAt:", feed.updatedAt);
