import { createFreeWifiPosterDataUrl } from '../services/imageService';

function encodeSvg(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function buildSampleMenuSvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1500" viewBox="0 0 900 1500">',
    '  <defs>',
    '    <linearGradient id="navy" x1="0" y1="0" x2="1" y2="1">',
    '      <stop offset="0" stop-color="#16295c"/>',
    '      <stop offset="1" stop-color="#0b1838"/>',
    '    </linearGradient>',
    '  </defs>',
    '  <rect width="900" height="1500" fill="#f8f2e7"/>',
    '  <rect width="900" height="520" fill="url(#navy)"/>',
    '  <circle cx="730" cy="132" r="86" fill="#ffd23f"/>',
    '  <circle cx="770" cy="98" r="40" fill="#ffe28a"/>',
    '  <text x="70" y="118" fill="#ffd23f" font-family="Arial, Helvetica, sans-serif" font-size="30" letter-spacing="8">LITTLE LANTERN</text>',
    '  <text x="70" y="164" fill="#c3d3ff" font-family="Arial, Helvetica, sans-serif" font-size="23" letter-spacing="4">KITCHEN AND COFFEE</text>',
    "  <text x=\"70\" y=\"314\" fill=\"#ffffff\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"98\" font-weight=\"700\">Today's</text>",
    '  <text x="70" y="414" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="98" font-weight="700">menu</text>',
    '  <text x="70" y="474" fill="#9fb6ef" font-family="Arial, Helvetica, sans-serif" font-size="25">Served 7:30 - 16:00  |  14 Long Street</text>',
    '  <g font-family="Arial, Helvetica, sans-serif">',
    '    <text x="70" y="606" fill="#10235f" font-size="33" font-weight="700">FLAT WHITE</text>',
    '    <text x="830" y="606" fill="#10235f" font-size="33" font-weight="700" text-anchor="end">R32</text>',
    '    <text x="70" y="646" fill="#6b6252" font-size="23">Double shot, silky milk</text>',
    '    <line x1="70" y1="690" x2="830" y2="690" stroke="#e2d8c6" stroke-width="2"/>',
    '    <text x="70" y="752" fill="#10235f" font-size="33" font-weight="700">BUTTERMILK CHICKEN</text>',
    '    <text x="830" y="752" fill="#10235f" font-size="33" font-weight="700" text-anchor="end">R95</text>',
    '    <text x="70" y="792" fill="#6b6252" font-size="23">Brioche, slaw, house hot sauce</text>',
    '    <line x1="70" y1="836" x2="830" y2="836" stroke="#e2d8c6" stroke-width="2"/>',
    '    <text x="70" y="898" fill="#10235f" font-size="33" font-weight="700">GARDEN BOWL</text>',
    '    <text x="830" y="898" fill="#10235f" font-size="33" font-weight="700" text-anchor="end">R78</text>',
    '    <text x="70" y="938" fill="#6b6252" font-size="23">Roast pumpkin, grains, greens</text>',
    '    <line x1="70" y1="982" x2="830" y2="982" stroke="#e2d8c6" stroke-width="2"/>',
    '    <text x="70" y="1044" fill="#10235f" font-size="33" font-weight="700">LEMON TART</text>',
    '    <text x="830" y="1044" fill="#10235f" font-size="33" font-weight="700" text-anchor="end">R45</text>',
    '    <text x="70" y="1084" fill="#6b6252" font-size="23">Torched meringue, creme fraiche</text>',
    '  </g>',
    '  <rect x="70" y="1210" width="760" height="180" rx="28" fill="#ffd23f"/>',
    '  <text x="450" y="1286" fill="#1d2350" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" text-anchor="middle" letter-spacing="2">SCAN. ORDER. ENJOY.</text>',
    '  <text x="450" y="1334" fill="#515027" font-family="Arial, Helvetica, sans-serif" font-size="23" text-anchor="middle">One QR code, always the latest menu</text>',
    '  <text x="70" y="1440" fill="#8a806b" font-family="Arial, Helvetica, sans-serif" font-size="21" letter-spacing="3">LITTLE LANTERN  |  EST. 2024</text>',
    '</svg>',
  ].join('\n');
}

function buildPromotionSvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1500" viewBox="0 0 900 1500">',
    '  <rect width="900" height="1500" fill="#1d4ed8"/>',
    '  <circle cx="760" cy="200" r="180" fill="#2563eb"/>',
    '  <circle cx="120" cy="1320" r="220" fill="#1e40af"/>',
    '  <rect x="70" y="120" width="300" height="64" rx="32" fill="#ffd23f"/>',
    '  <text x="220" y="162" fill="#1e1b04" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" text-anchor="middle" letter-spacing="4">THIS WEEK</text>',
    '  <text x="70" y="420" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="120" font-weight="700">20% OFF</text>',
    '  <text x="70" y="540" fill="#c3d3ff" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700">every lunch combo</text>',
    '  <text x="70" y="620" fill="#9fb6ef" font-family="Arial, Helvetica, sans-serif" font-size="28">Monday to Friday, 12:00 - 15:00</text>',
    '  <rect x="70" y="760" width="760" height="4" fill="#3b6cf0"/>',
    '  <g font-family="Arial, Helvetica, sans-serif">',
    '    <text x="70" y="870" fill="#ffffff" font-size="36" font-weight="700">COMBO A</text>',
    '    <text x="830" y="870" fill="#ffd23f" font-size="36" font-weight="700" text-anchor="end">R79</text>',
    '    <text x="70" y="914" fill="#9fb6ef" font-size="24">Main + side + drink</text>',
    '    <text x="70" y="1020" fill="#ffffff" font-size="36" font-weight="700">COMBO B</text>',
    '    <text x="830" y="1020" fill="#ffd23f" font-size="36" font-weight="700" text-anchor="end">R99</text>',
    '    <text x="70" y="1064" fill="#9fb6ef" font-size="24">Burger + fries + coffee</text>',
    '  </g>',
    '  <rect x="70" y="1200" width="760" height="170" rx="28" fill="#ffffff"/>',
    '  <text x="450" y="1272" fill="#1d4ed8" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" text-anchor="middle">Scan for the full offer</text>',
    '  <text x="450" y="1320" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="22" text-anchor="middle">Same QR code, new promotion</text>',
    '</svg>',
  ].join('\n');
}

function buildPriceListSvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1500" viewBox="0 0 900 1500">',
    '  <rect width="900" height="1500" fill="#ffffff"/>',
    '  <rect width="900" height="220" fill="#0f172a"/>',
    '  <text x="70" y="100" fill="#ffd23f" font-family="Arial, Helvetica, sans-serif" font-size="30" letter-spacing="6">BRIGHT SPARK</text>',
    '  <text x="70" y="170" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700">Price list</text>',
    '  <g font-family="Arial, Helvetica, sans-serif">',
    '    <text x="70" y="330" fill="#0f172a" font-size="30" font-weight="700">HAIR</text>',
    '    <text x="70" y="400" fill="#334155" font-size="27">Cut &amp; finish</text>',
    '    <text x="830" y="400" fill="#1d4ed8" font-size="27" font-weight="700" text-anchor="end">R250</text>',
    '    <text x="70" y="460" fill="#334155" font-size="27">Blow dry</text>',
    '    <text x="830" y="460" fill="#1d4ed8" font-size="27" font-weight="700" text-anchor="end">R180</text>',
    '    <text x="70" y="520" fill="#334155" font-size="27">Full colour</text>',
    '    <text x="830" y="520" fill="#1d4ed8" font-size="27" font-weight="700" text-anchor="end">R650</text>',
    '    <line x1="70" y1="580" x2="830" y2="580" stroke="#e2e8f0" stroke-width="2"/>',
    '    <text x="70" y="680" fill="#0f172a" font-size="30" font-weight="700">NAILS</text>',
    '    <text x="70" y="750" fill="#334155" font-size="27">Classic manicure</text>',
    '    <text x="830" y="750" fill="#1d4ed8" font-size="27" font-weight="700" text-anchor="end">R160</text>',
    '    <text x="70" y="810" fill="#334155" font-size="27">Gel overlay</text>',
    '    <text x="830" y="810" fill="#1d4ed8" font-size="27" font-weight="700" text-anchor="end">R290</text>',
    '    <text x="70" y="870" fill="#334155" font-size="27">Pedicure</text>',
    '    <text x="830" y="870" fill="#1d4ed8" font-size="27" font-weight="700" text-anchor="end">R200</text>',
    '    <line x1="70" y1="930" x2="830" y2="930" stroke="#e2e8f0" stroke-width="2"/>',
    '    <text x="70" y="1030" fill="#0f172a" font-size="30" font-weight="700">TREATMENTS</text>',
    '    <text x="70" y="1100" fill="#334155" font-size="27">Deep conditioning</text>',
    '    <text x="830" y="1100" fill="#1d4ed8" font-size="27" font-weight="700" text-anchor="end">R220</text>',
    '    <text x="70" y="1160" fill="#334155" font-size="27">Scalp treatment</text>',
    '    <text x="830" y="1160" fill="#1d4ed8" font-size="27" font-weight="700" text-anchor="end">R180</text>',
    '  </g>',
    '  <rect x="70" y="1260" width="760" height="140" rx="24" fill="#eef3ff"/>',
    '  <text x="450" y="1320" fill="#1d4ed8" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" text-anchor="middle">Prices updated monthly</text>',
    '  <text x="450" y="1364" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="22" text-anchor="middle">Scan for this month&apos;s rates</text>',
    '</svg>',
  ].join('\n');
}

function buildLocationPosterSvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1500" viewBox="0 0 900 1500">',
    '  <defs>',
    '    <linearGradient id="mapbg" x1="0" y1="0" x2="0" y2="1">',
    '      <stop offset="0" stop-color="#eef3ff"/>',
    '      <stop offset="1" stop-color="#dbe7ff"/>',
    '    </linearGradient>',
    '  </defs>',
    '  <rect width="900" height="1500" fill="url(#mapbg)"/>',
    '  <rect x="60" y="80" width="780" height="780" rx="32" fill="#c7d7fe"/>',
    '  <path d="M100 520 Q300 420 500 560 T860 480" stroke="#93a9f7" stroke-width="22" fill="none"/>',
    '  <path d="M80 300 Q280 380 460 300 T840 340" stroke="#a5b8f9" stroke-width="16" fill="none"/>',
    '  <path d="M200 120 L260 800" stroke="#b4c5fb" stroke-width="14" fill="none"/>',
    '  <path d="M600 90 L560 820" stroke="#b4c5fb" stroke-width="14" fill="none"/>',
    '  <circle cx="450" cy="470" r="56" fill="#1d4ed8" opacity="0.25"/>',
    '  <circle cx="450" cy="450" r="34" fill="#1d4ed8"/>',
    '  <circle cx="450" cy="450" r="14" fill="#ffffff"/>',
    '  <rect x="470" y="430" width="220" height="58" rx="14" fill="#ffffff"/>',
    '  <text x="580" y="467" fill="#0f172a" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" text-anchor="middle">You are here</text>',
    '  <text x="70" y="980" fill="#1d4ed8" font-family="Arial, Helvetica, sans-serif" font-size="30" letter-spacing="6">FIND US</text>',
    '  <text x="70" y="1090" fill="#0f172a" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700">Corner of Main</text>',
    '  <text x="70" y="1180" fill="#0f172a" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700">&amp; Market Street</text>',
    '  <text x="70" y="1260" fill="#4b5b76" font-family="Arial, Helvetica, sans-serif" font-size="30">Open Mon - Sat, 08:00 - 18:00</text>',
    '  <rect x="70" y="1320" width="760" height="110" rx="24" fill="#1d4ed8"/>',
    '  <text x="450" y="1390" fill="#ffd23f" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" text-anchor="middle">Scan for directions</text>',
    '</svg>',
  ].join('\n');
}

function buildContactSvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1500" viewBox="0 0 900 1500">',
    '  <rect width="900" height="1500" fill="#0f172a"/>',
    '  <circle cx="450" cy="320" r="160" fill="#1d4ed8"/>',
    '  <circle cx="450" cy="280" r="56" fill="#e2e8f0"/>',
    '  <path d="M340 420 Q450 520 560 420" stroke="#e2e8f0" stroke-width="36" fill="none" stroke-linecap="round"/>',
    '  <text x="450" y="600" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="700" text-anchor="middle">Naledi Mokoena</text>',
    '  <text x="450" y="660" fill="#ffd23f" font-family="Arial, Helvetica, sans-serif" font-size="30" text-anchor="middle" letter-spacing="4">EVENTS &amp; BOOKINGS</text>',
    '  <g font-family="Arial, Helvetica, sans-serif" fill="#c3d3ff" font-size="30">',
    '    <text x="450" y="800" text-anchor="middle">hello@naledi-events.co.za</text>',
    '    <text x="450" y="870" text-anchor="middle">+27 82 555 0147</text>',
    '    <text x="450" y="940" text-anchor="middle">@naledi.events</text>',
    '  </g>',
    '  <rect x="70" y="1050" width="760" height="4" fill="#1e3a8a"/>',
    '  <text x="450" y="1170" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" text-anchor="middle">Save this card</text>',
    '  <text x="450" y="1230" fill="#9fb6ef" font-family="Arial, Helvetica, sans-serif" font-size="26" text-anchor="middle">Scan once, keep the number forever</text>',
    '  <rect x="70" y="1320" width="760" height="110" rx="24" fill="#ffd23f"/>',
    '  <text x="450" y="1390" fill="#1e1b04" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" text-anchor="middle">Same code, new details anytime</text>',
    '</svg>',
  ].join('\n');
}

export function createSampleMenuDataUrl(): string {
  return encodeSvg(buildSampleMenuSvg());
}

export function createPromotionDataUrl(): string {
  return encodeSvg(buildPromotionSvg());
}

export function createPriceListDataUrl(): string {
  return encodeSvg(buildPriceListSvg());
}

export function createLocationPosterDataUrl(): string {
  return encodeSvg(buildLocationPosterSvg());
}

export function createContactCardDataUrl(): string {
  return encodeSvg(buildContactSvg());
}

export interface DemoPicture {
  id: string;
  label: string;
  caption: string;
  imageUrl: string;
}

export function getDemoPictures(): DemoPicture[] {
  return [
    {
      id: 'wifi',
      label: 'FREE WIFI poster',
      caption: 'The built-in demo picture, ready to print.',
      imageUrl: createFreeWifiPosterDataUrl(),
    },
    {
      id: 'menu',
      label: 'Restaurant menu',
      caption: 'A lunch menu for the counter stand.',
      imageUrl: createSampleMenuDataUrl(),
    },
    {
      id: 'promo',
      label: 'Special promotion',
      caption: "This week's offer, swapped in seconds.",
      imageUrl: createPromotionDataUrl(),
    },
    {
      id: 'prices',
      label: 'Price list',
      caption: 'Updated rates without a reprint.',
      imageUrl: createPriceListDataUrl(),
    },
    {
      id: 'location',
      label: 'Location poster',
      caption: 'Directions for visitors and drivers.',
      imageUrl: createLocationPosterDataUrl(),
    },
    {
      id: 'contact',
      label: 'Contact card',
      caption: 'One scan saves every detail.',
      imageUrl: createContactCardDataUrl(),
    },
  ];
}
