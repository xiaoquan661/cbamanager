// dispatch-tail.js — practice dispatch 的结构（未知动作是否落到 engine.reduce）
const fs = require("fs");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
const i = js.indexOf("function dispatch(action)");
// 打印 dispatch 尾部 4000 字符
console.log(js.slice(i + 2000, i + 7000).replace(/\s+/g, " "));