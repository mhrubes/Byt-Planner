import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GRID_SIZE, WALL_HEIGHT, WALL_THICKNESS, applyOpenDoorGaps } from './apartments.js';
import {
  createFurnitureMesh,
  updateFurnitureMaterials,
  FURNITURE_CATALOG,
  isDoorType,
  applyDoorOpenState,
} from './furniture.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.mode = 'preview';
    this.walls = [];
    this.plotSize = { width: 24, depth: 20 };
    this.apartmentBounds = null;
    this.wallColor = '#f5f5f0';
    this.floorColor = '#c9b896';

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87a8c4);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 200);
    this.camera.position.set(12, 14, 12);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 60;
    this.controls.target.set(5, 0, 4);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.wallsGroup = new THREE.Group();
    this.furnitureGroup = new THREE.Group();
    this.ghostGroup = new THREE.Group();
    this.wallPreviewGroup = new THREE.Group();
    this.gridGroup = new THREE.Group();
    this.floorGroup = new THREE.Group();
    this.placementGhost = null;
    this.raycastPlane = null;
    this.scene.add(
      this.floorGroup,
      this.gridGroup,
      this.wallsGroup,
      this.wallPreviewGroup,
      this.furnitureGroup,
      this.ghostGroup
    );

    this.setupLights();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    window.addEventListener('resize', () => this.onResize());
  }

  setupLights() {
    this.ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(0xfff5e6, 1.1);
    this.sun.position.set(8, 18, 6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 50;
    this.sun.shadow.camera.left = -25;
    this.sun.shadow.camera.right = 25;
    this.sun.shadow.camera.top = 25;
    this.sun.shadow.camera.bottom = -25;
    this.scene.add(this.sun);

    this.fill = new THREE.DirectionalLight(0xb8d4ff, 0.35);
    this.fill.position.set(-6, 8, -4);
    this.scene.add(this.fill);
  }

  setMode(mode) {
    this.mode = mode;
    const isPreview = mode === 'preview';

    this.scene.background.set(isPreview ? 0x87a8c4 : 0x1a1d27);
    this.gridGroup.visible = !isPreview;
    this.ambient.intensity = isPreview ? 0.55 : 0.75;
    this.sun.intensity = isPreview ? 1.1 : 0.6;

    this.rebuildWalls();
    this.rebuildFloor();
    this.furnitureGroup.children.forEach((f) => updateFurnitureMaterials(f, mode));
  }

  setPlotSize(plotSize, apartmentBounds = null) {
    this.plotSize = { ...plotSize };
    this.apartmentBounds = apartmentBounds ? { ...apartmentBounds } : null;
    this.controls.target.set(plotSize.width / 2, 0, plotSize.depth / 2);
    this.rebuildFloor();
    this.rebuildGrid();
    this.rebuildRaycastPlane();
  }

  /** @deprecated alias pro kompatibilitu */
  setFloorSize(width, depth) {
    this.setPlotSize({ width, depth });
  }

  rebuildRaycastPlane() {
    if (this.raycastPlane) {
      this.raycastPlane.geometry.dispose();
      this.raycastPlane.material.dispose();
      this.scene.remove(this.raycastPlane);
    }

    const { width, depth } = this.plotSize;
    const geo = new THREE.PlaneGeometry(width, depth);
    const mat = new THREE.MeshBasicMaterial({ visible: false });
    this.raycastPlane = new THREE.Mesh(geo, mat);
    this.raycastPlane.rotation.x = -Math.PI / 2;
    this.raycastPlane.position.set(width / 2, 0.02, depth / 2);
    this.raycastPlane.userData.isGround = true;
    this.scene.add(this.raycastPlane);
  }

  setWallColor(color) {
    this.wallColor = color;
    if (this.mode === 'preview') this.rebuildWalls();
  }

  setFloorColor(color) {
    this.floorColor = color;
    if (this.mode === 'preview') this.rebuildFloor();
  }

  setWalls(wallSegments) {
    this.walls = wallSegments;
    this.rebuildWalls();
  }

  setWallPreview(start, end) {
    this.clearWallPreview();
    if (!start || !end) return;

    const mesh = this.createWallMesh(
      { x1: start.x, z1: start.z, x2: end.x, z2: end.z },
      false
    );
    if (!mesh) return;

    mesh.traverse((child) => {
      if (!child.isMesh) return;
      child.material = new THREE.MeshBasicMaterial({
        color: 0x5b8def,
        transparent: true,
        opacity: 0.45,
      });
    });
    mesh.userData.isWallPreview = true;
    this.wallPreviewGroup.add(mesh);
  }

  clearWallPreview() {
    while (this.wallPreviewGroup.children.length) {
      const c = this.wallPreviewGroup.children[0];
      c.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      this.wallPreviewGroup.remove(c);
    }
  }

  rebuildGrid() {
    while (this.gridGroup.children.length) {
      const c = this.gridGroup.children[0];
      c.geometry?.dispose();
      c.material?.dispose();
      this.gridGroup.remove(c);
    }

    const { width, depth } = this.plotSize;
    const gridHelper = new THREE.GridHelper(
      Math.max(width, depth),
      Math.max(width, depth),
      0x5b8def,
      0x2a3550
    );
    gridHelper.position.set(width / 2, 0.01, depth / 2);
    this.gridGroup.add(gridHelper);

    const planeGeo = new THREE.PlaneGeometry(width, depth);
    const planeMat = new THREE.MeshBasicMaterial({
      visible: false,
    });
    this.gridPlane = new THREE.Mesh(planeGeo, planeMat);
    this.gridPlane.rotation.x = -Math.PI / 2;
    this.gridPlane.position.set(width / 2, 0, depth / 2);
    this.gridPlane.userData.isGridPlane = true;
    this.gridGroup.add(this.gridPlane);
  }

  rebuildFloor() {
    while (this.floorGroup.children.length) {
      const c = this.floorGroup.children[0];
      c.geometry?.dispose();
      c.material?.dispose();
      this.floorGroup.remove(c);
    }

    const { width, depth } = this.plotSize;
    const isPreview = this.mode === 'preview';

    const plotGeo = new THREE.PlaneGeometry(width, depth);
    const plotMat = isPreview
      ? new THREE.MeshStandardMaterial({
          color: this.apartmentBounds ? '#a89878' : this.floorColor,
          roughness: 0.9,
          metalness: 0.02,
        })
      : new THREE.MeshLambertMaterial({
          color: 0x1e2433,
          transparent: true,
          opacity: 0.95,
        });

    const plotFloor = new THREE.Mesh(plotGeo, plotMat);
    plotFloor.rotation.x = -Math.PI / 2;
    plotFloor.position.set(width / 2, 0, depth / 2);
    plotFloor.receiveShadow = isPreview;
    plotFloor.userData.isFloor = true;
    this.floorGroup.add(plotFloor);

    if (this.apartmentBounds) {
      const b = this.apartmentBounds;
      const aptGeo = new THREE.PlaneGeometry(b.width, b.depth);
      const aptMat = isPreview
        ? new THREE.MeshStandardMaterial({
            color: this.floorColor,
            roughness: 0.85,
            metalness: 0.02,
          })
        : new THREE.MeshLambertMaterial({
            color: 0x2a3142,
            transparent: true,
            opacity: 0.92,
          });

      const aptFloor = new THREE.Mesh(aptGeo, aptMat);
      aptFloor.rotation.x = -Math.PI / 2;
      aptFloor.position.set(
        (b.x + b.width / 2) * GRID_SIZE,
        0.005,
        (b.z + b.depth / 2) * GRID_SIZE
      );
      aptFloor.receiveShadow = isPreview;
      aptFloor.userData.isApartmentFloor = true;
      this.floorGroup.add(aptFloor);

      if (!isPreview) {
        const outline = this.createApartmentOutline(b);
        if (outline) this.floorGroup.add(outline);
      }
    }
  }

  createApartmentOutline(bounds) {
    const x0 = bounds.x * GRID_SIZE;
    const z0 = bounds.z * GRID_SIZE;
    const x1 = (bounds.x + bounds.width) * GRID_SIZE;
    const z1 = (bounds.z + bounds.depth) * GRID_SIZE;
    const y = 0.02;

    const points = [
      new THREE.Vector3(x0, y, z0),
      new THREE.Vector3(x1, y, z0),
      new THREE.Vector3(x1, y, z1),
      new THREE.Vector3(x0, y, z1),
      new THREE.Vector3(x0, y, z0),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineDashedMaterial({
      color: 0x5b8def,
      dashSize: 0.4,
      gapSize: 0.25,
      transparent: true,
      opacity: 0.7,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    return line;
  }

  rebuildWalls() {
    while (this.wallsGroup.children.length) {
      const c = this.wallsGroup.children[0];
      c.geometry?.dispose();
      c.material?.dispose();
      this.wallsGroup.remove(c);
    }

    const isPreview = this.mode === 'preview';

    const openDoors = this.furnitureGroup.children
      .filter((f) => f.userData.doorOpen && isDoorType(f.userData.furnitureType))
      .map((f) => ({
        type: f.userData.furnitureType,
        x: f.position.x / GRID_SIZE,
        z: f.position.z / GRID_SIZE,
        rotation: f.rotation.y,
      }));

    const wallsToRender = applyOpenDoorGaps(
      this.walls,
      openDoors,
      FURNITURE_CATALOG,
      GRID_SIZE
    );

    for (const w of wallsToRender) {
      const mesh = this.createWallMesh(w, isPreview);
      if (mesh) this.wallsGroup.add(mesh);
    }
  }

  refreshWallOpenings() {
    this.rebuildWalls();
  }

  createWallMesh(w, isPreview) {
    const dx = w.x2 - w.x1;
    const dz = w.z2 - w.z1;
    const length = Math.sqrt(dx * dx + dz * dz) * GRID_SIZE;
    if (length < 0.01) return null;

    const geo = new THREE.BoxGeometry(length, WALL_HEIGHT, WALL_THICKNESS);

    const mat = isPreview
      ? new THREE.MeshStandardMaterial({
          color: this.wallColor,
          roughness: 0.9,
          metalness: 0,
        })
      : new THREE.MeshLambertMaterial({
          color: 0xd4d8e0,
          transparent: true,
          opacity: 0.92,
        });

    const mesh = new THREE.Mesh(geo, mat);
    const cx = ((w.x1 + w.x2) / 2) * GRID_SIZE;
    const cz = ((w.z1 + w.z2) / 2) * GRID_SIZE;
    mesh.position.set(cx, WALL_HEIGHT / 2, cz);
    mesh.rotation.y = -Math.atan2(dz, dx);
    mesh.castShadow = isPreview;
    mesh.receiveShadow = isPreview;

    mesh.userData.isWall = true;
    mesh.userData.wallSegment = { ...w };

    return mesh;
  }

  clearFurniture() {
    while (this.furnitureGroup.children.length) {
      const f = this.furnitureGroup.children[0];
      f.traverse((c) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
      this.furnitureGroup.remove(f);
    }
  }

  addFurniture(type, x, z, rotation = 0, { doorOpen = false } = {}) {
    const mesh = createFurnitureMesh(type, this.mode);
    if (!mesh) return null;
    mesh.position.set(x * GRID_SIZE, 0, z * GRID_SIZE);
    mesh.rotation.y = rotation;
    if (isDoorType(type)) {
      applyDoorOpenState(mesh, doorOpen);
    }
    this.furnitureGroup.add(mesh);
    if (doorOpen && isDoorType(type)) this.refreshWallOpenings();
    return mesh;
  }

  loadDefaultFurniture(items) {
    this.loadFurnitureFromState(items);
  }

  getFurnitureState() {
    return this.furnitureGroup.children.map((f) => {
      const item = {
        type: f.userData.furnitureType,
        x: f.position.x / GRID_SIZE,
        z: f.position.z / GRID_SIZE,
        rotation: f.rotation.y,
      };
      if (isDoorType(item.type)) {
        item.doorOpen = !!f.userData.doorOpen;
      }
      return item;
    });
  }

  loadFurnitureFromState(items) {
    this.clearFurniture();
    for (const item of items) {
      if (!item?.type) continue;
      this.addFurniture(item.type, item.x, item.z, item.rotation ?? 0, {
        doorOpen: item.doorOpen ?? false,
      });
    }
    this.refreshWallOpenings();
  }

  getIntersectables() {
    const list = [];
    this.furnitureGroup.children.forEach((f) => list.push(f));
    if (this.mode === 'architect') {
      this.wallsGroup.children.forEach((w) => list.push(w));
    }
    return list;
  }

  raycast(clientX, clientY, { includeGround = true, exclude = null } = {}) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const targets = this.getIntersectables();
    if (includeGround && this.raycastPlane) targets.unshift(this.raycastPlane);

    const hits = this.raycaster.intersectObjects(targets, true).filter((h) => {
      if (!exclude) return true;
      let obj = h.object;
      while (obj) {
        if (obj === exclude) return false;
        obj = obj.parent;
      }
      return true;
    });

    if (hits.length === 0) return null;

    let obj = hits[0].object;
    while (obj.parent && !obj.userData.isFurniture && !obj.userData.isWall) {
      if (obj.parent.userData?.isFurniture) {
        obj = obj.parent;
        break;
      }
      obj = obj.parent;
    }

    if (obj.userData.isFurniture || obj.parent?.userData?.isFurniture) {
      let furniture = obj.userData.isFurniture ? obj : obj.parent;
      while (furniture.parent && furniture.parent !== this.furnitureGroup) {
        furniture = furniture.parent;
      }
      return { type: 'furniture', object: furniture, point: hits[0].point };
    }

    if (obj.userData.isWall) {
      return { type: 'wall', object: obj, point: hits[0].point };
    }

    if (obj.userData.isGround || obj.userData.isFloor || obj.userData.isGridPlane) {
      return { type: 'ground', point: hits[0].point };
    }

    return { type: 'ground', point: hits[0].point };
  }

  snapToGrid(worldX, worldZ) {
    return {
      x: Math.round(worldX / GRID_SIZE),
      z: Math.round(worldZ / GRID_SIZE),
    };
  }

  setPlacementGhost(type) {
    this.clearPlacementGhost();
    if (!type) return;

    const ghost = createFurnitureMesh(type, 'architect');
    if (!ghost) return;

    const isStructural = FURNITURE_CATALOG[type]?.structural;

    ghost.traverse((child) => {
      if (!child.isMesh) return;
      child.material = child.material.clone();
      child.material.transparent = true;

      if (isStructural && child.userData.keepColor) {
        if (child.userData.isGlass) {
          child.material.opacity = 0.55;
        } else {
          child.material.opacity = 0.72;
          child.material.emissive?.set?.(child.userData.emissive ?? child.material.color);
          child.material.emissiveIntensity = 0.25;
        }
      } else {
        child.material.opacity = 0.55;
        child.material.color.set(0xf59e0b);
        child.material.emissive?.set?.(0xf59e0b);
        child.material.emissiveIntensity = 0.15;
      }

      child.castShadow = false;
      child.receiveShadow = false;
    });

    ghost.userData.isGhost = true;
    ghost.visible = false;
    this.placementGhost = ghost;
    this.ghostGroup.add(ghost);
  }

  updatePlacementGhost(gridX, gridZ) {
    if (!this.placementGhost) return;
    this.placementGhost.visible = true;
    this.placementGhost.position.set(gridX * GRID_SIZE, 0, gridZ * GRID_SIZE);
  }

  hidePlacementGhost() {
    if (this.placementGhost) this.placementGhost.visible = false;
  }

  clearPlacementGhost() {
    if (!this.placementGhost) return;
    this.placementGhost.traverse((c) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
    this.ghostGroup.remove(this.placementGhost);
    this.placementGhost = null;
  }

  getGroundGridPosition(clientX, clientY) {
    const hit = this.raycast(clientX, clientY, { includeGround: true });
    if (!hit?.point) return null;
    return this.snapToGrid(hit.point.x, hit.point.z);
  }

  setCameraView(view) {
    const { width, depth } = this.plotSize;
    const cx = (width * GRID_SIZE) / 2;
    const cz = (depth * GRID_SIZE) / 2;
    const dist = Math.max(width, depth) * GRID_SIZE * 1.2;

    this.controls.target.set(cx, 0, cz);

    switch (view) {
      case 'top':
        this.camera.position.set(cx, dist, cz + 0.01);
        break;
      case 'front':
        this.camera.position.set(cx, dist * 0.5, cz + dist);
        break;
      case 'side':
        this.camera.position.set(cx + dist, dist * 0.5, cz);
        break;
      case 'iso':
        this.camera.position.set(cx + dist * 0.8, dist * 0.7, cz + dist * 0.8);
        break;
      default:
        break;
    }
    this.controls.update();
  }

  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.dispose();
  }
}
