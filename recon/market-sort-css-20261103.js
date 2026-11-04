const fs=require("fs");
const p="cba-startup.css";
let css=fs.readFileSync(p,"utf8");
const MARK="/* market-sort-4col: 20261103 */";
if(!css.includes(MARK)){
  css += "\n"+MARK+`
.fantasy-market .fantasy-sort{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important;align-items:center!important}
.fantasy-market .fantasy-sort button{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:3px!important;padding:6px 2px!important;line-height:1.2!important}
.fantasy-market .cba-sort-arrow{font-size:11px;line-height:1;font-weight:700;color:inherit;opacity:.95}
`;
  fs.writeFileSync(p,css,"utf8");
}
console.log("css bytes",fs.statSync(p).size);
