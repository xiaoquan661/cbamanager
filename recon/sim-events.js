// sim-events.js — 比赛模拟事件字段全貌
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
console.log(js.slice(3190600, 3194600).replace(/\s+/g, " "));
