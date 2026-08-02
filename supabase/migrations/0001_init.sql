-- Initial schema for portfolio migration: MongoDB/Mongoose -> Postgres.
-- Every table carries legacy_id (old Mongo _id) for migration traceability.
-- RLS is enabled with no policies on every table: all access goes through
-- Next.js API routes using the Supabase service role key server-side, the
-- same trust boundary the app already had with Mongoose (browser never
-- talks to the DB directly).

create extension if not exists pgcrypto;

-- ---------- enums ----------

create type achievement_category as enum ('Academic','Professional','Technical','Leadership','Community','Sports','Other');
create type award_category as enum ('Academic','Professional','Technical','Leadership','Innovation','Community Service','Competition','Recognition','Other');
create type award_level as enum ('International','National','Regional','State','Local','Institutional');
create type grade_type as enum ('GPA','Percentage','Grade','Other');
create type employment_type as enum ('Full-time','Part-time','Contract','Internship','Freelance');
create type resume_type as enum ('fullstack','ai','both');
create type skill_category as enum ('Languages','Web Development','Data Science & ML','Tools & Platforms');
create type course_type as enum ('current','completed','paused','planned');
create type project_status as enum ('completed','in-progress','planned');
create type admin_role as enum ('admin','super_admin');

-- ---------- shared trigger helpers ----------
-- One function per table (not a generic version) since a trigger function
-- can't parameterize its own FROM clause without dynamic SQL per row.

create or replace function set_next_order_certifications() returns trigger as $$
begin
  if new.order is null then
    select coalesce(max("order"), 0) + 1 into new.order from certifications;
  end if;
  return new;
end;
$$ language plpgsql;

create or replace function set_next_order_projects() returns trigger as $$
begin
  if new.order is null then
    select coalesce(max("order"), 0) + 1 into new.order from projects;
  end if;
  return new;
end;
$$ language plpgsql;

create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------- achievements ----------

create table achievements (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  title text not null,
  description text not null,
  category achievement_category not null,
  date date not null,
  organization text not null,
  image text default '',
  link text default '',
  tags text[] default '{}',
  impact text default '',
  metrics text default '',
  "order" integer default 0,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index achievements_order_idx on achievements ("order");
create index achievements_date_idx on achievements (date desc);
create index achievements_category_idx on achievements (category);
create index achievements_is_active_idx on achievements (is_active);
create index achievements_is_featured_idx on achievements (is_featured);
create trigger achievements_touch_updated_at before update on achievements
  for each row execute function touch_updated_at();
alter table achievements enable row level security;

-- ---------- awards ----------

create table awards (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  title text not null,
  description text not null,
  awarded_by text not null,
  date date not null,
  category award_category not null,
  level award_level default 'Institutional',
  image text default '',
  certificate_url text default '',
  link text default '',
  position text default '',
  prize_value text default '',
  criteria text default '',
  tags text[] default '{}',
  "order" integer default 0,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index awards_order_idx on awards ("order");
create index awards_date_idx on awards (date desc);
create index awards_category_idx on awards (category);
create index awards_level_idx on awards (level);
create index awards_is_active_idx on awards (is_active);
create index awards_is_featured_idx on awards (is_featured);
create trigger awards_touch_updated_at before update on awards
  for each row execute function touch_updated_at();
alter table awards enable row level security;

-- ---------- certifications ----------

create table certifications (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  title text not null,
  issuer text not null,
  date text,
  description text,
  credential_link text,
  pdf_file text,
  skills text[] default '{}',
  "order" integer default 999,
  created_at timestamptz default now()
);
create index certifications_order_idx on certifications ("order");
create trigger certifications_set_order before insert on certifications
  for each row execute function set_next_order_certifications();
alter table certifications enable row level security;

-- ---------- education ----------

create table education (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  institution text not null,
  degree text not null,
  field text,
  start_date date,
  end_date date,
  is_currently_studying boolean default false,
  grade text,
  grade_type grade_type,
  location text,
  description text,
  coursework text[] default '{}',
  achievements text[] default '{}',
  "order" integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index education_institution_idx on education (institution);
create index education_degree_idx on education (degree);
create index education_end_date_idx on education (end_date desc);
create index education_order_idx on education ("order");
create trigger education_touch_updated_at before update on education
  for each row execute function touch_updated_at();
alter table education enable row level security;

-- ---------- experiences ----------

create table experiences (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  company text not null,
  position text not null,
  location text not null,
  start_date date not null,
  end_date date,
  is_current_position boolean default false,
  description text not null,
  responsibilities text[] default '{}',
  technologies text[] default '{}',
  company_logo text default '',
  company_website text default '',
  employment_type employment_type default 'Full-time',
  "order" integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index experiences_order_idx on experiences ("order");
create index experiences_start_date_idx on experiences (start_date desc);
create index experiences_is_active_idx on experiences (is_active);
create trigger experiences_touch_updated_at before update on experiences
  for each row execute function touch_updated_at();
alter table experiences enable row level security;

-- ---------- profiles (singleton via is_active) ----------

create table profiles (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  name text not null,
  email text not null,
  phone text,
  location text,
  profile_picture text default '/gaurav.jpg',
  bio text,
  title text,
  website text,
  github text,
  linkedin text,
  portfolio text,
  resume_type resume_type default 'both',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger profiles_touch_updated_at before update on profiles
  for each row execute function touch_updated_at();
alter table profiles enable row level security;

-- ---------- contact (singleton) ----------

create table contact (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  email text not null,
  phone text,
  location text,
  social jsonb default '{}'::jsonb,
  resume_link text,
  home_image text,
  twitter text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger contact_touch_updated_at before update on contact
  for each row execute function touch_updated_at();
alter table contact enable row level security;

-- ---------- skills ----------

create table skills (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  name text not null,
  icon text,
  color text,
  category skill_category not null,
  created_at timestamptz default now()
);
alter table skills enable row level security;

-- ---------- courses ----------

create table courses (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  name text not null,
  type course_type not null default 'current',
  description text,
  url text,
  created_at timestamptz default now()
);
alter table courses enable row level security;

-- ---------- projects ----------

create table projects (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  slug text not null unique,
  title text not null,
  description text not null,
  image text,
  tech text[] default '{}',
  github text,
  live text,
  preview boolean,
  features text[] default '{}',
  "order" integer default 999,
  status project_status default 'completed',
  search tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) stored,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index projects_slug_idx on projects (slug);
create index projects_order_idx on projects ("order");
create index projects_status_order_idx on projects (status, "order");
create index projects_search_idx on projects using gin (search);
create trigger projects_set_order before insert on projects
  for each row execute function set_next_order_projects();
create trigger projects_touch_updated_at before update on projects
  for each row execute function touch_updated_at();
alter table projects enable row level security;

-- ---------- admins ----------

create table admins (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  username text not null unique,
  email text not null unique,
  password text not null,
  role admin_role default 'admin',
  is_active boolean default true,
  last_login timestamptz,
  last_login_ip text,
  last_login_user_agent text,
  security_settings jsonb default '{"twoFactorEnabled": false, "sessionTimeout": 24, "passwordLastChanged": null}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger admins_touch_updated_at before update on admins
  for each row execute function touch_updated_at();
alter table admins enable row level security;

-- ---------- admin_login_history ----------

create table admin_login_history (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references admins(id) on delete cascade,
  "timestamp" timestamptz default now(),
  ip text,
  user_agent text,
  success boolean default true
);
create index admin_login_history_admin_id_idx on admin_login_history (admin_id);
alter table admin_login_history enable row level security;

-- ---------- storage bucket ----------

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;
