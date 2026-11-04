const fs = require("fs");
const t = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let re = /avatarSourceUrl/g, m, c = 0;
while ((m = re.exec(t)) && c < 12) {
  console.log("---", c, JSON.stringify(t.slice(Math.max(0, m.index - 200), m.index + 200)));
  c++;
}
console.log("avatarSourceUrl occurrences:", (t.match(re) || []).length);
