// relay-bounds.js — glue 中继模块的精确边界
const fs = require("fs");
const glue = fs.readFileSync("C:/10.19源码/签下整个CBA/assets/lamps/cba-lamps-glue.js", "utf8");
console.log("RELAY_URL:", glue.indexOf("var RELAY_URL"));
console.log("installDataRelay 定义:", glue.indexOf("function installDataRelay"));
console.log("中继注释块起点:", glue.indexOf("/* ---------- 数据中继"));
console.log("状态角标注释起点:", glue.indexOf("/* ---------- 状态角标"));
console.log("boot 函数:", glue.indexOf("function boot()"));
console.log("installDataRelay 调用:", glue.indexOf("installDataRelay();"));
console.log("bootSquadShare 定义:", glue.indexOf("function bootSquadShare"));
console.log("bootSquadShare 调用:", glue.indexOf("bootSquadShare();"));
// bootSquadShare 全文
let b = glue.indexOf("function bootSquadShare");
console.log("\nbootSquadShare 全文:\n" + glue.slice(b, b + 420));