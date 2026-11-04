const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const key of ["2026-10-19T03:00:19", "playerGameRows", "completeThrough", "CBA_PLAYER_FEED", "historyPlayers"]) {
  const i = js.indexOf(key);
  console.log("\n###", key, "at", i, "count", js.split(key).length - 1);
  if (i >= 0) console.log(js.slice(Math.max(0, i - 300), i + 500));
}
