-- Buds.gg Phase A schema stub (Postgres / Supabase)
-- Not applied automatically. Run when SUPABASE_* env keys are ready.
-- RLS skeletons included; tighten policies before production traffic.

-- Extensions
create extension if not exists citext;

-- Profiles (id mirrors auth.users.id once Auth is wired)
create table if not exists public.profiles (
  id uuid primary key,
  username citext not null unique,
  display_name text not null default '',
  bio text not null default '',
  avatar_path text,
  banner_path text,
  theme text not null default 'midnight',
  looking_for_friends boolean not null default false,
  is_public boolean not null default true,
  age_attested_at timestamptz,
  age_attested_version text,
  timezone text,
  region text,
  availability jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique,
  name text not null,
  cover_url text,
  aliases text[] not null default '{}'
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('style', 'personality', 'interest', 'platform')),
  slug citext not null,
  label text not null,
  unique (kind, slug)
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique,
  name text not null,
  description text not null default '',
  avatar_path text,
  banner_path text,
  primary_game_id uuid references public.games (id),
  region text,
  timezone text,
  schedule text,
  preferred_size text check (preferred_size in ('small', 'medium', 'large')),
  min_age int not null default 18,
  voice_prefs text,
  recruitment_mode text not null default 'open'
    check (recruitment_mode in ('open', 'applications', 'invite_only')),
  recruiting boolean not null default true,
  rules text not null default '',
  external_links jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'mod', 'member')),
  status text not null default 'active' check (status in ('active', 'left', 'removed')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.group_applications (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  applicant_id uuid not null references public.profiles (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS skeletons (enable; policies are permissive read stubs for public rows)
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_applications enable row level security;
alter table public.games enable row level security;
alter table public.tags enable row level security;

create policy "Public profiles are readable"
  on public.profiles for select
  using (is_public = true);

create policy "Public groups are readable"
  on public.groups for select
  using (is_public = true);

create policy "Games catalog readable"
  on public.games for select
  using (true);

create policy "Tags catalog readable"
  on public.tags for select
  using (true);

-- Owner write policies + age attestation gates land with live Auth (Phase A exit).
