const fs = require("fs");
const p = "C:/10.19源码/签下整个CBA/cba-launch.js";
let js = fs.readFileSync(p, "utf8");
console.log("CRLF:", js.includes("\r\n"));
const re = /    const imageList=document\.getElementById\('cba-boot-images'\);[\s\S]*?\r?\n    \}\r?\n/;
console.log("match:", re.test(js));
js = js.replace(re, "    // 首屏大图不预载：它们会在主界面渲染时按需加载，避免和游戏 bundle 抢带宽。\r\n");
js = js.replace(
  "const hint=document.createElement('link');hint.rel='preload';hint.as='script';hint.href=item.url;",
  "const hint=document.createElement('link');hint.rel='preload';hint.as='script';hint.href=item.url;hint.fetchPriority='high';"
);
const oldL = "    label.textContent=done?'准备完成':!entryAllowed?'正在连接球馆':bytes<total?'正在准备球队资源':'正在进入主界面';";
console.log("label match:", js.includes(oldL));
js = js.replace(
  oldL,
  "    fill.classList.toggle('cba-boot-shimmer',!done&&value>=90);\r\n    label.textContent=done?'准备完成':!entryAllowed?'正在连接球馆':bytes<total?'正在准备球队资源':'正在加载球队数据';"
);
fs.writeFileSync(p, js, "utf8");
new Function(js);
console.log("OK imagePreloadLeft:", js.includes("cba-boot-images"), "| shimmer:", js.includes("cba-boot-shimmer"), "| high:", js.includes("fetchPriority='high'"));