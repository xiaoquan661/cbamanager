// net-contexts.js — .fetch 与 tcloudbase/hupu 域名的实际用途
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
for (const f of ["cba-startup.js", "cba-launch.js"]) {
  const js = fs.readFileSync(root + f, "utf8");
  console.log("\n######## " + f + " .fetch ########");
  let i = 0, n = 0;
  while ((i = js.indexOf(".fetch", i)) >= 0 && n < 8) {
    console.log("--- @" + i + " ---");
    console.log(js.slice(Math.max(0, i - 160), i + 160).replace(/\s+/g, " ").slice(0, 320));
    i += 6; n++;
  }
}
const js = fs.readFileSync(root + "cba-startup.js", "utf8");
console.log("\n######## tcloudbase 上下文 ########");
let t = js.indexOf("tcloudbase.com");
while (t >= 0) {
  console.log("--- @" + t + " ---");
  console.log(js.slice(Math.max(0, t - 240), t + 200).replace(/\s+/g, " ").slice(0, 440));
  t = js.indexOf("tcloudbase.com", t + 1);
}
// localFeedUrl 完整
let l = js.indexOf("function localFeedUrl");
console.log("\n######## localFeedUrl 全文 ########");
console.log(js.slice(l, l + 700).replace(/\s+/g, " "));