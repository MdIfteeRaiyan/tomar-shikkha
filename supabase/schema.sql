-- Run this once in Supabase Dashboard > SQL Editor.
-- Every row is protected by Row Level Security and belongs to the signed-in guardian.

create table if not exists public.ts_learner_profiles (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null check (char_length(name) between 1 and 20),
  avatar text not null,
  class_key text not null check (class_key in ('5', '6', '7', '8')),
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.ts_practice_attempts (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null,
  id bigint not null,
  subject text not null,
  chapter text not null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0 and score <= total),
  focus_area text not null,
  created_at bigint not null,
  primary key (user_id, profile_id, id),
  foreign key (user_id, profile_id) references public.ts_learner_profiles(user_id, id) on delete cascade
);

create table if not exists public.ts_reward_redemptions (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null,
  id bigint not null,
  reward_id text not null,
  cost integer not null check (cost > 0),
  created_at bigint not null,
  primary key (user_id, profile_id, id),
  foreign key (user_id, profile_id) references public.ts_learner_profiles(user_id, id) on delete cascade
);

alter table public.ts_learner_profiles enable row level security;
alter table public.ts_practice_attempts enable row level security;
alter table public.ts_reward_redemptions enable row level security;

drop policy if exists "Guardians manage own learner profiles" on public.ts_learner_profiles;
create policy "Guardians manage own learner profiles"
on public.ts_learner_profiles for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Guardians manage own practice attempts" on public.ts_practice_attempts;
create policy "Guardians manage own practice attempts"
on public.ts_practice_attempts for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Guardians manage own virtual rewards" on public.ts_reward_redemptions;
create policy "Guardians manage own virtual rewards"
on public.ts_reward_redemptions for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create index if not exists ts_practice_attempts_profile_date_idx
on public.ts_practice_attempts (user_id, profile_id, created_at desc);

create index if not exists ts_reward_redemptions_profile_date_idx
on public.ts_reward_redemptions (user_id, profile_id, created_at desc);
