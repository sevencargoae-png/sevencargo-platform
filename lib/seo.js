'use strict';
// Server-side SEO: per-page meta/Open Graph/structured data, Arabic text pre-filled into the HTML
// (so search engines and link previews see real content without running JS), robots.txt and sitemap.xml.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = (process.env.PUBLIC_URL || 'https://sevencargo.online').replace(/\/$/, '');
const PHONE = '+971553377985';
const OG_IMAGE = `${SITE}/img/og.jpg`;

const META = {
  '/': {
    title: 'SEVENCARGO | شحن وتوصيل داخل الإمارات من الباب للباب',
    desc: 'اطلب مندوب يستلم شحنتك من بابك ويوصلها للمستلم في دبي والشارقة وأبوظبي وعجمان وكل الإمارات. سعر فوري، دفع كاش عند الاستلام، وتتبع مباشر للمندوب.',
  },
  '/order': {
    title: 'اشحن الآن | اطلب مندوب لاستلام شحنتك — SEVENCARGO',
    desc: 'سجّل شحنتك في أقل من دقيقة: اختار إمارة الاستلام والتسليم، واعرف السعر فورًا، وادفع كاش. مندوب SEVENCARGO يتواصل معك ويستلم من بابك.',
  },
  '/track': {
    title: 'تتبع شحنتك | SEVENCARGO',
    desc: 'تتبع شحنتك مع SEVENCARGO برقم الشحنة أو رقم هاتفك، وشوف مكان المندوب على الخريطة لحظة بلحظة، بدون تسجيل حساب.',
  },
  '/complaints': {
    title: 'الشكاوى والاقتراحات | SEVENCARGO',
    desc: 'قدّم شكوى أو اقتراح بخصوص شحنتك مع SEVENCARGO، وفريق خدمة العملاء يتابعها معك.',
  },
  '/privacy': { title: 'سياسة الخصوصية | SEVENCARGO', desc: 'كيف تجمع SEVENCARGO بياناتك وتستخدمها وتحميها أثناء خدمة الاستلام والتوصيل داخل الإمارات.' },
  '/terms': { title: 'شروط الخدمة | SEVENCARGO', desc: 'شروط استخدام خدمة SEVENCARGO للاستلام والتوصيل داخل الإمارات، والمواد الممنوعة، وطرق الدفع.' },
  '/cookies': { title: 'سياسة الكوكيز | SEVENCARGO', desc: 'ملفات الكوكيز التي يستخدمها موقع SEVENCARGO ولماذا.' },
};
const PUBLIC_ROUTES = Object.keys(META);

// ---------- Arabic dictionary taken from the client scripts ----------
function extractDicts(file) {
  const src = fs.readFileSync(file, 'utf8');
  const out = {};
  let i = 0;
  while ((i = src.indexOf('SC.addDict({', i)) !== -1) {
    const start = i + 'SC.addDict('.length;
    let depth = 0, j = start, quote = null;
    for (; j < src.length; j++) {
      const c = src[j];
      if (quote) { if (c === '\\') { j++; continue; } if (c === quote) quote = null; continue; }
      if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) break; }
    }
    try {
      const obj = vm.runInNewContext('(' + src.slice(start, j + 1) + ')', {}, { timeout: 200 });
      Object.assign(out, obj.ar || {});
    } catch { /* ignore a block we cannot evaluate */ }
    i = j;
  }
  return out;
}

function buildDict(pub, pageScripts) {
  const d = extractDicts(path.join(pub, 'js', 'common.js'));
  for (const s of pageScripts) Object.assign(d, extractDicts(path.join(pub, 'js', s)));
  return d;
}

const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');

function fillI18n(html, dict) {
  return html
    .replace(/(<[a-zA-Z0-9]+\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)(\s*<\/)/g, (m, open, key, close) => (dict[key] != null ? open + escText(dict[key]) + close : m))
    .replace(/(<[a-zA-Z0-9]+\b[^>]*\sdata-i18n-html="([^"]+)"[^>]*>)(\s*<\/)/g, (m, open, key, close) => (dict[key] != null ? open + dict[key] + close : m))
    .replace(/(<(?:input|textarea)\b[^>]*\sdata-i18n-ph="([^"]+)")/g, (m, open, key) => (dict[key] != null && !/\splaceholder=/.test(m) ? `${open} placeholder="${escAttr(dict[key])}"` : m));
}

function staticChrome(dict) {
  const t = (k, f) => escText(dict[k] || f);
  const header = `<div class="container inner"><a href="/" class="brand"><img src="/img/logo.png" alt="SEVENCARGO"><span class="name">SEVEN<b>CARGO</b></span></a>
    <nav class="nav"><a href="/order">${t('ship_now', 'اشحن الآن')}</a><a href="/track">${t('track', 'تتبع شحنة')}</a><a href="/complaints">${t('complaints', 'الشكاوى')}</a></nav></div>`;
  const footer = `<div class="container inner"><div class="brand"><span>© ${new Date().getFullYear()} SEVENCARGO — ${t('rights', 'جميع الحقوق محفوظة')}</span></div>
    <nav><a href="/order">${t('ship_now', 'اشحن الآن')}</a><a href="/track">${t('track', 'تتبع شحنة')}</a><a href="/complaints">${t('complaints', 'الشكاوى')}</a><a href="/privacy">${t('privacy', 'الخصوصية')}</a><a href="/terms">${t('terms', 'الشروط')}</a><a href="/cookies">${t('cookies', 'الكوكيز')}</a></nav>
    <a class="ltr" href="https://wa.me/971553377985">WhatsApp: 055 337 7985</a></div>`;
  return { header, footer };
}

function jsonLd() {
  const emirates = ['Dubai', 'Sharjah', 'Abu Dhabi', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE}/#business`,
        name: 'SEVENCARGO',
        alternateName: 'سفن كارجو',
        description: META['/'].desc,
        url: SITE,
        logo: `${SITE}/img/logo.png`,
        image: OG_IMAGE,
        telephone: PHONE,
        priceRange: 'AED 15+',
        address: { '@type': 'PostalAddress', addressCountry: 'AE' },
        areaServed: emirates.map((n) => ({ '@type': 'City', name: n })),
        availableLanguage: ['ar', 'en'],
        contactPoint: [{ '@type': 'ContactPoint', telephone: PHONE, contactType: 'customer service', availableLanguage: ['Arabic', 'English'] }],
        makesOffer: {
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: 'استلام وتوصيل الشحنات داخل الإمارات (Pickup & Delivery)', serviceType: 'Courier / Parcel delivery', areaServed: 'AE' },
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: 'SEVENCARGO',
        inLanguage: 'ar-AE',
        publisher: { '@id': `${SITE}/#business` },
      },
    ],
  };
}

function headTags(route) {
  const m = META[route];
  const url = SITE + (route === '/' ? '/' : route);
  let h = `
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="SEVENCARGO">
  <meta property="og:locale" content="ar_AE">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${escAttr(m.title)}">
  <meta property="og:description" content="${escAttr(m.desc)}">
  <meta property="og:image" content="${OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="SEVENCARGO — شحن وتوصيل داخل الإمارات">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escAttr(m.title)}">
  <meta name="twitter:description" content="${escAttr(m.desc)}">
  <meta name="twitter:image" content="${OG_IMAGE}">
  <link rel="apple-touch-icon" href="/img/icon-192.jpg">
  <link rel="manifest" href="/manifest.webmanifest">`;
  if (process.env.GOOGLE_SITE_VERIFICATION) h += `\n  <meta name="google-site-verification" content="${escAttr(process.env.GOOGLE_SITE_VERIFICATION)}">`;
  if (route === '/') h += `\n  <script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, '\\u003c')}</script>`;
  return h;
}

// Called once per page file at first request.
function enhance(route, html, pub) {
  const scripts = [...html.matchAll(/<script src="\/js\/([a-z-]+\.js)/g)].map((m) => m[1]).filter((s) => s !== 'common.js');
  const dict = buildDict(pub, scripts);
  html = fillI18n(html, dict);
  if (META[route]) {
    const m = META[route];
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escText(m.title)}</title>`);
    html = html.replace(/\s*<meta name="description"[^>]*>/, '');
    html = html.replace('</title>', `</title>\n  <meta name="description" content="${escAttr(m.desc)}">${headTags(route)}`);
    const { header, footer } = staticChrome(dict);
    html = html.replace('<header id="site-header"></header>', `<header id="site-header" class="site-header">${header}</header>`);
    html = html.replace('<footer id="site-footer"></footer>', `<footer id="site-footer" class="site-footer">${footer}</footer>`);
  }
  return html;
}

function robots() {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /driver
Disallow: /api/
Disallow: /files/

Sitemap: ${SITE}/sitemap.xml
`;
}

function sitemap(lastmod) {
  const pri = { '/': '1.0', '/order': '0.9', '/track': '0.8', '/complaints': '0.4', '/privacy': '0.2', '/terms': '0.2', '/cookies': '0.1' };
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_ROUTES.map((r) => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc><lastmod>${lastmod}</lastmod><priority>${pri[r]}</priority></url>`).join('\n')}
</urlset>
`;
}

function manifest() {
  return JSON.stringify({
    name: 'SEVENCARGO — شحن وتوصيل داخل الإمارات',
    short_name: 'SEVENCARGO',
    description: META['/'].desc,
    lang: 'ar',
    dir: 'rtl',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    background_color: '#06111c',
    theme_color: '#06111c',
    icons: [
      { src: '/img/icon-192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { src: '/img/icon-512.jpg', sizes: '512x512', type: 'image/jpeg' },
      { src: '/img/icon-512.jpg', sizes: '512x512', type: 'image/jpeg', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'اشحن الآن', url: '/order' },
      { name: 'تتبع شحنة', url: '/track' },
    ],
  });
}

module.exports = { enhance, robots, sitemap, manifest, SITE, PUBLIC_ROUTES };
