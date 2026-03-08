import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;
if (url && key) {
  try {
    supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  } catch (e) {
    console.warn('Supabase client init failed — using in-memory dev mode:', e.message);
  }
} else {
  console.warn('No Supabase config — using in-memory dev mode (data resets on restart). Set SUPABASE_URL and SUPABASE_SERVICE_KEY in publishing/.env for persistent data.');
}

export { supabase };

export function getSupabase() {
  return supabase;
}
