// Builds the cream "paper" cards in ../assets from content.mjs.
//
//   node scripts/build.mjs           -> writes assets/*.svg
//   node scripts/build.mjs measure   -> writes scripts/measure.html (open it in a
//                                       browser and run measureAll() to refresh
//                                       scripts/heights.json after big text edits)
//
// Each card is an SVG with HTML inside a <foreignObject>, so it can use real
// layout and embedded fonts (Fraunces, Inter, JetBrains Mono, all OFL).
// Fonts are subset per card through the Google Fonts `text=` API.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as C from "./content.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "..", "assets");
const PAD = 8; // transparent margin baked into every card = gutter between cards
const FULL = 836; // two cards (416) + the 4px space GitHub puts between inline images
const CARD = 416;

// ---------------------------------------------------------------- palette
const T = {
  paper: "#F4EDE1",
  edge: "#DED1BC",
  ink: "#1E1A15",
  body: "#3A332B",
  muted: "#7A6E60",
  line: "#D9CBB5",
  accent: "#B24A25",
  green: "#3E7A4F",
};

// ---------------------------------------------------------------- fonts
const FONTS = [
  { family: "Fraunces", weight: 500, style: "normal", q: "Fraunces:opsz,wght@72,500" },
  { family: "Fraunces", weight: 400, style: "italic", q: "Fraunces:ital,opsz,wght@1,72,400", only: "<em" },
  { family: "Inter", weight: 400, style: "normal", q: "Inter:wght@400" },
  { family: "Inter", weight: 600, style: "normal", q: "Inter:wght@600" },
  { family: "JBM", weight: 500, style: "normal", q: "JetBrains+Mono:wght@500" },
];
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const fontCache = new Map();

async function fontFace(f, chars) {
  const key = f.q + "|" + chars;
  if (fontCache.has(key)) return fontCache.get(key);
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${f.q}&text=${encodeURIComponent(chars)}`, { headers: { "User-Agent": UA } })).text();
  const url = css.match(/url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error("No font URL for " + f.q + ":\n" + css.slice(0, 300));
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const rule = `@font-face{font-family:'${f.family}';font-weight:${f.weight};font-style:${f.style};src:url(data:font/woff2;base64,${buf.toString("base64")}) format('woff2');}`;
  fontCache.set(key, rule);
  return rule;
}

const decode = (s) =>
  s.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#160;/g, " ").replace(/&amp;/g, "&");

function charsOf(html) {
  const set = new Set((decode(html) + " 0123456789").split(""));
  set.delete("\n");
  return [...set].sort().join("");
}

async function fontCss(html) {
  const chars = charsOf(html);
  const rules = [];
  for (const f of FONTS) if (!f.only || html.includes(f.only)) rules.push(await fontFace(f, chars));
  return rules.join("");
}

// ---------------------------------------------------------------- shared CSS
const BASE = `
.c{box-sizing:border-box;width:100%;height:100%;padding:26px 30px;display:flex;flex-direction:column;
  font-family:Inter,system-ui,sans-serif;color:${T.ink};-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.c *{box-sizing:border-box}
h1,h2,h3{font-family:Fraunces,Georgia,serif;font-weight:500;margin:0;letter-spacing:-0.01em;color:${T.ink}}
p{margin:0}
.mono{font-family:JBM,ui-monospace,monospace;font-size:11px;letter-spacing:0.08em;color:${T.muted};font-weight:500}
.acc{color:${T.accent}}
.dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:${T.green};margin-right:8px;vertical-align:1px;animation:pulse 2.4s ease-out infinite}
.foot{margin-top:auto;padding-top:14px;font-size:10.5px}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(62,122,79,.5)}70%{box-shadow:0 0 0 7px rgba(62,122,79,0)}100%{box-shadow:0 0 0 0 rgba(62,122,79,0)}}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.rise{animation:rise .9s cubic-bezier(.2,.7,.2,1) both}.d1{animation-delay:.15s}.d2{animation-delay:.3s}
@media (prefers-reduced-motion:reduce){.c *{animation:none!important}}
`;

// ---------------------------------------------------------------- SVG shell
function shell({ w, h, html, css, fonts, dark = false, radius = 18 }) {
  const cw = w - 2 * PAD, ch = h - 2 * PAD;
  const fill = dark ? T.ink : T.paper;
  const edge = dark ? "#3A322A" : T.edge;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0.35 0 0 0 0 0.27 0 0 0 0 0.18 0 0 0 ${dark ? 0.16 : 0.1} 0"/></filter>
<clipPath id="clip"><rect x="${PAD}" y="${PAD}" width="${cw}" height="${ch}" rx="${radius}"/></clipPath>
</defs>
<rect x="${PAD + 0.5}" y="${PAD + 0.5}" width="${cw - 1}" height="${ch - 1}" rx="${radius}" fill="${fill}" stroke="${edge}"/>
<rect x="${PAD}" y="${PAD}" width="${cw}" height="${ch}" clip-path="url(#clip)" filter="url(#grain)"/>
<foreignObject x="${PAD}" y="${PAD}" width="${cw}" height="${ch}"><div xmlns="http://www.w3.org/1999/xhtml" class="c"><style>${fonts}${BASE}${css}</style>${html}</div></foreignObject>
</svg>
`;
}

// ---------------------------------------------------------------- components
const comps = [];
const add = (c) => comps.push(c);

// Header (desktop + mobile)
const H = C.header;
const headerHtml = (mobile) => `
<div class="top"><span class="mono">${H.kicker}</span><span class="mono st8"><i class="dot"></i>${H.status}</span></div>
<div class="rule"></div>
<h1 class="name rise">${H.first} <em>${H.middle}</em> ${H.last}</h1>
<p class="lede rise d1">${H.lede}</p>
<div class="stats rise d2">${H.stats.map((s) => `<div class="s"><div class="big">${s.big}</div><div class="small">${s.small}</div></div>`).join("")}</div>`;
const headerCss = (mobile) => `
.c{padding:${mobile ? "24px 24px 26px" : "28px 34px 30px"}}
.top{display:flex;justify-content:space-between;gap:12px;${mobile ? "flex-direction:column;" : ""}}
.st8{color:${T.ink}}
.rule{height:1px;background:${T.line};margin:${mobile ? "16px 0 20px" : "18px 0 24px"};transform-origin:left;animation:draw 1.4s cubic-bezier(.2,.7,.2,1) both}
h1.name{font-size:${mobile ? 54 : 86}px;line-height:.95;letter-spacing:-0.03em}
h1 em{font-style:italic;font-weight:400;color:${T.accent}}
.lede{font-size:${mobile ? 16.5 : 19}px;line-height:1.5;color:${T.body};max-width:660px;margin:${mobile ? "16px 0 20px" : "20px 0 26px"}}
.stats{display:grid;grid-template-columns:${mobile ? "1fr" : "repeat(3,1fr)"};border-top:1px solid ${T.line}}
.s{padding:${mobile ? "14px 0 12px" : "18px 20px 0 0"}}
${mobile ? `.s+.s{border-top:1px solid ${T.line}}` : `.s+.s{padding-left:20px;border-left:1px solid ${T.line}}`}
.big{font-family:Fraunces,Georgia,serif;font-size:${mobile ? 26 : 30}px;color:${T.accent};letter-spacing:-0.01em}
.small{font-size:${mobile ? 13.5 : 13}px;line-height:1.45;color:${T.muted};margin-top:4px}`;
add({ file: "header.svg", w: FULL, html: headerHtml(false), css: headerCss(false), alt: "Sai Surya Mada" });
add({ file: "header-mobile.svg", w: CARD, html: headerHtml(true), css: headerCss(true), alt: "Sai Surya Mada" });

// Contact pills
const pill = (file, label) =>
  add({ file, w: 168, h: 56, group: "pill", radius: 20, html: `<span class="mono">${label}</span>`,
    css: `.c{padding:0;align-items:center;justify-content:center}.mono{font-size:12px;color:${T.ink};letter-spacing:.1em}` });
pill("link-linkedin.svg", "LINKEDIN ↗");
pill("link-email.svg", "EMAIL ↗");
pill("link-kaggle.svg", "KAGGLE ↗");

// Section headings (desktop + mobile)
for (const [key, s] of Object.entries(C.sections)) {
  add({ file: `sec-${key}.svg`, w: FULL, group: "sec",
    html: `<span class="mono acc n">${s.num}</span><h2>${s.title}</h2><span class="ln"></span><span class="mono">${s.note}</span>`,
    css: `.c{flex-direction:row;align-items:center;gap:16px;padding:18px 30px}h2{font-size:30px;white-space:nowrap}.n{font-size:12px}.ln{flex:1;height:1px;background:${T.line}}` });
  add({ file: `sec-${key}-mobile.svg`, w: CARD, group: "secm",
    html: `<div class="row"><span class="mono acc n">${s.num}</span><h2>${s.title}</h2></div><span class="mono note">${s.note}</span>`,
    css: `.c{padding:18px 24px}.row{display:flex;align-items:baseline;gap:12px}h2{font-size:28px}.n{font-size:12px}.note{margin-top:6px}` });
}

// Roles
const CARD_CSS = `
.meta{display:flex;align-items:center;justify-content:space-between;gap:10px}
h3{font-size:25px;line-height:1.15;margin-top:14px;letter-spacing:-0.015em}
.org{font-size:13.5px;color:${T.muted};margin-top:5px;line-height:1.4}
.now{color:${T.green}}
.fig{display:flex;align-items:center;gap:14px;margin:18px 0 4px;padding:13px 0;border-top:1px solid ${T.line};border-bottom:1px solid ${T.line}}
.fig .big{font-family:Fraunces,Georgia,serif;font-size:27px;color:${T.accent};white-space:nowrap;letter-spacing:-0.01em}
.fig .small{font-size:12.5px;line-height:1.4;color:${T.muted}}
ul{list-style:none;margin:12px 0 0;padding:0}
li{position:relative;padding-left:17px;margin-bottom:8px;font-size:14px;line-height:1.55;color:${T.body}}
li::before{content:"";position:absolute;left:0;top:.75em;width:8px;height:1px;background:${T.accent}}`;
C.roles.forEach((r, i) =>
  add({ file: `role-${i + 1}.svg`, w: CARD, group: "role", css: CARD_CSS,
    alt: `${r.title}, ${r.org.replace(/&amp;/g, "&")} (${r.dates.toLowerCase()})`,
    html: `<div class="meta"><span class="mono">${r.dates}</span>${r.now ? `<span class="mono now"><i class="dot"></i>NOW</span>` : ""}</div>
<h3>${r.title}</h3><div class="org">${r.org}</div>
<div class="fig"><span class="big">${r.big}</span><span class="small">${r.bigNote}</span></div>
<ul>${r.points.map((p) => `<li>${p}</li>`).join("")}</ul>
<div class="foot mono">${r.stack}</div>` }));

// Projects
C.projects.forEach((p, i) =>
  add({ file: `project-${i + 1}.svg`, w: CARD, group: "proj", url: p.url,
    alt: `${p.title}: ${decode(p.desc).trim()}`,
    css: `
.meta{display:flex;align-items:center;gap:12px}
.meta .sp{flex:1}
.arrow{font-family:JBM,monospace;font-size:17px;color:${T.accent}}
.tag{border:1px solid ${T.line};border-radius:999px;padding:2px 8px 1px;font-size:10px}
h3{font-size:25px;line-height:1.15;margin-top:14px;letter-spacing:-0.015em}
.desc{font-size:14px;line-height:1.6;color:${T.body};margin-top:10px}
.bottom{margin-top:auto;padding-top:16px}
.pbig{font-family:Fraunces,Georgia,serif;font-size:23px;color:${T.accent};padding-top:14px;border-top:1px solid ${T.line};letter-spacing:-0.01em}
.foot{margin-top:6px;padding-top:0}`,
    html: `<div class="meta"><span class="mono acc">${String(i + 1).padStart(2, "0")}</span><span class="mono">${p.year}</span>${p.tag ? `<span class="mono tag">${p.tag}</span>` : ""}<span class="sp"></span><span class="arrow">↗</span></div>
<h3>${p.title}</h3>
<p class="desc">${p.desc}</p>
<div class="bottom"><div class="pbig">${p.big}</div><div class="foot mono">${p.stack}</div></div>` }));

// Pipeline (desktop + mobile)
const pipeIntro = "Most of my recent work follows the same five steps, in this order: privacy first, evidence before generation, and checks before anyone reads the answer.";
add({ file: "pipeline.svg", w: FULL,
  html: `<p class="intro">${pipeIntro}</p>
<div class="track"><span class="ln"></span><i class="run"></i></div>
<div class="steps">${C.pipeline.map((s, i) => `<div class="stp"><i class="pt"></i><div class="mono acc">${String(i + 1).padStart(2, "0")}</div><div class="sn">${s.name}</div><div class="tx">${s.text}</div></div>`).join("")}</div>`,
  css: `
.c{padding:26px 30px 30px}
.intro{font-size:15.5px;line-height:1.55;color:${T.body};max-width:640px}
.track{position:relative;height:12px;margin:24px 0 0}
.track .ln{position:absolute;left:5px;right:5px;top:5px;height:1px;background:${T.line}}
.run{position:absolute;top:2px;left:0;width:7px;height:7px;border-radius:50%;background:${T.accent};animation:run 6s cubic-bezier(.6,0,.4,1) infinite}
@keyframes run{0%{left:0;opacity:0}8%{opacity:1}92%{opacity:1}100%{left:calc(100% - 7px);opacity:0}}
.steps{display:grid;grid-template-columns:repeat(5,1fr);gap:18px;margin-top:-12px}
.pt{display:block;width:11px;height:11px;border-radius:50%;border:1px solid ${T.accent};background:${T.paper};margin-bottom:14px}
.sn{font-family:Fraunces,Georgia,serif;font-size:21px;margin:6px 0 6px;letter-spacing:-0.01em}
.tx{font-size:13px;line-height:1.5;color:${T.muted}}`,
  alt: "Guard, route, retrieve or act, generate, check" });
add({ file: "pipeline-mobile.svg", w: CARD,
  html: `<p class="intro">${pipeIntro}</p>
<div class="steps"><span class="ln"></span><i class="run"></i>${C.pipeline.map((s, i) => `<div class="stp"><i class="pt"></i><div class="mono acc">${String(i + 1).padStart(2, "0")}</div><div class="sn">${s.name}</div><div class="tx">${s.text}</div></div>`).join("")}</div>`,
  css: `
.c{padding:22px 24px 24px}
.intro{font-size:15px;line-height:1.55;color:${T.body}}
.steps{position:relative;margin-top:20px;padding-left:28px}
.ln{position:absolute;left:5px;top:6px;bottom:30px;width:1px;background:${T.line}}
.run{position:absolute;left:2px;top:0;width:7px;height:7px;border-radius:50%;background:${T.accent};animation:run 6s cubic-bezier(.6,0,.4,1) infinite}
@keyframes run{0%{top:0;opacity:0}8%{opacity:1}92%{opacity:1}100%{top:calc(100% - 40px);opacity:0}}
.stp{position:relative;margin-bottom:16px}
.pt{position:absolute;left:-28px;top:2px;width:11px;height:11px;border-radius:50%;border:1px solid ${T.accent};background:${T.paper}}
.sn{font-family:Fraunces,Georgia,serif;font-size:21px;margin:4px 0 4px}
.tx{font-size:14px;line-height:1.5;color:${T.muted}}`,
  alt: "Guard, route, retrieve or act, generate, check" });

// Toolkit
C.toolkit.forEach((t, i) =>
  add({ file: `toolkit-${i + 1}.svg`, w: CARD, group: "kit",
    alt: t.groups.map((g) => decode(g.label) + ": " + g.items.join(", ")).join(". "),
    html: t.groups.map((g) => `<div class="g"><div class="mono">${g.label}</div><div class="chips">${g.items.map((x) => `<span class="chip">${x}</span>`).join("")}</div></div>`).join(""),
    css: `.g+.g{margin-top:20px;padding-top:18px;border-top:1px solid ${T.line}}
.chips{margin-top:12px;display:flex;flex-wrap:wrap;gap:7px}
.chip{border:1px solid #D2C3AA;border-radius:999px;padding:4px 11px 5px;font-size:13px;color:${T.body};background:rgba(255,255,255,.35)}` }));

// Education
add({ file: "education.svg", w: CARD, group: "end",
  alt: "Education: " + C.education.map((e) => `${e.what}, ${e.where}`).join("; "),
  html: `<div class="mono">EDUCATION</div>
${C.education.map((e) => `<div class="ed"><div class="w">${e.what}</div><div class="r"><span>${e.where}</span><span class="mono">${e.when}</span></div></div>`).join("")}
<div class="foot"><span class="mono">SPEAKS&#160;&#160;</span><span class="sp">${C.spoken}</span></div>`,
  css: `.ed{padding:14px 0;border-bottom:1px solid ${T.line}}
.ed:first-of-type{margin-top:6px}
.w{font-family:Fraunces,Georgia,serif;font-size:19px;letter-spacing:-0.01em}
.r{display:flex;justify-content:space-between;gap:10px;font-size:13.5px;color:${T.muted};margin-top:3px}
.foot{font-size:13.5px}.sp{color:${T.body}}` });

// Contact (dark card)
add({ file: "contact.svg", w: CARD, group: "end", dark: true, url: C.links.email,
  alt: "Email " + C.links.emailText,
  html: `<div class="mono">SAY HELLO</div>
<h3>Building something with LLMs, retrieval or agents?</h3>
<p>I’m happy to talk about RAG, evaluation, guardrails, or a role on your team.</p>
<div class="mail"><span>${C.links.emailText}</span><span class="ar">↗</span></div>`,
  css: `.mono{color:#A89C8B}
h3{color:#F4EDE1;font-size:28px;line-height:1.15;margin-top:16px;letter-spacing:-0.02em}
p{color:#CFC4B4;font-size:14px;line-height:1.6;margin-top:14px}
.mail{margin-top:auto;padding-top:16px;border-top:1px solid #3F362D;display:flex;justify-content:space-between;align-items:baseline;font-family:Fraunces,Georgia,serif;font-size:20px;color:#E9875E}
.ar{font-family:JBM,monospace;font-size:17px}` });

// ---------------------------------------------------------------- build
const mode = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });

if (mode === "measure") {
  const all = comps.map((c) => c.html).join(" ");
  const fonts = await fontCss(all + "<em");
  // Each card is rendered in its own shadow root so its CSS stays scoped.
  const data = comps.filter((c) => !c.h).map((c) => ({ file: c.file, w: c.w - 2 * PAD, css: BASE + c.css, html: c.html }));
  fs.writeFileSync(path.join(HERE, "measure.html"), `<!doctype html><meta charset="utf-8"><style>${fonts}body{margin:20px;background:#eee}.m{margin-bottom:20px;background:${T.paper}}</style>
<body><script>
const DATA=${JSON.stringify(data).replace(/</g, "\\u003c")};
for(const d of DATA){const m=document.createElement('div');m.className='m';m.dataset.file=d.file;m.style.width=d.w+'px';document.body.appendChild(m);
  m.attachShadow({mode:'open'}).innerHTML='<style>'+d.css+'</style><div class="c" style="height:auto">'+d.html+'</div>';}
async function measureAll(){await document.fonts.ready;const o={};document.querySelectorAll('.m').forEach(m=>o[m.dataset.file]=Math.ceil(m.shadowRoot.querySelector('.c').getBoundingClientRect().height));return o}
</script>`);
  console.log("wrote scripts/measure.html");
} else {
  const heights = JSON.parse(fs.readFileSync(path.join(HERE, "heights.json"), "utf8"));
  const groupMax = {};
  for (const c of comps) if (c.group && !c.h) groupMax[c.group] = Math.max(groupMax[c.group] || 0, heights[c.file] || 0);
  let total = 0;
  for (const c of comps) {
    const inner = c.h ? c.h - 2 * PAD : (c.group ? groupMax[c.group] : heights[c.file]);
    if (!inner) throw new Error("No measured height for " + c.file + " (run measure first)");
    const svg = shell({ w: c.w, h: inner + 2 * PAD, html: c.html, css: c.css, fonts: await fontCss(c.html), dark: c.dark, radius: c.radius });
    fs.writeFileSync(path.join(OUT, c.file), svg);
    total += svg.length;
    console.log(c.file.padEnd(24), `${c.w}x${inner + 2 * PAD}`.padEnd(10), (svg.length / 1024).toFixed(1) + " KB");
  }
  console.log("total", (total / 1024).toFixed(0) + " KB");
}
