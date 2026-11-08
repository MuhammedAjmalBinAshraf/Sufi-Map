-- 20261108000003_storage_bucket_and_policies.sql
-- Supabase Storage bucket for Sufi Map sanctuary photos and public presence media

-- 1. Insert public bucket for photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'place-photos',
  'place-photos',
  true,
  5242880, -- 5 MB limit per photo
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- 2. Storage RLS Policies
create policy "Public can view place photos"
  on storage.objects for select
  using (bucket_id = 'place-photos');

create policy "Authenticated contributors can upload photos"
  on storage.objects for insert
  with check (
    bucket_id = 'place-photos'
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own uploaded photos"
  on storage.objects for update
  using (
    bucket_id = 'place-photos'
    and auth.uid() = owner
  );

create policy "Moderators can delete any photo"
  on storage.objects for delete
  using (
    bucket_id = 'place-photos'
    and public.is_moderator()
  );
