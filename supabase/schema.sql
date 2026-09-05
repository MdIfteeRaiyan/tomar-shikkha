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

create table if not exists public.ts_seen_question_sets (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null,
  class_key text not null check (class_key in ('5', '6', '7', '8', '9', '10')),
  subject_key text not null,
  question_ids text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, profile_id, class_key, subject_key),
  foreign key (user_id, profile_id) references public.ts_learner_profiles(user_id, id) on delete cascade
);

create table if not exists public.ts_login_streaks (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null,
  last_login_date date not null,
  streak_count integer not null default 1 check (streak_count between 1 and 10000),
  updated_at timestamptz not null default now(),
  primary key (user_id, profile_id),
  foreign key (user_id, profile_id) references public.ts_learner_profiles(user_id, id) on delete cascade
);

create table if not exists public.ts_study_routines (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null,
  days_per_week integer not null check (days_per_week in (3, 5, 7)),
  minutes_per_day integer not null check (minutes_per_day in (20, 30, 45)),
  reminder_enabled boolean not null default true,
  reminder_time time not null default '19:00',
  updated_at timestamptz not null default now(),
  primary key (user_id, profile_id),
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
alter table public.ts_seen_question_sets enable row level security;
alter table public.ts_login_streaks enable row level security;
alter table public.ts_study_routines enable row level security;
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

drop policy if exists "Guardians manage own seen questions" on public.ts_seen_question_sets;
create policy "Guardians manage own seen questions"
on public.ts_seen_question_sets for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Guardians manage own login streaks" on public.ts_login_streaks;
create policy "Guardians manage own login streaks"
on public.ts_login_streaks for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Guardians manage own study routines" on public.ts_study_routines;
create policy "Guardians manage own study routines"
on public.ts_study_routines for all
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

create index if not exists ts_seen_questions_profile_idx
on public.ts_seen_question_sets (user_id, profile_id, class_key, subject_key);

create index if not exists ts_question_reports_status_date_idx
on public.ts_question_reports (status, created_at desc);

create index if not exists ts_site_feedback_status_date_idx
on public.ts_site_feedback (status, created_at desc);

-- Privacy-safe aggregate metrics for the Owner Desk. No names, emails,
-- answers or individual learner rows are returned to the browser.
create or replace function public.ts_admin_overview()
returns table (
  total_guardians bigint,
  total_learners bigint,
  total_practices bigint,
  active_learners_7d bigint,
  practices_7d bigint,
  average_score_7d numeric
)
language sql
security definer
set search_path = public
as $$
  select
    count(distinct profiles.user_id)::bigint,
    count(distinct (profiles.user_id, profiles.id))::bigint,
    (select count(*) from public.ts_practice_attempts)::bigint,
    (select count(distinct (attempts.user_id, attempts.profile_id)) from public.ts_practice_attempts attempts where attempts.created_at >= (extract(epoch from (now() - interval '7 days')) * 1000)::bigint)::bigint,
    (select count(*) from public.ts_practice_attempts attempts where attempts.created_at >= (extract(epoch from (now() - interval '7 days')) * 1000)::bigint)::bigint,
    (select round(avg(attempts.score::numeric / nullif(attempts.total, 0) * 100), 1) from public.ts_practice_attempts attempts where attempts.created_at >= (extract(epoch from (now() - interval '7 days')) * 1000)::bigint)
  from public.ts_learner_profiles profiles
  where exists (select 1 from public.ts_admin_users admins where admins.user_id = (select auth.uid()));
$$;

revoke all on function public.ts_admin_overview() from public;
grant execute on function public.ts_admin_overview() to authenticated;

-- After signing in once with your owner email, run this separately and replace the email:
-- insert into public.ts_admin_users (user_id)
-- select id from auth.users where email = 'your-owner-email@example.com'
-- on conflict (user_id) do nothing;
