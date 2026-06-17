# EnerZen Herbal Diffuser — Store Template

A single-file, high-converting landing page / storefront for a natural aromatherapy diffuser brand. No build step, no dependencies beyond Google Fonts — open `index.html` directly in a browser, or upload it to any host (Shopify page, Netlify, GitHub Pages, etc).

## What's included

- Sticky announcement bar + navbar
- Hero with product preview card, pricing, and trust stats
- Social proof strip
- Benefits grid, "How it works" steps
- 3-tier product grid (Mini / Pro / XL) with a featured "Best Seller" card
- Use-case grid, testimonials, FAQ accordion
- CTA banner, footer, and a floating "Download HTML" button
- Scroll-in animations and mobile nav — all vanilla JS, no frameworks

## Fully customizable theme

Everything visual is driven by CSS variables at the top of `index.html`, inside `:root`:

```css
:root {
  --color-primary:        #5B8A5A;   /* sage green */
  --color-primary-dark:   #466B45;
  --color-primary-glow:   rgba(91, 138, 90, 0.22);
  --color-accent:         #C97B4A;   /* terracotta */
  --color-bg:             #FBF7EF;   /* warm linen background */
  --color-surface:        #FFFFFF;
  --color-surface-2:      #F3EDDD;
  --color-border:         rgba(53,43,33,0.10);
  --color-text:           #2B2A24;
  --color-text-muted:     #6E6657;
  --color-success:        #4A7856;

  --font-heading:   'Fraunces', serif;
  --font-body:      'Inter', sans-serif;

  --max-width:      1200px;
  --border-radius:  18px;
  --border-radius-sm: 10px;
}
```

To re-theme the whole site, change those values — every section (cards, buttons, badges, gradients) references them. To swap fonts, update the `<link>` tag in `<head>` to pull a different Google Fonts pair, then update `--font-heading` / `--font-body` to match.

## Editing content

Every section is marked with an HTML comment like `<!-- CUSTOMIZE: ... -->` so you can find what to edit quickly:

- Hero headline/subheadline/CTA — `.hero`
- Product cards (name, price, features) — `#products`
- Benefits, steps, use cases, testimonials, FAQ — each in their own `<section>`
- Footer links and brand copy — `<footer>`

## Connecting checkout

This is a static template — "Add to Cart" buttons are placeholders (`href="#"`). To go live:

- **Shopify**: paste the relevant sections into a custom section/page, or use this as a reference for a Shopify theme rebuild, and point each "Add to Cart" link at the matching product/variant URL (`/cart/add?id=...`).
- **Other platforms** (Shopify Buy Button, Snipcart, Stripe Payment Links, etc.): replace the `href="#"` on each `.btn` inside `.product-card__footer` and the hero card with your checkout/payment link.

## License

Use freely as a starting point for your own store.
