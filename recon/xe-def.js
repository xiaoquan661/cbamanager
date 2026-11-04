// xe-def.js — 页面组件里 xe（当前 arena 比赛）的推导
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
// 页面组件中 xe= 定义（在 ay 调用点之前）
let i = js.indexOf("(0,D.jsx)(ay,{match:xe");
const seg = js.slice(i - 6000, i);
const m = seg.lastIndexOf("xe=");
console.log(js.slice(i - 6000 + m - 300, i - 6000 + m + 600).replace(/\s+/g, " "));