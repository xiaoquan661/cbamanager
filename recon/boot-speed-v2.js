const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";
let js = fs.readFileSync(root + "cba-launch.js", "utf8");

const re = /    const imageList=document\.getElementById\('cba-boot-images'\);[\s\S]*?\n    \}\n/;
if (!re.test(js)) { console.log("✗ 图片预载代码未匹配"); process.exit(1); }
js = js.replace(re, "    // 首屏大图不预载：它们会在主界面渲染时按需加载，避免和游戏 bundle 抢带宽。\n");
js = js.replace("const hint=document.createElement('link');hint.rel='preload';hint.as='script';hint.href=item.url;", "const hint=document.createElement('link');hint.rel='preload';hint.as='script';hint.href=item.url;hint.fetchPriority='high';");
const oldLabel = "    label.textContent=done?'准备完成':!entryAllowed?'正在连接球馆':bytes<total?'正在准备球队资源':'正在进入主界面';";
if (!js.includes(oldLabel)) { console.log("✗ 进度文案未匹配"); process.exit(1); }
js = js.replace(oldLabel, "    fill.classList.toggle('cba-boot-shimmer',!done&&value>=90);\n    label.textContent=done?'准备完成':!entryAllowed?'正在连接球馆':bytes<total?'正在准备球队资源':'正在加载球队数据';");
fs.writeFileSync(root + "cba-launch.js", js, "utf8");
try { new Function(js); console.log("✓ cba-launch.js 语法 OK"); } catch (e) { console.log("✗", e.message); process.exit(1); }
console.log("image preload left:", js.includes("cba-boot-images"));
console.log("shimmer:", js.includes("cba-boot-shimmer"), "| high:", js.includes("fetchPriority='high'"));