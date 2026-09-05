"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CalendarDays, Check, Clock3, Download, Printer, RotateCcw, Sparkles } from "lucide-react";
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
  const downloadRoutine = () => {
    const safe = (value: string | number) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
    const cards = routine.map((item, index) => `<article><div class="day"><b>${index + 1}</b><span>${safe(item.day)}</span></div><h2>${safe(item.subject)}</h2><p>📖 ${safe(item.chapter)}</p><small>⏱ ${item.learn} মিনিট practice &nbsp; • &nbsp; 🔁 ${item.review} মিনিট review</small></article>`).join("");
    const html = `<!doctype html><html lang="bn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>আমার TomarShikkha Routine</title><style>*{box-sizing:border-box}body{margin:0;padding:36px;background:#eef9f6;color:#173c4c;font-family:Arial,'Noto Sans Bengali',sans-serif}.sheet{max-width:850px;margin:auto;padding:34px;border:2px solid #9bd7c6;border-radius:28px;background:#fff;box-shadow:0 18px 45px #164d3d18}.top{display:flex;justify-content:space-between;gap:20px;padding-bottom:20px;border-bottom:2px dashed #cce9e1}.brand{color:#08795d;font-size:14px;font-weight:800;letter-spacing:2px}.top h1{margin:7px 0;color:#123b5d;font-size:32px}.badge{height:max-content;padding:10px 14px;border-radius:99px;background:#fff1b8;color:#815b09;font-weight:700}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px;margin-top:22px}article{padding:18px;border:1px solid #d7e9e5;border-radius:18px;background:linear-gradient(145deg,#fff,#f5fbf9)}.day{display:flex;align-items:center;gap:9px;color:#08795d}.day b{display:grid;place-items:center;width:28px;height:28px;border-radius:9px;background:#dff5ed}h2{margin:13px 0 7px;font-size:20px}p{margin:0 0 12px;color:#57717a;line-height:1.5}small{color:#6e858c}.tip{margin-top:20px;padding:14px;border-radius:14px;background:#fff7d8;color:#765c18;text-align:center}.footer{margin-top:18px;text-align:center;color:#789098;font-size:12px}@media(max-width:600px){body{padding:12px}.sheet{padding:20px}.grid{grid-template-columns:1fr}.top{display:block}.badge{display:inline-block;margin-top:8px}}@media print{body{padding:0;background:#fff}.sheet{box-shadow:none;max-width:none}}</style></head><body><main class="sheet"><header class="top"><div><div class="brand">TOMARSHIKKHA</div><h1>আমার Smart Study Routine</h1><span>Class ${safe(classKey)} • ${days} দিন • প্রতিদিন ${minutes} মিনিট</span></div><div class="badge">✨ শেখো • খেলো • এগিয়ে চলো</div></header><section class="grid">${cards}</section><div class="tip">${reminderEnabled ? `⏰ Reminder: ${safe(reminderTime)} • ` : ""}কোনো দিন miss হলে চাপ নয়—পরের দিন থেকে আবার শুরু করো।</div><footer class="footer">Made with TomarShikkha • Md. Iftee Raiyan, EWU CSE</footer></main></body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `TomarShikkha-Class-${classKey}-Routine.html`; anchor.click(); URL.revokeObjectURL(url);
  };

  return <div className="shell routine-page"><div className="tool-page-top"><button onClick={onBack}><ArrowLeft size={18} /> শেখার পাতায় ফিরি</button><span>Class {classKey} study plan</span></div>
    <section className="tool-hero routine-hero"><div><p className="eyebrow">MY SMART ROUTINE</p><h1>অল্প অল্প করে, নিয়মিত শেখা</h1><p>তোমার class ও practice priority দেখে একটি সহজ weekly routine তৈরি করো।</p></div><CalendarDays size={42} /></section>
    <section className="routine-builder"><div><label>সপ্তাহে কয় দিন?</label><div className="tool-choice">{[3,5,7].map((value) => <button key={value} className={days === value ? "active" : ""} onClick={() => { setDays(value); setGenerated(false); }}>{value} দিন</button>)}</div></div><div><label>প্রতিদিন কত মিনিট?</label><div className="tool-choice">{[20,30,45].map((value) => <button key={value} className={minutes === value ? "active" : ""} onClick={() => { setMinutes(value); setGenerated(false); }}>{value} মিনিট</button>)}</div></div><div className="reminder-setting"><label><input type="checkbox" checked={reminderEnabled} onChange={(event) => setReminderEnabled(event.target.checked)} /> Study reminder</label><input type="time" value={reminderTime} onChange={(event) => setReminderTime(event.target.value)} disabled={!reminderEnabled} aria-label="Reminder time" /></div><button className="generate-routine" onClick={() => void generateAndSave()}><Sparkles size={18} /> আমার Routine তৈরি করো</button></section>
    {generated ? <><section className="routine-summary"><Check size={21} /><div><strong>{days} দিনের balanced routine ready!</strong><p>কঠিন বিষয় আগে, প্রতিদিন শেষে ছোট revision রাখা হয়েছে। {saveState === "saved" ? "Cloud-এ saved।" : saveState === "device" ? "এই device-এ saved।" : "Save হচ্ছে…"}</p></div><div className="routine-export"><button onClick={downloadRoutine}><Download size={17} /> Download</button><button onClick={() => window.print()}><Printer size={17} /> Print / PDF</button></div></section><div className="routine-grid">{routine.map((item, index) => <article key={item.day}><div className="routine-day"><span>{index + 1}</span><strong>{item.day}</strong></div><h2>{item.subject}</h2><p><BookOpen size={15} /> {item.chapter}</p><div><span><Clock3 size={14} /> {item.learn} মিনিট practice</span><span><RotateCcw size={14} /> {item.review} মিনিট review</span></div></article>)}</div><p className="routine-tip">{reminderEnabled ? `Reminder time: ${reminderTime} • ` : ""}Tip: কোনো দিন miss হলে দুশ্চিন্তা নয়—পরের দিন থেকে আবার শুরু করো। Routine সাহায্য করার জন্য, চাপ দেওয়ার জন্য নয়।</p></> : <section className="routine-empty"><CalendarDays size={32} /><strong>তোমার সময় বেছে নাও</strong><p>তারপর এক click-এ manageable routine পাবে।</p></section>}
  </div>;
}
