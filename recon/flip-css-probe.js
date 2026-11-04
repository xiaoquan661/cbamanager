// flip-css-probe.js — fantasy-flip 动画规则全景 + 禁用规则的上下文
const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const idx = css.indexOf("animation:none!important;transition:none!important");
console.log("== 禁用规则上下文 ==");
console.log(css.slice(Math.max(0, idx - 400), idx + 120));
console.log("\n== is-opening / flip-inner / revealed 规则 ==");
const rules = css.match(/[^{}]*fantasy-flip[^{]*\{[^}]*\}/g) || [];
for (const r of rules) {
  if (/is-opening|flip-inner|flip-face|revealed|await/.test(r)) console.log(r);
}
console.log("\n== await-face / reveal keyframes ==");
const kf = css.match(/@keyframes fantasy-(reveal|await-face|read-spin)[^}]*\}[^}]*\}/g) || [];
console.log(kf.join("\n"));