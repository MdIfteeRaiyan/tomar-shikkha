"use client";

import { useEffect, useState } from "react";
import { Lightbulb, RefreshCw, X } from "lucide-react";

const facts = [
  { emoji: "🐙", text: "Octopus-এর তিনটি heart থাকে—দুটি gill-এ রক্ত পাঠায়, আর একটি পুরো শরীরে।" },
  { emoji: "☀️", text: "সূর্যের আলো পৃথিবীতে পৌঁছাতে প্রায় ৮ মিনিট ২০ সেকেন্ড সময় নেয়।" },
  { emoji: "🌍", text: "পৃথিবীর পৃষ্ঠের প্রায় ৭১% পানি দিয়ে ঢাকা।" },
  { emoji: "🐋", text: "Blue whale পৃথিবীতে জানা সবচেয়ে বড় প্রাণী।" },
  { emoji: "🪐", text: "Venus-এ একদিন শেষ হতে তার এক বছরের চেয়েও বেশি সময় লাগে।" },
  { emoji: "🐝", text: "মৌমাছি নাচের মাধ্যমে অন্য মৌমাছিকে খাবারের দিক ও দূরত্ব জানায়।" },
  { emoji: "🦴", text: "একজন পূর্ণবয়স্ক মানুষের শরীরে সাধারণত ২০৬টি হাড় থাকে।" },
  { emoji: "🏜️", text: "Antarctica বরফে ঢাকা হলেও বৃষ্টিপাত খুব কম, তাই এটি পৃথিবীর সবচেয়ে বড় desert।" },
  { emoji: "🌊", text: "শব্দ বাতাসের তুলনায় পানির মধ্যে অনেক দ্রুত চলতে পারে।" },
  { emoji: "🌙", text: "চাঁদের নিজের আলো নেই—সে সূর্যের আলো reflect করে উজ্জ্বল দেখায়।" },
  { emoji: "🦒", text: "মানুষ ও giraffe—দুজনের ঘাড়েই সাধারণত ৭টি vertebra থাকে।" },
  { emoji: "🌱", text: "গাছের পাতার chlorophyll সূর্যের আলো ধরে খাবার তৈরিতে সাহায্য করে।" },
];

export function CuriosityPop({ enabled }: { enabled: boolean }) {
  const [visible, setVisible] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!enabled || visible) return;
    const delay = round === 0 ? 120_000 : 300_000;
    const timer = window.setTimeout(() => {
      setFactIndex(Math.floor(Math.random() * facts.length));
      setVisible(true);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [enabled, round, visible]);

  if (!enabled || !visible) return null;
  const fact = facts[factIndex];
  const showAnother = () => {
    setFactIndex((current) => (current + 1 + Math.floor(Math.random() * (facts.length - 1))) % facts.length);
  };
  const dismiss = () => { setVisible(false); setRound((current) => current + 1); };

  return <aside className="curiosity-pop" role="status" aria-live="polite"><button className="curiosity-close" onClick={dismiss} aria-label="Close fun fact"><X size={17} /></button><span className="curiosity-emoji">{fact.emoji}</span><div><p><Lightbulb size={15} /> ২ মিনিটের Curiosity Pop</p><strong>জানো কি?</strong><span>{fact.text}</span><button className="curiosity-next" onClick={showAnother}><RefreshCw size={14} /> আরেকটি fact</button></div></aside>;
}
