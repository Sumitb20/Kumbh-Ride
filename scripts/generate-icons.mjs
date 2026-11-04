// Generate PNG icons for PWA from SVG template
// Run with: node scripts/generate-icons.mjs

import { writeFileSync } from 'fs';

// Create a simple PNG-compatible SVG for each size and write as SVG
// In production, these would be proper PNG files generated with sharp/canvas

function createIconSVG(size, maskable = false) {
  const padding = maskable ? size * 0.1 : 0;
  const bgSize = size;
  const textSize = Math.round(size * 0.35);
  const subTextSize = Math.round(size * 0.12);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${bgSize}" height="${bgSize}" viewBox="0 0 ${bgSize} ${bgSize}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F97316"/>
      <stop offset="100%" style="stop-color:#C2410C"/>
    </linearGradient>
  </defs>
  <rect width="${bgSize}" height="${bgSize}" rx="${maskable ? 0 : Math.round(size * 0.15)}" fill="url(#bg)"/>
  <text x="${bgSize/2}" y="${bgSize * 0.52}" font-family="sans-serif" font-size="${textSize}" font-weight="800" fill="white" text-anchor="middle" dominant-baseline="middle">कुंभ</text>
  <text x="${bgSize/2}" y="${bgSize * 0.78}" font-family="sans-serif" font-size="${subTextSize}" font-weight="700" fill="rgba(255,255,255,0.9)" text-anchor="middle" dominant-baseline="middle">Ride</text>
</svg>`;
}

// Write SVG icons (these work as PWA icons in modern browsers)
writeFileSync('public/icon-192.svg', createIconSVG(192));
writeFileSync('public/icon-512.svg', createIconSVG(512));
writeFileSync('public/icon-maskable.svg', createIconSVG(512, true));
writeFileSync('public/apple-touch-icon.svg', createIconSVG(180));

console.log('SVG icons generated. For production PNG icons, use a tool like sharp or squoosh.');
console.log('Files created:');
console.log('  public/icon-192.svg');
console.log('  public/icon-512.svg');
console.log('  public/icon-maskable.svg');
console.log('  public/apple-touch-icon.svg');

