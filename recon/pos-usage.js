// pos-usage.js — p.position / .position 的 JSX 渲染点（排除 feed JSON）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
// feed JSON 区域大概在 165000-325000（player-feed 内嵌），跳过
let s = 0, i, n = 0;
while ((i = js.indexOf(".position", s)) >= 0) {
  s = i + 1;
  if (i > 140000 && i < 400000) continue; // feed JSON 区域
  const ctx = js.slice(Math.max(0, i - 100), i + 120).replace(/\s+/g, " ");
  // 只要渲染相关（children/jsx/模板串）
  if (/children|jsx|`|positionLabel|iy\(|POS/.test(ctx)) {
    console.log("--- @" + i + " ---");
    console.log(ctx.slice(0, 200) + "\n");
    if (++n > 14) break;
  }
}
