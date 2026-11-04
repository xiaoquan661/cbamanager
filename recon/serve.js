const path = require("path");
const root = path.resolve("C:/10.19源码/签下整个CBA");
const mime = {
  ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf",
};
Bun.serve({
  port: 8791,
  async fetch(req) {
    let p = decodeURIComponent(new URL(req.url).pathname);
    if (p === "/") p = "/index.html";
    const file = path.resolve(root, "." + p);
    if (!file.startsWith(root)) return new Response("forbidden", { status: 403 });
    try {
      const data = await Bun.file(file).arrayBuffer();
      return new Response(data, { headers: { "Content-Type": mime[path.extname(file).toLowerCase()] || "application/octet-stream" } });
    } catch {
      return new Response("not found: " + p, { status: 404 });
    }
  },
});
console.log("serving http://localhost:8765");
