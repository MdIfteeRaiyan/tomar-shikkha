"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, BookMarked, BookOpen, BrainCircuit, CalendarDays, Check, ChevronRight, CircleAlert, Code2, Compass, ExternalLink, Gamepad2, HeartHandshake, Lightbulb, ListChecks, RotateCcw, ShieldCheck, Sparkles, Star, Target, Trophy, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { scienceQuestions, type ScienceQuestion } from "@/data/class-8-science";
import { class8ScienceMore } from "@/data/class-8-science-expansion";
import { banglaQuestions, bgsQuestions, englishQuestions, mathQuestions } from "@/data/class-8-main-subjects";
import { class7BanglaQuestions, class7BgsQuestions, class7EnglishQuestions, class7MathQuestions, class7ScienceQuestions } from "@/data/class-7-main-subjects";
import { class6BanglaQuestions, class6BgsQuestions, class6EnglishQuestions, class6MathQuestions, class6ScienceQuestions } from "@/data/class-6-main-subjects";
import { BreakZone } from "@/components/play-zone";
import { class5BanglaQuestions, class5BgsQuestions, class5EnglishQuestions, class5MathQuestions, class5ScienceQuestions } from "@/data/class-5-main-subjects";
import { class5MathDepth, class5MathMore, class5ScienceDepth, class5ScienceMore, class6MathDepth, class6MathMore, class6ScienceDepth, class6ScienceMore, class7MathDepth, class7MathMore, class7ScienceDepth, class7ScienceMore } from "@/data/expansion-questions";
import { isCloudConfigured, supabase } from "@/lib/supabase";
import { auditCurriculum } from "@/lib/content-audit";
import { CuriosityPop } from "@/components/curiosity-pop";
import { QuestZone } from "@/components/quest-zone";
import { buildPracticeQuestions, getDifficulty, shuffleQuestions as shuffled, type Difficulty } from "@/lib/quiz-engine";

type PracticeAttempt = { id: number; subject: string; chapter: string; score: number; total: number; focusArea: string; createdAt: number };
type RewardRedemption = { id: number; rewardId: string; cost: number; createdAt: number };
type SubjectKey = "science" | "math" | "english" | "bangla" | "bgs";
type ClassKey = "5" | "6" | "7" | "8";
const ATTEMPTS_STORAGE_KEY = "tomar-shikkha-attempts-v1";
const PROFILES_STORAGE_KEY = "tomar-shikkha-profiles-v1";
const ACTIVE_PROFILE_KEY = "tomar-shikkha-active-profile-v1";
const REWARDS_STORAGE_KEY = "tomar-shikkha-rewards-v1";
const QUEST_STARS_STORAGE_KEY = "tomar-shikkha-quest-stars-v1";
type LearnerProfile = { id: string; name: string; avatar: string; classKey: ClassKey };
const starterProfile: LearnerProfile = { id: "little-explorer", name: "Little Explorer", avatar: "🚀", classKey: "8" };
const coverage = [
  { className: "Class 5", status: "Live", subjects: "5 main subjects • 59 reviewed questions" },
  { className: "Class 6", status: "Live", subjects: "5 main subjects • 59 reviewed questions" },
  { className: "Class 7", status: "Live", subjects: "5 main subjects • 59 reviewed questions" },
  { className: "Class 8", status: "Live", subjects: "5 main subjects • 158 curriculum questions" },
];
const curriculumCatalog: Record<ClassKey, Record<SubjectKey, { label: string; questions: ScienceQuestion[] }>> = {
  "5": {
    science: { label: "Science", questions: [...class5ScienceQuestions, ...class5ScienceMore, ...class5ScienceDepth] }, math: { label: "Mathematics", questions: [...class5MathQuestions, ...class5MathMore, ...class5MathDepth] }, english: { label: "English", questions: class5EnglishQuestions }, bangla: { label: "Bangla", questions: class5BanglaQuestions }, bgs: { label: "Bangladesh & Global Studies", questions: class5BgsQuestions },
  },
  "6": {
    science: { label: "Science", questions: [...class6ScienceQuestions, ...class6ScienceMore, ...class6ScienceDepth] }, math: { label: "Mathematics", questions: [...class6MathQuestions, ...class6MathMore, ...class6MathDepth] }, english: { label: "English", questions: class6EnglishQuestions }, bangla: { label: "Bangla", questions: class6BanglaQuestions }, bgs: { label: "Bangladesh & Global Studies", questions: class6BgsQuestions },
  },
  "7": {
    science: { label: "Science", questions: [...class7ScienceQuestions, ...class7ScienceMore, ...class7ScienceDepth] }, math: { label: "Mathematics", questions: [...class7MathQuestions, ...class7MathMore, ...class7MathDepth] }, english: { label: "English", questions: class7EnglishQuestions }, bangla: { label: "Bangla", questions: class7BanglaQuestions }, bgs: { label: "Bangladesh & Global Studies", questions: class7BgsQuestions },
  },
  "8": {
    science: { label: "Science", questions: [...scienceQuestions, ...class8ScienceMore] }, math: { label: "Mathematics", questions: mathQuestions }, english: { label: "English", questions: englishQuestions }, bangla: { label: "Bangla", questions: banglaQuestions }, bgs: { label: "Bangladesh & Global Studies", questions: bgsQuestions },
  },
};
const difficultyCopy: Record<Difficulty, { label: string; hint: string }> = {
  easy: { label: "Easy", hint: "Recall & basics" },
  medium: { label: "Medium", hint: "Concept check" },
  hard: { label: "Hard", hint: "Think deeper" },
};

export default function Home() {
  const [screen, setScreen] = useState<"setup" | "quiz" | "result" | "break" | "quest" | "guardian" | "content-check">("setup");
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
  const [profiles, setProfiles] = useState<LearnerProfile[]>([starterProfile]);
  const [activeProfileId, setActiveProfileId] = useState(starterProfile.id);
  const [localReady, setLocalReady] = useState(false);
  const [cloudUserId, setCloudUserId] = useState<string | null>(null);
  const [cloudUserEmail, setCloudUserEmail] = useState<string | null>(null);
  const [cloudStatus, setCloudStatus] = useState<"guest" | "connecting" | "synced" | "error">("guest");
  const [cloudMessage, setCloudMessage] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
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
    if (!localReady || !supabase) return;
    const cloud = supabase;
    const loadCloud = async (userId: string, email: string | null) => {
      setCloudStatus("connecting"); setCloudUserId(userId); setCloudUserEmail(email);
      const [{ data: cloudProfiles, error: profileError }, { data: cloudAttempts, error: attemptError }, { data: cloudRewards, error: rewardError }] = await Promise.all([
        cloud.from("ts_learner_profiles").select("id,name,avatar,class_key").order("created_at"),
        cloud.from("ts_practice_attempts").select("profile_id,id,subject,chapter,score,total,focus_area,created_at").order("created_at", { ascending: false }),
        cloud.from("ts_reward_redemptions").select("profile_id,id,reward_id,cost,created_at").order("created_at", { ascending: false }),
      ]);
      if (profileError || attemptError || rewardError) { setCloudStatus("error"); setCloudMessage("Cloud setupটি এখনো complete হয়নি। Updated SQL setup check করুন।"); return; }
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
          if (profile.id === restoredActive.id) { setAttempts(profileAttempts); setRedemptions(profileRewards); }
        }
      } else {
        await cloud.from("ts_learner_profiles").upsert(profiles.map((profile) => ({ user_id: userId, id: profile.id, name: profile.name, avatar: profile.avatar, class_key: profile.classKey })), { onConflict: "user_id,id" });
      }
      setCloudStatus("synced"); setCloudMessage("Progress is safely synced.");
    };
    cloud.auth.getUser().then(({ data }) => { if (data.user) void loadCloud(data.user.id, data.user.email ?? null); });
    const { data: listener } = cloud.auth.onAuthStateChange((_event, session) => { if (session?.user) void loadCloud(session.user.id, session.user.email ?? null); else { setCloudUserId(null); setCloudUserEmail(null); setCloudStatus("guest"); } });
    return () => listener.subscription.unsubscribe();
  // Cloud hydration intentionally runs once after local state is ready; later changes use the sync effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localReady]);

  useEffect(() => {
    if (!localReady || !supabase || !cloudUserId) return;
    const cloud = supabase;
    const timer = window.setTimeout(async () => {
      setCloudStatus("connecting");
      const profileRows = profiles.map((profile) => ({ user_id: cloudUserId, id: profile.id, name: profile.name, avatar: profile.avatar, class_key: profile.classKey }));
      const attemptRows = attempts.map((attempt) => ({ user_id: cloudUserId, profile_id: activeProfileId, id: attempt.id, subject: attempt.subject, chapter: attempt.chapter, score: attempt.score, total: attempt.total, focus_area: attempt.focusArea, created_at: attempt.createdAt }));
      const rewardRows = redemptions.map((reward) => ({ user_id: cloudUserId, profile_id: activeProfileId, id: reward.id, reward_id: reward.rewardId, cost: reward.cost, created_at: reward.createdAt }));
      const profileResult = await cloud.from("ts_learner_profiles").upsert(profileRows, { onConflict: "user_id,id" });
      const attemptResult = attemptRows.length ? await cloud.from("ts_practice_attempts").upsert(attemptRows, { onConflict: "user_id,profile_id,id" }) : { error: null };
      const rewardResult = rewardRows.length ? await cloud.from("ts_reward_redemptions").upsert(rewardRows, { onConflict: "user_id,profile_id,id" }) : { error: null };
      setCloudStatus(profileResult.error || attemptResult.error || rewardResult.error ? "error" : "synced");
    }, 700);
    return () => window.clearTimeout(timer);
  }, [profiles, attempts, redemptions, activeProfileId, cloudUserId, localReady]);

  const sendMagicLink = async (email: string) => {
    if (!supabase) { setCloudStatus("error"); setCloudMessage("Cloud connection is not configured yet."); return; }
    const cloud = supabase;
    setCloudStatus("connecting");
    const { error } = await cloud.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) { setCloudStatus("error"); setCloudMessage(error.message); return; }
    setCloudMessage("Email পাঠানো হয়েছে—magic linkটি খুললেই progress sync হবে।");
  };
  const signOutCloud = async () => { if (supabase) await supabase.auth.signOut(); setCloudUserId(null); setCloudUserEmail(null); setCloudStatus("guest"); setCloudMessage(""); };

  const saveQuizResult = () => {
    setSaveState("saving");
    const catalog = curriculumCatalog[selectedClass][selectedSubject];
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
      setAttempts((currentAttempts) => {
        const nextAttempts = [attempt, ...currentAttempts].slice(0, 50);
        window.localStorage.setItem(`${ATTEMPTS_STORAGE_KEY}:${activeProfileId}`, JSON.stringify(nextAttempts));
        return nextAttempts;
      });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const switchProfile = (profileId: string) => {
    const profile = profiles.find((item) => item.id === profileId); if (!profile) return;
    setActiveProfileId(profileId); setSelectedClass(profile.classKey); setSelectedChapter("all"); setScreen("setup");
    window.localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    try { setAttempts(JSON.parse(window.localStorage.getItem(`${ATTEMPTS_STORAGE_KEY}:${profileId}`) ?? "[]")); setRedemptions(JSON.parse(window.localStorage.getItem(`${REWARDS_STORAGE_KEY}:${profileId}`) ?? "[]")); setQuestStars(Number(window.localStorage.getItem(`${QUEST_STARS_STORAGE_KEY}:${profileId}`) ?? "0")); } catch { setAttempts([]); setRedemptions([]); setQuestStars(0); }
  };
  const addProfile = (name: string, classKey: ClassKey) => {
    const cleanName = name.trim().slice(0, 20); if (!cleanName) return;
    const avatars = ["🚀", "🦊", "🐼", "🦁", "🦉", "🐯"];
    const profile = { id: `learner-${Date.now()}`, name: cleanName, avatar: avatars[profiles.length % avatars.length], classKey };
    const nextProfiles = [...profiles, profile]; setProfiles(nextProfiles); setActiveProfileId(profile.id); setSelectedClass(profile.classKey); setSelectedChapter("all"); setAttempts([]); setRedemptions([]); setQuestStars(0); setScreen("setup");
    window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles)); window.localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
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
  const earnQuestStars = (stars: number) => setQuestStars((currentStars) => {
    const nextStars = currentStars + stars;
    window.localStorage.setItem(`${QUEST_STARS_STORAGE_KEY}:${activeProfileId}`, String(nextStars));
    return nextStars;
  });

  const startQuiz = () => {
    const subjectQuestions = curriculumCatalog[selectedClass][selectedSubject].questions;
    const chapterPool = selectedChapter === "all" ? subjectQuestions : subjectQuestions.filter((q) => String(q.chapterNo) === selectedChapter);
    const nextQuestions = buildPracticeQuestions(chapterPool, Number(questionCount), difficulty);
    setPracticeMode("standard"); setQuizQuestions(nextQuestions); setAnswers(Array(nextQuestions.length).fill(null)); setCurrent(0); setRevealed(false); setSaveState("idle"); setScreen("quiz");
  };
  const startFocusedPractice = () => {
    if (!wrongQuestions.length) { startQuiz(); return; }
    const source = curriculumCatalog[selectedClass][selectedSubject].questions;
    const weakChapters = new Set(wrongQuestions.map((question) => question.chapterNo));
    const related = shuffled(source.filter((question) => weakChapters.has(question.chapterNo)));
    const relatedIds = new Set(related.map((question) => question.id));
    const support = shuffled(source.filter((question) => !relatedIds.has(question.id) && getDifficulty(question) === difficulty));
    const nextQuestions = [...related, ...support].slice(0, Math.min(10, source.length));
    setPracticeMode("focus"); setQuizQuestions(nextQuestions); setAnswers(Array(nextQuestions.length).fill(null)); setCurrent(0); setRevealed(false); setSaveState("idle"); setScreen("quiz");
  };
  const startSmartMission = () => {
    const latest = attempts[0];
    const detectedClass = latest?.chapter.match(/Class ([5-8])/)?.[1] as ClassKey | undefined;
    const missionClass = detectedClass ?? selectedClass;
    const subjectEntry = Object.entries(curriculumCatalog[missionClass]).find(([, subject]) => subject.label === latest?.subject) as [SubjectKey, { label: string; questions: ScienceQuestion[] }] | undefined;
    const missionSubject = subjectEntry?.[0] ?? selectedSubject;
    const source = curriculumCatalog[missionClass][missionSubject].questions;
    const weakQuestions = latest && latest.focusArea !== "Revision Complete" ? source.filter((question) => question.topic === latest.focusArea) : [];
    const weakChapters = new Set(weakQuestions.map((question) => question.chapterNo));
    const related = weakChapters.size ? source.filter((question) => weakChapters.has(question.chapterNo)) : source;
    const nextQuestions = shuffled([...new Map([...weakQuestions, ...related].map((question) => [question.id, question])).values()]).slice(0, Math.min(7, related.length));
    setSelectedClass(missionClass); setSelectedSubject(missionSubject); setSelectedChapter(weakQuestions[0] ? String(weakQuestions[0].chapterNo) : "all");
    setPracticeMode(weakQuestions.length ? "focus" : "standard"); setQuizQuestions(nextQuestions); setAnswers(Array(nextQuestions.length).fill(null)); setCurrent(0); setRevealed(false); setSaveState("idle"); setScreen("quiz");
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

  return <main className="min-h-screen">
    <header className="site-header"><div className="shell header-inner">
      <button className="brand" onClick={() => setScreen("setup")} aria-label="TomarShikkha home"><span className="brand-mark">ত</span><span className="brand-name">Tomar<span>Shikkha</span></span></button>
      <nav className="main-nav" aria-label="Main navigation"><button className={`nav-link ${["setup", "quiz", "result"].includes(screen) ? "active" : ""}`} onClick={() => showSection("practice-builder")}>Smart Practice</button><button className="nav-link" onClick={() => showSection("curriculum-map")}>Curriculum Map</button><button className={`nav-link ${screen === "quest" ? "active" : ""}`} onClick={() => setScreen("quest")}><Compass size={17} /> Quest</button><button className={`nav-link ${screen === "break" ? "active" : ""}`} onClick={() => setScreen("break")}><Gamepad2 size={17} /> Break Zone</button></nav>
      <button className={`guardian-link ${screen === "guardian" ? "active" : ""}`} onClick={() => setScreen("guardian")}><ShieldCheck size={17} /><span>Guardian View</span></button>
      <AccountMenu attempts={attempts} selectedClass={selectedClass} powerStars={powerStars} profiles={profiles} activeProfileId={activeProfileId} onSwitch={switchProfile} onAdd={addProfile} cloudConfigured={isCloudConfigured} cloudUserEmail={cloudUserEmail} cloudStatus={cloudStatus} cloudMessage={cloudMessage} onCloudSignIn={sendMagicLink} onCloudSignOut={signOutCloud} />
    </div></header>
    {screen === "setup" && <SetupScreen onStart={startQuiz} onSmartMission={startSmartMission} onQuest={() => setScreen("quest")} onBreak={() => setScreen("break")} onContentCheck={() => setScreen("content-check")} attempts={attempts} selectedClass={selectedClass} setSelectedClass={(value) => { setSelectedClass(value); setSelectedChapter("all"); }} selectedSubject={selectedSubject} setSelectedSubject={(value) => { setSelectedSubject(value); setSelectedChapter("all"); }} selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter} questionCount={questionCount} setQuestionCount={setQuestionCount} difficulty={difficulty} setDifficulty={setDifficulty} />}
    {screen === "quiz" && <QuizScreen questions={quizQuestions} classLabel={selectedClass} subjectLabel={curriculumCatalog[selectedClass][selectedSubject].label} difficulty={difficulty} practiceMode={practiceMode} current={current} answer={answers[current]} revealed={revealed} onAnswer={chooseAnswer} onNext={nextQuestion} onBack={() => { if (current === 0) setScreen("setup"); else { setCurrent((v) => v - 1); setRevealed(true); } }} />}
    {screen === "result" && <ResultScreen score={score} total={quizQuestions.length} wrongTopics={wrongTopics} saveState={saveState} onRetry={startQuiz} onFocus={startFocusedPractice} onHome={() => setScreen("setup")} />}
    {screen === "break" && <BreakZone onBack={() => setScreen("setup")} powerStars={powerStars} redemptions={redemptions} onRedeem={redeemReward} />}
    {screen === "quest" && <QuestZone classKey={selectedClass} profileId={activeProfileId} powerStars={powerStars} onEarn={earnQuestStars} onBack={() => setScreen("setup")} />}
    {screen === "guardian" && <GuardianDashboard profiles={profiles} attemptsByProfile={guardianAttempts} powerStars={powerStars} cloudUserEmail={cloudUserEmail} cloudStatus={cloudStatus} onBack={() => setScreen("setup")} onOpenLearner={(profileId) => switchProfile(profileId)} />}
    {screen === "content-check" && <ContentVerification onBack={() => setScreen("setup")} />}
    <CuriosityPop enabled={screen === "setup" || screen === "break"} />
  </main>;
}

function SetupScreen({ onStart, onSmartMission, onQuest, onBreak, onContentCheck, attempts, selectedClass, setSelectedClass, selectedSubject, setSelectedSubject, selectedChapter, setSelectedChapter, questionCount, setQuestionCount, difficulty, setDifficulty }: { onStart: () => void; onSmartMission: () => void; onQuest: () => void; onBreak: () => void; onContentCheck: () => void; attempts: PracticeAttempt[]; selectedClass: ClassKey; setSelectedClass: (value: ClassKey) => void; selectedSubject: SubjectKey; setSelectedSubject: (value: SubjectKey) => void; selectedChapter: string; setSelectedChapter: (value: string) => void; questionCount: string; setQuestionCount: (value: string) => void; difficulty: Difficulty; setDifficulty: (value: Difficulty) => void }) {
  const [currentTime] = useState(() => Date.now());
  const catalog = curriculumCatalog[selectedClass][selectedSubject];
  const chapters = [{ value: "all", label: "সব অধ্যায়", count: catalog.questions.length }, ...Array.from(new Map(catalog.questions.map((question) => [question.chapterNo, question])).values()).sort((a, b) => a.chapterNo - b.chapterNo).map((question) => ({ value: String(question.chapterNo), label: question.chapter, count: catalog.questions.filter((item) => item.chapterNo === question.chapterNo).length }))];
  const chapterPool = selectedChapter === "all" ? catalog.questions : catalog.questions.filter((q) => String(q.chapterNo) === selectedChapter);
  const availableCount = chapterPool.length;
  const preferredCount = chapterPool.filter((q) => getDifficulty(q) === difficulty).length;
  const actualQuestionCount = Math.min(Number(questionCount), availableCount);
  const latestAccuracy = attempts[0] ? Math.round((attempts[0].score / attempts[0].total) * 100) : 0;
  const recentAverage = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total) * 100, 0) / attempts.length) : 0;
  const practiceRhythm = Math.min(attempts.length * 20, 100);
  const practicedToday = attempts.some((attempt) => new Date(attempt.createdAt).toDateString() === new Date().toDateString());
  const latestFocus = attempts[0]?.focusArea;
  const missionText = latestFocus && latestFocus !== "Revision Complete" ? `${latestFocus} নিয়ে ৭ প্রশ্নের Smart Review` : `Class ${selectedClass} ${catalog.label} থেকে ৭ প্রশ্নের discovery mission`;
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
  return <div className="shell page-pad">
    <section className="welcome-strip"><div><p className="eyebrow">NCTB 2026 • BANGLA MEDIUM</p><h1>Ready, little champion? 🌟</h1><p className="brand-tagline">শেখো। খেলো। এগিয়ে চলো। <span>Learn it. Play it. Own it.</span></p></div><div className="streak-pill"><Sparkles size={18} /> Classes 5–8 • 20 subject tracks</div></section>
    <section className={`daily-quest ${practicedToday ? "complete" : ""}`}><span className="quest-icon">{practicedToday ? "🏆" : "🎯"}</span><div><p className="eyebrow">TODAY&apos;S SMART MISSION</p><strong>{practicedToday ? "আজকের mission complete—চাইলে next level চেষ্টা করো!" : missionText}</strong><small>{attempts.length ? "তোমার আগের শেখার তথ্য থেকে missionটি তৈরি হয়েছে।" : "প্রথম mission শেষে পরেরটি তোমার ফল অনুযায়ী বদলাবে।"}</small></div><div className="quest-actions"><button className="mission-start" onClick={onSmartMission}><BrainCircuit size={15} /> Start Mission</button><button className="quest-status" onClick={onQuest}><Compass size={15} /> Fun Quest</button><button className="quest-status" onClick={onBreak}><Gamepad2 size={15} /> Break Zone</button></div></section>
    <div className="dashboard-grid">
      <section className="practice-card" id="practice-builder">
        <Heading icon={<BrainCircuit size={22} />} eyebrow="SMART PRACTICE" title="Choose your next challenge" tone="teal" />
        <div className="class-switch-wrap"><label className="field-label">Choose your class</label><div className="class-switch" role="group" aria-label="Choose class">{(["5", "6", "7", "8"] as ClassKey[]).map((item) => <button key={item} type="button" className={selectedClass === item ? "active" : ""} onClick={() => setSelectedClass(item)} aria-pressed={selectedClass === item}><span>Class</span><strong>{item}</strong>{selectedClass === item && <Star size={14} fill="currentColor" />}</button>)}</div></div>
        <div className="form-grid">
          <Field label="Subject"><Choice ariaLabel="Subject" value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as SubjectKey)} options={Object.keys(curriculumCatalog[selectedClass])} labels={Object.values(curriculumCatalog[selectedClass]).map((subject) => subject.label)} /></Field>
          <Field label="Chapter"><Choice ariaLabel="Chapter" value={selectedChapter} onValueChange={setSelectedChapter} options={chapters.map((c) => c.value)} labels={chapters.map((c) => `${c.label} (${c.count})`)} /></Field>
          <Field label="Questions"><Choice ariaLabel="Number of questions" value={questionCount} onValueChange={setQuestionCount} options={["5", "10", "15", "20", "25", "30", "40", "50", "70"]} suffix=" questions" /></Field>
        </div>
        <div className="coverage-note" key={`${selectedClass}-${selectedSubject}-${selectedChapter}-${difficulty}-${questionCount}`}><BookMarked size={18} /><div><strong>{actualQuestionCount}টি question নিয়ে practice ready!</strong><span>{difficultyCopy[difficulty].label} questions আগে আসবে ({preferredCount}টি available), তারপর অন্য level থেকে practice পূর্ণ হবে • মোট available {availableCount}টি</span></div></div>
        <div className="challenge-block"><label className="field-label">Start with this level</label><div className="challenge-row">{(["easy", "medium", "hard"] as Difficulty[]).map((level) => <button type="button" key={level} className={difficulty === level ? "selected" : ""} onClick={() => setDifficulty(level)} aria-pressed={difficulty === level}><span>{difficultyCopy[level].label}</span><small>{difficultyCopy[level].hint}</small></button>)}</div></div>
        <Button onClick={onStart} size="lg" className="start-button" disabled={availableCount === 0}>Start {actualQuestionCount}-Question Practice <ArrowRight /></Button>
        <p className="demo-note">Questions are shuffled in every attempt</p>
      </section>
      <aside className="side-column">
        <section className="map-card"><Heading icon={<Compass size={20} />} eyebrow="LEARNING SNAPSHOT" title="See how you&apos;re growing" tone="blue" compact /><div className="learning-list">{learningAreas.map((area) => <div key={area.label}><div className="progress-label"><span>{area.label}</span><strong>{area.value}%</strong></div><div className="track"><span style={{ width: `${area.value}%`, background: area.color }} /></div></div>)}</div><button className="text-button">Based on your latest {attempts.length || 0} practice{attempts.length === 1 ? "" : "s"} <ChevronRight size={17} /></button></section>
        <section className="focus-card"><span className="focus-icon"><Target size={20} /></span><div><p className="eyebrow">SMART NEXT FOCUS</p><h3>{attempts[0]?.focusArea ?? "প্রথম practice শুরু করো"}</h3><p>{attempts.length ? "তোমার সাম্প্রতিক ভুল থেকে পরের focus বেছে নেওয়া হয়েছে।" : "একটি quiz শেষ করলেই তোমার জন্য পরের focus এখানে দেখা যাবে।"}</p></div></section>
        <RecentPractice attempts={attempts} />
      </aside>
    </div>
    <section className="mastery-section" id="curriculum-map"><div className="curriculum-heading"><div><p className="eyebrow">YOUR MASTERY MAP</p><h2>Class {selectedClass} • {catalog.label}</h2></div><span>{masteryChapters.filter((chapter) => chapter.status === "Mastered").length}/{masteryChapters.length} mastered</span></div><p className="mastery-intro">প্রতিটি practice-এর সঙ্গে chapterগুলো Not Started থেকে Mastered-এর দিকে এগোবে।</p><div className="mastery-grid">{masteryChapters.map((chapter) => <article key={chapter.value} className={`mastery-card ${chapter.status.toLowerCase().replace(" ", "-")}`}><div className="mastery-top"><span className="chapter-number">{chapter.value}</span><span className="mastery-status">{chapter.status}</span></div><h3>{chapter.label}</h3><div className="mastery-progress"><span style={{ width: `${chapter.score}%` }} /></div><div className="mastery-meta"><span>{chapter.attempts ? `${chapter.attempts} practice${chapter.attempts === 1 ? "" : "s"}` : "Ready to explore"}</span><strong>{chapter.score}%</strong></div><button onClick={() => { setSelectedChapter(chapter.value); document.getElementById("practice-builder")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{chapter.attempts ? "Practice again" : "Start chapter"} <ArrowRight size={14} /></button></article>)}</div></section>
    <section className="curriculum-section coverage-compact"><div className="curriculum-heading"><div><p className="eyebrow">CLASS 5–8 COVERAGE</p><h2>All four classes are live</h2></div><span>335 questions</span></div><div className="coverage-grid">{coverage.map((item) => <article key={item.className} className={item.status === "Live" ? "live" : ""}><div><h3>{item.className}</h3><span>{item.status}</span></div><p>{item.subjects}</p></article>)}</div></section>
    <footer className="creator-card"><span className="creator-icon"><Code2 size={24} /></span><div><p className="eyebrow">BUILT BY A LEARNER, FOR LEARNERS</p><h2>Md. Iftee Raiyan</h2><p>CSE Undergraduate at East West University—exploring software development, problem-solving, and learning by building.</p></div><div className="creator-actions"><button onClick={onContentCheck}><BadgeCheck size={16} /> Content Check</button><a href="https://www.linkedin.com/in/md-iftee-raiyan-b20336386/" target="_blank" rel="noreferrer">View LinkedIn <ExternalLink size={16} /></a></div></footer>
  </div>;
}

function QuizScreen({ questions, classLabel, subjectLabel, difficulty, practiceMode, current, answer, revealed, onAnswer, onNext, onBack }: { questions: ScienceQuestion[]; classLabel: ClassKey; subjectLabel: string; difficulty: Difficulty; practiceMode: "standard" | "focus"; current: number; answer: number | null; revealed: boolean; onAnswer: (i: number) => void; onNext: () => void; onBack: () => void }) {
  const question = questions[current]; const correct = answer === question.answer;
  return <div className="quiz-shell"><div className="quiz-topline"><button className="back-link" onClick={onBack}><ArrowLeft size={18} /> ফিরে যাই</button><span>Class {classLabel} • {subjectLabel} • {practiceMode === "focus" ? "Smart Review" : difficultyCopy[difficulty].label} • NCTB 2026</span></div><Progress value={((current + 1) / questions.length) * 100} className="quiz-progress" /><div className="question-count">প্রশ্ন {current + 1} / {questions.length} <span>•</span> {practiceMode === "focus" ? "আবার শেখা" : difficultyCopy[difficulty].label} <span>•</span> {question.chapter} <span>•</span> {question.topic}</div>
    <section className="question-card"><div className="question-icon"><BookOpen size={24} /></div><h1>{question.prompt}</h1><div className="option-list">{question.options.map((option, index) => { const isCorrect = revealed && index === question.answer; const isWrong = revealed && answer === index && index !== question.answer; return <button key={option} onClick={() => onAnswer(index)} className={`${answer === index ? "chosen" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{isCorrect && <Check size={20} />}</button>; })}</div>
      {revealed && <><div className={`explanation ${correct ? "success" : "review"}`}><Lightbulb size={22} /><div><strong>{correct ? "ঠিক হয়েছে! +10 Power Stars ⭐" : `সঠিক উত্তর: ${question.options[question.answer]}`}</strong>{!correct && <span className="answer-why">তোমার বেছে নেওয়া উত্তরটি কেন মিলছে না, explanation থেকে বুঝে নাও।</span>}<p><b>কেন?</b> {question.explanation}</p></div></div><div className="origin-card"><BookMarked size={21} /><div><strong>তোমার textbook থেকে</strong><p>{question.origin}</p><a href={question.sourceUrl} target="_blank" rel="noreferrer">Official NCTB book list দেখো <ExternalLink size={13} /></a><span>Chapter verified • Exact page reference review চলছে</span></div></div></>}
      <div className="quiz-actions"><span>{answer === null ? "একটি উত্তর বেছে নাও" : revealed ? "ব্যাখ্যাটি পড়ে পরের প্রশ্নে যাও" : "Ready? এবার উত্তর মিলিয়ে দেখো"}</span><Button onClick={onNext} disabled={answer === null} size="lg" className="next-button">{revealed ? (current === questions.length - 1 ? "ফলাফল দেখি" : "পরের প্রশ্ন") : "উত্তর মিলাই"} <ArrowRight /></Button></div>
    </section></div>;
}

function ResultScreen({ score, total, wrongTopics, saveState, onRetry, onFocus, onHome }: { score: number; total: number; wrongTopics: string[]; saveState: "idle" | "saving" | "saved" | "error"; onRetry: () => void; onFocus: () => void; onHome: () => void }) {
  const percentage = Math.round((score / total) * 100); const nextFocus = wrongTopics[0] ?? "Mixed Revision";
  return <div className="result-shell"><section className="result-hero"><div className="result-ring" style={{ "--score": `${percentage * 3.6}deg` } as React.CSSProperties}><div><strong>{score}/{total}</strong><span>Correct answers</span></div></div><div><p className="eyebrow">QUIZ COMPLETE</p><h1>{percentage >= 80 ? "Star learner! 🌟" : percentage >= 50 ? "Great progress! 🚀" : "Brave try! 💪"}</h1><p>তোমার result analyze করা হয়েছে। এখন strong area আর next focus দেখে smartভাবে এগিয়ে যাও।</p><div className="reward-pill"><Star size={17} fill="currentColor" /> +{score * 10} Power Stars earned</div><div className={`save-status ${saveState}`}>{saveState === "saving" ? "Saving progress…" : saveState === "saved" ? "✓ Progress saved" : saveState === "error" ? "Progress could not be saved" : "Preparing your Learning Map…"}</div></div></section>
    <div className="result-grid"><ResultCard tone="teal" icon={<Check size={22} />} eyebrow="COMPLETED" title={`${score} concepts correct`}>তোমার correct answers Learning Map-এ যোগ হয়েছে।</ResultCard><ResultCard tone="gold" icon={<Target size={22} />} eyebrow="MISTAKE MEMORY" title={nextFocus} attention>{wrongTopics.length ? `${wrongTopics.length}টি concept next practice-এ priority পাবে।` : "No active gap—next round will strengthen retention."}</ResultCard></div>
    <section className="next-step-card"><div><span className="icon-tile blue"><BrainCircuit size={23} /></span><div><p className="eyebrow">SMART NEXT STEP</p><h2>{wrongTopics.length ? `${nextFocus}—Focused Practice` : "Keep your momentum"}</h2><p>{wrongTopics.length ? "Latest mistakes থেকে তৈরি adaptive review" : "No active gap—try another shuffled round"}</p></div></div><Button onClick={wrongTopics.length ? onFocus : onRetry} size="lg" className="start-button compact-button">{wrongTopics.length ? "Fix Weak Topics" : "Practice Again"} <ArrowRight /></Button></section><button className="restart-link" onClick={onHome}><RotateCcw size={17} /> Choose another topic</button></div>;
}

function RecentPractice({ attempts }: { attempts: PracticeAttempt[] }) { return <section className="recent-card" id="recent-history"><div className="recent-heading"><div><p className="eyebrow">RECENT PRACTICE</p><h3>Your saved progress</h3></div><span>{attempts.length}</span></div>{attempts.length === 0 ? <p className="recent-empty">Complete your first quiz—result এখানে automatically save হবে।</p> : <div className="attempt-list">{attempts.slice(0, 3).map((attempt) => <div key={attempt.id}><span className="attempt-score">{attempt.score}/{attempt.total}</span><div><strong>{attempt.subject}</strong><small>{attempt.chapter} • {new Date(attempt.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</small></div></div>)}</div>}</section>; }

function GuardianDashboard({ profiles, attemptsByProfile, powerStars, cloudUserEmail, cloudStatus, onBack, onOpenLearner }: { profiles: LearnerProfile[]; attemptsByProfile: Record<string, PracticeAttempt[]>; powerStars: number; cloudUserEmail: string | null; cloudStatus: "guest" | "connecting" | "synced" | "error"; onBack: () => void; onOpenLearner: (profileId: string) => void }) {
  const allAttempts = profiles.flatMap((profile) => attemptsByProfile[profile.id] ?? []);
  const [weekStart] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weeklyAttempts = allAttempts.filter((attempt) => attempt.createdAt >= weekStart);
  const average = allAttempts.length ? Math.round(allAttempts.reduce((sum, attempt) => sum + attempt.score / attempt.total * 100, 0) / allAttempts.length) : 0;
  const practicedDays = new Set(weeklyAttempts.map((attempt) => new Date(attempt.createdAt).toDateString())).size;
  const latestFocus = [...allAttempts].sort((a, b) => b.createdAt - a.createdAt).find((attempt) => attempt.focusArea !== "Revision Complete")?.focusArea;
  const guidance = !allAttempts.length ? "একসঙ্গে প্রথম একটি ছোট practice বেছে দিন। শুরু করাটাই আজকের সাফল্য।" : average < 50 ? "ভুলের জন্য চাপ দেবেন না। ৫–৭টি সহজ প্রশ্ন দিয়ে দুর্বল বিষয়টি আবার practice করতে দিন।" : average < 75 ? "প্রতিদিন ১০ মিনিট practice ধরে রাখুন। সঠিক উত্তরটি কেন ঠিক, তা শিশুকে নিজের ভাষায় বলতে বলুন।" : "Progress ভালো হচ্ছে। এবার Medium বা Hard challenge বেছে নিতে উৎসাহ দিন।";
  return <div className="guardian-shell"><div className="guardian-top"><button className="back-link" onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরুন</button><div className={`guardian-cloud ${cloudStatus}`}><span>{cloudUserEmail ? "☁️" : "💻"}</span><div><strong>{cloudUserEmail ? "Cloud backup চালু আছে" : "এই device-এ save আছে"}</strong><small>{cloudUserEmail ?? "অন্য device-এ দেখতে পরে sign in করুন"}</small></div></div></div><section className="guardian-hero"><div><p className="eyebrow">GUARDIAN VIEW</p><h1>শিশুর শেখার সহজ চিত্র</h1><p>সহজ ভাষায় দেখুন—কোথায় ভালো করছে এবং এখন কীভাবে সাহায্য করবেন।</p></div><span className="guardian-hero-icon"><HeartHandshake size={30} /></span></section><div className="guardian-stats"><article><Users size={21} /><span>শিক্ষার্থী</span><strong>{profiles.length}</strong><small>আলাদা learning profile</small></article><article><CalendarDays size={21} /><span>গত ৭ দিন</span><strong>{weeklyAttempts.length}</strong><small>{practicedDays} দিন practice হয়েছে</small></article><article><Trophy size={21} /><span>সঠিক উত্তরের গড়</span><strong>{average}%</strong><small>{allAttempts.length}টি practice থেকে</small></article><article><Star size={21} /><span>Power Stars</span><strong>{powerStars}</strong><small>Practice ও Quest মিলিয়ে</small></article></div><section className="guardian-guidance"><span><Lightbulb size={22} /></span><div><p className="eyebrow">আপনি এখন যা করতে পারেন</p><h2>{guidance}</h2>{latestFocus && <p>পরের focus: <strong>{latestFocus}</strong></p>}</div></section><section className="guardian-learners"><div className="guardian-section-heading"><div><p className="eyebrow">LEARNER PROGRESS</p><h2>প্রত্যেক শিশুর আলাদা অগ্রগতি</h2></div><span>School grade নয়—practice trend</span></div><div className="guardian-learner-grid">{profiles.map((profile) => { const profileAttempts = attemptsByProfile[profile.id] ?? []; const profileAverage = profileAttempts.length ? Math.round(profileAttempts.reduce((sum, attempt) => sum + attempt.score / attempt.total * 100, 0) / profileAttempts.length) : 0; const recent = profileAttempts[0]; return <article key={profile.id}><div className="guardian-profile-head"><span>{profile.avatar}</span><div><h3>{profile.name}</h3><p>Class {profile.classKey}</p></div><strong>{profileAverage}%</strong></div><div className="guardian-profile-bar"><span style={{ width: `${profileAverage}%` }} /></div><dl><div><dt>মোট practice</dt><dd>{profileAttempts.length}</dd></div><div><dt>শেষ ফল</dt><dd>{recent ? `${recent.score}/${recent.total}` : "—"}</dd></div><div><dt>আরও সাহায্য দরকার</dt><dd>{recent?.focusArea === "Revision Complete" ? "এখন জরুরি কিছু নেই" : recent?.focusArea ?? "প্রথম practice"}</dd></div></dl><button onClick={() => onOpenLearner(profile.id)}>{profile.name}-এর শেখার পাতা খুলুন <ArrowRight size={15} /></button></article>; })}</div></section><p className="guardian-note"><ShieldCheck size={17} /> TomarShikkha-এর practice result কোনো school exam result নয়। লক্ষ্য হলো শিশুর confidence ও নিয়মিত শেখা বাড়ানো।</p></div>;
}

function ContentVerification({ onBack }: { onBack: () => void }) {
  const audit = auditCurriculum(curriculumCatalog);
  return <div className="audit-shell"><div className="audit-top"><button className="back-link" onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরুন</button><span><ShieldCheck size={16} /> Read-only verification</span></div><section className="audit-hero"><div><p className="eyebrow">CONTENT CHECK • OWNER DESK</p><h1>প্রতিটি প্রশ্নের quality check</h1><p>Question structure, answer, explanation ও official source—সবগুলো একসঙ্গে automatic check হয়।</p></div><BadgeCheck size={46} /></section><div className="audit-summary"><article><ListChecks size={21} /><span>মোট প্রশ্ন</span><strong>{audit.total}</strong></article><article><BadgeCheck size={21} /><span>Automatic check pass</span><strong>{audit.passed}</strong></article><article className={audit.issues ? "attention" : "clear"}>{audit.issues ? <CircleAlert size={21} /> : <Check size={21} />}<span>যাচাইয়ের সমস্যা</span><strong>{audit.issues}</strong></article><article><BookMarked size={21} /><span>Source link আছে</span><strong>{audit.sourceCoverage}%</strong></article></div><section className="audit-panel"><div className="audit-heading"><div><p className="eyebrow">CLASS & SUBJECT REPORT</p><h2>কোথায় কতটুকু content ready</h2></div><span>{audit.subjects.length} subject tracks</span></div><div className="audit-table-wrap"><table className="audit-table"><thead><tr><th>Class</th><th>Subject</th><th>Chapters</th><th>Questions</th><th>Status</th></tr></thead><tbody>{audit.subjects.map((subject) => <tr key={`${subject.classKey}-${subject.subject}`}><td>Class {subject.classKey}</td><td>{subject.subject}</td><td>{subject.chapters}</td><td>{subject.passed}/{subject.total}</td><td><span className={subject.issues ? "review" : "verified"}>{subject.issues ? `${subject.issues} review` : "Check passed"}</span></td></tr>)}</tbody></table></div></section><section className="audit-rules"><div><ShieldCheck size={22} /><h3>Automatic checks</h3><p>Answer range, duplicate options, missing explanation, chapter details এবং source link check করা হয়।</p></div><div><Users size={22} /><h3>Human review</h3><p>বিষয়ভিত্তিক expert দিয়ে textbook meaning ও age-appropriate wording review করা পরবর্তী editorial step।</p></div><div><BookOpen size={22} /><h3>Transparent source</h3><p>Practice-এর পরে learner official NCTB source link দেখতে পারে।</p></div></section><p className="audit-note"><CircleAlert size={17} /> “Check passed” মানে technical structure ঠিক আছে; এটি subject expert-এর final academic approval-এর বিকল্প নয়।</p></div>;
}

function AccountMenu({ attempts, selectedClass, powerStars, profiles, activeProfileId, onSwitch, onAdd, cloudConfigured, cloudUserEmail, cloudStatus, cloudMessage, onCloudSignIn, onCloudSignOut }: { attempts: PracticeAttempt[]; selectedClass: ClassKey; powerStars: number; profiles: LearnerProfile[]; activeProfileId: string; onSwitch: (id: string) => void; onAdd: (name: string, classKey: ClassKey) => void; cloudConfigured: boolean; cloudUserEmail: string | null; cloudStatus: "guest" | "connecting" | "synced" | "error"; cloudMessage: string; onCloudSignIn: (email: string) => Promise<void>; onCloudSignOut: () => Promise<void> }) {
  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score / item.total * 100, 0) / attempts.length) : 0;
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? profiles[0];
  const [dialogOpen, setDialogOpen] = useState(false); const [cloudDialogOpen, setCloudDialogOpen] = useState(false); const [newName, setNewName] = useState(""); const [newClass, setNewClass] = useState<ClassKey>("5"); const [guardianEmail, setGuardianEmail] = useState("");
  const createProfile = () => { if (!newName.trim()) return; onAdd(newName, newClass); setNewName(""); setDialogOpen(false); };
  return <><DropdownMenu><DropdownMenuTrigger asChild><button className="account-trigger" aria-label="Open learner profiles"><span className="avatar">{activeProfile.avatar}</span><span className="account-copy"><strong>{activeProfile.name}</strong><small>{powerStars} ⭐ • Class {selectedClass}</small></span><ChevronRight size={16} /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="account-menu"><DropdownMenuLabel><span className="account-title"><UserRound size={18} /> Who is learning?</span><small>প্রত্যেক learner-এর progress আলাদাভাবে save থাকবে।</small></DropdownMenuLabel><DropdownMenuSeparator /><div className="profile-list">{profiles.map((profile) => <button key={profile.id} className={profile.id === activeProfileId ? "active" : ""} onClick={() => onSwitch(profile.id)}><span>{profile.avatar}</span><div><strong>{profile.name}</strong><small>Class {profile.classKey}</small></div>{profile.id === activeProfileId && <Check size={16} />}</button>)}</div><button className="add-profile" onClick={() => setDialogOpen(true)}>+ Add another learner</button><DropdownMenuSeparator /><button className={`cloud-card ${cloudStatus}`} onClick={() => cloudUserEmail ? undefined : setCloudDialogOpen(true)}><span>{cloudUserEmail ? "☁️" : "🔒"}</span><div><strong>{cloudUserEmail ? "Cloud sync on" : "Protect this progress"}</strong><small>{cloudUserEmail ? cloudUserEmail : cloudConfigured ? "Guardian email দিয়ে backup করুন" : "Cloud setup pending"}</small></div><span className="cloud-state">{cloudStatus === "connecting" ? "Syncing…" : cloudStatus === "synced" ? "Synced" : ""}</span></button>{cloudUserEmail && <button className="cloud-signout" onClick={() => void onCloudSignOut()}>Use Guest Mode on this device</button>}<DropdownMenuSeparator /><div className="account-stats"><div><Trophy size={18} /><strong>{attempts.length}</strong><span>Practices</span></div><div><Star size={18} /><strong>{average}%</strong><span>Average</span></div></div><div className="star-bank"><Star size={18} fill="currentColor" /><span><strong>{powerStars}</strong> Power Stars collected</span></div></DropdownMenuContent></DropdownMenu><Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="profile-dialog"><DialogHeader><DialogTitle>Add a learner 🌟</DialogTitle><DialogDescription>একই device-এ প্রত্যেক শিশুর progress আলাদা থাকবে।</DialogDescription></DialogHeader><label><span>Learner&apos;s name</span><input value={newName} onChange={(event) => setNewName(event.target.value)} maxLength={20} placeholder="যেমন: Raiyan" autoFocus /></label><div><span className="profile-field-label">Class</span><div className="profile-class-grid">{(["5", "6", "7", "8"] as ClassKey[]).map((classKey) => <button key={classKey} className={newClass === classKey ? "active" : ""} onClick={() => setNewClass(classKey)}>Class {classKey}</button>)}</div></div><Button onClick={createProfile} disabled={!newName.trim()} className="profile-save">Create learner profile</Button></DialogContent></Dialog><Dialog open={cloudDialogOpen} onOpenChange={setCloudDialogOpen}><DialogContent className="profile-dialog"><DialogHeader><DialogTitle>Keep progress safe ☁️</DialogTitle><DialogDescription>Guardian-এর email-এ secure magic link যাবে। Password লাগবে না।</DialogDescription></DialogHeader><label><span>Guardian&apos;s email</span><input type="email" value={guardianEmail} onChange={(event) => setGuardianEmail(event.target.value)} placeholder="guardian@example.com" autoComplete="email" /></label>{cloudMessage && <p className={`cloud-message ${cloudStatus}`}>{cloudMessage}</p>}<Button onClick={() => void onCloudSignIn(guardianEmail)} disabled={!guardianEmail.includes("@") || cloudStatus === "connecting"} className="profile-save">{cloudStatus === "connecting" ? "Sending…" : "Email me a secure link"}</Button><p className="privacy-note">শিশুর email প্রয়োজন নেই। Guardian account-এর নিচে সব learner profile থাকবে।</p></DialogContent></Dialog></>;
}
function Heading({ icon, eyebrow, title, tone, compact = false }: { icon: React.ReactNode; eyebrow: string; title: string; tone: string; compact?: boolean }) { return <div className={`section-heading ${compact ? "compact" : ""}`}><span className={`icon-tile ${tone}`}>{icon}</span><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div></div>; }
function ResultCard({ icon, eyebrow, title, tone, attention, children }: { icon: React.ReactNode; eyebrow: string; title: string; tone: string; attention?: boolean; children: React.ReactNode }) { return <section className={`result-card ${attention ? "attention" : ""}`}><span className={`icon-tile ${tone}`}>{icon}</span><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{children}</p></section>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="field-label">{label}</label>{children}</div>; }
function Choice({ ariaLabel, value, onValueChange, options, labels, prefix = "", suffix = "" }: { ariaLabel: string; value: string; onValueChange: (value: string) => void; options: string[]; labels?: string[]; prefix?: string; suffix?: string }) { return <Select value={value} onValueChange={onValueChange}><SelectTrigger className="choice-trigger" aria-label={ariaLabel}><SelectValue /></SelectTrigger><SelectContent>{options.map((option, index) => <SelectItem key={option} value={option}>{prefix}{labels?.[index] ?? option}{suffix}</SelectItem>)}</SelectContent></Select>; }
