// verify-html.js — index.html 清理后结构复核
const fs = require("fs");
const html = fs.readFileSync("C:/10.19源码/签下整个CBA/index.html", "utf8");
console.log("大小: " + Math.round(html.length / 1024) + "KB");
const opens = (html.match(/<script\b/g) || []).length;
const closes = (html.match(/<\/script>/g) || []).length;
console.log("script 标签: " + opens + " 开 / " + closes + " 闭 " + (opens === closes ? "✓" : "✗ 不配对!"));
const styleO = (html.match(/<style\b/g) || []).length, styleC = (html.match(/<\/style>/g) || []).length;
console.log("style 标签: " + styleO + "/" + styleC + (styleO === styleC ? " ✓" : " ✗"));
for (const m of ["__SHAPER", "hupu_debug", "WebGuard", "emptyBbsConfig", "__COLORBOX_AI_CONFIG__", "openPostEditor", "debug-console", "skill-usage", "HupuBridge", "vatask-complete", "bbsConfig"]) {
  const c = html.split(m).length - 1;
  if (c) console.log("✗ 残留 " + m + " x" + c);
}
console.log("虎扑痕迹检查完成（无输出=干净）");
console.log("关键结构: root=" + html.includes('<div id="root">') + " boot-loading=" + html.includes("cba-boot-loading") + " boot-error=" + html.includes("cba-boot-error") + " title=" + html.includes("<title>签下整个CBA</title>"));
console.log("lamps桥接: " + (html.match(/assets\/lamps\/[a-z-]+\.js[^<]*/g) || []).join(" | "));
console.log("css引用: " + (html.match(/cba-startup\.css\?v=[^"']+/) || [])[0]);
