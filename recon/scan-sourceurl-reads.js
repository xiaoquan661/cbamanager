const fs = require("fs");
const t = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let re = /\.sourceUrl\b/g, m, c = 0;
while ((m = re.exec(t)) && c < 10) { console.log("---", JSON.stringify(t.slice(Math.max(0, m.index - 220), m.index + 220))); c++; }
