# AI-Log Schritt 1

_Einsatz von KI (Claude, ChatGPT) bei der Planung von Ctrl Alt Meet._

---

## Wofür ich KI genutzt habe

### 2026-10-30 · ADR mit Schritt 1 abgleichen

- **Tool:** Claude (claude.ai)
- **Prompt:** „Prüfe bitte, ob unsere Rendering-Strategie-ADR mit den Entscheidungen aus Schritt 1 übereinstimmt, also mit Branding, Architektur-ADR, State-Management-Konzept und Technologie-ADR.“
- **Zweck:** Prüfen, ob unser ADR-Entwurf zu Branding, Architektur-ADR, State-Management-Konzept und Technologie-ADR aus Schritt 1 passt. Dazu haben wir ADR-Entwurf, Angabe, alle Schritt-1-Dokumente und den aktuellen Code mitgegeben, damit Widersprüche konkret gefunden werden.

### 2026-10-31 · Änderungsbedarf im ADR ermitteln

- **Tool:** Claude (claude.ai)
- **Prompt:** „Welche inhaltlichen Änderungen sind in unserer Rendering-Strategie-ADR noch notwendig, damit sie die Anforderungen der Angabe erfüllt?“
- **Zweck:** Eine priorisierte Fehlerliste bekommen. Wichtigster Befund: Die ISR-Simulation funktioniert mit beim Build eingebundenen Daten nicht und muss als Abweichung von Dokument 03 nachgetragen werden.

### 2026-10-31 · Hamburger-Menü für die Navigation

- **Tool:** Claude (claude.ai)
- **Prompt:** „Wie baue ich für die Navigation ein barrierefreies Hamburger-Menü für mobile Geräte?“
- **Zweck:** Auf kleinen Bildschirmen Platz im Header sparen. Das Menü sollte per Tastatur und Screenreader bedienbar sein (`aria-expanded`, Esc zum Schließen, Tippflächen von 44 px) und sich nach einem Seitenwechsel automatisch schließen.

### 2026-10-31 · Teil B passend zu den ADRs planen

- **Tool:** Claude (claude.ai)
- **Prompt:** „Was muss ich bei Aufgabe B umsetzen, damit die Session-Übersicht zu unseren ADRs passt?“
- **Zweck:** Klären, welche Vorgaben aus ADR 02 (headless `useSessionFilter()`, Komponentenschichten), Dokument 01 (Design Tokens) und der Rendering-ADR (Filtern im Browser, `swr: 60`) für die Übersicht gelten, bevor wir mit dem Code beginnen.

### 2026-10-31 · Compile-Fehler beheben

- **Tool:** Claude (claude.ai)
- **Prompt:** „Beim Start von `npm run dev` erscheint ein CssSyntaxError in `SessionCard.vue` bzw. `sessions/index.vue`. Woran liegt das?“
- **Zweck:** Die Ursache des Fehlers finden. Ergebnis: Der Code war in den vom Editor automatisch erzeugten `<style scoped>`-Block eingefügt worden. Gelöst durch komplettes Ersetzen des Dateiinhalts und Leeren des Nuxt-Caches.

### 2026-10-31 · Filter in der URL teilbar machen

- **Tool:** Claude (claude.ai)
- **Prompt:** „Wie können die gewählten Filter in der URL gespeichert werden, sodass sich gefilterte Ansichten als Link teilen lassen, ohne der Rendering-ADR zu widersprechen?“
- **Zweck:** `useSessionFilter()` um eine URL-Synchronisierung erweitern. Die Startwerte werden erst nach dem Laden im Browser aus der URL gelesen, damit der Server laut Rendering-ADR (Entscheidung 3) immer alle 20 Sessions rendert. Ungültige Werte in der URL werden ignoriert, Filterwechsel per `router.replace` ohne neue Verlaufseinträge in die Adresse geschrieben.

---