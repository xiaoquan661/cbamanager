const fs = require("fs");
const t = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = t.indexOf("PUBLIC_ENTRY");
let c = 0;
while (i >= 0 && c < 6) { console.log("[PUBLIC_ENTRY]", JSON.stringify(t.slice(Math.max(0, i - 150), i + 180))); i = t.indexOf("PUBLIC_ENTRY", i + 12); c++; }
console.log("PUBLIC_ENTRY count:", (t.match(/PUBLIC_ENTRY/g) || []).length);
console.log("sourceUrl count:", (t.match(/sourceUrl/g) || []).length);
console.log(".sourceUrl reads:", (t.match(/\.sourceUrl\b/g) || []).length);
const hosts = {};
for (const m of t.matchAll(/https?:\/\/([^\s"'<>)\/`]+)/g)) hosts[m[1]] = (hosts[m[1]] || 0) + 1;
console.log(hosts);
