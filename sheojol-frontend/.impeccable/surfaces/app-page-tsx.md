---
version: 1
slug: "app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/dashboard/page.tsx"]
---

# Direction contract — SheoJol public landing (app/page.tsx)

## World
Dark Utility Neobrutalism, chosen per the product brief. Zinc-950 ground, zinc-900 surfaces,
emerald-500 primary, cyan-500 secondary, red-500 for warning zones. Replaces the incumbent light
"developer-utility" look with a crisp, loud, print-plain neobrutalist system. Same real product
truth and function; new visual world.

## Rules (non-negotiable)
- 4.5:1 min contrast for text; emit visible focus outlines; theme all browser surfaces (selection
  emerald, dark scrollbars, `color-scheme: dark`).
- Hard offset shadows only (no soft blur shadows). Offset = border weight. Pressed state: content
  translates + shadow collapses.
- Sharp corners but a rounded-background base allowed for the map frame (map is a window).
- Exactly one authored motion moment on the page: scroll-reveal rise (intersection observation).
  Warning pins already pulse on the map; do not add more ambient motion.
- Real live data drives every number on the page (shelter counts per type, per region, per amenity,
  via the local Laravel API, with an honest "demo data" flag when the API is unreachable).
- Persist mode: Persuade. The visitor decides and acts; the map preview in the hero is the product
  mechanism shown at work (a live Leaflet dot-map, non-interactive).
- Zero comments in code. No conversational text in deliverables.

## Texture memo (what we are deliberately not doing)
- Not the incumbent: light `#e8ecf0` body, white cards, soft `shadow-card`, rounded-3xl everything.
- Not generic dark SaaS: no glassmorphism panels, no gradient headers, no purple, no blurred nav.
- No Unicode-glyph-substitute icon system: one consistent hand-drawn stroke SVG family is used for
  chrome; emoji survives only where the brief pins it (amenity tiles: cable, toilet, coffee, shield).

## Interaction & states
Hover: border brightens to emerald/type color + shadow tint shifts. Active: translate down.
Loading: skeleton rails. Error/empty: amber/red flat callout, never silent. Disabled: 50% opacity.
Scroll-reveal respects prefers-reduced-motion (falls back to visible).

## Signature
Deep-zinc ground with a scored "dotted grid" texture; one big set-register headline in an
Indonesian-designed grotesk (Plus Jakarta Sans); a live emerald/cyan/red dot-map framed by a hard
offset border; numbered outcome cards with real counts.
