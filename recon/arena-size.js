// arena-size.js — .match-arena 宽度/居中
const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
console.log((css.match(/[^{}]*\.match-arena\{[^}]*\}/g) || []).join("\n").slice(0, 1500));
console.log("\n== arena-result-scroll ==");
console.log((css.match(/[^{}]*arena-result-scroll[^{]*\{[^}]*\}/g) || []).join("\n").slice(0, 1200));