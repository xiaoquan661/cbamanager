const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const i = js.indexOf("cover-grid");
console.log("first cover-grid at", i);
console.log(js.slice(i - 300, i + 2200));
