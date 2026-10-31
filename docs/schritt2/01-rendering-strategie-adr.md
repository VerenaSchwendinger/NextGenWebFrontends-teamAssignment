# 01 – Rendering-Strategie-ADR

_Welcher Teil von Ctrl Alt Meet wo und wann gerendert wird._

---

## Übersicht

Dieses ADR legt für jeden der vier Anwendungsteile fest, ob er per SSG, CSR, SSR oder ISR gerendert wird. Wir entscheiden nicht fürs ganze Projekt, sondern pro Seitentyp, und zwar anhand der Daten, die dort angezeigt werden. Ändert sich der Inhalt zur Laufzeit nie, reicht SSG. Ändert er sich, ist aber für alle gleich, kommen SSR oder ISR in Frage. Ist er personalisiert und liegt nur im Browser, bleibt nur CSR. Dazu wägen wir ab, ob die Seite bei Google gefunden werden soll und wie viel Serverarbeit pro Aufruf entsteht.

## Kernaussagen

- Speaker-Profile rendern wir statisch beim Build (SSG).
- Session-Detailseiten und die Session-Übersicht werden gecacht und regelmäßig neu gebaut (ISR, umgesetzt mit `swr: 60`).
- Bei der Übersicht weichen wir von der im Szenario nahegelegten Zuordnung SSR ab, gefiltert wird nach Track, Tag und Level im Browser.
- „Mein Programm“ rendert nur im Browser (CSR), weil die gemerkten Sessions ausschließlich im `localStorage` liegen.
- Alle Seiten beziehen ihre Daten über `useConferenceData()` als einzige Datenschicht. Diese liest den Datensatz zur Laufzeit über eine Server-Route (Abweichung von Dokument 03, siehe Nachträge).

## Entscheidungen
### Entscheidung 1: Speaker-Profile
#### Kontext
 
Ein Profil zeigt Name, Titel, Firma, Bio und die Sessions der Person. Die Daten stammen aus `conference-data.json` und stehen vor der Konferenz fest. Gepflegt werden sie von der Redaktion, nicht von Besucher:innen. Die Seiten sind öffentlich und werden gegoogelt oder auf LinkedIn geteilt.
 
#### Optionen
 
**Option 1: SSG.** Nuxt erzeugt das HTML einmal beim Build, danach liefert der Host statische Dateien aus. Das ist am schnellsten und braucht keinen Server, eine Änderung erfordert aber einen neuen Build.
 
**Option 2: SSR.** Der Server baut das Profil bei jedem Aufruf neu. Änderungen wären sofort sichtbar, kosten aber Rechenzeit für Daten, die sich praktisch nie ändern.
 
#### Entscheidung
 
Wir wählen SSG (`prerender: true`). Zur Laufzeit ändert sich an einem Profil nichts. Korrigiert die Redaktion eine Bio, stößt sie einen neuen Build an, was selten vorkommt.
 
#### Konsequenzen
 
Profile laden am schnellsten, und Titel, Inhalt und Meta-Tags stehen im Quelltext. Weil die Profile eingefroren sind, zeigen wir die Sessions nur mit Titel und Link, ohne Uhrzeit und Raum, sonst wären diese nach einer Zeitplanänderung veraltet. Statt der `SessionCard` aus ADR 02 nutzen wir dafür eine reduzierte Darstellung. Die Sessions eines Speakers leiten wir aus `sessions[].speakerIds` ab, damit es nur eine Quelle für die Zuordnung gibt. Damit beim Build sicher alle 18 Profile entstehen, tragen wir sie in `nuxt.config.ts` explizit als Prerender-Routen ein.

### Entscheidung 2: Session-Detailseiten
#### Kontext
 
Eine Detailseite unter `/sessions/:id` zeigt Titel, Abstract, Speaker, Zeit und Raum. Titel und Abstract bleiben gleich, Zeit und Raum können sich aber kurzfristig ändern, etwa durch einen Raumtausch. Die Seite ist für alle gleich und öffentlich. Am Konferenztag rufen viele Personen dieselbe Seite gleichzeitig auf, zum Beispiel über QR-Codes an den Raumtüren.
 
#### Optionen
 
**Option 1: SSG.** Schnell, aber eine Zeitänderung wäre erst nach dem nächsten Build sichtbar.
 
**Option 2: SSR.** Immer aktuell, aber der Server baut dieselbe Seite bei jedem der vielen Aufrufe neu.
 
**Option 3: ISR.** Die Seite wird gecacht und nach einem Intervall im Hintergrund neu gebaut.
 
#### Entscheidung
 
Wir wählen ISR mit 60 Sekunden. Die Option `isr` funktioniert nur auf Hosts wie Vercel oder Netlify, deshalb setzen wir das Prinzip mit `swr: 60` um. Anders als echtes ISR entsteht die Seite beim ersten Aufruf, nicht beim Build. Damit eine Änderung ohne neuen Build ankommt, liest die Server-Route `/api/conference` den Datensatz zur Laufzeit (siehe Nachträge). Zur Simulation ändern wir im laufenden Preview-Server eine Uhrzeit in `conference-data.json`.
 
#### Konsequenzen
 
Die Seite ist fast so schnell wie SSG und trotzdem aktuell. Nach Ablauf der 60 Sekunden erhält der nächste Aufruf noch die alte Fassung und stößt den Neubau an, erst der folgende zeigt die neue Zeit. Für einen Zeitplan reicht das. Der Cache greift nur im Production-Build (`npm run build` und `npm run preview`). Das gecachte HTML enthält keine persönlichen Daten, weil „Mein Programm“ laut Dokument 03 erst im Browser befüllt wird. Programm-Button und Zähler im Header funktionieren daher auch auf gecachten Seiten.

### Entscheidung 3: Session-Übersicht mit Filtern
#### Kontext
 
Die Übersicht unter `/sessions` zeigt alle 20 Sessions und lässt sich nach Track, Konferenztag und Level filtern, kombiniert per UND-Verknüpfung. Die Liste ist für alle gleich, kann sich aber wie die Detailseiten ändern. Sie ist der wichtigste Einstieg über Google. Die Filter wählen nur aus, was schon geladen ist.
 
#### Optionen
 
**Option 1: SSR.** Der Server baut die Liste bei jedem Aufruf, auch für jede Filterkombination.
 
**Option 2: CSR.** Der Server schickt eine leere Hülle, der Browser lädt alle Sessions und filtert selbst.
 
**Option 3: ISR mit Filtern im Browser.** Die ungefilterte Liste wird gecacht ausgeliefert, die Filter laufen nach der Hydration im Browser.
 
#### Entscheidung
 
Wir wählen Option 3 und weichen damit vom Szenario ab, das hier SSR nahelegt. Weil die Liste für alle gleich ist, würde SSR bei jedem Aufruf dasselbe HTML neu bauen. Das Filtern von 20 Sessions erledigt der Browser ohne spürbare Verzögerung. CSR scheidet aus, weil Google sonst nur ein leeres `<div>` sieht. Die Filterlogik liegt headless in `useSessionFilter()` (ADR 02).
 
#### Konsequenzen
 
Alle Sessions stehen im ersten HTML, und Filtern braucht keine Netzwerk-Anfrage. Wer einen gefilterten Link wie `?track=rendering-performance` teilt, sieht kurz die ganze Liste, bis die Filter nach der Hydration greifen. Das nehmen wir in Kauf. Zeitänderungen erscheinen wie bei den Detailseiten mit etwas über 60 Sekunden Verzögerung.

### Entscheidung 4: „Mein Programm“-Dashboard
#### Kontext
 
„Mein Programm“ zeigt die Sessions, die eine Person gemerkt hat. Welche das sind, steht nur im `localStorage` ihres Browsers, es gibt kein Login und keine Datenbank. Die Seite ist für jede Person anders und soll nicht bei Google erscheinen.
 
#### Optionen
 
**Option 1: SSR.** Der Server kann `localStorage` nicht lesen. Er könnte nur eine leere Liste rendern, außer wir schreiben die gemerkten IDs zusätzlich in ein Cookie.
 
**Option 2: CSR.** Der Browser liest `localStorage`, holt die Session-Daten über `useConferenceData()` und baut die Liste selbst.
 
#### Entscheidung
 
Wir wählen CSR (`ssr: false`). Die entscheidenden Daten existieren nur im Browser, also wird auch dort gerendert. Mit SSR würde der Server zunächst eine leere Liste mit dem Hinweis „Noch keine Sessions gemerkt“ schicken, die sich nach der Rehydration aus Dokument 03 plötzlich füllt. Einen Hydration-Mismatch verhindert unser Plugin zwar, der falsche Zwischenzustand bliebe aber sichtbar. Ein Cookie würde das lösen, wäre aber eine zweite Persistenzschicht, die wir sonst nicht brauchen.
 
#### Konsequenzen
 
Der Server arbeitet pro Aufruf nicht und erhält keine persönlichen Daten. Bis das Programm aus dem localStorage gelesen ist, zeigt die Seite einen Ladehinweis statt einer leeren Liste. Die Seite ist bewusst nicht indexierbar (`noindex`). Zeit und Raum kommen aus derselben Datenschicht wie bei den Detailseiten. Eine Zeitplanänderung erscheint deshalb auch hier, und die gemerkten Sessions bleiben über einen Reload hinweg erhalten.

## Umsetzung
 
Die vier Entscheidungen stehen zentral in `nuxt.config.ts`:

```ts
import data from './app/data/conference-data.json'

export default defineNuxtConfig({
  routeRules: {
    '/':            { prerender: true },                    // SSG, Startseite
    '/speakers':    { prerender: true },                    // SSG, Liste aller Speaker
    '/speakers/**': { prerender: true },                    // SSG, Profile
    '/sessions':    { swr: 60, prerender: false },                            // ISR-Prinzip, Übersicht
    '/sessions/**': { swr: 60, prerender: false },          // ISR-Prinzip, nie statisch
    '/my-program':  { ssr: false, headers: { 'x-robots-tag': 'noindex' } }, // CSR
  },
  nitro: {
    prerender: {
      // alle 18 Profile explizit, unabhängig vom Crawler
      routes: ['/speakers', ...data.speakers.map((s) => `/speakers/${s.id}`)],
    },
  },
})
```

`prerender: false` verhindert, dass der Prerender-Crawler Seiten statisch erzeugt, die er über Links auf vorgerenderten Seiten findet: die Detailseiten über die Speaker-Profile sowie Übersicht und „Mein Programm“ über die Navigation im Header. Sonst läge eine statische Datei vor, und `swr: 60` bzw. `ssr: false` würden nicht greifen. Alle Seiten lesen ihre Daten ausschließlich über `useConferenceData()`, das sie von `/api/conference` lädt. Keine Seite liest `conference-data.json` selbst. So bleibt die Rendering-Strategie austauschbar, ohne dass sich die Datenschicht ändert.

## Nachträge und Abweichungen
### Datenschicht liest zur Laufzeit (Abweichung von Dokument 03)

Dokument 03 sah vor, `conference-data.json` beim Build einzubinden. Bei der Umsetzung von Entscheidung 2 zeigte sich, dass die Daten damit im Bundle eingefroren sind. Eine Änderung im laufenden Preview-Server käme nie an, die ISR-Simulation wäre wirkungslos. Deshalb liest die Server-Route `/api/conference` die Datei zur Laufzeit aus `app/data/`, und `useConferenceData()` lädt sie von dort. Das Composable liefert weiterhin Sessions, Speaker und Lookups, ist aber asynchron, die Seiten rufen es daher mit `await` auf. Das Plugin `my-program.client.ts` und `useMyProgram()` greifen über `useNuxtData('conference')` auf denselben, bereits von `useConferenceData()` geladenen Datensatz zu, statt eine eigene Datenquelle aufzubauen. Nur wenn die aktuelle Seite den Datensatz noch nicht geladen hat, holt das Plugin ihn einmalig selbst von `/api/conference`, um gespeicherte IDs zu prüfen.

### Daten beim Seitenwechsel neu laden

Vorgerenderte Speaker-Seiten enthalten die Daten vom Build. Damit sie beim Weiterklicken keine veralteten Zeiten an die Session-Seiten weitergeben, verwendet `useConferenceData()` gecachte Daten nur beim ersten Laden (`getCachedData`) und lädt bei jedem Seitenwechsel neu. Daraus folgt für die ISR-Simulation: Die Verzögerung von bis zu 60 Sekunden gilt nur beim direkten Aufruf oder Neuladen einer Session-Seite, weil der Server dann die gecachte Fassung liefert. Wer innerhalb der App navigiert, erhält die Daten direkt von `/api/conference` und sieht eine Zeitänderung sofort. Für die Simulation laden wir die Seite deshalb direkt neu.

### Neuer Ordner `server/` (Ergänzung zu ADR 02)

Für die Server-Route kommt auf oberster Ebene der Ordner `server/api/` hinzu, den der Ordnerbaum in ADR 02 noch nicht enthält.

---

_Zuletzt aktualisiert: 2026-10-31_