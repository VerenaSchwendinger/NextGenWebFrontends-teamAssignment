# 04 – Technologie-ADR: Projekt-Setup

_Mit welchem Setup wir Ctrl Alt Meet umsetzen._

---

## Übersicht

Dieses ADR legt das Projekt-Setup und Tooling für unsere Plattform fest. Rendering-Strategien sind nicht Teil dieser Entscheidung.

## Kernaussagen

- Wir setzen Nuxt mit TypeScript ein.
- Ausschlaggebend sind dateibasiertes Routing, Auto-Imports und fertig verdrahtetes Tooling, das manuelle Konfiguration spart.
- Die Ordnerstruktur aus ADR 02 folgt den Nuxt-Konventionen.

## Kontext

Unsere Plattform braucht mehrere Seitentypen: Session-Übersicht, Session- und Speaker-Detailseiten sowie ein personalisiertes Dashboard „Mein Programm“. Detailseiten brauchen dynamische Routen wie `/sessions/:id`. Es gibt kein Backend, alle Daten kommen aus `conference-data.json`.

Spätere Schritte bringen weitere Anforderungen wie eine PWA mit Offline-Fähigkeit, die das Setup nicht erschweren soll.

Unsere Erfahrung mit modernen Frontend-Frameworks beschränkt sich auf die Übungen dieser Lehrveranstaltung, größere Projekte haben wir damit noch nicht umgesetzt.

## Optionen
### Option 1: Nuxt

Meta-Framework auf Vue mit dateibasiertem Routing. Routen entstehen aus `app/pages/`, dynamische wie `app/pages/sessions/[id].vue` ebenso. Komponenten und Composables werden automatisch importiert, TypeScript, Dev-Server und Build sind vorkonfiguriert, und Module (z. B. für Fonts, ESLint, PWA) lassen sich einbinden. Nachteilig sind mehr Konventionen und „Magie“, die Einarbeitung kostet Zeit. Da Nuxt Code auch auf dem Server ausführen kann, müssen Browser-APIs wie `localStorage` bewusst nur clientseitig genutzt werden.

### Option 2: Vue + Vite + vue-router

Schlanke Single-Page-App, bei der jede Route explizit in `router/index.ts` steht. Das Setup ist transparent und läuft nur im Browser. Routing, Layouts, Auto-Imports, Linting und spätere PWA-Anbindung müssen wir aber selbst aufsetzen und pflegen, was Aufwand und Fehlerquellen bedeutet.

## Entscheidung

Wir wählen Nuxt 4 mit TypeScript. Bei drei Seitentypen mit dynamischen Routen spart dateibasiertes Routing Konfiguration, neue Seiten entstehen durch Anlegen einer Datei. Auto-Imports und vorkonfiguriertes Tooling reduzieren Boilerplate, sodass wir mehr Zeit für Komponenten und State haben. Das Modul-Ökosystem deckt spätere Anforderungen ab, ohne dass wir Eigenlösungen bauen müssen. Den Einarbeitungsaufwand halten wir für vertretbar, denn gerade mit wenig Erfahrung in Projektsetups erleichtern uns die festen Konventionen von Nuxt viele Strukturentscheidungen. TypeScript nutzen wir, weil Nuxt Typen für Routen und Auto-Imports erzeugt und wir die Struktur von `conference-data.json` einmal als Interface beschreiben können.

## Konsequenzen

Die Ordnerstruktur folgt den Nuxt-Konventionen (`pages/` statt `views/`, kein eigener `router/`), ADR 02 ist entsprechend angepasst. Wir hängen von Nuxt und seinen Releases ab, Updates müssen wir einplanen. Browser-spezifischer Code wie der Zugriff auf `localStorage` läuft nur clientseitig (siehe Dokument 03). Das Grundgerüst entsteht mit dem offiziellen Nuxt-Starter, Setup-Befehle kommen in die README. Die Wahl der Rendering-Strategien bleibt Schritt 2 vorbehalten.

---

_Zuletzt aktualisiert: 2026-10-11_