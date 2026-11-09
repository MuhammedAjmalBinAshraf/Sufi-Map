# PROJECT_STATE.md — Living State of Sufi Map

## Current Status
- Lovable repository (`sufi-sanctuary-map`) synchronized into `master` and `lovable` branches.
- Production live at https://sufi-map.vercel.app (deployment `dpl_GvNAF3LzM63AVBvYyT7jkLWcBFJR`).
- Google OAuth and Email (signup/signin) authentication active via Supabase Auth.
- Contribution workflow guarded: Sign-in required to submit sanctuaries (auto-redirects to sign-in dialog and resumes upon authentication).
- Legal compliance pages live for Google Cloud OAuth verification:
  - Privacy Policy: https://sufi-map.vercel.app/privacy
  - Terms of Service: https://sufi-map.vercel.app/terms
- Map Layers (Sahn Warm, OSM Streets, Satellite Aerial, Topo Terrain) and Locate Me active.
- Legacy `/en`, `/ml`, `/ar` routes seamlessly redirect to `/`.

## Done
- Synchronized `sufi-sanctuary-map.git` as the canonical `master` branch.
- Backed up previous Next.js codebase to branch `backup/nextjs-main`.
- Added Map Controls toolbar (`MapControls.tsx`) with 4-tier basemap styles and regional hubs.
- Implemented high-accuracy browser geolocation ("Locate Me") with Haversine nearest sanctuary calculator.
- Created `AuthDialog.tsx` supporting Google OAuth and Email/Password Sign Up and Sign In.
- Wrapped application in `AuthProvider` (`auth.tsx`) with SSR-safe Supabase client (`supabase.ts`).
- Created dedicated Privacy Policy page (`/privacy`) fulfilling Google API Services User Data Policy, living scholar ethical rules, and data retention guidelines.
- Created dedicated Terms of Service page (`/terms`) with ethical contributor guidelines and historical attribution covenants.
- Added direct policy links to `SettingsSheet.tsx` and `AuthDialog.tsx`.
- Added trilingual localization keys for layers, geolocation, and auth in English, Malayalam, and Arabic.
- Configured Vercel production deployment with Build Output API v3 and Node 22 runtime.
- Added 307 redirects for legacy `/en`, `/ml`, `/ar` routes in `vercel.json` and TanStack catch-all route `$.tsx`.

## In Progress
- Google Cloud OAuth Consent Screen verification submission using the published URLs.

## Next Up
- Enable authenticated submission persistence to Supabase database.
- Expand sanctuary seed dataset for additional regions in Kerala.

## Changelog
- **2026-11-10 02:15**: Added Privacy Policy (`/privacy`) and Terms of Service (`/terms`) pages for Google Cloud OAuth verification, linked from Settings and Auth dialogues, deployed to Vercel production.
  - *Files touched*: `src/routes/privacy.tsx`, `src/routes/terms.tsx`, `src/components/sufi/SettingsSheet.tsx`, `src/components/sufi/AuthDialog.tsx`, `src/routeTree.gen.ts`.
- **2026-11-10 02:00**: Added user authentication (Google OAuth & Email signup/signin), SSR-safe Supabase client, and user account buttons in desktop and mobile headers.
  - *Files touched*: `src/lib/auth.tsx`, `src/lib/supabase.ts`, `src/components/sufi/AuthDialog.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/lib/i18n.tsx`.
- **2026-11-10 01:25**: Added Map Layers switcher (Sahn Warm, OSM Streets, Satellite, Terrain), Locate Me geolocation with nearest sanctuary finder, and legacy locale route redirects (`/en`, `/ml`, `/ar` → `/`).
  - *Files touched*: `src/components/sufi/MapControls.tsx`, `src/components/sufi/SanctuaryMap.tsx`, `src/lib/maplibre.ts`, `src/routes/index.tsx`, `src/routes/$.tsx`, `vercel.json`.
- **2026-11-10 00:40**: Sourced `sufi-sanctuary-map` as master, backed up Next.js code to `backup/nextjs-main`, and deployed to Vercel production.
  - *Files touched*: Full repo mirror.
