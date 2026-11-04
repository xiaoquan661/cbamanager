// ux-audit-1.js — 四个流程的交互实现定位（商店/预测）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");

function find(label, marks, max) {
  console.log("\n######## " + label + " ########");
  for (const m of marks) {
    let i = js.indexOf(m), n = 0;
    console.log("\n== " + m + " x" + (js.split(m).length - 1) + " ==");
    while (i >= 0 && n < (max || 2)) {
      console.log("--- @" + i + " ---");
      console.log(js.slice(Math.max(0, i - 150), i + 320).replace(/\s+/g, " ").slice(0, 420));
      i = js.indexOf(m, i + 1); n++;
    }
  }
}

find("商店 Shop", ["function Shop(", "fantasy-shop", "shop-flip", "flip-card", "revealed"]);
find("预测 Predictions", ["function Predictions(", "prediction-card", "提交预测", "placePrediction"]);