// playerdata-update2.js — update() 完整实现（确认 schedules 合并方式与 revision）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let u = js.indexOf("function update(next)");
console.log(js.slice(u, u + 1800).replace(/\s+/g, " "));