import { GRID_SIZE, normalizeAngleRad } from './apartments.js';
import {
  FURNITURE_CATALOG,
  isCarpetType,
  isWallGapType,
  usesWallSnap,
} from './furniture.js';

const ROT_EPS = 0.02;

let groupIdCounter = 0;

export function nextGroupId() {
  return `grp-${++groupIdCounter}`;
}

export function syncGroupIdCounterFromState(items = []) {
  let max = groupIdCounter;
  for (const item of items) {
    const id = item.furnitureGroupId;
    if (typeof id === 'string' && id.startsWith('grp-')) {
      const n = parseInt(id.slice(4), 10);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
  }
  groupIdCounter = max;
}

export function resetGroupIdCounter() {
  groupIdCounter = 0;
}

export function getFurnitureWidthMeters(obj, catalog = FURNITURE_CATALOG, gridSize = GRID_SIZE) {
  const type = obj.userData.furnitureType;
  const def = catalog[type];
  if (!def) return gridSize;
  let w = def.size.w;
  if (isCarpetType(type)) {
    w = obj.userData.sizeW ?? w;
  }
  return w * gridSize;
}

export function getChainDirection(rotationY) {
  const r = normalizeAngleRad(rotationY);
  return {
    dirX: Math.cos(r),
    dirZ: -Math.sin(r),
    perpX: Math.sin(r),
    perpZ: Math.cos(r),
  };
}

function projectAlongDir(x, z, dirX, dirZ) {
  return x * dirX + z * dirZ;
}

function positionFromChain(t, perp, { dirX, dirZ, perpX, perpZ }) {
  return {
    x: t * dirX + perp * perpX,
    z: t * dirZ + perp * perpZ,
  };
}

export function rotationsMatch(a, b, eps = ROT_EPS) {
  const na = normalizeAngleRad(a);
  const nb = normalizeAngleRad(b);
  let diff = Math.abs(na - nb) % (Math.PI * 2);
  if (diff > Math.PI) diff = Math.PI * 2 - diff;
  return diff < eps;
}

export function getGroupMembers(furnitureGroup, groupId) {
  if (!groupId) return [];
  return furnitureGroup.children.filter((f) => f.userData.furnitureGroupId === groupId);
}

export function getFurnitureById(furnitureGroup, furnitureId) {
  if (!furnitureId) return null;
  return furnitureGroup.children.find((f) => f.userData.furnitureId === furnitureId) ?? null;
}

export function canGroupFurnitureItems(items) {
  if (items.length < 2) {
    return { ok: false, reason: 'Vyber aspoň 2 položky (Ctrl+klik)' };
  }

  const blocked = items.filter((obj) => {
    const type = obj.userData.furnitureType;
    return isCarpetType(type)
      || isWallGapType(type)
      || usesWallSnap(type, obj.userData.tvStyle);
  });
  if (blocked.length) {
    return { ok: false, reason: 'Dveře, okna, koberce a nábytek na zdi do skupiny nepatří' };
  }

  const rot = items[0].rotation.y;
  if (!items.every((obj) => rotationsMatch(obj.rotation.y, rot))) {
    return { ok: false, reason: 'Všechny položky musí mít stejnou rotaci' };
  }

  return { ok: true };
}

export function snapFurnitureRow(members, catalog = FURNITURE_CATALOG, gridSize = GRID_SIZE) {
  if (members.length === 0) return null;
  if (members.length === 1) return members[0];

  const chain = getChainDirection(members[0].rotation.y);
  const sorted = [...members].sort((a, b) => {
    const ta = projectAlongDir(a.position.x, a.position.z, chain.dirX, chain.dirZ);
    const tb = projectAlongDir(b.position.x, b.position.z, chain.dirX, chain.dirZ);
    return ta - tb;
  });

  let perpSum = 0;
  for (const obj of sorted) {
    perpSum += projectAlongDir(obj.position.x, obj.position.z, chain.perpX, chain.perpZ);
  }
  const perp = perpSum / sorted.length;

  const firstHalf = getFurnitureWidthMeters(sorted[0], catalog, gridSize) / 2;
  const firstCenter = projectAlongDir(sorted[0].position.x, sorted[0].position.z, chain.dirX, chain.dirZ);
  let edge = firstCenter - firstHalf;

  for (const obj of sorted) {
    const half = getFurnitureWidthMeters(obj, catalog, gridSize) / 2;
    const centerT = edge + half;
    edge = centerT + half;
    const pos = positionFromChain(centerT, perp, chain);
    obj.position.set(pos.x, obj.position.y, pos.z);
  }

  return sorted[0];
}

export function updateGroupOffsets(members, anchor) {
  if (!anchor) return;
  const anchorId = anchor.userData.furnitureId;
  for (const obj of members) {
    obj.userData.groupAnchorId = anchorId;
    obj.userData.groupOffsetX = obj.position.x - anchor.position.x;
    obj.userData.groupOffsetZ = obj.position.z - anchor.position.z;
  }
}

export function assignFurnitureGroup(members, groupId, catalog = FURNITURE_CATALOG, gridSize = GRID_SIZE) {
  const anchor = snapFurnitureRow(members, catalog, gridSize);
  for (const obj of members) {
    obj.userData.furnitureGroupId = groupId;
  }
  updateGroupOffsets(members, anchor);
  return anchor;
}

export function clearFurnitureGroup(members) {
  for (const obj of members) {
    delete obj.userData.furnitureGroupId;
    delete obj.userData.groupAnchorId;
    delete obj.userData.groupOffsetX;
    delete obj.userData.groupOffsetZ;
  }
}

export function dissolvePartialGroups(furnitureGroup, affectedItems) {
  const touchedGroupIds = new Set(
    affectedItems.map((obj) => obj.userData.furnitureGroupId).filter(Boolean),
  );

  for (const groupId of touchedGroupIds) {
    const allMembers = getGroupMembers(furnitureGroup, groupId);
    const remaining = allMembers.filter((obj) => !affectedItems.includes(obj));
    if (remaining.length > 0 && remaining.length < allMembers.length) {
      clearFurnitureGroup(allMembers);
    }
  }
}

export function applyGroupOffsetsFromAnchor(furnitureGroup, groupId) {
  const members = getGroupMembers(furnitureGroup, groupId);
  if (members.length < 2) return;

  const anchorId = members[0].userData.groupAnchorId;
  const anchor = getFurnitureById(furnitureGroup, anchorId) ?? members[0];

  for (const obj of members) {
    if (obj === anchor) continue;
    const ox = obj.userData.groupOffsetX ?? 0;
    const oz = obj.userData.groupOffsetZ ?? 0;
    obj.position.set(
      anchor.position.x + ox,
      obj.position.y,
      anchor.position.z + oz,
    );
  }
}
