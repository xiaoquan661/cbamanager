// white-surfaces.js — 找出所有白色/近白背景的容器规则
const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const rules = css.match(/[^{}]+\{[^}]*\}/g) || [];
const hits = [];
for (const r of rules) {
  const body = r.slice(r.indexOf("{"));
  if (!/background[^;}]*(#f6f6f6|#fff\b|#ffffff|#f8fafc|#f5f6f7|#e[0-9a-f]{5})/i.test(body)) continue;
  if (/gradient/.test(body)) continue;
  const sel = r.slice(0, r.indexOf("{")).trim();
  if (sel.length > 120) continue;
  hits.push(sel + "  {" + body.replace(/\s+/g, " ").slice(0, 90) + "}");
}
console.log("浅色背景规则 " + hits.length + " 条：");
console.log(hits.map(h => "· " + h).join("\n").slice(0, 6000));