/** Velikost jedné buňky mřížky v metrech */
export const GRID_SIZE = 1;
export const WALL_HEIGHT = 2.7;
export const WALL_THICKNESS = 0.12;

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

export function cloneWalls(walls) {
  return walls.map((w) => ({ ...w }));
}
