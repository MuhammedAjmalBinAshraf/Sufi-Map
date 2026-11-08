# PROJECT_STATE.md — Living State of Sufi Map

## Current Status
- Step 3 complete. MapLibre GL interactive map home, responsive bottom sheet, category filtering, search, Place page with etiquette/events/citations, and Person page with living consent verification & "Request Edit or Removal" protection are fully built and tested. Ready for Step 4 review.

## Done
- Initialized Git repository and set safe directory rules.
- Created `AGENTS.md` and `PROJECT_STATE.md` with 30-entry rollover logging protocol and design tokens.
- Scaffolded Next.js App Router with Sahn design tokens, typography, and `next-intl` (en, ml, ar RTL).
- Configured shadcn MCP and installed UI primitives.
- Built bare home page with bottom nav and thumb-zone actions.
- Created `supabase/migrations/20261108000001_initial_sufi_map_schema.sql` with PostGIS, GIST spatial indexes, trilingual columns, living Sufi consent constraint (`check_living_person_consent`), extensible `metadata` fields, and strict RLS policies on all 8 tables.
- Created `supabase/migrations/20261108000002_seed_quotes_and_sample_data.sql` with verified Quran/Hadith/Hikam quotes, badges (*Musafir*, *Misbah*, *Hadiyya*, *Rafeeq*, *Nazir*), and explicit `[SAMPLE]` data for West Malappuram.
- Built MapLibre GL JS integration (`MapContainer.tsx`) with OpenStreetMap raster tiles, custom SVG sanctuary pins, dynamic fly-to camera animations, and `prefers-reduced-motion` compliance.
- Built responsive thumb-zone `PlaceBottomSheet.tsx` with trilingual titles, primary Directions CTA in sanctuary green, ghost Save with localStorage persistence, and Suggest Edit action.
- Built `MapHomeClient.tsx` coordinating live trilingual search, category filter chips (*All, Maqams, Dargahs, Zawiyas, Gatherings*), and floating `+` contribute button.
- Built full Place Page (`/[locale]/places/[id]`) with visiting etiquette, recurring events, verified historical citations, and coordinates.
- Built full Person Page (`/[locale]/persons/[id]`) with public presence schedule, living scholar consent badge, mandatory **"Request Edit or Removal"** button, and ethical disclaimer against private residences.
- Built Gatherings overview page (`/[locale]/gatherings`).
- Verified production build and static page generation (`npm run build`).

## In Progress
- Awaiting user review of Step 3 before proceeding to Step 4.

## Next Up
- **Step 4**: Supabase Auth signup/login, contributor submission flows (add place, gathering, person, upload photos, suggest correction), and moderator/admin review queue.

## Decisions
- **2026-11-08**: Standardized on Next.js 14 App Router with `next-intl` localized route grouping `[locale]` for English, Malayalam, and Arabic with RTL layout support.
- **2026-11-08**: Configured "Sahn" aesthetic: `#FAF9F4` canvas, `#FFFFFF` cards, `#1F5C3A` primary green, `#E4E2D8` borders, and 14px (`0.875rem`) border-radius for cards, dialogs, and interactive buttons.
- **2026-11-08**: Dynamic client-side import with `ssr: false` for MapLibre GL JS to prevent server-side DOM reference errors while maintaining SSR benefits for all surrounding sanctuary metadata.
- **2026-11-08**: Ethical living person privacy enforcement: rendered a prominent red-accented "Request Edit or Removal" button on living persons and explicitly banned private home addresses in all public presence listings.
- **2026-11-08**: Local storage caching for user bookmarks to allow instantaneous place saving on mobile outdoor connections prior to Supabase Auth login.

## Open Questions
- Specific tile provider choice between OpenStreetMap standard raster tiles vs free Protomaps/Carto CDN tiles for MapLibre GL in Phase 1 — currently functioning cleanly with OpenStreetMap tiles.

## Changelog
- **2026-11-08**: Completed Step 3. Built MapLibre GL map home, sanctuary pin markers, responsive bottom sheet, Place detail page, Person page with living consent verification & removal request action, and Gatherings listing.
  - *Files touched*: `src/components/map/MapContainer.tsx`, `src/components/sheet/PlaceBottomSheet.tsx`, `src/components/map/MapHomeClient.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/places/[id]/page.tsx`, `src/app/[locale]/persons/[id]/page.tsx`, `src/app/[locale]/gatherings/page.tsx`, `messages/en.json`, `messages/ml.json`, `messages/ar.json`, `PROJECT_STATE.md`.
  - *Next*: Step 4 — Auth, contribute flows, photo upload, and the moderation queue.
- **2026-11-08**: Completed Step 2. Supabase schema migrations, PostGIS geometry fields, GIST indexes, full RLS coverage, living consent constraint, badges table, 3 verified quotes, sample seed data for West Malappuram, and TypeScript client integration.
  - *Files touched*: `supabase/migrations/20261108000001_initial_sufi_map_schema.sql`, `supabase/migrations/20261108000002_seed_quotes_and_sample_data.sql`, `src/types/database.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/sample-data.ts`, `PROJECT_STATE.md`.
  - *Next*: Step 3 — Map home, place page, and person page.
- **2026-11-08**: Completed Step 1. Scaffolding, Sahn design tokens, font pairings (Inter, Playfair Display, Amiri), next-intl trilingual routing (en/ml/ar RTL), shadcn/ui primitives via MCP, Supabase migrations setup, bare home page, and initial Git commit.
  - *Files touched*: `AGENTS.md`, `PROJECT_STATE.md`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `components.json`, `src/lib/utils.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`, `messages/en.json`, `messages/ml.json`, `messages/ar.json`, `src/components/common/LocaleSwitcher.tsx`, `src/components/navigation/BottomNav.tsx`, `src/components/ui/*`, `.env.example`, `.gitignore`, `supabase/migrations/.gitkeep`, `docs/archive/README.md`.
  - *Next*: Step 2 — Supabase schema, PostGIS, RLS, and sample seed data.
