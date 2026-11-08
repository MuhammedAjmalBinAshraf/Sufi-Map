# PROJECT_STATE.md — Living State of Sufi Map

## Current Status
- Step 1 complete. Next.js App Router scaffolded with TypeScript, Tailwind CSS, Sahn design tokens, next-intl (en, ml, ar RTL), shadcn/ui primitives via MCP, Supabase migration tracking, and Git initialized. Awaiting user review to begin Step 2.

## Done
- Initialized Git repository and set safe directory rules.
- Created `AGENTS.md` specifying architecture, data ethics, "Sahn" design tokens, and logging protocols (including 30-entry rollover rule).
- Created `docs/archive/` directory for long-term changelog archival.
- Created `components.json` and integrated shadcn MCP server.
- Installed shadcn UI primitives (`button`, `card`, `badge`, `sheet`, `input`, `dialog`, `dropdown-menu`, `tabs`) with 14px radius.
- Configured "Sahn" design tokens in `globals.css` and `tailwind.config.ts` (sanctuary green `#1F5C3A`, canvas `#FAF9F4`, surface `#FFFFFF`, border `#E4E2D8`).
- Integrated typography via `next/font/google`: Inter (body), Playfair Display (headings), Amiri (Arabic script).
- Configured `next-intl` multilingual routing and translations for English (`en`), Malayalam (`ml`), and Arabic (`ar`) with full RTL support and a `LocaleSwitcher`.
- Created bare home page demonstrating Sahn theme, search bar, category chips, sanctuary map canvas preview, Mampuram Maqam sample pin, thumb-zone place bottom sheet, and fixed bottom navigation (`Map`, `Gatherings`, `Contribute`, `Me`).
- Created `/supabase/migrations/` and `.env.example`.
- Verified production build successfully (`next build`).

## In Progress
- Awaiting user review of Step 1 deliverables.

## Next Up
- **Step 2**: Supabase database schema, PostGIS extension, Row Level Security (RLS) policies, and verified sample seed data.

## Decisions
- **2026-11-08**: Standardized on Next.js 14 App Router with `next-intl` localized route grouping `[locale]` for English, Malayalam, and Arabic with RTL layout support.
- **2026-11-08**: Configured "Sahn" aesthetic: `#FAF9F4` canvas, `#FFFFFF` cards, `#1F5C3A` primary green, `#E4E2D8` borders, and 14px (`0.875rem`) border-radius for cards, dialogs, and interactive buttons.
- **2026-11-08**: Installed standard shadcn components via shadcn MCP and CLI rather than custom-rolled primitives.
- **2026-11-08**: Strict isolation of secrets: `.env.example` committed with blank placeholders; database migrations committed exclusively under `/supabase/migrations`.

## Open Questions
- Specific tile provider choice between OpenStreetMap standard raster tiles vs free Protomaps/Carto CDN tiles for MapLibre GL in Phase 1.
- Initial list of 3 seed quotes verification against classical sources (Quran 16:125, Sahih Bukhari hadith, and Ibn 'Ata'illah's Hikam).

## Changelog
- **2026-11-08**: Completed Step 1. Scaffolding, Sahn design tokens, font pairings (Inter, Playfair Display, Amiri), next-intl trilingual routing (en/ml/ar RTL), shadcn/ui primitives via MCP, Supabase migrations setup, bare home page, and initial Git commit.
  - *Files touched*: `AGENTS.md`, `PROJECT_STATE.md`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `components.json`, `src/lib/utils.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`, `messages/en.json`, `messages/ml.json`, `messages/ar.json`, `src/components/common/LocaleSwitcher.tsx`, `src/components/navigation/BottomNav.tsx`, `src/components/ui/*`, `.env.example`, `.gitignore`, `supabase/migrations/.gitkeep`, `docs/archive/README.md`.
  - *Next*: Step 2 — Supabase schema, PostGIS, RLS, and sample seed data.
