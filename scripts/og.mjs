/** Renders the social preview image (public/og.png, 1200×630) from an SVG with sharp.  npm run og */
import sharp from "sharp";
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f9ee8"/><stop offset="0.55" stop-color="#245edc"/><stop offset="1" stop-color="#2f7d2a"/></linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a246a"/><stop offset="1" stop-color="#a6caf0"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#sky)"/>
  <g fill="#ffffff" opacity="0.9"><rect x="80" y="70" width="140" height="18"/><rect x="100" y="52" width="80" height="18"/><rect x="60" y="88" width="190" height="18"/>
  <rect x="900" y="120" width="160" height="18"/><rect x="930" y="102" width="90" height="18"/><rect x="880" y="138" width="210" height="18"/></g>
  <rect x="150" y="170" width="900" height="330" fill="#c0c0c0" stroke="#404040" stroke-width="4"/>
  <rect x="154" y="174" width="892" height="36" fill="url(#bar)"/>
  <text x="172" y="200" font-family="Menlo, Consolas, monospace" font-size="20" font-weight="700" fill="#ffffff">ethan.goldstein — Archive 2005—2026</text>
  <rect x="1000" y="180" width="18" height="18" fill="#c0c0c0" stroke="#404040" stroke-width="2"/><rect x="1022" y="180" width="18" height="18" fill="#c0c0c0" stroke="#404040" stroke-width="2"/>
  <rect x="170" y="230" width="860" height="250" fill="#1f4e9c"/>
  <text x="600" y="320" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif" font-size="64" font-weight="900" fill="#ffffff" letter-spacing="2">ETHAN GOLDSTEIN</text>
  <text x="600" y="380" text-anchor="middle" font-family="Menlo, Consolas, monospace" font-size="30" font-weight="700" fill="#ffe66d">2005 — 2026</text>
  <text x="600" y="440" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="34" fill="#ffffff">An archive of growing up.</text>
  <text x="600" y="560" text-anchor="middle" font-family="Menlo, Consolas, monospace" font-size="18" fill="#ffffff" opacity="0.85">POTOMAC, MARYLAND · THE INTERNET, MUSIC, GAMES AND PHOTOS OF EVERY YEAR</text>
</svg>`;
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile("public/og.png");
console.log("public/og.png written");
