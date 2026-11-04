// playerdata-api.js — CBAPlayerData 对外方法
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("CBAPlayerData=");
if (i < 0) i = js.indexOf("CBAPlayerData =");
console.log(js.slice(i, i + 600).replace(/\s+/g, " "));
// 找 update( 定义
let u = js.indexOf("function update(");
if (u < 0) u = js.indexOf(",update:");
console.log("\nupdate 定义附近: " + js.slice(Math.max(0, u - 300), u + 500).replace(/\s+/g, " "));