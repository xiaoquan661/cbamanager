// ux-audit-5.js — 动效基建盘点（keyframes + 翻牌/揭示/按压）与预测组件交互
const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const kfs = css.match(/@keyframes [a-zA-Z0-9_-]+/g) || [];
console.log("keyframes 共 " + kfs.length + " 个:");
console.log([...new Set(kfs)].join(", "));
console.log("\n-- fantasy-flip --");
console.log((css.match(/\.fantasy-flip[^{]*\{[^}]*\}/g) || []).join("\n").slice(0, 2200));
console.log("\n-- fresh-reveal --");
console.log((css.match(/[^{}]*fresh[^{]*\{[^}]*\}/g) || []).join("\n").slice(0, 800));
console.log("\n-- :active 按压 --");
const act = css.match(/:active[^{]*\{[^}]*\}/g) || [];
console.log(act.slice(0, 6).join("\n").slice(0, 900));
console.log("\n-- transition 数量: " + (css.match(/transition:/g) || []).length + " / animation 数量: " + (css.match(/animation:/g) || []).length);