// Piccolo server statico locale: le foto devono arrivare dalla stessa origine della pagina,
// altrimenti il canvas non può esportare le immagini.
const http = require("http");
const fs = require("fs");
const path = require("path");

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

function serve(root) {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html";
    const file = path.resolve(root, rel);
    if (!file.startsWith(path.resolve(root)) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve({ server, url: `http://127.0.0.1:${server.address().port}/` })));
}

async function openApp(browser, root) {
  const { server, url } = await serve(root);
  const page = await browser.newPage();
  await page.goto(url + "index.html");
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([
    document.fonts.load("400 100px 'Instrument Serif'"),
    document.fonts.load("italic 400 50px 'Instrument Serif'"),
    document.fonts.load("500 36px 'Instrument Sans'"),
  ]).catch(() => {}));
  return { page, server };
}

module.exports = { openApp };
