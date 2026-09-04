"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, Compass, Lightbulb, PartyPopper, Sparkles, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Quest = { title: string; type: string; prompt: string; options: string[]; answer: number; explanation: string; stars: number };

const juniorQuests: Quest[] = [
  { title: "Rhyme & Shine", type: "Complete the rhyme", prompt: "Twinkle, twinkle, little star—How I wonder what you ___", options: ["see", "are", "do", "say"], answer: 1, explanation: "Star ও are—দুটি শব্দের ending sound মিলে যায়।", stars: 10 },
  { title: "শব্দের বন্ধু", type: "Bangla word match", prompt: "‘আলো’ শব্দের সঙ্গে কোন শব্দটি ছন্দ মেলায়?", options: ["ভালো", "আকাশ", "বাতাস", "নদী"], answer: 0, explanation: "আলো ও ভালো—দুটির শেষের ধ্বনি একই রকম।", stars: 10 },
  { title: "Fact or Fake", type: "Quick discovery", prompt: "গাছ নিজের খাদ্য তৈরি করতে সূর্যের আলো ব্যবহার করে।", options: ["Fact", "Fake"], answer: 0, explanation: "সালোকসংশ্লেষণে গাছ সূর্যের আলো ব্যবহার করে খাদ্য তৈরি করে।", stars: 10 },
];

const seniorQuests: Quest[] = [
  { title: "Science Detective", type: "Find the clue", prompt: "বরফ গলে পানি হওয়া কোন ধরনের পরিবর্তন?", options: ["রাসায়নিক", "ভৌত", "জৈব", "স্থায়ী"], answer: 1, explanation: "নতুন পদার্থ তৈরি হয় না, তাই এটি ভৌত পরিবর্তন।", stars: 10 },
  { title: "ভুলটা ধরো", type: "Concept check", prompt: "কোন statement-টি ভুল?", options: ["পৃথিবী সূর্যকে প্রদক্ষিণ করে", "চাঁদ পৃথিবীর উপগ্রহ", "সূর্য পৃথিবীর উপগ্রহ", "পৃথিবীর মাধ্যাকর্ষণ আছে"], answer: 2, explanation: "সূর্য একটি নক্ষত্র; এটি পৃথিবীর উপগ্রহ নয়।", stars: 10 },
  { title: "60-Second Challenge", type: "Math mission", prompt: "15 × 4 − 10 = ?", options: ["40", "50", "60", "70"], answer: 1, explanation: "আগে গুণ: 15 × 4 = 60, এরপর 60 − 10 = 50।", stars: 10 },
];

export function QuestZone({ classKey, profileId, powerStars, onBack, onEarn }: { classKey: "5" | "6" | "7" | "8" | "9" | "10"; profileId: string; powerStars: number; onBack: () => void; onEarn: (stars: number) => void }) {
  const quests = classKey === "5" || classKey === "6" ? juniorQuests : seniorQuests;
  const today = new Date().toLocaleDateString("en-CA");
  const completionKey = `tomar-shikkha-quest-complete-v2:${profileId}:${today}`;
  const [questIndex, setQuestIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [achievementOpen, setAchievementOpen] = useState(false);
  const [completed, setCompleted] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem(completionKey) ?? "[]"); }
    catch { return []; }
  });
  const quest = quests[questIndex];
  const correct = choice === quest.answer;
  const progress = useMemo(() => Math.round((completed.length / quests.length) * 100), [completed.length, quests.length]);
  const dailyComplete = completed.length === quests.length;

  const check = () => {
    if (choice === null || revealed) return;
    setRevealed(true);
    if (choice === quest.answer && !completed.includes(questIndex)) {
      setCompleted((items) => {
        const next = [...items, questIndex];
        window.localStorage.setItem(completionKey, JSON.stringify(next));
        if (next.length === quests.length) window.setTimeout(() => setAchievementOpen(true), 350);
        return next;
      });
      onEarn(quest.stars);
    }
  };
  const next = () => { const nextOpen = quests.findIndex((_, index) => !completed.includes(index)); setQuestIndex(nextOpen >= 0 ? nextOpen : (questIndex + 1) % quests.length); setChoice(null); setRevealed(false); };

  return <div className="shell quest-page">
    <div className="quest-page-top"><button onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরি</button><span><Star size={17} fill="currentColor" /> {powerStars} Power Stars</span></div>
    <section className="quest-hero"><div><p className="eyebrow">CLASS {classKey} • ADAPTIVE FUN</p><h1>TomarShikkha Quest 🧭</h1><p>ছোট challenge, মজার চিন্তা, আর প্রতিটি সঠিক উত্তরে নতুন Stars!</p></div><div className="quest-orbit"><Compass size={34} /><strong>{progress}%</strong><span>Quest শেষ</span></div></section>
    <div className="quest-stepper" aria-label="আজকের Quest progress">{quests.map((item, index) => <button key={item.title} className={`${index === questIndex ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} aria-current={index === questIndex ? "step" : undefined} onClick={() => { const alreadyDone = completed.includes(index); setQuestIndex(index); setChoice(alreadyDone ? item.answer : null); setRevealed(alreadyDone); }}><span>{completed.includes(index) ? <Check size={15} /> : index + 1}</span>{item.title}</button>)}</div>
    {dailyComplete && <section className="daily-quest-done" role="status"><Trophy size={25} /><div><strong>আজকের Quest শেষ! 🏆</strong><p>সব Challenge Token সংগ্রহ হয়েছে। কাল নতুন Daily Quest খুলবে—আজ আবার করার দরকার নেই।</p></div><Button onClick={onBack}>শেখার পাতায় ফিরি</Button></section>}
    <section className="quest-play-card"><div className="quest-badge"><Sparkles size={16} /> {quest.type}</div><h2>{quest.title}</h2><p className="quest-prompt">{quest.prompt}</p><div className="quest-options">{quest.options.map((option, index) => <button key={option} disabled={revealed} aria-pressed={choice === index} className={`${choice === index ? "chosen" : ""} ${revealed && index === quest.answer ? "correct" : ""} ${revealed && choice === index && index !== quest.answer ? "wrong" : ""}`} onClick={() => !revealed && setChoice(index)}><span>{String.fromCharCode(65 + index)}</span>{option}{revealed && index === quest.answer && <Check size={18} />}</button>)}</div>
      {revealed && <div className={`quest-feedback ${correct ? "success" : "try"}`}><Lightbulb /><div><strong>{correct ? `Excellent! +${quest.stars} Stars` : "Good try—clueটি মনে রাখো"}</strong><p>{quest.explanation}</p></div></div>}
      <div className="quest-card-actions"><span>{revealed ? `${completed.length}/${quests.length}টি challenge শেষ` : "একটি উত্তর বেছে নাও"}</span>{revealed ? <Button onClick={next}>পরের Quest</Button> : <Button onClick={check} disabled={choice === null}>উত্তর মিলাই</Button>}</div>
    </section>
    <Dialog open={achievementOpen} onOpenChange={setAchievementOpen}><DialogContent className="achievement-dialog"><div className="achievement-burst"><PartyPopper size={34} /></div><DialogHeader><DialogTitle>Daily Quest Champion! 🏆</DialogTitle><DialogDescription>আজকের তিনটি challenge complete—তুমি curiosity, logic আর focus দিয়ে mission শেষ করেছ!</DialogDescription></DialogHeader><div className="achievement-stars"><Star fill="currentColor" /> +{quests.reduce((sum, item) => sum + item.stars, 0)} Challenge Tokens</div><p>এই achievement আজকের জন্য save হয়েছে। কাল আবার নতুন Quest পাবে।</p><Button onClick={() => { setAchievementOpen(false); onBack(); }}>Achievement সংগ্রহ করি</Button></DialogContent></Dialog>
  </div>;
}
