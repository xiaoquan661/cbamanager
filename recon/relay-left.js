// relay-left.js — 残留 RELAY_URL 上下文
const fs = require("fs");
const glue = fs.readFileSync("C:/10.19源码/签下整个CBA/assets/lamps/cba-lamps-glue.js", "utf8");
let i = glue.indexOf("RELAY_URL");
console.log(glue.slice(Math.max(0, i - 500), i + 300));