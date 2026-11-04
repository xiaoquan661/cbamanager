const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const lines = js.split("\n");
const line = lines[4660];
console.log(line.slice(14000, 17600));
