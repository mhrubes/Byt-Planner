import * as THREE from 'three';

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
    color: '#6b5344',
    accent: '#8b7355',
  },
  tv: {
    label: 'Televize',
    icon: '📺',
    size: { w: 1.2, h: 0.7, d: 0.08 },
    color: '#1a1a2e',
    accent: '#2d2d44',
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
  },
  plant: {
    label: 'Rostlina',
    icon: '🪴',
    size: { w: 0.4, h: 0.8, d: 0.4 },
    color: '#2d5016',
    accent: '#4a7c23',
  },
  lamp: {
    label: 'Lampa',
    icon: '💡',
    size: { w: 0.35, h: 1.55, d: 0.35 },
    color: '#f5e6c8',
    accent: '#d4a843',
  },
  bed: {
    label: 'Postel',
    icon: '🛏️',
    size: { w: 1.6, h: 0.5, d: 2.0 },
    color: '#e8e0d4',
    accent: '#c4b8a8',
  },
  wardrobe: {
    label: 'Skříň',
    icon: '🗄️',
    size: { w: 1.2, h: 2.2, d: 0.6 },
    color: '#5c4033',
    accent: '#7a5544',
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
  },
  dining_table: {
    label: 'Jídelní stůl',
    icon: '🍽️',
    size: { w: 1.6, h: 0.75, d: 0.9 },
    color: '#8b6914',
    accent: '#a07818',
  },
  chair: {
    label: 'Židle',
    icon: '💺',
    size: { w: 0.45, h: 0.9, d: 0.45 },
    color: '#4a5568',
    accent: '#718096',
  },
  desk: {
    label: 'Psací stůl',
    icon: '🖥️',
    size: { w: 1.4, h: 0.75, d: 0.7 },
    color: '#654321',
    accent: '#8b5a2b',
  },
  toilet: {
    label: 'WC',
    icon: '🚽',
    size: { w: 0.4, h: 0.75, d: 0.65 },
    color: '#f5f5f5',
    accent: '#e0e0e0',
  },
  sink: {
    label: 'Umyvadlo',
    icon: '🚰',
    size: { w: 0.65, h: 0.85, d: 0.45 },
    color: '#f5f5f5',
    accent: '#c0c0c0',
  },
  bathtub: {
    label: 'Vana',
    icon: '🛁',
    size: { w: 1.7, h: 0.55, d: 0.75 },
    color: '#f5f5f5',
    accent: '#e8e8e8',
  },
};

/** Kategorie pro levý panel — pořadí a seskupení položek */
export const CATALOG_CATEGORIES = [
  {
    id: 'structural',
    label: 'Stavební prvky',
    icon: '🏗️',
    items: ['door', 'window', 'balcony_door', 'radiator'],
  },
  {
    id: 'living',
    label: 'Obývací pokoj',
    icon: '🛋️',
    items: ['sofa', 'tv', 'table', 'bookshelf', 'plant', 'lamp'],
  },
  {
    id: 'bedroom',
    label: 'Ložnice',
    icon: '🛏️',
    items: ['bed', 'wardrobe', 'nightstand', 'lamp'],
  },
  {
    id: 'kitchen',
    label: 'Kuchyně & jídelna',
    icon: '🍳',
    items: ['kitchen', 'dining_table', 'chair'],
  },
  {
    id: 'office',
    label: 'Pracovna',
    icon: '🖥️',
    items: ['desk', 'chair', 'bookshelf'],
  },
  {
    id: 'bathroom',
    label: 'Koupelna',
    icon: '🛁',
    items: ['toilet', 'sink', 'bathtub', 'radiator'],
  },
];

/** Plochý katalog pro zpětnou kompatibilitu */
export const FURNITURE_CATALOG = { ...FURNITURE_ITEMS };

export const DOOR_TYPES = new Set(['door', 'balcony_door']);
export const OPENABLE_TYPES = new Set(['door', 'balcony_door', 'window']);

export function isDoorType(type) {
  return DOOR_TYPES.has(type);
}

export function isOpenableType(type) {
  return OPENABLE_TYPES.has(type);
}

let furnitureIdCounter = 0;

export function createFurnitureMesh(type, mode = 'preview') {
  const def = FURNITURE_ITEMS[type];
  if (!def) return null;

  const group = new THREE.Group();
  group.userData = {
    isFurniture: true,
    furnitureType: type,
    furnitureId: `f-${++furnitureIdCounter}`,
    rotatable: true,
    doorOpen: false,
  };

  const { w, h, d } = def.size;
  const isArchitect = mode === 'architect';

  switch (type) {
    case 'door':
      buildDoor(group, w, h, d, def, isArchitect);
      break;
    case 'window':
      buildWindow(group, w, h, d, def, isArchitect);
      break;
    case 'balcony_door':
      buildBalconyDoor(group, w, h, d, def, isArchitect);
      break;
    case 'radiator':
      buildRadiator(group, w, h, d, def, isArchitect);
      break;
    case 'sofa':
      addBox(group, w, h * 0.5, d, 0, h * 0.25, 0, def.color, isArchitect);
      addBox(group, w, h * 0.35, d * 0.15, 0, h * 0.575, -d * 0.425, def.accent, isArchitect);
      addBox(group, w * 0.12, h * 0.25, d, -w * 0.44, h * 0.375, 0, def.accent, isArchitect);
      addBox(group, w * 0.12, h * 0.25, d, w * 0.44, h * 0.375, 0, def.accent, isArchitect);
      break;
    case 'bed':
      addBox(group, w, h * 0.4, d, 0, h * 0.2, 0, def.color, isArchitect);
      addBox(group, w, h * 0.15, d * 0.08, 0, h * 0.475, -d * 0.46, def.accent, isArchitect);
      addBox(group, w * 0.9, h * 0.12, d * 0.85, 0, h * 0.46, 0, '#ffffff', isArchitect);
      break;
    case 'chair':
      addBox(group, w, h * 0.05, d, 0, h * 0.45, 0, def.color, isArchitect);
      addBox(group, w, h * 0.5, d * 0.08, 0, h * 0.75, -d * 0.46, def.accent, isArchitect);
      addLegs(group, w, d, h * 0.45, def.accent, isArchitect);
      break;
    case 'tv':
      addBox(group, w, h, d, 0, h * 0.5 + 0.5, 0, def.color, isArchitect);
      addBox(group, w * 0.6, 0.05, d * 2, 0, 0.5, 0, '#333333', isArchitect);
      break;
    case 'plant':
      addCylinder(group, w * 0.35, h * 0.25, def.accent, isArchitect);
      addSphere(group, w * 0.5, h * 0.55, def.color, isArchitect);
      break;
    case 'kitchen':
      addBox(group, w, h, d, 0, h * 0.5, 0, def.color, isArchitect);
      addBox(group, w * 0.95, h * 0.05, d * 0.9, 0, h + 0.025, 0, def.accent, isArchitect);
      break;
    case 'lamp':
      buildLamp(group, w, h, def, isArchitect);
      break;
    case 'nightstand':
      addBox(group, w, h * 0.85, d, 0, h * 0.425, 0, def.color, isArchitect);
      addBox(group, w * 0.9, h * 0.08, d * 0.85, 0, h * 0.89, 0, def.accent, isArchitect);
      addLegs(group, w * 0.85, d * 0.85, h * 0.4, def.accent, isArchitect);
      break;
    case 'dining_table':
      addBox(group, w, h * 0.06, d, 0, h * 0.97, 0, def.color, isArchitect);
      addLegs(group, w * 0.85, d * 0.85, h * 0.94, def.accent, isArchitect);
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
    default:
      addBox(group, w, h, d, 0, h * 0.5, 0, def.color, isArchitect);
      break;
  }

  return group;
}

function buildDoor(group, w, h, d, def, architect) {
  const frame = 0.07;
  const leafW = w - frame * 2;
  const leafH = h - frame * 2;
  const leafD = Math.max(d * 0.95, 0.14);

  addBox(group, w + 0.06, h + 0.06, d * 0.9, 0, h * 0.5, 0, def.accent, architect, {
    keepColor: true,
    emissive: '#8a8078',
    partRole: 'frame',
    doubleSided: true,
  });
  addBox(group, w + 0.02, h + 0.02, d * 0.92, 0, h * 0.5, 0, '#5c4033', architect, {
    keepColor: true,
    emissive: '#2a1810',
    partRole: 'frame',
    doubleSided: true,
  });

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
  addBox(group, 0.05, 0.14, 0.06, w * 0.38, h * 0.52, leafD * 0.45, '#e6b422', architect, {
    keepColor: true,
    emissive: '#806010',
    partRole: 'handle',
    doubleSided: true,
  });

  addPassageMarker(group, w, architect);
}

function addPassageMarker(group, width, architect) {
  const geo = new THREE.PlaneGeometry(width * 0.9, width * 0.55);
  const mat = makeMaterial('#4ade80', architect, { keepColor: true });
  mat.transparent = true;
  mat.opacity = architect ? 0.55 : 0.4;
  mat.side = THREE.DoubleSide;
  const plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, 0.025, 0.18);
  plane.visible = false;
  plane.userData.partRole = 'passage';
  plane.userData.isFurniturePart = true;
  plane.userData.partColor = '#4ade80';
  plane.userData.keepColor = true;
  group.add(plane);
}

function buildBalconyDoor(group, w, h, d, def, architect) {
  const frame = 0.07;
  const innerH = h - frame * 2;
  const panelW = (w - frame * 3) / 2;
  const leafD = Math.max(d * 0.95, 0.14);

  addBox(group, w + 0.06, h + 0.06, d * 0.9, 0, h * 0.5, 0, def.accent, architect, {
    keepColor: true,
    emissive: '#0d4a35',
    partRole: 'frame',
    doubleSided: true,
  });

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
  addBox(group, 0.05, innerH, d * 0.28, 0, h * 0.5, leafD * 0.42, def.accent, architect, {
    keepColor: true,
    partRole: 'frame',
    doubleSided: true,
  });
  addBox(group, 0.05, 0.12, 0.05, w * 0.42, h * 0.55, leafD * 0.45, '#e6b422', architect, {
    keepColor: true,
    emissive: '#806010',
    partRole: 'handle',
    doubleSided: true,
  });

  addPassageMarker(group, w, architect);
}

function buildWindow(group, w, h, d, def, architect) {
  const sill = def.sillHeight ?? 0.9;
  const cy = sill + h * 0.5;
  const frame = 0.07;
  const glassW = w - frame * 2;
  const glassH = h - frame * 2;
  const winD = Math.max(d * 1.1, 0.18);

  addBox(group, w + 0.08, h + frame * 2 + 0.04, winD * 0.95, 0, cy, 0, def.accent, architect, {
    keepColor: true,
    emissive: '#1a5080',
    partRole: 'frame',
    doubleSided: true,
  });
  addBox(group, w + 0.02, h + 0.02, winD * 0.92, 0, cy, 0, def.color, architect, {
    keepColor: true,
    emissive: '#aaccee',
    partRole: 'frame',
    doubleSided: true,
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

  addBox(group, 0.05, glassH, winD * 0.55, 0, cy, winD * 0.22, def.color, architect, {
    keepColor: true,
    partRole: 'frame',
    doubleSided: true,
  });
  addBox(group, glassW, 0.05, winD * 0.55, 0, cy, winD * 0.22, def.color, architect, {
    keepColor: true,
    partRole: 'frame',
    doubleSided: true,
  });
  addBox(group, glassW * 0.9, glassH * 0.9, 0.025, 0, cy, -winD * 0.48, def.back ?? def.inner, architect, {
    keepColor: true,
    emissive: '#5577aa',
    partRole: 'sash-back',
    doubleSided: true,
  });
  addBox(group, w + 0.1, 0.08, winD * 0.75, 0, sill + 0.04, winD * 0.18, def.accent, architect, {
    keepColor: true,
    doubleSided: true,
    partRole: 'frame',
  });
}

function buildRadiator(group, w, h, d, def, architect) {
  const ribCount = 8;
  const ribW = w / (ribCount * 2);
  for (let i = 0; i < ribCount; i++) {
    const x = -w * 0.5 + ribW + i * ribW * 2;
    addBox(group, ribW * 0.7, h * 0.85, d, x, h * 0.5, 0, def.color, architect);
  }
  addBox(group, w, h * 0.08, d * 1.2, 0, h * 0.96, 0, def.accent, architect);
  addBox(group, w, h * 0.08, d * 1.2, 0, h * 0.04, 0, def.accent, architect);
}

function buildLamp(group, w, h, def, architect) {
  addCylinder(group, w * 0.45, h * 0.03, '#333333', architect);
  addBox(group, w * 0.08, h * 0.88, w * 0.08, 0, h * 0.47, 0, def.accent, architect);
  addBox(group, w * 1.4, h * 0.18, w * 1.4, 0, h * 0.94, 0, def.color, architect, { emissive: def.color });
}

function buildToilet(group, w, h, d, def, architect) {
  addBox(group, w * 0.55, h * 0.45, d * 0.35, 0, h * 0.78, -d * 0.28, def.accent, architect);
  addBox(group, w * 0.85, h * 0.35, d * 0.75, 0, h * 0.2, d * 0.05, def.color, architect);
  addBox(group, w * 0.7, h * 0.08, d * 0.55, 0, h * 0.42, -d * 0.05, def.accent, architect);
}

function buildSink(group, w, h, d, def, architect) {
  addBox(group, w, h * 0.75, d * 0.5, 0, h * 0.375, 0, def.color, architect);
  addBox(group, w * 0.85, h * 0.08, d * 0.7, 0, h * 0.78, 0, def.accent, architect);
  addBox(group, w * 0.55, h * 0.12, d * 0.45, 0, h * 0.84, d * 0.05, '#d0e8f8', architect, { isGlass: true });
  addBox(group, 0.04, h * 0.25, 0.04, w * 0.35, h * 0.88, d * 0.25, '#c0c0c0', architect);
}

function buildBathtub(group, w, h, d, def, architect) {
  addBox(group, w, h * 0.55, d, 0, h * 0.3, 0, def.color, architect);
  addBox(group, w * 0.88, h * 0.35, d * 0.82, 0, h * 0.45, 0, '#d8eef8', architect, { isGlass: true });
  addBox(group, w, h * 0.12, d * 0.08, 0, h * 0.56, -d * 0.46, def.accent, architect);
}

function makeMaterial(color, architect, { isGlass = false, emissive = null, keepColor = false, doubleSided = false } = {}) {
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
    roughness: architect ? 0.5 : 0.65,
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
  mesh.position.y = height * 0.5;
  mesh.castShadow = !architect;
  mesh.userData.isFurniturePart = true;
  mesh.userData.partColor = color;
  mesh.userData.isGlass = opts.isGlass ?? false;
  parent.add(mesh);
}

function addSphere(parent, radius, y, color, architect, opts = {}) {
  const geo = new THREE.SphereGeometry(radius, 12, 10);
  const mesh = new THREE.Mesh(geo, makeMaterial(color, architect, opts));
  mesh.position.y = y;
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
  const isWindow = group.userData.furnitureType === 'window';

  group.traverse((child) => {
    const role = child.userData.partRole;
    if (role === 'leaf-pivot') {
      child.rotation.y = open ? Math.PI * 0.45 : 0;
    }
    if (role === 'leaf-left-pivot') {
      child.rotation.y = open ? -Math.PI * 0.42 : 0;
    }
    if (role === 'leaf-right-pivot') {
      child.rotation.y = open ? Math.PI * 0.42 : 0;
    }
    if (role === 'sash-pivot') {
      child.rotation.y = open ? Math.PI * 0.38 : 0;
    }
    if (role === 'passage') {
      child.visible = open;
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
