// battle-css.js — battle-player 卡片文字区样式
const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const rules = css.match(/\.battle-player[^{,]*\{[^}]*\}/g) || [];
console.log(rules.join("\n").slice(0, 3000));