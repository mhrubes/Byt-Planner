# Byt Planner

Webová aplikace pro **3D plánování bytů** v prohlížeči. Vyber šablonu, uprav dispozici, zařiď nábytek a prohlížej výsledek v náhledu.

![Technologie](https://img.shields.io/badge/Three.js-0.172-blue) ![Vite](https://img.shields.io/badge/Vite-6-purple)

## Funkce

### Plánování a dispozice

- **3D vizualizace** — půdorys s mřížkou, stíny v režimu náhledu
- **Dva režimy** — architekt (úpravy) a náhled (barvy, prohlížení)
- **Šablony bytů** — 1+kk, 2+kk, 3+kk + prázdný plán od nuly
- **Kreslení zdí** — vodorovně, svisle i **pod libovolným úhlem** (Shift = 45°)
- **Dveře ve zdech** — automatické výřezy, nadpraží a správné napojení na příčky
- **Mřížka 0,5 m** — nábytek lze umístit na křižovatky, do středu čtverce i mezi čáry

### Katalog a nábytek

- **Kategorie** — stavební prvky, obývák, ložnice, kuchyně, pracovna, koupelna
- **Umisťování tažením** — vyber položku, drž levé tlačítko, pusť na podlaze
- **Koberece** — tvar (obdélník, kulatý, ovál…), vzor a vlastní barvy
- **Kuchyňské spotřebiče** — trouba s černou plotnou, myčka, digestoř nad linkou
- **Otevíratelné objekty** — dveře, okna, skříňky, trouba, myčka… (viz níže)

### Vzhled a náhled

- **Barva podlahy** — globálně v režimu náhledu
- **Barva stěn** — celý byt nebo **jednotlivá zeď** (klik na zeď v náhledu)
- **Pohledy kamery** — 3D, shora, zepředu, zboku

### Práce s projektem

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
| Smazat zeď | Nástroj 🗑️ Smazat zeď → klik na zeď |
| Úhly po 45° | Drž `Shift` při kreslení zdi |
| Umístit z katalogu | Klikni položku → táhni na podlahu |
| Koberec | Vyber koberec → táhni obdélník na podlaze |
| Otevřít / zavřít | Vyber objekt → tlačítko v panelu nebo `O` |
| Zrušit akci | `Esc` |

### Režim náhledu

| Akce | Ovládání |
|------|----------|
| Barva všech stěn | Vyber barvu v panelu (bez výběru zdi) |
| Barva jedné zdi | Klikni na zeď → vyber barvu |
| Barva podlahy | Vyber barvu v panelu |

### Otevíratelné objekty

V architektovi vyber objekt s otevíratelnými částmi — v pravém panelu se zobrazí tlačítko, nebo použij klávesu **`O`**:

| Objekt | Chování |
|--------|---------|
| Dveře / balkónové dveře | Otevře průchod ve zdi |
| Okno | Vyklopí křídlo |
| Skříňky, skříň, bambusová skříňka | Otevře dvířka, ukáže interiér |
| Trouba | Sklopí dvířka, uvnitř plech; nahoře černá plotna |
| Myčka | Sklopí dvířka, uvnitř talíře na policích |
| Digestoř | Visí nad linkou — na stejné pozici jako trouba je **nad ní** |

### Ukládání

- **💾 Uložit** — uloží stav do prohlížeče (localStorage)
- **Automatické ukládání** — pouze v režimu architekta
- **🗑️ Smazat uložení** — vymaže všechna data z localStorage
- **↺ Reset bytu** — vrátí aktuální šablonu na výchozí stav

Ukládá se zvlášť pro každý typ bytu (1+kk, 2+kk, 3+kk, prázdný plán): zdi, nábytek, barvy stěn a podlahy, otevřená dvířka, režim.

> Po větších změnách v aplikaci může starý uložený plán obsahovat zastaralé modely — použij **Reset bytu** nebo polož spotřebiče znovu.

## Katalog (přehled)

| Kategorie | Příklady položek |
|-----------|------------------|
| 🏗️ Stavební prvky | Dveře, okno, balkónové dveře, radiátor |
| 🛋️ Obývací pokoj | Pohovka, TV, krb, police, skříňky, rostliny, lampy, koberec |
| 🛏️ Ložnice | Postele, skříň, noční stolek, police, lampy |
| 🍳 Kuchyně & jídelna | Linka, modul, trouba, myčka, digestoř, stoly, židle |
| 🖥️ Pracovna | Psací stoly, židle, knihovna, police |
| 🛁 Koupelna | WC, umyvadlo, vana, sprcha, bambusová skříňka, koberec |

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
        ├── app.js        # Hlavní logika aplikace, UI, ovládání
        ├── scene.js      # Three.js scéna, kamera, raycasting, umisťování
        ├── apartments.js # Šablony bytů, zdi, mřížka, výřezy pro dveře
        ├── furniture.js  # Katalog, 3D modely, otevíratelné části
        └── storage.js    # localStorage persistencia
```

## Technologie

- [Vite](https://vitejs.dev/) — build a dev server
- [Three.js](https://threejs.org/) — 3D renderování
- Vanilla JavaScript (ES moduly), bez frameworku

## Licence

Soukromý projekt (`"private": true`).
