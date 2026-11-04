// injector-tail.js — 分享注入器 IIFE 结尾定位
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let start = js.indexOf("(function(){var SHARE_LABEL=\"虎扑专区发帖\";");
console.log("注入器起点 @" + start);
// 从起点做大括号/括号配平找到 IIFE 结尾
let depth = 0, end = -1;
for (let i = start; i < js.length; i++) {
  const c = js[i];
  if (c === "{" || c === "(") depth++;
  else if (c === "}" || c === ")") {
    depth--;
    if (depth === 0) { end = i; break; }
  } else if (c === "\"" || c === "'") { // 跳过字符串
    const q = c;
    i++;
    while (i < js.length && js[i] !== q) { if (js[i] === "\\") i++; i++; }
  } else if (c === "`") {
    i++;
    while (i < js.length && js[i] !== "`") { if (js[i] === "\\") i++; i++; }
  }
}
console.log("配平结尾 @" + end);
console.log("结尾后 120 字符: " + js.slice(end, end + 120).replace(/\s+/g, " "));
console.log("结尾前 150 字符: " + js.slice(end - 150, end + 1).replace(/\s+/g, " "));
