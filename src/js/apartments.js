/** Velikost jedné buňky mřížky v metrech */
export const GRID_SIZE = 1;
/** Jemnější krok pro nábytek — polovina buňky / střed čtverce */
export const FURNITURE_GRID_SUBDIVISIONS = 2;
/** Krok otočení nábytku v radiánech (45°) */
export const FURNITURE_ROTATION_STEP = Math.PI / 4;
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
      // Koupelna (levý horní roh 3×2)
      { x1: 0, z1: 2, x2: 3, z2: 2 },
      { x1: 3, z1: 0, x2: 3, z2: 2 },
      // Kuchyňský kout (pravý dolní 3×2, otevřený do obýváku)
      { x1: 5, z1: 4, x2: 8, z2: 4 },
      { x1: 5, z1: 4, x2: 5, z2: 6 },
    ],
    defaultFurniture: [
      // Vchod a okno
      { type: 'door', x: 4, z: 0, rotation: 0, doorOpen: false },
      { type: 'window', x: 6.5, z: 0, rotation: 0 },
      // Koupelna
      { type: 'door', x: 3, z: 1, rotation: Math.PI / 2, doorOpen: false },
      { type: 'toilet', x: 0.5, z: 0.5, rotation: 0 },
      { type: 'sink', x: 2.5, z: 0.5, rotation: Math.PI },
      { type: 'bathtub', x: 1, z: 1.4, rotation: 0 },
      { type: 'shower', x: 2.5, z: 1.5, rotation: -Math.PI / 2 },
      { type: 'bath_shelf', x: 0.4, z: 1.5, rotation: Math.PI / 2 },
      { type: 'radiator', x: 2.5, z: 1, rotation: -Math.PI / 2 },
      {
        type: 'bath_carpet',
        x: 1.5,
        z: 1,
        rotation: 0,
        sizeW: 1.5,
        sizeD: 1,
        carpetShape: 'rounded',
        carpetPattern: 'dots',
        carpetColor: '#5a8a9a',
        carpetAccent: '#e0f0f6',
      },
      // Obývací část
      { type: 'bed_double', x: 5.5, z: 1.5, rotation: 0 },
      { type: 'wardrobe', x: 7, z: 1, rotation: -Math.PI / 2 },
      { type: 'nightstand', x: 4.5, z: 1, rotation: 0 },
      { type: 'lamp_small', x: 4.5, z: 1, rotation: 0 },
      { type: 'sofa', x: 3, z: 4.5, rotation: Math.PI },
      { type: 'table', x: 3, z: 3.5, rotation: 0 },
      { type: 'chair', x: 2.5, z: 3.5, rotation: Math.PI / 2 },
      { type: 'fireplace', x: 1.5, z: 4.5, rotation: Math.PI / 2 },
      {
        type: 'carpet',
        x: 3.25,
        z: 3,
        rotation: 0,
        sizeW: 2.5,
        sizeD: 2,
        carpetShape: 'rect',
        carpetPattern: 'border',
        carpetColor: '#6b4c34',
        carpetAccent: '#c9a66b',
      },
      { type: 'lamp_medium', x: 4.5, z: 3, rotation: 0 },
      { type: 'plant_medium', x: 1, z: 5.5, rotation: 0 },
      // Kuchyňský kout
      { type: 'kitchen_unit', x: 6.5, z: 5, rotation: Math.PI },
      { type: 'kitchen_unit', x: 7.5, z: 5.5, rotation: -Math.PI / 2 },
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
      // Ložnice (0,0)–(5,4)
      { x1: 0, z1: 4, x2: 5, z2: 4 },
      { x1: 5, z1: 0, x2: 5, z2: 4 },
      // Koupelna (5,0)–(8,3)
      { x1: 5, z1: 3, x2: 8, z2: 3 },
      { x1: 8, z1: 0, x2: 8, z2: 3 },
      // Kuchyně (8,0)–(10,3)
      { x1: 8, z1: 3, x2: 10, z2: 3 },
      { x1: 8, z1: 0, x2: 8, z2: 3 },
    ],
    defaultFurniture: [
      // Vchod a okna
      { type: 'door', x: 5, z: 8, rotation: Math.PI, doorOpen: false },
      { type: 'window', x: 2.5, z: 0, rotation: 0 },
      { type: 'window', x: 8, z: 8, rotation: Math.PI },
      // Ložnice
      { type: 'door', x: 2.5, z: 4, rotation: 0, doorOpen: false },
      { type: 'bed_double', x: 2.5, z: 2, rotation: 0 },
      { type: 'nightstand', x: 0.8, z: 1, rotation: 0 },
      { type: 'lamp_small', x: 0.8, z: 1, rotation: 0 },
      { type: 'wardrobe', x: 0.5, z: 3, rotation: Math.PI / 2 },
      { type: 'desk_small', x: 4, z: 1, rotation: Math.PI },
      // Koupelna
      { type: 'door', x: 5, z: 1.5, rotation: Math.PI / 2, doorOpen: false },
      { type: 'toilet', x: 5.5, z: 0.6, rotation: 0 },
      { type: 'sink', x: 7.5, z: 0.6, rotation: Math.PI },
      { type: 'bathtub', x: 6.2, z: 1.8, rotation: 0 },
      { type: 'shower', x: 7.5, z: 2.2, rotation: -Math.PI / 2 },
      { type: 'bath_shelf', x: 5.3, z: 2.5, rotation: Math.PI / 2 },
      { type: 'radiator', x: 7.5, z: 1.2, rotation: -Math.PI / 2 },
      {
        type: 'bath_carpet',
        x: 6.5,
        z: 1.5,
        rotation: 0,
        sizeW: 1.5,
        sizeD: 1.2,
        carpetShape: 'rounded',
        carpetPattern: 'dots',
        carpetColor: '#5a8a9a',
        carpetAccent: '#e0f0f6',
      },
      // Kuchyně
      { type: 'door', x: 9, z: 3, rotation: 0, doorOpen: false },
      { type: 'kitchen_unit', x: 9, z: 1, rotation: 0 },
      { type: 'kitchen_unit', x: 9, z: 2.2, rotation: 0 },
      { type: 'dining_table_small', x: 6.5, z: 1.5, rotation: 0 },
      { type: 'chair', x: 6.5, z: 0.9, rotation: 0 },
      { type: 'chair', x: 6.5, z: 2.1, rotation: Math.PI },
      // Obývák
      { type: 'sofa', x: 7.5, z: 6, rotation: Math.PI },
      { type: 'table', x: 7.5, z: 5, rotation: 0 },
      { type: 'tv', x: 7.5, z: 7.5, rotation: 0 },
      { type: 'chair', x: 6.5, z: 5, rotation: Math.PI / 2 },
      { type: 'fireplace', x: 3, z: 6, rotation: Math.PI / 2 },
      {
        type: 'carpet',
        x: 7,
        z: 5.5,
        rotation: 0,
        sizeW: 3,
        sizeD: 2.5,
        carpetShape: 'rect',
        carpetPattern: 'border',
        carpetColor: '#6b4c34',
        carpetAccent: '#c9a66b',
      },
      { type: 'lamp_medium', x: 6, z: 7, rotation: 0 },
      { type: 'plant_large', x: 9, z: 5, rotation: 0 },
      { type: 'bookshelf', x: 9, z: 7.5, rotation: Math.PI },
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
    floorSize: { width: 16, depth: 12 },
    walls: [
      { x1: 0, z1: 0, x2: 16, z2: 0 },
      { x1: 16, z1: 0, x2: 16, z2: 12 },
      { x1: 16, z1: 12, x2: 0, z2: 12 },
      { x1: 0, z1: 12, x2: 0, z2: 0 },
      { x1: 0, z1: 6, x2: 6, z2: 6 },
      { x1: 6, z1: 0, x2: 6, z2: 12 },
      { x1: 10, z1: 0, x2: 10, z2: 2 },
      { x1: 10, z1: 2, x2: 11, z2: 3 },
      { x1: 11, z1: 3, x2: 11, z2: 4 },
      { x1: 6, z1: 4, x2: 11, z2: 4 },
    ],
    defaultFurniture: [
      { type: 'door', furnitureId: 'f-1', x: 12, z: 12, rotation: Math.PI, doorOpen: false },
      { type: 'window', furnitureId: 'f-4', x: 1, z: 12, rotation: Math.PI, doorOpen: false },
      { type: 'balcony_door', furnitureId: 'f-6', x: 16, z: 10.5, rotation: Math.PI / 2, doorOpen: false },
      { type: 'door', furnitureId: 'f-7', x: 6, z: 5, rotation: Math.PI / 2, doorOpen: false },
      { type: 'desk_medium', furnitureId: 'f-12', x: 5.5, z: 3, rotation: (3 * Math.PI) / 2 },
      { type: 'door', furnitureId: 'f-13', x: 6, z: 8.5, rotation: Math.PI / 2, doorOpen: false },
      { type: 'bed_single', furnitureId: 'f-14', x: 1, z: 7, rotation: Math.PI / 2 },
      { type: 'wardrobe', furnitureId: 'f-15', x: 0.5, z: 8.5, rotation: Math.PI / 2, doorOpen: false },
      { type: 'desk_small', furnitureId: 'f-16', x: 3.5, z: 11.5, rotation: Math.PI },
      { type: 'shelf_medium', furnitureId: 'f-17', x: 2.5, z: 11.5, rotation: Math.PI },
      { type: 'door', furnitureId: 'f-18', x: 6, z: 0.5, rotation: (3 * Math.PI) / 2, doorOpen: false },
      { type: 'sofa', furnitureId: 'f-34', x: 9.5, z: 10.5, rotation: (3 * Math.PI) / 2 },
      { type: 'table', furnitureId: 'f-35', x: 8.5, z: 10.5, rotation: Math.PI / 2 },
      { type: 'tv', furnitureId: 'f-36', x: 6, z: 10.5, rotation: Math.PI / 2, tvStyle: 'wall_inset' },
      { type: 'carpet', furnitureId: 'f-37', x: 9, z: 10.5, rotation: 0, sizeW: 4, sizeD: 3, carpetShape: 'oval', carpetPattern: 'border', carpetColor: '#bc7238', carpetAccent: '#1dd4d7' },
      { type: 'lamp_medium', furnitureId: 'f-38', x: 10, z: 11.5, rotation: 0 },
      { type: 'plant_large', furnitureId: 'f-39', x: 15.5, z: 11.5, rotation: 0 },
      { type: 'shelf_large_cabinet', furnitureId: 'f-41', x: 15.5, z: 8.5, rotation: (3 * Math.PI) / 2, doorOpen: false },
      { type: 'lamp_wall', furnitureId: 'f-42', x: 6, z: 6.5, rotation: Math.PI / 2 },
      { type: 'window_large', furnitureId: 'f-55', x: 16, z: 6.5, rotation: (3 * Math.PI) / 2, doorOpen: false },
      { type: 'shelf_small', furnitureId: 'f-72', x: 0.5, z: 2.5, rotation: Math.PI / 2 },
      { type: 'shelf_small', furnitureId: 'f-73', x: 2.5, z: 0.5, rotation: 0 },
      { type: 'bed_double', furnitureId: 'f-8', x: 2, z: 2, rotation: Math.PI / 4 },
      { type: 'window_large', furnitureId: 'f-75', x: 0, z: 2.5, rotation: Math.PI / 2, doorOpen: false },
      { type: 'plant_medium', furnitureId: 'f-77', x: 0.5, z: 0.5, rotation: 0 },
      { type: 'chair', furnitureId: 'f-79', x: 5, z: 3, rotation: Math.PI / 2 },
      { type: 'wardrobe', furnitureId: 'f-80', x: 2.2, z: 5.5, rotation: Math.PI, doorOpen: false, furnitureGroupId: 'grp-35', groupAnchorId: 'f-82', groupOffsetX: -0.975, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'shelf_medium_cabinet', furnitureId: 'f-82', x: 3.175, z: 5.5, rotation: Math.PI, doorOpen: false, furnitureGroupId: 'grp-35', groupAnchorId: 'f-82', groupOffsetX: 0, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'wardrobe', furnitureId: 'f-11', x: 1, z: 5.5, rotation: Math.PI, doorOpen: false, furnitureGroupId: 'grp-35', groupAnchorId: 'f-82', groupOffsetX: -2.175, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'window', furnitureId: 'f-83', x: 5, z: 12, rotation: Math.PI, doorOpen: false },
      { type: 'chair', furnitureId: 'f-85', x: 3.5, z: 11, rotation: 0 },
      { type: 'bookshelf', furnitureId: 'f-89', x: 5.5, z: 6.5, rotation: (7 * Math.PI) / 4 },
      { type: 'shelf_medium', furnitureId: 'f-86', x: 5.5, z: 10, rotation: (3 * Math.PI) / 2, furnitureGroupId: 'grp-37', groupAnchorId: 'f-86', groupOffsetX: 0, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'shelf_medium', furnitureId: 'f-87', x: 5.5, z: 10.75, rotation: (3 * Math.PI) / 2, furnitureGroupId: 'grp-37', groupAnchorId: 'f-86', groupOffsetX: 0, groupOffsetZ: 0.75, groupMode: 'row' },
      { type: 'kitchen_fridge', furnitureId: 'f-45', x: 11.075, z: 0.5, rotation: 0, doorOpen: false, furnitureGroupId: 'grp-39', groupAnchorId: 'f-45', groupOffsetX: 0, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'kitchen_dishwasher', furnitureId: 'f-49', x: 11.7, z: 0.5, rotation: 0, doorOpen: false, furnitureGroupId: 'grp-39', groupAnchorId: 'f-45', groupOffsetX: 0.625, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'kitchen_unit', furnitureId: 'f-27', x: 12.5, z: 0.5, rotation: 0, furnitureGroupId: 'grp-39', groupAnchorId: 'f-45', groupOffsetX: 1.425, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'kitchen_unit', furnitureId: 'f-28', x: 13.5, z: 0.5, rotation: 0, furnitureGroupId: 'grp-39', groupAnchorId: 'f-45', groupOffsetX: 2.425, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'kitchen_unit', furnitureId: 'f-51', x: 14.5, z: 0.5, rotation: 0, furnitureGroupId: 'grp-39', groupAnchorId: 'f-45', groupOffsetX: 3.425, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'kitchen_oven', furnitureId: 'f-44', x: 15.3, z: 0.5, rotation: 0, doorOpen: false, furnitureGroupId: 'grp-39', groupAnchorId: 'f-45', groupOffsetX: 4.225, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'door', furnitureId: 'f-91', x: 8, z: 4, rotation: 0, doorOpen: false },
      { type: 'bathtub', furnitureId: 'f-96', x: 10, z: 3, rotation: (7 * Math.PI) / 4 },
      { type: 'toilet', furnitureId: 'f-98', x: 6.5, z: 3.5, rotation: (3 * Math.PI) / 4 },
      { type: 'lamp_wall', furnitureId: 'f-100', x: 9, z: 0, rotation: 0 },
      { type: 'lamp_wall', furnitureId: 'f-101', x: 7, z: 0, rotation: 0 },
      { type: 'lamp_wall', furnitureId: 'f-102', x: 9, z: 4, rotation: Math.PI },
      { type: 'bath_shelf', furnitureId: 'f-106', x: 9.5, z: 1.5, rotation: (3 * Math.PI) / 2, doorOpen: false, furnitureGroupId: 'grp-41', groupAnchorId: 'f-104', groupOffsetX: 0, groupOffsetZ: 0.685, groupMode: 'row' },
      { type: 'sink', furnitureId: 'f-104', x: 9.5, z: 0.815, rotation: (3 * Math.PI) / 2, furnitureGroupId: 'grp-41', groupAnchorId: 'f-104', groupOffsetX: 0, groupOffsetZ: 0, groupMode: 'row' },
      { type: 'lamp_ceiling', furnitureId: 'f-112', x: 4, z: 3, rotation: 0 },
      { type: 'lamp_ceiling', furnitureId: 'f-114', x: 3.5, z: 9, rotation: 0 },
      { type: 'lamp_ceiling', furnitureId: 'f-117', x: 13, z: 10, rotation: 0 },
      { type: 'lamp_wall', furnitureId: 'f-120', x: 13, z: 0, rotation: 0 },
      { type: 'lamp_pendant', furnitureId: 'f-123', x: 14, z: 5, rotation: 0 },
      { type: 'bookshelf', furnitureId: 'f-40', x: 6.5, z: 6.7, rotation: Math.PI / 2, furnitureGroupId: 'grp-17', groupAnchorId: 'f-40', groupOffsetX: 0, groupOffsetZ: 0, groupMode: 'layout' },
      { type: 'bookshelf', furnitureId: 'f-43', x: 6.5, z: 7.5, rotation: Math.PI / 2, furnitureGroupId: 'grp-17', groupAnchorId: 'f-40', groupOffsetX: 0, groupOffsetZ: 0.8, groupMode: 'layout' },
      { type: 'chair', furnitureId: 'f-57', x: 15, z: 5.5, rotation: (5 * Math.PI) / 4, furnitureGroupId: 'grp-24', groupAnchorId: 'f-31', groupOffsetX: 2, groupOffsetZ: 1, groupMode: 'layout' },
      { type: 'chair', furnitureId: 'f-48', x: 13, z: 5.5, rotation: (3 * Math.PI) / 4, furnitureGroupId: 'grp-24', groupAnchorId: 'f-31', groupOffsetX: 0, groupOffsetZ: 1, groupMode: 'layout' },
      { type: 'chair', furnitureId: 'f-47', x: 13.5, z: 6, rotation: (3 * Math.PI) / 4, furnitureGroupId: 'grp-24', groupAnchorId: 'f-31', groupOffsetX: 0.5, groupOffsetZ: 1.5, groupMode: 'layout' },
      { type: 'chair', furnitureId: 'f-56', x: 14.5, z: 6, rotation: (5 * Math.PI) / 4, furnitureGroupId: 'grp-24', groupAnchorId: 'f-31', groupOffsetX: 1.5, groupOffsetZ: 1.5, groupMode: 'layout' },
      { type: 'dining_table_xl', furnitureId: 'f-53', x: 14, z: 5, rotation: (5 * Math.PI) / 4, furnitureGroupId: 'grp-24', groupAnchorId: 'f-31', groupOffsetX: 1, groupOffsetZ: 0.5, groupMode: 'layout' },
      { type: 'chair', furnitureId: 'f-31', x: 13, z: 4.5, rotation: Math.PI / 4, furnitureGroupId: 'grp-24', groupAnchorId: 'f-31', groupOffsetX: 0, groupOffsetZ: 0, groupMode: 'layout' },
      { type: 'chair', furnitureId: 'f-32', x: 13.5, z: 4, rotation: Math.PI / 4, furnitureGroupId: 'grp-24', groupAnchorId: 'f-31', groupOffsetX: 0.5, groupOffsetZ: -0.5, groupMode: 'layout' },
      { type: 'chair', furnitureId: 'f-30', x: 14.5, z: 4, rotation: (7 * Math.PI) / 4, furnitureGroupId: 'grp-24', groupAnchorId: 'f-31', groupOffsetX: 1.5, groupOffsetZ: -0.5, groupMode: 'layout' },
      { type: 'chair', furnitureId: 'f-33', x: 15, z: 4.5, rotation: (7 * Math.PI) / 4, furnitureGroupId: 'grp-24', groupAnchorId: 'f-31', groupOffsetX: 2, groupOffsetZ: 0, groupMode: 'layout' },
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

/** Je dílčí segment na stejné přímce jako celá zeď */
export function segmentIsSubsetOf(piece, wall) {
  const eps = 0.02;
  const pw = normalizeWall(piece);
  const ww = normalizeWall(wall);

  const pdx = pw.x2 - pw.x1;
  const pdz = pw.z2 - pw.z1;
  const wdx = ww.x2 - ww.x1;
  const wdz = ww.z2 - ww.z1;

  const plen = Math.hypot(pdx, pdz);
  const wlen = Math.hypot(wdx, wdz);
  if (plen < eps || wlen < eps) return false;

  if (Math.abs(pdx * wdz - pdz * wdx) > eps * wlen) return false;

  const onWall = (px, pz) => {
    const t = ((px - ww.x1) * wdx + (pz - ww.z1) * wdz) / (wlen * wlen);
    if (t < -eps || t > 1 + eps) return false;
    const cx = ww.x1 + t * wdx;
    const cz = ww.z1 + t * wdz;
    return Math.hypot(px - cx, pz - cz) < eps;
  };

  return onWall(pw.x1, pw.z1) && onWall(pw.x2, pw.z2);
}

/** Najde původní zeď, ze které vznikl dílčí segment (např. po otvoru ve dveřích) */
export function findParentWall(segment, walls) {
  for (const w of walls) {
    if (segmentIsSubsetOf(segment, w)) return normalizeWall(w);
  }
  return normalizeWall(segment);
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

function doorOpeningBounds(door, catalog, gridSize = GRID_SIZE) {
  const def = catalog[door.type];
  const hw = def.size.w / 2 / gridSize;
  const r = door.rotation ?? 0;
  const ux = Math.cos(r);
  const uz = -Math.sin(r);
  const pad = (WALL_THICKNESS * 1.25) / gridSize;

  const ax1 = door.x - ux * hw - pad;
  const az1 = door.z - uz * hw - pad;
  const ax2 = door.x + ux * hw + pad;
  const az2 = door.z + uz * hw + pad;

  return {
    xMin: Math.min(ax1, ax2),
    xMax: Math.max(ax1, ax2),
    zMin: Math.min(az1, az2),
    zMax: Math.max(az1, az2),
    ux,
    uz,
  };
}

function wallsAreParallel(wall, bounds) {
  const w = normalizeWall(wall);
  const wdx = w.x2 - w.x1;
  const wdz = w.z2 - w.z1;
  const wlen = Math.hypot(wdx, wdz);
  if (wlen < 0.01) return false;
  const wux = wdx / wlen;
  const wuz = wdz / wlen;
  return Math.abs(bounds.ux * wuz - bounds.uz * wux) < 0.08;
}

/** Vyřízne kolmou zeď protínající dveřní otvor v půdorysu */
function splitWallByCrossingDoor(wall, bounds) {
  const w = normalizeWall(wall);
  const eps = 0.02;
  const horizontal = Math.abs(w.z2 - w.z1) < eps;
  const vertical = Math.abs(w.x2 - w.x1) < eps;

  if (horizontal) {
    const z = w.z1;
    const halfThick = (WALL_THICKNESS / GRID_SIZE) * 0.6;
    if (z < bounds.zMin - halfThick || z > bounds.zMax + halfThick) return [wall];
    const wx1 = Math.min(w.x1, w.x2);
    const wx2 = Math.max(w.x1, w.x2);
    if (wx2 < bounds.xMin + eps || wx1 > bounds.xMax - eps) return [wall];
    const pieces = [];
    if (wx1 < bounds.xMin - eps) {
      pieces.push({ x1: wx1, z1: z, x2: bounds.xMin, z2: z });
    }
    if (wx2 > bounds.xMax + eps) {
      pieces.push({ x1: bounds.xMax, z1: z, x2: wx2, z2: z });
    }
    return pieces;
  }

  if (vertical) {
    const x = w.x1;
    const halfThick = (WALL_THICKNESS / GRID_SIZE) * 0.6;
    if (x < bounds.xMin - halfThick || x > bounds.xMax + halfThick) return [wall];
    const wz1 = Math.min(w.z1, w.z2);
    const wz2 = Math.max(w.z1, w.z2);
    if (wz2 < bounds.zMin + eps || wz1 > bounds.zMax - eps) return [wall];
    const pieces = [];
    if (wz1 < bounds.zMin - eps) {
      pieces.push({ x1: x, z1: wz1, x2: x, z2: bounds.zMin });
    }
    if (wz2 > bounds.zMax + eps) {
      pieces.push({ x1: x, z1: bounds.zMax, x2: x, z2: wz2 });
    }
    return pieces;
  }

  return [wall];
}

/** Typ segmentu vůči dveřím — krátké zárubně u otvoru se nevykreslují */
export function classifyDoorWallSegment(wall, doors, catalog, gridSize = GRID_SIZE) {
  const seg = normalizeWall(wall);
  const eps = 0.05;
  const z1 = Math.min(seg.z1, seg.z2);
  const z2 = Math.max(seg.z1, seg.z2);
  const x1 = Math.min(seg.x1, seg.x2);
  const x2 = Math.max(seg.x1, seg.x2);
  const horizontal = Math.abs(seg.z2 - seg.z1) < eps;
  const vertical = Math.abs(seg.x2 - seg.x1) < eps;
  const segLen = Math.hypot(seg.x2 - seg.x1, seg.z2 - seg.z1);

  for (const door of doors) {
    const bounds = doorOpeningBounds(door, catalog, gridSize);
    if (!wallsAreParallel(wall, bounds)) continue;

    const dist = distPointToSegment(door.x, door.z, seg.x1, seg.z1, seg.x2, seg.z2);
    if (dist > 0.15) continue;

    if (vertical) {
      const overlapZ = Math.min(z2, bounds.zMax) - Math.max(z1, bounds.zMin);
      if (overlapZ > eps && overlapZ >= segLen - eps * 2) return 'inside';
    } else if (horizontal) {
      const overlapX = Math.min(x2, bounds.xMax) - Math.max(x1, bounds.xMin);
      if (overlapX > eps && overlapX >= segLen - eps * 2) return 'inside';
    }
  }

  return 'normal';
}

/** Najde zeď, na které dveře leží (pro barvu nadpraží) */
export function findWallForDoor(door, walls, catalog, gridSize = GRID_SIZE) {
  const def = catalog[door.type];
  if (!def) return null;

  const r = door.rotation ?? 0;
  const ux = Math.cos(r);
  const uz = -Math.sin(r);

  let best = null;
  let bestDist = Infinity;

  for (const raw of walls) {
    const w = normalizeWall(raw);
    const wdx = w.x2 - w.x1;
    const wdz = w.z2 - w.z1;
    const wlen = Math.hypot(wdx, wdz);
    if (wlen < 0.01) continue;

    const wux = wdx / wlen;
    const wuz = wdz / wlen;
    if (Math.abs(ux * wuz - uz * wux) > 0.08) continue;

    const dist = distPointToSegment(door.x, door.z, w.x1, w.z1, w.x2, w.z2);
    if (dist < 0.15 && dist < bestDist) {
      bestDist = dist;
      best = w;
    }
  }

  return best;
}

/** Směr zdi v radiánech (osa segmentu x1,z1 → x2,z2) */
export function getWallYaw(wall) {
  const w = normalizeWall(wall);
  return Math.atan2(w.z2 - w.z1, w.x2 - w.x1);
}

export function normalizeAngleRad(angle) {
  let a = angle % (Math.PI * 2);
  if (a > Math.PI) a -= Math.PI * 2;
  if (a < -Math.PI) a += Math.PI * 2;
  return a;
}

/** Nejbližší zeď k bodu — bez ohledu na natočení otvoru */
export function findNearestWallAt(x, z, walls, maxDist = 0.15) {
  let best = null;
  let bestDist = Infinity;

  for (const raw of walls) {
    const w = normalizeWall(raw);
    const dist = distPointToSegment(x, z, w.x1, w.z1, w.x2, w.z2);
    if (dist < maxDist && dist < bestDist) {
      bestDist = dist;
      best = w;
    }
  }

  return best;
}

/** Zarovná otvor do zdi — dvě možné orientace po ose zdi (0° / 180°) */
export function snapOpeningRotationToWall(currentYaw, wallYaw) {
  const options = [wallYaw, wallYaw + Math.PI];
  let best = options[0];
  let bestDiff = Infinity;

  for (const option of options) {
    const diff = Math.abs(normalizeAngleRad(option - currentYaw));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = option;
    }
  }

  return normalizeAngleRad(best);
}

/** Je otvor zarovnaný na zeď (pro otočení o 180° místo volného úhlu) */
export function isOpeningOnWall(opening, walls, catalog = null, gridSize = GRID_SIZE) {
  if (findWallForDoor(opening, walls, catalog, gridSize)) return true;
  return !!findNearestWallAt(opening.x, opening.z, walls);
}

/** Vyřízne vodorovnou mezeru pro dveře ve zdi (šířka dveří, po celé výšce segmentu) */
export function applyDoorGaps(walls, doors, catalog, gridSize = GRID_SIZE) {
  let result = walls.map((w) => ({ ...w }));

  for (const door of doors) {
    const def = catalog[door.type];
    if (!def) continue;

    const bounds = doorOpeningBounds(door, catalog, gridSize);
    const hw = def.size.w / 2 + 0.05;
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
      if (wallsAreParallel(wall, bounds)) {
        next.push(...splitWallByOpening(wall, ox1, oz1, ox2, oz2, gridSize));
      } else {
        next.push(...splitWallByCrossingDoor(wall, bounds));
      }
    }
    result = next;
  }

  return result;
}

/** @deprecated alias — použij applyDoorGaps */
export function applyOpenDoorGaps(walls, openDoors, catalog, gridSize = GRID_SIZE) {
  return applyDoorGaps(walls, openDoors, catalog, gridSize);
}
