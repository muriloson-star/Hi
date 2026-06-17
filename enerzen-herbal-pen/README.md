# EnerZen Herbal Pen — Store Template

A single-file, high-converting landing page / storefront for a natural personal aromatherapy inhaler pen. No build step, no dependencies beyond Google Fonts — open `index.html` in any browser, or upload to Shopify, Netlify, GitHub Pages, or any host.

## What's included

- Sticky announcement bar + navbar with smooth scroll
- Hero with interactive scent selector (click Calm / Focus / Sleep / Energy — the product preview updates live)
- Social proof strip
- 4-blend Scent Grid with color-coded cards
- Benefits grid (6 cards)
- "How to Use" 4-step process
- Product / Bundle grid (Single · Duo · Full Collection)
- Botanical Ingredients deep-dive section
- 6-card testimonials
- FAQ accordion
- CTA banner
- Footer with 4 columns
- Floating "Download HTML" button
- Scroll-in animations — all vanilla JS, zero frameworks

## Fully customizable theme

All visual styles are CSS variables in `:root` at the top of `index.html`:

```css
:root {
  --color-primary:        #3D7A5E;   /* forest green */
  --color-primary-dark:   #2E5E47;
  --color-primary-glow:   rgba(61, 122, 94, 0.22);
  --color-accent:         #B86E3C;   /* warm amber-brown */
  --color-bg:             #F5F0E8;   /* parchment background */
  --color-surface:        #FDFAF5;
  --color-surface-2:      #EDE5D0;
  --color-border:         rgba(60,48,35,0.12);
  --color-text:           #282218;
  --color-text-muted:     #6A5E4E;

  --font-heading:   'DM Serif Display', serif;
  --font-body:      'DM Sans', sans-serif;

  --max-width:      1200px;
  --border-radius:  20px;
  --border-radius-sm: 12px;
}
```

To change the whole site palette: update these variables. To change fonts: swap the `<link>` tag in `<head>` to a different Google Fonts pair and update `--font-heading` / `--font-body`.

## Editing content

HTML comments throughout mark each customizable area:
- Hero headline/copy/pricing — `.hero`
- Scent cards (blend names, emoji) — `.scents`
- Benefit cards, "how it works" steps — `#benefits`, `#how-it-works`
- Product / bundle cards (names, prices, features) — `#products`
- Botanical ingredient descriptions — `#botanical`
- Testimonials, FAQ Q&As — `#reviews`, `#faq`

The hero's scent-switcher JS (`scentMap` object in `<script>`) maps each bubble label to a pen name, subtitle, and emoji — update that object if you rename or add blends.

## Connecting checkout

"Add to Cart" buttons are placeholders (`href="#"`). To go live:
- **Shopify**: replace each `href="#"` on `.product-card__footer .btn` with the matching `/cart/add?id=<variant_id>` URL, or use Shopify's Buy Button script.
- **Stripe Payment Links / Snipcart / Gumroad**: replace `href="#"` with your hosted checkout URL.

## License

Use freely as a starting point for your own store.
