// remove-hupu-part2.js — index.html 虎扑块清理 + 死文件删除 + 版本同步
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let html = fs.readFileSync(root + "index.html", "utf8");

function cutScript(anchorInBlock, label, replacement) {
  const a = html.indexOf(anchorInBlock);
  if (a < 0) { console.log("- 未找到（可能已删）: " + label); return; }
  const s = html.lastIndexOf("<script", a);
  const e = html.indexOf("</script>", a);
  if (s < 0 || e < 0) { console.log("✗ " + label + " 边界失败"); return; }
  html = html.slice(0, s) + (replacement || "") + html.slice(e + "</script>".length);
  console.log("✓ 已删除 " + label + "（" + (e + 9 - s) + " 字符）");
}

const STUB = '<script>\n(function () {\n  function install() {\n    try {\n      if (!window.ColorboxAI || typeof window.ColorboxAI !== "object") window.ColorboxAI = {};\n      if (!window.ColorboxAI.auth || typeof window.ColorboxAI.auth !== "object") window.ColorboxAI.auth = {};\n      window.ColorboxAI.auth.getUserInfo = function () {\n        return Promise.resolve({ code: 200, data: { islogin: 0 } });\n      };\n    } catch (e) {}\n  }\n  install();\n  var tries = 0;\n  var timer = setInterval(function () {\n    install();\n    if (++tries > 120) clearInterval(timer);\n  }, 500);\n})();\n</script>';

cutScript("__SHAPER_WEB_GUARD_SESSION__", "web-guard context 会话脚本");
cutScript("hupu_debug') !== 'true'", "hupu_debug 调试/模拟登录块");
cutScript("colorbox-skill-usage", "虎扑 skill-usage 清单");
cutScript("window.WebGuard.init({", "WebGuard.init 垫片");
cutScript("window.__COLORBOX_AI_CONFIG__", "colorbox 运行时块（替换为访客身份垫片）", STUB);
cutScript("var emptyBbsConfig", "bbsConfig 虎扑社区桥接");
cutScript("data-shaper-debug-console-runtime", "hupu 调试台加载器");

fs.writeFileSync(root + "index.html", html, "utf8");
// 复核
const check = fs.readFileSync(root + "index.html", "utf8");
const marks = ["__SHAPER", "hupu_debug", "WebGuard", "emptyBbsConfig", "__COLORBOX_AI_CONFIG__", "openPostEditor", "debug-console", "colorbox-skill-usage"];
for (const m of marks) console.log("残留 " + m + ": " + check.split(m).length - 1);
console.log("访客身份垫片存在: " + check.includes("islogin: 0"));
console.log("index.html 大小: " + Math.round(check.length / 1024) + "KB");

// 死文件删除
const dead = [
  "assets/colorbox-ai_v2.2.18.js", "assets/colyseus-0.18.2.js",
  "assets/web-guard-2.0.27-index.min.js", "assets/hupu-js-bridge_v1.1.8.js",
  "assets/hupu-Medium.ttf", "assets/hupu-Regular.ttf",
  "__ai_app.html", "cba-app-gate.js",
];
for (const f of dead) {
  const p = root + f;
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log("✓ 已删除文件 " + f); }
}
const stage = root + "dist/stage/";
for (const f of ["__ai_app.html", "cba-app-gate.js", "assets/colorbox-ai_v2.2.18.js", "assets/colyseus-0.18.2.js", "assets/web-guard-2.0.27-index.min.js", "assets/hupu-js-bridge_v1.1.8.js", "assets/hupu-Medium.ttf", "assets/hupu-Regular.ttf"]) {
  if (fs.existsSync(stage + f)) { fs.unlinkSync(stage + f); console.log("✓ stage 删除 " + f); }
}

// 版本同步
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '20261030d-nohupu';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html2 = fs.readFileSync(root + "index.html", "utf8");
html2 = html2.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=20261030d-nohupu");
fs.writeFileSync(root + "index.html", html2, "utf8");
console.log("版本 → 20261030d-nohupu");
