// 球员详情：签约操作条固定在屏幕底部，内容区可滚动，按钮始终可点
const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-startup.css";
let css = fs.readFileSync(p, "utf8");
const MARK = "/* pd-fixed-actions: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.fantasy-player-screen .pd-trade-actions{
  position:fixed!important;left:50%!important;right:auto!important;
  transform:translateX(-50%)!important;bottom:0!important;
  width:min(100%,480px)!important;max-width:100%!important;z-index:12050!important;
  margin:0!important;padding:10px 14px calc(10px + env(safe-area-inset-bottom))!important;
  background:#111827!important;border-top:1px solid #263244!important;
  box-shadow:0 -12px 28px #00000066!important;
}
.fantasy-player-screen .pd-trade-actions .fantasy-confirm-price{
  margin:0 0 8px!important;padding:0!important;border-top:0!important;
}
.fantasy-player-screen .pd-trade-actions .fantasy-actions{
  margin:0!important;
}
.fantasy-player-screen .pd-body{
  padding-bottom:calc(176px + env(safe-area-inset-bottom))!important;
}
.fantasy-player-screen .pd-body::-webkit-scrollbar{display:none}
@media (max-height:600px){
  .fantasy-player-screen .pd-trade-actions{padding-top:8px!important}
  .fantasy-player-screen .pd-body{padding-bottom:calc(158px + env(safe-area-inset-bottom))!important}
}
`;
  fs.writeFileSync(p, css, "utf8");
}
console.log("css bytes", fs.statSync(p).size);