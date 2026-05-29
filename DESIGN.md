---
name: Obsidian Sanctuary
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c6'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636465'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#484949'
  on-secondary-container: '#b8b8b8'
  tertiary: '#ffffff'
  on-tertiary: '#071a97'
  tertiary-container: '#dfe0ff'
  on-tertiary-container: '#4a58cb'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#dfe0ff'
  tertiary-fixed-dim: '#bcc2ff'
  on-tertiary-fixed: '#000a64'
  on-tertiary-fixed-variant: '#2938ac'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-quote:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  display-quote-mobile:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  section-header:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  body-main:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-ui:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 40px
  card-gap: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is centered on the concept of "Digital Zen"—a high-end, focused environment for the Chrome "New Tab" experience. It aims to transform a utilitarian browser tool into a sanctuary for reflection and productivity. The target audience includes professionals, designers, and developers who seek a moment of calm and intellectual stimulation before diving into their workflows.

The visual style is a blend of **Modern Minimalism** and **Subtle Glassmorphism**. It prioritizes extreme legibility and a sense of physical depth through soft, atmospheric lighting. The interface is designed to feel quiet and premium, avoiding the "busy-ness" typical of dashboard extensions. It leverages generous negative space to ensure that every piece of information—whether a quote or a task—is treated with editorial importance.

## Colors

The palette is monochromatic and deeply desaturated to minimize cognitive load. 

- **Backgrounds:** A near-black base (#0D0D0D) provides the canvas, while surfaces (#1A1A1A) use very subtle gradients to simulate soft lighting.
- **Accents:** The Primary color is an off-white that avoids harsh contrast, used for high-priority typography. A muted blue-violet tertiary color is used sparingly for active states or subtle progress indicators.
- **Translucency:** Glassmorphic elements utilize a 40px backdrop blur with a 10% white tint to create a sense of layered glass over the dark background.

## Typography

This design system uses a triple-font approach to balance editorial elegance with functional precision.

- **DM Sans** is reserved for high-impact display moments like daily quotes, providing a smooth, sophisticated geometric character.
- **Manrope** serves as the primary workhorse for content lists and descriptions, offering a modern and highly legible sans-serif feel.
- **Geist** provides a technical, monospaced-adjacent aesthetic for metadata, labels, and small UI controls, reinforcing the "extension" and "productivity" utility of the tool.

Hierarchy is established through weight and letter spacing rather than dramatic color changes. Section headers are always uppercase with increased tracking to create an architectural structure.

## Layout & Spacing

The layout utilizes a **Fluid Grid** model with a maximum width container for ultra-wide monitors. 

- **Grid:** A 12-column grid is used for desktop, reflowing to a single column for mobile views. 
- **Margins:** Generous 40px outer margins ensure the content never feels cramped against the browser edges.
- **Vertical Rhythm:** A strict 4px base unit controls all spacing. "Stack" tokens (8px, 16px, 32px) are used to group related information, with larger gaps between cards to maintain a "breathable" atmosphere.
- **Alignment:** Content is generally center-aligned or top-aligned within card containers to maintain a balanced, symmetric visual weight.

## Elevation & Depth

Visual hierarchy is communicated through **Tonal Layers** and **Ambient Shadows** rather than high-contrast borders.

- **Layer 0 (Base):** The dark background (#0D0D0D).
- **Layer 1 (Cards):** Slightly elevated surfaces (#1A1A1A) with a very soft, large-radius shadow (32px blur, 15% opacity) to suggest they are floating.
- **Layer 2 (Overlays):** For modals or tooltips, use Glassmorphism (Backdrop-filter: blur(20px)) with a subtle 1px inner border of 8% white to catch the light.
- **Interaction:** Hovering over a card should slightly increase the shadow spread and lighten the background tint by 2%, providing tactile feedback.

## Shapes

The design system adopts a "Rounded" (0.5rem base) philosophy to soften the technical nature of the browser extension.

- **Cards:** Use `rounded-xl` (1.5rem / 24px) to create a soft, containerized look that feels modern and approachable.
- **Buttons & Inputs:** Use `rounded-lg` (1rem / 16px) for a comfortable touch and click target.
- **Icons:** Circular containers (pill-shaped) are preferred for standalone action icons (like the app launcher or bookmark icons) to distinguish them from content cards.

## Components

### Cards
Cards are the primary container. They should have a subtle top-down linear gradient (from 3% white to 0%) to simulate light hitting the top edge. 

### Buttons
- **Primary:** Low-profile. Surface color is slightly lighter than the card background. Text is Primary Off-White.
- **Ghost:** No background, just `label-ui` typography. Used for secondary actions like "Edit" or "Dismiss."

### Input Fields
Inputs are minimal, featuring a bottom border (1px, 8% white) that glows slightly blue-violet (Tertiary color) when focused. No heavy box containers.

### Chips / Tags
Small, semi-transparent capsules used for categories or time-stamps. Background: `rgba(255, 255, 255, 0.05)`, text: `secondary_color_hex`.

### Progress Indicators
Thin 2px lines or small dots using the Tertiary color. These should be unobtrusive, only appearing when data is loading or a goal is being tracked.

### List Items
Bookmarks and news items should feature a 40px circular placeholder for icons/favicons, with `body-main` for titles and `body-sm` for metadata (source, time). Use a 12px gap between list items.