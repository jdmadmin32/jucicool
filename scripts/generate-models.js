import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill FileReader for Node.js
class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      this.onloadend && this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = 'data:' + (blob.type || 'application/octet-stream') + ';base64,' + Buffer.from(buf).toString('base64');
      this.onloadend && this.onloadend();
    });
  }
}
globalThis.FileReader = NodeFileReader;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../public/models');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper to export scene to GLB
async function exportToGlb(scene, filename) {
  const exporter = new GLTFExporter();
  const glb = await exporter.parseAsync(scene, { binary: true });
  const outPath = path.join(outputDir, filename);
  fs.writeFileSync(outPath, Buffer.from(glb));
  console.log(`Exported ${filename} (${fs.statSync(outPath).size} bytes)`);
}

// 1. Create realistic Lathe Bottle geometry
function createBottlePoints() {
  const points = [];
  // Bottom base
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.5, 0.02));
  points.push(new THREE.Vector2(0.55, 0.08));
  // Body cylinder
  points.push(new THREE.Vector2(0.58, 0.3));
  points.push(new THREE.Vector2(0.56, 0.7));
  points.push(new THREE.Vector2(0.57, 1.2));
  // Shoulder curve
  points.push(new THREE.Vector2(0.55, 1.4));
  points.push(new THREE.Vector2(0.45, 1.6));
  points.push(new THREE.Vector2(0.3, 1.8));
  // Neck
  points.push(new THREE.Vector2(0.22, 1.95));
  points.push(new THREE.Vector2(0.22, 2.2));
  // Neck rim ring
  points.push(new THREE.Vector2(0.25, 2.22));
  points.push(new THREE.Vector2(0.22, 2.24));
  points.push(new THREE.Vector2(0.22, 2.35));
  points.push(new THREE.Vector2(0, 2.35));
  return points;
}

// Build standard bottle
function buildBottle({ juiceColor, capColor, labelColor, labelText, transparency = 0.85, roughness = 0.15 }) {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // Bottle points
  const points = createBottlePoints();
  const bottleGeo = new THREE.LatheGeometry(points, 48);
  const bottleMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: transparency,
    roughness: roughness,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.4
  });
  const bottleMesh = new THREE.Mesh(bottleGeo, bottleMat);
  group.add(bottleMesh);

  // Juice volume inside
  const juicePoints = points.slice(1, points.length - 2).map(p => new THREE.Vector2(p.x * 0.94, p.y));
  juicePoints.push(new THREE.Vector2(0, 1.9));
  const juiceGeo = new THREE.LatheGeometry(juicePoints, 36);
  const juiceMat = new THREE.MeshStandardMaterial({
    color: juiceColor,
    roughness: 0.3,
    metalness: 0.05
  });
  const juiceMesh = new THREE.Mesh(juiceGeo, juiceMat);
  group.add(juiceMesh);

  // Label cylinder
  const labelGeo = new THREE.CylinderGeometry(0.582, 0.582, 0.85, 48, 1, true);
  const labelMat = new THREE.MeshStandardMaterial({
    color: labelColor,
    roughness: 0.35,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.name = 'ProductLabel';
  labelMesh.position.y = 0.95;
  group.add(labelMesh);

  // Decorative label band rings (Top and Bottom gold/dark border)
  const topRingGeo = new THREE.TorusGeometry(0.582, 0.012, 16, 48);
  topRingGeo.rotateX(Math.PI / 2);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x183D2B, metalness: 0.6, roughness: 0.3 });
  const topRing = new THREE.Mesh(topRingGeo, ringMat);
  topRing.position.y = 1.375;
  group.add(topRing);

  const bottomRing = topRing.clone();
  bottomRing.position.y = 0.525;
  group.add(bottomRing);

  // Bottle Cap
  const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 32);
  const capMat = new THREE.MeshStandardMaterial({
    color: capColor,
    roughness: 0.25,
    metalness: 0.2
  });
  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.position.y = 2.45;
  group.add(capMesh);

  // Cap ridges
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const ridgeGeo = new THREE.BoxGeometry(0.015, 0.18, 0.015);
    const ridge = new THREE.Mesh(ridgeGeo, capMat);
    ridge.position.set(Math.cos(angle) * 0.24, 2.45, Math.sin(angle) * 0.24);
    group.add(ridge);
  }

  // Center model origin
  group.position.y = -1.2;
  scene.add(group);
  return scene;
}

// 2. Build Stand-Up Spout Pouch
function buildPouch({ pouchColor, capColor, labelColor }) {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // Stand-up Pouch body geometry
  // Shaped with a rounded puffed box
  const pouchGeo = new THREE.BoxGeometry(1.0, 1.5, 0.45, 12, 16, 8);
  const pos = pouchGeo.attributes.position;
  // Modify vertices to create authentic stand-up pouch shape
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Taper at bottom and top seal
    const normY = (y + 0.75) / 1.5; // 0 at bottom, 1 at top
    let pinch = 1.0;
    if (normY > 0.85) {
      // Top sealed rim
      pinch = (1 - normY) / 0.15 * 0.7 + 0.3;
      pos.setZ(i, z * 0.2); // flat top heat seal
    } else if (normY < 0.15) {
      // Bottom gusset
      pos.setZ(i, z * (0.5 + 0.5 * (normY / 0.15)));
    } else {
      // Puffed center
      const belly = Math.sin(normY * Math.PI);
      pos.setZ(i, z * (1 + belly * 0.35));
    }
  }
  pouchGeo.computeVertexNormals();

  const pouchMat = new THREE.MeshStandardMaterial({
    color: pouchColor,
    roughness: 0.3,
    metalness: 0.15
  });
  const pouchMesh = new THREE.Mesh(pouchGeo, pouchMat);
  pouchMesh.name = 'ProductLabel';
  pouchMesh.position.y = 0.75;
  group.add(pouchMesh);

  // Top Spout Plastic base
  const spoutGeo = new THREE.CylinderGeometry(0.08, 0.11, 0.18, 24);
  const spoutMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const spout = new THREE.Mesh(spoutGeo, spoutMat);
  spout.position.set(0, 1.58, 0);
  group.add(spout);

  // Spout Cap
  const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.14, 24);
  const capMat = new THREE.MeshStandardMaterial({ color: capColor, roughness: 0.25 });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.set(0, 1.72, 0);
  group.add(cap);

  // Sealed side edges
  const edgeGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 12);
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0xe0e5db, metalness: 0.3 });
  const leftEdge = new THREE.Mesh(edgeGeo, edgeMat);
  leftEdge.position.set(-0.51, 0.75, 0);
  group.add(leftEdge);

  const rightEdge = new THREE.Mesh(edgeGeo, edgeMat);
  rightEdge.position.set(0.51, 0.75, 0);
  group.add(rightEdge);

  group.position.y = -0.9;
  scene.add(group);
  return scene;
}

// 3. Build Candy Pillow Pouch
function buildCandyPack({ bagColor, accentColor }) {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  const bagGeo = new THREE.BoxGeometry(1.1, 1.3, 0.45, 16, 16, 8);
  const pos = bagGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const normY = (y + 0.65) / 1.3;
    if (normY < 0.1 || normY > 0.9) {
      // Crimped top/bottom seals
      pos.setZ(i, z * 0.1);
      pos.setX(i, x * 1.05);
    } else {
      const puff = Math.sin(normY * Math.PI);
      pos.setZ(i, z * (1 + puff * 0.4));
    }
  }
  bagGeo.computeVertexNormals();

  const bagMat = new THREE.MeshStandardMaterial({
    color: bagColor,
    roughness: 0.25,
    metalness: 0.25
  });
  const bagMesh = new THREE.Mesh(bagGeo, bagMat);
  bagMesh.name = 'ProductLabel';
  bagMesh.position.y = 0.65;
  group.add(bagMesh);

  // Accent badge
  const badgeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
  badgeGeo.rotateX(Math.PI / 2);
  const badgeMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.3 });
  const badge = new THREE.Mesh(badgeGeo, badgeMat);
  badge.position.set(0, 0.65, 0.24);
  group.add(badge);

  group.position.y = -0.65;
  scene.add(group);
  return scene;
}

// 4. Build Dessert Jelly Tub
function buildJellyTub({ jellyColor, lidColor }) {
  const scene = new THREE.Scene();
  const group = new THREE.Group();

  // Tub body (conical cup)
  const tubGeo = new THREE.CylinderGeometry(0.7, 0.5, 0.75, 36);
  const tubMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.75,
    roughness: 0.1,
    transmission: 0.6
  });
  const tubMesh = new THREE.Mesh(tubGeo, tubMat);
  tubMesh.position.y = 0.375;
  group.add(tubMesh);

  // Jelly inside
  const jellyGeo = new THREE.CylinderGeometry(0.66, 0.47, 0.65, 32);
  const jellyMat = new THREE.MeshStandardMaterial({
    color: jellyColor,
    roughness: 0.2,
    metalness: 0.1
  });
  const jelly = new THREE.Mesh(jellyGeo, jellyMat);
  jelly.position.y = 0.34;
  group.add(jelly);

  // Rim ring
  const rimGeo = new THREE.TorusGeometry(0.71, 0.03, 16, 36);
  rimGeo.rotateX(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({ color: lidColor, roughness: 0.3 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 0.75;
  group.add(rim);

  // Lid on top
  const lidGeo = new THREE.CylinderGeometry(0.73, 0.73, 0.06, 36);
  const lid = new THREE.Mesh(lidGeo, rimMat);
  lid.position.y = 0.78;
  group.add(lid);

  group.position.y = -0.4;
  scene.add(group);
  return scene;
}

async function generateAllModels() {
  console.log('Generating 3D models for all catalog products...');

  // 1. Mango Bottle
  await exportToGlb(
    buildBottle({
      juiceColor: 0xF7941D, // Mango Orange
      capColor: 0x138443,   // Juci Cool Emerald Green
      labelColor: 0xFCB040, // Warm mango gold label
      transparency: 0.8
    }),
    'mango-bottle.glb'
  );

  // 2. Mango Pouch
  await exportToGlb(
    buildPouch({
      pouchColor: 0xFF9E1B,
      capColor: 0x138443,
      labelColor: 0x8CC63E
    }),
    'mango-pouch.glb'
  );

  // 3. Pink Guava Bottle
  await exportToGlb(
    buildBottle({
      juiceColor: 0xEE5D7B, // Rosy Pink Guava
      capColor: 0x138443,   // Emerald Green Cap
      labelColor: 0xF78DA7, // Soft guava pink label
      transparency: 0.82
    }),
    'guava-bottle.glb'
  );

  // 4. Pineapple Juice Bottle
  await exportToGlb(
    buildBottle({
      juiceColor: 0xF5C400, // Golden Pineapple Yellow
      capColor: 0x8CC63E,   // Lime Green Cap
      labelColor: 0xFFDE59, // Bright pineapple label
      transparency: 0.78
    }),
    'pineapple-bottle.glb'
  );

  // 5. Natural Mineral Water
  await exportToGlb(
    buildBottle({
      juiceColor: 0x00A8E8, // Glacier blue water tint
      capColor: 0x0077B6,   // Ocean blue cap
      labelColor: 0xE0F4FF, // Crystal clean label
      transparency: 0.92,
      roughness: 0.05
    }),
    'mineral-water.glb'
  );

  // 6. Aloe Vera & Pineapple Drink
  await exportToGlb(
    buildBottle({
      juiceColor: 0xA7D46F, // Natural aloe-lime refreshing hue
      capColor: 0x138443,   // Juci Cool signature green
      labelColor: 0xCDE89E, // Crisp botanical label
      transparency: 0.85
    }),
    'aloe-pineapple.glb'
  );

  // 7. Flavored Candy Pack
  await exportToGlb(
    buildCandyPack({
      bagColor: 0xEA245D,   // Bold berry-mango candy pouch
      accentColor: 0xFFC72C // Radiant candy yellow burst
    }),
    'candy-pack.glb'
  );

  // 8. Fruit Jelly Tub
  await exportToGlb(
    buildJellyTub({
      jellyColor: 0xE83151, // Luscious fruit jelly red
      lidColor: 0x138443    // Fresh green airtight lid
    }),
    'fruit-jelly.glb'
  );

  // 9. Default Juci Cool Bottle
  await exportToGlb(
    buildBottle({
      juiceColor: 0xF7941D,
      capColor: 0x138443,
      labelColor: 0x8CC63E,
      transparency: 0.85
    }),
    'beverage-default.glb'
  );

  console.log('All 9 GLB models generated successfully!');
}

generateAllModels().catch(err => {
  console.error('Model generation error:', err);
  process.exit(1);
});
