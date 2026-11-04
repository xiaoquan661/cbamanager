// pred-outcome.js — practicePredictions 记录结构（成功标记字段）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("settlePredictions(state, matches, now");
console.log(js.slice(i, i + 1400).replace(/\s+/g, " "));