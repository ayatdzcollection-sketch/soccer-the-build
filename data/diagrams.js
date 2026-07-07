// ============================================================
// data/diagrams.js — schematic drill diagrams (inline SVG),
// keyed by drill id. Copied 1:1 from the Claude Design mock
// (The Build.dc.html, DRILL DIAGRAMS section). Each is a
// self-contained viewBox="0 0 240 150" SVG; the popup/anatomy
// renders whichever ids are present and omits the rest.
// ============================================================

export const DIAGRAMS = {
  toeTaps: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="tt-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <g transform="translate(96,44) rotate(14)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <g transform="translate(144,44) rotate(-14)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <line x1="103" y1="76" x2="114" y2="90" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#tt-g)"></line>
  <line x1="137" y1="76" x2="126" y2="90" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" opacity=".4" marker-end="url(#tt-g)"></line>
  <circle cx="120" cy="102" r="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <text x="72" y="42" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">L</text>
  <text x="168" y="42" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">R</text>
</svg>`,
  foundations: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="fd-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <line x1="58" y1="26" x2="58" y2="124" stroke="#1f6b3b" stroke-width="1.75" stroke-dasharray="6 5"></line>
  <line x1="182" y1="26" x2="182" y2="124" stroke="#1f6b3b" stroke-width="1.75" stroke-dasharray="6 5"></line>
  <g transform="translate(78,68) rotate(16)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <g transform="translate(162,68) rotate(-16)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <line x1="94" y1="102" x2="146" y2="102" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-start="url(#fd-g)" marker-end="url(#fd-g)"></line>
  <circle cx="120" cy="102" r="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
</svg>`,
  soleRolls: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="sr-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <line x1="80" y1="92" x2="160" y2="92" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-start="url(#sr-g)" marker-end="url(#sr-g)"></line>
  <circle cx="120" cy="92" r="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <line x1="120" y1="108" x2="120" y2="136" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-start="url(#sr-g)" marker-end="url(#sr-g)"></line>
  <g transform="translate(120,52) rotate(180)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
</svg>`,
  juggling: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="jg-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <line x1="30" y1="132" x2="210" y2="132" stroke="#13110d" stroke-width="2" stroke-linecap="round"></line>
  <line x1="40" y1="88" x2="200" y2="88" stroke="#c79a52" stroke-width="1.5" stroke-dasharray="6 5"></line>
  <text x="44" y="82" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">knee height</text>
  <g transform="translate(112,120) rotate(-14)"><rect x="-24" y="-7" width="48" height="14" rx="7" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect></g>
  <line x1="128" y1="104" x2="132" y2="74" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#jg-g)"></line>
  <circle cx="136" cy="56" r="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <line x1="146" y1="66" x2="150" y2="128" stroke="#1f6b3b" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 6"></line>
</svg>`,
  dribbleLaces: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="dl-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <line x1="24" y1="38" x2="216" y2="38" stroke="#fbfaf5" stroke-width="3"></line>
  <line x1="24" y1="112" x2="216" y2="112" stroke="#fbfaf5" stroke-width="3"></line>
  <g transform="translate(46,75) rotate(90)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <rect x="68" y="50" width="88" height="50" rx="6" stroke="#1f6b3b" stroke-width="1.75" stroke-dasharray="6 5"></rect>
  <text x="112" y="44" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">one stride</text>
  <circle cx="88" cy="75" r="8" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <line x1="102" y1="75" x2="204" y2="75" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" marker-end="url(#dl-g)"></line>
</svg>`,
  coneWeave: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="cw-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <path d="M30 98 Q60 116 75 76 Q90 40 105 76 Q120 112 135 76 Q150 40 165 76 Q180 110 202 68" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#cw-g)"></path>
  <polygon points="53,82 67,82 60,64" fill="#fbfaf5" stroke="#13110d" stroke-width="2" stroke-linejoin="round"></polygon>
  <polygon points="83,82 97,82 90,64" fill="#fbfaf5" stroke="#13110d" stroke-width="2" stroke-linejoin="round"></polygon>
  <polygon points="113,82 127,82 120,64" fill="#fbfaf5" stroke="#13110d" stroke-width="2" stroke-linejoin="round"></polygon>
  <polygon points="143,82 157,82 150,64" fill="#fbfaf5" stroke="#13110d" stroke-width="2" stroke-linejoin="round"></polygon>
  <polygon points="173,82 187,82 180,64" fill="#fbfaf5" stroke="#13110d" stroke-width="2" stroke-linejoin="round"></polygon>
  <g transform="translate(28,120) rotate(48) scale(.8)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <circle cx="38" cy="98" r="7" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
</svg>`,
  pullBack: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="pb-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <polygon points="161,58 177,58 169,38 " fill="#fbfaf5" stroke="#13110d" stroke-width="2" stroke-linejoin="round"></polygon>
  <line x1="42" y1="58" x2="116" y2="66" stroke="#1f6b3b" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 6"></line>
  <g transform="translate(94,88) rotate(-18)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#c79a52" stroke-width="2.5"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#c79a52" stroke-width="1.5"></path></g>
  <g transform="translate(146,94) rotate(26)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <circle cx="131" cy="72" r="8" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <line x1="130" y1="84" x2="122" y2="106" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#pb-g)"></line>
  <path d="M118 114 C108 138 72 138 58 116" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#pb-g)"></path>
</svg>`,
  redLight: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="rl-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <line x1="24" y1="40" x2="216" y2="40" stroke="#fbfaf5" stroke-width="3"></line>
  <line x1="24" y1="112" x2="216" y2="112" stroke="#fbfaf5" stroke-width="3"></line>
  <line x1="32" y1="82" x2="106" y2="82" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 7" marker-end="url(#rl-g)"></line>
  <rect x="152" y="46" width="7" height="60" fill="#13110d"></rect>
  <text x="176" y="80" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">STOP</text>
  <g transform="translate(130,52) rotate(180) scale(.9)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <circle cx="130" cy="90" r="8" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <text x="34" y="128" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">~50%</text>
</svg>`,
  pushPass: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="pp-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker>
    <marker id="pp-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#c79a52"></path></marker>
  </defs>
  <circle cx="204" cy="44" r="7" stroke="#c79a52" stroke-width="2"></circle>
  <circle cx="204" cy="44" r="2" fill="#c79a52"></circle>
  <g transform="translate(82,86) rotate(-20)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#c79a52" stroke-width="2.5"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#c79a52" stroke-width="1.5"></path></g>
  <line x1="94" y1="56" x2="116" y2="46" stroke="#c79a52" stroke-width="2" stroke-linecap="round" marker-end="url(#pp-b)"></line>
  <g transform="translate(124,118) rotate(-52)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <circle cx="107" cy="88" r="8" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <line x1="118" y1="82" x2="190" y2="52" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#pp-g)"></line>
  <line x1="140" y1="110" x2="158" y2="100" stroke="#1f6b3b" stroke-width="2" stroke-linecap="round" opacity=".55" marker-end="url(#pp-g)"></line>
</svg>`,
  wallClose: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="wc-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <rect x="196" y="30" width="8" height="88" fill="#13110d"></rect>
  <g transform="translate(56,84) rotate(64)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <circle cx="88" cy="72" r="8" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <line x1="100" y1="62" x2="188" y2="56" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#wc-g)"></line>
  <line x1="188" y1="88" x2="102" y2="82" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#wc-g)"></line>
  <line x1="100" y1="112" x2="192" y2="112" stroke="#6f6a5b" stroke-width="1"></line>
  <line x1="100" y1="107" x2="100" y2="117" stroke="#6f6a5b" stroke-width="1"></line>
  <line x1="192" y1="107" x2="192" y2="117" stroke="#6f6a5b" stroke-width="1"></line>
  <text x="146" y="128" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">5 ft</text>
</svg>`,
  firstTouch: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="ft-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <rect x="206" y="24" width="8" height="70" fill="#13110d"></rect>
  <line x1="200" y1="52" x2="146" y2="70" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#ft-g)"></line>
  <g transform="translate(114,104) rotate(22)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <circle cx="132" cy="78" r="8" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <line x1="122" y1="88" x2="90" y2="110" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#ft-g)"></line>
  <circle cx="76" cy="120" r="9" stroke="#c79a52" stroke-width="2" stroke-dasharray="3 4"></circle>
</svg>`,
  wallStepped: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="ws-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <rect x="198" y="22" width="8" height="100" fill="#13110d"></rect>
  <circle cx="52" cy="106" r="18" stroke="#c79a52" stroke-width="2" stroke-dasharray="3 4"></circle>
  <g transform="translate(52,106) rotate(52) scale(.85)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <text x="52" y="140" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">weak foot</text>
  <circle cx="80" cy="96" r="8" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <line x1="92" y1="90" x2="190" y2="58" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#ws-g)"></line>
  <line x1="190" y1="48" x2="112" y2="34" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#ws-g)"></line>
  <text x="140" y="128" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">8–10 ft</text>
</svg>`,
  smallSided: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="42" y="32" width="156" height="92" rx="6" stroke="#13110d" stroke-width="1.5"></rect>
  <line x1="120" y1="32" x2="120" y2="124" stroke="#13110d" stroke-width="1" opacity=".4"></line>
  <rect x="34" y="64" width="8" height="28" fill="#13110d"></rect>
  <rect x="198" y="64" width="8" height="28" fill="#13110d"></rect>
  <circle cx="76" cy="56" r="5" fill="#1f6b3b"></circle>
  <circle cx="90" cy="98" r="5" fill="#1f6b3b"></circle>
  <circle cx="104" cy="72" r="5" fill="#1f6b3b"></circle>
  <circle cx="142" cy="60" r="5" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <circle cx="156" cy="98" r="5" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <circle cx="168" cy="74" r="5" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <circle cx="122" cy="82" r="4" fill="#fbfaf5" stroke="#13110d" stroke-width="1.5"></circle>
  <text x="120" y="22" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">3v3</text>
</svg>`,
  soloUpkeep: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="su-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#c79a52"></path></marker></defs>
  <circle cx="120" cy="38" r="6" fill="#c79a52"></circle>
  <circle cx="186" cy="76" r="6" fill="#c79a52"></circle>
  <circle cx="120" cy="114" r="6" fill="#c79a52"></circle>
  <circle cx="54" cy="76" r="6" fill="#c79a52"></circle>
  <path d="M132 42 Q166 50 182 64" stroke="#c79a52" stroke-width="2" stroke-linecap="round" marker-end="url(#su-b)"></path>
  <path d="M182 88 Q166 102 132 110" stroke="#c79a52" stroke-width="2" stroke-linecap="round" marker-end="url(#su-b)"></path>
  <path d="M108 110 Q74 102 58 88" stroke="#c79a52" stroke-width="2" stroke-linecap="round" marker-end="url(#su-b)"></path>
  <path d="M58 64 Q74 50 108 42" stroke="#c79a52" stroke-width="2" stroke-linecap="round" marker-end="url(#su-b)"></path>
  <text x="120" y="22" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">pass</text>
  <text x="212" y="79" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">move</text>
  <text x="120" y="136" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">touch</text>
  <text x="30" y="79" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9" fill="#6f6a5b">weak</text>
</svg>`,
  feint: `<svg viewBox="0 0 240 150" width="240" height="150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><marker id="fe-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1f6b3b"></path></marker></defs>
  <circle cx="152" cy="42" r="7" fill="#13110d"></circle>
  <g transform="translate(96,88) rotate(-12)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <g transform="translate(122,102) rotate(16)"><rect x="-9" y="-26" width="18" height="48" rx="9" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></rect><path d="M -7 -13 Q 0 -18 7 -13" stroke="#13110d" stroke-width="1.5"></path></g>
  <line x1="94" y1="70" x2="66" y2="46" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="5 4" marker-end="url(#fe-g)"></line>
  <circle cx="118" cy="124" r="8" fill="#fbfaf5" stroke="#13110d" stroke-width="2"></circle>
  <line x1="130" y1="122" x2="184" y2="116" stroke="#1f6b3b" stroke-width="2.5" stroke-linecap="round" marker-end="url(#fe-g)"></line>
</svg>`,
};
