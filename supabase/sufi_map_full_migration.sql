-- =============================================================
-- SUFI MAP — FULL MIGRATION (Run this in Supabase SQL Editor)
-- Paste the entire file. Run all 3 steps in one shot.
-- =============================================================

-- ============================================================
-- MIGRATION 1: Schema — PostGIS, Tables, Indexes, RLS
-- ============================================================

-- 1. Enable PostGIS and extensions
create extension if not exists postgis schema extensions;
create extension if not exists "uuid-ossp";

-- 2. User Profiles and Roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null check (role in ('contributor', 'moderator', 'admin')) default 'contributor',
  area_of_responsibility text,
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

drop trigger if exists on_auth_user_created on auth.users;
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

-- 3. Places Table
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  name_en text not null,
  name_ml text not null,
  name_ar text not null,
  kind text not null check (kind in ('maqam', 'dargah', 'zawiya', 'gathering')),
  area text not null,
  latitude double precision not null,
  longitude double precision not null,
  geom extensions.geometry(Point, 4326) generated always as (
    extensions.st_setsrid(extensions.st_makepoint(longitude, latitude), 4326)
  ) stored,
  short_history_en text,
  short_history_ml text,
  short_history_ar text,
  visiting_etiquette_en text,
  visiting_etiquette_ml text,
  visiting_etiquette_ar text,
  recurring_events_en text,
  recurring_events_ml text,
  recurring_events_ar text,
  photos jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists places_geom_idx on public.places using gist (geom);
create index if not exists places_status_idx on public.places (status);
create index if not exists places_kind_idx on public.places (kind);

-- 4. Persons Table
create table if not exists public.persons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  review_notes text,
  name_en text not null,
  name_ml text not null,
  name_ar text not null,
  is_living boolean not null default false,
  consent_status text not null check (consent_status in ('pending', 'granted', 'revoked', 'not_applicable')) default 'pending',
  short_history_en text,
  short_history_ml text,
  short_history_ar text,
  photos jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  constraint check_living_person_consent check (
    status != 'approved' or is_living = false or consent_status = 'granted'
  )
);

create index if not exists persons_status_idx on public.persons (status);
create index if not exists persons_is_living_idx on public.persons (is_living);

-- 5. Gatherings Table
create table if not exists public.gatherings (
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
  venue_name_en text not null,
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

create index if not exists gatherings_geom_idx on public.gatherings using gist (geom);
create index if not exists gatherings_status_idx on public.gatherings (status);
create index if not exists gatherings_person_id_idx on public.gatherings (person_id);

-- 6. Corrections Table
create table if not exists public.corrections (
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

create index if not exists corrections_target_idx on public.corrections (target_type, target_id);
create index if not exists corrections_status_idx on public.corrections (status);

-- 7. Quotes Table
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  arabic text not null,
  english text not null,
  source text not null,
  active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists quotes_active_idx on public.quotes (active);

-- 8. Badges Table
create table if not exists public.badges (
  id text primary key check (id in ('musafir', 'misbah', 'hadiyya', 'rafeeq', 'nazir')),
  name text not null,
  description text not null,
  criteria_description text not null,
  icon_name text not null
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  awarded_by uuid references auth.users(id) on delete set null,
  unique (user_id, badge_id)
);

create index if not exists user_badges_user_idx on public.user_badges (user_id);

-- 9. Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.persons enable row level security;
alter table public.gatherings enable row level security;
alter table public.corrections enable row level security;
alter table public.quotes enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

-- PROFILES RLS
drop policy if exists "Public can view profiles" on public.profiles;
create policy "Public can view profiles" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- PLACES RLS
drop policy if exists "Public can view approved places" on public.places;
create policy "Public can view approved places" on public.places for select
  using (status = 'approved' or auth.uid() = created_by or public.is_moderator());

drop policy if exists "Authenticated users can submit pending places" on public.places;
create policy "Authenticated users can submit pending places" on public.places for insert
  with check (auth.uid() is not null and auth.uid() = created_by and status = 'pending');

drop policy if exists "Moderators can update places" on public.places;
create policy "Moderators can update places" on public.places for update using (public.is_moderator());

drop policy if exists "Moderators can delete places" on public.places;
create policy "Moderators can delete places" on public.places for delete using (public.is_moderator());

-- PERSONS RLS
drop policy if exists "Public can view approved persons" on public.persons;
create policy "Public can view approved persons" on public.persons for select
  using (status = 'approved' or auth.uid() = created_by or public.is_moderator());

drop policy if exists "Authenticated users can submit pending persons" on public.persons;
create policy "Authenticated users can submit pending persons" on public.persons for insert
  with check (auth.uid() is not null and auth.uid() = created_by and status = 'pending');

drop policy if exists "Moderators can update persons" on public.persons;
create policy "Moderators can update persons" on public.persons for update using (public.is_moderator());

drop policy if exists "Moderators can delete persons" on public.persons;
create policy "Moderators can delete persons" on public.persons for delete using (public.is_moderator());

-- GATHERINGS RLS
drop policy if exists "Public can view approved gatherings" on public.gatherings;
create policy "Public can view approved gatherings" on public.gatherings for select
  using (status = 'approved' or auth.uid() = created_by or public.is_moderator());

drop policy if exists "Authenticated users can submit pending gatherings" on public.gatherings;
create policy "Authenticated users can submit pending gatherings" on public.gatherings for insert
  with check (auth.uid() is not null and auth.uid() = created_by and status = 'pending');

drop policy if exists "Moderators can update gatherings" on public.gatherings;
create policy "Moderators can update gatherings" on public.gatherings for update using (public.is_moderator());

drop policy if exists "Moderators can delete gatherings" on public.gatherings;
create policy "Moderators can delete gatherings" on public.gatherings for delete using (public.is_moderator());

-- CORRECTIONS RLS
drop policy if exists "Public can view own or moderator can view all corrections" on public.corrections;
create policy "Public can view own or moderator can view all corrections" on public.corrections for select
  using (auth.uid() = created_by or public.is_moderator());

drop policy if exists "Authenticated users can submit corrections" on public.corrections;
create policy "Authenticated users can submit corrections" on public.corrections for insert
  with check (auth.uid() is not null and auth.uid() = created_by and status = 'pending');

drop policy if exists "Moderators can update corrections" on public.corrections;
create policy "Moderators can update corrections" on public.corrections for update using (public.is_moderator());

-- QUOTES RLS
drop policy if exists "Public can view active quotes" on public.quotes;
create policy "Public can view active quotes" on public.quotes for select
  using (active = true or public.is_moderator());

drop policy if exists "Moderators can insert quotes" on public.quotes;
create policy "Moderators can insert quotes" on public.quotes for insert with check (public.is_moderator());

drop policy if exists "Moderators can update quotes" on public.quotes;
create policy "Moderators can update quotes" on public.quotes for update using (public.is_moderator());

drop policy if exists "Moderators can delete quotes" on public.quotes;
create policy "Moderators can delete quotes" on public.quotes for delete using (public.is_moderator());

-- BADGES RLS
drop policy if exists "Public can view badge definitions" on public.badges;
create policy "Public can view badge definitions" on public.badges for select using (true);

drop policy if exists "Public can view user badge awards" on public.user_badges;
create policy "Public can view user badge awards" on public.user_badges for select using (true);

drop policy if exists "Moderators can award badges" on public.user_badges;
create policy "Moderators can award badges" on public.user_badges for insert with check (public.is_moderator());

-- ============================================================
-- MIGRATION 2: Seed Badges, Quotes, and Sample Data
-- ============================================================

insert into public.badges (id, name, description, criteria_description, icon_name)
values
  ('musafir', 'Musafir (The Traveler)', 'Awarded for your first approved and verified contribution.', '1 approved entry with verified source', 'Compass'),
  ('misbah', 'Misbah (The Lantern)', 'Awarded for illuminating the map with five carefully verified sacred places or gatherings.', '5 approved entries with verified sources', 'Lamp'),
  ('hadiyya', 'Hadiyya (The Gift)', 'Awarded for offering ten high-quality sanctuary records to the community.', '10 approved entries with verified sources', 'Gift'),
  ('rafeeq', 'Rafeeq (The Companion)', 'Awarded for helping review, verify, or improve entries submitted by fellow travelers.', 'Helped verify 5 entries by others', 'Users'),
  ('nazir', 'Nazir (The Custodian)', 'Granted by a sanctuary administrator for dedicated stewardship of a specific regional area.', 'Appointed by an administrator for regional stewardship', 'ShieldCheck')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  criteria_description = excluded.criteria_description,
  icon_name = excluded.icon_name;

insert into public.quotes (arabic, english, source, active)
values
  (
    'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ۖ وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ',
    'Invite to the way of your Lord with wisdom and good instruction, and argue with them in a way that is best.',
    'Holy Quran, Surah An-Nahl (16:125)',
    true
  ),
  (
    'يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا',
    'Make things easy, not hard; give glad tidings, and do not drive people away.',
    'Prophetic Hadith (Sahih al-Bukhari 69, Sahih Muslim 1734)',
    true
  ),
  (
    'لَا تَصْحَبْ مَنْ لَا يُنْهِضُكَ حَالُهُ، وَلَا يَدُلُّكَ عَلَى اللَّهِ مَقَالُهُ',
    'Do not accompany anyone whose spiritual state does not elevate you, and whose words do not point you toward God.',
    'Ibn Ata''illah al-Iskandari (Al-Hikam al-Ata''iyyah, Aph. 26)',
    true
  );

insert into public.places (id, status, name_en, name_ml, name_ar, kind, area, latitude, longitude,
  short_history_en, short_history_ml, short_history_ar,
  visiting_etiquette_en, visiting_etiquette_ml, visiting_etiquette_ar,
  recurring_events_en, recurring_events_ml, recurring_events_ar, sources)
values
  (
    '11111111-1111-1111-1111-111111111111', 'approved',
    '[SAMPLE] Mampuram Maqam', '[SAMPLE] മമ്പുറം മഖാം', '[SAMPLE] مقام مম্পুরம الشريف',
    'maqam', 'Tirurangadi, West Malappuram', 11.0489, 75.9234,
    '[SAMPLE] Historical 18th-century sanctuary associated with Sayyid Alawi Mouladdawilah, known across Malabar as a focal center of spiritual instruction and peaceful coexistence.',
    '[SAMPLE] പതിനെട്ടാം നൂറ്റാണ്ടിലെ ആത്മീയ കേന്ദ്രം. സയ്യിദ് അലവി തങ്ങളുടെ ആത്മീയ സേവനങ്ങളാൽ പ്രശസ്തമായ തീർത്ഥാടന കേന്ദ്രം.',
    '[SAMPLE] مقام مبارك يعود للقرن الثامن عشر ارتبط بالداعية السيد علوي مولى الدويلة في مليبار.',
    'Dress modestly, maintain quiet reflection, and remove footwear before ascending the courtyard steps.',
    'മാന്യമായ വസ്ത്രധാരണം പാലിക്കുക, നിശ്ശബ്ദത പുലർത്തുക, പാദരക്ഷകൾ താഴെ അഴിച്ചുവെക്കുക.',
    'الرجاء ارتداء اللباس المحتشم، والتزام السكينة، وخلع الأحذية قبل دخول الصحن.',
    'Weekly Thursday Majlis after Maghrib; Annual Commemorative Uroos in the lunar month of Muharram.',
    'എല്ലാ വ്യാഴാഴ്ചയും മഗ്‌രിബിന് ശേഷം മജ്‌ലിസ്; വാർഷിക ആണ്ടുനേർച്ച.',
    'مجلس الذكر الأسبوعي مساء كل خميس؛ وحولية المولد السنوية.',
    '[{"title": "[SAMPLE] Record of Malabar Shrines", "author": "K. E. M. Kutty", "is_verified": true}]'::jsonb
  ),
  (
    '22222222-2222-2222-2222-222222222222', 'approved',
    '[SAMPLE] Ponnani Valiya Juma Masjid & Makhdum Zawiya',
    '[SAMPLE] പൊന്നാനി വലിയ ജുമുഅ മസ്ജിദ് & മഖ്ദൂം സാവിയ',
    '[SAMPLE] جامع بوناني الكبير وزاوية المخدوم',
    'zawiya', 'Ponnani, West Malappuram', 10.7712, 75.9237,
    '[SAMPLE] Classical 16th-century center of Islamic scholarship and Sufi retreat established under the guidance of the Makhdum scholars.',
    '[SAMPLE] പതിനാറാം നൂറ്റാണ്ടിലെ വിജ്ഞാന കേന്ദ്രവും മഖ്ദൂമുമാരുടെ ആത്മീയ താവളവുമായ സാവിയ.',
    '[SAMPLE] مركز تاريخي للعلم والتصوف شيده علماء آل مخدوم في القرن السادس عشر.',
    'Sanctuary of learning; silence mobile phones and respect prayer times.',
    'പഠന സദസ്സുകളെ ബഹുമാനിക്കുക, ഫോണുകൾ നിശ്ശബ്ദമാക്കുക.',
    'احترام حلقات العلم والهدوء داخل أروقة الجامع.',
    'Daily study halqas after Fajr; monthly Khatmul Quran majlis.',
    'സുബ്ഹിക്ക് ശേഷം ദിവസേനയുള്ള ദർസ്; മാസത്തിലൊരിക്കൽ ഖത്മുകൾ.',
    'حلقات العلم اليومية بعد صلاة الفجر ومجلس الختم الشهري.',
    '[{"title": "[SAMPLE] Tuhfat al-Mujahidin Historical Notes", "author": "Zayn al-Din Makhdum", "is_verified": true}]'::jsonb
  ),
  (
    '33333333-3333-3333-3333-333333333333', 'approved',
    '[SAMPLE] Kondotty Qubba Dargah', '[SAMPLE] കൊണ്ടോട്ടി ഖുബ്ബ ദർഗ', '[SAMPLE] قبة كونودوتي الشريفة',
    'dargah', 'Kondotty, Malappuram', 11.1465, 75.9621,
    '[SAMPLE] 18th-century sanctuary with Persian and Malabar architectural motifs associated with Muhammad Shah Bukhari.',
    '[SAMPLE] മുഹമ്മദ് ഷാ ബുഖാരിയുടെ സ്മരണകളുറങ്ങുന്ന ചരിത്രപ്രസിദ്ധമായ സാംസ്കാരിക കേന്ദ്രം.',
    '[SAMPLE] مزار ومجمع صوفي تاريخي في كوندوتي بني على الطراز المعماري التقليدي.',
    'Maintain respectful tranquility within the courtyard.',
    'അങ്കണത്തിൽ സമാധാനാന്തരീക്ഷം പാലിക്കുക.',
    'التزام الأدب والوقار في فناء الضريح.',
    'Annual Nercha and Friday spiritual dhikr circle.',
    'വെള്ളിയാഴ്ചകളിലെ ദിക്ർ മജ്‌ലിസ്, വാർഷിക നേർച്ച.',
    'حلقة الذكر الأسبوعية بعد صلاة الجمعة.',
    '[{"title": "[SAMPLE] Waqf Regional Heritage Catalog", "author": "Malabar Waqf Board", "is_verified": true}]'::jsonb
  )
on conflict (id) do nothing;

insert into public.persons (id, status, name_en, name_ml, name_ar, is_living, consent_status,
  short_history_en, short_history_ml, short_history_ar, sources)
values
  (
    '44444444-4444-4444-4444-444444444444', 'approved',
    '[SAMPLE] Sayyid Alawi Mouladdawilah', '[SAMPLE] സയ്യിദ് അലവി മൗലദ്ദവീല', '[SAMPLE] السيد علوي بن سهل مولى الدويلة',
    false, 'not_applicable',
    '[SAMPLE] Esteemed 18th-century spiritual luminary and social reformer of Mampuram.',
    '[SAMPLE] മമ്പുറത്തെ പ്രമുഖ ആത്മീയ നേതാവും പണ്ഡിതനുമായിരുന്ന മഹദ് വ്യക്തിത്വം.',
    '[SAMPLE] عالم ومصلح روحي كبير عاش في منطقة مம்பুறம بمليبار.',
    '[{"title": "[SAMPLE] Al-Diyau al-Lami biography", "author": "Local Chronicler", "is_verified": true}]'::jsonb
  ),
  (
    '55555555-5555-5555-5555-555555555555', 'approved',
    '[SAMPLE] Ustadh Ahmad al-Malabari (Living)', '[SAMPLE] ഉസ്താദ് അഹ്മദ് അൽ മലബാരി (ജീവിച്ചിരിക്കുന്നവർ)', '[SAMPLE] الأستاذ أحمد المليباري (معاصر)',
    true, 'granted',
    '[SAMPLE] Teacher of traditional tasawwuf texts and leader of public majlis gatherings in Tirurangadi.',
    '[SAMPLE] തിരൂരങ്ങാടിയിൽ തസവ്വുഫ് ദർസുകൾ നടത്തുന്ന ആത്മീയ അധ്യാപകൻ.',
    '[SAMPLE] مدرس كتب التصوف وقائد مجالس الذكر العامة في تيرورانجادي.',
    '[{"title": "[SAMPLE] Written consent on file with admin", "author": "Signed Registry", "is_verified": true}]'::jsonb
  )
on conflict (id) do nothing;

insert into public.gatherings (id, status, person_id, place_id,
  title_en, title_ml, title_ar,
  venue_name_en, venue_name_ml, venue_name_ar,
  schedule_en, schedule_ml, schedule_ar,
  latitude, longitude, sources)
values
  (
    '66666666-6666-6666-6666-666666666666', 'approved',
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    '[SAMPLE] Weekly Ihya'' Uloom al-Din Study Circle',
    '[SAMPLE] ഇഹ്‌യാ ഉലൂമുദ്ദീൻ വായനാ സദസ്സ്',
    '[SAMPLE] مجلس إحياء علوم الدين الأسبوعي',
    'Tirurangadi Community Juma Masjid Hall',
    'തിരൂരങ്ങാടി കമ്മ്യൂണിറ്റി മസ്ജിദ് ഹാൾ',
    'قاعة جامع تيرورانجادي العامة',
    'Every Sunday morning from 7:30 AM to 9:00 AM',
    'എല്ലാ ഞായറാഴ്ചയും രാവിലെ 7:30 മുതൽ 9:00 വരെ',
    'صباح كل أحد من الساعة 7:30 إلى 9:00 صباحاً',
    11.0450, 75.9210,
    '[{"title": "[SAMPLE] Public Mosque Notice Board", "author": "Masjid Committee", "is_verified": true}]'::jsonb
  )
on conflict (id) do nothing;

-- ============================================================
-- MIGRATION 3: Storage Bucket for Place Photos
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'place-photos',
  'place-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

drop policy if exists "Public can view place photos" on storage.objects;
create policy "Public can view place photos"
  on storage.objects for select
  using (bucket_id = 'place-photos');

drop policy if exists "Authenticated contributors can upload photos" on storage.objects;
create policy "Authenticated contributors can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'place-photos' and auth.role() = 'authenticated');

drop policy if exists "Users can update their own uploaded photos" on storage.objects;
create policy "Users can update their own uploaded photos"
  on storage.objects for update
  using (bucket_id = 'place-photos' and auth.uid() = owner);

drop policy if exists "Moderators can delete any photo" on storage.objects;
create policy "Moderators can delete any photo"
  on storage.objects for delete
  using (bucket_id = 'place-photos' and public.is_moderator());

-- =============================================================
-- DONE. All tables, indexes, RLS policies, seed data loaded.
-- =============================================================
