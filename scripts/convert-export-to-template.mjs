import { readFileSync, writeFileSync, existsSync } from 'fs';
import { getPlotLayout } from '../src/js/apartments.js';

const EXPORT_PATH = 'scripts/exported-3kk.json';
const OUT_PATH = 'scripts/template-3kk-furniture.json';

function stripForTemplate(item, offset) {
  const out = {
    type: item.type,
    x: round(item.x - offset.x),
    z: round(item.z - offset.z),
    rotation: item.rotation ?? 0,
  };

  if (item.doorOpen != null) out.doorOpen = item.doorOpen;
  if (item.sizeW != null) out.sizeW = item.sizeW;
  if (item.sizeD != null) out.sizeD = item.sizeD;
  if (item.carpetShape) out.carpetShape = item.carpetShape;
  if (item.carpetPattern) out.carpetPattern = item.carpetPattern;
  if (item.carpetColor) out.carpetColor = item.carpetColor;
  if (item.carpetAccent) out.carpetAccent = item.carpetAccent;
  if (item.tvStyle) out.tvStyle = item.tvStyle;
  if (item.furnitureGroupId) {
    out.furnitureGroupId = item.furnitureGroupId;
    out.groupAnchorId = item.groupAnchorId;
    out.groupOffsetX = item.groupOffsetX ?? 0;
    out.groupOffsetZ = item.groupOffsetZ ?? 0;
    out.groupMode = item.groupMode ?? 'layout';
  }

  return out;
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

function stripWallsForTemplate(walls, offset) {
  return walls.map((w) => ({
    x1: round(w.x1 - offset.x),
    z1: round(w.z1 - offset.z),
    x2: round(w.x2 - offset.x),
    z2: round(w.z2 - offset.z),
  }));
}

function toJs(items) {
  return items
    .map((item) => {
      const parts = [`type: '${item.type}'`, `x: ${item.x}`, `z: ${item.z}`, `rotation: ${formatRotation(item.rotation)}`];
      if (item.doorOpen != null) parts.push(`doorOpen: ${item.doorOpen}`);
      if (item.sizeW != null) parts.push(`sizeW: ${item.sizeW}`);
      if (item.sizeD != null) parts.push(`sizeD: ${item.sizeD}`);
      if (item.carpetShape) parts.push(`carpetShape: '${item.carpetShape}'`);
      if (item.carpetPattern) parts.push(`carpetPattern: '${item.carpetPattern}'`);
      if (item.carpetColor) parts.push(`carpetColor: '${item.carpetColor}'`);
      if (item.carpetAccent) parts.push(`carpetAccent: '${item.carpetAccent}'`);
      if (item.tvStyle) parts.push(`tvStyle: '${item.tvStyle}'`);
      if (item.furnitureGroupId) {
        parts.push(`furnitureGroupId: '${item.furnitureGroupId}'`);
        parts.push(`groupAnchorId: '${item.groupAnchorId}'`);
        parts.push(`groupOffsetX: ${item.groupOffsetX ?? 0}`);
        parts.push(`groupOffsetZ: ${item.groupOffsetZ ?? 0}`);
        parts.push(`groupMode: '${item.groupMode ?? 'layout'}'`);
      }
      return `      { ${parts.join(', ')} }`;
    })
    .join(',\n');
}

function formatRotation(r) {
  const steps = [
    [0, '0'],
    [Math.PI / 2, 'Math.PI / 2'],
    [-Math.PI / 2, '-Math.PI / 2'],
    [Math.PI, 'Math.PI'],
    [Math.PI / 4, 'Math.PI / 4'],
    [-Math.PI / 4, '-Math.PI / 4'],
    [(3 * Math.PI) / 4, '(3 * Math.PI) / 4'],
    [(-3 * Math.PI) / 4, '(-3 * Math.PI) / 4'],
  ];
  for (const [val, label] of steps) {
    if (Math.abs(r - val) < 0.001) return label;
  }
  return String(r);
}

function main() {
  if (!existsSync(EXPORT_PATH)) {
    console.error('Missing', EXPORT_PATH);
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(EXPORT_PATH, 'utf8'));
  const layout = getPlotLayout({ width: 16, depth: 12 });
  const furniture = (raw.furniture ?? []).map((item) => stripForTemplate(item, layout.offset));
  const walls = raw.walls?.length ? stripWallsForTemplate(raw.walls, layout.offset) : null;

  writeFileSync(
    OUT_PATH,
    JSON.stringify({ furniture, walls, wallColors: raw.wallColors ?? {} }, null, 2),
    'utf8'
  );

  console.log('Furniture items:', furniture.length);
  console.log('\n--- defaultFurniture ---\n');
  console.log(toJs(furniture));
  if (walls) {
    console.log('\n--- walls ---\n');
    console.log(JSON.stringify(walls, null, 2));
  }
}

main();
