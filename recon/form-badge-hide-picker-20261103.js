const fs=require("fs");
const p="cba-startup.css";
let css=fs.readFileSync(p,"utf8");
const MARK="/* form-badge-hide-picker: 20261103 */";
if(!css.includes(MARK)){
  css += "\n"+MARK+`
.sheet-content .fantasy-person-tile .cba-form-badge,
.fantasy-modal .fantasy-person-tile .cba-form-badge,
.bottom-sheet .fantasy-person-tile .cba-form-badge{display:none!important}
`;
  fs.writeFileSync(p,css,"utf8");
}
console.log("css bytes",fs.statSync(p).size);
