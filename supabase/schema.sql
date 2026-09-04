-- Run this once in Supabase Dashboard > SQL Editor.
-- Every row is protected by Row Level Security and belongs to the signed-in guardian.

create table if not exists public.ts_learner_profiles (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null check (char_length(name) between 1 and 20),
  avatar text not null,
  class_key text not null check (class_key in ('5', '6', '7', '8', '9', '10')),
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

create table if not exists public.ts_daily_quest_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null,
  quest_date date not null,
  quest_index integer not null check (quest_index between 0 and 9),
  stars integer not null check (stars > 0 and stars <= 100),
  created_at timestamptz not null default now(),
  primary key (user_id, profile_id, quest_date, quest_index),
  foreign key (user_id, profile_id) references public.ts_learner_profiles(user_id, id) on delete cascade
);

create table if not exists public.ts_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.ts_question_reports (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  class_key text not null check (class_key in ('5', '6', '7', '8', '9', '10')),
  subject text not null,
  question_id text not null,
  reason text not null check (reason in ('answer', 'wording', 'explanation', 'source')),
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  created_at bigint not null,
  updated_at timestamptz not null default now(),
  unique (user_id, class_key, question_id)
);

create table if not exists public.ts_site_feedback (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('idea', 'problem', 'guardian', 'accessibility')),
  message text not null check (char_length(message) between 10 and 1000),
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  created_at timestamptz not null default now()
);

-- Upgrade older projects that originally allowed only Classes 5–8.
alter table public.ts_learner_profiles
drop constraint if exists ts_learner_profiles_class_key_check;
alter table public.ts_learner_profiles
add constraint ts_learner_profiles_class_key_check
check (class_key in ('5', '6', '7', '8', '9', '10'));

alter table public.ts_learner_profiles enable row level security;
alter table public.ts_practice_attempts enable row level security;
alter table public.ts_reward_redemptions enable row level security;
alter table public.ts_daily_quest_completions enable row level security;
alter table public.ts_admin_users enable row level security;
alter table public.ts_question_reports enable row level security;
alter table public.ts_site_feedback enable row level security;

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

drop policy if exists "Guardians manage own daily quests" on public.ts_daily_quest_completions;
create policy "Guardians manage own daily quests"
on public.ts_daily_quest_completions for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Admins can verify own access" on public.ts_admin_users;
create policy "Admins can verify own access"
on public.ts_admin_users for select
using ((select auth.uid()) = user_id);

drop policy if exists "Learners submit own question reports" on public.ts_question_reports;
create policy "Learners submit own question reports"
on public.ts_question_reports for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Learners and admins read question reports" on public.ts_question_reports;
create policy "Learners and admins read question reports"
on public.ts_question_reports for select
using (
  (select auth.uid()) = user_id
  or exists (select 1 from public.ts_admin_users where user_id = (select auth.uid()))
);

drop policy if exists "Admins review question reports" on public.ts_question_reports;
create policy "Admins review question reports"
on public.ts_question_reports for update
using (exists (select 1 from public.ts_admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.ts_admin_users where user_id = (select auth.uid())));

drop policy if exists "Signed in guardians submit feedback" on public.ts_site_feedback;
create policy "Signed in guardians submit feedback"
on public.ts_site_feedback for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "Guardians and admins read feedback" on public.ts_site_feedback;
create policy "Guardians and admins read feedback"
on public.ts_site_feedback for select
using (
  (select auth.uid()) = user_id
  or exists (select 1 from public.ts_admin_users where user_id = (select auth.uid()))
);

create index if not exists ts_practice_attempts_profile_date_idx
on public.ts_practice_attempts (user_id, profile_id, created_at desc);

create index if not exists ts_reward_redemptions_profile_date_idx
on public.ts_reward_redemptions (user_id, profile_id, created_at desc);

create index if not exists ts_daily_quests_profile_date_idx
on public.ts_daily_quest_completions (user_id, profile_id, quest_date desc);

create index if not exists ts_question_reports_status_date_idx
on public.ts_question_reports (status, created_at desc);

create index if not exists ts_site_feedback_status_date_idx
on public.ts_site_feedback (status, created_at desc);

-- After signing in once with your owner email, run this separately and replace the email:
-- insert into public.ts_admin_users (user_id)
-- select id from auth.users where email = 'your-owner-email@example.com'
-- on conflict (user_id) do nothing;
