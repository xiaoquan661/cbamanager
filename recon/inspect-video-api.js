const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const key of ["showVideo", "watchAd", "playAd", "LampsPlatform", "rewarded", "adFlow", "videoAd"]) {
  let i = -1, n = 0;
  console.log("\n##### " + key + " count " + (js.split(key).length - 1));
  while ((i = js.indexOf(key, i + 1)) >= 0 && n < 4) {
    console.log("@" + i + ": " + js.slice(Math.max(0, i - 220), i + 320).replace(/\s+/g, " "));
    n++;
  }
}
console.log("\n--- rewards component ---");
const a = js.indexOf("道具补给");
console.log(js.slice(Math.max(0, a - 2600), a + 2200));
