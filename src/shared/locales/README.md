# Localization System

This directory contains all UI text strings for the application, centralized for easy maintenance and future internationalization.

## Structure

```
src/shared/locales/
├── en.ts       # English locale (default)
├── index.ts    # Export configuration
└── README.md   # This file
```

## Usage

Import the locales object in any component:

```tsx
import { locales } from "@/shared/locales";

// Use in JSX
<h1>{locales.pages.home.title}</h1>
<button aria-label={locales.aria.sendMessage}>Send</button>
```

## Organization

The locales are organized by context:

- **site** - Site-wide metadata (title, description)
- **nav** - Navigation labels
- **pages** - Page-specific titles and descriptions
- **homeCards** - Home page card content
- **fields** - Data field labels (reusable across all data pages)
- **ui** - Common UI elements (buttons, messages)
- **errors** - Error messages
- **aria** - Accessibility labels (ARIA attributes)

## Adding New Locales

To add support for another language:

1. Create a new file (e.g., `es.ts` for Spanish)
2. Copy the structure from `en.ts`
3. Translate all values
4. Update `index.ts` to export the new locale
5. Implement language switching logic

## Type Safety

All locales are typed with `as const` to ensure:

- Autocomplete support in IDEs
- Type-checking for missing translations
- Inference of exact string values

The `Locales` type is exported for reference:

```tsx
import type { Locales } from "@/shared/locales";
```

## Benefits

✅ **Single source of truth** - All text in one place  
✅ **Easy to update** - Change text without touching component code  
✅ **i18n ready** - Structure supports multiple languages  
✅ **Type-safe** - TypeScript ensures completeness  
✅ **Searchable** - Find all uses of a string easily  
✅ **Consistent** - Same terms used throughout app
