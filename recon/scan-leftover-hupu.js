const fs = require("fs");
const t = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let re = /(?:hupu|hoopchina)\.(?:com|cn)/gi, m, c = 0;
while ((m = re.exec(t)) && c < 10) { console.log("---", JSON.stringify(t.slice(Math.max(0, m.index - 180), m.index + 120))); c++; }
