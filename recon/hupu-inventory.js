// hupu-inventory.js — 清点虎扑专属功能残留（发帖/社区/OSS/审核/分享/调试等）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
const marks = [
  "openPostEditor", "getTopicThreads", "buildPostSchema", "getPostDetail",
  "bbsConfig", "ColorboxAI.bbs", "checkAudit", "uploadFile",
  "addScore", "getScore", "navigateTo", "openUrl",
  "vatask", "发帖", "帖子", "海报", "分享", "邀请码", "JRS",
  "HupuBridge", "hupuLog", "WebGuard", "eruda", "colyseus", "Colyseus",
  "ColorboxAI.storage", "ColorboxAI.auth", "__SHAPER", "hupu_debug", "debug-console",
];
for (const f of ["cba-startup.js", "index.html", "cba-launch.js", "cba-app-gate.js"]) {
  const raw = fs.readFileSync(root + f, "utf8");
  const hits = [];
  for (const m of marks) {
    let c = 0, i = 0;
    while ((i = raw.indexOf(m, i)) >= 0) { c++; i++; }
    if (c) hits.push(m + " x" + c);
  }
  console.log("== " + f + " ==");
  console.log(hits.length ? hits.join(" | ") : "(干净)");
}
// assets 里可能已死的文件
console.log("\n== assets 可疑死文件 ==");
for (const f of ["colorbox-ai_v2.2.18.js", "colyseus-0.18.2.js", "web-guard-2.0.27-index.min.js", "hupu-js-bridge_v1.1.8.js", "hupu-Medium.ttf", "hupu-Regular.ttf"]) {
  console.log(f + ": " + fs.existsSync(root + "assets/" + f));
}
// 字体是否被 CSS 引用
const css = fs.readFileSync(root + "cba-startup.css", "utf8");
console.log("\nCSS 引用 hupu 字体: " + (css.indexOf("hupu-Medium") >= 0 || css.indexOf("hupu-Regular") >= 0));
console.log("CSS 引用 colyseus/colorbox/web-guard: " + ["colorbox-ai", "colyseus", "web-guard"].map(k => k + "=" + (css.indexOf(k) >= 0)).join(" "));
// bundle 引用 ColorboxAI 哪些能力
const js = fs.readFileSync(root + "cba-startup.js", "utf8");
const used = new Set();
for (const m of js.matchAll(/ColorboxAI\.([a-zA-Z_][\w.]*)/g)) used.add(m[1]);
console.log("\nbundle 用到的 ColorboxAI 能力: " + [...used].join(", "));
