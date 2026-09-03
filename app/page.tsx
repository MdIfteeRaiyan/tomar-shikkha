"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookMarked, BookOpen, BrainCircuit, Check, ChevronRight, Code2, Compass, ExternalLink, Gamepad2, Lightbulb, RotateCcw, Sparkles, Star, Target, Trophy, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { scienceQuestions, type ScienceQuestion } from "@/data/class-8-science";
import { banglaQuestions, bgsQuestions, englishQuestions, mathQuestions } from "@/data/class-8-main-subjects";
import { class7BanglaQuestions, class7BgsQuestions, class7EnglishQuestions, class7MathQuestions, class7ScienceQuestions } from "@/data/class-7-main-subjects";
import { class6BanglaQuestions, class6BgsQuestions, class6EnglishQuestions, class6MathQuestions, class6ScienceQuestions } from "@/data/class-6-main-subjects";
import { PlayZone } from "@/components/play-zone";
import { class5BanglaQuestions, class5BgsQuestions, class5EnglishQuestions, class5MathQuestions, class5ScienceQuestions } from "@/data/class-5-main-subjects";
import { class5MathMore, class5ScienceMore, class6MathMore, class6ScienceMore, class7MathMore, class7ScienceMore } from "@/data/expansion-questions";

type PracticeAttempt = { id: number; subject: string; chapter: string; score: number; total: number; focusArea: string; createdAt: number };
type Difficulty = "easy" | "medium" | "hard";
type SubjectKey = "science" | "math" | "english" | "bangla" | "bgs";
type ClassKey = "5" | "6" | "7" | "8";
const ATTEMPTS_STORAGE_KEY = "tomar-shikkha-attempts-v1";
const coverage = [
  { className: "Class 5", status: "Live", subjects: "5 main subjects • 51 reviewed questions" },
  { className: "Class 6", status: "Live", subjects: "5 main subjects • 51 reviewed questions" },
  { className: "Class 7", status: "Live", subjects: "5 main subjects • 51 reviewed questions" },
  { className: "Class 8", status: "Live", subjects: "5 main subjects • 130 curriculum questions" },
];
const curriculumCatalog: Record<ClassKey, Record<SubjectKey, { label: string; questions: ScienceQuestion[] }>> = {
  "5": {
    science: { label: "Science", questions: [...class5ScienceQuestions, ...class5ScienceMore] }, math: { label: "Mathematics", questions: [...class5MathQuestions, ...class5MathMore] }, english: { label: "English", questions: class5EnglishQuestions }, bangla: { label: "Bangla", questions: class5BanglaQuestions }, bgs: { label: "Bangladesh & Global Studies", questions: class5BgsQuestions },
  },
  "6": {
    science: { label: "Science", questions: [...class6ScienceQuestions, ...class6ScienceMore] }, math: { label: "Mathematics", questions: [...class6MathQuestions, ...class6MathMore] }, english: { label: "English", questions: class6EnglishQuestions }, bangla: { label: "Bangla", questions: class6BanglaQuestions }, bgs: { label: "Bangladesh & Global Studies", questions: class6BgsQuestions },
  },
  "7": {
    science: { label: "Science", questions: [...class7ScienceQuestions, ...class7ScienceMore] }, math: { label: "Mathematics", questions: [...class7MathQuestions, ...class7MathMore] }, english: { label: "English", questions: class7EnglishQuestions }, bangla: { label: "Bangla", questions: class7BanglaQuestions }, bgs: { label: "Bangladesh & Global Studies", questions: class7BgsQuestions },
  },
  "8": {
    science: { label: "Science", questions: scienceQuestions }, math: { label: "Mathematics", questions: mathQuestions }, english: { label: "English", questions: englishQuestions }, bangla: { label: "Bangla", questions: banglaQuestions }, bgs: { label: "Bangladesh & Global Studies", questions: bgsQuestions },
  },
};
const shuffled = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const getDifficulty = (question: ScienceQuestion): Difficulty => {
  const sequence = Number(question.id.slice(-2));
  return sequence <= 2 ? "easy" : sequence <= 4 ? "medium" : "hard";
};
const difficultyCopy: Record<Difficulty, { label: string; hint: string }> = {
  easy: { label: "Easy", hint: "Recall & basics" },
  medium: { label: "Medium", hint: "Concept check" },
  hard: { label: "Hard", hint: "Think deeper" },
};

export default function Home() {
  const [screen, setScreen] = useState<"setup" | "quiz" | "result" | "play">("setup");
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
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const powerStars = useMemo(() => attempts.reduce((sum, attempt) => sum + attempt.score * 10, 0), [attempts]);
  const score = useMemo(() => answers.reduce<number>((sum, answer, index) => sum + (answer === quizQuestions[index]?.answer ? 1 : 0), 0), [answers, quizQuestions]);
  const wrongTopics = useMemo(() => quizQuestions.filter((question, index) => answers[index] !== null && answers[index] !== question.answer).map((question) => question.topic), [answers, quizQuestions]);
  const wrongQuestions = useMemo(() => quizQuestions.filter((question, index) => answers[index] !== null && answers[index] !== question.answer), [answers, quizQuestions]);

  useEffect(() => {
    try {
      const savedAttempts = window.localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (savedAttempts) setAttempts(JSON.parse(savedAttempts));
    } catch {
      setAttempts([]);
    }
  }, []);

  useEffect(() => {
    if (screen !== "result" || saveState !== "idle") return;
    setSaveState("saving");
    const catalog = curriculumCatalog[selectedClass][selectedSubject];
    const chapterName = selectedChapter === "all" ? `Class ${selectedClass} • Mixed Practice` : `Class ${selectedClass} • ${quizQuestions[0]?.chapter ?? catalog.label}`;
    const attempt: PracticeAttempt = {
      id: Date.now(),
      subject: catalog.label,
      chapter: chapterName,
      score,
      total: quizQuestions.length,
      focusArea: wrongTopics[0] ?? "Revision Complete",
      createdAt: Date.now(),
    };
    try {
      setAttempts((currentAttempts) => {
        const nextAttempts = [attempt, ...currentAttempts].slice(0, 50);
        window.localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(nextAttempts));
        return nextAttempts;
      });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, [screen, saveState, score, wrongTopics, quizQuestions, selectedChapter, selectedSubject, selectedClass]);

  const startQuiz = () => {
    const subjectQuestions = curriculumCatalog[selectedClass][selectedSubject].questions;
    const chapterPool = selectedChapter === "all" ? subjectQuestions : subjectQuestions.filter((q) => String(q.chapterNo) === selectedChapter);
    const pool = chapterPool.filter((q) => getDifficulty(q) === difficulty);
    const nextQuestions = shuffled(pool).slice(0, Math.min(Number(questionCount), pool.length));
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
  const chooseAnswer = (index: number) => { if (!revealed) { const next = [...answers]; next[current] = index; setAnswers(next); } };
  const nextQuestion = () => {
    if (!revealed) { setRevealed(true); return; }
    if (current === quizQuestions.length - 1) { setScreen("result"); return; }
    setCurrent((value) => value + 1); setRevealed(false);
  };
  const showSection = (id: string) => {
    setScreen("setup");
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  return <main className="min-h-screen">
    <header className="site-header"><div className="shell header-inner">
      <button className="brand" onClick={() => setScreen("setup")} aria-label="TomarShikkha home"><span className="brand-mark">ত</span><span className="brand-name">Tomar<span>Shikkha</span></span></button>
      <nav className="main-nav" aria-label="Main navigation"><button className={`nav-link ${screen !== "play" ? "active" : ""}`} onClick={() => showSection("practice-builder")}>Smart Practice</button><button className="nav-link" onClick={() => showSection("curriculum-map")}>Curriculum Map</button><button className={`nav-link ${screen === "play" ? "active" : ""}`} onClick={() => setScreen("play")}><Gamepad2 size={17} /> Play Zone</button></nav>
      <AccountMenu attempts={attempts} selectedClass={selectedClass} powerStars={powerStars} />
    </div></header>
    {screen === "setup" && <SetupScreen onStart={startQuiz} onPlay={() => setScreen("play")} attempts={attempts} selectedClass={selectedClass} setSelectedClass={(value) => { setSelectedClass(value); setSelectedChapter("all"); }} selectedSubject={selectedSubject} setSelectedSubject={(value) => { setSelectedSubject(value); setSelectedChapter("all"); }} selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter} questionCount={questionCount} setQuestionCount={setQuestionCount} difficulty={difficulty} setDifficulty={setDifficulty} />}
    {screen === "quiz" && <QuizScreen questions={quizQuestions} classLabel={selectedClass} subjectLabel={curriculumCatalog[selectedClass][selectedSubject].label} difficulty={difficulty} practiceMode={practiceMode} current={current} answer={answers[current]} revealed={revealed} onAnswer={chooseAnswer} onNext={nextQuestion} onBack={() => { if (current === 0) setScreen("setup"); else { setCurrent((v) => v - 1); setRevealed(true); } }} />}
    {screen === "result" && <ResultScreen score={score} total={quizQuestions.length} wrongTopics={wrongTopics} saveState={saveState} onRetry={startQuiz} onFocus={startFocusedPractice} onHome={() => setScreen("setup")} />}
    {screen === "play" && <PlayZone onBack={() => setScreen("setup")} />}
  </main>;
}

function SetupScreen({ onStart, onPlay, attempts, selectedClass, setSelectedClass, selectedSubject, setSelectedSubject, selectedChapter, setSelectedChapter, questionCount, setQuestionCount, difficulty, setDifficulty }: { onStart: () => void; onPlay: () => void; attempts: PracticeAttempt[]; selectedClass: ClassKey; setSelectedClass: (value: ClassKey) => void; selectedSubject: SubjectKey; setSelectedSubject: (value: SubjectKey) => void; selectedChapter: string; setSelectedChapter: (value: string) => void; questionCount: string; setQuestionCount: (value: string) => void; difficulty: Difficulty; setDifficulty: (value: Difficulty) => void }) {
  const catalog = curriculumCatalog[selectedClass][selectedSubject];
  const chapters = [{ value: "all", label: "সব active chapter", count: catalog.questions.length }, ...Array.from(new Map(catalog.questions.map((question) => [question.chapterNo, question])).values()).sort((a, b) => a.chapterNo - b.chapterNo).map((question) => ({ value: String(question.chapterNo), label: question.chapter, count: catalog.questions.filter((item) => item.chapterNo === question.chapterNo).length }))];
  const chapterPool = selectedChapter === "all" ? catalog.questions : catalog.questions.filter((q) => String(q.chapterNo) === selectedChapter);
  const activeCount = chapterPool.filter((q) => getDifficulty(q) === difficulty).length;
  const latestAccuracy = attempts[0] ? Math.round((attempts[0].score / attempts[0].total) * 100) : 0;
  const recentAverage = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total) * 100, 0) / attempts.length) : 0;
  const practiceRhythm = Math.min(attempts.length * 20, 100);
  const practicedToday = attempts.some((attempt) => new Date(attempt.createdAt).toDateString() === new Date().toDateString());
  const learningAreas = [
    { label: "Latest accuracy", value: latestAccuracy, color: "#18a37a" },
    { label: "Recent average", value: recentAverage, color: "#f4b942" },
    { label: "Practice rhythm", value: practiceRhythm, color: "#3b82c4" },
  ];
  return <div className="shell page-pad">
    <section className="welcome-strip"><div><p className="eyebrow">NCTB 2026 • BANGLA MEDIUM</p><h1>Ready, little champion? 🌟</h1><p>আজকের ছোট practice-ই তোমাকে কাল আরও confident করবে।</p></div><div className="streak-pill"><Sparkles size={18} /> Classes 5–8 • 20 subject tracks</div></section>
    <section className={`daily-quest ${practicedToday ? "complete" : ""}`}><span className="quest-icon">{practicedToday ? "🏆" : "🎯"}</span><div><p className="eyebrow">TODAY&apos;S MINI MISSION</p><strong>{practicedToday ? "Mission complete—দারুণ করেছ!" : "Complete one practice and collect Power Stars"}</strong></div><button className="quest-status" onClick={onPlay}><Gamepad2 size={15} /> Brain break</button></section>
    <div className="dashboard-grid">
      <section className="practice-card" id="practice-builder">
        <Heading icon={<BrainCircuit size={22} />} eyebrow="SMART PRACTICE" title="Build your next practice" tone="teal" />
        <div className="class-switch-wrap"><label className="field-label">Choose your class</label><div className="class-switch" role="group" aria-label="Choose class">{(["5", "6", "7", "8"] as ClassKey[]).map((item) => <button key={item} type="button" className={selectedClass === item ? "active" : ""} onClick={() => setSelectedClass(item)} aria-pressed={selectedClass === item}><span>Class</span><strong>{item}</strong>{selectedClass === item && <Star size={14} fill="currentColor" />}</button>)}</div></div>
        <div className="form-grid">
          <Field label="Subject"><Choice value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as SubjectKey)} options={Object.keys(curriculumCatalog[selectedClass])} labels={Object.values(curriculumCatalog[selectedClass]).map((subject) => subject.label)} /></Field>
          <Field label="Chapter"><Choice value={selectedChapter} onValueChange={setSelectedChapter} options={chapters.map((c) => c.value)} labels={chapters.map((c) => `${c.label} (${c.count})`)} /></Field>
          <Field label="Questions"><Choice value={questionCount} onValueChange={setQuestionCount} options={["5", "10", "15", "20", "25", "30", "40", "50", "70"]} suffix=" questions" /></Field>
        </div>
        <div className="coverage-note" key={`${selectedClass}-${selectedSubject}-${difficulty}`}><BookMarked size={18} /><div><strong>Great choice—your practice is ready!</strong><span>{activeCount} {difficultyCopy[difficulty].label.toLowerCase()} questions available • NCTB 2026 Class {selectedClass} {catalog.label}</span></div></div>
        <div className="challenge-block"><label className="field-label">Challenge Level</label><div className="challenge-row">{(["easy", "medium", "hard"] as Difficulty[]).map((level) => <button type="button" key={level} className={difficulty === level ? "selected" : ""} onClick={() => setDifficulty(level)} aria-pressed={difficulty === level}><span>{difficultyCopy[level].label}</span><small>{difficultyCopy[level].hint}</small></button>)}</div></div>
        <Button onClick={onStart} size="lg" className="start-button">Start {Math.min(Number(questionCount), activeCount)}-Question Practice <ArrowRight /></Button>
        <p className="demo-note">Questions are shuffled in every attempt</p>
      </section>
      <aside className="side-column">
        <section className="map-card"><Heading icon={<Compass size={20} />} eyebrow="LEARNING SNAPSHOT" title="Real progress from saved attempts" tone="blue" compact /><div className="learning-list">{learningAreas.map((area) => <div key={area.label}><div className="progress-label"><span>{area.label}</span><strong>{area.value}%</strong></div><div className="track"><span style={{ width: `${area.value}%`, background: area.color }} /></div></div>)}</div><button className="text-button">Based on your latest {attempts.length || 0} practice{attempts.length === 1 ? "" : "s"} <ChevronRight size={17} /></button></section>
        <section className="focus-card"><span className="focus-icon"><Target size={20} /></span><div><p className="eyebrow">SMART NEXT FOCUS</p><h3>{attempts[0]?.focusArea ?? "Start your first practice"}</h3><p>{attempts.length ? "তোমার latest mistakes থেকে next focus automatically selected." : "একটি quiz complete করলেই personalized focus এখানে দেখা যাবে।"}</p></div></section>
        <RecentPractice attempts={attempts} />
      </aside>
    </div>
    <section className="curriculum-section" id="curriculum-map"><div className="curriculum-heading"><div><p className="eyebrow">CLASS 5–8 COVERAGE</p><h2>All four classes are now live</h2></div><span>Classes 5–8 • 283 questions</span></div><div className="coverage-grid">{coverage.map((item) => <article key={item.className} className={item.status === "Live" ? "live" : ""}><div><h3>{item.className}</h3><span>{item.status}</span></div><p>{item.subjects}</p></article>)}</div><p className="roadmap-note">Next: starter banks expand হবে chapter by chapter, answer review ও curriculum alignment বজায় রেখে।</p></section>
    <footer className="creator-card"><span className="creator-icon"><Code2 size={24} /></span><div><p className="eyebrow">BUILT BY A LEARNER, FOR LEARNERS</p><h2>Md. Iftee Raiyan</h2><p>CSE Undergraduate at East West University—exploring software development, problem-solving, and learning by building.</p></div><a href="https://www.linkedin.com/in/md-iftee-raiyan-b20336386/" target="_blank" rel="noreferrer">View LinkedIn <ExternalLink size={16} /></a></footer>
  </div>;
}

function QuizScreen({ questions, classLabel, subjectLabel, difficulty, practiceMode, current, answer, revealed, onAnswer, onNext, onBack }: { questions: ScienceQuestion[]; classLabel: ClassKey; subjectLabel: string; difficulty: Difficulty; practiceMode: "standard" | "focus"; current: number; answer: number | null; revealed: boolean; onAnswer: (i: number) => void; onNext: () => void; onBack: () => void }) {
  const question = questions[current]; const correct = answer === question.answer;
  return <div className="quiz-shell"><div className="quiz-topline"><button className="back-link" onClick={onBack}><ArrowLeft size={18} /> Back</button><span>Class {classLabel} • {subjectLabel} • {practiceMode === "focus" ? "Smart Review" : difficultyCopy[difficulty].label} • NCTB 2026</span></div><Progress value={((current + 1) / questions.length) * 100} className="quiz-progress" /><div className="question-count">Question {current + 1} of {questions.length} <span>•</span> {practiceMode === "focus" ? "Weak-topic review" : difficultyCopy[difficulty].label} <span>•</span> {question.chapter} <span>•</span> {question.topic}</div>
    <section className="question-card"><div className="question-icon"><BookOpen size={24} /></div><h1>{question.prompt}</h1><div className="option-list">{question.options.map((option, index) => { const isCorrect = revealed && index === question.answer; const isWrong = revealed && answer === index && index !== question.answer; return <button key={option} onClick={() => onAnswer(index)} className={`${answer === index ? "chosen" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{isCorrect && <Check size={20} />}</button>; })}</div>
      {revealed && <><div className={`explanation ${correct ? "success" : "review"}`}><Lightbulb size={22} /><div><strong>{correct ? "Correct! +10 Power Stars ⭐" : "Nice try—এবার reasonটা দেখে নাও"}</strong><p>{question.explanation}</p></div></div><div className="origin-card"><BookMarked size={21} /><div><strong>Curriculum Origin</strong><p>{question.origin}</p><a href={question.sourceUrl} target="_blank" rel="noreferrer">Official NCTB textbook listing <ExternalLink size={13} /></a><span>Chapter-aligned • Exact page mapping is under review</span></div></div></>}
      <div className="quiz-actions"><span>{answer === null ? "Choose one answer" : revealed ? "Explanation পড়ে next question-এ যাও" : "Ready? Check your answer"}</span><Button onClick={onNext} disabled={answer === null} size="lg" className="next-button">{revealed ? (current === questions.length - 1 ? "View Result" : "Next Question") : "Check Answer"} <ArrowRight /></Button></div>
    </section></div>;
}

function ResultScreen({ score, total, wrongTopics, saveState, onRetry, onFocus, onHome }: { score: number; total: number; wrongTopics: string[]; saveState: "idle" | "saving" | "saved" | "error"; onRetry: () => void; onFocus: () => void; onHome: () => void }) {
  const percentage = Math.round((score / total) * 100); const nextFocus = wrongTopics[0] ?? "Mixed Revision";
  return <div className="result-shell"><section className="result-hero"><div className="result-ring" style={{ "--score": `${percentage * 3.6}deg` } as React.CSSProperties}><div><strong>{score}/{total}</strong><span>Correct answers</span></div></div><div><p className="eyebrow">QUIZ COMPLETE</p><h1>{percentage >= 80 ? "Star learner! 🌟" : percentage >= 50 ? "Great progress! 🚀" : "Brave try! 💪"}</h1><p>তোমার result analyze করা হয়েছে। এখন strong area আর next focus দেখে smartভাবে এগিয়ে যাও।</p><div className="reward-pill"><Star size={17} fill="currentColor" /> +{score * 10} Power Stars earned</div><div className={`save-status ${saveState}`}>{saveState === "saving" ? "Saving progress…" : saveState === "saved" ? "✓ Progress saved" : saveState === "error" ? "Progress could not be saved" : "Preparing your Learning Map…"}</div></div></section>
    <div className="result-grid"><ResultCard tone="teal" icon={<Check size={22} />} eyebrow="COMPLETED" title={`${score} concepts correct`}>তোমার correct answers Learning Map-এ যোগ হয়েছে।</ResultCard><ResultCard tone="gold" icon={<Target size={22} />} eyebrow="MISTAKE MEMORY" title={nextFocus} attention>{wrongTopics.length ? `${wrongTopics.length}টি concept next practice-এ priority পাবে।` : "No active gap—next round will strengthen retention."}</ResultCard></div>
    <section className="next-step-card"><div><span className="icon-tile blue"><BrainCircuit size={23} /></span><div><p className="eyebrow">SMART NEXT STEP</p><h2>{wrongTopics.length ? `${nextFocus}—Focused Practice` : "Keep your momentum"}</h2><p>{wrongTopics.length ? "Latest mistakes থেকে তৈরি adaptive review" : "No active gap—try another shuffled round"}</p></div></div><Button onClick={wrongTopics.length ? onFocus : onRetry} size="lg" className="start-button compact-button">{wrongTopics.length ? "Fix Weak Topics" : "Practice Again"} <ArrowRight /></Button></section><button className="restart-link" onClick={onHome}><RotateCcw size={17} /> Choose another topic</button></div>;
}

function RecentPractice({ attempts }: { attempts: PracticeAttempt[] }) { return <section className="recent-card" id="recent-history"><div className="recent-heading"><div><p className="eyebrow">RECENT PRACTICE</p><h3>Your saved progress</h3></div><span>{attempts.length}</span></div>{attempts.length === 0 ? <p className="recent-empty">Complete your first quiz—result এখানে automatically save হবে।</p> : <div className="attempt-list">{attempts.slice(0, 3).map((attempt) => <div key={attempt.id}><span className="attempt-score">{attempt.score}/{attempt.total}</span><div><strong>{attempt.subject}</strong><small>{attempt.chapter} • {new Date(attempt.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</small></div></div>)}</div>}</section>; }

function AccountMenu({ attempts, selectedClass, powerStars }: { attempts: PracticeAttempt[]; selectedClass: ClassKey; powerStars: number }) {
  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score / item.total * 100, 0) / attempts.length) : 0;
  return <DropdownMenu><DropdownMenuTrigger asChild><button className="account-trigger" aria-label="Open my learning account"><span className="avatar">IR</span><span className="account-copy"><strong>My Learning</strong><small>{powerStars} ⭐ • Class {selectedClass}</small></span><ChevronRight size={16} /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="account-menu"><DropdownMenuLabel><span className="account-title"><UserRound size={18} /> Learner profile</span><small>Your progress stays connected to this learning space.</small></DropdownMenuLabel><DropdownMenuSeparator /><div className="account-stats"><div><Trophy size={18} /><strong>{attempts.length}</strong><span>Practices</span></div><div><Star size={18} /><strong>{average}%</strong><span>Average</span></div></div><div className="star-bank"><Star size={18} fill="currentColor" /><span><strong>{powerStars}</strong> Power Stars collected</span></div><div className="account-class"><span>Learning now</span><strong>Class {selectedClass} • NCTB 2026</strong></div></DropdownMenuContent></DropdownMenu>;
}
function Heading({ icon, eyebrow, title, tone, compact = false }: { icon: React.ReactNode; eyebrow: string; title: string; tone: string; compact?: boolean }) { return <div className={`section-heading ${compact ? "compact" : ""}`}><span className={`icon-tile ${tone}`}>{icon}</span><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div></div>; }
function ResultCard({ icon, eyebrow, title, tone, attention, children }: { icon: React.ReactNode; eyebrow: string; title: string; tone: string; attention?: boolean; children: React.ReactNode }) { return <section className={`result-card ${attention ? "attention" : ""}`}><span className={`icon-tile ${tone}`}>{icon}</span><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{children}</p></section>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="field-label">{label}</label>{children}</div>; }
function Choice({ value, onValueChange, options, labels, prefix = "", suffix = "" }: { value: string; onValueChange: (value: string) => void; options: string[]; labels?: string[]; prefix?: string; suffix?: string }) { return <Select value={value} onValueChange={onValueChange}><SelectTrigger className="choice-trigger"><SelectValue /></SelectTrigger><SelectContent>{options.map((option, index) => <SelectItem key={option} value={option}>{prefix}{labels?.[index] ?? option}{suffix}</SelectItem>)}</SelectContent></Select>; }
