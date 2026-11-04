const fs = require("fs");
const file = "C:/10.19源码/签下整个CBA/cba-startup.js";
let js = fs.readFileSync(file, "utf8");
const broken = "}).then(Ly)})()();";
const fixed = "}).then(Ly)})();";
const n = js.split(broken).length - 1;
console.log("匹配:", n);
if (n !== 1) process.exit(1);
js = js.replace(broken, fixed);
fs.writeFileSync(file, js, "utf8");
try { new Function(js); console.log("✓ 已去掉多余调用，语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }
