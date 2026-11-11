# 01 – PWA-Setup

_Tooling, Manifest-Werte und Begründung der Icon- und Farbwerte für Ctrl Alt Meet als installierbare App._

---

## Übersicht

Wir verwenden das Nuxt-Modul `@vite-pwa/nuxt`. Es erzeugt beim Build automatisch das Manifest (die Steckbrief-Datei der App) und den Service Worker (ein Skript, das im Hintergrund Anfragen abfängt und Inhalte offline bereitstellt). Außerdem bringt es Workbox mit, eine Bibliothek mit fertigen Caching-Strategien, die wir für die Offline-Regeln brauchen (siehe Dokument 02). Die Icons erzeugt `@vite-pwa/assets-generator` aus `public/logo.svg`.


## Kernaussagen

- Die App heißt „Ctrl Alt Meet“, öffnet sich ohne Adressleiste im eigenen Fenster (`standalone`) und startet auf der Startseite.
- Icons gibt es in 192 und 512 px, dazu eine Variante mit Sicherheitsrand, damit Android das Icon beim Zuschneiden nicht abschneidet.
- Fensterleiste (`theme_color`) und Startbildschirm (`background_color`) nutzen Forest Code und Mint Fog aus unseren Tokens. Da das Manifest keine CSS-Variablen versteht, stehen dort die Hex-Werte.
- Das Icon zeigt eine Taste mit Ctrl-Zeichen, passend zum verspielt-technischen Markenkonzept aus Dokument 01.


---

_Zuletzt aktualisiert: 2026-11-11_