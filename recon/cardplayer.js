// cardplayer.js — cardPlayer_ 定义 + 位置/得分组合渲染
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let i = js.indexOf("function cardPlayer_");
if (i < 0) i = js.indexOf("cardPlayer_=");
console.log("cardPlayer_: " + js.slice(i, i + 700).replace(/\s+/g, " "));
// 搜 "前锋" 在渲染上下文（260000 之后，排除 feed）
s2 = 0; n = 0;
let s = 400000;
while ((i = js.indexOf("前锋", s)) >= 0 && n < 10) {
  s = i + 1;
  const ctx = js.slice(Math.max(0, i - 150), i + 100).replace(/\s+/g, " ");
  if (/children|jsx|`|label|caption/.test(ctx)) {
    console.log("\n--- 前锋 @" + i + " ---");
    console.log(ctx.slice(0, 240));
    n++;
  }
}
