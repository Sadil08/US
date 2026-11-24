# Our Memory Lane

A private website for the two of you: an animated bouquet page, a scrollable photo
timeline ("Memory Lane"), a shared diary, and a page for future milestones. Everything
sits behind a shared passphrase so it stays just between you.

## 1. Run it locally (works immediately, no accounts needed)

```bash
npm install
cp .env.example .env.local   # then edit the values, see below
npm run dev
```

Open http://localhost:3000. Without a database connected, the Diary / Memory Lane /
Future pages will show a friendly "not connected yet" message instead of erroring —
you can see the whole design before setting anything else up.

## 2. Personalize it

Edit `.env.local`:

- `NEXT_PUBLIC_HER_NAME`, `NEXT_PUBLIC_MY_NAME` — shown on the home page
- `NEXT_PUBLIC_RELATIONSHIP_START` — date you got together (`YYYY-MM-DD`), used for the
  "X years, Y months... together" counter
- `SITE_PASSPHRASE` — the shared password you'll both use to get in at `/gate`
- `SESSION_SECRET` — any long random string, e.g. generate one with `openssl rand -hex 32`

## 3. Connect a free database (Neon Postgres)

This stores diary entries, events, and photo captions/dates (not the photo files
themselves — those go in R2, see below).

1. Create a free account at [neon.com](https://neon.com) and a new project.
2. In the Neon dashboard, copy the **pooled** connection string into `DATABASE_URL`,
   and the **direct/unpooled** one into `DATABASE_URL_UNPOOLED`.
3. Push the schema to your new database:

   ```bash
   npm run db:push
   ```

## 4. Connect free photo storage (Cloudflare R2)

R2 has no egress fees, which matters here since you'll keep scrolling through photos
for years without ever paying for bandwidth.

1. Create a free Cloudflare account, then go to **R2 Object Storage** and create a
   bucket (e.g. `memory-lane-photos`). No need to make it public — the app proxies
   images itself through `/api/image/...`.
2. Go to **R2 > Manage API Tokens** and create a token with read/write access to that
   bucket. You'll get an Account ID, Access Key ID, and Secret Access Key.
3. Fill in `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and
   `R2_BUCKET_NAME` in `.env.local`.

Photos you upload through the "+ Add a memory" button are automatically converted to
WebP, resized, and given a tiny blur placeholder, so the Memory Lane page loads fast no
matter how many photos you add.

## 5. Deploy privately on Vercel

```bash
npx vercel
```

Add all the same environment variables from `.env.local` in the Vercel project
settings (Settings → Environment Variables), then redeploy. The site stays private on
its own — nobody gets past `/gate` without the passphrase — but don't share the
deployed URL anywhere public.

## Adding content day to day

- **Memory Lane**: open the page, click "+ Add a memory", pick a photo, a date, and
  optionally a "milestone" label (e.g. "Our first trip") to group photos together.
- **Diary**: click "+ Write an entry" on the Diary page. Either of you can write,
  dated for whatever day it's about — not necessarily today.
- **Future**: add upcoming events (next anniversary, a trip, her birthday) and they'll
  show a countdown; past ones get archived under "Already lived".
- **The Bouquet**: regenerates a new arrangement each time with "Make another
  bouquet", and shows a special message automatically when a future event in the
  database is within 3 days.

## Stack

Next.js (App Router) + TypeScript + Tailwind + Framer Motion, Prisma + Neon Postgres,
Cloudflare R2 for images, a signed-cookie passphrase gate (`src/proxy.ts`) instead of
full auth since it's just the two of you.
