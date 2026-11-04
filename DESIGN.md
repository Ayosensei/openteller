# DESIGN.md: Openteller design system (v5)

Status: v5, 4 Nov 2026. Replaces v4. Sections 0–9 retain the supplied design system and its Motion / React Aria updates. Sections 10–20 are newly authored reconstructions, **not recovered original text**. Written for coding agents and Stitch prompts.

---

## 0. How to use this file

### 0.1 Precedence
1. This file beats Stitch screens. Stitch screens are visual reference only. Known Stitch drift: serif page titles (use Bricolage Grotesque), invented footer and status text, a grid pattern on the slab, outlined-circle tape notches, avatar and extra nav items, text inside the ruler margins.
2. SPEC.md and INTEGRATIONS.md beat this file on **product behaviour** (what states exist, what the API returns). This file beats them on **appearance**.
3. If two rules in this file disagree, the more specific rule wins (a component rule beats a general rule).

### 0.2 The no-guessing rule
If a value, behaviour or piece of copy is not in this file, **do not guess**. Do one of these, in order:
1. Look for the nearest existing pattern in this file and reuse it exactly.
2. If none fits, stop and ask the builder.
3. When the builder answers, add the answer to this file in the same commit as the code.

Never introduce a new colour, font size, spacing value, radius, shadow, animation or icon without adding it here first.

### 0.3 Markers used in this file
- `VERIFY` means the behaviour depends on something not yet confirmed in INTEGRATIONS.md. Build it with fixtures and a code comment `// VERIFY against 1Click status response`.
- `DECISION` marks a call made in this file so the agent does not have to make it.
- `OPEN` marks a decision still waiting for the builder (collected in section 20).

### 0.4 Definition of done for any screen or component
A screen is done only when all of these hold:
- Every colour, size, space, radius, duration and easing comes from a token. No raw hex values, no raw pixel values outside the tokens, no Tailwind arbitrary values except where this file shows them.
- Every state in section 9.1 exists and was looked at: default, hover, active, focus-visible, disabled, loading, error, empty, and (for data) skeleton.
- Checked at 390px, 768px, 1024px and 1440px wide. No horizontal scroll at any width. No overlapping text.
- Keyboard path works end to end with a visible focus ring.
- No text on the screen claims anything the product does not do (section 12.4).
- Checked with `prefers-reduced-motion: reduce`.
- Lighthouse performance on the client invoice page is not worse than the budget in section 15.

---

## 1. Direction and principles

Reference research (getmoss.com/en-gb, glideapps.com, spade.com, plus builder-supplied Spade screenshots). v1 was too soft; v2 and v3 borrow Spade's **structural language** (not its palette). What we take:
1. **Chamfered corners, not rounded ones**, and L-shaped crop marks on key cards.
2. **Technical micro-labels:** tiny uppercase monospace labels led by a solid triangle.
3. **Scale contrast:** huge, heavy, tightly tracked numerals against very small mono text. This is the main source of drama.
4. **Saturated colour blocks:** a near-black slab and one ember-orange accent on a cream page.
5. **Ghost data chips and a contour-line coin** as quiet decoration.
6. **Ruler ticks** in the page margins on desktop.
7. **Traceability as the message:** every number links to its source.

Not taken: AI-led messaging, logo walls, stock photography, Spade's green and lime.

**Concept: the ledger slab.** A cream page, one dark slab that states the whole payment in two huge numbers, and a receipt tape below that proves it.

Principles:
1. The proof is the hero: what the client sent against what the freelancer received, side by side, as large as anything on the page.
2. Scale contrast does the work. Big numerals, tiny mono labels, nothing in between competing.
3. Nothing is claimed that the product does not do (section 12.4).
4. State is always visible and always explained in words, never colour alone.
5. Quiet motion that explains a change or reveals a section during scrolling, never motion for its own sake.
6. When a screen looks empty without filler, leave it empty.

---

## 2. Screen inventory

Real destinations only. Do not add pages, nav items, settings screens, notification screens or profile screens.

| Screen | Route | Who sees it | Spec |
|---|---|---|---|
| Landing (F1) | `/` | Anyone | 10.1 |
| Sign in | `/sign-in` | Freelancer | 10.9 |
| Invoice list | `/invoices` | Freelancer | 10.2 |
| Create invoice | `/invoices/new` | Freelancer | 10.3 |
| Invoice detail (F6) | `/invoices/[id]` | Freelancer | 10.4 |
| Client payment page | `/i/[slug]` | Client, no account | 10.5 |
| Receipt (print view) | `/invoices/[id]/receipt` | Freelancer | 10.6 |
| Exports | `/exports` | Freelancer | 10.7 |
| Not found | any bad route, bad slug | Anyone | 10.8 |
| Error | route error boundary | Anyone | 10.8 |

F1 and F6 keep their v2 numbers. Other screens are referred to by name until the UX flow assigns numbers.

Navigation: top bar on every freelancer screen with only **Invoices** and **Exports**. The client payment page and the landing page have their own minimal top bars (10.5, 10.1).

---

## 3. Colour

Light page, dark slabs. No dark mode and no theme toggle. Set `color-scheme: light` on `:root`.

### 3.1 Tokens

```css
:root {
  /* surfaces */
  --paper:        #F5F1E8; /* page background */
  --surface:      #FFFDF8; /* cards, tape, inputs */
  --sunken:       #EAE4D3; /* chips, secondary button, copy field, table header */
  --slab:         #14130F; /* dark slab, primary button, toast */

  /* ink on light */
  --ink:          #14130F;
  --ink-2:        #4A463D;
  --ink-3:        #6B665A;
  --ink-disabled: #9A9486;

  /* on dark */
  --on-slab:      #F5F1E8;
  --on-slab-2:    #A8A397; /* secondary text on slab */
  --on-slab-3:    #7A766B; /* ghost chips and decoration only, never real content */

  /* rules */
  --line:         #D9D2C0;
  --line-strong:  #C4BCA9;

  /* accent */
  --ember:        #F2552C;
  --butter:       #F3E9B5; /* one highlighted row only */

  /* hover and pressed fills */
  --slab-hover:   #2B2A24;
  --slab-press:   #000000;

  /* status: text + tint background */
  --open-fg:      #4A463D;  --open-bg:      #ECE7DB;
  --pending-fg:   #8A5A00;  --pending-bg:   #F7E7C2;
  --paid-fg:      #1B6B45;  --paid-bg:      #D9EEDF;
  --underpaid-fg: #A33A00;  --underpaid-bg: #F8DCCB;
  --refunded-fg:  #3D4F63;  --refunded-bg:  #DDE5EC;
  --void-fg:      #6B665A;  --void-bg:      #E6E2D8;
  --overdue-fg:   #B3261E;  /* text only */
}
```

### 3.2 Which token for which job

| Job | Token |
|---|---|
| Page background | `--paper` |
| Card, tape, input, popover background | `--surface` |
| Chips, secondary button, copy field, table header, skeleton base | `--sunken` |
| Dark slab, primary button, toast | `--slab` |
| Body and heading text on light | `--ink` |
| Secondary text on light (ui-s, captions, helper text) | `--ink-2` |
| Tertiary text on light (labels, timestamps, placeholder) | `--ink-3` |
| Disabled text and icons | `--ink-disabled` |
| Hairline dividers, card borders | `--line` |
| Input borders, secondary button borders, dotted leaders | `--line-strong` |
| Focus ring on light | `--ink` |
| Focus ring on dark | `--on-slab` |
| Active nav underline, quote-bar-free accents, hero received amount | `--ember` |
| Newest trail row highlight | `--butter` |
| Error text and error borders | `--underpaid-fg` |
| Error banner fill | `--underpaid-bg` |
| Overdue text | `--overdue-fg` |
| Skeleton shimmer | none; opacity only (section 7) |
| Text selection | background `--ink`, text `--paper` |
| Placeholder text | `--ink-3` |

### 3.3 Rules
- **Ember is for large text on dark, non-text accents, and one underline.** Ember on `--paper` is about 3:1, so never use it for small text, links, borders of inputs, or icons that carry meaning on light surfaces. On `--slab` it is about 5.4:1 and fine for large numerals only (24px bold or larger).
- **Ember never fills a large area on a light surface.** `DECISION`: the only ember fills allowed are the 2px nav underline, the 6px dot ending the slab connecting line, and the contour coin strokes on the slab.
- Links on light surfaces: `--ink`, underlined. Links on slab: `--on-slab`, underlined.
- `--butter` highlights exactly one tape row (the newest). Never anywhere else.
- No gradients, no glass, no blur, no glow, no coloured shadows. The unprovided historical exception is explicitly unresolved in section 20 (OPEN 12).
- Status is always paired with a text label. Never colour alone.
- Overdue is red text next to an Open pill. It is not a status.
- Opacity is allowed only for ghost chips (15%), contour coin (20 to 35%), ruler ticks (40%) and disabled states. Do not use opacity to make new colours.
- Approximate contrast: `--ink-3` on `--paper` about 5:1, `--on-slab-2` on `--slab` about 7:1, `--on-slab-3` on `--slab` about 4:1 (decoration only). Run a checker on every pairing before shipping.
- Do not tint, lighten or darken tokens in code (no `color-mix`, no `/50` Tailwind opacity modifiers) unless a rule above says so.

### 3.4 Tailwind mapping
`DECISION`: CSS variables in `app/globals.css` are the single source of truth. Tailwind reads them. Do not duplicate hex values in a Tailwind config.

```css
/* Tailwind v4 */
@theme {
  --color-paper: var(--paper);
  --color-surface: var(--surface);
  --color-sunken: var(--sunken);
  --color-slab: var(--slab);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-ember: var(--ember);
  --color-butter: var(--butter);
  /* status tokens mapped the same way */
}
```
If the project uses Tailwind v3, map the same names in `tailwind.config.ts` with `colors: { paper: 'var(--paper)', ... }`. Either way the class names are `bg-paper`, `text-ink-2`, `border-line` and so on. Disable Tailwind's default palette so default colours cannot be used by accident.

---

## 4. Typography

All free (SIL OFL), **self-hosted through `next/font`**. No Inter, Roboto, Arial or system font as the visible face. No icon fonts.

### 4.1 Families

| Role | Family | Use |
|---|---|---|
| Display | **Bricolage Grotesque** (variable: `wght`, `opsz`, `wdth`) | Page titles, landing headlines, hero amounts, invoice total, wordmark |
| UI | Instrument Sans (variable) | Body text, descriptions, helper text |
| Technical | Martian Mono (variable) | Labels, nav, buttons, timestamps, hashes, addresses, table figures, tape rows |

Fallbacks: `system-ui, sans-serif` for Display and UI, `ui-monospace, monospace` for Technical. Use `next/font`'s `adjustFontFallback` so fallback metrics match and layout does not shift.

```ts
// app/fonts.ts (shape only)
export const display = Bricolage_Grotesque({
  subsets: ['latin'], variable: '--font-display', display: 'swap',
  axes: ['opsz', 'wdth'],           // weight axis is variable by default
});
export const ui   = Instrument_Sans({ subsets: ['latin'], variable: '--font-ui', display: 'swap' });
export const mono = Martian_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
```
Load only the `latin` subset. Preload Display and Technical on the client payment page. Do not load italics.

### 4.2 Day-one verification (OPEN 1)
Check that Bricolage digits are tabular (`font-variant-numeric: tabular-nums` changes widths so all digits match). If they are not, hero amounts switch to Martian Mono and this file is updated. Build hero amounts through one `HeroAmount` component so the switch is a one-line change. The Stitch screen shows mono hero digits; that is the fallback, not yet the decision.

### 4.3 Display settings
Weight 700 to 800, letter-spacing -0.04em, line-height at or under 1.0 for sizes above 56px, `font-variation-settings: 'opsz' <max>` above 40px, `font-optical-sizing: auto` below that.

### 4.4 Scale

| Token | Family, weight | Size / line (desktop / mobile) | Tracking | Use |
|---|---|---|---|---|
| display-xl | Display 800 | 88/84 / 48/48 | -0.04em | Landing headline only |
| display-l | Display 800 | 72/72 / 44/46 | -0.04em | Page title (client name, "Invoices") |
| display-m | Display 700 | 40/44 / 30/34 | -0.035em | Section titles, empty-state sentence |
| amount-hero | Display 700 | 80/76 / 48/52 | -0.04em | The two hero amounts on the slab |
| amount-unit | Display 500 | 28/28 / 20/20 | -0.02em | Token code beside a hero amount |
| total | Display 700 | 24/28 | -0.02em | Invoice total in the summary, stat tile figures |
| ui-l | UI 500 | 18/26 | 0 | Lead text |
| ui-m | UI 400 | 16/24 | 0 | Body, inputs |
| ui-s | UI 400 | 14/20 | 0 | Secondary text, helper text, errors |
| mono-m | Technical 400 | 14/20 | 0 (nav and buttons: +0.1em, uppercase) | Buttons, nav, table values, amounts in rows |
| mono-s | Technical 400 | 13/20 | 0 | Tape rows, hashes, timestamps, copy field |
| mono-xs | Technical 400 | 11/16 | +0.04em | Ghost chips, stamp date |
| label | Technical 500 | 12/16 | +0.14em, uppercase | Every label, led by the triangle marker |

Rules:
- Only the tokens above exist. Do not set `font-size` anywhere else. In Tailwind, define these as the only `text-*` utilities and remove the defaults.
- **Hero amounts use Display; all other figures use Technical.** `DECISION`: stat-tile figures and the invoice total use Display (`total`), because they are headline numbers, not table values.
- Figures are tabular (`font-variant-numeric: tabular-nums`), never wrapped (`white-space: nowrap`), right-aligned in columns.
- Sentence case for everything except labels, nav and button text, which are uppercase mono. `DECISION`: **button text is uppercase mono** (matches the screen: "Copy link" in the Stitch image is mixed case; the file wins, so uppercase with +0.1em tracking). Exception: none.
- Body copy max line length 64 characters (`max-width: 64ch`). Lead text 52ch.
- Use `text-wrap: balance` on display-xl, display-l, display-m and empty-state sentences. Use `text-wrap: pretty` on ui-m and ui-l paragraphs.
- Headings: one `h1` per page (the display-l title or landing headline). Section titles are `h2`. Labels are not headings.
- Never use bold inside body text. Never use italics anywhere.
- Underline: links only, `text-underline-offset: 3px`, `text-decoration-thickness: 1px`.
- Do not justify text. Do not hyphenate (`hyphens: manual`).

### 4.5 Fluid sizing
Mobile and desktop values in the table switch at the 1024px breakpoint. Between 640px and 1023px, use the mobile value except for display-xl and display-l, which interpolate with `clamp()` between mobile and desktop values across 640px to 1024px. No other fluid type.

### 4.6 Hero amount fitting
A hero amount never wraps and never truncates. `DECISION`: `HeroAmount` picks a size by character count of the formatted number (including comma and point):

| Characters | Desktop size | Mobile size |
|---|---|---|
| up to 9 (for example `1,250.00`) | 80 | 48 |
| 10 to 12 | 64 | 40 |
| 13 or more | 52 | 32 |

The token code (`amount-unit`) scales with it (35% of the amount size, minimum 16px). Check that two 12-character amounts still fit the slab at 1024px; if not, lower the step, do not wrap. The character thresholds are first guesses: tune them against real renders and write the final numbers here.

---

## 5. Layout

### 5.1 Breakpoints and containers
- Mobile-first. Breakpoints: **640px** (sm), **1024px** (lg). No other breakpoints. `DECISION`: 768px is checked in QA but has no rules of its own; it uses the 640 to 1023 layout.
- Page padding: 16px below 640, 32px from 640 to 1023, 48px from 1024.
- Max content width 1344px, centred. Background (`--paper`) is full bleed.
- Ruler margins (7.6) sit outside the content. Content sits 48px inside the ticks.

### 5.2 Grid
- 12 columns from 1024px, 24px gutter. Below 1024px: single column.
- Invoice detail: tape spans 7 columns, summary spans 5 columns. Slab spans 12.
- Invoice list: table spans 12.
- Create invoice: form spans 7 columns, live summary spans 5 and is sticky (`top: 96px`) on desktop.
- Forms and reading content outside a grid (landing text, exports form): max width 640px, left aligned to the content edge. `DECISION`: never centre text blocks.
- Alignment: everything aligns to the left content edge. Centring is allowed only inside the slab centre zone, empty states (no: empty states are left aligned too), and the toast.

### 5.3 Spacing usage
Spacing tokens are `--s-1` (4px) to `--s-20` (80px) from section 6. Use only these.

| Where | Value |
|---|---|
| Between page header and first block | `--s-8` (32px) |
| Between major blocks on a page | `--s-6` (24px) inside a grid, `--s-14` (56px) between landing sections, `--s-20` (80px) between landing hero and next section |
| Card padding | 24px (16px on mobile). Tape: 32px (20px on mobile). Slab: 56px (24px on mobile) |
| Label to its content | `--s-3` (12px) |
| Form field to field | `--s-5` (20px) |
| Form label to input | `--s-2` (8px) |
| Input to its helper or error text | `--s-2` (8px) |
| Between buttons in a row | `--s-3` (12px) |
| Table cell horizontal padding | `--s-4` (16px) |
| Tape row vertical padding | `--s-3` (12px) top and bottom |
| Icon to adjacent text | `--s-2` (8px) |
| Top bar bottom to page title | `--s-10` (40px) |
| Last block to page bottom | `--s-14` (56px) |

### 5.4 Page templates
**Freelancer page** (invoice list, create, detail, exports):
1. Top bar (8.1), sticky.
2. Page header: label row, display-l title (with optional status pill), actions at the right on desktop. Hairline `--line` under the header.
3. Content.
4. No footer. `DECISION`: the freelancer app has no footer. The Stitch screen invented one (`OPENTELLER_KERNEL_V2.4`, `TX_SYNC_IDLE`); delete it.

**Client page:** minimal top bar (wordmark only), content, no footer, no nav.

**Landing:** top bar, sections, simple footer (10.1).

### 5.5 Z-index scale
Only these values: base 0, ruler margins 1, sticky top bar 20, sticky summary 10, popover and token picker 30, dialog and bottom sheet 40, toast 50. Do not invent others.

### 5.6 Ruler margins (desktop only, 1024px and up)
Fixed pseudo-elements on the far left and right edges: 12px horizontal ticks every 28px at 40% `--ink`, plus a solid triangle marker pointing inward at the vertical midpoint of the viewport. Repeating background, `aria-hidden`, `pointer-events: none`. **No text in the margins** (the Stitch screen put `00.00` there; remove it). Hidden below 1024px. Ticks are static (no scroll linking).

---

## 6. Shape, borders, elevation

```css
:root {
  /* 4px base spacing */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px; --s-5: 20px;
  --s-6: 24px; --s-8: 32px; --s-10: 40px; --s-14: 56px; --s-20: 80px;

  --r-sm: 4px;        /* buttons, chips, status pills, inputs, QR block */
  --chamfer-lg: 14px; /* slab, cards, tape */
  --chamfer-sm: 8px;  /* small tiles, ghost chips, ticks of chips */

  --shadow-float: 0 8px 24px rgba(20,19,15,0.12); /* popovers, toasts, token picker only */
}
```

### 6.1 Rules
- **Panels and cards have chamfered corners, not rounded ones.** Buttons, chips, pills, inputs and the QR block use `--r-sm`. Nothing else is rounded. Circles are allowed only for monograms, status dots, the quote-line end dots and tape notches.
- Resting cards have no shadow. Structure comes from 1px borders, slab-versus-paper contrast and crop marks.
- Borders are always 1px. Exceptions: focus ring (2px), active nav underline (2px), stamp (double 2px), quote bar (2px).
- Border colour: `--line` for cards and dividers, `--line-strong` for inputs and secondary buttons.

### 6.2 Chamfer implementation
Build **one** reusable `Chamfer` component. Never hand-roll chamfers per card.

```css
clip-path: polygon(
  14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px),
  calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px);
```
`clip-path` clips borders, so a bordered chamfered card is two layers: an outer element filled with the border colour, and an inner element inset by the border width with a **reduced chamfer**. For a 1px border the inner chamfer is `c - 0.586px` (that is `c - (2 - sqrt(2)) * border`), so 14px becomes about 13.41px and 8px becomes about 7.41px. This keeps the border the same thickness along the 45 degree cuts.

Component API: `<Chamfer size="lg" | "sm" fill="surface" | "slab" | "sunken" border="line" | "none" crop={boolean}>`. Slabs use `border="none"`. Focus rings on a chamfered element are drawn with an outline on the content child, not on the clipped element.

Chamfers are not animated. Chamfers scale down to `--chamfer-sm` on tiles and ghost chips. On mobile slab and tape keep 14px.

### 6.3 Crop marks (component rule)
L-shaped marks, 8px legs, 1.5px stroke, `--ink` on light (`--on-slab` at 40% is not allowed; slabs do not carry crop marks), in the four corners of key cards: tape, invoice summary, stat tiles, QR block, create-invoice live summary. Not on every element. Offset: 8px from the card edge, inside the border. Drawn as inline SVG or CSS borders in the `Chamfer` component's `crop` prop. `aria-hidden`.

### 6.4 Tape notches
Semicircles **cut into** the top and bottom edges (the page background shows through). Implemented with a CSS mask, not drawn circles.

```css
.tape-outer {  /* border-colour layer */
  mask:
    radial-gradient(circle 10px at 32px 0,    #0000 98%, #000) 0 0    / 64px 51% repeat-x,
    radial-gradient(circle 10px at 32px 100%, #0000 98%, #000) 0 100% / 64px 51% repeat-x;
}
.tape-inner {  /* surface layer, inset 1px, concentric notch one pixel larger */
  mask:
    radial-gradient(circle 11px at 31px -1px,  #0000 98%, #000) 0 0    / 64px 51% repeat-x,
    radial-gradient(circle 11px at 31px calc(100% + 1px), #0000 98%, #000) 0 100% / 64px 51% repeat-x;
}
```
Notch radius 10px, pitch 64px, first notch centre 32px from the left. Verify visually; adjust numbers here if the render is off. Notches stay static. The tape keeps a straight outline plus the notches: **no chamfer on the tape**. `DECISION`: this resolves the "chamfer or straight edge" ambiguity in v2. Do not draw outlined circles.

### 6.5 Elevation
`--shadow-float` only on popovers, token picker (desktop), toasts and dialogs. Nothing else has a shadow. Dialogs sit over a `--ink` scrim at 40% opacity (the only large-area opacity allowed).

---

## 7. Motion

```css
:root {
  --dur-1: 120ms; --dur-2: 200ms; --dur-3: 320ms; --dur-4: 600ms;
  --ease-out:    cubic-bezier(0.2, 0, 0, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 7.1 Rules
1. Animate only `transform` and `opacity`. Height changes use the `grid-template-rows: 0fr` to `1fr` technique.
2. Nothing exceeds `--dur-4`, except the quote countdown (linear).
3. Every animation answers "what just changed?"
4. `prefers-reduced-motion: reduce` replaces motion with instant changes or a plain fade (no transform).
5. Animate **new** data events (a payment arriving while the page is open), never previously known data as though it just arrived. On first paint, everything already in the initial viewport is visible immediately, without an entrance effect or stagger. `DECISION`: below-the-fold landing sections may reveal once when they first enter the viewport (7.4). On app, invoice, payment and receipt screens, existing data appears immediately; no scroll reveals.
6. No bounce, no overshoot, no parallax, no confetti, no looping decoration, no scroll-jacking, no hover tilt, no cursor effects. Scroll reveal is a one-time trigger, not scroll-linked motion.
7. Use `--ease-out` for things entering, `--ease-in-out` for things moving between states. Exit animations are 60% of the entry duration.

### 7.2 The complete list
Anything else needs approval.

| Where | Motion | Timing |
|---|---|---|
| Route change | Fade plus 4px rise of the page content | `--dur-2`, ease-out |
| Step change on client page | Outgoing step fades; incoming fades plus 4px rise | `--dur-2`, ease-out |
| Status pill change | Cross-fade | `--dur-2` |
| New trail event | Row fades in with a 4px rise; connecting line draws (scaleY 0 to 1, origin top) | `--dur-3`, 60ms stagger |
| Slab connecting line | Draws from the client end to the received end when payment completes (scaleX 0 to 1, origin left; scaleY on mobile) | `--dur-3`, ease-out |
| Slab amounts changing (new quote) | Cross-fade of the figure | `--dur-2` |
| Paid stamp | Fades in from scale 1.12 to 1 while keeping its tilt (no overshoot), only when status changes to Paid on screen | `--dur-2`, ease-out |
| Quote countdown | Thin bar shrinks (scaleX), linear; turns `--underpaid-fg` under 60s | Linear |
| Copy button | Label swaps "Copy" to "Copied" for 1.6s | `--dur-1` |
| Buttons | Background change on hover, 1px translate on press | `--dur-1` |
| Dialog and bottom sheet | Scrim fades; panel fades plus 8px rise (sheet: translateY 100% to 0) | `--dur-3`, ease-out |
| Token picker, popover | Fade plus 4px rise | `--dur-2`, ease-out |
| Toast | Fade plus 8px rise in; fade out | `--dur-2` in, `--dur-1` out |
| Line item added | Row fades in | `--dur-2` |
| Line item removed | Row fades out, then collapses via grid-rows | `--dur-2` then `--dur-2` |
| Error message appearing under input | Fade | `--dur-1` |
| Loading | Skeleton opacity 0.6 to 1, no shimmer, shown only after 150ms | 1.2s loop |
| Landing sections below the fold | One-time fade with 8px rise, no per-child staggering | `--dur-3`, ease-out; viewport trigger per 7.4 |

Static (never animated): the contour coin, ghost chips, ruler ticks, crop marks, notches, the stamp after it has appeared.

### 7.3 Hover and touch
Hover styles apply only inside `@media (hover: hover)`. On touch devices the pressed (`:active`) style is the only feedback. Do not rely on hover to reveal essential content or actions.

### 7.4 Motion implementation, scroll reveals and performance (v4)
**Required installation for the coding agent (from the repository root):**

```bash
npm install motion
npx motion-ai
npm install react-aria-components
```

- `motion` is the animation dependency. Use Motion for React imports from `motion/react` in client components, or `motion/react-client` where appropriate in the Next.js App Router. `npx motion-ai` installs the Motion AI Kit / agent skill and documentation tools; it is **not** a replacement for the runtime library. Follow its interactive setup for the current project and agent, read the installed `/motion` guidance, and reuse relevant free Motion examples/patterns only if they comply with this document. Do not assume paid Motion+ examples/components are available. Never add a paid service or subscription without builder approval.
- Use Motion for stateful transitions, presence and permitted scroll reveals. Prefer ordinary CSS transitions for simple background/colour feedback and static CSS for layout. Do not wrap the entire UI in motion components or ship a global animation provider when it is unnecessary.
- **Scroll reveal scope:** only major **landing-page sections below the initial viewport**, and optionally one section-level block within each; do not reveal individual invoice rows, numbers, payment controls, form fields or critical text. Keep content visible in the DOM and accessible while animating. Trigger **once**, when about 15% of the section enters the viewport, using `whileInView` / `viewport={{ once: true, amount: 0.15 }}` or an equivalent `IntersectionObserver` setup. Starting transform: `translateY(8px)`; end `translateY(0)`; fade opacity from 0 to 1 over `--dur-3` (320ms), with `--ease-out`. No stagger and no replay when scrolling back.
- **First-viewport exception:** landing hero, top bar, above-the-fold CTAs and any part initially visible must render fully visible on first paint. Prevent server-rendered content from being hidden before hydration, including if JS is delayed or unavailable. If an in-view setup cannot safely guarantee this, skip that reveal rather than hide content.
- **Reduced motion:** respect `prefers-reduced-motion: reduce` via Motion's `useReducedMotion` or equivalent and CSS media rules. Do not hide content awaiting intersection or perform translate animations. Render at final values immediately (a subtle opacity-only change is permissible for state events, not required). Disable skeleton pulsing in reduced motion as already specified in 9.24.
- **Low-end-device budget:** use only `opacity` and compositor-friendly `transform` for reveals. No animating `top`, `left`, `width`, `height`, filters, backdrop blur, box shadows or layout properties per frame. Avoid scroll listeners, per-frame React state updates, `useScroll` for decorative effects, long-running timelines, simultaneous dozens of reveals, and permanent `will-change`. Apply `will-change` only while actively animating, if profiling proves it helps. Disconnect observers after one-time reveals.
- Keep the static page usable before JS and on slow devices. Test scrolling in mobile emulation with CPU throttling, check memory/CPU and dropped frames, and remove or simplify effects causing visible jank. Do not sacrifice payment clarity or accessibility for motion.
- All Motion animations must use the timing/easing tokens in section 7; avoid library-default springs, automatic layout animation and unapproved presets. Motion AI Kit suggestions are starting points, **not** authority over this file.

**Reference:** https://motion.dev/docs/react and https://motion.dev/docs/ai-kit-install.


---

## 8. Iconography and marks

No icon library. Icons are hand-written inline SVG components in `/components/icons`. No icon fonts, no emoji, no unicode glyph icons (not even arrows in text: use the SVG).

### 8.1 Icon spec
- 24x24 viewBox, 1.5px stroke, `stroke="currentColor"`, `fill="none"`, `stroke-linecap="square"`, `stroke-linejoin="miter"`. No fills except status dots and the triangle marker. No rounded ends, no circles with fills.
- Rendered sizes: 16px (inside buttons, labels, pills), 20px (inside inputs), 24px (stand-alone). Stroke stays 1.5 in the viewBox; do not scale stroke separately.
- Colour is inherited from text colour. Never colour an icon differently from its adjacent text unless disabled.
- Decorative icons: `aria-hidden="true"`, `focusable="false"`. An icon that is the only content of a button needs `aria-label` on the button (visible text is preferred).
- Pixel-snap: design on whole and half pixels so 1.5px strokes render crisp at 24px.

### 8.2 Required set
Draft, then refine by hand. Each is one component with the same props (`size`, `className`, `title?`).

| Icon | Used for | Drawing note |
|---|---|---|
| copy | Copy buttons | Two offset squares |
| check | Copied state, selected token row | Simple tick, square caps |
| clock | Pending hint | Circle plus two hands (circle stroke is allowed) |
| arrow-up-right | "Open transaction" and all external links | Diagonal line plus corner |
| chevron-down | Token picker trigger, expanding rows | |
| chevron-right | Table row affordance on mobile cards | |
| close | Dialog, sheet, picker close | Two diagonal lines |
| plus | Add line item | |
| trash | Remove line item | Box plus lid, no fill |
| drag-handle | Reorder line items | Three short horizontal lines |
| download | Download CSV, print receipt | Arrow into tray |
| link | Copy link | Two interlocked rectangles with square ends |
| qr | Only if needed beside the QR caption | Three corner squares plus modules drawn as strokes |
| wallet | Token picker empty state or pay step hint | Rectangle with a notch |
| warning | Error banner | Triangle with exclamation line |
| refresh | Get a new quote | Two arcs with arrowheads |
| search | Search inputs | Circle plus handle |
| spinner | Loading buttons | A 270 degree arc; rotates only while loading (section 7.2) |

Do not add icons outside this list without approval.

### 8.3 Triangle marker
A solid right-pointing triangle, 6px wide by 8px tall, `currentColor`, drawn as an inline SVG (not a text glyph, to avoid font fallback differences). 8px gap before the label text. It is the only filled shape in the icon system besides status dots.

### 8.4 Monograms
Chains and tokens use **monograms only**: the first 2 letters of the ticker or network name in `mono-xs` weight 500, uppercase, inside a 24px `--sunken` circle with a 1px `--line` border, text `--ink`. No brand logos, no hotlinked images. One `Monogram` component with `size` 24 (default) or 16 (inline in pills).

### 8.5 Wordmark
"openteller", lowercase, Display 800, -0.04em, 24px, `--ink`. No logo symbol for the hackathon. Wordmark links to `/invoices` for signed-in freelancers, to `/` otherwise. On the client page it is not a link (the client should not be sent away mid-payment). `DECISION`.

### 8.6 Favicon
Inline SVG favicon: a `--slab` square (32x32, 4px radius) with a `--paper` right-pointing triangle centred. No raster favicon files. See section 18.

---

## 9. Components

### 9.0 Required accessible component foundation (v4)
**React Aria Components is the default React primitive library for interactive UI.** Install it with `npm install react-aria-components` (also listed in 7.4). Use its unstyled accessible primitives where applicable—buttons, text fields, labels, inputs, select/listbox or combobox patterns, popovers, dialogs, forms, and related controls—then style each through the exact Openteller tokens, chamfers and states below. Do **not** adopt a generic component theme, visual preset, icon pack, or default-library appearance. React Aria provides accessible behaviour; this `DESIGN.md` remains the sole authority for appearance and product-specific flow.

- Create small local wrappers (for example `Button`, `TextField`, `Dialog`, `TokenPicker`) around the React Aria primitives. Keep their semantic keyboard/focus behaviour and test against section 9.1 instead of recreating focus management manually. Preserve `focus-visible`, `disabled`, `invalid`, pending/loading and accessible descriptions. Prefer styling React Aria's state attributes (`data-focused`, `data-focus-visible`, `data-disabled`, etc.) when relevant.
- **Intentional exceptions:** keep the native browser date input prescribed by 9.6, semantic HTML tables/lists, and custom visual-only elements (slab, tape, marks) rather than introducing unnecessary primitives. For the token picker (9.9), choose a React Aria `ComboBox`/`ListBox`/`Popover` or accessible equivalent only if it meets the exact existing search, selection, keyboard and mobile sheet rules. Do not silently change its UX to match a library default.
- For the void confirmation dialog (9.21), use React Aria's modal/dialog foundation where it can satisfy existing focus return, Esc, outside-dismissal and least-destructive initial focus; the old instruction to use native `<dialog>` is superseded **only for its implementation primitive**, not for its dimensions, content, dismissal or accessibility. Do not nest competing dialog/focus traps.
- React Aria and Motion must compose without duplicating interaction handlers, breaking refs or removing accessible semantics. Motion may wrap an outer visual panel; keep focusable React Aria controls as the interaction source. Animate panel appearance, not keyboard focus or semantic state. When composition requires custom wrappers, use supported refs and forward props intentionally.
- Import only the primitives actually used. Avoid extra component frameworks or headless UI libraries. The existing no-icon-library and custom SVG rules in section 8 still apply.

**Reference:** https://react-spectrum.adobe.com/react-aria/components.html.

### 9.1 States every interactive component must have

| State | Rule |
|---|---|
| Default | As specified per component |
| Hover | Inside `@media (hover: hover)` only. Fill or underline change, never movement |
| Active (pressed) | 1px translateY on buttons; fill goes to the press colour |
| Focus-visible | **2px `--ink` ring, 2px offset (`--on-slab` on dark surfaces), never removed.** Use `:focus-visible`, not `:focus`. Ring follows the element's shape: 4px radius for buttons and inputs; for chamfered cards, the ring is a rectangle around the interactive child |
| Disabled | `--line` fill, `--ink-disabled` text, `cursor: not-allowed`, `aria-disabled` plus `disabled`. No hover. Disabled controls still have a reason visible nearby when the reason is not obvious (for example, a helper line under "Get a quote": "Choose a token first.") |
| Loading | Label stays, spinner replaces the icon slot (or appears left of the label if there was no icon), width unchanged, `aria-busy="true"`, clicks ignored |
| Error | Error border `--underpaid-fg`, message under the control in `ui-s` and the same colour, linked via `aria-describedby`, `aria-invalid="true"`. Message says what happened and what to do |
| Empty and skeleton | For data components only (section 9.24, 9.22) |

Minimum touch target 44px by 44px on mobile and desktop. Where a visual element is smaller (a 24px monogram, a 16px icon), extend the hit area with padding.

### 9.2 Top bar (freelancer pages)
- Desktop: 72px tall, `--paper`, 1px `--line` bottom border, sticky at `top: 0`, z-index 20. Content width and padding follow section 5.1.
- Left: wordmark. Next to it with 48px gap: nav items **Invoices** and **Exports** only. Nav is `mono-m` uppercase, +0.1em tracking, `--ink-2`. Active item: `--ink` with a 2px `--ember` underline that sits flush on the bar's bottom border (the underline overlaps the border, 6px below the text baseline box). Hover: `--ink`. The current page is marked `aria-current="page"`.
- Right: the signed-in identity in a **non-interactive** mono-s chip on `--sunken`, `--r-sm`, 8px by 12px padding, using the provider email or display name and middle-truncating only below 640px. A separate ghost text button `SIGN OUT` follows it with a 12px gap and ends the Neon session. No avatar, status dot, notification icon or dropdown. A receiving NEAR account belongs to invoice/payment data and is not presented as the authenticated identity. (The Stitch screen added a black avatar button and `Ledger` and `Settings`: remove them.)
- Mobile (below 640px): two rows. Row 1, 56px: wordmark left, account chip right. Row 2, 44px: the two nav items, left aligned, 24px apart, with the same underline style. Both rows share the sticky bar. No hamburger menu.
- Bottom border of the bar appears at all times (no scroll-linked shadow).

### 9.3 Buttons
Only these variants exist. All are 44px tall, `--r-sm`, label in `mono-m` uppercase +0.1em, 20px horizontal padding, 8px gap between icon (16px) and label. Icon on the left. Buttons do not wrap their label (`white-space: nowrap`); on narrow screens they stack or go full width instead (section 9.3.2).

| Variant | Spec |
|---|---|
| Primary | `--slab` fill, `--on-slab` text. Hover `--slab-hover`. Press `--slab-press`. Disabled per 9.1 |
| Secondary | `--sunken` fill, `--ink` text, 1px `--line-strong` border. Hover: fill `--line`. Press: fill `--line-strong` |
| Ghost | No fill, no border, `--ink` text. Hover: `--sunken` fill. Used for tertiary actions (Cancel, Change token) |
| Primary inverse | `--on-slab` fill, `--ink` text, for use **on a slab only** (landing final band). Hover: `#FFFFFF`-free alternative is not allowed, so hover uses `--sunken` fill |
| Icon-only | 44px square, ghost style, `aria-label` required. Used for remove line item, close |

Rules:
- One primary button per view region. A page header and a form footer may each have one.
- No red or destructive-coloured buttons. Destructive intent is carried by the label ("Void invoice") and a confirmation dialog.
- No full-pill or rounded-full buttons.
- Disabled primary buttons stay visible; do not hide actions.

#### 9.3.1 Button groups
Row of buttons: 12px gap, right-aligned in form footers and dialogs (primary last), left-aligned elsewhere. Order in a header action group: secondary then primary.

#### 9.3.2 Buttons on mobile
Below 640px: header actions become a two-column grid (each button 50% width, 12px gap) if both labels fit on one line at 390px; otherwise stack full width, primary on top. Form footers: full-width stacked, primary on top. Dialog footers: full-width stacked, primary on top.

### 9.4 Links
- Inline links: `--ink`, underlined (1px, 3px offset). Hover: underline thickness 2px. Visited links are not styled differently.
- On slab: `--on-slab`, underlined.
- "Open transaction" links: `mono-s` text, underlined, followed by the 16px arrow-up-right icon, 6px gap. They open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`) with visually hidden text "(opens in a new tab)".
- Never style a link as a button, and never style a button as a link.
- The block explorer URL for each network is data from INTEGRATIONS.md; do not hard-code explorers in components. `VERIFY`.

### 9.5 Label
`label` token (Technical 500, 12/16, +0.14em, uppercase), colour `--ink-2` on light and `--on-slab-2` on dark, **always led by the triangle marker** (8.3). Used for: card titles, slab zone headings, form field labels, step indicator, tile titles. One `Label` component.

Exceptions, decided here:
- Table header cells use label styling **without** the triangle.
- The closing `END OF TRAIL` marker on the tape is `mono-xs`, uppercase, +0.14em, `--ink-3`, no triangle.
- Account IDs and hashes inside a label keep their original case (they are data).

Labels are static text. They are never clickable. Labels may only describe real data or real structure (section 12.4).

### 9.6 Form controls

**Field wrapper:** label (9.5) above, 8px gap, control, 8px gap, helper or error text (`ui-s`, `--ink-2`; error `--underpaid-fg`). Optional fields add " (optional)" in `--ink-3` after the label text. Required fields have no marker. The helper line reserves no space when empty.

**Text input:** `--surface`, 1px `--line-strong`, `--r-sm`, 44px tall, 12px horizontal padding, `ui-m`. Placeholder `--ink-3`, an example value only (never instructions). Focus: border becomes 2px `--ink` (padding adjusted by 1px so nothing shifts) plus the ring from 9.1 is not duplicated: border plus 2px offset ring is the focus style. Disabled per 9.1. Read-only: `--sunken` fill, no hover, text `--ink`.

**Amount input:** as text input, `mono-m`, right-aligned text, currency code as a fixed suffix inside the field on the right (`--ink-3`, not editable, not selectable), `inputmode="decimal"`, `autocomplete="off"`. Spinners hidden. Formatting rules in section 13.

**Textarea (notes):** as text input, min 96px tall, resize vertical only, `ui-m`. Character counter `mono-xs` `--ink-3` bottom right, shown only after 400 of 500 characters.

**Date input:** native `<input type="date">` styled like a text input (`mono-m`), with the browser's picker. `DECISION`: no custom calendar widget. Set `min` and `max` where rules require. The native picker icon is hidden and replaced by the same calendar-free layout (no icon); the whole field is clickable.

**Search input:** text input with a 20px search icon at the left (12px inset, text padding-left 40px) and a clear (close) icon button at the right when non-empty.

**Segmented filter chips:** buttons, 36px tall visually with 44px hit area, `--r-sm`, `mono-s` uppercase +0.1em. Unselected: `--sunken` fill, `--ink-2` text, 1px `--line`. Selected: `--slab` fill, `--on-slab` text, `aria-pressed="true"`. A chip row wraps onto two lines on mobile (no horizontal scroll).

### 9.7 Line item editor (create invoice)
Desktop row (grid): description (grows, min 240px), quantity (88px), unit price (128px), line total (128px, right-aligned `mono-m`, not an input), drag handle (44px), remove (44px). Header row above the first item with column labels (label style without triangle). 1px `--line` between rows. Mobile: two lines per item: line 1 = description full width; line 2 = quantity, unit price, line total side by side (each with its own visible label above), handle and remove at the far right of line 1.

- Starts with one empty item. Minimum 1, maximum 20. At minimum the remove button is disabled.
- "Add line item" is a ghost button with the plus icon, under the last row; adds a row and moves focus to its description.
- Remove deletes the row, moves focus to the previous row's description (or the add button when none), and announces "Line item removed" to a polite live region.
- Reorder: drag with the handle; keyboard: focus handle, Space to pick up, Arrow Up/Down to move, Space to drop, Esc to cancel; announce position changes ("Line item 2 of 3, moved to position 1"). If time is short, reorder is cut before anything else on this screen (cut-line, see PLAN.md); then no handle is rendered.
- Line total is computed in integer minor units (cents), never floats. Display with the amount rules in section 11.

### 9.8 Status pill
`--r-sm`, 24px tall, 8px horizontal padding, `label` style (no triangle), a 6px filled dot (`currentColor`) 8px before the text, foreground and background from the status tokens. Text is the status name: Open, Pending, Paid, Underpaid, Refunded, Void (uppercase via label style).
- Void: the pill uses void tokens, and the invoice number elsewhere on the page gets `text-decoration: line-through`.
- Overdue: not a status. A separate `ui-s` text "Overdue" in `--overdue-fg`, 12px right of an Open (or Underpaid) pill. `DECISION`: overdue means due date is before today in UTC and status is Open or Underpaid. Pending and Paid are never overdue. `VERIFY` with SPEC.md.
- Status change: cross-fade (section 7.2). The pill is inside an `aria-live="polite"` region on detail pages.
- One status vocabulary everywhere (list, detail, client page). Underpaid and Refunded depend on 1Click: `VERIFY`.

### 9.9 Token picker
- **Trigger:** a field-style button (44px, `--surface`, 1px `--line-strong`, `--r-sm`) showing the token monogram, token ticker (`ui-m`), network name (`mono-s`, `--ink-3`) and a 20px chevron-down at the right. Empty: "Choose a token" in `--ink-3`. `aria-haspopup="listbox"`, `aria-expanded`.
- **Panel (desktop):** floating `--surface` panel, 1px `--line`, `--r-sm`, `--shadow-float`, 360px wide, max 360px tall, anchored below the trigger, z-index 30. Search input at top (autofocus), list below.
- **Bottom sheet (below 640px):** full width, max 80% viewport height, sits on a scrim, top corners chamfered (14px), a close icon button at the top right, search input then list. Body scroll locked while open.
- **Rows:** 52px, monogram, ticker (`ui-m`), network (`mono-s`, `--ink-3`, right-aligned). Selected row shows a 20px check at the far right. Active (keyboard) row: `--sunken` fill. Hover (hover devices): `--sunken`.
- **Order:** alphabetical by ticker, then network. No "popular" or "recommended" groups (we have no data for them).
- **Search:** case-insensitive match on ticker, token name or network. No match: row-less message "No token matches \"{query}\"." in `ui-s` `--ink-2`.
- **Keyboard:** Arrow Up/Down moves the active row (`aria-activedescendant`), Enter selects and closes, Esc closes and returns focus to the trigger, typing filters, Home/End jump. `role="listbox"` with `role="option"` rows.
- **Loading list:** five skeleton rows. **Error:** error banner inside the panel: "We couldn't load the token list. Close this and try again."
- The token list comes from 1Click. `VERIFY` how it is fetched (INTEGRATIONS.md).

### 9.10 Copy field
`--sunken` field, 1px `--line-strong`, `--r-sm`, 44px tall, value in `mono-s`, 12px padding, with an adjoining Copy button (primary, 44px, no icon). The field and button share one 44px row; the button joins the field edge with no gap and no radius on the joined side. Long values middle-truncate with an ellipsis (`0x3fa9…c21e` rule for hashes and addresses; invoice URLs truncate at the end with an ellipsis); the **full value is what gets copied**. The field is selectable and `readonly`.
- Copy writes to the clipboard, swaps the label "Copy" to "Copied" for 1.6s (`--dur-1`), announces "Copied" politely. No toast.
- If clipboard access fails: label becomes "Select and copy" and the field text is selected.

### 9.11 QR block
176px square, `--surface` background, modules `--ink`, 1px `--line`, `--r-sm`, 12px padding, crop marks (6.3) around it (outside the border by 8px), a caption under it in `ui-s` `--ink-2`: "Scan with a wallet that supports {network}." The QR encodes exactly what the copy field beside it copies. Rendered as inline SVG, no raster. Dependency decision is OPEN 2.

### 9.12 The slab (the proof)
A full-width panel, `Chamfer size="lg" fill="slab"`, minimum height 380px on desktop, padding 56px (24px on mobile). All text on it uses `--on-slab`, `--on-slab-2` or `--ember`. No grid pattern or texture (the Stitch screen drew one: delete it). No text outside the three zones except ghost chips and the contour coin.

**Desktop layout:** CSS grid `1fr minmax(240px, 320px) 1fr`, vertically centred content.

| Zone | Contents, top to bottom |
|---|---|
| Left, from the client | Label `FROM THE CLIENT`. Sent amount in `amount-hero` (`--on-slab`) with token code in `amount-unit` (`--on-slab-2`) on the same baseline, 12px apart. `NETWORK / 0xhash` in `mono-s` `--on-slab-2` (network uppercase, hash truncated per section 11). Underlined link "Open transaction" with arrow-up-right icon |
| Centre | Above the line: duration text in mono 20px `--on-slab` ("Settled in 3 min"). The connecting line. Below the line: UTC time range in `mono-s` `--on-slab-2` ("14:03 to 14:06 UTC, 12 Nov 2026") |
| Right, to you | Label `TO YOU`, right-aligned. Received amount in `amount-hero` `--ember` with `amount-unit` code. `NEAR / hash` in `mono-s`. Underlined "Open transaction" link. Right-aligned text |

**Connecting line:** 1px `--on-slab-2`, spanning the full width of the centre column, vertically aligned to the vertical centre of the two amounts (not to the page). A 8px filled dot at each end: left `--on-slab`, right `--ember`. **No arrow, no chevron.** It draws when payment completes (section 7.2). The line stays 16px clear of the amount text on both sides.

**Duration text:** time between the "Payment detected" and "Paid" events, formatted: under 1 minute "Settled in under 1 min"; 1 to 59 minutes "Settled in N min"; 1 to 23 hours "Settled in N h M min"; 24 hours or more "Settled in N days". `VERIFY` the timestamps exist.

**Ghost chips:** up to four, 1px `--on-slab` border at 15% opacity, `--chamfer-sm`, `mono-xs` `--on-slab-3`, 8px by 12px padding, each led by the triangle marker. They may only repeat **real data that appears on the tape**: default set `NETWORK / ARBITRUM` (top-left), `INVOICE / INV-0014` (top-centre), `PAYMENT DETECTED / 14:03 UTC` (bottom-centre), `PAID / 14:06 UTC` (bottom-right). Chips sit in the slab padding area and **never overlap** the zone text or the coin. Hidden below 1024px. `aria-hidden`.

**Contour coin (9.15):** top-right corner, cropped by the slab edge, never overlapping text. Because the right zone's label and amount sit near the top-right, **reserve a 160px by 160px exclusion box in the top-right corner**; the coin lives inside it and the right zone's content starts below it (push the zone down or shrink the coin). The Stitch screen overlapped the `TO YOU` label: do not repeat that.

**Hero amount:** component `HeroAmount` (4.6).

**Height:** the slab is 380px tall on desktop. The Stitch screen was about 475px because of a bottom row (`CHANNEL`, `FINALITY`) that is deleted. Do not add a bottom row.

**Mobile (below 1024px):** zones stack vertically (from the client, connecting line, to you). The connecting line becomes vertical (1px, 48px tall, dots at ends, `scaleY` draw), with the duration text and time range to its right. Amount sizes switch to the mobile column of 4.6. Ghost chips and coin hidden. Right zone text is left-aligned on mobile.

**Slab modes:**

| Mode | When | Left zone | Line | Right zone |
|---|---|---|---|---|
| Proof | Paid | Sent amount and token, network, hash, link | Drawn, with duration | Received amount in `--ember`, hash, link |
| Waiting | Pending (payment seen, not confirmed) | Sent amount and token (if known), network | Dashed 1px, no duration | Invoice amount in `--on-slab`, text "Awaiting confirmation" in `ui-m` `--on-slab-2` |
| Not yet paid | Open, freelancer view | "No payment yet" in `ui-l` `--on-slab-2` | Dashed 1px | Invoice amount in `--on-slab` (not ember: ember means received) |
| Quote | Client page, before paying | Quoted amount to send and token (label `YOU PAY`), countdown bar (9.19) | Dashed 1px | Invoice amount (label `INVOICE AMOUNT`), `NEAR / {account}` in `mono-s` |
| Underpaid | Underpaid | Sent amount | Drawn | Received amount (ember) and below it `ui-s` "50.00 USDC still due" `VERIFY` |
| Refunded | Refunded | Sent amount | Drawn | Label `REFUNDED TO CLIENT`, refunded amount in `--on-slab` `VERIFY` |

Void invoices show no slab: a `--sunken` panel (`Chamfer lg`, 120px min height, 32px padding) with one `ui-l` sentence: "This invoice was voided on 12 Nov 2026."

### 9.13 The tape (the trail)
A receipt strip on `--surface`. Straight edges with semicircular **notches cut into the top and bottom edges** (6.4). Crop marks in the corners. Padding 32px (20px on mobile).

- **Header:** label `PAYMENT TRAIL` at the left, invoice number in `mono-s` `--ink-3` beneath it. Nothing on the right (the Stitch screen put `LEDGER VERIFIED` there: delete). 1px `--line` rule under the header, 24px spacing.
- **Rows:** newest first. Each row is a flex line: timestamp column (fixed 168px on desktop, `mono-s`, `--ink-2`), event name (`mono-s`, `--ink`, weight 400; the newest row's event name weight 700 as in the screen), dot leader (9.26), right-aligned value (`mono-s`, `--ink`, tabular). 1px `--line` rule between rows, 12px vertical padding.
- **Newest row** has a `--butter` background that extends to the tape's inner edges (negative horizontal margin equal to the tape padding). Only one row is ever highlighted.
- **Timestamp format:** `12 Nov, 14:06 UTC`. `DECISION`: the year is omitted in the tape when it equals the invoice's issue year, included (`12 Nov 2027, 01:10 UTC`) when it differs. Full format is used in the slab and the receipt.
- **Closing block:** a 2px `--ink` rule, then `RECEIVED` + leader + amount in `mono-m` weight 700 (`RECEIVED` uppercase), then a dashed 1px `--line-strong` rule, then `END OF TRAIL` (right-aligned, see 9.5). **No checksum line.** If nothing is received yet (Open, Pending), the closing block shows `RECEIVED` + leader + `—`.
- **Mobile:** timestamp stacks above the event line (timestamp `mono-xs` `--ink-3`, then event + leader + value). Rows get 12px padding; no horizontal scroll.
- **Semantics:** `<ol>`, each row `<li>` with a `<time datetime>` element.

**Event catalogue** (the only event names allowed; value column shown):

| Event | Value | Status |
|---|---|---|
| Invoice created | Invoice amount in USDC | Our own data |
| Payment detected | Origin network name | `VERIFY` |
| Payment confirmed | Sent amount with token (`251.10 USDT`) | `VERIFY` |
| Paid | Received amount in USDC | `VERIFY` |
| Underpaid | "200.00 of 250.00 USDC" | `VERIFY` |
| Refunded | Refunded amount with token | `VERIFY` |
| Invoice voided | none (leader and nothing) | Our own data |

Anything that depends on how 1Click reports status (which events exist, which fields) is unverified. Build with fixtures and `// VERIFY against 1Click status response` until INTEGRATIONS.md confirms. A new event animates in (section 7.2); all rows present on load do not.

### 9.14 The paid stamp
A rectangle with a double 2px border in `--paid-fg`, rotated 4 degrees counter-clockwise, containing "PAID" (mono, 700, uppercase, +0.3em tracking, 20px) and the date beneath in `mono-xs` (`12 Nov 2026`). Text and borders `--paid-fg`, background `--surface`, no transparency, no texture. Sits half outside the tape's top-right corner (the screen placement is correct). **It must never cover text** (check that it does not touch the header's right edge or any row). One per page. Shown only for Paid. No stamp for other states (OPEN 5). Mobile: same placement, scaled to 85%. Entrance per section 7.2. This tilt is the single deliberate exception to the "no decoration" rule.

### 9.15 Contour coin
An isometric coin drawn only with thin topographic contour lines, a custom inline SVG under 10KB, strokes in `--ember` at 20 to 35% opacity, `aria-hidden`, static. Sits in the slab's top-right exclusion box (9.12), cropped by the slab edge. Builder draws the final SVG; the agent may place a simple placeholder (concentric ellipses stacked to suggest a coin) and mark it `// PLACEHOLDER: builder to replace`. Used on the slab only and, optionally, once on the landing final band.

### 9.16 Invoice summary card
`Chamfer lg` `--surface`, 1px `--line` border, crop marks, padding 24px (16px mobile). Contents, in order:
1. Header row: label `INVOICE SUMMARY` left; right-aligned `mono-xs` `--ink-3` "2 ITEMS" (real count; "1 ITEM" for one).
2. 1px `--line` rule.
3. Dates: `Issued` and `Due` as dot-leader rows (`ui-m` label, `mono-m` value, date format `10 Nov 2026`). A due date in the past on an Open invoice has its value in `--overdue-fg`.
4. 1px `--line` rule.
5. Line items: description `ui-m` + leader + line total `mono-m` (`150.00 USDC`). Beneath each, `mono-xs` `--ink-3`: `1 × 150.00`. 16px between items.
6. 1px `--line` rule.
7. Total: label `TOTAL` (the Stitch screen said `TOTAL RECONCILED`: that is an invented claim, delete) and the total in `total` token (Display 700 24/28) with the token code. Right-aligned.
8. Notes (if present): label `NOTES`, text in `ui-s`, max 500 characters, preserves line breaks.
9. Freelancer detail only: 1px `--line` rule, label `INVOICE LINK`, copy field (9.10) with the live URL.
Spacing between sections 24px. Card has no fixed height: it grows with content and the tape and the card align at the top (not stretched to equal height).

### 9.17 Stat tile
`Chamfer sm` `--surface`, 1px `--line`, crop marks, padding 20px. Label on top (e.g. `OUTSTANDING`), figure below in `display-m` (Display 700, 40/44; 30/34 on mobile) with the token code in `amount-unit` at 20px (16px on mobile) `--ink-3`, and a `ui-s` `--ink-2` count line under it ("3 invoices"). The whole tile is a button applying the matching list filter (`aria-pressed` when active; active tile has a 2px `--ink` border). 44px minimum height is trivially satisfied.

### 9.18 Table, card list, pagination (invoice list)
**Desktop table** (`<table>`): header row `--sunken`, 40px tall, label style without triangle. Body rows 56px, 1px `--line` between, `--surface` fill on hover (hover devices) with a pointer cursor. Whole row is a link to the invoice detail (an `<a>` in the first cell stretched over the row; keyboard focus lands on that link). Columns left to right: Invoice (`mono-m`), Client (`ui-m`, one line, ellipsis), Issued (`mono-s`), Due (`mono-s`), Status (pill, plus "Overdue" text when relevant), Amount (`mono-m`, right-aligned, with token code). Widths: Invoice 120px, Issued 128px, Due 128px, Status 200px, Amount 160px, Client takes the rest.
**No sortable columns.** `DECISION`: fixed order, newest issue date first.
**Mobile card list** (below 640px; 640 to 1023px uses the table with Issued hidden): each invoice is a `Chamfer sm` card, 16px padding, 8px gap between cards. Row 1: invoice number (`mono-s`) left, status pill right. Row 2: client name (`ui-l`, ellipsis). Row 3: `Due 24 Nov 2026` (`ui-s`, overdue in `--overdue-fg`) left, amount (`mono-m`) right. The card is a link; a chevron-right icon is not shown (the whole card is the target).
**Pagination:** first 25 rows; ghost button "Show 25 more" under the list, left aligned, with a live-region message "Showing 50 of 82 invoices" in `ui-s` `--ink-2` beside it. No page numbers. Hide the button when all are shown.
**Filter bar** above the list: chips (All, Open, Pending, Paid, Underpaid, Refunded, Void) and a search input (matches client name or invoice number, case-insensitive, instant, client side). On desktop chips left and search right (320px wide); on mobile search above chips. Tile filters and chip filters are the same state. A result count line is not shown.

### 9.19 Quote countdown
A 2px bar directly under the quoted amount inside the slab's left zone (full width of the amount block), plus text "Quote expires in 04:32" in `mono-s` below it. Bar colour `--on-slab`; below 60s the bar and text turn `--ember`. The bar shrinks with `scaleX` (linear, origin left). The text updates every second visually; screen readers get updates only per section 14. At zero: bar gone, text becomes "Quote expired", an error banner appears (copy in 12.3), the pay controls (QR, copy fields) are replaced by a disabled placeholder and a primary "Get a new quote" button. `VERIFY` quote lifetime comes from the 1Click response.

### 9.20 Toast
`--slab` fill, `--on-slab` text (`ui-m`), `--r-sm`, `--shadow-float`, padding 12px 20px, bottom centre, 24px above the viewport bottom (plus safe area), max width 480px (full width minus 32px on mobile), z-index 50. One line. Auto-dismisses after 4s; hover or focus inside pauses the timer. One toast at a time: a new one replaces the old. `role="status"`. No icon, no close button, no action button. Toasts confirm only (never errors: errors use banners).

### 9.21 Dialog and bottom sheet
- **Dialog:** React Aria Components modal/dialog primitives (see 9.0), preserving the specified native-dialog-like behaviour. 480px max width (full width minus 32px on mobile), `Chamfer lg` `--surface`, 1px `--line`, padding 32px (24px mobile), `--shadow-float`, over a `--ink` scrim at 40%. Title in `total` token (Display 700 24/28), body `ui-m`, footer buttons (9.3.1). Initial focus goes to the **least destructive** button (Cancel). Focus is trapped; Esc and scrim click close it; focus returns to the opener. Z-index 40. Used only for voiding an invoice (copy in 12.3).
- **Bottom sheet:** for the token picker on mobile (9.9). Same scrim, top corners chamfered, slides up (`--dur-3`).
- No other modals. No drawers. No popovers apart from the token picker panel.

### 9.22 Empty state
Left-aligned, in the content area. `display-m` sentence (max 2 lines), one `ui-m` line (`--ink-2`), one primary button. No illustration, no icon, no ghost chips. Top margin 56px. Copy in 12.3.

### 9.23 Error banner
`--underpaid-bg` fill, `--underpaid-fg` text, 1px `--underpaid-fg` border at the left edge only (4px wide), `--r-sm`, padding 16px, with a 20px warning icon at the left. Says what happened and what to do, `ui-m`, at most two sentences, plus an optional ghost "Try again" button at the right (below the text on mobile). `role="alert"` for errors that appear after an action; `role="status"` for errors present on load. Never auto-dismiss.

### 9.24 Skeleton
Blocks in `--sunken` with `--r-sm`, matching the final size of what they replace (slab skeleton is a `--slab` chamfered block at full height; tape skeleton is `--surface` with 4 row bars). Opacity pulses 0.6 to 1 over 1.2s, only after 150ms of loading, no shimmer. Pages must **reserve final dimensions** so nothing shifts when data arrives (section 15). Under reduced motion: static at 0.8 opacity.

### 9.25 Step indicator (client page)
A single row above the step panel: label `STEP 2 OF 3` followed by 16px and the step name in `ui-m` weight 400 `--ink` ("Pay"). Steps are: 1 Choose token, 2 Pay, 3 Done. No numbered circles, no progress line, no clickable steps (the ghost "Change token" button moves back). `aria-current="step"` is not needed because it is plain text; the row is inside the live region so it announces on change.

### 9.26 Dot leader
Label and value joined by a dotted rule: flex row, a `flex: 1` spacer with `border-bottom: 1px dotted var(--line-strong)`, aligned to the text baseline (use `align-items: baseline` plus a `margin-bottom: 0.25em` on the spacer), `min-width: 24px`, `margin: 0 8px`. Decorative (`aria-hidden`); the label and value remain adjacent in the DOM order. On very narrow rows the leader may shrink to 8px; it never wraps to its own line.

### 9.27 Crop marks, ruler margins
See 6.3 and 5.6.
---

## 10. Screen specifications

These are **newly reconstructed v5 specifications**, not recovered text from a missing original. They implement the v4 screen inventory and the product scope in `SPEC.md`. Routes and product truth always defer to `SPEC.md` and `INTEGRATIONS.md`. No new navigation destinations are authorized here.

### 10.1 Landing `/` (F1)
**Purpose:** explain what Openteller does and lead a freelancer to the existing sign-in or invoice workflow. It is not a fake dashboard, an AI pitch, or a generic crypto trading page.

**Top bar:** 72px desktop, 56px mobile, `--paper`, `--line` bottom border. Wordmark at left. Right side: one primary CTA `Create an invoice`. Do not invent a Features/Pricing/Blog nav, testimonials, fake user logos, counters or integrations. CTA routing follows the real auth guard: authenticated to `/invoices/new`; otherwise to the approved sign-in route (`OPEN 3`). Never silently route unauthenticated people to a private page with no explanation.

**Hero:** 12-column grid at >=1024px, left-aligned, with one `display-xl` heading and one `ui-l` supporting paragraph (max 52ch). Approved working copy: heading `An invoice that shows where the money went.` Supporting line `Bill in USDC. Let a client pay with a supported crypto asset. Keep a record of what they sent and what you received.` This is conditional on the verified payment flow; if live payment isn't implemented, change wording to a plainly scoped preview per 12.4. Primary CTA `Create an invoice`, secondary text link `See how it works` targeting the landing explanation section (not a new route). Below or beside the headline: one **static** illustrative slab built with labelled demonstration data; show `EXAMPLE` prominently and never imply the amounts/transactions are real. Do not make explorer links from fictitious hashes.

**Sections, in order:** (1) hero and example proof slab, (2) `FROM INVOICE TO PROOF`: three text-led steps `Create the invoice`, `Your client pays`, `Keep the trail`, (3) `WHAT THE RECORD INCLUDES`: a single example tape and CSV-preview excerpt, clearly marked `EXAMPLE`, (4) restrained final dark band with a short sentence and one inverse primary CTA, (5) simple footer with `openteller` and a non-claiming copyright line. The sections use `--s-14` separation, hero-to-next `--s-20`; no full-bleed image/stock illustration. Do not add a fifth marketing section to fill space.

**Responsive:** desktop hero can place copy and slab side-by-side only if the slab's amount typography fits; otherwise make slab full width below. Below 1024px stack vertically. Below 640px CTAs are stacked, and demo slab has its mobile stacked zones. Top-level content must remain readable without animation or JavaScript.

**Motion:** hero and initially visible material are static. Section 2 onward may use the one-time section-level reveal in 7.4. No scroll reveal for any CTA the user must reach to proceed; when doubt exists, show it instantly.

**States:** live CTA route depends on authentication; if auth is not built, use an honest disabled state and explanatory text instead of a dead button. No artificial loading spinners on marketing content.

### 10.2 Invoice list `/invoices`
**Auth:** freelancer only; if unauthenticated redirect to approved sign-in flow, never render private data briefly first. **Header:** `INVOICES` label, `Invoices` display-l title, primary `New invoice` action. No invented account dashboard or revenue graphs.

**Overview:** three clickable stat tiles in a 3-column desktop grid: `OUTSTANDING`, `PAID`, `TOTAL INVOICES`; on mobile stack or use one column. Values are derived from persisted invoices using truthful status definitions. `OUTSTANDING` sums currently unpaid balances (only if reliably computed); `PAID` sums verified received USDC; `TOTAL INVOICES` is a count and therefore has no token suffix. If outstanding is not reliably known for partial payments, show a count instead of a fabricated balance and update the corresponding tile label in the design file.

**Content:** filter chips and search per 9.18; one real table or mobile card list; 25-row incremental pagination. Default order newest issue date first; tie-breaker stable invoice number or created timestamp. Search/filter are applied before pagination; reset visible row count on filter/search change. Update addressable state only if planned in architecture (do not invent URL query schemes).

**Empty states:** no invoices: `No invoices yet.` / `Create your first invoice to get a shareable payment link.` / `New invoice`. Empty filter: `Nothing matches this view.` / `Try another status or clear your search.` / ghost `Clear filters` (not a fake primary action). Error: `We couldn't load your invoices. Try again.` plus retry action. Loading: table/card geometry skeleton per 9.24, with a 150ms delay; never skeletonize the top bar.

**Rows:** labels and amounts per 9.18; no fake values, sorting controls, row menus, emoji or hidden actions. A row leads only to `/invoices/[id]` for the owner.

### 10.3 Create invoice `/invoices/new`
**Header:** label `NEW INVOICE`, title `Create an invoice`, back text link `Invoices` to `/invoices`. No wizard; one form and a live summary. At >=1024px: left form 7 columns, right summary 5 columns sticky top 96px. At smaller widths: form then summary, never hide the summary behind a drawer.

**Form order:** (1) `CLIENT` section: `Client name` required (ui text; no need to invent email delivery); (2) `INVOICE` section: issue date, due date; (3) `LINE ITEMS` editable rows per 9.7; (4) `NOTES` optional textarea, 500 characters; (5) `PAYMENT DESTINATION` read-only verified receiving NEAR account and USDC asset, populated from authenticated validated account configuration (never arbitrary unverified address); (6) footer `Cancel` ghost, `Create invoice` primary. Do not add tax, discounts, fiat currency picker, product catalog or wallet creation.

**Live summary:** `INVOICE SUMMARY` component with real line-item count, issue/due dates and total. Empty line-item values show a clear `—`, not `0.00` as a claim of confirmed input. Its summary is a preview, not a receipt. Formatting uses section 11. Validate on blur and on submit; show error next to each affected field with `aria-describedby`, focus first error on failed submit. Buttons retain width while loading. Submit is single-flight with server-side idempotency/duplicate prevention according to `ARCHITECTURE.md`.

**Required rules:** issue date cannot be later than due date; positive monetary total; quantity precision/bounds are `OPEN 4` and should be finalized before accepting production values. Only one empty item initially; at most 20. On success navigate to the stored invoice detail and expose the copyable link. On save failure, preserve form input and show actionable error; do not pretend the invoice exists. If leaving with unsaved data, use the browser's native protection where applicable; no new modal without approval.

### 10.4 Invoice detail `/invoices/[id]` (F6)
**Auth:** only invoice owner. `404` for missing or unowned IDs (do not leak existence). Header: label with actual invoice number, client name in display-l, status pill and separate overdue text, secondary `Print` (only if an accurately labelled print view exists) and primary `Copy link` or `Void invoice` according to state. Keep action priority consistent: do not display two equally primary buttons.

**Flow top-to-bottom:** (1) header; (2) full-width proof slab (9.12) in correct status mode, with precise known data only; (3) desktop 7-column tape (9.13) and 5-column invoice summary (9.16), top-aligned; (4) no additional badges, footers or analytics. On mobile the slab stacks, tape follows slab, then summary. The paid stamp appears only after verified settlement, and cannot overlap labels.

**States:** Open shows `No payment yet` and no received claim; Pending gives clear wait guidance; Paid shows verified received amount, origin and destination explorer links if available, one paid stamp; Underpaid/Refunded are shown only when provider-backed and map to the vocabulary in SPEC; Void shows the short void panel instead of slab. An unverified origin hash displays `Transaction link unavailable` without a fake URL. Reload must show persisted actual status immediately: never animate old rows or stamps as if an event just occurred.

**Void:** only for eligible unpaid invoices under SPEC/architecture policy. Open the one allowed confirmation dialog (9.21), with copy from 12.3; never permit void for a genuinely paid settlement. If server rejects because payment arrived, close dialog, refresh invoice and show clear error banner. **Changes while viewing:** status and new trail event transitions per 7.2, live region per 14.

### 10.5 Client payment `/i/[slug]`
**Priority:** highest accessibility, trust and performance. No client sign-in, no freelancer nav, no links navigating the payer away except explicit transaction explorer links. Minimal wordmark-only top bar (non-link). Header: `INVOICE` label with actual number, client-facing summary (`Invoice from {freelancer display name}`, issued/due, itemized amount). Show destination identity verified by the app; do not pretend the client is using a specific wallet or chain.

**Single-page three-step flow:** **Step 1 `Choose token`**: concise invoice summary, accessible token/network picker (9.9), `Get quote` primary; provider list only, never hardcoded available routes. **Step 2 `Pay`**: quote slab with `YOU PAY` and `INVOICE AMOUNT`; network, asset, deposit address, payer-supplied verified refund destination, quote expiry/countdown; QR and copy instructions only if a working quote includes valid pay-to details; `Change token` ghost action. Explicit warning `Send only {token} on {network} to this address before the quote expires.` Do not claim a payment was sent because the user clicked Copy. **Step 3 `Done`**: only after provider-backed verified success, show Paid, actual received USDC and evidence (if available); a separate processing view stays in Step 2/processing and reads `Payment detected. Waiting for confirmation.`

**Quote errors:** unsupported route `That token and network cannot pay this invoice right now. Choose another.` Quote expired `This quote has expired. Get a new quote before sending funds.` Provider unreachable `We couldn't get a quote. Try again.` If deposit is incomplete or refund in progress, never show Done/Paid: show the accurate status, evidence and a safe next action derived from the API. For direct wallet transfer, display only verified quote-specific instructions. Copy and QR encode precisely the same destination/pay information per 9.11.

**Refund destination:** required per provider semantics. The product must obtain a payer-controlled refund address validated for the relevant origin network and asset; do not guess or silently fill it with the freelancer's NEAR account. If this cannot be secured, **block the quote/payment flow and mark OPEN 5**, not a simulated integration.

**Refresh/security:** quotes are server-issued and tied to invoice/attempt; client display must reject stale expiry; polling is bounded and paused when page is hidden if technically safe. Never expose secrets in page HTML. Screen remains stable when quote refreshes; no full-screen reflow. At 390px the whole primary payment instruction and copy controls fit without horizontal scrolling. Ensure externally sourced chain names and amounts are escaped and verified.

### 10.6 Receipt/print `/invoices/[id]/receipt`
Private, printer-friendly single-column document. One header with `openteller`, `RECEIPT` **only** when verified Paid, otherwise `INVOICE STATEMENT`; invoice number, client, issuer, issue/due dates, itemized rows, invoiced total, actual settlement, UTC paid timestamp if known, origin and destination network/token/amount/hash and full explorer URLs when verified. If multiple payments exist, show a dated row per verified attempt; do not collapse into a fabricated transaction.

At screen width, use `--surface` on `--paper`, technical figures and separators. At print, use a plain light background, ink text, no box shadows/rulers/coin/tape notches, no unnecessary nav; ensure page-break handling never splits a payment row, links print as readable URLs, and no interactive controls or animations appear. A single `Print` button is allowed outside the printable content. No PDF-generation dependency required; users may print to PDF in their browser. Never label an unpaid item `Receipt`.

### 10.7 Exports `/exports`
Freelancer-only. Header: label `EXPORTS`, title `Export your records`, lead text `Download invoice and payment records as CSV.` One clear primary action `Download CSV`. Explain actual export scope in ui-s: whether all invoices or payments only, date coverage, and status handling, consistent with `SPEC.md` and the backend. Do not invent a data warehouse, accounting integrations, exchange rates, graphs, scheduling, or disabled filters posed as available features.

**Default implementation:** one export type covering all authorized invoices with payment details or a clearly labelled payment-only export as defined in `SPEC.md`; schema/row semantics must agree with `ARCHITECTURE.md`. If unpaid records are included, label the file and fields so they cannot be mistaken for payments. CSV must not include secrets, must prevent formula injection, and preserves full hashes/addresses. Show an empty-state explanation when no invoices exist, and error on failed download. Buttons use ordinary download behavior, not a fake success toast before a file exists. Advanced filters require explicit scope approval.

### 10.8 Not found, denied and error boundaries
**Unknown route:** `Page not found.` / `This address doesn't point to an Openteller page.` plus one link `Go to invoices` for authenticated owners or `Go to home` for anonymous users. **Unknown public slug:** `Invoice not found.` / `Check the invoice link with the person who sent it.` No invoice identity leak. **Private unknown/unowned ID:** same not-found page. **Retryable app error:** `Something didn't load.` / `Try again. Your invoice has not been changed.` with retry button only if safe. **Payment-provider failure:** preserve already-known quote/attempt status while clearly describing what's uncertain; never downgrade a confirmed success based on a transient network error.

No playful illustrations, emojis, invented system codes or auto-redirect timers. All errors have text not colour alone, keyboard-accessible actions and a truthful outcome.

### 10.9 Sign-in `/sign-in`
**Purpose:** authenticate a freelancer through Neon Managed Better Auth. A connected wallet is not an identity session.

Use a minimal landing-style top bar with the non-linked wordmark and no freelancer navigation. Main content is left-aligned in the standard 640px reading column: label `FREELANCER ACCESS`, display-m heading `Sign in to manage invoices.`, one ui-m explanation `Use Google or GitHub to continue.`, then two full-width secondary buttons in this order: `CONTINUE WITH GOOGLE`, `CONTINUE WITH GITHUB`. Provider marks are not introduced; use text only. Below the buttons, ui-s copy states that clients do not need an account to pay an invoice.

Provider errors use the standard error banner with `We couldn't sign you in. Try again.` Preserve a validated same-origin return target so a successful sign-in can continue to the originally requested protected route; reject arbitrary callback URLs. While a provider redirect is starting, retain the button label, show the standard spinner and disable both provider buttons. If already signed in, redirect server-side to `/invoices`. Sign-out returns to `/` and clears the managed session. Do not add email/password fields, wallet-connect controls, account creation copy, terms checkboxes or additional providers without approval.

---

## 11. Data display, amounts, dates and truncation

### 11.1 Monetary correctness
- Invoice denomination is USDC. Persist amounts in integer minor units, with verified asset decimal precision; **do not assume every token has six decimals**. Convert origin-chain units according to token metadata from verified integrations.
- No binary floating-point arithmetic for financial totals; use integer or exact-decimal libraries only when justified and approved in `ARCHITECTURE.md`. Format at the display boundary, never by mutating persisted values.
- Default invoice row and total display: grouping separators and **two** decimal places for USDC (`1,250.00 USDC`). For received settlement, preserve enough exact precision to avoid misleading rounding; if the provider returns finer precision, preserve raw units for audit/export, and choose an explicit visible precision rule before shipping (`OPEN 4`). Never silently display rounding as exactness.
- Origin token amounts must use confirmed asset precision, avoiding false zero or truncated payments. Exports preserve exact values and token identification, not merely display-formatted numbers.
- Invoice amount comparisons and underpaid balance are derived from real received amount and reconciliation rules from `ARCHITECTURE.md`; do not compute from illustrative values. Never use approximate conversion markers without a defensible quote.

### 11.2 Dates and time
- Save UTC instants as ISO 8601; show the word `UTC` on payment events and quote timestamps. Calendar-only invoice issue/due dates remain dates, not locally shifted timestamps.
- Calendar date: `12 Nov 2026`. Full event: `12 Nov 2026, 14:06 UTC`. Tape: `12 Nov, 14:06 UTC` when year matches invoice issue year; include year otherwise (9.13). Avoid relative `today` for audit timestamps.
- Overdue computation is UTC-based per 9.8 and uses invoice due-date semantics from SPEC. Browser timezone must not make a due date jump to the previous day.
- Quote expiry must come from API data, not guessed durations; remaining seconds use a monotonic or wall-clock-corrected calculation tolerant of hidden tabs and clock drift. Timer text is `mm:ss` where applicable; expiry is authoritative server/provider state, not just the browser interval.

### 11.3 Identifiers, fields, missing data
- Invoice numbers are persisted and immutable. Never use dummy `INV-0014` outside visibly labelled examples/fixtures.
- Network, token and chain must be named accurately, not inferred from an address prefix alone. Network name/ticker may be uppercase in technical labels, while raw case-sensitive identifiers remain unchanged.
- Screen-only truncation: hashes and long account strings display beginning and end (`0x3fa9…c21e`); full original value must be copyable, included in export, in the accessible name/title where safe, and linked only to a verified explorer URL. Never put a truncated value into actual wallet instructions or QR.
- Empty unknown data is `—` with accessible text `Not available` where needed; `0.00` is reserved for a verified zero amount. `Pending` is never equivalent to missing data. Avoid `N/A` in financial fields if the reason is actionable.

### 11.4 Number and text fitting
- All monetary figures use tabular numerals and no wrapping (4.4, 4.6); `HeroAmount` reduces size by character thresholds first. For extremely long values the component must prioritize full auditable visibility over visual symmetry: move token code to a separate line or allow the slab zone to stack, **never clip/truncate a financial amount**.
- User-supplied client names and descriptions wrap gracefully; only table cells may ellipsize when the full value remains accessible from the destination page. Notes retain line breaks and must never interpret user HTML.

---

## 12. Writing, labels, examples and truthfulness

### 12.1 Voice
Short, precise, calm and accounting-literate. Favor action and evidence over hype. Sentence case in body and headings; uppercase via tokens for buttons, nav and technical labels. Avoid `seamless`, `revolutionary`, `effortless`, `trustless`, `instant`, `guaranteed`, `verified` without evidence and all AI-assistant copy. Never imply cross-chain settlement is free, irreversible, or universally supported.

### 12.2 Required button/status vocabulary
| Situation | Copy |
|---|---|
| Landing and list CTA | `Create an invoice` / `New invoice` |
| Save | `Create invoice` |
| Client choose | `Choose a token` / `Get quote` |
| Payment | `Copy` / `Copied` / `Change token` / `Get a new quote` |
| Export | `Download CSV` |
| Void | `Void invoice` / `Keep invoice` |
| Status | `Open`, `Pending`, `Paid`, `Underpaid`, `Refunded`, `Void` |
| Missing explorer evidence | `Transaction link unavailable` |

Button casing is rendered by the component style (uppercase mono); do not put uppercase strings into business logic just for presentation. Copy must match actual behavior (never `Pay now` when no wallet payment action exists).

### 12.3 Actionable state copy
| Situation | Exact message or pattern |
|---|---|
| No invoices | `No invoices yet.` / `Create your first invoice to get a shareable payment link.` |
| No filter results | `Nothing matches this view.` / `Try another status or clear your search.` |
| Provider quote failure | `We couldn't get a quote. Try again.` |
| Quote expired | `This quote has expired. Get a new quote before sending funds.` |
| Wrong token/route | `That token and network cannot pay this invoice right now. Choose another.` |
| Payment detected | `Payment detected. Waiting for confirmation.` |
| Client payment guidance | `Send only {token} on {network} to this address before the quote expires.` |
| Copy success | `Copied` |
| Save failure | `We couldn't create your invoice. Your entries are still here. Try again.` |
| Invoice load failure | `We couldn't load your invoice. Try again.` |
| Void confirmation title | `Void this invoice?` |
| Void confirmation body | `This will stop new payments through this invoice. It won't reverse any payment already sent.` (VERIFY provider semantics; if link cannot actually be disabled, replace with accurate copy before shipping) |
| Failed refund or status unknown | Describe provider-reported state without implying completion, with a route to safely retry/check status |

A backend error response can require an additional specific instruction; write it in this document before shipping. Do not expose internal exception strings, API keys or raw stack traces to clients.

### 12.4 Claims and example-data policy
- A UI badge, caption, receipt, quote or tooltip may assert `Paid`, `Received`, `Refunded`, `Verified`, `Gasless`, `Exact`, `No fees`, `Settled in…` only when that statement is supported by data and the integration actually proves it. Prefer `Payment status` rather than `Verified onchain` where evidence is incomplete.
- No hard-coded transaction hashes, timestamps, addresses, amount pairs, logos or platform counters in the live UI. When marketing examples show synthetic data, visibly mark each block `EXAMPLE` and provide no live explorer links.
- Do not claim every token/chain is accepted; say `supported tokens and networks`. Do not claim cash-out to local bank accounts. Do not say the client paid simply because a quote or deposit address was created.
- Always differentiate the invoiced amount, quoted send amount and actual amount received. Refund and underpayment must be grounded in provider state; if the mapping is unresolved, show an honest pending/error view, not an optimistic Paid stamp.
- Relayer/gasless claims are forbidden unless implemented, scoped, funded and verified as actually benefiting the relevant user action.

---

## 13. Form validation, responsive behavior and interaction details

### 13.1 Validation sequence
On edit: avoid flashing errors before input. On blur: show the field's error, with `aria-invalid` and `aria-describedby`. On submit: validate all fields locally for responsiveness and again on the server for trust; focus the first invalid field and announce a summary. Server errors do not wipe values. Client and payer-supplied strings are untrusted input. Use exact date and numeric parsing (no ambiguous locale parsing), protect against double submit, and never confuse a locally valid form with a successfully saved invoice.

### 13.2 Small screens
At <640px, 16px page padding, full-width primary actions, single-column inputs except the approved line-item arrangement; card information order remains logical in the DOM. Mobile top bar has the two specified rows; no hamburger. Keyboard and touch targets >=44px. Support safe area at the bottom for toasts/sheets and prevent virtual-keyboard obscuring focused fields. At 640–1023px, use the defined intermediate layout (table hides Issued; client slab stacks); 1024px+ uses full 12-column grid. All component states must be tested at 390, 768, 1024, 1440px.

### 13.3 Focus, scrolling, persistence
Avoid unexpected scroll movement when showing errors or quote updates. When a new step appears, move focus to its heading or first actionable control; when a sheet closes, return focus to its trigger. Preserve public payment attempt state through refresh using the actual persisted backend/quote reference, not merely volatile component state; do not save sensitive payer information unnecessarily. Keep keyboard focus visible within clipped chamfers and scroll containers.

### 13.4 Safe navigation
External explorer links open with `rel="noopener noreferrer"`, accurate destination labels, and no invented URLs. Copy controls copy the full actual value. Browser Back must not initiate a duplicate payment attempt or resubmit an invoice. Navigation between private pages must honor server authorization throughout loading and transitions.

---

## 14. Accessibility contract

### 14.1 Target and semantics
Target WCAG 2.2 AA for essential flows; semantic HTML first, React Aria Components for supported interactive behaviors. One `h1` per page, ordered `h2` headings, descriptive real `<label>` associations, native `<table>` where tabular, `<ol>` for the event trail, `<time datetime>` for dates, and meaningful link text. Decorative SVGs use `aria-hidden` and `focusable="false"`; no decorative item enters the tab order.

### 14.2 Keyboard and touch
Full flow operable without pointer: top bar, search and filters, invoice creation, line-item reorder if shipped, token picker, quote instructions, copy, void confirmation, download. Use React Aria's keyboard/focus mechanisms without overriding them with ad hoc key handlers. Show the 2px `--ink` focus-visible ring with offset specified in 9.1; on slab use `--on-slab`. Minimum interactive target 44 by 44px. A trapped dialog always closes via Escape and restores focus.

### 14.3 Status announcements
- A freshly received status event is announced **once** in a `role="status"`/`aria-live="polite"` region, describing the event in words (`Payment confirmed. 250.00 USDC received.` only when true).
- Do not announce every second of the quote countdown. Announce at meaningful milestones (60 seconds, expired); expose remaining time as readable text for users who revisit it. On expiry set an appropriate status/error and move focus only when the currently focused instruction becomes unusable.
- Error after a user action uses `role="alert"`; existing initial-load error uses status per 9.23. No duplicate live regions reading the same message twice.
- Page/step transitions set focus intentionally. Reduced motion never hides content. Skeletons are `aria-hidden`, with a suitable loading status outside if needed.

### 14.4 Contrast, zoom and assistive tech
Contrast-check real text/status pairs, especially ember restrictions in 3.3; never convey status by color alone. At 200% zoom and 390px width, preserve reading order and avoid clipping numbers/QR/copy buttons. Test VoiceOver/NVDA or equivalent on one major flow and validate accessible names for icon-only buttons. Do not rely on hover information; touch needs explicit visible actions.

---

## 15. Speed, network and memory budgets

### 15.1 Performance targets
These are v5 **engineering targets**, not assertions that the application currently meets them. The client payment page is the highest-priority budget.

| Metric | Target / gate | How measured |
|---|---|---|
| Lighthouse Performance (mobile, production build) | >=90 aspirational; never knowingly release <80 without recording the blocker | Repeatable mobile emulation on `/i/[slug]` |
| Lighthouse Accessibility | >=95 target and no blocking keyboard errors | Mobile/desktop audit + manual keyboard |
| LCP | <=2.5s target | throttled mobile lab, then field data if available |
| CLS | <=0.10 | browser performance/lab |
| INP | <=200ms target | field measurement when available; interaction profiling in development |
| Decorative animation | no visible scroll stutter on low-end/CPU-throttled devices | manual recording and performance profiler |
| Payment-route JS | minimize client components: no unnecessary charts/global animation wrappers | build bundle report before launch |

These values are proposed defaults adopted for v5; evaluate on real hosted builds. Do not claim compliance without measurements.

### 15.2 Implementation requirements
- Next.js server components by default; client boundary only around interactive picker, form, timed quote and authorized Motion wrappers. Dynamic-import optional heavy features. No external font CDN: self-host via `next/font`, latin only, avoid loading unused axes and italics.
- Static decorative marks are SVG/CSS, never video, canvas, animated GIF, 3D rendering or unbounded DOM. No large background imagery, WebGL or scroll observers per item.
- Motion obeys 7.4: opacity/transform only, one-time below-fold landing reveal, 320ms, reduced-motion support, initial content visible prior to hydration. No animation on each table row mount. Avoid redundant Motion wrappers and permanent `will-change`.
- Loading data uses bounded request retries/backoff and avoids unbounded active polling across hidden tabs. Do not recompute every invoice row at 60fps. Keep list render capped to 25 additional rows per user request, with server pagination when data size justifies it.
- Use skeletons only after 150ms and reserve final dimensions. Never delay critical instructions to trigger an animation. Timestamps/countdown change only when necessary, with scope-local state updates.

### 15.3 Test matrix
Production build, throttled mobile network and CPU, low-memory mobile simulation, desktop 390/768/1024/1440 viewport checks, zoom 200%, JavaScript disabled on landing/receipt for truthful non-interactive content, reduced motion, keyboard-only, slow quote response, delayed status response, expired quote, offline retry, and long client names/hashes/amounts. Record results and regressions in development notes; simplify motion before degrading payments.

---

## 16. Motion and React Aria implementation examples

Code here is **illustrative scaffolding**, not permission to add unlisted styles or runtime features. Always reconcile with installed package version and v4 tokens. For example, a minimal reveal wrapper needs a no-JS-safe fallback: only enhance after mount, and render initial/visible content immediately; if reliable detection is uncertain, render it without reveal.

### 16.1 Dependency policy

```bash
npm install motion
npx motion-ai
npm install react-aria-components
```

`motion` is the runtime used through `motion/react`. The `motion-ai` command configures optional AI-agent-facing tooling/examples for coding; it is **not** an end-user AI feature, runtime renderer, required paid service, or entitlement to proprietary components. React Aria Components provides accessibility behavior; all visible design must be styled with Openteller tokens. Pin versions in lockfile and use official, current APIs. Do not install a separate theme kit, icon pack, animation preset or paid component system to shorten implementation.

### 16.2 Motion usage gates
Use simple CSS for `:hover` fill/press feedback; use Motion where presence, state transitions or one-time scroll intersection provide clear value. Motion must never dictate design decisions. Intersection reveal should trigger at 15%, once, below fold; sections remain content-accessible before JS. Reduced-motion output has final transform/opacity from first paint. All transitions use `--dur-*` token values (read them from CSS or a synchronized shared configuration). Avoid undocumented spring defaults and long timelines.

### 16.3 React Aria mapping
| Openteller primitive | Recommended behavioral foundation | Design authority |
|---|---|---|
| Primary/secondary/ghost button | `Button` | 9.3 |
| Text/number/date form fields | `TextField`, `Input`, `Label`, `FieldError` where compatible; native date input semantics where required | 9.6 |
| Token chooser | `ComboBox`/`ListBox`/`Popover` or accessible equivalent matching keyboard contract | 9.9 |
| Void confirmation | `DialogTrigger`, `Modal`, `Dialog` | 9.21 |
| Selection/filter chips | Buttons with pressed/selected semantics | 9.6 |
| Tooltip not specified | **Do not add** | 0.2 |

If a React Aria primitive conflicts with native date behavior or the screen’s scope, favor accessible native HTML and document the exception. Never override focus handling to simulate visual state; map `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`, `data-invalid` to existing token styles. Respect mobile touch and browser autofill. A UI library does not replace server validation or authorization.

---

## 17. Content structure, assets, source ownership and conventions

### 17.1 Single source of truth
This file owns appearance, interaction affordances, screen composition and copy; `SPEC.md` owns business requirements, `INTEGRATIONS.md` owns third-party API truth, `ARCHITECTURE.md` owns persistence and payment state mapping, `DECISIONS.md` owns unresolved approvals. Never silently rewrite product behavior here to make a screen work. `Stitch` images are references, not authority.

### 17.2 File organization (recommended, not mandatory)
- `app/globals.css`: tokens and Tailwind mapping, nothing duplicated.
- `app/fonts.ts`: Bricolage, Instrument Sans, Martian Mono via `next/font`.
- `components/ui/`: `Button`, `Label`, `Field`, `Chamfer`, `StatusPill`, `Monogram`, `DotLeader`, `ErrorBanner`, `Skeleton`.
- `components/invoice/`: `HeroAmount`, `ProofSlab`, `PaymentTrail`, `InvoiceSummary`, `InvoiceTable`, `LineItemEditor`, `ReceiptView`.
- `components/payment/`: `TokenPicker`, `QuotePanel`, `PaymentInstructions`, `QuoteCountdown`.
- `components/icons/`: custom hand-written 24px SVGs from 8.2.
- `components/motion/`: only lightweight wrappers for approved transitions; no global reveal-everything wrapper.
- Business/data fetching and server secrets remain outside UI components and follow architecture.

### 17.3 Asset limits
No hotlinked avatars, remote logo fetches, external animation files, font icons, generic stock art or large hero images. The contour coin is custom inline SVG <=10KB, static; flags/logos for networks are replaced with token/network monograms. A QR must reflect real data and meet readable contrast. Never include fabricated explorer hashes in production demonstration screenshots without a clear `EXAMPLE` label.

### 17.4 Naming and consistency
Name tokens exactly as in sections 3–7; keep TypeScript component props typed. Unit tests must use human-readable status names and exact monetary data from fixtures. Components should be reusable but not over-generalized into a full public UI kit. Any new token, component variant, icon or layout exception requires documenting it here *before* use.

---

## 18. Favicon, sharing, metadata and browser surfaces

### 18.1 Favicon SVG
Use the approved 8.6 mark: 32x32 `--slab` square with 4px rounding and centered `--paper` right-pointing triangle. SVG includes fixed brand colors since CSS custom properties do not reliably resolve in every favicon context. No brand mark invention, raster asset pipeline, emoji or apple-themed variation without approval. Wordmark text remains `openteller` lowercase.

### 18.2 Metadata
Landing title `Openteller — Invoices with a payment trail`; short description grounded in current features, e.g. `Create crypto invoices and keep a record of the payment.` Omit unsupported claims of free, instant, all-chain, audited or gasless. Client invoice browser title should not leak sensitive client/private identifiers into link previews more than necessary; prefer `Invoice | Openteller`. No dynamic OG screenshot that exposes balances/hashes/client names by default. The private invoice detail is not intended for indexing.

### 18.3 Printing and downloads
Receipts must have a deliberate print stylesheet (10.6), with real full hashes and URLs. CSV names can follow `openteller-payments-YYYY-MM-DD.csv` or `openteller-invoices-YYYY-MM-DD.csv` according to actual row semantics; set MIME and UTF-8. Do not put user secrets or unverified data into downloaded documents.

---

## 19. Quality assurance and acceptance checklist

### 19.1 Visual sign-off
- [ ] All screens use only the v5 tokens and three approved fonts. Custom icons only; no default kit appearance.
- [ ] Slab has three zones, no grid texture; correct status-specific claim; tape has *cut-out* notches and no fictitious checksum/verified text.
- [ ] Layouts checked at 390, 768, 1024, 1440px with long names, 13+ digit amounts and narrow address/QR instructions.
- [ ] Every status clearly legible without color; no overlaps between paid stamp/coin and real text.
- [ ] Landing example data explicitly marked `EXAMPLE`; no fictitious live transaction links.
- [ ] Signed-in top bar shows only Invoices and Exports; no avatar or invented tabs; client page has no accidental freelancer nav.

### 19.2 Interaction/a11y sign-off
- [ ] Keyboard flows end-to-end, correct focus order, visible ring, Escape/return-focus, token picker navigation, error field focus.
- [ ] Screen readers announce newly observed status exactly once and do not announce every timer second.
- [ ] No horizontal scrolling/critical clipping at mobile widths or 200% zoom; touch targets at least 44px.
- [ ] Reduced-motion mode shows all content immediately; motion disabled for print and critical pre-hydration content.

### 19.3 Performance/motion sign-off
- [ ] Installation and configured tooling match section 16; no unapproved paid or cosmetic runtime dependencies.
- [ ] Only below-the-fold landing sections can scroll-reveal; once-only, 8px+fade, 320ms, no stagger or parallax.
- [ ] Quote updates/new events animate only when truly new; old invoice data loads immediately without staged reveal.
- [ ] Client payment page Lighthouse and Web Vitals audited against section 15, with any exceptions recorded.
- [ ] Test includes slow mobile CPU, tab hidden/returned, poor network, expiry and quote refetch; no runaway polling or timers.

### 19.4 Financial/product truth sign-off
- [ ] No Paid/Received/refunded claims from fixture data or quote creation; real evidence is required.
- [ ] Live quote, destination address, refund destination, asset precision, chain and expiry are provider-backed.
- [ ] Underpaid/refund/failure states never appear as success; audit trail does not fabricate tx hashes.
- [ ] CSV can be opened and reconciled with full identifiers; unpaid invoices are distinguished from payments.
- [ ] Private invoices/exports blocked across users; client public page reveals only intended shareable invoice details.
- [ ] Unresolved `OPEN` items in section 20 are either approved and recorded or blocking functionality is not advertised/enabled.

---

## 20. Open design decisions, exceptions and verification register

This section records remaining questions. **The v5 sections 10–20 are newly written**, because neither supplied v3 nor v4 file contained their content. The builder approved these replacement sections on 4 November 2026. Do not present them as restored source text, and do not treat that approval as resolving the individual `OPEN` or `VERIFY` items below. `DECISIONS.md` records cross-file decisions.

| ID | Status | Decision / verification needed | Default for safe implementation |
|---|---|---|---|
| OPEN 1 | VERIFY | Is Bricolage Grotesque numerically tabular at hero sizes? (4.2) | Use `HeroAmount` abstraction; switch to Martian Mono if verified unsuitable. |
| OPEN 2 | OPEN | Which lightweight QR encoder and its verified payload format? (9.11) | No QR until its payload matches a real copy field and dependency approved; retain copy button. |
| OPEN 3 | DECIDED 4 Nov 2026 | Neon Managed Better Auth with Google/GitHub at `/sign-in`; separate `SIGN OUT` ghost button after the identity chip (2, 9.2, 10.9; D01) | Verify provider configuration, callback validation, session clearing and protected-route authorization before real data. |
| OPEN 4 | OPEN | Quantity precision, USDC display precision for fractional settlements, max invoice amounts (11; D06) | Block unsupported values rather than silently rounding/overflowing. |
| OPEN 5 | OPEN / VERIFY | Refund address collection/validation, provider semantics, underpaid/refunded fields, whether separate status stamps should exist (9.12, 10.5; D05/D07) | Paid stamp only; plain status text for other outcomes. Block unsafe quote flow. |
| OPEN 6 | VERIFY | Slab transaction hashes/received amounts and status timestamps actually exposed by 1Click or chain explorer (9.12–9.13; D04) | Use known values only, display unavailable evidence plainly. |
| OPEN 7 | OPEN | Whether to offer receipt printing before P0 payments/CSV are complete (10.6; D10) | Leave route unadvertised until truthful print content exists. |
| OPEN 8 | OPEN | Does the token picker need a separate desktop popover behavior beyond React Aria default? (9.9, 16.3) | Use accessible documented primitive with same visible structure. |
| OPEN 9 | OPEN | Do the landing hero copy and screen example data meet the builder's brand approval? (10.1, 12) | Mark sample as `EXAMPLE`; revise text without expanding scope. |
| OPEN 10 | VERIFY | Confirm cross-platform `clip-path` chamfers, tape CSS masks, focus rings, print outputs, and image-free favicon in target browsers. | Preserve legibility and focus; use a simpler static border fallback when needed, no invented design effect. |
| OPEN 11 | OPEN | Should optional landing final-band contour coin be included? (9.15) | Omit to minimize decoration/performance. |
| OPEN 12 | OPEN | The older file referenced a one-off decorative exception to the no-gradient rule at section 20 item 4, but gave no usable original specification. | **No gradients** or unsupported effects; do not infer the missing exception. |
| OPEN 13 | OPEN | Any public contact/privacy/support links needed for actual launch? | Do not invent footer destinations; add approved, working links only. |
| OPEN 14 | VERIFY | Final measurable performance budget on deployed production host with real device conditions (15) | Use v5 targets as gates and document real measurements; simplify UI if needed. |

**Change process:** for each approved decision, note the date, owner, rationale and tests in `DECISIONS.md`; update this file (and `SPEC.md`, `ARCHITECTURE.md` or `INTEGRATIONS.md` where the decision changes their domain). Do not resolve missing integration facts by tweaking wording alone. If design and provider behavior conflict, pause the affected feature and show an honest safe state.

**End of DESIGN.md v5.**
