# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary: ojek online (ojol) drivers in Greater Tangerang (Tangerang Raya) who use the app on a phone while working the street, to find a safe place to rest, charge their phone, drink cheap coffee, and park without fear of robbery/extortion ("garukan") or raids ("razia").
- Secondary: administrators/moderators who curate the map — approving or rejecting driver-reported shelters and managing shelter records and driver accounts.

## Product Purpose

SheoJol ("Shelter Ojol Tangerang") is a mobile-first interactive map of safe shelters for ojol drivers across Tangerang Raya. It crowdsources and curates three kinds of places — official shelters, verified basecamps/warkops, and warning zones — so a driver can instantly find somewhere safe nearby and avoid dangerous spots. Success means a driver can act on the map at a glance while on shift.

## Positioning

A community-curated safety map built around ojol drivers in Tangerang Raya, distinguishing official shelters, driver-verified basecamps/warkops, and high-risk zones (garukan/razia). The warning-zone layer is the mechanism a neighboring generic map could not truthfully copy: it tells drivers where not to stop, not just where to go.

## Operating Context

- Usage happens on the road and during waits: one-handed, glanceable, low-attention mobile use; the app is a mobile-first PWA.
- The map (Leaflet) is the primary surface, with tabs for six regions: Ciledug, BSD, Karawaci, Tangerang Kota, Bintaro, Alam Sutera.
- Shelters carry amenities a driver cares about: power outlets, toilets, cheap coffee, safe parking.
- Drivers report new shelters from their current location; those reports stay hidden until an admin approves them.
- Drivers can save favorite basecamps for quick access and review their contributions.
- The frontend falls back to clearly-labeled demo data when the local API is unreachable.

## Capabilities and Constraints

Confirmed functionality:

- Shelter map with three types: `official` (Shelter Resmi), `verified` (Basecamp/Warkop), `warning` (Zona Rawan Garukan); amenities: power outlet, toilet, cheap coffee, safe parking; statuses: active/inactive/maintenance, with `is_approved` gating public visibility.
- Driver accounts: register/login, profile fields (name, phone, vehicle Motor/Mobil, app Grab/Gojek/Maxim), favorites, own-report list, dashboard summary, password change.
- Admin console: login, dashboard stats (by type/status/region), approve/reject pending shelters, create/edit/delete shelters, driver list.
- Stack: frontend `sheojol-frontend` (Next.js 16, React 19, TypeScript, Tailwind CSS 3, Leaflet, axios, PWA manifest); backend `sheojol-backend` (Laravel, Sanctum token auth, REST API under `/api`, per-page shelter list, haversine distance query).
- Language: all UI and API copy is Indonesian (Bahasa Indonesia).

Open decisions:

- Real shelter dataset: none exists yet. The user directed the build agent to research/provide trial data as needed; any dataset must be labeled as sample/trial, not confirmed production data.

## Brand Commitments

- Name: "SheoJol" ("Shelter Ojol Tangerang").
- Brand green: `#22c55e` (theme color, primary buttons, brand accents).
- All interface copy in Indonesian.
- Mobile-first PWA, installable, safe-area-aware. All of the above were confirmed binding.

## Evidence on Hand

- No production shelter data, seed data, testimonials, press, or customer records exist.
- The only shelter content is `sheojol-frontend/src/lib/demo.ts` (`DEMO_SHELTERS`), used as an offline/dev fallback.
- Per the user's direction, trial/demo data is to be researched and supplied by the build agent and clearly labeled as sample data. Nothing real may be fabricated.

## Product Principles

1. Safety first: shelter type and warning zones must be instantly distinguishable and never misleading.
2. Community-curated with verification: driver reports are visible only after admin approval.
3. Glanceable on the road: the map is the decision surface; scanning beats reading.
4. Tangerang Raya local truth: every place is region-accurate and city-factual.
5. Honest data: demo fallback is labeled, and real claims wait for real evidence.