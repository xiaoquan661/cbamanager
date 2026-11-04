// remove-relay.js — 移除第三方中继域名、XHR 直连与阵容外传（Lamps 域名门禁整改）
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");

// 1. 删除整个「数据中继」模块（RELAY_URL / DELTA 持久化 / fetchRelay / relayToFeed / installDataRelay）
const startMark = "/* ---------- 数据中继";
const endMark = "/* ---------- 状态角标";
const s = glue.indexOf(startMark);
const e = glue.indexOf(endMark);
if (s < 0 || e < 0 || e < s) { console.log("✗ 中继模块边界失败", s, e); process.exit(1); }
glue = glue.slice(0, s) + glue.slice(e);
console.log("✓ 已移除数据中继模块（" + (e - s) + " 字符）");

// 2. 删除 boot 中的 installDataRelay() 调用
if (glue.indexOf("    installDataRelay();\n") >= 0) {
  glue = glue.replace("    installDataRelay();\n", "");
  console.log("✓ 已移除 boot 中的 installDataRelay 调用");
} else if (glue.indexOf("installDataRelay();") >= 0) {
  glue = glue.replace(/[ \t]*installDataRelay\(\);\r?\n/, "");
  console.log("✓ 已移除 installDataRelay 调用（正则）");
} else { console.log("- installDataRelay 调用不存在"); }

// 3. bootSquadShare 不再传中继地址
glue = glue.replace("global.CBASquadShare.init(RELAY_URL);", "global.CBASquadShare.init();");
glue = glue.replace("// 引擎 P_ 初始化时机早于池就绪，注入钩子在每次选对手时惰性求值（I_ 已补丁）",
  "// 引擎 P_ 初始化时机早于池就绪，注入钩子在每次选对手时惰性求值（I_ 已补丁）；\n      // 对手池仅来自 Lamps 榜单 dataLoad，无第三方请求");

// 4. 顶部注释同步
glue = glue.replace(" *   1. 预载 Lamps 云存档", " *   0. 本文件不发起任何第三方域名请求（Lamps 域名门禁合规）\n *   1. 预载 Lamps 云存档");

fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (err) { console.log("✗ 语法失败: " + err.message); process.exit(1); }

// 5. 残留检查
for (const pat of ["RELAY_URL", "tencentscf", "XMLHttpRequest", "fetchRelay", "installDataRelay", "xhr", "new XMLHttpRequest"]) {
  let c = 0, i = 0;
  while ((i = glue.indexOf(pat, i)) >= 0) { c++; i++; }
  console.log((c ? "✗ 残留 " : "- 无 ") + pat + (c ? " x" + c : ""));
}
const squad = fs.readFileSync(root + "assets/lamps/cba-squad-share-r29.js", "utf8");
for (const pat of ["tencentscf", "XMLHttpRequest", "relayFetch", "/cba/lineup", "fetch("]) {
  const c = squad.split(pat).length - 1;
  console.log((c ? "✗ squad 残留 " : "- squad 无 ") + pat + (c ? " x" + c : ""));
}

// 6. 版本
const VER = "20261030m-domain-compliant";
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '" + VER + "';");
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
let html = fs.readFileSync(root + "index.html", "utf8");
html = html.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=" + VER);
html = html.replace(/cba-squad-share-r29\.js\?v=\d+/, "cba-squad-share-r29.js?v=3");
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("版本 → " + VER + "，squad-share → v=3");