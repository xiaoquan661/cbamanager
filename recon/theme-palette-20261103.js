// theme-palette-20261103.js — 按参考色板重映射全站颜色
// #080E18 页面底 / #14263B 卡片 / #E5A33B 主强调 / #DCE5EF 主文字 / #F36B32 次强调
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

const PAL = {
  bg: "#080e18",
  surface: "#14263b",
  surface2: "#1a2f49",
  line: "#2a405c",
  gold: "#e5a33b",
  goldBright: "#f0b85a",
  orange: "#f36b32",
  text: "#dce5ef",
  muted: "#93a7be",
  blue: "#7893ad",
  success: "#4fae7a",
  danger: "#f36b32",
};

// 旧关键色精确映射
const EXACT = {
  "#0a0d10": PAL.bg, "#080e18": PAL.bg,
  "#111827": PAL.surface, "#14263b": PAL.surface,
  "#151b20": PAL.surface, "#151b21": PAL.surface, "#161b20": PAL.surface, "#161b1f": PAL.surface,
  "#1b2535": PAL.surface2, "#20282f": PAL.surface2, "#20292f": PAL.surface2,
  "#263244": PAL.line, "#23282c": PAL.line,
  "#a6e236": PAL.gold, "#a3e635": PAL.gold, "#83bb1b": "#c98a2e",
  "#f97316": PAL.orange,
  "#f5f6f7": PAL.text, "#f7f7f5": PAL.text, "#f8fafc": PAL.text, "#dfe4ec": PAL.text,
  "#a5a9ac": PAL.muted, "#94a3b8": PAL.muted, "#828387": PAL.muted,
  "#38bdf8": PAL.blue, "#71c4eb": PAL.blue, "#45b2e4": PAL.blue,
  "#22c55e": PAL.success, "#61d88d": PAL.success, "#238b49": PAL.success,
  "#ef4444": PAL.danger, "#f59e0b": PAL.gold,
};

function hexToRgb(h) {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (mx === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return [h, s, l];
}
function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = v => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return "#" + to(r) + to(g) + to(b);
}

const cache = {};
function mapOne(hex) {
  const key = hex.toLowerCase();
  if (cache[key]) return cache[key];
  if (EXACT[key]) return (cache[key] = EXACT[key]);
  const [r, g, b] = hexToRgb(key);
  const [h, s, l] = rgbToHsl(r, g, b);
  let out;
  if (s < 0.12) {
    if (l > 0.86) out = PAL.text;
    else if (l > 0.55) out = PAL.muted;
    else if (l > 0.30) out = "#4a5f77";
    else if (l > 0.17) out = PAL.surface2;
    else if (l > 0.09) out = PAL.surface;
    else out = PAL.bg;
  } else if (h >= 55 && h <= 115) {
    out = l < 0.22 ? PAL.surface : hslToHex(35, Math.max(0.62, s), l);
  } else if (h > 115 && h <= 170) {
    out = l < 0.22 ? PAL.surface : hslToHex(150, 0.42, Math.max(0.38, Math.min(0.72, l)));
  } else if (h > 170 && h < 200) {
    out = l < 0.22 ? PAL.surface : hslToHex(200, 0.30, l);
  } else if (h >= 200 && h <= 255) {
    out = l < 0.22 ? PAL.surface : hslToHex(210, 0.28, l);
  } else if (h > 340 || h < 15) {
    out = l < 0.22 ? PAL.surface : hslToHex(10, 0.55, l);
  } else {
    out = l < 0.22 ? PAL.surface : hslToHex(18, 0.78, l);
  }
  return (cache[key] = out);
}

function mapText(text) {
  // 只匹配 6/8 位色值；3 位会误伤 #cba-rankboard 这类 ID 选择器
  return text.replace(/#([0-9a-f]{6})([0-9a-f]{2})?\b/gi, (m, body, alpha) => {
    const mapped = mapOne("#" + body.toLowerCase());
    return alpha ? mapped + alpha.toLowerCase() : mapped;
  });
}

// 1) CSS 全量映射
let css = fs.readFileSync(root + "cba-startup.css", "utf8");
const cssBefore = (css.match(/#[0-9a-f]{3,8}\b/gi) || []).length;
css = mapText(css);
// 主题变量显式覆盖
css = css.replace(/--theme-bg:[^;]+;/, "--theme-bg:" + PAL.bg + ";");
css = css.replace(/--theme-panel:[^;]+;/, "--theme-panel:" + PAL.surface + ";");
css = css.replace(/--theme-panel-2:[^;]+;/, "--theme-panel-2:" + PAL.surface2 + ";");
css = css.replace(/--theme-line:[^;]+;/, "--theme-line:" + PAL.line + ";");
css = css.replace(/--theme-gold:[^;]+;/, "--theme-gold:" + PAL.gold + ";");
css = css.replace(/--theme-gold-bright:[^;]+;/, "--theme-gold-bright:" + PAL.goldBright + ";");
css = css.replace(/--theme-text:[^;]+;/, "--theme-text:" + PAL.text + ";");
css = css.replace(/--theme-muted:[^;]+;/, "--theme-muted:" + PAL.muted + ";");
css = css.replace(/--theme-blue:[^;]+;/, "--theme-blue:" + PAL.blue + ";");
fs.writeFileSync(root + "cba-startup.css", css, "utf8");
console.log("CSS 颜色:", cssBefore, "→ 已重映射, 大小", Buffer.byteLength(css, "utf8"));

// 2) bundle 只改 UI 强调色（不动卡牌稀有度数据）
let js = fs.readFileSync(root + "cba-startup.js", "utf8");
js = js.split("#a6e236").join(PAL.gold).split("#A6E236").join(PAL.gold.toUpperCase());
js = js.split("#83bb1b").join("#c98a2e").split("#83BB1B").join("#C98A2E");
fs.writeFileSync(root + "cba-startup.js", js, "utf8");
console.log("JS 强调色已替换");

// 3) glue 内联面板
let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = mapText(glue);
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");
console.log("glue 内联色已映射");

// 4) index 启动页
let html = fs.readFileSync(root + "index.html", "utf8");
html = mapText(html);
fs.writeFileSync(root + "index.html", html, "utf8");
console.log("index 启动页色已映射");

// 校验
console.log("残留 #a6e236:", (css.match(/#a6e236/gi) || []).length);
