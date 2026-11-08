# PROJECT_STATE.md — Living State of Sufi Map

## Current Status
- Step 5 complete. Badges of stewardship (*Musafir*, *Misbah*, *Hadiyya*, *Rafeeq*, *Nazir*), rotating wisdom & kindness quotation banner (Quran 16:125, Bukhari 69, Hikam #26), admin quote manager, and Nazir area custodian appointment dialog are built and tested. Ready for Step 6 review.

## Done
- Initialized Git repository and set safe directory rules.
- Created `AGENTS.md` and `PROJECT_STATE.md` with 30-entry rollover logging protocol and design tokens.
- Scaffolded Next.js App Router with Sahn design tokens, typography, and `next-intl` (en, ml, ar RTL).
- Configured shadcn MCP and installed UI primitives.
- Built bare home page with bottom nav and thumb-zone actions.
- Created `supabase/migrations/20261108000001_initial_sufi_map_schema.sql` with PostGIS, GIST spatial indexes, trilingual columns, living Sufi consent constraint (`check_living_person_consent`), extensible `metadata` fields, and strict RLS policies on all 8 tables.
- Created `supabase/migrations/20261108000002_seed_quotes_and_sample_data.sql` with verified Quran/Hadith/Hikam quotes, badges (*Musafir*, *Misbah*, *Hadiyya*, *Rafeeq*, *Nazir*), and explicit `[SAMPLE]` data for West Malappuram.
- Created `supabase/migrations/20261108000003_storage_bucket_and_policies.sql` establishing the `place-photos` Supabase Storage bucket with 5MB upload limit, public read, authenticated insert, and moderator delete policies.
- Built MapLibre GL JS map home (`MapContainer.tsx`, `MapHomeClient.tsx`), responsive thumb-zone `PlaceBottomSheet.tsx`, Place detail page (`/places/[id]`), Person page (`/persons/[id]`), and Gatherings list (`/gatherings`).
- Built Supabase Auth modal and Profile screen (`AuthDialog.tsx`, `/me`) supporting contributor signup, sign-in, session detection, and badge progress preview.
- Built photo uploader (`PhotoUploader.tsx`) with image validation, local preview fallback, and Supabase Storage integration.
- Built multi-tab contributor submission portal (`ContributeForm.tsx`, `/contribute`) with mandatory attribution validation, living Sufi consent verification, and pending status assignment.
- Built moderation review queue (`ModerationQueue.tsx`, `/admin`) allowing moderators to verify sources, approve submissions into public visibility, or reject with mandatory explanatory notes.
- Installed `@shadcn/progress` primitive via MCP and shadcn CLI.
- Built `RotatingQuote.tsx` cycling through classical Arabic quotations with Amiri font, English translations, hover-pause, and manual controls.
- Built `BadgeProgressCard.tsx` with progress bars for Musafir, Misbah, Hadiyya, Rafeeq, and Nazir badges, explicitly disclaiming spiritual rank and rewarding verified contributions only.
- Built `QuoteManager.tsx` and `NazirGrantDialog.tsx` inside `AdminDashboard.tsx` for managing quotations and appointing area custodians.
- Verified production build and static page generation across all routes (`npm run build`).

## In Progress
- Awaiting user review of Step 5 before proceeding to Step 6.

## Next Up
- **Step 6**: Multilingual and RTL polish, accessibility audits, SEO/metadata fine-tuning, and Vercel deployment preparation.

## Decisions
- **2026-11-08**: Standardized on Next.js 14 App Router with `next-intl` localized route grouping `[locale]` for English, Malayalam, and Arabic with RTL layout support.
- **2026-11-08**: Configured "Sahn" aesthetic: `#FAF9F4` canvas, `#FFFFFF` cards, `#1F5C3A` primary green, `#E4E2D8` borders, and 14px (`0.875rem`) border-radius for cards, dialogs, and interactive buttons.
- **2026-11-08**: Explicit everyday naming for badges (*Musafir, Misbah, Hadiyya, Rafeeq, Nazir*) to ensure humble community stewardship without claiming or suggesting spiritual ranks.
- **2026-11-08**: Multi-quote rotating banner with Amiri font and pause-on-hover to create a contemplative, sanctuary atmosphere without distracting motion.

## Open Questions
- Specific tile provider choice between OpenStreetMap standard raster tiles vs free Protomaps/Carto CDN tiles for MapLibre GL in Phase 1 — currently functioning cleanly with OpenStreetMap tiles.

## Changelog
- **2026-11-08**: Completed Step 5. Built RotatingQuote component, BadgeProgressCard with progress tracking, QuoteManager and Nazir appointment dialog for administrators, and integrated into contribute and profile views.
  - *Files touched*: `src/components/contribute/RotatingQuote.tsx`, `src/components/badges/BadgeProgressCard.tsx`, `src/components/admin/QuoteManager.tsx`, `src/components/admin/NazirGrantDialog.tsx`, `src/components/admin/AdminDashboard.tsx`, `src/app/[locale]/contribute/page.tsx`, `src/app/[locale]/admin/page.tsx`, `src/app/[locale]/me/page.tsx`, `src/components/ui/progress.tsx`, `PROJECT_STATE.md`.
  - *Next*: Step 6 — Multilingual and RTL polish, accessibility, and Vercel deployment.
- **2026-11-08**: Completed Step 4. Supabase Auth signup/signin dialog, Me / Profile page, Supabase Storage `place-photos` bucket migration, photo uploader component, multi-tab contribution forms with mandatory attribution & living consent checks, and moderator review queue with approve/reject workflow.
  - *Files touched*: `supabase/migrations/20261108000003_storage_bucket_and_policies.sql`, `src/components/auth/AuthDialog.tsx`, `src/components/contribute/PhotoUploader.tsx`, `src/components/contribute/ContributeForm.tsx`, `src/components/admin/ModerationQueue.tsx`, `src/app/[locale]/contribute/page.tsx`, `src/app/[locale]/admin/page.tsx`, `src/app/[locale]/me/page.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/label.tsx`, `messages/en.json`, `messages/ml.json`, `messages/ar.json`, `PROJECT_STATE.md`.
  - *Next*: Step 5 — Badges, the contributor page, and the quotes.
- **2026-11-08**: Completed Step 3. Built MapLibre GL map home, sanctuary pin markers, responsive bottom sheet, Place detail page, Person page with living consent verification & removal request action, and Gatherings listing.
  - *Files touched*: `src/components/map/MapContainer.tsx`, `src/components/sheet/PlaceBottomSheet.tsx`, `src/components/map/MapHomeClient.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/places/[id]/page.tsx`, `src/app/[locale]/persons/[id]/page.tsx`, `src/app/[locale]/gatherings/page.tsx`, `messages/en.json`, `messages/ml.json`, `messages/ar.json`, `PROJECT_STATE.md`.
  - *Next*: Step 4 — Auth, contribute flows, photo upload, and the moderation queue.
- **2026-11-08**: Completed Step 2. Supabase schema migrations, PostGIS geometry fields, GIST indexes, full RLS coverage, living consent constraint, badges table, 3 verified quotes, sample seed data for West Malappuram, and TypeScript client integration.
  - *Files touched*: `supabase/migrations/20261108000001_initial_sufi_map_schema.sql`, `supabase/migrations/20261108000002_seed_quotes_and_sample_data.sql`, `src/types/database.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/sample-data.ts`, `PROJECT_STATE.md`.
  - *Next*: Step 3 — Map home, place page, and person page.
- **2026-11-08**: Completed Step 1. Scaffolding, Sahn design tokens, font pairings (Inter, Playfair Display, Amiri), next-intl trilingual routing (en/ml/ar RTL), shadcn/ui primitives via MCP, Supabase migrations setup, bare home page, and initial Git commit.
  - *Files touched*: `AGENTS.md`, `PROJECT_STATE.md`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `components.json`, `src/lib/utils.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`, `messages/en.json`, `messages/ml.json`, `messages/ar.json`, `src/components/common/LocaleSwitcher.tsx`, `src/components/navigation/BottomNav.tsx`, `src/components/ui/*`, `.env.example`, `.gitignore`, `supabase/migrations/.gitkeep`, `docs/archive/README.md`.
  - *Next*: Step 2 — Supabase schema, PostGIS, RLS, and sample seed data.
