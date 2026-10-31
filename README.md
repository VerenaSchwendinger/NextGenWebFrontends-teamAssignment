# Ctrl Alt Meet

Konferenzplattform für die FrontendNow, Projektarbeit in der LV NextGen Web Frontends 1A.

## Voraussetzungen

- Node.js 20 oder neuer
- npm

## Setup

```bash
npm install
```

## Entwicklung starten

```bash
npm run dev
```

Die App läuft danach unter http://localhost:3000.

## Weitere Befehle

```bash
npm run build     # Produktionsbuild erstellen
npm run preview   # Produktionsbuild lokal testen
```

## Rendering-Strategie

Jeder Seitentyp wird passend zu seinen Daten gerendert. Die Begründung steht in der [Rendering-Strategie-ADR](docs/schritt2/01-rendering-strategie-adr.md), die Umsetzung in den `routeRules` der `nuxt.config.ts`.

| Route | Strategie | Warum |
|---|---|---|
| `/`, `/speakers`, `/speakers/:id` | SSG, beim Build vorgerendert | Inhalte ändern sich zur Laufzeit nicht |
| `/sessions`, `/sessions/:id` | ISR-Prinzip mit `swr: 60` | für alle gleich, Zeit und Raum können sich ändern |
| `/my-program` | CSR, nur im Browser | gemerkte Sessions liegen nur im `localStorage` |

Die Session-Übersicht liefert alle 20 Sessions im HTML, gefiltert wird im Browser. Die Daten kommen zur Laufzeit über `/api/conference`, damit Zeitänderungen ohne neuen Build sichtbar werden.

Der Cache greift nur im Production-Build. Zum Testen:

```bash
npm run build
npm run preview
```

## Projektstruktur

```
app/
  pages/           Seiten, eine Datei pro Route
  components/
    base/          generische UI Bausteine ohne Konferenzdaten
    layout/        Header, Footer, Seitenrahmen
    features/      fachliche Komponenten (sessions, speakers, program)
  composables/     geteilte Logik (useConferenceData, useSessionFilter, useMyProgram, formatDay)
  plugins/         client only Plugins (Persistenz von Mein Programm)
  data/            conference-data.json
server/
  api/             Server-Route /api/conference, liest den Datensatz zur Laufzeit
tokens/
  tokens.css       Design Tokens, global eingebunden über nuxt.config.ts
docs/
  schritt1/        Branding, ADRs und State Management Konzept
  schritt2/        Rendering-Strategie-ADR und AI-LOGs
```

## Dokumentation
### Schritt 1

- [01 Branding und Design Tokens](docs/schritt1/01-branding-design-tokens.md)
- [02 Architektur-ADR](docs/schritt1/02-architektur-adr.md)
- [03 State Management Konzept](docs/schritt1/03-state-management-konzept.md)
- [04 Technologie-ADR](docs/schritt1/04-technologie-adr.md)
- [AI-LOG Schritt 1](docs/AI-LOG.md)

### Schritt 2

- [01 Rendering-Strategie-ADR](docs/schritt2/01-rendering-strategie-adr.md)
- [AI-LOG Verena Schwendinger](docs/schritt2/AI-LOG-Schwendinger.md)
- [AI-LOG Franziska Reichhold](docs/schritt2/AI-LOG-Reichhold.md)

## Team

- Verena Schwendinger
- Franziska Reichhold