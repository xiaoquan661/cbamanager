// remove-hupu.js — 删除虎扑专属功能（发帖海报/邀请码/虎扑调试桥接/死SDK文件）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

// 括号配平工具（跳过字符串/模板串）
function balanceEnd(js, startIdx) {
  let depth = 0;
  for (let i = startIdx; i < js.length; i++) {
    const c = js[i];
    if (c === "\"" || c === "'") { const q = c; i++; while (i < js.length && js[i] !== q) { if (js[i] === "\\") i++; i++; } }
    else if (c === "`") { i++; while (i < js.length && js[i] !== "`") { if (js[i] === "\\") i++; i++; } }
    else if (c === "{" || c === "(" || c === "[") depth++;
    else if (c === "}" || c === ")" || c === "]") { depth--; if (depth === 0) return i; }
  }
  return -1;
}

/* ============ 1. cba-startup.js ============ */
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

function cut(startMark, endMark, label) {
  const s = js.indexOf(startMark);
  if (s < 0) { console.log("✗ 未找到起点: " + label); return false; }
  const e = js.indexOf(endMark, s);
  if (e < 0) { console.log("✗ 未找到终点: " + label); return false; }
  js = js.slice(0, s) + js.slice(e + endMark.length);
  console.log("✓ 已删除 " + label + "（" + (e + endMark.length - s) + " 字符）");
  return true;
}

// 1a. 海报发帖模块（整个 IIFE）
cut("(function installResultPoster(window,document)",
  "window.addEventListener(\"click\",captureShare,true)})(window,document);",
  "海报发帖模块 installResultPoster");

// 1b. 邀请码 UI 模块（整个 IIFE）
cut("/* cba-invite-ui.js */",
  "root.CBAInviteUI={create,redeem,normalize,valid}; })(window);",
  "邀请码模块 cba-invite-ui");

// 1c. 分享按钮注入器（括号配平删除）
{
  const s = js.indexOf("(function(){var SHARE_LABEL=\"虎扑专区发帖\";");
  if (s < 0) console.log("✗ 未找到分享注入器起点");
  else {
    // IIFE 主体从起点开始，配平到开括号闭合
    const bodyStart = s + "(function".length; // 指向 '{'? 不对——配平从 '(' 开始
    const e = balanceEnd(js, s + 1); // 从 '(' 之后开始配平
    if (e < 0) console.log("✗ 注入器配平失败");
    else {
      js = js.slice(0, s) + js.slice(e + 1);
      console.log("✓ 已删除 分享按钮注入器（" + (e + 1 - s) + " 字符）");
    }
  }
}

// 1d. Mv 组件 → 不再渲染邀请码/分享面板
{
  const s = js.indexOf("function Mv({game:e,act:t,notify:n,onScout:r}){");
  if (s < 0) console.log("✗ 未找到 Mv 组件");
  else {
    const bStart = js.indexOf("{", s);
    const bEnd = balanceEnd(js, bStart);
    js = js.slice(0, s) + "function Mv({game:e,act:t,notify:n,onScout:r}){return null}" + js.slice(bEnd + 1);
    console.log("✓ Mv 组件已置空（不再渲染邀请码/虎扑分享面板）");
  }
}

// 1e. 排行榜"生成排名海报"按钮 → null
{
  const anchor = "ranking-poster-action";
  const a = js.indexOf(anchor);
  if (a < 0) console.log("✗ 未找到 ranking-poster-action");
  else {
    // 往前找 h("button",{className:"ranking-poster-action"
    const btn = js.lastIndexOf("h(\"button\",{className:\"ranking-poster-action\"", a);
    const openParen = js.indexOf("(", btn);
    const e = balanceEnd(js, openParen);
    if (btn < 0 || e < 0) console.log("✗ 海报按钮边界失败");
    else {
      js = js.slice(0, btn) + "null" + js.slice(e + 1);
      console.log("✓ 排行榜海报按钮已移除");
    }
  }
}

fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ cba-startup.js 语法 OK"); }
catch (e) { console.log("✗ 语法失败: " + e.message); process.exit(1); }

/* ============ 2. index.html ============ */
let html = fs.readFileSync(root + "index.html", "utf8");

function cutScript(anchorInBlock, label, replacement) {
  const a = html.indexOf(anchorInBlock);
  if (a < 0) { console.log("✗ 未找到 " + label); return; }
  const s = html.lastIndexOf("<script", a);
  const e = html.indexOf("</script>", a);
  if (s < 0 || e < 0) { console.log("✗ " + label + " 边界失败"); return; }
  html = html.slice(0, s) + (replacement || "") + html.slice(e + "</script>".length);
  console.log("✓ 已删除 " + label + "（" + (e + 9 - s) + " 字符）");
}

// 2a. web-guard context 会话脚本
cutScript("__SHAPER_WEB_GUARD_SESSION__", "web-guard context 会话脚本");
// 2b. hupu_debug 调试+模拟登录（大块）
cutScript("hupu_debug') !== 'true'", "hupu_debug 调试/模拟登录块");
// 2c. colorbox-skill-usage 清单
cutScript("colorbox-skill-usage", "虎扑 skill-usage 清单");
// 2d. WebGuard.init 垫片
cutScript("window.WebGuard.init({", "WebGuard.init 垫片");
// 2e. colorbox 运行时（保留访客身份垫片）
const STUB = '<script>\n(function () {\n  function install() {\n    try {\n      if (!window.ColorboxAI || typeof window.ColorboxAI !== "object") window.ColorboxAI = {};\n      if (!window.ColorboxAI.auth || typeof window.ColorboxAI.auth !== "object") window.ColorboxAI.auth = {};\n      window.ColorboxAI.auth.getUserInfo = function () {\n        return Promise.resolve({ code: 200, data: { islogin: 0 } });\n      };\n    } catch (e) {}\n  }\n  install();\n  var tries = 0;\n  var timer = setInterval(function () {\n    install();\n    if (++tries > 120) clearInterval(timer);\n  }, 500);\n})();\n</script>';
cutScript("window.__COLORBOX_AI_CONFIG__", "colorbox 运行时块（保留访客身份垫片）", STUB);
// 2f. bbsConfig 桥接
cutScript("var emptyBbsConfig", "bbsConfig 虎扑社区桥接");
// 2g. debug-console
cutScript("data-shaper-debug-console-runtime", "hupu 调试台加载器");

fs.writeFileSync(root + "index.html", html, "utf8");
console.log("✓ index.html 已写回");

/* ============ 3. 删除死文件 ============ */
const dead = [
  "assets/colorbox-ai_v2.2.18.js", "assets/colyseus-0.18.2.js",
  "assets/web-guard-2.0.27-index.min.js", "assets/hupu-js-bridge_v1.1.8.js",
  "assets/hupu-Medium.ttf", "assets/hupu-Regular.ttf",
  "__ai_app.html", "cba-app-gate.js",
];
for (const f of dead) {
  const p = root + f;
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log("✓ 已删除文件 " + f); }
  else console.log("- 不存在 " + f);
}
const stage = root + "dist/stage/";
for (const f of ["__ai_app.html", "cba-app-gate.js"]) {
  if (fs.existsSync(stage + f)) { fs.unlinkSync(stage + f); console.log("✓ stage 删除 " + f); }
}

/* ============ 4. 版本同步 ============ */
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '20261030d-nohupu';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html2 = fs.readFileSync(root + "index.html", "utf8");
html2 = html2.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=20261030d-nohupu");
fs.writeFileSync(root + "index.html", html2, "utf8");
console.log("\n版本 → 20261030d-nohupu（glue 驱动 cba-startup.js?v= 同步更新）");
