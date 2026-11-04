const fs = require("fs");
const t = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const re = /https?:\/\/[^\s"'<>)]*(?:hupu|hoopchina)[^\s"'<>)]*/g;
let m, c = 0;
while ((m = re.exec(t)) && c < 8) {
  console.log("---", c, m[0].slice(0, 100));
  console.log(JSON.stringify(t.slice(Math.max(0, m.index - 160), m.index + 90)));
  c++;
}
console.log("total:", (t.match(re) || []).length);
