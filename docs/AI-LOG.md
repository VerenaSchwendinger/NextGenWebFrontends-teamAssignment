# AI-Log Schritt 1

_Einsatz von KI (Claude, Anthropic) bei der Planung von Ctrl Alt Meet._

---

## Wofür wir KI genutzt haben

Für Entwürfe, zur Fehlersuche in unseren Dokumenten und für Startcode des Grundgerüsts. Alle Entscheidungen (Teamname, Markenkonzept, Farben, Nuxt als Setup) haben wir als Team getroffen. KI-Vorschläge haben wir gelesen, geprüft und angepasst, bevor wir sie übernommen haben.

---

### ADR 04, Nuxt Setup

**Prompt:** „Wir entscheiden uns für Nuxt. Gibt es Fehler oder Verbesserungen in unseren Dokumenten? Bitte die offenen Teile ergänzen.“
**Übernommen:** Vorschlag für Entscheidung und Konsequenzen sowie den Hinweis, Rendering-Strategien aus der Pro-und-Contra-Abwägung zu entfernen.
**Geändert/verstanden:** Team-Erfahrung selbst formuliert, Version auf Nuxt 4 präzisiert und auf 400 Wörter gekürzt. Verstanden, dass ADR D nur Setup und Tooling abdeckt und Rendering erst in Schritt 2 folgt.

### Dokument 03

**Prompt:** „Verbesserungen für unser State-Management-Konzept?“
**Übernommen:** Abschnitt „Verworfene Alternativen“ (volle Objekte, Pinia, `ref` auf Modulebene, `sessionStorage`).
**Geändert/verstanden:** Auf vier Alternativen beschränkt und die Wortgrenze geprüft. Verstanden, dass ein `ref` auf Modulebene in Nuxt serverseitig zwischen Anfragen geteilt würde.

## Tokens-Architektur

**Prompt:** „Fehler oder Verbesserungen in Dokument 01 und `tokens.css`?“
**Übernommen:** Zwei fehlende Kontrastpaare, Hinweis auf 3:1 für Eingabefelder (WCAG 1.4.11), konkrete Zuordnungen im Dark-Theme-Block.
**Geändert/verstanden:** Werte mit dem WebAIM Contrast Checker gegengeprüft. Dark-Theme-Block bleibt auskommentiert und als ungeprüfter Entwurf markiert. Verstanden, dass ein Theme nur semantische Tokens umbiegt und Primitive unverändert bleiben.

### Grundgerüst

**Prompt:** „Bitte Code für das Grundgerüst.“
**Übernommen:** `nuxt.config.ts` (Tokens global, `pathPrefix: false`), `app.vue`, `BaseTag`, `AppHeader`, `AppFooter`, `useConferenceData`, Startseite.
**Geändert/verstanden:** Typen an die echte Struktur von `conference-data.json` angepasst, Fehler im App-Wrapper behoben und mit `npm run dev` getestet (20 Sessions, 18 Speaker, 5 Tracks).

### ADR 02 und Sequenzdiagramm

**Prompt:** „Ist ADR 02 / Dokument 03 so richtig?“
**Übernommen:** Nuxt-Ordnerbaum mit `app/`, Benennungsregeln, Komponententabelle, Plugin als eigener Teilnehmer im Diagramm.
**Geändert/verstanden:** Formulierungen selbst angepasst. Verstanden, dass Text und Diagramm dieselbe Verantwortung zeigen müssen (wer liest und schreibt den `localStorage`) und das Grundgerüst exakt der dokumentierten Struktur entsprechen muss.