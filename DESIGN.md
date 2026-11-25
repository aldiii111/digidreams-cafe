# Design Direction — DigiDreams POS

## Source

Derived from the real brand at digidreams.id (palette values sampled from its stylesheet, typography and tone from its pages), not invented.

## Identity

DigiDreams Cafe and Space is a hybrid coffee shop and coworking space in Sukoharjo/Solo, open 09:00–02:00. It sells affordable coffee, Indonesian food, and hourly coworking passes to students and remote workers who stay late.

## Personality

Practical, welcoming, late-night productive. Not luxury, not corporate SaaS. The POS is a **work tool**: a cashier uses it at speed, in a queue, one-handed.

## Palette

| Role | Hex | Use |
| --- | --- | --- |
| Primary | `#1664fe` | Primary actions only: apply promo, pay now, active tab |
| Accent | `#10b981` | Success state only: paid confirmation |
| Ink | `#0f172a` | Headings and price emphasis |
| Paper | `#ffffff` | Page and card surfaces |
| Muted | `#94a3b8` | Secondary labels, stock counts, disabled |
| Warning | `#f59e0b` | Out-of-stock badge |
| Danger | `#ef4444` | Remove-line, destructive actions |

Discipline: at most two saturated colors visible at once (primary + one semantic). The muted slate carries most of the chrome.

## Typography

Inter (already loaded in the root layout) for UI. Tabular numerals (`font-variant-numeric: tabular-nums`) on every money figure so columns align in the cart and receipt. A monospace face only for the receipt body, where it reads as a till printout.

## Mood

Daylight cafe, functional. Flat surfaces, one elevation (the cart panel and the receipt dialog), no texture, no gradient, no glow.

## Dials

- **ENERGY 2** — clean and calm; the interface is a tool, not a marketing surface.
- **RHYTHM 2** — the screen has exactly two zones (catalog, cart), sized by the job, not a template.
- **MOTION 1** — hover and focus states only; no entrance animation, no pulse, no loop.

## Layout logic

The screen's job: ring up a customer fast. Therefore catalog occupies the left and the cart the right, both always visible on desktop; on phone the cart becomes a bottom sheet opened by a persistent bar showing the running total. No sidebar, no stat row, no chart — none of them serve this job.

## What this direction forbids

Blue-purple gradients, glassmorphism, glow, decorative pill badges, emoji, decorative status dots, uniform pill radii on every control, stat cards with invented numbers, filler data. Every one of these is a default, not a decision for this product.
