const fs=require("fs");const p="cba-startup.js";let s=fs.readFileSync(p,"utf8");
const oldText="renderCard:e=>(0,D.jsx)(Ey,{p:e,small:!0,showAbility:!0}),onStart:()=>{N.hide();setDismissedArena(null);e.pendingMatch?pe(e.pendingMatch):F({type:`beginMatch`})}";
const newText="renderCard:e=>(0,D.jsx)(Ey,{p:e,small:!0,showAbility:!0,onClick:()=>u({p:Q(e.id)||e})}),onStart:()=>{N.hide();setDismissedArena(null);e.pendingMatch?pe(e.pendingMatch):F({type:`beginMatch`})}";
const c=s.split(oldText).length-1;if(c!==1){console.error("MATCH",c);process.exit(1);}s=s.split(oldText).join(newText);
fs.writeFileSync(p,s,"utf8");console.log("ok",fs.statSync(p).size);
