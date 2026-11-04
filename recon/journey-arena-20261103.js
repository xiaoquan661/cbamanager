// 征战入口横幅改用提供的球馆素材（assets/lobby/lobby-arena.jpg）
const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-startup.css";
let css = fs.readFileSync(p, "utf8");
const MARK = "/* journey-arena: 20261103 */";
if (!css.includes(MARK)) {
  css += "\n" + MARK + `
.page-season .journey-start-art{
  background-image:url("assets/lobby/lobby-arena.jpg")!important;
  background-size:cover!important;
  background-position:center 55%!important;
  background-repeat:no-repeat!important;
  opacity:1!important;
  filter:brightness(.82) saturate(1.05)!important;
}
`;
  fs.writeFileSync(p, css, "utf8");
}
console.log("css bytes", fs.statSync(p).size);
