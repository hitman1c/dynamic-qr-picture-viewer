# Dynamic QR Picture Viewer

A React web application that generates a QR code in the browser. Scanning the code with a phone
opens a public picture-viewing page that always shows the **current** picture. The picture can be
replaced any time — the printed QR code keeps working.

The dashboard (where a picture is chosen and published) is private: it asks for a single password
and no username. People who scan the QR code go straight to the picture and never see the
dashboard.

After the first dashboard unlock the app publishes a **FREE WIFI poster** as the default picture,
so scanning the QR code right away shows that poster on any device.

## How it works

```
QR code  →  https://your-app.example.com/view/<picture-id>  →  picture service  →  current image
```

- The QR code encodes a stable public URL (`/view/:id`). The image itself is never encoded in the
  QR code.
- The viewing page fetches the current image reference for that id from the picture service
  (a Neon Postgres database accessed through the Neon Data API with anonymous tokens).
- The owner's browser holds a secret edit token for the picture. Updating the picture requires
  that token, so someone who only scans the code cannot replace it.
- Uploaded images are resized/optimized in the browser and stored with the picture record, so no
  external image hosting is required. Public image URLs are also supported.

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

The app is a static site; any static host works. The viewing page needs an SPA fallback.

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

- Images are stored as optimized data URLs in Postgres (recommended under ~6 MB each). Very
  large photos must be compressed further or referenced by URL.
- Animated GIFs become static after optimization.
- The Neon compute scales to zero; the first request after idle can take a few seconds — the UI
  shows loading states and retry buttons for this.
- Editing is per browser: the edit token lives in that browser's `localStorage`. Clearing site
  data (or another browser/PC) starts a new picture with a new QR code.
