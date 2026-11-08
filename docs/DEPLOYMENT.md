# Deployment & Production Guide — Sufi Map

This guide outlines the steps to deploy **Sufi Map** to Vercel with a connected Supabase backend.

---

## 1. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Run migrations strictly in order using the Supabase SQL Editor or Supabase CLI:
   - [`supabase/migrations/20261108000001_initial_sufi_map_schema.sql`](../supabase/migrations/20261108000001_initial_sufi_map_schema.sql)
     *(Enables PostGIS, creates profiles, places, persons, gatherings, corrections, quotes, badges, and RLS policies)*
   - [`supabase/migrations/20261108000002_seed_quotes_and_sample_data.sql`](../supabase/migrations/20261108000002_seed_quotes_and_sample_data.sql)
     *(Seeds badges, verified quotes, and West Malappuram sample entries)*
   - [`supabase/migrations/20261108000003_storage_bucket_and_policies.sql`](../supabase/migrations/20261108000003_storage_bucket_and_policies.sql)
     *(Creates the `place-photos` public storage bucket and upload policies)*

3. Under **Project Settings > API**, retrieve:
   - `Project URL`
   - `anon public` key

---

## 2. Environment Variables Configuration
Set the following environment variables in Vercel (and locally in `.env.local`):

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous public API key |
| `NEXT_PUBLIC_MAP_TILE_URL` | *(Optional)* Custom raster tile server URL (defaults to OpenStreetMap) |

> [!CAUTION]
> Never commit actual keys to version control. Maintain `.env.example` with placeholders only.

---

## 3. Vercel Deployment
1. Import the Git repository in your Vercel Dashboard.
2. Select **Next.js** framework preset.
3. Configure the environment variables listed above.
4. Deploy.

---

## 4. Internationalization & RTL Verification
- **English**: `https://your-domain.vercel.app/en`
- **Malayalam**: `https://your-domain.vercel.app/ml`
- **Arabic**: `https://your-domain.vercel.app/ar` (automatic RTL layout with Amiri font)
