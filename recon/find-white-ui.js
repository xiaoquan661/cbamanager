const fs = require("fs");
const css = fs.readFileSync("C:/10.19源码/签下整个CBA/cba-startup.css", "utf8");
const re = /([^{}]{1,120})\{([^{}]{0,300}(?:border-radius:50%|border-radius:999px)[^{}]{0,300})\}/g;
let m, n = 0;
while ((m = re.exec(css)) && n < 60) {
  const sel = m[1].replace(/\s+/g, " ").trim();
  const body = m[2];
  if (/background[^;]*(#f8fafc|#fff|#ffffff|248,250,252|255,255,255)/i.test(body)) {
    console.log("CIRCLE:", sel, "=>", body.replace(/\s+/g, " ").slice(0, 220));
    n++;
  }
}
console.log("matches:", n);
for (const key of [".pd-chart", "salary-tip", "chart-tip", "pd-tip", "pd-point", "tooltip"]) {
  let i = -1, c = 0;
  while ((i = css.indexOf(key, i + 1)) >= 0 && c < 4) {
    console.log("\n" + key + " @" + i + ": " + css.slice(Math.max(0, i - 120), i + 260).replace(/\s+/g, " "));
    c++;
  }
}
