// share-injector.js — 分享按钮注入器边界 + 排行榜海报按钮全文
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
// 注入器模块：找 3362831 前后的 IIFE 边界
let e = js.indexOf("el.className=\"cba-hupu-share\"");
console.log("== 注入器前文 1200 字符 ==");
console.log(js.slice(Math.max(0, e - 1400), e + 100).replace(/\s+/g, " "));
console.log("\n== 注入器后文 900 字符 ==");
console.log(js.slice(e + 100, e + 1000).replace(/\s+/g, " "));
// 排行榜海报按钮
let r = js.indexOf("ranking-poster-action");
console.log("\n== ranking-poster-action 全文 ==");
console.log(js.slice(Math.max(0, r - 300), r + 400).replace(/\s+/g, " "));
