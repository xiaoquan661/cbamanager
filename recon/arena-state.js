// arena-state.js — 页面里 xe/pe（arena 显示状态）的定义
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("setDismissedArena");
console.log("== setDismissedArena 第一次出现附近 ==");
console.log(js.slice(Math.max(0, i - 1500), i + 500).replace(/\s+/g, " ").slice(-1600));