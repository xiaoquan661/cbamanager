const fs = require("fs");
const file = "C:/10.19源码/签下整个CBA/cba-startup.js";
let js = fs.readFileSync(file, "utf8");
const broken = "]})]})(0,D.jsxs)(`button`,{className:`cover-tile cover-ranking`";
const fixed = "]})]}),(0,D.jsxs)(`button`,{className:`cover-tile cover-ranking`";
const n = js.split(broken).length - 1;
if (n !== 1) { console.log("匹配次数异常:", n); process.exit(1); }
js = js.replace(broken, fixed);
fs.writeFileSync(file, js, "utf8");
try { new Function(js); console.log("✓ 已补逗号，bundle 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }
