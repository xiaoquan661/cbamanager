// white-hunt.js — 找球员详情页白色背景的来源
const fs = require("fs");
const orig = fs.readFileSync("C:/10.19源码/签下整个CBA/_backup-pre-light/cba-startup.css", "utf8");
const curr = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");

// 1. sheet 弹层背景（球员详情在 sheet 中打开）
function grab(css, re, label) {
  const m = css.match(re) || [];
  console.log("== " + label + " ==");
  console.log([...new Set(m)].slice(0, 12).join("\n") || "(无)");
}
grab(orig, /\.sheet[a-z-]*[^{,]*\{[^}]*background[^}]*\}/g, "原始 .sheet 背景");
grab(curr, /\.sheet[a-z-]*[^{,]*\{[^}]*background[^}]*\}/g, "当前 .sheet 背景");

// 2. 当前 CSS 中 near-white 背景规则统计（转换盲点：L0.68-0.85 带被推到 0.9）
const rules = curr.match(/[^{}]+\{[^}]*background[^}]*\}/g) || [];
const whiteBg = rules.filter(r => /background[^;}]*(#f[a-f0-9]{5}|#fff\b|#fff[0-9a-f]{2}\b|#e[a-f0-9]{5})/i.test(r) && !/gradient/.test(r));
console.log("\n== 当前 CSS 浅色背景规则数: " + whiteBg.length + " ==");
console.log(whiteBg.slice(0, 15).map(r => r.replace(/\s+/g, " ").trim().slice(0, 150)).join("\n"));

// 3. 原始 CSS 中这些浅背景在转换前的亮度（判断是否本来就有浅背景）
const origRules = orig.match(/[^{}]+\{[^}]*background[^}]*\}/g) || [];
const origLight = origRules.filter(r => /background[^;}]*(#f[a-f0-9]{5}|#fff\b|#e[a-f0-9]{5})/i.test(r) && !/gradient/.test(r));
console.log("\n原始 CSS 浅色背景规则数: " + origLight.length);
console.log(origLight.slice(0, 8).map(r => r.replace(/\s+/g, " ").trim().slice(0, 150)).join("\n"));
