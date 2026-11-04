const fs = require("fs");
const t = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
for (const re of [/\.avatarSourceUrl\b/g, /\[\s*[`"']avatarSourceUrl[`"']\s*\]/g, /avatarSourceUrl:/g]) {
  const ms = t.match(re) || [];
  console.log(re.toString(), "→", ms.length);
  if (ms.length && !/avatarSourceUrl:/.test(re.toString())) {
    let m, c = 0;
    while ((m = re.exec(t)) && c < 5) { console.log("  ", JSON.stringify(t.slice(Math.max(0, m.index - 140), m.index + 160))); c++; }
  }
}
