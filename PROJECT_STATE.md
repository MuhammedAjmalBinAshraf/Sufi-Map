# PROJECT_STATE.md — Living State of Sufi Map

## Current Status
- Step 2 complete. Supabase PostgreSQL schema with PostGIS spatial extension, Row Level Security (RLS) policies on all tables, badge definitions, 3 verified quotes, ethical constraints, and [SAMPLE] seed data committed. Ready for Step 3 review.

## Done
- Initialized Git repository and set safe directory rules.
- Created `AGENTS.md` and `PROJECT_STATE.md` with 30-entry rollover logging protocol and design tokens.
- Scaffolded Next.js App Router with Sahn design tokens, typography, and `next-intl` (en, ml, ar RTL).
- Configured shadcn MCP and installed UI primitives.
- Built bare home page with bottom nav and thumb-zone actions.
- Created `supabase/migrations/20261108000001_initial_sufi_map_schema.sql` with PostGIS, GIST spatial indexes, trilingual columns, living Sufi consent constraint (`check_living_person_consent`), extensible `metadata` fields, and strict RLS policies on all 8 tables.
- Created `supabase/migrations/20261108000002_seed_quotes_and_sample_data.sql` with verified Quran/Hadith/Hikam quotes, badges (*Musafir*, *Misbah*, *Hadiyya*, *Rafeeq*, *Nazir*), and explicit `[SAMPLE]` data for West Malappuram.
- Created TypeScript schema models in `src/types/database.ts`, Supabase SSR clients in `src/lib/supabase/`, and `src/lib/sample-data.ts`.
- Verified production build and type checking (`npm run build`).

## In Progress
- Awaiting user review of Step 2 before proceeding to Step 3.

## Next Up
- **Step 3**: Interactive MapLibre GL map home, place details page, and person profile page with public presence schedule.

## Decisions
- **2026-11-08**: Standardized on Next.js 14 App Router with `next-intl` localized route grouping `[locale]` for English, Malayalam, and Arabic with RTL layout support.
- **2026-11-08**: Configured "Sahn" aesthetic: `#FAF9F4` canvas, `#FFFFFF` cards, `#1F5C3A` primary green, `#E4E2D8` borders, and 14px (`0.875rem`) border-radius for cards, dialogs, and interactive buttons.
- **2026-11-08**: Database-enforced consent constraint: added SQL `CHECK` constraint ensuring no living person record can ever reach `status = 'approved'` unless `consent_status = 'granted'`.
- **2026-11-08**: Extensible metadata architecture: included `metadata jsonb default '{}'` on `places`, `persons`, and `gatherings` so future Phase 2 travel/lodging/amenities modules attach without schema rewrites.
- **2026-11-08**: Strict isolation of secrets: `.env.example` committed with blank placeholders; database migrations committed exclusively under `/supabase/migrations`.

## Open Questions
- Specific tile provider choice between OpenStreetMap standard raster tiles vs free Protomaps/Carto CDN tiles for MapLibre GL in Phase 1.
- Initial list of 3 seed quotes verification against classical sources (Quran 16:125, Sahih Bukhari hadith, and Ibn 'Ata'illah's Hikam) — completed and verified in Step 2.

## Changelog
- **2026-11-08**: Completed Step 2. Supabase schema migrations, PostGIS geometry fields, GIST indexes, full RLS coverage, living consent constraint, badges table, 3 verified quotes, sample seed data for West Malappuram, and TypeScript client integration.
  - *Files touched*: `supabase/migrations/20261108000001_initial_sufi_map_schema.sql`, `supabase/migrations/20261108000002_seed_quotes_and_sample_data.sql`, `src/types/database.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/sample-data.ts`, `PROJECT_STATE.md`.
  - *Next*: Step 3 — Map home, place page, and person page.
- **2026-11-08**: Completed Step 1. Scaffolding, Sahn design tokens, font pairings (Inter, Playfair Display, Amiri), next-intl trilingual routing (en/ml/ar RTL), shadcn/ui primitives via MCP, Supabase migrations setup, bare home page, and initial Git commit.
  - *Files touched*: `AGENTS.md`, `PROJECT_STATE.md`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `components.json`, `src/lib/utils.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`, `messages/en.json`, `messages/ml.json`, `messages/ar.json`, `src/components/common/LocaleSwitcher.tsx`, `src/components/navigation/BottomNav.tsx`, `src/components/ui/*`, `.env.example`, `.gitignore`, `supabase/migrations/.gitkeep`, `docs/archive/README.md`.
  - *Next*: Step 2 — Supabase schema, PostGIS, RLS, and sample seed data.
