import * as THREE from 'three';
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

export function getWorldRotationY(obj) {
  const q = new THREE.Quaternion();
  obj.getWorldQuaternion(q);
  const e = new THREE.Euler().setFromQuaternion(q, 'YXZ');
  return e.y;
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

export function getLayoutWrapper(furnitureGroup, groupId) {
  if (!groupId) return null;
  return furnitureGroup.children.find(
    (child) => child.userData.isFurnitureLayoutWrapper
      && child.userData.furnitureGroupId === groupId,
  ) ?? null;
}

export function getGroupMembers(furnitureGroup, groupId) {
  if (!groupId) return [];

  const wrapper = getLayoutWrapper(furnitureGroup, groupId);
  if (wrapper) return [...wrapper.children];

  return furnitureGroup.children.filter((f) => f.userData.furnitureGroupId === groupId);
}

export function getFurnitureById(furnitureGroup, furnitureId) {
  if (!furnitureId) return null;

  for (const child of furnitureGroup.children) {
    if (child.userData.isFurnitureLayoutWrapper) {
      const member = child.children.find((f) => f.userData.furnitureId === furnitureId);
      if (member) return member;
      continue;
    }
    if (child.userData.furnitureId === furnitureId) return child;
  }
  return null;
}

function getBlockedGroupItems(items) {
  return items.filter((obj) => {
    const type = obj.userData.furnitureType;
    return isCarpetType(type)
      || isWallGapType(type)
      || usesWallSnap(type, obj.userData.tvStyle);
  });
}

export function canGroupFurnitureItems(items, { mode = 'layout' } = {}) {
  if (items.length < 2) {
    return { ok: false, reason: 'Vyber aspoň 2 položky (Ctrl+klik)' };
  }

  const blocked = getBlockedGroupItems(items);
  if (blocked.length) {
    return { ok: false, reason: 'Dveře, okna, koberce a nábytek na zdi do skupiny nepatří' };
  }

  if (mode === 'row') {
    const rot = items[0].rotation.y;
    if (!items.every((obj) => rotationsMatch(obj.rotation.y, rot))) {
      return { ok: false, reason: 'Do řady lze seskupit jen položky se stejnou rotací' };
    }
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
    const worldPos = new THREE.Vector3();
    anchor.getWorldPosition(worldPos);
    const memberPos = new THREE.Vector3();
    obj.getWorldPosition(memberPos);
    obj.userData.groupOffsetX = memberPos.x - worldPos.x;
    obj.userData.groupOffsetZ = memberPos.z - worldPos.z;
  }
}

export function pickGroupAnchor(members) {
  if (members.length === 0) return null;
  return [...members].sort((a, b) => {
    const ap = new THREE.Vector3();
    const bp = new THREE.Vector3();
    a.getWorldPosition(ap);
    b.getWorldPosition(bp);
    if (ap.x !== bp.x) return ap.x - bp.x;
    return ap.z - bp.z;
  })[0];
}

export function getGroupCentroid(members) {
  let x = 0;
  let z = 0;
  for (const obj of members) {
    const pos = new THREE.Vector3();
    obj.getWorldPosition(pos);
    x += pos.x;
    z += pos.z;
  }
  return { x: x / members.length, z: z / members.length };
}

function createLayoutWrapper(members, groupId, furnitureGroup) {
  const pivot = getGroupCentroid(members);
  const pivotY = 0;

  const wrapper = new THREE.Group();
  wrapper.position.set(pivot.x, pivotY, pivot.z);
  wrapper.rotation.y = 0;
  wrapper.userData = {
    isFurnitureLayoutWrapper: true,
    furnitureGroupId: groupId,
    groupMode: 'layout',
  };

  for (const obj of members) {
    const worldPos = new THREE.Vector3();
    obj.getWorldPosition(worldPos);
    const worldRot = getWorldRotationY(obj);

    furnitureGroup.remove(obj);
    obj.position.set(worldPos.x - pivot.x, worldPos.y - pivotY, worldPos.z - pivot.z);
    obj.rotation.y = worldRot;
    obj.userData.furnitureGroupId = groupId;
    obj.userData.groupMode = 'layout';
    wrapper.add(obj);
  }

  furnitureGroup.add(wrapper);
  updateGroupOffsets(members, pickGroupAnchor(members));
  return wrapper;
}

export function assignFurnitureGroupLayout(members, groupId, furnitureGroup) {
  return createLayoutWrapper(members, groupId, furnitureGroup);
}

export function assignFurnitureGroup(members, groupId, catalog = FURNITURE_CATALOG, gridSize = GRID_SIZE) {
  const anchor = snapFurnitureRow(members, catalog, gridSize);
  for (const obj of members) {
    obj.userData.furnitureGroupId = groupId;
    obj.userData.groupMode = 'row';
  }
  updateGroupOffsets(members, anchor);
  return anchor;
}

export function assignFurnitureGroupRow(members, groupId, catalog = FURNITURE_CATALOG, gridSize = GRID_SIZE) {
  return assignFurnitureGroup(members, groupId, catalog, gridSize);
}

function disposeWrapperArtifacts(wrapper) {
  if (!wrapper) return;

  const rings = [];
  if (wrapper.userData.selectionRing) {
    rings.push(wrapper.userData.selectionRing);
    delete wrapper.userData.selectionRing;
  }

  for (const child of wrapper.children) {
    if (child.userData?.isSelectionRing) rings.push(child);
  }

  for (const ring of rings) {
    ring.geometry?.dispose();
    ring.material?.dispose();
    wrapper.remove(ring);
  }
}

export function removeOrphanLayoutWrappers(furnitureGroup) {
  for (const child of [...furnitureGroup.children]) {
    if (child.userData?.isSelectionRing) {
      child.geometry?.dispose();
      child.material?.dispose();
      furnitureGroup.remove(child);
      continue;
    }

    if (!child.userData.isFurnitureLayoutWrapper) continue;

    const furnitureChildren = child.children.filter((c) => c.userData?.isFurniture);
    if (furnitureChildren.length === 0) {
      disposeWrapperArtifacts(child);
      furnitureGroup.remove(child);
    }
  }
}

export function dissolveLayoutWrapper(furnitureGroup, groupId) {
  const wrapper = getLayoutWrapper(furnitureGroup, groupId);
  if (!wrapper) return [];

  disposeWrapperArtifacts(wrapper);

  const members = wrapper.children.filter((c) => c.userData?.isFurniture);
  for (const obj of members) {
    const worldPos = new THREE.Vector3();
    obj.getWorldPosition(worldPos);
    const worldRot = getWorldRotationY(obj);

    wrapper.remove(obj);
    furnitureGroup.add(obj);
    obj.position.copy(worldPos);
    obj.rotation.y = worldRot;
  }

  furnitureGroup.remove(wrapper);
  return members;
}

export function clearFurnitureGroup(members, furnitureGroup = null) {
  const groupId = members[0]?.userData.furnitureGroupId;
  if (furnitureGroup && groupId && getLayoutWrapper(furnitureGroup, groupId)) {
    dissolveLayoutWrapper(furnitureGroup, groupId);
  }

  for (const obj of members) {
    delete obj.userData.furnitureGroupId;
    delete obj.userData.groupAnchorId;
    delete obj.userData.groupOffsetX;
    delete obj.userData.groupOffsetZ;
    delete obj.userData.groupMode;
  }
}

export function rotateGroupLayout(members, deltaRad, furnitureGroup) {
  if (members.length === 0) return;

  const groupId = members[0].userData.furnitureGroupId;
  const wrapper = furnitureGroup ? getLayoutWrapper(furnitureGroup, groupId) : null;
  if (wrapper) {
    wrapper.rotation.y = normalizeAngleRad(wrapper.rotation.y + deltaRad);
    updateGroupOffsets(members, pickGroupAnchor(members));
    return;
  }

  const { x: cx, z: cz } = getGroupCentroid(members);
  const cos = Math.cos(deltaRad);
  const sin = Math.sin(deltaRad);

  for (const obj of members) {
    const worldPos = new THREE.Vector3();
    obj.getWorldPosition(worldPos);
    const dx = worldPos.x - cx;
    const dz = worldPos.z - cz;
    worldPos.x = cx + dx * cos - dz * sin;
    worldPos.z = cz + dx * sin + dz * cos;
    obj.position.copy(worldPos);
    obj.rotation.y = normalizeAngleRad(obj.rotation.y + deltaRad);
  }

  updateGroupOffsets(members, pickGroupAnchor(members));
}

export function rebuildLayoutGroups(furnitureGroup) {
  const grouped = new Map();

  for (const child of furnitureGroup.children) {
    if (child.userData.isFurnitureLayoutWrapper) continue;
    const groupId = child.userData.furnitureGroupId;
    const mode = child.userData.groupMode ?? 'layout';
    if (!groupId || mode !== 'layout') continue;
    if (!grouped.has(groupId)) grouped.set(groupId, []);
    grouped.get(groupId).push(child);
  }

  for (const [groupId, members] of grouped) {
    if (members.length >= 2) {
      createLayoutWrapper(members, groupId, furnitureGroup);
    }
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
      clearFurnitureGroup(allMembers, furnitureGroup);
    }
  }
}

export function collectFurnitureStateItems(furnitureGroup) {
  const items = [];

  for (const child of furnitureGroup.children) {
    if (child.userData.isFurnitureLayoutWrapper) {
      for (const member of child.children) {
        const worldPos = new THREE.Vector3();
        member.getWorldPosition(worldPos);
        items.push({
          obj: member,
          x: worldPos.x,
          z: worldPos.z,
          rotation: getWorldRotationY(member),
        });
      }
      continue;
    }

    if (child.userData.isFurniture) {
      items.push({
        obj: child,
        x: child.position.x,
        z: child.position.z,
        rotation: child.rotation.y,
      });
    }
  }

  return items;
}

export function getLayoutWrapperForMember(furnitureGroup, member) {
  const groupId = member?.userData?.furnitureGroupId;
  if (!groupId) return null;
  return getLayoutWrapper(furnitureGroup, groupId);
}
