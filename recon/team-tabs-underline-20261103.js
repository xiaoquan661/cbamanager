const fs=require("fs");const p="cba-startup.css";let css=fs.readFileSync(p,"utf8");
const MARK="/* team-tabs-underline: 20261103 */";
if(!css.includes(MARK)){css += "\n"+MARK+`
.fantasy-app .team-tabs{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:3px!important;border-bottom:1px solid #263244!important;padding:0 0 8px!important;margin-top:4px!important}
.fantasy-app .team-tabs button{background:transparent!important;color:#94a3b8!important;border:0!important;border-bottom:2px solid transparent!important;border-radius:0!important;box-shadow:none!important;min-height:40px!important;font-size:13px!important;font-weight:700!important;padding:1px 6px!important}
.fantasy-app .team-tabs button.active{color:#a3e635!important;border-bottom-color:#a3e635!important;background:linear-gradient(transparent,#a3e6350c)!important}
`;
fs.writeFileSync(p,css,"utf8");}
console.log("css bytes",fs.statSync(p).size);
