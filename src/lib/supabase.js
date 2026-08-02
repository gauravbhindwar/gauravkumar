import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Please define SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
}

// Cache the client on `global` so Next.js HMR / serverless re-invocation
// reuses one instance instead of opening a new PostgREST client per import.
let cached = global.supabase;

if (!cached) {
  cached = global.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: 'public' },
  });
}

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'portfolio';

export default function getSupabase() {
  return cached;
}
