# TomarShikkha final update checklist

## 1. Replace the project files

Extract the final ZIP into a separate folder. Copy its contents into the existing `tomar-shikkha` repository folder and choose **Replace** when Windows asks. Do not copy the outer extracted folder itself, and do not delete the existing `.git` folder.

## 2. Update Supabase

Open Supabase Dashboard → SQL Editor, paste the complete contents of `supabase/schema.sql`, and run it once. This adds protected Daily Quest, feedback, report, reward, profile, and practice tables without deleting existing progress.

After signing in to the website once with the owner email, approve that account by running:

```sql
insert into public.ts_admin_users (user_id)
select id from auth.users where email = 'YOUR-OWNER-EMAIL'
on conflict (user_id) do nothing;
```

Replace `YOUR-OWNER-EMAIL` with the exact email used for the magic-link sign-in.

## 3. Confirm Vercel environment variables

Vercel → Project → Settings → Environment Variables must contain:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Apply both to Production, Preview, and Development. Never add a Supabase service-role key to this website.

## 4. Verify locally (optional but recommended)

Open PowerShell inside the repository folder and run:

```powershell
npm.cmd install
npm.cmd run test
```

## 5. Push the update

```powershell
git status
git add .
git commit -m "Launch student-friendly TomarShikkha update"
git push origin main
```

Vercel will deploy the pushed commit automatically.

## 6. Five-minute public check

1. Open the live site in a private/incognito window.
2. Start a 5-question practice and finish it.
3. Check the explanation, result celebration, Mastery Map, and mistake review.
4. Open Fun Quest, earn Stars once, reload, and confirm it stays completed.
5. Redeem one virtual trophy in Break Zone.
6. Add and switch learner profiles.
7. Sign in with guardian email; confirm the account shows **Synced**.
8. Open Guardian View and confirm the weekly summary is readable.
9. Submit a question report and open Privacy, Terms, and Feedback.
10. In browser dev tools, switch the network to Offline and reload once; the previously loaded learning screen should still open.

If Supabase shows a setup error after deployment, rerun the latest `supabase/schema.sql` and then redeploy from Vercel.
