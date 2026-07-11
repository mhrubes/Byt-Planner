import * as THREE from 'three';
import {
  APARTMENT_TEMPLATES,
  cloneWalls,
  normalizeWall,
  wallKey,
  GRID_SIZE,
  getPlotLayout,
  shiftWallsToPlot,
  shiftFurnitureToPlot,
} from './apartments.js';
import { FURNITURE_CATALOG } from './furniture.js';
import { SceneManager } from './scene.js';

export class BytPlannerApp {
  constructor(rootEl) {
    this.root = rootEl;
    this.currentApartment = '2+kk';
    this.mode = 'preview';
    this.tool = 'select';
    this.walls = [];
    this.wallStart = null;
    this.draggedFurniture = null;
    this.selectedFurniture = null;
    this.isDragging = false;
    this.placingType = null;

    this.renderUI();
    this.initScene();
    this.loadApartment('2+kk');
    this.bindEvents();
  }

  renderUI() {
    this.root.innerHTML = `
      <div id="canvas-container"></div>
      <div class="ui-overlay">
        <header class="top-bar">
          <div class="brand">
            <div class="brand-icon">🏠</div>
            <div>
              <h1>Byt Planner</h1>
              <p>Plánuj, zařizuj, prohlížej</p>
            </div>
          </div>
          <div class="mode-switch">
            <button class="mode-btn architect" data-mode="architect">🔧 Režim architekta</button>
            <button class="mode-btn preview active" data-mode="preview">👁️ Náhled</button>
          </div>
        </header>

        <aside class="side-panel" id="left-panel">
          <section class="panel-section">
            <h3>Typ bytu</h3>
            <div class="apartment-grid" id="apartment-btns"></div>
          </section>

          <section class="panel-section architect-only">
            <h3>Nástroje</h3>
            <div class="tool-row">
              <button class="tool-btn active" data-tool="select">✋ Vybrat</button>
              <button class="tool-btn" data-tool="wall">🧱 Zeď</button>
              <button class="tool-btn" data-tool="eraser">🗑️ Smazat zeď</button>
            </div>
          </section>

          <section class="panel-section architect-only">
            <h3>Nábytek — klikni pro umístění</h3>
            <div class="furniture-list" id="furniture-list"></div>
          </section>

          <section class="panel-section preview-only">
            <h3>Barva stěn</h3>
            <div class="color-picker-row" id="wall-colors"></div>
          </section>

          <section class="panel-section preview-only">
            <h3>Barva podlahy</h3>
            <div class="color-picker-row" id="floor-colors"></div>
          </section>

          <div class="hint-box architect-only" id="architect-hints">
            <strong>Režim architekta</strong>
            Klikni na nábytek a táhni. <kbd>R</kbd> otočí. <kbd>Del</kbd> smaže.<br />
            Nástroj Zeď: klikni start → konec na mřížce (vodorovně/svisle).<br />
            Modrá čára = stávající byt. Mimo ni můžeš stavět dál.
          </div>
        </aside>

        <aside class="side-panel right">
          <section class="panel-section">
            <h3>Pohled kamery</h3>
            <div class="view-buttons">
              <button class="view-btn" data-view="iso">🔄 3D</button>
              <button class="view-btn" data-view="top">⬇️ Shora</button>
              <button class="view-btn" data-view="front">↗️ Zepředu</button>
              <button class="view-btn" data-view="side">↖️ Zboku</button>
            </div>
          </section>
          <section class="panel-section">
            <h3>Ovládání</h3>
            <div class="hint-box">
              <strong>Myš</strong>
              Levé tlačítko — otáčení<br />
              Kolečko — přiblížení<br />
              Pravé tlačítko — posun
            </div>
          </section>
        </aside>

        <div class="status-bar" id="status-bar">
          <span class="mode-label preview">Náhled</span> · 2+kk · Táhni myší pro otáčení
        </div>
      </div>
    `;

    this.canvasContainer = this.root.querySelector('#canvas-container');
    this.statusBar = this.root.querySelector('#status-bar');

    const aptBtns = this.root.querySelector('#apartment-btns');
    for (const key of Object.keys(APARTMENT_TEMPLATES)) {
      const btn = document.createElement('button');
      btn.className = 'apartment-btn' + (key === '2+kk' ? ' active' : '');
      btn.dataset.apartment = key;
      btn.textContent = key;
      btn.title = APARTMENT_TEMPLATES[key].description;
      aptBtns.appendChild(btn);
    }

    const furnList = this.root.querySelector('#furniture-list');
    for (const [type, def] of Object.entries(FURNITURE_CATALOG)) {
      const el = document.createElement('div');
      el.className = 'furniture-item';
      el.dataset.type = type;
      el.innerHTML = `<div class="furniture-icon">${def.icon}</div><span>${def.label}</span>`;
      furnList.appendChild(el);
    }

    const wallColors = ['#f5f5f0', '#e8dcc8', '#d4e8f0', '#f0e8d4', '#e0d4f0', '#ffffff'];
    const floorColors = ['#c9b896', '#b8956a', '#8b7355', '#d4c4a8', '#a08060', '#e8dcc8'];

    this.renderColorSwatches('#wall-colors', wallColors, (c) => {
      this.scene.setWallColor(c);
    });
    this.renderColorSwatches('#floor-colors', floorColors, (c) => {
      this.scene.setFloorColor(c);
    }, 0);
  }

  renderColorSwatches(selector, colors, onPick, activeIdx = 0) {
    const container = this.root.querySelector(selector);
    colors.forEach((color, i) => {
      const swatch = document.createElement('button');
      swatch.className = 'color-swatch' + (i === activeIdx ? ' active' : '');
      swatch.style.background = color;
      swatch.dataset.color = color;
      swatch.addEventListener('click', () => {
        container.querySelectorAll('.color-swatch').forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        onPick(color);
      });
      container.appendChild(swatch);
    });
  }

  initScene() {
    this.scene = new SceneManager(this.canvasContainer);
  }

  loadApartment(key) {
    const tpl = APARTMENT_TEMPLATES[key];
    if (!tpl) return;

    this.currentApartment = key;
    this.wallStart = null;

    const layout = getPlotLayout(tpl.floorSize);
    this.plotLayout = layout;
    this.walls = shiftWallsToPlot(cloneWalls(tpl.walls), layout.offset);

    this.scene.setPlotSize(layout.plotSize, layout.apartmentBounds);
    this.scene.setWalls(this.walls);
    this.scene.loadDefaultFurniture(
      shiftFurnitureToPlot(tpl.defaultFurniture, layout.offset)
    );
    this.scene.setMode(this.mode);
    this.scene.setCameraView('iso');

    this.root.querySelectorAll('.apartment-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.apartment === key);
    });

    this.updateStatus();
  }

  setMode(mode) {
    this.mode = mode;
    this.tool = 'select';
    this.placingType = null;
    this.wallStart = null;
    this.clearSelection();

    this.root.querySelectorAll('.mode-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    this.root.querySelectorAll('.architect-only').forEach((el) => {
      el.classList.toggle('hidden', mode !== 'architect');
    });
    this.root.querySelectorAll('.preview-only').forEach((el) => {
      el.classList.toggle('hidden', mode !== 'preview');
    });

    this.root.querySelectorAll('.tool-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === 'select');
    });

    this.scene.setMode(mode);
    this.scene.controls.enabled = true;
    this.updateStatus();
  }

  setTool(tool) {
    this.tool = tool;
    this.placingType = null;
    this.wallStart = null;

    this.root.querySelectorAll('.tool-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
    this.updateStatus();
  }

  updateStatus() {
    const modeLabel = this.mode === 'architect' ? 'Architekt' : 'Náhled';
    const modeClass = this.mode;
    let extra = '';

    if (this.mode === 'architect') {
      if (this.placingType) {
        extra = ` · Umisťuješ: ${FURNITURE_CATALOG[this.placingType].label}`;
      } else if (this.tool === 'wall') {
        extra = this.wallStart ? ' · Klikni konec zdi' : ' · Klikni začátek zdi';
      } else if (this.tool === 'eraser') {
        extra = ' · Klikni na zeď ke smazání';
      }
    }

    this.statusBar.innerHTML = `
      <span class="mode-label ${modeClass}">${modeLabel}</span>
      · ${this.currentApartment}${extra}
      · Táhni myší pro otáčení
    `;
  }

  bindEvents() {
    this.root.querySelectorAll('.mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.setMode(btn.dataset.mode));
    });

    this.root.querySelectorAll('.apartment-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.loadApartment(btn.dataset.apartment));
    });

    this.root.querySelectorAll('.tool-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.setTool(btn.dataset.tool));
    });

    this.root.querySelectorAll('.view-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.scene.setCameraView(btn.dataset.view));
    });

    this.root.querySelectorAll('.furniture-item').forEach((el) => {
      el.addEventListener('click', () => {
        if (this.mode !== 'architect') return;
        this.placingType = el.dataset.type;
        this.setTool('select');
        this.updateStatus();
      });
    });

    const canvas = () => this.scene.renderer.domElement;

    canvas().addEventListener('pointerdown', (e) => this.onPointerDown(e));
    canvas().addEventListener('pointermove', (e) => this.onPointerMove(e));
    canvas().addEventListener('pointerup', (e) => this.onPointerUp(e));
    canvas().addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  onPointerDown(e) {
    if (e.button !== 0) return;

    const hit = this.scene.raycast(e.clientX, e.clientY);

    if (this.mode === 'architect') {
      if (this.placingType) {
        this.placeFurnitureAt(hit, e);
        return;
      }

      if (this.tool === 'wall') {
        this.handleWallTool(hit);
        return;
      }

      if (this.tool === 'eraser' && hit?.type === 'wall') {
        this.removeWall(hit.object.userData.wallSegment);
        return;
      }

      if (this.tool === 'select' && hit?.type === 'furniture') {
        this.selectFurniture(hit.object);
        this.isDragging = true;
        this.scene.controls.enabled = false;
        return;
      }
    }
  }

  onPointerMove(e) {
    if (!this.isDragging || !this.selectedFurniture) return;

    const hit = this.scene.raycast(e.clientX, e.clientY, {
      includeGround: true,
      exclude: this.selectedFurniture,
    });
    if (!hit?.point) return;

    const snapped = this.scene.snapToGrid(hit.point.x, hit.point.z);
    this.selectedFurniture.position.set(
      snapped.x * GRID_SIZE,
      0,
      snapped.z * GRID_SIZE
    );
  }

  onPointerUp(e) {
    if (e.button !== 0) return;
    this.isDragging = false;
    this.scene.controls.enabled = true;
  }

  placeFurnitureAt(hit, e) {
    let x, z;
    if (hit?.point) {
      const snapped = this.scene.snapToGrid(hit.point.x, hit.point.z);
      x = snapped.x;
      z = snapped.z;
    } else {
      const plot = this.plotLayout?.plotSize ?? { width: 12, depth: 10 };
      x = plot.width / 2;
      z = plot.depth / 2;
    }

    const furn = this.scene.addFurniture(this.placingType, x, z);
    if (furn) this.selectFurniture(furn);
    this.placingType = null;
    this.updateStatus();
  }

  handleWallTool(hit) {
    if (!hit?.point) return;

    const snapped = this.scene.snapToGrid(hit.point.x, hit.point.z);

    if (!this.wallStart) {
      this.wallStart = snapped;
      this.updateStatus();
      return;
    }

    const wall = normalizeWall({
      x1: this.wallStart.x,
      z1: this.wallStart.z,
      x2: snapped.x,
      z2: snapped.z,
    });

    if (wall.x1 === wall.x2 && wall.z1 === wall.z2) {
      this.wallStart = null;
      this.updateStatus();
      return;
    }

    if (wall.x1 !== wall.x2 && wall.z1 !== wall.z2) {
      this.wallStart = snapped;
      this.updateStatus();
      return;
    }

    const key = wallKey(wall);
    if (!this.walls.some((w) => wallKey(w) === key)) {
      this.walls.push(wall);
      this.scene.setWalls(this.walls);
    }

    this.wallStart = null;
    this.updateStatus();
  }

  removeWall(segment) {
    const key = wallKey(segment);
    this.walls = this.walls.filter((w) => wallKey(w) !== key);
    this.scene.setWalls(this.walls);
  }

  selectFurniture(obj) {
    this.clearSelectionHighlight();
    this.selectedFurniture = obj;
    if (!obj.userData.selectionRing) {
      const ringGeo = new THREE.RingGeometry(0.55, 0.65, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x5b8def,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.03;
      ring.userData.isSelectionRing = true;
      obj.add(ring);
      obj.userData.selectionRing = ring;
    }
    obj.userData.selectionRing.visible = true;
  }

  clearSelectionHighlight() {
    if (this.selectedFurniture?.userData.selectionRing) {
      this.selectedFurniture.userData.selectionRing.visible = false;
    }
    this.selectedFurniture = null;
  }

  clearSelection() {
    this.clearSelectionHighlight();
  }

  deleteSelected() {
    if (!this.selectedFurniture || this.mode !== 'architect') return;
    this.selectedFurniture.traverse((c) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
    this.scene.furnitureGroup.remove(this.selectedFurniture);
    this.selectedFurniture = null;
    this.updateStatus();
  }

  rotateSelected() {
    if (!this.selectedFurniture || this.mode !== 'architect') return;
    this.selectedFurniture.rotation.y += Math.PI / 2;
  }

  onKeyDown(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.deleteSelected();
    }
    if (e.key === 'r' || e.key === 'R') {
      this.rotateSelected();
    }
    if (e.key === 'Escape') {
      this.placingType = null;
      this.wallStart = null;
      this.clearSelection();
      this.updateStatus();
    }
  }
}
