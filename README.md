
**BIKFAM Sticker Shop** — the official merch store for CJBIK. Sell premium decals and custom 12-packs via Stripe Checkout, with an admin dashboard to manage the catalog and customer uploads.

The site is a static, framework-free HTML/CSS/JS frontend served by Cloudflare Pages, with backend logic in Cloudflare Pages Functions and storage in Cloudflare R2. No build step, no framework, no tests.

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (`js/main.js`, `js/build.js`)
- **Backend:** Cloudflare Pages Functions (`onRequest(context)` convention, `context.env` bindings)
- **Storage:** Cloudflare R2 bucket (`DECAL_UPLOADS`)
- **Payments:** Stripe Checkout (server-side `stripe` package in `functions/`)
- **Hosting:** Cloudflare Pages

## Pages

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `index.html` | Home page; featured products from the catalog |
| `/shop` | `shop.html` | Browse stickers/custom decals from the catalog |
| `/build` | `build.html` | Custom 12-pack builder (picks any 12 stickers, $11.99 flat) |
| `/cart` | `cart.html` | Cart + Stripe Checkout + success page |
| `/faq` | `faq.html` | FAQ / info |

Each page's `<body>` sets a `data-page` attribute; `js/main.js` dispatches page-specific logic on it. `build.html` must load `js/main.js` before `js/build.js` because the builder reuses main.js's cart functions.

## Project Structure

```
├── index.html, shop.html, build.html, cart.html, faq.html  # Pages
├── css/style.css
├── js/
│   ├── main.js            # Shared logic + cart (dispatched per data-page)
│   └── build.js           # Custom pack builder (requires main.js loaded first)
├── images/                # Decal images (gitignored source .psd/.ai live here)
└── functions/             # Cloudflare Pages Functions (backend)
    ├── api/
    │   ├── products.js    # GET catalog from R2 (fallback DEFAULT_CATALOG)
    │   ├── stickers.js    # GET stickers from R2 (fallback DEFAULT_STICKERS)
    │   ├── upload.js      # Customer custom-decal upload -> R2 uploads/*
    │   ├── create-checkout-session.js  # Stripe checkout w/ flat-rate shipping
    │   └── webhook.js     # Stripe webhook -> orders.json (idempotent)
    ├── admin/             # Admin dashboard (behind session cookie auth)
    │   ├── _middleware.js # Guards /admin/* (except login/logout) via admin_sesh cookie
    │   ├── index.js       # Dashboard / orders
    │   ├── products.js    # Catalog CRUD (PRG pattern)
    │   ├── stickers.js    # Sticker CRUD (PRG pattern)
    │   └── image.js       # Serves private customer uploads (admin-only)
    ├── product-images/    # Public route for admin-uploaded product images (R2)
    ├── sticker-images/    # Public route for admin-uploaded sticker images (R2)
    └── package.json       # Only dependency: stripe (run npm install here)
```

## Local Development

There is no build, test, or lint step. To run the Functions locally with Cloudflare's runtime:

```sh
npx wrangler pages dev
```

You'll need Cloudflare credentials and the environment variables below set.

## Environment Variables

Set these in the Cloudflare dashboard (not in the repo):

| Variable | Type | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Secret | Stripe server-side API key |
| `STRIPE_WEBHOOK_SECRET` | Secret | Verifies Stripe webhook signatures |
| `ADMIN_SECRET` | Secret | Admin password; sets the `admin_sesh` cookie |
| `DECAL_UPLOADS` | R2 binding | Storage for all data + uploads |

## R2 Keys

- `products/catalog.json`, `products/stickers.json` — live catalog & stickers (admin-managed; the hardcoded `DEFAULT_*` copies in code only serve when R2 is empty)
- `orders.json` — all orders in a single file (webhook appends)
- `cart_session/<ref>.json` — cart snapshots referenced in Stripe `metadata.cart_ref` (workaround for Stripe's 500-char metadata limit); deleted when checkout completes
- `uploads/*` — customer custom-decal uploads (private, served via the admin `image.js` route)
- `product-images/*`, `sticker-images/*` — admin uploads (intentionally public)

## Deployment

Push to the repo; Cloudflare Pages builds automatically (no build command). Configure the env variables and R2 binding in the dashboard first.

## Notes & Known Gotchas

- Default catalog/stickers are hardcoded **and duplicated** (`DEFAULT_CATALOG` in both `functions/api/products.js` and `functions/admin/products.js`; likewise `DEFAULT_STICKERS`). The live source of truth is R2 — change defaults in **all** copies.
- Custom 12-pack price/size are hardcoded client-side: `PACK_PRICE = 11.99` and `MAX_PACK_SIZE = 12` in `js/build.js`.
- Shipping is a single fixed flat rate; tax support was deliberately removed.
- Admin mutations follow the PRG pattern (POST → redirect with `?msg=`). Keep new POST handlers consistent.
- Customer uploads are admin-only by design — customers can't view their own uploads, only admin can.
- See `PENDING_APPROVAL.md` for a list of known issues awaiting owner sign-off.
