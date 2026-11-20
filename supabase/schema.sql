-- ==============================================================================
-- Lumif App Database Schema (Hardened Production Draft)
-- Supabase PostgreSQL DDL with Strict RLS, Check Constraints & Auth Sync Trigger
-- ==============================================================================

-- Utility: keep updated_at fresh without search_path hijacking
create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;


-- 1. User Recovery Profiles (Onboarding & Companion Preferences, 1:1 with auth.users)
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(trim(display_name)) between 1 and 64),
  reason text not null default 'focus' check (reason in ('focus', 'relationship', 'health')),
  primary_trigger text not null default 'stress' check (primary_trigger in ('stress', 'boredom', 'night')),
  method text not null default 'total' check (method in ('total', 'gradual')),
  routine text not null default 'breathing' check (routine in ('breathing', 'journaling', 'workout')),
  frequency integer not null default 8 check (frequency between 0 and 100),
  weekly_reduction_target integer check (weekly_reduction_target is null or weekly_reduction_target between -14 and 0),
  target_quit_date date,
  goal_days integer not null default 7 check (goal_days between 1 and 3650),
  pet_species text check (pet_species is null or pet_species in ('duck', 'bear', 'parrot', 'dragon')),
  pet_name text check (pet_name is null or char_length(trim(pet_name)) between 1 and 32),
  onboarding_completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_current_timestamp_updated_at();

alter table public.user_profiles enable row level security;
alter table public.user_profiles force row level security;

drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile"
  on public.user_profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
  on public.user_profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);


-- Automatic Profile Provisioning on Sign-Up (works even when email confirmation is enabled)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  raw_meta jsonb;
  raw_onboarding jsonb;
  v_reason text;
  v_trigger text;
  v_method text;
  v_routine text;
  v_frequency integer;
  v_reduction integer;
  v_quit_date date;
  v_display_name text;
  v_pet_species text;
  v_pet_name text;
begin
  raw_meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  raw_onboarding := coalesce(raw_meta->'onboarding', '{}'::jsonb);

  v_reason := case
    when raw_onboarding->>'reason' in ('focus', 'relationship', 'health')
      then raw_onboarding->>'reason'
    else 'focus'
  end;

  v_trigger := case
    when raw_onboarding->>'trigger' in ('stress', 'boredom', 'night')
      then raw_onboarding->>'trigger'
    else 'stress'
  end;

  v_method := case
    when raw_onboarding->>'method' in ('total', 'gradual')
      then raw_onboarding->>'method'
    else 'total'
  end;

  v_routine := case
    when raw_onboarding->>'routine' in ('breathing', 'journaling', 'workout')
      then raw_onboarding->>'routine'
    else 'breathing'
  end;

  v_frequency := 8;
  if (raw_onboarding->>'frequency') ~ '^[0-9]{1,3}$' then
    v_frequency := greatest(0, least(100, (raw_onboarding->>'frequency')::integer));
  end if;

  v_reduction := null;
  if (raw_onboarding->>'weeklyReductionTarget') ~ '^-[0-9]{1,2}$' then
    v_reduction := greatest(-14, least(0, (raw_onboarding->>'weeklyReductionTarget')::integer));
  end if;

  v_quit_date := null;
  if (raw_onboarding->>'targetQuitDate') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
    v_quit_date := (raw_onboarding->>'targetQuitDate')::date;
  end if;

  v_display_name := nullif(left(trim(coalesce(raw_meta->>'display_name', '')), 64), '');

  v_pet_species := case
    when raw_meta->>'pet_species' in ('duck', 'bear', 'parrot', 'dragon')
      then raw_meta->>'pet_species'
    else null
  end;

  v_pet_name := nullif(left(trim(coalesce(raw_meta->>'pet_name', '')), 32), '');

  insert into public.user_profiles (
    user_id,
    display_name,
    reason,
    primary_trigger,
    method,
    routine,
    frequency,
    weekly_reduction_target,
    target_quit_date,
    pet_species,
    pet_name,
    onboarding_completed_at
  )
  values (
    new.id,
    v_display_name,
    v_reason,
    v_trigger,
    v_method,
    v_routine,
    v_frequency,
    v_reduction,
    v_quit_date,
    v_pet_species,
    v_pet_name,
    case when raw_onboarding <> '{}'::jsonb then timezone('utc'::text, now()) else null end
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. Daily Missions Table
create table if not exists public.daily_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  mission_date date not null,
  text text not null check (char_length(trim(text)) between 1 and 200),
  completed boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_daily_missions_user_date on public.daily_missions(user_id, mission_date);

alter table public.daily_missions enable row level security;
alter table public.daily_missions force row level security;

drop policy if exists "Users can view own daily missions" on public.daily_missions;
create policy "Users can view own daily missions"
  on public.daily_missions for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own daily missions" on public.daily_missions;
create policy "Users can insert own daily missions"
  on public.daily_missions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own daily missions" on public.daily_missions;
create policy "Users can update own daily missions"
  on public.daily_missions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own daily missions" on public.daily_missions;
create policy "Users can delete own daily missions"
  on public.daily_missions for delete
  to authenticated
  using ((select auth.uid()) = user_id);


-- 3. Check-ins & Urge Logs Table (Strictly Private to Authenticated Owner)
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  mood_score integer check (mood_score is null or mood_score between 1 and 10),
  urge_score integer check (urge_score is null or urge_score between 1 and 10),
  energy_score integer check (energy_score is null or energy_score between 1 and 10),
  note text check (note is null or char_length(note) <= 2000),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_checkins_user_created on public.checkins(user_id, created_at desc);

alter table public.checkins enable row level security;
alter table public.checkins force row level security;

drop policy if exists "Users can view own checkins" on public.checkins;
create policy "Users can view own checkins"
  on public.checkins for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own checkins" on public.checkins;
create policy "Users can insert own checkins"
  on public.checkins for insert
  to authenticated
  with check ((select auth.uid()) = user_id);


-- 4. Relapse Logs Table (Matches RelapseResetFlow payload & backward-safe constraints)
create table if not exists public.relapse_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  trigger text not null check (char_length(trim(trigger)) between 1 and 200),
  action_taken text not null check (char_length(trim(action_taken)) between 1 and 200),
  note text check (note is null or char_length(note) <= 2000),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safe column migration if earlier draft created trigger_reason / recovery_action
alter table public.relapse_logs add column if not exists trigger text;
alter table public.relapse_logs add column if not exists action_taken text;
alter table public.relapse_logs add column if not exists note text;

create index if not exists idx_relapse_logs_user_created on public.relapse_logs(user_id, created_at desc);

alter table public.relapse_logs enable row level security;
alter table public.relapse_logs force row level security;

drop policy if exists "Users can view own relapse logs" on public.relapse_logs;
create policy "Users can view own relapse logs"
  on public.relapse_logs for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own relapse logs" on public.relapse_logs;
create policy "Users can insert own relapse logs"
  on public.relapse_logs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);


-- 5. Community Posts Table
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_name text not null default 'Pejuang Pulih' check (char_length(trim(author_name)) between 1 and 64),
  tag text check (tag is null or char_length(tag) <= 40),
  category text not null default 'cerita' check (category in ('cerita', 'support', 'darurat', 'lokasi', 'progres', 'tanya', 'dukungan')),
  content text not null check (char_length(trim(content)) between 1 and 2000),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_community_posts_created on public.community_posts(created_at desc);

alter table public.community_posts enable row level security;
alter table public.community_posts force row level security;

drop policy if exists "Anyone can read community posts" on public.community_posts;
drop policy if exists "Authenticated users can read community posts" on public.community_posts;
create policy "Authenticated users can read community posts"
  on public.community_posts for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can create posts" on public.community_posts;
create policy "Authenticated users can create posts"
  on public.community_posts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Authors can delete own posts" on public.community_posts;
create policy "Authors can delete own posts"
  on public.community_posts for delete
  to authenticated
  using ((select auth.uid()) = user_id);


-- 6. Community Reactions Table
create table if not exists public.community_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  emoji text not null check (char_length(trim(emoji)) between 1 and 16),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (post_id, user_id, emoji)
);

create index if not exists idx_community_reactions_post on public.community_reactions(post_id);

alter table public.community_reactions enable row level security;
alter table public.community_reactions force row level security;

drop policy if exists "Anyone can view reactions" on public.community_reactions;
drop policy if exists "Authenticated users can view reactions" on public.community_reactions;
create policy "Authenticated users can view reactions"
  on public.community_reactions for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can add reactions" on public.community_reactions;
create policy "Authenticated users can add reactions"
  on public.community_reactions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own reactions" on public.community_reactions;
create policy "Users can delete own reactions"
  on public.community_reactions for delete
  to authenticated
  using ((select auth.uid()) = user_id);


-- 7. Community Replies Table
create table if not exists public.community_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_name text not null default 'Pejuang Pulih' check (char_length(trim(author_name)) between 1 and 64),
  content text not null check (char_length(trim(content)) between 1 and 1200),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_community_replies_post on public.community_replies(post_id);

alter table public.community_replies enable row level security;
alter table public.community_replies force row level security;

drop policy if exists "Anyone can view replies" on public.community_replies;
drop policy if exists "Authenticated users can view replies" on public.community_replies;
create policy "Authenticated users can view replies"
  on public.community_replies for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can reply" on public.community_replies;
create policy "Authenticated users can reply"
  on public.community_replies for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own replies" on public.community_replies;
create policy "Users can delete own replies"
  on public.community_replies for delete
  to authenticated
  using ((select auth.uid()) = user_id);
