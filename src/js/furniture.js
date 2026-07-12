import * as THREE from 'three';
import { WALL_THICKNESS, WALL_HEIGHT } from './apartments.js';

/** Definice všech položek — rozměry v metrech */
const FURNITURE_ITEMS = {
  door: {
    label: 'Dveře',
    icon: '🚪',
    size: { w: 0.9, h: 2.1, d: 0.12 },
    color: '#f0a040',
    accent: '#faf6f0',
    inner: '#c87832',
    back: '#e87830',
    structural: true,
  },
  window: {
    label: 'Okno',
    icon: '🪟',
    size: { w: 1.2, h: 1.4, d: 0.14 },
    color: '#f5f8fc',
    accent: '#2563b0',
    inner: '#dce8f5',
    back: '#8eb4e8',
    sillHeight: 0.9,
    structural: true,
  },
  window_small: {
    label: 'Malé okno',
    icon: '🪟',
    size: { w: 0.55, h: 0.72, d: 0.12 },
    color: '#f5f8fc',
    accent: '#2563b0',
    inner: '#dce8f5',
    back: '#8eb4e8',
    sillHeight: 1.15,
    structural: true,
  },
  window_large: {
    label: 'Velké okno',
    icon: '🖼️',
    size: { w: 2.0, h: 1.55, d: 0.14 },
    color: '#f5f8fc',
    accent: '#2563b0',
    inner: '#dce8f5',
    back: '#8eb4e8',
    sillHeight: 0.85,
    structural: true,
  },
  balcony_door: {
    label: 'Balkónové dveře',
    icon: '🏠',
    size: { w: 1.8, h: 2.1, d: 0.12 },
    color: '#dce8f8',
    accent: '#1b9e77',
    inner: '#b8cce0',
    back: '#c5daf0',
    structural: true,
  },
  radiator: {
    label: 'Radiátor',
    icon: '🔥',
    size: { w: 0.8, h: 0.6, d: 0.08 },
    color: '#e8e8e8',
    accent: '#cccccc',
  },
  sofa: {
    label: 'Pohovka',
    icon: '🛋️',
    size: { w: 2.0, h: 0.85, d: 0.9 },
    color: '#5c5c66',
    accent: '#42424a',
    fabricLight: '#70707a',
    frame: '#35353d',
    legs: '#222228',
    piping: '#888892',
  },
  armchair: {
    label: 'Křeslo',
    icon: '🪑',
    size: { w: 0.88, h: 0.82, d: 0.92 },
    color: '#4a4f5c',
    accent: '#353a44',
    fabricLight: '#6d7482',
    frame: '#2a2e34',
    legs: '#4a4e56',
    piping: '#949aa6',
    pillow: '#b8885a',
  },
  tv: {
    label: 'Televize',
    icon: '📺',
    size: { w: 1.8, h: 1.05, d: 0.08 },
    color: '#1a1a2e',
    accent: '#2d2d44',
    screen: '#101018',
    stand: '#3a3028',
    standTop: '#4a4038',
    sillHeight: 0.5,
  },
  fireplace: {
    label: 'Krb',
    icon: '🔥',
    size: { w: 1.35, h: 1.4, d: 0.42 },
    color: '#c4bcb4',
    accent: '#7a7268',
    mantel: '#5c4033',
    fire: '#e85a20',
    inner: '#1a1008',
  },
  table: {
    label: 'Konferenční stůl',
    icon: '☕',
    size: { w: 1.2, h: 0.45, d: 0.8 },
    color: '#8b6914',
    accent: '#a07818',
  },
  bookshelf: {
    label: 'Knihovna',
    icon: '📚',
    size: { w: 0.8, h: 1.8, d: 0.35 },
    color: '#5c4033',
    accent: '#8b6914',
    shelf: '#a07840',
  },
  shelf_small: {
    label: 'Malá polička',
    icon: '📐',
    size: { w: 0.55, h: 0.65, d: 0.28 },
    color: '#6b5344',
    accent: '#8b6914',
    shelf: '#a07840',
    shelfCount: 2,
  },
  shelf_small_cabinet: {
    label: 'Malá skříňka',
    icon: '🗄️',
    size: { w: 0.55, h: 0.65, d: 0.28 },
    color: '#6b5344',
    accent: '#8b6914',
    shelf: '#a07840',
    shelfCount: 2,
    withDoors: true,
  },
  shelf_medium: {
    label: 'Střední police',
    icon: '🧱',
    size: { w: 0.75, h: 1.1, d: 0.32 },
    color: '#5c4033',
    accent: '#8b6914',
    shelf: '#9a7040',
    shelfCount: 3,
  },
  shelf_medium_cabinet: {
    label: 'Střední skříň',
    icon: '🚪',
    size: { w: 0.75, h: 1.1, d: 0.32 },
    color: '#5c4033',
    accent: '#8b6914',
    shelf: '#9a7040',
    shelfCount: 3,
    withDoors: true,
  },
  shelf_large: {
    label: 'Velká police',
    icon: '🗂️',
    size: { w: 1.0, h: 1.6, d: 0.38 },
    color: '#5c4033',
    accent: '#7a5544',
    shelf: '#a07840',
    shelfCount: 4,
  },
  shelf_large_cabinet: {
    label: 'Velká skříň',
    icon: '🗃️',
    size: { w: 1.0, h: 1.6, d: 0.38 },
    color: '#5c4033',
    accent: '#7a5544',
    shelf: '#a07840',
    shelfCount: 4,
    withDoors: true,
    doubleDoor: true,
  },
  plant: {
    label: 'Malá rostlina',
    icon: '🪴',
    size: { w: 0.4, h: 0.8, d: 0.4 },
    color: '#2d5016',
    accent: '#c87850',
    leaf: '#4a7c23',
  },
  plant_medium: {
    label: 'Střední rostlina',
    icon: '🌱',
    size: { w: 0.55, h: 1.25, d: 0.55 },
    color: '#1f4a14',
    accent: '#b8734a',
    leaf: '#3d8c32',
  },
  plant_large: {
    label: 'Velká rostlina',
    icon: '🌿',
    size: { w: 1.1, h: 2.0, d: 1.1 },
    color: '#1a4212',
    accent: '#9a6b42',
    leaf: '#2f7a28',
  },
  lamp: {
    label: 'Velká lampa',
    icon: '🪔',
    size: { w: 0.42, h: 1.8, d: 0.42 },
    color: '#f5e6c8',
    accent: '#d4a843',
    pole: '#4a4a4a',
  },
  lamp_medium: {
    label: 'Střední lampa',
    icon: '💡',
    size: { w: 0.32, h: 1.2, d: 0.32 },
    color: '#f8efd8',
    accent: '#c9a030',
    pole: '#555555',
  },
  lamp_small: {
    label: 'Malá lampa',
    icon: '🔦',
    size: { w: 0.22, h: 0.5, d: 0.22 },
    color: '#fff4dc',
    accent: '#e8c860',
    pole: '#666666',
  },
  lamp_pendant: {
    label: 'Závěsná lampa',
    icon: '🔅',
    size: { w: 0.42, h: 0.88, d: 0.42 },
    color: '#fff6e8',
    accent: '#c9a030',
    cord: '#3a3a3a',
    mountOffset: WALL_HEIGHT,
  },
  lamp_ceiling: {
    label: 'Stropní světlo',
    icon: '💡',
    size: { w: 0.4, h: 0.14, d: 0.4 },
    color: '#faf8f0',
    accent: '#c8b878',
    mountOffset: WALL_HEIGHT,
  },
  lamp_wall: {
    label: 'Nástěnné světlo',
    icon: '🕯️',
    size: { w: 0.3, h: 0.4, d: 0.12 },
    color: '#f5f0e4',
    accent: '#2e2e32',
    mountOffset: WALL_HEIGHT * 0.75,
  },
  bed: {
    label: 'Postel pro dva',
    icon: '🛏️',
    size: { w: 1.6, h: 0.55, d: 2.0 },
    color: '#e8e0d4',
    accent: '#8b7355',
    duvet: '#c5d4e8',
    sheet: '#f8f8f8',
    pillows: 2,
  },
  bed_single: {
    label: 'Postel pro jednoho',
    icon: '🛌',
    size: { w: 0.9, h: 0.55, d: 2.0 },
    color: '#e8e0d4',
    accent: '#8b7355',
    duvet: '#d0dce8',
    sheet: '#f8f8f8',
    pillows: 1,
  },
  bed_double: {
    label: 'Postel pro dva',
    icon: '🛏️',
    size: { w: 1.6, h: 0.55, d: 2.0 },
    color: '#e8e0d4',
    accent: '#8b7355',
    duvet: '#c5d4e8',
    sheet: '#f8f8f8',
    pillows: 2,
  },
  wardrobe: {
    label: 'Skříň na oblečení',
    icon: '🗄️',
    size: { w: 1.2, h: 2.2, d: 0.6 },
    color: '#5c4033',
    accent: '#7a5544',
    shelf: '#8b6914',
    withDoors: true,
    doubleDoor: true,
  },
  nightstand: {
    label: 'Noční stolek',
    icon: '🛎️',
    size: { w: 0.45, h: 0.55, d: 0.4 },
    color: '#654321',
    accent: '#8b5a2b',
  },
  kitchen: {
    label: 'Kuchyňská linka',
    icon: '🍳',
    size: { w: 2.0, h: 0.9, d: 0.6 },
    color: '#f0f0f0',
    accent: '#d0d0d0',
    top: '#e8e8e8',
  },
  kitchen_unit: {
    label: 'Kuchyňský modul',
    icon: '🧊',
    size: { w: 1.0, h: 0.9, d: 0.6 },
    color: '#f0f0f0',
    accent: '#d0d0d0',
    top: '#e8e8e8',
  },
  kitchen_oven: {
    label: 'Trouba',
    icon: '🔥',
    size: { w: 0.6, h: 0.9, d: 0.6 },
    color: '#f0f0f0',
    accent: '#d0d0d0',
    top: '#e8e8e8',
    glass: '#1c1c24',
  },
  kitchen_dishwasher: {
    label: 'Myčka',
    icon: '🫧',
    size: { w: 0.6, h: 0.9, d: 0.6 },
    color: '#f0f0f0',
    accent: '#e4e4e4',
    top: '#e8e8e8',
  },
  kitchen_hood: {
    label: 'Digestoř',
    icon: '💨',
    size: { w: 0.9, h: 0.75, d: 0.5 },
    color: '#b8bcc4',
    accent: '#8a9098',
    steel: '#c0c4cc',
    mountOffset: 0.9,
  },
  kitchen_fridge: {
    label: 'Lednice',
    icon: '🧊',
    size: { w: 0.65, h: 1.9, d: 0.62 },
    color: '#f0f2f6',
    accent: '#b8c0c8',
    inner: '#f8fafc',
    handle: '#9aa4ae',
  },
  dining_table: {
    label: 'Velký jídelní stůl',
    icon: '🍽️',
    size: { w: 1.6, h: 0.75, d: 0.9 },
    color: '#8b6914',
    accent: '#a07818',
  },
  dining_table_small: {
    label: 'Malý jídelní stůl',
    icon: '🥄',
    size: { w: 0.9, h: 0.72, d: 0.9 },
    color: '#9a7a28',
    accent: '#b8922a',
  },
  dining_table_medium: {
    label: 'Střední jídelní stůl',
    icon: '🍴',
    size: { w: 1.2, h: 0.74, d: 0.85 },
    color: '#8b6914',
    accent: '#a07818',
  },
  dining_table_large: {
    label: 'Velký jídelní stůl',
    icon: '🍽️',
    size: { w: 1.6, h: 0.75, d: 0.9 },
    color: '#7a5a10',
    accent: '#9a7020',
  },
  chair: {
    label: 'Židle',
    icon: '💺',
    size: { w: 0.45, h: 0.9, d: 0.45 },
    color: '#4a5568',
    accent: '#718096',
  },
  carpet: {
    label: 'Koberec',
    icon: '🟫',
    size: { w: 1, h: 0.03, d: 1 },
    color: '#6b4c34',
    accent: '#c9a66b',
    resizable: true,
  },
  bath_carpet: {
    label: 'Koupelnový koberec',
    icon: '🧶',
    size: { w: 1, h: 0.022, d: 1 },
    color: '#5a8a9a',
    accent: '#e0f0f6',
    resizable: true,
  },
  desk: {
    label: 'Velký psací stůl',
    icon: '🖥️',
    size: { w: 1.4, h: 0.75, d: 0.7 },
    color: '#654321',
    accent: '#8b5a2b',
  },
  desk_small: {
    label: 'Malý psací stůl',
    icon: '📝',
    size: { w: 0.9, h: 0.72, d: 0.55 },
    color: '#7a5a3a',
    accent: '#9a7048',
  },
  desk_medium: {
    label: 'Střední psací stůl',
    icon: '✏️',
    size: { w: 1.2, h: 0.74, d: 0.65 },
    color: '#654321',
    accent: '#8b5a2b',
  },
  desk_large: {
    label: 'Velký psací stůl',
    icon: '🖥️',
    size: { w: 1.6, h: 0.75, d: 0.75 },
    color: '#5c4020',
    accent: '#7a5030',
  },
  toilet: {
    label: 'WC',
    icon: '🚽',
    size: { w: 0.4, h: 0.75, d: 0.65 },
    color: '#f5f5f5',
    accent: '#e0e0e0',
    inner: '#e8edf0',
    seat: '#f2f2f4',
  },
  sink: {
    label: 'Umyvadlo',
    icon: '🚰',
    size: { w: 0.65, h: 0.85, d: 0.45 },
    color: '#f5f5f5',
    accent: '#d8dce0',
    inner: '#e8edf1',
  },
  bathtub: {
    label: 'Vana',
    icon: '🛁',
    size: { w: 1.7, h: 0.55, d: 0.75 },
    color: '#f5f5f5',
    accent: '#e8ecef',
    inner: '#b8c8d4',
  },
  bath_shelf: {
    label: 'Bambusová skříňka',
    icon: '🧺',
    size: { w: 0.72, h: 1.0, d: 0.34 },
    color: '#c8a878',
    accent: '#9a7048',
    shelf: '#d8bc90',
    towel: '#4a7a8c',
  },
  shower: {
    label: 'Sprcha',
    icon: '🚿',
    size: { w: 0.9, h: 2.1, d: 0.9 },
    color: '#f2f4f6',
    accent: '#d0dce6',
    glass: '#a8cce0',
    tile: '#dce8f2',
  },
};

/** Kategorie pro levý panel — pořadí a seskupení položek */
export const CATALOG_CATEGORIES = [
  {
    id: 'structural',
    label: 'Stavební prvky',
    icon: '🏗️',
    items: ['door', 'window', 'window_small', 'window_large', 'balcony_door', 'radiator'],
  },
  {
    id: 'living',
    label: 'Obývací pokoj',
    icon: '🛋️',
    items: [
      'sofa', 'armchair', 'tv', 'fireplace', 'table', 'bookshelf',
      'shelf_small', 'shelf_small_cabinet', 'shelf_medium', 'shelf_medium_cabinet', 'shelf_large', 'shelf_large_cabinet',
      'plant', 'plant_medium', 'plant_large', 'lamp_small', 'lamp_medium', 'lamp', 'lamp_pendant', 'lamp_ceiling', 'lamp_wall', 'carpet',
    ],
  },
  {
    id: 'bedroom',
    label: 'Ložnice',
    icon: '🛏️',
    items: ['bed_single', 'bed_double', 'wardrobe', 'nightstand', 'shelf_small', 'shelf_small_cabinet', 'plant', 'plant_medium', 'lamp_small', 'lamp_medium', 'lamp', 'lamp_pendant', 'lamp_ceiling', 'lamp_wall'],
  },
  {
    id: 'kitchen',
    label: 'Kuchyně & jídelna',
    icon: '🍳',
    items: ['kitchen', 'kitchen_unit', 'kitchen_oven', 'kitchen_dishwasher', 'kitchen_hood', 'kitchen_fridge', 'dining_table_small', 'dining_table_medium', 'dining_table_large', 'chair'],
  },
  {
    id: 'office',
    label: 'Pracovna',
    icon: '🖥️',
    items: ['desk_small', 'desk_medium', 'desk_large', 'chair', 'bookshelf', 'shelf_medium', 'shelf_medium_cabinet', 'lamp_small', 'lamp_medium', 'lamp_pendant', 'lamp_ceiling', 'lamp_wall'],
  },
  {
    id: 'bathroom',
    label: 'Koupelna',
    icon: '🛁',
    items: ['toilet', 'sink', 'bathtub', 'bath_shelf', 'shower', 'radiator', 'bath_carpet', 'lamp_wall'],
  },
];

/** Plochý katalog pro zpětnou kompatibilitu */
export const FURNITURE_CATALOG = { ...FURNITURE_ITEMS };

export const DOOR_TYPES = new Set(['door', 'balcony_door']);
export const WALL_GAP_TYPES = new Set(['door', 'balcony_door', 'window', 'window_small', 'window_large']);

export const WINDOW_TYPES = new Set(['window', 'window_small', 'window_large']);
export const SHELF_CABINET_TYPES = new Set([
  'shelf_small_cabinet',
  'shelf_medium_cabinet',
  'shelf_large_cabinet',
]);

export const CABINET_TYPES = new Set([...SHELF_CABINET_TYPES, 'wardrobe']);

export const CARPET_TYPES = new Set(['carpet', 'bath_carpet']);

export const TV_STYLES = {
  wall: { label: 'Vyvěšená', icon: '📺' },
  wall_inset: { label: 'Na zdi', icon: '🧱' },
  stand: { label: 'Na polici', icon: '🎮' },
};

export const TV_STYLE_DEFAULTS = { tv: 'wall' };

export function isTvType(type) {
  return type === 'tv';
}

export function isTvWallInsetStyle(tvStyle) {
  return tvStyle === 'wall_inset';
}

/** Zarovnání na zeď + výřez ve zdi (dveře, okna, TV zapuštěná ve zdi) */
export function usesWallSnap(type, tvStyle) {
  return isWallGapType(type) || (isTvType(type) && isTvWallInsetStyle(tvStyle)) || type === 'lamp_wall';
}

export const CARPET_SHAPES = {
  rect: { label: 'Obdélník', icon: '▭' },
  round: { label: 'Kulatý', icon: '●' },
  oval: { label: 'Ovál', icon: '⬭' },
  rounded: { label: 'Zaoblený', icon: '▢' },
};

export const CARPET_PATTERNS = {
  plain: { label: 'Jednobarevný', icon: '◻', types: ['carpet', 'bath_carpet'] },
  border: { label: 'Rámeček', icon: '▣', types: ['carpet', 'bath_carpet'] },
  stripes: { label: 'Pruhy', icon: '≡', types: ['carpet', 'bath_carpet'] },
  diamond: { label: 'Kosočtverce', icon: '◇', types: ['carpet'] },
  shag: { label: 'Vlna', icon: '≋', types: ['carpet'] },
  dots: { label: 'Tečky', icon: '∷', types: ['bath_carpet'] },
};

export const CARPET_STYLE_DEFAULTS = {
  carpet: { shape: 'rect', pattern: 'border', color: '#6b4c34', accent: '#c9a66b' },
  bath_carpet: { shape: 'rounded', pattern: 'dots', color: '#5a8a9a', accent: '#e0f0f6' },
};

export function getCarpetPatternsForType(type) {
  return Object.entries(CARPET_PATTERNS).filter(([, meta]) => meta.types.includes(type));
}

export const OPENABLE_TYPES = new Set([
  'door',
  'balcony_door',
  ...WINDOW_TYPES,
  'bath_shelf',
  'kitchen_oven',
  'kitchen_dishwasher',
  'kitchen_fridge',
  ...CABINET_TYPES,
]);

export function getFurnitureMountOffset(type) {
  return FURNITURE_ITEMS[type]?.mountOffset ?? 0;
}

export function isDoorType(type) {
  return DOOR_TYPES.has(type);
}

export function isWallGapType(type) {
  return WALL_GAP_TYPES.has(type);
}

export function isWindowType(type) {
  return WINDOW_TYPES.has(type);
}

export function isShelfCabinetType(type) {
  return SHELF_CABINET_TYPES.has(type);
}

export function isCabinetType(type) {
  return CABINET_TYPES.has(type);
}

export function isOpenableType(type) {
  return OPENABLE_TYPES.has(type);
}

export function isCarpetType(type) {
  return CARPET_TYPES.has(type);
}

let furnitureIdCounter = 0;

export function createFurnitureMesh(type, mode = 'preview', {
  furnitureId,
  sizeW,
  sizeD,
  carpetShape,
  carpetPattern,
  carpetColor,
  carpetAccent,
  tvStyle,
} = {}) {
  const def = FURNITURE_ITEMS[type];
  if (!def) return null;

  const styleDefaults = CARPET_STYLE_DEFAULTS[type] ?? {};

  const group = new THREE.Group();
  group.userData = {
    isFurniture: true,
    furnitureType: type,
    furnitureId: furnitureId ?? `f-${++furnitureIdCounter}`,
    rotatable: !isCarpetType(type),
    doorOpen: false,
  };

  const w = sizeW ?? def.size.w;
  const h = def.size.h;
  const d = sizeD ?? def.size.d;
  const isArchitect = mode === 'architect';

  if (isCarpetType(type)) {
    group.userData.sizeW = w;
    group.userData.sizeD = d;
    group.userData.carpetShape = carpetShape ?? styleDefaults.shape ?? 'rect';
    group.userData.carpetPattern = carpetPattern ?? styleDefaults.pattern ?? 'plain';
    group.userData.carpetColor = carpetColor ?? styleDefaults.color ?? def.color;
    group.userData.carpetAccent = carpetAccent ?? styleDefaults.accent ?? def.accent;
  }

  if (isTvType(type)) {
    group.userData.tvStyle = tvStyle ?? TV_STYLE_DEFAULTS.tv ?? 'wall';
  }

  switch (type) {
    case 'door':
      buildDoor(group, w, h, d, def, isArchitect);
      break;
    case 'window':
    case 'window_small':
    case 'window_large':
      buildWindow(group, w, h, d, def, isArchitect);
      break;
    case 'balcony_door':
      buildBalconyDoor(group, w, h, d, def, isArchitect);
      break;
    case 'radiator':
      buildRadiator(group, w, h, d, def, isArchitect);
      break;
    case 'sofa':
      buildSofa(group, w, h, d, def, isArchitect);
      break;
    case 'armchair':
      buildArmchair(group, w, h, d, def, isArchitect);
      break;
    case 'bed':
    case 'bed_single':
    case 'bed_double':
      buildBed(group, w, h, d, def, isArchitect);
      break;
    case 'chair':
      addBox(group, w, h * 0.05, d, 0, h * 0.45, 0, def.color, isArchitect);
      addBox(group, w, h * 0.5, d * 0.08, 0, h * 0.75, -d * 0.46, def.accent, isArchitect);
      addLegs(group, w, d, h * 0.45, def.accent, isArchitect);
      break;
    case 'tv':
      buildTv(group, w, h, d, def, isArchitect, group.userData.tvStyle);
      break;
    case 'fireplace':
      buildFireplace(group, w, h, d, def, isArchitect);
      break;
    case 'bookshelf':
      buildBookshelf(group, w, h, d, def, isArchitect);
      break;
    case 'shelf_small':
    case 'shelf_medium':
    case 'shelf_large':
    case 'shelf_small_cabinet':
    case 'shelf_medium_cabinet':
    case 'shelf_large_cabinet':
      buildShelf(group, w, h, d, def, isArchitect);
      break;
    case 'plant':
      buildPlantSmall(group, w, h, d, def, isArchitect);
      break;
    case 'plant_medium':
      buildPlantMedium(group, w, h, d, def, isArchitect);
      break;
    case 'plant_large':
      buildPlantLarge(group, w, h, d, def, isArchitect);
      break;
    case 'kitchen':
      buildKitchenLine(group, w, h, d, def, isArchitect);
      break;
    case 'kitchen_unit':
      buildKitchenUnit(group, w, h, d, def, isArchitect);
      break;
    case 'kitchen_oven':
      buildKitchenOven(group, w, h, d, def, isArchitect);
      break;
    case 'kitchen_dishwasher':
      buildKitchenDishwasher(group, w, h, d, def, isArchitect);
      break;
    case 'kitchen_hood':
      buildKitchenHood(group, w, h, d, def, isArchitect);
      break;
    case 'kitchen_fridge':
      buildKitchenFridge(group, w, h, d, def, isArchitect);
      break;
    case 'lamp':
      buildLampLarge(group, w, h, d, def, isArchitect);
      break;
    case 'lamp_medium':
      buildLampMedium(group, w, h, d, def, isArchitect);
      break;
    case 'lamp_small':
      buildLampSmall(group, w, h, d, def, isArchitect);
      break;
    case 'lamp_pendant':
      buildLampPendant(group, w, h, d, def, isArchitect);
      break;
    case 'lamp_ceiling':
      buildLampCeiling(group, w, h, d, def, isArchitect);
      break;
    case 'lamp_wall':
      buildLampWall(group, w, h, d, def, isArchitect);
      break;
    case 'wardrobe':
      buildWardrobe(group, w, h, d, def, isArchitect);
      break;
    case 'nightstand':
      addBox(group, w, h * 0.85, d, 0, h * 0.425, 0, def.color, isArchitect);
      addBox(group, w * 0.9, h * 0.08, d * 0.85, 0, h * 0.89, 0, def.accent, isArchitect);
      addLegs(group, w * 0.85, d * 0.85, h * 0.4, def.accent, isArchitect);
      break;
    case 'desk':
    case 'desk_small':
    case 'desk_medium':
    case 'desk_large':
      buildDesk(group, w, h, d, def, isArchitect);
      break;
    case 'dining_table':
    case 'dining_table_small':
    case 'dining_table_medium':
    case 'dining_table_large':
      buildDiningTable(group, w, h, d, def, isArchitect);
      break;
    case 'toilet':
      buildToilet(group, w, h, d, def, isArchitect);
      break;
    case 'sink':
      buildSink(group, w, h, d, def, isArchitect);
      break;
    case 'bathtub':
      buildBathtub(group, w, h, d, def, isArchitect);
      break;
    case 'bath_shelf':
      buildBathShelf(group, w, h, d, def, isArchitect);
      break;
    case 'shower':
      buildShower(group, w, h, d, def, isArchitect);
      break;
    case 'carpet':
    case 'bath_carpet':
      buildCarpet(group, w, h, d, def, isArchitect);
      break;
    default:
      addBox(group, w, h, d, 0, h * 0.5, 0, def.color, isArchitect);
      break;
  }

  return group;
}

function buildKitchenUnit(group, w, h, d, def, architect) {
  const baseH = h * 0.7;
  const topH = h * 0.05;
  const splashH = h * 0.2;
  const topColor = def.top ?? '#e8e8e8';

  addBox(group, w, baseH, d, 0, baseH * 0.5, 0, def.color, architect);
  addBox(group, w * 0.86, baseH * 0.8, 0.02, 0, baseH * 0.48, d * 0.48, def.accent, architect);
  addBox(group, w * 0.3, 0.02, 0.03, 0, baseH * 0.52, d * 0.49, '#b0b0b0', architect);
  addBox(group, w * 0.86, baseH * 0.22, 0.02, 0, baseH * 0.2, d * 0.48, def.accent, architect);
  addBox(group, w * 0.25, 0.015, 0.025, 0, baseH * 0.2, d * 0.49, '#b0b0b0', architect);

  addBox(group, w * 1.03, topH, d * 1.02, 0, baseH + topH * 0.5, 0, topColor, architect);
  addBox(group, w * 0.5, 0.07, d * 0.42, 0, baseH + topH + 0.035, d * 0.06, '#c8d0d8', architect);
  addBox(group, w * 0.4, 0.035, d * 0.32, 0, baseH + topH + 0.018, d * 0.08, '#a8b8c8', architect);
  addBox(group, w * 0.28, 0.012, d * 0.28, w * 0.22, baseH + topH + 0.008, -d * 0.08, '#2a2a2a', architect);

  addBox(group, w, splashH, 0.02, 0, baseH + topH + splashH * 0.5, -d * 0.49, '#fafafa', architect);
  addBox(group, w * 0.12, splashH * 0.35, 0.03, 0, baseH + topH + splashH * 0.65, -d * 0.46, '#c0c0c0', architect);
}

function addDropDownApplianceDoor(group, doorW, doorH, doorT, hingeY, frontZ, def, architect, {
  glass = false,
  glassColor = '#1c1c24',
  frameColor = '#e8e8e8',
  pivotRole = 'drop-door-pivot',
} = {}) {
  const doorPivot = new THREE.Group();
  doorPivot.position.set(0, hingeY, frontZ);
  doorPivot.userData.partRole = pivotRole;
  group.add(doorPivot);

  addBox(doorPivot, doorW, doorH, doorT, 0, doorH * 0.5, 0, frameColor, architect, {
    partRole: 'appliance-door',
    doubleSided: true,
  });

  if (glass) {
    addBox(doorPivot, doorW * 0.84, doorH * 0.58, 0.012, 0, doorH * 0.62, doorT * 0.46, glassColor, architect, {
      partRole: 'appliance-door',
      isGlass: true,
      doubleSided: true,
    });
    addBox(doorPivot, doorW * 0.78, doorH * 0.5, 0.008, 0, doorH * 0.6, doorT * 0.48, '#0a0a12', architect, {
      partRole: 'appliance-door',
      doubleSided: true,
    });
  }

  addBox(doorPivot, doorW * 0.42, 0.022, 0.03, 0, doorH * 0.9, doorT * 0.52, '#b0b0b0', architect, {
    partRole: 'handle',
    doubleSided: true,
  });
}

function buildKitchenOven(group, w, h, d, def, architect) {
  const baseH = h * 0.7;
  const topH = h * 0.05;
  const splashH = h * 0.2;
  const topColor = def.top ?? '#e8e8e8';
  const glass = def.glass ?? '#1c1c24';
  const doorH = baseH * 0.58;
  const doorBottomY = baseH * 0.08;
  const doorW = w * 0.9;
  const doorT = 0.02;
  const frontZ = d * 0.5 - doorT * 0.35;
  const cavityH = baseH * 0.5;
  const cavityBottomY = doorBottomY + 0.03;
  const cavityCenterY = cavityBottomY + cavityH * 0.5;
  const cavityDepth = d * 0.4;
  const cavityBackZ = -d * 0.2;

  addBox(group, w, baseH, d, 0, baseH * 0.5, 0, def.color, architect);

  addBox(group, w * 0.78, cavityH, 0.02, 0, cavityCenterY, cavityBackZ - cavityDepth * 0.5, '#2a2a2a', architect);
  addBox(group, 0.02, cavityH, cavityDepth, -w * 0.39, cavityCenterY, cavityBackZ, '#333333', architect);
  addBox(group, 0.02, cavityH, cavityDepth, w * 0.39, cavityCenterY, cavityBackZ, '#333333', architect);
  addBox(group, w * 0.76, 0.02, cavityDepth, 0, cavityBottomY, cavityBackZ, '#3a3a3a', architect);
  addBox(group, w * 0.62, 0.012, d * 0.3, 0, cavityBottomY + 0.05, cavityBackZ + cavityDepth * 0.15, '#8a9098', architect, {
    keepColor: true,
    emissive: '#4a5058',
  });
  addBox(group, w * 0.56, 0.006, d * 0.26, 0, cavityBottomY + 0.062, cavityBackZ + cavityDepth * 0.15, '#b0b8c0', architect);

  addBox(group, w * 0.9, baseH * 0.14, 0.018, 0, baseH * 0.76, d * 0.49, def.accent, architect);
  addCylinder(group, 0.024, 0.012, '#c0c0c0', architect, { x: -w * 0.26, y: baseH * 0.76, z: d * 0.5 });
  addCylinder(group, 0.024, 0.012, '#c0c0c0', architect, { x: -w * 0.1, y: baseH * 0.76, z: d * 0.5 });
  addBox(group, w * 0.16, 0.035, 0.01, w * 0.18, baseH * 0.76, d * 0.5, '#1a1a1a', architect);

  addDropDownApplianceDoor(group, doorW, doorH, doorT, doorBottomY, frontZ, def, architect, {
    glass: true,
    glassColor: glass,
    frameColor: def.color,
    pivotRole: 'oven-door-pivot',
  });

  addBox(group, w * 1.03, topH, d * 1.02, 0, baseH + topH * 0.5, 0, topColor, architect);
  addBox(group, w * 0.9, 0.01, d * 0.82, 0, baseH + topH + 0.006, d * 0.02, '#141414', architect);
  const burners = [
    [-w * 0.2, -d * 0.1],
    [w * 0.2, -d * 0.1],
    [-w * 0.2, d * 0.12],
    [w * 0.2, d * 0.12],
  ];
  burners.forEach(([bx, bz]) => {
    addCylinder(group, 0.055, 0.006, '#222222', architect, { x: bx, y: baseH + topH + 0.012, z: bz });
    addCylinder(group, 0.032, 0.004, '#3a3a3a', architect, { x: bx, y: baseH + topH + 0.015, z: bz });
  });
  addBox(group, w, splashH, 0.02, 0, baseH + topH + splashH * 0.5, -d * 0.49, '#fafafa', architect);
}

function buildKitchenDishwasher(group, w, h, d, def, architect) {
  const baseH = h * 0.7;
  const topH = h * 0.05;
  const splashH = h * 0.2;
  const topColor = def.top ?? '#e8e8e8';
  const doorH = baseH * 0.62;
  const doorBottomY = baseH * 0.06;
  const doorW = w * 0.92;
  const doorT = 0.022;
  const frontZ = d * 0.5 - doorT * 0.35;
  const cavityH = baseH * 0.52;
  const cavityBottomY = doorBottomY + 0.04;
  const cavityCenterY = cavityBottomY + cavityH * 0.5;
  const cavityDepth = d * 0.38;
  const cavityBackZ = -d * 0.18;

  addBox(group, w, baseH, d, 0, baseH * 0.5, 0, def.color, architect);

  addBox(group, w * 0.8, cavityH, 0.02, 0, cavityCenterY, cavityBackZ - cavityDepth * 0.5, '#c8d0d8', architect);
  addBox(group, 0.02, cavityH, cavityDepth, -w * 0.4, cavityCenterY, cavityBackZ, '#b8c0c8', architect);
  addBox(group, 0.02, cavityH, cavityDepth, w * 0.4, cavityCenterY, cavityBackZ, '#b8c0c8', architect);
  addBox(group, w * 0.78, 0.02, cavityDepth, 0, cavityBottomY, cavityBackZ, '#a8b0b8', architect);

  for (let row = 0; row < 3; row++) {
    const rackY = cavityBottomY + 0.08 + row * 0.1;
    addBox(group, w * 0.72, 0.006, 0.01, 0, rackY, cavityBackZ + cavityDepth * 0.35, '#9098a0', architect);
    for (let col = 0; col < 2; col++) {
      const px = (col - 0.5) * w * 0.34;
      const pz = cavityBackZ + cavityDepth * (0.2 + row * 0.22);
      addCylinder(group, 0.095, 0.01, ['#eef2f5', '#e4eaef', '#f5f8fa'][row], architect, {
        x: px,
        y: rackY + 0.04,
        z: pz,
      });
      addCylinder(group, 0.07, 0.006, '#dce4ea', architect, { x: px, y: rackY + 0.055, z: pz });
    }
  }

  addBox(group, w * 0.92, 0.055, 0.024, 0, baseH * 0.77, d * 0.5, '#d8d8d8', architect);
  addBox(group, 0.035, 0.008, 0.008, w * 0.34, baseH * 0.77, d * 0.505, '#3a8833', architect, {
    emissive: '#2a6622',
    keepColor: true,
  });

  addDropDownApplianceDoor(group, doorW, doorH, doorT, doorBottomY, frontZ, def, architect, {
    frameColor: def.accent,
    pivotRole: 'dishwasher-door-pivot',
  });

  addBox(group, w * 1.03, topH, d * 1.02, 0, baseH + topH * 0.5, 0, topColor, architect);
  addBox(group, w, splashH, 0.02, 0, baseH + topH + splashH * 0.5, -d * 0.49, '#fafafa', architect);
}

function addFridgeFoodBox(group, x, y, z, bw, bh, bd, color, architect) {
  addBox(group, bw, bh, bd, x, y, z, color, architect, { keepColor: true });
}

function addFridgeProduce(group, x, y, z, color, architect, radius = 0.038) {
  addSphere(group, radius, y, color, architect, { x, z, keepColor: true });
}

function buildKitchenFridge(group, w, h, d, def, architect) {
  const body = def.color ?? '#f0f2f6';
  const inner = def.inner ?? '#f8fafc';
  const trim = def.accent ?? '#b8c0c8';
  const handle = def.handle ?? '#9aa4ae';
  const side = 0.04;
  const doorT = 0.022;
  const frontZ = d * 0.5 - doorT * 0.5;
  const innerW = w - side * 2;
  const cavityDepth = d * 0.5;
  const cavityZ = -d * 0.5 + side + cavityDepth * 0.5;
  const splitY = h * 0.68;
  const shell = { keepColor: true, partRole: 'fridge-shell' };
  const cavity = { keepColor: true, partRole: 'fridge-interior' };

  addBox(group, w, side, d, 0, h - side * 0.5, 0, body, architect, shell);
  addBox(group, w, side, d, 0, side * 0.5, 0, body, architect, shell);
  addBox(group, side, h - side * 2, d, -w * 0.5 + side * 0.5, h * 0.5, 0, body, architect, shell);
  addBox(group, side, h - side * 2, d, w * 0.5 - side * 0.5, h * 0.5, 0, body, architect, shell);
  addBox(group, innerW, h - side * 2, side, 0, h * 0.5, -d * 0.5 + side * 0.5, trim, architect, shell);

  addBox(group, innerW, h - side * 2, 0.02, 0, h * 0.5, -d * 0.5 + side + 0.01, inner, architect, cavity);
  addBox(group, 0.02, h - side * 2, cavityDepth, -innerW * 0.5 + 0.01, h * 0.5, cavityZ, inner, architect, cavity);
  addBox(group, 0.02, h - side * 2, cavityDepth, innerW * 0.5 - 0.01, h * 0.5, cavityZ, inner, architect, cavity);
  addBox(group, innerW, 0.02, cavityDepth, 0, side + 0.01, cavityZ, inner, architect, cavity);
  addBox(group, innerW, 0.02, cavityDepth, 0, h - side - 0.01, cavityZ, inner, architect, cavity);
  addBox(group, innerW * 0.94, 0.01, cavityDepth * 0.9, 0, splitY, cavityZ, trim, architect, cavity);

  const shelfDepth = cavityDepth * 0.82;
  const shelfFrontZ = cavityZ + cavityDepth * 0.22;
  const shelfLevels = [h * 0.2, h * 0.38, h * 0.54, h * 0.7, h * 0.86, h * 1.02];
  for (const shelfY of shelfLevels) {
    addBox(group, innerW * 0.9, 0.014, shelfDepth, 0, shelfY, shelfFrontZ, '#e8eef4', architect, {
      keepColor: true,
      isGlass: true,
      partRole: 'fridge-interior',
    });
    addBox(group, innerW * 0.86, 0.004, shelfDepth * 0.92, 0, shelfY + 0.008, shelfFrontZ, '#d0dae4', architect, cavity);
  }

  const itemZ = shelfFrontZ + shelfDepth * 0.18;
  addFridgeFoodBox(group, -innerW * 0.2, h * 0.9, itemZ, innerW * 0.24, 0.12, 0.11, '#e85a4a', architect);
  addFridgeFoodBox(group, innerW * 0.14, h * 0.9, itemZ + 0.04, innerW * 0.2, 0.1, 0.1, '#4a90c8', architect);
  addFridgeFoodBox(group, 0, h * 0.9, itemZ - 0.02, innerW * 0.16, 0.09, 0.09, '#f0e8d0', architect);

  addFridgeFoodBox(group, -innerW * 0.18, h * 0.74, itemZ, innerW * 0.14, 0.14, 0.1, '#fff8f0', architect);
  addFridgeFoodBox(group, innerW * 0.16, h * 0.74, itemZ + 0.03, innerW * 0.12, 0.16, 0.09, '#f5f0e8', architect);
  addFridgeProduce(group, -innerW * 0.04, h * 0.76, itemZ + 0.08, '#3a9e4a', architect, 0.042);
  addFridgeProduce(group, innerW * 0.06, h * 0.75, itemZ + 0.1, '#e87830', architect, 0.04);

  addFridgeFoodBox(group, -innerW * 0.22, h * 0.56, itemZ, innerW * 0.13, 0.15, 0.1, '#f8d878', architect);
  addFridgeProduce(group, -innerW * 0.08, h * 0.58, itemZ + 0.06, '#6ab04c', architect, 0.04);
  addFridgeProduce(group, innerW * 0.04, h * 0.57, itemZ + 0.08, '#c83838', architect, 0.038);
  addFridgeProduce(group, innerW * 0.18, h * 0.58, itemZ + 0.04, '#8bc34a', architect, 0.036);
  addCylinder(group, 0.032, 0.14, '#f0f4f8', architect, {
    x: -innerW * 0.02,
    y: h * 0.58,
    z: itemZ + 0.1,
    keepColor: true,
    partRole: 'fridge-interior',
  });

  addFridgeFoodBox(group, innerW * 0.16, h * 0.4, itemZ, innerW * 0.1, 0.18, 0.09, '#fffef8', architect);
  addFridgeFoodBox(group, -innerW * 0.14, h * 0.38, itemZ + 0.05, innerW * 0.16, 0.11, 0.1, '#e8f0ff', architect);

  const drawerH = h * 0.14;
  const drawerY = side + drawerH * 0.5;
  const drawerZ = cavityZ + cavityDepth * 0.15;
  addBox(group, innerW * 0.88, drawerH, cavityDepth * 0.72, 0, drawerY, drawerZ, '#dce8dc', architect, cavity);
  addBox(group, innerW * 0.82, drawerH * 0.65, cavityDepth * 0.65, 0, drawerY, drawerZ + cavityDepth * 0.08, '#e8f4e8', architect, cavity);
  addFridgeProduce(group, -innerW * 0.16, drawerY + 0.02, drawerZ + cavityDepth * 0.28, '#4a9a3a', architect, 0.04);
  addFridgeProduce(group, 0, drawerY + 0.01, drawerZ + cavityDepth * 0.32, '#8bc34a', architect, 0.038);
  addFridgeProduce(group, innerW * 0.14, drawerY + 0.02, drawerZ + cavityDepth * 0.26, '#e05030', architect, 0.035);
  addFridgeProduce(group, -innerW * 0.04, drawerY - 0.01, drawerZ + cavityDepth * 0.3, '#6ab04c', architect, 0.032);

  const doorW = innerW;
  const doorH = h - side * 2;
  const doorPivot = new THREE.Group();
  doorPivot.position.set(-w * 0.5 + side, h * 0.5, frontZ);
  doorPivot.userData.partRole = 'cabinet-door-pivot';
  group.add(doorPivot);
  addBox(doorPivot, doorW, doorH, doorT, doorW * 0.5, 0, 0, body, architect, {
    partRole: 'cabinet-door',
    doubleSided: true,
    keepColor: true,
  });
  addBox(doorPivot, 0.03, 0.14, 0.024, doorW * 0.88, splitY - h * 0.5, doorT * 0.55, handle, architect, {
    partRole: 'cabinet-handle',
    doubleSided: true,
    keepColor: true,
  });
}

function buildKitchenHood(group, w, h, d, def, architect) {
  const steel = def.steel ?? '#c0c4cc';
  const steelDark = def.accent ?? '#8a9098';
  const bottomY = h * 0.16;
  const hoodH = h * 0.44;
  const chimneyH = h * 0.35;
  const hoodCY = bottomY + hoodH * 0.42;

  addBox(group, w * 0.34, chimneyH, d * 0.4, 0, bottomY + hoodH + chimneyH * 0.5, -d * 0.08, steelDark, architect);
  addBox(group, w * 0.26, chimneyH * 0.88, d * 0.34, 0, bottomY + hoodH + chimneyH * 0.5, -d * 0.06, steel, architect);
  addBox(group, w * 0.9, hoodH * 0.34, d * 0.86, 0, hoodCY, d * 0.05, steel, architect);
  addBox(group, w * 0.68, hoodH * 0.52, d * 0.7, 0, hoodCY + hoodH * 0.26, -d * 0.02, steel, architect);
  addBox(group, w * 0.44, hoodH * 0.22, d * 0.48, 0, hoodCY + hoodH * 0.48, -d * 0.04, steelDark, architect);
  addBox(group, w * 0.86, 0.038, d * 0.8, 0, bottomY, d * 0.08, steelDark, architect);
  for (let i = -3; i <= 3; i++) {
    addBox(group, w * 0.78, 0.006, 0.01, i * w * 0.1, bottomY + 0.02, d * 0.47, '#707880', architect);
  }
  addBox(group, w * 0.11, 0.022, d * 0.07, -w * 0.24, bottomY - 0.008, d * 0.12, '#fff8e0', architect, {
    emissive: '#ffd070',
    keepColor: true,
  });
  addBox(group, w * 0.11, 0.022, d * 0.07, w * 0.24, bottomY - 0.008, d * 0.12, '#fff8e0', architect, {
    emissive: '#ffd070',
    keepColor: true,
  });
  addBox(group, w * 0.16, 0.028, 0.018, 0, hoodCY + hoodH * 0.4, d * 0.4, '#3a3a3a', architect);
  addCylinder(group, 0.011, 0.007, '#e0e0e0', architect, { x: -0.035, y: hoodCY + hoodH * 0.4, z: d * 0.42 });
  addCylinder(group, 0.011, 0.007, '#e0e0e0', architect, { x: 0.035, y: hoodCY + hoodH * 0.4, z: d * 0.42 });
}

function buildKitchenLine(group, w, h, d, def, architect) {
  const baseH = h * 0.7;
  const topH = h * 0.05;
  const splashH = h * 0.2;
  const topColor = def.top ?? '#e8e8e8';
  const segW = w * 0.47;
  const gap = w * 0.03;

  for (const xOff of [-segW * 0.5 - gap * 0.5, segW * 0.5 + gap * 0.5]) {
    addBox(group, segW, baseH, d, xOff, baseH * 0.5, 0, def.color, architect);
    addBox(group, segW * 0.88, baseH * 0.8, 0.02, xOff, baseH * 0.48, d * 0.48, def.accent, architect);
    addBox(group, segW * 0.3, 0.02, 0.03, xOff, baseH * 0.52, d * 0.49, '#b0b0b0', architect);
  }

  addBox(group, w * 0.98, topH, d * 1.02, 0, baseH + topH * 0.5, 0, topColor, architect);
  addBox(group, w * 0.35, 0.07, d * 0.42, -w * 0.22, baseH + topH + 0.035, d * 0.06, '#c8d0d8', architect);
  addBox(group, w * 0.28, 0.012, d * 0.28, w * 0.22, baseH + topH + 0.008, -d * 0.08, '#2a2a2a', architect);
  addBox(group, w, splashH, 0.02, 0, baseH + topH + splashH * 0.5, -d * 0.49, '#fafafa', architect);
}

function buildDiningTable(group, w, h, d, def, architect) {
  const topT = h * 0.06;
  const topY = h - topT * 0.5;
  const legH = h * 0.9;
  const compact = w < 1.05;

  addBox(group, w, topT, d, 0, topY, 0, def.color, architect);
  addBox(group, w * 1.01, topT * 0.35, d * 1.01, 0, topY - topT * 0.32, 0, def.accent, architect);

  if (compact) {
    addCylinder(group, w * 0.14, legH * 0.55, def.accent, architect, { y: legH * 0.28 });
    addCylinder(group, w * 0.28, topT * 0.5, def.color, architect, { y: legH * 0.58 });
    addBox(group, w * 0.45, topT * 0.25, d * 0.45, 0, topT * 0.12, 0, def.accent, architect);
  } else {
    addLegs(group, w * 0.82, d * 0.82, legH, def.accent, architect);
    addBox(group, w * 0.88, topT * 0.45, 0.04, 0, legH + topT * 0.2, d * 0.4, def.accent, architect);
    addBox(group, w * 0.88, topT * 0.45, 0.04, 0, legH + topT * 0.2, -d * 0.4, def.accent, architect);
    addBox(group, 0.04, topT * 0.45, d * 0.82, -w * 0.4, legH + topT * 0.2, 0, def.accent, architect);
    addBox(group, 0.04, topT * 0.45, d * 0.82, w * 0.4, legH + topT * 0.2, 0, def.accent, architect);
  }
}

function addDeskLamp(group, x, y, z, scale, architect) {
  const s = scale;
  addCylinder(group, s * 0.045, s * 0.015, '#333333', architect, { x, y: y + s * 0.008, z });
  addCylinder(group, s * 0.008, s * 0.1, '#888888', architect, { x, y: y + s * 0.06, z });
  addBox(group, s * 0.07, s * 0.05, s * 0.07, x, y + s * 0.12, z, '#fff4dc', architect, { emissive: '#fff4dc' });
}

function addLaptop(group, x, y, z, scale, architect) {
  const s = scale * 1.2;
  const bw = s * 0.3;
  const bd = s * 0.22;
  const top = y;

  addBox(group, bw, 0.02, bd, x, top + 0.01, z, '#9aa0b0', architect);
  addBox(group, bw * 0.92, 0.008, bd * 0.64, x, top + 0.018, z + bd * 0.1, '#1e1e28', architect);
  addBox(group, bw * 0.36, 0.006, bd * 0.28, x, top + 0.017, z - bd * 0.16, '#5a6070', architect);

  const backZ = z + bd * 0.44;
  addBox(group, bw * 0.92, 0.01, 0.014, x, top + 0.014, backZ, '#707888', architect);

  const screenH = s * 0.18;
  const screenW = bw * 0.9;
  const tilt = -0.68;
  const screenY = top + 0.03 + screenH * 0.38;
  const screenZ = backZ - screenH * 0.28;

  addLeaf(group, screenW, screenH, x, screenY, screenZ, '#2a3040', architect, 0, tilt);
  addLeaf(group, screenW * 0.84, screenH * 0.8, x, screenY + 0.012, screenZ + 0.018, '#3d8fd9', architect, 0, tilt);
  addLeaf(group, screenW * 0.2, screenH * 0.06, x, screenY - screenH * 0.32, screenZ + 0.01, '#888888', architect, 0, tilt);
}

function addDeskDrawerUnit(group, unitW, unitH, d, unitX, def, architect) {
  const frontZ = d * 0.46;
  const depth = d * 0.9;
  const drawerCount = 3;
  const drawerH = unitH / drawerCount;

  addBox(group, unitW, unitH, depth, unitX, unitH * 0.5, 0, def.accent, architect);
  addBox(group, unitW + 0.01, unitH + 0.01, depth + 0.01, unitX, unitH * 0.5, -0.005, '#4a3525', architect);

  for (let i = 0; i < drawerCount; i++) {
    const dy = drawerH * (i + 0.5);
    addBox(group, unitW * 0.9, drawerH * 0.76, 0.02, unitX, dy, frontZ, def.color, architect);
    addBox(group, unitW * 0.24, 0.018, 0.024, unitX, dy, frontZ + 0.012, '#b8b8b8', architect);
    if (i < drawerCount - 1) {
      addBox(group, unitW * 0.92, 0.005, 0.022, unitX, drawerH * (i + 1), frontZ - 0.001, '#5c4033', architect);
    }
  }

  addBox(group, unitW * 0.94, 0.04, depth * 0.85, unitX, 0.02, 0, '#3a2a1a', architect);
}

function addPaperStack(group, x, y, z, scale, architect) {
  const s = scale;
  const colors = ['#f8f8f8', '#f0f0f0', '#ffffff'];
  for (let i = 0; i < 3; i++) {
    addBox(group, s * 0.14, 0.004, s * 0.1, x + i * 0.008, y + 0.002 + i * 0.004, z + i * 0.006, colors[i], architect);
  }
}

function addNotebook(group, x, y, z, scale, architect) {
  const s = scale;
  addBox(group, s * 0.11, 0.007, s * 0.15, x, y + 0.0035, z, '#d45a3a', architect);
  addBox(group, s * 0.1, 0.005, s * 0.142, x + 0.003, y + 0.007, z + 0.004, '#f5f5ec', architect);
  addBox(group, s * 0.014, 0.009, s * 0.13, x - s * 0.048, y + 0.0045, z, '#b8b8b8', architect);
  for (let i = 0; i < 4; i++) {
    addBox(group, s * 0.008, s * 0.008, 0.006, x - s * 0.048, y + 0.01 + i * s * 0.018, z - s * 0.04 + i * s * 0.02, '#909090', architect);
  }
}

function addDeskMug(group, x, y, z, scale, architect) {
  const s = scale;
  addCylinder(group, s * 0.035, s * 0.06, '#d8e0e8', architect, { x, y: y + s * 0.03, z });
  addBox(group, s * 0.04, s * 0.025, s * 0.02, x + s * 0.04, y + s * 0.04, z, '#d8e0e8', architect);
}

function addMonitor(group, x, y, z, scale, architect) {
  const s = scale;
  addBox(group, s * 0.22, s * 0.14, 0.012, x, y + s * 0.08, z, '#1a1a2e', architect);
  addBox(group, s * 0.06, s * 0.05, 0.04, x, y + s * 0.02, z + 0.02, '#333333', architect);
  addBox(group, s * 0.1, 0.01, s * 0.06, x, y + 0.005, z + 0.02, '#444444', architect);
}

function addDeskAccessories(group, w, h, d, architect, level) {
  const topY = h * 0.97;
  const scale = Math.min(1, w / 1.2);

  addDeskLamp(group, -w * 0.32, topY, -d * 0.22, scale, architect);
  addPaperStack(group, w * 0.3, topY, -d * 0.18, scale, architect);
  addLaptop(group, w * 0.02, topY, -d * 0.06, scale, architect);

  if (level >= 2) {
    addNotebook(group, -w * 0.12, topY, d * 0.12, scale, architect);
    addDeskMug(group, w * 0.35, topY, d * 0.08, scale, architect);
  }

  if (level >= 3) {
    addPaperStack(group, w * 0.38, topY, -d * 0.05, scale * 0.9, architect);
    addBox(group, scale * 0.06, scale * 0.08, scale * 0.06, w * 0.38, topY + scale * 0.04, -d * 0.15, '#c0c0c0', architect);
  }
}

function buildDesk(group, w, h, d, def, architect) {
  const topT = h * 0.05;
  const topY = h - topT * 0.5;
  const legH = h * 0.9;
  const compact = w < 1.05;
  const level = compact ? 1 : w < 1.35 ? 2 : 3;

  addBox(group, w, topT, d, 0, topY, 0, def.color, architect);

  if (compact) {
    addLegs(group, w * 0.78, d * 0.78, legH, def.accent, architect);
  } else {
    const unitW = w * 0.32;
    const unitX = -w * 0.5 + unitW * 0.5 + 0.03;
    const unitH = legH * 0.88;
    addDeskDrawerUnit(group, unitW, unitH, d, unitX, def, architect);
    const lw = 0.04;
    for (const [lx, lz] of [
      [w * 0.3, -d * 0.32],
      [w * 0.3, d * 0.32],
      [w * 0.42, -d * 0.32],
      [w * 0.42, d * 0.32],
    ]) {
      addBox(group, lw, legH, lw, lx, legH * 0.5, lz, def.accent, architect);
    }
  }

  addDeskAccessories(group, w, h, d, architect, level);
}

function addPillow(group, x, y, z, pw, ph, pd, architect) {
  addBox(group, pw, ph, pd, x, y, z, '#ffffff', architect);
  addBox(group, pw * 0.88, ph * 0.18, pd * 0.82, x, y + ph * 0.22, z + pd * 0.04, '#f0f0f0', architect);
}

function buildTvWallInset(group, w, h, d, def, architect) {
  const screen = def.screen ?? '#101018';
  const bezel = def.color ?? '#1a1a2e';
  const mountY = h * 0.5 + 0.5;
  const depth = Math.max(d * 1.15, 0.07);
  const centerZ = WALL_THICKNESS / 2 + depth / 2;

  addBox(group, w, h, depth, 0, mountY, centerZ, bezel, architect, { keepColor: true });
  addBox(group, w * 0.9, h * 0.84, depth * 0.38, 0, mountY, centerZ + depth * 0.22, screen, architect, {
    emissive: '#1a2840',
    keepColor: true,
  });
  addBox(group, w * 0.12, 0.02, depth * 0.55, 0, mountY - h * 0.42, centerZ + depth * 0.16, '#111118', architect);
}

function buildTvWall(group, w, h, d, def, architect) {
  const screen = def.screen ?? '#101018';
  const bezel = def.color ?? '#1a1a2e';
  const mountY = h * 0.5 + 0.5;

  addBox(group, w * 0.62, 0.05, d * 1.8, 0, 0.5, 0, '#2a2a32', architect);
  addBox(group, w * 0.08, 0.22, d * 0.9, 0, 0.62, 0, '#3a3a44', architect);
  addBox(group, w, h, d * 1.1, 0, mountY, 0, bezel, architect);
  addBox(group, w * 0.9, h * 0.82, d * 0.35, 0, mountY, d * 0.22, screen, architect, {
    emissive: '#1a2840',
    keepColor: true,
  });
  addBox(group, w * 0.14, 0.02, d * 0.5, -w * 0.34, mountY - h * 0.38, d * 0.3, '#111118', architect);
}

function buildTvStand(group, w, h, d, def, architect) {
  const screen = def.screen ?? '#101018';
  const bezel = def.color ?? '#1a1a2e';
  const cabinet = def.stand ?? '#3a3028';
  const cabinetTop = def.standTop ?? '#4a4038';
  const legH = h * 0.1;
  const cabinetH = h * 0.46;
  const pedestalH = h * 0.07;
  const cabinetD = Math.max(d * 4.2, 0.34);
  const cabinetY = legH + cabinetH * 0.5;
  const screenH = h * 1.12;
  const screenY = legH + cabinetH + pedestalH + screenH * 0.5;
  const screenD = d * 1.1;

  for (const [lx, lz] of [
    [-w * 0.44, -cabinetD * 0.38],
    [w * 0.44, -cabinetD * 0.38],
    [-w * 0.44, cabinetD * 0.38],
    [w * 0.44, cabinetD * 0.38],
  ]) {
    addBox(group, 0.05, legH, 0.05, lx, legH * 0.5, lz + cabinetD * 0.08, '#2a2218', architect);
  }

  addBox(group, w * 1.08, cabinetH, cabinetD, 0, cabinetY, cabinetD * 0.08, cabinet, architect);
  addBox(group, w * 1.1, 0.018, cabinetD * 1.02, 0, legH + cabinetH + 0.009, cabinetD * 0.08, cabinetTop, architect);
  addBox(group, 0.02, cabinetH * 0.88, cabinetD * 0.9, -w * 0.36, cabinetY, cabinetD * 0.08, '#2a2218', architect);
  addBox(group, 0.02, cabinetH * 0.88, cabinetD * 0.9, w * 0.18, cabinetY, cabinetD * 0.08, '#2a2218', architect);

  addBox(group, w * 0.22, cabinetH * 0.72, cabinetD * 0.82, -w * 0.38, cabinetY, cabinetD * 0.08, '#2e2620', architect);
  addBox(group, w * 0.18, 0.11, 0.02, -w * 0.38, cabinetY + cabinetH * 0.18, cabinetD * 0.42, '#2a4a7a', architect, { keepColor: true });
  addBox(group, w * 0.16, 0.1, 0.02, -w * 0.38, cabinetY + cabinetH * 0.02, cabinetD * 0.42, '#7a2a2a', architect, { keepColor: true });
  addBox(group, w * 0.14, 0.09, 0.02, -w * 0.38, cabinetY - cabinetH * 0.14, cabinetD * 0.42, '#2a6a3a', architect, { keepColor: true });

  addBox(group, w * 0.34, 0.07, cabinetD * 0.55, w * 0.08, cabinetY - cabinetH * 0.08, cabinetD * 0.12, '#141414', architect);
  addBox(group, w * 0.28, 0.04, cabinetD * 0.48, w * 0.08, cabinetY - cabinetH * 0.02, cabinetD * 0.1, '#1e1e24', architect);
  addCylinder(group, 0.018, 0.006, '#2a2a30', architect, {
    x: w * 0.18,
    y: cabinetY - cabinetH * 0.02,
    z: cabinetD * 0.34,
  });

  addBox(group, w * 0.12, cabinetH * 0.42, cabinetD * 0.7, w * 0.4, cabinetY, cabinetD * 0.1, '#222228', architect);
  addBox(group, w * 0.05, 0.03, 0.04, w * 0.34, cabinetY - cabinetH * 0.05, cabinetD * 0.38, '#3a3a44', architect);

  const pedestalY = legH + cabinetH + pedestalH * 0.5;
  addBox(group, w * 0.22, pedestalH, screenD * 0.55, 0, pedestalY, cabinetD * 0.06, '#1a1a22', architect);
  addBox(group, w * 0.34, 0.012, screenD * 0.7, 0, legH + cabinetH + pedestalH - 0.006, cabinetD * 0.06, '#2a2a32', architect);

  addBox(group, w * 0.96, screenH, screenD, 0, screenY, cabinetD * 0.06, bezel, architect);
  addBox(group, w * 0.86, screenH * 0.84, screenD * 0.35, 0, screenY, cabinetD * 0.06 + screenD * 0.2, screen, architect, {
    emissive: '#1a2840',
    keepColor: true,
  });
  addBox(group, w * 0.1, 0.015, screenD * 0.5, 0, screenY - screenH * 0.46, cabinetD * 0.06 + screenD * 0.15, '#111118', architect);
}

function buildTv(group, w, h, d, def, architect, style = 'wall') {
  if (style === 'stand') {
    buildTvStand(group, w, h, d, def, architect);
  } else if (style === 'wall_inset') {
    buildTvWallInset(group, w, h, d, def, architect);
  } else {
    buildTvWall(group, w, h, d, def, architect);
  }
}

function buildSofa(group, w, h, d, def, architect) {
  const frame = def.frame ?? '#35353d';
  const fabric = def.color ?? '#5c5c66';
  const fabricLight = def.fabricLight ?? '#70707a';
  const fabricDark = def.accent ?? '#42424a';
  const legColor = def.legs ?? '#222228';
  const piped = def.piping ?? '#888892';
  const throwColor = '#9a9ea8';

  const legH = h * 0.12;
  const baseH = h * 0.14;
  const seatH = h * 0.22;
  const backH = h * 0.4;
  const armH = h * 0.34;
  const armW = w * 0.075;
  const gap = 0.022;

  const baseY = legH + baseH / 2;
  const seatY = legH + baseH + seatH / 2;
  const backZ = -d * 0.38;
  const backY = legH + baseH + backH / 2 + seatH * 0.12;

  for (const [lx, lz] of [
    [-w * 0.42, -d * 0.36],
    [w * 0.42, -d * 0.36],
    [-w * 0.42, d * 0.3],
    [w * 0.42, d * 0.3],
    [0, -d * 0.36],
    [0, d * 0.3],
  ]) {
    addCylinder(group, 0.018, legH, legColor, architect, { x: lx, y: legH / 2, z: lz });
  }

  addBox(group, w * 0.98, baseH, d * 0.92, 0, baseY, 0, frame, architect);
  addBox(group, w * 0.94, 0.018, d * 0.88, 0, legH + baseH + 0.009, 0, fabricDark, architect);

  const armCY = legH + baseH + armH / 2 - seatH * 0.04;
  addBox(group, armW, armH, d * 0.9, -w / 2 + armW / 2, armCY, 0, fabricDark, architect);
  addBox(group, armW, armH, d * 0.9, w / 2 - armW / 2, armCY, 0, fabricDark, architect);
  addBox(group, armW * 0.9, h * 0.038, d * 0.84, -w / 2 + armW / 2, armCY + armH / 2 + h * 0.018, d * 0.02, fabricLight, architect);
  addBox(group, armW * 0.9, h * 0.038, d * 0.84, w / 2 - armW / 2, armCY + armH / 2 + h * 0.018, d * 0.02, fabricLight, architect);
  addBox(group, armW * 0.82, 0.006, d * 0.78, -w / 2 + armW / 2, armCY, 0, piped, architect);
  addBox(group, armW * 0.82, 0.006, d * 0.78, w / 2 - armW / 2, armCY, 0, piped, architect);

  const innerW = w - armW * 2 - gap * 4;
  const cushionW = (innerW - gap * 2) / 3;
  const cushionD = d * 0.56;
  const cushionZ = d * 0.07;

  for (let i = 0; i < 3; i++) {
    const cx = -innerW / 2 + cushionW / 2 + gap + i * (cushionW + gap);
    addBox(group, cushionW, seatH, cushionD, cx, seatY, cushionZ, fabricLight, architect);
    addBox(group, cushionW * 0.92, seatH * 0.38, cushionD * 0.92, cx, seatY + seatH * 0.52, cushionZ, fabric, architect);
    addBox(group, cushionW * 0.86, 0.006, 0.006, cx, seatY + seatH * 0.15, cushionZ + cushionD / 2 - 0.008, piped, architect);
    addBox(group, cushionW * 0.86, 0.006, 0.006, cx, seatY + seatH * 0.15, cushionZ - cushionD / 2 + 0.008, piped, architect);
  }

  addBox(group, w - armW * 1.7, backH, d * 0.13, 0, backY, backZ, fabricDark, architect);
  addBox(group, w - armW * 1.8, h * 0.028, d * 0.11, 0, backY + backH / 2 + h * 0.012, backZ, fabricLight, architect);

  const backCushionH = backH * 0.86;
  const backCushionD = d * 0.21;
  const backCushionZ = backZ + d * 0.055;
  const backCushionY = legH + baseH + seatH + backCushionH / 2 + h * 0.018;

  for (let i = 0; i < 3; i++) {
    const cx = -innerW / 2 + cushionW / 2 + gap + i * (cushionW + gap);
    addBox(group, cushionW * 0.96, backCushionH, backCushionD, cx, backCushionY, backCushionZ, fabricLight, architect);
    addBox(
      group,
      cushionW * 0.88,
      backCushionH * 0.28,
      backCushionD * 0.9,
      cx,
      backCushionY + backCushionH * 0.3,
      backCushionZ - backCushionD * 0.04,
      fabric,
      architect
    );
    addCylinder(group, 0.011, 0.007, piped, architect, {
      x: cx,
      y: backCushionY + backCushionH * 0.12,
      z: backCushionZ + backCushionD * 0.34,
    });
    addBox(group, cushionW * 0.84, 0.006, 0.006, cx, backCushionY - backCushionH * 0.38, backCushionZ + backCushionD / 2 - 0.008, piped, architect);
  }

  addBox(group, w * 0.9, h * 0.05, d * 0.07, 0, legH + baseH * 0.52, backZ - d * 0.015, fabricDark, architect);
  addBox(group, w * 0.96, h * 0.022, 0.012, 0, legH + baseH * 0.28, d * 0.43, fabricDark, architect);

  addBox(group, w * 0.17, h * 0.14, d * 0.08, -w * 0.22, backCushionY + backCushionH * 0.32, backCushionZ + backCushionD * 0.52, throwColor, architect);
  addBox(group, w * 0.15, h * 0.12, d * 0.07, w * 0.28, backCushionY + backCushionH * 0.28, backCushionZ + backCushionD * 0.42, '#c8ccd4', architect);
  addBox(group, w * 0.14, h * 0.1, d * 0.06, -w * 0.2, backCushionY + backCushionH * 0.4, backCushionZ + backCushionD * 0.55, '#b0b4bc', architect);
}

function buildArmchair(group, w, h, d, def, architect) {
  const frame = def.frame ?? '#2a2e34';
  const fabric = def.color ?? '#4a4f5c';
  const fabricLight = def.fabricLight ?? '#6d7482';
  const fabricDark = def.accent ?? '#353a44';
  const legColor = def.legs ?? '#4a4e56';
  const piped = def.piping ?? '#949aa6';
  const pillow = def.pillow ?? '#b8885a';

  const legH = h * 0.13;
  const baseH = h * 0.09;
  const seatH = h * 0.24;
  const backH = h * 0.44;
  const armW = w * 0.13;
  const armH = h * 0.34;
  const gap = 0.018;

  const baseY = legH + baseH / 2;
  const seatY = legH + baseH + seatH / 2;
  const backZ = -d * 0.35;
  const backY = legH + baseH + seatH + backH / 2 + h * 0.015;

  for (const [lx, lz] of [
    [-w * 0.36, -d * 0.34],
    [w * 0.36, -d * 0.34],
    [-w * 0.36, d * 0.28],
    [w * 0.36, d * 0.28],
  ]) {
    addCylinder(group, 0.011, legH, legColor, architect, { x: lx, y: legH / 2, z: lz });
  }

  addBox(group, w * 0.9, baseH, d * 0.86, 0, baseY, 0, frame, architect);
  addBox(group, w * 0.86, 0.014, d * 0.82, 0, legH + baseH + 0.007, 0, fabricDark, architect);

  const armCY = legH + baseH + armH / 2 - seatH * 0.04;
  addBox(group, armW, armH, d * 0.8, -w / 2 + armW / 2, armCY, 0, fabricDark, architect);
  addBox(group, armW, armH, d * 0.8, w / 2 - armW / 2, armCY, 0, fabricDark, architect);
  addBox(group, armW * 0.82, h * 0.036, d * 0.74, -w / 2 + armW / 2, armCY + armH / 2 + h * 0.016, d * 0.02, fabricLight, architect);
  addBox(group, armW * 0.82, h * 0.036, d * 0.74, w / 2 - armW / 2, armCY + armH / 2 + h * 0.016, d * 0.02, fabricLight, architect);
  addBox(group, armW * 0.74, 0.005, d * 0.7, -w / 2 + armW / 2, armCY, 0, piped, architect);
  addBox(group, armW * 0.74, 0.005, d * 0.7, w / 2 - armW / 2, armCY, 0, piped, architect);

  const innerW = w - armW * 2 - gap * 3;
  const cushionD = d * 0.54;
  const cushionZ = d * 0.05;

  addBox(group, innerW, seatH, cushionD, 0, seatY, cushionZ, fabricLight, architect);
  addBox(group, innerW * 0.94, seatH * 0.36, cushionD * 0.94, 0, seatY + seatH * 0.48, cushionZ, fabric, architect);
  addBox(group, innerW * 0.88, 0.006, 0.006, 0, seatY + seatH * 0.14, cushionZ + cushionD / 2 - 0.008, piped, architect);
  addBox(group, innerW * 0.88, 0.006, 0.006, 0, seatY + seatH * 0.14, cushionZ - cushionD / 2 + 0.008, piped, architect);

  addBox(group, w - armW * 1.35, backH, d * 0.14, 0, backY, backZ, fabricDark, architect);
  addBox(group, w - armW * 1.5, backH * 0.9, d * 0.2, 0, backY + backH * 0.05, backZ + d * 0.04, fabricLight, architect);
  addBox(group, w - armW * 1.65, backH * 0.32, d * 0.18, 0, backY + backH * 0.3, backZ + d * 0.035, fabric, architect);
  addBox(group, w - armW * 1.55, h * 0.026, d * 0.12, 0, backY + backH / 2 + h * 0.01, backZ, fabricLight, architect);

  addBox(group, w * 0.34, h * 0.2, d * 0.09, 0, backY + backH * 0.12, backZ + d * 0.1, pillow, architect, { keepColor: true });
  addBox(group, w * 0.28, h * 0.16, d * 0.07, w * 0.08, backY + backH * 0.08, backZ + d * 0.08, '#c8ccd4', architect);

  addBox(group, w * 0.82, h * 0.042, d * 0.06, 0, legH + baseH * 0.48, backZ - d * 0.012, fabricDark, architect);
}

function buildBed(group, w, h, d, def, architect) {
  const pillows = def.pillows ?? 2;
  const frameH = h * 0.2;
  const mattressH = h * 0.17;
  const duvetH = h * 0.13;
  const pillowH = h * 0.09;
  const baseY = frameH * 0.5;
  const mattressY = frameH + mattressH * 0.5;
  const beddingTop = frameH + mattressH;
  const headZ = -d * 0.42;

  addBox(group, w, frameH, d, 0, baseY, 0, def.accent, architect);
  addBox(group, w * 0.96, mattressH, d * 0.96, 0, mattressY, 0, def.color, architect);
  addBox(group, w * 0.94, 0.018, d * 0.92, 0, beddingTop + 0.01, 0, def.sheet ?? '#f8f8f8', architect);

  const duvetD = d * 0.6;
  const duvetZ = d * 0.14;
  addBox(
    group,
    w * 0.86,
    duvetH,
    duvetD,
    0,
    beddingTop + duvetH * 0.5 + 0.02,
    duvetZ,
    def.duvet ?? '#c5d4e8',
    architect
  );
  addBox(
    group,
    w * 0.7,
    duvetH * 0.35,
    duvetD * 0.55,
    0,
    beddingTop + duvetH * 0.75,
    duvetZ - duvetD * 0.12,
    def.duvet ?? '#c5d4e8',
    architect
  );

  addBox(group, w, h * 0.38, d * 0.07, 0, frameH + h * 0.2, -d * 0.465, def.accent, architect);
  addBox(group, w * 0.92, h * 0.06, d * 0.04, 0, frameH + h * 0.38, -d * 0.44, '#a08060', architect);

  const legH = frameH * 0.55;
  const legW = 0.05;
  const legInsetX = w * 0.42;
  const legInsetZ = d * 0.44;
  for (const [lx, lz] of [
    [-legInsetX, -legInsetZ],
    [legInsetX, -legInsetZ],
    [-legInsetX, legInsetZ],
    [legInsetX, legInsetZ],
  ]) {
    addBox(group, legW, legH, legW, lx, legH * 0.5, lz, '#654321', architect);
  }

  if (pillows === 1) {
    addPillow(group, 0, beddingTop + pillowH * 0.5, headZ, w * 0.52, pillowH, d * 0.11, architect);
  } else {
    addPillow(group, -w * 0.24, beddingTop + pillowH * 0.5, headZ, w * 0.38, pillowH, d * 0.11, architect);
    addPillow(group, w * 0.24, beddingTop + pillowH * 0.5, headZ, w * 0.38, pillowH, d * 0.11, architect);
  }
}

function addFoldedClothes(group, x, y, z, architect, color) {
  addBox(group, 0.16, 0.038, 0.11, x, y + 0.02, z, color, architect);
  addBox(group, 0.15, 0.032, 0.1, x, y + 0.052, z + 0.008, color, architect);
  addBox(group, 0.14, 0.028, 0.095, x, y + 0.078, z, color, architect);
}

function addHangingShirt(group, x, rodY, z, shirtH, shirtW, color, architect) {
  addBox(group, shirtW, shirtH, 0.022, x, rodY - shirtH * 0.5 - 0.02, z, color, architect);
  addBox(group, shirtW * 1.15, shirtH * 0.07, 0.028, x, rodY - 0.025, z, color, architect);
  addBox(group, shirtW * 0.35, 0.02, 0.015, x, rodY + 0.01, z, '#c0c0c0', architect);
}

function buildWardrobe(group, w, h, d, def, architect) {
  const side = 0.04;
  const shelfT = 0.03;
  const inset = 0.03;
  const innerW = w - side * 2;
  const innerD = d - inset * 1.6;
  const itemZ = inset * 0.35;

  buildShelfCarcass(group, w, h, d, def, architect);

  const upperShelfY = h * 0.76;
  addBox(group, innerW, shelfT, innerD, 0, upperShelfY, itemZ, def.shelf ?? def.accent, architect);

  const stackY = upperShelfY + shelfT;
  addFoldedClothes(group, -innerW * 0.28, stackY, itemZ, architect, '#6b8e9e');
  addFoldedClothes(group, -innerW * 0.02, stackY, itemZ + innerD * 0.08, architect, '#c87858');
  addFoldedClothes(group, innerW * 0.26, stackY, itemZ, architect, '#8b9e6b');

  addBox(group, 0.12, 0.05, 0.08, innerW * 0.32, stackY + 0.04, itemZ - innerD * 0.1, '#e8e0d4', architect);
  addBox(group, 0.1, 0.04, 0.07, innerW * 0.32, stackY + 0.085, itemZ - innerD * 0.1, '#f0f0f0', architect);

  const rodY = h * 0.6;
  addBox(group, innerW * 0.88, 0.022, 0.022, 0, rodY, itemZ + innerD * 0.15, '#b0b0b0', architect);

  const shirtColors = ['#f5f5f5', '#c5d4e8', '#e8d0d8', '#d8e8f0', '#f0e8d8', '#ffffff'];
  const shirtCount = 6;
  for (let i = 0; i < shirtCount; i++) {
    const x = -innerW * 0.38 + (i * innerW * 0.76) / (shirtCount - 1);
    const shirtH = rodY - h * 0.2;
    const shirtW = innerW * 0.1;
    const zOff = itemZ + ((i % 3) - 1) * 0.02;
    addHangingShirt(group, x, rodY, zOff, shirtH, shirtW, shirtColors[i % shirtColors.length], architect);
  }

  addBox(group, innerW, shelfT, innerD * 0.55, 0, h * 0.12, itemZ, def.shelf ?? def.accent, architect);
  addBox(group, innerW * 0.35, 0.08, innerD * 0.4, -innerW * 0.2, h * 0.16, itemZ, '#5c4033', architect);

  addCabinetDoors(group, w, h, d, def, architect, { double: true });
}

function buildBookshelf(group, w, h, d, def, architect) {
  const side = 0.04;
  const shelfT = 0.028;
  const backT = 0.02;
  const inset = 0.03;
  const innerW = w - side * 2;
  const innerD = d - inset * 1.6;
  const shelfCount = 5;

  addBox(group, w, h, backT, 0, h * 0.5, -d * 0.5 + backT * 0.5, def.accent, architect);
  addBox(group, side, h, d, -w * 0.5 + side * 0.5, h * 0.5, 0, def.color, architect);
  addBox(group, side, h, d, w * 0.5 - side * 0.5, h * 0.5, 0, def.color, architect);
  addBox(group, w, side, d, 0, h - side * 0.5, 0, def.color, architect);
  addBox(group, w, side, d, 0, side * 0.5, 0, def.color, architect);

  const bookColors = ['#8b2942', '#2d4a6e', '#5c4033', '#1a5c3a', '#c9a227', '#6b3a5c', '#3d6b5c', '#7a3b2e'];
  const shelfPatterns = [
    [1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0],
    [1, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 1],
  ];

  for (let s = 0; s < shelfCount; s++) {
    const shelfY = side + ((h - side * 2) / (shelfCount + 1)) * (s + 1);
    addBox(group, innerW, shelfT, innerD, 0, shelfY, inset * 0.4, def.shelf ?? def.accent, architect);

    const pattern = shelfPatterns[s % shelfPatterns.length];
    const slotW = innerW / pattern.length;
    let slotX = -innerW * 0.5 + slotW * 0.5;

    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === 1) {
        const bookH = shelfT + 0.06 + ((s * 3 + i * 5) % 6) * 0.035;
        const bookW = slotW * (0.58 + ((s + i) % 4) * 0.09);
        const bookD = innerD * (0.72 + (i % 3) * 0.1);
        const color = bookColors[(s * 2 + i) % bookColors.length];
        addBox(
          group,
          bookW,
          bookH,
          bookD,
          slotX,
          shelfY + shelfT * 0.5 + bookH * 0.5,
          inset * 0.4,
          color,
          architect
        );
      }
      slotX += slotW;
    }

    if (s === 2) {
      const sw = innerW / pattern.length;
      addBox(group, sw * 0.55, 0.1, innerD * 0.45, innerW * 0.22, shelfY + shelfT + 0.06, inset * 0.35, '#d8c8b0', architect);
    }
  }
}

const HOUSEHOLD_PATTERNS = {
  2: [
    [{ kind: 'vase', x: -0.28 }, { kind: 'mug', x: 0.22 }],
    [{ kind: 'box', x: -0.12 }, { kind: 'frame', x: 0.28 }],
  ],
  3: [
    [{ kind: 'bowl', x: -0.22 }, { kind: 'bottle', x: 0.05 }, { kind: 'clock', x: 0.3 }],
    [{ kind: 'basket', x: -0.2 }, { kind: 'vase', x: 0.15 }],
    [{ kind: 'box', x: -0.08 }, { kind: 'frame', x: 0.26 }],
  ],
  4: [
    [{ kind: 'vase', x: -0.3 }, { kind: 'mug', x: -0.02 }, { kind: 'bowl', x: 0.28 }],
    [{ kind: 'basket', x: -0.25 }, { kind: 'bottle', x: 0.1 }],
    [{ kind: 'box', x: -0.15 }, { kind: 'clock', x: 0.2 }, { kind: 'frame', x: 0.32 }],
    [{ kind: 'vase', x: -0.05 }, { kind: 'box', x: 0.25 }],
  ],
};

function buildShelfCarcass(group, w, h, d, def, architect) {
  const side = 0.04;
  const shelfT = 0.028;
  const backT = 0.02;
  const inset = 0.03;
  const innerW = w - side * 2;
  const innerD = d - inset * 1.6;

  addBox(group, w, h, backT, 0, h * 0.5, -d * 0.5 + backT * 0.5, def.accent, architect);
  addBox(group, side, h, d, -w * 0.5 + side * 0.5, h * 0.5, 0, def.color, architect);
  addBox(group, side, h, d, w * 0.5 - side * 0.5, h * 0.5, 0, def.color, architect);
  addBox(group, w, side, d, 0, h - side * 0.5, 0, def.color, architect);
  addBox(group, w, side, d, 0, side * 0.5, 0, def.color, architect);

  return { side, shelfT, inset, innerW, innerD };
}

function addHouseholdItem(group, kind, x, y, z, architect, scale = 1) {
  const s = scale;
  switch (kind) {
    case 'vase':
      addCylinder(group, s * 0.045, s * 0.11, '#c8a882', architect, { x, y: y + s * 0.055, z });
      addSphere(group, s * 0.055, y + s * 0.13, '#9a7a5a', architect, { x, z });
      break;
    case 'mug':
      addCylinder(group, s * 0.05, s * 0.09, '#d8d8e8', architect, { x, y: y + s * 0.045, z });
      addBox(group, s * 0.07, s * 0.03, s * 0.05, x + s * 0.05, y + s * 0.1, z, '#c0c0d0', architect);
      break;
    case 'box':
      addBox(group, s * 0.14, s * 0.1, s * 0.1, x, y + s * 0.05, z, '#8b6914', architect);
      break;
    case 'frame':
      addBox(group, s * 0.12, s * 0.14, s * 0.02, x, y + s * 0.07, z + s * 0.04, '#654321', architect);
      addBox(group, s * 0.09, s * 0.1, s * 0.01, x, y + s * 0.07, z + s * 0.055, '#88aacc', architect);
      break;
    case 'bowl':
      addCylinder(group, s * 0.07, s * 0.04, '#d4c4a8', architect, { x, y: y + s * 0.02, z });
      break;
    case 'bottle':
      addBox(group, s * 0.05, s * 0.14, s * 0.05, x, y + s * 0.07, z, '#6b8e6b', architect);
      addBox(group, s * 0.035, s * 0.04, s * 0.035, x, y + s * 0.16, z, '#4a6e4a', architect);
      break;
    case 'clock':
      addCylinder(group, s * 0.06, s * 0.025, '#e8e0d0', architect, { x, y: y + s * 0.012, z: z + s * 0.02 });
      addBox(group, s * 0.08, s * 0.08, s * 0.015, x, y + s * 0.06, z + s * 0.03, '#f5f5f0', architect);
      break;
    case 'basket':
      addCylinder(group, s * 0.08, s * 0.07, '#b8956a', architect, { x, y: y + s * 0.035, z });
      addBox(group, s * 0.1, s * 0.02, s * 0.08, x, y + s * 0.075, z, '#a08060', architect);
      break;
    default:
      break;
  }
}

function fillShelfWithHousehold(group, frame, shelfIdx, shelfY, def, architect, w) {
  const pattern = HOUSEHOLD_PATTERNS[def.shelfCount]?.[shelfIdx] ?? [];
  const scale = Math.min(1, w / 0.75);

  for (const item of pattern) {
    const x = item.x * frame.innerW * 0.9;
    addHouseholdItem(group, item.kind, x, shelfY + frame.shelfT, frame.inset * 0.4, architect, scale);
  }
}

function addCabinetDoors(group, w, h, d, def, architect, { double = false } = {}) {
  const side = 0.04;
  const innerW = w - side * 2;
  const doorH = h - side * 2;
  const doorT = 0.018;
  const frontZ = d * 0.5 - doorT * 0.5;
  const handleZ = doorT * 0.55;

  if (!double) {
    const pivot = new THREE.Group();
    pivot.position.set(-w * 0.5 + side, h * 0.5, frontZ);
    pivot.userData.partRole = 'cabinet-door-pivot';
    group.add(pivot);
    addBox(pivot, innerW, doorH, doorT, innerW * 0.5, 0, 0, def.color, architect, {
      partRole: 'cabinet-door',
      doubleSided: true,
    });
    addBox(pivot, 0.035, 0.07, 0.025, innerW * 0.88, 0, handleZ, def.accent, architect, {
      partRole: 'cabinet-handle',
      doubleSided: true,
    });
    return;
  }

  const panelW = (innerW - 0.02) * 0.5;
  const leftPivot = new THREE.Group();
  leftPivot.position.set(-w * 0.5 + side, h * 0.5, frontZ);
  leftPivot.userData.partRole = 'cabinet-door-left-pivot';
  group.add(leftPivot);
  addBox(leftPivot, panelW, doorH, doorT, panelW * 0.5, 0, 0, def.color, architect, {
    partRole: 'cabinet-door',
    doubleSided: true,
  });
  addBox(leftPivot, 0.03, 0.065, 0.022, panelW * 0.82, 0, handleZ, def.accent, architect, {
    partRole: 'cabinet-handle',
    doubleSided: true,
  });

  const rightPivot = new THREE.Group();
  rightPivot.position.set(w * 0.5 - side, h * 0.5, frontZ);
  rightPivot.userData.partRole = 'cabinet-door-right-pivot';
  group.add(rightPivot);
  addBox(rightPivot, panelW, doorH, doorT, -panelW * 0.5, 0, 0, def.color, architect, {
    partRole: 'cabinet-door',
    doubleSided: true,
  });
  addBox(rightPivot, 0.03, 0.065, 0.022, -panelW * 0.82, 0, handleZ, def.accent, architect, {
    partRole: 'cabinet-handle',
    doubleSided: true,
  });
}

function buildShelf(group, w, h, d, def, architect) {
  const shelfCount = def.shelfCount ?? 3;
  const frame = buildShelfCarcass(group, w, h, d, def, architect);

  for (let s = 0; s < shelfCount; s++) {
    const shelfY = frame.side + ((h - frame.side * 2) / (shelfCount + 1)) * (s + 1);
    addBox(group, frame.innerW, frame.shelfT, frame.innerD, 0, shelfY, frame.inset * 0.4, def.shelf ?? def.accent, architect);
    fillShelfWithHousehold(group, frame, s, shelfY, def, architect, w);
  }

  if (def.withDoors) {
    addCabinetDoors(group, w, h, d, def, architect, { double: !!def.doubleDoor });
  }
}

function buildPlantSmall(group, w, h, d, def, architect) {
  const potH = h * 0.28;
  addCylinder(group, w * 0.34, potH, def.accent, architect);
  addCylinder(group, w * 0.38, h * 0.04, '#8b5a3c', architect, { y: potH });
  addSphere(group, w * 0.22, h * 0.52, def.leaf ?? def.color, architect, { z: -d * 0.04 });
  addSphere(group, w * 0.18, h * 0.62, def.color, architect, { x: w * 0.1, z: d * 0.06 });
  addSphere(group, w * 0.14, h * 0.44, def.leaf ?? def.color, architect, { x: -w * 0.12, z: d * 0.04 });
}

function buildPlantMedium(group, w, h, d, def, architect) {
  const potH = h * 0.2;
  addCylinder(group, w * 0.36, potH, def.accent, architect);
  addCylinder(group, w * 0.4, h * 0.035, '#7a4e32', architect, { y: potH });

  const stemBase = potH + h * 0.02;
  addBox(group, w * 0.07, h * 0.32, w * 0.07, 0, stemBase + h * 0.16, 0, '#5c4028', architect);
  addBox(group, w * 0.05, h * 0.22, w * 0.05, -w * 0.1, stemBase + h * 0.1, d * 0.06, '#4a3520', architect);
  addBox(group, w * 0.05, h * 0.18, w * 0.05, w * 0.12, stemBase + h * 0.08, -d * 0.05, '#4a3520', architect);

  addSphere(group, w * 0.3, h * 0.68, def.leaf ?? def.color, architect);
  addSphere(group, w * 0.22, h * 0.56, def.color, architect, { x: -w * 0.18, z: w * 0.08 });
  addSphere(group, w * 0.2, h * 0.6, def.leaf ?? def.color, architect, { x: w * 0.2, z: -w * 0.06 });
  addSphere(group, w * 0.16, h * 0.78, def.color, architect, { x: w * 0.06, z: d * 0.08 });
}

function buildPlantLarge(group, w, h, d, def, architect) {
  const potH = h * 0.12;
  addCylinder(group, w * 0.28, potH, def.accent, architect);
  addBox(group, w * 0.62, potH * 0.18, d * 0.62, 0, potH + potH * 0.08, 0, def.accent, architect);

  const stems = [
    { x: 0, z: 0, height: h * 0.52 },
    { x: -w * 0.14, z: w * 0.1, height: h * 0.4 },
    { x: w * 0.16, z: -w * 0.08, height: h * 0.45 },
    { x: -w * 0.06, z: -w * 0.14, height: h * 0.35 },
  ];

  for (const stem of stems) {
    addBox(
      group,
      0.06,
      stem.height,
      0.06,
      stem.x,
      potH + stem.height * 0.5,
      stem.z,
      '#4a3520',
      architect
    );
  }

  const leaves = [
    { lw: w * 0.42, lh: h * 0.2, x: 0, y: h * 0.72, z: 0, ry: 0.2, rx: -0.55 },
    { lw: w * 0.36, lh: h * 0.17, x: -w * 0.22, y: h * 0.62, z: w * 0.12, ry: -0.5, rx: -0.45 },
    { lw: w * 0.38, lh: h * 0.18, x: w * 0.24, y: h * 0.66, z: -w * 0.1, ry: 0.65, rx: -0.5 },
    { lw: w * 0.34, lh: h * 0.16, x: -w * 0.08, y: h * 0.82, z: -w * 0.14, ry: -0.15, rx: -0.35 },
    { lw: w * 0.3, lh: h * 0.14, x: w * 0.1, y: h * 0.88, z: w * 0.16, ry: 0.35, rx: -0.4 },
    { lw: w * 0.28, lh: h * 0.13, x: 0, y: h * 0.55, z: d * 0.08, ry: 0, rx: -0.6 },
  ];

  leaves.forEach((leaf, i) => {
    addLeaf(
      group,
      leaf.lw,
      leaf.lh,
      leaf.x,
      leaf.y,
      leaf.z,
      i % 2 === 0 ? (def.leaf ?? def.color) : def.color,
      architect,
      leaf.ry,
      leaf.rx
    );
  });

  addSphere(group, w * 0.2, h * 0.58, def.color, architect, { x: -w * 0.05, z: w * 0.05 });
}

function addHollowOpeningFrame(group, w, h, d, accent, trim, architect, {
  frameW = 0.07,
  bottomH = null,
  centerY = null,
} = {}) {
  const depth = Math.max(d * 0.92, 0.14);
  const cy = centerY ?? h * 0.5;
  const bh = bottomH ?? frameW * 0.7;
  const frameOpts = (role = 'frame') => ({
    keepColor: true,
    partRole: role,
    doubleSided: true,
  });

  addBox(group, frameW, h, depth, -w * 0.5 + frameW * 0.5, cy, 0, accent, architect, frameOpts());
  addBox(group, frameW, h, depth, w * 0.5 - frameW * 0.5, cy, 0, accent, architect, frameOpts());
  addBox(group, w, frameW, depth, 0, cy + h * 0.5 - frameW * 0.5, 0, trim, architect, frameOpts());
  addBox(group, w, bh, depth, 0, cy - h * 0.5 + bh * 0.5, 0, trim, architect, frameOpts());
}

function buildDoor(group, w, h, d, def, architect) {
  const frame = 0.07;
  const leafW = w - frame * 2;
  const leafH = h - frame * 2;
  const leafD = Math.max(d * 0.95, 0.14);

  addHollowOpeningFrame(group, w, h, d, def.accent, '#5c4033', architect);

  const leafPivot = new THREE.Group();
  leafPivot.position.set(-w * 0.5 + frame, h * 0.5, 0);
  leafPivot.userData.partRole = 'leaf-pivot';
  group.add(leafPivot);

  addBox(leafPivot, leafW, leafH, leafD, leafW * 0.5, 0, 0, def.color, architect, {
    keepColor: true,
    emissive: '#c06018',
    partRole: 'leaf',
    doubleSided: true,
  });
  addBox(leafPivot, leafW * 0.12, leafH * 0.55, 0.03, leafW * 0.88, 0, leafD * 0.42, def.inner ?? '#c87832', architect, {
    keepColor: true,
    partRole: 'leaf',
    doubleSided: true,
  });
  addBox(group, leafW * 0.9, leafH * 0.9, 0.025, 0, h * 0.5, -leafD * 0.48, def.back ?? def.color, architect, {
    keepColor: true,
    emissive: '#b05820',
    partRole: 'leaf-back',
    doubleSided: true,
  });
  addBox(leafPivot, 0.05, 0.14, 0.06, leafW * 0.82, 0, leafD * 0.45, '#e6b422', architect, {
    keepColor: true,
    emissive: '#806010',
    partRole: 'handle',
    doubleSided: true,
  });
}


function buildBalconyDoor(group, w, h, d, def, architect) {
  const frame = 0.07;
  const innerH = h - frame * 2;
  const panelW = (w - frame * 3) / 2;
  const leafD = Math.max(d * 0.95, 0.14);

  addHollowOpeningFrame(group, w, h, d, def.accent, '#1a4a38', architect);

  const leftPivot = new THREE.Group();
  leftPivot.position.set(-w * 0.5 + frame, h * 0.5, 0);
  leftPivot.userData.partRole = 'leaf-left-pivot';
  group.add(leftPivot);
  addBox(leftPivot, panelW, innerH, leafD, panelW * 0.5, 0, 0, def.color, architect, {
    keepColor: true,
    emissive: '#4a7090',
    partRole: 'leaf',
    doubleSided: true,
  });

  const rightPivot = new THREE.Group();
  rightPivot.position.set(w * 0.5 - frame, h * 0.5, 0);
  rightPivot.userData.partRole = 'leaf-right-pivot';
  group.add(rightPivot);
  addBox(rightPivot, panelW, innerH, leafD, -panelW * 0.5, 0, 0, def.color, architect, {
    keepColor: true,
    emissive: '#4a7090',
    partRole: 'leaf',
    doubleSided: true,
  });
  addBox(rightPivot, panelW * 0.75, innerH * 0.58, d * 0.22, -panelW * 0.38, innerH * 0.12, d * 0.08, '#7ec8ff', architect, {
    keepColor: true,
    isGlass: true,
    partRole: 'leaf',
  });

  addBox(group, w * 0.88, innerH * 0.88, 0.025, 0, h * 0.5, -leafD * 0.48, def.back ?? def.color, architect, {
    keepColor: true,
    emissive: '#3a6890',
    partRole: 'leaf-back',
    doubleSided: true,
  });
  addBox(leftPivot, 0.05, 0.12, 0.05, panelW * 0.82, 0, leafD * 0.45, '#e6b422', architect, {
    keepColor: true,
    emissive: '#806010',
    partRole: 'handle',
    doubleSided: true,
  });
}

function buildWindow(group, w, h, d, def, architect) {
  const sill = def.sillHeight ?? 0.9;
  const cy = sill + h * 0.5;
  const frame = Math.min(0.07, w * 0.11, h * 0.1);
  const glassW = w - frame * 2;
  const glassH = h - frame * 2;
  const winD = Math.max(d * 1.1, 0.18);

  addHollowOpeningFrame(group, w, h, winD, def.accent, def.color, architect, {
    centerY: cy,
    bottomH: Math.max(0.05, frame * 0.95),
  });

  const sashPivot = new THREE.Group();
  sashPivot.position.set(-w * 0.5 + frame, cy, 0);
  sashPivot.userData.partRole = 'sash-pivot';
  group.add(sashPivot);
  addBox(sashPivot, glassW, glassH, winD * 0.55, glassW * 0.5, 0, 0, def.inner ?? '#dce8f5', architect, {
    keepColor: true,
    emissive: '#6688aa',
    partRole: 'sash',
    doubleSided: true,
  });
  addBox(sashPivot, glassW * 0.86, glassH * 0.86, winD * 0.22, glassW * 0.5, 0, winD * 0.14, '#7ec8ff', architect, {
    keepColor: true,
    isGlass: true,
    partRole: 'sash',
  });

  if (w >= 1.75) {
    addBox(group, frame * 0.75, glassH * 0.9, winD * 0.52, 0, cy, 0, def.accent, architect, {
      keepColor: true,
      partRole: 'frame',
      doubleSided: true,
    });
    addBox(sashPivot, frame * 0.55, glassH * 0.88, winD * 0.24, glassW * 0.5, 0, winD * 0.15, '#7ec8ff', architect, {
      keepColor: true,
      isGlass: true,
      partRole: 'sash',
    });
  }

  addBox(group, glassW * 0.9, glassH * 0.9, 0.025, 0, cy, -winD * 0.48, def.back ?? def.inner, architect, {
    keepColor: true,
    emissive: '#5577aa',
    partRole: 'sash-back',
    doubleSided: true,
  });
  addBox(group, w + 0.1, Math.max(0.06, frame * 0.95), winD * 0.75, 0, sill + 0.04, winD * 0.18, def.accent, architect, {
    keepColor: true,
    doubleSided: true,
    partRole: 'frame',
  });
}

function buildFireplace(group, w, h, d, def, architect) {
  const stone = def.color ?? '#c4bcb4';
  const stoneDark = def.accent ?? '#7a7268';
  const mantel = def.mantel ?? '#5c4033';
  const inner = def.inner ?? '#1a1008';
  const fireColor = def.fire ?? '#e85a20';

  const hearthH = h * 0.045;
  const bodyBase = hearthH;
  const bodyH = h * 0.68;
  const bodyCY = bodyBase + bodyH / 2;
  const openingW = w * 0.52;
  const openingH = h * 0.36;
  const openingCY = bodyBase + h * 0.28;
  const pillarW = (w - openingW) / 2 - 0.02;

  addBox(group, w * 1.08, hearthH, d * 0.92, 0, hearthH / 2, d * 0.04, stoneDark, architect);
  addBox(group, w, 0.018, d * 0.88, 0, hearthH + 0.009, d * 0.03, stone, architect);

  addBox(group, pillarW, bodyH, d, -w / 2 + pillarW / 2, bodyCY, 0, stone, architect);
  addBox(group, pillarW, bodyH, d, w / 2 - pillarW / 2, bodyCY, 0, stone, architect);
  addBox(group, openingW + pillarW * 1.6, bodyH * 0.22, d, 0, bodyBase + bodyH - bodyH * 0.11, 0, stone, architect);

  const hoodH = h * 0.14;
  const hoodY = bodyBase + bodyH + hoodH / 2 - h * 0.02;
  addBox(group, w * 0.88, hoodH, d * 0.85, 0, hoodY, -d * 0.04, stoneDark, architect);
  addBox(group, w * 0.7, hoodH * 0.55, d * 0.55, 0, hoodY + hoodH * 0.18, -d * 0.12, stone, architect);

  const mantelH = h * 0.05;
  const mantelY = bodyBase + bodyH + h * 0.025;
  addBox(group, w * 1.12, mantelH, d * 0.55, 0, mantelY, d * 0.12, mantel, architect);
  addBox(group, w * 1.05, mantelH * 0.35, d * 0.08, 0, mantelY + mantelH * 0.55, d * 0.32, stoneDark, architect);

  addBox(group, openingW * 0.92, openingH * 0.92, d * 0.55, 0, openingCY, -d * 0.08, inner, architect);
  addBox(group, openingW * 0.88, 0.025, d * 0.5, 0, openingCY - openingH * 0.42, -d * 0.06, '#2a1810', architect);

  addBox(group, openingW * 0.9, openingH * 0.9, 0.025, 0, openingCY, d * 0.18, '#3a3830', architect, { keepColor: !architect });
  addBox(group, 0.025, openingH * 0.88, 0.025, -openingW / 2 + 0.012, openingCY, d * 0.19, '#5a5850', architect, { keepColor: !architect });
  addBox(group, 0.025, openingH * 0.88, 0.025, openingW / 2 - 0.012, openingCY, d * 0.19, '#5a5850', architect, { keepColor: !architect });
  addBox(group, openingW * 0.9, 0.025, 0.025, 0, openingCY + openingH * 0.42, d * 0.19, '#5a5850', architect, { keepColor: !architect });

  const logY = openingCY - openingH * 0.12;
  addBox(group, openingW * 0.35, 0.05, 0.06, -openingW * 0.1, logY, d * 0.02, '#3d2818', architect);
  addBox(group, openingW * 0.3, 0.045, 0.055, openingW * 0.12, logY + 0.02, d * 0.04, '#4a3020', architect);
  addBox(group, openingW * 0.28, 0.04, 0.05, -openingW * 0.15, logY + 0.04, -d * 0.02, '#352218', architect);

  addBox(group, openingW * 0.55, openingH * 0.35, d * 0.25, 0, openingCY + openingH * 0.05, -d * 0.02, fireColor, architect, {
    emissive: fireColor,
    keepColor: true,
  });
  addBox(group, openingW * 0.3, openingH * 0.2, d * 0.18, -openingW * 0.12, openingCY - openingH * 0.05, 0, '#ff8833', architect, {
    emissive: '#ff6622',
    keepColor: true,
  });
  addBox(group, openingW * 0.25, openingH * 0.18, d * 0.15, openingW * 0.1, openingCY - openingH * 0.02, d * 0.02, '#ffaa44', architect, {
    emissive: '#ff7722',
    keepColor: true,
  });

  addBox(group, w * 0.08, h * 0.1, d * 0.06, -w * 0.38, mantelY + mantelH + h * 0.055, d * 0.14, '#8b7355', architect);
  addBox(group, w * 0.06, h * 0.08, d * 0.05, w * 0.35, mantelY + mantelH + h * 0.045, d * 0.12, '#6b5344', architect);
  addCylinder(group, 0.035, h * 0.07, '#2a5a2a', architect, { x: w * 0.36, y: mantelY + mantelH + h * 0.08, z: d * 0.1 });
  addSphere(group, 0.05, mantelY + mantelH + h * 0.13, '#3a7a3a', architect, { x: w * 0.36, z: d * 0.1 });
}

function buildRadiator(group, w, h, d, def, architect) {
  const depth = Math.max(d, 0.08) * 1.2;
  const sections = 3;
  const sectionW = (w - 0.1) / sections;
  const gap = 0.02;

  addBox(group, w * 0.88, 0.028, 0.03, 0, h * 0.5, -depth * 0.55, '#9aa0a6', architect);
  addBox(group, 0.028, h * 0.32, 0.035, -w * 0.34, h * 0.56, -depth * 0.38, '#8a9098', architect);
  addBox(group, 0.028, h * 0.32, 0.035, w * 0.34, h * 0.56, -depth * 0.38, '#8a9098', architect);

  addBox(group, w, h * 0.075, depth, 0, h * 0.965, depth * 0.05, def.accent, architect);
  addBox(group, w, h * 0.075, depth, 0, h * 0.045, depth * 0.05, def.accent, architect);

  for (let i = 0; i < sections; i++) {
    const x = -w / 2 + 0.05 + sectionW / 2 + i * (sectionW + gap);
    addBox(group, sectionW, h * 0.8, depth * 0.9, x, h * 0.52, depth * 0.05, def.color, architect);

    const fins = 6;
    for (let f = 0; f < fins; f++) {
      const fx = x - sectionW / 2 + (sectionW / (fins + 1)) * (f + 1);
      addBox(group, 0.014, h * 0.76, depth * 0.82, fx, h * 0.51, depth * 0.06, '#fafafa', architect);
    }
  }

  addCylinder(group, 0.038, 0.09, '#b8bcc0', architect, { x: w * 0.4, y: h * 0.14, z: depth * 0.55 });
  addCylinder(group, 0.024, 0.055, '#e4e6e8', architect, { x: w * 0.4, y: h * 0.23, z: depth * 0.62 });
  addBox(group, 0.05, 0.04, 0.04, w * 0.4, h * 0.28, depth * 0.68, '#d0d4d8', architect);
}

function buildLampSmall(group, w, h, d, def, architect) {
  const pole = def.pole ?? '#666666';
  const baseH = h * 0.06;
  const stemH = h * 0.42;
  addCylinder(group, w * 0.55, baseH, '#2a2a2a', architect);
  addCylinder(group, w * 0.12, stemH, pole, architect, { y: baseH + stemH * 0.5 });
  addBox(group, w * 1.1, h * 0.14, w * 1.1, 0, baseH + stemH + h * 0.07, 0, def.accent, architect);
  addBox(group, w * 0.95, h * 0.2, w * 0.95, 0, baseH + stemH + h * 0.19, 0, def.color, architect, {
    emissive: def.color,
  });
}

function buildLampMedium(group, w, h, d, def, architect) {
  const pole = def.pole ?? '#555555';
  addCylinder(group, w * 0.5, h * 0.04, '#333333', architect);
  addBox(group, w * 0.1, h * 0.72, w * 0.1, 0, h * 0.4, 0, pole, architect);
  addBox(group, w * 0.18, h * 0.05, w * 0.18, 0, h * 0.78, 0, def.accent, architect);
  addBox(group, w * 1.35, h * 0.2, w * 1.35, 0, h * 0.9, 0, def.color, architect, { emissive: def.color });
  addBox(group, w * 1.2, h * 0.04, w * 1.2, 0, h * 0.8, 0, def.accent, architect);
}

function buildLampLarge(group, w, h, d, def, architect) {
  const pole = def.pole ?? '#4a4a4a';
  addCylinder(group, w * 0.48, h * 0.035, '#2a2a2a', architect);
  addBox(group, w * 0.09, h * 0.82, w * 0.09, 0, h * 0.44, 0, pole, architect);
  addBox(group, w * 0.2, h * 0.06, w * 0.2, 0, h * 0.87, 0, def.accent, architect);
  addBox(group, w * 1.45, h * 0.22, w * 1.45, 0, h * 0.96, 0, def.color, architect, { emissive: def.color });
  addBox(group, w * 1.25, h * 0.05, w * 1.25, 0, h * 0.86, 0, def.accent, architect);
}

function buildLampPendant(group, w, h, d, def, architect) {
  const cord = def.cord ?? '#3a3a3a';
  const canopyH = 0.035;
  const cordH = h * 0.58;
  const shadeH = h * 0.26;
  const shadeY = -(canopyH + cordH + shadeH * 0.5);

  addCylinder(group, w * 0.22, canopyH, '#2a2a2a', architect, { y: -canopyH * 0.5 });
  addBox(group, w * 0.14, 0.012, d * 0.14, 0, -canopyH - 0.006, 0, def.accent, architect, { keepColor: true });
  addCylinder(group, 0.006, cordH, cord, architect, { y: -canopyH - cordH * 0.5 });
  addBox(group, w * 0.92, shadeH * 0.12, d * 0.92, 0, shadeY + shadeH * 0.46, 0, def.accent, architect, { keepColor: true });
  addCylinder(group, w * 0.42, shadeH * 0.78, def.color, architect, {
    y: shadeY,
    keepColor: true,
    emissive: '#ffe4a8',
  });
  addBox(group, w * 0.72, shadeH * 0.55, d * 0.72, 0, shadeY - shadeH * 0.08, 0, def.color, architect, {
    emissive: '#fff0c8',
    keepColor: true,
  });
  addSphere(group, w * 0.12, shadeY - shadeH * 0.22, '#fff8d8', architect, {
    emissive: '#ffd878',
    keepColor: true,
  });
  addCylinder(group, w * 0.38, 0.008, def.accent, architect, { y: shadeY - shadeH * 0.48 });
}

function buildLampCeiling(group, w, h, d, def, architect) {
  const bodyH = h * 0.5;
  const rimH = h * 0.28;
  const glowH = h * 0.22;
  const bodyY = -bodyH * 0.5;
  const rimY = bodyY - bodyH * 0.5 - rimH * 0.5;
  const glowY = rimY - rimH * 0.5 - glowH * 0.5;

  addCylinder(group, w * 0.5, bodyH, '#2a2a2a', architect, { y: bodyY });
  addCylinder(group, w * 0.46, rimH, def.accent, architect, { y: rimY, keepColor: true });
  addCylinder(group, w * 0.4, glowH, def.color, architect, {
    y: glowY,
    emissive: '#fff4d0',
    keepColor: true,
  });
  addSphere(group, w * 0.14, glowY - glowH * 0.15, '#fffce8', architect, {
    emissive: '#ffe8a0',
    keepColor: true,
  });
}

function buildLampWall(group, w, h, d, def, architect) {
  const plate = def.accent ?? '#2e2e32';
  const centerZ = WALL_THICKNESS / 2 + d * 0.42;

  addBox(group, w * 0.74, h * 0.58, d * 0.38, 0, h * 0.02, centerZ - d * 0.12, plate, architect, { keepColor: true });
  addBox(group, w * 0.18, h * 0.14, d * 0.55, 0, h * 0.28, centerZ + d * 0.08, plate, architect, { keepColor: true });
  addBox(group, w * 0.88, h * 0.36, d * 0.52, 0, -h * 0.06, centerZ + d * 0.18, def.color, architect, {
    emissive: '#ffe8b0',
    keepColor: true,
  });
  addBox(group, w * 0.7, h * 0.08, d * 0.4, 0, -h * 0.28, centerZ + d * 0.22, def.color, architect, {
    emissive: '#fff0c8',
    keepColor: true,
  });
  addSphere(group, w * 0.13, -h * 0.14, centerZ + d * 0.32, '#fff8e0', architect, {
    emissive: '#ffd060',
    keepColor: true,
  });
}

function buildToilet(group, w, h, d, def, architect) {
  const inner = def.inner ?? '#e8edf0';
  const innerDark = '#c8d4dc';
  const chrome = '#b0b8c0';
  const chromeDark = '#889098';
  const seatColor = def.seat ?? '#f2f2f4';

  const baseH = h * 0.065;
  const boltY = baseH * 0.4;

  addCylinder(group, 0.012, 0.016, chrome, architect, { x: -w * 0.18, y: boltY, z: d * 0.22 });
  addCylinder(group, 0.012, 0.016, chrome, architect, { x: w * 0.18, y: boltY, z: d * 0.22 });

  addBox(group, w * 0.78, baseH, d * 0.48, 0, baseH / 2, d * 0.04, def.accent, architect);
  addBox(group, w * 0.62, h * 0.12, d * 0.34, 0, baseH + h * 0.06, d * 0.02, def.color, architect);

  const bowlBaseY = baseH + h * 0.02;
  const bowlH = h * 0.36;
  const bowlCY = bowlBaseY + bowlH / 2;
  const bowlZ = d * 0.05;

  addBox(group, w * 0.82, bowlH, d * 0.55, 0, bowlCY, bowlZ, def.color, architect);
  addCylinder(group, w * 0.09, bowlH * 0.92, def.color, architect, { x: -w * 0.36, y: bowlCY, z: bowlZ + d * 0.02 });
  addCylinder(group, w * 0.09, bowlH * 0.92, def.color, architect, { x: w * 0.36, y: bowlCY, z: bowlZ + d * 0.02 });

  const holeW = w * 0.52;
  const holeD = d * 0.34;
  const holeZ = bowlZ + d * 0.1;
  const rimBaseY = bowlBaseY + bowlH;
  const basinDepth = h * 0.12;
  const basinFloorY = rimBaseY - basinDepth;

  addBox(group, holeW * 0.82, 0.018, holeD * 0.82, 0, basinFloorY, holeZ, innerDark, architect);
  addCylinder(group, 0.048, 0.02, '#707880', architect, { x: 0, y: basinFloorY + 0.01, z: holeZ + holeD * 0.12 });

  const cavityH = basinDepth * 0.88;
  const cavityCY = basinFloorY + cavityH / 2;
  addBox(group, 0.028, cavityH, holeD * 0.86, -holeW / 2 + 0.018, cavityCY, holeZ, inner, architect);
  addBox(group, 0.028, cavityH, holeD * 0.86, holeW / 2 - 0.018, cavityCY, holeZ, inner, architect);
  addBox(group, holeW * 0.86, cavityH, 0.028, 0, cavityCY, holeZ - holeD / 2 + 0.018, inner, architect);
  addBox(group, holeW * 0.7, cavityH * 0.65, 0.028, 0, cavityCY - cavityH * 0.12, holeZ + holeD / 2 - 0.018, inner, architect);

  const rimThick = h * 0.038;
  const rimY = rimBaseY + rimThick / 2;
  const rimOuterW = w * 0.78;
  const rimOuterD = d * 0.48;
  const rimFrontD = rimOuterD / 2 - holeZ - holeD / 2;
  const rimBackD = rimOuterD / 2 + holeZ - holeD / 2;
  const rimSideW = (rimOuterW - holeW) / 2;

  if (rimFrontD > 0.015) {
    addBox(group, rimOuterW, rimThick, rimFrontD, 0, rimY, holeZ - holeD / 2 - rimFrontD / 2, def.accent, architect);
  }
  if (rimBackD > 0.015) {
    addBox(group, rimOuterW, rimThick, rimBackD, 0, rimY, holeZ + holeD / 2 + rimBackD / 2, def.accent, architect);
  }
  addBox(group, rimSideW, rimThick, holeD, -rimOuterW / 2 + rimSideW / 2, rimY, holeZ, def.accent, architect);
  addBox(group, rimSideW, rimThick, holeD, rimOuterW / 2 - rimSideW / 2, rimY, holeZ, def.accent, architect);

  const seatThick = h * 0.032;
  const seatY = rimBaseY + rimThick + seatThick / 2 + h * 0.006;
  const seatOuterW = holeW * 1.14;
  const seatOuterD = holeD * 1.18;
  const seatInnerW = holeW * 0.58;
  const seatInnerD = holeD * 0.62;
  const seatSideW = (seatOuterW - seatInnerW) / 2;
  const seatFrontD = (seatOuterD - seatInnerD) / 2;

  addBox(group, seatOuterW, seatThick, seatFrontD, 0, seatY, holeZ - seatInnerD / 2 - seatFrontD / 2, seatColor, architect);
  addBox(group, seatOuterW, seatThick, seatFrontD, 0, seatY, holeZ + seatInnerD / 2 + seatFrontD / 2, seatColor, architect);
  addBox(group, seatSideW, seatThick, seatInnerD, -seatOuterW / 2 + seatSideW / 2, seatY, holeZ, seatColor, architect);
  addBox(group, seatSideW, seatThick, seatInnerD, seatOuterW / 2 - seatSideW / 2, seatY, holeZ, seatColor, architect);

  const lidThick = h * 0.026;
  const lidY = seatY + seatThick / 2 + lidThick / 2 + h * 0.008;
  addBox(group, seatOuterW * 0.94, lidThick, seatOuterD * 0.88, 0, lidY, holeZ - d * 0.02, def.color, architect);
  addBox(group, seatOuterW * 0.7, lidThick * 0.5, seatOuterD * 0.55, 0, lidY + lidThick * 0.15, holeZ + holeD * 0.08, def.accent, architect);

  const hingeZ = holeZ - holeD * 0.42;
  addBox(group, 0.038, 0.022, 0.055, -w * 0.14, seatY, hingeZ, chromeDark, architect);
  addBox(group, 0.038, 0.022, 0.055, w * 0.14, seatY, hingeZ, chromeDark, architect);

  const connY = bowlBaseY + bowlH + h * 0.05;
  addBox(group, w * 0.46, h * 0.1, d * 0.16, 0, connY, -d * 0.04, def.accent, architect);

  const tankW = w * 0.74;
  const tankD = d * 0.26;
  const tankH = h * 0.4;
  const tankZ = -d * 0.2;
  const tankY = connY + tankH / 2 - h * 0.02;

  addBox(group, tankW, tankH, tankD, 0, tankY, tankZ, def.color, architect);
  addBox(group, 0.018, tankH * 0.92, tankD * 0.88, -tankW / 2 + 0.01, tankY, tankZ, def.accent, architect);
  addBox(group, 0.018, tankH * 0.92, tankD * 0.88, tankW / 2 - 0.01, tankY, tankZ, def.accent, architect);
  addBox(group, tankW * 0.97, h * 0.022, tankD * 0.97, 0, tankY + tankH / 2 + h * 0.01, tankZ, def.accent, architect);
  addBox(group, tankW * 0.55, h * 0.012, tankD * 0.7, 0, tankY + tankH / 2 + h * 0.022, tankZ, '#eceef0', architect);

  const btnY = tankY + tankH / 2 + h * 0.038;
  addCylinder(group, 0.034, 0.014, chrome, architect, { x: -tankW * 0.13, y: btnY, z: tankZ });
  addCylinder(group, 0.024, 0.014, chromeDark, architect, { x: tankW * 0.13, y: btnY, z: tankZ });
  addCylinder(group, 0.008, 0.006, '#d8dce0', architect, { x: -tankW * 0.13, y: btnY + 0.01, z: tankZ });
  addCylinder(group, 0.006, 0.006, '#d0d4d8', architect, { x: tankW * 0.13, y: btnY + 0.01, z: tankZ });

  addBox(group, 0.04, h * 0.08, 0.04, tankW / 2 + 0.01, tankY - tankH * 0.15, tankZ + tankD * 0.2, chrome, architect);
}

function buildSink(group, w, h, d, def, architect) {
  const inner = def.inner ?? '#c5d0da';
  const innerDark = '#a8b8c4';

  addBox(group, w * 0.94, h * 0.66, d * 0.54, 0, h * 0.33, 0, def.color, architect);
  addBox(group, 0.012, h * 0.48, d * 0.55, 0, h * 0.36, 0, def.accent, architect);
  addBox(group, w * 0.72, 0.018, 0.012, 0, h * 0.6, d * 0.275, def.accent, architect);
  addBox(group, w * 0.22, 0.018, 0.012, -w * 0.24, h * 0.6, d * 0.275, '#c8ccd0', architect);

  const counterY = h * 0.755;
  const counterThick = h * 0.055;
  const counterD = d * 0.82;
  const holeW = w * 0.52;
  const holeD = d * 0.36;
  const holeZ = d * 0.04;
  const sideW = (w - holeW) / 2;
  const frontStripD = counterD / 2 - holeZ - holeD / 2;
  const backStripD = counterD / 2 + holeZ - holeD / 2;

  if (frontStripD > 0.02) {
    addBox(group, w, counterThick, frontStripD, 0, counterY, -counterD / 2 + frontStripD / 2, def.accent, architect);
  }
  if (backStripD > 0.02) {
    addBox(group, w, counterThick, backStripD, 0, counterY, counterD / 2 - backStripD / 2, def.accent, architect);
  }
  addBox(group, sideW, counterThick, holeD, -w / 2 + sideW / 2, counterY, holeZ, def.accent, architect);
  addBox(group, sideW, counterThick, holeD, w / 2 - sideW / 2, counterY, holeZ, def.accent, architect);

  const basinDepth = h * 0.2;
  const basinTop = counterY - counterThick / 2;
  const basinFloorY = basinTop - basinDepth;

  addBox(group, holeW * 0.94, 0.025, holeD * 0.94, 0, basinFloorY, holeZ, innerDark, architect);
  addCylinder(group, 0.02, 0.015, '#8a98a4', architect, { x: 0, y: basinFloorY + 0.014, z: holeZ });

  const wallH = basinDepth * 0.92;
  const wallCenterY = basinFloorY + wallH / 2;
  addBox(group, 0.035, wallH, holeD * 0.92, -holeW / 2 + 0.02, wallCenterY, holeZ, inner, architect);
  addBox(group, 0.035, wallH, holeD * 0.92, holeW / 2 - 0.02, wallCenterY, holeZ, inner, architect);
  addBox(group, holeW * 0.92, wallH, 0.035, 0, wallCenterY, holeZ - holeD / 2 + 0.02, inner, architect);
  addBox(group, holeW * 0.92, wallH * 0.65, 0.035, 0, wallCenterY - wallH * 0.12, holeZ + holeD / 2 - 0.02, inner, architect);

  addCylinder(group, 0.022, h * 0.065, '#b0b6bc', architect, {
    x: 0,
    y: counterY + h * 0.1,
    z: holeZ - holeD * 0.38,
  });
  addBox(group, 0.15, 0.028, 0.028, 0, counterY + h * 0.135, holeZ - holeD * 0.46, '#a4aab0', architect);
  addCylinder(group, 0.016, 0.038, '#c0c6cc', architect, {
    x: 0,
    y: counterY + h * 0.085,
    z: holeZ - holeD * 0.4,
  });
  addBox(group, 0.032, 0.065, 0.022, w * 0.14, counterY + h * 0.085, holeZ - holeD * 0.2, '#c8ccd2', architect);
}

function buildBathtub(group, w, h, d, def, architect) {
  const inner = def.inner ?? '#b8c8d4';
  const innerDark = '#9aabb8';
  const wallT = 0.07;
  const rimH = h * 0.12;
  const bodyH = h * 0.88;
  const baseY = 0.05;
  const innerW = w - wallT * 2;
  const innerD = d - wallT * 2;
  const openW = innerW * 0.96;
  const openD = innerD * 0.96;

  const feet = [
    [-w * 0.36, -d * 0.34],
    [w * 0.36, -d * 0.34],
    [-w * 0.36, d * 0.34],
    [w * 0.36, d * 0.34],
  ];
  for (const [fx, fz] of feet) {
    addCylinder(group, 0.038, baseY * 1.6, def.accent, architect, { x: fx, y: baseY * 0.8, z: fz });
  }

  addBox(group, w, wallT, d, 0, baseY + wallT / 2, 0, def.color, architect);

  const wallHeight = bodyH - rimH;
  const wallCenterY = baseY + wallT + wallHeight / 2;
  addBox(group, wallT, wallHeight, d, -w / 2 + wallT / 2, wallCenterY, 0, def.color, architect);
  addBox(group, wallT, wallHeight, d, w / 2 - wallT / 2, wallCenterY, 0, def.color, architect);
  addBox(group, w, wallHeight, wallT, 0, wallCenterY, -d / 2 + wallT / 2, def.color, architect);
  addBox(group, w, wallHeight, wallT, 0, wallCenterY, d / 2 - wallT / 2, def.color, architect);

  const rimY = baseY + bodyH - rimH / 2;
  const lipT = wallT * 1.1;
  addBox(group, w + 0.04, rimH, lipT, 0, rimY, -d / 2 + lipT / 2, def.accent, architect);
  addBox(group, w + 0.04, rimH, lipT, 0, rimY, d / 2 - lipT / 2, def.accent, architect);
  addBox(group, lipT, rimH, d + 0.04, -w / 2 + lipT / 2, rimY, 0, def.accent, architect);
  addBox(group, lipT, rimH, d + 0.04, w / 2 - lipT / 2, rimY, 0, def.accent, architect);

  const cavityFloorY = baseY + wallT + 0.02;
  const cavityDepth = bodyH - rimH - wallT * 0.5;
  addBox(group, openW * 0.92, 0.03, openD * 0.92, 0, cavityFloorY, 0, innerDark, architect);
  addCylinder(group, 0.04, 0.02, '#7a8a96', architect, { x: 0, y: cavityFloorY + 0.015, z: 0 });

  const innerWallH = cavityDepth * 0.88;
  const innerWallY = cavityFloorY + innerWallH / 2;
  addBox(group, 0.045, innerWallH, openD * 0.94, -openW / 2 + 0.025, innerWallY, 0, inner, architect);
  addBox(group, 0.045, innerWallH, openD * 0.94, openW / 2 - 0.025, innerWallY, 0, inner, architect);
  addBox(group, openW * 0.94, innerWallH, 0.045, 0, innerWallY, -openD / 2 + 0.025, inner, architect);
  addBox(group, openW * 0.94, innerWallH * 0.7, 0.045, 0, innerWallY - innerWallH * 0.1, openD / 2 - 0.025, inner, architect);

  addBox(group, 0.1, 0.2, 0.1, 0, baseY + bodyH + 0.04, -d / 2 + 0.08, '#b4bac0', architect);
  addCylinder(group, 0.028, 0.16, '#a0a8b0', architect, { x: 0, y: baseY + bodyH + 0.14, z: -d / 2 + 0.12 });
  addBox(group, 0.14, 0.035, 0.05, 0, baseY + bodyH + 0.24, -d / 2 + 0.1, '#c0c6cc', architect);
}

function addLouveredDoorPanel(pivot, panelW, doorH, doorT, color, frameColor, architect, hingeSide) {
  const slats = 9;
  const gap = 0.007;
  const slatH = (doorH - gap * (slats + 1)) / slats;
  const centerX = hingeSide * panelW * 0.5;

  for (let i = 0; i < slats; i++) {
    const y = -doorH / 2 + gap + slatH / 2 + i * (slatH + gap);
    addBox(pivot, panelW * 0.9, slatH, doorT, centerX, y, 0, color, architect, {
      partRole: 'cabinet-door',
      doubleSided: true,
    });
  }

  addBox(pivot, 0.022, doorH, doorT * 1.05, centerX - hingeSide * panelW * 0.44, 0, 0, frameColor, architect, {
    partRole: 'cabinet-door',
    doubleSided: true,
  });
  addBox(pivot, 0.022, doorH, doorT * 1.05, centerX + hingeSide * panelW * 0.44, 0, 0, frameColor, architect, {
    partRole: 'cabinet-door',
    doubleSided: true,
  });
  addBox(pivot, panelW * 0.9, 0.022, doorT * 1.05, centerX, doorH / 2 - 0.011, 0, frameColor, architect, {
    partRole: 'cabinet-door',
    doubleSided: true,
  });
  addBox(pivot, panelW * 0.9, 0.022, doorT * 1.05, centerX, -doorH / 2 + 0.011, 0, frameColor, architect, {
    partRole: 'cabinet-door',
    doubleSided: true,
  });

  const notchX = centerX - hingeSide * panelW * 0.32;
  addBox(pivot, 0.028, 0.09, doorT * 0.7, notchX, 0, doorT * 0.35, frameColor, architect, {
    partRole: 'cabinet-handle',
    doubleSided: true,
  });
}

function addBathShelfDoors(group, w, cabinetH, d, baseY, def, architect, wood, woodDark) {
  const side = 0.028;
  const innerW = w - side * 2;
  const doorH = cabinetH - side * 1.4;
  const doorT = 0.016;
  const frontZ = d * 0.5 - doorT * 0.5;
  const pivotY = baseY + cabinetH / 2;
  const panelW = (innerW - 0.018) * 0.5;

  const leftPivot = new THREE.Group();
  leftPivot.position.set(-w / 2 + side, pivotY, frontZ);
  leftPivot.userData.partRole = 'cabinet-door-left-pivot';
  group.add(leftPivot);
  addLouveredDoorPanel(leftPivot, panelW, doorH, doorT, wood, woodDark, architect, 1);

  const rightPivot = new THREE.Group();
  rightPivot.position.set(w / 2 - side, pivotY, frontZ);
  rightPivot.userData.partRole = 'cabinet-door-right-pivot';
  group.add(rightPivot);
  addLouveredDoorPanel(rightPivot, panelW, doorH, doorT, wood, woodDark, architect, -1);
}

function buildBathShelf(group, w, h, d, def, architect) {
  const wood = def.color ?? '#c8a878';
  const woodDark = def.accent ?? '#9a7048';
  const woodLight = def.shelf ?? '#d8bc90';
  const towel = def.towel ?? '#4a7a8c';

  const legH = h * 0.06;
  const cabinetH = h * 0.5;
  const gapH = h * 0.2;
  const topThick = h * 0.035;
  const cabinetBaseY = legH;
  const cabinetCY = cabinetBaseY + cabinetH / 2;
  const topY = legH + cabinetH + gapH + topThick / 2;

  const legPositions = [
    [-w * 0.4, legH * 0.5, -d * 0.38],
    [w * 0.4, legH * 0.5, -d * 0.38],
    [-w * 0.4, legH * 0.5, d * 0.38],
    [w * 0.4, legH * 0.5, d * 0.38],
  ];
  for (const [lx, ly, lz] of legPositions) {
    addBox(group, 0.045, legH, 0.045, lx, ly, lz, woodDark, architect);
  }

  const side = 0.028;
  const innerW = w - side * 2;
  const innerD = d - side * 1.15;

  addBox(group, w, 0.022, d, 0, cabinetBaseY + 0.011, 0, woodDark, architect);
  addBox(group, side, cabinetH, d, -w / 2 + side / 2, cabinetCY, 0, wood, architect);
  addBox(group, side, cabinetH, d, w / 2 - side / 2, cabinetCY, 0, wood, architect);
  addBox(group, innerW, cabinetH, side * 0.75, 0, cabinetCY, -d / 2 + side * 0.38, wood, architect);
  addBox(group, innerW, 0.016, innerD, 0, cabinetBaseY + cabinetH * 0.5, 0, woodLight, architect);

  for (const compartmentX of [-innerW * 0.25, innerW * 0.25]) {
    for (let s = 0; s < 2; s++) {
      const shelfY = cabinetBaseY + cabinetH * (0.28 + s * 0.28);
      for (let i = 0; i < 5; i++) {
        const slatZ = -innerD * 0.35 + i * (innerD * 0.7) / 4;
        addBox(group, innerW * 0.34, 0.01, 0.018, compartmentX, shelfY, slatZ, woodLight, architect);
      }
    }
    addBox(group, innerW * 0.3, cabinetH * 0.07, innerD * 0.65, compartmentX, cabinetBaseY + cabinetH * 0.26, 0, towel, architect);
    addBox(group, innerW * 0.1, 0.014, innerD * 0.6, compartmentX, cabinetBaseY + cabinetH * 0.32, 0, '#6a9aaa', architect);
    addBox(group, innerW * 0.28, cabinetH * 0.06, innerD * 0.6, compartmentX, cabinetBaseY + cabinetH * 0.72, 0, '#5a8a9a', architect);
  }

  addBathShelfDoors(group, w, cabinetH, d, cabinetBaseY, def, architect, wood, woodDark);

  const postH = gapH + topThick;
  const postY = legH + cabinetH + postH / 2;
  const corners = [
    [-w / 2 + side, -d / 2 + side],
    [w / 2 - side, -d / 2 + side],
    [-w / 2 + side, d / 2 - side],
    [w / 2 - side, d / 2 - side],
  ];
  for (const [px, pz] of corners) {
    addBox(group, side * 0.85, postH, side * 0.85, px, postY, pz, wood, architect);
  }

  addBox(group, w, topThick, d, 0, topY, 0, woodLight, architect);

  const surfaceY = topY + topThick / 2;
  const bottles = [
    { x: -w * 0.28, z: d * 0.04, color: '#e8f0f8', ht: h * 0.13 },
    { x: -w * 0.06, z: -d * 0.06, color: '#d0e8f0', ht: h * 0.11 },
    { x: w * 0.14, z: d * 0.06, color: '#f0e8d0', ht: h * 0.14 },
    { x: w * 0.32, z: -d * 0.02, color: '#e0f0e8', ht: h * 0.1 },
  ];
  for (const b of bottles) {
    addCylinder(group, 0.026, b.ht, b.color, architect, { x: b.x, y: surfaceY + b.ht / 2, z: b.z });
    addBox(group, 0.018, 0.03, 0.018, b.x, surfaceY + b.ht + 0.012, b.z, '#c0c4c8', architect);
  }

  addBox(group, w * 0.16, h * 0.035, d * 0.22, w * 0.02, surfaceY + h * 0.018, d * 0.1, '#f8f4ec', architect);
  addBox(group, w * 0.12, h * 0.028, d * 0.18, -w * 0.34, surfaceY + h * 0.014, -d * 0.08, '#fff8f0', architect);
  addBox(group, w * 0.08, h * 0.05, d * 0.1, -w * 0.12, surfaceY + h * 0.025, d * 0.12, '#e8eef4', architect);
}

function buildShower(group, w, h, d, def, architect) {
  const glass = def.glass ?? '#a8cce0';
  const tile = def.tile ?? '#dce8f2';
  const trayH = 0.075;
  const rimH = 0.045;
  const glassOpts = { isGlass: true, keepColor: !architect };

  addBox(group, w, trayH, d, 0, trayH / 2, 0, def.accent, architect);
  addBox(group, w, rimH, 0.055, 0, trayH + rimH / 2, d / 2 - 0.02, def.color, architect);
  addBox(group, w, rimH, 0.055, 0, trayH + rimH / 2, -d / 2 + 0.02, def.color, architect);
  addBox(group, 0.055, rimH, d, -w / 2 + 0.028, trayH + rimH / 2, 0, def.color, architect);
  addBox(group, 0.055, rimH, d, w / 2 - 0.028, trayH + rimH / 2, 0, def.color, architect);
  addCylinder(group, 0.042, 0.018, '#98a4ac', architect, { x: 0, y: trayH + 0.012, z: 0 });

  addBox(group, w * 0.96, h * 0.9, 0.038, 0, h * 0.5, -d / 2 + 0.02, tile, architect);
  for (let row = 0; row < 7; row++) {
    addBox(group, w * 0.88, 0.008, 0.006, 0, trayH + 0.22 + row * h * 0.11, -d / 2 + 0.045, '#ccd8e4', architect);
  }

  addBox(group, 0.02, h * 0.84, d * 0.9, -w / 2 + 0.012, h * 0.47, 0, glass, architect, glassOpts);
  addBox(group, 0.02, h * 0.84, d * 0.9, w / 2 - 0.012, h * 0.47, 0, glass, architect, glassOpts);
  addBox(group, w * 0.58, h * 0.48, 0.02, 0, h * 0.3, d / 2 - 0.012, glass, architect, glassOpts);

  addBox(group, 0.038, h * 0.86, 0.038, w * 0.3, h * 0.5, -d * 0.38, '#a8b0b8', architect);
  addBox(group, 0.2, 0.032, 0.032, w * 0.2, h * 0.9, -d * 0.38, '#a8b0b8', architect);
  addCylinder(group, 0.11, 0.028, '#e4e8ec', architect, { x: w * 0.12, y: h * 0.93, z: -d * 0.38 });
  addCylinder(group, 0.075, 0.018, '#c8ccd2', architect, { x: w * 0.12, y: h * 0.95, z: -d * 0.38 });

  addBox(group, 0.11, 0.15, 0.075, -w * 0.28, h * 0.52, -d / 2 + 0.06, '#bcc4cc', architect);
  addCylinder(group, 0.032, 0.055, '#e0e4e8', architect, { x: -w * 0.28, y: h * 0.61, z: -d / 2 + 0.1 });
  addBox(group, 0.045, 0.07, 0.045, -w * 0.18, h * 0.47, -d / 2 + 0.055, '#a0a8b0', architect);
  addBox(group, 0.035, h * 0.12, 0.035, -w * 0.18, h * 0.4, -d / 2 + 0.055, '#b0b8c0', architect);
}

function buildCarpet(group, w, h, d, def, architect, opts = {}) {
  const shape = opts.shape ?? group.userData?.carpetShape ?? 'rect';
  const pattern = opts.pattern ?? group.userData?.carpetPattern ?? 'border';
  const color = opts.color ?? group.userData?.carpetColor ?? def.color;
  const accent = opts.accent ?? group.userData?.carpetAccent ?? def.accent;

  buildCarpetBase(group, shape, w, h, d, color, architect);
  buildCarpetPattern(group, shape, pattern, w, h, d, color, accent, architect);
  buildCarpetEdge(group, shape, w, h, d, color, accent, architect);
}

function buildCarpetBase(group, shape, w, h, d, color, architect) {
  if (shape === 'round' || shape === 'oval') {
    const radius = Math.min(w, d) / 2;
    const geo = new THREE.CylinderGeometry(radius, radius * 0.98, h, 48);
    const mesh = new THREE.Mesh(geo, makeMaterial(color, architect, { roughness: 0.92 }));
    mesh.position.y = h / 2;
    if (shape === 'oval') {
      mesh.scale.set(w / (2 * radius), 1, d / (2 * radius));
    }
    mesh.castShadow = !architect;
    mesh.receiveShadow = !architect;
    mesh.userData.isFurniturePart = true;
    mesh.userData.partColor = color;
    group.add(mesh);
    return;
  }

  if (shape === 'rounded') {
    const corner = Math.min(w, d) * 0.14;
    const innerW = Math.max(w - corner * 2, w * 0.55);
    const innerD = Math.max(d - corner * 2, d * 0.55);
    addBox(group, innerW, h, d, 0, h / 2, 0, color, architect);
    addBox(group, w, h, innerD, 0, h / 2, 0, color, architect);
    const corners = [
      [w / 2 - corner, d / 2 - corner],
      [-w / 2 + corner, d / 2 - corner],
      [w / 2 - corner, -d / 2 + corner],
      [-w / 2 + corner, -d / 2 + corner],
    ];
    for (const [cx, cz] of corners) {
      const geo = new THREE.CylinderGeometry(corner, corner, h, 16);
      const mesh = new THREE.Mesh(geo, makeMaterial(color, architect, { roughness: 0.92 }));
      mesh.position.set(cx, h / 2, cz);
      mesh.castShadow = !architect;
      mesh.receiveShadow = !architect;
      mesh.userData.isFurniturePart = true;
      mesh.userData.partColor = color;
      group.add(mesh);
    }
    return;
  }

  addBox(group, w, h, d, 0, h / 2, 0, color, architect);
}

function carpetPointInside(shape, w, d, px, pz) {
  if (shape === 'round') {
    const r = Math.min(w, d) / 2;
    return px * px + pz * pz <= r * r * 0.92;
  }
  if (shape === 'oval') {
    const rx = w / 2;
    const rz = d / 2;
    return (px * px) / (rx * rx) + (pz * pz) / (rz * rz) <= 0.92;
  }
  const marginX = w * 0.06;
  const marginZ = d * 0.06;
  return Math.abs(px) <= w / 2 - marginX && Math.abs(pz) <= d / 2 - marginZ;
}

function buildCarpetPattern(group, shape, pattern, w, h, d, color, accent, architect) {
  const layerY = h * 0.62;
  const layerH = h * 0.22;

  if (pattern === 'plain') {
    const weaveCount = Math.max(3, Math.floor(Math.max(w, d) * 2));
    for (let i = 0; i < weaveCount; i++) {
      const t = (i + 0.5) / weaveCount - 0.5;
      const stripeW = Math.max(w, d) / weaveCount * 0.55;
      if (i % 2 === 0) {
        addBox(group, w * 0.9, layerH * 0.35, stripeW, 0, layerY, t * d * 0.82, accent, architect);
      } else {
        addBox(group, stripeW, layerH * 0.35, d * 0.9, t * w * 0.82, layerY, 0, accent, architect);
      }
    }
    return;
  }

  if (pattern === 'border') {
    if (shape === 'round' || shape === 'oval') {
      const outerR = Math.min(w, d) / 2;
      const innerR = outerR * 0.72;
      const ring = new THREE.RingGeometry(innerR * 0.92, outerR * 0.96, 48);
      const mesh = new THREE.Mesh(ring, makeMaterial(accent, architect));
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = layerY;
      if (shape === 'oval') {
        mesh.scale.set(w / (2 * outerR), d / (2 * outerR), 1);
      }
      mesh.castShadow = false;
      mesh.userData.isFurniturePart = true;
      mesh.userData.partColor = accent;
      group.add(mesh);

      const center = new THREE.CircleGeometry(innerR * 0.88, 48);
      const centerMesh = new THREE.Mesh(center, makeMaterial(accent, architect, { roughness: 0.88 }));
      centerMesh.rotation.x = -Math.PI / 2;
      centerMesh.position.y = layerY + layerH * 0.15;
      if (shape === 'oval') {
        centerMesh.scale.set(w / (2 * outerR), d / (2 * outerR), 1);
      }
      centerMesh.userData.isFurniturePart = true;
      centerMesh.userData.partColor = accent;
      group.add(centerMesh);
      return;
    }

    const insetW = w * 0.72;
    const insetD = d * 0.72;
    if (shape === 'rounded') {
      const corner = Math.min(insetW, insetD) * 0.14;
      const innerW = Math.max(insetW - corner * 2, insetW * 0.55);
      const innerD = Math.max(insetD - corner * 2, insetD * 0.55);
      addBox(group, innerW, layerH, insetD, 0, layerY, 0, accent, architect);
      addBox(group, insetW, layerH, innerD, 0, layerY, 0, accent, architect);
      const corners = [
        [insetW / 2 - corner, insetD / 2 - corner],
        [-insetW / 2 + corner, insetD / 2 - corner],
        [insetW / 2 - corner, -insetD / 2 + corner],
        [-insetW / 2 + corner, -insetD / 2 + corner],
      ];
      for (const [cx, cz] of corners) {
        const geo = new THREE.CylinderGeometry(corner, corner, layerH, 12);
        const mesh = new THREE.Mesh(geo, makeMaterial(accent, architect));
        mesh.position.set(cx, layerY, cz);
        mesh.userData.isFurniturePart = true;
        mesh.userData.partColor = accent;
        group.add(mesh);
      }
    } else {
      addBox(group, insetW, layerH, insetD, 0, layerY, 0, accent, architect);
    }
    return;
  }

  if (pattern === 'stripes') {
    const stripes = Math.max(4, Math.floor(w * 2.5));
    const stripeW = (w * 0.86) / stripes;
    for (let i = 0; i < stripes; i++) {
      const px = -w * 0.43 + stripeW * (i + 0.5);
      const stripeColor = i % 2 === 0 ? accent : color;
      if (!carpetPointInside(shape, w, d, px, 0)) continue;
      if (shape === 'round' || shape === 'oval') {
        const span = Math.sqrt(Math.max(0, 1 - (px / (w / 2)) ** 2)) * d * 0.82;
        addBox(group, stripeW * 0.82, layerH, span, px, layerY, 0, stripeColor, architect);
      } else {
        addBox(group, stripeW * 0.82, layerH, d * 0.86, px, layerY, 0, stripeColor, architect);
      }
    }
    return;
  }

  if (pattern === 'diamond') {
    const cell = Math.min(w, d) / 5.5;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(d / cell);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = -w / 2 + cell * (col + 0.5);
        const pz = -d / 2 + cell * (row + 0.5);
        if (!carpetPointInside(shape, w, d, px, pz)) continue;
        const tileColor = (row + col) % 2 === 0 ? accent : color;
        const geo = new THREE.BoxGeometry(cell * 0.55, layerH, cell * 0.55);
        const mesh = new THREE.Mesh(geo, makeMaterial(tileColor, architect));
        mesh.position.set(px, layerY, pz);
        mesh.rotation.y = Math.PI / 4;
        mesh.userData.isFurniturePart = true;
        mesh.userData.partColor = tileColor;
        group.add(mesh);
      }
    }
    return;
  }

  if (pattern === 'shag') {
    const count = Math.floor(w * d * 10);
    for (let i = 0; i < count; i++) {
      const px = ((i * 19) % 100) / 100 - 0.5;
      const pz = ((i * 37) % 100) / 100 - 0.5;
      const x = px * w * 0.82;
      const z = pz * d * 0.82;
      if (!carpetPointInside(shape, w, d, x, z)) continue;
      const bumpH = h * (0.55 + (i % 4) * 0.18);
      const bumpColor = i % 3 === 0 ? accent : color;
      addBox(group, 0.035, bumpH, 0.035, x, h + bumpH / 2, z, bumpColor, architect);
    }
    return;
  }

  if (pattern === 'dots') {
    const spacing = Math.min(w, d) / 4.5;
    const cols = Math.ceil(w / spacing);
    const rows = Math.ceil(d / spacing);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = -w / 2 + spacing * (col + 0.5);
        const pz = -d / 2 + spacing * (row + 0.5);
        if (!carpetPointInside(shape, w, d, px, pz)) continue;
        const dotColor = (row + col) % 2 === 0 ? accent : '#ffffff';
        addSphere(group, spacing * 0.14, layerY + layerH * 0.35, dotColor, architect, { x: px, z: pz });
      }
    }
  }
}

function buildCarpetEdge(group, shape, w, h, d, color, accent, architect) {
  const fringeH = h * 1.8;
  const fringeW = Math.min(0.03, Math.min(w, d) * 0.04);

  if (shape === 'round' || shape === 'oval') {
    const radius = Math.min(w, d) / 2;
    const geo = new THREE.TorusGeometry(radius * 0.97, fringeW * 0.65, 8, 48);
    const mesh = new THREE.Mesh(geo, makeMaterial(accent, architect));
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = h * 0.55;
    if (shape === 'oval') {
      mesh.scale.set(w / (2 * radius), 1, d / (2 * radius));
    }
    mesh.userData.isFurniturePart = true;
    mesh.userData.partColor = accent;
    group.add(mesh);
    return;
  }

  const tasselCount = Math.max(4, Math.floor(w * 1.8));
  const step = w / tasselCount;
  for (let i = 0; i < tasselCount; i++) {
    const x = -w / 2 + step * (i + 0.5);
    addBox(group, fringeW, fringeH, fringeW * 1.4, x, fringeH / 2, d / 2 - fringeW, accent, architect);
    addBox(group, fringeW, fringeH, fringeW * 1.4, x, fringeH / 2, -d / 2 + fringeW, accent, architect);
  }

  if (shape === 'rect') {
    const sideCount = Math.max(3, Math.floor(d * 1.2));
    const sideStep = d / sideCount;
    for (let i = 0; i < sideCount; i++) {
      const z = -d / 2 + sideStep * (i + 0.5);
      addBox(group, fringeW * 1.4, fringeH * 0.85, fringeW, w / 2 - fringeW, fringeH * 0.42, z, color, architect);
      addBox(group, fringeW * 1.4, fringeH * 0.85, fringeW, -w / 2 + fringeW, fringeH * 0.42, z, color, architect);
    }
  }
}

export function rebuildCarpetGroup(group, mode) {
  if (!isCarpetType(group.userData.furnitureType)) return;

  const ring = group.userData.selectionRing;
  if (ring) group.remove(ring);

  const children = [...group.children];
  for (const child of children) {
    child.traverse((c) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
    group.remove(child);
  }

  const type = group.userData.furnitureType;
  const def = FURNITURE_ITEMS[type];
  const w = group.userData.sizeW ?? def.size.w;
  const h = def.size.h;
  const d = group.userData.sizeD ?? def.size.d;

  buildCarpet(group, w, h, d, def, mode === 'architect', {
    shape: group.userData.carpetShape,
    pattern: group.userData.carpetPattern,
    color: group.userData.carpetColor,
    accent: group.userData.carpetAccent,
  });

  if (ring) {
    group.add(ring);
  }
}

export function rebuildTvGroup(group, mode) {
  if (!isTvType(group.userData.furnitureType)) return;

  const ring = group.userData.selectionRing;
  if (ring) group.remove(ring);

  const children = [...group.children];
  for (const child of children) {
    child.traverse((c) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
    group.remove(child);
  }

  const def = FURNITURE_ITEMS.tv;
  const w = def.size.w;
  const h = def.size.h;
  const d = def.size.d;

  buildTv(group, w, h, d, def, mode === 'architect', group.userData.tvStyle ?? 'wall');

  if (ring) {
    group.add(ring);
  }
}

function makeMaterial(color, architect, { isGlass = false, emissive = null, keepColor = false, doubleSided = false, roughness = null } = {}) {
  if (architect && !keepColor) {
    return new THREE.MeshLambertMaterial({
      color: isGlass ? 0x88aacc : 0x8899aa,
      transparent: true,
      opacity: isGlass ? 0.6 : 0.85,
      side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
    });
  }

  if (isGlass) {
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: typeof color === 'string' ? color : 0x7ec8ff,
      transparent: true,
      opacity: 0.42,
      roughness: 0.04,
      metalness: 0.08,
      transmission: architect ? 0.55 : 0.72,
      thickness: 0.015,
      ior: 1.45,
      side: THREE.DoubleSide,
    });
    return glassMat;
  }

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: roughness ?? (architect ? 0.5 : 0.65),
    metalness: 0.04,
    side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
  });

  if (emissive) {
    mat.emissive = new THREE.Color(emissive);
    mat.emissiveIntensity = architect ? 0.45 : 0.12;
  }

  return mat;
}

function addBox(parent, w, h, d, x, y, z, color, architect, opts = {}) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, makeMaterial(color, architect, opts));
  mesh.position.set(x, y, z);
  mesh.castShadow = !architect || opts.keepColor;
  mesh.receiveShadow = !architect || opts.keepColor;
  mesh.userData.isFurniturePart = true;
  mesh.userData.partColor = color;
  mesh.userData.isGlass = opts.isGlass ?? false;
  mesh.userData.emissive = opts.emissive ?? null;
  mesh.userData.keepColor = opts.keepColor ?? false;
  mesh.userData.partRole = opts.partRole ?? null;
  mesh.userData.doubleSided = opts.doubleSided ?? false;
  if (opts.keepColor) mesh.renderOrder = 2;
  parent.add(mesh);
}

function addCylinder(parent, radius, height, color, architect, opts = {}) {
  const geo = new THREE.CylinderGeometry(radius, radius * 0.85, height, 12);
  const mesh = new THREE.Mesh(geo, makeMaterial(color, architect, opts));
  mesh.position.set(opts.x ?? 0, opts.y ?? height * 0.5, opts.z ?? 0);
  mesh.castShadow = !architect;
  mesh.userData.isFurniturePart = true;
  mesh.userData.partColor = color;
  mesh.userData.isGlass = opts.isGlass ?? false;
  parent.add(mesh);
}

function addSphere(parent, radius, y, color, architect, opts = {}) {
  const geo = new THREE.SphereGeometry(radius, 12, 10);
  const mesh = new THREE.Mesh(geo, makeMaterial(color, architect, opts));
  mesh.position.set(opts.x ?? 0, y, opts.z ?? 0);
  mesh.castShadow = !architect;
  mesh.userData.isFurniturePart = true;
  mesh.userData.partColor = color;
  parent.add(mesh);
}

function addLeaf(parent, w, h, x, y, z, color, architect, rotY = 0, rotX = 0) {
  const geo = new THREE.BoxGeometry(w, h, 0.035);
  const mesh = new THREE.Mesh(geo, makeMaterial(color, architect));
  mesh.position.set(x, y, z);
  mesh.rotation.set(rotX, rotY, 0);
  mesh.castShadow = !architect;
  mesh.userData.isFurniturePart = true;
  mesh.userData.partColor = color;
  parent.add(mesh);
}

function addLegs(parent, w, d, legH, color, architect) {
  const lw = 0.04;
  const positions = [
    [-w * 0.4, legH * 0.5, -d * 0.4],
    [w * 0.4, legH * 0.5, -d * 0.4],
    [-w * 0.4, legH * 0.5, d * 0.4],
    [w * 0.4, legH * 0.5, d * 0.4],
  ];
  for (const [x, y, z] of positions) {
    addBox(parent, lw, legH, lw, x, y, z, color, architect);
  }
}

export function updateFurnitureMaterials(group, mode) {
  const architect = mode === 'architect';
  group.traverse((child) => {
    if (!child.isMesh) return;
    const color = child.userData.partColor ?? '#8899aa';
    child.material.dispose();
    child.material = makeMaterial(color, architect, {
      isGlass: child.userData.isGlass,
      emissive: child.userData.emissive,
      keepColor: child.userData.keepColor,
      doubleSided: child.userData.doubleSided,
    });
    child.castShadow = !architect || child.userData.keepColor;
    child.receiveShadow = !architect || child.userData.keepColor;
  });
}

export function applyDoorOpenState(group, open) {
  if (!isOpenableType(group.userData.furnitureType)) return;

  group.userData.doorOpen = !!open;
  const isWindow = isWindowType(group.userData.furnitureType);

  group.traverse((child) => {
    const role = child.userData.partRole;
    if (role === 'leaf-pivot') {
      child.rotation.y = open ? Math.PI * 0.48 : 0;
    }
    if (role === 'leaf-left-pivot') {
      child.rotation.y = open ? -Math.PI * 0.45 : 0;
    }
    if (role === 'leaf-right-pivot') {
      child.rotation.y = open ? Math.PI * 0.45 : 0;
    }
    if (role === 'sash-pivot') {
      child.rotation.y = open ? Math.PI * 0.42 : 0;
    }
    if (role === 'cabinet-door-pivot') {
      child.rotation.y = open ? -Math.PI * 0.5 : 0;
    }
    if (role === 'cabinet-door-left-pivot') {
      child.rotation.y = open ? -Math.PI * 0.48 : 0;
    }
    if (role === 'cabinet-door-right-pivot') {
      child.rotation.y = open ? Math.PI * 0.48 : 0;
    }
    if (role === 'drop-door-pivot' || role === 'oven-door-pivot' || role === 'dishwasher-door-pivot') {
      child.rotation.x = open ? -Math.PI * 0.52 : 0;
    }
    if (role === 'passage') {
      child.visible = false;
    }
    if (role === 'handle') {
      child.visible = !open;
    }
    if (role === 'leaf-back' || role === 'sash-back') {
      child.visible = !open;
    }
    if (isWindow && role === 'sash' && child.isMesh) {
      child.visible = true;
    }
  });
}

export function resetFurnitureIdCounter() {
  furnitureIdCounter = 0;
}

export function syncFurnitureIdCounter(ids = []) {
  let max = furnitureIdCounter;
  for (const id of ids) {
    if (typeof id === 'string' && id.startsWith('f-')) {
      const n = parseInt(id.slice(2), 10);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
  }
  furnitureIdCounter = max;
}
