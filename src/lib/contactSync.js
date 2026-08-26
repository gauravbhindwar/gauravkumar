import getSupabase from '@/lib/supabase';

// `contact` is a singleton table (always exactly one row). Activating a
// resume file or profile picture writes its URL into that row's
// resume_link / home_image column, which is the field the public site
// already reads - so nothing on the public side needs to know these
// media-library tables exist.
export async function syncContactField(column, value) {
  const supabase = getSupabase();
  const { data: existing } = await supabase.from('contact').select('id').limit(1).maybeSingle();
  if (!existing) return;
  await supabase.from('contact').update({ [column]: value }).eq('id', existing.id);
}
