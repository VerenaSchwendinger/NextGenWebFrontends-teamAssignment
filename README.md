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

## Projektstruktur

```
app/
  pages/           Seiten, eine Datei pro Route
  components/
    base/          generische UI Bausteine ohne Konferenzdaten
    layout/        Header, Footer, Seitenrahmen
    features/      fachliche Komponenten (sessions, speakers, program)
  composables/     geteilte Logik (useConferenceData, useMyProgram, useSessionFilter)
  plugins/         client only Plugins (Persistenz von Mein Programm)
  data/            conference-data.json
tokens/
  tokens.css       Design Tokens, global eingebunden über nuxt.config.ts
docs/schritt1/     Branding, ADRs und State Management Konzept
```

## Dokumentation

- [01 Branding und Design Tokens](docs/schritt1/01-branding-design-tokens.md)
- [02 Architektur-ADR](docs/schritt1/02-architektur-adr.md)
- [03 State Management Konzept](docs/schritt1/03-state-management-konzept.md)
- [04 Technologie-ADR](docs/schritt1/04-technologie-adr.md)

## Team

- Verena Schwendinger
- Franziska Reichhold