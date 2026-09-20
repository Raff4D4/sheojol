---
target: SheoJol landing page
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:C:\\laragon\\www\\sheojol\\sheojol-frontend\\src\\app\\page.tsx"
target_fingerprint: "sha256:602dd9b47d0667b1eaf8779a980b99221475d43502d637008df742a691dd187e"
target_path: "C:\\laragon\\www\\sheojol\\sheojol-frontend\\src\\app\\page.tsx"
timestamp: 2026-09-19T05-21-16Z
slug: src-app-page-tsx
---
# Critique: SheoJol Landing (src/app/page.tsx)

Method: dual-agent (A: ses_f47e44bd7ffeyEEMcl6H1SUKbg · B: ses_f47e43e8bffePhY6IXp4xiilrX). No browser automation available; source + detector evidence only.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeletons/LIVE/DEMO exemplary; Reveal ships SSR content at opacity-0 -> blank fold pre-hydration |
| 2 | Match System / Real World | 4 | razia/garukan/warkop dialect spot-on |
| 3 | User Control and Freedom | 3 | Sticky nav + deep links; no back-to-top beyond scroll |
| 4 | Consistency and Standards | 3 | Three CTA labels, one destination: "Buka Peta" / "Buka Peta Shelter" / "Buka Peta Sekarang" |
| 5 | Error Prevention | 3 | Honest DEMO flag; little else to misfire |
| 6 | Recognition Rather Than Recall | 4 | Dot->count mapping in pills->legend->cards reads instantly |
| 7 | Flexibility and Efficiency | 2 | Anchor nav + repeated CTAs only |
| 8 | Aesthetic and Minimalist Design | 3 | Disciplined density; two primaries compete in the fold |
| 9 | Error Recovery | 3 | Amber banner exists; sits off the scan path below CTAs |
| 10 | Help and Documentation | 2 | "Cara Kerja" -> #fitur is marketing, not a how-to |
| **Total** | | **30/40** | **Good** |

## Design Specificity Verdict

Authored, not generic. "Navigasi & basecamp teraman driver ojol", the garukan/nongkrong vocabulary, the razia-radar cards, and Kota/Selatan/Kab. Tangerang region rows could not drop onto a SaaS template without surgery. 8/10.

Deterministic scan: 1 rule active — design-system-font-size, 14 advisory hits (page + Header). 2 are documented (10px badges); the other 12 are literal sizes (10/11/15/17px) outside DESIGN.md's documented ramp — each defensible, but the system doc should own them. No contrast/anti-pattern blockers beyond those.

Visual overlays: not available (no browser tool). Source-based evidence only.

## Overall Impression

The MiniMap-with-LIVE-pulse is a genuinely product-native proof; the landing is one "false affordance" sweep and one CTA-tightening pass away from feeling authored-original rather than "great template with real data."

## What's Working

1. Live-data honesty spine — DEMO flag, skeletons, computed counts, zero fabrication.
2. Product-as-proof MiniMap with legend strip — the strongest element on the page.
3. One-accent discipline + near-black-on-bright signature held consistently into passive surfaces.

## Priority Issues

- [P0] False affordance: amenity tiles & feature cards look pressable (hover:-translate-y-1, hover:border-primary) on non-interactive divs. Fix: deep-link to /dashboard?amenity=X or strip hover/press + cursor-default.
- [P1] Triple CTA, one destination: "Buka Peta" / "Buka Peta Shelter" / "Buka Peta Sekarang". Fix: single "Buka Peta" everywhere; CTA band gets momentum copy ("Lihat Peta Langsung").
- [P1] SSR-hidden fold: Reveal's opacity-0 default blanks content pre-hydration and for no-JS. Fix: default-visible; animate only after mounted.
- [P2] Dual primary in fold: header + hero both emerald-filled. Fix: demote header CTA to secondary.
- [P2] Skeleton mismatch: h-8 w-8 pulse for text-5xl figures causes layout shift. Fix: match figure box (w-16 h-16) + reserve width.
- [P2, from B] zinc-400 chevron in Header (Header.tsx:57) approx 2.1:1 on white — fails WCAG 1.4.11 for UI components. Fix: use muted token.

## Persona Red Flags

- Jordan (first-timer): tally pills load before the value prop; non-tappable amenity cards poison interactive-model assumptions.
- Casey (distracted mobile): three CTAs, two primaries, h-10 vs h-14 taps; theme toggle hidden before sm (P3: icon-only in mobile header).
- Riley (stress tester): will file the SSR flash and CTA-label drift as bugs.

## Minor Observations

- Header duplicated inline in page.tsx instead of shared Header.
- "Cara Kerja" nav -> #fitur mislabels its target.
- "teraman" is a claim the dataset must out-earn on quiet days.
- userScalable:false is a documented, deliberate WCAG 1.4.4 tradeoff — kept.

## Questions to Consider

- The warning-red razia layer is the differentiator — why does the headline lead with "navigasi & basecamp" instead of "tahu razia sebelum razia"?
- When counts are zero on a quiet day, is the landing built to survive its own honesty?
