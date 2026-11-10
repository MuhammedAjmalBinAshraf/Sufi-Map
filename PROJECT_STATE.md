# PROJECT_STATE.md — Living State of Sufi Map

## Current Status
- Lovable repository (`sufi-sanctuary-map`) synchronized into `master` and `lovable` branches.
- Production live at https://sufi-map.vercel.app (deployment `dpl_Ee3YNovkunyhizR6U9TbhyianVqu`).
- Ambient background Qira'at (Surah An-Nur recitation) active across all pages with floating mini-player, soundwave equalizer, autoplay fallback on first gesture, and pause/mute persistence.
- Google OAuth and Email (signup/signin) authentication active via Supabase Auth.
- Contribution workflow guarded: Sign-in required to submit sanctuaries (auto-redirects to sign-in dialog and resumes upon authentication).
- Legal compliance pages live for Google Cloud OAuth verification:
  - Privacy Policy: https://sufi-map.vercel.app/privacy
  - Terms of Service: https://sufi-map.vercel.app/terms
- Map Layers (Sahn Warm, OSM Streets, Satellite Aerial, Topo Terrain) and Locate Me active.
- Legacy `/en`, `/ml`, `/ar` routes seamlessly redirect to `/`.

## Done
- Integrated ambient background Qira'at player (`AmbientPlayer.tsx`) with animated soundwave visualizer, soft volume (35%), loop playback, device-local pause/mute persistence (`src/lib/audio.ts`), and autoplay fallback on first user interaction for strict browsers.
- Uploaded 28MB WebM Surah An-Nur recitation asset through Lovable MCP, configured asset descriptor (`public/qiraat.webm.asset.json`), and verified streaming with HTTP 200 and CORS enabled.
- Added 5 unit tests in `src/test/audio.test.tsx` verifying autoplay, gesture retry fallback, and preference persistence (all 22 unit tests passing).
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
- **2026-11-10 03:00**: Completed ambient Qira'at audio setup via Lovable MCP. Added floating mini-player (`AmbientPlayer.tsx`) with animated wave icon, play/pause and mute/unmute buttons, trilingual i18n support, and test suite. Deployed to Vercel production (`dpl_Ee3YNovkunyhizR6U9TbhyianVqu`).
  - *Files touched*: `public/qiraat.webm.asset.json`, `src/components/sufi/AmbientPlayer.tsx`, `src/lib/audio.ts`, `src/lib/i18n.tsx`, `src/routes/__root.tsx`, `src/styles.css`, `src/test/audio.test.tsx`, `package.json`.
- **2026-11-10 02:15**: Added Privacy Policy (`/privacy`) and Terms of Service (`/terms`) pages for Google Cloud OAuth verification, linked from Settings and Auth dialogues, deployed to Vercel production.
  - *Files touched*: `src/routes/privacy.tsx`, `src/routes/terms.tsx`, `src/components/sufi/SettingsSheet.tsx`, `src/components/sufi/AuthDialog.tsx`, `src/routeTree.gen.ts`.
- **2026-11-10 02:00**: Added user authentication (Google OAuth & Email signup/signin), SSR-safe Supabase client, and user account buttons in desktop and mobile headers.
  - *Files touched*: `src/lib/auth.tsx`, `src/lib/supabase.ts`, `src/components/sufi/AuthDialog.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/lib/i18n.tsx`.
- **2026-11-10 01:25**: Added Map Layers switcher (Sahn Warm, OSM Streets, Satellite, Terrain), Locate Me geolocation with nearest sanctuary finder, and legacy locale route redirects (`/en`, `/ml`, `/ar` → `/`).
  - *Files touched*: `src/components/sufi/MapControls.tsx`, `src/components/sufi/SanctuaryMap.tsx`, `src/lib/maplibre.ts`, `src/routes/index.tsx`, `src/routes/$.tsx`, `vercel.json`.
- **2026-11-10 00:40**: Sourced `sufi-sanctuary-map` as master, backed up Next.js code to `backup/nextjs-main`, and deployed to Vercel production.
  - *Files touched*: Full repo mirror.
