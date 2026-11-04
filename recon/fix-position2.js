// fix-position2.js — 修复 iy 替换串的键名引号问题
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

const BROKEN = 'iy=e=>String(e||"").split(`/`).map(p=>({"控球后卫":`PG`,"组织后卫":`PG`,"得分后卫":`SG`,`小前锋`:`SF`,`大前锋`:`PF`,`中锋`:`C`}[p.trim()]||p.trim())).join(`/`)';
const GOOD = 'iy=e=>String(e||"").split(`/`).map(p=>({`控球后卫`:`PG`,`组织后卫`:`PG`,`得分后卫`:`SG`,`小前锋`:`SF`,`大前锋`:`PF`,`中锋`:`C`}[p.trim()]||p.trim())).join(`/`)';

// 键也用反引号仍不合法——改用双引号键 + 双引号值
const FIXED = 'iy=e=>String(e||"").split("/").map(p=>({"控球后卫":"PG","组织后卫":"PG","得分后卫":"SG","小前锋":"SF","大前锋":"PF","中锋":"C"}[p.trim()]||p.trim())).join("/")';

let done = false;
if (js.indexOf(BROKEN) >= 0) { js = js.split(BROKEN).join(FIXED); done = true; console.log("✓ 坏串已替换"); }
else if (js.indexOf(GOOD) >= 0) { js = js.split(GOOD).join(FIXED); done = true; console.log("✓ 半好串已替换"); }
else if (js.indexOf(FIXED) >= 0) { done = true; console.log("- 已是正确版本"); }
else { console.log("✗ 未找到坏串，打印实际内容："); const i = js.indexOf("iy=e=>"); console.log(JSON.stringify(js.slice(i, i + 220))); process.exit(1); }

fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗ 语法失败: " + e.message); const i = js.indexOf("iy=e=>"); console.log(js.slice(i - 50, i + 250)); process.exit(1); }

// 自测
const iy = e => String(e || "").split("/").map(p => ({ "控球后卫": "PG", "组织后卫": "PG", "得分后卫": "SG", "小前锋": "SF", "大前锋": "PF", "中锋": "C" }[p.trim()] || p.trim())).join("/");
for (const t of ["控球后卫", "大前锋/小前锋", "控球后卫/得分后卫", "大前锋/中锋", "PF", "SG", "中锋"]) console.log("  " + t + " → " + iy(t));

let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '20261030e-pos';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=20261030e-pos");
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("版本 → 20261030e-pos");
