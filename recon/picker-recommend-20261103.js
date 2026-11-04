const fs=require("fs");
const p="cba-startup.js";
let s=fs.readFileSync(p,"utf8");
const oldText="children:e.cards.filter(t=>!ov(e,t.uid)).length?(0,D.jsx)(`div`,{className:`card-grid three`,children:e.cards.filter(t=>!ov(e,t.uid)).map(t=>(0,D.jsx)(Ey,{p:cardPlayer_(t),small:!0,badge:e.lineup.includes(t.uid)?`首发`:void 0,onClick:()=>Ae(t)},t.uid))}):(0,D.jsxs)(`div`,{className:`empty-state`";
const newText="children:e.cards.filter(t=>!ov(e,t.uid)).length?(0,D.jsxs)(D.Fragment,{children:[(0,D.jsxs)(`div`,{className:`lineup-recommend`,children:[(0,D.jsx)(`button`,{className:`button gold full`,onClick:()=>{let ids=smartLineup_(e);F({type:`lineup`,ids:ids.filter(Boolean),slots:ids});j(null)},children:`推荐首发`}),(0,D.jsx)(`p`,{className:`fineprint`,children:`按能力与位置自动推荐五人首发。`})]}),(0,D.jsx)(`div`,{className:`card-grid three`,children:e.cards.filter(t=>!ov(e,t.uid)).map(t=>(0,D.jsx)(Ey,{p:cardPlayer_(t),small:!0,captionAbility:!0,badge:e.lineup.includes(t.uid)?`首发`:void 0,onClick:()=>Ae(t)},t.uid))})]}):(0,D.jsxs)(`div`,{className:`empty-state`";
const c=s.split(oldText).length-1;
if(c!==1){console.error("MATCH",c);process.exit(1);}
s=s.split(oldText).join(newText);
fs.writeFileSync(p,s,"utf8");
console.log("ok",fs.statSync(p).size);
