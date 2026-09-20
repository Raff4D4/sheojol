---
version: 1
slug: "app-me-page-tsx"
primary_target: "src/app/me/page.tsx"
related_targets: ["src/components/account/ProfileCard.tsx", "src/components/account/AccountPanel.tsx", "src/hooks/useAccountData.ts"]
---

# Direction contract — SheoJol personal dashboard (app/me/page.tsx)

## World
Dual-Theme Utility Neobrutalism. Dual layout: `lg:grid-cols-[320px_1fr]` — left ProfileCard
(avatar/initials, name, role chip, live counters, vehicle/app badges, theme row, tab nav vertical)
over a right panel. Tabs default "reports". The mobile-only `BottomNav` (Peta/Saya/Akun) sits at
the foot; desktop uses a small "Buka Peta" header button. Light: slate-50/white; dark:
zinc-900/slate-800; emerald primary, cyan accent, red danger.

## Rules (non-negotiable)
- 4.5:1 min contrast; visible focus; `RequireAuth` gate.
- Reports tab: 3 filter pills (Semua/Disetujui/Menunggu), approved/pending chips, per-shelter row
  with Navigasi (opens Google Maps via `@/lib/maps`) and Hapus (removeFavorite, busy state).
- Favorites tab: same row primitives; Profile tab: name/phone validation, vehicle/app selects,
  facility Badge toggles, save feedback via `useAccountData.saveProfile`;
  Security tab: current/new/confirm, min 8 chars, match validation, success/error via
  `savePassword` (AuthContext gate).
- Live data only via `useAccountData` (mine + favorites); skeleton rails, empty states, toasts.
- Hard offset shadows; pressed = translate + collapse; 2px borders on interactive, 1px inputs.
- Mode: Operate. The tab strip is the scan path.
- Zero comments in code. No conversational text in deliverables.

## Texture memo (what we are deliberately not doing)
- Not a settings grind: the left rail is a profile card, not a naked menu list.
- No blurred headers, no gradients, no glass. No emoji icons except the pinned amenity set.

## Interaction & states
Hover: border brightens. Active tab: bright-fill chip. Loading: skeleton rows. Error/empty: red
flat callout / dashed empty card. Disabled: 50% opacity. Busy buttons show "…".

## Signature
Dual-layout personal console: profile rail with a big initial badge and live contribution
counters beside a tabbed panel whose filters and rows read like a mini control room in the same
neobrutalist voice as the map dashboard.