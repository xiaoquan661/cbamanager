// pvp-probe.js — practice dispatch 动作清单 + 快速比赛动作 + 异步池接入点
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
// practice dispatch 的动作分支
const i = js.indexOf("function dispatch(action)");
const seg = js.slice(i, i + 6000);
const acts = [...new Set((seg.match(/action\.type\s*===\s*'([a-zA-Z]+)'|action\.type==='([a-zA-Z]+)'/g) || []))];
console.log("dispatch 显式处理的动作:", acts.join(", "));
// 'match' 动作语义
let m = js.indexOf("t.type===`match`");
console.log("\n=== t.type===`match` 上下文 ===");
console.log(js.slice(Math.max(0, m - 400), m + 400).replace(/\s+/g, " "));
// __CBA_PVPSYNC__ / pool20 接入点
let p = js.indexOf("__CBA_PVPSYNC__");
console.log("\n=== PVP 池接入点 ===");
console.log(js.slice(Math.max(0, p - 500), p + 500).replace(/\s+/g, " "));