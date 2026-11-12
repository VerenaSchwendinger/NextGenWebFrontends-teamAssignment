# AI-Log Schwendinger Schritt 3

_Einsatz von KI (Claude) bei der Erstellung von Ctrl Alt Meet._

---

### 2026-11-11 · Icons generieren
 
- **Tool:** Claude (claude.ai)
- **Prompt:** „Wie erzeuge ich aus dem Logo die Icons für das Manifest?“
- **Zweck:** Mit `@vite-pwa/assets-generator` alle Größen aus `public/logo.svg` erzeugen (192, 512, maskable, Apple-Touch-Icon, Favicon). Über `pwa-assets.config.ts` ist der Hintergrund für das maskable- und das Apple-Icon auf Forest Code gesetzt, weil der Generator sonst einen weißen Rand ergänzt.

### 2026-11-11 · PWA-Konfiguration in nuxt.config.ts

- **Tool:** Claude (claude.ai)
- **Prompt:** „Wie ergänze ich unsere `nuxt.config.ts` um Manifest und Service Worker, ohne die `routeRules` aus der Rendering-ADR zu verändern? Die Farben sollen aus unseren Design Tokens kommen.“
- **Zweck:** Das Modul `@vite-pwa/nuxt`, ein `theme-color`-Meta-Tag und den `pwa`-Block ergänzen. Das Manifest enthält Name, Beschreibung, Sprache, Start-URL, `display: "standalone"` und drei Icons (192, 512, maskable). `theme_color` entspricht `--color-action`, `background_color` entspricht `--color-bg`, damit Statusleiste und Splashscreen zur App passen. `registerType: 'autoUpdate'` aktiviert neue Service-Worker-Versionen ohne Rückfrage. `navigateFallback` ist bewusst deaktiviert, damit der Service Worker nicht schon vor der Entscheidung in B jede Navigation mit der Startseite beantwortet. `runtimeCaching` bleibt als Platzhalter für die Daten-Regeln von Person 2 frei.

### 2026-11-11 · Manifest-Link mit NuxtPwaManifest

- **Tool:** Claude (claude.ai)
- **Prompt:** „Wie wird das Manifest in den `<head>` eingebunden, und an welcher Stelle in `app.vue` gehört `<NuxtPwaManifest />` hin?“
- **Zweck:** Ohne die Komponente erzeugt das Modul zwar die Manifest-Datei, verlinkt sie aber nicht, und die App ist nicht installierbar. Die Komponente zeigt nichts auf der Seite an, ihre Position ist also egal. Sie steht innerhalb von `.app-shell` über dem `AppHeader`, damit das Template wie bisher ein einziges Wurzelelement hat.

### 2026-11-11 · Installierbarkeit prüfen

- **Tool:** Claude (claude.ai)
- **Prompt:** „Chrome bietet mir keine Installation an, obwohl Manifest und Service Worker in den DevTools korrekt aussehen. Woran liegt das?“
- **Zweck:** Die Ursache für das fehlende Installieren-Symbol finden. Unter „Installability“ zeigten die DevTools, dass die Seite in einem Inkognito-Fenster geöffnet war, in dem Chrome grundsätzlich keine Installation erlaubt. Im normalen Fenster ließ sich die App installieren und öffnete sich im eigenen Fenster ohne Adressleiste. Die Hinweise zu fehlenden Screenshots im Manifest betreffen nur einen ausführlicheren Installationsdialog und sind für die Installierbarkeit nicht nötig.

### 2026-11-12 · App-Shell vorab speichern

- **Tool:** Claude (claude.ai)
- **Prompt:** „Warum landen im Precache nur Seiten-Daten, aber kein JavaScript und CSS? Und wie stelle ich sicher, dass Startseite und ‚Mein Programm' schon nach dem ersten Online-Besuch offline funktionieren?“
- **Zweck:** Zwei Probleme klären. Erstens ersetzt `@vite-pwa/nuxt` bei vorgerenderten Seiten die Standardliste der vorab gespeicherten Dateien durch eine, die nur `_payload.json` enthält. Mit eigenen `globPatterns` sind jetzt JavaScript, CSS und Icons im Precache. Zweitens startet der Service Worker erst während des ersten Besuchs und sieht diesen Seitenaufruf nicht mehr. Startseite und „Mein Programm“ werden deshalb beim Installieren vorab gespeichert. Das passt zur Rendering-ADR, weil sich beide Seiten nur mit einem neuen Build ändern.

### 2026-11-12 · Startseite offline ohne Daten

- **Tool:** Claude (claude.ai)
- **Prompt:** „Die Startseite lädt offline, zeigt aber ‚500 – Konferenzdaten nicht verfügbar'. Woran liegt das?“
- **Zweck:** Die Ursache für den Fehler beim Offline-Test finden. Die Startseite holt ihre Daten aus `_payload.json`, die zwar vorab gespeichert ist, aber von Nuxt mit der Build-Nummer als Parameter (`?_b=…`) abgerufen wird. Für den Service Worker ist das eine andere Adresse, er fand die gespeicherte Datei deshalb nicht. `ignoreURLParametersMatching` ignoriert diesen Parameter jetzt, danach lädt die Startseite offline vollständig. Die Einstellung gilt für alle vorab gespeicherten Seiten-Daten, also auch für die Speaker-Seiten.

### 2026-11-12 · Google Fonts zwischenspeichern

- **Tool:** Claude (claude.ai)
- **Prompt:** „Wie speichere ich die Google Fonts im Service Worker, obwohl sie von einem fremden Server kommen?“
- **Zweck:** Zwei Cache-First-Regeln für das Stylesheet (`fonts.googleapis.com`) und die Schriftdateien (`fonts.gstatic.com`) anlegen, wie in Dokument 02 festgelegt. Antworten fremder Server kommen teils mit Status 0 an und werden deshalb ausdrücklich zugelassen. Beim Testen zeigte sich die Lücke aus dem Konzept: Beim allerersten Besuch lädt der Browser die Schriften, bevor der Service Worker aktiv ist. Sie landen erst beim zweiten Laden im Cache.

---