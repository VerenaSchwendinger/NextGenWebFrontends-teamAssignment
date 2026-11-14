# 01 – PWA-Setup
 
_Tooling, Manifest-Werte und Begründung der Icon- und Farbwerte für Ctrl Alt Meet als installierbare App._
 
---
 
## Übersicht
 
Dieses Dokument beschreibt Werkzeug, Manifest-Werte, Icons und Farben der PWA und begründet die Wahl.
 
## Kernaussagen
 
- `@vite-pwa/nuxt` erzeugt Manifest und Service Worker beim Build.
- Die App öffnet sich im eigenen Fenster ohne Adressleiste.
- Icons und Farben stammen aus unseren Design Tokens.

## Umsetzung
### Werkzeug
 
Wir verwenden das Nuxt-Modul `@vite-pwa/nuxt`. Es erzeugt das Manifest (Steckbrief der App) und den Service Worker (Skript, das Anfragen abfängt und Inhalte offline bereitstellt) und registriert ihn automatisch. Das Modul bringt Workbox mit, eine Bibliothek mit fertigen Caching-Strategien (siehe Dokument 02). Ein selbst geschriebener Service Worker wäre mehr Code ohne Mehrwert.
 
### Manifest
 
Die App heißt „Ctrl Alt Meet“, öffnet sich als eigenständiges Fenster (`standalone`) und startet auf der Startseite. Eine feste `id` hält die installierte App eindeutig erkennbar, auch wenn sich die Start-URL ändert.
 
### Icons und Farben
 
Die Icons in 192 und 512 px erzeugt `@vite-pwa/assets-generator` aus `public/logo.svg`, dazu eine Variante mit Sicherheitsrand, die Android beim Zuschneiden nicht abschneidet. Das Motiv, eine Taste mit Ctrl-Zeichen, greift den verspielt-technischen Markenwert aus Dokument 01 auf.
 
`theme_color` ist Forest Code (`--color-action`) und färbt die Fensterleiste, `background_color` ist Mint Fog (`--color-bg`) und füllt den Startbildschirm. Da das Manifest keine CSS-Variablen versteht, stehen dort die Hex-Werte der Tokens.
 
---
 
_Zuletzt aktualisiert: 2026-11-11_