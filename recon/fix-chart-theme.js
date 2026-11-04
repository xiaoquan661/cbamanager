// fix-chart-theme.js — 图表提示气泡/网格/轴文字的深色适配 + 隐藏白色模拟光标
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

const pairs = [
  ["fill:'#f6f6f6'", "fill:'#1b2535'"],
  ["stroke:'#f5f6f7'", "stroke:'#263244'"],
  ["fill:'#828387'", "fill:'#94a3b8'"],
  ["trend === 'up' ? '#a17b7e'", "trend === 'up' ? '#ef4444'"],
  ["trend === 'down' ? '#238b49'", "trend === 'down' ? '#22c55e'"],
  ["trend === 'flat' ? '#7d8184'", "trend === 'flat' ? '#94a3b8'"],
];
for (const [a, b] of pairs) {
  const n = js.split(a).length - 1;
  js = js.split(a).join(b);
  console.log(a, "→", b, "替换", n, "处");
}
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ bundle 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }

let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* chart-theme: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-app .mobile-cursor,.fantasy-app .mobile-cursor-hotspot{display:none!important}
`;
  fs.writeFileSync(root + "cba-startup.css", css, "utf8");
  console.log("✓ 已隐藏模拟光标");
}
