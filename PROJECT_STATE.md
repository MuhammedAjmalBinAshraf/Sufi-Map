# PROJECT_STATE.md — Living State of Sufi Map

## Current Status
- Lovable chat requests (draggable 3-state bottom sheet, mobile font scale, quote fade on map explore) fully synced and deployed.
- Production live at https://sufi-map.vercel.app (deployment dpl_Cw3rQ5pcQgmy6DXFVJWLM1Cn3DBH).
- 100% feature and design parity with Lovable sandbox.
- Working tree clean, synced to GitHub master.

## Done
- Initialized Git repository and set safe directory rules.
- Created `AGENTS.md` and `PROJECT_STATE.md` with 30-entry rollover logging protocol and design tokens.
- Scaffolded Next.js App Router with Sahn design tokens, typography, and `next-intl` (en, ml, ar RTL).
- Configured shadcn MCP and installed UI primitives (`button`, `card`, `badge`, `sheet`, `input`, `dialog`, `dropdown-menu`, `tabs`, `textarea`, `label`, `progress`).
- Created `supabase/migrations/20261108000001_initial_sufi_map_schema.sql` with PostGIS, GIST spatial indexes, trilingual columns, living Sufi consent constraint (`check_living_person_consent`), extensible `metadata` fields, and strict RLS policies on all 8 tables.
- Created `supabase/migrations/20261108000002_seed_quotes_and_sample_data.sql` with verified Quran/Hadith/Hikam quotes, badges (*Musafir*, *Misbah*, *Hadiyya*, *Rafeeq*, *Nazir*), and explicit `[SAMPLE]` data for West Malappuram.
- Created `supabase/migrations/20261108000003_storage_bucket_and_policies.sql` establishing the `place-photos` Supabase Storage bucket with 5MB upload limit, public read, authenticated insert, and moderator delete policies.
- Built MapLibre GL JS map home (`MapContainer.tsx`, `MapHomeClient.tsx`), responsive thumb-zone `PlaceBottomSheet.tsx`, Place detail page (`/places/[id]`), Person page (`/persons/[id]`), and Gatherings list (`/gatherings`).
- Built Supabase Auth modal and Profile screen (`AuthDialog.tsx`, `/me`) supporting contributor signup, sign-in, session detection, and badge progress preview.
- Built photo uploader (`PhotoUploader.tsx`) with image validation, local preview fallback, and Supabase Storage integration.
- Built multi-tab contributor submission portal (`ContributeForm.tsx`, `/contribute`) with mandatory attribution validation, living Sufi consent verification, and pending status assignment.
- Built moderation review queue (`ModerationQueue.tsx`, `/admin`) allowing moderators to verify sources, approve submissions into public visibility, or reject with mandatory explanatory notes.
- Built `RotatingQuote.tsx` cycling through classical Arabic quotations with Amiri font, English translations, hover-pause, and manual controls.
- Built `BadgeProgressCard.tsx` with progress bars for Musafir, Misbah, Hadiyya, Rafeeq, and Nazir badges, explicitly disclaiming spiritual rank and rewarding verified contributions only.
- Built `QuoteManager.tsx` and `NazirGrantDialog.tsx` inside `AdminDashboard.tsx` for managing quotations and appointing area custodians.
- Polished multilingual and bidirectional RTL layout support with localized metadata, language alternates, and Arabic Amiri / Malayalam fonts.
- Built Web App Manifest (`manifest.json`) and SVG sanctuary icon (`public/icon.svg`).
- Created Vercel deployment configuration (`vercel.json`) and production setup guide (`docs/DEPLOYMENT.md`).
- Implemented responsive split-screen desktop layout (`MapHomeClient.tsx`) with 420px docked sanctuary sidebar, search, kind filter chips, and interactive list cards on the left, alongside full-bleed map on the right.
- Created `DesktopHeader.tsx` navbar with sanctuary branding, active route highlighting, search bar, and locale switcher.
- Diagnosed and fixed map visibility issue: wrapped `MapContainer` with `absolute inset-0`, added `ResizeObserver` for dynamic resizing, and switched default basemap to CartoDB Voyager tiles matching Sahn warm stone aesthetics.
- Created `MapControls.tsx` floating control panel with zoom buttons, compass bearing reset, "Locate Me" geolocation, 4-tier basemap layer switcher (Sahn Warm, Standard OSM, Satellite Aerial, Topo Terrain), and quick jump region presets (Tirurangadi, Ponnani, Kondotty, Parappanangadi).
- Created `CoordinatePickerModal.tsx` draggable map pin coordinate picker and integrated "Pick on Map" button directly into `ContributeForm.tsx`.
- Updated Place (`/places/[id]`), Person (`/persons/[id]`), Gatherings (`/gatherings`), Contribute (`/contribute`), Me (`/me`), and Admin (`/admin`) pages to responsive two-column desktop layouts.
- Verified production build and static page generation across all routes (`npm run build`).
- Deployed Next.js project to Vercel (`sufi-map.vercel.app`) with custom production aliases.
- Configured Vercel production environment variables for Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_MAP_API_KEY`).
- Configured Supabase Model Context Protocol (MCP) server scoped to project `lykrakuypnfbnjzfhwhj` using Personal Access Token.
- Executed full database migration (Schema, Badges/Quotes/Sample Data, Storage Bucket & RLS) directly via Supabase MCP.
- Connected Vercel production deployment to GitHub repository for automated continuous deployment (CI/CD).

## In Progress
- Vercel redeployment triggered by commit `7603a48`.

## Next Up
- Verify redesigned pins, card-lift, quote crossfade on live https://sufi-map.vercel.app.
- Configure Supabase Auth redirect URLs in Supabase Dashboard (add `https://sufi-map.vercel.app/**`).
- Continue Lovable iteration: mobile bottom sheet polish, smooth page transitions, RTL pin badge direction.

## Decisions
- **2026-11-08**: Standardized on Next.js 14 App Router with `next-intl` localized route grouping `[locale]` for English, Malayalam, and Arabic with RTL layout support.
- **2026-11-08**: Configured "Sahn" aesthetic: `#FAF9F4` canvas, `#FFFFFF` cards, `#1F5C3A` primary green, `#E4E2D8` borders, and 14px (`0.875rem`) border-radius for cards, dialogs, and interactive buttons.
- **2026-11-08**: Database-enforced consent constraint: added SQL `CHECK` constraint ensuring no living person record can ever reach `status = 'approved'` unless `consent_status = 'granted'`.
- **2026-11-08**: Form-level validation of mandatory attribution: blocked form submission unless at least one verified historical citation or elder name is provided.
- **2026-11-08**: Rejection notes mandate: required explanatory review notes when rejecting a community submission to maintain transparency and hospitality.
- **2026-11-08**: Explicit everyday naming for badges (*Musafir, Misbah, Hadiyya, Rafeeq, Nazir*) to ensure humble community stewardship without claiming or suggesting spiritual ranks.
- **2026-11-08**: Multi-quote rotating banner with Amiri font and pause-on-hover to create a contemplative, sanctuary atmosphere without distracting motion.
- **2026-11-08**: Progressive web manifest with theme color `#FAF9F4` and mobile standalone display for clear visibility under outdoor Kerala daylight.
- **2026-11-09**: Lovable → GitHub → Vercel CI/CD workflow mandate: codified in AGENTS.md that all changes, design improvements, or feature experiments tested in Lovable must be systematically ported to Next.js, committed to Git, and pushed to GitHub so that Vercel automatically deploys them to production without leaving orphaned changes in Lovable.
- **2026-11-09**: CartoDB Voyager default basemap: replaced plain OSM raster tiles with CartoDB Voyager tiles to guarantee CORS reliability across browsers and harmonize with the Sahn warm stone palette.
- **2026-11-09**: Split-screen desktop architecture: docked 420px left sidebar for listings and search, giving the interactive map maximum canvas space while retaining mobile bottom sheet on small screens.
- **2026-11-09**: Modal coordinate picker for contributors: enabled visual map coordinate selection with draggable marker to ensure accurate latitude/longitude entry without manual geo-lookup.
- **2026-11-09**: Configured Supabase MCP integration using user PAT scoped to project `lykrakuypnfbnjzfhwhj` for programmatic DDL, RLS, and data management.

## Open Questions
- None. Phase 1 web, database, storage, and deployment are live.

## Changelog
- **2026-11-09 23:56**: Created and pushed dedicated `lovable` branch to GitHub remote (`origin/lovable`) containing all Lovable changes, and documented direct Lovable GitHub connector setup for automated continuous sync.
  - *Files touched*: `PROJECT_STATE.md`.
  - *Next*: Connect Lovable GitHub connector on Lovable dashboard if automatic commit-on-chat is desired.
- **2026-11-09 23:48**: Codified mandatory Lovable → GitHub → Vercel deployment pipeline in `AGENTS.md` and `PROJECT_STATE.md`. All future experiments and direct chat changes in Lovable will be committed to `origin/master` so GitHub automates Vercel production deployments.
  - *Files touched*: `AGENTS.md`, `PROJECT_STATE.md`.
  - *Next*: Continue feature development adhering strictly to this pipeline.
- **2026-11-09 23:43**: Integrated user direct chat edits from Lovable sandbox. Added 3-state draggable bottom sheet (`peek` 64px, `half` 42dvh, `full` 82dvh) with gesture flick physics (`sheet.ts`, `MobileSheet.tsx`); added quote banner auto-fade during map panning/zooming with 5s idle return timer; and applied mobile font scale 93.75% (<768px) with 16px input threshold. Pushed `12480ac` to GitHub and promoted to Vercel production.
  - *Files touched*: `src/lib/sheet.ts`, `src/components/sufi/MobileSheet.tsx`, `src/components/map/MapContainer.tsx`, `src/components/map/MapHomeClient.tsx`, `src/app/globals.css`, `PROJECT_STATE.md`.
  - *Next*: All Lovable chat edits live in production.
- **2026-11-09 23:31**: Full UI parity with Lovable sanctuary experience deployed to Vercel production. Built in-sidebar `SiteDetail` with back navigation, schedule pills, OSM directions, save toggling, and correction dialog; built `BadgesSheet` slide-out drawer with Arabic badges; added sidebar collapse/expand controls; added floating `RotatingQuote` banner centered over map canvas; added segmented `LocaleSwitcher` toggle; and added `parchment` badge variant. Verified production build and aliased to `sufi-map.vercel.app`.
  - *Files touched*: `src/app/[locale]/page.tsx`, `src/components/map/MapHomeClient.tsx`, `src/components/sufi/SiteDetail.tsx`, `src/components/sufi/BadgesSheet.tsx`, `src/components/common/LocaleSwitcher.tsx`, `src/components/ui/badge.tsx`, `PROJECT_STATE.md`.
  - *Next*: Test live on desktop and mobile viewports.
- **2026-11-09 23:14**: Added `stackblitz` MCP server (`stackblitz-mcp`) to `mcp_config.json` for reading, listing, and resolving projects from StackBlitz / Bolt.
  - *Files touched*: `C:\Users\PAVALLION\.gemini\config\mcp_config.json`, `PROJECT_STATE.md`.
  - *Next*: Test StackBlitz project resolution and Bolt workflow.
- **2026-11-09 23:10**: Removed Cursor MCP configs (`~/.cursor/mcp.json`, `.cursor/`, `.cursor/rules`, `.gitignore` references). Documented Bolt.new integration and StackBlitz MCP capabilities.
  - *Files touched*: `.gitignore`, `PROJECT_STATE.md`.
  - *Next*: Configure Bolt connectors or StackBlitz MCP as needed.
- **2026-11-09 22:56**: Ported Sahn design system refinements from Lovable to Next.js production codebase. Upgraded map pins to 40px rounded-[14px] buttons with M/Z/D/G category letter badges, hover-lift, and selected dark-ink state. Added `card-lift`, `courtyard-pattern`, `font-arabic-script`, `shadow-float/lift`, `quote-dot` pill animations, and `page-enter` fade-in to globals.css. Rewrote `RotatingQuote` with crossfade grid, hover-pause indicator, and expandable dot indicators. Updated PlaceBottomSheet to use `shadow-float` and OSM directions. Added `fade-in`/`quote-crossfade` keyframes to tailwind.config.ts. Committed `7603a48` and pushed — Vercel auto-deploying.
  - *Files touched*: `src/app/globals.css`, `tailwind.config.ts`, `src/components/map/MapContainer.tsx`, `src/components/contribute/RotatingQuote.tsx`, `src/components/map/MapHomeClient.tsx`, `src/components/sheet/PlaceBottomSheet.tsx`, `PROJECT_STATE.md`.
  - *Next*: Verify live at https://sufi-map.vercel.app. Add Supabase Auth redirect URL.
- **2026-11-09 22:15**: Initialized Lovable project (`fe2cf5d9-005b-4a8e-96a0-c02b4a4afc06`) via Lovable MCP. Configured persistent "Sahn" design system knowledge (palette tokens, 14px radius, Playfair Display/Inter/Amiri typography, micro-interactions, mobile bottom sheet & desktop 420px dock). Enforced token minimization and clean shadcn/ui modular component structure.
  - *Files touched*: `PROJECT_STATE.md`.
  - *Next*: Inspect generated Lovable components and integrate refinements into production codebase.
- **2026-11-09 21:33**: Fixed zoom limit issue where map displayed "map data not available" and turned blank green. Upgraded Carto basemap to load official MapLibre vector style (`https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=...`) and enforced `maxZoom: 19` / source `maxzoom` bounds with automatic overzooming across raster styles and modal coordinate picker.
  - *Files touched*: `src/components/map/MapContainer.tsx`, `src/components/map/CoordinatePickerModal.tsx`, `PROJECT_STATE.md`.
  - *Next*: Verify continuous zoom in live production site.
- **2026-11-09 21:18**: Integrated Carto map API key (`NEXT_PUBLIC_MAP_API_KEY`) into `MapContainer` and `CoordinatePickerModal` with dynamic `getEffectiveTileUrl` helper, supporting authenticated Carto tiles and custom style URLs. Verified local production build and pushed to GitHub for automated Vercel deployment.
  - *Files touched*: `src/components/map/MapContainer.tsx`, `src/components/map/CoordinatePickerModal.tsx`, `PROJECT_STATE.md`.
  - *Next*: Test authenticated map tile performance in production.
- **2026-11-09 21:00**: Linked Vercel project directly to GitHub repository (`MuhammedAjmalBinAshraf/Sufi-Map`) enabling automated CI/CD builds on push to `master`.
  - *Files touched*: `PROJECT_STATE.md`.
  - *Next*: Phase 1 production testing and community contributor validation.
- **2026-11-09 20:43**: Connected repository to remote GitHub repository `MuhammedAjmalBinAshraf/Sufi-Map`. Cleaned `.gitignore` (ignoring `.vercel` and `supabase/.temp/`), committed full migration scripts and lockfile updates, and pushed `master` branch with sanitized remote URLs.
  - *Files touched*: `.gitignore`, `package.json`, `package-lock.json`, `supabase/sufi_map_full_migration.sql`, `PROJECT_STATE.md`.
  - *Next*: Link Vercel project to GitHub repository for automated CI/CD if desired.
- **2026-11-09 20:25**: Applied full Supabase migration via Supabase MCP server (`apply_migration`): PostGIS extensions, tables (`profiles`, `places`, `persons`, `gatherings`, `corrections`, `quotes`, `badges`, `user_badges`), comprehensive RLS policies, seed quotes and sample places/persons/gatherings, and `place-photos` storage bucket with access policies. Verified database counts and storage configuration.
  - *Files touched*: `PROJECT_STATE.md`.
  - *Next*: Test auth workflows and live app integration.
- **2026-11-09**: Added environment variable configuration for custom map providers (`NEXT_PUBLIC_MAP_API_KEY` and `NEXT_PUBLIC_MAP_STYLE_URL`) in `MapContainer.tsx`, `.env.example`, and created `.env.local` for local secrets.
  - *Files touched*: `.env.example`, `src/components/map/MapContainer.tsx`, `PROJECT_STATE.md`.
  - *Next*: Connect provider tile/style URL once confirmed by user.
- **2026-11-09**: Completed Web Design & Map Setup. Built responsive desktop split-screen layout, desktop header navbar, floating map controls with basemap switcher, geolocation, region presets, and coordinate picker modal integrated into contribute form. Fixed map visibility with ResizeObserver and CartoDB Voyager warm basemap. Polished Place, Person, Gatherings, Contribute, Me, and Admin pages for desktop viewports.
  - *Files touched*: `src/app/globals.css`, `src/components/navigation/DesktopHeader.tsx`, `src/components/map/MapControls.tsx`, `src/components/map/CoordinatePickerModal.tsx`, `src/components/map/MapContainer.tsx`, `src/components/map/MapHomeClient.tsx`, `src/components/contribute/ContributeForm.tsx`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/places/[id]/page.tsx`, `src/app/[locale]/persons/[id]/page.tsx`, `src/app/[locale]/gatherings/page.tsx`, `src/app/[locale]/contribute/page.tsx`, `src/app/[locale]/me/page.tsx`, `src/app/[locale]/admin/page.tsx`, `src/components/navigation/BottomNav.tsx`, `PROJECT_STATE.md`.
  - *Next*: Live verification and user feedback.
- **2026-11-09**: Added environment variable configuration for custom map providers (`NEXT_PUBLIC_MAP_API_KEY` and `NEXT_PUBLIC_MAP_STYLE_URL`) in `MapContainer.tsx`, `.env.example`, and created `.env.local` for local secrets.
  - *Files touched*: `.env.example`, `src/components/map/MapContainer.tsx`, `PROJECT_STATE.md`.
  - *Next*: Connect provider tile/style URL once confirmed by user.
- **2026-11-09**: Completed Web Design & Map Setup. Built responsive desktop split-screen layout, desktop header navbar, floating map controls with basemap switcher, geolocation, region presets, and coordinate picker modal integrated into contribute form. Fixed map visibility with ResizeObserver and CartoDB Voyager warm basemap. Polished Place, Person, Gatherings, Contribute, Me, and Admin pages for desktop viewports.
  - *Files touched*: `src/app/globals.css`, `src/components/navigation/DesktopHeader.tsx`, `src/components/map/MapControls.tsx`, `src/components/map/CoordinatePickerModal.tsx`, `src/components/map/MapContainer.tsx`, `src/components/map/MapHomeClient.tsx`, `src/components/contribute/ContributeForm.tsx`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/places/[id]/page.tsx`, `src/app/[locale]/persons/[id]/page.tsx`, `src/app/[locale]/gatherings/page.tsx`, `src/app/[locale]/contribute/page.tsx`, `src/app/[locale]/me/page.tsx`, `src/app/[locale]/admin/page.tsx`, `src/components/navigation/BottomNav.tsx`, `PROJECT_STATE.md`.
  - *Next*: Live verification and user feedback.
- **2026-11-08**: Completed Step 6. Multilingual & RTL polish, dynamic metadata per locale, web app manifest, security headers in vercel.json, deployment guide, and final production build verification.
  - *Files touched*: `src/app/[locale]/layout.tsx`, `public/manifest.json`, `public/icon.svg`, `vercel.json`, `docs/DEPLOYMENT.md`, `PROJECT_STATE.md`.
  - *Next*: Connect live credentials and deploy.
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
