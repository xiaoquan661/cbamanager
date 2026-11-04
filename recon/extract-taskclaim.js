const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const i = js.indexOf("if(t.type===`taskClaim`)");
console.log(JSON.stringify(js.slice(i, i + 360)));
const w = js.indexOf("'taskClaim','dailyCheckin'");
console.log("whitelist at", w, JSON.stringify(js.slice(w - 30, w + 40)));
