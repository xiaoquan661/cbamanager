// 关键修复：.pd-body 被后面的 flex:0 0 auto 覆盖，导致内容按自身高度撑开、
// 在固定高度的详情页里被裁掉且无法滚动。强制它作为可收缩滚动区。
const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-startup.css";
let css = fs.readFileSync(p, "utf8");
const MARK = "/* pd-scroll-fix: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-player-screen .pd-detail{height:100%!important;max-height:100%!important;min-height:0!important;overflow:hidden!important}
.fantasy-player-screen .pd-body{
  flex:1 1 0!important;height:auto!important;max-height:none!important;
  min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;
  -webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;
  padding-bottom:calc(176px + env(safe-area-inset-bottom))!important;
}
`;
  fs.writeFileSync(p, css, "utf8");
}
console.log("css bytes", fs.statSync(p).size);