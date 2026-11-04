const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const js = fs.readFileSync(root + "cba-startup.js", "utf8");
const css = fs.readFileSync(root + "cba-startup.css", "utf8");

for (const key of ["openingCoins", "newbieTotal", "lobby-shortcuts", "shortcut-medal", "compareGamesDesc"]) {
  let i = -1, n = 0;
  console.log("\n##### " + key);
  while ((i = js.indexOf(key, i + 1)) >= 0 && n < 4) {
    console.log("JS @" + i + ": " + js.slice(Math.max(0, i - 180), i + 260).replace(/\s+/g, " "));
    n++;
  }
  i = -1; n = 0;
  while ((i = css.indexOf(key, i + 1)) >= 0 && n < 3) {
    console.log("CSS @" + i + ": " + css.slice(Math.max(0, i - 150), i + 320).replace(/\s+/g, " "));
    n++;
  }
}
