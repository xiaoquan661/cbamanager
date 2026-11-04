// 难度曲线 v2：26 场严格由弱到强，弱队全排前面
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const file = root + "cba-startup.js";
let js = fs.readFileSync(file, "utf8");
const OLD = "plan=[0,1,2,3,4,5,6,7,6,7,8,9,10,11,10,11,12,13,14,15,14,15,16,17,18,19]";
const NEW = "plan=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,14,15,15,16,16,17,17,18,18,19,19]";
const n = js.split(OLD).length - 1;
console.log("匹配:", n);
if (n !== 1) { console.log("未匹配"); process.exit(1); }
js = js.split(OLD).join(NEW);
fs.writeFileSync(file, js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }