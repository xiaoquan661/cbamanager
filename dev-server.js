// 本地开发服务器：bun dev-server.js [port]
// 用于绕开 file:// 缓存做回归测试（线上 Lamps 无此问题）
const ROOT = 'C:/10.19源码/签下整个CBA';
const port = Number(process.argv[2] || 8731);
Bun.serve({
  port,
  async fetch(req) {
    let p = decodeURIComponent(new URL(req.url).pathname);
    if (p === '/') p = '/index.html';
    const file = Bun.file(ROOT + p);
    if (await file.exists()) {
      return new Response(file, { headers: { 'cache-control': 'no-store' } });
    }
    return new Response('not found', { status: 404 });
  },
});
console.log('serving ' + ROOT + ' at http://localhost:' + port);
