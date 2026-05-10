# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deployment

Static GitHub Pages site — no build step, no package manager, no dependencies to install. Deploy by pushing to `main`. All files are served as-is.

To preview locally:
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Repository structure

| Path | Purpose |
|---|---|
| `index.html` | Quiz di microeconomia (entry point del sito) |
| `quiz_economia_vino/` | Quiz aggiuntivi su economia vitivinicola, matematica finanziaria, bilancio |
| `survey_completo.html` | Survey completa sull'esperimento QR code (versione commentata) |
| `survey_completo_experiment.html` | Variante della survey (in sviluppo) |
| `SitoQR/` | Sito Bootstrap mockup usato come landing page scansionando i QR code |
| `V1_Favino.html` … `V5_Maturazione.html` | Pagine mockup per le 5 condizioni del QR (usano CSS/JS di SitoQR/) |
| `img/` | Immagini prodotto usate dalla survey |
| `Qrcode_experiement_design.txt` | Descrizione del disegno sperimentale |

## Quiz pages architecture

All quiz files share the same pattern (no framework):

- A `const questions = [...]` array where each item has `q` (text), `opts` (array of `{l, t}`), `correct` (letter), and `explain` (feedback).
- State tracked in module-level `let` vars: `current`, `answers[]`, `answered[]`.
- Core functions: `buildCards()` renders all cards into `#cards-container` (only one visible at a time via `.hidden`); `selectOpt(qi, letter)` records a selection; `confirmAnswer(qi)` locks the card and shows feedback; `navigate(dir)` moves between cards and triggers `showResults()` at the end; `restart()` resets everything.
- No quiz data lives outside the HTML file — each file is fully self-contained.

## Survey architecture (`survey_completo.html`)

Single-page app with a screen-routing pattern — no framework, no backend:

- **Global state**: one object `S` initialized by `initSession()`. Contains all participant data: `pid`, `condition`, `order`, `sequence`, `stimuli[]`, section responses, demographics.
- **Routing**: `const SCREENS = { name: screenFn, ... }`. `goTo(name)` and `goToStimulus(si)` inject HTML into `#app` via `innerHTML` and scroll to top. There is no URL routing.
- **Screen functions** (`screenWelcome`, `screenScreening`, `screenSectionB`, `screenFCQ`, `screenISD`, `screenTrust`, `screenStimulus(si)`, `screenPost`, `screenQRBasic`, `screenCNS`, `screenTAM`, `screenMavenism`, `screenDemographics`, `screenEnd`): each returns an HTML string; side effects (setting `checkDone`, registering timestamps) happen inside the function or its event handlers.
- **Form validation**: `checkDone` is a module-level variable reassigned by each screen to a closure that enables/disables the "Avanti" button. It is reset to `null` on every navigation.
- **Likert helpers**: `renderLikert()` (scale 1–n, optional group headers), `renderLikert0()` (scale 0–4 for ISD), `renderProdScales(si)` (scale per prodotto con id composto `btns-<si>-<item_id>`).
- **Persistence**: `saveData()` writes `S` to `localStorage['survey_<pid>']`. `downloadData()` generates a JSON file for the participant to download. There is no server-side storage.
- **Experiment design**: 2×3 mixed design. `condition` (between: tracciabilita / nutrizione / sostenibilita) and `order` (within: A = senza QR first, B = con QR first) are randomized in `initSession()`. The focal product appears twice in a 4-item sequence interleaved with fillers.
- **Dev mode**: append `?dev` to the URL to show a jump-bar at the bottom for skipping to any screen without filling the form.

## SitoQR landing pages

`SitoQR/` is a Bootstrap 5 + jQuery site. `main.js` handles navbar scroll behavior, back-to-top button, and a generic `initLoadMoreButton()` for paginated AJAX lists. `V1_Favino.html` … `V5_Maturazione.html` are static mockups that reference `./SitoQR/bootstrap.min.css` and `./SitoQR/style.css` — they must be served from the repo root to resolve those paths correctly.

## Adding a new quiz

1. Copy the closest existing quiz file.
2. Replace the `questions` array. Each entry: `{ q, opts: [{l, t}, ...], correct, explain }`.
3. Update `<title>` and the header text.
4. No other files need to change.
