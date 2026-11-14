# AI-Log Reichhold Schritt 3

_Einsatz von KI (Claude) bei der Umsetzung von Ctrl Alt Meet._

---

## Wofür ich KI genutzt habe

### 2026-11-11 · Review des Offline-Konzepts

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „wie würdest du das konzept ändern?“
- **Zweck** Entwurf von Dokument 02 gegen Angabe, Rendering-ADR und Code prüfen. Speaker-Daten standen gleichzeitig unter Cache-First und Stale-While-Revalidate, das geht nicht, weil `/api/conference` Sessions und Speaker gemeinsam liefert. Außerdem hätte „Mein Programm“ offline keine Daten, wenn vorher nur die Startseite besucht wurde, weil die vorgerenderte Startseite die API nie aufruft.

### 2026-11-11 · Startseite offline mit Fehler 500

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „warum fehler 500 Konferenzdaten nicht verfügbar“
- **Zweck** Die Ursache finden. Ohne eigene `globPatterns` speicherte `@vite-pwa/nuxt` nur die Seiten-Daten vorab, kein JavaScript, CSS oder HTML (nur 23 Einträge). Außerdem ruft Nuxt die Seiten-Daten mit der Build-Nummer ab (`?_b=…`), unter dieser Adresse fand der Service Worker die gespeicherte Datei nicht. Claude schlug zuerst eine experimentelle Modul-Option vor, die einfachere Lösung über `ignoreURLParametersMatching` hat Person 1 umgesetzt.

### 2026-11-14 · Caching-Regeln für Session- und Speaker-Daten

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „anleitung und erkläre angabe c?“ [Angabe zu C eingefügt]
- **Zweck** Speaker-Seiten in den Precache aufnehmen, Stale-While-Revalidate für `/api/conference` und die Session-Seiten ergänzen und das Plugin `pwa-warm-up.client.ts` schreiben, das die Konferenzdaten beim Start einmal lädt.

### 2026-11-14 · Warum conference-data im Cache fehlte

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „warum in devtools keine conference data?“ [Screenshots von Cache Storage und Network-Tab]
- **Zweck** Prüfen, ob der Fehler in der Regel oder im Testablauf liegt. Statt weiter in der App zu klicken, haben wir die Regel isoliert getestet (`await fetch('/api/conference'); await caches.keys()` in der Konsole). Der Cache erschien sofort, die Regel war also richtig. Die eigentliche Ursache war, dass Nuxt die API nur beim Seitenwechsel innerhalb der App abfragt. Beim direkten Aufruf oder Neuladen schickt der Server die Daten im HTML mit, und es entsteht keine Anfrage, die der Service Worker speichern könnte. Genau dieses Verhalten ist der Grund für das Plugin `pwa-warm-up.client.ts`, das den Cache unabhängig vom Einstieg füllt.

### 2026-11-14 · Testszenarien und Verifikations-Nachweis

- **Tool** Claude (Cowork, Desktop-App)
- **Prompt** „bitte ergänze testszenarien für person 2 und erstelle und erkläre part d und e“
- **Zweck** Beobachtungen für D formulieren, Dokument 04 entwerfen und prüfen, ob jeder Screenshot zum beschriebenen Zustand passt. „Clear site data“ löscht den HTTP-Cache nicht, ein echter Erstbesuch für Szenario iii geht deshalb nur im Inkognito-Fenster. Lighthouse hat in Chrome 157 keine PWA-Kategorie mehr. Claude hatte behauptet, bei der Offline-Seite bleibe die Session-Adresse stehen, der Test zeigte aber, dass Nuxt auf `/offline` umstellt. Im Protokoll steht das getestete Verhalten.


---