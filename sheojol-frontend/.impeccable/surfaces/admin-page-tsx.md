---
version: 1
slug: "admin-page-tsx"
primary_target: "src/app/admin/page.tsx"
related_targets: ["src/app/admin/components/AdminSidebar.tsx", "src/app/admin/components/AdminHeader.tsx", "src/app/admin/components/ShelterTable.tsx", "src/app/admin/components/ReportVerification.tsx", "src/app/admin/components/ShelterModal.tsx", "src/app/admin/login/page.tsx"]
---

# Direction contract — SheoJol admin console (app/admin/page.tsx)

## World
Dual-Theme Utility Neobrutalism — the SAME token system and accent language as the public
product (no separate restrained palette). Replaces the old `/admin/dashboard` slate-based dark
console; `/admin/dashboard` now redirects to `/admin`. Light: slate-50/white; dark:
zinc-900/slate-800; emerald-600/-400 primary, cyan-600/-400 accent, red for warnings, amber for
pending. Sidebar collapsible on desktop, drawer + scrim on mobile.

## Rules (non-negotiable)
- 4.5:1 min contrast for text; visible focus outlines; `RequireAdmin` gate; redirect to
  `/admin/login` on logout.
- SPA-style single page with sections: overview (KPI cards + region bars + recent pending),
  shelters (ShelterTable: search, region counts, inline edit, create/edit modal, status toggle,
  delete confirm), pending (ReportVerification approve/reject), drivers (read-only table),
  settings (backend connection + app info).
- Live data only: `AdminApi.dashboard`, `.pending`, `.shelters`, `.drivers`, approve/reject,
  update/store/delete; explicit skeleton rails and inline error/empty states; toasts on success/error.
- Hard offset shadows only; pressed state translates + shadow collapses. 2px borders on cards,
  buttons, and pills; 1px on quiet inputs.
- Mode: Operate. Density and scanability outrank expression; KPI number is the hero.
- Zero comments in code. No conversational text in deliverables.

## Texture memo (what we are deliberately not doing)
- Not the old slate-only admin: no separate dark backend palette, no glassmorphism, no gradient
  scrims, no blurred headers.
- No decorative hero; KPI cards and tables are the content. Type pills keep fixed type-colored
  dots (emerald/cyan/red) with near-black text in both palettes.

## Interaction & states
Hover: border brightens / surface-2 tilt. Active: translate down. Loading: skeleton rails.
Error/empty: red/amber flat callout, never silent. Disabled: 50% opacity. Busy row shows "…".

## Signature
A collapsible power-rail sidebar over a token-surface canvas with a sticky solid header, four
hard-shadow KPI cards (Total Shelters, Zona Warning, Warkop Terverifikasi, Laporan Pending), an
amber pending badge, and a dense inline-editable shelter table.