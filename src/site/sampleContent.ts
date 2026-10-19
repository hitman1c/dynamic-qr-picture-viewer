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
    '  <text x="70" y="314" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="98" font-weight="700">Today\'s</text>',
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

export function createSampleMenuDataUrl(): string {
  return encodeSvg(buildSampleMenuSvg());
}
