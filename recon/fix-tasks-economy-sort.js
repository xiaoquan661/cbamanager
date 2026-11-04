// fix-tasks-economy-sort.js — 快捷入口对齐 + 初始金币 1000 + 球员数据倒序
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

const pairs = [
  ['"openingCoins":500', '"openingCoins":1000'],
  ["openingCoins:500", "openingCoins:1000"],
  ["const rows=filtered.slice().sort((a,b)=>-root.CBADataClock.compareGamesDesc(a,b));",
   "const rows=filtered.slice().sort((a,b)=>root.CBADataClock.compareGamesDesc(a,b));"],
];
for (const [a, b] of pairs) {
  const n = js.split(a).length - 1;
  js = js.split(a).join(b);
  console.log(a.slice(0, 50), "→", n, "处");
}
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ bundle 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }
console.log("剩余 openingCoins:500 =", (js.match(/openingCoins["']?:500/g) || []).length);

let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* lobby-shortcuts-align: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-app .page-home .lobby-shortcuts{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:start!important;gap:0!important;padding:12px 0 14px!important}
.fantasy-app .page-home .lobby-shortcuts>button{width:100%!important;min-width:0!important;height:auto!important;padding:2px 0!important;gap:4px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;border:0!important;background:none!important}
.fantasy-app .page-home .lobby-shortcuts>button>b{font-size:12px!important;line-height:16px!important;font-weight:700!important;margin:0!important}
.fantasy-app .page-home .lobby-shortcuts>button>small{font-size:9px!important;line-height:12px!important;color:#94a3b8!important;margin:0!important}
.fantasy-app .page-home .lobby-shortcuts .shortcut-medal{width:34px!important;height:34px!important;flex:none!important}
.fantasy-app .page-home .lobby-shortcuts .shortcut-medal>svg{width:20px!important;height:20px!important}
.fantasy-app .page-home #r13-guide-button.r13-guide-trigger{width:100%!important;min-height:0!important;margin:0!important;padding:2px 0!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:4px!important;border:0!important;background:none!important;text-align:center!important}
.fantasy-app .page-home #r13-guide-button .guide-medal{width:34px!important;height:34px!important;flex:none!important}
`;
  fs.writeFileSync(root + "cba-startup.css", css, "utf8");
  console.log("✓ 快捷入口样式已统一");
}
