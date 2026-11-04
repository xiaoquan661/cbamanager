const fs=require("fs");
const s=fs.readFileSync("cba-startup.js","utf8");
const a=s.indexOf("        tab !== 'mine' && tab !== 'coaches' && h(React.Fragment,null,");
const b=s.indexOf("        h('div', { className: 'fantasy-toolbar' }", a);
console.log("a",a,"b",b,"len",b-a);
console.log(JSON.stringify(s.slice(a,a+200)));
console.log("...TAIL...");
console.log(JSON.stringify(s.slice(b-200,b+60)));
