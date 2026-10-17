import * as THREE from 'three';
import { Product } from '../types';

export function createProductLabelTexture(product?: Partial<Product> | null): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const name = (product?.name || 'Juci Cool Mango Drink').toUpperCase();
  const flavor = (product?.flavor || 'Alphonso Mango').toUpperCase();
  const packSize = product?.pack_size || '250 ml';
  const pkgType = product?.packaging_type || 'PET Bottle';

  // Determine color palette based on product flavor/name
  let primaryColor = '#138443'; // Emerald green
  let secondaryColor = '#F7941D'; // Mango Orange
  let accentColor = '#FFDE59'; // Warm yellow
  let bgGradientStart = '#FFF9E6';
  let bgGradientEnd = '#FFF1C2';

  const lowerName = name.toLowerCase();
  if (lowerName.includes('guava') || (product?.flavor || '').toLowerCase().includes('guava')) {
    primaryColor = '#138443';
    secondaryColor = '#EE5D7B';
    accentColor = '#FFAAC1';
    bgGradientStart = '#FFF0F3';
    bgGradientEnd = '#FFE3E8';
  } else if (lowerName.includes('pineapple') || (product?.flavor || '').toLowerCase().includes('pineapple')) {
    primaryColor = '#138443';
    secondaryColor = '#E5A900';
    accentColor = '#FFDE59';
    bgGradientStart = '#FFFDEB';
    bgGradientEnd = '#FFF7B8';
  } else if (lowerName.includes('water') || lowerName.includes('mineral')) {
    primaryColor = '#0077B6';
    secondaryColor = '#00A8E8';
    accentColor = '#90E0EF';
    bgGradientStart = '#F0F9FF';
    bgGradientEnd = '#E0F2FE';
  } else if (lowerName.includes('aloe')) {
    primaryColor = '#138443';
    secondaryColor = '#8CC63E';
    accentColor = '#D4ED91';
    bgGradientStart = '#F5FAF0';
    bgGradientEnd = '#E6F4DB';
  } else if (lowerName.includes('candy')) {
    primaryColor = '#EA245D';
    secondaryColor = '#F7941D';
    accentColor = '#FFDE59';
    bgGradientStart = '#FFF0F5';
    bgGradientEnd = '#FFE4EC';
  } else if (lowerName.includes('jelly')) {
    primaryColor = '#E83151';
    secondaryColor = '#8CC63E';
    accentColor = '#FFB400';
    bgGradientStart = '#FFF4F6';
    bgGradientEnd = '#FFE5EA';
  }

  // 1. Overall Background
  const bgGrad = ctx.createLinearGradient(0, 0, 2048, 0);
  bgGrad.addColorStop(0, bgGradientStart);
  bgGrad.addColorStop(0.5, bgGradientEnd);
  bgGrad.addColorStop(1, bgGradientStart);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Decorative subtle background wave/curves
  ctx.fillStyle = primaryColor + '0A';
  ctx.beginPath();
  ctx.arc(1024, 512, 600, 0, Math.PI * 2);
  ctx.fill();

  // Top & Bottom Metallic Borders
  const goldGrad = ctx.createLinearGradient(0, 0, 2048, 0);
  goldGrad.addColorStop(0, '#D4AF37');
  goldGrad.addColorStop(0.25, '#FFF2B2');
  goldGrad.addColorStop(0.5, '#D4AF37');
  goldGrad.addColorStop(0.75, '#FFF2B2');
  goldGrad.addColorStop(1, '#D4AF37');

  // Top header ribbon
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, 2048, 70);
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 70, 2048, 14);

  // Bottom footer ribbon
  ctx.fillStyle = goldGrad;
  ctx.fillRect(0, 940, 2048, 14);
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 954, 2048, 70);

  // Header ribbon text repeated
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ 100% AUTHENTIC FRUIT GOODNESS ★ HYDERABAD PLANT ★ SERVE CHILLED ★', 1024, 45);
  ctx.fillText('RECYCLE FOR A GREENER TOMORROW • PREMIUM HYGIENE STANDARDS • KEEP CITY CLEAN', 1024, 995);

  // ==========================================
  // SECTION 2: FRONT CENTER LABEL (x: 600 to 1448)
  // ==========================================
  const centerX = 1024;

  // Main Brand Crest Box
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 6;
  ctx.beginPath();
  ctx.roundRect(centerX - 340, 130, 680, 140, 24);
  ctx.fill();
  ctx.restore();

  // Crest Gold Rim
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(centerX - 340, 130, 680, 140, 24);
  ctx.stroke();

  // Brand Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 76px Poppins, Montserrat, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('JUCI COOL', centerX, 222);

  // Brand Subtitle
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 22px Poppins, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('★ REAL FRUIT • REAL TASTE ★', centerX, 252);

  // Flavor Badge Pill
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.roundRect(centerX - 300, 310, 600, 75, 38);
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 42px Poppins, sans-serif';
  ctx.fillText(flavor, centerX, 362);

  // Product Full Name
  ctx.fillStyle = '#183D2B';
  ctx.font = 'bold 36px Poppins, sans-serif';
  ctx.fillText(name, centerX, 440);

  // Quality Tagline
  ctx.fillStyle = '#55695C';
  ctx.font = '600 24px Poppins, sans-serif';
  ctx.fillText('Crafted with Handpicked Orchard Harvests', centerX, 480);

  // Center Decorative Fruit Seal
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(centerX, 620, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 20px Poppins, sans-serif';
  ctx.fillText('100% PURE', centerX, 580);
  ctx.fillStyle = secondaryColor;
  ctx.font = '900 36px Poppins, sans-serif';
  ctx.fillText('FRUIT', centerX, 620);
  ctx.fillStyle = '#183D2B';
  ctx.font = 'bold 18px Poppins, sans-serif';
  ctx.fillText('PULP', centerX, 655);
  ctx.restore();

  // Net Quantity & Veg Mark
  // Green Veg Mark (Square with Circle)
  const vegX = centerX - 260;
  const vegY = 770;
  ctx.strokeStyle = '#138443';
  ctx.lineWidth = 4;
  ctx.strokeRect(vegX, vegY, 50, 50);
  ctx.fillStyle = '#138443';
  ctx.beginPath();
  ctx.arc(vegX + 25, vegY + 25, 14, 0, Math.PI * 2);
  ctx.fill();

  // Net Quantity Pill
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.roundRect(centerX - 150, 765, 300, 60, 30);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px Poppins, sans-serif';
  ctx.fillText(`NET QTY: ${packSize}`, centerX, 806);

  // Serve Chilled Badge
  ctx.fillStyle = '#183D2B';
  ctx.font = 'bold 22px Poppins, sans-serif';
  ctx.fillText('❄ BEST SERVED CHILLED • SHAKE WELL', centerX, 875);

  // ==========================================
  // SECTION 1: LEFT PANEL - NUTRITION FACTS (x: 80 to 520)
  // ==========================================
  const leftX = 100;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(leftX, 140, 420, 750, 20);
  ctx.fill();
  ctx.strokeStyle = '#E6EBDD';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Nutrition Title
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.roundRect(leftX, 140, 420, 65, [20, 20, 0, 0]);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NUTRITIONAL FACTS', leftX + 210, 183);

  ctx.fillStyle = '#68756B';
  ctx.font = '500 18px Poppins, sans-serif';
  ctx.fillText('Approx. Values per 100 ml', leftX + 210, 235);

  // Table rows
  const nutrients = [
    ['Energy', '54 kcal'],
    ['Carbohydrates', '13.2 g'],
    ['Total Sugars', '12.4 g'],
    ['Added Sugars', '1.8 g'],
    ['Dietary Fiber', '0.6 g'],
    ['Protein', '0.2 g'],
    ['Fat (All types)', '0.0 g'],
    ['Vitamin C', '24.0 mg'],
    ['Potassium', '45.0 mg'],
    ['Sodium', '8.5 mg']
  ];

  ctx.textAlign = 'left';
  let rowY = 270;
  nutrients.forEach(([key, val], idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#F9FAF6' : '#FFFFFF';
    ctx.fillRect(leftX + 15, rowY - 22, 390, 36);

    ctx.fillStyle = '#183D2B';
    ctx.font = '600 20px Poppins, sans-serif';
    ctx.fillText(key, leftX + 25, rowY);

    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 20px Poppins, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(val, leftX + 395, rowY);
    ctx.textAlign = 'left';
    rowY += 40;
  });

  // Ingredients text
  ctx.fillStyle = '#183D2B';
  ctx.font = 'bold 18px Poppins, sans-serif';
  ctx.fillText('INGREDIENTS:', leftX + 25, 715);
  ctx.fillStyle = '#68756B';
  ctx.font = '500 16px Poppins, sans-serif';
  ctx.fillText('Treated Water, Authentic Fruit Pulp (25%),', leftX + 25, 742);
  ctx.fillText('Sugar, Acidity Regulator (INS 330),', leftX + 25, 768);
  ctx.fillText('Ascorbic Acid (Vitamin C), Natural Colors.', leftX + 25, 794);

  // Storage
  ctx.fillStyle = '#D9534F';
  ctx.font = 'bold 16px Poppins, sans-serif';
  ctx.fillText('Store in cool, dry & hygienic place.', leftX + 25, 845);

  // ==========================================
  // SECTION 3: RIGHT PANEL - MFG & BARCODE (x: 1528 to 1968)
  // ==========================================
  const rightX = 1528;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(rightX, 140, 420, 750, 20);
  ctx.fill();
  ctx.strokeStyle = '#E6EBDD';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Header
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.roundRect(rightX, 140, 420, 65, [20, 20, 0, 0]);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MFG & QUALITY SEAL', rightX + 210, 183);

  // FSSAI Logo
  ctx.fillStyle = '#183D2B';
  ctx.font = '900 48px Poppins, sans-serif';
  ctx.fillText('fssai', rightX + 210, 260);
  ctx.font = 'bold 20px Poppins, sans-serif';
  ctx.fillStyle = '#68756B';
  ctx.fillText('Lic. No. 13624999000123', rightX + 210, 295);

  // Manufacturer Details
  ctx.textAlign = 'left';
  ctx.fillStyle = '#183D2B';
  ctx.font = 'bold 20px Poppins, sans-serif';
  ctx.fillText('MANUFACTURED & MARKETED BY:', rightX + 30, 350);
  ctx.font = 'bold 22px Poppins, sans-serif';
  ctx.fillStyle = primaryColor;
  ctx.fillText('JDM FRUIT PRODUCTS PVT. LTD.', rightX + 30, 380);

  ctx.fillStyle = '#68756B';
  ctx.font = '500 18px Poppins, sans-serif';
  ctx.fillText('Plot No. 42, Food Processing Park,', rightX + 30, 415);
  ctx.fillText('IDA Cherlapally, Hyderabad - 500051', rightX + 30, 445);
  ctx.fillText('Telangana State, India.', rightX + 30, 475);
  ctx.fillText('Consumer Care: +91 98490 12345', rightX + 30, 510);
  ctx.fillText('Email: care@jucicool.com', rightX + 30, 540);

  // Batch & Dates
  ctx.fillStyle = '#F4F8F0';
  ctx.fillRect(rightX + 25, 570, 370, 100);
  ctx.strokeStyle = '#E6EBDD';
  ctx.strokeRect(rightX + 25, 570, 370, 100);

  ctx.fillStyle = '#183D2B';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('BN : JC/2026/04', rightX + 40, 602);
  ctx.fillText('MFD: 15/10/2026', rightX + 40, 630);
  ctx.fillText('USE BEFORE 6 MONTHS FROM MFD', rightX + 40, 656);

  // Realistic Barcode
  const barX = rightX + 40;
  const barY = 700;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(barX, barY, 340, 110);
  ctx.fillStyle = '#000000';

  // Draw authentic barcode bars
  const pattern = [3,1,2,1,4,2,1,3,2,1,3,2,1,4,1,2,3,1,2,4,1,3,2,1,3,2,1,4,2,1,3,1,2,1,4,2,1,3,2];
  let curX = barX + 15;
  for (let i = 0; i < pattern.length; i++) {
    const barWidth = pattern[i] * 2.2;
    if (i % 2 === 0) {
      ctx.fillRect(curX, barY + 10, barWidth, 70);
    }
    curX += barWidth + 2;
  }
  ctx.textAlign = 'center';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('8  901234  567890', rightX + 210, barY + 100);

  // Recycling Logo & Clean India mark
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 16px Poppins, sans-serif';
  ctx.fillText('♻ 100% RECYCLABLE PET BOTTLE', rightX + 210, 855);

  // Create Three.js CanvasTexture
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
