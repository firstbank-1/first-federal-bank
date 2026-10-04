# Harborlight Demo Bank

A portfolio demo of an online and mobile banking app. **Fictional bank, fictional data.**
React + Vite front end, Supabase for Google sign-in, database and server-side rules.

## 1. Create the database (once)
Supabase dashboard -> **SQL Editor** -> paste all of `supabase/schema.sql` -> **Run**.
It creates the tables, row-level security, and the functions that move money.

## 2. Turn on Google sign-in
1. Google Cloud Console -> APIs & Services -> Credentials -> **Create OAuth client ID** (type: Web application).
   Add this **Authorized redirect URI**:
   `https://bhcceotqaxcdoiuwduro.supabase.co/auth/v1/callback`
2. Supabase dashboard -> **Authentication -> Providers -> Google** -> enable it and paste the Client ID and Client secret.
3. Supabase dashboard -> **Authentication -> URL Configuration**:
   - Site URL: your deployed URL (or `http://localhost:5173` while developing)
   - Redirect URLs: add `http://localhost:5173/auth/callback` and `https://YOUR-DOMAIN/auth/callback`

## 3. Run it
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```
`.env` already holds your project URL and anon key. The anon key is meant to be public;
never put the `service_role` key in this project.

Deploy `dist/` to Netlify, Vercel, Cloudflare Pages etc. `public/_redirects` and `vercel.json`
make deep links like `/auth/callback` and `/admin` work.

## How it works
- `/auth/callback` lets Supabase finish the Google sign-in, then redirects to `/`.
- Signed out: homepage. Signed in: header + page + footer + bottom bar.
- On first sign-in `ensure_setup()` creates your profile and fictional demo accounts, cards, payees,
  activity, alerts and a welcome message. **The first person ever to sign in becomes the admin**; everyone
  after is a customer. Change roles later in /admin -> Customers.
- Money rules (signed in, own account, positive amount rounded to cents, enough funds, loans can't be spent
  from) are enforced inside Postgres functions, not in the browser. Browsers can read their own rows
  but cannot write balances.
- `/admin` has its own layout. Every read/write is checked by row-level security with `is_admin()`,
  so hiding the page is only cosmetic.
- Check-order fees come from the `check_styles` table on the server, not from the browser.

## Notes
- Statement "Download" produces a CSV file, which opens in Excel/Sheets.
- To make yourself admin manually: `update profiles set role='admin' where email='you@gmail.com';`

## Homepage photos (optional)
The homepage is styled after your screenshots. Photos can't be bundled, so add your own licensed
images to `public/images/` as `hero.jpg`, `students.jpg`, `families.jpg` and `business.jpg`
(see `public/images/README.txt`). Without them you get blue gradients in the same layout.
