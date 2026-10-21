---
name: Joshua Evenden-Wallick
description: A portfolio fabricated as a circuit board, milled on arrival and read as a populated PCB.
colors:
  mask: "#0e100f"
  mask-raised: "#151816"
  mask-deep: "#090a09"
  mask-red: "#9a1f18"
  mask-red-raised: "#ab2820"
  silk: "#ecebe7"
  silk-2: "#a9aba4"
  copper: "#d4ab55"
  copper-dim: "#5c4b29"
  copper-hot: "#ffe2a1"
  chip: "#1c1e1d"
  chip-mark: "#8f918b"
  shield: "#8e928c"
  led: "#ff4433"
  led-off: "#3a1714"
  led-hover: "#ff6a59"
  silk-bright: "#ffffff"
  mask-red-hover: "#ba3127"
  rule: "#262a27"
  led-green: "#3ddc84"
  led-green-core: "#b8f5cf"
  module: "#121614"
  oled-glass: "#060807"
  oled: "#c6f1ff"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3rem, 9vw, 9rem)"
    fontWeight: 820
    lineHeight: 0.86
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 74"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 3.9vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 76"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.55vw, 1.5rem)"
    fontWeight: 450
    lineHeight: 1.32
    letterSpacing: "-0.008em"
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    fontVariation: "'wdth' 100"
  oled:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0"
  full: "9999px"
spacing:
  gutter: "clamp(1.25rem, 2.8vw, 2.5rem)"
  section-gap: "clamp(7.5rem, 14vw, 13.5rem)"
components:
  button-led:
    backgroundColor: "{colors.led}"
    textColor: "{colors.mask-deep}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 1.6rem"
    height: "3.5rem"
  button-led-hover:
    backgroundColor: "#ff6a59"
  button-led-compact:
    backgroundColor: "{colors.led}"
    textColor: "{colors.mask-deep}"
    rounded: "{rounded.none}"
    padding: "0 1.25rem"
    height: "3rem"
  button-silk:
    backgroundColor: "{colors.silk}"
    textColor: "{colors.mask-deep}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 1.6rem"
    height: "3.5rem"
  button-silk-hover:
    backgroundColor: "#ffffff"
  link:
    textColor: "{colors.silk}"
    typography: "{typography.body}"
    padding: "0 0 3px 0"
  link-hover:
    textColor: "{colors.copper-hot}"
  contact-cell:
    backgroundColor: "{colors.mask-red-raised}"
    textColor: "{colors.silk}"
    rounded: "{rounded.none}"
    height: "5rem"
  contact-cell-hover:
    backgroundColor: "#ba3127"
  contact-cell-primary:
    backgroundColor: "{colors.silk}"
    textColor: "{colors.mask-deep}"
    rounded: "{rounded.none}"
    height: "5rem"
---

# Design System: Joshua Evenden-Wallick

## Overview

**Creative North Star: "The Populated Board"**

The page is a fabricated printed circuit board. A desktop PCB mill makes it on arrival: the blank rises onto the bed, the spindle engraves every copper route with its V-bit on the surface, the components settle in, the camera eases once to straight down, and the materials flatten to the exact page colours so the machined board becomes the page with no seam. From then on every surface is board material: matte black solder mask for ground, ENIG gold copper for every line, pad and via, silkscreen off-white for every word, and one red SMD LED for the one thing to do.

Density is low and deliberate. Type is very large and very condensed, rows are separated by wide section gaps, and the board itself is the only dense area: a central MCU wired by 45-degree copper to one component per role. Photographs are of the material world the work lives in, always greyscale, so colour stays reserved for copper and the LED. Motion is fabrication: toolpath wipes left to right, traces drawn along their length, signal pulses travelling to a part. Nothing bounces and nothing fades in for decoration alone.

Dark ground and the red accent are product commitments, not choices this world can revisit.

**Key Characteristics:**
- Matte black mask ground with a single green-black raised step; no gradients, no glass.
- Copper is the only line colour: rules, bullets, underlines, traces, vias, figures.
- LED red only for the email action and whatever is lit; one lit component at a time on the board.
- Square rectangles everywhere; circles appear only as vias, mounting holes and fiducials.
- Archivo variable: heavy condensed display (wdth 74-76), normal-width text (wdth 100).
- Motion as deposition: wipes, drawn traces, pulses; strong ease-out, no bounce.

## Colors

A PCB palette: three tones of black mask, one red mask field, gold copper in three heats, silkscreen white in two strengths, and a single LED red.

### Primary
- **SMD LED Red** (led): the email action (filled buttons), the lit component's silkscreen outline and status LED, the boat marker on the route. It is light, not paint: it means "on" or "act here".
- **LED Off** (led-off): the unlit body of the same LED, so the lit state reads as a change in one part rather than a new element.

### Secondary
- **ENIG Copper** (copper): every line and mark that is not type: link underlines, bullet pads, live traces, vias, pads, BOM reference numbers, tag lists, measured-result figures, focus outlines, text selection.
- **Dim Copper** (copper-dim): copper under mask. Inactive traces, the unfilled progress track, the default text-decoration colour and the scrollbar thumb.
- **Hot Copper** (copper-hot): copper carrying current. Signal pulses along traces and the link hover colour. Never a fill.

### Tertiary
- **Red Solder Mask** (mask-red) and **Raised Red Mask** (mask-red-raised): the contact board only. A whole section printed on red mask with its own mounting holes and fiducials; the raised step fills its action cells and fiducial rings.

### Neutral
- **Solder Mask** (mask): page ground, html and body background.
- **Raised Mask** (mask-raised): the board substrate and raised panels (the project's split pane).
- **Deep Mask** (mask-deep): via holes, mounting-hole centres, and the text colour on any filled LED, silk or copper surface.
- **Silkscreen** (silk): all primary type and component outlines.
- **Faded Silkscreen** (silk-2): secondary type: dates and places, captions, blurbs, table headers.
- **Package Black** (chip), **Package Marking** (chip-mark), **Shield Nickel** (shield): component bodies on the board, their laser markings, and metal RF cans. Board-only.

### Named Rules
**The LED Means On Rule.** LED red is only ever the email action or a part that is lit (the active component, a status LED, the reply LED, the boat on its route). It is never decoration, emphasis or a status colour for text.

**The Copper Line Rule.** Every non-type line on the page is copper (or dim copper). No grey hairlines, no silk rules; the BOM table's dark row rule is the single exception, because it is a printed table.

**The Flat Hand-off Rule.** The print intro's `flat` material colours equal these tokens exactly. Change a token, change config/print-config.ts in the same commit.

## Typography

**Display Font:** Archivo variable (with system-ui, sans-serif)
**Body Font:** Archivo variable, same family
**Label/Mono Font:** none; tabular figures (`font-variant-numeric: tabular-nums`) stand in for a mono where numbers align.

**Character:** One family pulled across its width axis. Headings are heavy and narrow like silkscreen part designators; running text opens back to full width for reading.

### Hierarchy
- **Display** (820, clamp(3rem, 9vw, 9rem), 0.86, wdth 74): the name, the project title, the contact headline, the footer wordmark, and measured-result figures in copper. The hero name may break the column and run onto the board.
- **Title** (800, clamp(2.25rem, 3.9vw, 3.75rem), 0.92, wdth 76): section headings and role titles. All h1-h3 share weight 800, wdth 76, -0.03em and balanced wrapping by default.
- **Lead** (450, clamp(1.25rem, 1.55vw, 1.5rem), 1.32): ledes, role summaries, section blurbs; held to 31-36ch.
- **Body** (400, 1.125rem, 1.55): detail bullets, table cells, paragraphs; `text-wrap: pretty`, about 36rem columns.
- **Small** (400, 0.875rem, 1.45): captions, credits, table headers. Sentence case, never tracked uppercase.

Intermediate widths are used for emphasis inside text: wdth 92 on buttons, 84 on the nav wordmark, 80 on the copyable email and part markings, 90 on BOM group headings.

### Named Rules
**The Five Steps Rule.** Five sizes, no more: display, title, lead, body, small. Emphasis comes from weight and width, not new sizes.

**The Silkscreen Case Rule.** Type is set in sentence case at normal tracking. No uppercase labels, no small tracked headers above headings.

## Layout

A full-bleed long scroll with fluid side padding (gutter) and very large vertical spacing between sections (section-gap). The first screen and the experience legs share a split stage at lg (1024px): text on the left, the board sticky full-height on the right, its active part tracking the role being read. Below lg the board sits at the top of the first screen (about 52svh) and scrolls away; each role then carries its own small status LED beside its title.

Later sections use a 12-column grid at lg with 2rem gaps and asymmetric spans (5/6, 4/8, 7/4). The macro photograph and project split pane go full bleed; the project runs a 150svh sticky stage. Text columns stay narrow (31-36ch ledes, 36rem legs, 56ch notes). Stacked rhythm inside a section steps through roughly 1.5rem, 2.5rem, 5-7rem; tap targets are at least 3rem tall.

## Elevation & Depth

Flat. There are no box-shadows anywhere. Depth is the board's own physical layering, expressed as tone steps: mask, then raised mask, then component bodies, with deep mask for holes punched through. Photographs and the footer video are pushed back with greyscale and lowered brightness rather than overlays. The only literal depth is the milling intro, which flattens to unlit tokens before it hands off.

### Named Rules
**The Layer Not Lift Rule.** Separate surfaces with a mask tone step or copper, never with a shadow or blur.

## Shapes

Square corners on every rectangle: buttons, cells, panels, photographs, pads, component bodies, status LEDs (radius 0). Circles are reserved for what is round on a real board: vias (copper ring around a deep-mask hole), mounting holes (thick copper border, deep-mask fill, at the four corners of a board field), fiducials, and the education timeline's ring markers. Traces route orthogonally with 45-degree bends and round caps and joins; bus traces are thicker (7) than role traces (5). Bullets are small filled copper squares, i.e. pads. Silkscreen outlines on components are corner brackets, not full boxes.

## Components

### Buttons
Filled, square, decisive: an SMD part you press.
- **Shape:** square corners (0), 3.5rem tall, 1.6rem side padding; compact variant 3rem tall, 1.25rem padding (nav).
- **Primary (LED):** LED red fill with deep-mask text, weight 700 at wdth 92. Reserved for email.
- **Secondary (Silk):** silkscreen fill with deep-mask text.
- **Hover / Focus:** on fine pointers only, LED lightens to led-hover (#ff6a59) and silk goes to silk-bright (#ffffff) over 200ms. Press scales to 0.97 over 160ms on the ease-out curve. Focus is the global 3px copper outline at 3px offset.

### Links
- **Style:** silk text, weight 600, a 2px copper trace under it as a pseudo-element.
- **Hover:** text warms to hot copper and the trace is pulled off to the right (scaleX to 0 from the right origin, 300ms ease-out). Press nudges down 1px.
- **Inline prose links** use a native underline in dim copper, 2px thick, 0.22em offset.

### Contact cells
- **Style:** square filled cells, 5rem tall, on the red contact board: raised red mask with silk text and brand icon, or a silk cell with deep-mask text for the email.
- **State:** hover darkens red to mask-red-hover (#ba3127) (silk cell to silk-bright); press scales to 0.98.

### Navigation
- **Style:** an absolute bar over the first screen, no background: wordmark at weight 800 wdth 84 on the left; copper-trace links and a compact LED "Email me" button on the right. Links hide below lg, leaving wordmark and button.

### Bill of materials table
A real table that keeps a table's rules: small faded-silk headers, rows ruled 1px in rule (#262a27), group headings at lead size weight 800 wdth 90 over a dim-copper rule, reference numbers in tabular copper.

### Circuit board (signature)
The SVG board shared with the milling intro: raised-mask substrate with corner mounting holes, a central MCU wired to one package per role (BGA, RF shield, module, SOIC, QFN, crystal), a voltage regulator with its input and output capacitors, a reset switch, a test point, passives and vias. Silkscreen carries only what a real board prints: courtyard corner marks, laser-etched part markings, and small faded reference designators (U1 to U8, Y1, SW1); there are no descriptive labels. Copper follows one rule: every signal trace is exactly pin width (5 units) and leaves a pin from its outer tip, collinear and butt-ended, so pin and trace read as one line; traces into pinless packages end under the body. Pin geometry comes from one function (pinRects in config/board.ts) shared with the 3D scene. Inactive traces are dim copper; the active part's traces turn full copper, its silkscreen bracket turns LED red and thickens, and its LED lights. Tapping a part routes a hot-copper pulse along its trace and scrolls to the role. Wide and narrow bus variants make the bus always enter from the side where the name sits.

### Motion vocabulary
- **Deposition reveal:** content rises 24px and appears (700ms opacity, 900ms transform, ease-out), staggered 75ms per index.
- **Toolpath wipe:** headings uncover left to right by clip-path (1100ms, ease-in-out), staggered 90ms.
- **Pulse:** a short hot-copper dash travels a trace (reply LED traces, board selection).
- **Swap-in:** in-place state text sharpens in from a 4px blur (260ms).
- Scroll-linked drift on the macro photograph and a settle on the footer wordmark, where supported.
- Content is visible without JS; reduced motion drops transforms and keeps 300ms opacity, or removes the animation.


### Resume viewer

A Base UI dialog that opens from the nav, the hero (a silk View resume button beside the red email action) and the footer. The real PDF is rendered page by page with pdf.js onto canvas at device pixel ratio, with a transparent, selectable text layer on top, on a raised-mask panel with corner mounting holes. Header: title and file line on mask, zoom (Fit, 125, 150, 200 percent) and a silk Download PDF button, then a square close. Motion: backdrop fades over 200ms; the popup rises 14px from 0.98 scale over 260ms on the ease-out curve and leaves faster (160ms); pages fade up as they render; a copper trace runs across the top while the PDF loads. Esc, focus trap and scroll lock come from the dialog. On phones the popup is full screen and zoom sits in the lower corner.

### Contact circuit

The red contact board carries a small real circuit. Three input nets labelled LINKEDIN, GITHUB and EMAIL run from the button side into U1 (ESP32); U1 drives D1, the status LED, through R1 to a ground via, and talks I2C (SDA, SCL) to U2, a 128x64 OLED module whose header prints its pinout (GND, VCC, SCL, SDA) in silkscreen. D1 is red (led) while it waits. Any contact action sends a one-shot hot-copper pulse down its input net and on through U1; D1 turns led-green and the OLED, in its own monospace device face (a data-ui fragment), types the reply at 22ms a character: what was opened, then thanks and I'll get back to you ASAP, with a blinking block cursor. Reduced motion shows the final state at once.
## Do's and Don'ts

### Do:
- **Do** reserve LED red for the email action and lit parts; light one board component at a time.
- **Do** draw every non-type line in copper or dim copper, with 45-degree routing and round caps.
- **Do** separate surfaces with mask tone steps (mask, mask-raised, mask-deep) rather than shadows.
- **Do** set headings heavy and condensed (weight 800-820, wdth 74-76) and running text at full width.
- **Do** show photographs greyscale (grayscale 1, contrast 1.08, brightness 0.86) and credit them.
- **Do** animate by deposition: wipes, drawn traces, pulses, on the ease-out curve, with a reduced-motion path.
- **Do** update config/print-config.ts flat colours whenever a colour token changes.

### Don't:
- **Don't** round rectangles; circles are only for vias, holes, fiducials and ring markers.
- **Don't** add box-shadows, glows, gradients or glass panels.
- **Don't** introduce a sixth type size or a second typeface.
- **Don't** use uppercase tracked labels or small headers stacked above headings.
- **Don't** use LED red for decoration, emphasis or text colour; red solder mask belongs to the contact board alone.
- **Don't** bounce or overshoot; nothing springs.
