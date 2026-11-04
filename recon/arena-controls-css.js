// arena-controls-css.js — 结算页底部按钮布局
const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const rules = css.match(/\.arena-controls[^{,]*\{[^}]*\}/g) || [];
console.log(rules.join("\n").slice(0, 1500));
const btn = css.match(/\.arena-controls [^{]*button[^{,]*\{[^}]*\}/g) || [];
console.log("\n-- 按钮 --\n" + btn.join("\n").slice(0, 1200));
const full = css.match(/\.button\.full[^{,]*\{[^}]*\}|\.button\.gold[^{,]*\{[^}]*\}|\.button\.secondary[^{,]*\{[^}]*\}/g) || [];
console.log("\n-- button 变体 --\n" + full.join("\n").slice(0, 800));