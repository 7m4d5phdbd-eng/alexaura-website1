const { chromium } = require('playwright');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

// Files to convert: [sourceMarkdown, outputPdf, title]
const jobs = [
  ['SYRIAWAY_BUSINESS_CASE.md', 'pdf/SyriaWay_Business_Case.pdf', 'SyriaWay — Business Case & Feasibility Study'],
  ['BEGINNER_GUIDE.md', 'pdf/SyriaWay_Beginner_Guide.pdf', 'Beginner Setup Guide'],
  ['QUICK_CHECKLIST.md', 'pdf/SyriaWay_Quick_Checklist.pdf', 'Quick Setup Checklist'],
];

const css = `
  @page { margin: 18mm 16mm; size: A4; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Noto Sans', 'DejaVu Sans', 'Noto Naskh Arabic', sans-serif;
    color: #222; line-height: 1.55; font-size: 11.5px; margin: 0;
  }
  h1 { color: #1a1a1a; border-bottom: 3px solid #d4af37; padding-bottom: 8px; font-size: 22px; margin-top: 26px; }
  h2 { color: #1a1a1a; border-bottom: 1px solid #d4af37; padding-bottom: 5px; font-size: 17px; margin-top: 22px; }
  h3 { color: #b8941f; font-size: 14px; margin-top: 16px; }
  h4 { color: #555; font-size: 12px; }
  a { color: #0066cc; text-decoration: none; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 10px; }
  th { background: #1a1a1a; color: #fff; padding: 7px 9px; text-align: left; }
  td { padding: 6px 9px; border-bottom: 1px solid #eee; vertical-align: top; }
  tr:nth-child(even) td { background: #faf8f2; }
  code { background: #f4f4f4; padding: 1px 5px; border-radius: 3px; font-family: 'DejaVu Sans Mono', monospace; font-size: 10px; }
  pre { background: #1a1a1a; color: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; font-size: 9.5px; line-height: 1.4; }
  pre code { background: none; color: #f5f5f5; padding: 0; }
  blockquote { border-left: 4px solid #d4af37; margin: 12px 0; padding: 6px 14px; background: #faf8f2; color: #555; }
  ul, ol { padding-left: 20px; }
  li { margin: 3px 0; }
  hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
  strong { color: #1a1a1a; }
  /* Arabic text auto-handles direction via Unicode; mixed lines stay LTR-anchored which is fine for bilingual tables */
  .cover { text-align: center; padding: 60px 20px; page-break-after: always; }
  .cover .logo { font-size: 40px; color: #d4af37; font-weight: bold; margin-bottom: 10px; }
  .cover .sub { font-size: 16px; color: #666; margin-top: 8px; }
  .cover .ar { font-size: 20px; color: #1a1a1a; margin-top: 20px; direction: rtl; }
  .cover .date { margin-top: 40px; color: #999; font-size: 12px; }
`;

(async () => {
  fs.mkdirSync(path.resolve(__dirname, 'pdf'), { recursive: true });
  const browser = await chromium.launch();

  for (const [src, out, title] of jobs) {
    const mdPath = path.resolve(__dirname, src);
    if (!fs.existsSync(mdPath)) { console.log('skip (missing):', src); continue; }
    const md = fs.readFileSync(mdPath, 'utf8');
    const bodyHtml = marked.parse(md);

    const cover = `
      <div class="cover">
        <div class="logo">✈️ SyriaWay</div>
        <div class="sub">${title}</div>
        <div class="ar">مرافق الثقة للسفر إلى سوريا</div>
        <div class="date">Prepared June 2026 · حزيران 2026</div>
      </div>`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head>
      <body>${title.includes('Business') ? cover : ''}${bodyHtml}</body></html>`;

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.pdf({
      path: path.resolve(__dirname, out),
      format: 'A4',
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: '<div style="font-size:8px;color:#999;width:100%;text-align:center;padding:4px 0;">SyriaWay · Confidential · Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    });
    await page.close();
    const kb = Math.round(fs.statSync(path.resolve(__dirname, out)).size / 1024);
    console.log('✓', out, `(${kb} KB)`);
  }

  await browser.close();
})();
