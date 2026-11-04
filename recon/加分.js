// jiafen.js — 找"加分"徽章渲染（定位比赛中的阵容卡）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
let s = 0, i, n = 0;
while ((i = js.indexOf("加分", s)) >= 0 && n < 8) {
  s = i + 1;
  if (i > 140000 && i < 400000) continue;
  console.log("--- @" + i + " ---");
  console.log(js.slice(Math.max(0, i - 350), i + 200).replace(/\s+/g, " ").slice(0, 500) + "\n");
  n++;
}
