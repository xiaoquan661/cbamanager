// ux-classes.js — MVP/结算/预测记录相关类名
const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const js = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.js", "utf8");
console.log("== CSS 中 mvp/arena 类 ==");
console.log([...new Set((css.match(/\.(arena|mvp|battle)[a-z-]*/g) || []))].join(", ").slice(0, 1200));
console.log("\n== CSS 中 fantasy-settled / pick-record ==");
console.log([...new Set((css.match(/\.(fantasy-settled|fantasy-pick)[a-z-]*/g) || []))].join(", "));
console.log("\n== JS 中 mvp 容器类名 ==");
let i = js.indexOf("mvp-");
console.log([...new Set((js.match(/mvp-[a-z-]+/g) || []))].join(", "));