"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "tomar-shikkha-site-feedback-v1";

export default function FeedbackPage() {
  const [category, setCategory] = useState("idea");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const submit = async () => {
    const clean = message.trim(); if (clean.length < 10) return;
    setState("saving");
    try {
      const item = { category, message: clean, createdAt: Date.now() };
      const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...existing].slice(0, 20)));
      if (supabase) {
        const { data } = await supabase.auth.getUser();
        if (data.user) { const { error } = await supabase.from("ts_site_feedback").insert({ user_id: data.user.id, category, message: clean }); if (error) throw error; }
      }
      setMessage(""); setState("saved");
    } catch { setState("error"); }
  };
  return <main className="info-page"><div className="info-top"><Link href="/">← TomarShikkha</Link><span>শিক্ষার্থী ও guardian feedback</span></div><article className="info-card"><p className="eyebrow">HELP US LEARN TOO</p><h1>কীভাবে আরও ভালো করা যায়?</h1><p>তোমার idea, কোনো confusing অংশ বা accessibility problem সংক্ষেপে বলো। Question-specific ভুল হলে practice-এর “প্রশ্নে সমস্যা?” button ব্যবহার করলে দ্রুত খুঁজে পাওয়া যায়।</p>
    <div className="feedback-form"><label>Feedback type<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="idea">নতুন idea</option><option value="problem">Site ব্যবহার করতে সমস্যা</option><option value="guardian">Guardian suggestion</option><option value="accessibility">Accessibility বা readability</option></select></label><label>তোমার কথা<textarea value={message} onChange={(event) => { setMessage(event.target.value.slice(0, 1000)); setState("idle"); }} placeholder="কোন জায়গায় কী পরিবর্তন করলে ভালো হবে? Personal information লিখবে না।" /></label>{state === "saved" && <div className="feedback-status" role="status">ধন্যবাদ! Feedback এই device-এ save হয়েছে{!supabase ? "." : "; guardian sign in থাকলে review queue-তেও গেছে।"}</div>}{state === "error" && <div className="feedback-status" role="alert">Feedback device-এ আছে, কিন্তু cloud-এ পাঠানো যায়নি। পরে আবার চেষ্টা করুন।</div>}<button onClick={() => void submit()} disabled={message.trim().length < 10 || state === "saving"}>{state === "saving" ? "Save হচ্ছে…" : "Feedback পাঠাই"}</button><p className="feedback-note">কমপক্ষে ১০ অক্ষর • সর্বোচ্চ ১০০০ অক্ষর</p></div>
    <p className="feedback-alt">Project creator: <a href="https://www.linkedin.com/in/md-iftee-raiyan-b20336386/" target="_blank" rel="noreferrer">Md. Iftee Raiyan • EWU CSE</a></p>
  </article></main>;
}
