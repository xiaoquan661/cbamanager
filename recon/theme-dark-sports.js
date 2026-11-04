// theme-dark-sports.js — 深色体育竞技风改版（设计规范版）
// 基础：#090D16 页面底 / #111827 一级卡 / #1B2535 二级卡 / #263244 分割线
// 文字：#F8FAFC 主 / #94A3B8 次；强调：荧光绿 #A3E635 / 篮球橙 #F97316 / 科技蓝 #38BDF8
// 规则（基于原始深色 navy+金 主题重映射）：
//   近白文字(L≥0.85) → #F8FAFC 系（保留轻微冷调）
//   金色带(H30-60,S≥0.45) → 荧光绿体系（L≥0.6→#A3E635，0.4-0.6→深绿）
//   绿色带(H90-160,S≥0.3) → #22C55E 成功系；青蓝带(H180-210,S≥0.5) → #38BDF8
//   暗底(L<0.35) → 新深色三档（保留轻微色相）；中间带 → 次级灰蓝
//   纯黑(L=0) 保留（阴影/遮罩）；紫色降饱和
const fs = require("fs");

function hexToRgb(h) {
  let s = h.replace("#", "");
  if (s.length === 3 || s.length === 4) s = [...s.slice(0, 3)].map(c => c + c).join("") + (s.length === 4 ? s[3].repeat(2) : "");
  if (s.length === 6) s += "ff";
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16), parseInt(s.slice(6, 8), 16)];
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return [h, s, l];
}
function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = t => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [Math.round(f(h + 1 / 3) * 255), Math.round(f(h) * 255), Math.round(f(h - 1 / 3) * 255)];
}

function transformRgba(r, g, b, a) {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (l === 0) return null; // 纯黑保留
  let ns = s, nl = l, nh = h;
  if (l >= 0.85) {                 // 近白文字 → #F8FAFC 系
    ns = Math.min(s, 0.12); nl = 0.965;
  } else if (h >= 30 && h <= 60 && s >= 0.45 && l >= 0.4) { // 金色带 → 荧光绿体系
    nh = 81; ns = 0.75; nl = l >= 0.6 ? 0.55 : 0.42;
  } else if (h > 90 && h < 160 && s >= 0.3) {                // 绿色带 → #22C55E 系
    nh = 142; ns = 0.6;
  } else if (h >= 180 && h <= 210 && s >= 0.5) {             // 青蓝带 → #38BDF8 系
    nh = 199; ns = 0.75;
  } else if (l < 0.35) {           // 暗底 → 新深色三档
    ns = s * 0.5;
    nl = l < 0.08 ? 0.05 : (l < 0.13 ? 0.105 : 0.155);
  } else if (l <= 0.68) {          // 中间带 → 次级灰蓝（#263244/#94A3B8 家族）
    ns = s * 0.25;
  } else {                         // 0.68-0.85 浅字/强调 → 提亮微调
    ns = Math.min(s, 0.25); nl = 0.9;
  }
  if (h >= 250 && h < 320 && l < 0.85) ns = Math.min(ns, 0.35); // 紫色降饱和
  const [nr, ng, nb] = hslToRgb(nh, ns, nl);
  return [nr, ng, nb, a];
}

function transformHexToken(token) {
  const hex = token.slice(1).toLowerCase();
  const [r, g, b, a] = hexToRgb(hex);
  const t = transformRgba(r, g, b, a / 255);
  if (!t) return token;
  const to2 = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  let out = "#" + to2(t[0]) + to2(t[1]) + to2(t[2]);
  if (hex.length === 4 || hex.length === 8) out += to2(t[3] * 255);
  return out;
}

const colorMap = new Map();
function mapColor(token) {
  const key = token.toLowerCase();
  if (!colorMap.has(key)) colorMap.set(key, transformHexToken(key));
  return colorMap.get(key);
}

function processText(raw, label) {
  let count = 0;
  let out = raw.replace(/#[0-9a-fA-F]{3,8}\b/g, (m, off, s) => {
    const next = s[off + m.length];
    if (next === "-" || /^cba/i.test(m.slice(1))) return m;
    count++;
    return mapColor(m);
  });
  out = out.replace(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,[^)]*)?\)/g, m => {
    const nums = m.match(/\d+(\.\d+)?/g).map(Number);
    const t = transformRgba(nums[0], nums[1], nums[2], nums.length > 3 ? nums[3] : 1);
    if (!t) return m;
    count++;
    const a = nums.length > 3 ? nums[3] : null;
    return a == null ? `rgb(${t[0]},${t[1]},${t[2]})` : `rgba(${t[0]},${t[1]},${t[2]},${a})`;
  });
  console.log(`${label}: 替换 ${count} 处颜色`);
  return out;
}

// ---- 1. 主样式表 ----
const cssPath = "C:/10.19源码/签下整个CBA/cba-startup.css";
let css = fs.readFileSync(cssPath, "utf8");
css = processText(css, "cba-startup.css");
// 字体栈：补 Noto Sans SC
css = css.split('font-family:Microsoft YaHei,PingFang SC,').join('font-family:"Noto Sans SC",Microsoft YaHei,PingFang SC,');
css = css.split('font-family:Microsoft YaHei,sans-serif').join('font-family:"Noto Sans SC",Microsoft YaHei,sans-serif');
css = css.split('font-family:Arial,sans-serif').join('font-family:Inter,"Noto Sans SC",Arial,"PingFang SC","Microsoft YaHei",sans-serif');
fs.writeFileSync(cssPath, css, "utf8");

// ---- 2. index.html（<style> 块 + theme-color + 标题修正 + 字体栈）----
const htmlPath = "C:/10.19源码/签下整个CBA/index.html";
let html = fs.readFileSync(htmlPath, "utf8");
html = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (m, open, body, close) => open + processText(body, "index.html<style>") + close);
html = html.replace(/(<meta name="theme-color" content=")([^"]+)(")/, (m, a, c, z) => {
  const nc = mapColor(c);
  console.log("theme-color: " + c + " → " + nc);
  return a + nc + z;
});
html = html.split('<h1 class="cba-boot-title">CBA梦幻经理</h1>').join('<h1 class="cba-boot-title">签下整个CBA</h1>');
html = html.split('"title":"CBA梦幻经理"').join('"title":"签下整个CBA"');
html = html.split('"shareTitle":"CBA梦幻经理"').join('"shareTitle":"签下整个CBA"');
html = html.split('font-family:Arial,"PingFang SC","Microsoft YaHei",sans-serif').join('font-family:Inter,"Noto Sans SC",Arial,"PingFang SC","Microsoft YaHei",sans-serif');
fs.writeFileSync(htmlPath, html, "utf8");

// ---- 3. JS 内联样式颜色 ----
for (const p of [
  "C:/10.19源码/签下整个CBA/assets/lamps/cba-lamps-glue.js",
  "C:/10.19源码/签下整个CBA/assets/lamps/cba-daily-tasks.js",
  "C:/10.19源码/签下整个CBA/cba-startup.js",
]) {
  let js = fs.readFileSync(p, "utf8");
  js = processText(js, p.split("/").pop());
  fs.writeFileSync(p, js, "utf8");
}

// ---- 4. 版本号同步 ----
const THEME = "20261030b-dark-sports";
let glue = fs.readFileSync("C:/10.19源码/签下整个CBA/assets/lamps/cba-lamps-glue.js", "utf8");
glue = glue.replace(/var VERSION = '[^']+';/, "var VERSION = '" + THEME + "';");
fs.writeFileSync("C:/10.19源码/签下整个CBA/assets/lamps/cba-lamps-glue.js", glue, "utf8");

let html2 = fs.readFileSync(htmlPath, "utf8");
html2 = html2.replace(/cba-startup\.css\?v=[^"']+/, "cba-startup.css?v=" + THEME);
html2 = html2.replace(/cba-launch\.js\?v=[^"']+/, "cba-launch.js?v=" + THEME);
html2 = html2.replace(/cba-lamps-glue\.js\?v=[^"']+/, "cba-lamps-glue.js?v=" + THEME);
html2 = html2.replace(/cba-daily-tasks\.js\?v=\d+/, "cba-daily-tasks.js?v=8");
fs.writeFileSync(htmlPath, html2, "utf8");

console.log("\n版本 → " + THEME);
let n = 0;
for (const [k, v] of colorMap) { if (n++ < 16) console.log("  " + k + " → " + v); }
