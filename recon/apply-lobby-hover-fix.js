// apply-lobby-hover-fix.js — 悬停/聚焦时也保持新插图
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* lobby-art-hover: 20261103 */";
if (css.includes(MARK)) { console.log("已存在"); process.exit(0); }

const tiles = [
  ["market", "lobby-signing.jpg", "50% 38%", "linear-gradient(180deg,#080e1800 38%,#080e18d9 100%)"],
  ["fusion", "lobby-duel.jpg", "50% 42%", "linear-gradient(180deg,#080e1800 38%,#080e18d9 100%)"],
  ["recruit", "lobby-star.jpg", "50% 34%", "linear-gradient(180deg,#080e18cc 0%,#080e1800 22%,#080e1800 52%,#080e18e6 100%)"],
  ["season", "lobby-arena.jpg", "50% 50%", "linear-gradient(180deg,#080e1800 42%,#080e18e0 100%)"],
  ["ranking", "lobby-trophy.jpg", "50% 46%", "linear-gradient(90deg,#080e18e6 0%,#080e1866 55%,#080e18b3 100%)"],
];

let out = "\n" + MARK;
for (const [cls, file, pos, grad] of tiles) {
  const sel = [":hover", ":focus-visible", ":active"].map(s => `.fantasy-app .page-home .cover-grid button.cover-${cls}${s}`).join(",");
  out += `\n${sel}{background-image:${grad},url("assets/lobby/${file}")!important;background-size:cover!important;background-position:${pos}!important;background-repeat:no-repeat!important}`;
}
css += out;
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("✓ 悬停/聚焦覆盖已追加，CSS 大小", Buffer.byteLength(css, "utf8"));
