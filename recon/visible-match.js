// visible-match.js — cbaArenaVisibleMatch 逻辑
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("function cbaArenaVisibleMatch");
console.log(js.slice(i, i + 900).replace(/\s+/g, " "));