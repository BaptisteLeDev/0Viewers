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

const PAGES = ["/", "/streamers", "/categories", "/categories/minecraft", "/algo", "/stats", "/mentions-legales", "/credits"];

for (const path of PAGES) {
  const html = await get(path);
  expectIn(path, html, '<html lang="fr"');
  expectIn(path, html, "<title>");
  expectIn(path, html, 'property="og:image"');
  if (html.includes('name="robots" content="noindex')) failures.push(`${path} is noindex`);
}

const sitemap = await get("/sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const STATIC_PAGES = PAGES.filter((p) => !p.startsWith("/categories/"));
for (const path of STATIC_PAGES) if (!urls.includes(path)) failures.push(`sitemap missing ${path}`);
const strays = urls.filter((u) => !STATIC_PAGES.includes(u));
if (strays.length) failures.push(`sitemap unexpected ${strays}`);

const empty = "/categories/aucun-live-ici";
const gone = await get(empty);
expectIn(empty, gone, "personne en live en ce moment");
if (gone.toLowerCase().includes("aucun live ici")) failures.push(`${empty} shows the raw slug`);
expectIn(empty, gone, 'name="robots" content="noindex');

const robots = await get("/robots.txt");
expectIn("/robots.txt", robots, "Allow: /");
expectIn("/robots.txt", robots, "/sitemap.xml");

for (const path of ["/account", "/categories/Pas_Un_Slug"]) {
  const res = await fetch(base + path);
  if (res.status !== 404) failures.push(`${path} -> ${res.status}, expected 404`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("smoke ok");
