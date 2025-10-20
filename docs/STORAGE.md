Storage backends
================

This app can use either Firebase Storage or Supabase Storage.

1) Firebase Storage (default)
   - Place `android/app/google-services.json` (must contain `project_info.storage_bucket`).
   - Rebuild the app after adding or updating the file.
   - Ensure Storage is enabled in Firebase Console.

2) Supabase Storage
   - In `config/storage.ts` set `STORAGE_BACKEND = 'supabase'` and set `SUPABASE_BUCKET`.
   - In `config/supabase.ts` set `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your Supabase project.
   - Create a private bucket in Supabase (e.g. `securestash-files`).
   - Rebuild the app after installing dependencies.

Metadata
--------
Uploaded file metadata is stored in Firestore collection `files` with fields:
`owner_id, name, path, size, contentType, kind, storage_provider, created_at, updated_at`.
