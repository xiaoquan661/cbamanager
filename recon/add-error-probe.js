const fs = require("fs");
const file = "C:/10.19源码/签下整个CBA/index.html";
let html = fs.readFileSync(file, "utf8");
if (html.includes("__CBA_ERRORS__")) { console.log("已有探针"); process.exit(0); }
const probe = `<script>window.__CBA_ERRORS__=[];window.addEventListener("error",function(e){try{window.__CBA_ERRORS__.push({msg:String(e.message).slice(0,400),stack:String(e.error&&e.error.stack||"").slice(0,3000),file:String(e.filename||""),line:e.lineno,col:e.colno})}catch(_){}});window.addEventListener("unhandledrejection",function(e){try{window.__CBA_ERRORS__.push({msg:"REJECTION "+String(e.reason&&e.reason.message||e.reason).slice(0,400),stack:String(e.reason&&e.reason.stack||"").slice(0,3000)})}catch(_){}});window.addEventListener("DOMContentLoaded",function(){var e=document.getElementById("cba-boot-status");});</script>`;
html = html.replace("<head>", "<head>" + probe);
fs.writeFileSync(file, html, "utf8");
console.log("探针已插入");
