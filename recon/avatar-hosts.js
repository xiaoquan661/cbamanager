// avatar-hosts.js — 头像远程域名用途
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("i11.hoopchina.com.cn"), n = 0;
const shown = new Set();
while (i >= 0 && n < 8) {
  const ctx = js.slice(Math.max(0, i - 220), i + 160).replace(/\s+/g, " ");
  const kind = /avatar:`https?:/.test(ctx) ? "avatar字段直链" : /avatarSource/.test(ctx) ? "avatarSource元数据" : "其他";
  if (!shown.has(kind)) { shown.add(kind); console.log("[" + kind + "] @" + i + ":\n" + ctx.slice(0, 380) + "\n"); }
  n++;
  i = js.indexOf("i11.hoopchina.com.cn", i + 1);
}
// 统计 avatar 直链的数量
const direct = (js.match(/avatar:\s*[`'"]https?:\/\//g) || []).length;
console.log("bundle 中 avatar 直链数量:", direct);