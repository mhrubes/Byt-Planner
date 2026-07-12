import { readFileSync, writeFileSync } from 'fs';
import { getPlotLayout } from '../src/js/apartments.js';

const EXPORT_PATH = 'scripts/exported-3kk.json';
const APARTMENTS_PATH = 'src/js/apartments.js';

function round(n) {
  return Math.round(n * 1000) / 1000;
}

function formatRotation(r) {
  const norm = ((r % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const steps = [
    [0, '0'],
    [Math.PI / 4, 'Math.PI / 4'],
    [Math.PI / 2, 'Math.PI / 2'],
    [(3 * Math.PI) / 4, '(3 * Math.PI) / 4'],
    [Math.PI, 'Math.PI'],
    [(5 * Math.PI) / 4, '(5 * Math.PI) / 4'],
    [(3 * Math.PI) / 2, '(3 * Math.PI) / 2'],
    [(7 * Math.PI) / 4, '(7 * Math.PI) / 4'],
  ];
  for (const [val, label] of steps) {
    if (Math.abs(norm - val) < 0.02 || Math.abs(norm - val - Math.PI * 2) < 0.02) return label;
  }
  if (Math.abs(norm + Math.PI / 2 - Math.PI * 2) < 0.02) return '-Math.PI / 2';
  return String(round(r));
}

function stripItem(item, offset) {
  const out = {
    type: item.type,
    x: round(item.x - offset.x),
    z: round(item.z - offset.z),
    rotation: item.rotation ?? 0,
  };
  if (item.furnitureId) out.furnitureId = item.furnitureId;
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
    out.groupOffsetX = round(item.groupOffsetX ?? 0);
    out.groupOffsetZ = round(item.groupOffsetZ ?? 0);
    out.groupMode = item.groupMode ?? 'layout';
  }
  return out;
}

function itemToJs(item) {
  const parts = [`type: '${item.type}'`];
  if (item.furnitureId) parts.push(`furnitureId: '${item.furnitureId}'`);
  parts.push(`x: ${item.x}`, `z: ${item.z}`, `rotation: ${formatRotation(item.rotation)}`);
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
}

function wallToJs(w) {
  return `      { x1: ${w.x1}, z1: ${w.z1}, x2: ${w.x2}, z2: ${w.z2} }`;
}

const raw = JSON.parse(readFileSync(EXPORT_PATH, 'utf8'));
const layout = getPlotLayout({ width: 16, depth: 12 });
const furniture = raw.furniture.map((item) => stripItem(item, layout.offset));
const walls = raw.walls.map((w) => ({
  x1: round(w.x1 - layout.offset.x),
  z1: round(w.z1 - layout.offset.z),
  x2: round(w.x2 - layout.offset.x),
  z2: round(w.z2 - layout.offset.z),
}));

const block = `  '3+kk': {
    label: '3+kk',
    description: 'Dva pokoje + obývák + kuchyně',
    floorSize: { width: 16, depth: 12 },
    walls: [
${walls.map(wallToJs).join(',\n')},
    ],
    defaultFurniture: [
${furniture.map(itemToJs).join(',\n')},
    ],
    roomColors: {
      bedroom1: '#d4c4e8',
      bedroom2: '#c4d4e8',
      living: '#e8dcc8',
      bathroom: '#b8d4e8',
      kitchen: '#f5e6d3',
    },
  },`;

const src = readFileSync(APARTMENTS_PATH, 'utf8');
const start = src.indexOf("  '3+kk': {");
const end = src.indexOf('\n  prazdny:', start);
if (start < 0 || end < 0) throw new Error('3+kk block not found');

writeFileSync(APARTMENTS_PATH, src.slice(0, start) + block + src.slice(end));
console.log('Updated 3+kk template:', furniture.length, 'items,', walls.length, 'walls');
