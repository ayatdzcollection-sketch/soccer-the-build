# The Build — soccer skill training tracker

A static, mobile-first daily companion for a phase-by-phase adult-beginner soccer
program. It builds today's session from where you are, how much time you've got,
and the conditions; tracks completion, pain, and gate readiness in `localStorage`;
and never auto-advances you — it suggests, you confirm.

**Live:** https://ayatdzcollection-sketch.github.io/soccer-the-build/

## Stack
Plain HTML / CSS / JS (ES modules) — no framework, no build step. Deployed to
GitHub Pages from `main` at root. Everything is client-side; data lives only in
your browser (with file export/import for backups).

## Structure
```
index.html          shell + bottom/top nav mount
css/style.css        design system (cream / ink / pitch-green / brass)
js/app.js            routing + init + event delegation + info modal
js/state.js          localStorage load/save/migrate, export/import, reset
js/session.js        today's-session generator
js/gates.js          gate + promotion logic
js/render/*.js        one module per view (today, plan, progress, transfer, settings)
data/plan.js         all drill + phase content
data/transfer.js     running → soccer speedwork carryover
data/diagrams.js     schematic drill diagrams (inline SVG)
```

`DIAGRAM_DESIGN_PROMPT.md` documents how the drill diagrams were generated.
