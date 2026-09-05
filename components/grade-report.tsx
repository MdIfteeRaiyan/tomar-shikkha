"use client";

import { ArrowLeft, BarChart3, BookOpen, CalendarClock, CheckCircle2, GraduationCap, Target } from "lucide-react";

type Attempt = { subject: string; chapter: string; score: number; total: number; focusArea: string; createdAt: number };

export function GradeReport({ attempts, onBack }: { attempts: Attempt[]; onBack: () => void }) {
  const recent = attempts.slice(0, 10);
  const average = recent.length ? Math.round(recent.reduce((sum, item) => sum + item.score / item.total * 100, 0) / recent.length) : 0;
  const grade = average >= 90 ? "A+" : average >= 80 ? "A" : average >= 70 ? "B" : average >= 60 ? "C" : average >= 50 ? "D" : recent.length ? "Keep Going" : "—";
  const grouped = new Map<string, { total: number; count: number; latest: number; focus: string }>();
  for (const attempt of recent) { const item = grouped.get(attempt.subject) ?? { total: 0, count: 0, latest: 0, focus: attempt.focusArea }; item.total += attempt.score / attempt.total * 100; item.count += 1; if (attempt.createdAt > item.latest) { item.latest = attempt.createdAt; item.focus = attempt.focusArea; } grouped.set(attempt.subject, item); }
  const subjects = [...grouped.entries()].map(([subject, item]) => ({ subject, average: Math.round(item.total / item.count), focus: item.focus })).sort((a, b) => a.average - b.average);
  const priority = subjects[0];
  const practicedDays = new Set(recent.map((item) => new Date(item.createdAt).toDateString())).size;

  return <div className="shell report-page"><div className="tool-page-top"><button onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরি</button><span>সর্বশেষ {recent.length}টি practice</span></div>
    <section className="tool-hero report-hero"><div><p className="eyebrow">আমার শেখার রিপোর্ট</p><h1>Score নয়, কোথায় এগোবে সেটাই আসল</h1><p>সাম্প্রতিক practice দেখে তোমার ভালো দিক, next focus ও reminder জানো।</p></div><GraduationCap size={44} /></section>
    {!recent.length ? <section className="report-empty"><BookOpen size={34} /><h2>Report তৈরির জন্য practice দরকার</h2><p>প্রথম ৫–৭টি প্রশ্নের Mission শেষ করলেই তোমার analysis এখানে দেখা যাবে।</p><button onClick={onBack}>প্রথম practice শুরু করি</button></section> : <><div className="report-overview"><article><BarChart3 /><span>সাম্প্রতিক average</span><strong>{average}%</strong></article><article><GraduationCap /><span>Practice grade</span><strong>{grade}</strong></article><article><CalendarClock /><span>Practice-এর দিন</span><strong>{practicedDays}</strong></article></div>
      <section className={`practice-reminder ${priority && priority.average < 70 ? "important" : "steady"}`}><Target size={25} /><div><p className="eyebrow">পরের PRACTICE REMINDER</p><h2>{priority && priority.average < 70 ? `${priority.subject}-এ practice এখন গুরুত্বপূর্ণ` : "ভালো rhythm—revision চালিয়ে যাও"}</h2><p>{priority && priority.average < 70 ? `${priority.focus === "Revision Complete" ? priority.subject : priority.focus} topic-এ ৫–১০টি প্রশ্ন practice করো। Explanation পড়ে ভুলটি বুঝে নিলে score দ্রুত বাড়বে।` : "আগে শেখা chapter মনে রাখতে এই সপ্তাহে একটি ছোট mixed review করো।"}</p></div></section>
      <section className="subject-report"><div className="report-section-title"><div><p className="eyebrow">SUBJECT ANALYSIS</p><h2>কোন বিষয়ে কতটা confidence?</h2></div><span>{subjects.length} subjects practiced</span></div><div>{subjects.map((item) => <article key={item.subject}><div><strong>{item.subject}</strong><span>{item.average < 60 ? "আরও practice" : item.average < 80 ? "এগোচ্ছো" : "Strong"}</span></div><div className="report-track"><span style={{ width: `${item.average}%` }} /></div><b>{item.average}%</b></article>)}</div></section>
      <section className="report-note"><CheckCircle2 size={20} /><p>এই grade কোনো school exam result নয়—এটি শুধু তোমার সাম্প্রতিক TomarShikkha practice থেকে পাওয়া শেখার signal।</p></section></>}
  </div>;
}
