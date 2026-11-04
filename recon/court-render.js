// court-render.js — 球场阵容卡的位置行渲染
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
console.log(js.slice(3327304, 3330600).replace(/\s+/g, " "));
