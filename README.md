# TomarShikkha

**শেখো। খেলো। এগিয়ে চলো।**

TomarShikkha is an NCTB curriculum-grounded learning platform for Classes 5–10, created by **Md. Iftee Raiyan (EWU, CSE)**.

## What students get

- Smart Practice with chapter, difficulty and dynamic question-count selection
- At least 30 verified practice formats for every available chapter
- No-repeat question cycles and automatic review of mistakes
- Clear answer explanations and NCTB source references
- Mastery Map, Study Routine and learning-focused Grade Report
- Daily Fun Quest, login streak and virtual trophy collection
- Break Zone with Mini Sudoku and Tic-Tac-Toe
- Offline-friendly practice after the first successful visit

## Guardian and owner tools

- Multiple learner profiles under one guardian account
- Cloud-backed progress, routine, rewards and question history
- Simple weekly strengths, weak areas and recommended next step
- Learner profile edit and protected delete controls
- Question reporting and an admin-only review queue
- Privacy-safe aggregate platform analytics without learner names or emails

## Local requirements

- Node.js 22 or newer
- npm

```bash
npm install
npm run test
```

## Supabase setup

1. Open Supabase Dashboard → SQL Editor.
2. Run the complete `supabase/schema.sql`. It is safe to run again after an update.
3. Add these values to Vercel Production, Preview and Development:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Sign in to TomarShikkha once with the owner email.
5. Run the following separately in Supabase SQL Editor:

```sql
insert into public.ts_admin_users (user_id)
select id from auth.users where email = 'your-owner-email@example.com'
on conflict (user_id) do nothing;
```

Replace the placeholder with the exact owner email. The Owner Desk stays hidden for every other account.

## Before public rollout

Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for the Vercel update process and [PILOT_READINESS.md](./PILOT_READINESS.md) before inviting 300–400 students.

## Data safety

TomarShikkha does not require a child’s email. Guest progress stays in the browser; guardian sign-in enables Supabase backup. Virtual rewards have no real-money value.
