const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const css = fs.readFileSync(root + "cba-startup.css", "utf8");
const js = fs.readFileSync(root + "cba-startup.js", "utf8");
const glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
const html = fs.readFileSync(root + "index.html", "utf8");

try { new Function(js); console.log("✓ bundle 语法 OK"); } catch (e) { console.log("✗ bundle:", e.message); }
try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (e) { console.log("✗ glue:", e.message); }

console.log("CSS 大括号平衡:", (css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
console.log("疑似被误改的 6 位 ID 选择器:", (css.match(/#[0-9a-f]{6}-/gi) || []).slice(0, 5));
console.log("glue 含 #cba-rankboard:", glue.includes("#cba-rankboard"));
console.log("index 含 #cba-boot:", html.includes("#cba-boot"));
console.log("\n主题变量:");
console.log((css.match(/--theme-[a-z-]+:[^;]+/g) || []).join("\n"));
for (const c of ["#080e18", "#14263b", "#e5a33b", "#dce5ef", "#f36b32"]) {
  console.log(c, "出现次数:", (css.match(new RegExp(c, "gi")) || []).length);
}
console.log("\n样例规则:");
for (const sel of ["body{", ".fantasy-app .page-home .cover-grid {", ".page-home .cover-grid button.cover-season"]) {
  const i = css.indexOf(sel);
  if (i >= 0) console.log(sel, "→", css.slice(i, i + 160).replace(/\s+/g, " "));
}
