const fs = require("fs");
const file = "C:/10.19源码/签下整个CBA/index.html";
let html = fs.readFileSync(file, "utf8");
const before = html.length;
html = html.replace(/<script>window\.__CBA_ERRORS__=[\s\S]*?<\/script>/, "");
if (html.length === before) { console.log("未找到探针"); process.exit(1); }
fs.writeFileSync(file, html, "utf8");
console.log("✓ 探针已移除，index 大小", Buffer.byteLength(html, "utf8"));
console.log("残留 __CBA_ERRORS__:", html.includes("__CBA_ERRORS__"));
