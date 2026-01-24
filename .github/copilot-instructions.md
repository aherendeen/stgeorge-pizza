# St. George Pizza - AI Coding Guidelines

## Architecture Overview

Static Astro 5 site with View Transitions, Tailwind CSS v4, and Alpine.js for interactivity. Content is managed through Astro Content Collections loading from JSON files.

**Key directories:**
- `src/components/` - Reusable Astro components with scoped styles
- `src/data/` - Site config (`config.ts`), menu data (`menus.js`), and JSON content files
- `src/layouts/Layout.astro` - Main layout with Header, Footer, ScrollToTop, MobileToolbar
- `src/content.config.ts` - Content collection schemas (plates, reviews, gallery)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build (generates sitemap + robots.txt)
npm run lint     # ESLint for .ts and .astro files
npm run format   # Prettier formatting
```

## Critical Patterns

### View Transitions + Alpine.js
Alpine components break after page navigation. Always reinitialize:
```js
document.addEventListener("astro:page-load", () => {
  if (window.Alpine) {
    window.Alpine.initTree(document.body);
  }
});
```
For Alpine component registration, use a flag to prevent duplicate registration:
```js
if (window.Alpine && !window.Alpine.data._x_registeredComponentName) {
  window.Alpine.data("componentName", () => ({ /* ... */ }));
  window.Alpine.data._x_registeredComponentName = true;
}
```

### Color System (Italian Theme)
All colors use CSS custom properties defined in `src/styles/global.css`. Dark mode toggles `.dark` class on `<html>`.

| Semantic | Light | Usage |
|----------|-------|-------|
| `--color-accent` | Green 700 | Primary actions, links |
| `--color-cta` | Red 700 | Call-to-action buttons, booking |
| `--color-text-primary` | Stone 900 | Headings |
| `--color-text-secondary` | Stone 600 | Body text, paragraphs |

### Button Variants
Use predefined classes from global.css, not inline Tailwind:
```astro
<Button variant="primary" url="/menu">View Menu</Button>  <!-- Green -->
<Button variant="cta" url="/book">Book Now</Button>       <!-- Red -->
<Button variant="outline">Secondary</Button>
```

### Image Optimization
```astro
<!-- Above fold: eager load -->
<Picture src={Image} loading="eager" fetchpriority="high" />

<!-- Below fold: lazy load -->
<Picture src={Image} loading="lazy" />
```
Alt text must be descriptive, never use words like "image", "photo", or "picture".

### Icons
Use `astro-icon` with Lucide icons:
```astro
import { Icon } from "astro-icon/components";
<Icon name="lucide:phone" class="size-5" />
```

## Content Collections

Data lives in `src/data/*.json` with schemas in `src/content.config.ts`:
- **plates** - Menu categories and items with prices
- **reviews** - Customer testimonials
- **gallery** - Images with alt text

Access via `getCollection()`:
```astro
import { getCollection } from "astro:content";
const gallery = await getCollection("gallery");
```

## Site Configuration

All site-wide values in `src/data/config.ts`: phone, email, address, hours, social media. Import and use consistently:
```astro
import { phone, siteName } from "../data/config";
```

**IMPORTANT:** All phone and email links must go to `/contact` page - never use `tel:` or `mailto:` URLs directly.

## Mobile Considerations

- `MobileToolbar.astro` - Fixed bottom nav on mobile (hidden lg+)
- `Header.astro` - Uses vanilla JS (not Alpine) for mobile menu to work with View Transitions
- Body has `padding-bottom: 4.5rem` on mobile for toolbar space
