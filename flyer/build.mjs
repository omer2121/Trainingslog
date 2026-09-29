// Baut den Flyer aus content.json: Druck-PDF (DIN A5 + 3 mm Beschnitt, RGB und CMYK),
// eine Druckvorschau ohne Beschnitt sowie Instagram-Post (4:5) und -Story (9:16) als PNG.
// Aufruf: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import QRCode from "qrcode";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "out");
const tmp = join(here, "build");
mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });

const c = JSON.parse(readFileSync(join(here, "content.json"), "utf8"));
const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
const font = (pkg, file) => pathToFileURL(join(here, "node_modules/@fontsource", pkg, "files", file)).href;

const INK = "#0E0F12", ACCENT = "#FFD000";
const qrSvg = await QRCode.toString(c.url, {
  type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: INK, light: "#FFFFFF" },
});

// 1rem = 1/100 der Seitenbreite (inkl. Beschnitt). heightRem = Seitenhöhe in rem.
// h1Max/hlMax begrenzen die Headline-Größe, compact kürzt das Layout für 4:5.
const variants = [
  { name: "druck", unit: "1.54mm", width: "154mm", height: "216mm", heightRem: 216 / 1.54,
    pad: "5.4rem", h1Max: 22, hlMax: 15, qr: true, print: true },
  { name: "instagram-post", unit: "10.8px", widthPx: 1080, heightPx: 1350, heightRem: 125,
    pad: "6.5rem", h1Max: 19, hlMax: 13, qr: false, compact: true },
  // Story: oben ~260 px und unten ~300 px frei lassen (Profilzeile und Antwortleiste von Instagram)
  { name: "instagram-story", unit: "10.8px", widthPx: 1080, heightPx: 1920, heightRem: 1920 / 10.8,
    pad: "7rem", padY: "24rem 7rem 28rem", h1Max: 23, hlMax: 14, qr: false },
];

// Diagonale Streifen oben rechts als echte Vektorgrafik (CSS clip-path + Verlauf geht im PDF verloren).
// viewBox 0–100 entspricht 20 rem: Streifen 0,9 rem breit (4,5), Abstand 2,7 rem (13,5) senkrecht gemessen.
const stripes = (() => {
  const lines = [];
  for (let x = 0; x <= 200; x += 13.5 * Math.SQRT2) {
    lines.push(`<line x1="${x.toFixed(2)}" y1="0" x2="${(x - 100).toFixed(2)}" y2="100"/>`);
  }
  return `<svg class="stripes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs><clipPath id="tri"><polygon points="0,0 100,0 100,100"/></clipPath></defs>
    <g clip-path="url(#tri)" stroke="${ACCENT}" stroke-width="4.5">${lines.join("")}</g></svg>`;
})();

function html(v) {
  const benefits = c.benefits.map((b, i) => `
      <div class="benefit">
        <div class="num">0${i + 1}</div>
        <div><div class="b-title">${esc(b.title)}</div><div class="b-text">${esc(b.text)}</div></div>
      </div>`).join("");
  const action = v.qr
    ? `<div class="qr-wrap"><div class="qr">${qrSvg}</div><div class="cta">${esc(c.cta)}</div></div>`
    : `<div class="pill">${esc(c.socialCta)}</div>`;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:Anton;src:url(${font("anton", "anton-latin-400-normal.woff2")}) format("woff2");font-weight:400}
@font-face{font-family:Inter;src:url(${font("inter", "inter-latin-400-normal.woff2")}) format("woff2");font-weight:400}
@font-face{font-family:Inter;src:url(${font("inter", "inter-latin-600-normal.woff2")}) format("woff2");font-weight:600}
@font-face{font-family:Inter;src:url(${font("inter", "inter-latin-800-normal.woff2")}) format("woff2");font-weight:800}
${v.print ? `@page{size:${v.width} ${v.height};margin:0}` : ""}
html{font-size:${v.unit}}
*{box-sizing:border-box;margin:0;padding:0}
body{background:${INK};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{position:relative;width:100rem;height:${v.heightRem}rem;overflow:hidden;color:#fff;font-family:Inter,sans-serif;
  background:radial-gradient(circle at 12% 18%,rgba(255,208,0,.13),transparent 42%),
             radial-gradient(circle at 95% 92%,rgba(255,255,255,.07),transparent 38%),${INK};
  padding:${v.padY || v.pad} ${v.pad};display:flex;flex-direction:column}
.stripes{position:absolute;top:0;right:0;width:20rem;height:20rem;display:block}
.label{display:flex;align-items:center;gap:1.6rem;font-weight:800;font-size:1.9rem;letter-spacing:.32em;text-transform:uppercase;color:#E8EAEE}
.label:before{content:"";width:6rem;height:.7rem;background:${ACCENT}}
.head{margin-top:7rem}
.fit{display:inline-block;white-space:nowrap;font-family:Anton,sans-serif;line-height:.9;letter-spacing:.01em}
.h1{color:#fff}
.hl{display:inline-block;margin-top:1.6rem;background:${ACCENT};color:${INK};padding:1rem 2.2rem .6rem;transform:skewX(-8deg)}
.hl .fit{transform:skewX(8deg)}
.sub{margin-top:3rem;font-weight:600;font-size:2.9rem;line-height:1.3;color:#D5D9E0;max-width:84rem;text-wrap:balance}
.rule{margin:3.4rem 0 3rem;height:.25rem;background:linear-gradient(90deg,${ACCENT},rgba(255,208,0,0) 70%)}
.benefits{display:flex;flex-direction:column;gap:2.4rem}
.benefit{display:grid;grid-template-columns:8.6rem 1fr;gap:2.4rem;align-items:start}
.num{font-family:Anton,sans-serif;font-size:4.6rem;line-height:1;color:${ACCENT};border:.35rem solid ${ACCENT};
  height:8.6rem;display:flex;align-items:center;justify-content:center}
.b-title{font-weight:800;font-size:2.8rem;line-height:1.2}
.b-text{margin-top:.7rem;font-size:2.2rem;line-height:1.4;color:#A9AFBB;text-wrap:balance}
.spacer{flex:1;min-height:3rem}
.bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:4rem}
.badge{margin-left:1.4rem;background:${ACCENT};color:${INK};padding:2.2rem 3.4rem 1.6rem;transform:rotate(-4deg);transform-origin:left bottom;
  box-shadow:0 0 0 .4rem ${INK},0 0 0 .8rem ${ACCENT}}
.badge .t{font-weight:800;font-size:2.1rem;letter-spacing:.18em;text-transform:uppercase}
.badge .m{font-family:Anton,sans-serif;font-size:10.5rem;line-height:.95}
.qr-wrap{display:flex;flex-direction:column;align-items:center;gap:1.4rem}
.qr{width:15rem;height:15rem;background:#fff;padding:1.3rem}
.qr svg{width:100%;height:100%;display:block}
.cta{font-weight:800;font-size:1.9rem;letter-spacing:.06em;text-transform:uppercase;text-align:center;max-width:22rem;line-height:1.25}
.pill{border:.4rem solid ${ACCENT};color:#fff;font-weight:800;font-size:2.6rem;padding:2rem 3rem;text-transform:uppercase;letter-spacing:.06em;max-width:40rem;text-align:center;line-height:1.25}
.contact{margin-top:3rem;padding-top:2.4rem;border-top:.2rem solid rgba(255,255,255,.14);display:flex;flex-wrap:wrap;gap:1rem 3rem;
  font-size:2rem;font-weight:600;color:#C4C9D2}
.contact span:first-child{color:${ACCENT}}
/* Kompakt (Instagram 4:5): nur Überschriften der Vorteile, kleinere Kästen */
.compact .b-text{display:none}
.compact .benefit{grid-template-columns:6.4rem 1fr;align-items:center}
.compact .num{height:6.4rem;font-size:3.6rem}
.compact .b-title{font-size:3rem}
.compact .rule{margin:3rem 0 2.8rem}
.compact .badge .m{font-size:9rem}
</style></head><body><div class="page${v.compact ? " compact" : ""}">
  ${stripes}
  <div class="label">${esc(c.label)}</div>
  <div class="head">
    <div><span class="fit h1" data-fit data-max="${v.h1Max}">${esc(c.headline)}</span></div>
    <div class="hl"><span class="fit" data-fit data-max="${v.hlMax}" data-shrink="6.4">${esc(c.highlight)}</span></div>
  </div>
  <div class="sub">${esc(c.subline)}</div>
  <div class="rule"></div>
  <div class="benefits">${benefits}</div>
  <div class="spacer"></div>
  <div class="bottom">
    <div class="badge"><div class="t">${esc(c.badgeTop)}</div><div class="m">${esc(c.badgeMain)}</div></div>
    ${action}
  </div>
  <div class="contact">${c.contact.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
</div>
<script>
// Headline-Zeilen auf die verfügbare Breite skalieren, höchstens bis data-max (in rem).
// Gemessen wird mit getBoundingClientRect (Bruchteile von Pixeln), nicht mit clientWidth.
document.fonts.ready.then(() => {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const inner = document.querySelector(".head").getBoundingClientRect().width;
  document.querySelectorAll("[data-fit]").forEach((el) => {
    const avail = inner - parseFloat(el.dataset.shrink || 0) * rem - 0.5;
    let lo = 1, hi = parseFloat(el.dataset.max) * rem;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + "px";
      if (el.getBoundingClientRect().width <= avail) lo = mid; else hi = mid;
    }
    el.style.fontSize = lo + "px";
  });
  // Warnen, falls der Inhalt nicht auf die Seite passt
  const page = document.querySelector(".page");
  window.__overflow = page.scrollHeight - page.clientHeight;
  window.__ready = true;
});
</script></body></html>`;
}

const browser = await chromium.launch();
try {
  for (const v of variants) {
    const file = join(tmp, `${v.name}.html`);
    writeFileSync(file, html(v));
    const page = await browser.newPage({
      viewport: v.print ? { width: 800, height: 1000 } : { width: v.widthPx, height: v.heightPx },
      deviceScaleFactor: v.print ? 3.125 : 1, // 3.125 × 96 dpi = 300 dpi für die Druckvorschau
    });
    await page.goto(pathToFileURL(file).href);
    await page.waitForFunction(() => window.__ready === true);
    const overflow = await page.evaluate(() => window.__overflow);
    if (overflow > 1) console.warn(`WARNUNG ${v.name}: Inhalt ist ${overflow}px zu hoch – Text kürzen.`);
    if (v.print) {
      await page.pdf({ path: join(out, "flyer-A5-druck-RGB.pdf"), width: v.width, height: v.height,
        printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
      // Vorschau im Endformat (ohne 3 mm Beschnitt): 3 mm = 11.34 CSS-px
      const b = 3 * 96 / 25.4;
      await page.screenshot({ path: join(out, "flyer-A5-vorschau.png"),
        clip: { x: b, y: b, width: 148 * 96 / 25.4, height: 210 * 96 / 25.4 } });
    } else {
      await page.screenshot({ path: join(out, `${v.name}.png`), clip: { x: 0, y: 0, width: v.widthPx, height: v.heightPx } });
    }
    await page.close();
  }
} finally {
  await browser.close();
}

// CMYK-Fassung für Druckereien, die CMYK verlangen: Umrechnung mit FOGRA39 (ISO Coated v2,
// Standard für Bogenoffset auf gestrichenem Papier in Deutschland). Profil aus dem Paket colord-data.
const fogra = "/usr/share/color/icc/colord/FOGRA39L_coated.icc";
execFileSync("gs", ["-q", "-dSAFER", "-dBATCH", "-dNOPAUSE", "-sDEVICE=pdfwrite",
  "-sColorConversionStrategy=CMYK", "-dProcessColorModel=/DeviceCMYK", "-dCompatibilityLevel=1.4",
  ...(existsSync(fogra) ? [`-sOutputICCProfile=${fogra}`] : []),
  "-dEmbedAllFonts=true", "-dSubsetFonts=true",
  `-sOutputFile=${join(out, "flyer-A5-druck-CMYK.pdf")}`, join(out, "flyer-A5-druck-RGB.pdf")]);

console.log("Fertig:", out);
