// Central switch to choose which storage backend to use.
// 'firebase' (default) uses @react-native-firebase/storage
// 'supabase' uses Supabase Storage via @supabase/supabase-js

export type StorageBackend = 'firebase' | 'supabase';

export const STORAGE_BACKEND: StorageBackend = 'supabase'; // change to 'supabase' to use Supabase

// When using Supabase, set the bucket name you created in the dashboard
export const SUPABASE_BUCKET = 'securestash-files';
