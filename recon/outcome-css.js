// outcome-css.js — .arena-outcome / arena-controls 现有样式
const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
console.log("== arena-outcome ==");
console.log((css.match(/[^{}]*arena-outcome[^{]*\{[^}]*\}/g) || []).join("\n").slice(0, 2000));
console.log("\n== arena-result-content ==");
console.log((css.match(/[^{}]*arena-result-content[^{]*\{[^}]*\}/g) || []).join("\n").slice(0, 1200));
console.log("\n== arena-controls 全量 ==");
console.log((css.match(/[^{}]*arena-controls[^{]*\{[^}]*\}/g) || []).join("\n").slice(0, 2400));