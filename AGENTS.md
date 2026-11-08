# AGENTS.md — Sufi Map Project Rules

Welcome to the **Sufi Map** codebase. All agentic pair programmers and contributors must strictly adhere to the rules, standards, and workflows outlined in this document.

---

## 1. Project Overview & Scope
**Sufi Map** is a calm, minimal, sanctuary-like web application mapping Sufi dargahs, maqams, and zawiyas, and the public gatherings/presence of living Sufis, starting with West Malappuram, Kerala.

### Phase 1 Scope
1. **Map Home**: Interactive map pins for places, category filters (Maqams, Dargahs, Zawiyas, Gatherings), search, responsive bottom sheet with place summary, Directions and Save buttons.
2. **Place Page**: Trilingual names (`name_en`, `name_ml`, `name_ar`), kind, area, geographic coordinates, photos, short history (2–3 lines), visiting etiquette, recurring events, and verified sources.
3. **Person Page**: Trilingual names, short history, and a public presence schedule (locations and recurring times for majlis/halqa/teaching).
4. **Contributor System**: Supabase Auth signup. Contributors can submit places, gatherings, persons, photos, or suggest corrections. All submissions start as `pending`.
5. **Contributor Portal & Quotes**: Rotating Arabic and English quotations on inviting with wisdom and kindness (`quotes` table). Badges progress card and contribution actions.
6. **Badge System**: Everyday names (no spiritual ranks): *Musafir* (1 approved entry), *Misbah* (5 approved entries with sources), *Hadiyya* (10 approved entries with sources), *Rafeeq* (verified 5 entries by others), *Nazir* (moderator-granted area custodian).
7. **Admin & Moderation**: Review queue with approve/reject notes, Nazir assignments, quote management.

### Explicitly Excluded from Phase 1
- Travel booking, hotels, food/lodging amenities.
- Personal blogs or long hagiographical essays.
- *Schema requirement*: Design Postgres/PostGIS tables so these future modules plug in cleanly without migrations breaking Phase 1 tables.

---

## 2. Technical Stack & Conventions
- **Framework**: Next.js (App Router, TypeScript).
- **Styling**: Tailwind CSS with custom CSS variables mapped to design tokens.
- **Components**: `shadcn/ui`. Always use the shadcn MCP to discover and install components. **Never hand-write any component that shadcn already provides.**
- **Database & Backend**: Supabase (Postgres with PostGIS extension enabled, Supabase Auth, Supabase Storage, and Row Level Security on every table).
- **Database Migrations**: Supabase CLI migrations strictly version-controlled in `/supabase/migrations`.
- **Secrets & Environment**: Never commit secrets or API keys. Keep `.env.example` up to date. Keep actual keys only in `.env.local` and Vercel environment variables.
- **Mapping**: MapLibre GL JS with OpenStreetMap raster/vector tiles.
- **Internationalization (i18n)**: `next-intl` supporting English (`en`), Malayalam (`ml`), and Arabic (`ar`). Full bidirectional RTL layout support when Arabic is selected.
- **Hosting**: Vercel.

---

## 3. Data Integrity & Ethical Rules
1. **Mandatory Attribution**: Every place, person, and event must have at least one credible source (published book, recognized local elder, or historical record). No history text can be approved without a verified source.
2. **No Fabricated History**: Never invent historical facts, dates, or stories. Seed data must be explicitly labeled `SAMPLE` and make no real historical assertions.
3. **Living Sufi Privacy & Safety**:
   - Only public gathering places (masjids, zawiyas, public halls) may be published. Never publish private home addresses.
   - A living person profile can only be approved if `consent_status = 'granted'`.
   - Every living person page must include a prominent **"Request Edit or Removal"** button.
4. **Row Level Security (RLS)**:
   - RLS is mandatory on every single table.
   - Public anonymous users can only `SELECT` rows where `status = 'approved'`.
   - Authenticated contributors can `INSERT` rows with `status = 'pending'` tied to their `user_id`, and `SELECT` their own pending submissions.
   - Only users with role `moderator` or `admin` can update status to `approved`/`rejected` or edit records created by others.

---

## 4. Design Language: "Sahn" (The Sanctuary Courtyard)
The aesthetic direction is **Sahn** — evoking the tranquil, open-air stone courtyards of classical sanctuaries. Minimal, respectful, and crystal-clear in outdoor Kerala daylight.

### Color Tokens
| Token | Hex | Role |
| :--- | :--- | :--- |
| `background` | `#FAF9F4` | Warm parchment canvas |
| `surface` / `card` | `#FFFFFF` | Crisp white cards & sheets (dominates the UI) |
| `ink` (`foreground`) | `#121512` | Deep charcoal for readable text |
| `muted-foreground` | `#5D675F` | Soft stone grey for subtitles and metadata |
| `primary` (`action`) | `#1F5C3A` | Deep sanctuary green (reserved for actions, primary CTAs, active states) |
| `border` | `#E4E2D8` | Subtle warm grey borders |
| `map-background` | `#EEF0E6` | Muted natural tone for map canvas |

### Design Rules
- **Corner Radius**: Fixed at `14px` (`0.875rem`) for cards, dialogs, bottom sheets, and buttons.
- **Typography**:
  - Headings: Soft serif font (e.g. *Playfair Display* or *Fraunces*).
  - Body: *Inter* for clear legibility in English and Malayalam.
  - Arabic: *Amiri* with appropriate line-height and font sizing for sacred script.
- **Layout & Mobile ergonomics**:
  - Primary actions (Directions, Save, Filters) positioned within the lower thumb zone.
  - Floating action button (`+`) bottom-right in primary green.
  - Bottom navigation bar: **Map**, **Gatherings**, **Contribute**, **Me**.
  - Respect `prefers-reduced-motion` for all transitions and bottom sheet drags.
  - Humble, welcoming, hospitable tone in all UI microcopy.

---

## 5. Development Log & Summary Protocol
Every agent working on this repository must strictly maintain `PROJECT_STATE.md` after **every task**:

1. **Changelog Entry**: Append a detailed entry to `PROJECT_STATE.md`:
   - Date and time.
   - What changed.
   - Exact files touched.
   - Key decisions made and rationale.
   - Immediate next step.
2. **Status Sync**: Continuously update `Current status` (maximum 5 lines), `In progress`, and `Next up`.
3. **Decisions Section**: Log architectural and design choices with their reasoning.
4. **30-Entry Rollover Rule**: When the Changelog exceeds 30 entries, move the oldest batch of 10 into `docs/archive/changelog_archive_<N>.md` as a concise ~10-line summary, leaving a one-line pointer in `PROJECT_STATE.md`.
5. **Session Bootstrap**: At the start of every new session or prompt, read `AGENTS.md` and `PROJECT_STATE.md` first.
6. **`/summarize` Command**: When the user sends `/summarize`, produce a concise 10-line summary of the current project state, the last 5 changes, and the next 3 steps, and refresh `PROJECT_STATE.md`.
