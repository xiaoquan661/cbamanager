const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const key of ["showRewardedVideo", "rewardedVideo", "taskClaim", "dailyCheckin", "coins:", "addCoins", "grantCoins", "rewardCoins", "cba-reward-watch"]) {
  let i = js.indexOf(key), n = 0;
  console.log("\n##### " + key + " at " + i);
  while (i >= 0 && n < 3) {
    console.log(js.slice(Math.max(0, i - 260), i + 360).replace(/\s+/g, " "));
    console.log("---");
    i = js.indexOf(key, i + key.length); n++;
  }
}
