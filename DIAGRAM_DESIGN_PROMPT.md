# Claude Design prompt — "The Build" drill diagrams

Paste this into Claude Design (claude.ai/design), then hand back the result. I'll drop each SVG into `data/diagrams.js` keyed by its drill id and it renders inside that drill's how-to popup and its Plan card.

---

Design a set of **small schematic drill diagrams** for an existing mobile app called **The Build** (a soccer skill-training tracker). These are tiny explainer illustrations — one per drill — shown at the top of each drill's how-to popup. Match the app's existing identity.

**Identity / palette (use exactly):**
- Paper/background: `#f4f2ec`; card: `#fbfaf5`; light green tint: `#e9efe6`
- Ink (lines): `#13110d`
- Pitch green (motion / ball path / arrows): `#1f6b3b`
- Brass (the one thing to focus on per drill): `#c79a52`
- Fonts: serif for any words is fine, but prefer **mono labels** (like Menlo) at ~9px, color `#6f6a5b`. Keep text to almost none.

**Format (important — same for all):**
- Each diagram is a **self-contained inline `<svg>` with `viewBox="0 0 240 150"`** (landscape). No external images, no raster, no `<image>` — pure vector so it inlines cleanly.
- Transparent background (the popup already supplies the green tint behind it). Optional faint lane/pitch outline in `#e9efe6`.
- **Line art only.** Feet/cones/wall in ink `#13110d` ~2px. Motion/paths/arrows in pitch green `#1f6b3b` ~2.5px with arrowheads. Ball = a small ink-outline circle (r≈7). Dashed green = "stay within this bound"; dotted green = the ball's travel path. Use **brass `#c79a52`** to highlight the single key thing (plant foot, target, weak foot, "current" marker).
- **Top-down** perspective for everything **except Juggling** (side view).
- Foot = a simple rounded shoe shape (top-down). Cone = small triangle. Wall = a thick ink bar. Keep all 12 the same visual weight so they read as one set.
- Minimal labels only where they truly help (e.g. `R`/`L`, `5 ft`, `STOP`, `~50%`) in mono 9px.

**Deliver each diagram labeled by its id** (e.g. an HTML comment `<!-- diagram: foundations -->` above each `<svg>`) so I can map them 1:1.

**The 12 diagrams (id → what to draw):**

1. `toeTaps` — ball centered; two shoes above it; alternating down-tap arrows onto the top of the ball; small `R`/`L` labels. Ball stays put.
2. `foundations` — ball between two shoes; green **double-headed horizontal arrow** (a pendulum) between the insides of the feet; **dashed green vertical lines** marking hip width the ball must stay inside.
3. `soleRolls` — one shoe with its sole on the ball; small green arrows showing roll **forward/back** and **side to side**.
4. `juggling` — **SIDE VIEW**: shoe at the bottom, ball above it with an up green arrow; a dashed bounce line down to the ground; a **brass dashed line marking knee height**.
5. `dribbleLaces` — top-down straight lane; a shoe pushing the ball ahead with a series of **small green dotted forward taps**; a **dashed green box = "one stride"** the ball stays within.
6. `coneWeave` — a row of **5 cones**; a green **serpentine ball path** weaving inside/outside them; a small shoe at the start.
7. `pullBack` — ball approaching a cone; a green **sole-drag-back** arrow, then a **180° curved arrow** turning away; two shoe positions (plant foot + dragging foot), plant foot highlighted brass.
8. `redLight` — straight lane; ball mid-travel (green dotted) then a bold **ink "STOP" bar** with the ball frozen under a sole; mono label `~50%`.
9. `pushPass` — the key coaching diagram: **plant foot beside the ball (highlighted brass) with its toe/an arrow pointing at a target**; kicking foot contacting the **inside** of the ball; a long green arrow to a target marker; a short follow-through arrow.
10. `wallClose` — a player-shoe **~5 ft** from an ink **wall**; a green **double arrow** ball→wall→back; mono label `5 ft`; inside-foot contact.
11. `firstTouch` — ball returning from the wall (green incoming arrow); a **cushioned touch redirecting it into space beside** the player (green angled out-arrow to a **brass "space" dot**).
12. `wallStepped` — like `wallClose` but **~8–10 ft** and at an **angle**; mono label `8–10 ft`; a small **brass "weak foot" marker**.

**Optional (fine to keep very simple or skip):**
- `smallSided` — a mini pitch with 3v3 dots and two goals.
- `soloUpkeep` — a brass **loop of 4 dots** labeled pass → move → touch → weak-foot.
- `feint` — a dribbler dropping a shoulder one way (green feint arrow) while the ball goes the other with the **outside of the far foot** (green ball arrow); a defender dot.

Return all diagrams together, each as its labeled inline SVG.
