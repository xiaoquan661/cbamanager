const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const lines = js.split("\n");
const line = lines[4660] || "";
console.log("line4661 len", line.length);
console.log(JSON.stringify(line.slice(17200, 17900)));
console.log("\ncontext before:", JSON.stringify(line.slice(16800, 17220)));
