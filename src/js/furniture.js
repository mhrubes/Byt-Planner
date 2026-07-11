import * as THREE from 'three';

/** Katalog nábytku — rozměry v metrech, barvy pro preview režim */
export const FURNITURE_CATALOG = {
  sofa: {
    label: 'Pohovka',
    icon: '🛋️',
    size: { w: 2.0, h: 0.85, d: 0.9 },
    color: '#6b5344',
    accent: '#8b7355',
  },
  bed: {
    label: 'Postel',
    icon: '🛏️',
    size: { w: 1.6, h: 0.5, d: 2.0 },
    color: '#e8e0d4',
    accent: '#c4b8a8',
  },
  table: {
    label: 'Stůl',
    icon: '🪑',
    size: { w: 1.2, h: 0.75, d: 0.8 },
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
  wardrobe: {
    label: 'Skříň',
    icon: '🚪',
    size: { w: 1.2, h: 2.2, d: 0.6 },
    color: '#5c4033',
    accent: '#7a5544',
  },
  tv: {
    label: 'Televize',
    icon: '📺',
    size: { w: 1.2, h: 0.7, d: 0.08 },
    color: '#1a1a2e',
    accent: '#2d2d44',
  },
  kitchen: {
    label: 'Kuchyňská linka',
    icon: '🍳',
    size: { w: 2.0, h: 0.9, d: 0.6 },
    color: '#f0f0f0',
    accent: '#d0d0d0',
  },
  desk: {
    label: 'Psací stůl',
    icon: '🖥️',
    size: { w: 1.4, h: 0.75, d: 0.7 },
    color: '#654321',
    accent: '#8b5a2b',
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
};

let furnitureIdCounter = 0;

export function createFurnitureMesh(type, mode = 'preview') {
  const def = FURNITURE_CATALOG[type];
  if (!def) return null;

  const group = new THREE.Group();
  group.userData = {
    isFurniture: true,
    furnitureType: type,
    furnitureId: `f-${++furnitureIdCounter}`,
    rotatable: true,
  };

  const { w, h, d } = def.size;
  const isArchitect = mode === 'architect';

  if (type === 'sofa') {
    addBox(group, w, h * 0.5, d, 0, h * 0.25, 0, def.color, isArchitect);
    addBox(group, w, h * 0.35, d * 0.15, 0, h * 0.575, -d * 0.425, def.accent, isArchitect);
    addBox(group, w * 0.12, h * 0.25, d, -w * 0.44, h * 0.375, 0, def.accent, isArchitect);
    addBox(group, w * 0.12, h * 0.25, d, w * 0.44, h * 0.375, 0, def.accent, isArchitect);
  } else if (type === 'bed') {
    addBox(group, w, h * 0.4, d, 0, h * 0.2, 0, def.color, isArchitect);
    addBox(group, w, h * 0.15, d * 0.08, 0, h * 0.475, -d * 0.46, def.accent, isArchitect);
    addBox(group, w * 0.9, h * 0.12, d * 0.85, 0, h * 0.46, 0, '#ffffff', isArchitect);
  } else if (type === 'chair') {
    addBox(group, w, h * 0.05, d, 0, h * 0.45, 0, def.color, isArchitect);
    addBox(group, w, h * 0.5, d * 0.08, 0, h * 0.75, -d * 0.46, def.accent, isArchitect);
    addLegs(group, w, d, h * 0.45, def.accent, isArchitect);
  } else if (type === 'tv') {
    addBox(group, w, h, d, 0, h * 0.5 + 0.5, 0, def.color, isArchitect);
    addBox(group, w * 0.6, 0.05, d * 2, 0, 0.5, 0, '#333', isArchitect);
  } else if (type === 'plant') {
    addCylinder(group, w * 0.35, h * 0.25, def.accent, isArchitect);
    addSphere(group, w * 0.5, h * 0.55, def.color, isArchitect);
  } else if (type === 'kitchen') {
    addBox(group, w, h, d, 0, h * 0.5, 0, def.color, isArchitect);
    addBox(group, w * 0.95, h * 0.05, d * 0.9, 0, h + 0.025, 0, def.accent, isArchitect);
  } else {
    addBox(group, w, h, d, 0, h * 0.5, 0, def.color, isArchitect);
  }

  return group;
}

function makeMaterial(color, architect) {
  if (architect) {
    return new THREE.MeshLambertMaterial({
      color: 0x8899aa,
      transparent: true,
      opacity: 0.85,
    });
  }
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.65,
    metalness: 0.05,
  });
}

function addBox(parent, w, h, d, x, y, z, color, architect) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, makeMaterial(color, architect));
  mesh.position.set(x, y, z);
  mesh.castShadow = !architect;
  mesh.receiveShadow = !architect;
  mesh.userData.isFurniturePart = true;
  parent.add(mesh);
}

function addCylinder(parent, radius, height, color, architect) {
  const geo = new THREE.CylinderGeometry(radius, radius * 0.85, height, 12);
  const mesh = new THREE.Mesh(geo, makeMaterial(color, architect));
  mesh.position.y = height * 0.5;
  mesh.castShadow = !architect;
  parent.add(mesh);
}

function addSphere(parent, radius, y, color, architect) {
  const geo = new THREE.SphereGeometry(radius, 12, 10);
  const mesh = new THREE.Mesh(geo, makeMaterial(color, architect));
  mesh.position.y = y;
  mesh.castShadow = !architect;
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
  const type = group.userData.furnitureType;
  const def = FURNITURE_CATALOG[type];
  const architect = mode === 'architect';
  let idx = 0;
  group.traverse((child) => {
    if (child.isMesh) {
      const colors = [def.color, def.accent, '#ffffff', '#333'];
      const color = colors[idx % colors.length];
      child.material.dispose();
      child.material = makeMaterial(color, architect);
      child.castShadow = !architect;
      child.receiveShadow = !architect;
      idx++;
    }
  });
}

export function resetFurnitureIdCounter() {
  furnitureIdCounter = 0;
}
