# 03 – Entscheidungsprotokoll

_Rendering- und Caching-Entscheidungen aus Schritt 2 und 3, mit konkret getesteten Offline-Szenarien._

---

## Übersicht

Dieses Protokoll fasst die Rendering-Entscheidungen aus Schritt 2 und die Offline- und Caching-Entscheidungen aus Schritt 3 zusammen. Jede Entscheidung folgt dem Schema Kontext, Optionen, Entscheidung, Konsequenzen. Die ausführlichen Begründungen stehen in der Rendering-ADR (`docs/schritt2/01-rendering-strategie-adr.md`) und im Offline-Konzept (Dokument 02). Danach folgen drei Testszenarien, die beide Teammitglieder unabhängig auf dem eigenen Rechner durchgespielt haben, sowie die bekannten Lücken.

## Kernaussagen

- Rendering pro Seitentyp: Speaker SSG, Sessions ISR-Prinzip mit `swr: 60`, „Mein Programm“ CSR (Schritt 2).
- Caching pro Datentyp: statische Assets und Speaker-Seiten Cache-First, Session-Daten Stale-While-Revalidate (Schritt 3).
- Startseite und „Mein Programm“ funktionieren nach einem einzigen Online-Besuch offline.
- Grenzfall Erstbesuch ohne Netz: Browser-Fehlerseite, weil noch kein Service Worker installiert ist.

---

## Teil 1: Rendering-Entscheidungen (Schritt 2)

Die ausführliche Begründung steht in der Rendering-ADR. Hier fassen wir die Entscheidungen zusammen, weil die Offline-Strategie direkt auf ihnen aufbaut.

### Entscheidung 1: Speaker-Profile – SSG

**Kontext:** Profile stehen vor der Konferenz fest, sind öffentlich und werden geteilt.

**Optionen:** SSG oder SSR.

**Entscheidung:** SSG mit `prerender: true`, alle 18 Profile explizit als Prerender-Routen.

**Konsequenzen:** am schnellsten und gut auffindbar. Profile zeigen Sessions nur mit Titel und Link, weil Zeiten und Räume veralten könnten. Für Schritt 3 heißt das: Speaker-Seiten eignen sich für Cache-First (Entscheidung 6).

### Entscheidung 2: Session-Detailseiten – ISR-Prinzip

**Kontext:** Zeit und Raum können sich kurzfristig ändern, viele rufen dieselbe Seite gleichzeitig auf.

**Optionen:** SSG, SSR oder ISR.

**Entscheidung:** ISR-Prinzip mit `swr: 60`, weil echtes ISR einen Host wie Vercel voraussetzt. `/api/conference` liest den Datensatz zur Laufzeit.

**Konsequenzen:** fast so schnell wie SSG und trotzdem aktuell. Für Schritt 3 heißt das: Session-Daten brauchen eine Strategie, die Änderungen zulässt (Entscheidung 6).

### Entscheidung 3: Session-Übersicht – ISR-Prinzip, Filter im Browser

**Kontext:** Die Liste aller 20 Sessions ist für alle gleich, wichtigster Einstieg über Google, filterbar nach Track, Tag und Level.

**Optionen:** SSR, CSR oder ISR mit Filtern im Browser.

**Entscheidung:** ISR mit `swr: 60`, gefiltert wird im Browser. Damit weichen wir vom Szenario ab, das SSR nahelegt.

**Konsequenzen:** Filtern braucht keine Netzanfrage und funktioniert damit auch offline, sobald die Liste geladen ist.

### Entscheidung 4: „Mein Programm“ – CSR

**Kontext:** Die gemerkten Sessions liegen nur im `localStorage`, die Seite ist persönlich und nicht indexierbar.

**Optionen:** SSR mit Cookie oder CSR.

**Entscheidung:** CSR mit `ssr: false`.

**Konsequenzen:** Der Server liefert nur eine leere Hülle, die Daten kommen über `useConferenceData()` von `/api/conference`. Für Schritt 3 heißt das: Offline braucht es sowohl die Hülle als auch diese Daten (Entscheidung 7).

---

## Teil 2: Offline- und Caching-Entscheidungen (Schritt 3)
### Entscheidung 5: Statische Assets und Startseite
#### Kontext

Zur App-Shell gehören JavaScript, CSS mit den Design Tokens, Icons und die Google Fonts. Sie ändern sich nur mit einem neuen Deployment. Auf der Konferenz ist das WLAN im Saal oft überlastet, zwischen zwei Sessions sind viele im Flugmodus. Die Angabe verlangt, dass die Startseite nach einmaligem Online-Laden offline funktioniert. Der Service Worker wird aber erst während dieses ersten Besuchs installiert und sieht den Seitenaufruf, der ihn startet, nicht mehr.

#### Optionen

**Option 1: Vorab speichern (Precache, Cache-First).** Alle Dateien landen beim Installieren des Service Workers im Cache. Sie sind sofort offline verfügbar, Änderungen kommen aber erst mit einem neuen Service Worker.

**Option 2: Beim Aufruf speichern (Runtime, Cache-First).** Dateien werden erst gespeichert, wenn sie über den Service Worker geladen werden. Die Startseite des ersten Besuchs wäre damit nicht im Cache.

**Option 3: Network-First.** Immer aktuell, im überlasteten WLAN aber langsam.

#### Entscheidung

Wir wählen Option 1 für JavaScript, CSS, Icons und die Startseite. Die Startseite wird beim Build erzeugt (`prerender: true`) und ändert sich ohnehin nur mit einem neuen Build. Die Google Fonts kommen von fremden Servern und lassen sich nicht vorab speichern, für sie gilt Option 2.

#### Konsequenzen

Nach einem Online-Besuch lädt die Startseite offline vollständig. Beim Testen fanden wir zwei Probleme. `@vite-pwa/nuxt` speicherte anfangs nur Seiten-Daten vorab, aber kein JavaScript und CSS, eigene `globPatterns` beheben das. Außerdem hängt Nuxt die Build-Nummer an die Seiten-Daten an (`?_b=…`), `ignoreURLParametersMatching` ignoriert sie jetzt. Lücke: Die Schriften lädt der Browser beim ersten Besuch, bevor der Service Worker aktiv ist. Sie landen erst beim zweiten Laden im Cache.

### Entscheidung 6: Speaker- und Session-Daten
#### Kontext

Nach der Veröffentlichung ändert sich das Programm kaum, späte Raum- und Zeitänderungen sind aber möglich. Darauf beruht schon `swr: 60` aus Entscheidung 2 und 3. Speaker-Profile zeigen laut Entscheidung 1 bewusst keine Zeiten und Räume. Die Daten kommen auf zwei Wegen: als Seiten-Daten (`_payload.json`) beim Wechsel innerhalb der App und über `/api/conference`, das Sessions und Speaker gemeinsam liefert.

#### Optionen

**Option 1: Cache-First für alle Programmdaten.** Am schnellsten im überlasteten WLAN, verschobene Sessions blieben aber bis zum nächsten Deployment falsch.

**Option 2: Stale-While-Revalidate.** Zeigt sofort den gespeicherten Stand und holt im Hintergrund die aktuelle Version für den nächsten Aufruf.

**Option 3: Network-First.** Immer aktuell, bei schlechtem WLAN aber lange Ladezeiten.

#### Entscheidung

Speaker-Seiten laden mit Cache-First, alle 18 werden vorab gespeichert. Ein veralteter Stand schadet dort nicht, weil sie keine Zeiten zeigen. Session-Seiten und `/api/conference` laden mit Stale-While-Revalidate. Weil `/api/conference` auch die Speaker enthält, gilt diese Regel dort für beide. Die Seiten-Daten (`_payload.json`) der Sessions speichern wir nicht eigens, weil Session-Seiten ihre Daten beim Wechsel innerhalb der App ohnehin über `/api/conference` beziehen.

#### Konsequenzen

Die App reagiert im schlechten WLAN sofort, und eine Raumänderung erscheint spätestens beim zweiten Aufruf nach der Änderung. Offline sieht man den zuletzt geladenen Stand. Beim Wechsel innerhalb der App holen Session-Seiten ihre Daten über `/api/conference`, das nach dem ersten Besuch im Cache liegt. Dadurch öffnen sich offline auch nie besuchte Session-Seiten, solange man über die App navigiert. Die Anfragen nach den Seiten-Daten schlagen dabei fehl, das ist aber nur in der Browser-Konsole sichtbar. Eine Session-Seite selbst landet nur im Cache, wenn sie einmal direkt aufgerufen oder neu geladen wurde. Das ändert eine Aussage aus der Rendering-ADR (siehe Nachträge).

### Entscheidung 7: „Mein Programm“ offline
#### Kontext

Die gemerkten Session-IDs liegen im `localStorage` (Dokument 03 aus Schritt 1). Laut Entscheidung 4 ist die Seite aber eine leere Hülle, die Titel, Zeiten und Räume über `/api/conference` lädt. Die Startseite ist vorgerendert und bringt ihre Daten mit, sie ruft `/api/conference` nicht auf. Wer nur die Startseite besucht hat, hätte offline die IDs, aber keine Daten dazu.

#### Optionen

**Option 1: Nichts zusätzlich tun.** „Mein Programm“ funktioniert offline nur, wenn es zuvor online geöffnet wurde.

**Option 2: `/api/conference` vorab speichern (Precache).** Sofort verfügbar, aber dann Cache-First und damit im Widerspruch zu Entscheidung 6.

**Option 3: `/api/conference` einmal abrufen, sobald der Service Worker aktiv ist.** Die Antwort landet über die Stale-While-Revalidate-Regel im Cache.

#### Entscheidung

Wir wählen Option 3 (Plugin `app/plugins/pwa-warm-up.client.ts`) und speichern zusätzlich die Seite selbst vorab (Entscheidung 5). So bleibt es bei einer Strategie für die Konferenzdaten, und „Mein Programm“ funktioniert nach einem einzigen Online-Besuch offline.

#### Konsequenzen

Gemerkte Sessions erscheinen offline mit Titel, Zeit und Raum, auch nach einem Neuladen der Seite. Die Daten sind so aktuell wie der letzte Abruf mit Verbindung.

### Entscheidung 8: Verhalten bei nicht gespeicherten Seiten
#### Kontext

Ruft jemand offline eine Seite auf, die nie online geöffnet wurde und nicht vorab gespeichert ist, kann der Service Worker sie nicht liefern. Das betrifft vor allem direkt aufgerufene Session-Seiten, etwa über ein Lesezeichen oder einen geteilten Link. Dokument 02 legt fest, dass in diesem Fall nicht die Fehlerseite des Browsers erscheinen soll.

#### Optionen

**Option 1: Browser-Fehlerseite.** Kein Aufwand, die App wirkt aber kaputt und bietet keinen Weg zurück.

**Option 2: Nuxt-Seite `/offline`.** Eine eigene Seite mit Header, Navigation und Link zu „Mein Programm“, beim Build vorgerendert und vorab gespeichert.

**Option 3: Einfache HTML-Datei.** Unabhängig von Nuxt, Header und Navigation müssten aber von Hand nachgebaut werden.

#### Entscheidung

Wir wählen Option 2. Die Seite fügt sich ins Design ein und führt zu „Mein Programm“, das auch offline funktioniert. Eine letzte Regel für alle Seitenaufrufe liefert sie aus, wenn das Netz nicht antwortet. Die Rückfall-Logik ist als Baustein `offlineFallback` angelegt, den auch die Regel für die Session-Seiten nutzt.

#### Konsequenzen

Statt eines Fehlers sieht man einen verständlichen Hinweis im Design von Ctrl Alt Meet. Lücke: Nuxt stellt die Adresse nach dem Laden von der aufgerufenen Seite auf `/offline` um, weil die Seite für diese Route vorgerendert ist. Ist man wieder online, lädt F5 deshalb die Offline-Seite statt der gewünschten Session. Der Text verweist daher auf die Navigation. Option 3 hätte die Adresse behalten, wir gewichten das einheitliche Design höher.

---

## Testszenarien

**Testumgebung**

| | Person 1 (Verena Schwendinger) | Person 2 (Franziska Reichhold) |
|---|---|---|
| Betriebssystem | Windows 11 Enterprise (Build 26300) | Windows 11 Home (Build 26300) |
| Browser | Google Chrome (Version 157.0.8103.79) | Google Chrome (Version 157.0.8103.79) |
| Besonderheiten | Projekt im OneDrive, Firmenlaptop | Projekt lokal auf dem Desktop, privater Laptop |

**Vorgehen bei allen Szenarien:** `npm run build` und `npm run preview`, Offline über DevTools → Network → „Offline“. Zum Zurücksetzen DevTools → Application → Storage → „Clear site data“. Bei Szenario i bleibt „Local and session storage“ dabei abgewählt, bei Szenario ii wird alles gelöscht, damit das Programm leer startet. Szenario iii läuft in einem Inkognito-Fenster.

### Szenario i: Session-Übersicht im Flugmodus

**Ausgangslage:** Cache und Service Worker sind zurückgesetzt. Die App wird online über die Startseite geöffnet und einmal neu geladen, danach wird `/sessions` über die Navigation aufgerufen.

**Aktion:** Offline schalten. `/sessions` mit F5 neu laden. Danach über die Navigation zur Session-Übersicht wechseln, einen Filter setzen und eine Session öffnen, die zuvor nicht angeklickt wurde. Zusätzlich eine nie besuchte Session und die Session-Übersicht direkt über die Adressleiste aufrufen.

**Beobachtetes Verhalten:**
- **Person 1:** Nach F5 auf `/sessions` erschien die Offline-Seite. Über die Navigation öffnete sich die Session-Übersicht dagegen vollständig, und der Filter nach Track funktionierte auch ohne Verbindung. Eine zuvor nie angeklickte Session öffnete sich innerhalb der App mit Zeit und Raum. Beim direkten Aufruf einer nie besuchten Session über die Adressleiste erschien wieder die Offline-Seite. Auch der direkte Aufruf von `/sessions` über die Adressleiste zeigte die Offline-Seite.
- **Person 2:** Gleiches Verhalten wie bei Person 1. Zusätzlich zeigte der Network-Tab, dass der Service Worker `/api/conference` aus dem Cache liefert („(ServiceWorker)“). Die Aktualisierung im Hintergrund schlug offline erwartungsgemäß fehl. Beim direkten Aufruf der nie besuchten Session wechselte die Adresse auf `/offline`.

**Ergebnis:** Teilweise bestanden. Über die Navigation funktioniert die Übersicht offline vollständig, auch mit Filtern und nie besuchten Sessions, weil die Daten über `/api/conference` aus dem Stale-While-Revalidate-Cache kommen (Entscheidung 6). Das Neuladen von `/sessions` führt zur Offline-Seite, weil die Seite selbst nur nach einem direkten Aufruf im Cache liegt (siehe Bekannte Lücken). Statt der Browser-Fehlerseite erscheint dabei die eigene Offline-Seite (Entscheidung 8). Das Verhalten war auf beiden Rechnern gleich.

**Belege:** siehe `04-verifikations-nachweis.md`

### Szenario ii: „Mein Programm“ offline

**Ausgangslage:** Cache, Service Worker und `localStorage` sind zurückgesetzt. Die App wird online über die Startseite geöffnet und einmal neu geladen, dann werden über die Navigation auf `/sessions` drei Sessions gemerkt. „Mein Programm“ wird online nicht geöffnet.

**Aktion:** Offline schalten. „Mein Programm“ über die Navigation öffnen, danach die Seite mit F5 neu laden. Zusätzlich die nie besuchte Session `/sessions/s19` direkt aufrufen und über den Link auf der Offline-Seite zu „Mein Programm“ wechseln.

**Beobachtetes Verhalten:**
- **Person 1:** Über die Navigation erschienen in „Mein Programm“ alle drei gemerkten Sessions mit Titel, Zeit und Raum. Nach F5 waren sie weiterhin vollständig sichtbar. Der direkte Aufruf von `/sessions/s19` zeigte die Offline-Seite, über deren Link öffnete sich „Mein Programm“ wieder mit allen drei Sessions.
- **Person 2:** Schon nach dem Besuch der Startseite lag `conference-data` im Cache. „Mein Programm“ zeigte offline alle gemerkten Sessions mit Titel, Zeit und Raum, auch nach F5. Der Link auf der Offline-Seite führte zu „Mein Programm“.

**Ergebnis:** Bestanden. „Mein Programm“ funktioniert nach dem ersten Online-Besuch offline, obwohl die Seite online nie geöffnet wurde. Die Seite liegt im Precache, die Daten kommen aus dem Cache, den das Plugin beim Start füllt (Entscheidung 7). Auch der Weg über die Offline-Seite führt zurück zu einem funktionierenden „Mein Programm“ (Entscheidung 8). Das Verhalten war auf beiden Rechnern gleich.

**Belege:** siehe `04-verifikations-nachweis.md`

### Szenario iii: Erstbesuch ohne vorheriges Online-Laden

**Ausgangslage:** Neues Inkognito-Fenster, also ohne Cache, Service Worker und `localStorage`. Die App wurde in diesem Fenster noch nie geöffnet.

**Aktion:** Im leeren Tab die DevTools öffnen, unter Network auf „Offline“ schalten, dann `localhost:3000` aufrufen.

**Beobachtetes Verhalten:**
- **Person 1:** Der Browser zeigte seine eigene Fehlerseite „Keine Internetverbindung“ mit dem Dinosaurier. Von der App erschien nichts, auch nicht die Offline-Seite.
- **Person 2:** Gleiches Verhalten wie bei Person 1. Ein Versuch im normalen Fenster nach „Clear site data“ zeigte dagegen die Fehlerseite 500 der App („Konferenzdaten nicht verfügbar“). „Clear site data“ löscht den HTTP-Cache nicht, Chrome baute die Seite aus alten Dateien auf, die Daten fehlten aber. Deshalb läuft das Szenario im Inkognito-Fenster.

**Ergebnis:** Erwartetes Verhalten, bewusster Grenzfall. Ohne einen ersten Online-Besuch ist kein Service Worker installiert, der antworten könnte, deshalb zeigt der Browser seine eigene Fehlerseite. Auch die Offline-Seite von Ctrl Alt Meet kann nicht erscheinen, weil sie selbst erst mit dem Service Worker gespeichert wird. Das ist akzeptabel, weil jede Web-App einmal online geladen werden muss. Für die Konferenz heißt das, die App vor der Anreise oder im Hotel-WLAN einmal zu öffnen oder zu installieren.

**Belege:** siehe `04-verifikations-nachweis.md`

---

## Bekannte Lücken

- **Schriften beim ersten Besuch:** Der Browser lädt die Google Fonts, bevor der Service Worker aktiv ist. Sie landen erst beim zweiten Laden im Cache, vorher erscheint offline eine Ersatzschrift (Entscheidung 5).
- **Adresse der Offline-Seite:** Nach dem Laden wechselt die Adresse von der aufgerufenen Seite auf `/offline`. Mit Verbindung lädt F5 deshalb die Offline-Seite statt der gewünschten Seite (Entscheidung 8).
- **Raumänderungen offline:** Änderungen während der Offline-Phase erscheinen erst nach der nächsten Verbindung (Entscheidung 6).
- **Erstbesuch ohne Netz:** Ohne Service Worker zeigt der Browser seine Fehlerseite (Szenario iii).
- **Neuladen der Session-Übersicht:** Wurde `/sessions` online nur über die Navigation geöffnet, ist die Seite selbst nicht im Cache. Offline führt F5 dann zur Offline-Seite, über die Navigation öffnet sie sich weiterhin (Entscheidung 6).

## Nachträge und Abweichungen
### Neue Route `/offline` (Ergänzung zur Rendering-ADR)

Für Entscheidung 8 kommt die Route `/offline` hinzu. Sie wird mit `prerender: true` beim Build erzeugt (SSG), damit der Service Worker sie vorab speichern kann. Die Rendering-Entscheidungen 1 bis 4 bleiben unverändert.

### Ort der Caching-Regeln

Die Angabe nennt `src/...` als Ort für Service Worker und Caching-Regeln. Mit `@vite-pwa/nuxt` schreiben wir den Service Worker nicht selbst. Alle Regeln stehen in `nuxt.config.ts` unter `pwa.workbox`, jede mit einem Kommentar, der auf den zugehörigen Abschnitt in Dokument 02 verweist. Beim Build erzeugt Workbox daraus `sw.js`. Das Manifest entsteht ebenfalls aus `nuxt.config.ts` (`pwa.manifest`) und wird als `manifest.webmanifest` ausgeliefert.

### Server-Route unter `npm run preview` (Korrektur zu Schritt 2)

Beim Testen lieferte `/api/conference` unter `npm run preview` den Status 500, weil der Server dort im Ordner `.output` startet und die Datendatei relativ dazu nicht fand. Die Server-Route sucht die Datei jetzt im Projektordner und eine Ebene darüber. Mit `npm run dev` und `node .output/server/index.mjs` war der Fehler nicht aufgetreten. Damit funktioniert auch die ISR-Simulation aus Entscheidung 2 im laufenden Preview-Server.

### Zeitänderungen beim Wechsel innerhalb der App (Änderung zu Schritt 2)

Die Rendering-ADR beschreibt, dass `useConferenceData()` die Daten bei jedem Seitenwechsel neu von `/api/conference` lädt und eine Zeitänderung dadurch sofort erscheint. Mit dem Service Worker greift dort jetzt Stale-While-Revalidate (Entscheidung 6). Die erste Antwort kommt aus dem Cache, die aktualisierte Fassung erst beim nächsten Aufruf. Eine Zeitänderung erscheint damit um einen Seitenwechsel verzögert. Für den Zeitplan einer Konferenz reicht das, dafür funktioniert der Wechsel auch bei schlechtem WLAN sofort.

---

_Zuletzt aktualisiert: 2026-11-14_