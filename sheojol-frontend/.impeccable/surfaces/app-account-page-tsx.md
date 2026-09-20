---
version: 1
slug: "app-account-page-tsx"
primary_target: "src/app/account/page.tsx"
related_targets: ["src/components/account/ProfileCard.tsx", "src/components/account/AccountPanel.tsx"]
---

# Direction contract — SheoJol account & settings (app/account/page.tsx)

## World
Dual-Theme Utility Neobrutalism. Same dual-layout scaffold as `/me` (`lg:grid-cols-[320px_1fr]`),
left ProfileCard rails, right panel with tab default "profile". A logout button sits at the
bottom of the profile rail and a desktop "Buka Peta" header button tops the page. An admin-only
"Hak Akses / Pengelolaan" card with the "Akses Admin Panel" launcher sits under the profile rail;
mobile navigation is the 3-item `BottomNav` (Peta/Saya/Akun). Light: slate-50/white; dark:
zinc-900/slate-800; emerald primary, cyan accent, red danger for destructive actions.

## Rules (non-negotiable)
- 4.5:1 min contrast; visible focus; `RequireAuth` gate.
- Reuses ProfileCard + AccountPanel with different default tab; profile edit (name/phone,
  vehicle/app, facilities, save feedback) is the primary surface; security + reports + favorites
  tabs remain reachable.
- Logout calls AuthContext logout then redirects to `/login`.
- Live data only via `useAccountData`; skeleton rails, empty states, toasts.
- Hard offset shadows; pressed = translate + collapse. 2px borders on interactive components,
  1px on quiet inputs.
- Mode: Operate. Profile edit is the scan path; destructive logout is explicit.
- Zero comments in code. No conversational text in deliverables.

## Texture memo (what we are deliberately not doing)
- Not a generic account page: still the neobrutalist profile rail + tabbed panel pair, not a
  centered settings card pile.
- No blur, no gradients, no glass.

## Interaction & states
Hover: border brightens. Active tab: bright-fill chip. Saving: button shows "…" and disables.
Errors: inline red flat callout near the field group. Disabled: 50% opacity.

## Signature
The same dual-layout console as `/me` with profile editing front and center — one coherent
account surface across both routes, told in tokens.