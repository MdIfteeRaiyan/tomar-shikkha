# TomarShikkha Pilot Readiness — 300–400 Students

## Automated gates

- [x] Production build and TypeScript pass
- [x] ESLint pass
- [x] Curriculum verification: minimum 30 practice formats per available chapter
- [x] Duplicate quiz-result protection
- [x] Offline/device-first practice fallback
- [x] Cloud retry and guardian-friendly error states
- [x] Learner data separated by profile and protected by Supabase RLS
- [x] Privacy-safe aggregate Owner analytics
- [x] Page-level and global crash recovery
- [x] Mobile tap, safe-area and text-scaling safeguards
- [x] Security response headers

## Required before inviting the full pilot

- [ ] Run the latest `supabase/schema.sql` in Supabase SQL Editor
- [ ] Confirm the owner account exists in `ts_admin_users`
- [ ] Confirm Vercel Production has both Supabase public environment variables
- [ ] Test guardian magic-link sign-in from two real email providers
- [ ] Test one learner on Android Chrome and one on iPhone Safari
- [ ] Complete one offline quiz, reconnect, and confirm cloud sync
- [ ] Create, edit, switch and remove a test learner profile
- [ ] Submit and review one test question report
- [ ] Check Supabase Auth email quota before sending 300–400 invitations
- [ ] Invite 20–30 students first for a 3–5 day controlled pilot

## Pilot monitoring targets

| Signal | Healthy target | Action when outside target |
|---|---:|---|
| Students who complete first practice | 70%+ | Simplify first mission or instructions |
| Practice save success | 98%+ | Check Supabase logs and network errors |
| Question reports | Below 2% of answered questions | Review reported chapters before expansion |
| Return within 7 days | 35%+ | Improve routine reminders and next mission |
| Mobile crash reports | Below 1% of sessions | Pause expansion and fix affected device flow |

## Rollout sequence

1. Internal test with 3–5 accounts.
2. Controlled pilot with 20–30 students.
3. Fix content and usability issues reported during the first week.
4. Expand to 100 students and observe Supabase/Vercel usage.
5. Expand toward 300–400 only after save success and crash targets remain healthy.

Do not collect a child’s personal email, phone number, school address or other unnecessary personal information. Guardian email is sufficient for cloud backup.
