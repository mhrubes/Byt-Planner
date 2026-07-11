# Byt Planner

Webová aplikace pro **3D plánování bytů** v prohlížeči. Vyber šablonu, uprav dispozici, zařiď nábytek a prohlížej výsledek v náhledu.

![Technologie](https://img.shields.io/badge/Three.js-0.172-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple)

## Funkce

- **3D vizualizace** — půdorys s mřížkou, stíny v režimu náhledu
- **Dva režimy** — architekt (úpravy) a náhled (barvy, prohlížení)
- **Šablony bytů** — 1+kk, 2+kk, 3+kk + prázdný plán od nuly
- **Kreslení zdí** — vodorovně, svisle i **pod libovolným úhlem** (Shift = 45°)
- **Katalog objektů** — dveře, okna, nábytek, koupelna… rozdělené do kategorií
- **Umisťování tažením** — vyber položku, drž levé tlačítko, pusť na podlaze
- **Kopírování** — `Ctrl+C` / `Ctrl+V` pro duplikaci vybraného objektu
- **Ukládání** — localStorage, ruční uložení nebo automatické v režimu architekta
- **Sbalitelný levý panel** — více místa pro 3D scénu

## Rychlý start

```bash
npm install
npm run dev
```

Aplikace běží na [http://localhost:5173](http://localhost:5173).

### Další příkazy

| Příkaz | Popis |
|--------|--------|
| `npm run dev` | Vývojový server |
| `npm run build` | Produkční build do `dist/` |
| `npm run preview` | Náhled buildu |

## Ovládání

### Myš (3D scéna)

| Akce | Ovládání |
|------|----------|
| Otáčení kamery | Levé tlačítko + táhnout |
| Přiblížení | Kolečko |
| Posun | Pravé tlačítko + táhnout |

### Režim architekta

| Akce | Ovládání |
|------|----------|
| Vybrat / táhnout objekt | Nástroj ✋ Vybrat |
| Otočit objekt | `R` |
| Smazat objekt | `Del` |
| Kopírovat | `Ctrl+C` |
| Vložit kopii | `Ctrl+V` → přesuň myší → klikni |
| Kreslit zeď | Nástroj 🧱 Zeď → 2 kliky |
| Úhly po 45° | Drž `Shift` při kreslení zdi |
| Umístit z katalogu | Klikni položku → táhni na podlahu |
| Zrušit akci | `Esc` |

### Ukládání

- **💾 Uložit** — uloží stav do prohlížeče (localStorage)
- **Automatické ukládání** — pouze v režimu architekta
- **🗑️ Smazat uložení** — vymaže všechna data z localStorage
- **↺ Reset bytu** — vrátí aktuální šablonu na výchozí stav

Ukládá se zvlášť pro každý typ bytu (1+kk, 2+kk, 3+kk, prázdný plán): zdi, nábytek, barvy, režim.

## Struktura projektu

```
Byt-Planner/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js           # Vstupní bod
    ├── styles.css        # UI styly
    └── js/
        ├── app.js        # Hlavní logika aplikace
        ├── scene.js      # Three.js scéna, kamera, raycasting
        ├── apartments.js # Šablony bytů, zdi, mřížka
        ├── furniture.js  # Katalog a 3D modely objektů
        └── storage.js    # localStorage persistencia
```

## Technologie

- [Vite](https://vitejs.dev/) — build a dev server
- [Three.js](https://threejs.org/) — 3D renderování
- Vanilla JavaScript (ES moduly), bez frameworku

## Licence

Soukromý projekt (`"private": true`).
