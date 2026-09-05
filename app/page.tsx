"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, Atom, BadgeCheck, BookMarked, BookOpen, BookType, BrainCircuit, Calculator, CalendarDays, Check, ChevronRight, CircleAlert, Clock3, Code2, Compass, Dna, ExternalLink, Flag, FlaskConical, Gamepad2, Globe2, HeartHandshake, Languages, Lightbulb, ListChecks, Monitor, Pencil, RotateCcw, ShieldCheck, Sigma, Sparkles, Star, Target, TestTube2, Trash2, Trophy, UserRound, Users, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { scienceQuestions, type ScienceQuestion } from "@/data/class-8-science";
import { class8ScienceMore } from "@/data/class-8-science-expansion";
import { sscBangla, sscBgs, sscEnglish, sscMath, sscScience } from "@/data/class-9-10-core";
import { sscBanglaDepth, sscBgsDepth, sscEnglishDepth, sscMathDepth, sscScienceDepth } from "@/data/class-9-10-core-depth";
import { sscBiology, sscChemistry, sscHigherMath, sscIct, sscPhysics } from "@/data/class-9-10-science-group";
import { sscBanglaFinal, sscBgsFinal, sscBiologyFinal, sscChemistryFinal, sscEnglishFinal, sscHigherMathFinal, sscIctFinal, sscMathFinal, sscPhysicsFinal, sscScienceFinal } from "@/data/class-9-10-final-depth";
import { banglaQuestions, bgsQuestions, englishQuestions, mathQuestions } from "@/data/class-8-main-subjects";
import { class8BanglaDepth, class8BgsDepth, class8EnglishDepth, class8MathDepth } from "@/data/class-8-main-depth";
import { class7BanglaQuestions, class7BgsQuestions, class7EnglishQuestions, class7MathQuestions, class7ScienceQuestions } from "@/data/class-7-main-subjects";
import { class7BanglaDepth, class7BgsDepth, class7EnglishDepth } from "@/data/class-7-language-social-depth";
import { class6BanglaQuestions, class6BgsQuestions, class6EnglishQuestions, class6MathQuestions, class6ScienceQuestions } from "@/data/class-6-main-subjects";
import { class6BanglaDepth, class6BgsDepth, class6EnglishDepth } from "@/data/class-6-language-social-depth";
import { class5BanglaQuestions, class5BgsQuestions, class5EnglishQuestions, class5MathQuestions, class5ScienceQuestions } from "@/data/class-5-main-subjects";
import { class5BanglaDepth, class5BgsDepth, class5EnglishDepth } from "@/data/class-5-language-social-depth";
import { class5MathDepth, class5MathMore, class5ScienceDepth, class5ScienceMore, class6MathDepth, class6MathMore, class6ScienceDepth, class6ScienceMore, class7MathDepth, class7MathMore, class7ScienceDepth, class7ScienceMore } from "@/data/expansion-questions";
import { isCloudConfigured, supabase } from "@/lib/supabase";
import { auditCurriculum } from "@/lib/content-audit";
import { CuriosityPop } from "@/components/curiosity-pop";
import { buildPracticeQuestions, getDifficulty, shuffleQuestions as shuffled, type Difficulty } from "@/lib/quiz-engine";
import { ensureMinimumQuestions } from "@/lib/question-expander";

const ToolLoading = () => <div className="tool-loading" role="status" aria-live="polite"><span />পাতাটি তৈরি হচ্ছে…</div>;
const BreakZone = dynamic(() => import("@/components/play-zone").then((module) => module.BreakZone), { loading: ToolLoading });
const QuestZone = dynamic(() => import("@/components/quest-zone").then((module) => module.QuestZone), { loading: ToolLoading });
const StudyRoutine = dynamic(() => import("@/components/study-routine").then((module) => module.StudyRoutine), { loading: ToolLoading });
const GradeReport = dynamic(() => import("@/components/grade-report").then((module) => module.GradeReport), { loading: ToolLoading });

type PracticeAttempt = { id: number; subject: string; chapter: string; score: number; total: number; focusArea: string; createdAt: number };
type RewardRedemption = { id: number; rewardId: string; cost: number; createdAt: number };
type QuestCompletion = { profileId: string; questDate: string; questIndex: number; stars: number };
type QuestionReport = { questionId: string; reason: string; createdAt: number; status?: "pending" | "reviewed"; classKey?: ClassKey; subject?: string; cloudId?: number };
type SubjectKey = "science" | "math" | "english" | "bangla" | "bgs" | "physics" | "chemistry" | "biology" | "higherMath" | "ict";
type ClassKey = "5" | "6" | "7" | "8" | "9" | "10";
type CatalogSubject = { label: string; questions: ScienceQuestion[] };
const ATTEMPTS_STORAGE_KEY = "tomar-shikkha-attempts-v1";
const PROFILES_STORAGE_KEY = "tomar-shikkha-profiles-v1";
const ACTIVE_PROFILE_KEY = "tomar-shikkha-active-profile-v1";
const REWARDS_STORAGE_KEY = "tomar-shikkha-rewards-v1";
const QUEST_STARS_STORAGE_KEY = "tomar-shikkha-quest-stars-v1";
const QUESTION_REPORTS_STORAGE_KEY = "tomar-shikkha-question-reports-v1";
const SEEN_QUESTIONS_STORAGE_KEY = "tomar-shikkha-seen-questions-v1";
const LOGIN_STREAK_STORAGE_KEY = "tomar-shikkha-login-streak-v1";
const MAGIC_LINK_COOLDOWN_KEY = "tomar-shikkha-magic-link-cooldown-v1";
type LearnerProfile = { id: string; name: string; avatar: string; classKey: ClassKey };
const starterProfile: LearnerProfile = { id: "little-explorer", name: "Little Explorer", avatar: "🚀", classKey: "8" };
const baseCurriculumCatalog: Record<ClassKey, Partial<Record<SubjectKey, CatalogSubject>>> = {
  "5": {
    science: { label: "Science", questions: [...class5ScienceQuestions, ...class5ScienceMore, ...class5ScienceDepth] }, math: { label: "Mathematics", questions: [...class5MathQuestions, ...class5MathMore, ...class5MathDepth] }, english: { label: "English", questions: [...class5EnglishQuestions, ...class5EnglishDepth] }, bangla: { label: "Bangla", questions: [...class5BanglaQuestions, ...class5BanglaDepth] }, bgs: { label: "Bangladesh & Global Studies", questions: [...class5BgsQuestions, ...class5BgsDepth] },
  },
  "6": {
    science: { label: "Science", questions: [...class6ScienceQuestions, ...class6ScienceMore, ...class6ScienceDepth] }, math: { label: "Mathematics", questions: [...class6MathQuestions, ...class6MathMore, ...class6MathDepth] }, english: { label: "English", questions: [...class6EnglishQuestions, ...class6EnglishDepth] }, bangla: { label: "Bangla", questions: [...class6BanglaQuestions, ...class6BanglaDepth] }, bgs: { label: "Bangladesh & Global Studies", questions: [...class6BgsQuestions, ...class6BgsDepth] },
  },
  "7": {
    science: { label: "Science", questions: [...class7ScienceQuestions, ...class7ScienceMore, ...class7ScienceDepth] }, math: { label: "Mathematics", questions: [...class7MathQuestions, ...class7MathMore, ...class7MathDepth] }, english: { label: "English", questions: [...class7EnglishQuestions, ...class7EnglishDepth] }, bangla: { label: "Bangla", questions: [...class7BanglaQuestions, ...class7BanglaDepth] }, bgs: { label: "Bangladesh & Global Studies", questions: [...class7BgsQuestions, ...class7BgsDepth] },
  },
  "8": {
    science: { label: "Science", questions: [...scienceQuestions, ...class8ScienceMore] }, math: { label: "Mathematics", questions: [...mathQuestions, ...class8MathDepth] }, english: { label: "English", questions: [...englishQuestions, ...class8EnglishDepth] }, bangla: { label: "Bangla", questions: [...banglaQuestions, ...class8BanglaDepth] }, bgs: { label: "Bangladesh & Global Studies", questions: [...bgsQuestions, ...class8BgsDepth] },
  },
  "9": { science: { label: "Science", questions: [...sscScience, ...sscScienceDepth, ...sscScienceFinal] }, math: { label: "Mathematics", questions: [...sscMath, ...sscMathDepth, ...sscMathFinal] }, english: { label: "English", questions: [...sscEnglish, ...sscEnglishDepth, ...sscEnglishFinal] }, bangla: { label: "Bangla", questions: [...sscBangla, ...sscBanglaDepth, ...sscBanglaFinal] }, bgs: { label: "Bangladesh & Global Studies", questions: [...sscBgs, ...sscBgsDepth, ...sscBgsFinal] }, physics: { label: "Physics", questions: [...sscPhysics, ...sscPhysicsFinal] }, chemistry: { label: "Chemistry", questions: [...sscChemistry, ...sscChemistryFinal] }, biology: { label: "Biology", questions: [...sscBiology, ...sscBiologyFinal] }, higherMath: { label: "Higher Mathematics", questions: [...sscHigherMath, ...sscHigherMathFinal] }, ict: { label: "ICT", questions: [...sscIct, ...sscIctFinal] } },
  "10": { science: { label: "Science", questions: [...sscScience, ...sscScienceDepth, ...sscScienceFinal] }, math: { label: "Mathematics", questions: [...sscMath, ...sscMathDepth, ...sscMathFinal] }, english: { label: "English", questions: [...sscEnglish, ...sscEnglishDepth, ...sscEnglishFinal] }, bangla: { label: "Bangla", questions: [...sscBangla, ...sscBanglaDepth, ...sscBanglaFinal] }, bgs: { label: "Bangladesh & Global Studies", questions: [...sscBgs, ...sscBgsDepth, ...sscBgsFinal] }, physics: { label: "Physics", questions: [...sscPhysics, ...sscPhysicsFinal] }, chemistry: { label: "Chemistry", questions: [...sscChemistry, ...sscChemistryFinal] }, biology: { label: "Biology", questions: [...sscBiology, ...sscBiologyFinal] }, higherMath: { label: "Higher Mathematics", questions: [...sscHigherMath, ...sscHigherMathFinal] }, ict: { label: "ICT", questions: [...sscIct, ...sscIctFinal] } },
};
const curriculumCatalog = Object.fromEntries(Object.entries(baseCurriculumCatalog).map(([classKey, subjects]) => [classKey, Object.fromEntries(Object.entries(subjects).map(([subjectKey, subject]) => [subjectKey, { ...subject, questions: ensureMinimumQuestions(subject.questions) }]))])) as Record<ClassKey, Partial<Record<SubjectKey, CatalogSubject>>>;
const curriculumTotal = Object.values(curriculumCatalog).reduce((classSum, subjects) => classSum + Object.values(subjects).reduce((subjectSum, subject) => subjectSum + (subject?.questions.length ?? 0), 0), 0);
const coverage = (Object.keys(curriculumCatalog) as ClassKey[]).map((classKey) => {
  const subjects = Object.values(curriculumCatalog[classKey]).filter((subject): subject is CatalogSubject => Boolean(subject));
  const questionTotal = subjects.reduce((sum, subject) => sum + subject.questions.length, 0);
  return { className: `Class ${classKey}`, status: Number(classKey) <= 8 ? "Live" : "SSC Beta", subjects: `${subjects.length} subject tracks • ${questionTotal} practice questions` };
});
const getCatalogSubject = (classKey: ClassKey, subjectKey: SubjectKey): CatalogSubject => curriculumCatalog[classKey][subjectKey] ?? curriculumCatalog[classKey].science!;
const difficultyCopy: Record<Difficulty, { label: string; hint: string }> = {
  easy: { label: "Easy", hint: "Recall & basics" },
  medium: { label: "Medium", hint: "Concept check" },
  hard: { label: "Hard", hint: "Think deeper" },
};
const subjectVisuals: Record<SubjectKey, { icon: LucideIcon; short: string }> = {
  science: { icon: FlaskConical, short: "Science" }, math: { icon: Calculator, short: "Math" }, english: { icon: Languages, short: "English" }, bangla: { icon: BookType, short: "Bangla" }, bgs: { icon: Globe2, short: "BGS" },
  physics: { icon: Atom, short: "Physics" }, chemistry: { icon: TestTube2, short: "Chemistry" }, biology: { icon: Dna, short: "Biology" }, higherMath: { icon: Sigma, short: "Higher Math" }, ict: { icon: Monitor, short: "ICT" },
};

export default function Home() {
  const [screen, setScreen] = useState<"setup" | "quiz" | "result" | "break" | "quest" | "guardian" | "routine" | "grade-report" | "content-check">("setup");
  const [selectedClass, setSelectedClass] = useState<ClassKey>("8");
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>("science");
  const [selectedChapter, setSelectedChapter] = useState("all");
  const [questionCount, setQuestionCount] = useState("10");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [practiceMode, setPracticeMode] = useState<"standard" | "focus">("standard");
  const [quizQuestions, setQuizQuestions] = useState<ScienceQuestion[]>(scienceQuestions.slice(0, 10));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [revealed, setRevealed] = useState(false);
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [questStars, setQuestStars] = useState(0);
  const [questCompletions, setQuestCompletions] = useState<QuestCompletion[]>([]);
  const [profiles, setProfiles] = useState<LearnerProfile[]>([starterProfile]);
  const [activeProfileId, setActiveProfileId] = useState(starterProfile.id);
  const [localReady, setLocalReady] = useState(false);
  const [cloudUserId, setCloudUserId] = useState<string | null>(null);
  const [cloudUserEmail, setCloudUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"guest" | "connecting" | "synced" | "error">("guest");
  const [cloudMessage, setCloudMessage] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isOnline, setIsOnline] = useState(true);
  const [cloudSyncRevision, setCloudSyncRevision] = useState(0);
  const [storageWarning, setStorageWarning] = useState(false);
  const savedQuizSignature = useRef<string | null>(null);
  const [loginStreak, setLoginStreak] = useState(1);
  const earnedStars = useMemo(() => attempts.reduce((sum, attempt) => sum + attempt.score * 10, 0), [attempts]);
  const spentStars = useMemo(() => redemptions.reduce((sum, reward) => sum + reward.cost, 0), [redemptions]);
  const powerStars = Math.max(0, earnedStars + questStars - spentStars);
  const score = useMemo(() => answers.reduce<number>((sum, answer, index) => sum + (answer === quizQuestions[index]?.answer ? 1 : 0), 0), [answers, quizQuestions]);
  const wrongTopics = useMemo(() => quizQuestions.filter((question, index) => answers[index] !== null && answers[index] !== question.answer).map((question) => question.topic), [answers, quizQuestions]);
  const wrongQuestions = useMemo(() => quizQuestions.filter((question, index) => answers[index] !== null && answers[index] !== question.answer), [answers, quizQuestions]);
  const guardianAttempts = useMemo(() => {
    const result: Record<string, PracticeAttempt[]> = {};
    for (const profile of profiles) {
      if (profile.id === activeProfileId) result[profile.id] = attempts;
      else if (typeof window !== "undefined") {
        try { result[profile.id] = JSON.parse(window.localStorage.getItem(`${ATTEMPTS_STORAGE_KEY}:${profile.id}`) ?? "[]"); } catch { result[profile.id] = []; }
      }
    }
    return result;
  }, [profiles, activeProfileId, attempts]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const savedProfiles = JSON.parse(window.localStorage.getItem(PROFILES_STORAGE_KEY) ?? "null") as LearnerProfile[] | null;
        const nextProfiles = savedProfiles?.length ? savedProfiles : [starterProfile];
        const savedActiveId = window.localStorage.getItem(ACTIVE_PROFILE_KEY) ?? nextProfiles[0].id;
        const nextActive = nextProfiles.find((profile) => profile.id === savedActiveId) ?? nextProfiles[0];
        setProfiles(nextProfiles); setActiveProfileId(nextActive.id); setSelectedClass(nextActive.classKey);
        const savedAttempts = window.localStorage.getItem(`${ATTEMPTS_STORAGE_KEY}:${nextActive.id}`) ?? window.localStorage.getItem(ATTEMPTS_STORAGE_KEY);
        if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
        setRedemptions(JSON.parse(window.localStorage.getItem(`${REWARDS_STORAGE_KEY}:${nextActive.id}`) ?? "[]"));
        setQuestStars(Number(window.localStorage.getItem(`${QUEST_STARS_STORAGE_KEY}:${nextActive.id}`) ?? "0"));
      } catch {
        setAttempts([]); setRedemptions([]); setQuestStars(0);
      } finally { setLocalReady(true); }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!localReady) return;
    queueMicrotask(() => {
      const today = new Date().toLocaleDateString("en-CA");
      const key = `${LOGIN_STREAK_STORAGE_KEY}:${activeProfileId}`;
      try {
        const saved = JSON.parse(window.localStorage.getItem(key) ?? "null") as { lastDate: string; count: number } | null;
        if (saved?.lastDate === today) { setLoginStreak(saved.count); return; }
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const count = saved?.lastDate === yesterday.toLocaleDateString("en-CA") ? saved.count + 1 : 1;
        window.localStorage.setItem(key, JSON.stringify({ lastDate: today, count })); setLoginStreak(count);
      } catch { setLoginStreak(1); }
    });
  }, [activeProfileId, localReady]);

  useEffect(() => {
    if (!localReady || !supabase || !cloudUserId) return;
    const cloud = supabase;
    let active = true;
    const syncStreak = async () => {
      const today = new Date().toLocaleDateString("en-CA");
      const yesterdayDate = new Date(); yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toLocaleDateString("en-CA");
      const { data } = await cloud.from("ts_login_streaks").select("last_login_date,streak_count").eq("profile_id", activeProfileId).maybeSingle();
      const nextCount = data?.last_login_date === today ? Math.max(loginStreak, data.streak_count) : data?.last_login_date === yesterday ? data.streak_count + 1 : loginStreak;
      const { error } = await cloud.from("ts_login_streaks").upsert({ user_id: cloudUserId, profile_id: activeProfileId, last_login_date: today, streak_count: nextCount, updated_at: new Date().toISOString() }, { onConflict: "user_id,profile_id" });
      if (!active || error) return;
      if (nextCount !== loginStreak) { setLoginStreak(nextCount); window.localStorage.setItem(`${LOGIN_STREAK_STORAGE_KEY}:${activeProfileId}`, JSON.stringify({ lastDate: today, count: nextCount })); }
    };
    void syncStreak();
    return () => { active = false; };
  }, [activeProfileId, cloudUserId, localReady, loginStreak]);

  useEffect(() => {
    const updateConnection = () => setIsOnline(window.navigator.onLine);
    updateConnection();
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(async (registration) => {
        const worker = registration.active ?? registration.waiting ?? registration.installing;
        const assetUrls = performance.getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((url) => url.startsWith(window.location.origin));
        worker?.postMessage({ type: "CACHE_URLS", urls: [window.location.href, ...assetUrls] });
      }).catch(() => { /* Practice still works online when offline setup is unavailable. */ });
    }
    return () => { window.removeEventListener("online", updateConnection); window.removeEventListener("offline", updateConnection); };
  }, []);

  useEffect(() => {
    if (!localReady || !supabase) return;
    const cloud = supabase;
    const loadCloud = async (userId: string, email: string | null) => {
      setCloudStatus("connecting"); setCloudUserId(userId); setCloudUserEmail(email);
      const [{ data: cloudProfiles, error: profileError }, { data: cloudAttempts, error: attemptError }, { data: cloudRewards, error: rewardError }, { data: cloudQuests, error: questError }, { data: cloudSeen, error: seenError }, { data: adminRow }] = await Promise.all([
        cloud.from("ts_learner_profiles").select("id,name,avatar,class_key").order("created_at"),
        cloud.from("ts_practice_attempts").select("profile_id,id,subject,chapter,score,total,focus_area,created_at").order("created_at", { ascending: false }),
        cloud.from("ts_reward_redemptions").select("profile_id,id,reward_id,cost,created_at").order("created_at", { ascending: false }),
        cloud.from("ts_daily_quest_completions").select("profile_id,quest_date,quest_index,stars").order("quest_date", { ascending: false }),
        cloud.from("ts_seen_question_sets").select("profile_id,class_key,subject_key,question_ids"),
        cloud.from("ts_admin_users").select("user_id").eq("user_id", userId).maybeSingle(),
      ]);
      setIsAdmin(Boolean(adminRow));
      if (profileError || attemptError || rewardError || questError || seenError) { setCloudStatus("error"); setCloudMessage("Cloud setupটি এখনো complete হয়নি। Updated SQL setup check করুন।"); return; }
      const restoredQuestCompletions: QuestCompletion[] = (cloudQuests ?? []).map((item) => ({ profileId: item.profile_id, questDate: item.quest_date, questIndex: item.quest_index, stars: item.stars }));
      setQuestCompletions(restoredQuestCompletions);
      for (const item of cloudSeen ?? []) {
        const key = `${SEEN_QUESTIONS_STORAGE_KEY}:${item.profile_id}:${item.class_key}:${item.subject_key}`;
        let deviceIds: string[] = []; try { deviceIds = JSON.parse(window.localStorage.getItem(key) ?? "[]"); } catch { /* Restore the cloud history. */ }
        window.localStorage.setItem(key, JSON.stringify([...new Set([...(item.question_ids ?? []), ...deviceIds])]));
      }
      if (cloudProfiles?.length) {
        const cloudProfileList = cloudProfiles.map((profile) => ({ id: profile.id, name: profile.name, avatar: profile.avatar, classKey: profile.class_key as ClassKey }));
        const restoredProfiles = [...cloudProfileList, ...profiles.filter((profile) => !cloudProfileList.some((cloudProfile) => cloudProfile.id === profile.id))];
        const restoredActive = restoredProfiles.find((profile) => profile.id === activeProfileId) ?? restoredProfiles[0];
        setProfiles(restoredProfiles); setActiveProfileId(restoredActive.id); setSelectedClass(restoredActive.classKey);
        window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(restoredProfiles)); window.localStorage.setItem(ACTIVE_PROFILE_KEY, restoredActive.id);
        for (const profile of restoredProfiles) {
          let localAttempts: PracticeAttempt[] = []; let localRewards: RewardRedemption[] = [];
          try { localAttempts = JSON.parse(window.localStorage.getItem(`${ATTEMPTS_STORAGE_KEY}:${profile.id}`) ?? "[]"); localRewards = JSON.parse(window.localStorage.getItem(`${REWARDS_STORAGE_KEY}:${profile.id}`) ?? "[]"); } catch { /* Ignore malformed device data and restore the cloud copy. */ }
          const cloudProfileAttempts = (cloudAttempts ?? []).filter((attempt) => attempt.profile_id === profile.id).map((attempt) => ({ id: Number(attempt.id), subject: attempt.subject, chapter: attempt.chapter, score: attempt.score, total: attempt.total, focusArea: attempt.focus_area, createdAt: Number(attempt.created_at) }));
          const cloudProfileRewards = (cloudRewards ?? []).filter((reward) => reward.profile_id === profile.id).map((reward) => ({ id: Number(reward.id), rewardId: reward.reward_id, cost: reward.cost, createdAt: Number(reward.created_at) }));
          const profileAttempts = [...new Map([...cloudProfileAttempts, ...localAttempts].map((attempt) => [attempt.id, attempt])).values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, 50);
          const profileRewards = [...new Map([...cloudProfileRewards, ...localRewards].map((reward) => [reward.id, reward])).values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
          window.localStorage.setItem(`${ATTEMPTS_STORAGE_KEY}:${profile.id}`, JSON.stringify(profileAttempts));
          window.localStorage.setItem(`${REWARDS_STORAGE_KEY}:${profile.id}`, JSON.stringify(profileRewards));
          if (profile.id === restoredActive.id) {
            setAttempts(profileAttempts); setRedemptions(profileRewards);
            const cloudQuestStars = restoredQuestCompletions.filter((item) => item.profileId === profile.id).reduce((sum, item) => sum + item.stars, 0);
            if (cloudQuestStars > 0) { setQuestStars(cloudQuestStars); window.localStorage.setItem(`${QUEST_STARS_STORAGE_KEY}:${profile.id}`, String(cloudQuestStars)); }
          }
        }
      } else {
        await cloud.from("ts_learner_profiles").upsert(profiles.map((profile) => ({ user_id: userId, id: profile.id, name: profile.name, avatar: profile.avatar, class_key: profile.classKey })), { onConflict: "user_id,id" });
      }
      try {
        const localReports = JSON.parse(window.localStorage.getItem(QUESTION_REPORTS_STORAGE_KEY) ?? "[]") as QuestionReport[];
        if (localReports.length) {
          const { data: existingReports } = await cloud.from("ts_question_reports").select("class_key,question_id").eq("user_id", userId);
          const existingKeys = new Set((existingReports ?? []).map((report) => `${report.class_key}:${report.question_id}`));
          const unsynced = localReports.filter((report) => report.classKey && report.subject && !existingKeys.has(`${report.classKey}:${report.questionId}`)).map((report) => ({ user_id: userId, class_key: report.classKey!, subject: report.subject!, question_id: report.questionId, reason: report.reason, status: "pending", created_at: report.createdAt }));
          if (unsynced.length) await cloud.from("ts_question_reports").insert(unsynced);
        }
      } catch { /* Device reports stay local when cloud sync is unavailable. */ }
      setCloudStatus("synced"); setCloudMessage("Progress is safely synced.");
    };
    cloud.auth.getUser().then(({ data }) => { if (data.user) void loadCloud(data.user.id, data.user.email ?? null); });
    const { data: listener } = cloud.auth.onAuthStateChange((_event, session) => { if (session?.user) void loadCloud(session.user.id, session.user.email ?? null); else { setCloudUserId(null); setCloudUserEmail(null); setIsAdmin(false); setCloudStatus("guest"); } });
    return () => listener.subscription.unsubscribe();
  // Cloud hydration intentionally runs once after local state is ready; later changes use the sync effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localReady]);

  useEffect(() => {
    if (!localReady || !supabase || !cloudUserId) return;
    const cloud = supabase;
    const timer = window.setTimeout(async () => {
      if (!window.navigator.onLine) { setCloudStatus("error"); setCloudMessage("Internet এলে আবার sync করুন—এই device-এ progress নিরাপদ আছে।"); return; }
      setCloudStatus("connecting");
      const profileRows = profiles.map((profile) => ({ user_id: cloudUserId, id: profile.id, name: profile.name, avatar: profile.avatar, class_key: profile.classKey }));
      const attemptRows = attempts.map((attempt) => ({ user_id: cloudUserId, profile_id: activeProfileId, id: attempt.id, subject: attempt.subject, chapter: attempt.chapter, score: attempt.score, total: attempt.total, focus_area: attempt.focusArea, created_at: attempt.createdAt }));
      const rewardRows = redemptions.map((reward) => ({ user_id: cloudUserId, profile_id: activeProfileId, id: reward.id, reward_id: reward.rewardId, cost: reward.cost, created_at: reward.createdAt }));
      const questRows = questCompletions.map((item) => ({ user_id: cloudUserId, profile_id: item.profileId, quest_date: item.questDate, quest_index: item.questIndex, stars: item.stars }));
      const [profileResult, attemptResult, rewardResult, questResult] = await Promise.all([
        cloud.from("ts_learner_profiles").upsert(profileRows, { onConflict: "user_id,id" }),
        attemptRows.length ? cloud.from("ts_practice_attempts").upsert(attemptRows, { onConflict: "user_id,profile_id,id" }) : Promise.resolve({ error: null }),
        rewardRows.length ? cloud.from("ts_reward_redemptions").upsert(rewardRows, { onConflict: "user_id,profile_id,id" }) : Promise.resolve({ error: null }),
        questRows.length ? cloud.from("ts_daily_quest_completions").upsert(questRows, { onConflict: "user_id,profile_id,quest_date,quest_index", ignoreDuplicates: true }) : Promise.resolve({ error: null }),
      ]);
      const failed = profileResult.error || attemptResult.error || rewardResult.error || questResult.error;
      setCloudStatus(failed ? "error" : "synced"); setCloudMessage(failed ? "Cloud sync শেষ হয়নি। Device-এর progress নিরাপদ আছে—আবার চেষ্টা করুন।" : "Progress is safely synced.");
    }, 700);
    return () => window.clearTimeout(timer);
  }, [profiles, attempts, redemptions, questCompletions, activeProfileId, cloudUserId, localReady, cloudSyncRevision, isOnline]);

  const sendMagicLink = async (email: string) => {
    if (!supabase) { setCloudStatus("error"); setCloudMessage("Cloud connection is not configured yet."); return; }
    const lastRequest = Number(window.localStorage.getItem(MAGIC_LINK_COOLDOWN_KEY) ?? "0");
    const secondsLeft = Math.ceil((lastRequest + 60_000 - Date.now()) / 1000);
    if (secondsLeft > 0) { setCloudStatus("error"); setCloudMessage(`নতুন link চাইতে ${secondsLeft} সেকেন্ড অপেক্ষা করুন। আগের email-টি আগে check করুন।`); return; }
    const cloud = supabase;
    setCloudStatus("connecting");
    const { error } = await cloud.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) { const limited = /rate|limit|exceed|too many/i.test(error.message); setCloudStatus("error"); setCloudMessage(limited ? "অল্প সময়ে অনেকবার link চাওয়া হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন—আগের valid link থাকলে সেটিও খুলতে পারেন।" : "Email link পাঠানো যায়নি। Address ও internet connection দেখে আবার চেষ্টা করুন।"); return; }
    window.localStorage.setItem(MAGIC_LINK_COOLDOWN_KEY, String(Date.now()));
    setCloudMessage("Email পাঠানো হয়েছে—magic linkটি খুললেই progress sync হবে।");
  };
  const signOutCloud = async () => { if (supabase) await supabase.auth.signOut(); setCloudUserId(null); setCloudUserEmail(null); setIsAdmin(false); setCloudStatus("guest"); setCloudMessage(""); setScreen("setup"); };

  const saveQuizResult = () => {
    const signature = `${activeProfileId}:${quizQuestions.map((question) => question.id).join(",")}:${answers.join(",")}`;
    if (savedQuizSignature.current === signature) return;
    savedQuizSignature.current = signature;
    setSaveState("saving");
    const catalog = getCatalogSubject(selectedClass, selectedSubject);
    const chapterName = selectedChapter === "all" ? `Class ${selectedClass} • Mixed Practice` : `Class ${selectedClass} • ${quizQuestions[0]?.chapter ?? catalog.label}`;
    const completedAt = Date.now();
    const attempt: PracticeAttempt = {
      id: completedAt,
      subject: catalog.label,
      chapter: chapterName,
      score,
      total: quizQuestions.length,
      focusArea: wrongTopics[0] ?? "Revision Complete",
      createdAt: completedAt,
    };
    try {
      const nextAttempts = [attempt, ...attempts].filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index).slice(0, 50);
      window.localStorage.setItem(`${ATTEMPTS_STORAGE_KEY}:${activeProfileId}`, JSON.stringify(nextAttempts));
      const seenKey = `${SEEN_QUESTIONS_STORAGE_KEY}:${activeProfileId}:${selectedClass}:${selectedSubject}`;
      const seen = JSON.parse(window.localStorage.getItem(seenKey) ?? "[]") as string[];
      const nextSeen = [...new Set([...seen, ...quizQuestions.map((question) => question.id)])];
      window.localStorage.setItem(seenKey, JSON.stringify(nextSeen));
      setAttempts(nextAttempts); setStorageWarning(false);
      if (supabase && cloudUserId) void supabase.from("ts_seen_question_sets").upsert({ user_id: cloudUserId, profile_id: activeProfileId, class_key: selectedClass, subject_key: selectedSubject, question_ids: nextSeen, updated_at: new Date().toISOString() }, { onConflict: "user_id,profile_id,class_key,subject_key" });
      setSaveState("saved");
    } catch {
      savedQuizSignature.current = null; setStorageWarning(true); setSaveState("error");
    }
  };

  const switchProfile = (profileId: string) => {
    const profile = profiles.find((item) => item.id === profileId); if (!profile) return;
    setActiveProfileId(profileId); setSelectedClass(profile.classKey); setSelectedChapter("all"); setScreen("setup");
    window.localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    try {
      setAttempts(JSON.parse(window.localStorage.getItem(`${ATTEMPTS_STORAGE_KEY}:${profileId}`) ?? "[]"));
      setRedemptions(JSON.parse(window.localStorage.getItem(`${REWARDS_STORAGE_KEY}:${profileId}`) ?? "[]"));
      const localQuestStars = Number(window.localStorage.getItem(`${QUEST_STARS_STORAGE_KEY}:${profileId}`) ?? "0");
      const cloudQuestStars = questCompletions.filter((item) => item.profileId === profileId).reduce((sum, item) => sum + item.stars, 0);
      setQuestStars(Math.max(localQuestStars, cloudQuestStars));
    } catch { setAttempts([]); setRedemptions([]); setQuestStars(0); }
  };
  const addProfile = (name: string, classKey: ClassKey) => {
    const cleanName = name.trim().slice(0, 20); if (!cleanName) return;
    const avatars = ["🚀", "🦊", "🐼", "🦁", "🦉", "🐯"];
    const profile = { id: `learner-${Date.now()}`, name: cleanName, avatar: avatars[profiles.length % avatars.length], classKey };
    const nextProfiles = [...profiles, profile]; setProfiles(nextProfiles); setActiveProfileId(profile.id); setSelectedClass(profile.classKey); setSelectedChapter("all"); setAttempts([]); setRedemptions([]); setQuestStars(0); setScreen("setup");
    window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles)); window.localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
  };
  const updateProfile = (profileId: string, name: string, classKey: ClassKey) => {
    const cleanName = name.trim().slice(0, 20); if (!cleanName) return false;
    const nextProfiles = profiles.map((profile) => profile.id === profileId ? { ...profile, name: cleanName, classKey } : profile);
    setProfiles(nextProfiles); window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles));
    if (profileId === activeProfileId) { setSelectedClass(classKey); setSelectedChapter("all"); }
    return true;
  };
  const removeProfile = async (profileId: string) => {
    if (profiles.length <= 1) return false;
    if (supabase && cloudUserId) { const { error } = await supabase.from("ts_learner_profiles").delete().eq("id", profileId).eq("user_id", cloudUserId); if (error) return false; }
    const nextProfiles = profiles.filter((profile) => profile.id !== profileId); const nextActive = activeProfileId === profileId ? nextProfiles[0] : profiles.find((profile) => profile.id === activeProfileId) ?? nextProfiles[0];
    setProfiles(nextProfiles); window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles));
    const exactKeys = [`${ATTEMPTS_STORAGE_KEY}:${profileId}`, `${REWARDS_STORAGE_KEY}:${profileId}`, `${QUEST_STARS_STORAGE_KEY}:${profileId}`, `${LOGIN_STREAK_STORAGE_KEY}:${profileId}`, `tomar-shikkha-routine-v1:${profileId}`];
    exactKeys.forEach((key) => window.localStorage.removeItem(key));
    for (let index = window.localStorage.length - 1; index >= 0; index -= 1) { const key = window.localStorage.key(index); if (key?.includes(`:${profileId}:`) && (key.startsWith(SEEN_QUESTIONS_STORAGE_KEY) || key.startsWith("tomar-shikkha-quest-complete-v2"))) window.localStorage.removeItem(key); }
    if (activeProfileId === profileId) switchProfile(nextActive.id);
    return true;
  };
  const redeemReward = (rewardId: string, cost: number) => {
    let currentRewards = redemptions;
    try { currentRewards = JSON.parse(window.localStorage.getItem(`${REWARDS_STORAGE_KEY}:${activeProfileId}`) ?? "[]"); } catch { currentRewards = redemptions; }
    const availableStars = Math.max(0, earnedStars + questStars - currentRewards.reduce((sum, reward) => sum + reward.cost, 0));
    if (cost > availableStars) return false;
    const redeemedAt = Date.now();
    const reward = { id: redeemedAt, rewardId, cost, createdAt: redeemedAt };
    const next = [reward, ...currentRewards].slice(0, 100);
    setRedemptions(next);
    window.localStorage.setItem(`${REWARDS_STORAGE_KEY}:${activeProfileId}`, JSON.stringify(next));
    return true;
  };
  const earnQuestStars = (stars: number, questIndex: number, questDate: string) => {
    const alreadyEarned = questCompletions.some((item) => item.profileId === activeProfileId && item.questDate === questDate && item.questIndex === questIndex);
    if (alreadyEarned) return;
    setQuestCompletions((items) => [...items, { profileId: activeProfileId, questDate, questIndex, stars }]);
    setQuestStars((currentStars) => {
      const nextStars = currentStars + stars;
      window.localStorage.setItem(`${QUEST_STARS_STORAGE_KEY}:${activeProfileId}`, String(nextStars));
      return nextStars;
    });
  };

  const startQuiz = () => {
    const subjectQuestions = getCatalogSubject(selectedClass, selectedSubject).questions;
    const chapterPool = selectedChapter === "all" ? subjectQuestions : subjectQuestions.filter((q) => String(q.chapterNo) === selectedChapter);
    const seenKey = `${SEEN_QUESTIONS_STORAGE_KEY}:${activeProfileId}:${selectedClass}:${selectedSubject}`;
    let seen: string[] = []; try { seen = JSON.parse(window.localStorage.getItem(seenKey) ?? "[]"); } catch { /* Start with a fresh history. */ }
    let freshPool = chapterPool.filter((question) => !seen.includes(question.id));
    if (!freshPool.length) {
      const chapterIds = new Set(chapterPool.map((question) => question.id));
      window.localStorage.setItem(seenKey, JSON.stringify(seen.filter((id) => !chapterIds.has(id))));
      freshPool = chapterPool;
    }
    const requestedCount = questionCount === "all" ? freshPool.length : Number(questionCount);
    const nextQuestions = buildPracticeQuestions(freshPool, requestedCount, difficulty);
    savedQuizSignature.current = null; setPracticeMode("standard"); setQuizQuestions(nextQuestions); setAnswers(Array(nextQuestions.length).fill(null)); setCurrent(0); setRevealed(false); setSaveState("idle"); setScreen("quiz");
  };
  const startChapterPractice = (chapterValue: string) => {
    const subjectQuestions = getCatalogSubject(selectedClass, selectedSubject).questions;
    const chapterPool = subjectQuestions.filter((question) => String(question.chapterNo) === chapterValue);
    const seenKey = `${SEEN_QUESTIONS_STORAGE_KEY}:${activeProfileId}:${selectedClass}:${selectedSubject}`;
    let seen: string[] = []; try { seen = JSON.parse(window.localStorage.getItem(seenKey) ?? "[]"); } catch { /* Start with a fresh history. */ }
    let freshPool = chapterPool.filter((question) => !seen.includes(question.id));
    if (!freshPool.length) { const chapterIds = new Set(chapterPool.map((question) => question.id)); window.localStorage.setItem(seenKey, JSON.stringify(seen.filter((id) => !chapterIds.has(id)))); freshPool = chapterPool; }
    const requestedCount = questionCount === "all" ? freshPool.length : Number(questionCount);
    const nextQuestions = buildPracticeQuestions(freshPool, requestedCount, difficulty);
    if (!nextQuestions.length) return;
    savedQuizSignature.current = null; setSelectedChapter(chapterValue); setPracticeMode("standard"); setQuizQuestions(nextQuestions); setAnswers(Array(nextQuestions.length).fill(null)); setCurrent(0); setRevealed(false); setSaveState("idle"); setScreen("quiz");
  };
  const startFocusedPractice = () => {
    if (!wrongQuestions.length) { startQuiz(); return; }
    const source = getCatalogSubject(selectedClass, selectedSubject).questions;
    const weakChapters = new Set(wrongQuestions.map((question) => question.chapterNo));
    const related = shuffled(source.filter((question) => weakChapters.has(question.chapterNo)));
    const relatedIds = new Set(related.map((question) => question.id));
    const support = shuffled(source.filter((question) => !relatedIds.has(question.id) && getDifficulty(question) === difficulty));
    const nextQuestions = [...related, ...support].slice(0, Math.min(10, source.length));
    savedQuizSignature.current = null; setPracticeMode("focus"); setQuizQuestions(nextQuestions); setAnswers(Array(nextQuestions.length).fill(null)); setCurrent(0); setRevealed(false); setSaveState("idle"); setScreen("quiz");
  };
  const startSmartMission = () => {
    const latest = attempts[0];
    const detectedClass = latest?.chapter.match(/Class (10|[5-9])/)?.[1] as ClassKey | undefined;
    const missionClass = detectedClass ?? selectedClass;
    const subjectEntry = Object.entries(curriculumCatalog[missionClass]).find(([, subject]) => subject.label === latest?.subject) as [SubjectKey, { label: string; questions: ScienceQuestion[] }] | undefined;
    const missionSubject = subjectEntry?.[0] ?? selectedSubject;
    const source = getCatalogSubject(missionClass, missionSubject).questions;
    const weakQuestions = latest && latest.focusArea !== "Revision Complete" ? source.filter((question) => question.topic === latest.focusArea) : [];
    const weakChapters = new Set(weakQuestions.map((question) => question.chapterNo));
    const related = weakChapters.size ? source.filter((question) => weakChapters.has(question.chapterNo)) : source;
    const nextQuestions = shuffled([...new Map([...weakQuestions, ...related].map((question) => [question.id, question])).values()]).slice(0, Math.min(7, related.length));
    setSelectedClass(missionClass); setSelectedSubject(missionSubject); setSelectedChapter(weakQuestions[0] ? String(weakQuestions[0].chapterNo) : "all");
    savedQuizSignature.current = null; setPracticeMode(weakQuestions.length ? "focus" : "standard"); setQuizQuestions(nextQuestions); setAnswers(Array(nextQuestions.length).fill(null)); setCurrent(0); setRevealed(false); setSaveState("idle"); setScreen("quiz");
  };
  const chooseAnswer = (index: number) => { if (!revealed) { const next = [...answers]; next[current] = index; setAnswers(next); } };
  const nextQuestion = () => {
    if (!revealed) { setRevealed(true); return; }
    if (current === quizQuestions.length - 1) { saveQuizResult(); setScreen("result"); return; }
    setCurrent((value) => value + 1); setRevealed(false);
  };
  const showSection = (id: string) => {
    setScreen("setup");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  return <><a className="skip-link" href="#main-content">মূল শেখার অংশে যান</a><main id="main-content" className="min-h-screen" tabIndex={-1}>
    <header className="site-header"><div className="shell header-inner">
      <button className="brand" onClick={() => setScreen("setup")} aria-label="TomarShikkha home"><span className="brand-mark">ত</span><span className="brand-name">Tomar<span>Shikkha</span></span></button>
      <nav className="main-nav" aria-label="প্রধান মেনু"><button className={`nav-link ${["setup", "quiz", "result"].includes(screen) ? "active" : ""}`} onClick={() => showSection("practice-builder")}>Smart Practice</button><button className="nav-link" onClick={() => showSection("curriculum-map")}>Mastery Map</button><button className={`nav-link ${screen === "quest" ? "active" : ""}`} onClick={() => setScreen("quest")}><Compass size={17} /> Fun Quest</button><button className={`nav-link ${screen === "break" ? "active" : ""}`} onClick={() => setScreen("break")}><Gamepad2 size={17} /> Break Zone</button></nav>
      <button className={`guardian-link ${screen === "guardian" ? "active" : ""}`} onClick={() => setScreen("guardian")}><ShieldCheck size={17} /><span>Guardian View</span></button>
      <div className={`connection-pill ${isOnline ? "online" : "offline"}`} role="status" aria-live="polite"><span aria-hidden="true">{isOnline ? "●" : "↓"}</span><span>{isOnline ? "Online" : "Offline practice"}</span></div>
      <AccountMenu attempts={attempts} selectedClass={selectedClass} powerStars={powerStars} profiles={profiles} activeProfileId={activeProfileId} onSwitch={switchProfile} onAdd={addProfile} cloudConfigured={isCloudConfigured} cloudUserEmail={cloudUserEmail} cloudStatus={cloudStatus} cloudMessage={cloudMessage} onCloudSignIn={sendMagicLink} onCloudSignOut={signOutCloud} onCloudRetry={() => setCloudSyncRevision((value) => value + 1)} />
    </div></header>{storageWarning && <div className="storage-warning" role="alert"><CircleAlert size={18} /><span><strong>এই device-এ progress save করা যাচ্ছে না।</strong> Browser storage খালি করুন অথবা guardian account দিয়ে cloud backup চালু করুন।</span><button onClick={() => setStorageWarning(false)} aria-label="বার্তাটি বন্ধ করুন">×</button></div>}
    {screen === "setup" && <SetupScreen isAdmin={isAdmin} loginStreak={loginStreak} activeProfileId={activeProfileId} onStart={startQuiz} onStartChapter={startChapterPractice} onSmartMission={startSmartMission} onQuest={() => setScreen("quest")} onBreak={() => setScreen("break")} onRoutine={() => setScreen("routine")} onGradeReport={() => setScreen("grade-report")} onContentCheck={() => setScreen("content-check")} attempts={attempts} selectedClass={selectedClass} setSelectedClass={(value) => { setSelectedClass(value); setSelectedSubject("science"); setSelectedChapter("all"); }} selectedSubject={selectedSubject} setSelectedSubject={(value) => { setSelectedSubject(value); setSelectedChapter("all"); }} selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter} questionCount={questionCount} setQuestionCount={setQuestionCount} difficulty={difficulty} setDifficulty={setDifficulty} />}
    {screen === "quiz" && <QuizScreen cloudUserId={cloudUserId} questions={quizQuestions} classLabel={selectedClass} subjectLabel={getCatalogSubject(selectedClass, selectedSubject).label} difficulty={difficulty} practiceMode={practiceMode} current={current} answer={answers[current]} revealed={revealed} onAnswer={chooseAnswer} onNext={nextQuestion} onBack={() => { if (current === 0) setScreen("setup"); else { setCurrent((v) => v - 1); setRevealed(true); } }} />}
    {screen === "result" && <ResultScreen score={score} total={quizQuestions.length} wrongTopics={wrongTopics} saveState={saveState} onRetry={startQuiz} onFocus={startFocusedPractice} onHome={() => setScreen("setup")} />}
    {screen === "break" && <BreakZone onBack={() => setScreen("setup")} powerStars={powerStars} redemptions={redemptions} onRedeem={redeemReward} />}
    {screen === "quest" && <QuestZone classKey={selectedClass} profileId={activeProfileId} powerStars={powerStars} cloudCompleted={questCompletions.filter((item) => item.profileId === activeProfileId && item.questDate === new Date().toLocaleDateString("en-CA")).map((item) => item.questIndex)} onEarn={earnQuestStars} onBack={() => setScreen("setup")} />}
    {screen === "guardian" && <GuardianDashboard profiles={profiles} attemptsByProfile={guardianAttempts} powerStars={powerStars} cloudUserEmail={cloudUserEmail} cloudStatus={cloudStatus} onBack={() => setScreen("setup")} onOpenLearner={(profileId) => switchProfile(profileId)} onUpdateLearner={updateProfile} onRemoveLearner={removeProfile} />}
    {screen === "routine" && <StudyRoutine classKey={selectedClass} profileId={activeProfileId} cloudUserId={cloudUserId} subjects={Object.values(curriculumCatalog[selectedClass]).filter((subject): subject is CatalogSubject => Boolean(subject)).map((subject) => ({ subject: subject.label, chapters: [...new Set(subject.questions.map((question) => question.chapter))], priority: attempts.filter((attempt) => attempt.subject === subject.label).length ? 100 - Math.round(attempts.filter((attempt) => attempt.subject === subject.label).reduce((sum, attempt) => sum + attempt.score / attempt.total * 100, 0) / attempts.filter((attempt) => attempt.subject === subject.label).length) : 65 }))} onBack={() => setScreen("setup")} />}
    {screen === "grade-report" && <GradeReport attempts={attempts} onBack={() => setScreen("setup")} />}
    {screen === "content-check" && isAdmin && <ContentVerification cloudUserId={cloudUserId} onBack={() => setScreen("setup")} />}
    <CuriosityPop enabled={screen === "setup" || screen === "break"} />
  </main></>;
}

function SetupScreen({ isAdmin, loginStreak, activeProfileId, onStart, onStartChapter, onSmartMission, onQuest, onBreak, onRoutine, onGradeReport, onContentCheck, attempts, selectedClass, setSelectedClass, selectedSubject, setSelectedSubject, selectedChapter, setSelectedChapter, questionCount, setQuestionCount, difficulty, setDifficulty }: { isAdmin: boolean; loginStreak: number; activeProfileId: string; onStart: () => void; onStartChapter: (chapterValue: string) => void; onSmartMission: () => void; onQuest: () => void; onBreak: () => void; onRoutine: () => void; onGradeReport: () => void; onContentCheck: () => void; attempts: PracticeAttempt[]; selectedClass: ClassKey; setSelectedClass: (value: ClassKey) => void; selectedSubject: SubjectKey; setSelectedSubject: (value: SubjectKey) => void; selectedChapter: string; setSelectedChapter: (value: string) => void; questionCount: string; setQuestionCount: (value: string) => void; difficulty: Difficulty; setDifficulty: (value: Difficulty) => void }) {
  const [currentTime] = useState(() => Date.now());
  const [masteryFilter, setMasteryFilter] = useState<"all" | "priority" | "revision" | "mastered" | "new">("all");
  const catalog = getCatalogSubject(selectedClass, selectedSubject);
  const subjectOptions = Object.entries(curriculumCatalog[selectedClass]).filter((entry): entry is [string, CatalogSubject] => Boolean(entry[1]));
  const chapters = [{ value: "all", label: "সব অধ্যায়", count: catalog.questions.length }, ...Array.from(new Map(catalog.questions.map((question) => [question.chapterNo, question])).values()).sort((a, b) => a.chapterNo - b.chapterNo).map((question) => ({ value: String(question.chapterNo), label: question.chapter, count: catalog.questions.filter((item) => item.chapterNo === question.chapterNo).length }))];
  const chapterPool = selectedChapter === "all" ? catalog.questions : catalog.questions.filter((q) => String(q.chapterNo) === selectedChapter);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  useEffect(() => {
    queueMicrotask(() => {
      try { setSeenIds(JSON.parse(window.localStorage.getItem(`${SEEN_QUESTIONS_STORAGE_KEY}:${activeProfileId}:${selectedClass}:${selectedSubject}`) ?? "[]")); }
      catch { setSeenIds([]); }
    });
  }, [activeProfileId, selectedClass, selectedSubject, attempts]);
  const freshCount = chapterPool.filter((question) => !seenIds.includes(question.id)).length || chapterPool.length;
  const availableCount = chapterPool.length;
  const numericOptions = [5, 10, 15, 20, 25, 30, 40, 50, 70].filter((count) => count < freshCount);
  const questionOptions = [...numericOptions.map(String), "all"];
  const effectiveQuestionCount = questionCount === "all" || questionOptions.includes(questionCount) ? questionCount : "all";
  const actualQuestionCount = effectiveQuestionCount === "all" ? freshCount : Math.min(Number(effectiveQuestionCount), freshCount);
  const latestAccuracy = attempts[0] ? Math.round((attempts[0].score / attempts[0].total) * 100) : 0;
  const recentAverage = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total) * 100, 0) / attempts.length) : 0;
  const practiceRhythm = Math.min(attempts.length * 20, 100);
  const practicedToday = attempts.some((attempt) => new Date(attempt.createdAt).toDateString() === new Date().toDateString());
  const latestFocus = attempts[0]?.focusArea;
  const latestMissionClass = (attempts[0]?.chapter.match(/Class (10|[5-9])/)?.[1] as ClassKey | undefined) ?? selectedClass;
  const latestMissionSubject = (Object.entries(curriculumCatalog[latestMissionClass]).find(([, subject]) => subject?.label === attempts[0]?.subject)?.[0] as SubjectKey | undefined) ?? selectedSubject;
  const missionCatalog = getCatalogSubject(latestMissionClass, latestMissionSubject);
  const recommendedQuestion = latestFocus && latestFocus !== "Revision Complete" ? missionCatalog.questions.find((question) => question.topic === latestFocus) : missionCatalog.questions[0];
  const recommendedChapter = recommendedQuestion?.chapter ?? "সব অধ্যায়";
  const missionText = latestFocus && latestFocus !== "Revision Complete" ? `${latestFocus} নিয়ে ৭ প্রশ্নের Smart Review` : `${recommendedChapter} থেকে ৭ প্রশ্নের ছোট Mission`;
  const masteryChapters = chapters.slice(1).map((chapter) => {
    const chapterQuestion = catalog.questions.find((question) => String(question.chapterNo) === chapter.value);
    const chapterAttempts = attempts.filter((attempt) => attempt.subject === catalog.label && attempt.chapter.includes(`Class ${selectedClass}`) && (attempt.chapter.includes(chapter.label) || attempt.focusArea === chapterQuestion?.topic));
    const score = chapterAttempts.length ? Math.round(chapterAttempts.reduce((sum, attempt) => sum + attempt.score / attempt.total * 100, 0) / chapterAttempts.length) : 0;
    const lastPracticeAt = chapterAttempts.length ? Math.max(...chapterAttempts.map((attempt) => attempt.createdAt)) : 0;
    const revisionDue = score >= 80 && currentTime - lastPracticeAt >= 7 * 24 * 60 * 60 * 1000;
    const status = !chapterAttempts.length ? "Not started" : revisionDue ? "Revision Due" : score >= 80 ? "Mastered" : score >= 60 ? "Improving" : "Learning";
    return { ...chapter, score, status, attempts: chapterAttempts.length };
  });
  const learningAreas = [
    { label: "Latest accuracy", value: latestAccuracy, color: "#18a37a" },
    { label: "Recent average", value: recentAverage, color: "#f4b942" },
    { label: "Practice rhythm", value: practiceRhythm, color: "#3b82c4" },
  ];
  const recommendedBuilderChapter = masteryChapters.find((chapter) => chapter.status === "Revision Due") ?? masteryChapters.find((chapter) => chapter.status === "Learning" || chapter.status === "Improving") ?? masteryChapters.find((chapter) => chapter.status === "Not started") ?? masteryChapters[0];
  const visibleMasteryChapters = masteryChapters.filter((chapter) => masteryFilter === "all" || (masteryFilter === "priority" && (chapter.status === "Learning" || chapter.status === "Improving")) || (masteryFilter === "revision" && chapter.status === "Revision Due") || (masteryFilter === "mastered" && chapter.status === "Mastered") || (masteryFilter === "new" && chapter.status === "Not started"));
  const estimatedMinutes = Math.max(3, Math.ceil(actualQuestionCount * 0.75));
  return <div className="shell page-pad">
    <section className="welcome-strip"><div><p className="eyebrow">NCTB 2026 • বাংলা মাধ্যম</p><h1>{attempts.length ? "আবার শুরু করি, champion! 🌟" : "আজই তোমার শেখার যাত্রা শুরু হোক! 🚀"}</h1><p className="brand-tagline">শেখো। খেলো। এগিয়ে চলো। <span>Learn it. Play it. Own it.</span></p></div><div className="welcome-badges"><div className="streak-pill"><Sparkles size={18} /> টানা {loginStreak} দিন</div><div className="class-pill">Class 5–10 • SSC Beta</div></div></section>
    <section className={`daily-quest mission-spotlight ${practicedToday ? "complete" : ""}`}>
      <span className="quest-icon">{practicedToday ? "🏆" : "🎯"}</span>
      <div className="mission-copy"><p className="eyebrow">{practicedToday ? "TODAY'S NEXT MISSION" : "TODAY'S MISSION"}</p><strong>{practicedToday ? "দারুণ! আজকের practice শেষ—এবার চাইলে আরেক ধাপ এগোও।" : missionText}</strong><div className="mission-meta"><span><BookOpen size={14} /> Class {latestMissionClass} • {missionCatalog.label}</span><span><BookMarked size={14} /> {recommendedChapter}</span><span><Clock3 size={14} /> প্রায় ৬ মিনিট</span></div><small>{attempts.length ? "সাম্প্রতিক শেখার ফল দেখে তোমার জন্য এটি বেছে নেওয়া হয়েছে।" : "ছোট একটি Mission দিয়ে শুরু করো—ভুল হলেও explanation থেকে শিখবে।"}</small></div>
      <div className="mission-actions"><button className="mission-start" onClick={onSmartMission}><BrainCircuit size={17} /> {attempts.length ? "আজকের Mission চালিয়ে যাও" : "প্রথম Mission শুরু করো"} <ArrowRight size={17} /></button><div><button className="mission-secondary" onClick={onQuest}><Compass size={15} /> Fun Quest</button><button className="mission-secondary" onClick={onBreak}><Gamepad2 size={15} /> Break Zone</button></div></div>
    </section>
    <div className="dashboard-grid">
      <section className="practice-card" id="practice-builder">
        <Heading icon={<BrainCircuit size={22} />} eyebrow="SMART PRACTICE" title="নিজের practice তৈরি করো" tone="teal" />
        {recommendedBuilderChapter && <button className="recommended-chapter" onClick={() => setSelectedChapter(recommendedBuilderChapter.value)}><span><Sparkles size={18} /></span><div><small>তোমার জন্য recommended</small><strong>{recommendedBuilderChapter.label}</strong><p>{recommendedBuilderChapter.status === "Revision Due" ? "আগে শেখা chapterটি মনে রাখার জন্য আবার practice করো।" : recommendedBuilderChapter.attempts ? "এই chapter-এ আরেকটু practice করলে mastery বাড়বে।" : "নতুন কিছু শেখার জন্য এখান থেকে শুরু করতে পারো।"}</p></div><span className="recommend-action">বেছে নিই <ChevronRight size={16} /></span></button>}
        <div className="class-switch-wrap"><label className="field-label">তোমার Class বেছে নাও</label><div className="class-switch" role="group" aria-label="Class বেছে নাও">{(["5", "6", "7", "8", "9", "10"] as ClassKey[]).map((item) => <button key={item} type="button" className={selectedClass === item ? "active" : ""} onClick={() => setSelectedClass(item)} aria-pressed={selectedClass === item}><span>Class</span><strong>{item}</strong>{selectedClass === item && <Star size={14} fill="currentColor" />}</button>)}</div></div>
        <div className="subject-picker"><label className="field-label">বিষয় বেছে নাও</label><div role="group" aria-label="বিষয় বেছে নাও">{subjectOptions.map(([key, subject]) => { const subjectKey = key as SubjectKey; const visual = subjectVisuals[subjectKey]; const SubjectIcon = visual.icon; return <button key={key} type="button" className={selectedSubject === subjectKey ? "active" : ""} onClick={() => setSelectedSubject(subjectKey)} aria-pressed={selectedSubject === subjectKey}><span aria-hidden="true"><SubjectIcon size={23} strokeWidth={1.8} /></span><strong>{visual.short}</strong><small>{subject.questions.length}টি প্রশ্ন</small>{selectedSubject === subjectKey && <Check size={15} />}</button>; })}</div></div>
        <div className="form-grid">
          <Field label="Chapter"><Choice ariaLabel="Chapter" value={selectedChapter} onValueChange={setSelectedChapter} options={chapters.map((c) => c.value)} labels={chapters.map((c) => `${c.label} (${c.count})`)} /></Field>
          <Field label="Questions"><Choice ariaLabel="Number of questions" value={effectiveQuestionCount} onValueChange={setQuestionCount} options={questionOptions} labels={[...numericOptions.map(String), `Endless • ${freshCount} new`]} suffix=" questions" /></Field>
          <div className="practice-time" aria-label={`Estimated practice time ${estimatedMinutes} minutes`}><Clock3 size={19} /><div><span>Estimated time</span><strong>প্রায় {estimatedMinutes} মিনিট</strong></div></div>
        </div>
        <div className="coverage-note" key={`${selectedClass}-${selectedSubject}-${selectedChapter}-${difficulty}-${questionCount}`}><BookMarked size={18} /><div><strong>{actualQuestionCount}টি নতুন প্রশ্ন নিয়ে practice ready!</strong><span>আগে না-দেখা {freshCount}টি প্রশ্ন বাকি। সব শেষ হলে প্রশ্নগুলো নতুনভাবে মিশিয়ে review শুরু হবে। প্রথমে {difficultyCopy[difficulty].label} level আসবে।</span></div></div>
        <div className="challenge-block"><label className="field-label">Start with this level</label><div className="challenge-row">{(["easy", "medium", "hard"] as Difficulty[]).map((level) => <button type="button" key={level} className={difficulty === level ? "selected" : ""} onClick={() => setDifficulty(level)} aria-pressed={difficulty === level}><span>{difficultyCopy[level].label}</span><small>{difficultyCopy[level].hint}</small></button>)}</div></div>
        <Button onClick={onStart} size="lg" className="start-button" disabled={availableCount === 0}>{actualQuestionCount}টি প্রশ্নের Practice শুরু করি <ArrowRight /></Button>
        <p className="demo-note">এই set শেষ হওয়ার আগে একই প্রশ্ন আবার আসবে না</p>
      </section>
      <aside className="side-column">
        <section className={`map-card ${attempts.length ? "" : "snapshot-empty"}`}><Heading icon={<Compass size={20} />} eyebrow="LEARNING SNAPSHOT" title={attempts.length ? "দেখো, তুমি কতটা এগিয়েছ" : "তোমার progress এখান থেকেই শুরু"} tone="blue" compact />{attempts.length ? <><div className="learning-list">{learningAreas.map((area) => <div key={area.label}><div className="progress-label"><span>{area.label}</span><strong>{area.value}%</strong></div><div className="track"><span style={{ width: `${area.value}%`, background: area.color }} /></div></div>)}</div><p className="snapshot-note">তোমার সর্বশেষ {attempts.length}টি practice থেকে এই snapshot তৈরি হয়েছে।</p></> : <div className="first-step-invite"><span>🌱</span><div><strong>এখানে এখনো কোনো score নেই—এটাই একদম ঠিক!</strong><p>প্রথম ছোট Mission শেষ করলে তোমার strength ও next focus এখানে দেখা যাবে।</p></div><button onClick={onSmartMission}>প্রথম Mission শুরু করি <ArrowRight size={15} /></button></div>}</section>
        <section className="focus-card"><span className="focus-icon"><Target size={20} /></span><div><p className="eyebrow">SMART NEXT FOCUS</p><h3>{attempts[0]?.focusArea ?? "প্রথম practice শুরু করো"}</h3><p>{attempts.length ? "তোমার সাম্প্রতিক ভুল থেকে পরের focus বেছে নেওয়া হয়েছে।" : "একটি quiz শেষ করলেই তোমার জন্য পরের focus এখানে দেখা যাবে।"}</p></div></section>
        <section className="student-tools"><button onClick={onRoutine}><CalendarDays size={20} /><span><strong>My Study Routine</strong><small>সময় অনুযায়ী weekly plan</small></span><ArrowRight size={16} /></button><button onClick={onGradeReport}><ListChecks size={20} /><span><strong>My Grade Report</strong><small>Analysis ও practice reminder</small></span><ArrowRight size={16} /></button></section>
        <RecentPractice attempts={attempts} />
      </aside>
    </div>
    <section className="mastery-section" id="curriculum-map"><div className="curriculum-heading"><div><p className="eyebrow">YOUR MASTERY MAP</p><h2>Class {selectedClass} • {catalog.label}</h2></div><span>{masteryChapters.filter((chapter) => chapter.status === "Mastered").length}/{masteryChapters.length} mastered</span></div><p className="mastery-intro">কোন chapter এখন শেখা, আবার দেখা বা শুরু করা দরকার—সহজে খুঁজে নাও।</p><div className="mastery-toolbar"><div className="mastery-subjects" role="group" aria-label="Filter mastery map by subject">{subjectOptions.map(([key]) => { const subjectKey = key as SubjectKey; const SubjectIcon = subjectVisuals[subjectKey].icon; return <button key={key} className={selectedSubject === subjectKey ? "active" : ""} onClick={() => setSelectedSubject(subjectKey)} aria-pressed={selectedSubject === subjectKey}><span aria-hidden="true"><SubjectIcon size={17} strokeWidth={1.8} /></span>{subjectVisuals[subjectKey].short}</button>; })}</div><div className="mastery-filters" role="group" aria-label="Filter chapters by learning status">{([['all','সব'],['priority','আরও practice'],['revision','আবার দেখি'],['mastered','শেখা হয়েছে'],['new','নতুন']] as const).map(([value,label]) => <button key={value} className={masteryFilter === value ? "active" : ""} onClick={() => setMasteryFilter(value)} aria-pressed={masteryFilter === value}>{label}</button>)}</div></div>{visibleMasteryChapters.length ? <div className="mastery-grid">{visibleMasteryChapters.map((chapter) => <article key={chapter.value} className={`mastery-card ${chapter.status.toLowerCase().replace(" ", "-")} ${recommendedBuilderChapter?.value === chapter.value ? "recommended" : ""}`}><div className="mastery-top"><span className="chapter-number">{chapter.value}</span><span className="mastery-status">{chapter.status === "Not started" ? "নতুন" : chapter.status === "Revision Due" ? "আবার দেখি" : chapter.status === "Mastered" ? "শেখা হয়েছে" : chapter.status === "Improving" ? "এগোচ্ছো" : "আরও practice"}</span></div><h3>{chapter.label}</h3>{recommendedBuilderChapter?.value === chapter.value && <span className="mastery-recommended"><Sparkles size={13} /> Recommended next</span>}<div className="mastery-progress"><span style={{ width: `${chapter.score}%` }} /></div><div className="mastery-meta"><span>{chapter.attempts ? `${chapter.attempts} practice${chapter.attempts === 1 ? "" : "s"}` : `${chapter.count} questions ready`}</span><strong>{chapter.score}%</strong></div><button onClick={() => onStartChapter(chapter.value)}>{chapter.status === "Revision Due" ? "Quick revision" : chapter.attempts ? "Practice again" : "Start chapter"} <ArrowRight size={14} /></button></article>)}</div> : <div className="mastery-empty"><span>✨</span><strong>এই filter-এ এখন কোনো chapter নেই</strong><p>অন্য status বেছে নিয়ে তোমার chapters দেখো।</p><button onClick={() => setMasteryFilter("all")}>সব chapter দেখাই</button></div>}</section>
    <section className="curriculum-section coverage-compact"><div className="curriculum-heading"><div><p className="eyebrow">CLASS 5–10 COVERAGE</p><h2>Core learning plus SSC Beta</h2></div><span>{curriculumTotal.toLocaleString("en-US")} questions</span></div><div className="coverage-grid">{coverage.map((item) => <article key={item.className} className={item.status === "Live" ? "live" : ""}><div><h3>{item.className}</h3><span>{item.status}</span></div><p>{item.subjects}</p></article>)}</div></section>
    <footer className="creator-card"><span className="creator-icon"><Code2 size={24} /></span><div><p className="eyebrow">BUILT BY A LEARNER, FOR LEARNERS</p><h2>Md. Iftee Raiyan</h2><p>CSE Undergraduate at East West University—exploring software development, problem-solving, and learning by building.</p></div><div className="creator-actions">{isAdmin && <button onClick={onContentCheck}><BadgeCheck size={16} /> Owner Desk</button>}<a href="https://www.linkedin.com/in/md-iftee-raiyan-b20336386/" target="_blank" rel="noreferrer">View LinkedIn <ExternalLink size={16} /></a></div></footer>
    <nav className="trust-links" aria-label="তথ্য ও সহায়তা"><span>© {new Date().getFullYear()} TomarShikkha</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">ব্যবহারের নিয়ম</Link><Link href="/feedback">Feedback</Link></div></nav>
  </div>;
}

function QuizScreen({ cloudUserId, questions, classLabel, subjectLabel, difficulty, practiceMode, current, answer, revealed, onAnswer, onNext, onBack }: { cloudUserId: string | null; questions: ScienceQuestion[]; classLabel: ClassKey; subjectLabel: string; difficulty: Difficulty; practiceMode: "standard" | "focus"; current: number; answer: number | null; revealed: boolean; onAnswer: (i: number) => void; onNext: () => void; onBack: () => void }) {
  const question = questions[current]; const correct = answer === question.answer;
  const [reportOpen, setReportOpen] = useState(false); const [reportReason, setReportReason] = useState("answer"); const [reportState, setReportState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveQuestionReport = async () => { setReportState("saving"); const createdAt = Date.now(); try { const existing = JSON.parse(window.localStorage.getItem(QUESTION_REPORTS_STORAGE_KEY) ?? "[]") as QuestionReport[]; const report: QuestionReport = { questionId: question.id, reason: reportReason, createdAt, status: "pending", classKey: classLabel, subject: subjectLabel }; window.localStorage.setItem(QUESTION_REPORTS_STORAGE_KEY, JSON.stringify([report, ...existing.filter((item) => !(item.questionId === question.id && item.classKey === classLabel))].slice(0, 100))); if (supabase && cloudUserId) { const { error } = await supabase.from("ts_question_reports").insert({ user_id: cloudUserId, class_key: classLabel, subject: subjectLabel, question_id: question.id, reason: reportReason, status: "pending", created_at: createdAt }); if (error && error.code !== "23505") throw error; } setReportState("saved"); } catch { setReportState("error"); } };
  return <div className="quiz-shell"><div className="quiz-topline"><button className="back-link" onClick={onBack}><ArrowLeft size={18} /> ফিরে যাই</button><span>Class {classLabel} • {subjectLabel} • {practiceMode === "focus" ? "Smart Review" : difficultyCopy[difficulty].label} • NCTB 2026</span></div><Progress value={((current + 1) / questions.length) * 100} className="quiz-progress" aria-label={`প্রশ্ন ${current + 1} এর ${questions.length}`} /><div className="question-count"><strong>প্রশ্ন {current + 1} / {questions.length}</strong><span>•</span> {practiceMode === "focus" ? "আবার শেখা" : difficultyCopy[difficulty].label} <span>•</span> {question.chapter} <span>•</span> {question.topic}</div>
    <section className="question-card"><div className="question-card-head"><div className="question-icon"><BookOpen size={24} /></div><button className="report-question" onClick={() => { setReportState("idle"); setReportOpen(true); }}><Flag size={15} /> প্রশ্নে সমস্যা?</button></div><h1>{question.prompt}</h1><p className="answer-instruction">একটি উত্তর বেছে নিয়ে <strong>“উত্তর মিলাই”</strong> চাপো।</p><div className="option-list">{question.options.map((option, index) => { const isCorrect = revealed && index === question.answer; const isWrong = revealed && answer === index && index !== question.answer; return <button key={option} onClick={() => onAnswer(index)} disabled={revealed} aria-pressed={answer === index} className={`${answer === index ? "chosen" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{isCorrect && <Check size={20} />}</button>; })}</div>
      {revealed && <><div className={`explanation ${correct ? "success" : "review"}`} role="status" aria-live="polite"><Lightbulb size={22} /><div><strong>{correct ? "ঠিক হয়েছে! +10 Power Stars ⭐" : `সঠিক উত্তর: ${question.options[question.answer]}`}</strong>{!correct && <span className="answer-why">কেন উত্তরটি মিলেনি, নিচের ব্যাখ্যা থেকে বুঝে নাও।</span>}<p><b>কেন?</b> {question.explanation}</p></div></div><details className="origin-card"><summary><BookMarked size={17} /><span>বই ও chapter reference</span><ChevronRight size={16} /></summary><div><p>{question.origin}</p><a href={question.sourceUrl} target="_blank" rel="noreferrer">NCTB-এর বইয়ের তালিকা <ExternalLink size={13} /></a><span>Chapter verified • page reference review চলছে</span></div></details></>}
      <div className="quiz-actions"><span>{answer === null ? "একটি উত্তর বেছে নাও" : revealed ? "ব্যাখ্যাটি পড়ে পরের প্রশ্নে যাও" : "Ready? এবার উত্তর মিলিয়ে দেখো"}</span><Button onClick={onNext} disabled={answer === null} size="lg" className="next-button">{revealed ? (current === questions.length - 1 ? "ফলাফল দেখি" : "পরের প্রশ্ন") : "উত্তর মিলাই"} <ArrowRight /></Button></div>
    </section><Dialog open={reportOpen} onOpenChange={setReportOpen}><DialogContent className="report-dialog"><DialogHeader><DialogTitle>এই প্রশ্নে কী সমস্যা?</DialogTitle><DialogDescription>তোমার report content review-এর সময় যাচাই করা হবে।</DialogDescription></DialogHeader>{reportState === "saved" ? <div className="report-success"><BadgeCheck size={28} /><strong>ধন্যবাদ! Report save হয়েছে।</strong><p>{cloudUserId ? "Reportটি review team-এর queue-তে পৌঁছেছে।" : "এটি device-এ আছে; guardian sign in করলে cloud-এ sync হবে।"}</p><Button onClick={() => setReportOpen(false)}>ঠিক আছে</Button></div> : <><div className="report-reasons" role="radiogroup" aria-label="Question problem">{[["answer","উত্তর ভুল মনে হচ্ছে"],["wording","প্রশ্নটি বুঝতে কঠিন"],["explanation","Explanation পরিষ্কার নয়"],["source","Chapter বা source মিলছে না"]].map(([value,label]) => <button key={value} role="radio" aria-checked={reportReason === value} className={reportReason === value ? "active" : ""} onClick={() => setReportReason(value)}><span>{reportReason === value ? <Check size={15} /> : null}</span>{label}</button>)}</div>{reportState === "error" && <p className="report-error">Report save করা যায়নি। আবার চেষ্টা করো।</p>}<Button onClick={() => void saveQuestionReport()} disabled={reportState === "saving"}>{reportState === "saving" ? "Report পাঠানো হচ্ছে…" : "Report পাঠাই"}</Button></>}</DialogContent></Dialog></div>;
}

function ResultScreen({ score, total, wrongTopics, saveState, onRetry, onFocus, onHome }: { score: number; total: number; wrongTopics: string[]; saveState: "idle" | "saving" | "saved" | "error"; onRetry: () => void; onFocus: () => void; onHome: () => void }) {
  const percentage = Math.round((score / total) * 100); const nextFocus = wrongTopics[0] ?? "Mixed Revision"; const uniqueWrongTopics = [...new Set(wrongTopics)];
  return <div className="result-shell"><section className="result-hero"><div className="result-ring" style={{ "--score": `${percentage * 3.6}deg` } as React.CSSProperties}><div><strong>{score}/{total}</strong><span>সঠিক উত্তর</span></div></div><div><p className="eyebrow">PRACTICE COMPLETE</p><h1>{percentage >= 80 ? "দারুণ শিখেছ! 🌟" : percentage >= 50 ? "ভালো এগোচ্ছো! 🚀" : "সাহসী চেষ্টা! 💪"}</h1><p>তোমার ফল দেখা হয়েছে। এখন কোন দিকটি ভালো এবং এরপর কী practice করবে, তা দেখে এগিয়ে যাও।</p><div className="reward-pill"><Star size={17} fill="currentColor" /> +{score * 10} Power Stars পেয়েছ</div><div className={`save-status ${saveState}`} role="status" aria-live="polite">{saveState === "saving" ? "Progress save হচ্ছে…" : saveState === "saved" ? "✓ Progress save হয়েছে" : saveState === "error" ? "Progress save করা যায়নি" : "Mastery Map তৈরি হচ্ছে…"}</div></div></section>
    <div className="result-grid"><ResultCard tone="teal" icon={<Check size={22} />} eyebrow="COMPLETED" title={`${score} concepts correct`}>তোমার correct answers Learning Map-এ যোগ হয়েছে।</ResultCard><ResultCard tone="gold" icon={<Target size={22} />} eyebrow="MISTAKE MEMORY" title={nextFocus} attention>{wrongTopics.length ? `${wrongTopics.length}টি concept next practice-এ priority পাবে।` : "No active gap—next round will strengthen retention."}</ResultCard></div>
    {wrongTopics.length > 0 && <section className="review-preview"><div><span><RotateCcw size={20} /></span><div><p className="eyebrow">AUTOMATIC REVIEW SET</p><h2>{wrongTopics.length}টি ভুল আবার বুঝে নাও</h2><p>ভুল হওয়া প্রশ্নগুলোর chapter থেকে নতুনভাবে একটি ছোট review তৈরি হয়েছে।</p></div></div><div className="review-topics">{uniqueWrongTopics.slice(0,4).map((topic) => <span key={topic}>{topic}</span>)}</div></section>}
    <section className="next-step-card"><div><span className="icon-tile blue"><BrainCircuit size={23} /></span><div><p className="eyebrow">SMART NEXT STEP</p><h2>{wrongTopics.length ? `${nextFocus}—Focused Practice` : "Keep your momentum"}</h2><p>{wrongTopics.length ? "শুধু ভুলগুলো মুখস্থ নয়—related concept আবার practice করো।" : "No active gap—try another shuffled round"}</p></div></div><Button onClick={wrongTopics.length ? onFocus : onRetry} size="lg" className="start-button compact-button">{wrongTopics.length ? `${wrongTopics.length}টি ভুল Review করি` : "Practice Again"} <ArrowRight /></Button></section><button className="restart-link" onClick={onHome}><RotateCcw size={17} /> অন্য topic বেছে নিই</button></div>;
}

function RecentPractice({ attempts }: { attempts: PracticeAttempt[] }) { return <section className="recent-card" id="recent-history"><div className="recent-heading"><div><p className="eyebrow">RECENT PRACTICE</p><h3>Your saved progress</h3></div><span>{attempts.length}</span></div>{attempts.length === 0 ? <p className="recent-empty">Complete your first quiz—result এখানে automatically save হবে।</p> : <div className="attempt-list">{attempts.slice(0, 3).map((attempt) => <div key={attempt.id}><span className="attempt-score">{attempt.score}/{attempt.total}</span><div><strong>{attempt.subject}</strong><small>{attempt.chapter} • {new Date(attempt.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</small></div></div>)}</div>}</section>; }

function GuardianDashboard({ profiles, attemptsByProfile, powerStars, cloudUserEmail, cloudStatus, onBack, onOpenLearner, onUpdateLearner, onRemoveLearner }: { profiles: LearnerProfile[]; attemptsByProfile: Record<string, PracticeAttempt[]>; powerStars: number; cloudUserEmail: string | null; cloudStatus: "guest" | "connecting" | "synced" | "error"; onBack: () => void; onOpenLearner: (profileId: string) => void; onUpdateLearner: (profileId: string, name: string, classKey: ClassKey) => boolean; onRemoveLearner: (profileId: string) => Promise<boolean> }) {
  const allAttempts = profiles.flatMap((profile) => attemptsByProfile[profile.id] ?? []);
  const [weekStart] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);
  const previousWeekStart = weekStart - 7 * 24 * 60 * 60 * 1000;
  const weeklyAttempts = allAttempts.filter((attempt) => attempt.createdAt >= weekStart);
  const previousWeeklyAttempts = allAttempts.filter((attempt) => attempt.createdAt >= previousWeekStart && attempt.createdAt < weekStart);
  const average = allAttempts.length ? Math.round(allAttempts.reduce((sum, attempt) => sum + attempt.score / attempt.total * 100, 0) / allAttempts.length) : 0;
  const practicedDays = new Set(weeklyAttempts.map((attempt) => new Date(attempt.createdAt).toDateString())).size;
  const latestFocus = [...allAttempts].sort((a, b) => b.createdAt - a.createdAt).find((attempt) => attempt.focusArea !== "Revision Complete")?.focusArea;
  const getBestSubject = (source: PracticeAttempt[]) => { const grouped = new Map<string, { score: number; count: number }>(); for (const attempt of source) { const item = grouped.get(attempt.subject) ?? { score: 0, count: 0 }; item.score += attempt.score / attempt.total * 100; item.count += 1; grouped.set(attempt.subject, item); } return [...grouped.entries()].map(([subject, item]) => ({ subject, average: Math.round(item.score / item.count) })).sort((a, b) => b.average - a.average)[0]; };
  const bestSubject = getBestSubject(allAttempts);
  const weeklyAverage = weeklyAttempts.length ? Math.round(weeklyAttempts.reduce((sum, attempt) => sum + attempt.score / attempt.total * 100, 0) / weeklyAttempts.length) : 0;
  const previousAverage = previousWeeklyAttempts.length ? Math.round(previousWeeklyAttempts.reduce((sum, attempt) => sum + attempt.score / attempt.total * 100, 0) / previousWeeklyAttempts.length) : 0;
  const weeklyChange = weeklyAttempts.length && previousWeeklyAttempts.length ? weeklyAverage - previousAverage : null;
  const guidance = !allAttempts.length ? "একসঙ্গে প্রথম একটি ছোট practice বেছে দিন। শুরু করাটাই আজকের সাফল্য।" : average < 50 ? "ভুলের জন্য চাপ দেবেন না। ৫–৭টি সহজ প্রশ্ন দিয়ে দুর্বল বিষয়টি আবার practice করতে দিন।" : average < 75 ? "প্রতিদিন ১০ মিনিট practice ধরে রাখুন। সঠিক উত্তরটি কেন ঠিক, তা শিশুকে নিজের ভাষায় বলতে বলুন।" : "Progress ভালো হচ্ছে। এবার Medium বা Hard challenge বেছে নিতে উৎসাহ দিন।";
  return <div className="guardian-shell"><div className="guardian-top"><button className="back-link" onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরুন</button><div className={`guardian-cloud ${cloudStatus}`}><span>{cloudUserEmail ? "☁️" : "💻"}</span><div><strong>{cloudUserEmail ? "Progress backup চালু আছে" : "এই device-এ progress আছে"}</strong><small>{cloudUserEmail ?? "অন্য device-এ দেখতে guardian email দিয়ে sign in করুন"}</small></div></div></div><section className="guardian-hero"><div><p className="eyebrow">GUARDIAN VIEW</p><h1>এই সপ্তাহে শেখা কেমন হলো?</h1><p>সংখ্যার চাপ নয়—নিয়মিত practice, ভালো দিক এবং কোথায় একটু সাহায্য দরকার তা সহজভাবে দেখুন।</p></div><span className="guardian-hero-icon"><HeartHandshake size={30} /></span></section>
    {!allAttempts.length ? <section className="guardian-first-step"><span>🌱</span><div><p className="eyebrow">শুরু করার সময়</p><h2>এখনো কোনো practice শেষ হয়নি</h2><p>শিশুর সঙ্গে ৫–৭টি সহজ প্রশ্নের একটি Mission করুন। প্রথম দিন score নয়, চেষ্টা করাটাই গুরুত্বপূর্ণ।</p></div><button onClick={() => onOpenLearner(profiles[0].id)}>শেখার পাতা খুলুন <ArrowRight size={16} /></button></section> : <><div className="guardian-stats"><article><CalendarDays size={21} /><span>এই সপ্তাহের practice</span><strong>{weeklyAttempts.length}</strong><small>{practicedDays} দিন শেখা হয়েছে</small></article><article><Trophy size={21} /><span>এই সপ্তাহের সঠিক উত্তর</span><strong>{weeklyAverage}%</strong><small>{weeklyChange === null ? "আগের সপ্তাহের data এখনো নেই" : weeklyChange > 0 ? `আগের সপ্তাহের চেয়ে ${weeklyChange}% বেশি` : weeklyChange < 0 ? `আগের সপ্তাহের চেয়ে ${Math.abs(weeklyChange)}% কম` : "আগের সপ্তাহের মতোই"}</small></article><article><Sparkles size={21} /><span>সবচেয়ে ভালো বিষয়</span><strong className="guardian-text-value">{bestSubject?.subject ?? "—"}</strong><small>{bestSubject ? `${bestSubject.average}% average` : "Practice হলে দেখা যাবে"}</small></article><article><Star size={21} /><span>বর্তমান learner-এর Stars</span><strong>{powerStars}</strong><small>Practice ও Quest থেকে</small></article></div><section className="guardian-weekly-summary"><div><span className="summary-icon strength"><Trophy size={22} /></span><div><p className="eyebrow">STRENGTH</p><h3>{bestSubject ? `${bestSubject.subject}-এ confidence ভালো` : "Strength জানতে আরও practice দরকার"}</h3><p>{bestSubject ? `${bestSubject.average}% average—চেষ্টা ও explanation পড়ার অভ্যাসটি ধরে রাখতে উৎসাহ দিন।` : "কয়েকটি ছোট practice শেষে সবচেয়ে ভালো বিষয়টি এখানে দেখা যাবে।"}</p></div></div><div><span className="summary-icon focus"><Target size={22} /></span><div><p className="eyebrow">NEXT FOCUS</p><h3>{latestFocus ?? "নিয়মিত ছোট practice"}</h3><p>{latestFocus ? "এই topic-এ ৫–৭টি প্রশ্ন আবার করতে দিন; ভুল হলে explanation একসঙ্গে পড়ুন।" : "প্রতিদিন অল্প সময় practice করাই এখন সবচেয়ে ভালো next step।"}</p></div></div></section></>}
    <section className="guardian-guidance"><span><Lightbulb size={22} /></span><div><p className="eyebrow">Guardian-এর জন্য সহজ পরামর্শ</p><h2>{guidance}</h2>{latestFocus && <p>পরের focus: <strong>{latestFocus}</strong></p>}</div></section><section className="guardian-learners"><div className="guardian-section-heading"><div><p className="eyebrow">প্রত্যেক শিক্ষার্থীর অগ্রগতি</p><h2>আলাদা profile, আলাদা learning journey</h2></div><span>School grade নয়—practice trend</span></div><div className="guardian-learner-grid">{profiles.map((profile) => { const profileAttempts = attemptsByProfile[profile.id] ?? []; const profileAverage = profileAttempts.length ? Math.round(profileAttempts.reduce((sum, attempt) => sum + attempt.score / attempt.total * 100, 0) / profileAttempts.length) : 0; const recent = [...profileAttempts].sort((a,b) => b.createdAt-a.createdAt)[0]; const profileWeek = profileAttempts.filter((attempt) => attempt.createdAt >= weekStart); const profileBest = getBestSubject(profileAttempts); return <article key={profile.id}><div className="guardian-profile-head"><span>{profile.avatar}</span><div><h3>{profile.name}</h3><p>Class {profile.classKey}</p></div><strong>{profileAttempts.length ? `${profileAverage}%` : "নতুন"}</strong></div><div className="guardian-profile-bar"><span style={{ width: `${profileAverage}%` }} /></div><dl><div><dt>এই সপ্তাহে</dt><dd>{profileWeek.length} practice</dd></div><div><dt>ভালো করছে</dt><dd>{profileBest?.subject ?? "Practice শুরু হয়নি"}</dd></div><div><dt>একটু সাহায্য</dt><dd>{recent?.focusArea === "Revision Complete" ? "Revision ধরে রাখুন" : recent?.focusArea ?? "প্রথম Mission"}</dd></div></dl><button onClick={() => onOpenLearner(profile.id)}>{profile.name}-এর শেখার পাতা খুলুন <ArrowRight size={15} /></button><GuardianProfileActions profile={profile} canRemove={profiles.length > 1} onUpdate={onUpdateLearner} onRemove={onRemoveLearner} /></article>; })}</div></section><p className="guardian-note"><ShieldCheck size={17} /> এই dashboard কোনো school report card নয়। এটি শিশুর confidence, নিয়মিত চেষ্টা এবং শেখার next step বুঝতে সাহায্য করে।</p></div>;
}

function GuardianProfileActions({ profile, canRemove, onUpdate, onRemove }: { profile: LearnerProfile; canRemove: boolean; onUpdate: (profileId: string, name: string, classKey: ClassKey) => boolean; onRemove: (profileId: string) => Promise<boolean> }) {
  const [editOpen, setEditOpen] = useState(false); const [name, setName] = useState(profile.name); const [classKey, setClassKey] = useState<ClassKey>(profile.classKey); const [removeState, setRemoveState] = useState<"idle" | "removing" | "error">("idle");
  const save = () => { if (onUpdate(profile.id, name, classKey)) setEditOpen(false); };
  const remove = async () => { setRemoveState("removing"); const removed = await onRemove(profile.id); if (!removed) setRemoveState("error"); };
  return <div className="guardian-profile-actions"><button className="profile-edit-button" onClick={() => { setName(profile.name); setClassKey(profile.classKey); setEditOpen(true); }}><Pencil size={14} /> নাম বা Class বদলান</button><AlertDialog><AlertDialogTrigger asChild><button className="profile-remove-button" disabled={!canRemove} title={!canRemove ? "অন্তত একটি learner profile রাখতে হবে" : undefined}><Trash2 size={14} /> Profile সরান</button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{profile.name}-এর profile সরাবেন?</AlertDialogTitle><AlertDialogDescription>এই learner-এর saved practice, routine, stars ও progress এই account থেকে মুছে যাবে। এই কাজটি পরে undo করা যাবে না।</AlertDialogDescription></AlertDialogHeader>{removeState === "error" && <p className="profile-remove-error">Cloud থেকে profile সরানো যায়নি। Internet connection দেখে আবার চেষ্টা করুন।</p>}<AlertDialogFooter><AlertDialogCancel onClick={() => setRemoveState("idle")}>না, থাক</AlertDialogCancel><AlertDialogAction variant="destructive" disabled={removeState === "removing"} onClick={(event) => { event.preventDefault(); void remove(); }}>{removeState === "removing" ? "সরানো হচ্ছে…" : "হ্যাঁ, profile সরান"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog><Dialog open={editOpen} onOpenChange={setEditOpen}><DialogContent className="profile-dialog"><DialogHeader><DialogTitle>Learner profile edit করুন</DialogTitle><DialogDescription>নাম এবং সঠিক Class update করলে practice suggestion-ও সঠিক থাকবে।</DialogDescription></DialogHeader><label><span>Learner&apos;s name</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={20} autoFocus /></label><div><span className="profile-field-label">Class</span><div className="profile-class-grid">{(["5", "6", "7", "8", "9", "10"] as ClassKey[]).map((value) => <button key={value} className={classKey === value ? "active" : ""} onClick={() => setClassKey(value)}>Class {value}</button>)}</div></div><Button onClick={save} disabled={!name.trim()} className="profile-save">পরিবর্তন save করুন</Button></DialogContent></Dialog></div>;
}

function ContentVerification({ cloudUserId, onBack }: { cloudUserId: string | null; onBack: () => void }) {
  const audit = auditCurriculum(curriculumCatalog);
  const [overview, setOverview] = useState<{ total_guardians: number; total_learners: number; total_practices: number; active_learners_7d: number; practices_7d: number; average_score_7d: number | null } | null>(null);
  useEffect(() => { let active = true; const cloud = supabase; if (!cloud || !cloudUserId) return; const loadOverview = async () => { const { data, error } = await cloud.rpc("ts_admin_overview"); if (!active || error) return; const row = Array.isArray(data) ? data[0] : data; if (row) setOverview(row); }; void loadOverview(); return () => { active = false; }; }, [cloudUserId]);
  const [reports, setReports] = useState<QuestionReport[]>(() => { if (typeof window === "undefined") return []; try { return JSON.parse(window.localStorage.getItem(QUESTION_REPORTS_STORAGE_KEY) ?? "[]"); } catch { return []; } }); const [reportFilter, setReportFilter] = useState<"pending" | "reviewed">("pending");
  useEffect(() => { let active = true; const cloud = supabase; if (!cloud || !cloudUserId) return; const loadReports = async () => { const { data, error } = await cloud.from("ts_question_reports").select("id,class_key,subject,question_id,reason,status,created_at").order("created_at", { ascending: false }); if (!active || error) return; const cloudReports: QuestionReport[] = (data ?? []).map((report) => ({ cloudId: Number(report.id), classKey: report.class_key as ClassKey, subject: report.subject, questionId: report.question_id, reason: report.reason, status: report.status as "pending" | "reviewed", createdAt: Number(report.created_at) })); setReports((localReports) => [...cloudReports, ...localReports.filter((local) => !cloudReports.some((cloudReport) => cloudReport.classKey === local.classKey && cloudReport.questionId === local.questionId && cloudReport.createdAt === local.createdAt))]); }; void loadReports(); return () => { active = false; }; }, [cloudUserId]);
  const setReportStatus = async (index: number, status: "pending" | "reviewed") => { const report = reports[index]; if (report.cloudId && supabase) { const { error } = await supabase.from("ts_question_reports").update({ status, updated_at: new Date().toISOString() }).eq("id", report.cloudId); if (error) return; } const next = reports.map((item, reportIndex) => reportIndex === index ? { ...item, status } : item); setReports(next); window.localStorage.setItem(QUESTION_REPORTS_STORAGE_KEY, JSON.stringify(next.filter((item) => !item.cloudId))); };
  const reasonLabels: Record<string, string> = { answer: "উত্তর ভুল মনে হয়েছে", wording: "প্রশ্নটি বুঝতে কঠিন", explanation: "Explanation পরিষ্কার নয়", source: "Chapter বা source মিলছে না" };
  const reportRows = reports.map((report, index) => { const classCatalog = report.classKey ? curriculumCatalog[report.classKey] : undefined; const matchingSubject = classCatalog ? Object.values(classCatalog).find((subject) => subject?.label === report.subject) : undefined; const question = matchingSubject?.questions.find((item) => item.id === report.questionId) ?? Object.values(curriculumCatalog).flatMap((subjects) => Object.values(subjects).flatMap((subject) => subject?.questions ?? [])).find((item) => item.id === report.questionId); return { report, index, question }; }).filter(({ report }) => (report.status ?? "pending") === reportFilter);
  const pendingReports = reports.filter((report) => (report.status ?? "pending") === "pending").length;
  return <div className="audit-shell"><div className="audit-top"><button className="back-link" onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরুন</button><span><ShieldCheck size={16} /> Owner review desk</span></div><section className="audit-hero"><div><p className="eyebrow">CONTENT CHECK • OWNER DESK</p><h1>প্রতিটি প্রশ্নের quality check</h1><p>Automatic checks এবং student reports—দুই দিক থেকেই content health দেখুন।</p></div><BadgeCheck size={46} /></section>{overview && <section className="owner-overview"><div className="audit-heading"><div><p className="eyebrow">PRIVACY-SAFE PLATFORM PULSE</p><h2>গত ৭ দিনে শিক্ষার্থীদের activity</h2></div><span>শুধু মোট সংখ্যা—কোনো নাম বা email নয়</span></div><div><article><Users size={20} /><span>মোট guardian</span><strong>{overview.total_guardians}</strong></article><article><UserRound size={20} /><span>মোট learner</span><strong>{overview.total_learners}</strong></article><article><Sparkles size={20} /><span>৭ দিনে active learner</span><strong>{overview.active_learners_7d}</strong></article><article><ListChecks size={20} /><span>৭ দিনের practice</span><strong>{overview.practices_7d}</strong></article><article><Trophy size={20} /><span>৭ দিনের average</span><strong>{overview.average_score_7d === null ? "—" : `${Math.round(Number(overview.average_score_7d))}%`}</strong></article><article><BookOpen size={20} /><span>সর্বমোট practice</span><strong>{overview.total_practices}</strong></article></div></section>}<div className="audit-summary"><article><ListChecks size={21} /><span>মোট প্রশ্ন</span><strong>{audit.total}</strong></article><article><BadgeCheck size={21} /><span>Automatic check pass</span><strong>{audit.passed}</strong></article><article className={pendingReports ? "attention" : "clear"}>{pendingReports ? <CircleAlert size={21} /> : <Check size={21} />}<span>Pending student report</span><strong>{pendingReports}</strong></article><article><BookMarked size={21} /><span>Source link আছে</span><strong>{audit.sourceCoverage}%</strong></article></div>
      <section className="report-queue"><div className="audit-heading"><div><p className="eyebrow">STUDENT REPORT QUEUE</p><h2>যে প্রশ্নগুলো আবার দেখা দরকার</h2></div><div className="queue-tabs"><button className={reportFilter === "pending" ? "active" : ""} onClick={() => setReportFilter("pending")}>Pending ({pendingReports})</button><button className={reportFilter === "reviewed" ? "active" : ""} onClick={() => setReportFilter("reviewed")}>Reviewed ({reports.length-pendingReports})</button></div></div>{reportRows.length ? <div className="report-list">{reportRows.map(({ report, index, question }) => <article key={`${report.cloudId ?? "local"}-${report.questionId}-${report.createdAt}`}><div className="report-row-top"><span className={reportFilter}>{reportFilter === "pending" ? "Review দরকার" : "Checked"}</span><small>{new Date(report.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</small></div><h3>{question?.prompt ?? `Question ID: ${report.questionId}`}</h3><p><strong>Report:</strong> {reasonLabels[report.reason] ?? report.reason}</p><div className="report-context"><span>Class {report.classKey ?? "—"}</span><span>{report.subject ?? "Subject unknown"}</span><span>{question?.chapter ?? "Question lookup pending"}</span><span>{report.cloudId ? "Cloud report" : "This device"}</span></div><button onClick={() => void setReportStatus(index, reportFilter === "pending" ? "reviewed" : "pending")}>{reportFilter === "pending" ? <><Check size={15} /> Mark as reviewed</> : <><RotateCcw size={15} /> Reopen report</>}</button></article>)}</div> : <div className="queue-empty"><BadgeCheck size={30} /><strong>{reportFilter === "pending" ? "কোনো pending report নেই" : "এখনো কোনো reviewed report নেই"}</strong><p>{reportFilter === "pending" ? "নতুন report এলে এখানে question ও reason দেখা যাবে।" : "Reviewed করা reports এখানে রাখা হবে।"}</p></div>}</section>
    <section className="audit-panel"><div className="audit-heading"><div><p className="eyebrow">CLASS & SUBJECT REPORT</p><h2>কোথায় কতটুকু content ready</h2></div><span>{audit.subjects.length} subject tracks</span></div><div className="audit-table-wrap"><table className="audit-table"><thead><tr><th>Class</th><th>Subject</th><th>Chapters</th><th>Questions</th><th>Status</th></tr></thead><tbody>{audit.subjects.map((subject) => <tr key={`${subject.classKey}-${subject.subject}`}><td>Class {subject.classKey}</td><td>{subject.subject}</td><td>{subject.chapters}</td><td>{subject.passed}/{subject.total}</td><td><span className={subject.issues ? "review" : "verified"}>{subject.issues ? `${subject.issues} review` : "Check passed"}</span></td></tr>)}</tbody></table></div></section><section className="audit-rules"><div><ShieldCheck size={22} /><h3>Automatic checks</h3><p>Answer range, duplicate options, missing explanation, chapter details এবং source link check করা হয়।</p></div><div><Users size={22} /><h3>Human review</h3><p>Student report-এর পরে subject expert দিয়ে meaning ও age-appropriate wording যাচাই করা প্রয়োজন।</p></div><div><BookOpen size={22} /><h3>Transparent source</h3><p>Practice-এর পরে learner official NCTB source link দেখতে পারে।</p></div></section><p className="audit-note"><ShieldCheck size={17} /> Owner Desk শুধু Supabase-এ approved admin account-এর জন্য visible। Report status cloud-এ save হয়।</p></div>;
}

function AccountMenu({ attempts, selectedClass, powerStars, profiles, activeProfileId, onSwitch, onAdd, cloudConfigured, cloudUserEmail, cloudStatus, cloudMessage, onCloudSignIn, onCloudSignOut, onCloudRetry }: { attempts: PracticeAttempt[]; selectedClass: ClassKey; powerStars: number; profiles: LearnerProfile[]; activeProfileId: string; onSwitch: (id: string) => void; onAdd: (name: string, classKey: ClassKey) => void; cloudConfigured: boolean; cloudUserEmail: string | null; cloudStatus: "guest" | "connecting" | "synced" | "error"; cloudMessage: string; onCloudSignIn: (email: string) => Promise<void>; onCloudSignOut: () => Promise<void>; onCloudRetry: () => void }) {
  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score / item.total * 100, 0) / attempts.length) : 0;
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0];
  const [dialogOpen, setDialogOpen] = useState(false); const [cloudDialogOpen, setCloudDialogOpen] = useState(false); const [newName, setNewName] = useState(""); const [newClass, setNewClass] = useState<ClassKey>("5"); const [guardianEmail, setGuardianEmail] = useState("");
  const createProfile = () => { if (!newName.trim()) return; onAdd(newName, newClass); setNewName(""); setDialogOpen(false); };
  return <><DropdownMenu><DropdownMenuTrigger asChild><button className="account-trigger" aria-label="Open learner profiles"><span className="avatar">{activeProfile.avatar}</span><span className="account-copy"><strong>{activeProfile.name}</strong><small>{powerStars} ⭐ • Class {selectedClass}</small></span><ChevronRight size={16} /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="account-menu"><DropdownMenuLabel><span className="account-title"><UserRound size={18} /> Who is learning?</span><small>প্রত্যেক learner-এর progress আলাদাভাবে save থাকবে।</small></DropdownMenuLabel><DropdownMenuSeparator /><div className="profile-list">{profiles.map((profile) => <button key={profile.id} className={profile.id === activeProfileId ? "active" : ""} onClick={() => onSwitch(profile.id)}><span>{profile.avatar}</span><div><strong>{profile.name}</strong><small>Class {profile.classKey}</small></div>{profile.id === activeProfileId && <Check size={16} />}</button>)}</div><button className="add-profile" onClick={() => setDialogOpen(true)}>+ Add another learner</button><DropdownMenuSeparator /><button className={`cloud-card ${cloudStatus}`} onClick={() => cloudUserEmail ? undefined : setCloudDialogOpen(true)}><span>{cloudUserEmail ? "☁️" : "🔒"}</span><div><strong>{cloudUserEmail ? "Cloud sync on" : "Protect this progress"}</strong><small>{cloudUserEmail ? cloudUserEmail : cloudConfigured ? "Guardian email দিয়ে backup করুন" : "Cloud setup pending"}</small></div><span className="cloud-state">{cloudStatus === "connecting" ? "Syncing…" : cloudStatus === "synced" ? "Synced" : cloudStatus === "error" ? "Needs retry" : ""}</span></button>{cloudUserEmail && cloudStatus === "error" && <button className="cloud-retry" onClick={onCloudRetry}><RotateCcw size={14} /> আবার sync করি</button>}{cloudUserEmail && <button className="cloud-signout" onClick={() => void onCloudSignOut()}>Use Guest Mode on this device</button>}<DropdownMenuSeparator /><div className="account-stats"><div><Trophy size={18} /><strong>{attempts.length}</strong><span>Practices</span></div><div><Star size={18} /><strong>{average}%</strong><span>Average</span></div></div><div className="star-bank"><Star size={18} fill="currentColor" /><span><strong>{powerStars}</strong> Power Stars collected</span></div></DropdownMenuContent></DropdownMenu><Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="profile-dialog"><DialogHeader><DialogTitle>Add a learner 🌟</DialogTitle><DialogDescription>একই device-এ প্রত্যেক শিশুর progress আলাদা থাকবে।</DialogDescription></DialogHeader><label><span>Learner&apos;s name</span><input value={newName} onChange={(event) => setNewName(event.target.value)} maxLength={20} placeholder="যেমন: Raiyan" autoFocus /></label><div><span className="profile-field-label">Class</span><div className="profile-class-grid">{(["5", "6", "7", "8", "9", "10"] as ClassKey[]).map((classKey) => <button key={classKey} className={newClass === classKey ? "active" : ""} onClick={() => setNewClass(classKey)}>Class {classKey}</button>)}</div></div><Button onClick={createProfile} disabled={!newName.trim()} className="profile-save">Create learner profile</Button></DialogContent></Dialog><Dialog open={cloudDialogOpen} onOpenChange={setCloudDialogOpen}><DialogContent className="profile-dialog"><DialogHeader><DialogTitle>Keep progress safe ☁️</DialogTitle><DialogDescription>Guardian-এর email-এ secure magic link যাবে। Password লাগবে না।</DialogDescription></DialogHeader><label><span>Guardian&apos;s email</span><input type="email" value={guardianEmail} onChange={(event) => setGuardianEmail(event.target.value)} placeholder="guardian@example.com" autoComplete="email" /></label>{cloudMessage && <p className={`cloud-message ${cloudStatus}`}>{cloudMessage}</p>}<Button onClick={() => void onCloudSignIn(guardianEmail)} disabled={!guardianEmail.includes("@") || cloudStatus === "connecting"} className="profile-save">{cloudStatus === "connecting" ? "Sending…" : "Email me a secure link"}</Button><p className="privacy-note">শিশুর email প্রয়োজন নেই। Guardian account-এর নিচে সব learner profile থাকবে।</p></DialogContent></Dialog></>;
}
function Heading({ icon, eyebrow, title, tone, compact = false }: { icon: React.ReactNode; eyebrow: string; title: string; tone: string; compact?: boolean }) { return <div className={`section-heading ${compact ? "compact" : ""}`}><span className={`icon-tile ${tone}`}>{icon}</span><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div></div>; }
function ResultCard({ icon, eyebrow, title, tone, attention, children }: { icon: React.ReactNode; eyebrow: string; title: string; tone: string; attention?: boolean; children: React.ReactNode }) { return <section className={`result-card ${attention ? "attention" : ""}`}><span className={`icon-tile ${tone}`}>{icon}</span><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{children}</p></section>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="field-label">{label}</label>{children}</div>; }
function Choice({ ariaLabel, value, onValueChange, options, labels, prefix = "", suffix = "" }: { ariaLabel: string; value: string; onValueChange: (value: string) => void; options: string[]; labels?: string[]; prefix?: string; suffix?: string }) { return <Select value={value} onValueChange={onValueChange}><SelectTrigger className="choice-trigger" aria-label={ariaLabel}><SelectValue /></SelectTrigger><SelectContent>{options.map((option, index) => <SelectItem key={option} value={option}>{prefix}{labels?.[index] ?? option}{suffix}</SelectItem>)}</SelectContent></Select>; }
