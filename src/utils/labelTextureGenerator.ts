import * as THREE from 'three';
import { Product } from '../types';

// ─────────────────────────────────────────────────
// PALETTE RESOLVER
// ─────────────────────────────────────────────────
interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  bgTop: string;
  bgBottom: string;
  text: string;
  flavorEmoji: string;
}

function getPalette(product?: Partial<Product> | null): Palette {
  const n = (product?.name || '').toLowerCase();
  const f = (product?.flavor || '').toLowerCase();

  if (n.includes('guava') || f.includes('guava')) {
    return { primary: '#C0175A', secondary: '#E8538B', accent: '#FFB8D0',
      bgTop: '#FFF0F5', bgBottom: '#FFD6E5', text: '#5C0024', flavorEmoji: '🍈' };
  }
  if (n.includes('pineapple') || f.includes('pineapple')) {
    return { primary: '#C08C00', secondary: '#E5A900', accent: '#FFDE59',
      bgTop: '#FFFBEB', bgBottom: '#FFF3B0', text: '#5C4000', flavorEmoji: '🍍' };
  }
  if (n.includes('water') || n.includes('mineral')) {
    return { primary: '#0065A8', secondary: '#0099D6', accent: '#90E0EF',
      bgTop: '#EFF9FF', bgBottom: '#BDE9FF', text: '#003358', flavorEmoji: '💧' };
  }
  if (n.includes('aloe') || f.includes('aloe')) {
    return { primary: '#138443', secondary: '#8CC63E', accent: '#D4ED91',
      bgTop: '#F5FBF0', bgBottom: '#DDF0C6', text: '#0B3D22', flavorEmoji: '🌿' };
  }
  if (n.includes('candy') || f.includes('candy') || f.includes('berry')) {
    return { primary: '#C0175A', secondary: '#F7941D', accent: '#FFDE59',
      bgTop: '#FFF0F8', bgBottom: '#FFD6EE', text: '#5C0024', flavorEmoji: '🍬' };
  }
  if (n.includes('jelly') || f.includes('jelly')) {
    return { primary: '#C0175A', secondary: '#8CC63E', accent: '#FFB400',
      bgTop: '#FFF4F8', bgBottom: '#FFE0EA', text: '#5C0024', flavorEmoji: '🍮' };
  }
  // Default: mango / orange
  return { primary: '#138443', secondary: '#F7941D', accent: '#FFDE59',
    bgTop: '#FFFBEB', bgBottom: '#FFF1C2', text: '#183D2B', flavorEmoji: '🥭' };
}

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function fillRoundRectTop(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  // Rounded top corners only
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  ctx.fill();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number, maxW: number, lineH: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  words.forEach((word, i) => {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW && i > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = word + ' ';
      curY += lineH;
    } else {
      line = test;
    }
  });
  ctx.fillText(line.trim(), x, curY);
}

// ─────────────────────────────────────────────────
// MAIN LABEL GENERATOR — portrait 1024 × 2048
// Wraps cleanly on cylinder UV (U=0→1 horizontal, V=0→1 vertical)
// ─────────────────────────────────────────────────
export function createProductLabelTexture(product?: Partial<Product> | null): THREE.CanvasTexture {
  // Portrait canvas maps better onto a vertical cylinder label
  const W = 1024;
  const H = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const pal = getPalette(product);

  const name       = (product?.name || 'Juci Cool Drink').toUpperCase();
  const flavor     = product?.flavor || 'Mango';
  const packSize   = product?.pack_size || '250 ml';

  // ══════════════════════════════════════════
  // 1. BACKGROUND GRADIENT (top→bottom)
  // ══════════════════════════════════════════
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0,    pal.bgTop);
  bg.addColorStop(0.45, pal.bgBottom);
  bg.addColorStop(1,    pal.bgTop);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle center radial glow
  const glow = ctx.createRadialGradient(W / 2, H * 0.38, 50, W / 2, H * 0.38, 420);
  glow.addColorStop(0, pal.secondary + '22');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Diagonal stripe texture (very faint)
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = pal.primary;
  for (let i = -H; i < W + H; i += 55) {
    ctx.beginPath();
    ctx.moveTo(i, 0); ctx.lineTo(i + 28, 0);
    ctx.lineTo(i + 28 + H, H); ctx.lineTo(i + H, H);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // ══════════════════════════════════════════
  // GOLD GRADIENT (reusable)
  // ══════════════════════════════════════════
  const goldGrad = ctx.createLinearGradient(0, 0, W, 0);
  goldGrad.addColorStop(0,    '#8B6914');
  goldGrad.addColorStop(0.25, '#FFD700');
  goldGrad.addColorStop(0.5,  '#8B6914');
  goldGrad.addColorStop(0.75, '#FFD700');
  goldGrad.addColorStop(1,    '#8B6914');

  // ══════════════════════════════════════════
  // 2. TOP HEADER BAR
  // ══════════════════════════════════════════
  ctx.fillStyle = pal.primary;
  ctx.fillRect(0, 0, W, 168);
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 168, W, 8);

  // Brand Name "JUCI" + "COOL" stacked
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = '6px';

  // Drop shadow for punch
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 88px Arial, sans-serif';
  ctx.fillText('JUCI', W / 2, 90);

  ctx.fillStyle = pal.accent;
  ctx.font = 'bold 80px Arial, sans-serif';
  ctx.fillText('COOL', W / 2, 162);

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.letterSpacing = '0px';

  // ══════════════════════════════════════════
  // 3. FLAVOR BADGE — full-width pill
  // ══════════════════════════════════════════
  const badgeY = 198;
  ctx.fillStyle = pal.secondary;
  fillRoundRect(ctx, 50, badgeY, W - 100, 110, 55);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(50, badgeY, W - 100, 110, 55);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 62px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pal.flavorEmoji + '  ' + flavor.toUpperCase(), W / 2, badgeY + 55);

  // ══════════════════════════════════════════
  // 4. PRODUCT NAME
  // ══════════════════════════════════════════
  ctx.fillStyle = pal.text;
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  let displayName = name.startsWith('JUCI COOL ') ? name.slice(10) : name;
  wrapText(ctx, displayName, W / 2, 370, W - 80, 58);

  // Separator
  ctx.strokeStyle = pal.primary + '44';
  ctx.lineWidth = 2;
  ctx.setLineDash([14, 9]);
  ctx.beginPath();
  ctx.moveTo(60, 460); ctx.lineTo(W - 60, 460);
  ctx.stroke();
  ctx.setLineDash([]);

  // ══════════════════════════════════════════
  // 5. QUALITY SEAL CIRCLE
  // ══════════════════════════════════════════
  const sealCX = W / 2;
  const sealCY = 612;
  const sealR  = 128;

  // Outer glow
  const sealGlow = ctx.createRadialGradient(sealCX, sealCY, sealR * 0.5, sealCX, sealCY, sealR * 1.5);
  sealGlow.addColorStop(0, pal.accent + '55');
  sealGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sealGlow;
  ctx.beginPath();
  ctx.arc(sealCX, sealCY, sealR * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // White circle with shadow
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(sealCX, sealCY, sealR, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Primary ring
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(sealCX, sealCY, sealR, 0, Math.PI * 2);
  ctx.stroke();

  // Accent inner ring
  ctx.strokeStyle = pal.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sealCX, sealCY, sealR - 14, 0, Math.PI * 2);
  ctx.stroke();

  // Stars around ring
  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    ctx.fillStyle = pal.secondary;
    ctx.fillText('★', sealCX + (sealR + 26) * Math.cos(a), sealCY + (sealR + 26) * Math.sin(a));
  }

  // Seal text
  ctx.fillStyle = pal.primary;
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100%', sealCX, sealCY - 46);

  ctx.fillStyle = pal.secondary;
  ctx.font = 'bold 50px Arial, sans-serif';
  ctx.fillText('PURE', sealCX, sealCY + 4);

  ctx.fillStyle = pal.text;
  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.fillText('FRUIT PULP', sealCX, sealCY + 48);

  // ══════════════════════════════════════════
  // 6. PACK SIZE + VEG MARK
  // ══════════════════════════════════════════
  const rowY2 = 796;
  // Veg symbol
  ctx.strokeStyle = '#22A845';
  ctx.lineWidth = 5;
  ctx.strokeRect(W / 2 - 228, rowY2, 52, 52);
  ctx.fillStyle = '#22A845';
  ctx.beginPath();
  ctx.arc(W / 2 - 228 + 26, rowY2 + 26, 14, 0, Math.PI * 2);
  ctx.fill();

  // Pack size pill
  ctx.fillStyle = pal.primary;
  fillRoundRect(ctx, W / 2 - 155, rowY2, 340, 56, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`NET QTY: ${packSize}`, W / 2 + 15, rowY2 + 28);

  // Tagline
  ctx.fillStyle = pal.text + 'BB';
  ctx.font = 'italic 32px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Real Fruit. Real Taste. 🍃', W / 2, 920);

  // ══════════════════════════════════════════
  // 7. SERVE CHILLED RIBBON
  // ══════════════════════════════════════════
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 958, W, 5);
  ctx.fillStyle = pal.primary + 'EE';
  ctx.fillRect(0, 963, W, 72);
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 1035, W, 5);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '2px';
  ctx.fillText('❄  BEST SERVED CHILLED  ❄', W / 2, 999);
  ctx.letterSpacing = '0px';

  // ══════════════════════════════════════════
  // 8. NUTRITION FACTS (compact card)
  // ══════════════════════════════════════════
  const nutY = 1058;
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 14;
  fillRoundRect(ctx, 36, nutY, W - 72, 360, 22);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = pal.primary + '33';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(36, nutY, W - 72, 360, 22);
  ctx.stroke();

  // Card header
  ctx.fillStyle = pal.primary;
  fillRoundRectTop(ctx, 36, nutY, W - 72, 58, 22);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NUTRITIONAL FACTS  (per 100 ml)', W / 2, nutY + 29);

  const nutrients: [string, string][] = [
    ['Energy',        '54 kcal'],
    ['Carbohydrates', '13.2 g'],
    ['Total Sugars',  '12.4 g'],
    ['Protein',       '0.2 g'],
    ['Fat',           '0.0 g'],
    ['Vitamin C',     '24 mg'],
  ];

  ctx.textBaseline = 'alphabetic';
  let ny = nutY + 90;
  nutrients.forEach(([key, val], idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#F7FCF4' : '#FFFFFF';
    ctx.fillRect(38, ny - 28, W - 76, 50);
    ctx.fillStyle = pal.text;
    ctx.font = '500 30px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(key, 68, ny);
    ctx.fillStyle = pal.primary;
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(val, W - 68, ny);
    ny += 50;
  });

  // ══════════════════════════════════════════
  // 9. INGREDIENTS
  // ══════════════════════════════════════════
  const ingY = 1462;
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.07)';
  ctx.shadowBlur = 12;
  fillRoundRect(ctx, 36, ingY, W - 72, 250, 22);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = pal.primary + '33';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(36, ingY, W - 72, 250, 22);
  ctx.stroke();

  ctx.fillStyle = pal.primary;
  ctx.font = 'bold 30px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('INGREDIENTS:', 68, ingY + 44);
  ctx.fillStyle = '#555';
  ctx.font = '500 26px Arial, sans-serif';
  ctx.fillText('Treated Water, Fruit Pulp (25%), Sugar,', 68, ingY + 86);
  ctx.fillText('Acidity Regulator (INS 330), Ascorbic', 68, ingY + 120);
  ctx.fillText('Acid (Vit. C), Natural Colors & Flavors.', 68, ingY + 154);
  ctx.fillStyle = '#C0175A';
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.fillText('Store cool & dry. Shake before serve.', 68, ingY + 210);

  // ══════════════════════════════════════════
  // 10. MFG INFO
  // ══════════════════════════════════════════
  const mfgY = 1730;
  ctx.fillStyle = '#F4F9F4';
  fillRoundRect(ctx, 36, mfgY, W - 72, 190, 18);
  ctx.strokeStyle = pal.primary + '33';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(36, mfgY, W - 72, 190, 18);
  ctx.stroke();

  ctx.fillStyle = pal.primary;
  ctx.font = 'bold 25px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('MFG: JDM FRUIT PRODUCTS PVT. LTD.', 66, mfgY + 38);
  ctx.fillStyle = '#444';
  ctx.font = '500 23px Arial, sans-serif';
  ctx.fillText('IDA Cherlapally, Hyderabad - 500051, TG', 66, mfgY + 74);
  ctx.fillText('FSSAI: 13624999000123', 66, mfgY + 108);
  ctx.fillText('Consumer Care: +91 93931 22122', 66, mfgY + 142);
  ctx.fillText('Email: care@jucicool.com', 66, mfgY + 176);

  // ══════════════════════════════════════════
  // 11. BOTTOM FOOTER
  // ══════════════════════════════════════════
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, H - 88, W, 5);
  ctx.fillStyle = pal.primary;
  ctx.fillRect(0, H - 83, W, 83);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 25px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '1px';
  ctx.fillText('♻ RECYCLABLE  •  100% AUTHENTIC  •  HYDERABAD', W / 2, H - 43);
  ctx.letterSpacing = '0px';

  // ══════════════════════════════════════════
  // 12. THREE.JS TEXTURE
  // ══════════════════════════════════════════
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
