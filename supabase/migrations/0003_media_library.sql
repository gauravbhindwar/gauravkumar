-- Resume files and profile pictures: admin can upload multiple of each and
-- pick which one is "active" (shown on the public site). Activating one
-- writes its URL into contact.resume_link / contact.home_image, which is
-- what the public site already reads - no public-facing code needs to
-- change. The currently-active file can't be deleted (enforced in the API
-- route, not here) until another one is made active first.

create table resume_files (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  is_active boolean not null default false,
  created_at timestamptz default now()
);
alter table resume_files enable row level security;

create table profile_pictures (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  is_active boolean not null default false,
  created_at timestamptz default now()
);
alter table profile_pictures enable row level security;
