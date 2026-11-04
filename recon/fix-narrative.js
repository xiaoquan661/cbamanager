// fix-narrative.js — 修复逗号链内的 let 插入错误（改为内联 IIFE）
const fs = require("fs");
const f = "C:/10.19源码/签下整个CBA/cba-startup.js";
let raw = fs.readFileSync(f, "utf8");

// 1) 移除误插的 let 语句段
const letStart = raw.indexOf("let fv0=");
const letEndMark = ";n.result=";
if (letStart < 0) { console.log("未找到 let fv0（可能已修）"); }
else {
  const letEnd = raw.indexOf(letEndMark, letStart);
  if (letEnd < 0) { console.log("找不到 n.result= 终点"); process.exit(1); }
  raw = raw.slice(0, letStart) + raw.slice(letEnd + 1); // 删 let 段（含分号），保留 n.result=
  console.log("let 段已移除");
}

// 2) message 内内联 IIFE 提供叙事
const oOld = "胜方 MVP：${r.mvp.name}。${o}${fv?` `+fv:``}`";
const oNew = "胜方 MVP：${r.mvp.name}。${o}${(()=>{let f0=[`这支球队正在书写自己的赛季。`,`胜利正在成为习惯。`,`一场一场，把目标踩在脚下。`,`每一次攻防都算数。`],f1=[`失利会留下注脚，下一场由自己改写。`,`调整，再战，赛季还长。`,`低谷不会定义整段征程。`,`把这场记下来，下次讨回来。`];return (i?f0:f1)[Math.floor(J_(n)*(i?f0:f1).length)]||``})()}`";
if (raw.indexOf(oOld) < 0) { console.log("未找到 message 模板锚点"); process.exit(1); }
raw = raw.replace(oOld, oNew);
console.log("内联 IIFE 已注入");

fs.writeFileSync(f, raw, "utf8");
try { new Function(raw); console.log("SYNTAX OK"); } catch (e) { console.log("SYNTAX FAIL: " + e.message); }
