---
version: 1
slug: "app-dashboard-page-tsx"
primary_target: "src/app/dashboard/page.tsx"
related_targets: []
---

# Direction contract — SheoJol map dashboard (app/dashboard/page.tsx)

## World
Dark Utility Neobrutalism, continuation of the landing system (zinc-950/900, emerald-500,
cyan-500, red-500). Desktop: a 380px legible rail beside a full-height Leaflet map. Mobile:
map-first with a draggable bottom sheet and a report FAB, Grab/Gojek-style but dark.

## Rules (non-negotiable)
- Operate mode. Scanability and consistency outrank expression: the two type colorsystems
  (emerald official / cyan basecamp / red warning) match the map pins, the filter pills, and the
  list dots exactly. No third green.
- Map is always a window: frame it with crisp borders; never blur or gradient the Leaflet canvas.
- Counts are real: "N titik" reflects the filtered result set, not a static total.
- List card click pans + opens the popup (single source of truth = selected shelter id).
- Keyboard reachable: region select and filter pills are real controls; focus rings everywhere.
- Mobile: bottom sheet peeks, half, full; sheet drag and amenity filters preserved from the
  incumbent bottom sheet but re-skinned dark. FAB bottom-right above safe area, above the sheet.
- Load state: skeleton card rails; error state: amber flat callout pinned above the list, and the
  existing "demo data" honesty note stays.
- Zero comments in code. No conversational text.

## Texture memo (not doing)
- Not the incumbent light sheet/cards/soft shadows.
- No bottom nav on the map surface (the map owns the viewport); Navbar only on non-map pages.
- No glass, no soft glow; hard offset shadows on overlay chrome only where it won't fight the map.

## Interaction & states
Selected list card: emerald border + hard shadow, all others quiet. Pills: pressed = filled with
type color. Sidebar region dropdown = real <select> re-skinned. FAB: emerald, hard shadow,
press-collapse on active. Bottom sheet drag uses cubic-bezier snap like the incumbent, translated
to dark tokens.

## Signature
A map that owns the screen on mobile and the right column on desktop, with a sharp utility rail:
search, region, three type pills, and a scroll of real shelters that move the map on tap.
