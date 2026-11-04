// fenshu.js — 找 "X分" 分数+位置的组合渲染（比赛阵容卡）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const pats = ["}分`", "} 分`", "`分`", "分`}", "position,"];
for (const p of pats) {
  let s = 0, i, n = 0;
  while ((i = js.indexOf(p, s)) >= 0 && n < 6) {
    s = i + 1;
    if (i > 140000 && i < 400000) continue;
    const ctx = js.slice(Math.max(0, i - 220), i + 80).replace(/\s+/g, " ");
    if (/position|iy\(|POS|slot/.test(ctx)) {
      console.log("--- '" + p + "' @" + i + " ---");
      console.log(ctx.slice(0, 280) + "\n");
      n++;
    }
  }
}
// 也直接搜 position 与 分 同现的模板串
for (const m of js.matchAll(/[\w.]+\.position[\s\S]{0,120}?分/g)) {
  const i = m.index;
  if (i > 140000 && i < 400000) continue;
  console.log("--- 组合 @" + i + " ---");
  console.log(js.slice(Math.max(0, i - 150), i + 150).replace(/\s+/g, " ").slice(0, 280) + "\n");
}
