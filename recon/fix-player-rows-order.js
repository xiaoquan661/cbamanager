const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");
const old = "const rows=filtered.slice().sort((a,b)=>root.CBADataClock.compareGamesDesc(a,b));";
const neu = "const rows=filtered.slice().sort((a,b)=>{const af=(a.completed||a.status==='final'||a.status==='dnp')?0:1,bf=(b.completed||b.status==='final'||b.status==='dnp')?0:1;if(af!==bf)return af-bf;return af===0?root.CBADataClock.compareGamesDesc(a,b):-root.CBADataClock.compareGamesDesc(a,b);});";
const n = js.split(old).length - 1;
console.log("匹配:", n);
if (n !== 1) process.exit(1);
js = js.replace(old, neu);
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }
