// Supabase client initialization for React Native
// 1) Create a project at https://supabase.com
// 2) Go to Project Settings > API and copy:
//    - Project URL (SUPABASE_URL)
//    - anon public API key (SUPABASE_ANON_KEY)
// 3) Create a Storage bucket (e.g., "securestash-files") in the Supabase dashboard.
// 4) Put your values below, then rebuild the app.

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ugtynlxmewjldsowhidp.supabase.co'; // TODO: replace
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVndHlubHhtZXdqbGRzb3doaWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NDY1MjMsImV4cCI6MjA3NDUyMjUyM30.MmsQAOpFMJOlSANRoWnDi0NuB5FG5NfJBa9xc6eitPI'; // TODO: replace

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // We use Firebase Auth for app sign-in; disable session persistence here.
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
