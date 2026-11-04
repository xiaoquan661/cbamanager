// repair-remove.js — 修复注入器误删 + 正确删除注入器和邀请码模块
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-startup.js", "utf8");

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

// 1. 修复被误删的 IIFE 开头
const broken = ";{var SHARE_LABEL=\"虎扑专区发帖\";";
if (js.indexOf(broken) >= 0) {
  js = js.replace(broken, "(function(){var SHARE_LABEL=\"虎扑专区发帖\";");
  console.log("✓ 注入器 IIFE 开头已修复");
} else if (js.indexOf("(function(){var SHARE_LABEL=\"虎扑专区发帖\";") >= 0) {
  console.log("- 注入器开头完好");
} else {
  console.log("✗ 找不到注入器起点，中止");
  process.exit(1);
}
try { new Function(js); console.log("✓ 中间态语法 OK"); } catch (e) { console.log("- 中间态语法仍失败（继续修复 Mv 残留）: " + e.message); }

// 1b. 修复 Mv 残留：误把解构花括号当函数体，留下 ){旧函数体} 残段
{
  const m = js.indexOf("function Mv(");
  if (m < 0) { console.log("✗ 找不到 Mv"); process.exit(1); }
  const ctx = js.slice(m, m + 120).replace(/\s+/g, " ");
  console.log("Mv 现状: " + ctx);
  const nullEnd = js.indexOf("{return null}", m) + "{return null}".length;
  if (js[nullEnd] === ")") {
    // 残段 = ')' + 旧函数体 '{...}'
    const bodyStart = nullEnd + 1;
    if (js[bodyStart] === "{") {
      const bodyEnd = balanceEnd(js, bodyStart);
      console.log("Mv 残段范围: " + nullEnd + " ~ " + bodyEnd + "，残段内容: " + js.slice(nullEnd, Math.min(bodyEnd + 1, nullEnd + 160)).replace(/\s+/g, " ").slice(0, 140));
      js = js.slice(0, nullEnd) + js.slice(bodyEnd + 1);
      console.log("✓ Mv 残段已清除");
    } else { console.log("- Mv 无残段（结构正常）"); }
  } else {
    console.log("- Mv 后无 ')' 残段（结构正常）");
  }
}
try { new Function(js); console.log("✓ 中间态语法 OK"); } catch (e) { console.log("✗ 中间态语法仍失败: " + e.message); process.exit(1); }

// 2. 正确删除注入器（balanceEnd 从 '(' 本身开始）
{
  const s = js.indexOf("(function(){var SHARE_LABEL=\"虎扑专区发帖\";");
  const e = balanceEnd(js, s);
  if (e < 0) { console.log("✗ 配平失败"); process.exit(1); }
  console.log("注入器范围: " + s + " ~ " + e + "（" + (e + 1 - s) + " 字符），结尾后文: " + js.slice(e + 1, e + 60).replace(/\s+/g, " "));
  js = js.slice(0, s) + js.slice(e + 1);
  console.log("✓ 分享按钮注入器已完整删除");
}

// 3. 删除邀请码模块（查实际终点字节）
const startMark = "/* cba-invite-ui.js */";
const s2 = js.indexOf(startMark);
if (s2 < 0) { console.log("✗ 未找到邀请码模块起点"); process.exit(1); }
const expIdx = js.indexOf("CBAInviteUI=", s2);
console.log("CBAInviteUI 导出行附近: " + JSON.stringify(js.slice(expIdx - 10, expIdx + 90)));
// 从导出位置找 })(window); 的精确形式
const winClose = js.indexOf("})(window);", expIdx);
if (winClose < 0) { console.log("✗ 找不到 })(window);"); process.exit(1); }
console.log("模块删除范围: " + s2 + " ~ " + (winClose + 11) + "（" + (winClose + 11 - s2) + " 字符）");
js = js.slice(0, s2) + js.slice(winClose + 11);
console.log("✓ 邀请码模块已删除");

fs.writeFileSync(root + "cba-startup.js", js, "utf8");
try { new Function(js); console.log("✓ cba-startup.js 语法 OK"); }
catch (e) { console.log("✗ 语法失败: " + e.message); process.exit(1); }
console.log("最终大小: " + Math.round(js.length / 1024) + "KB");
