// verify-dark.js — 深色竞技风转换后校验
const fs = require("fs");
function lum(hex) {
  let s = hex.replace("#", "");
  const r = parseInt(s.slice(0, 2), 16) / 255, g = parseInt(s.slice(2, 4), 16) / 255, b = parseInt(s.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// 1. JS 语法
for (const f of ["assets/lamps/cba-lamps-glue.js", "assets/lamps/cba-daily-tasks.js", "cba-startup.js", "cba-launch.js"]) {
  const raw = fs.readFileSync("C:/10.19源码/签下整个CBA/" + f, "utf8");
  try { new Function(raw); console.log("SYNTAX OK  " + f); } catch (e) { console.log("SYNTAX FAIL " + f + ": " + e.message); }
}
// 2. 关键映射抽查（用转换函数重算）
const hexToRgb = h => { let s = h.replace("#", ""); if (s.length === 6) s += "ff"; return [parseInt(s.slice(0,2),16), parseInt(s.slice(2,4),16), parseInt(s.slice(4,6),16)]; };
const checks = [
  ["#080f16", "页面底(原) → 应近 #090D16"],
  ["#101c27", "一级卡(原) → 应近 #111827"],
  ["#172532", "二级卡(原) → 应近 #1B2535"],
  ["#445568", "分割线(原) → 应近 #263244"],
  ["#f4f0e3", "主文字(原) → 应近 #F8FAFC"],
  ["#9ba9b6", "次文字(原) → 应近 #94A3B8"],
  ["#f0d58a", "金色标题(原) → 应荧光绿"],
  ["#d6b56a", "金色强调(原) → 应绿系"],
  ["#ecd998", "按钮亮金(原) → 应荧光绿"],
  ["#b78f42", "按钮深金(原) → 应深绿"],
  ["#8b7950", "金色边框(原) → 应中性分割线"],
  ["#f4f0e3", ""],
];
// 直接从转换后的 CSS 里查这些原始色是否已消失、新色是否出现
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
for (const [orig, note] of checks.slice(0, 11)) {
  const gone = !css.includes(orig.toLowerCase());
  console.log((gone ? "✓已转换" : "✗仍存在") + "  " + orig + "  " + note);
}
// 3. 新色板出现次数
for (const target of ["#0a0d10", "#111827", "#1b2535", "#263244", "#f8fafc", "#94a3b8", "#a3e635", "#22c55e", "#38bdf8"]) {
  let c = 0, i = 0;
  while ((i = css.indexOf(target, i)) >= 0) { c++; i++; }
  console.log("新色 " + target + " x" + c);
}
// 4. index.html 校验
const html = fs.readFileSync("C:/10.19源码/签下整个CBA/index.html", "utf8");
console.log("\nh1 签下整个CBA: " + html.includes('cba-boot-title">签下整个CBA'));
console.log("Noto Sans SC: " + html.includes('"Noto Sans SC"'));
console.log("theme-color: " + (html.match(/theme-color" content="([^"]+)"/) || [])[1]);
console.log("版本: " + (html.match(/cba-startup\.css\?v=[^"]+/) || [])[0]);
// 5. freeze 修复是否被回滚（需重新落地）
const glue = fs.readFileSync("C:/10.19源码/签下整个CBA/assets/lamps/cba-lamps-glue.js", "utf8");
console.log("\nfreeze 修复存在: " + glue.includes("existing.textContent !== label"));
