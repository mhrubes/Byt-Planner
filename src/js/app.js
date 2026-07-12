import * as THREE from 'three';
import {
  APARTMENT_TEMPLATES,
  cloneWalls,
  normalizeWall,
  snapWallEndpoint,
  wallKey,
  carpetRectFromGrid,
  FURNITURE_GRID_SUBDIVISIONS,
  GRID_SIZE,
  getPlotLayout,
  shiftWallsToPlot,
  shiftFurnitureToPlot,
} from './apartments.js';
import { FURNITURE_CATALOG, CATALOG_CATEGORIES, isDoorType, isWallGapType, isOpenableType, isShelfCabinetType, isCarpetType, CARPET_SHAPES, CARPET_STYLE_DEFAULTS, getCarpetPatternsForType, rebuildCarpetGroup, applyDoorOpenState, getFurnitureMountOffset } from './furniture.js';
import { SceneManager } from './scene.js';
import { loadSave, writeSave, clearSave } from './storage.js';

export class BytPlannerApp {
  constructor(rootEl) {
    this.root = rootEl;
    this.currentApartment = null;
    this.mode = 'preview';
    this.tool = 'select';
    this.walls = [];
    this.wallStart = null;
    this.draggedFurniture = null;
    this.selectedFurniture = null;
    this.isDragging = false;
    this.isPlacingDrag = false;
    this.placingType = null;
    this.placingGridPos = null;
    this.carpetDragStart = null;
    this.carpetDragEnd = null;
    this.isCarpetDrag = false;
    this.carpetStyleDefaults = structuredClone(CARPET_STYLE_DEFAULTS);
    this.wallSnap45 = false;
    this.furnitureClipboard = null;
    this.cursorFollowFurniture = null;
    this.savedData = loadSave() || { apartments: {} };
    this.saveTimer = null;
    this.saveFlashTimer = null;
    this.copyFlashTimer = null;
    this.leftPanelCollapsed = this.savedData.ui?.leftPanelCollapsed ?? false;

    this.renderUI();
    this.initScene();
    this.restoreSession();
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

        <div class="left-panel-shell" id="left-panel-shell">
          <aside class="side-panel left" id="left-panel">
          <section class="panel-section">
            <h3>Typ bytu</h3>
            <div class="apartment-grid" id="apartment-btns"></div>
          </section>

          <section class="panel-section">
            <h3>Uložení</h3>
            <div class="save-row">
              <button type="button" class="save-btn" id="save-btn">💾 Uložit</button>
              <button type="button" class="save-btn danger" id="clear-save-btn">🗑️ Smazat uložení</button>
            </div>
            <div class="save-row">
              <button type="button" class="save-btn secondary" id="reset-btn">↺ Reset bytu</button>
            </div>
            <p class="save-hint" id="save-hint">Ulož kliknutím na 💾 Uložit</p>
          </section>

          <section class="panel-section architect-only">
            <h3>Nástroje</h3>
            <div class="tool-row">
              <button class="tool-btn active" data-tool="select">✋ Vybrat</button>
              <button class="tool-btn" data-tool="wall">🧱 Zeď</button>
              <button class="tool-btn" data-tool="eraser">🗑️ Smazat zeď</button>
            </div>
          </section>

          <section class="panel-section architect-only hidden" id="door-options">
            <h3 id="openable-options-title">Dveře a okna</h3>
            <button type="button" class="save-btn" id="door-open-toggle">🚪 Otevřít průchod</button>
            <p class="save-hint" id="door-open-hint">Přepne otevřený průchod ve zdi · klávesa <kbd>O</kbd></p>
          </section>

          <section class="panel-section architect-only hidden" id="carpet-options">
            <h3 id="carpet-options-title">Koberec</h3>
            <p class="save-hint" id="carpet-options-hint">Uprav tvar, vzor a barvy</p>
            <h4 class="carpet-opt-label">Tvar</h4>
            <div class="carpet-option-row" id="carpet-shape-btns"></div>
            <h4 class="carpet-opt-label">Vzor</h4>
            <div class="carpet-option-row" id="carpet-pattern-btns"></div>
            <div class="carpet-color-row">
              <label class="carpet-color-field">
                <span>Hlavní</span>
                <input type="color" id="carpet-color-main" />
              </label>
              <label class="carpet-color-field">
                <span>Doplňková</span>
                <input type="color" id="carpet-color-accent" />
              </label>
            </div>
          </section>

          <section class="panel-section architect-only catalog-section">
            <h3>Katalog — vyber a táhni do plánu</h3>
            <label class="catalog-search">
              <span class="catalog-search-icon" aria-hidden="true">🔍</span>
              <input
                type="search"
                id="catalog-search"
                class="catalog-search-input"
                placeholder="Hledat nábytek, dveře…"
                autocomplete="off"
                spellcheck="false"
              />
            </label>
            <div class="catalog-categories" id="furniture-catalog"></div>
          </section>

          <section class="panel-section preview-only">
            <h3>Barva stěn</h3>
            <div class="color-picker-row" id="wall-colors"></div>
            <div class="color-custom-picker" id="wall-color-custom"></div>
            <p class="save-hint" id="wall-color-hint">Klikni na zeď pro barvení jedné stěny · bez výběru se barví všechny bez vlastní barvy</p>
          </section>

          <section class="panel-section preview-only">
            <h3>Barva podlahy</h3>
            <div class="color-picker-row" id="floor-colors"></div>
            <div class="color-custom-picker" id="floor-color-custom"></div>
          </section>

          <div class="hint-box architect-only" id="architect-hints">
            <strong>Režim architekta</strong>
            Klikni na nábytek a táhni. <kbd>R</kbd> otočí. <kbd>Del</kbd> smaže.<br />
            Nábytek lze umístit na křižovatky mřížky, do středu čtverce i na půlku mezi čarami.<br />
            Nástroj Zeď: klikni start → konec (libovolný úhel).<br />
            Drž <kbd>Shift</kbd> pro úhly po 45°. Modrá čára = stávající byt.
          </div>
          </aside>
          <button
            type="button"
            class="panel-edge-toggle"
            id="left-panel-toggle"
            aria-label="Sbalit levý panel"
            title="Sbalit panel"
          >
            <span class="panel-edge-toggle-icon" aria-hidden="true">‹</span>
          </button>
        </div>

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

        <div class="placement-banner hidden" id="placement-banner">
          <span class="placement-banner-icon" id="placement-banner-icon">🚪</span>
          <div>
            <strong id="placement-banner-title">Táhni do plánu</strong>
            <span id="placement-banner-text">Drž levé tlačítko, přesuň a pusť · <kbd>Esc</kbd> zruší</span>
          </div>
        </div>
      </div>
    `;

    this.canvasContainer = this.root.querySelector('#canvas-container');
    this.statusBar = this.root.querySelector('#status-bar');
    this.placementBanner = this.root.querySelector('#placement-banner');
    this.placementBannerIcon = this.root.querySelector('#placement-banner-icon');
    this.placementBannerTitle = this.root.querySelector('#placement-banner-title');
    this.placementBannerText = this.root.querySelector('#placement-banner-text');
    this.architectHints = this.root.querySelector('#architect-hints');
    this.saveHint = this.root.querySelector('#save-hint');
    this.leftPanelShell = this.root.querySelector('#left-panel-shell');
    this.leftPanelToggle = this.root.querySelector('#left-panel-toggle');
    this.doorOptionsPanel = this.root.querySelector('#door-options');
    this.doorOpenToggle = this.root.querySelector('#door-open-toggle');
    this.openableOptionsTitle = this.root.querySelector('#openable-options-title');
    this.carpetOptionsPanel = this.root.querySelector('#carpet-options');
    this.carpetOptionsTitle = this.root.querySelector('#carpet-options-title');
    this.carpetOptionsHint = this.root.querySelector('#carpet-options-hint');
    this.carpetColorMain = this.root.querySelector('#carpet-color-main');
    this.carpetColorAccent = this.root.querySelector('#carpet-color-accent');
    this.renderCarpetShapeButtons();
    this.applyLeftPanelCollapsed(this.leftPanelCollapsed);

    const aptBtns = this.root.querySelector('#apartment-btns');
    for (const key of Object.keys(APARTMENT_TEMPLATES)) {
      const btn = document.createElement('button');
      btn.className = 'apartment-btn' + (key === '2+kk' ? ' active' : '');
      btn.dataset.apartment = key;
      btn.textContent = APARTMENT_TEMPLATES[key].label;
      btn.title = APARTMENT_TEMPLATES[key].description;
      aptBtns.appendChild(btn);
    }

    this.renderCatalog();

    const wallColors = ['#f5f5f0', '#e8dcc8', '#d4e8f0', '#f0e8d4', '#e0d4f0', '#ffffff'];
    const floorColors = ['#c9b896', '#b8956a', '#8b7355', '#d4c4a8', '#a08060', '#e8dcc8'];

    this.wallColorPicker = this.renderCustomColorPicker('#wall-color-custom', {
      initial: wallColors[0],
      onChange: (c) => this.applyWallColor(c),
    });
    this.floorColorPicker = this.renderCustomColorPicker('#floor-color-custom', {
      initial: floorColors[0],
      onChange: (c) => this.applyFloorColor(c),
    });

    this.renderColorSwatches('#wall-colors', wallColors, (c) => this.applyWallColor(c));
    this.renderColorSwatches('#floor-colors', floorColors, (c) => this.applyFloorColor(c), 0);
  }

  normalizeHex(color) {
    if (!color) return '#000000';
    let hex = String(color).trim().toLowerCase();
    if (!hex.startsWith('#')) hex = `#${hex}`;
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return /^#[0-9a-f]{6}$/.test(hex) ? hex : '#000000';
  }

  hexToRgb(hex) {
    const n = this.normalizeHex(hex).slice(1);
    return {
      r: parseInt(n.slice(0, 2), 16),
      g: parseInt(n.slice(2, 4), 16),
      b: parseInt(n.slice(4, 6), 16),
    };
  }

  rgbToHex(r, g, b) {
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(Number(v) || 0)));
    const to = (v) => clamp(v).toString(16).padStart(2, '0');
    return `#${to(r)}${to(g)}${to(b)}`;
  }

  syncColorSelection(swatchSelector, customPicker, color) {
    const hex = this.normalizeHex(color);
    const container = this.root.querySelector(swatchSelector);
    let matched = false;

    container?.querySelectorAll('.color-swatch').forEach((swatch) => {
      const isMatch = this.normalizeHex(swatch.dataset.color) === hex;
      swatch.classList.toggle('active', isMatch);
      if (isMatch) matched = true;
    });

    if (!matched) {
      container?.querySelectorAll('.color-swatch').forEach((s) => s.classList.remove('active'));
    }

    customPicker?.setValue(hex);
  }

  applyWallColor(color) {
    const hex = this.normalizeHex(color);

    if (this.mode === 'preview' && this.scene.selectedWallKey) {
      this.scene.setWallSegmentColor(this.scene.selectedWallKey, hex);
    } else {
      this.scene.setWallColor(hex);
    }

    this.syncColorSelection('#wall-colors', this.wallColorPicker, hex);
    this.persistColors();
  }

  applyFloorColor(color) {
    const hex = this.normalizeHex(color);
    this.scene.setFloorColor(hex);
    this.syncColorSelection('#floor-colors', this.floorColorPicker, hex);
    this.persistColors();
  }

  persistColors() {
    this.savedData.wallColor = this.scene.wallColor;
    this.savedData.floorColor = this.scene.floorColor;

    if (this.currentApartment) {
      if (!this.savedData.apartments) this.savedData.apartments = {};
      const prev = this.savedData.apartments[this.currentApartment] ?? {};
      this.savedData.apartments[this.currentApartment] = {
        ...prev,
        wallColors: this.scene.getWallColors(),
      };
    }

    writeSave(this.savedData);
  }

  renderCustomColorPicker(containerSel, { initial, onChange }) {
    const container = this.root.querySelector(containerSel);
    if (!container) return null;

    const label = document.createElement('span');
    label.className = 'color-custom-label';
    label.textContent = 'Vlastní RGB';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'color-input-native';
    colorInput.setAttribute('aria-label', 'Výběr barvy');

    const rgbWrap = document.createElement('div');
    rgbWrap.className = 'color-rgb-inputs';

    const fields = {};
    let syncing = false;

    const emit = (hex) => {
      if (syncing) return;
      onChange(hex);
    };

    const setValue = (hex) => {
      syncing = true;
      const normalized = this.normalizeHex(hex);
      colorInput.value = normalized;
      const { r, g, b } = this.hexToRgb(normalized);
      fields.r.value = r;
      fields.g.value = g;
      fields.b.value = b;
      syncing = false;
    };

    colorInput.addEventListener('input', () => emit(colorInput.value));

    for (const ch of ['r', 'g', 'b']) {
      const field = document.createElement('div');
      field.className = 'color-rgb-field';

      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = ch.toUpperCase();

      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '255';
      input.className = 'color-rgb-input';
      input.addEventListener('input', () => {
        emit(this.rgbToHex(fields.r.value, fields.g.value, fields.b.value));
      });

      fields[ch] = input;
      field.append(fieldLabel, input);
      rgbWrap.appendChild(field);
    }

    container.append(label, colorInput, rgbWrap);
    setValue(initial);

    return { setValue, element: container };
  }

  restoreSession() {
    const initialApt = this.savedData.currentApartment || '2+kk';
    this.loadApartment(initialApt);

    if (this.savedData.wallColor) {
      this.applyWallColor(this.savedData.wallColor);
    }
    if (this.savedData.floorColor) {
      this.applyFloorColor(this.savedData.floorColor);
    }
    if (this.savedData.mode && this.savedData.mode !== this.mode) {
      this.setMode(this.savedData.mode);
    }
    this.updateSaveHintDefault();
  }

  renderColorSwatches(selector, colors, onPick, activeIdx = 0) {
    const container = this.root.querySelector(selector);
    colors.forEach((color, i) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'color-swatch' + (i === activeIdx ? ' active' : '');
      swatch.style.background = color;
      swatch.dataset.color = color;
      swatch.setAttribute('aria-label', `Barva ${color}`);
      swatch.addEventListener('click', () => onPick(color));
      container.appendChild(swatch);
    });
  }

  persistCurrentApartment() {
    if (!this.currentApartment) return;

    if (!this.savedData.apartments) this.savedData.apartments = {};
    this.savedData.apartments[this.currentApartment] = {
      walls: cloneWalls(this.walls),
      furniture: this.scene.getFurnitureState(),
      wallColors: this.scene.getWallColors(),
    };
  }

  saveNow({ auto = false, quiet = false } = {}) {
    this.persistCurrentApartment();
    this.savedData.currentApartment = this.currentApartment;
    this.savedData.mode = this.mode;
    this.savedData.wallColor = this.scene.wallColor;
    this.savedData.floorColor = this.scene.floorColor;
    if (!this.savedData.ui) this.savedData.ui = {};
    this.savedData.ui.leftPanelCollapsed = this.leftPanelCollapsed;

    const ok = writeSave(this.savedData);
    if (!quiet) {
      if (ok) {
        this.flashSaveHint(auto ? 'Automaticky uloženo ✓' : 'Uloženo ✓', 'success');
      } else {
        this.flashSaveHint('Uložení selhalo', 'error');
      }
    }
    return ok;
  }

  scheduleSave() {
    if (this.mode !== 'architect') return;

    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveNow({ auto: true }), 500);
    this.flashSaveHint('Ukládám…', 'pending');
  }

  flashSaveHint(text, kind = 'success') {
    if (!this.saveHint) return;
    this.saveHint.textContent = text;
    this.saveHint.dataset.state = kind;

    clearTimeout(this.saveFlashTimer);
    if (kind === 'success' || kind === 'error') {
      this.saveFlashTimer = setTimeout(() => this.updateSaveHintDefault(), 2500);
    }
  }

  updateSaveHintDefault() {
    if (!this.saveHint) return;
    this.saveHint.textContent =
      this.mode === 'architect'
        ? 'V režimu architekta se ukládá automaticky · nebo 💾 Uložit'
        : 'Ulož kliknutím na 💾 Uložit';
    this.saveHint.dataset.state = '';
  }

  applyLeftPanelCollapsed(collapsed) {
    if (!this.leftPanelShell) return;
    this.leftPanelCollapsed = collapsed;
    this.leftPanelShell.classList.toggle('collapsed', collapsed);
    if (this.leftPanelToggle) {
      const label = collapsed ? 'Rozbalit levý panel' : 'Sbalit levý panel';
      this.leftPanelToggle.setAttribute('aria-label', label);
      this.leftPanelToggle.title = collapsed ? 'Rozbalit panel' : 'Sbalit panel';
    }
  }

  toggleLeftPanel() {
    this.applyLeftPanelCollapsed(!this.leftPanelCollapsed);
  }

  clearAllSave() {
    if (
      !confirm(
        'Smazat veškeré uložené plány ze prohlížeče? Všechny byty se vrátí na výchozí stav.'
      )
    ) {
      return;
    }

    clearSave();
    this.savedData = { apartments: {} };
    const apt = this.currentApartment || '2+kk';
    this.loadApartment(apt, { forceTemplate: true });
    this.flashSaveHint('Uložení smazáno', 'success');
  }

  resetCurrentApartment() {
    if (!this.currentApartment) return;
    if (!confirm(`Opravdu resetovat „${this.getApartmentLabel()}“ na výchozí stav?`)) return;

    if (this.savedData.apartments) {
      delete this.savedData.apartments[this.currentApartment];
    }
    this.loadApartment(this.currentApartment, { forceTemplate: true });
    this.flashSaveHint('Byt resetován · ulož kliknutím na 💾', 'success');
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

  normalizeCatalogSearch(text) {
    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '');
  }

  createCatalogItem(type, def, { categories = [] } = {}) {
    const el = document.createElement('div');
    el.className = 'furniture-item' + (categories.length ? ' furniture-item--grouped' : '');
    el.dataset.type = type;

    const categoryHtml = categories.length
      ? `<div class="furniture-item-categories">${categories
          .map((category) => `<span class="furniture-item-category">${category.icon} ${category.label}</span>`)
          .join('')}</div>`
      : '';

    el.title = categories.length
      ? `${def.label} · ${categories.map((category) => category.label).join(', ')}`
      : def.label;

    el.innerHTML = `
      <div class="furniture-icon">${def.icon}</div>
      <span class="furniture-item-label">${def.label}</span>
      ${categoryHtml}
    `;
    return el;
  }

  groupCatalogSearchMatches(matches) {
    const grouped = new Map();

    for (const match of matches) {
      if (!grouped.has(match.type)) {
        grouped.set(match.type, { type: match.type, def: match.def, categoryIds: new Set() });
      }
      grouped.get(match.type).categoryIds.add(match.category.id);
    }

    return [...grouped.values()].map((entry) => ({
      type: entry.type,
      def: entry.def,
      categories: CATALOG_CATEGORIES.filter((category) => entry.categoryIds.has(category.id)),
    }));
  }

  getCatalogSearchMatches(query) {
    const q = this.normalizeCatalogSearch(query.trim());
    if (!q) return null;

    const results = [];
    for (const category of CATALOG_CATEGORIES) {
      for (const type of category.items) {
        const def = FURNITURE_CATALOG[type];
        if (!def) continue;

        const haystack = this.normalizeCatalogSearch(`${def.label} ${category.label}`);
        if (haystack.includes(q)) {
          results.push({ type, def, category });
        }
      }
    }
    return results;
  }

  renderCatalog(searchQuery = '') {
    const container = this.root.querySelector('#furniture-catalog');
    if (!container) return;

    container.innerHTML = '';
    const matches = this.getCatalogSearchMatches(searchQuery);

    if (matches) {
      if (matches.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'catalog-search-empty';
        empty.textContent = `Žádný objekt pro „${searchQuery.trim()}“`;
        container.appendChild(empty);
        return;
      }

      const grouped = this.groupCatalogSearchMatches(matches);

      const header = document.createElement('p');
      header.className = 'catalog-search-meta';
      header.textContent = `${grouped.length} ${grouped.length === 1 ? 'výsledek' : grouped.length < 5 ? 'výsledky' : 'výsledků'}`;
      container.appendChild(header);

      const list = document.createElement('div');
      list.className = 'furniture-list catalog-search-list';
      for (const { type, def, categories } of grouped) {
        list.appendChild(this.createCatalogItem(type, def, { categories }));
      }
      container.appendChild(list);
      return;
    }

    for (const category of CATALOG_CATEGORIES) {
      const details = document.createElement('details');
      details.className = 'catalog-category';
      details.open = category.id === 'structural' || category.id === 'living';

      const summary = document.createElement('summary');
      summary.className = 'catalog-category-title';
      summary.innerHTML = `<span class="catalog-category-icon">${category.icon}</span> ${category.label}`;
      details.appendChild(summary);

      const list = document.createElement('div');
      list.className = 'furniture-list';

      for (const type of category.items) {
        const def = FURNITURE_CATALOG[type];
        if (!def) continue;
        list.appendChild(this.createCatalogItem(type, def));
      }

      details.appendChild(list);
      container.appendChild(details);
    }
  }

  applyCatalogSearch(query) {
    this.catalogSearchQuery = query;
    this.renderCatalog(query);

    if (this.placingType) {
      this.root.querySelectorAll('.furniture-item').forEach((item) => {
        item.classList.toggle('placing', item.dataset.type === this.placingType);
      });
    }
  }

  initScene() {
    this.scene = new SceneManager(this.canvasContainer);
  }

  getApartmentLabel(key = this.currentApartment) {
    return APARTMENT_TEMPLATES[key]?.label ?? key ?? '';
  }

  loadApartment(key, { forceTemplate = false } = {}) {
    const tpl = APARTMENT_TEMPLATES[key];
    if (!tpl) return;

    if (this.currentApartment && this.currentApartment !== key) {
      this.persistCurrentApartment();
    }

    this.currentApartment = key;
    this.wallStart = null;
    this.cancelPlacing();
    this.scene.clearWallPreview();
    this.clearSelection();
    this.clearWallSelection();

    const layout = getPlotLayout(tpl.floorSize);
    this.plotLayout = layout;

    const saved = !forceTemplate ? this.savedData.apartments?.[key] : null;

    this.scene.setPlotSize(
      layout.plotSize,
      tpl.empty ? null : layout.apartmentBounds
    );

    if (saved?.walls?.length) {
      this.walls = cloneWalls(saved.walls);
      this.scene.setWalls(this.walls);
    } else {
      this.walls = shiftWallsToPlot(cloneWalls(tpl.walls), layout.offset);
      this.scene.setWalls(this.walls);
    }

    this.scene.setWallColors(saved?.wallColors ?? {});

    if (saved?.furniture?.length) {
      this.scene.loadFurnitureFromState(saved.furniture);
    } else {
      this.scene.loadDefaultFurniture(
        shiftFurnitureToPlot(tpl.defaultFurniture, layout.offset)
      );
    }

    this.scene.setMode(this.mode);
    this.scene.setCameraView('iso');

    this.root.querySelectorAll('.apartment-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.apartment === key);
    });

    this.updateStatus();
    this.updateWallSelectionUI();
    this.scheduleSave();
  }

  setMode(mode) {
    this.mode = mode;
    this.tool = 'select';
    this.cancelPlacing();
    this.wallStart = null;
    this.cancelCursorFollow(true);
    this.clearSelection();
    this.clearWallSelection();

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
    this.updateSaveHintDefault();
    this.updateDoorOptionsPanel();
    this.updateCarpetOptionsPanel();
    this.updateWallSelectionUI();
  }

  setTool(tool) {
    this.tool = tool;
    this.cancelPlacing();
    this.wallStart = null;
    this.scene.clearWallPreview();

    this.root.querySelectorAll('.tool-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });
    this.updateStatus();
  }

  updateStatus() {
    const modeLabel = this.mode === 'architect' ? 'Architekt' : 'Náhled';
    const modeClass = this.mode;
    let extra = '';
    let statusHint = 'Táhni myší pro otáčení';

    if (this.mode === 'architect') {
      if (this.placingType) {
        const label = FURNITURE_CATALOG[this.placingType].label;
        extra = ` · Umisťuješ: ${label}`;
        if (isCarpetType(this.placingType)) {
          statusHint = this.carpetDragStart
            ? '→ Pusť tlačítko pro velikost koberec'
            : '→ Na podlaze drž a táhni roh na roh';
        } else {
          statusHint = '→ Drž levé tlačítko, táhni a pusť';
        }
      } else if (this.cursorFollowFurniture) {
        extra = ' · Umisťuješ kopii';
        statusHint = '→ Přesuň myší a klikni pro umístění · Esc zruší';
      } else if (this.tool === 'wall') {
        extra = this.wallStart ? ' · Klikni konec zdi' : ' · Klikni začátek zdi';
        statusHint = this.wallStart
          ? `→ Druhý klik ukončí zeď${this.wallSnap45 ? ' · 45°' : ' · libovolný úhel'}`
          : '→ První klik = začátek zdi';
      } else if (this.tool === 'eraser') {
        extra = ' · Klikni na zeď ke smazání';
        statusHint = '→ Klikni na zeď, kterou chceš smazat';
      }
    }

    this.statusBar.innerHTML = `
      <span class="mode-label ${modeClass}">${modeLabel}</span>
      · ${this.getApartmentLabel()}${extra}
      · ${statusHint}
    `;

    this.updatePlacementUI();
  }

  updatePlacementUI() {
    const isPlacing = this.mode === 'architect' && this.placingType;
    const def = isPlacing ? FURNITURE_CATALOG[this.placingType] : null;
    const isDragging = this.isPlacingDrag || this.isCarpetDrag;
    const isCarpet = isPlacing && isCarpetType(this.placingType);

    this.placementBanner.classList.toggle('hidden', !isPlacing || isDragging);
    this.canvasContainer.classList.toggle('placing-mode', isPlacing);
    this.canvasContainer.classList.toggle('placing-drag', isDragging);

    if (isPlacing && def) {
      this.placementBannerIcon.textContent = def.icon;
      this.placementBannerTitle.textContent =
        isDragging ? `Pusť tlačítko — ${def.label}` : `Táhni do plánu — ${def.label}`;
      this.placementBannerText.innerHTML = isCarpet
        ? 'Na podlaze drž levé tlačítko v jednom rohu, táhni na protější roh a pusť · <kbd>Esc</kbd> zruší'
        : 'Drž levé tlačítko na podlaze, přesuň a pusť · <kbd>R</kbd> otočí po umístění · <kbd>Esc</kbd> zruší';
      this.architectHints.innerHTML = isCarpet
        ? `
        <strong>Právě umisťuješ: ${def.label}</strong>
        1. Na podlaze <strong>drž levé tlačítko</strong> v prvním rohu.<br />
        2. Táhni na protější roh — uvidíš modrý náhled velikosti.<br />
        3. <strong>Pusť tlačítko</strong> — koberec se položí.<br />
        <kbd>Esc</kbd> zruší
      `
        : `
        <strong>Právě umisťuješ: ${def.label}</strong>
        1. Na podlaze v plánu <strong>drž levé tlačítko</strong> myši.<br />
        2. Táhni tam, kam to patří — uvidíš oranžový náhled.<br />
        3. <strong>Pusť tlačítko</strong> — položka se umístí.<br />
        Pak <kbd>R</kbd> otočí · <kbd>Esc</kbd> zruší
      `;
    } else {
      this.architectHints.innerHTML = `
        <strong>Režim architekta</strong>
        V katalogu vyber položku → na podlaze drž a táhni myší.<br />
        Vybraný nábytek táhni myší. <kbd>R</kbd> otočí. <kbd>Del</kbd> smaže.<br />
        <kbd>Ctrl+C</kbd> kopíruje · <kbd>Ctrl+V</kbd> vloží kopii k přesunu.<br />
        U dveří: <kbd>O</kbd> otevře/zavře průchod ve zdi.<br />
        Nástroj Zeď: klikni start → konec (libovolný úhel). <kbd>Shift</kbd> = 45°.<br />
        Modrá čára = stávající byt. Mimo ni můžeš stavět dál.
      `;
    }
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

    this.catalogSearchInput = this.root.querySelector('#catalog-search');
    this.catalogSearchInput?.addEventListener('input', (e) => {
      this.applyCatalogSearch(e.target.value);
    });

    this.root.querySelector('#furniture-catalog')?.addEventListener('click', (e) => {
      const el = e.target.closest('.furniture-item');
      if (!el) return;
      if (this.mode !== 'architect') return;
      this.startPlacing(el.dataset.type, el);
    });

    const canvasEl = () => this.scene.renderer.domElement;

    canvasEl().addEventListener('pointerdown', (e) => this.onPointerDown(e));
    canvasEl().addEventListener('pointermove', (e) => this.onPointerMove(e));
    canvasEl().addEventListener('pointerup', (e) => this.onPointerUp(e));
    canvasEl().addEventListener('pointercancel', (e) => this.onPointerUp(e));
    canvasEl().addEventListener('pointerleave', (e) => {
      if (!this.isPlacingDrag) this.scene.hidePlacementGhost();
    });
    canvasEl().addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', (e) => this.onKeyDown(e));

    this.root.querySelector('#save-btn')?.addEventListener('click', () => this.saveNow());
    this.root.querySelector('#clear-save-btn')?.addEventListener('click', () => this.clearAllSave());
    this.root.querySelector('#reset-btn')?.addEventListener('click', () => this.resetCurrentApartment());
    this.leftPanelToggle?.addEventListener('click', () => this.toggleLeftPanel());
    this.doorOpenToggle?.addEventListener('click', () => this.toggleSelectedDoorOpen());
    this.carpetColorMain?.addEventListener('input', () => this.applyCarpetColor('carpetColor', this.carpetColorMain.value));
    this.carpetColorAccent?.addEventListener('input', () => this.applyCarpetColor('carpetAccent', this.carpetColorAccent.value));

    window.addEventListener('beforeunload', () => {
      if (this.mode === 'architect') this.saveNow({ auto: true, quiet: true });
    });
  }

  startPlacing(type, catalogEl = null) {
    this.tool = 'select';
    this.wallStart = null;
    this.placingType = type;
    this.placingGridPos = null;
    this.isPlacingDrag = false;
    this.carpetDragStart = null;
    this.carpetDragEnd = null;
    this.isCarpetDrag = false;
    this.scene.clearCarpetPreview();
    if (isCarpetType(type)) {
      this.scene.clearPlacementGhost();
    } else {
      this.scene.setPlacementGhost(type);
    }

    this.root.querySelectorAll('.furniture-item').forEach((item) => {
      item.classList.toggle('placing', catalogEl ? item === catalogEl : item.dataset.type === type);
    });
    this.root.querySelectorAll('.tool-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tool === 'select');
    });
    this.updateCarpetOptionsPanel();
    this.updateStatus();
  }

  cancelPlacing() {
    this.placingType = null;
    this.placingGridPos = null;
    this.isPlacingDrag = false;
    this.carpetDragStart = null;
    this.carpetDragEnd = null;
    this.isCarpetDrag = false;
    this.scene.clearPlacementGhost();
    this.scene.clearCarpetPreview();
    this.root.querySelectorAll('.furniture-item').forEach((item) => {
      item.classList.remove('placing');
    });
    this.scene.controls.enabled = true;
    this.canvasContainer?.classList.remove('placing-drag');
    this.updateCarpetOptionsPanel();
  }

  updatePlacingGhostFromEvent(e) {
    if (!this.placingType) return;

    const grid = this.scene.getGroundGridPosition(e.clientX, e.clientY);
    if (!grid) {
      if (!this.isPlacingDrag) this.scene.hidePlacementGhost();
      return;
    }

    this.placingGridPos = grid;
    this.scene.updatePlacementGhost(grid.x, grid.z);
  }

  commitCarpetPlacement() {
    if (!this.placingType || !this.carpetDragStart || !this.carpetDragEnd) return;

    const rect = carpetRectFromGrid(this.carpetDragStart, this.carpetDragEnd);
    const type = this.placingType;
    const style = this.carpetStyleDefaults[type] ?? {};
    const furn = this.scene.addFurniture(type, rect.x, rect.z, 0, {
      sizeW: rect.sizeW,
      sizeD: rect.sizeD,
      carpetShape: style.shape,
      carpetPattern: style.pattern,
      carpetColor: style.color,
      carpetAccent: style.accent,
    });
    if (furn) this.selectFurniture(furn);
    this.carpetDragStart = null;
    this.carpetDragEnd = null;
    this.isCarpetDrag = false;
    this.scene.clearCarpetPreview();
    this.cancelPlacing();
    this.updateStatus();
    this.scheduleSave();
  }

  commitPlacement() {
    if (!this.placingType || !this.placingGridPos) return;

    const { x, z } = this.placingGridPos;
    const type = this.placingType;
    const furn = this.scene.addFurniture(type, x, z);
    if (furn) this.selectFurniture(furn);
    this.cancelPlacing();
    this.updateStatus();
    this.scheduleSave();
  }

  onPointerDown(e) {
    if (e.button !== 0) return;

    if (this.cursorFollowFurniture) {
      this.confirmCursorFollow();
      return;
    }

    const hit = this.scene.raycast(e.clientX, e.clientY);

    if (this.mode === 'preview') {
      if (hit?.type === 'wall') {
        this.selectWall(hit.object);
      } else {
        this.clearWallSelection();
      }
      return;
    }

    if (this.mode === 'architect') {
      if (this.placingType) {
        if (isCarpetType(this.placingType)) {
          const hit = this.scene.raycast(e.clientX, e.clientY, { includeGround: true });
          if (hit?.point) {
            const grid = this.scene.snapToGrid(hit.point.x, hit.point.z);
            this.carpetDragStart = grid;
            this.carpetDragEnd = grid;
            this.isCarpetDrag = true;
            this.scene.controls.enabled = false;
            e.target.setPointerCapture(e.pointerId);
            this.scene.setCarpetPreview(
              this.placingType,
              grid,
              grid,
              this.carpetStyleDefaults[this.placingType]
            );
            this.updatePlacementUI();
            this.updateStatus();
          }
          return;
        }

        this.isPlacingDrag = true;
        this.scene.controls.enabled = false;
        e.target.setPointerCapture(e.pointerId);
        this.updatePlacingGhostFromEvent(e);
        this.updatePlacementUI();
        return;
      }

      if (this.tool === 'wall') {
        this.handleWallTool(hit, { shiftKey: e.shiftKey });
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
    if (this.placingType && isCarpetType(this.placingType) && this.isCarpetDrag) {
      const hit = this.scene.raycast(e.clientX, e.clientY, { includeGround: true });
      if (hit?.point) {
        const grid = this.scene.snapToGrid(hit.point.x, hit.point.z);
        this.carpetDragEnd = grid;
        this.scene.setCarpetPreview(
          this.placingType,
          this.carpetDragStart,
          grid,
          this.carpetStyleDefaults[this.placingType]
        );
        this.updateStatus();
      }
      return;
    }

    if (this.placingType) {
      this.updatePlacingGhostFromEvent(e);
    }

    if (this.mode === 'architect' && this.tool === 'wall' && this.wallStart) {
      this.wallSnap45 = e.shiftKey;
      const hit = this.scene.raycast(e.clientX, e.clientY, { includeGround: true });
      if (hit?.point) {
        const grid = this.scene.snapToGrid(hit.point.x, hit.point.z);
        const end = snapWallEndpoint(this.wallStart, grid, { snap45: this.wallSnap45 });
        this.scene.setWallPreview(this.wallStart, end);
        this.updateStatus();
      }
    }

    if (this.cursorFollowFurniture) {
      const hit = this.scene.raycast(e.clientX, e.clientY, {
        includeGround: true,
        exclude: this.cursorFollowFurniture,
      });
      if (hit?.point) {
        const snapped = this.scene.snapFurnitureToGrid(hit.point.x, hit.point.z);
        const yOff = getFurnitureMountOffset(this.cursorFollowFurniture.userData.furnitureType);
        this.cursorFollowFurniture.position.set(
          snapped.x * GRID_SIZE,
          yOff,
          snapped.z * GRID_SIZE
        );
      }
      return;
    }

    if (!this.isDragging || !this.selectedFurniture) return;

    const hit = this.scene.raycast(e.clientX, e.clientY, {
      includeGround: true,
      exclude: this.selectedFurniture,
    });
    if (!hit?.point) return;

    const snapped = this.scene.snapFurnitureToGrid(hit.point.x, hit.point.z);
    const yOff = getFurnitureMountOffset(this.selectedFurniture.userData.furnitureType);
    this.selectedFurniture.position.set(
      snapped.x * GRID_SIZE,
      yOff,
      snapped.z * GRID_SIZE
    );
    if (isWallGapType(this.selectedFurniture.userData.furnitureType)) {
      this.scene.refreshWallOpenings();
    }
  }

  onPointerUp(e) {
    if (e.button !== 0) return;

    if (this.isCarpetDrag) {
      this.isCarpetDrag = false;
      e.target.releasePointerCapture?.(e.pointerId);
      this.scene.controls.enabled = true;
      if (this.carpetDragStart && this.carpetDragEnd) {
        this.commitCarpetPlacement();
      } else {
        this.scene.clearCarpetPreview();
        this.updatePlacementUI();
      }
      return;
    }

    if (this.isPlacingDrag) {
      this.isPlacingDrag = false;
      e.target.releasePointerCapture?.(e.pointerId);
      this.scene.controls.enabled = true;
      if (this.placingGridPos) {
        this.commitPlacement();
      } else {
        this.updatePlacementUI();
      }
      return;
    }

    if (this.isDragging) {
      this.scheduleSave();
    }

    this.isDragging = false;
    if (this.selectedFurniture && isDoorType(this.selectedFurniture.userData.furnitureType) && this.selectedFurniture.userData.doorOpen) {
      this.scene.refreshWallOpenings();
      this.scheduleSave();
    }
    this.scene.controls.enabled = true;
  }

  placeFurnitureAt(hit) {
    let x, z;
    if (hit?.point) {
      const snapped = this.scene.snapFurnitureToGrid(hit.point.x, hit.point.z);
      x = snapped.x;
      z = snapped.z;
    } else {
      const plot = this.plotLayout?.plotSize ?? { width: 12, depth: 10 };
      x = plot.width / 2;
      z = plot.depth / 2;
    }

    const furn = this.scene.addFurniture(this.placingType, x, z);
    if (furn) this.selectFurniture(furn);
    this.cancelPlacing();
    this.updateStatus();
  }

  handleWallTool(hit, { shiftKey = false } = {}) {
    if (!hit?.point) return;

    const grid = this.scene.snapToGrid(hit.point.x, hit.point.z);

    if (!this.wallStart) {
      this.wallStart = grid;
      this.updateStatus();
      return;
    }

    const end = snapWallEndpoint(this.wallStart, grid, { snap45: shiftKey });
    const wall = normalizeWall({
      x1: this.wallStart.x,
      z1: this.wallStart.z,
      x2: end.x,
      z2: end.z,
    });

    if (wall.x1 === wall.x2 && wall.z1 === wall.z2) {
      this.wallStart = null;
      this.scene.clearWallPreview();
      this.updateStatus();
      return;
    }

    const key = wallKey(wall);
    if (!this.walls.some((w) => wallKey(w) === key)) {
      this.walls.push(wall);
      this.scene.setWalls(this.walls);
      this.scheduleSave();
    }

    this.wallStart = null;
    this.scene.clearWallPreview();
    this.updateStatus();
  }

  removeWall(segment) {
    const key = wallKey(segment);
    this.walls = this.walls.filter((w) => wallKey(w) !== key);
    this.scene.setWalls(this.walls);
    this.scheduleSave();
  }

  selectFurniture(obj) {
    this.clearWallSelection();
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
    if (isCarpetType(obj.userData.furnitureType)) {
      const span = Math.max(obj.userData.sizeW ?? 1, obj.userData.sizeD ?? 1);
      const scale = span / 1.2;
      obj.userData.selectionRing.scale.set(scale, scale, 1);
    } else {
      obj.userData.selectionRing.scale.set(1, 1, 1);
    }
    this.updateDoorOptionsPanel();
    this.updateCarpetOptionsPanel();
  }

  getActiveCarpetType() {
    if (this.selectedFurniture && isCarpetType(this.selectedFurniture.userData.furnitureType)) {
      return this.selectedFurniture.userData.furnitureType;
    }
    if (this.placingType && isCarpetType(this.placingType)) {
      return this.placingType;
    }
    return null;
  }

  getActiveCarpetStyle() {
    const type = this.getActiveCarpetType();
    if (!type) return null;
    if (this.selectedFurniture && isCarpetType(this.selectedFurniture.userData.furnitureType)) {
      const ud = this.selectedFurniture.userData;
      return {
        shape: ud.carpetShape,
        pattern: ud.carpetPattern,
        color: ud.carpetColor,
        accent: ud.carpetAccent,
      };
    }
    return this.carpetStyleDefaults[type];
  }

  renderCarpetShapeButtons() {
    const row = this.root.querySelector('#carpet-shape-btns');
    if (!row) return;
    row.innerHTML = '';
    for (const [id, meta] of Object.entries(CARPET_SHAPES)) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carpet-opt-btn';
      btn.dataset.shape = id;
      btn.title = meta.label;
      btn.textContent = `${meta.icon} ${meta.label}`;
      btn.addEventListener('click', () => this.applyCarpetShape(id));
      row.appendChild(btn);
    }
  }

  renderCarpetPatternButtons(type) {
    const row = this.root.querySelector('#carpet-pattern-btns');
    if (!row || !type) return;
    const activePattern = this.getActiveCarpetStyle()?.pattern;
    row.innerHTML = '';
    for (const [id, meta] of getCarpetPatternsForType(type)) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carpet-opt-btn';
      btn.dataset.pattern = id;
      btn.title = meta.label;
      btn.textContent = `${meta.icon} ${meta.label}`;
      btn.classList.toggle('active', id === activePattern);
      btn.addEventListener('click', () => this.applyCarpetPattern(id));
      row.appendChild(btn);
    }
  }

  updateCarpetOptionsPanel() {
    const carpetType = this.getActiveCarpetType();
    const showPanel = this.mode === 'architect' && !!carpetType;
    this.carpetOptionsPanel?.classList.toggle('hidden', !showPanel);
    if (!showPanel) return;

    const style = this.getActiveCarpetStyle();
    const label = FURNITURE_CATALOG[carpetType].label;
    this.carpetOptionsTitle.textContent = label;
    this.carpetOptionsHint.textContent = this.selectedFurniture
      ? 'Upravíš vybraný koberec'
      : 'Nastavíš vzhled před položením';

    this.root.querySelectorAll('[data-shape]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.shape === style.shape);
    });
    this.renderCarpetPatternButtons(carpetType);

    if (this.carpetColorMain) this.carpetColorMain.value = style.color;
    if (this.carpetColorAccent) this.carpetColorAccent.value = style.accent;
  }

  applyCarpetShape(shape) {
    const type = this.getActiveCarpetType();
    if (!type) return;

    if (this.selectedFurniture && isCarpetType(this.selectedFurniture.userData.furnitureType)) {
      this.selectedFurniture.userData.carpetShape = shape;
      rebuildCarpetGroup(this.selectedFurniture, this.mode);
      this.scheduleSave();
    }

    this.carpetStyleDefaults[type].shape = shape;
    this.updateCarpetOptionsPanel();
  }

  applyCarpetPattern(pattern) {
    const type = this.getActiveCarpetType();
    if (!type) return;

    if (this.selectedFurniture && isCarpetType(this.selectedFurniture.userData.furnitureType)) {
      this.selectedFurniture.userData.carpetPattern = pattern;
      rebuildCarpetGroup(this.selectedFurniture, this.mode);
      this.scheduleSave();
    }

    this.carpetStyleDefaults[type].pattern = pattern;
    this.updateCarpetOptionsPanel();
  }

  applyCarpetColor(field, value) {
    const type = this.getActiveCarpetType();
    if (!type) return;

    if (this.selectedFurniture && isCarpetType(this.selectedFurniture.userData.furnitureType)) {
      this.selectedFurniture.userData[field] = value;
      rebuildCarpetGroup(this.selectedFurniture, this.mode);
      this.scheduleSave();
    }

    if (field === 'carpetColor') this.carpetStyleDefaults[type].color = value;
    if (field === 'carpetAccent') this.carpetStyleDefaults[type].accent = value;
  }

  updateDoorOptionsPanel() {
    const item = this.selectedFurniture;
    const isOpenable = item && isOpenableType(item.userData.furnitureType);
    const isDoor = item && isDoorType(item.userData.furnitureType);
    const isWindow = item?.userData.furnitureType === 'window';

    this.doorOptionsPanel?.classList.toggle('hidden', !isOpenable || this.mode !== 'architect');

    if (!isOpenable || !this.doorOpenToggle) return;

    const open = !!item.userData.doorOpen;
    if (isWindow) {
      this.openableOptionsTitle.textContent = 'Okno';
      this.doorOpenToggle.textContent = open ? '🔒 Zavřít okno' : '🪟 Otevřít okno';
      this.root.querySelector('#door-open-hint').textContent =
        'Vyklopí křídlo okna · klávesa O';
    } else if (item.userData.furnitureType === 'wardrobe') {
      this.openableOptionsTitle.textContent = 'Skříň na oblečení';
      this.doorOpenToggle.textContent = open ? '🔒 Zavřít dvířka' : '🗄️ Otevřít dvířka';
      this.root.querySelector('#door-open-hint').textContent =
        'Ukáže nebo skryje oblečení ve skříni · klávesa O';
    } else if (item.userData.furnitureType === 'bath_shelf') {
      this.openableOptionsTitle.textContent = 'Bambusová skříňka';
      this.doorOpenToggle.textContent = open ? '🔒 Zavřít dvířka' : '🗄️ Otevřít dvířka';
      this.root.querySelector('#door-open-hint').textContent =
        'Otevře lamelová dvířka s ručníky uvnitř · klávesa O';
    } else if (item.userData.furnitureType === 'kitchen_oven') {
      this.openableOptionsTitle.textContent = 'Trouba';
      this.doorOpenToggle.textContent = open ? '🔒 Zavřít dvířka' : '🔥 Otevřít dvířka';
      this.root.querySelector('#door-open-hint').textContent =
        'Sklopí dvířka trouby a ukáže plech uvnitř · klávesa O';
    } else if (item.userData.furnitureType === 'kitchen_dishwasher') {
      this.openableOptionsTitle.textContent = 'Myčka';
      this.doorOpenToggle.textContent = open ? '🔒 Zavřít dvířka' : '🫧 Otevřít dvířka';
      this.root.querySelector('#door-open-hint').textContent =
        'Sklopí dvířka myčky a ukáže talíře uvnitř · klávesa O';
    } else if (isShelfCabinetType(item.userData.furnitureType)) {
      this.openableOptionsTitle.textContent = 'Skříňka';
      this.doorOpenToggle.textContent = open ? '🔒 Zavřít dvířka' : '🗄️ Otevřít dvířka';
      this.root.querySelector('#door-open-hint').textContent =
        'Otevře nebo zavře dvířka skříňky · klávesa O';
    } else if (isDoor) {
      this.openableOptionsTitle.textContent = 'Dveře';
      this.doorOpenToggle.textContent = open ? '🔒 Zavřít průchod' : '🚪 Otevřít průchod';
      this.root.querySelector('#door-open-hint').textContent =
        'Přepne otevřený průchod ve zdi · klávesa O';
    } else {
      this.openableOptionsTitle.textContent = 'Balkónové dveře';
      this.doorOpenToggle.textContent = open ? '🔒 Zavřít průchod' : '🚪 Otevřít průchod';
      this.root.querySelector('#door-open-hint').textContent =
        'Přepne otevřený průchod ve zdi · klávesa O';
    }
    this.doorOpenToggle.classList.toggle('active', open);
  }

  toggleSelectedDoorOpen() {
    if (!this.selectedFurniture || this.mode !== 'architect') return;
    if (!isOpenableType(this.selectedFurniture.userData.furnitureType)) return;

    const next = !this.selectedFurniture.userData.doorOpen;
    applyDoorOpenState(this.selectedFurniture, next);
    if (isWallGapType(this.selectedFurniture.userData.furnitureType)) {
      this.scene.refreshWallOpenings();
    }
    this.updateDoorOptionsPanel();
    this.scheduleSave();
  }

  clearSelectionHighlight() {
    if (this.selectedFurniture?.userData.selectionRing) {
      this.selectedFurniture.userData.selectionRing.visible = false;
    }
    this.selectedFurniture = null;
    this.updateDoorOptionsPanel();
    this.updateCarpetOptionsPanel();
  }

  clearSelection() {
    this.clearSelectionHighlight();
  }

  selectWall(wallMesh) {
    const key = this.scene.getWallKeyForSegment(wallMesh.userData.wallSegment);
    this.scene.selectWall(key);
    const color = this.scene.wallColors[key] ?? this.scene.wallColor;
    this.syncColorSelection('#wall-colors', this.wallColorPicker, color);
    this.updateWallSelectionUI();
  }

  clearWallSelection() {
    if (!this.scene.selectedWallKey) {
      this.updateWallSelectionUI();
      return;
    }
    this.scene.clearWallSelection();
    this.syncColorSelection('#wall-colors', this.wallColorPicker, this.scene.wallColor);
    this.updateWallSelectionUI();
  }

  updateWallSelectionUI() {
    const hint = this.root.querySelector('#wall-color-hint');
    if (!hint) return;

    if (this.mode === 'preview' && this.scene.selectedWallKey) {
      hint.textContent = 'Vybraná zeď — barva platí jen pro ni · klikni mimo pro zrušení';
      hint.dataset.state = 'pending';
    } else {
      hint.textContent = 'Klikni na zeď pro barvení jedné stěny · bez výběru se barví všechny bez vlastní barvy';
      hint.dataset.state = '';
    }
  }

  removeFurnitureObject(obj) {
    if (!obj) return;
    const wasWallGap = isWallGapType(obj.userData.furnitureType);
    obj.traverse((c) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
    this.scene.furnitureGroup.remove(obj);
    if (this.cursorFollowFurniture === obj) this.cursorFollowFurniture = null;
    if (this.selectedFurniture === obj) this.selectedFurniture = null;
    if (wasWallGap) this.scene.refreshWallOpenings();
    this.updateDoorOptionsPanel();
    this.updateCarpetOptionsPanel();
  }

  copySelected() {
    if (!this.selectedFurniture || this.mode !== 'architect') return;

    this.furnitureClipboard = {
      type: this.selectedFurniture.userData.furnitureType,
      rotation: this.selectedFurniture.rotation.y,
      doorOpen: this.selectedFurniture.userData.doorOpen ?? false,
    };
    if (isCarpetType(this.furnitureClipboard.type)) {
      this.furnitureClipboard.sizeW = this.selectedFurniture.userData.sizeW;
      this.furnitureClipboard.sizeD = this.selectedFurniture.userData.sizeD;
      this.furnitureClipboard.carpetShape = this.selectedFurniture.userData.carpetShape;
      this.furnitureClipboard.carpetPattern = this.selectedFurniture.userData.carpetPattern;
      this.furnitureClipboard.carpetColor = this.selectedFurniture.userData.carpetColor;
      this.furnitureClipboard.carpetAccent = this.selectedFurniture.userData.carpetAccent;
    }
    this.flashCopyHint('Zkopírováno ✓');
  }

  pasteFromClipboard() {
    if (!this.furnitureClipboard || this.mode !== 'architect') return;

    this.cancelPlacing();
    this.cancelCursorFollow(true);

    let x;
    let z;
    if (this.selectedFurniture) {
      x = this.selectedFurniture.position.x / GRID_SIZE + 1;
      z = this.selectedFurniture.position.z / GRID_SIZE;
    } else {
      const plot = this.plotLayout?.plotSize ?? { width: 12, depth: 10 };
      x = plot.width / 2;
      z = plot.depth / 2;
    }

    const furn = this.scene.addFurniture(
      this.furnitureClipboard.type,
      x,
      z,
      this.furnitureClipboard.rotation,
      {
        doorOpen: this.furnitureClipboard.doorOpen ?? false,
        sizeW: this.furnitureClipboard.sizeW,
        sizeD: this.furnitureClipboard.sizeD,
        carpetShape: this.furnitureClipboard.carpetShape,
        carpetPattern: this.furnitureClipboard.carpetPattern,
        carpetColor: this.furnitureClipboard.carpetColor,
        carpetAccent: this.furnitureClipboard.carpetAccent,
      }
    );
    if (!furn) return;

    this.selectFurniture(furn);
    this.cursorFollowFurniture = furn;
    this.scene.controls.enabled = false;
    this.canvasContainer?.classList.add('placing-mode');
    this.updateStatus();
  }

  confirmCursorFollow() {
    if (!this.cursorFollowFurniture) return;
    this.cursorFollowFurniture = null;
    this.scene.controls.enabled = true;
    this.canvasContainer?.classList.remove('placing-mode');
    this.scheduleSave();
    this.updateStatus();
  }

  cancelCursorFollow(removeObject = true) {
    if (!this.cursorFollowFurniture) return;
    const obj = this.cursorFollowFurniture;
    this.cursorFollowFurniture = null;
    this.scene.controls.enabled = true;
    this.canvasContainer?.classList.remove('placing-mode');
    if (removeObject) this.removeFurnitureObject(obj);
    else this.clearSelectionHighlight();
  }

  flashCopyHint(text) {
    const prev = this.statusBar?.innerHTML;
    if (!this.statusBar) return;
    this.statusBar.innerHTML = `<span class="mode-label architect">${text}</span> · Ctrl+V pro vložení`;
    clearTimeout(this.copyFlashTimer);
    this.copyFlashTimer = setTimeout(() => this.updateStatus(), 1800);
  }

  deleteSelected() {
    if (!this.selectedFurniture || this.mode !== 'architect') return;
    this.removeFurnitureObject(this.selectedFurniture);
    this.selectedFurniture = null;
    this.updateStatus();
    this.scheduleSave();
  }

  rotateSelected() {
    if (!this.selectedFurniture || this.mode !== 'architect') return;
    if (!this.selectedFurniture.userData.rotatable) return;
    this.selectedFurniture.rotation.y += Math.PI / 2;
    if (isWallGapType(this.selectedFurniture.userData.furnitureType)) {
      this.scene.refreshWallOpenings();
    }
    this.scheduleSave();
  }

  onKeyDown(e) {
    const mod = e.ctrlKey || e.metaKey;

    if (mod && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      this.copySelected();
      return;
    }
    if (mod && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      this.pasteFromClipboard();
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.deleteSelected();
    }
    if (e.key === 'r' || e.key === 'R') {
      this.rotateSelected();
    }
    if (e.key === 'o' || e.key === 'O') {
      this.toggleSelectedDoorOpen();
    }
    if (e.key === 'Escape') {
      if (this.cursorFollowFurniture) {
        this.cancelCursorFollow(true);
        this.updateStatus();
        return;
      }
      this.cancelPlacing();
      this.wallStart = null;
      this.scene.clearWallPreview();
      this.clearSelection();
      this.updateStatus();
    }
  }
}
