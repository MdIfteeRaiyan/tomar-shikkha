"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, Compass, Lightbulb, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function QuestZone({ classKey, profileId, powerStars, onBack, onEarn }: { classKey: "5" | "6" | "7" | "8"; profileId: string; powerStars: number; onBack: () => void; onEarn: (stars: number) => void }) {
  const quests = classKey === "5" || classKey === "6" ? juniorQuests : seniorQuests;
  const [questIndex, setQuestIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem(`tomar-shikkha-quest-complete-v1:${profileId}`) ?? "[]"); }
    catch { return []; }
  });
  const quest = quests[questIndex];
  const correct = choice === quest.answer;
  const progress = useMemo(() => Math.round((completed.length / quests.length) * 100), [completed.length, quests.length]);

  const check = () => {
    if (choice === null || revealed) return;
    setRevealed(true);
    if (choice === quest.answer && !completed.includes(questIndex)) {
      setCompleted((items) => {
        const next = [...items, questIndex];
        window.localStorage.setItem(`tomar-shikkha-quest-complete-v1:${profileId}`, JSON.stringify(next));
        return next;
      });
      onEarn(quest.stars);
    }
  };
  const next = () => { setQuestIndex((value) => (value + 1) % quests.length); setChoice(null); setRevealed(false); };

  return <div className="shell quest-page">
    <div className="quest-page-top"><button onClick={onBack}><ArrowLeft size={18} /> Home</button><span><Star size={17} fill="currentColor" /> {powerStars} Power Stars</span></div>
    <section className="quest-hero"><div><p className="eyebrow">CLASS {classKey} • ADAPTIVE FUN</p><h1>TomarShikkha Quest 🧭</h1><p>ছোট challenge, smart thinking, আর প্রতিটি সঠিক উত্তরে নতুন Stars!</p></div><div className="quest-orbit"><Compass size={34} /><strong>{progress}%</strong><span>Quest complete</span></div></section>
    <div className="quest-stepper">{quests.map((item, index) => <button key={item.title} className={`${index === questIndex ? "active" : ""} ${completed.includes(index) ? "done" : ""}`} onClick={() => { setQuestIndex(index); setChoice(null); setRevealed(false); }}><span>{completed.includes(index) ? <Check size={15} /> : index + 1}</span>{item.title}</button>)}</div>
    <section className="quest-play-card"><div className="quest-badge"><Sparkles size={16} /> {quest.type}</div><h2>{quest.title}</h2><p className="quest-prompt">{quest.prompt}</p><div className="quest-options">{quest.options.map((option, index) => <button key={option} className={`${choice === index ? "chosen" : ""} ${revealed && index === quest.answer ? "correct" : ""} ${revealed && choice === index && index !== quest.answer ? "wrong" : ""}`} onClick={() => !revealed && setChoice(index)}><span>{String.fromCharCode(65 + index)}</span>{option}{revealed && index === quest.answer && <Check size={18} />}</button>)}</div>
      {revealed && <div className={`quest-feedback ${correct ? "success" : "try"}`}><Lightbulb /><div><strong>{correct ? `Excellent! +${quest.stars} Stars` : "Good try—clueটি মনে রাখো"}</strong><p>{quest.explanation}</p></div></div>}
      <div className="quest-card-actions"><span>{revealed ? `${completed.length}/${quests.length} challenge complete` : "একটি answer বেছে নাও"}</span>{revealed ? <Button onClick={next}>Next Quest</Button> : <Button onClick={check} disabled={choice === null}>Check Answer</Button>}</div>
    </section>
  </div>;
}
