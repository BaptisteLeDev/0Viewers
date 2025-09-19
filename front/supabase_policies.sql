-- Politiques RLS pour le bucket profil_image
-- Exécutez ces requêtes dans le SQL Editor de Supabase

-- 1. Politique INSERT (Upload)
create policy "Allow users to upload their own profile image"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profil_image' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. Politique SELECT (View) - Public
create policy "Allow public access to profile images"
on storage.objects for select
to public
using (bucket_id = 'profil_image');

-- 3. Politique UPDATE (Modify)
create policy "Allow users to update their own profile image"
on storage.objects for update
to authenticated
using (
  bucket_id = 'profil_image' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Politique DELETE (Remove)
create policy "Allow users to delete their own profile image"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'profil_image' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Vérifier que RLS est activé sur la table objects
alter table storage.objects enable row level security;