// fix-position.js — iy 位置映射支持双位置（"大前锋/小前锋" → "PF/SF"）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

const OLD = 'iy=e=>({"控球后卫":`PG`,"得分后卫":`SG`,"小前锋":`SF`,"大前锋":`PF`,"中锋":`C`}[e]||e)';
const NEW = 'iy=e=>String(e||"").split(`/`).map(p=>({"控球后卫":`PG`,"组织后卫":`PG`,"得分后卫":`SG`,`小前锋`:`SF`,`大前锋`:`PF`,`中锋`:`C`}[p.trim()]||p.trim())).join(`/`)';

if (js.indexOf(OLD) < 0) { console.log("✗ 未找到 iy 定义锚点"); process.exit(1); }
const c = js.split(OLD).length - 1;
js = js.split(OLD).join(NEW);
console.log("✓ iy 已升级（" + c + " 处）");
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ 语法 OK"); } catch (e) { console.log("✗ 语法失败: " + e.message); process.exit(1); }

// 自测映射结果
const iy = e => String(e || "").split(`/`).map(p => ({ "控球后卫": `PG`, "组织后卫": `PG`, "得分后卫": `SG`, "小前锋": `SF`, "大前锋": `PF`, "中锋": `C` }[p.trim()] || p.trim())).join(`/`);
for (const t of ["控球后卫", "大前锋/小前锋", "控球后卫/得分后卫", "大前锋/中锋", "PF", "SG", "中锋"]) console.log("  " + t + " → " + iy(t));

// 版本同步（glue 驱动 startup?v=）
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '20261030e-pos';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=20261030e-pos");
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("版本 → 20261030e-pos");
