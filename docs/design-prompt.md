# Portfolio Design Prompt — Archit Bishnoi

## Brief

Redesign a single-page developer portfolio for **Archit Bishnoi**, a BCA student and full-stack web and mobile developer. The aesthetic is dark, cinematic, and code-inspired: equal parts brutalist engineering and editorial typographic craft. It should feel like a living terminal, not a static resume.

Build a polished, responsive, accessible experience with purposeful interactions, strong visual hierarchy, and motion that communicates state. The primary experience is the portfolio itself, not a marketing landing page.

## Aesthetic Stance

Use a **kinetic editorial** visual language. Motion is primary. Typography does the heavy lifting for hierarchy. The page should feel alive at rest through continuous ambient animation including film grain, scanlines, cursor glow, and spinning orbit decoration. User interactions should receive precise, restrained micro-animations rather than generic effects.

The visual character should be:

- Dark and cinematic, with near-black blue-black foundations.
- Editorial and typographic, with oversized serif display text.
- Brutalist and technical, with sharp corners, thin dividers, grid lines, monospace labels, and visible system-like counters.
- Expressive but disciplined: use animation and glow as signals, not decoration without purpose.
- Fully responsive and usable on touch devices, keyboard navigation, reduced-motion settings, and small screens.

## Color Palette

Define these as reusable CSS variables or design tokens:

| Token | Value | Usage |
|---|---|---|
| Page ground | `#050508` | Root background, near-black blue-black tint |
| Surface | `#0d0d14` | Alternate section backgrounds and card backgrounds |
| Panel | `#111118` | Form inputs and tag pills |
| Border | `#1e1e2e` | Dividers, card borders, grid lines |
| Cyan (primary) | `#22d3ee` | CTAs, active states, skill bar fill, glows, cursor glow, scanline, orbit dots |
| Violet (secondary) | `#a78bfa` | Glitch after-element, skill bar gradient tail, floating stat card accent |
| Ember (tertiary) | `#f97316` | Third project card and ember text gradient |
| Text primary | `#e2e2f0` | Main body copy and primary headings |
| Text muted | `#8888aa` | Labels, captions, and nav links at rest |
| Text placeholder | `#4a4a6a` | Form input placeholders |

Use these gradients:

- Cyan-violet text gradient: `linear-gradient(135deg, #22d3ee, #a78bfa)`, clipped to text and used on emphasized subheading words.
- Ember-gold text gradient: `linear-gradient(135deg, #f97316, #fbbf24)`, available for tertiary accents.
- Skill bar gradient: `linear-gradient(90deg, #22d3ee, #a78bfa)` as a 2px fill.
- Grid background: two crossed `linear-gradient(#1e1e2e18 1px, transparent 1px)` layers at 60px intervals.

Avoid introducing a competing palette. Cyan is the primary interaction color, violet supports it, and ember is reserved for tertiary project emphasis.

## Typography

Use exactly three Google Fonts and no system fonts:

| Role | Family | Weights | Usage |
|---|---|---|---|
| Display | Fraunces, variable serif with optical sizing | 300, 700, 900, plus italic 300 and 700 | All section headings, hero name, and project titles |
| Body | Outfit, geometric sans | 300, 400, 500, 600 | Body paragraphs and descriptions |
| Mono | JetBrains Mono | 400, 500, 700 | Navigation, counters, labels, tag pills, form inputs, percentages, CTAs, and cursor blink character |

Import the fonts with Google Fonts at the very beginning of `src/index.css`, before any other CSS.

Hierarchy rules:

- Hero name `Archit`: `text-6xl` through `text-9xl`, Fraunces, weight 900, solid `#e2e2f0`.
- Hero name `Bishnoi`: same responsive size and weight, filled with the cyan-violet gradient.
- Section headings: `text-5xl` through `text-6xl`, Fraunces, weight 900. Include one accent word in gradient italic.
- Section counters: `text-xs`, JetBrains Mono, uppercase, wide tracking, cyan. Format as `01 / About Me`.
- Body copy: `text-sm` through `text-base`, Outfit, muted text, relaxed line height.
- Tags and labels: `text-xs` through `0.7rem`, JetBrains Mono, uppercase, tracked.
- Do not use negative letter spacing. Keep text inside its containers at every breakpoint.

## Ambient Visual Layers

Add four fixed, full-page overlays above all content. All must use `pointer-events: none` and remain performant:

1. **Cursor glow**: a 400px by 400px radial gradient from `#22d3ee08` at the center to transparent at the edge. Track mouse position with a 0.1s CSS transition. Use `z-index: 0`.
2. **Film grain**: an inline SVG `feTurbulence` fractal noise texture with `baseFrequency: 0.9` and 4 octaves, tiled across the viewport. Flicker it with a `noise` keyframe using 10 random background-position shifts in 0.5s steps. Opacity is 3%. Use `z-index: 1000`.
3. **CRT scanline**: a 2px horizontal `linear-gradient(90deg, transparent, #22d3ee15, transparent)` that sweeps from the top to the bottom continuously over 8s. Use `z-index: 999`.
4. **Dot grid**: a fixed 60px cell grid using the crossed border gradients, at 40% opacity. Keep it behind content and non-interactive.

Respect `prefers-reduced-motion`: disable or substantially reduce ambient movement, cursor tracking, glitching, and automatic loops while retaining readable visual layers.

## Animation System

Define these keyframes and use them consistently:

| Name | Effect | Duration | Usage |
|---|---|---|---|
| `glitch-1` | Clip horizontal bands and translateX by +/-4px on `::before` | 3s, infinite linear | Hero name burst every 4s |
| `glitch-2` | Same concept with different offsets on `::after` | 3s, infinite linear, 0.1s delay | Hero name burst |
| `float` | `translateY(0 -> -12px -> -6px -> 0)` plus subtle rotation | 6s ease-in-out infinite | Orbit center icon and stat cards |
| `scan` | `translateY(-100% -> 100vh)` | 8s linear infinite | CRT scanline |
| `blink` | `opacity: 1 -> 0 -> 1` with `step-end` timing | 1s infinite | Typewriter cursor |
| `reveal-up` | Fade plus `translateY(40px -> 0)` | 0.7s ease forwards | Load and scroll reveals |
| `glow-pulse` | Cyan box-shadow breathes from `#22d3ee22` to `#22d3ee44` | 3s ease-in-out infinite | Highlighted interactive surfaces |
| `marquee` | `translateX(0 -> -50%)` on a doubled list | 30s linear infinite | Tech stack ticker |
| `noise` | 10 random background-position shifts | 0.5s, steps(2), infinite | Film grain |
| `spin-slow` | Full 360-degree rotation | 20s linear infinite | Orbit rings; also use 30s reverse and 15s variants |

Motion requirements:

- Use animation to reveal hierarchy and interaction state, not to distract from content.
- Stagger scroll reveals by `index * 0.1s` where specified.
- Never allow animation to shift layout or obscure text.
- Use hover states on desktop and press/focus states on touch and keyboard interfaces.

## Fixed Navigation

Create a fixed navigation bar with a subtle backdrop blur, bottom border `#1e1e2e40`, and `px-8 py-5` spacing.

- Left: monospace logo `AB_`. The `A` and `B` are cyan; the underscore is violet.
- Center on desktop: uppercase JetBrains Mono nav links at `0.75rem`, tracked. Resting color is `#8888aa`; hover color is `#22d3ee`; animate an underline from width 0 to 100%.
- Right on desktop: outlined cyan `Hire Me` CTA.
- On mobile: replace desktop navigation with a hamburger made from three 1px horizontal lines. Animate the lines into an `x` on open. Use a full-screen overlay with large Fraunces navigation items.
- Add scroll spy behavior. The active section link is always cyan.

## Hero: `#home`

Use a full viewport-height hero. On desktop, use a left content column and a right decoration column. On mobile, stack the content and hide the orbit decoration.

Content:

- A ping badge with a pulsing green dot and the mono text `Available for opportunities`.
- Two stacked `h1` lines: `Archit` in solid primary text and `Bishnoi` in cyan-violet gradient. Enable glitch treatment on the hero name.
- A typewriter subtitle with fixed text `Full-Stack` followed by cycling words: `Developer.`, `Builder.`, and `Creator.`. Use an 80ms typing interval, 40ms erasing interval, 1800ms hold, and a blinking `|` cursor.
- A muted bio paragraph with an extra-large maximum width.
- Two CTAs: solid cyan `View My Work` and outlined cyan `Get In Touch`. On hover, reverse the fill treatment.
- A centered bottom scroll indicator with a label and a vertical line that fades.

Desktop orbit decoration:

- Three concentric rings with `spin-slow` timings of 20s, 30s reverse, and 15s.
- Four cyan dots on the outer ring at 0, 90, 180, and 270 degrees.
- A floating `</>` icon at the center.
- Apply subtle floating motion and ensure the decoration never overlaps the content column.

Trigger the hero glitch burst every 4s by toggling a `glitchActive` state for 200ms and applying the `.glitch` class to the hero `h1`.

## Marquee Band

Place a ticker band immediately after the hero:

- Vertical padding `py-4`.
- Background `#0d0d14`.
- Double borders on top and bottom using `#1e1e2e`.
- Include 30 technology keywords separated by `✦`; duplicate the complete list for a seamless loop.
- Animate the doubled list left with `marquee` over 30s.

## About: `#about`

Use `py-32`. On large screens, use a two-column grid; on mobile, use a single column.

Left column:

- An Unsplash photo with luminosity blend mode and 60% opacity.
- Add a cyan/violet gradient overlay.
- Add four corner bracket accents made from 2px cyan lines.
- Add two floating stat cards: `20+ Projects` and `3+ Years Coding`.
- Stagger the stat cards' float delays.

Right column:

- Section counter `02 / About Me`.
- A Fraunces heading with one gradient italic emphasis word.
- Three body paragraphs.
- A 2x2 info grid with left-border accent lines for `Location`, `Degree`, `Focus`, and `Status`.

## Skills: `#skills`

Use `py-32` with background `#0d0d14`. Use a two-column grid on large screens.

Left column:

- Show 8 skill bars.
- Each row includes a category tag, skill name, percentage, and 2px progress bar.
- Animate each bar from 0 to its target level when it enters the viewport.
- Use an IntersectionObserver with a one-shot trigger, a 100ms stagger, and a 1.5s `cubic-bezier(0.4, 0, 0.2, 1)` width transition.
- Use the cyan-violet gradient for the fill.

Right column:

- Add a `border-glow` card listing five technology categories: `Frontend`, `Backend`, `Mobile`, `Data`, and `Tools`.
- Display technologies as uppercase JetBrains Mono tag pills.

## Projects: `#projects`

Use `py-32`. Create a 2x2 project grid. Use `gap-px` with background `#1e1e2e` so the gaps become 1px grid dividers.

Each card:

- Uses `#0d0d14` with sharp corners.
- Has a large faded project number in Fraunces at 20% opacity, colored according to the project accent.
- Includes an arrow-link icon at the top right.
- Uses a project title in its accent color.
- Includes a muted description and tracked mono tag pills.
- Adds a shimmer `::before` sweep on hover.
- Lifts by `translateY(-4px)` with a cyan glow shadow on hover.

Project accents:

- Project 01: cyan.
- Project 02: violet.
- Project 03: ember.
- Project 04: cyan.

Use an IntersectionObserver for scroll reveal with an `index * 0.1s` delay. Make cards keyboard-focusable and ensure the arrow link has an accessible label.

## Contact: `#contact`

Use `py-32` with background `#0d0d14`. Use a two-column grid on large screens.

Left column:

- Section counter.
- Editorial heading.
- Short invitation bio.
- Three contact links: `Email`, `GitHub`, and `LinkedIn`.
- Each link has a mono label, link text, and an arrow that translates on hover/focus.

Right column:

- Use a `border-glow` form panel.
- Include name, email, and textarea inputs.
- Inputs use `#111118` backgrounds.
- Track focus locally and lift each input border to `#22d3ee55` while focused.
- Submit button is a full-width solid cyan CTA.
- After submission, transition to a success state with a large `✓` and confirmation message. The demo form does not need a network call.

## Footer

Use a top border `#1e1e2e` and `py-8` spacing.

- Left: copyright in muted JetBrains Mono.
- Right: pulsing ping dot and cyan text `Open to opportunities`.

## Interactive Components

### `SkillBar`

Create a React component using a reusable `useIntersectionObserver` hook. Trigger the width transition by assigning `element.style.width` inside a delayed `setTimeout`. Accept a configurable delay. Disconnect the observer after the first trigger so the animation runs once.

### `ProjectCard`

Create a React component using the same intersection observer pattern. Apply opacity and translateY inline styles with a delay of `index * 0.1s`. Include hover, focus-visible, and touch-appropriate states.

### `ContactForm`

Use local React state. Track focus per input to control border highlighting. On submit, transition to a success view with a large checkmark and confirmation text. No network call is required for the demo.

### Cursor Glow

Add a mousemove listener that updates cursor position in React state. Render a fixed glow div with CSS transitions for `left` and `top`. Disable this behavior on touch devices and when reduced motion is requested.

### Typewriter

Implement a `setTimeout` chain. Cycle word index through `Developer.`, `Builder.`, and `Creator.`. Type at 80ms, hold for 1800ms, erase at 40ms, and loop seamlessly. Include the blinking cursor character.

### Glitch Trigger

Use a `setInterval` every 4s to toggle a `glitchActive` boolean for 200ms. Apply the `.glitch` class while active and use `::before` and `::after` pseudo-elements for the two glitch layers.

### Scroll Spy

Use an IntersectionObserver with a `0.4` threshold over all five section IDs. Store the active section in state and use it to drive the active cyan navigation color.

## Responsive Behavior

- `md` around 768px: use a two-column contact layout and skills header row; replace desktop navigation with the hamburger menu.
- `lg` around 1024px: use full two-column grids for About and Skills, show the orbit decoration, and use the 2x2 project grid.
- On mobile, stack all content, keep hero text readable without horizontal overflow, hide orbit decoration, and use the full-screen navigation overlay.
- Maintain stable dimensions for buttons, bars, grids, icon controls, and cards so hover states and dynamic text do not cause layout shift.
- Ensure all text fits within its parent at every viewport width.

## Scrollbar

Use a 4px scrollbar with a transparent track and `#22d3ee33` thumb with a 2px radius. Keep it visually hidden unless scrolling, using a thin mode where supported.

## Accessibility and Quality

- Provide semantic headings and landmarks.
- Add accessible names to icon-only controls, menu buttons, arrow links, and the scroll indicator where appropriate.
- Support keyboard focus with visible cyan focus states.
- Preserve readable contrast against all backgrounds.
- Respect `prefers-reduced-motion` throughout.
- Do not rely on animation to convey essential information.
- Avoid layout shifts, horizontal scrolling, clipped body copy, and overlapping controls.
- Use real content and relevant imagery rather than abstract placeholder media.

## Technology Stack

Use:

- React 19.
- TypeScript.
- Vite 8.
- Tailwind CSS v4.
- `@tailwindcss/vite` plugin.
- Google Fonts imported through `@import` in `src/index.css` before all other CSS.

The result should feel like Archit Bishnoi's personal digital studio: a living, cinematic, code-literate portfolio that balances engineering credibility with editorial craft.
