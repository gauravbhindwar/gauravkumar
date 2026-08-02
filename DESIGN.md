---
name: Lumina Dark
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#dac0c9'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#a28a93'
  outline-variant: '#544249'
  surface-tint: '#ffafd3'
  primary: '#ffafd3'
  on-primary: '#620040'
  primary-container: '#f472b6'
  on-primary-container: '#6d0047'
  inverse-primary: '#a43073'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#3cddc7'
  on-tertiary: '#003731'
  tertiary-container: '#00b3a0'
  on-tertiary-container: '#003e37'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd8e7'
  primary-fixed-dim: '#ffafd3'
  on-primary-fixed: '#3d0026'
  on-primary-fixed-variant: '#85145a'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#62fae3'
  tertiary-fixed-dim: '#3cddc7'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
  surface-glass: rgba(30, 41, 59, 0.7)
  neon-pink: '#FF2D7D'
  glow-purple: '#BD00FF'
  dark-navy: '#020617'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 2rem
  margin-page: 5vw
  section-gap: 8rem
  element-gap: 1.5rem
---

## Brand & Style

This design system is crafted for a high-end personal brand that balances technical mastery with creative flair. The personality is **Sophisticated, Visionary, and Precise**. It targets recruiters and collaborators in the premium tech and design sectors.

The visual style is a fusion of **Minimalism** and **Glassmorphism**. It utilizes a "Deep Space" canvas where content appears to float on translucent glass planes. The aesthetic avoids heavy, solid blocks in favor of light-refracting surfaces and vibrant, neon-inspired accents that feel "alive" against a dark substrate. Every interaction should feel fluid and intentional, evoking the atmosphere of a premium developer console or a luxury digital atelier.

## Colors

The palette is built on a foundation of **Deep Navy and Charcoal** to provide a more sophisticated alternative to pure black. 

- **Primary & Secondary:** A gradient-ready pairing of Vivid Pink and Electric Purple. These should be used for interactive elements, highlights, and subtle "neon glow" effects.
- **Tertiary:** A soft Teal/Mint used sparingly for success states or to break the warm color dominance.
- **Backgrounds:** Use `dark-navy` for the global background. Interactive surfaces use `surface-glass` with a backdrop blur of 12px-20px to create depth.
- **Contrast:** High-contrast white (`#F8FAFC`) is reserved for primary text, while muted slate is used for secondary information to maintain focus on the hierarchy.

## Typography

The typography system relies on **Plus Jakarta Sans** for a modern, slightly geometric character in headings, and **Inter** for its unparalleled legibility in technical body content.

Headlines should utilize tight letter spacing and heavy weights to create a "Display" feel. For the primary hero text, apply a subtle linear gradient using the primary and secondary colors. Body text should maintain a generous line height (1.6) to ensure readability against the dark background. Use uppercase labels with increased tracking for metadata, categories, and section overlines to provide a technical, architectural feel.

## Layout & Spacing

The design system employs a **Fixed Grid** approach for desktop, centering a 12-column structure within a 1200px container. 

- **Vertical Rhythm:** Sections are separated by large 8rem gaps to provide breathing room and emphasize the minimalist aesthetic. 
- **Internal Padding:** Cards and containers use a consistent 2rem (32px) internal padding.
- **Mobile Adaptation:** On mobile devices, the 12-column grid collapses to a single column, gutters reduce to 1rem, and side margins are fixed at 5vw. 
- **Alignment:** All text elements follow a strict left-aligned baseline to maintain professional structure, with the exception of specific hero moments which can be centered for impact.

## Elevation & Depth

Depth is not communicated through traditional black shadows, but through **Tonal Layering** and **Luminosity**.

1.  **Base Layer:** The deepest background (`dark-navy`).
2.  **Surface Layer:** Translucent cards using `surface-glass`. These feature a 1px border with 10% white opacity to define edges.
3.  **Accent Elevation:** Interactive elements (like active buttons) use a "glow" shadow. This is an ambient shadow tinted with the primary color (e.g., `box-shadow: 0 10px 30px -10px rgba(244, 114, 182, 0.5)`).
4.  **Backdrop Blurs:** Any element sitting above another must use a `backdrop-filter: blur(16px)` to simulate physical glass, ensuring text remains legible over background gradients or decorative elements.

## Shapes

The shape language is **Refined and Modern**. 

The standard radius is 0.5rem (8px), providing a balance between approachable softness and professional precision. Buttons and high-level cards should scale up to `rounded-lg` (1rem) to feel more substantial. Form inputs and status tags use the standard `rounded` (0.5rem) setting. Avoid pill-shapes except for very small utility tags (e.g., skill chips) to maintain a more architectural, structured look.

## Components

- **Buttons:** Primary buttons use a linear gradient (Primary to Secondary) with white text and a subtle hover glow. Secondary buttons use a glass background with a 1px tinted border.
- **Chips/Tags:** Small, high-contrast badges. Use a 10% opacity background of the accent color with 100% opacity text for a "light-box" effect.
- **Cards:** The core of the system. Glass-morphic surfaces with a 1px `border-white/10` and `backdrop-blur`. On hover, the border opacity should increase to 30%.
- **Input Fields:** Deep charcoal background (`#1E293B`) with a 1px border that glows when focused. Placeholder text should be muted slate.
- **Lists:** Clean, border-bottom separation using `white/5`. Use the primary color for bullets or icons to guide the eye.
- **Gradients:** Use "Mesh Gradients" in the background corners—large, soft blurs of Pink and Purple that move slowly—to prevent the dark mode from feeling static.