# Dynamic QR Picture Viewer

**Print one QR code — then change what it shows any time, without reprinting anything.**

A small business prints a QR code once and sticks it on the counter, window, table, flyer or stall.
Scanning it opens a clean picture page on the customer's phone showing the **current** picture. To
change it, the owner uploads a new photo or pastes an image link from the private dashboard — the
same printed code now shows the new picture.

There is no customer app, no account and no login. The customer scans and sees a picture.

## Why this matters for a small business

Printed information goes stale: today's special, this week's prices, the stall's location, the
opening-hours sign. Reprinting a poster or a menu every time is slow and costs money.

With this app the printed QR code is permanent, and the content behind it is editable:

| What you gain | Why it matters |
| --- | --- |
| Print once, update forever | The same sign works for years; only the uploaded picture changes |
| No app or account for customers | Any phone camera can scan it — nothing to install, nothing to sign up for |
| Photos, not just text | Show a menu, a price list, a storefront photo, a map with a pin, a promo poster |
| Update in seconds | Upload a new photo from the dashboard and press **Update picture (keep same QR)** |
| No image hosting needed | Photos are uploaded straight from the phone or PC and stored with the picture record. A public image URL works too |
| Cheap and simple | It is a static website with a small database — no servers to babysit |

## What you can put behind the code

The viewing page shows **one picture** at a time, so combine several items into a single image
(any editor or phone collage app works) and upload that image.

| Use case | What to upload or paste |
| --- | --- |
| **Where we are / directions** | A map image with your pin and street, your entrance or gate photo, or a screenshot of directions. See *Showing customers where to find you* below |
| **Menu or price list** | A photo or screenshot of the menu; replace it whenever prices change |
| **Today's special / promotion** | A promo poster you change as often as you like |
| **Free WiFi sign** | The built-in **FREE WIFI** poster (one click, no image needed) |
| **Contact card** | An image with your phone number, WhatsApp, Instagram, email and hours |
| **Opening hours & holiday notice** | A simple graphic with the current hours |
| **Event, market or pop-up** | The stall layout or location for that day |
| **Products or portfolio** | A catalogue page or a few of your best photos |
| **Booking / order information** | An image explaining how to book or order, with your contact details |

Typical users: cafés and restaurants, food trucks and market stalls, salons and barbers, small
shops, guest houses and lodges, tutors and consultants, photographers, churches and community
halls, and anyone selling through WhatsApp or Instagram.

## Showing customers where to find you

The app displays an **image**, so a location is shared as a picture (this keeps it simple and
private — customers never leave your page for a big map app):

1. Open a map (Google Maps, Apple Maps, OpenStreetMap) on your phone or PC.
2. Drop a pin on your shop or stall and zoom in until your street and nearby landmarks are visible.
3. Take a screenshot of that view.
4. Optionally combine the map with a photo of your entrance and a line such as *"Look for the blue
   gate next to the pharmacy"* in any image editor.
5. Unlock the dashboard, upload that image (or paste a public image URL of a static map — the app
   checks that the link really returns an image), then press **Publish**.
6. Download the QR code and print it on your sign, flyer or delivery bag.

Because the code is permanent, you can update the map later — for example when you move to a new
stall — and every printed QR code instantly shows the new location.

## Set up your own code in five minutes

1. Open the deployed site and enter the dashboard password (a single password, no username).
2. On first unlock the dashboard publishes the built-in **FREE WIFI** poster, so a working code
   exists right away.
3. Choose your picture: **Choose picture…** to upload from this device, paste an image URL, or keep
   the WiFi poster.
4. Press **Publish picture** (or **Update picture (keep same QR)** later).
5. Press **Download QR (PNG)** and print it. The QR code points at a stable public address such as
   `https://your-app.example.com/view/<picture-id>`.
6. Whenever you want a change, unlock the dashboard, upload the new image and press **Update
   picture (keep same QR)** — reprint nothing.

Keep using the same browser that created the picture: it holds the secret edit key. Anyone who
scans only sees the picture and can never change it.

## How it works

```
QR code  →  https://your-app.example.com/view/<picture-id>  →  picture service  →  current image
```

- The QR code encodes a stable public URL (`/view/:id`). The image itself is never encoded in the
  QR code.
- The viewing page fetches the current image reference for that id from the picture service (a Neon
  Postgres database accessed through the Neon Data API with anonymous tokens).
- The owner's browser holds a secret edit token for the picture. Updating the picture requires that
  token, so someone who only scans the code cannot replace it.
- Uploaded images are resized and optimized in the browser and stored with the picture record, so no
  external image hosting is required. Public image URLs are also supported.

The dashboard itself is private: it asks for a single password and no username. People who scan the
QR code go straight to the picture and never see the dashboard.

## Tech stack

- React 19 + TypeScript + Vite
- `qrcode.react` for QR generation, `react-router-dom` for routes
- Neon (Postgres) backend: `pictures` table + `get_picture` / `create_picture` /
  `update_picture` RPC functions, exposed via the Neon Data API
- Managed Better Auth (anonymous tokens) for keyless browser access to the API

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

Open http://localhost:5173

### Environment variables (.env.local)

| Variable | Purpose |
| --- | --- |
| `VITE_NEON_DATA_API_URL` | Public Neon Data API REST URL, e.g. `https://<endpoint>.apirest.../neondb/rest/v1` |
| `VITE_NEON_AUTH_URL` | Managed Better Auth base URL used to fetch anonymous tokens |
| `VITE_APP_BASE_URL` | Optional. Absolute URL of the deployed app used to build QR links (e.g. `https://your-app.netlify.app`). Defaults to the current browser origin |
| `VITE_DASHBOARD_PASSWORD` | Password that unlocks the private dashboard. Must be **exactly 9 characters**; no username is used. Only the dashboard asks for it — the public `/view/:id` page never does |

The Neon URLs are not secrets — the API only allows access through the RPC functions, and edits
require the per-picture edit token stored in the owner's browser.

The dashboard password is different: `VITE_` variables are **bundled into the built site**, so a
determined visitor could extract it from the JavaScript. It reliably keeps casual visitors out of
the dashboard but is not a substitute for real authentication. To make it truly server-side, move
the check into a Netlify/Functions endpoint that reads the password from a non-`VITE_` environment
variable.

If both API variables are empty the app runs in **local demo mode**: pictures are kept in
`localStorage` only, which is clearly indicated in the UI. Local mode cannot share pictures
across devices.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Backend (already provisioned)

The backend for this app was provisioned on Neon:

- **Project:** `dynamic-qr-picture-viewer` (`soft-flower-11416465`, AWS US East Ohio)
- **Table:** `pictures(id uuid, image_url text, source text, edit_token uuid, created_at, updated_at)`
- **RPC functions** (callable by the `anonymous` role, `SECURITY DEFINER`):
  - `get_picture(p_id uuid)` — public read by id
  - `create_picture(p_image_url text, p_source text, p_edit_token uuid)` — creates a picture
  - `update_picture(p_id uuid, p_edit_token uuid, p_image_url text, p_source text)` — updates
    only when the edit token matches
- **Data API:** REST endpoint with CORS enabled; browsers authenticate with short-lived
  anonymous JWTs from Managed Better Auth (`GET <auth>/token/anonymous`)

The anonymous role can only execute the three functions above; it cannot read or list the table
directly, so edit tokens never leak.

## Deploy publicly

The app is a static site; any static host works. The viewing page needs an SPA fallback. A QR code
is only useful to customers once the site is reachable on a public HTTPS address.

### Netlify

1. Build command: `npm run build`, publish directory: `dist`
2. `public/_redirects` already provides the SPA fallback
3. Set the environment variables above in *Site settings → Environment variables*
4. Deploy, then open the site once and unlock the dashboard so the first picture (FREE WIFI poster)
   is created
5. Set `VITE_APP_BASE_URL` to the final site URL and rebuild, so the QR code contains the public
   address instead of `localhost`

### Vercel

1. Import the repo (Vite preset auto-detects `dist`)
2. Add the environment variables
3. After the first deploy, set `VITE_APP_BASE_URL` and redeploy

After deployment, print or display the QR code. Anyone scanning it sees the current picture.
Use **Update picture (keep same QR)** to change it — no reprint needed.

## Security notes

- Images are validated (JPEG/PNG/WebP/GIF, max 15 MB input, optimized to ≈1400 px JPEG) before
  publishing.
- Picture ids are random UUIDs; updates additionally require the random edit token. A scanner
  cannot replace the picture without the token.
- The anonymous API allows anyone to *create* their own picture (each with its own id/token);
  they cannot modify existing ones. For a public production launch, add rate limiting or move
  creation behind real authentication.
- The dashboard is protected by a single 9-character password (`VITE_DASHBOARD_PASSWORD`, checked
  in the browser and validated for length and value). Unlocking is remembered per browser tab
  session; **Lock dashboard** clears it. Because the value ships inside the built bundle, treat it
  as a deterrent, not as strong security.
- The Data API CORS setting is currently `*` for demo convenience. Tighten it to your app's
  origin before heavy public use.

## Known limitations

- The viewing page shows **one picture** at a time. To publish a menu *and* a map, combine them into
  a single image before uploading.
- Images are stored as optimized data URLs in Postgres (recommended under ~6 MB each). Very
  large photos must be compressed further or referenced by URL.
- Animated GIFs become static after optimization.
- The Neon compute scales to zero; the first request after idle can take a few seconds — the UI
  shows loading states and retry buttons for this.
- Editing is per browser: the edit token lives in that browser's `localStorage`. Clearing site
  data (or another browser/PC) starts a new picture with a new QR code, so keep the device that
  created the code, and use **Download QR (PNG)** to save a backup of the code.
