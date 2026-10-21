---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components/three/print-intro.tsx"]
---

Scope: the portfolio home (single long-scroll route `/`) plus its board-milling intro. Mode: Experience.

Audience: recruiters and hiring managers. Job: in under a minute understand who Joshua is, where he worked, what he built, then email him. Action: email (mailto + copy). Proof: CV facts only (config/portfolio-content.ts). Constraints: dark ground, red accent kept, intro kept and rebuilt, inline long scroll (no carousels/modals).

## Direction contract

THESIS: The site is a fabricated circuit board. In the intro a desktop PCB mill makes it (blank, engraved copper traces with the bit on the surface, components settling in); the camera eases once to top-down without ever tracking the tool, and the board becomes the page, where every role is a component wired to the next. Refuses the centred-name-over-card-grid dev portfolio.

OWN-WORLD: Matte black solder mask ground with a green-black tone step for raised areas; ENIG gold copper for traces, pads and vias; silkscreen off-white for all type; one red SMD LED for the email action and the single active component. Square corners, filled pads, ring vias, 45-degree routing. Archivo variable: heavy condensed display, normal-width text.

STORY: The visitor reads name, "software engineer where code meets hardware", and the email action at once; scrolls a split stage where the board stays fixed and each role's component lights as its leg is read (measured results sit inside their roles as copper figures); then a full-bleed macro of the material, the boat project, the bill of materials, education, and a red solder-mask contact board whose traces run into a lit reply LED. Below lg the board scrolls away after the first screen (it would fill a phone), so each role carries its own status LED that lights while it is read.

FIRST VIEWPORT: Plain bar (wordmark, three links, red Email me). Name in two lines at 9vw heavy condensed, bottom-left, crossing into the board's clear lower-left, the copper bus starting at the board edge under its last letters and running into U1; one-sentence lede and red "Email jewallick@pm.me" button plus GitHub/LinkedIn under it. Right half: the board, traces running from the name into role components around a central MCU.

FORM: Solder Mask (Impeccable's pick, chosen by the user over the assigned Night Passage); seed:6b20cb325d1b1744. Signature interaction: tap any component to route a signal pulse to it and jump to that role; scroll lights the active component's LED. Motion grammar: deposition (toolpath wipes, traces drawn along their length, signal pulses), strong ease-out, no bounce.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
