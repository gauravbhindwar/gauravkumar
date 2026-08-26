-- Adds optional per-project extras: demo login credentials (for live demos
-- behind auth), code screenshots (for repos that are private and can't be
-- browsed on GitHub), and a raw README (rendered client-side with mermaid
-- support behind a "View README" button).

alter table projects
  add column demo_username text default '',
  add column demo_password text default '',
  add column code_images text[] default '{}',
  add column readme text default '';
