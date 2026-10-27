# 02 – Architektur-ADR: Komponenten- & Ordnerstruktur

_Wie wir den Code von Ctrl Alt Meet organisieren und wo wir Logik von Darstellung trennen._

---

## Übersicht

Dieses ADR legt fest, wie Ordner und Komponenten in unserem Nuxt-Projekt aufgebaut sind. Es richtet sich an unser Team: Wer eine neue Komponente oder Logik anlegt, findet hier, wohin sie gehört und wie sie heißt.

## Kernaussagen

- Wir kombinieren Komponentenschichten (Base, Layout, Feature) mit Feature-Ordnern innerhalb der Feature-Schicht.
- Die Session-Filterung trennen wir headless: Die Logik liegt in `useSessionFilter()`, die Darstellung ist austauschbar.
- Für „Zum Programm hinzufügen“ reicht ein Composable (`useMyProgram()`). Eine eigene Headless-Komponente wäre hier Overhead.

## Kontext

Unsere Plattform hat mehrere Seitentypen, nämlich Session-Übersicht, Session-Detail, Speaker-Übersicht, Speaker-Detail und „Mein Programm“. Viele Bausteine kommen auf mehreren Seiten vor, zum Beispiel die Session-Karte in der Übersicht, auf der Speaker-Seite und im eigenen Programm. Wir brauchen eine Struktur, die die Komponentenschichten (Base/UI, Feature, Layout) sichtbar macht und geteilte Logik nicht an eine einzelne Komponente bindet. Als Setup verwenden wir Nuxt 4 (Begründung in ADR 04). Routen entstehen daher aus dem Ordner `app/pages/`, Komponenten und Composables werden automatisch importiert.

## Optionen
### Option 1: Nach Dateityp (flach)

Alle Komponenten liegen in `components/`, alle Seiten in `pages/`, alle Composables in `composables/`. So sieht die Standardstruktur eines neuen Nuxt-Projekts aus.

- Pro: bekannt, kein Einarbeitungsaufwand
- Contra: Mit wachsender Komponentenzahl werden die Ordner unübersichtlich. Die Schichten sind nicht erkennbar.

### Option 2: Rein nach Features

Jedes Feature hat einen eigenen Ordner mit Komponenten, Composables und Seiten, zum Beispiel `features/sessions/`, `features/speakers/`, `features/program/`.

- Pro: Alles zu einem Feature liegt an einem Ort und lässt sich leicht erweitern.
- Contra: Geteilte Bausteine (Button, Tag, Header) haben keinen natürlichen Platz. Geteilte Logik passt schlecht in ein einzelnes Feature, denn `useMyProgram()` wird von Sessions, Speakern und Programm gleichermaßen gebraucht. Das führt zu Querimporten zwischen Features. Zudem müssen Seiten in Nuxt ohnehin in `pages/` liegen, die Feature-Ordner wären also nie vollständig.

### Option 3: Schichten + Feature-Ordner (hybrid)

`components/` ist in `base/`, `layout/` und `features/` unterteilt. Innerhalb von `features/` gruppieren wir nach Fachbereich. Geteilte Logik liegt in `composables/`.

- Pro: Die Schichten sind im Ordnerbaum sichtbar, zusammengehöriger Code liegt beisammen, und die Struktur fügt sich in die Nuxt-Konventionen ein.
- Contra: etwas tiefere Ordnerstruktur, und es braucht eine Regel, was in welche Schicht gehört

## Entscheidung

Wir wählen Option 3: Schichten + Feature-Ordner. Sie macht als einzige die geforderten Schichten direkt sichtbar und gibt geteilter Logik wie `useMyProgram()` einen eindeutigen Ort, ohne Querimporte zwischen Features.

```
app/
├── app.vue                   ← App-Rahmen mit Header, Seite und Footer
├── pages/                    ← eine Datei pro Route
│   ├── index.vue             ← Startseite
│   ├── sessions/             ← geplant: index.vue, [id].vue
│   ├── speakers/             ← geplant: index.vue, [id].vue
│   └── my-program.vue        ← geplant
├── components/
│   ├── base/                 ← ohne Konferenz-Daten, nur Props und Slots
│   ├── layout/               ← Header, Footer, Seitenrahmen
│   └── features/
│       ├── sessions/
│       ├── speakers/
│       └── program/
├── composables/              ← geteilte Logik
├── plugins/                  ← my-program.client.ts (Persistenz, siehe Dokument 03)
└── data/
    └── conference-data.json
tokens/
└── tokens.css                ← global eingebunden über nuxt.config.ts
```

Faustregel: Sobald eine Komponente Konferenz-Daten kennt, gehört sie in `features/`.

### Benennung 

Base-Komponenten bekommen das Präfix `Base`, Layout-Komponenten `App`. Seiten heißen nach ihrer Route, ein Suffix gibt es nicht. Composables beginnen mit `use`. Das folgt dem offiziellen Vue Style Guide. In `nuxt.config.ts` setzen wir `pathPrefix: false`, damit Nuxt `features/sessions/SessionCard.vue` als `SessionCard` registriert und nicht als `FeaturesSessionsSessionCard`.

### Headless-Prüfung
#### Session-Filterung: Headless ja

Die Filterlogik liegt in `useSessionFilter()`, die Darstellung ist austauschbar. Das lohnt sich, weil dieselbe Logik in mehreren Darstellungen gebraucht wird (Liste und Zeitraster, Desktop und Mobil).

#### „Zum Programm hinzufügen“: Composable ja, Headless-Komponente nein

Die Logik liegt zwar in `useMyProgram()`, weil mehrere Komponenten sie nutzen. Eine eigene Headless-Komponente bauen wir aber nicht, da es nur eine Darstellung gibt (den Button). Sie wäre reiner Overhead.

## Komponentenübersicht

Fett markiert ist, was im Grundgerüst aus Schritt 1 bereits umgesetzt ist. Der Rest folgt in späteren Schritten.

| Schicht | Bausteine |
|---|---|
| Base | **`BaseTag`**, `BaseButton`, `BaseCard` |
| Layout | **`AppHeader`**, **`AppFooter`** |
| Feature sessions | `SessionCard`, `SessionList`, `SessionTimetable`, `SessionFilter` |
| Feature speakers | `SpeakerCard`, `SpeakerProfile` |
| Feature program | `AddToProgramButton` |
| Composables | **`useConferenceData`**, `useSessionFilter`, `useMyProgram` |
| Plugin | `my-program.client.ts` |
| Seiten | **`index.vue`**, `sessions/index.vue`, `sessions/[id].vue`, `speakers/index.vue`, `speakers/[id].vue`, `my-program.vue` |

## Konsequenzen
### Positiv

Die Struktur ist für Team und Reviewer sofort verständlich. Neue Darstellungen der Session-Liste nutzen die bestehende Filterlogik ohne Änderungen. Dank Auto-Imports entfallen Importpfade für Komponenten und Composables.

### Negativ / Risiken

Durch `pathPrefix: false` müssen Komponentennamen projektweit eindeutig sein. Auto-Imports machen Abhängigkeiten im Code weniger sichtbar. Unsere Layout-Komponenten sind nicht mit dem Nuxt-Ordner `layouts/` zu verwechseln, den wir vorerst nicht nutzen. Bei Grenzfällen müssen wir die Faustregel anwenden.

---

_Zuletzt aktualisiert: 2026-10-11_