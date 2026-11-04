const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("className:`cover-grid`");
if (i < 0) i = js.indexOf("`cover-grid`");
console.log("at", i);
console.log(js.slice(i - 200, i + 3000));
