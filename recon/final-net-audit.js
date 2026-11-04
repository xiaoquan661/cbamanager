// final-net-audit.js — 注释清理 + 全包外部请求/域名终检
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.split(" * 中继地址复用数据中继的 RELAY_URL；引擎 I_ 每次选对手时从").join(" * 对手池仅来自 Lamps 榜单 dataLoad（平台能力）；引擎 I_ 每次选对手时从");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
console.log("RELAY_URL 残留: " + (glue.split("RELAY_URL").length - 1));
try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (e) { console.log("✗ " + e.message); }

// 全包检查（只查会发请求的代码文件，不查数据/样式）
const files = ["cba-startup.js", "cba-launch.js", "index.html",
  "assets/lamps/cba-lamps-glue.js", "assets/lamps/cba-squad-share-r29.js",
  "assets/lamps/cba-rank-sync.js", "assets/lamps/cba-daily-tasks.js"];
const pats = ["tencentscf", "XMLHttpRequest", "fetch(", "\.fetch", "sendBeacon", "WebSocket", "new Image().src"];
for (const f of files) {
  const raw = fs.readFileSync(root + f, "utf8");
  const hits = [];
  for (const p of pats) {
    const c = raw.split(p).length - 1;
    if (c) hits.push(p + " x" + c);
  }
  console.log(f + ": " + (hits.length ? "⚠ " + hits.join(", ") : "干净"));
}
// bundle 里 localFeedUrl 指向哪
const js = fs.readFileSync(root + "cba-startup.js", "utf8");
let i = js.indexOf("function localFeedUrl");
console.log("\nlocalFeedUrl: " + js.slice(i, i + 200).replace(/\s+/g, " "));
// 列 bundle 中出现的所有 http(s) 主机
const hosts = [...new Set((js.match(/https?:\/\/[a-z0-9.-]+/gi) || []).map(h => h.toLowerCase()))];
console.log("\nbundle 内出现的主机（字符串，不一定是请求）:");
console.log(hosts.join("\n"));