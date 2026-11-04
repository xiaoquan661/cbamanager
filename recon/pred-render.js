// pred-render.js — 预测页渲染尾部（记录列表/确认弹窗/按钮）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
console.log(js.slice(2225600, 2231200).replace(/\s+/g, " "));