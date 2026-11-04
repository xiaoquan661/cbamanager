// pd-colors.js — 对比球员详情页(pd-*)在原始主题与当前主题的配色
const fs = require("fs");
const orig = fs.readFileSync("C:/10.19源码/签下整个CBA/_backup-pre-light/cba-startup.css", "utf8");
const curr = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
function rules(css, prefix) {
  const out = [];
  for (const m of css.matchAll(new RegExp("\\." + prefix + "[a-z-]*[^{,]*\\{[^}]*\\}", "g"))) {
    const r = m[0];
    if (/pd-/.test(r) && /(background|color)/.test(r)) out.push(r.replace(/\s+/g, " ").slice(0, 220));
  }
  return [...new Set(out)];
}
console.log("========== 原始主题 pd-* 配色 ==========");
console.log(rules(orig, "pd").slice(0, 25).join("\n"));
console.log("\n========== 当前主题 pd-* 配色 ==========");
console.log(rules(curr, "pd").slice(0, 25).join("\n"));
