# Ctrl Alt Meet

Konferenzplattform für die FrontendNow, Projektarbeit in der LV NextGen Web Frontends 1A. Die App ist als PWA installierbar und funktioniert nach dem ersten Besuch auch ohne Verbindung.

## Voraussetzungen

- Node.js 22.22.3 oder neuer, empfohlen 24 LTS
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
| `/offline` | SSG, beim Build vorgerendert | Offline-Seite, wird vom Service Worker vorab gespeichert |

Die Session-Übersicht liefert alle 20 Sessions im HTML, gefiltert wird im Browser. Die Daten kommen zur Laufzeit über `/api/conference`, damit Zeitänderungen ohne neuen Build sichtbar werden.

## PWA und Offline

Manifest und Service Worker erzeugt `@vite-pwa/nuxt` aus dem Block `pwa` in der `nuxt.config.ts`. Die Begründung steht im [Offline-Konzept](docs/schritt3/02-offline-strategie-konzept.md) und im [Entscheidungsprotokoll](docs/schritt3/03-entscheidungsprotokoll.md).

| Datentyp | Strategie |
|---|---|
| App-Shell, Startseite, Icons, Token-CSS | Cache-First, vorab gespeichert |
| Speaker-Seiten | Cache-First, alle 18 vorab gespeichert |
| Session-Daten (`/api/conference`) und Session-Seiten | Stale-While-Revalidate |
| „Mein Programm“ | Seite vorab gespeichert, IDs im `localStorage` |
| Google Fonts | Cache-First, beim ersten Laden gespeichert |

Service Worker und Caches greifen nur im Production-Build. Zum Testen:

```bash
npm run build
npm run preview
```

Dann http://localhost:3000 öffnen, in den Chrome-DevTools unter Application prüfen, ob der Service Worker aktiv ist, und unter Network auf „Offline“ schalten. Die Nachweise stehen im [Verifikations-Nachweis](docs/schritt3/04-verifikations-nachweis.md).

## Projektstruktur

```
app/
  pages/           Seiten, eine Datei pro Route, inklusive Offline-Seite
  components/
    base/          generische UI Bausteine ohne Konferenzdaten
    layout/        Header, Footer, Seitenrahmen
    features/      fachliche Komponenten (sessions, speakers, program)
  composables/     geteilte Logik (useConferenceData, useSessionFilter, useMyProgram, formatDay)
  plugins/         client only Plugins (Persistenz von Mein Programm, Konferenzdaten für den Offline-Cache)
  data/            conference-data.json
server/
  api/             Server-Route /api/conference, liest den Datensatz zur Laufzeit
public/            Logo, App-Icons und Favicon
tokens/
  tokens.css       Design Tokens, global eingebunden über nuxt.config.ts
pwa-assets.config.ts  erzeugt die App-Icons aus public/logo.svg
docs/
  schritt1/        Branding, ADRs und State Management Konzept
  schritt2/        Rendering-Strategie-ADR und AI-LOGs
  schritt3/        PWA-Setup, Offline-Konzept, Entscheidungsprotokoll, Nachweis und AI-LOGs
```

## Dokumentation
### Schritt 1

- [01 Branding und Design Tokens](docs/schritt1/01-branding-design-tokens.md)
- [02 Architektur-ADR](docs/schritt1/02-architektur-adr.md)
- [03 State Management Konzept](docs/schritt1/03-state-management-konzept.md)
- [04 Technologie-ADR](docs/schritt1/04-technologie-adr.md)
- [AI-LOG Schritt 1](docs/schritt1/AI-LOG.md)

### Schritt 2

- [01 Rendering-Strategie-ADR](docs/schritt2/01-rendering-strategie-adr.md)
- [AI-LOG Verena Schwendinger](docs/schritt2/AI-LOG-Schwendinger.md)
- [AI-LOG Franziska Reichhold](docs/schritt2/AI-LOG-Reichhold.md)

### Schritt 3

- [01 PWA-Setup](docs/schritt3/01-pwa-setup.md)
- [02 Offline-Strategie-Konzept](docs/schritt3/02-offline-strategie-konzept.md)
- [03 Entscheidungsprotokoll](docs/schritt3/03-entscheidungsprotokoll.md)
- [04 Verifikations-Nachweis](docs/schritt3/04-verifikations-nachweis.md)
- [AI-LOG Verena Schwendinger](docs/schritt3/AI-LOG-Schwendinger.md)
- [AI-LOG Franziska Reichhold](docs/schritt3/AI-LOG-Reichhold.md)

## Team

- Verena Schwendinger
- Franziska Reichhold