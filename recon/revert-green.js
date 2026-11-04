// revert-green.js — 从 2026-11-03 藏青/金色板回退到 2026-10-30 绿色竞技板
const fs = require("fs");
const root = "C:/10.19源码/签下整个CBA/";

const EXACT = {
  "#14263b": "#111827", "#1a2f49": "#1b2535", "#2a405c": "#263244", "#080e18": "#090d16",
  "#e5a33b": "#a3e635", "#f0b85a": "#c4f06a", "#c98a2e": "#83bb1b",
  "#f36b32": "#f97316",
  "#dce5ef": "#f8fafc", "#93a7be": "#94a3b8", "#4a5f77": "#64748b", "#7893ad": "#38bdf8",
  "#4fae7a": "#22c55e", "#f9ded2": "#f8fafc", "#f4dcd7": "#f8fafc",
};

function hexToRgb(h) {
  h = h.replace("#", "");
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
  const k = hex.toLowerCase();
  if (cache[k]) return cache[k];
  if (EXACT[k]) return (cache[k] = EXACT[k]);
  const [r, g, b] = hexToRgb(k);
  const [h, s, l] = rgbToHsl(r, g, b);
  let out;
  if (l > 0.88 && s < 0.6) out = "#f8fafc";
  else if (s < 0.1) {
    if (l > 0.86) out = "#f8fafc";
    else if (l > 0.55) out = "#94a3b8";
    else if (l > 0.30) out = "#64748b";
    else if (l > 0.15) out = "#1b2535";
    else out = "#090d16";
  } else if (h >= 20 && h <= 60) {
    out = hslToHex(81, Math.max(0.55, s), l);
  } else if (h > 60 && h <= 115) {
    out = hslToHex(81, Math.max(0.55, s), l);
  } else if (h > 115 && h <= 170) {
    out = hslToHex(142, 0.62, l);
  } else if (h > 170 && h < 195) {
    out = l > 0.5 ? hslToHex(199, 0.85, l) : "#1b2535";
  } else if (h >= 195 && h <= 240) {
    out = l > 0.5 ? hslToHex(199, 0.75, l) : "#1b2535";
  } else {
    out = l > 0.5 ? hslToHex(4, 0.72, l) : "#1b2535";
  }
  return (cache[k] = out);
}

function mapText(t) {
  return t.replace(/#([0-9a-f]{6})([0-9a-f]{2})?\b/gi, (m, body, alpha) => {
    const v = mapOne("#" + body.toLowerCase());
    return alpha ? v + alpha.toLowerCase() : v;
  });
}

let css = fs.readFileSync(root + "cba-startup.css", "utf8");
css = mapText(css);
css = css.replace(/--theme-bg:[^;]+;/, "--theme-bg:#090d16;");
css = css.replace(/--theme-panel:[^;]+;/, "--theme-panel:#111827;");
css = css.replace(/--theme-panel-2:[^;]+;/, "--theme-panel-2:#1b2535;");
css = css.replace(/--theme-line:[^;]+;/, "--theme-line:#263244;");
css = css.replace(/--theme-gold:[^;]+;/, "--theme-gold:#a3e635;");
css = css.replace(/--theme-gold-bright:[^;]+;/, "--theme-gold-bright:#c4f06a;");
css = css.replace(/--theme-text:[^;]+;/, "--theme-text:#f8fafc;");
css = css.replace(/--theme-muted:[^;]+;/, "--theme-muted:#94a3b8;");
css = css.replace(/--theme-blue:[^;]+;/, "--theme-blue:#38bdf8;");
fs.writeFileSync(root + "cba-startup.css", css, "utf8");

let js = fs.readFileSync(root + "cba-startup.js", "utf8");
js = js.split("#e5a33b").join("#a3e635").split("#E5A33B").join("#A3E635");
js = js.split("#c98a2e").join("#83bb1b").split("#C98A2E").join("#83BB1B");
fs.writeFileSync(root + "cba-startup.js", js, "utf8");

let glue = fs.readFileSync(root + "assets/lamps/cba-lamps-glue.js", "utf8");
glue = mapText(glue);
fs.writeFileSync(root + "assets/lamps/cba-lamps-glue.js", glue, "utf8");

let html = fs.readFileSync(root + "index.html", "utf8");
html = mapText(html);
fs.writeFileSync(root + "index.html", html, "utf8");

console.log("已回退绿色主题");
for (const c of ["#a3e635", "#111827", "#1b2535", "#263244", "#090d16", "#f8fafc", "#94a3b8"]) {
  console.log(c, (css.match(new RegExp(c, "gi")) || []).length);
}
