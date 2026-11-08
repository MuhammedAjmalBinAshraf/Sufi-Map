-- 20261108000001_initial_sufi_map_schema.sql
-- Sufi Map: PostGIS, Core Entities, RLS, and Badges

-- 1. Enable PostGIS and extensions
create extension if not exists postgis schema extensions;
create extension if not exists "uuid-ossp";

-- 2. User Profiles and Roles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null check (role in ('contributor', 'moderator', 'admin')) default 'contributor',
  area_of_responsibility text, -- For Nazir custodians
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Profiles trigger for new auth signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'contributor'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Moderator check helper function
create or replace function public.is_moderator()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('moderator', 'admin')
  );
$$ language sql security definer stable;

-- 3. Places Table (Maqams, Dargahs, Zawiyas)
create table public.places (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,

  -- Trilingual Names
  name_en text not null,
  name_ml text not null,
  name_ar text not null,

  -- Categorization & Location
  kind text not null check (kind in ('maqam', 'dargah', 'zawiya', 'gathering')),
  area text not null,
  latitude double precision not null,
  longitude double precision not null,
  geom extensions.geometry(Point, 4326) generated always as (
    extensions.st_setsrid(extensions.st_makepoint(longitude, latitude), 4326)
  ) stored,

  -- Detailed Content
  short_history_en text,
  short_history_ml text,
  short_history_ar text,
  visiting_etiquette_en text,
  visiting_etiquette_ml text,
  visiting_etiquette_ar text,
  recurring_events_en text,
  recurring_events_ml text,
  recurring_events_ar text,

  -- Media & Mandatory Sources
  photos jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,

  -- Extensible metadata for future accommodation/food/travel modules
  metadata jsonb not null default '{}'::jsonb
);

create index places_geom_idx on public.places using gist (geom);
create index places_status_idx on public.places (status);
create index places_kind_idx on public.places (kind);

-- 4. Persons Table (Sufi Masters & Historical Figures)
create table public.persons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,

  -- Trilingual Names
  name_en text not null,
  name_ml text not null,
  name_ar text not null,

  -- Living Sufi Privacy & Safety Constraint
  is_living boolean not null default false,
  consent_status text not null check (consent_status in ('pending', 'granted', 'revoked', 'not_applicable')) default 'pending',

  short_history_en text,
  short_history_ml text,
  short_history_ar text,

  photos jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,

  -- Database-enforced ethical constraint: Living persons can only be approved if consent is granted
  constraint check_living_person_consent check (
    status != 'approved' or is_living = false or consent_status = 'granted'
  )
);

create index persons_status_idx on public.persons (status);
create index persons_is_living_idx on public.persons (is_living);

-- 5. Public Gatherings & Presence (Teaching, Majlis, Halqa)
create table public.gatherings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,

  person_id uuid references public.persons(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,

  title_en text not null,
  title_ml text not null,
  title_ar text not null,

  venue_name_en text not null, -- Public venue only: masjid, zawiya, hall; never private homes
  venue_name_ml text not null,
  venue_name_ar text not null,

  schedule_en text not null,
  schedule_ml text not null,
  schedule_ar text not null,

  latitude double precision,
  longitude double precision,
  geom extensions.geometry(Point, 4326) generated always as (
    case when longitude is not null and latitude is not null
         then extensions.st_setsrid(extensions.st_makepoint(longitude, latitude), 4326)
         else null
    end
  ) stored,

  sources jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create index gatherings_geom_idx on public.gatherings using gist (geom);
create index gatherings_status_idx on public.gatherings (status);
create index gatherings_person_id_idx on public.gatherings (person_id);

-- 6. Corrections & Suggestions Table
create table public.corrections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,

  target_type text not null check (target_type in ('place', 'person', 'gathering')),
  target_id uuid not null,
  suggested_changes jsonb not null,
  sources jsonb not null default '[]'::jsonb
);

create index corrections_target_idx on public.corrections (target_type, target_id);
create index corrections_status_idx on public.corrections (status);

-- 7. Quotes Table (Inspirational Contributor Quotes)
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  arabic text not null,
  english text not null,
  source text not null,
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null
);

create index quotes_active_idx on public.quotes (active);

-- 8. Badges and User Badge Awards
create table public.badges (
  id text primary key check (id in ('musafir', 'misbah', 'hadiyya', 'rafeeq', 'nazir')),
  name text not null,
  description text not null,
  criteria_description text not null,
  icon_name text not null
);

create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  awarded_by uuid references auth.users(id) on delete set null,
  unique (user_id, badge_id)
);

create index user_badges_user_idx on public.user_badges (user_id);

-- 9. Row Level Security (RLS) Configuration

-- Enable RLS on every table
alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.persons enable row level security;
alter table public.gatherings enable row level security;
alter table public.corrections enable row level security;
alter table public.quotes enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

-- PROFILES RLS
create policy "Public can view profiles"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- PLACES RLS
create policy "Public can view approved places"
  on public.places for select
  using (status = 'approved' or auth.uid() = created_by or public.is_moderator());

create policy "Authenticated users can submit pending places"
  on public.places for insert
  with check (auth.uid() is not null and auth.uid() = created_by and status = 'pending');

create policy "Moderators can update places"
  on public.places for update
  using (public.is_moderator());

create policy "Moderators can delete places"
  on public.places for delete
  using (public.is_moderator());

-- PERSONS RLS
create policy "Public can view approved persons"
  on public.persons for select
  using (status = 'approved' or auth.uid() = created_by or public.is_moderator());

create policy "Authenticated users can submit pending persons"
  on public.persons for insert
  with check (auth.uid() is not null and auth.uid() = created_by and status = 'pending');

create policy "Moderators can update persons"
  on public.persons for update
  using (public.is_moderator());

create policy "Moderators can delete persons"
  on public.persons for delete
  using (public.is_moderator());

-- GATHERINGS RLS
create policy "Public can view approved gatherings"
  on public.gatherings for select
  using (status = 'approved' or auth.uid() = created_by or public.is_moderator());

create policy "Authenticated users can submit pending gatherings"
  on public.gatherings for insert
  with check (auth.uid() is not null and auth.uid() = created_by and status = 'pending');

create policy "Moderators can update gatherings"
  on public.gatherings for update
  using (public.is_moderator());

create policy "Moderators can delete gatherings"
  on public.gatherings for delete
  using (public.is_moderator());

-- CORRECTIONS RLS
create policy "Public can view own or moderator can view all corrections"
  on public.corrections for select
  using (auth.uid() = created_by or public.is_moderator());

create policy "Authenticated users can submit corrections"
  on public.corrections for insert
  with check (auth.uid() is not null and auth.uid() = created_by and status = 'pending');

create policy "Moderators can update corrections"
  on public.corrections for update
  using (public.is_moderator());

-- QUOTES RLS
create policy "Public can view active quotes"
  on public.quotes for select
  using (active = true or public.is_moderator());

create policy "Moderators can insert quotes"
  on public.quotes for insert
  with check (public.is_moderator());

create policy "Moderators can update quotes"
  on public.quotes for update
  using (public.is_moderator());

create policy "Moderators can delete quotes"
  on public.quotes for delete
  using (public.is_moderator());

-- BADGES RLS
create policy "Public can view badge definitions"
  on public.badges for select
  using (true);

create policy "Public can view user badge awards"
  on public.user_badges for select
  using (true);

create policy "Moderators can award badges"
  on public.user_badges for insert
  with check (public.is_moderator());
