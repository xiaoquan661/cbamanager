// team-tile-bounds.js — cover-team 磁贴 JSX 精确边界
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const anchor = "className:`cover-tile cover-team`";
const i = js.indexOf(anchor);
console.log("锚点 @" + i);
console.log(js.slice(i - 60, i + 2200).replace(/\s+/g, " "));