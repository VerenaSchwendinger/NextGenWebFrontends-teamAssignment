# 01 – Branding & Design Tokens

_Markenkonzept von Ctrl Alt Meet und Aufbau unseres Design-Tokens-Sets._

---

## Übersicht

Dieses Dokument legt die visuelle Identität unserer Plattform fest und begründet, wie unsere Design Tokens aufgebaut sind. Es richtet sich an unser Team und an alle, die später Komponenten bauen: Wer eine Farbe, einen Abstand oder eine Schriftgröße braucht, findet hier die verbindlichen Werte. Die Tokens selbst liegen in `/tokens/tokens.css`.

## Kernaussagen

- Ctrl Alt Meet stellt die Speaker in den Mittelpunkt und versteht sich als Shortcut durch das Programm.
- Alle Text/Hintergrund-Paare erfüllen WCAG AA (mindestens 4.5:1).
- Primitive und semantische Tokens sind getrennt, damit ein späteres Dark Theme ohne Strukturbruch möglich ist.

## Markenkonzept

Ctrl Alt Meet ist der Shortcut durch die FrontendNow. Statt eines langen Programmhefts stellen wir die Menschen hinter den Vorträgen in den Mittelpunkt: Wer wissen will, welche Speaker zu den eigenen Themen passen, findet sie in wenigen Klicks und stellt sich daraus sein Programm zusammen. Wie ein Tastenkürzel soll die Plattform der schnellste Weg zum Ziel sein.

Markenwerte: schnell, klar, verspielt-technisch. Das zeigt sich in Tags im Keycap-Look und in Monospace-Schrift für Uhrzeiten und Räume.

## Farbpalette

Unsere Markenfarben sind Forest Code (`#075E46`) und Mint Fog (`#E8FFF2`). Ergänzt werden sie durch Deep Forest (Text), Moss Grey (sekundärer Text), Signal Amber (Akzent für „Im Programm“) und Rust (Warnung bei Überschneidungen).

Kontrastprüfung (Vordergrund auf Hintergrund, Grenzwert WCAG AA 4.5:1 und WCAG AAA 7:1):

- Deep Forest `#0B2A22` auf Mint Fog `#E8FFF2`: 14.62:1 (AA✅, AAA✅)
- Forest Code `#075E46` auf Mint Fog `#E8FFF2`: 7.41:1 (AA✅, AAA✅)
- Weiß `#FFFFFF` auf Forest Code `#075E46` (Button): 7.78:1 (AA✅, AAA✅)
- Weiß `#FFFFFF` auf Forest Dark `#054A37` (Button-Hover): 10.28:1 (AA✅, AAA✅)
- Moss Grey `#4B635A` auf Weiß `#FFFFFF` (Metadaten): 6.49:1 (AA✅, AAA❌)
- Moss Grey `#4B635A` auf Mint Fog `#E8FFF2` (Metadaten auf Seitenhintergrund): 6.19:1 (AA✅, AAA❌)
- Deep Forest `#0B2A22` auf Signal Amber `#FBBF24` (Badge): 9.19:1 (AA✅, AAA✅)
- Rust `#B45309` auf Weiß `#FFFFFF` (Warnung auf Karte): 5.02:1 (AA✅, AAA❌)
- Rust `#B45309` auf Mint Fog `#E8FFF2` (Warnung): 4.78:1 (AA✅, AAA❌)

Geprüft mit dem WebAIM Contrast Checker. 

Alle Paare erfüllen das geforderte AA-Niveau, Fließtext und Buttons zusätzlich AAA. Moss Grey und Rust verwenden wir nur für kurze Metadaten und Hinweise, dafür reicht AA.

Daraus folgen zwei Regeln: Signal Amber nur als Fläche mit dunklem Text, Forest Code nie auf dunklem Hintergrund.

`--color-border` ist rein dekorativ, Eingabefelder erhalten Ränder in Moss Grey (6.49:1, WCAG 1.4.11).

## Spacing & Typografie

Die Spacing-Skala basiert auf 4 px (4, 8, 12, 16, 24, 32, 48, 64). Kleine Stufen erlauben feine Abstände in Tags, große gliedern Karten und Seitenabschnitte.

Die Typografie-Skala folgt dem Verhältnis 1.25 mit 16 px Basis (12–39 px). Mit 1.2 lägen Kartentitel und Fließtext zu nah beieinander, mit 1.333 würden Überschriften mobil zu dominant. Alle Größen sind in rem angegeben, damit sie mit der Browser-Schriftgröße skalieren. Fließtext erhält eine Zeilenhöhe von 1.5 (WCAG 1.4.12), Überschriften 1.2. Wir verwenden Space Grotesk für Überschriften, Inter für Fließtext und JetBrains Mono für Zeiten und Tags.

## Token-Architektur

Primitive Tokens enthalten Rohwerte ohne Bedeutung (`--green-700`), semantische Tokens beschreiben den Verwendungszweck (`--color-action`, `--text-session-title`). Komponenten greifen ausschließlich auf semantische Tokens zu.

- Wartbarkeit: Jeder Wert ist genau einmal definiert. Eine Farbänderung betrifft nur ein Token.
- Theming-Erweiterbarkeit: Ein Dark Theme überschreibt in `[data-theme="dark"]` nur semantische Farb-Tokens. Komponenten bleiben unverändert.
- Konsistenz: Feste Skalen verhindern Zufallswerte wie `13px` oder abweichende Grüntöne.
- Lesbarkeit im Code: `var(--color-warning)` sagt aus, wofür eine Farbe steht, `#B45309` nicht.


Verworfene Alternativen: Nur primitive Tokens wären einfacher, ein Theme-Wechsel müsste dann aber jede Komponente anfassen. Tailwind haben wir verworfen, weil es eine zusätzliche Abhängigkeit wäre. CSS Custom Properties statt SCSS-Variablen wählen wir, weil sie zur Laufzeit überschreibbar sind und ein Theme-Wechsel so ohne Neu-Build funktioniert.

---

_Zuletzt aktualisiert: 2026-10-08_