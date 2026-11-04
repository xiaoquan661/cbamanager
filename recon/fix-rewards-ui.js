// fix-rewards-ui.js — 移除快照提示小字；修正金币页广告按钮渐变
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
const call = "\n    installFrozenNotice();";
const n = glue.split(call).length - 1;
if (n === 1) {
  glue = glue.replace(call, "");
  fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
  console.log("✓ 已移除 installFrozenNotice() 调用");
} else {
  console.log("installFrozenNotice 调用匹配数:", n);
}
try { new Function(glue); console.log("✓ glue 语法 OK"); } catch (e) { console.log("✗ glue:", e.message); process.exit(1); }

let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const MARK = "/* rewards-fix: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-app .cba-rewards-page .cba-reward-watch{background:linear-gradient(110deg,#a3e635,#83bb1b)!important;color:#111827!important;border:0!important;font-weight:700!important;text-shadow:none!important}
.fantasy-app .cba-rewards-page .cba-reward-watch:disabled{opacity:.45!important}
.fantasy-app .page-rewards .fantasy-back{display:none!important}
`;
  fs.writeFileSync(root + "cba-startup.css", css, "utf8");
  console.log("✓ 金币页按钮样式已修正");
}
