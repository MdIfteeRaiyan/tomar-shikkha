"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CalendarDays, Check, Clock3, RotateCcw, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

type SubjectPlan = { subject: string; chapters: string[]; priority: number };
const dayNames = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"];

export function StudyRoutine({ classKey, profileId, cloudUserId, subjects, onBack }: { classKey: string; profileId: string; cloudUserId: string | null; subjects: SubjectPlan[]; onBack: () => void }) {
  const [days, setDays] = useState(5);
  const [minutes, setMinutes] = useState(30);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("19:00");
  const [generated, setGenerated] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "device">("idle");
  const storageKey = `tomar-shikkha-routine-v1:${profileId}`;
  useEffect(() => {
    let active = true;
    queueMicrotask(async () => {
      try {
        const local = JSON.parse(window.localStorage.getItem(storageKey) ?? "null");
        if (local && active) { setDays(local.days); setMinutes(local.minutes); setReminderEnabled(local.reminderEnabled); setReminderTime(local.reminderTime); setGenerated(true); setSaveState("device"); }
        if (supabase && cloudUserId) {
          const { data } = await supabase.from("ts_study_routines").select("days_per_week,minutes_per_day,reminder_enabled,reminder_time").eq("profile_id", profileId).maybeSingle();
          if (data && active) { setDays(data.days_per_week); setMinutes(data.minutes_per_day); setReminderEnabled(data.reminder_enabled); setReminderTime(String(data.reminder_time).slice(0,5)); setGenerated(true); setSaveState("saved"); }
        }
      } catch { /* Keep the default routine. */ }
    });
    return () => { active = false; };
  }, [cloudUserId, profileId, storageKey]);
  const routine = useMemo(() => Array.from({ length: days }, (_, index) => {
    const subject = [...subjects].sort((a, b) => b.priority - a.priority)[index % subjects.length];
    const chapter = subject.chapters[Math.floor(index / subjects.length) % subject.chapters.length];
    const practiceMinutes = Math.max(10, minutes - 8);
    return { day: dayNames[index], subject: subject.subject, chapter, learn: practiceMinutes, review: minutes - practiceMinutes };
  }), [days, minutes, subjects]);

  const generateAndSave = async () => {
    setGenerated(true); setSaveState("saving");
    window.localStorage.setItem(storageKey, JSON.stringify({ days, minutes, reminderEnabled, reminderTime }));
    if (supabase && cloudUserId) {
      const { error } = await supabase.from("ts_study_routines").upsert({ user_id: cloudUserId, profile_id: profileId, days_per_week: days, minutes_per_day: minutes, reminder_enabled: reminderEnabled, reminder_time: reminderTime, updated_at: new Date().toISOString() }, { onConflict: "user_id,profile_id" });
      setSaveState(error ? "device" : "saved");
    } else setSaveState("device");
  };

  return <div className="shell routine-page"><div className="tool-page-top"><button onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরি</button><span>Class {classKey} study plan</span></div>
    <section className="tool-hero routine-hero"><div><p className="eyebrow">MY SMART ROUTINE</p><h1>অল্প অল্প করে, নিয়মিত শেখা</h1><p>তোমার class ও practice priority দেখে একটি সহজ weekly routine তৈরি করো।</p></div><CalendarDays size={42} /></section>
    <section className="routine-builder"><div><label>সপ্তাহে কয় দিন?</label><div className="tool-choice">{[3,5,7].map((value) => <button key={value} className={days === value ? "active" : ""} onClick={() => { setDays(value); setGenerated(false); }}>{value} দিন</button>)}</div></div><div><label>প্রতিদিন কত মিনিট?</label><div className="tool-choice">{[20,30,45].map((value) => <button key={value} className={minutes === value ? "active" : ""} onClick={() => { setMinutes(value); setGenerated(false); }}>{value} মিনিট</button>)}</div></div><div className="reminder-setting"><label><input type="checkbox" checked={reminderEnabled} onChange={(event) => setReminderEnabled(event.target.checked)} /> Study reminder</label><input type="time" value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} disabled={!reminderEnabled} aria-label="Reminder time" /></div><button className="generate-routine" onClick={() => void generateAndSave()}><Sparkles size={18} /> আমার Routine তৈরি করো</button></section>
    {generated ? <><section className="routine-summary"><Check size={21} /><div><strong>{days} দিনের balanced routine ready!</strong><p>কঠিন বিষয় আগে, প্রতিদিন শেষে ছোট revision রাখা হয়েছে। {saveState === "saved" ? "Cloud-এ saved।" : saveState === "device" ? "এই device-এ saved।" : "Save হচ্ছে…"}</p></div></section><div className="routine-grid">{routine.map((item, index) => <article key={item.day}><div className="routine-day"><span>{index + 1}</span><strong>{item.day}</strong></div><h2>{item.subject}</h2><p><BookOpen size={15} /> {item.chapter}</p><div><span><Clock3 size={14} /> {item.learn} মিনিট practice</span><span><RotateCcw size={14} /> {item.review} মিনিট review</span></div></article>)}</div><p className="routine-tip">{reminderEnabled ? `Reminder time: ${reminderTime} • ` : ""}Tip: কোনো দিন miss হলে দুশ্চিন্তা নয়—পরের দিন থেকে আবার শুরু করো। Routine সাহায্য করার জন্য, চাপ দেওয়ার জন্য নয়।</p></> : <section className="routine-empty"><CalendarDays size={32} /><strong>তোমার সময় বেছে নাও</strong><p>তারপর এক click-এ manageable routine পাবে।</p></section>}
  </div>;
}
