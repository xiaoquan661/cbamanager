const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const lines = js.split("\n");
const line = lines[4660];
const col = 17491;
console.log("around col:", JSON.stringify(line.slice(col - 120, col + 120)));
// 找该行内所有 "})()();" 的位置
let idx = -1, arr = [];
while ((idx = line.indexOf("})()();", idx + 1)) >= 0) arr.push(idx);
console.log("})()(); 位置:", arr);
console.log("col 是否落在其中:", arr.map(a => [a, a + 7]));
console.log("start of line:", JSON.stringify(line.slice(0, 300)));
