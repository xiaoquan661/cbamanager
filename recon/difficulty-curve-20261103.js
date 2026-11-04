// 难度曲线：前 3 场打最弱的三队，之后逐级加压，最后两场打最强两队
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const file = root + "cba-startup.js";
let js = fs.readFileSync(file, "utf8");

const OLD = ",r=[...P_].sort((e,t)=>n(t)-n(e)),i=e<20?P_[(e+(t-1)*7)%20]:r[e<23?[6,3,1][e-20]:0],";
const NEW = ",i=(function(){var asc=[...P_].sort(function(x,y){return n(x)-n(y)}),plan=[0,1,2,3,4,5,6,7,6,7,8,9,10,11,10,11,12,13,14,15,14,15,16,17,18,19],shift=Math.min(2,Math.max(0,t-1));return asc[Math.min(19,plan[e]+shift)]})(),";

const n = js.split(OLD).length - 1;
console.log("匹配原难度代码:", n);
if (n !== 1) { console.log("未找到唯一匹配，未修改"); process.exit(1); }
js = js.split(OLD).join(NEW);
fs.writeFileSync(file, js, "utf8");
try { new Function(js); console.log("✓ bundle 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }