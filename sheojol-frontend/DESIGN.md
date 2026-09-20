---
name: SheoJol — Frontend
description: "Dual-theme utility neobrutalism: a driver-first shelter map in two palettes."
colors:
  ground: "#f8fafc"
  surface: "#ffffff"
  surface-2: "#f1f5f9"
  edge: "#cbd5e1"
  ink: "#18181b"
  content-muted: "#52525b"
  primary: "#059669"
  primary-foreground: "#ffffff"
  accent: "#0891b2"
  accent-foreground: "#ffffff"
  danger: "#dc2626"
  danger-foreground: "#ffffff"
  warn: "#d97706"
  type-official: "#22c55e"
  type-verified: "#06b6d4"
  type-warning: "#ef4444"
  marker: "#16a34a"
  ground-dark: "#18181b"
  surface-dark: "#1e293b"
  surface-2-dark: "#0f172a"
  edge-dark: "#334155"
  ink-dark: "#f1f5f9"
  content-muted-dark: "#94a3b8"
  primary-dark: "#34d399"
  primary-foreground-dark: "#09090b"
  accent-dark: "#22d3ee"
  accent-foreground-dark: "#09090b"
  danger-dark: "#f87171"
  warn-dark: "#fbbf24"
typography:
  display:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(2.65rem, 8vw, 3.75rem)"
    fontWeight: 900
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.08em"
  wordmark:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "normal"
  wordmark-lg:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  tag:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  caption:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.18em"
  cell:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  micro:
    fontFamily: "var(--font-plus-jakarta), Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.5625rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.14em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "40px"
  filter-pill-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  filter-pill-inactive:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: SheoJol Frontend

## Overview

**Creative North Star: "The Driver's Waypoint Board".**

Public frontend for SheoJol: a shelter/basecamp community map for ride-hailing (ojol) drivers in Tangerang, rendered as a single coherent world — **Dual-Theme Utility Neobrutalism**. One visual system, two palettes (light and dark) driven by `next-themes`, defaulting to the system preference. The theme is a lamp, not a separate design: same categorical accents, same 1px/2px border language, same hard offset shadows in both palettes.

The system is loud, print-plain, and tactile. Bold border-heavy cards, utilitarian type, dot-level legend for the map, and hard offset shadows that read as physical blocks. It deliberately avoids glassmorphism, gradient scrims, soft glow, and decorative ornament — every pixel earns placement.

**Key Characteristics:**
- Driver-first utility: every surface answers "where do I safely stop right now?" in under 2 seconds; navigation is one tap away, always on-screen.
- Honest density: informational surfaces are dense but legible; the map owns any viewport it shares.
- One authored motion moment (scroll reveal); everything else is a tactile echo of the offset-shadow language.
- Live data honesty: real counts, explicit skeleton/error states, and an honest LIVE vs DEMO flag.

## Colors

The palette lives as RGB CSS custom properties in `globals.css` (`:root` = light, `.dark` = dark), referenced by Tailwind semantic tokens: `bg`/`ground`, `surface`, `surface-2`, `edge`/`strong`, `content`/`muted`, `primary`/`primary-foreground`, `accent`/`accent-foreground`, `danger`/`danger-foreground`, `warn`. Hardcoded zinc/slate/emerald/cyan values are forbidden except the documented deliberate exceptions (near-black type on bright fills, fixed type-pill fills).

| Token role | Light (`:root`) | Dark (`.dark`) |
| --- | --- | --- |
| Ground `bg` | `#f8fafc` (slate-50) | `#18181b` (zinc-900) |
| Surface | `#ffffff` (white) | `#1e293b` (slate-800) |
| Secondary surface | `#f1f5f9` (slate-100) | `#0f172a` (slate-900) |
| Border `edge` / `strong` | `#cbd5e1` / `#18181b` | `#334155` / `#f1f5f9` |
| Text `content` / `muted` | `#18181b` / `#52525b` | `#f1f5f9` / `#94a3b8` |
| Primary + foreground | `#059669` (emerald-600) / white | `#34d399` (emerald-400) / `#09090b` |
| Accent + foreground | `#0891b2` (cyan-600) / white | `#22d3ee` (cyan-400) / `#09090b` |
| Danger + foreground | `#dc2626` / white | `#f87171` / `#09090b` |
| Warn (pending/amber) | `#d97706` | `#fbbf24` |
| Type pill green (official) | `#22c55e` | `#34d399` |
| Type pill cyan (verified) | `#06b6d4` | `#22d3ee` |
| Type pill red (warning) | `#ef4444` | `#f87171` |
| Marker deep green (basecamp) | `#16a34a` | `#34d399` |
| Focus ring | `#059669` primary | `#34d399` primary |

### Primary
- **Waypoint Emerald** (#059669 / `#34d399` dark): the single action color — primary CTAs, the report FAB, active filter pills, live status dots, selection. Its rarity is the point: one active accent per screen.

### Secondary
- **Basecamp Cyan** (#0891b2 / `#22d3ee` dark): basecamp/shelter category — marker fill, basecamp filter pills, "basecamp" chips. Never competes with a primary CTA on the same surface.

### Tertiary
- **Danger Red** (#dc2626 / `#f87171` dark): destructives, warning zones, error states. Shares the near-black-on-bright-fill pair with emerald/cyan.
- **Pending Amber** (#d97706 / `#fbbf24` dark): pending moderation badges, demo/amber callouts. Near-black text on light amber in both palettes.

### Neutral
- **Slate Ground / White Surface** (light), **Zinc-900 Ground / Slate-800 Surface** (dark): the entire quiet field. Borders `edge`, hard "ink" borders `strong`, text `content`/`muted`.

### Named Rules
**The One-Accent Rule.** A single primary accent per surface. Chips, KPIs, and FABs may be colorful (they encode categories), but no screen carries two competing primary actions.

## Typography

**Display Font:** Plus Jakarta Sans (Indonesian-designed geometric humanist, via `next/font/google`) — the only typeface in the system.
**Body Font:** Plus Jakarta Sans, with `Inter` / `Segoe UI` / `system-ui` fallbacks.

**Character:** Geometric-humanist grotesk with a slightly condensed, heavy set-register voice. Weights carry hierarchy scanning: black (900) eyebrows and figures, bold (700) interactive labels, medium (500) body.

### Hierarchy
- **Display** (900, `clamp(2.65rem, 8vw, 3.75rem)`, 1.03, `-0.04em`): the landing set-register headline only.
- **Headline** (900, `clamp(1.875rem, 4vw, 2.25rem)`, 1.15, `-0.03em`): landing section headers, admin overview headers.
- **Title** (900, `1.5rem`, 1.2, `-0.02em`): page titles (`/me`, `/account`, auth), KPI numbers.
- **Body** (500, `0.875rem`, 1.5): paragraphs, table cells, descriptions; long text capped ≈65ch.
- **Label** (700, `0.75rem`, 1.3, `0.08em`): eyebrow labels, uppercase (`tracking-widest`) — "MUATAN // AKUN // LAPORAN".
- **Wordmark** (800, `0.9375rem`, 1.2): dashboard rail and shelter-name product marks.
- **Wordmark Large** (900, `1.0625rem`, 1.2, `-0.01em`): landing and footer product marks.
- **Tag** (700, `0.6875rem`, 1.3): chips, type pills (Semua/Official/Terverifikasi/Perlu Cek), status tags, small inline tags.
- **Caption** (700, `0.625rem`, 1.3, `0.18em`): badges, layer eyebrows ("LAYER 01"), stale-chip, uppercase set-register notes.
- **Cell** (500, `0.8125rem`, 1.4): dense admin table cells and driver name rows — compact but readable, sized between `body` and `tag`.
- **Micro** (700, `0.5625rem`, 1.3, `0.14em`): 9px uppercase micro-labels in admin header/sidebar capsules and avatar counters — the smallest step, never body copy.

### Named Rules
**The Set-Register Rule.** Big numbers and headlines are always black (900) and tight-tracked; body weight never exceeds 600. If it isn't a number or a label, it isn't black.

## Layout

- **Container:** `max-w-7xl` with `px-5` gutters on landing; full-bleed surfaces (map, admin) ignore the container.
- **Landing spine:** sticky solid-header nav → hero (headline + live MiniMap framed by a hard offset border) → feature layers → amenity tiles → 6-region coverage grid → CTA band → footer.
- **Dashboard:** dual layout — desktop `lg:` fixed 380px left rail (search, region, type pills, shelter list, Laporkan) beside a full-bleed Leaflet map; mobile is map-first with a draggable bottom sheet (peek/half/full) plus a report FAB above the sheet at bottom-right.
- **Me / Account:** dual-layout scaffold `lg:grid-cols-[320px_1fr]` — left ProfileCard rail (initials avatar, counters, theme row, vertical tab nav) over a tabbed right panel; on `/account` the tab nav is `lg:` only (`tabsOnMobile=false`) since mobile relies on the gear-chip modal, while `/me` keeps mobile tab chips; mobile foot uses `BottomNav` (Peta/Saya/Akun, `lg:hidden`), desktop uses a "Buka Peta" header button.
- **Admin:** collapsible sidebar (desktop) / drawer + scrim (mobile), sticky solid header, KPI grid, dense tables. Desktop tables render through a shared `DataTable` (explicit column alignment, sortable headers with ↑/↓ on click, skeleton/empty rails); below `lg` they become card stacks (`table` is `lg:` only). Shelters: client-side search/region/type filters, sortable by Lokasi/Wilayah/Status/Diperbarui, paginated 10/page with Sebelumnya/Berikutnya over the filtered+sorted set; full editing (incl. facilities & coords) lives in the ShelterModal — no inline editors. Drivers: server-paginated 10/page with `?search=` (name/email LIKE) + `?sort=`/`?direction=` (`name|reports|joined`, default joined desc) via `AdminDriverController`, sortable by Driver/Laporan/Bergabung. Same token system — not a separate "backend dark" palette.
- **Account sheet (mobile):** the `/account` header carries a gear chip (`lg:hidden`) that opens `AccountModal` — a two-layer bottom sheet: quick-action menu (Laporan, Shelter Favorit, Edit Profil, Keamanan & Password — tapping a row swaps to the full tab body in-sheet, back arrow returns to menu) plus "Kembali ke Home" → `/dashboard`. Escape closes; desktop keeps inline tabs.
- **Spacing rhythm:** 4px base; `sm` 8, `md` 12, `lg` 16, `xl` 20, `2xl` 24. Cards `p-4`/`p-5`; stacked sections `gap-4`/`gap-5`.

## Elevation & Depth

Flat surfaces, hard offset shadows only, never blurred elevation. Depth is communicated by crisp ink borders (`edge`/`strong`) plus an unblurred offset shadow that reads as physical stacking. Pressed state: content translates down and the shadow collapses to zero.

### Shadow Vocabulary
- **Neo** (`3px 3px 0 0 rgba(24,24,27,.85)` light / `rgba(241,245,249,.17)` dark): cards, modals, sheets, hero map frame. The workhorse elevation.
- **Neo-sm** (`2px 2px 0 0` same rgb): small controls — buttons, chips, popups, KPI cards.
- **Neo-brand / Neo-cyan** (`3px 3px 0 0` tinted with primary/accent): signature accents on bright fills (hero CTA band, basecamp hero accents).

### Motion language
Exactly one authored motion moment in the world: **scroll reveal** on the landing (`Reveal`, IntersectionObserver, 90%→100% opacity, `translate-y-2`→0). Everything else is a tactile echo of offset shadows: button press (`active:translate-y-[2px]` + `active:shadow-none`), the warning-pin sweep, status pings. All motion honors `prefers-reduced-motion`.

### Named Rules
**The Hard-Only Rule.** Elevation is either a flat surface or a hard offset shadow. No blur, no diffuse drop shadows, no gradient scrims anywhere — with one deliberate exception: the dashboard/landing header logo card is a frosted chip (`bg-white/85` / `dark:bg-slate-950/80` + `backdrop-blur-md`, `rounded-2xl`) so the live map reads through behind the brand mark. It is the only blur in the system; every other elevation is hard offset only.

## Shapes

Form language: **rounded rectangles with hard ink outlines**. Surfaces sit on a 2px `edge`/`strong` border; interactive emphasis keeps 2px, quiet form fields use 1px `edge`. Corner vocabulary is small and consistent:
- `rounded-sm` (8px): small chips, status dots, mini labels.
- `rounded-md` (12px): buttons, inputs, list rows.
- `rounded-lg` (16px): cards, tables, modals.
- `rounded-full`: pills, filter chips, FAB, status dots, avatars. Sheets: `rounded-t-2xl` (16px top) with a border that follows the corner (`border-t-2 border-x-2`).

Marker geometry: colored pins with a white flag knob (rounded 50% with a 45° rotated 4px corner); the map is framed as a window with a crisp border, never blurred or graded.

### Named Rules
**The Outline-Follows-Corner Rule.** When a 2px border meets a rounded corner, the border curves with the corner (bottom sheet top cap, modal), rather than stopping square. Consistency across every sheet is the point.

## Components

### Buttons
- **Shape:** `rounded-md` (12px), 2px `strong` border.
- **Primary:** `primary` fill, `primary-foreground` text, `shadow-neo`/`neo-sm`. Pressed = `translate-y-[2px]` + shadow removed. Hover rarely needed (offset already reads as raised); small CTA hover lifts `-translate-y-0.5`.
- **Secondary:** `surface` fill, `content` text, 2px `edge` border; hover brightens border to `muted`/`strong`. Danger variant swaps text/border to `danger`.
- **FAB:** `h-14 w-14` fixed `right-4` bottom, `primary` fill, hard shadow; icon follows `primary-foreground`.

### Chips
- **Filter pills:** active = bright fill (`primary`/`accent`/`danger`) with near-black (`zinc-950`) or `*-foreground` text + 2px near-black border + hard shadow; inactive = `surface` fill, 2px `edge` border, `content` text. Pill totals always reflect the current search query.
- **Type pills (map):** fixed categorical fills (emerald/cyan/red) with `zinc-950` near-black text in **both** palettes — the signature contrast pair (measured ≈5–9:1, AA). Deliberate exception to the token-only rule.
- **Badges:** `rounded-full`, 2px tinted border (`border-primary/40`, tinted bg 15%), `text-[10px]` bold. Pending = amber tint. Admin count badge = amber fill, near-black text.

### Cards
- **Corner:** `rounded-lg` (16px). **Background:** `surface`. **Border:** 2px `edge` (`strong` on signatures). **Shadow:** `neo-sm` rest, `neo` for featured. **Padding:** `p-4`/`p-5`. Interactive cards hover with `-translate-y-1` + border → `strong`.

### Inputs / Fields
- **Style:** `rounded-md` (12px), `h-11`/`h-12`, 1px `edge` quiet border on `surface-2` fill, `content` text, `muted` placeholder.
- **Focus:** border swaps to `primary` plus the global `:focus-visible` ring (2px `focus`, offset 2) — no field relies on color alone.
- **Error / Disabled:** error callout = `danger/15` fill, `danger/40` border, `danger` text, 2px; disabled = 50% opacity.

### Navigation
- **Header (landing/dashboard):** solid `surface`, no gradient; logo mark is the frosted glass chip (deliberate Hard-Only exception — map reads through), text links `muted` → hover `content`, account entries as secondary buttons, admin via account launcher. Dashboard carries a region `<select>` in the rail, not the header; the top bar carries no theme capsule — the map control stack owns that switch.
- **Sidebar (admin):** desktop collapsible power-rail; mobile drawer + black scrim. Active item = bright-fill chip; icons 20px stroke SVG family (no emoji in chrome).
- **BottomNav:** fixed bottom, `border-t-2 border-edge`, `surface`, exactly three items — Peta `/dashboard`, Saya `/me`, Akun `/account`; `lg:hidden`. Active = `primary` icon + label.

### Map (Leaflet)
- Base: Leaflet + OSM. Dark mode: filter stack (`invert(1) hue-rotate(180deg) brightness(0.94) contrast(0.9) saturate(0.7)`) scoped to `.dark .leaflet-tile-pane`, with a zinc overlay above tiles and below markers; light mode = plain tiles.
- Markers: colored pins, white flag knob, near-black ring on warnings with a pulse sweep (motion-reduce off). Selected marker pops via `scale-125`.
- Map control stack (dashboard, `top-24 right-3`): zoom `+`/`−` bright chips, then the sun/moon `ThemeToggle` — the single theme switch on the map surface.
- Hero `MiniMap`: non-interactive live dot-map, fitBounds over the dataset, framed by a hard offset border.

## Do's and Don'ts

### Do:
- **Do** use semantic tokens (`bg`, `surface`, `edge`, `content`, `primary`, `accent`) for all UI; hardcoded zinc/slate/emerald/cyan is forbidden except the documented deliberate exceptions.
- **Do** keep interactive emphasis at 2px borders with hard offset shadows; pressed state translates down and collapses the shadow.
- **Do** keep the near-black-on-bright-fill pair (zinc-950 on emerald/cyan/red/amber) in both palettes — it is the signature, measured AA.
- **Do** theme all browser chrome (selection, scrollbars, popups, attribution, `color-scheme`) with the active palette.
- **Do** show explicit skeleton rails, flat error/empty callouts, and a LIVE vs DEMO honesty flag; never fabricate counts.
- **Do** keep one authored motion moment (scroll reveal) and honor `prefers-reduced-motion`.

### Don't:
- **Don't** add backdrop blur, gradient scrims, glass panels, or any soft/shadow-glow elevation — depth is hard offset only (exception: the single frosted logo card in the map header, see The Hard-Only Rule).
- **Don't** introduce a second font, a third green, or a separate "admin dark" palette; one world, two lamps.
- **Don't** put a theme capsule in the dashboard top bar (the map control stack owns that switch on the map surface).
- **Don't** add the bottom nav to the map surface — the map owns the viewport; `BottomNav` is `lg:hidden` on `/me` and `/account` only.
- **Don't** write comments in source or conversational copy in the UI (e.g. no "Loading... please wait" prose; use skeleton rails instead).
- **Don't** use emoji as chrome icons; one stroke-SVG family, with emoji surviving only on the pinned amenity tiles and the mobile account gear chip (a wayfinding affordance, `lg:hidden`).