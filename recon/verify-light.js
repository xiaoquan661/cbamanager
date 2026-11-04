// verify-light.js — 白亮风转换后校验：语法 + 残留深色扫描 + 标题修正确认
const fs = require("fs");
function lum(hex) {
  let s = hex.replace("#", "");
  if (s.length === 3 || s.length === 4) s = [...s.slice(0, 3)].map(c => c + c).join("");
  const r = parseInt(s.slice(0, 2), 16) / 255, g = parseInt(s.slice(2, 4), 16) / 255, b = parseInt(s.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// 1. JS 语法
for (const f of ["cba-lamps-glue.js", "cba-daily-tasks.js"]) {
  const raw = fs.readFileSync("C:/10.19源码/签下整个CBA/assets/lamps/" + f, "utf8");
  try { new Function(raw); console.log("SYNTAX OK  " + f); } catch (e) { console.log("SYNTAX FAIL " + f + ": " + e.message); }
}
for (const f of ["cba-startup.js", "cba-launch.js"]) {
  const raw = fs.readFileSync("C:/10.19源码/签下整个CBA/" + f, "utf8");
  try { new Function(raw); console.log("SYNTAX OK  " + f); } catch (e) { console.log("SYNTAX FAIL " + f + ": " + e.message); }
}
// 2. CSS 残留深色（luminance<0.3，排除纯黑系 #000*）
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const dark = {};
for (const m of css.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
  const k = m[0].toLowerCase();
  if (/^#000/.test(k)) continue;
  if (lum(k) < 0.3) dark[k] = (dark[k] || 0) + 1;
}
const dk = Object.entries(dark).sort((a, b) => b[1] - a[1]);
console.log("\nCSS 残留深色(L<0.3): " + dk.length + " 种 / " + dk.reduce((s, e) => s + e[1], 0) + " 处");
console.log(dk.slice(0, 20).map(e => e[0] + " x" + e[1]).join("\n"));
// 3. index.html 标题与 theme-color
const html = fs.readFileSync("C:/10.19源码/签下整个CBA/index.html", "utf8");
console.log("\nh1 签下整个CBA: " + html.includes('cba-boot-title">签下整个CBA'));
console.log("config title: " + html.includes('"title":"签下整个CBA"'));
console.log("theme-color: " + (html.match(/theme-color" content="([^"]+)"/) || [])[1]);
console.log("color-scheme dark 残留: " + (html.match(/color-scheme:\s*dark/gi) || []).length);
console.log("css color-scheme dark 残留: " + (css.match(/color-scheme:\s*dark/gi) || []).length);
console.log("版本: " + (html.match(/cba-startup\.css\?v=[^"]+/) || [])[0] + " / " + (html.match(/cba-launch\.js\?v=[^"]+/) || [])[0] + " / " + (html.match(/cba-lamps-glue\.js\?v=[^"]+/) || [])[0]);
