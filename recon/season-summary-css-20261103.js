const fs=require("fs");const p="cba-startup.css";let css=fs.readFileSync(p,"utf8");
const MARK="/* season-summary: 20261103 */";
if(!css.includes(MARK)){
 css += "\n"+MARK+`
.arena-season-summary{margin:0 0 14px;padding:14px 15px;border:1px solid #a3e635;border-radius:10px;background:linear-gradient(135deg,#111827,#1b2535);color:#f8fafc;box-shadow:inset 0 0 0 1px #a3e63514}
.arena-season-summary h3{margin:0 0 7px;color:#a3e635;font-size:15px;letter-spacing:.04em}
.arena-season-summary p{margin:0 0 8px;font-size:12px;line-height:1.6;color:#f8fafc}
.arena-season-summary .season-record{font-size:21px;font-weight:800;color:#f8fafc;line-height:1.3}
.arena-season-summary .season-rewards{display:flex;flex-wrap:wrap;gap:8px}
.arena-season-summary .season-rewards span{display:inline-flex;align-items:center;gap:5px;padding:6px 10px;border-radius:999px;border:1px solid #a3e6355c;background:#a3e63514;color:#a3e635;font-size:12px;font-weight:700}
.arena-season-summary .season-rewards svg{width:14px;height:14px}
`;
 fs.writeFileSync(p,css,"utf8");
}
console.log("css bytes",fs.statSync(p).size);
