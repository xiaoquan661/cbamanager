const fs=require("fs");const p="cba-startup.js";let s=fs.readFileSync(p,"utf8");
const oldText="e.matchIndex<25&&(0,D.jsxs)(`button`,{type:`button`,className:`arena-rematch`,onClick:()=>onRematch&&onRematch(),children:[`进行下一轮 `,(0,D.jsx)(Z,{})]}),(0,D.jsxs)(`button`,{ref:E,type:`button`,className:`arena-return`,onClick:i,children:[`返回大厅 `,(0,D.jsx)(Z,{})]})";
const newText="(0,D.jsxs)(`button`,{ref:E,type:`button`,className:`arena-return`,onClick:i,children:[`返回大厅 `,(0,D.jsx)(Z,{})]}),e.matchIndex<25&&(0,D.jsxs)(`button`,{type:`button`,className:`arena-rematch`,onClick:()=>onRematch&&onRematch(),children:[`进行下一轮 `,(0,D.jsx)(Z,{})]})";
const c=s.split(oldText).length-1;if(c!==1){console.error("MATCH",c);process.exit(1);}s=s.split(oldText).join(newText);
fs.writeFileSync(p,s,"utf8");console.log("ok",fs.statSync(p).size);
