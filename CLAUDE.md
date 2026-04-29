# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This is a multi-project GitHub folder, not a single repository. Each subdirectory is an independent project. The owner is an agricultural/environmental economist who uses this workspace for both teaching and research.

| Directory | Purpose | Language/Stack |
|---|---|---|
| `toniopap.github.io/` | GitHub Pages teaching site | HTML/CSS/JS (static) |
| `Replication_Risk/` | Farmer risk preference research | Python, Stata, R, Google Apps Script |
| `Optimization/` | Policy compliance optimization models | Python |
| `Vini/` | reveal.js fork for presentations | JS (Gulp build) |
| `Gemini/` | Minimal notes | — |

---

## toniopap.github.io

Static GitHub Pages site — no build step required. All quiz pages are self-contained HTML files with embedded CSS and JavaScript. Deploy by pushing to `main`.

- Quiz files follow the pattern `quiz_<topic>.html` — each is standalone and stateless (no backend)
- `SitoQR/` contains a Bootstrap-based subsite with QR code landing pages
- `provastataintopy.ipynb` demonstrates Stata-to-Python translation using the `mus03data` dataset

---

## Replication_Risk

Research project on farmer risk preferences using Multiple Price List (MPL) lottery elicitation. The pipeline spans three languages:

**Data flow:**
1. Google Form survey → Google Apps Script (`Gain_calculator.js`) computes payouts and emails respondents
2. Raw responses exported to `Italy_results.csv`
3. Stata (`Modelling/modelling.do`, `mid_point.do`) cleans and processes switch points from three lottery series (S1/S2/S3)
4. Python (`Modelling/t_table.py`) computes midpoint CPT parameters (σ, λ, γ) from `thresholds.csv` and outputs `t_table.csv`
5. R (`Modelling/RDStocsv.R`) converts `.RDS` exports to CSV

**Key data files** (large — `thresholds.csv`/`.dta` are ~50 MB):
- `thresholds.csv` — full CPT parameter grid indexed by (S1.point, S2.point, S3.point)
- `t_table.csv` — midpoint CPT parameters per switch-point combination
- `Italy_results.csv` — raw survey responses

**Lottery series:** S1 (12 rows, probabilities 0.3/0.1), S2 (14 rows, 0.9/0.7), S3 (7 rows, 0.5/0.5). Switch point 99 encodes "always A".

---

## Optimization/Biogas

Python model (`Biogas/Biogas.py`) analyzing farmer compliance decisions under the EU Nitrates Directive using Expected Utility Theory. Key parameters include Italian farmer risk aversion (σ = 0.193, sourced from doi:10.1002/aepp.13330), sanction probabilities, and land costs.

Run the script directly in a Python environment with `numpy`, `matplotlib`, `pandas`, and `scipy`:
```bash
python Biogas/Biogas.py
```

Output charts are saved to `Biogas/Grafici/`.

---

## Vini (reveal.js)

Fork of reveal.js 5.1.0 for presentations. Requires Node ≥ 18.

```bash
cd Vini
npm install        # first time only
npm start          # dev server with live reload
npm run build      # production build to dist/
npm test           # run QUnit tests via Puppeteer
```

Presentation content lives in `index.html`. Custom slides can use Markdown, LaTeX math, and code highlighting per reveal.js conventions.

---

## Common Tools & Languages

- **Python:** Uses cell-based scripts (marked with `#%%`) compatible with VS Code's Jupyter-style interactive runner. Standard scientific stack: `numpy`, `pandas`, `matplotlib`, `scipy`, `qrcode`.
- **Stata:** `.do` files use `cap cd` with both macOS and Windows paths to handle cross-machine portability.
- **R:** Minimal use (`.RDS` → CSV conversion only).
- **Google Apps Script:** `Gain_calculator.js` runs inside a Google Form trigger — it is not a Node.js file and cannot be run locally.
