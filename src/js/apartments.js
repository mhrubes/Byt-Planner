/** Velikost jedné buňky mřížky v metrech */
export const GRID_SIZE = 1;
/** Jemnější krok pro nábytek — polovina buňky / střed čtverce */
export const FURNITURE_GRID_SUBDIVISIONS = 2;
export const WALL_HEIGHT = 2.7;
export const WALL_THICKNESS = 0.12;

/** Obdélník koberec ze dvou rohů mřížky (jako kreslení zdi) */
export function carpetRectFromGrid(start, end, gridSize = GRID_SIZE) {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minZ = Math.min(start.z, end.z);
  const maxZ = Math.max(start.z, end.z);
  const cellsW = maxX - minX + 1;
  const cellsD = maxZ - minZ + 1;

  return {
    x: minX + (cellsW - 1) / 2,
    z: minZ + (cellsD - 1) / 2,
    sizeW: cellsW * gridSize,
    sizeD: cellsD * gridSize,
  };
}

/** Volný okraj kolem bytu pro budoucí rozšíření (v buňkách mřížky) */
export const PLOT_PADDING = 8;

/** Minimální rozměr stavební plochy bez ohledu na velikost bytu */
export const MIN_PLOT_SIZE = { width: 24, depth: 20 };

export function getPlotLayout(apartmentSize) {
  const width = Math.max(apartmentSize.width + PLOT_PADDING * 2, MIN_PLOT_SIZE.width);
  const depth = Math.max(apartmentSize.depth + PLOT_PADDING * 2, MIN_PLOT_SIZE.depth);
  const offset = {
    x: Math.floor((width - apartmentSize.width) / 2),
    z: Math.floor((depth - apartmentSize.depth) / 2),
  };

  return {
    plotSize: { width, depth },
    offset,
    apartmentBounds: {
      x: offset.x,
      z: offset.z,
      width: apartmentSize.width,
      depth: apartmentSize.depth,
    },
  };
}

export function shiftWallsToPlot(walls, offset) {
  return walls.map((w) => ({
    x1: w.x1 + offset.x,
    z1: w.z1 + offset.z,
    x2: w.x2 + offset.x,
    z2: w.z2 + offset.z,
  }));
}

export function shiftFurnitureToPlot(items, offset) {
  return items.map((item) => ({
    ...item,
    x: item.x + offset.x,
    z: item.z + offset.z,
  }));
}

/**
 * Šablony bytů — souřadnice zdí jako segmenty na mřížce.
 * Každá zeď: { x1, z1, x2, z2 } v jednotkách mřížky.
 */
export const APARTMENT_TEMPLATES = {
  '1+kk': {
    label: '1+kk',
    description: 'Garsoniéra s kuchyňským koutem',
    floorSize: { width: 8, depth: 6 },
    walls: [
      // Vnější obvod
      { x1: 0, z1: 0, x2: 8, z2: 0 },
      { x1: 8, z1: 0, x2: 8, z2: 6 },
      { x1: 8, z1: 6, x2: 0, z2: 6 },
      { x1: 0, z1: 6, x2: 0, z2: 0 },
      // Koupelna (levý horní roh 2x2)
      { x1: 0, z1: 2, x2: 2, z2: 2 },
      { x1: 2, z1: 0, x2: 2, z2: 2 },
      // Kuchyňský kout (pravý dolní 3x2)
      { x1: 5, z1: 4, x2: 8, z2: 4 },
      { x1: 5, z1: 4, x2: 5, z2: 6 },
    ],
    defaultFurniture: [
      { type: 'bed', x: 4, z: 1.5, rotation: 0 },
      { type: 'sofa', x: 3, z: 4.5, rotation: Math.PI },
      { type: 'table', x: 3, z: 3.5, rotation: 0 },
      { type: 'chair', x: 2.5, z: 3.5, rotation: Math.PI / 2 },
      { type: 'wardrobe', x: 7, z: 1, rotation: -Math.PI / 2 },
      { type: 'kitchen', x: 6.5, z: 5, rotation: Math.PI },
    ],
    roomColors: {
      main: '#e8dcc8',
      bathroom: '#b8d4e8',
      kitchen: '#f5e6d3',
    },
  },

  '2+kk': {
    label: '2+kk',
    description: 'Obývák + ložnice + kuchyně',
    floorSize: { width: 10, depth: 8 },
    walls: [
      { x1: 0, z1: 0, x2: 10, z2: 0 },
      { x1: 10, z1: 0, x2: 10, z2: 8 },
      { x1: 10, z1: 8, x2: 0, z2: 8 },
      { x1: 0, z1: 8, x2: 0, z2: 0 },
      // Ložnice vlevo nahoře (5x4)
      { x1: 0, z1: 4, x2: 5, z2: 4 },
      { x1: 5, z1: 0, x2: 5, z2: 4 },
      // Koupelna (5,0)-(7,2)
      { x1: 5, z1: 2, x2: 7, z2: 2 },
      { x1: 7, z1: 0, x2: 7, z2: 2 },
      // Kuchyně (7,0)-(10,3)
      { x1: 7, z1: 3, x2: 10, z2: 3 },
      { x1: 7, z1: 0, x2: 7, z2: 3 },
    ],
    defaultFurniture: [
      { type: 'bed', x: 2.5, z: 2, rotation: 0 },
      { type: 'wardrobe', x: 0.5, z: 1, rotation: Math.PI / 2 },
      { type: 'sofa', x: 7.5, z: 6, rotation: Math.PI },
      { type: 'table', x: 7.5, z: 5, rotation: 0 },
      { type: 'tv', x: 7.5, z: 7.5, rotation: 0 },
      { type: 'chair', x: 6.5, z: 5, rotation: Math.PI / 2 },
      { type: 'kitchen', x: 8.5, z: 1.5, rotation: 0 },
      { type: 'plant', x: 9, z: 7, rotation: 0 },
    ],
    roomColors: {
      bedroom: '#d4c4e8',
      living: '#e8dcc8',
      bathroom: '#b8d4e8',
      kitchen: '#f5e6d3',
    },
  },

  '3+kk': {
    label: '3+kk',
    description: 'Dva pokoje + obývák + kuchyně',
    floorSize: { width: 12, depth: 10 },
    walls: [
      { x1: 0, z1: 0, x2: 12, z2: 0 },
      { x1: 12, z1: 0, x2: 12, z2: 10 },
      { x1: 12, z1: 10, x2: 0, z2: 10 },
      { x1: 0, z1: 10, x2: 0, z2: 0 },
      // Ložnice 1 (0,0)-(5,5)
      { x1: 0, z1: 5, x2: 5, z2: 5 },
      { x1: 5, z1: 0, x2: 5, z2: 5 },
      // Ložnice 2 (0,5)-(5,10)
      { x1: 0, z1: 5, x2: 5, z2: 5 },
      { x1: 5, z1: 5, x2: 5, z2: 10 },
      // Koupelna (5,0)-(7,3)
      { x1: 5, z1: 3, x2: 7, z2: 3 },
      { x1: 7, z1: 0, x2: 7, z2: 3 },
      // Kuchyně (7,0)-(12,4)
      { x1: 7, z1: 4, x2: 12, z2: 4 },
      { x1: 7, z1: 0, x2: 7, z2: 4 },
      // Obývák oddělení (5,5)-(12,10) — otevřený, jen částečná příčka
      { x1: 5, z1: 7, x2: 8, z2: 7 },
    ],
    defaultFurniture: [
      { type: 'bed', x: 2.5, z: 2.5, rotation: 0 },
      { type: 'bed', x: 2.5, z: 7.5, rotation: 0 },
      { type: 'wardrobe', x: 0.5, z: 2, rotation: Math.PI / 2 },
      { type: 'desk', x: 4, z: 8, rotation: Math.PI },
      { type: 'sofa', x: 9, z: 8, rotation: Math.PI },
      { type: 'table', x: 9, z: 6.5, rotation: 0 },
      { type: 'chair', x: 8, z: 6.5, rotation: Math.PI / 2 },
      { type: 'chair', x: 10, z: 6.5, rotation: -Math.PI / 2 },
      { type: 'tv', x: 9, z: 9.5, rotation: 0 },
      { type: 'kitchen', x: 9.5, z: 2, rotation: 0 },
      { type: 'plant', x: 11, z: 9, rotation: 0 },
      { type: 'bookshelf', x: 11, z: 6, rotation: Math.PI },
    ],
    roomColors: {
      bedroom1: '#d4c4e8',
      bedroom2: '#c4d4e8',
      living: '#e8dcc8',
      bathroom: '#b8d4e8',
      kitchen: '#f5e6d3',
    },
  },

  prazdny: {
    label: 'Prázdný plán',
    description: 'Prázdná plocha — bez zdí a nábytku, kresli od nuly',
    floorSize: { width: 16, depth: 14 },
    walls: [],
    defaultFurniture: [],
    empty: true,
    roomColors: {},
  },
};

export function wallKey(w) {
  return `${w.x1},${w.z1}-${w.x2},${w.z2}`;
}

export function normalizeWall(w) {
  if (w.x1 > w.x2 || (w.x1 === w.x2 && w.z1 > w.z2)) {
    return { x1: w.x2, z1: w.z2, x2: w.x1, z2: w.z1 };
  }
  return { ...w };
}

/** Uzavře konec zdi na mřížku; se Shift na nejbližších 45° */
export function snapWallEndpoint(start, end, { snap45 = false } = {}) {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const dist = Math.hypot(dx, dz);
  if (dist < 0.01) return { x: end.x, z: end.z };

  let angle = Math.atan2(dz, dx);
  if (snap45) {
    const step = Math.PI / 4;
    angle = Math.round(angle / step) * step;
  }

  const gridDist = Math.max(1, Math.round(dist));
  return {
    x: start.x + Math.round(Math.cos(angle) * gridDist),
    z: start.z + Math.round(Math.sin(angle) * gridDist),
  };
}

export function cloneWalls(walls) {
  return walls.map((w) => ({ ...w }));
}

function projectT(px, pz, x1, z1, x2, z2) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len2 = dx * dx + dz * dz;
  if (len2 < 1e-6) return 0;
  return ((px - x1) * dx + (pz - z1) * dz) / len2;
}

function distPointToSegment(px, pz, x1, z1, x2, z2) {
  const t = Math.max(0, Math.min(1, projectT(px, pz, x1, z1, x2, z2)));
  const cx = x1 + (x2 - x1) * t;
  const cz = z1 + (z2 - z1) * t;
  return Math.hypot(px - cx, pz - cz);
}

function wallFromMeters(x1, z1, x2, z2, gridSize) {
  return {
    x1: x1 / gridSize,
    z1: z1 / gridSize,
    x2: x2 / gridSize,
    z2: z2 / gridSize,
  };
}

function splitWallByOpening(wall, ox1, oz1, ox2, oz2, gridSize) {
  const x1 = wall.x1 * gridSize;
  const z1 = wall.z1 * gridSize;
  const x2 = wall.x2 * gridSize;
  const z2 = wall.z2 * gridSize;
  const mx = (ox1 + ox2) / 2;
  const mz = (oz1 + oz2) / 2;

  if (distPointToSegment(mx, mz, x1, z1, x2, z2) > 0.5) return [wall];

  const t1 = projectT(ox1, oz1, x1, z1, x2, z2);
  const t2 = projectT(ox2, oz2, x1, z1, x2, z2);
  const ta = Math.max(0, Math.min(t1, t2));
  const tb = Math.min(1, Math.max(t1, t2));
  if (tb - ta < 0.03) return [wall];

  const dx = x2 - x1;
  const dz = z2 - z1;
  const pieces = [];

  if (ta > 0.02) {
    pieces.push(wallFromMeters(x1, z1, x1 + dx * ta, z1 + dz * ta, gridSize));
  }
  if (tb < 0.98) {
    pieces.push(wallFromMeters(x1 + dx * tb, z1 + dz * tb, x2, z2, gridSize));
  }

  return pieces;
}

/** Vyřízne z otevřených dveří mezeru ve zdi */
export function applyOpenDoorGaps(walls, openDoors, catalog, gridSize = GRID_SIZE) {
  let result = walls.map((w) => ({ ...w }));

  for (const door of openDoors) {
    const def = catalog[door.type];
    if (!def) continue;

    const hw = def.size.w / 2;
    const px = door.x * gridSize;
    const pz = door.z * gridSize;
    const r = door.rotation ?? 0;
    const ux = Math.cos(r);
    const uz = -Math.sin(r);
    const ox1 = px - ux * hw;
    const oz1 = pz - uz * hw;
    const ox2 = px + ux * hw;
    const oz2 = pz + uz * hw;

    const next = [];
    for (const wall of result) {
      next.push(...splitWallByOpening(wall, ox1, oz1, ox2, oz2, gridSize));
    }
    result = next;
  }

  return result;
}
