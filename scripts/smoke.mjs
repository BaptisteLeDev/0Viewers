const base = process.env.SMOKE_URL ?? "http://localhost:3000";
const failures = [];

async function get(path) {
  const res = await fetch(base + path);
  if (res.status !== 200) failures.push(`${path} -> ${res.status}`);
  return res.text();
}

function expectIn(path, body, needle) {
  if (!body.includes(needle)) failures.push(`${path} missing ${needle}`);
}

for (const path of ["/", "/streamers"]) {
  const html = await get(path);
  expectIn(path, html, '<html lang="fr"');
  expectIn(path, html, "<title>");
  expectIn(path, html, 'property="og:image"');
  if (html.includes('name="robots" content="noindex')) failures.push(`${path} is noindex`);
}

const sitemap = await get("/sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (urls.sort().join() !== ["/", "/streamers"].join()) failures.push(`sitemap paths ${urls}`);

const robots = await get("/robots.txt");
expectIn("/robots.txt", robots, "Allow: /");
expectIn("/robots.txt", robots, "/sitemap.xml");

const notFound = await fetch(base + "/account");
if (notFound.status !== 404) failures.push(`/account -> ${notFound.status}, expected 404`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("smoke ok");
