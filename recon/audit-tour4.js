const fs = require("fs");
const j = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const a = j.indexOf("const VERSION = 'home-tour-r275-v1'");
const b = j.indexOf("})(typeof window", a);
console.log("start", a, "end", b);
console.log(j.slice(a, b).replace(/\s+/g, " "));