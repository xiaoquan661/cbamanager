const fs = require("fs");
const j = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const start = j.indexOf("const STEPS");
console.log(j.slice(start, start + 3500).replace(/\s+/g, " "));
const i = j.indexOf("function start", start);
console.log("\n--- start/trigger ---\n" + j.slice(Math.max(0, i - 300), i + 1800).replace(/\s+/g, " "));
const k = j.indexOf("cba-home-tour-shade");
console.log("\n--- trigger site ---\n" + j.slice(Math.max(0, k - 3000), k - 1200).replace(/\s+/g, " "));