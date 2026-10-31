# AI-Log Schritt 2

_Einsatz von KI (Claude) bei der Umsetzung von Ctrl Alt Meet._

---

## Wofür ich KI genutzt habe

### 2026-10-28 · Review der Rendering-Strategie-ADR

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „bitte überpüfe vorhande dokumente auf fehler und verbsesserungen und zur vorbereitung für schritt 2“
- **Zweck** Den ADR-Entwurf gegen Angabe und Schritt-1-Dokumente prüfen lassen. Wichtigste Befunde waren falsche Filter (Raum statt Level), eine ungenaue Beschreibung von `swr` und dass die ISR-Simulation mit beim Build eingebundenen Daten nicht funktioniert. Daraus entstand der Nachtrag zur Laufzeit-Datenschicht.

### 2026-10-28 · Erster Entwurf für C und E

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „bitte c und e ausarbeiten“ [Angabe zu Teil C und E eingefügt]
- **Zweck** Einen Startpunkt für meine beiden Teile bekommen. Weil die Datenstruktur noch unbekannt war, basierte der Entwurf auf angenommenen Feldnamen.

### 2026-10-31 · Commits der Kollegin verstehen

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „was passiert in den commits meiner kollegin, rendering strategiedr , add navbar, add dayformt, add sessioncard, seeeionfilger“ 
- **Zweck** Verstehen, was in Teil B schon umgesetzt ist. Ergebnis war unter anderem, die vorhandene `formatDay`-Funktion zu verwenden und im eigenen Account zu committen.

### 2026-10-31 · Ablauf von Teil C verstehen

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „erkläre aufgaben ablauf, für verständnis was hier passiert“ [Angabe Teil C eingefügt]
- **Zweck** Vor dem Programmieren verstehen, wie dynamische Routen in Nuxt funktionieren und wie die Detailseite ihre Daten über `useConferenceData()` und die Lookup-Maps bekommt. Claude hat dafür unseren Code im Projektordner gelesen.

### 2026-10-31 · Detailseite umsetzen

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „ja bitte teil c undkläre die umsetzung verständlich, ws passiert“
- **Zweck** Code für `pages/sessions/[id].vue` passend zu unserem Bestand (Maps statt `computed`, `BaseTag`, Design Tokens) und eine Erklärung jedes Schritts, damit ich den Code nachvollziehen kann.

### 2026-10-31 · Teil E umsetzen

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „bitte teil e ausarbeiten und schritt für schritt erklären was passiert“
- **Zweck** Code für `useMyProgram()`, das Plugin `my-program.client.ts`, den `AddToProgramButton` und die Seite `/my-program`, umgesetzt nach dem Konzept aus Dokument 03 (nur IDs speichern, Rehydration nach der Hydration, ein zentraler Watcher).

### 2026-10-31 · Teststrategie für die Persistenz

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „bitte test code für überpüfung in devtools?“
- **Zweck** Einen Test für das Plugin finden, bevor es einen sichtbaren Button gibt. Ergebnis war ein Test über die Browser-Konsole mit doppelten und ungültigen IDs im `localStorage`.

### 2026-10-31 · Fehler im generierten Plugin gefunden

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „'["s04","s04","s99"]'“
- **Zweck** Mein Test hat gezeigt, dass das Plugin die bereinigten IDs nicht zurück in den `localStorage` schreibt. Ursache war, dass der Watcher erst nach der Bereinigung registriert wurde und sie deshalb nicht bemerkt hat. Behoben durch ein einmaliges `writeIds(ids.value)` nach dem Laden, danach lieferte der Test `'["s04"]'`.

### 2026-10-31 · Abgleich nuxt.config mit der ADR

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** [Inhalt von `nuxt.config.ts` eingefügt]
- **Zweck** Prüfen, ob die `routeRules` der ADR entsprechen, besonders `ssr: false` für `/my-program`. Sie stimmen mit dem Block unter „Umsetzung“ überein.

### 2026-10-31 · AI-LOG

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „ai log erstellen“
- **Zweck** Die Einträge aus dem Verlauf zusammenstellen. Inhalt und Daten habe ich anschließend selbst geprüft.

### 2026-10-31 · Code mit den Docs abgleichen

- **Tool** Claude Code (VS Code)
- **Prompt** „bitte überprüfe auf fehler, ob alles mit den angaben in den docs zusammenstimmt“
- **Zweck** Prüfen, ob die Umsetzung den Dokumenten 02, 03 und der ADR entspricht. Gefunden wurden unter anderem der fehlende Abgleich zwischen Tabs über das `storage`-Event und Abweichungen zu Dokument 03, die noch nicht dokumentiert waren.

### 2026-10-31 · Abweichungen in der ADR nachtragen

- **Tool** Claude Code (VS Code)
- **Prompt** „bitte ergänze in 01-rendering-strategie-adr.md“
- **Zweck** Die Abweichungen nicht stillschweigend lassen, sondern in der ADR nachtragen: den Ladezustand `ready` mit gesperrtem Button und dass die `SessionCard` den Programm-Button nur über einen Slot bekommt.

### 2026-10-31 · Abschlussprüfung vor der Abgabe

- **Tool** Claude Code (VS Code)
- **Prompt** „pls final run, alles okay und stimmt mit den docs und angabe überein“ [Angabe Schritt 2 eingefügt]
- **Zweck** Alle Teile A bis F gegen die Angabe prüfen und alle Routen im Production-Build testen. Dabei wurden der Codeblock in der ADR an `nuxt.config.ts` angeglichen und ein kaputter Link im README korrigiert.

---